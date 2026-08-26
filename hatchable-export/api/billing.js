import { db } from 'hatchable';
import { requireWorkspace } from 'lib/tenant.js';
export const access='user';export const methods=['GET'];
export default async function(req,res){const w=await requireWorkspace(req,res);if(!w)return;const {rows}=await db.query('SELECT plan,status,current_period_end,stripe_customer_id IS NOT NULL AS stripe_connected,stripe_subscription_id IS NOT NULL AS has_subscription FROM subscriptions WHERE workspace_id=$1',[w.id]);return res.json({workspace:{id:w.id,plan:w.plan,subscription_status:w.subscription_status,trial_ends_at:w.trial_ends_at,member_role:w.member_role},subscription:rows[0]||null});}
