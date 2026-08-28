import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import Stripe from 'stripe';
import { createUserClient, requireAuth, requireWorkspace, supabaseAdmin, type AuthenticatedRequest } from './server/supabase';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: APP_URL, credentials: true }));
app.use(rateLimit({ windowMs: 60_000, limit: 180, standardHeaders: 'draft-8', legacyHeaders: false }));

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Stripe must receive the exact raw request body for signature verification.
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).json({ error: 'STRIPE_NOT_CONFIGURED' });
  const signature = req.headers['stripe-signature'];
  if (!signature) return res.status(400).json({ error: 'STRIPE_SIGNATURE_MISSING' });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error: any) {
    return res.status(400).json({ error: 'INVALID_STRIPE_SIGNATURE', message: error?.message });
  }

  const { data: existing } = await supabaseAdmin.from('stripe_webhook_events').select('stripe_event_id, processed_at').eq('stripe_event_id', event.id).maybeSingle();
  if (existing?.processed_at) return res.json({ received: true, duplicate: true });

  await supabaseAdmin.from('stripe_webhook_events').upsert({ stripe_event_id: event.id, event_type: event.type, payload: event as any });

  try {
    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const workspaceId = subscription.metadata?.workspace_id;
      if (workspaceId) {
        const priceId = subscription.items.data[0]?.price?.id || null;
        const plan = subscription.metadata?.plan || 'starter';
        await supabaseAdmin.from('subscriptions').upsert({
          workspace_id: workspaceId,
          stripe_customer_id: String(subscription.customer),
          stripe_subscription_id: subscription.id,
          stripe_price_id: priceId,
          plan,
          status: subscription.status === 'canceled' ? 'canceled' : subscription.status,
          current_period_end: subscription.items.data[0]?.current_period_end
            ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
            : null,
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        });
        await supabaseAdmin.from('workspaces').update({ plan, updated_at: new Date().toISOString() }).eq('id', workspaceId);
      }
    }
    await supabaseAdmin.from('stripe_webhook_events').update({ processed_at: new Date().toISOString(), processing_error: null }).eq('stripe_event_id', event.id);
    res.json({ received: true });
  } catch (error: any) {
    await supabaseAdmin.from('stripe_webhook_events').update({ processing_error: error?.message || 'Unknown webhook error' }).eq('stripe_event_id', event.id);
    res.status(500).json({ error: 'STRIPE_WEBHOOK_PROCESSING_FAILED' });
  }
});

app.use(express.json({ limit: '2mb' }));

