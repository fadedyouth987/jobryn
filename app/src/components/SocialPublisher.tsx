import React, { useState } from 'react';
import { CampaignAsset, Workspace, Platform } from '../types';
import { 
  Calendar, 
  Send, 
  CheckCircle2, 
  Clock, 
  Globe, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Facebook, 
  Video, 
  RefreshCw, 
  Sparkles, 
  Smartphone,
  Eye,
  Plus,
  MessageSquare,
  Bot
} from 'lucide-react';

interface SocialPublisherProps {
  currentWorkspace: Workspace;
  assets: CampaignAsset[];
  onPublishNow: (assetId: string) => void;
}

export const SocialPublisher: React.FC<SocialPublisherProps> = ({
  currentWorkspace,
  assets,
  onPublishNow,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('linkedin');
  const [previewAssetId, setPreviewAssetId] = useState<string | null>(null);

  const workspaceAssets = assets.filter((a) => a.workspaceId === currentWorkspace.id);
  const scheduledAssets = workspaceAssets.filter((a) => a.status === 'scheduled' || a.status === 'approved');

  const selectedAsset = workspaceAssets.find((a) => a.id === previewAssetId) || scheduledAssets[0] || workspaceAssets[0] || null;

  // Social Channels Status Mock
  const channels = [
    { platform: 'linkedin', handle: 'Acme Corp (Company Page)', status: 'Active', icon: <Linkedin className="w-4 h-4 text-blue-400" />, tokenExpires: 'in 58 days' },
    { platform: 'instagram', handle: '@acme_official', status: 'Active', icon: <Instagram className="w-4 h-4 text-pink-400" />, tokenExpires: 'in 42 days' },
    { platform: 'tiktok', handle: '@acmetok_global', status: 'Active', icon: <Video className="w-4 h-4 text-teal-400" />, tokenExpires: 'in 30 days' },
    { platform: 'twitter', handle: '@acme_tech', status: 'Active', icon: <Twitter className="w-4 h-4 text-sky-400" />, tokenExpires: 'in 85 days' },
    { platform: 'facebook', handle: 'Acme Brand Page', status: 'Active', icon: <Facebook className="w-4 h-4 text-indigo-400" />, tokenExpires: 'in 60 days' },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/60">
              <Calendar className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white">Multi-Channel Social Publisher</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60">
              Auto Dispatch Engine
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Schedule, preview, and dispatch multi-platform content across active enterprise channel tokens.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>5 Active Accounts Connected</span>
        </div>
      </div>

      {/* Social Accounts Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {channels.map((ch) => (
          <div key={ch.platform} className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                {ch.icon}
                <span className="font-bold text-slate-200 capitalize">{ch.platform}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate">{ch.handle}</p>
            <span className="text-[10px] text-slate-500 block">Token valid: {ch.tokenExpires}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Scheduled Content Calendar (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Approved & Scheduled Queue ({scheduledAssets.length})</span>
            </h3>
            <span className="text-xs text-slate-500">Auto-publishes at scheduled timestamps</span>
          </div>

          <div className="space-y-3">
            {scheduledAssets.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl text-center text-slate-400 text-xs space-y-2">
                <p>No content currently scheduled for auto-publishing.</p>
                <p className="text-[11px] text-slate-500">Submit assets through AI Studio and approve them in the Approval Queue to populate this schedule.</p>
              </div>
            ) : (
              scheduledAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setPreviewAssetId(asset.id)}
                  className={`p-4 rounded-2xl border transition-all space-y-3 cursor-pointer ${
                    selectedAsset?.id === asset.id
                      ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white capitalize bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {asset.platform}
                      </span>
                      <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{asset.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {asset.caption}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">
                      Scheduled: <strong className="text-slate-200">{asset.scheduledTime ? new Date(asset.scheduledTime).toLocaleDateString() : 'Immediate'}</strong>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPublishNow(asset.id);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center space-x-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Publish Now</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Platform Device Live Preview Wrapper (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>Platform Device Preview</span>
            </h3>
            <span className="text-xs font-mono text-indigo-400 uppercase">{selectedAsset?.platform || 'linkedin'}</span>
          </div>

          {selectedAsset ? (
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
              {/* Device Header Simulator */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                    AC
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Acme Corp Official</span>
                    <span className="text-[10px] text-slate-400">Promoted • Enterprise SaaS</span>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full capitalize">
                  {selectedAsset.platform}
                </span>
              </div>

              {/* Caption Text Body */}
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {selectedAsset.caption}
              </div>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1">
                {selectedAsset.hashtags.map((h, i) => (
                  <span key={i} className="text-[11px] text-indigo-400 font-medium">
                    {h}
                  </span>
                ))}
              </div>

              {/* Mock Visual Asset Box */}
              <div className="w-full h-48 bg-slate-900 rounded-2xl border border-slate-800/80 p-4 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-0.5 max-w-xs">
                  <span className="text-xs font-bold text-white block">Visual Art Direction</span>
                  <p className="text-[10px] text-slate-400 line-clamp-2 italic">{selectedAsset.visualDirection}</p>
                </div>
              </div>

              {/* Device Footer Actions */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Like • Comment • Repost</span>
                <span className="text-emerald-400 font-medium">Token Status: Valid</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              Select an asset to see live native device formatting.
            </div>
          )}
        </div>
      </div>

      {/* Smart Engagement Teaser Bar */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-800/60 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <span className="p-3 rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-600/30">
            <Bot className="w-5 h-5" />
          </span>
          <div>
            <h4 className="text-sm font-extrabold text-white">Smart Engagement & AI Auto-Replies</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              4 user comments pending approval across LinkedIn, Instagram, and TikTok.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-purple-300">
          <span>Switch to the <strong>Smart Engagement</strong> tab to review AI auto-reply suggestions.</span>
        </div>
      </div>
    </div>
  );
};
