import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const billingSource = await readFile(new URL('../server/routes/billing.ts', import.meta.url), 'utf8');
const operationsSource = await readFile(new URL('../server/routes/operations.ts', import.meta.url), 'utf8');
const settlementMigration = await readFile(new URL('../supabase/migrations/0007_secure_invoice_payment_settlement.sql', import.meta.url), 'utf8');
const communicationsSource = await readFile(new URL('../server/routes/communications.ts', import.meta.url), 'utf8');

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
