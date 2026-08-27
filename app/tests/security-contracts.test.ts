import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const billingSource = await readFile(new URL('../server/routes/billing.ts', import.meta.url), 'utf8');
const operationsSource = await readFile(new URL('../server/routes/operations.ts', import.meta.url), 'utf8');
const settlementMigration = await readFile(new URL('../supabase/migrations/0007_secure_invoice_payment_settlement.sql', import.meta.url), 'utf8');
const communicationsSource = await readFile(new URL('../server/routes/communications.ts', import.meta.url), 'utf8');
const envSource = await readFile(new URL('../server/env.ts', import.meta.url), 'utf8');
const packageSource = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')) as { scripts: Record<string, string> };
const supabaseSource = await readFile(new URL('../server/supabase.ts', import.meta.url), 'utf8');

test('Stripe webhooks verify signatures against the raw body before claiming events', () => {
  assert.match(billingSource, /express\.raw\(\{ type: 'application\/json'/);
  assert.match(billingSource, /stripe\.webhooks\.constructEvent\(req\.body, signature, env\.STRIPE_WEBHOOK_SECRET\)/);
  assert.ok(billingSource.indexOf('constructEvent') < billingSource.indexOf("claim_stripe_webhook_event"));
});

test('Checkout uses dynamic payment methods and current integration identifiers', () => {
  assert.doesNotMatch(billingSource, /payment_method_types/);
  assert.doesNotMatch(operationsSource, /payment_method_types/);
  assert.match(billingSource, /integration_identifier: 'jobryn_subs_[a-z]{8}'/);
  assert.match(operationsSource, /integration_identifier:'jobryn_pay_[a-z]{8}'/);
});

test('invoice settlement is restricted to the service role and is idempotent', () => {
  assert.match(settlementMigration, /revoke all on function public\.settle_stripe_invoice_payment[\s\S]*from public, anon, authenticated;/i);
  assert.match(settlementMigration, /grant execute on function public\.settle_stripe_invoice_payment[\s\S]*to service_role;/i);
  assert.match(settlementMigration, /on conflict \(workspace_id, provider, provider_payment_id\) do nothing/i);
  assert.match(settlementMigration, /for update;/i);
});

test('Twilio webhooks are signature checked before tenant data is used', () => {
  assert.match(communicationsSource, /x-twilio-signature/i);
  assert.match(communicationsSource, /validateTwilioWebhook/);
  assert.match(communicationsSource, /assignedWorkspace\(to\)/);
  assert.match(communicationsSource, /data\?\.length !== 1/);
});

test('outbound SMS requires consent, suppression checks and metered usage', () => {
  assert.match(communicationsSource, /customer_consents/);
  assert.match(communicationsSource, /suppression_entries/);
  assert.match(communicationsSource, /consumeWorkspaceUsage\(req, 'usage\.sms'\)/);
  assert.match(communicationsSource, /SMS_CONSENT_REQUIRED_OR_SUPPRESSED/);
});

test('local server auth uses the same public Supabase project as the browser without exposing service role', () => {
  assert.match(envSource, /SUPABASE_URL: process\.env\.SUPABASE_URL \?\? process\.env\.VITE_SUPABASE_URL/);
  assert.match(envSource, /SUPABASE_ANON_KEY: process\.env\.SUPABASE_ANON_KEY \?\? process\.env\.VITE_SUPABASE_ANON_KEY/);
  assert.match(envSource, /SUPABASE_SERVICE_ROLE_KEY: process\.env\.SUPABASE_SERVICE_ROLE_KEY \?\? ''/);
  assert.doesNotMatch(envSource, /SUPABASE_SERVICE_ROLE_KEY:.*VITE_/);
});

test('Windows development uses the trusted system certificate store for Supabase HTTPS', () => {
  assert.match(packageSource.scripts.dev, /node --use-system-ca --import tsx server\.ts/);
});

test('tenant membership checks use the authenticated user client and RLS', () => {
  const start = supabaseSource.indexOf('export async function requireWorkspace');
  const end = supabaseSource.indexOf('export function requireRole', start);
  const tenantCheck = supabaseSource.slice(start, end);
  assert.match(tenantCheck, /createUserClient\(req\.auth\.accessToken\)/);
  assert.doesNotMatch(tenantCheck, /supabaseAdmin/);
  assert.match(tenantCheck, /\.eq\('user_id', req\.auth\.userId\)/);
  assert.match(tenantCheck, /\.eq\('status', 'active'\)/);
});

test('subscription and entitlement gates use the authenticated tenant client', () => {
  const start = supabaseSource.indexOf('export function requireActiveSubscription');
  const end = supabaseSource.indexOf('export function requireSensitiveAuth', start);
  const subscriptionGate = supabaseSource.slice(start, end);
  assert.match(subscriptionGate, /createUserClient\(req\.auth\.accessToken\)/);
  assert.doesNotMatch(subscriptionGate, /supabaseAdmin/);
});
