import { db } from 'hatchable';
import { requireWorkspace } from 'lib/tenant.js';
export const access='user';export const methods=['GET','POST'];
export default async function(req,res){
  const w=await requireWorkspace(req,res);if(!w)return;
  if(req.method==='GET'){const {rows}=await db.query('SELECT * FROM customers WHERE workspace_id=$1 ORDER BY created_at DESC LIMIT 200',[w.id]);return res.json({items:rows});}
  const name=String(req.body?.name||'').trim().slice(0,160);if(!name)return res.status(400).json({error:'Name required'});
  const phone=String(req.body?.phone||'').trim().slice(0,40)||null,email=String(req.body?.email||'').trim().toLowerCase().slice(0,254)||null,address=String(req.body?.address||'').trim().slice(0,500)||null,source=String(req.body?.source||'').trim().slice(0,120)||null,notes=String(req.body?.notes||'').trim().slice(0,5000)||null;
  const {rows}=await db.query('INSERT INTO customers (workspace_id,name,phone,email,address,source,notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',[w.id,name,phone,email,address,source,notes]);
  return res.status(201).json({item:rows[0]});
}