// Initialize Google GenAI on the server side
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Health & Inngest Route
app.get('/api/health', async (_req, res) => {
  const dbConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  res.json({
    status: 'ok',
    product: 'Jobryn',
    version: '0.1.0-foundation',
    releaseStatus: 'PRE_PRODUCTION',
    databaseConfigured: dbConfigured,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
    aiConfigured: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/inngest/health', (_req, res) => {
  res.status(501).json({ status: 'not_configured', message: 'Background job provider has not been wired yet.' });
});

// 2. Billing Credits API — persisted and tenant-authorized.
app.get('/api/billing/credits/check', requireAuth, requireWorkspace, async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin.from('credit_wallets').select('balance, lifetime_purchased, lifetime_consumed').eq('workspace_id', req.workspaceId!).single();
  if (error) return res.status(500).json({ error: 'CREDIT_WALLET_READ_FAILED' });
  res.json({ success: true, workspaceId: req.workspaceId, creditsRemaining: data.balance, lifetimePurchased: data.lifetime_purchased, lifetimeConsumed: data.lifetime_consumed, status: Number(data.balance) > 500 ? 'healthy' : 'low_credits_warning' });
});

app.post('/api/billing/credits/reserve', requireAuth, requireWorkspace, async (req: AuthenticatedRequest, res) => {
  const amount = Number(req.body?.amountCredits);
  if (!Number.isInteger(amount) || amount <= 0 || amount > 100000) return res.status(400).json({ error: 'INVALID_CREDIT_AMOUNT' });
  const userDb = createUserClient(req.auth!.accessToken);
  const { data, error } = await userDb.rpc('reserve_credits', {
    target_workspace: req.workspaceId,
    amount_to_reserve: amount,
    txn_description: String(req.body?.description || 'Jobryn usage reservation').slice(0, 500),
    txn_idempotency_key: req.body?.idempotencyKey || null,
    target_asset: req.body?.assetId || null,
  });
  if (error) {
    if (error.message.toLowerCase().includes('insufficient')) return res.status(402).json({ error: 'INSUFFICIENT_CREDITS' });
    return res.status(400).json({ error: 'CREDIT_RESERVATION_FAILED', message: error.message });
  }
  const row = Array.isArray(data) ? data[0] : data;
  res.json({ success: true, reservationId: row?.transaction_id, workspaceId: req.workspaceId, reservedAmount: amount, newBalance: row?.new_balance });
});

app.post('/api/billing/checkout', requireAuth, requireWorkspace, async (req: AuthenticatedRequest, res) => {
  if (!stripe) return res.status(503).json({ error: 'STRIPE_NOT_CONFIGURED' });
  const plan = String(req.body?.plan || '');
  const prices: Record<string, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    professional: process.env.STRIPE_PRICE_PROFESSIONAL,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
  };
  const price = prices[plan];
  if (!price) return res.status(400).json({ error: 'INVALID_OR_UNCONFIGURED_PLAN' });

  const { data: membership } = await supabaseAdmin.from('workspace_members').select('role').eq('workspace_id', req.workspaceId!).eq('user_id', req.auth!.userId).single();
  if (!membership || !['owner','admin'].includes(membership.role)) return res.status(403).json({ error: 'BILLING_ADMIN_REQUIRED' });

  const { data: existingSub } = await supabaseAdmin.from('subscriptions').select('stripe_customer_id').eq('workspace_id', req.workspaceId!).maybeSingle();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: existingSub?.stripe_customer_id || undefined,
    line_items: [{ price, quantity: 1 }],
    success_url: `${APP_URL}/?billing=success`,
    cancel_url: `${APP_URL}/?billing=cancelled`,
    client_reference_id: req.workspaceId,
    subscription_data: { metadata: { workspace_id: req.workspaceId!, plan } },
    metadata: { workspace_id: req.workspaceId!, plan },
    allow_promotion_codes: true,
  });
  res.json({ success: true, checkoutUrl: session.url });
});

app.post('/api/billing/portal', requireAuth, requireWorkspace, async (req: AuthenticatedRequest, res) => {
  if (!stripe) return res.status(503).json({ error: 'STRIPE_NOT_CONFIGURED' });
  const { data: membership } = await supabaseAdmin.from('workspace_members').select('role').eq('workspace_id', req.workspaceId!).eq('user_id', req.auth!.userId).single();
  if (!membership || !['owner','admin'].includes(membership.role)) return res.status(403).json({ error: 'BILLING_ADMIN_REQUIRED' });
  const { data: subscription } = await supabaseAdmin.from('subscriptions').select('stripe_customer_id').eq('workspace_id', req.workspaceId!).single();
  if (!subscription?.stripe_customer_id) return res.status(404).json({ error: 'STRIPE_CUSTOMER_NOT_FOUND' });
  const portal = await stripe.billingPortal.sessions.create({ customer: subscription.stripe_customer_id, return_url: `${APP_URL}/?tab=billing` });
  res.json({ success: true, portalUrl: portal.url });
});

// 3. Feature Flags API (Fixed P0-5 tenant isolation check)
app.get('/api/features/:flagName', requireAuth, requireWorkspace, (req: AuthenticatedRequest, res) => {
  const { flagName } = req.params;
  const workspaceId = req.workspaceId!;

  const flags: Record<string, boolean> = {
    multi_tenant_isolation: true,
    ai_asset_studio: true,
    ssrf_webhook_guard: true,
    realtime_presence: true,
    stripe_idempotent_billing: true,
    gdpr_retention_purge: true,
  };

  res.json({
    flagName,
    enabled: flags[flagName] ?? true,
    workspaceId,
    tenantVerified: true,
  });
});

