import 'dotenv/config';
import { z } from 'zod';

const raw = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: process.env.PORT ?? '3000',
  APP_URL: process.env.APP_URL ?? 'http://localhost:3000',
  CORS_ORIGINS: process.env.CORS_ORIGINS ?? process.env.APP_URL ?? 'http://localhost:3000',
  TRUST_PROXY: process.env.TRUST_PROXY ?? '1',
  // The URL and publishable key are safe to share with the browser. Reuse the
  // Vite values in local development so browser and server validate sessions
  // against the same Supabase project. The service-role key never falls back.
  SUPABASE_URL: process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  STRIPE_PRICE_STARTER: process.env.STRIPE_PRICE_STARTER ?? '',
  STRIPE_PRICE_GROWTH: process.env.STRIPE_PRICE_GROWTH ?? '',
  STRIPE_PRICE_OPERATOR: process.env.STRIPE_PRICE_OPERATOR ?? '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
  GEMINI_MODEL: process.env.GEMINI_MODEL ?? 'gemini-3.7-flash',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ?? '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ?? '',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ?? '',
  REQUIRE_AAL2_SENSITIVE: process.env.REQUIRE_AAL2_SENSITIVE ?? (process.env.NODE_ENV === 'production' ? 'true' : 'false'),
  REQUIRE_EMAIL_VERIFICATION: process.env.REQUIRE_EMAIL_VERIFICATION ?? (process.env.NODE_ENV === 'production' ? 'true' : 'false'),
};

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  APP_URL: z.string().url(),
  CORS_ORIGINS: z.string().min(1),
  TRUST_PROXY: z.string().min(1),
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_PRICE_STARTER: z.string(),
  STRIPE_PRICE_GROWTH: z.string(),
  STRIPE_PRICE_OPERATOR: z.string(),
  GEMINI_API_KEY: z.string(),
  GEMINI_MODEL: z.string().min(3).max(100),
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_PHONE_NUMBER: z.string(),
  REQUIRE_AAL2_SENSITIVE: z.enum(['true', 'false']).default('false'),
  REQUIRE_EMAIL_VERIFICATION: z.enum(['true', 'false']).default('false'),
});

const parsed = schema.parse(raw);

export const env = {
  ...parsed,
  isProduction: parsed.NODE_ENV === 'production',
  allowedOrigins: parsed.CORS_ORIGINS.split(',').map((v) => v.trim()).filter(Boolean),
  requireAal2Sensitive: parsed.REQUIRE_AAL2_SENSITIVE === 'true',
  requireEmailVerification: parsed.REQUIRE_EMAIL_VERIFICATION === 'true',
};

export function assertProductionSecrets() {
  if (!env.isProduction) return;
  const required: Array<[string, string]> = [
    ['SUPABASE_URL', env.SUPABASE_URL],
    ['SUPABASE_ANON_KEY', env.SUPABASE_ANON_KEY],
    ['SUPABASE_SERVICE_ROLE_KEY', env.SUPABASE_SERVICE_ROLE_KEY],
    ['STRIPE_SECRET_KEY', env.STRIPE_SECRET_KEY],
    ['STRIPE_WEBHOOK_SECRET', env.STRIPE_WEBHOOK_SECRET],
    ['STRIPE_PRICE_STARTER', env.STRIPE_PRICE_STARTER],
    ['STRIPE_PRICE_GROWTH', env.STRIPE_PRICE_GROWTH],
    ['STRIPE_PRICE_OPERATOR', env.STRIPE_PRICE_OPERATOR],
  ];
  const missing = required.filter(([, value]) => !value || /REPLACE|YOUR_|missing/i.test(value)).map(([name]) => name);
  if (missing.length) throw new Error(`Missing production secrets: ${missing.join(', ')}`);

  const appUrl = new URL(env.APP_URL);
  if (appUrl.protocol !== 'https:') throw new Error('APP_URL must use HTTPS in production');
  if (!env.SUPABASE_URL.startsWith('https://')) throw new Error('SUPABASE_URL must use HTTPS in production');
  if (!/^(rk|sk)_(test|live)_/.test(env.STRIPE_SECRET_KEY)) throw new Error('STRIPE_SECRET_KEY must be a restricted or secret Stripe key');
  if (!env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) throw new Error('STRIPE_WEBHOOK_SECRET has an invalid format');
  for (const price of [env.STRIPE_PRICE_STARTER, env.STRIPE_PRICE_GROWTH, env.STRIPE_PRICE_OPERATOR]) {
    if (!price.startsWith('price_')) throw new Error('Stripe Price IDs must start with price_');
  }
  if (env.allowedOrigins.includes('*')) throw new Error('Wildcard CORS origins are not allowed in production');
  for (const origin of env.allowedOrigins) {
    if (new URL(origin).protocol !== 'https:') throw new Error(`CORS origin must use HTTPS in production: ${origin}`);
  }
}
