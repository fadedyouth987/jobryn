import React from 'react';
import { Workspace } from '../types';
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Calendar, 
  CreditCard, 
  Users, 
  ShieldCheck, 
  Activity, 
  ChevronDown, 
  PlusCircle,
  Zap,
  BarChart3,
  Palette,
  UserCheck,
  MessageSquare
} from 'lucide-react';

interface HeaderProps {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  onSelectWorkspace: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTopUp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWorkspace,
  workspaces,
  onSelectWorkspace,
  activeTab,
  setActiveTab,
  onOpenTopUp,
}) => {
  // Navigation items structured cleanly by category
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'studio', label: 'AI Asset Studio', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'influencers', label: 'Influencer Studio', icon: <UserCheck className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'approvals', label: 'Approvals', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'publisher', label: 'Publisher', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'scheduler', label: 'Social Scheduler', icon: <Calendar className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'engagement', label: 'Smart Engagement', icon: <MessageSquare className="w-3.5 h-3.5 text-pink-400" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'brand_library', label: 'Brand Kit', icon: <Palette className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'presence', label: 'Team', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'webhooks', label: 'Security & GDPR', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'audit_inspector', label: 'Audit Inspector', icon: <Activity className="w-3.5 h-3.5 text-emerald-400" />, highlight: true },
  ];


  return (
    <header className="bg-slate-950 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md bg-slate-950/95">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between border-b border-slate-900 text-xs">
        {/* Left: System Status Pill */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 font-medium text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Jobryn Pre-Production Foundation</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline text-[11px]">P0/P1 Blockers Resolved</span>
        </div>

        {/* Right: Active Member Stack & Workspace Switcher */}
        <div className="flex items-center space-x-4">
          {/* Presence Stack */}
          <div className="hidden md:flex items-center space-x-1.5 text-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Team:</span>
            <div className="flex -space-x-1.5 overflow-hidden">
              {currentWorkspace.members.slice(0, 4).map((m) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.name}
                  title={`${m.name} (${m.role}) - ${m.status}`}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-950 object-cover"
                />
              ))}
            </div>
          </div>

          {/* Workspace Switcher */}
          <div className="relative group">
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors text-xs">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="font-semibold text-slate-200">{currentWorkspace.name}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                {currentWorkspace.plan}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Dropdown */}
            <div className="absolute right-0 mt-1 w-60 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Switch Workspace
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => onSelectWorkspace(ws.id)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                    ws.id === currentWorkspace.id ? 'text-indigo-400 font-semibold bg-indigo-950/30' : 'text-slate-300'
                  }`}
                >
                  <span>{ws.name}</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{ws.plan}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Credits Counter Pill */}
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg text-xs">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-bold text-slate-100">{currentWorkspace.creditsRemaining.toLocaleString()}</span>
            <span className="text-[11px] text-slate-400">credits</span>
            <button
              onClick={onOpenTopUp}
              className="ml-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 p-1 rounded transition-colors"
              title="Add Credits"
            >
              <PlusCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row - Uncrowded, Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('overview')} 
          className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-base text-white tracking-tight">LAUNCHPAD</span>
            <span className="text-[9px] font-extrabold bg-indigo-900/80 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-700/50">
              PRO
            </span>
          </div>
        </div>

        {/* Desktop Nav Tabs with Optimal Padding & Hierarchy */}
        <nav className="hidden xl:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? item.highlight
                      ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/30'
                      : 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                    : item.highlight
                      ? 'text-emerald-400 hover:bg-emerald-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Medium Screen Nav (Compact Icons + Text) */}
        <nav className="hidden lg:flex xl:hidden items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80 overflow-x-auto max-w-xl">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile / Tablet View Selector Dropdown */}
        <div className="lg:hidden flex items-center space-x-2">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 font-medium outline-none focus:border-indigo-500"
          >
            <option value="overview">Overview</option>
            <option value="studio">AI Asset Studio</option>
            <option value="influencers">AI Influencer Studio</option>
            <option value="approvals">Approvals Queue</option>
            <option value="publisher">Social Publisher</option>
            <option value="scheduler">Social Scheduler (Calendar)</option>
            <option value="engagement">Smart Engagement (Auto-Replies)</option>
            <option value="analytics">Campaign Analytics</option>
            <option value="brand_library">Brand Kit & Rules</option>
            <option value="billing">Ledger & Billing</option>
            <option value="presence">Team & Roles</option>
            <option value="webhooks">Security & GDPR</option>
            <option value="audit_inspector">Audit Inspector</option>
          </select>
        </div>
      </div>
    </header>
  );
};