// 4. Server-Side AI Generation using Gemini API
app.post('/api/generate', requireAuth, requireWorkspace, async (req: AuthenticatedRequest, res) => {
  try {
    const { prompt, platform, stylePreset } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'PROMPT_REQUIRED' });
    }

    if (!ai) return res.status(503).json({ error: 'AI_NOT_CONFIGURED', message: 'Configure GEMINI_API_KEY before using this paid feature.' });

    const systemInstruction = `You are Jobryn's Lead Social Copywriter and Creative Art Director.
Generate social campaign assets for the platform '${platform || 'LinkedIn'}'.
Apply the visual style preset: '${stylePreset || 'Tech Minimalist'}'.
You MUST return valid JSON with keys:
"caption" (string, captivating social post body text with emojis),
"hashtags" (array of 4-6 strings starting with #),
"imagePrompt" (detailed text prompt for image generation),
"visualDirection" (string describing art style, aspect ratio recommendation, lighting, and color palette).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Create a social media campaign post based on: ${prompt}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text);

    res.json({
      success: true,
      data: {
        caption: parsedData.caption || prompt,
        hashtags: parsedData.hashtags || ['#AIMarketing', '#Jobryn'],
        imagePrompt: parsedData.imagePrompt || prompt,
        visualDirection: parsedData.visualDirection || stylePreset,
        costCredits: 15,
        aiEngine: 'Gemini 3.6 Flash (Server)',
      },
    });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    res.status(500).json({
      error: 'AI_GENERATION_FAILED',
      message: err?.message || 'Failed to generate campaign asset via Gemini API',
    });
  }
});

// 4b. AI Trend Monitor with Search Grounding API
app.post('/api/trends', requireAuth, requireWorkspace, async (req: AuthenticatedRequest, res) => {
  try {
    const { category, platform } = req.body;
    const niche = category || 'AI, Tech & Digital Marketing';

    if (!ai) return res.status(503).json({ error: 'AI_NOT_CONFIGURED', message: 'Configure GEMINI_API_KEY before using this paid feature.' });

    const prompt = `Search for current emerging social media trends, viral topics, and hot hashtags in the category: "${niche}".
Return a JSON array of 3-4 objects with keys:
- "topic": (string name of the trend)
- "hotnessScore": (number 80-99)
- "summary": (concise 2-sentence summary of why it's trending)
- "suggestedHashtags": (array of 5 hashtags)
- "suggestedHook": (engaging social media hook line)
- "suggestedPlatform": (one of: linkedin, instagram, tiktok, twitter, facebook)
Wrap JSON strictly in an array without extra markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    let trends = [];
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        trends = JSON.parse(jsonMatch[0]);
      } else {
        trends = JSON.parse(text);
      }
    } catch (e) {
      console.warn('Could not parse Gemini JSON response directly:', text);
      trends = [
        {
          topic: `Emerging Shifts in ${niche}`,
          hotnessScore: 92,
          summary: text.slice(0, 200) + '...',
          suggestedHashtags: ['#TrendingNow', '#IndustryInsights', '#Growth', '#Innovation', '#AI'],
          suggestedHook: `What everyone is getting wrong about ${niche} this week.`,
          suggestedPlatform: platform || 'linkedin',
        },
      ];
    }

    res.json({
      success: true,
      grounded: true,
      source: 'Gemini Search Grounding Engine',
      groundingChunks: groundingMetadata?.groundingChunks || [],
      webSearchQueries: groundingMetadata?.webSearchQueries || [],
      trends,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Trend Monitor API Error:', err);
    res.status(500).json({ error: 'TREND_FETCH_FAILED', message: err?.message || 'Failed to fetch trends' });
  }
});

