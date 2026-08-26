# Jobryn private migration package

This repository is the private portability package for moving Jobryn from
Hatchable to Hostinger.

## Contents

- `app/` — portable React/Vite + Express application.
- `app/supabase/migrations/` — PostgreSQL schema, tenancy, RBAC, billing and
  usage migrations from the secure source build.
- `hatchable-export/` — source recovered directly from the live Hatchable
  project for implementation reference.
- `database/hatchable-data.json` — point-in-time business-data export.
- `database/row-counts.json` — source row counts used to verify the export.
- `HOSTINGER_MIGRATION.md` — deployment and cutover runbook.

## Security

No Stripe secret, webhook secret, database password, Supabase service-role key,
OAuth client secret or Hatchable credential is committed. Configure production
values only in Hostinger's secret/environment settings.

The data backup contains identity mapping and workspace metadata. Keep the
repository private. Hatchable-managed passwordless sessions and passkeys are not
exportable and users must authenticate again after cutover.

## Status

This is a migration package, not an automatic production cutover. Run the
staging, tenant-isolation and Stripe webhook tests in `HOSTINGER_MIGRATION.md`
before changing DNS.

