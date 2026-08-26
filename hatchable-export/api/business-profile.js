import { db } from 'hatchable';
import { requireOwnerWorkspace, requireWorkspace } from 'lib/tenant.js';

export const access = 'user';
export const methods = ['GET', 'PUT'];

const AU_TIMEZONES = new Set([
  'Australia/Adelaide',
  'Australia/Brisbane',
  'Australia/Broken_Hill',
  'Australia/Canberra',
  'Australia/Currie',
  'Australia/Darwin',
  'Australia/Eucla',
  'Australia/Hobart',
  'Australia/Lindeman',
  'Australia/Lord_Howe',
  'Australia/Melbourne',
  'Australia/Perth',
  'Australia/Sydney'
]);

function has(input, key) {
  return Object.prototype.hasOwnProperty.call(input, key);
}

function text(input, key, current, max) {
  if (!has(input, key)) return current || null;
  return String(input[key] || '').trim().slice(0, max) || null;
}

function email(input, current) {
  const value = text(input, 'email', current, 254);
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('Enter a valid business email');
  return value ? value.toLowerCase() : null;
}

function website(input, current) {
  const value = text(input, 'website', current, 500);
  if (!value) return null;
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('Enter a valid website URL');
  }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Website must use http or https');
  return url.toString();
}

function abn(input, current) {
  const value = text(input, 'abn', current, 32);
  if (!value) return null;
  const digits = value.replace(/\s/g, '');
  if (!/^\d{11}$/.test(digits)) throw new Error('ABN must contain 11 digits');
  return digits;
}

function timezone(input, current) {
  const value = text(input, 'timezone', current || 'Australia/Adelaide', 64) || 'Australia/Adelaide';
  if (!AU_TIMEZONES.has(value)) throw new Error('Select a valid Australian timezone');
  return value;
}

function boolean(input, key, current) {
  if (!has(input, key)) return Boolean(current);
  return input[key] === true || input[key] === 'true' || input[key] === 'on' || input[key] === 1;
}

export default async function (req, res) {
  const workspace = req.method === 'PUT'
    ? await requireOwnerWorkspace(req, res)
    : await requireWorkspace(req, res);
  if (!workspace) return;

  const { rows: existingRows } = await db.query(
    'SELECT trading_name,legal_name,abn,industry,phone,email,website,timezone,address,description,gst_registered,onboarding_complete FROM business_profiles WHERE workspace_id=$1',
    [workspace.id]
  );
  const existing = existingRows[0] || {};

  if (req.method === 'GET') {
    return res.json({ profile: existing });
  }

  const input = req.body;
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return res.status(400).json({ error: 'A business profile is required' });
  }

  try {
    const profile = {
      trading_name: text(input, 'trading_name', existing.trading_name, 160),
      legal_name: text(input, 'legal_name', existing.legal_name, 160),
      abn: abn(input, existing.abn),
      industry: text(input, 'industry', existing.industry, 120),
      phone: text(input, 'phone', existing.phone, 40),
      email: email(input, existing.email),
      website: website(input, existing.website),
      timezone: timezone(input, existing.timezone),
      address: text(input, 'address', existing.address, 500),
      description: text(input, 'description', existing.description, 5000),
      gst_registered: boolean(input, 'gst_registered', existing.gst_registered)
    };

    const onboardingComplete = Boolean(
      profile.trading_name && profile.industry && profile.phone && profile.email
    );

    const { rows } = await db.query(
      'INSERT INTO business_profiles (workspace_id,trading_name,legal_name,abn,industry,phone,email,website,timezone,address,description,gst_registered,onboarding_complete) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT (workspace_id) DO UPDATE SET trading_name=EXCLUDED.trading_name,legal_name=EXCLUDED.legal_name,abn=EXCLUDED.abn,industry=EXCLUDED.industry,phone=EXCLUDED.phone,email=EXCLUDED.email,website=EXCLUDED.website,timezone=EXCLUDED.timezone,address=EXCLUDED.address,description=EXCLUDED.description,gst_registered=EXCLUDED.gst_registered,onboarding_complete=EXCLUDED.onboarding_complete,updated_at=now() RETURNING trading_name,legal_name,abn,industry,phone,email,website,timezone,address,description,gst_registered,onboarding_complete,updated_at',
      [
        workspace.id,
        profile.trading_name,
        profile.legal_name,
        profile.abn,
        profile.industry,
        profile.phone,
        profile.email,
        profile.website,
        profile.timezone,
        profile.address,
        profile.description,
        profile.gst_registered,
        onboardingComplete
      ]
    );
    return res.json({ profile: rows[0] });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid business profile' });
  }
}
