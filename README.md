# Jobryn private migration package

This repository is Jobryn's private source of truth. The current deployment
target is Cloudflare Workers, with Supabase providing database and authentication.

## Contents

- `app/` — portable React/Vite + Express application.
- `app/supabase/migrations/` — PostgreSQL schema, tenancy, RBAC, billing and
  usage migrations from the secure source build.
- `hatchable-export/` — source recovered directly from the live Hatchable
  project for implementation reference.
- `database/hatchable-data.json` — point-in-time business-data export.
- `database/row-counts.json` — source row counts used to verify the export.
- `CLOUDFLARE_DOMAIN_SETUP.md` — staging, production and domain cutover runbook.

## Security

No Stripe secret, webhook secret, database password, Supabase service-role key,
OAuth client secret or Hatchable credential is committed. Configure production
values only as encrypted Cloudflare Worker Secrets.

The data backup contains identity mapping and workspace metadata. Keep the
repository private. Hatchable-managed passwordless sessions and passkeys are not
exportable and users must authenticate again after cutover.

## Status

This is a migration package, not an automatic production cutover. Run the
staging, tenant-isolation and Stripe webhook tests in `CLOUDFLARE_DOMAIN_SETUP.md`
before changing DNS.
