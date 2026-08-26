import React, { useState } from 'react';
import { Workspace, CampaignAsset } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  Share2, 
  DollarSign, 
  Globe, 
  ArrowUpRight, 
  Linkedin, 
  Instagram, 
  Video, 
  Twitter, 
  Facebook,
  Filter,
  Calendar
} from 'lucide-react';

interface CampaignAnalyticsProps {
  currentWorkspace: Workspace;
  assets: CampaignAsset[];
}

export const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({
  currentWorkspace,
  assets,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const workspaceAssets = assets.filter((a) => a.workspaceId === currentWorkspace.id);

  // Performance Stat Overview
  const stats = [
    {
      title: 'Total Organic Reach',
      value: '284,920',
      change: '+24.8%',
      isPositive: true,
      icon: <Eye className="w-4 h-4 text-indigo-400" />,
      subtext: 'Across 5 active channels',
    },
    {
      title: 'Total Engagements',
      value: '38,410',
      change: '+18.2%',
      isPositive: true,
      icon: <ThumbsUp className="w-4 h-4 text-emerald-400" />,
      subtext: 'Likes, comments, & shares',
    },
    {
      title: 'Avg. Click-Through Rate',
      value: '4.62%',
      change: '+1.1%',
      isPositive: true,
      icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
      subtext: '2.8x industry benchmark',
    },
    {
      title: 'Estimated AI Generation ROI',
      value: '14.2x',
      change: '+$18.4k',
      isPositive: true,
      icon: <DollarSign className="w-4 h-4 text-amber-400" />,
      subtext: 'Saved agency production costs',
    },
  ];

  // Channel Breakdown Metrics
  const channelMetrics = [
    {
      platform: 'linkedin',
      name: 'LinkedIn Enterprise',
      icon: <Linkedin className="w-4 h-4 text-blue-400" />,
      impressions: '112,400',
      engagementRate: '5.8%',
      topFormat: '3D Tech Dashboards',
      status: 'Top Performer',
    },
    {
      platform: 'instagram',
      name: 'Instagram Brand',
      icon: <Instagram className="w-4 h-4 text-pink-400" />,
      impressions: '84,100',
      engagementRate: '4.2%',
      topFormat: 'Editorial Carousels',
      status: 'Steady Growth',
    },
    {
      platform: 'tiktok',
      name: 'TikTok Global',
      icon: <Video className="w-4 h-4 text-teal-400" />,
      impressions: '62,800',
      engagementRate: '7.1%',
      topFormat: 'Viral Growth Hooks',
      status: 'High Engagement',
    },
    {
      platform: 'twitter',
      name: 'X (Twitter) Tech',
      icon: <Twitter className="w-4 h-4 text-sky-400" />,
      impressions: '25,620',
      engagementRate: '3.1%',
      topFormat: 'Product Release Threads',
      status: 'Active',
    },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/60">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white">Campaign Performance & AI ROI Analytics</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60">
              Realtime Attribution
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Track multi-channel audience engagement, impressions, click-through rates, and AI content ROI.
          </p>
        </div>

        {/* Time Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              timeRange === '7d' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              timeRange === '30d' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              timeRange === '90d' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Quarter
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((st, idx) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{st.title}</span>
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">{st.icon}</div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-white font-mono">{st.value}</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3 h-3" />
                {st.change}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{st.subtext}</p>
          </div>
        ))}
      </div>

      {/* Channel Breakdown & Content Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Platform Metrics (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Multi-Platform Performance Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400">Attribution Window: <strong className="text-slate-200">30 Days</strong></span>
          </div>

          <div className="space-y-3">
            {channelMetrics.map((ch) => (
              <div key={ch.platform} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    {ch.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{ch.name}</h4>
                    <p className="text-[11px] text-slate-400">Best visual style: <strong className="text-slate-300">{ch.topFormat}</strong></p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-right text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Impressions</span>
                    <span className="font-mono font-bold text-slate-200">{ch.impressions}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Engagement</span>
                    <span className="font-mono font-bold text-emerald-400">{ch.engagementRate}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 hidden sm:inline-block">
                    {ch.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Content Efficiency Tracker (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-4">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>AI Production Velocity & Savings</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold">Content Asset Cycle Time</span>
                <span className="font-mono text-emerald-400 font-bold">12 Min / Asset</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-4/5 rounded-full"></div>
              </div>
              <p className="text-[11px] text-slate-400">Reduced from traditional 3-day copywriting & design cycles.</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold">Decider Approval Speed</span>
                <span className="font-mono text-indigo-400 font-bold">1.4 Hrs Avg</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-2/3 rounded-full"></div>
              </div>
              <p className="text-[11px] text-slate-400">Accelerated by locked-state RBAC review workflows.</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold">Credit Reserve Efficiency</span>
                <span className="font-mono text-amber-400 font-bold">98.4% Success</span>
              </div>
              <p className="text-[11px] text-slate-400">Zero duplicate credit spends due to idempotent outbox ledgering.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
