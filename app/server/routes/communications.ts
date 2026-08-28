import { Router, type RequestHandler } from 'express';
import { z } from 'zod';
import { env } from '../env';
import { asyncRoute, validateBody } from '../security';
import { consumeWorkspaceUsage, requireActiveSubscription, requireAuth, requireRole, requireWorkspace, supabaseAdmin, type AuthenticatedRequest, writeAudit } from '../supabase';
import { emptyMessagingResponse, normalizeE164, sendSms, twilioConfigured, validateTwilioWebhook } from '../providers/twilio';

const router = Router();
const webhookRouter = Router();
const sendSchema = z.object({
  customer_id: z.string().uuid(),
  conversation_id: z.string().uuid().optional(),
  purpose: z.enum(['transactional', 'marketing', 'support']).default('support'),
  body: z.string().trim().min(1).max(1600),
});
const consentSchema = z.object({
  customer_id: z.string().uuid(),
  channel: z.enum(['email', 'sms', 'phone']),
  purpose: z.enum(['transactional', 'marketing', 'support', 'recording']),
  granted: z.boolean(),
  source: z.string().trim().min(2).max(80),
  evidence: z.record(z.string(), z.unknown()).default({}),
});

function publicWebhookUrl(path: string) {
  return `${env.APP_URL.replace(/\/$/, '')}${path}`;
}

export function twilioSignatureGuard(path: string): RequestHandler {
  return (req, res, next) => {
    if (!twilioConfigured()) return res.status(503).json({ error: 'TWILIO_NOT_CONFIGURED' });
    const signature = req.header('x-twilio-signature') ?? '';
    const params = Object.fromEntries(Object.entries(req.body as Record<string, unknown>).map(([key, value]) => [key, String(value ?? '')]));
    if (!signature || !validateTwilioWebhook(signature, publicWebhookUrl(path), params)) {
      return res.status(403).json({ error: 'INVALID_TWILIO_SIGNATURE' });
    }
    next();
  };
}

async function assignedWorkspace(to: string) {
  const { data, error } = await supabaseAdmin.from('integrations').select('workspace_id')
    .eq('provider', 'twilio').eq('external_account_id', normalizeE164(to)).eq('status', 'connected').limit(2);
  if (error) throw new Error('TWILIO_TENANT_LOOKUP_FAILED');
  if (data?.length !== 1) return null;
  return data[0].workspace_id as string;
}

webhookRouter.post('/incoming', twilioSignatureGuard('/api/twilio/incoming'), asyncRoute(async (req, res) => {
  const from = normalizeE164(String(req.body.From ?? ''));
  const to = normalizeE164(String(req.body.To ?? ''));
  const providerMessageId = String(req.body.MessageSid ?? '');
  const body = String(req.body.Body ?? '').trim().slice(0, 1600);
  const workspaceId = await assignedWorkspace(to);
  if (!workspaceId || !from || !providerMessageId) return res.status(404).type('text/xml').send(emptyMessagingResponse());

  let { data: customer, error: customerError } = await supabaseAdmin.from('customers').select('id')
    .eq('workspace_id', workspaceId).eq('normalized_phone', from).is('deleted_at', null).maybeSingle();
  if (customerError) throw new Error('TWILIO_CUSTOMER_LOOKUP_FAILED');
  if (!customer) {
    const created = await supabaseAdmin.from('customers').insert({
      workspace_id: workspaceId, display_name: from, phone: from, normalized_phone: from, source: 'sms',
    }).select('id').single();
    if (created.error) throw new Error('TWILIO_CUSTOMER_CREATE_FAILED');
    customer = created.data;
  }

  if (/^(stop|unsubscribe|cancel|end|quit)$/i.test(body)) {
    await supabaseAdmin.from('suppression_entries').upsert({
      workspace_id: workspaceId, customer_id: customer.id, channel: 'sms', value: from, reason: 'customer_opt_out',
    }, { onConflict: 'workspace_id,channel,value' });
  } else if (/^(start|unstop)$/i.test(body)) {
    await supabaseAdmin.from('suppression_entries').delete().eq('workspace_id', workspaceId).eq('channel', 'sms').eq('value', from);
  }

  let { data: conversation } = await supabaseAdmin.from('conversations').select('id')
    .eq('workspace_id', workspaceId).eq('customer_id', customer.id).eq('status', 'open')
    .order('last_message_at', { ascending: false }).limit(1).maybeSingle();
  if (!conversation) {
    const created = await supabaseAdmin.from('conversations').insert({
      workspace_id: workspaceId, customer_id: customer.id, subject: 'SMS conversation', handling_mode: 'human_requested',
    }).select('id').single();
    if (created.error) throw new Error('TWILIO_CONVERSATION_CREATE_FAILED');
    conversation = created.data;
  }

  const receivedAt = new Date().toISOString();
  const inserted = await supabaseAdmin.from('messages').upsert({
    workspace_id: workspaceId, conversation_id: conversation.id, customer_id: customer.id,
    channel: 'sms', direction: 'inbound', purpose: 'support', sender_type: 'customer',
    provider: 'twilio', provider_message_id: providerMessageId, body, status: 'received', sent_at: receivedAt,
  }, { onConflict: 'workspace_id,provider,provider_message_id', ignoreDuplicates: true });
  if (inserted.error) throw new Error('TWILIO_MESSAGE_STORE_FAILED');
  await supabaseAdmin.from('conversations').update({ last_message_at: receivedAt, updated_at: receivedAt })
    .eq('workspace_id', workspaceId).eq('id', conversation.id);
  res.type('text/xml').send(emptyMessagingResponse());
}));

