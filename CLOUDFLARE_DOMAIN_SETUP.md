# Cloudflare deployment: jobryn.org

Cloudflare Workers is Jobryn's public hosting layer for the React website and Express API. Supabase remains the database and authentication service. Hostinger is not required for this deployment.

## Current state

- Staging is deployed at `https://jobryn-staging.nexgen-studio.workers.dev`.
- Static website, API health, protected-route rejection and security headers have passed live smoke tests.
- Staging remains honestly marked `PRE_PRODUCTION`.
- `jobryn.org` is not attached until production secrets and provider tests pass.

## Production cutover

1. Add production-only values with Cloudflare Worker Secrets. Never commit them or place them in `vars`.
2. Run the full type, test, security, build and staging smoke checks.
3. Deploy the production Worker.
4. Attach `jobryn.org` as the Worker's Custom Domain and redirect `www.jobryn.org` to the canonical apex domain.
5. Confirm HTTPS, security headers, authentication redirects, tenant isolation and signed provider webhooks.
6. Keep the previous Worker version available for immediate rollback.

## Provider URLs

- Supabase Site URL: `https://jobryn.org`
- Supabase redirect URLs: `https://jobryn.org/auth/callback`, `https://jobryn.org/reset-password`
- Stripe webhook: `https://jobryn.org/api/stripe/webhook`
- Twilio SMS: `https://jobryn.org/api/twilio/incoming`
- Twilio SMS status: `https://jobryn.org/api/twilio/status`
- Twilio Voice: `https://jobryn.org/api/twilio/voice`
- Twilio Conversation Relay: `wss://jobryn.org/api/receptionist/conversation` only after the signed WebSocket service is implemented and tested

## Secrets required before production

- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_GROWTH`
- `STRIPE_PRICE_OPERATOR`

Twilio and OpenAI secrets are also required before enabling their corresponding features. Production startup fails closed when required database or billing secrets are missing.
