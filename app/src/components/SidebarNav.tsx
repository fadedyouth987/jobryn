import React, { useState } from 'react';
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
  MessageSquare,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Sliders,
  Globe,
  Bell,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarNavProps {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  onSelectWorkspace: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTopUp: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  themeMode?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentWorkspace,
  workspaces,
  onSelectWorkspace,
  activeTab,
  setActiveTab,
  onOpenTopUp,
  isCollapsed,
  setIsCollapsed,
  themeMode = 'light',
  onToggleTheme,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const isLight = themeMode === 'light';

  // Grouped Navigation Structure
  const navGroups = [
    {
      groupTitle: 'Creation & Studio',
      items: [
        { id: 'overview', label: 'Overview', icon: <Sparkles className="w-4 h-4 text-indigo-400" /> },
        { id: 'campaign_os', label: 'Campaign OS', icon: <Activity className="w-4 h-4 text-cyan-400" />, badge: 'New' },
        { id: 'studio', label: 'AI Asset Studio', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
        { id: 'influencers', label: 'AI Influencer Studio', icon: <UserCheck className="w-4 h-4 text-purple-400" /> },
      ],
    },
    {
      groupTitle: 'Publishing & Queue',
      items: [
        { id: 'approvals', label: 'Approvals Queue', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
        { id: 'scheduler', label: 'Social Scheduler', icon: <Calendar className="w-4 h-4 text-blue-400" />, badge: 'Drag&Drop' },
        { id: 'engagement', label: 'Smart Engagement', icon: <MessageSquare className="w-4 h-4 text-pink-400" />, badge: 'AI Replies' },
        { id: 'publisher', label: 'Social Publisher', icon: <Globe className="w-4 h-4 text-slate-400" /> },
      ],
    },
    {
      groupTitle: 'Intelligence & Brand',
      items: [
        { id: 'analytics', label: 'Campaign Analytics', icon: <BarChart3 className="w-4 h-4 text-purple-400" /> },
        { id: 'brand_library', label: 'Brand Kit & Rules', icon: <Palette className="w-4 h-4 text-indigo-400" /> },
      ],
    },
    {
      groupTitle: 'Admin & Governance',
      items: [
        { id: 'billing', label: 'Ledger & Billing', icon: <CreditCard className="w-4 h-4 text-slate-400" /> },
        { id: 'presence', label: 'Team Presence', icon: <Users className="w-4 h-4 text-slate-400" /> },
        { id: 'webhooks', label: 'Security & Webhooks', icon: <ShieldCheck className="w-4 h-4 text-slate-400" /> },
        { id: 'audit_inspector', label: 'Audit Inspector', icon: <Activity className="w-4 h-4 text-emerald-400" />, badge: 'Certified' },
      ],
    },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className={`lg:hidden sticky top-0 z-50 p-3 flex items-center justify-between backdrop-blur-md border-b ${
        isLight ? 'bg-white/90 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
      }`}>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`p-2 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white font-extrabold text-xs">L</span>
            <span className={`font-extrabold text-sm tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Jobryn</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenTopUp}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border font-bold text-xs ${
              isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-amber-950/80 border-amber-800/80 text-amber-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{currentWorkspace.credits}</span>
          </button>
        </div>
      </div>

      {/* DESKTOP & MOBILE SLIDE-OVER SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 border-r flex flex-col justify-between transition-all duration-300 ${
          isLight 
            ? 'bg-white border-slate-200 text-slate-900 shadow-sm' 
            : 'bg-slate-950 border-slate-800/80 text-white'
        } ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen
            ? 'translate-x-0 w-72 shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header Section */}
        <div className={`p-4 border-b space-y-4 ${isLight ? 'border-slate-100' : 'border-slate-900'}`}>
          {/* Brand Row + Collapse Toggle */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => setActiveTab('overview')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-600/20">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${
                  isLight ? 'bg-white group-hover:bg-slate-50' : 'bg-slate-950 group-hover:bg-slate-900'
                }`}>
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className={`text-sm font-extrabold tracking-tight leading-none ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>Jobryn</h1>
                  <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase">Enterprise Studio</span>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button (Desktop Only) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hidden lg:flex p-1.5 rounded-lg border transition-colors ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900' 
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Workspace Switcher Selector */}
          {!isCollapsed && (
            <div className="relative">
              <button
                onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
                className={`w-full border p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 hover:border-indigo-400 text-slate-900' 
                    : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                  <span className="font-extrabold truncate">{currentWorkspace.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                    isLight ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-indigo-950 text-indigo-300 border-indigo-800/60'
                  }`}>
                    {currentWorkspace.plan}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>

              {/* Workspace Dropdown Menu */}
              {isWorkspaceDropdownOpen && (
                <div className={`absolute left-0 right-0 mt-1.5 border rounded-xl shadow-2xl py-1 z-50 text-xs ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}>
                  <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b ${
                    isLight ? 'text-slate-400 border-slate-100' : 'text-slate-500 border-slate-800'
                  }`}>
                    Switch Workspace
                  </div>
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        onSelectWorkspace(ws.id);
                        setIsWorkspaceDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                        ws.id === currentWorkspace.id 
                          ? isLight ? 'bg-indigo-50 text-indigo-700 font-bold' : 'bg-indigo-950/60 text-indigo-300 font-bold'
                          : isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      {ws.id === currentWorkspace.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Middle Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              {!isCollapsed && (
                <div className={`px-2 text-[10px] font-extrabold uppercase tracking-wider ${
                  isLight ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {group.groupTitle}
                </div>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileOpen(false);
                      }}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                        isActive
                          ? isLight
                            ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-sm font-bold'
                            : 'bg-gradient-to-r from-indigo-900/60 to-purple-900/40 text-white border border-indigo-500/50 shadow-md shadow-indigo-950/30'
                          : isLight
                            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                      }`}
                    >
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full" />
                      )}

                      <div className="flex items-center space-x-3 truncate">
                        <span className="shrink-0">{item.icon}</span>
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                          isLight 
                            ? 'bg-slate-100 text-indigo-700 border-slate-200' 
                            : 'bg-slate-900 text-indigo-300 border-slate-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Credits & Quick Actions Section */}
        <div className={`p-3 border-t space-y-3 ${
          isLight ? 'border-slate-100 bg-slate-50/50' : 'border-slate-900 bg-slate-950/80'
        }`}>
          {/* AI Credits Meter */}
          {!isCollapsed ? (
            <div className={`p-3 rounded-2xl border space-y-2 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800/80'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold flex items-center space-x-1 ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>AI Credits</span>
                </span>
                <span className={`font-mono font-extrabold ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>{currentWorkspace.credits}</span>
              </div>

              {/* Progress Bar */}
              <div className={`w-full h-1.5 rounded-full overflow-hidden border ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div
                  className="bg-gradient-to-r from-amber-500 to-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (currentWorkspace.credits / 1000) * 100)}%` }}
                />
              </div>

              <button
                onClick={onOpenTopUp}
                className={`w-full border text-[11px] font-extrabold py-1.5 rounded-xl transition-all flex items-center justify-center space-x-1 ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-slate-950 hover:bg-slate-800 text-amber-300 border-amber-800/60 hover:border-amber-500'
                }`}
              >
                <PlusCircle className="w-3 h-3 text-amber-500" />
                <span>TOP UP CREDITS</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenTopUp}
              className={`w-full py-2.5 rounded-xl border flex items-center justify-center ${
                isLight ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-amber-950/80 border-amber-800 text-amber-300'
              }`}
              title="Top Up Credits"
            >
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            </button>
          )}

          {/* Dark Mode Toggle Button */}
          {onToggleTheme && (
            !isCollapsed ? (
              <button
                onClick={onToggleTheme}
                className={`w-full py-2 px-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                  <span>{isLight ? 'Light Mode' : 'Dark Mode'}</span>
                </span>
                <span className="text-[10px] font-mono uppercase font-bold text-indigo-500">
                  {isLight ? 'Switch to Dark' : 'Switch to Light'}
                </span>
              </button>
            ) : (
              <button
                onClick={onToggleTheme}
                className={`w-full py-2.5 rounded-xl border flex items-center justify-center transition-all ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
                title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>
            )
          )}

          {/* Quick Create Action Button */}
          {!isCollapsed ? (
            <button
              onClick={() => setActiveTab('studio')}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>CREATE NEW ASSET</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('studio')}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white flex items-center justify-center"
              title="Create New Asset"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30"
        />
      )}
    </>
  );
};
