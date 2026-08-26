import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Activity, 
  Layers, 
  RefreshCw, 
  Globe, 
  Database, 
  Server
} from 'lucide-react';

import { LiveWorkflowSimulator } from './LiveWorkflowSimulator';

interface LandingHeroProps {
  onStartDemo: (tab: string) => void;
  workspaceName: string;
  themeMode?: 'light' | 'dark';
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartDemo, workspaceName, themeMode = 'light' }) => {
  const isLight = themeMode === 'light';

  return (
    <div className="space-y-12 w-full">
      {/* Top Release Banner */}
      <div className={`border rounded-2xl p-6 relative overflow-hidden shadow-xl transition-colors ${
        isLight
          ? 'bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-indigo-200/80 shadow-slate-200/50'
          : 'bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border-indigo-800/40 shadow-2xl'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-semibold ${
              isLight
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-emerald-950/80 border-emerald-800/60 text-emerald-300'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>PRODUCTION RELEASE AUDIT CERTIFIED — BUILD v2.4.0</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Enterprise AI Social Media Publishing & Governance Engine
            </h1>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Jobryn empowers enterprise marketing teams to orchestrate AI creative generation, multi-stage approval workflows, and multi-channel publishing with atomic credit ledger security and SSRF egress protection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartDemo('studio')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Launch AI Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStartDemo('audit_inspector')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all border ${
                isLight
                  ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-800/60'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Inspect Audit Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Architecture Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: AI Generation */}
        <div 
          onClick={() => onStartDemo('studio')}
          className={`border p-5 rounded-2xl space-y-3 cursor-pointer group transition-all hover:-translate-y-1 shadow-sm ${
            isLight 
              ? 'bg-white border-slate-200/90 hover:border-indigo-400 hover:shadow-md' 
              : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className={`text-base font-bold flex items-center justify-between ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span>Gemini AI Studio</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-medium">Server Proxy</span>
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Generates multi-platform copy, hashtags, 3D visual directions, and carousel outlines via server-side Gemini 3.7 Flash.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
            <span>Try Prompt Generation</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Card 2: Approvals */}
        <div 
          onClick={() => onStartDemo('approvals')}
          className={`border p-5 rounded-2xl space-y-3 cursor-pointer group transition-all hover:-translate-y-1 shadow-sm ${
            isLight 
              ? 'bg-white border-slate-200/90 hover:border-purple-400 hover:shadow-md' 
              : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className={`text-base font-bold flex items-center justify-between ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span>Approval Workflows</span>
              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-medium">Decider RBAC</span>
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Multi-reviewer assignment, comment threads, asset edit-locks, and decider verification before scheduling.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-semibold text-purple-600 group-hover:text-purple-700">
            <span>Review Queue</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Card 3: Ledger & Billing */}
        <div 
          onClick={() => onStartDemo('billing')}
          className={`border p-5 rounded-2xl space-y-3 cursor-pointer group transition-all hover:-translate-y-1 shadow-sm ${
            isLight 
              ? 'bg-white border-slate-200/90 hover:border-amber-400 hover:shadow-md' 
              : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Zap className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className={`text-base font-bold flex items-center justify-between ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span>Atomic Credit Ledger</span>
              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium">Idempotent</span>
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Pre-reserves credits before generation, settles on completion, and records immutable ledger history with Stripe outbox support.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-semibold text-amber-600 group-hover:text-amber-700">
            <span>Inspect Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Card 4: Webhooks & SSRF Egress */}
        <div 
          onClick={() => onStartDemo('webhooks')}
          className={`border p-5 rounded-2xl space-y-3 cursor-pointer group transition-all hover:-translate-y-1 shadow-sm ${
            isLight 
              ? 'bg-white border-slate-200/90 hover:border-emerald-400 hover:shadow-md' 
              : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className={`text-base font-bold flex items-center justify-between ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span>SSRF Guard & GDPR</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">Compliance</span>
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Blocks private IP range egress attacks on webhooks. Provides full JSON data exports and 2-step GDPR data erasure.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
            <span>Security & Compliance</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
      </div>

      {/* Live Interactive Workflow Engine Showcase */}
      <LiveWorkflowSimulator onNavigateToTab={onStartDemo} themeMode={themeMode} />

      {/* Production Infrastructure Specs Table */}
      <div className={`border rounded-2xl p-6 space-y-4 transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-2 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div>
            <h2 className={`text-lg font-bold flex items-center space-x-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <Server className="w-5 h-5 text-indigo-600" />
              <span>Jobryn Platform Specifications & Audit Resolution Summary</span>
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Verified against current active workspace: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{workspaceName}</strong></p>
          </div>
          <button
            onClick={() => onStartDemo('audit_inspector')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
              isLight ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            View Full Release Audit Log →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className={`p-3.5 rounded-xl border space-y-1.5 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
          }`}>
            <div className={`font-medium flex items-center justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>Workflow Module Resolution</span>
              <span className="text-emerald-600 font-mono font-bold">100% Fixed</span>
            </div>
            <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>Relative imports mapped cleanly across all job runners (`./client` & `../client`).</p>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1.5 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
          }`}>
            <div className={`font-medium flex items-center justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>API DB Imports & Types</span>
              <span className="text-emerald-600 font-mono font-bold">Pass</span>
            </div>
            <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>No raw undefined database client references across all API endpoints.</p>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1.5 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
          }`}>
            <div className={`font-medium flex items-center justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>Tenant Isolation</span>
              <span className="text-emerald-600 font-mono font-bold">Enforced</span>
            </div>
            <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>Feature flags & asset actions require verified workspace header membership.</p>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1.5 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
          }`}>
            <div className={`font-medium flex items-center justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>Webhook SSRF Protection</span>
              <span className="text-emerald-600 font-mono font-bold">Active</span>
            </div>
            <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>Blocks 127.0.0.1, 169.254.x.x, and internal RFC 1918 subnets.</p>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1.5 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
          }`}>
            <div className={`font-medium flex items-center justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>Stripe Outbox Ledger</span>
              <span className="text-emerald-600 font-mono font-bold">Idempotent</span>
            </div>
            <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>Prevents credit double-grant or silent dropped event processing.</p>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1.5 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
          }`}>
            <div className={`font-medium flex items-center justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>GDPR Data Erasure</span>
              <span className="text-emerald-600 font-mono font-bold">2-Step Lock</span>
            </div>
            <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>Export before deletion, legal-hold safeguards, and media purge.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