webhookRouter.post('/status', twilioSignatureGuard('/api/twilio/status'), asyncRoute(async (req, res) => {
  const providerMessageId = String(req.body.MessageSid ?? '');
  const providerStatus = String(req.body.MessageStatus ?? '');
  const mapped = providerStatus === 'delivered' ? 'delivered'
    : ['failed', 'undelivered'].includes(providerStatus) ? 'failed'
      : providerStatus === 'sent' ? 'sent' : 'sending';
  if (providerMessageId) {
    const changes: Record<string, unknown> = { status: mapped, error_code: req.body.ErrorCode ? String(req.body.ErrorCode) : null };
    if (mapped === 'delivered') changes.delivered_at = new Date().toISOString();
    if (mapped === 'sent') changes.sent_at = new Date().toISOString();
    await supabaseAdmin.from('messages').update(changes).eq('provider', 'twilio').eq('provider_message_id', providerMessageId);
  }
  res.sendStatus(204);
}));

router.use(requireAuth, requireWorkspace, requireActiveSubscription('crm.core'));

router.post('/consents', requireRole('owner', 'admin', 'manager', 'staff'), validateBody(consentSchema), asyncRoute(async (req: AuthenticatedRequest, res) => {
  const { data: customer } = await supabaseAdmin.from('customers').select('id').eq('workspace_id', req.workspaceId!).eq('id', req.body.customer_id).is('deleted_at', null).maybeSingle();
  if (!customer) return res.status(404).json({ error: 'CUSTOMER_NOT_FOUND' });
  const { error } = await supabaseAdmin.from('customer_consents').insert({ ...req.body, workspace_id: req.workspaceId! });
  if (error) return res.status(500).json({ error: 'CONSENT_RECORD_FAILED' });
  await writeAudit(req, 'customer.consent_recorded', 'customer', customer.id, { channel: req.body.channel, purpose: req.body.purpose, granted: req.body.granted });
  res.status(201).json({ recorded: true });
}));

router.post('/sms', requireRole('owner', 'admin', 'manager', 'staff'), validateBody(sendSchema), asyncRoute(async (req: AuthenticatedRequest, res) => {
  if (!twilioConfigured()) return res.status(503).json({ error: 'TWILIO_NOT_CONFIGURED' });
  const { data: customer } = await supabaseAdmin.from('customers').select('id,phone,normalized_phone')
    .eq('workspace_id', req.workspaceId!).eq('id', req.body.customer_id).is('deleted_at', null).maybeSingle();
  const destination = normalizeE164(customer?.normalized_phone || customer?.phone || '');
  if (!customer || !/^\+[1-9]\d{7,14}$/.test(destination)) return res.status(400).json({ error: 'CUSTOMER_SMS_NUMBER_REQUIRED' });

  const [{ data: latestConsent }, { data: suppression }] = await Promise.all([
    supabaseAdmin.from('customer_consents').select('granted,revoked_at').eq('workspace_id', req.workspaceId!).eq('customer_id', customer.id).eq('channel', 'sms').eq('purpose', req.body.purpose).order('recorded_at', { ascending: false }).limit(1).maybeSingle(),
    supabaseAdmin.from('suppression_entries').select('id').eq('workspace_id', req.workspaceId!).eq('channel', 'sms').eq('value', destination).maybeSingle(),
  ]);
  if (suppression || !latestConsent?.granted || latestConsent.revoked_at) return res.status(409).json({ error: 'SMS_CONSENT_REQUIRED_OR_SUPPRESSED' });

  let conversationId = req.body.conversation_id as string | undefined;
  if (conversationId) {
    const { data } = await supabaseAdmin.from('conversations').select('id').eq('workspace_id', req.workspaceId!).eq('customer_id', customer.id).eq('id', conversationId).maybeSingle();
    if (!data) return res.status(404).json({ error: 'CONVERSATION_NOT_FOUND' });
  } else {
    const { data, error } = await supabaseAdmin.from('conversations').insert({ workspace_id: req.workspaceId!, customer_id: customer.id, subject: 'SMS conversation', handling_mode: 'human_active' }).select('id').single();
    if (error) return res.status(500).json({ error: 'CONVERSATION_CREATE_FAILED' });
    conversationId = data.id;
  }

  const usage = await consumeWorkspaceUsage(req, 'usage.sms');
  if (!usage.allowed) return res.status(429).json({ error: 'SMS_LIMIT_REACHED', limit: usage.limit });
  const message = await sendSms({ to: destination, body: req.body.body, statusCallback: publicWebhookUrl('/api/twilio/status') });
  const now = new Date().toISOString();
  const { data: stored, error } = await supabaseAdmin.from('messages').insert({
    workspace_id: req.workspaceId!, conversation_id: conversationId, customer_id: customer.id,
    channel: 'sms', direction: 'outbound', purpose: req.body.purpose, sender_type: 'user', sender_user_id: req.auth!.userId,
    provider: 'twilio', provider_message_id: message.sid, body: req.body.body, status: message.status === 'sent' ? 'sent' : 'queued', sent_at: now,
  }).select('id,status').single();
  if (error) return res.status(500).json({ error: 'SMS_SENT_BUT_STORE_FAILED', providerMessageId: message.sid });
  await supabaseAdmin.from('conversations').update({ last_message_at: now, updated_at: now }).eq('workspace_id', req.workspaceId!).eq('id', conversationId);
  await writeAudit(req, 'sms.sent', 'message', stored.id, { customerId: customer.id, purpose: req.body.purpose });
  res.status(202).json({ message: stored, usage });
}));

export { webhookRouter as twilioWebhookRouter };
export default router;
