# Hostinger migration runbook

## Recommended Hostinger target

Use a Hostinger VPS or another plan that supports a persistent Node.js process,
HTTPS reverse proxy and PostgreSQL connectivity. Static-only web hosting cannot
run Jobryn's API, Stripe webhooks or authentication server.

## 1. Provision staging

1. Create a managed PostgreSQL database or a private PostgreSQL service.
2. Create a staging domain such as `staging.jobryn.com`.
3. Deploy `app/` with Node.js 22 or its Dockerfile.
4. Copy `app/.env.example` into Hostinger environment settings. Never upload a
   populated `.env` file to GitHub.
5. Apply `app/supabase/migrations/0001_vantory_core.sql` through
   `0011_member_subscription_access.sql` in filename order to an empty staging database.

The historical `vantory` migration and storage identifiers are intentionally
preserved for compatibility; the product displayed to users is Jobryn.

## 2. Authentication

The portable source currently uses Supabase Auth. Either:

- keep Supabase only for Auth/Postgres/Storage while Hostinger runs the app; or
- replace Supabase Auth before production with a Hostinger-compatible provider.

Hatchable passwordless sessions, passkeys and password hashes cannot be exported.
Existing users must use a fresh login/recovery flow after cutover.

## 3. Import data

`database/hatchable-data.json` contains the current application records.
Import parent tables before child tables:

1. users
2. workspaces
3. workspace_members
4. business_profiles
5. subscriptions
6. customers, leads, jobs
7. quotes, quote_items
8. invoices, invoice_items
9. payments
10. conversations, messages, ai_actions, stripe_events

The current export has no customer, lead, job, quote, invoice, payment, message
or Stripe event rows.

## 4. Stripe

1. Store the Stripe secret and webhook signing secret only in Hostinger secrets.
2. Create a new Stripe webhook endpoint for
   `https://staging.jobryn.com/api/stripe/webhook`.
3. Configure the trusted Starter, Growth and Operator Price IDs server-side.
4. Test checkout, portal, duplicate events, out-of-order subscription events,
   cancellation and failed-payment handling in Stripe test mode.
5. Do not disable the Hatchable endpoint until the Hostinger endpoint has
   processed test events successfully.

## 5. Required security tests

- User A cannot read or mutate User B's workspace records.
- Parent and child identifiers from different workspaces are rejected.
- Staff cannot change billing, plans, entitlements or owner membership.
- Anonymous requests receive 401/403 on protected routes.
- Stripe webhook requests with an invalid or stale signature are rejected.
- Duplicate payment/webhook idempotency keys do not alter balances twice.
- Secrets do not appear in browser bundles, logs or API errors.

## 6. Cutover and rollback

1. Back up Hatchable again immediately before cutover.
2. Freeze writes briefly and import the final delta.
3. Lower DNS TTL, point the Jobryn domain to Hostinger and monitor errors.
4. Keep Hatchable unchanged during the rollback window.
5. Roll back DNS if authentication, tenant isolation, billing or data-count
   verification fails.
