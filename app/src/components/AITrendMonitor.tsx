import React, { useState, useEffect } from 'react';
import { Platform } from '../types';
import { 
  TrendingUp, 
  Globe, 
  Search, 
  Sparkles, 
  Hash, 
  Calendar, 
  Copy, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw,
  Flame,
  Zap,
  Tag,
  Share2
} from 'lucide-react';

export interface TrendItem {
  id?: string;
  topic: string;
  hotnessScore: number;
  category?: string;
  summary: string;
  suggestedHashtags: string[];
  suggestedHook: string;
  suggestedPlatform: Platform;
  searchQueries?: string[];
}

interface AITrendMonitorProps {
  onQueueTrendToScheduler: (
    title: string, 
    caption: string, 
    platform: Platform, 
    hashtags: string[]
  ) => void;
}

export const AITrendMonitor: React.FC<AITrendMonitorProps> = ({ onQueueTrendToScheduler }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('AI, Tech & Digital Marketing');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [webSearchQueries, setWebSearchQueries] = useState<string[]>([]);
  const [groundingSource, setGroundingSource] = useState<string>('');
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null);
  const [queuedNotification, setQueuedNotification] = useState<string | null>(null);

  const categories = [
    'AI, Tech & Digital Marketing',
    'B2B SaaS & Enterprise',
    'E-Commerce & DTC Brands',
    'Fintech & Web3',
    'Creative Design & WebGL',
  ];

  const fetchTrends = async (category: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, platform: selectedPlatformFilter }),
      });
      const json = await res.json();

      if (json.success && Array.isArray(json.trends)) {
        setTrends(json.trends);
        setWebSearchQueries(json.webSearchQueries || []);
        setGroundingSource(json.source || 'Gemini Search Grounding');
      }
    } catch (err) {
      console.error('Failed to fetch trends:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(selectedCategory);
  }, [selectedCategory]);

  const handleCopyHashtags = (hashtags: string[]) => {
    const text = hashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopiedHashtag(text);
    setTimeout(() => setCopiedHashtag(null), 2500);
  };

  const handleQueueTrend = (trend: TrendItem) => {
    const fullCaption = `${trend.suggestedHook}\n\n${trend.summary}\n\n${trend.suggestedHashtags.join(' ')}`;
    onQueueTrendToScheduler(trend.topic, fullCaption, trend.suggestedPlatform || 'linkedin', trend.suggestedHashtags);
    setQueuedNotification(`Queued "${trend.topic}" directly into Social Scheduler!`);
    setTimeout(() => setQueuedNotification(null), 3500);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center space-x-3.5">
          <span className="p-3 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 text-white shadow-xl shadow-sky-500/20">
            <TrendingUp className="w-6 h-6" />
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">AI Trend Monitor</h2>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800/60 flex items-center space-x-1">
                <Globe className="w-3 h-3 text-sky-400 mr-1" /> Search Grounded
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Powered by real-time Google Search Grounding to detect viral spikes and inject relevant topics into your Social Scheduler.
            </p>
          </div>
        </div>

        {/* Refresh / Category Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900">
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchTrends(selectedCategory)}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all flex items-center space-x-1.5 text-xs font-bold"
            title="Refresh Grounded Trends"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
            <span className="hidden sm:inline">Refresh Trends</span>
          </button>
        </div>
      </div>

      {/* Queue Notification Toast */}
      {queuedNotification && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-2xl text-xs flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">{queuedNotification}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">Pushed to Calendar</span>
        </div>
      )}

      {/* Grounding Status & Web Query Badges */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-400">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Grounding Engine: <strong className="text-white font-mono">{groundingSource}</strong></span>
        </div>

        {webSearchQueries.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto py-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Search Queries:</span>
            {webSearchQueries.map((query, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-sky-300 border border-slate-800">
                "{query}"
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Trends Cards Grid */}
      {isLoading ? (
        <div className="py-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">Running Google Search Grounding analysis across social networks...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trends.map((trend, index) => (
            <div
              key={trend.id || index}
              className="bg-slate-950/90 border border-slate-800 hover:border-sky-500/50 p-5 rounded-2xl space-y-4 flex flex-col justify-between transition-all hover:scale-[1.01] shadow-lg group"
            >
              <div className="space-y-3">
                {/* Header: Score + Platform */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/60 flex items-center space-x-1">
                    <Flame className="w-3 h-3 text-amber-400 mr-1" /> Score {trend.hotnessScore}/100
                  </span>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-900 text-sky-300 border border-slate-800">
                    {trend.suggestedPlatform || 'linkedin'}
                  </span>
                </div>

                {/* Trend Topic */}
                <h3 className="text-sm font-extrabold text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                  {trend.topic}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {trend.summary}
                </p>

                {/* Hook Line */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-200 italic space-y-1">
                  <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block not-italic">Suggested Social Hook:</span>
                  <p>"{trend.suggestedHook}"</p>
                </div>

                {/* Hashtags */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-sky-400" />
                      <span>Suggested Hashtags</span>
                    </span>
                    <button
                      onClick={() => handleCopyHashtags(trend.suggestedHashtags)}
                      className="text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                    >
                      {copiedHashtag === trend.suggestedHashtags.join(' ') ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {trend.suggestedHashtags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: Queue directly to Social Scheduler */}
              <button
                onClick={() => handleQueueTrend(trend)}
                className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/20 transition-all mt-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>QUEUE TOPIC TO SCHEDULER</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
