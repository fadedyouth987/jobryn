# Jobryn

**AI Revenue Operating System for service businesses.**

This build upgrades the existing Jobryn Campaign OS foundation into a subscription SaaS shell with secure authentication, workspace tenancy, CRM/operations modules, Stripe Billing and an AI Operator foundation.

## Included application surfaces

- Public Jobryn website and pricing
- Email/password signup, verification, recovery and login
- Google, GitHub, Microsoft/Azure and Apple-ready OAuth through Supabase
- TOTP MFA enrollment/challenge
- Workspace creation/switching and RBAC
- Guided business onboarding
- Dashboard and AI Command Centre
- Unified Inbox
- Leads and Customers
- Schedule and Jobs
- Quotes, Invoices and Payments
- Campaigns (with the original Campaign OS retained behind an authenticated legacy route)
- Automations and Reviews
- Revenue Analytics / Attribution
- Knowledge, Operator actions and Approvals
- Integrations, Team, Billing and Security settings
- Stripe subscription Checkout and Billing Portal
- Hardened Express API and PostgreSQL RLS model

## Start locally

```bash
cp .env.example .env
npm install
npm run typecheck
npm run security:check
npm run dev
```

Open `http://localhost:3000`.

Read [`PRODUCTION_SETUP.md`](./PRODUCTION_SETUP.md) before configuring Supabase, OAuth or Stripe.

## Status

This is a **provider-ready source build**, not a claim that an unconfigured archive is already production-certified. Real OAuth, Stripe and database tests require your own Supabase/Stripe credentials and staging deployment. Do not accept paying customers until the deployment gate in `PRODUCTION_SETUP.md` has passed.
