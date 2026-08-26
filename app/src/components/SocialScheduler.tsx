import React, { useState } from 'react';
import { Workspace, CampaignAsset, Platform, AIInfluencer } from '../types';
import { AITrendMonitor } from './AITrendMonitor';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Send, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Facebook, 
  Video, 
  GripVertical,
  Zap,
  Globe,
  RefreshCw,
  AlertCircle,
  Eye,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SocialSchedulerProps {
  currentWorkspace: Workspace;
  assets: CampaignAsset[];
  influencers: AIInfluencer[];
  onUpdateAssetSchedule: (assetId: string, newScheduledTime: string, newStatus?: 'scheduled' | 'published') => void;
  onPublishNow: (assetId: string) => void;
  onQuickScheduleNewPost: (title: string, caption: string, platform: Platform, scheduledTime: string) => void;
}

export const SocialScheduler: React.FC<SocialSchedulerProps> = ({
  currentWorkspace,
  assets,
  influencers,
  onUpdateAssetSchedule,
  onPublishNow,
  onQuickScheduleNewPost,
}) => {
  // Calendar Month State (Default July/August 2026 based on mock system date)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(6); // 0-indexed: 6 = July 2026

  // Filters
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Drag & Drop State
  const [draggedAssetId, setDraggedAssetId] = useState<string | null>(null);
  const [dragOverDateStr, setDragOverDateStr] = useState<string | null>(null);

  // Modal State for New Scheduled Post
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [targetModalDateStr, setTargetModalDateStr] = useState<string>('2026-07-28');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalCaption, setModalCaption] = useState<string>('');
  const [modalPlatform, setModalPlatform] = useState<Platform>('linkedin');
  const [modalTime, setModalTime] = useState<string>('09:00');
  const [selectedExistingAssetId, setSelectedExistingAssetId] = useState<string>('');

  // Auto-Dispatch Simulation Log
  const [dispatchNotification, setDispatchNotification] = useState<string | null>(null);
  const [isAutoDispatching, setIsAutoDispatching] = useState<boolean>(false);

  // Month Names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper: Get days matrix for current month
  const getDaysInMonth = (year: number, month: number) => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days: ({ date: Date; dateStr: string; dayNum: number; isCurrentMonth: boolean })[] = [];

    // Previous month padding
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDayNum = prevMonthTotalDays - i;
      const d = new Date(year, month - 1, prevDayNum);
      const dateStr = d.toISOString().split('T')[0];
      days.push({ date: d, dateStr, dayNum: prevDayNum, isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ date: d, dateStr, dayNum: day, isCurrentMonth: true });
    }

    // Next month padding to fill 35 or 42 grid cells
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let day = 1; day <= remainingCells; day++) {
      const d = new Date(year, month + 1, day);
      const dateStr = d.toISOString().split('T')[0];
      days.push({ date: d, dateStr, dayNum: day, isCurrentMonth: false });
    }

    return days;
  };

  const monthGridDays = getDaysInMonth(currentYear, currentMonth);

  // Filter Workspace Assets
  const workspaceAssets = assets.filter((a) => a.workspaceId === currentWorkspace.id);

  // Filter assets by platform and status for calendar rendering
  const filteredAssets = workspaceAssets.filter((a) => {
    if (selectedPlatformFilter !== 'all' && a.platform !== selectedPlatformFilter) return false;
    if (selectedStatusFilter === 'scheduled' && a.status !== 'scheduled' && a.status !== 'approved') return false;
    if (selectedStatusFilter === 'published' && a.status !== 'published') return false;
    return true;
  });

  // Map assets by date string YYYY-MM-DD
  const assetsByDate: Record<string, CampaignAsset[]> = {};
  filteredAssets.forEach((asset) => {
    let dateKey = '2026-07-28'; // Default fallback date
    if (asset.scheduledTime) {
      dateKey = asset.scheduledTime.split('T')[0];
    } else if (asset.decidedAt) {
      dateKey = asset.decidedAt.split('T')[0];
    } else {
      // Mock distribute some unscheduled approved assets across July 2026 for rich calendar visuals
      const hash = asset.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const dayNum = (hash % 28) + 1;
      dateKey = `2026-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    }

    if (!assetsByDate[dateKey]) {
      assetsByDate[dateKey] = [];
    }
    assetsByDate[dateKey].push(asset);
  });

  // Navigation Handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, assetId: string) => {
    setDraggedAssetId(assetId);
    e.dataTransfer.setData('text/plain', assetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverDateStr !== dateStr) {
      setDragOverDateStr(dateStr);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverDateStr(null);
  };

  const handleDrop = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    setDragOverDateStr(null);
    const assetId = e.dataTransfer.getData('text/plain') || draggedAssetId;

    if (assetId) {
      const newScheduledTime = `${targetDateStr}T09:00:00.000Z`;
      onUpdateAssetSchedule(assetId, newScheduledTime, 'scheduled');
      setDraggedAssetId(null);

      setDispatchNotification(`Post rescheduled to ${targetDateStr} at 09:00 AM`);
      setTimeout(() => setDispatchNotification(null), 3500);
    }
  };

  // Trigger Auto-Dispatch Engine
  const handleTriggerAutoDispatch = () => {
    setIsAutoDispatching(true);
    setTimeout(() => {
      // Find all scheduled assets and publish them
      const dueAssets = workspaceAssets.filter((a) => a.status === 'scheduled' || a.status === 'approved');
      if (dueAssets.length > 0) {
        dueAssets.forEach((asset) => {
          onPublishNow(asset.id);
        });
        setDispatchNotification(`Successfully auto-dispatched ${dueAssets.length} queued posts across connected social channels!`);
      } else {
        setDispatchNotification('No pending posts in queue to dispatch right now.');
      }
      setIsAutoDispatching(false);
      setTimeout(() => setDispatchNotification(null), 4000);
    }, 1500);
  };

  // Open Schedule Modal for specific date
  const handleOpenScheduleModalForDate = (dateStr: string) => {
    setTargetModalDateStr(dateStr);
    setIsScheduleModalOpen(true);
  };

  // Handle Queueing Trend from AI Trend Monitor
  const handleQueueTrendToScheduler = (
    title: string,
    caption: string,
    platform: Platform,
    hashtags: string[]
  ) => {
    setModalTitle(title);
    setModalCaption(caption);
    setModalPlatform(platform);
    setTargetModalDateStr(`2026-${String(currentMonth + 1).padStart(2, '0')}-28`);
    setIsScheduleModalOpen(true);
  };

  // Handle Save Scheduled Post in Modal
  const handleSaveModalPost = () => {
    const fullISO = `${targetModalDateStr}T${modalTime}:00.000Z`;

    if (selectedExistingAssetId) {
      onUpdateAssetSchedule(selectedExistingAssetId, fullISO, 'scheduled');
    } else if (modalTitle.trim()) {
      onQuickScheduleNewPost(modalTitle, modalCaption, modalPlatform, fullISO);
    }

    setIsScheduleModalOpen(false);
    setModalTitle('');
    setModalCaption('');
    setSelectedExistingAssetId('');
    setDispatchNotification(`Successfully queued post for ${targetModalDateStr} at ${modalTime}`);
    setTimeout(() => setDispatchNotification(null), 3500);
  };

  // Helper: Render platform icon
  const renderPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="w-3 h-3 text-blue-400" />;
      case 'instagram':
        return <Instagram className="w-3 h-3 text-pink-400" />;
      case 'tiktok':
        return <Video className="w-3 h-3 text-teal-400" />;
      case 'twitter':
        return <Twitter className="w-3 h-3 text-sky-400" />;
      case 'facebook':
        return <Facebook className="w-3 h-3 text-indigo-400" />;
      default:
        return <Globe className="w-3 h-3 text-slate-400" />;
    }
  };

  // Helper: Get platform bg color
  const getPlatformBg = (platform: Platform) => {
    switch (platform) {
      case 'linkedin':
        return 'bg-blue-950/80 border-blue-800/80 text-blue-200';
      case 'instagram':
        return 'bg-pink-950/80 border-pink-800/80 text-pink-200';
      case 'tiktok':
        return 'bg-teal-950/80 border-teal-800/80 text-teal-200';
      case 'twitter':
        return 'bg-sky-950/80 border-sky-800/80 text-sky-200';
      case 'facebook':
        return 'bg-indigo-950/80 border-indigo-800/80 text-indigo-200';
      default:
        return 'bg-slate-900 border-slate-800 text-slate-300';
    }
  };

  const totalScheduledMonth = filteredAssets.filter((a) => a.status === 'scheduled' || a.status === 'approved').length;
  const totalPublishedMonth = filteredAssets.filter((a) => a.status === 'published').length;

  return (
    <div className="space-y-8 w-full">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-xl shadow-blue-600/20">
              <CalendarIcon className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Social Content Scheduler</h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60">
                  Drag & Drop Calendar
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Queue, drag-and-drop reschedule, and automate multi-channel social media dispatches across monthly calendars.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleTriggerAutoDispatch}
            disabled={isAutoDispatching}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Zap className={`w-4 h-4 ${isAutoDispatching ? 'animate-spin' : ''}`} />
            <span>{isAutoDispatching ? 'Dispatching Queue...' : 'TRIGGER AUTO-DISPATCH'}</span>
          </button>

          <button
            onClick={() => handleOpenScheduleModalForDate(`2026-${String(currentMonth + 1).padStart(2, '0')}-28`)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xl shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>QUEUE NEW POST</span>
          </button>
        </div>
      </div>

      {/* Dispatch Notification Banner */}
      {dispatchNotification && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-2xl text-xs flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold">{dispatchNotification}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">Queue Synchronized</span>
        </div>
      )}

      {/* Month Metrics & Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Month Scheduled Queue</span>
          <p className="text-2xl font-extrabold text-white font-mono">{totalScheduledMonth} <span className="text-xs text-slate-400 font-normal">posts</span></p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Published This Month</span>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">{totalPublishedMonth} <span className="text-xs text-slate-400 font-normal">dispatched</span></p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Peak AI Best Time</span>
          <p className="text-sm font-extrabold text-indigo-400 font-mono">09:00 AM & 02:00 PM</p>
          <p className="text-[10px] text-slate-500">Highest engagement window</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Connected Social Channels</span>
          <div className="flex items-center space-x-2 pt-1">
            <Linkedin className="w-4 h-4 text-blue-400" />
            <Instagram className="w-4 h-4 text-pink-400" />
            <Video className="w-4 h-4 text-teal-400" />
            <Twitter className="w-4 h-4 text-sky-400" />
            <Facebook className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Calendar Control Bar (Month Navigation + Filters) */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Navigation */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-extrabold text-white tracking-tight w-44 text-center">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setCurrentYear(2026);
              setCurrentMonth(6); // July 2026
            }}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60"
          >
            Today
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Platform Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-semibold">Platform:</span>
            <select
              value={selectedPlatformFilter}
              onChange={(e) => setSelectedPlatformFilter(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer capitalize"
            >
              <option value="all" className="bg-slate-900">All Platforms</option>
              <option value="linkedin" className="bg-slate-900">LinkedIn</option>
              <option value="instagram" className="bg-slate-900">Instagram</option>
              <option value="tiktok" className="bg-slate-900">TikTok</option>
              <option value="twitter" className="bg-slate-900">X (Twitter)</option>
              <option value="facebook" className="bg-slate-900">Facebook</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 font-semibold">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Statuses</option>
              <option value="scheduled" className="bg-slate-900">Scheduled Queue</option>
              <option value="published" className="bg-slate-900">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* MONTHLY DRAG & DROP CALENDAR GRID */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950 text-center text-xs font-bold text-slate-400 py-3">
          {daysOfWeek.map((day) => (
            <div key={day} className="uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Month Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-800/80 bg-slate-950">
          {monthGridDays.map((dayObj, idx) => {
            const { dateStr, dayNum, isCurrentMonth } = dayObj;
            const dayPosts = assetsByDate[dateStr] || [];
            const isToday = dateStr === '2026-07-28'; // Simulated system today date
            const isDragTarget = dragOverDateStr === dateStr;

            return (
              <div
                key={idx}
                onDragOver={(e) => handleDragOver(e, dateStr)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, dateStr)}
                className={`min-h-[140px] p-2 transition-all flex flex-col justify-between group relative ${
                  !isCurrentMonth ? 'bg-slate-950/40 opacity-40' : 'bg-slate-900/40 hover:bg-slate-900/80'
                } ${isDragTarget ? 'ring-2 ring-indigo-500 bg-indigo-950/40' : ''}`}
              >
                {/* Cell Header: Date Number + Quick Add Button */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span
                    className={`font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      isToday
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-2 ring-indigo-400'
                        : isCurrentMonth
                        ? 'text-slate-300'
                        : 'text-slate-600'
                    }`}
                  >
                    {dayNum}
                  </span>

                  <button
                    onClick={() => handleOpenScheduleModalForDate(dateStr)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded transition-all"
                    title={`Schedule post for ${dateStr}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Posts Stacked List inside Day Cell */}
                <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[110px] pr-0.5">
                  {dayPosts.map((post) => {
                    const isPublished = post.status === 'published';
                    const isScheduled = post.status === 'scheduled' || post.status === 'approved';

                    return (
                      <div
                        key={post.id}
                        draggable={!isPublished}
                        onDragStart={(e) => handleDragStart(e, post.id)}
                        className={`p-2 rounded-xl border text-[11px] transition-all space-y-1 shadow-sm cursor-grab active:cursor-grabbing ${getPlatformBg(
                          post.platform
                        )} hover:scale-[1.02]`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 truncate">
                            <GripVertical className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                            {renderPlatformIcon(post.platform)}
                            <span className="font-extrabold truncate">{post.title}</span>
                          </div>

                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 ${
                              isPublished
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-slate-900 text-indigo-300 border border-slate-800'
                            }`}
                          >
                            {isPublished ? 'Published' : '09:00 AM'}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-300 line-clamp-1 leading-snug font-medium">
                          {post.caption}
                        </p>

                        {!isPublished && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[9px]">
                            <span className="text-slate-400">Drag to move</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPublishNow(post.id);
                              }}
                              className="text-indigo-300 hover:text-white font-bold underline"
                            >
                              Dispatch
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Drop indicator outline */}
                {isDragTarget && (
                  <div className="absolute inset-0 bg-indigo-500/10 border-2 border-dashed border-indigo-400 rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-300 bg-slate-950 px-2 py-1 rounded border border-indigo-500">
                      Drop to Reschedule
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Trend Monitor with Search Grounding */}
      <AITrendMonitor onQueueTrendToScheduler={handleQueueTrendToScheduler} />

      {/* MODAL: QUEUE NEW POST FOR SPECIFIC DATE */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
                  <CalendarIcon className="w-4 h-4" />
                </span>
                <h3 className="text-base font-extrabold text-white">Queue Post for {targetModalDateStr}</h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Pick Existing Asset or New */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Assign Existing Approved Asset (Optional)</label>
                <select
                  value={selectedExistingAssetId}
                  onChange={(e) => setSelectedExistingAssetId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500"
                >
                  <option value="">-- Create Custom Post below instead --</option>
                  {workspaceAssets.map((a) => (
                    <option key={a.id} value={a.id}>
                      [{a.platform.toUpperCase()}] {a.title} ({a.status})
                    </option>
                  ))}
                </select>
              </div>

              {!selectedExistingAssetId && (
                <>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Post Title / Campaign Name</label>
                    <input
                      type="text"
                      placeholder="e.g. AI Influencer Launch Keynote Announcement"
                      value={modalTitle}
                      onChange={(e) => setModalTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Social Channel Platform</label>
                    <select
                      value={modalPlatform}
                      onChange={(e) => setModalPlatform(e.target.value as Platform)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500 capitalize"
                    >
                      <option value="linkedin">LinkedIn Company Page</option>
                      <option value="instagram">Instagram Official</option>
                      <option value="tiktok">TikTok Global</option>
                      <option value="twitter">X / Twitter Tech</option>
                      <option value="facebook">Facebook Brand Page</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Post Caption & Copy</label>
                    <textarea
                      rows={3}
                      placeholder="Enter post text, hashtags, and call to action..."
                      value={modalCaption}
                      onChange={(e) => setModalCaption(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                </>
              )}

              {/* Time Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetModalDateStr}
                    onChange={(e) => setTargetModalDateStr(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Dispatch Time (UTC)</label>
                  <input
                    type="time"
                    value={modalTime}
                    onChange={(e) => setModalTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-indigo-400 font-bold rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* AI Peak Recommendation Pill */}
              <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-800/60 flex items-center space-x-2 text-[11px] text-indigo-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>AI Peak Engagement Window for {modalPlatform.toUpperCase()}: <strong>09:00 AM (4.2x higher reach)</strong></span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModalPost}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30"
              >
                SCHEDULE & QUEUE POST
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
