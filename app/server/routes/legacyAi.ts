import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { env } from '../env';
import { asyncRoute, validateBody } from '../security';
import { consumeWorkspaceUsage, requireActiveSubscription, requireAuth, requireWorkspace, type AuthenticatedRequest } from '../supabase';

const router = Router();
const ai = env.GEMINI_API_KEY && env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY }) : null;
router.use(requireAuth, requireWorkspace, requireActiveSubscription('ai.basic'));

router.post('/generate', validateBody(z.object({
  prompt: z.string().trim().min(2).max(8000),
  platform: z.string().trim().max(50).optional(),
  stylePreset: z.string().trim().max(100).optional(),
})), asyncRoute(async (req: AuthenticatedRequest, res) => {
  if (!ai) return res.status(503).json({ error: 'AI_NOT_CONFIGURED' });
  const usage = await consumeWorkspaceUsage(req, 'usage.ai_actions', 1);
  if (!usage.allowed) return res.status(429).json({ error: 'AI_USAGE_LIMIT_REACHED', limit: usage.limit });
  const { prompt, platform = 'LinkedIn', stylePreset = 'Tech Minimalist' } = req.body;
  const response = await ai.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: `Create a social media campaign post based on: ${prompt}`,
    config: {
      systemInstruction: `You are Jobryn's campaign copywriter. Platform: ${platform}. Style: ${stylePreset}. Return JSON only with caption, hashtags (4-6), imagePrompt, visualDirection. Never claim the post was published.`,
      responseMimeType: 'application/json',
    },
  });
  const parsed = JSON.parse(response.text || '{}');
  res.json({ success: true, data: { ...parsed, costCredits: 15, aiEngine: 'Gemini 3.7 Flash' } });
}));

router.post('/campaigns/generate-workflow', validateBody(z.object({ brief: z.string().trim().min(2).max(12000) })), asyncRoute(async (req: AuthenticatedRequest, res) => {
  if (ai) {
    const usage = await consumeWorkspaceUsage(req, 'usage.ai_actions', 1);
    if (!usage.allowed) return res.status(429).json({ error: 'AI_USAGE_LIMIT_REACHED', limit: usage.limit });
  }
  const fallback = [
    ['strategy','Campaign Strategy'],['audience','Audience Research'],['message','Messaging System'],['content','Content Production'],['page','Landing Experience'],['email','Lead Nurture'],['approval','Approval Gate'],['publish','Publish & Measure'],
  ].map((n,i)=>({ id:`node-${Date.now()}-${i}`, type:n[0], title:n[1], description:'Complete this campaign stage with measurable outputs.', owner:'Jobryn Operator', x:20+(i%3)*260, y:30+Math.floor(i/3)*180, status:i===0?'complete':i>5?'blocked':'ready' }));
  if (!ai) return res.json({ success:true, workspaceId:req.workspaceId, source:'deterministic-fallback', nodes:fallback });
  const response = await ai.models.generateContent({
    model:env.GEMINI_MODEL,
    contents:`Create an executable marketing campaign workflow for this brief: ${req.body.brief}`,
    config:{ responseMimeType:'application/json', systemInstruction:'Return JSON only: {"nodes":[{"type":"strategy|audience|message|content|page|email|approval|publish","title":"string","description":"specific required output","owner":"Jobryn Operator"}]}. Never claim external actions already occurred.' },
  });
  const parsed = JSON.parse(response.text || '{}');
  const nodes = (parsed.nodes || []).map((n:any,i:number)=>({ ...n,id:`node-${Date.now()}-${i}`,x:20+(i%3)*260,y:30+Math.floor(i/3)*180,status:i===0?'complete':n.type==='approval'||n.type==='publish'?'blocked':'ready' }));
  res.json({ success:true,workspaceId:req.workspaceId,source:'gemini',nodes:nodes.length?nodes:fallback });
}));

router.post('/trends', (_req, res) => res.status(501).json({ error: 'TREND_MONITOR_REQUIRES_PRODUCTION_SEARCH_GROUNDING' }));
router.post('/engagement/suggest-reply', (_req, res) => res.status(501).json({ error: 'ENGAGEMENT_AUTOMATION_NOT_ENABLED' }));

export default router;
