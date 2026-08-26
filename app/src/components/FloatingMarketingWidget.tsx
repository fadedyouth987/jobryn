import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Play, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Maximize2, 
  ChevronUp, 
  ChevronDown,
  Video,
  Globe,
  Award,
  Users
} from 'lucide-react';

interface FloatingMarketingWidgetProps {
  onNavigateToTab?: (tab: string) => void;
  themeMode?: 'light' | 'dark';
}

export const FloatingMarketingWidget: React.FC<FloatingMarketingWidgetProps> = ({ onNavigateToTab, themeMode = 'light' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const isLight = themeMode === 'light';

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-5 right-5 z-50 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-full shadow-2xl border border-indigo-400/30 flex items-center space-x-2 transition-all hover:scale-105 group"
        title="Open Jobryn Showcase"
      >
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        <span className="text-xs font-extrabold pr-1 hidden sm:inline">Jobryn Capabilities</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full px-2 sm:px-0 transition-all duration-300">
      {/* Compact Floating Bar */}
      {!isOpen ? (
        <div className={`border rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl space-y-2.5 relative overflow-hidden transition-colors ${
          isLight
            ? 'bg-white/95 border-indigo-200 text-slate-900 shadow-indigo-100'
            : 'bg-slate-900/95 border-indigo-500/50 text-white'
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className={`text-xs font-black tracking-wide uppercase flex items-center space-x-1 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <span>LAUNCHPAD SHOWCASE</span>
                <span className={`text-[9px] border px-1.5 py-0.2 rounded font-medium ${
                  isLight ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-indigo-950 text-indigo-300 border-indigo-700/50'
                }`}>
                  v2.4 Live
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(true)}
                className={`p-1 rounded-lg transition-colors ${
                  isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Expand Showcase"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className={`p-1 rounded-lg transition-colors ${
                  isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Minimize"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className={`text-xs leading-snug ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Automate <strong className="text-indigo-600">AI Video Ads</strong>, photorealistic presenters & multi-platform publishing with enterprise security.
          </p>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => setIsOpen(true)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Explore Capability Gallery</span>
            </button>
          </div>
        </div>
      ) : (
        /* Expanded Floating Showcase Dialog */
        <div className={`border rounded-3xl p-5 shadow-2xl backdrop-blur-2xl space-y-4 relative overflow-hidden max-h-[85vh] overflow-y-auto custom-scrollbar transition-colors ${
          isLight
            ? 'bg-white border-indigo-200 text-slate-900 shadow-slate-300'
            : 'bg-slate-900 border-indigo-500/60 text-white'
        }`}>
          {/* Header */}
          <div className={`flex items-start justify-between border-b pb-3 ${
            isLight ? 'border-slate-100' : 'border-slate-800'
          }`}>
            <div>
              <div className="inline-flex items-center space-x-1.5 text-indigo-600 text-[11px] font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>WHAT LAUNCHPAD ACTUALLY DOES</span>
              </div>
              <h3 className={`text-base font-extrabold mt-0.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                AI Social Ad Studio & Governance
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1.5 rounded-xl transition-colors ${
                isLight ? 'bg-slate-100 text-slate-600 hover:text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Showcase Grid of Capabilities */}
          <div className="space-y-3 text-xs">
            {/* Feature 1: AI Video Ads */}
            <div className={`p-3 rounded-2xl border space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center space-x-1.5 text-indigo-600">
                  <Video className="w-4 h-4 text-indigo-600" />
                  <span>1. AI Video Ads & Scripting</span>
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                  isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                }`}>
                  30s Render
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" 
                  alt="AI Video Ad Creative" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-extrabold text-amber-300 leading-tight">
                    "🔥 Stop buying expensive headphones before seeing this..."
                  </span>
                </div>
              </div>
            </div>

            {/* Feature 2: Photorealistic Avatars */}
            <div className={`p-3 rounded-2xl border space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center space-x-1.5 text-purple-600">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>2. Photorealistic AI Presenters</span>
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                  isLight ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-purple-950 text-purple-300 border-purple-800/50'
                }`}>
                  Voice Lip-Sync
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" 
                  alt="Emma AI" 
                  className="w-full h-16 rounded-xl object-cover border border-purple-200"
                  referrerPolicy="no-referrer"
                />
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" 
                  alt="Marcus AI" 
                  className="w-full h-16 rounded-xl object-cover border border-purple-200"
                  referrerPolicy="no-referrer"
                />
                <img 
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80" 
                  alt="Aria AI" 
                  className="w-full h-16 rounded-xl object-cover border border-purple-200"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Feature 3: Multi-Platform Sync & Security */}
            <div className={`p-3 rounded-2xl border space-y-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center space-x-1.5 text-emerald-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>3. Multi-Channel & SSRF Guard</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-mono font-semibold">Verified</span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Direct auto-posting to TikTok, Instagram, LinkedIn, and X with multi-approver locks and SSRF egress blocking.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            {onNavigateToTab && (
              <button
                onClick={() => {
                  onNavigateToTab('influencer_studio');
                  setIsOpen(false);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors text-center shadow-md"
              >
                Try Influencer Studio
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className={`font-medium text-xs py-2.5 px-3 rounded-xl transition-colors border ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
