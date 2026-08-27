# Cloudflare production domain: jobryn.org

`jobryn.org` is the canonical Jobryn production domain. Cloudflare nameservers are active, but the latest verification found no public apex A/AAAA record and no `www` record, so the domain does not yet route to Hostinger.

## Add after Hostinger provides the destination

- If Hostinger supplies an IPv4 address: create an `A` record for `@` pointing to that address.
- If Hostinger supplies a hostname: create the record type and target Hostinger explicitly requests. Do not guess the origin.
- Create `CNAME` `www` → `jobryn.org`.
- Start with Cloudflare proxy disabled (DNS only) until Hostinger has issued and verified its origin certificate; then enable the proxy after HTTPS works directly.
- Set SSL/TLS mode to `Full (strict)` after the Hostinger origin certificate is valid. Do not use Flexible mode.
- Redirect `www.jobryn.org` to `https://jobryn.org` so authentication cookies and provider callbacks use one canonical host.

## Provider URLs

- Supabase Site URL: `https://jobryn.org`
- Supabase redirect URLs: `https://jobryn.org/auth/callback`, `https://jobryn.org/reset-password`
- Stripe webhook: `https://jobryn.org/api/stripe/webhook`
- Twilio SMS: `https://jobryn.org/api/twilio/incoming`
- Twilio SMS status: `https://jobryn.org/api/twilio/status`
- Twilio Voice: `https://jobryn.org/api/twilio/voice`
- Twilio Conversation Relay: `wss://jobryn.org/api/receptionist/conversation` after the WebSocket service is implemented and tested

## Security

Keep every service-role key, Stripe key, webhook secret, Twilio Auth Token and OpenAI key in Hostinger server secrets. Cloudflare DNS records and browser variables must never contain these values.
