import React, { useState, useEffect } from 'react';
import { Workspace } from '../types';
import { supabase, logoutUser } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { AuthModal } from './Modals/AuthModal';
import { 
  Search, 
  Bell, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Command, 
  Plus, 
  UserCheck, 
  Calendar, 
  CheckCircle2, 
  BarChart3,
  MessageSquare,
  Sun,
  Moon,
  LogIn,
  LogOut,
  Database,
  UserPlus
} from 'lucide-react';

interface TopHeaderBarProps {
  currentWorkspace: Workspace;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTopUp: () => void;
  themeMode?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const TopHeaderBar: React.FC<TopHeaderBarProps> = ({
  currentWorkspace,
  activeTab,
  setActiveTab,
  onOpenTopUp,
  themeMode = 'light',
  onToggleTheme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const isLight = themeMode === 'light';

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Map active tab to breadcrumb title & category
  const getTabDetails = (tab: string) => {
    switch (tab) {
      case 'overview':
        return { category: 'Dashboard', title: 'Workspace Command Center' };
      case 'studio':
        return { category: 'Creation & Studio', title: 'AI Asset Generator Studio' };
      case 'influencers':
        return { category: 'Creation & Studio', title: 'AI Influencer Persona Studio' };
      case 'approvals':
        return { category: 'Publishing & Queue', title: 'Brand Approvals & Review Queue' };
      case 'scheduler':
        return { category: 'Publishing & Queue', title: 'Visual Social Calendar & Scheduler' };
      case 'engagement':
        return { category: 'Publishing & Queue', title: 'Smart Engagement & Auto-Replies' };
      case 'publisher':
        return { category: 'Publishing & Queue', title: 'Direct Social Channel Publisher' };
      case 'analytics':
        return { category: 'Intelligence & Brand', title: 'Campaign Performance Analytics' };
      case 'brand_library':
        return { category: 'Intelligence & Brand', title: 'Brand Identity Kit & Voice Rules' };
      case 'billing':
        return { category: 'Admin & Governance', title: 'Credits Ledger & Subscription Billing' };
      case 'presence':
        return { category: 'Admin & Governance', title: 'Team Members & Role Access' };
      case 'webhooks':
        return { category: 'Admin & Governance', title: 'Security, Webhooks & GDPR Tools' };
      case 'audit_inspector':
        return { category: 'Admin & Governance', title: 'Automated Audit Inspector' };
      default:
        return { category: 'Workspace', title: 'Overview' };
    }
  };

  const { category, title } = getTabDetails(activeTab);

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors duration-200 border-b ${
      isLight 
        ? 'bg-white/90 border-slate-200/90 shadow-sm' 
        : 'bg-slate-950/90 border-slate-800/80'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Breadcrumb & Title */}
        <div className="flex items-center space-x-3">
          <div>
            <div className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <span>{currentWorkspace.name}</span>
              <span>/</span>
              <span className={isLight ? 'text-indigo-600 font-extrabold' : 'text-indigo-400'}>{category}</span>
            </div>
            <h1 className={`text-base font-extrabold tracking-tight leading-tight mt-0.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {title}
            </h1>
          </div>
        </div>

        {/* Center: Search / Command Palette Bar */}
        <div className="flex-1 max-w-md hidden md:block mx-4">
          <div className="relative">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets, campaigns, trends, or type '⌘K'..."
              className={`w-full rounded-xl pl-9 pr-12 py-1.5 text-xs outline-none transition-all ${
                isLight 
                  ? 'bg-slate-100/80 border border-slate-200 hover:border-slate-300 focus:border-indigo-600 text-slate-900 placeholder-slate-400' 
                  : 'bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/80 text-slate-200 placeholder-slate-500'
              }`}
            />
            <div className={`absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
              isLight ? 'bg-slate-200 text-slate-600 border border-slate-300' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Theme Toggle, Credits & Notifications */}
        <div className="flex items-center space-x-3 justify-between sm:justify-end">
          {/* Style 3 Theme Switcher */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isLight
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Toggle Style 3 High-Contrast Light vs Dark Theme"
            >
              {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline text-[11px] font-extrabold">{isLight ? 'Style 3: Executive Light' : 'Dark Studio'}</span>
            </button>
          )}

          {/* Status Badge */}
          <div className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
            isLight
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-emerald-950/60 border-emerald-800/50 text-emerald-400'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pre-Production</span>
          </div>

          {/* Team Avatar Stack */}
          <div className="hidden xl:flex items-center space-x-1.5">
            <div className="flex -space-x-2 overflow-hidden">
              {currentWorkspace.members.slice(0, 3).map((m) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.name}
                  title={`${m.name} (${m.role})`}
                  className={`w-7 h-7 rounded-full ring-2 object-cover ${
                    isLight ? 'ring-white' : 'ring-slate-950'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Quick Action Trigger */}
          <button
            onClick={() => setActiveTab('studio')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Asset</span>
          </button>

          {/* Supabase Authentication & Account Sync */}
          {!authLoading && (
            user ? (
              <div className={`flex items-center space-x-2 pl-2 pr-2.5 py-1 rounded-xl border text-xs ${
                isLight ? 'bg-amber-50/80 border-amber-200 text-amber-900' : 'bg-slate-900 border-amber-500/30 text-amber-300'
              }`}>
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata?.avatar_url} alt={user.user_metadata?.display_name || 'User'} className="w-5 h-5 rounded-full object-cover border border-amber-400" />
                ) : (
                  <Database className="w-4 h-4 text-amber-500" />
                )}
                <span className="font-bold truncate max-w-[100px] hidden md:inline">{user.user_metadata?.display_name || user.email?.split('@')[0]}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-600 font-mono font-bold px-1.5 py-0.5 rounded">Supabase Active</span>
                <button
                  onClick={() => logoutUser()}
                  title="Sign out"
                  className="p-1 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Up</span>
                </button>
              </div>
            )
          )}

          {/* Dark / Light Theme Toggle Trigger */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
              className={`px-2.5 py-2 rounded-xl border transition-all flex items-center space-x-1.5 text-xs font-semibold ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isLight ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />
                  <span className="hidden md:inline text-[11px] font-bold">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  <span className="hidden md:inline text-[11px] font-bold">Light</span>
                </>
              )}
            </button>
          )}

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationToast(!showNotificationToast)}
              className={`p-2 rounded-xl border transition-colors relative ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500" />
            </button>

            {/* Notification Toast Dropdown */}
            {showNotificationToast && (
              <div className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-fade-in text-xs border ${
                isLight 
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-slate-900 border-slate-800 text-slate-200'
              }`}>
                <div className={`flex items-center justify-between border-b pb-2 ${
                  isLight ? 'border-slate-100' : 'border-slate-800'
                }`}>
                  <span className={`font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>Notifications</span>
                  <span className="text-[10px] text-indigo-600 font-bold">2 New</span>
                </div>
                <div className="space-y-2">
                  <div className={`p-2.5 rounded-xl border space-y-1 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <p className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>AI Auto-Reply Ready</p>
                    <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>4 new user comments on LinkedIn ready for approval.</p>
                  </div>
                  <div className={`p-2.5 rounded-xl border space-y-1 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <p className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Trend Surge Alert</p>
                    <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Autonomous AI Agents trending on LinkedIn & Twitter (+240%).</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        themeMode={themeMode}
      />
    </header>
  );
};
