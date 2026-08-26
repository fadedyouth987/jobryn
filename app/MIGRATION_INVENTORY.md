# Jobryn migration inventory

Date: 2026-08-25

## Current architecture

- React 19 and Vite browser application.
- Express/TypeScript API is the trusted application boundary.
- Supabase Auth provides email/password, OAuth, PKCE and TOTP MFA flows.
- Supabase Postgres is already the canonical application database.
- Supabase Storage contains a private `vantory-assets` bucket. Object paths begin
  with the workspace UUID and storage policies check workspace membership/role.
- Stripe Checkout, Billing Portal and signed webhooks are handled by the server.
- Gemini calls are handled by the server; the provider key is not a browser value.

## Supabase connection state

The uploaded source contains only `.env.example` placeholders. No `.env`, project
reference, access token, database password or live Supabase key is present in this
working copy, so the connected Hatchable/Supabase project cannot be inspected or
changed from this archive alone.

Browser configuration is limited to `VITE_SUPABASE_URL` and the Supabase
publishable/anon key. The service-role key, Stripe secrets and AI key are read only
by the server. Production startup validates required secret formats, HTTPS origins
and the absence of wildcard CORS.

## Tenant and revenue boundaries already present

- Tenant-owned tables carry `workspace_id` and enable RLS.
- Membership helper functions use `auth.uid()`.
- The API independently verifies the bearer token, active workspace membership and
  required role before protected operations.
- Migration `0004` adds same-workspace reference triggers to prevent cross-tenant
  foreign-key links and validates assigned users against active membership.
- Migration `0005` removes direct browser writes to provider-owned billing,
  entitlement, payment, audit and integration state.
- Stripe price IDs are mapped server-side. Webhook signatures are verified against
  the raw request body, events are claimed idempotently, and canonical subscription
  state is re-fetched from Stripe before database application.
- Usage metering is atomic and service-role-only in migration `0006`.

## Safe migration sequence

1. Rebrand user-facing and process-facing strings to Jobryn. Keep database and
   storage identifiers stable. This is the current reversible step.
2. Connect a non-production Supabase project and record its migration history.
3. Take a database backup and inventory row counts, RLS policies, grants, functions,
   triggers, storage buckets and Auth redirect URLs.
4. Apply migrations `0001` through `0006` to an empty staging project, or baseline
   an existing project before applying only missing migrations. Never replay these
   blindly against an unknown live schema.
5. Run two-user/two-workspace negative tests through both the browser client and API,
   including cross-workspace IDs in parent/child references and storage paths.
6. Run Stripe test-mode checkout, duplicate webhook, out-of-order webhook, portal,
   cancellation, past-due grace and entitlement tests.
7. Migrate the legacy storage bucket only if required: create a new private bucket,
   copy objects, compare object counts/checksums, enable equivalent policies, switch
   reads, then retain the old bucket during the rollback window.
8. Promote only after backups and the rollback verification pass.

## Rollback boundary for this step

This first step changes only application branding. Reverting the changed source
files restores the old display name. No table, policy, Auth user, Stripe customer,
subscription, storage object or external configuration is changed.

## Required deployment evidence

- Staging Supabase URL and publishable key for the browser.
- Matching server-side URL, publishable key and service-role key in the hosting
  platform's secret store (never committed or sent to the browser).
- Supabase migration history or a schema dump from the connected project.
- Configured Auth site URL and allowed redirects for the Jobryn domain.
- Stripe test keys, webhook secret and trusted price IDs in server secrets.
- A successful `npm run verify` and the staging isolation/billing test results.
