import { api,config,db } from 'hatchable';
import { requireOwnerWorkspace } from 'lib/tenant.js';
export const access='user';export const methods=['POST'];
export default async function(req,res){
  const w=await requireOwnerWorkspace(req,res);if(!w)return;const plan=String(req.body?.plan||'').toLowerCase();if(!['starter','growth','operator'].includes(plan))return res.status(400).json({error:'Invalid plan'});
  const sub=(await db.query('SELECT * FROM subscriptions WHERE workspace_id=$1',[w.id])).rows[0];if(sub?.stripe_subscription_id&&['active','trialing','past_due'].includes(sub.status))return res.status(409).json({error:'A subscription already exists. Use the billing portal to manage it.'});
  const price=await config.get(`stripe_price_${plan}`);if(!price)return res.status(412).json({error:`Stripe price for ${plan} is not configured yet`});const base=await config.get('public_app_url');if(!base)return res.status(412).json({error:'Public application URL is not configured yet'});
  try{
    let customer=sub?.stripe_customer_id;
    if(!customer){const body={'metadata[workspace_id]':w.id,'metadata[workspace_name]':w.name};if(req.user.email)body.email=req.user.email;const c=await api.stripe.post('/v1/customers',{body});if(c.status<200||c.status>=300)return res.status(502).json({error:'Stripe customer creation failed'});customer=c.body.id;await db.query('UPDATE subscriptions SET stripe_customer_id=$1,updated_at=now() WHERE workspace_id=$2',[customer,w.id]);}
    const checkoutBody={mode:'subscription',customer,'line_items[0][price]':price,'line_items[0][quantity]':'1',success_url:`${base}/?checkout=success#billing`,cancel_url:`${base}/?checkout=cancelled#billing`,client_reference_id:w.id,'metadata[workspace_id]':w.id,'metadata[plan]':plan,'subscription_data[metadata][workspace_id]':w.id,'subscription_data[metadata][plan]':plan,allow_promotion_codes:'true',integration_identifier:'vantory_sa_djkwqzmx'};
    const trialEnd=Math.floor(new Date(w.trial_ends_at).getTime()/1000);const now=Math.floor(Date.now()/1000);if(Number.isFinite(trialEnd)&&trialEnd>now+172800)checkoutBody['subscription_data[trial_end]']=String(trialEnd);
    const s=await api.stripe.post('/v1/checkout/sessions',{body:checkoutBody});
    if(s.status<200||s.status>=300||!s.body?.url)return res.status(502).json({error:'Stripe Checkout session creation failed'});return res.json({url:s.body.url});
  }catch(e){if(e.code==='SetupRequired')return res.status(412).json({error:'Connect Stripe in Hatchable Setup before starting Checkout'});throw e;}
}
