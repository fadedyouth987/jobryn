import React, { useState, useMemo } from 'react';
import { Workspace, LedgerEntry } from '../types';
import { 
  Zap, 
  CreditCard, 
  ShieldCheck, 
  PlusCircle, 
  Lock,
  TrendingDown,
  TrendingUp,
  BarChart2,
  Calendar,
  Activity,
  Sparkles,
  Layers,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface BillingLedgerProps {
  currentWorkspace: Workspace;
  ledgerEntries: LedgerEntry[];
  onOpenTopUp: () => void;
  onOpenPlanModal: () => void;
  themeMode?: 'light' | 'dark';
}

interface DailyTrendPoint {
  date: string;
  shortDate: string;
  dayOfWeek: string;
  consumed: number;
  topup: number;
  balance: number;
  aiGenerations: number;
  renderings3D: number;
  socialPublishing: number;
}

export const BillingLedger: React.FC<BillingLedgerProps> = ({
  currentWorkspace,
  ledgerEntries,
  onOpenTopUp,
  onOpenPlanModal,
  themeMode = 'dark'
}) => {
  const [timeRange, setTimeRange] = useState<'30' | '14' | '7'>('30');
  const [chartMode, setChartMode] = useState<'composed' | 'breakdown' | 'daily'>('composed');
  const isLight = themeMode === 'light';

  const workspaceEntries = ledgerEntries.filter((e) => e.workspaceId === currentWorkspace.id);

  // Generate deterministic 30-day historical trend series
  const full30DayTrend = useMemo<DailyTrendPoint[]>(() => {
    const points: DailyTrendPoint[] = [];
    const baseDate = new Date('2026-07-29T12:00:00Z');
    
    // Baseline organic daily consumption fluctuation
    const baseBurnPattern = [
      35, 42, 20, 65, 85, 110, 45, 
      25, 70, 115, 30, 22, 90, 145, 
      40, 28, 98, 125, 55, 30, 82, 
      160, 50, 38, 105, 135, 62, 35, 88, 55
    ];

    const rawDaily: { 
      dateStr: string; 
      shortDate: string; 
      dayOfWeek: string; 
      consumed: number; 
      topup: number; 
      ai: number; 
      render3d: number; 
      social: number 
    }[] = [];

    for (let i = 0; i < 30; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - (29 - i));
      
      const dateStr = d.toISOString().split('T')[0];
      const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      let consumed = baseBurnPattern[i] || 45;
      let topup = 0;

      // Overlay actual ledger entries for this date if present
      const matchEntries = ledgerEntries.filter(
        e => e.workspaceId === currentWorkspace.id && e.timestamp.startsWith(dateStr)
      );

      matchEntries.forEach(entry => {
        if (entry.type === 'deduction' || entry.type === 'reservation') {
          consumed += Math.abs(entry.amountCredits);
        } else if (entry.type === 'purchase' || entry.type === 'topup') {
          topup += Math.abs(entry.amountCredits);
        }
      });

      // Synthetic monthly renewal top-up on day index 25 (~4 days ago) if enterprise
      if (i === 25 && topup === 0 && currentWorkspace.plan === 'enterprise') {
        topup = 5000;
      }

      const ai = Math.round(consumed * 0.58);
      const render3d = Math.round(consumed * 0.28);
      const social = Math.max(0, consumed - ai - render3d);

      rawDaily.push({
        dateStr,
        shortDate,
        dayOfWeek,
        consumed,
        topup,
        ai,
        render3d,
        social
      });
    }

    // Work backwards from current workspace balance
    const balances: number[] = new Array(30);
    balances[29] = currentWorkspace.creditsRemaining;

    for (let i = 28; i >= 0; i--) {
      const nextDay = rawDaily[i + 1];
      balances[i] = balances[i + 1] + nextDay.consumed - nextDay.topup;
    }

    for (let i = 0; i < 30; i++) {
      const item = rawDaily[i];
      points.push({
        date: item.dateStr,
        shortDate: item.shortDate,
        dayOfWeek: item.dayOfWeek,
        consumed: item.consumed,
        topup: item.topup,
        balance: Math.max(0, balances[i]),
        aiGenerations: item.ai,
        renderings3D: item.render3d,
        socialPublishing: item.social
      });
    }

    return points;
  }, [currentWorkspace, ledgerEntries]);

  // Filter trend data according to active time range (30, 14, 7 days)
  const filteredTrendData = useMemo(() => {
    const days = parseInt(timeRange, 10);
    return full30DayTrend.slice(30 - days);
  }, [full30DayTrend, timeRange]);

  // Key KPI metrics calculations
  const kpis = useMemo(() => {
    const totalConsumed = filteredTrendData.reduce((acc, curr) => acc + curr.consumed, 0);
    const totalTopups = filteredTrendData.reduce((acc, curr) => acc + curr.topup, 0);
    const days = filteredTrendData.length;
    const avgDailyBurn = days > 0 ? (totalConsumed / days).toFixed(1) : '0';
    
    let peakDay = filteredTrendData[0] || { shortDate: 'N/A', consumed: 0 };
    filteredTrendData.forEach(p => {
      if (p.consumed > peakDay.consumed) {
        peakDay = p;
      }
    });

    const avgBurnNum = parseFloat(avgDailyBurn) || 1;
    const estimatedRunwayDays = Math.max(1, Math.round(currentWorkspace.creditsRemaining / avgBurnNum));

    return {
      totalConsumed,
      totalTopups,
      avgDailyBurn,
      peakDay,
      estimatedRunwayDays
    };
  }, [filteredTrendData, currentWorkspace.creditsRemaining]);

  // Custom Recharts Tooltip Component
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const dataPoint = payload[0]?.payload as DailyTrendPoint;

    return (
      <div className={`p-3.5 rounded-2xl border shadow-xl text-xs space-y-2 backdrop-blur-md max-w-xs ${
        isLight 
          ? 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-200' 
          : 'bg-slate-900/95 border-slate-700 text-slate-100 shadow-slate-950'
      }`}>
        <div className="flex items-center justify-between border-b pb-2 border-slate-700/50">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold">{dataPoint.dayOfWeek}, {dataPoint.shortDate}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">{dataPoint.date}</span>
        </div>

        <div className="space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-amber-500">
            <span className="flex items-center space-x-1 text-[11px] font-sans font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Credits Consumed:</span>
            </span>
            <span className="font-bold">-{dataPoint.consumed}</span>
          </div>

          {dataPoint.topup > 0 && (
            <div className="flex items-center justify-between text-emerald-400">
              <span className="flex items-center space-x-1 text-[11px] font-sans font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Credit Top-Up / Grant:</span>
              </span>
              <span className="font-bold">+{dataPoint.topup}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-indigo-400">
            <span className="flex items-center space-x-1 text-[11px] font-sans font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>Remaining Balance:</span>
            </span>
            <span className="font-bold">{dataPoint.balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Feature Breakdown Sub-section */}
        <div className="pt-2 border-t border-slate-700/50 text-[10px] space-y-1 text-slate-400 font-sans">
          <span className="font-semibold text-slate-300 block">Activity Distribution:</span>
          <div className="grid grid-cols-3 gap-1 text-center font-mono">
            <div className={`p-1 rounded ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
              <div className="text-[9px] text-slate-400">AI Prompt</div>
              <div className="font-bold text-indigo-400">{dataPoint.aiGenerations} cr</div>
            </div>
            <div className={`p-1 rounded ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
              <div className="text-[9px] text-slate-400">3D Studio</div>
              <div className="font-bold text-amber-400">{dataPoint.renderings3D} cr</div>
            </div>
            <div className={`p-1 rounded ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
              <div className="text-[9px] text-slate-400">Publishing</div>
              <div className="font-bold text-emerald-400">{dataPoint.socialPublishing} cr</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <div className="flex items-center space-x-2">
            <span className={`p-2 rounded-xl border ${
              isLight 
                ? 'bg-amber-100 text-amber-700 border-amber-300' 
                : 'bg-amber-950 text-amber-400 border-amber-800/60'
            }`}>
              <Zap className="w-5 h-5" />
            </span>
            <h1 className={`text-2xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Transactional Credit Ledger & Billing
            </h1>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              isLight 
                ? 'bg-amber-100 text-amber-800 border-amber-300' 
                : 'bg-amber-950 text-amber-300 border-amber-800/60'
            }`}>
              Idempotent Stripe Outbox
            </span>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Real-time balance tracking, atomic credit reservations, and immutable financial ledger audit trails.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenPlanModal}
            className={`border px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            Manage Subscription
          </button>
          <button
            onClick={onOpenTopUp}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Top-Up Credits</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`border p-5 rounded-2xl space-y-2 relative overflow-hidden ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Available Balance</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-full font-bold">
              Active
            </span>
          </div>
          <div className={`text-3xl font-extrabold font-mono flex items-baseline space-x-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <span>{currentWorkspace.creditsRemaining.toLocaleString()}</span>
            <span className="text-xs font-normal text-slate-400">Credits</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Allocated: <strong>{currentWorkspace.totalCreditsAllocated.toLocaleString()}</strong> credits on <strong>{currentWorkspace.plan.toUpperCase()}</strong>
          </p>
        </div>

        <div className={`border p-5 rounded-2xl space-y-2 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Credit Safety Guarantee</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Atomic Pre-Reservation
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            AI generation reserves 15 credits before invoke. Settles upon success or auto-refunds on failure.
          </p>
        </div>

        <div className={`border p-5 rounded-2xl space-y-2 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Stripe Webhook Idempotency</span>
            <Lock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Zero Double-Grant Guard
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Stripe webhooks write to outbox logs with unique event ID state machine checks.
          </p>
        </div>
      </div>

      {/* Recharts Credit Consumption Trend Section */}
      <div className={`border rounded-2xl p-6 space-y-6 ${
        isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900/90 border-slate-800'
      }`}>
        {/* Controls Bar & Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-amber-500" />
              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                30-Day Credit Consumption Trends
              </h3>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Interactive visualization powered by Recharts tracking daily credit burn rates, top-ups, and balance trajectory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className={`p-1 rounded-xl border flex items-center space-x-1 text-xs font-semibold ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => setChartMode('composed')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  chartMode === 'composed'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Burn & Balance
              </button>
              <button
                onClick={() => setChartMode('breakdown')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  chartMode === 'breakdown'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Feature Breakdown
              </button>
              <button
                onClick={() => setChartMode('daily')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  chartMode === 'daily'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daily Usage
              </button>
            </div>

            {/* Time Frame Selector */}
            <div className={`p-1 rounded-xl border flex items-center space-x-1 text-xs font-semibold ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => setTimeRange('7')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeRange === '7'
                    ? isLight ? 'bg-white text-slate-900 shadow-sm font-bold' : 'bg-slate-800 text-white shadow-sm font-bold'
                    : isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('14')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeRange === '14'
                    ? isLight ? 'bg-white text-slate-900 shadow-sm font-bold' : 'bg-slate-800 text-white shadow-sm font-bold'
                    : isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                14 Days
              </button>
              <button
                onClick={() => setTimeRange('30')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeRange === '30'
                    ? isLight ? 'bg-white text-slate-900 shadow-sm font-bold' : 'bg-slate-800 text-white shadow-sm font-bold'
                    : isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {/* 4 Quick Stat Summary Badges for active window */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-3.5 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
          }`}>
            <span className="text-[11px] text-slate-400 block mb-1">Window Consumption ({timeRange}d)</span>
            <div className="flex items-baseline space-x-1.5 font-mono font-bold text-lg text-amber-500">
              <span>{kpis.totalConsumed.toLocaleString()}</span>
              <span className="text-xs font-sans text-slate-400 font-normal">Credits</span>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
          }`}>
            <span className="text-[11px] text-slate-400 block mb-1">Avg Daily Burn Rate</span>
            <div className={`flex items-baseline space-x-1.5 font-mono font-bold text-lg ${
              isLight ? 'text-slate-800' : 'text-white'
            }`}>
              <span>{kpis.avgDailyBurn}</span>
              <span className="text-xs font-sans text-slate-400 font-normal">cr / day</span>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
          }`}>
            <span className="text-[11px] text-slate-400 block mb-1">Peak Consumption Day</span>
            <div className="flex items-baseline space-x-1.5 font-mono font-bold text-lg text-indigo-400">
              <span>{kpis.peakDay.consumed} cr</span>
              <span className="text-xs font-sans text-slate-400 font-normal">({kpis.peakDay.shortDate})</span>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
          }`}>
            <span className="text-[11px] text-slate-400 block mb-1">Projected Credit Runway</span>
            <div className="flex items-baseline space-x-1.5 font-mono font-bold text-lg text-emerald-400">
              <span>~{kpis.estimatedRunwayDays}</span>
              <span className="text-xs font-sans text-slate-400 font-normal">Days Remaining</span>
            </div>
          </div>
        </div>

        {/* Main Recharts Visualization Canvas */}
        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'composed' ? (
              <ComposedChart data={filteredTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} vertical={false} />
                <XAxis 
                  dataKey="shortDate" 
                  tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }} 
                  axisLine={{ stroke: isLight ? '#cbd5e1' : '#334155' }}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }} 
                  axisLine={{ stroke: isLight ? '#cbd5e1' : '#334155' }}
                  tickLine={false}
                  label={{ value: 'Daily Credits', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }} 
                  axisLine={{ stroke: isLight ? '#cbd5e1' : '#334155' }}
                  tickLine={false}
                  label={{ value: 'Balance', angle: 90, position: 'insideRight', fill: '#94a3b8', fontSize: 10 }}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  formatter={(value) => <span className={isLight ? 'text-slate-700 font-medium' : 'text-slate-300 font-medium'}>{value}</span>}
                />
                
                <Bar 
                  yAxisId="left" 
                  dataKey="topup" 
                  name="Credit Grants / Top-Ups" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                  barSize={12}
                />
                <Area 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="consumed" 
                  name="Daily Consumed" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorConsumed)" 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="balance" 
                  name="Credit Balance" 
                  stroke="#6366f1" 
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, fill: '#818cf8' }}
                />
              </ComposedChart>
            ) : chartMode === 'breakdown' ? (
              <AreaChart data={filteredTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorRender" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} vertical={false} />
                <XAxis dataKey="shortDate" tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="aiGenerations" stackId="1" name="AI Prompt Engine" stroke="#6366f1" fill="url(#colorAI)" />
                <Area type="monotone" dataKey="renderings3D" stackId="1" name="3D Asset Studio" stroke="#f59e0b" fill="url(#colorRender)" />
                <Area type="monotone" dataKey="socialPublishing" stackId="1" name="Social Automation" stroke="#10b981" fill="url(#colorSocial)" />
              </AreaChart>
            ) : (
              <BarChart data={filteredTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} vertical={false} />
                <XAxis dataKey="shortDate" tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: isLight ? '#64748b' : '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Bar dataKey="consumed" name="Credits Consumed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="topup" name="Credits Added" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Immutable Ledger Table */}
      <div className={`border rounded-2xl p-6 space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className={`flex items-center justify-between border-b pb-4 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <h3 className={`text-base font-bold flex items-center space-x-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <CreditCard className="w-4 h-4 text-amber-500" />
            <span>Immutable Financial Ledger History</span>
          </h3>
          <span className="text-xs text-slate-400">
            Workspace ID: <strong className={isLight ? 'text-slate-700' : 'text-slate-200'}>{currentWorkspace.id}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`text-[10px] font-bold uppercase tracking-wider ${
              isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-950 text-slate-400'
            }`}>
              <tr>
                <th className="p-3 rounded-l-xl">Timestamp</th>
                <th className="p-3">Type</th>
                <th className="p-3">Description</th>
                <th className="p-3">Credit Δ</th>
                <th className="p-3">New Balance</th>
                <th className="p-3 rounded-r-xl">Reference</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
              {workspaceEntries.map((entry) => {
                const isPositive = entry.amountCredits > 0;
                return (
                  <tr key={entry.id} className={`transition-colors ${
                    isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'
                  }`}>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        entry.type === 'reservation' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50' :
                        entry.type === 'purchase' || entry.type === 'topup' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' :
                        isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className={`p-3 font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      {entry.description}
                    </td>
                    <td className={`p-3 font-mono font-bold ${isPositive ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {isPositive ? `+${entry.amountCredits}` : entry.amountCredits}
                    </td>
                    <td className={`p-3 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                      {entry.resultingBalance.toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[10px]">
                      {entry.stripeReference || entry.assetId || entry.id}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
