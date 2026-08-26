import { db } from 'hatchable';
import { requireWorkspace } from 'lib/tenant.js';

export const access = 'user';
export const methods = ['GET'];

function countOf(row) {
  return Number(row?.count || 0);
}

function nextAction(profile, customers, totalLeads, stageCounts, openQuotes, outstandingInvoices) {
  if (!profile?.onboarding_complete) {
    return {
      page: 'settings',
      title: 'Complete your business details',
      description: 'Add the contact details Jobryn will use on future customer records, quotes and invoices.',
      label: 'Finish business setup'
    };
  }

  if (customers === 0) {
    return {
      page: 'customers',
      form: 'customerForm',
      title: 'Add your first customer',
      description: 'Start with the person behind the next enquiry or job you need to track.',
      label: 'Add customer'
    };
  }

  if (totalLeads === 0) {
    return {
      page: 'leads',
      form: 'leadForm',
      title: 'Capture your first enquiry',
      description: 'Add the request, who it is from and its estimated value. You can qualify it from there.',
      label: 'New enquiry'
    };
  }

  if (Number(stageCounts.new || 0) > 0) {
    return {
      page: 'leads',
      title: `${stageCounts.new} new ${stageCounts.new === 1 ? 'enquiry needs' : 'enquiries need'} attention`,
      description: 'Open the enquiry board and move each request forward once you have made contact.',
      label: 'Review enquiries'
    };
  }

  if (openQuotes > 0) {
    return {
      page: 'quotes',
      title: 'Review your open quotes',
      description: 'Keep quote-ready work moving so customers know what happens next.',
      label: 'View quotes'
    };
  }

  if (outstandingInvoices > 0) {
    return {
      page: 'invoices',
      title: 'Review outstanding invoices',
      description: 'See what is still to be collected and record payments as they arrive.',
      label: 'View invoices'
    };
  }

  return {
    page: 'leads',
    form: 'leadForm',
    title: 'Keep your pipeline moving',
    description: 'Add the next enquiry so Jobryn can keep the customer journey and revenue picture current.',
    label: 'New enquiry'
  };
}

export default async function (req, res) {
  const workspace = await requireWorkspace(req, res);
  if (!workspace) return;

  const [customers, leads, jobs, quotes, invoices, profileRows, leadStages] = await Promise.all([
    db.query('SELECT count(*)::int AS count,COALESCE(sum(lifetime_value_cents),0)::bigint AS value FROM customers WHERE workspace_id=$1', [workspace.id]),
    db.query("SELECT count(*)::int AS count,COALESCE(sum(estimated_value_cents),0)::bigint AS value FROM leads WHERE workspace_id=$1 AND stage NOT IN ('lost','cancelled','spam','completed')", [workspace.id]),
    db.query("SELECT count(*)::int AS count,COALESCE(sum(value_cents),0)::bigint AS value FROM jobs WHERE workspace_id=$1 AND status NOT IN ('cancelled')", [workspace.id]),
    db.query("SELECT count(*)::int AS count,COALESCE(sum(total_cents),0)::bigint AS value FROM quotes WHERE workspace_id=$1 AND status IN ('draft','sent','viewed')", [workspace.id]),
    db.query("SELECT count(*)::int AS count,COALESCE(sum(balance_cents),0)::bigint AS value FROM invoices WHERE workspace_id=$1 AND status NOT IN ('paid','void','cancelled')", [workspace.id]),
    db.query('SELECT trading_name,industry,phone,email,onboarding_complete FROM business_profiles WHERE workspace_id=$1', [workspace.id]),
    db.query('SELECT stage,count(*)::int AS count FROM leads WHERE workspace_id=$1 GROUP BY stage', [workspace.id])
  ]);

  const profile = profileRows.rows[0] || {};
  const stageCounts = Object.fromEntries(leadStages.rows.map((row) => [row.stage, countOf(row)]));
  const totalLeads = Object.values(stageCounts).reduce((sum, value) => sum + Number(value || 0), 0);
  const customerCount = countOf(customers.rows[0]);
  const openQuoteCount = countOf(quotes.rows[0]);
  const outstandingInvoiceCount = countOf(invoices.rows[0]);

  return res.json({
    workspace,
    customers: customers.rows[0],
    open_leads: leads.rows[0],
    jobs: jobs.rows[0],
    open_quotes: quotes.rows[0],
    outstanding_invoices: invoices.rows[0],
    profile: {
      trading_name: profile.trading_name || null,
      onboarding_complete: Boolean(profile.onboarding_complete)
    },
    lead_stages: stageCounts,
    getting_started: [
      {
        id: 'profile',
        complete: Boolean(profile.onboarding_complete),
        title: 'Business details',
        description: 'Tell Jobryn how your business appears to customers.',
        page: 'settings'
      },
      {
        id: 'customer',
        complete: customerCount > 0,
        title: 'First customer',
        description: 'Add the person behind the work you want to track.',
        page: 'customers',
        form: 'customerForm'
      },
      {
        id: 'enquiry',
        complete: totalLeads > 0,
        title: 'First enquiry',
        description: 'Capture a request and move it through your pipeline.',
        page: 'leads',
        form: 'leadForm'
      }
    ],
    next_action: nextAction(profile, customerCount, totalLeads, stageCounts, openQuoteCount, outstandingInvoiceCount)
  });
}