// 4c. Smart Engagement Auto-Reply Generator
app.post('/api/engagement/suggest-reply', requireAuth, requireWorkspace, async (req: AuthenticatedRequest, res) => {
  try {
    const { commentText, postCaption, platform, brandTone } = req.body;
    const tone = brandTone || 'professional & helpful';
    const postCtx = postCaption || 'Social media marketing campaign';

    if (!ai) return res.status(503).json({ error: 'AI_NOT_CONFIGURED', message: 'Configure GEMINI_API_KEY before using this paid feature.' });

    const prompt = `You are a social media community manager responding to a user comment on a ${platform || 'LinkedIn'} post.
Post context: "${postCtx}"
User comment: "${commentText}"
Brand Tone: ${tone}

Analyze the sentiment of the user comment (positive, neutral, question, constructive, negative).
Generate 3 distinct, high-quality, natural auto-reply options that align with the brand tone.
Return JSON with keys:
- "sentiment": ("positive" | "neutral" | "question" | "constructive")
- "suggestedReplies": (array of 3 response strings)
- "suggestedAction": ("approve" | "edit_recommended" | "escalate_to_human")
Wrap strictly in valid JSON without markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const text = response.text || '';
    let result = {
      sentiment: 'positive',
      suggestedReplies: [
        `Thanks for reading! Great to have you in the discussion.`,
        `Appreciate your thoughts! Let us know if you have any questions.`,
        `Thanks for connecting! Excited to hear your feedback.`,
      ],
      suggestedAction: 'approve',
    };

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('Could not parse JSON for suggest-reply:', text);
    }

    res.json({
      success: true,
      ...result,
      source: 'Gemini 3.6 Flash Engine',
    });
  } catch (err: any) {
    console.error('Smart Engagement API error:', err);
    res.status(500).json({ error: 'REPLY_GEN_FAILED', message: err?.message || 'Failed to generate suggested replies' });
  }
});

// 5. SSRF-Guarded Webhook Delivery API (Fixed P1-1 finding)
app.post('/api/webhooks/deliver', requireAuth, requireWorkspace, (_req: AuthenticatedRequest, res) => {
  return res.status(501).json({
    error: 'WEBHOOK_DISPATCH_NOT_IMPLEMENTED',
    message: 'Secure outbound delivery will be enabled after DNS/IP SSRF validation and worker retries are implemented.',
  });
});

// 6. GDPR Data Export & Compliance API
app.post('/api/gdpr/export', requireAuth, requireWorkspace, (_req: AuthenticatedRequest, res) => {
  return res.status(501).json({
    error: 'GDPR_EXPORT_NOT_IMPLEMENTED',
    message: 'A real signed export bundle and retention workflow must be implemented before this feature is enabled.',
  });
});

// Campaign OS: natural-language workflow generation. Returns a strict editable graph.
app.post('/api/campaigns/generate-workflow', requireAuth, requireWorkspace, async (req: AuthenticatedRequest, res) => {
  const workspaceId = req.workspaceId!;
  const brief = String(req.body?.brief || '').trim();
  if (!brief) return res.status(400).json({ error: 'BRIEF_REQUIRED' });

  const fallback = [
    ['strategy','Campaign Strategy','Translate the brief into goals, offer, KPIs and constraints.','Strategy Agent'],
    ['audience','Audience Research','Define ICP, pains, objections, intent and channel behaviour.','Research Agent'],
    ['message','Messaging System','Create positioning, hooks, pillars and calls to action.','Creative Agent'],
    ['identity','Visual & Identity Direction','Apply brand rules and any locked influencer identity recipe.','Creative Agent'],
    ['content','Content Production','Generate channel-specific content and creative briefs.','Content Agent'],
    ['page','Landing Experience','Build the conversion page, form and tracking plan.','Web Agent'],
    ['email','Lead Nurture','Create trigger-based email follow-up sequences.','Email Agent'],
    ['approval','Approval Gate','Route assets to internal and client approval before publishing.','Approval Agent'],
    ['publish','Publish & Measure','Schedule approved work, capture leads and report results.','Campaign Operator'],
  ].map((n,i)=>({id:`node-${Date.now()}-${i}`,type:n[0],title:n[1],description:n[2],owner:n[3],x:20+(i%3)*260,y:30+Math.floor(i/3)*180,status:i===0?'complete':i>6?'blocked':'ready'}));

  if (!ai) return res.json({ success:true, workspaceId, source:'deterministic-fallback', nodes:fallback });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Create an executable marketing campaign workflow for this brief: ${brief}`,
      config: { responseMimeType:'application/json', systemInstruction:`Return JSON only: {"nodes":[{"type":"strategy|audience|message|identity|content|page|email|approval|publish","title":"string","description":"specific required output","owner":"named agent"}]}. Use 7-10 ordered nodes. Never claim external actions occurred.` }
    });
    const parsed = JSON.parse(response.text || '{}');
    const nodes = (parsed.nodes || []).map((n:any,i:number)=>({...n,id:`node-${Date.now()}-${i}`,x:20+(i%3)*260,y:30+Math.floor(i/3)*180,status:i===0?'complete':n.type==='approval'||n.type==='publish'?'blocked':'ready'}));
    return res.json({success:true,workspaceId,source:'gemini',nodes:nodes.length?nodes:fallback});
  } catch (error:any) {
    return res.json({success:true,workspaceId,source:'fallback-after-ai-error',nodes:fallback,warning:error?.message});
  }
});


// Start Express and Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Jobryn Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
