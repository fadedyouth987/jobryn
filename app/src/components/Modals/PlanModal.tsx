import React from 'react';
import { Workspace } from '../../types';
import { Layers, CheckCircle2, X } from 'lucide-react';

interface PlanModalProps {
  currentWorkspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: 'starter' | 'professional' | 'enterprise') => void;
}

export const PlanModal: React.FC<PlanModalProps> = ({
  currentWorkspace,
  isOpen,
  onClose,
  onSelectPlan,
}) => {
  if (!isOpen) return null;

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$99 / mo',
      credits: '1,000 Credits / mo',
      features: ['Up to 3 Team Members', 'Standard AI Generation', 'Basic Social Publishing'],
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$299 / mo',
      credits: '3,000 Credits / mo',
      features: ['Up to 10 Team Members', 'Gemini 3.7 Flash Generation', 'Workflow Approvals & Locks', 'SSRF Webhook Egress Guard'],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$899 / mo',
      credits: '10,000 Credits / mo',
      features: ['Unlimited Members & Roles', 'Multi-tenant RBAC Security', '2-Step GDPR Data Erasure', 'Dedicated Outbox Ledger', 'Priority Support'],
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 text-center max-w-md mx-auto">
          <h3 className="text-xl font-extrabold text-white">Select Workspace Subscription Plan</h3>
          <p className="text-xs text-slate-400">
            Current plan: <strong className="text-slate-200 uppercase">{currentWorkspace.plan}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => {
            const isCurrent = currentWorkspace.plan === p.id;
            return (
              <div
                key={p.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 relative ${
                  isCurrent
                    ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-extrabold text-[9px] uppercase px-2.5 py-0.5 rounded-full shadow-md">
                    Most Popular
                  </span>
                )}

                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white">{p.name}</h4>
                  <div className="text-xl font-extrabold text-slate-100 font-mono">{p.price}</div>
                  <span className="text-[11px] font-semibold text-indigo-400 block">{p.credits}</span>

                  <ul className="space-y-1.5 pt-2 text-[11px] text-slate-300">
                    {p.features.map((f, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    onSelectPlan(p.id as any);
                    onClose();
                  }}
                  disabled={isCurrent}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {isCurrent ? 'Current Active Plan' : `Switch to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
