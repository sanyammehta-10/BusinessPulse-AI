'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import {
  Download,
  Printer,
  Filter,
  Loader2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Brain,
  RefreshCw,
  Activity,
  Receipt
} from 'lucide-react';
import Button from '@/components/ui/button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyRecord {
  name: string;
  sales: number;
  expenses: number;
  profit: number;
}

const mockData: MonthlyRecord[] = [
  { name: 'Jan', sales: 4200, expenses: 2400, profit: 1800 },
  { name: 'Feb', sales: 3800, expenses: 1950, profit: 1850 },
  { name: 'Mar', sales: 4600, expenses: 3100, profit: 1500 },
  { name: 'Apr', sales: 4100, expenses: 2900, profit: 1200 },
  { name: 'May', sales: 5200, expenses: 3400, profit: 1800 },
  { name: 'Jun', sales: 4800, expenses: 3200, profit: 1600 },
  { name: 'Jul', sales: 5950, expenses: 3600, profit: 2350 },
];

const expenseBreakdown = [
  { category: 'Payroll & Team', percentage: 46, amount: '$7,630', color: '#FFFFFF', change: '+2.1%' },
  { category: 'Marketing & Ads', percentage: 24, amount: '$3,981', color: '#A1A1AA', change: '-4.8%' },
  { category: 'Cloud & Software', percentage: 18, amount: '$2,985', color: '#71717A', change: '+0.5%' },
  { category: 'Office & Ops', percentage: 12, amount: '$1,992', color: '#3F3F46', change: '-1.2%' },
];

export default function ReportsPage() {
  const { activeBusiness } = useAuthStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReSynthesizing, setIsReSynthesizing] = useState(false);
  const [reportType, setReportType] = useState<'financial' | 'sales' | 'expenses'>('financial');
  const [dateRange, setDateRange] = useState<'1m' | '3m' | '6m' | '1y' | 'ytd'>('6m');
  const [chartView, setChartView] = useState<'all' | 'sales' | 'expenses'>('all');
  const [comparePrevious, setComparePrevious] = useState(true);
  const [activeHoverBar, setActiveHoverBar] = useState<number | null>(6);

  const handleExportCSV = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const headers = ['Month', 'Sales', 'Expenses', 'Net Profit'];
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        headers.join(',') +
        '\n' +
        mockData.map((e) => `${e.name},${e.sales},${e.expenses},${e.profit}`).join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `business-report-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsGenerating(false);
    }, 800);
  };

  const handleReSynthesize = () => {
    setIsReSynthesizing(true);
    setTimeout(() => {
      setIsReSynthesizing(false);
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* ─── Page Header Bar ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#222226]">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Report Intelligence
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/15 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
              Q3 Audited
            </span>
            <span className="text-xs text-[#71717A] hidden sm:inline">
              Real-time feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-2xl">
            Autonomous financial statement synthesis, burn-rate telemetry, and executive variance analytics.
          </p>
        </div>

        {/* Quick Action Header Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant="outline"
            className="gap-2 text-[#F5F5F5] border-[#2A2A2D] bg-[#141416] hover:bg-white/10 shadow-sm transition-all duration-200"
            onClick={handleExportCSV}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Download className="w-4 h-4 text-[#A1A1AA]" />
            )}
            Export CSV
          </Button>

          <Button
            onClick={handlePrint}
            className="bg-white hover:bg-[#E4E4E7] text-[#0A0A0B] font-semibold gap-2 shadow-lg shadow-white/5 transition-all duration-200"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </Button>
        </div>
      </div>

      {/* ─── Top Row: High-Impact Creative Bento Metric Cards ────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 min-w-0">
        
        {/* Card 1: Gross Revenue */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="min-w-0 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#18181C] via-[#131316] to-[#0E0E10] border border-white/[0.08] p-4 sm:p-5 shadow-xl hover:border-white/20 transition-all group flex flex-col justify-between"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/[0.03] rounded-full blur-2xl pointer-events-none group-hover:bg-white/[0.06] transition-all" />

          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white shadow-inner flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block truncate">
                    Gross Revenue
                  </span>
                  <span className="text-[10px] text-[#A1A1AA] truncate block">Audited Inflows</span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20 flex-shrink-0">
                <TrendingUp className="w-3 h-3" />
                +12.5%
              </div>
            </div>

            <div className="my-2 min-w-0">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
                $19,550
              </div>
              <p className="text-[11px] text-[#71717A] mt-1 truncate">
                +$2,170 variance vs moving baseline
              </p>
            </div>
          </div>

          {/* Interactive Equalizer Sparkline Visualization */}
          <div className="mt-4 pt-3.5 border-t border-white/[0.06] min-w-0">
            <div className="flex items-center justify-between text-xs text-[#8E8E93] mb-2 min-w-0">
              <span className="font-medium flex items-center gap-1.5 truncate">
                <Activity className="w-3.5 h-3.5 text-[#A1A1AA] flex-shrink-0" />
                Velocity
              </span>
              <span className="font-semibold text-white text-[11px] flex-shrink-0">Avg $3,258/mo</span>
            </div>

            <div className="flex items-end gap-1.5 h-8 bg-black/20 p-1.5 rounded-xl border border-white/[0.04] w-full min-w-0">
              {mockData.map((d, idx) => {
                const heightPct = Math.round((d.sales / 6000) * 100);
                const isHovered = activeHoverBar === idx;
                return (
                  <div
                    key={d.name}
                    onMouseEnter={() => setActiveHoverBar(idx)}
                    className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer relative"
                  >
                    {isHovered && (
                      <div className="absolute -top-7 px-1.5 py-0.5 rounded bg-white text-black text-[9px] font-bold shadow-md whitespace-nowrap z-10 pointer-events-none">
                        ${d.sales}
                      </div>
                    )}
                    <div
                      className={`w-full rounded-sm transition-all duration-200 ${
                        isHovered
                          ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                          : idx === mockData.length - 1
                          ? 'bg-white/80'
                          : 'bg-white/20 hover:bg-white/40'
                      }`}
                      style={{ height: `${Math.max(15, heightPct)}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] text-[#71717A] font-semibold mt-1 px-1">
              {mockData.map((d) => (
                <span key={d.name}>{d.name}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Card 2: Operating Expenses */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="min-w-0 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#18181C] via-[#131316] to-[#0E0E10] border border-white/[0.08] p-4 sm:p-5 shadow-xl hover:border-white/20 transition-all group flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#F87171]/[0.03] rounded-full blur-2xl pointer-events-none group-hover:bg-[#F87171]/[0.06] transition-all" />

          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white shadow-inner flex-shrink-0">
                  <Receipt className="w-4 h-4 text-[#F87171]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block truncate">
                    Total Expenses
                  </span>
                  <span className="text-[10px] text-[#A1A1AA] truncate block">4 Cost Centers</span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20 flex-shrink-0">
                <TrendingDown className="w-3 h-3" />
                -2.4% Cost
              </div>
            </div>

            <div className="my-2 min-w-0">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
                $16,588
              </div>
              <p className="text-[11px] text-[#71717A] mt-1 truncate">
                Under allocated cap ($19,500 ceiling)
              </p>
            </div>
          </div>

          {/* Creative Dual-Tone Utilization Gauge */}
          <div className="mt-4 pt-3.5 border-t border-white/[0.06] min-w-0">
            <div className="flex items-center justify-between text-xs text-[#8E8E93] mb-2 min-w-0">
              <span className="font-medium flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80] flex-shrink-0" />
                Budget Burn
              </span>
              <span className="font-bold text-white text-[11px] flex-shrink-0">84.8% of Limit</span>
            </div>

            <div className="relative h-2 w-full bg-[#1F1F24] rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-white via-white/80 to-[#A1A1AA] transition-all duration-500 shadow-sm"
                style={{ width: '84.8%' }}
              />
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="p-1.5 rounded-lg bg-black/20 border border-white/[0.04] flex items-center justify-between min-w-0">
                <span className="text-[#71717A] truncate">Fixed</span>
                <span className="font-semibold text-white ml-1 flex-shrink-0">$11.6k</span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/20 border border-white/[0.04] flex items-center justify-between min-w-0">
                <span className="text-[#71717A] truncate">Variable</span>
                <span className="font-semibold text-[#A1A1AA] ml-1 flex-shrink-0">$4.9k</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Net Operating Profit (Hero Elevated) */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="min-w-0 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F1F26] via-[#141418] to-[#0D0D10] border border-white/20 p-4 sm:p-5 shadow-2xl hover:border-white/40 transition-all group flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/[0.05] rounded-full blur-2xl pointer-events-none group-hover:bg-white/[0.09] transition-all" />

          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-md shadow-white/10 flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] block truncate">
                    Net Profit
                  </span>
                  <span className="text-[10px] text-white/70 truncate block">Margin Retained</span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-white text-black shadow-md flex-shrink-0 whitespace-nowrap">
                15.1% Margin
              </div>
            </div>

            <div className="my-2 min-w-0">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-2 truncate">
                $2,962
                <span className="text-[11px] font-bold text-[#4ADE80] px-1.5 py-0.5 rounded-md bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex-shrink-0">
                  +18.2%
                </span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] mt-1 truncate">
                Retained after total operational deduction
              </p>
            </div>
          </div>

          {/* Margin Health Status Box */}
          <div className="mt-4 pt-3.5 border-t border-white/10 min-w-0">
            <div className="flex items-center justify-between text-xs mb-1.5 min-w-0">
              <span className="text-[#A1A1AA] font-medium flex items-center gap-1.5 truncate text-[11px]">
                <Zap className="w-3.5 h-3.5 text-white flex-shrink-0" />
                Capital Velocity
              </span>
              <span className="font-bold text-[#4ADE80] text-[11px] flex-shrink-0">Strong Recovery</span>
            </div>

            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 space-y-1 min-w-0">
              <div className="flex items-center justify-between text-[10px] min-w-0">
                <span className="text-[#A1A1AA] truncate">Cash Conversion</span>
                <span className="font-semibold text-white ml-1 flex-shrink-0">72.4% Optimal</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-[#4ADE80] rounded-full" style={{ width: '72.4%' }} />
              </div>
            </div>

            <p className="text-[10px] text-[#71717A] mt-1.5 flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] flex-shrink-0" />
              Runway expanded by +1.2 mos at current pacing.
            </p>
          </div>
        </motion.div>

      </div>

      {/* ─── Middle Section: Controls Sidebar & Chart Area ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-w-0 items-start">
        
        {/* Left Column (4 cols): Configuration Engine & AI Synthesis */}
        <div className="lg:col-span-4 space-y-5 min-w-0">
          
          {/* Configuration Card */}
          <div className="bg-gradient-to-b from-[#161619] to-[#111113] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4 hover:border-white/15 transition-colors min-w-0">
            <div className="flex items-center justify-between text-white font-bold text-sm pb-2 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <Filter className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Customization Engine</span>
              </div>
              <span className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider">
                Telemetry
              </span>
            </div>

            {/* Statement Focus Segmented Switcher */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-bold text-[#71717A] uppercase tracking-wider">
                  Statement Focus
                </label>
                <span className="text-white/50 capitalize text-[10px]">{reportType} Mode</span>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#0A0A0C] border border-[#222226] rounded-xl">
                {(['financial', 'sales', 'expenses'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setReportType(type)}
                    className={`py-1.5 px-1 text-xs font-semibold rounded-lg capitalize transition-all duration-200 ${
                      reportType === type
                        ? 'bg-white text-black shadow-md font-bold scale-[1.02]'
                        : 'text-[#8E8E93] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Horizon Segmented Switcher */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-bold text-[#71717A] uppercase tracking-wider">
                  Time Horizon
                </label>
                <span className="text-white/50 uppercase text-[10px]">{dateRange} Active</span>
              </div>
              <div className="grid grid-cols-5 gap-1 p-1 bg-[#0A0A0C] border border-[#222226] rounded-xl text-center">
                {(['1m', '3m', '6m', '1y', 'ytd'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setDateRange(r)}
                    className={`py-1.5 text-xs font-semibold uppercase rounded-lg transition-all duration-200 ${
                      dateRange === r
                        ? 'bg-white text-black shadow-md font-bold scale-[1.02]'
                        : 'text-[#8E8E93] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Compare Toggle */}
            <div className="pt-2 flex items-center justify-between border-t border-white/[0.06]">
              <div>
                <span className="text-xs font-semibold text-white block">Prior Period Comparison</span>
                <span className="text-[10px] text-[#71717A]">Overlay historical curve</span>
              </div>
              <button
                onClick={() => setComparePrevious(!comparePrevious)}
                className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 focus:outline-none ${
                  comparePrevious ? 'bg-white' : 'bg-[#2A2A2D]'
                }`}
                aria-label="Toggle comparison"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full transition-transform duration-200 ${
                    comparePrevious ? 'translate-x-4 bg-black shadow-md' : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>

            {/* Re-Synthesize Button */}
            <Button
              onClick={handleReSynthesize}
              disabled={isReSynthesizing}
              className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs py-2 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReSynthesizing ? 'animate-spin' : ''}`} />
              {isReSynthesizing ? 'Re-Synthesizing Records...' : 'Re-Synthesize Dataset'}
            </Button>
          </div>

          {/* Creative AI Financial Synthesis Box */}
          <motion.div
            whileHover={{ y: -2 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1824]/80 via-[#131217] to-[#0E0E10] border border-white/15 p-5 shadow-xl space-y-3.5 min-w-0"
          >
            {/* Ambient Purple/White Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.04] rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]" />
                </span>
                <span className="text-xs font-bold text-white tracking-wide uppercase">
                  AI Synthesis
                </span>
              </div>
              <span className="text-[10px] font-semibold text-white/50 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10">
                99% Match
              </span>
            </div>

            <div className="space-y-2.5 text-xs leading-relaxed min-w-0">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/[0.06] hover:border-white/15 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] flex-shrink-0 mt-0.5" />
                <span className="text-[#D4D4D8] text-[11px]">
                  Sales expanded by <strong className="text-white font-bold">+14.2%</strong> in Q2 while variable overhead fell by <strong className="text-[#4ADE80] font-bold">-3.1%</strong>.
                </span>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/[0.06] hover:border-white/15 transition-colors">
                <Sparkles className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                <span className="text-[#D4D4D8] text-[11px]">
                  Operating runway is resilient with estimated <strong className="text-white font-bold">14.8 months</strong> cash buffer at current velocity.
                </span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-white/[0.06] min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  Recommended Directive
                </span>
                <span className="text-[10px] text-[#4ADE80] font-semibold">Priority 1</span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] leading-snug">
                Reallocate $1,500 monthly surplus toward high-ROI Product A inventory to prevent projected Q4 stockouts.
              </p>
              
              <Link
                href="/simulator"
                className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all group"
              >
                <span className="flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-white" />
                  Simulate this scenario
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Right Column (8 cols): Interactive Area Chart Box & Expense Breakdown */}
        <div className="lg:col-span-8 space-y-5 min-w-0 w-full">
          
          {/* Main Chart Box */}
          <div className="bg-gradient-to-b from-[#161619] to-[#111113] border border-white/[0.08] rounded-3xl p-5 sm:p-7 shadow-2xl min-w-0 w-full">
            
            {/* Chart Box Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 mb-5 pb-3.5 border-b border-white/[0.05]">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Multi-Stream Performance Curve
                  </h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.08] text-white border border-white/15">
                    Spread +$2,350
                  </span>
                </div>
                <p className="text-xs text-[#71717A] mt-0.5">
                  Comparative trend tracking across historical revenue and categorized expenditure.
                </p>
              </div>

              {/* View Switcher Chips */}
              <div className="flex items-center gap-1 p-1 bg-[#0A0A0C] border border-[#242427] rounded-xl self-start xl:self-auto flex-shrink-0">
                <button
                  onClick={() => setChartView('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    chartView === 'all'
                      ? 'bg-white text-black shadow-md font-bold'
                      : 'text-[#8E8E93] hover:text-white'
                  }`}
                >
                  Dual View
                </button>
                <button
                  onClick={() => setChartView('sales')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    chartView === 'sales'
                      ? 'bg-white text-black shadow-md font-bold'
                      : 'text-[#8E8E93] hover:text-white'
                  }`}
                >
                  Sales
                </button>
                <button
                  onClick={() => setChartView('expenses')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    chartView === 'expenses'
                      ? 'bg-white text-black shadow-md font-bold'
                      : 'text-[#8E8E93] hover:text-white'
                  }`}
                >
                  Expenses
                </button>
              </div>
            </div>

            {/* The Area Chart */}
            <div className="h-[340px] w-full min-w-0 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradientSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="gradientExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F87171" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#F87171" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#222228" vertical={false} />
                  
                  <XAxis
                    dataKey="name"
                    stroke="#71717A"
                    tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: '#2A2A2E' }}
                    tickLine={false}
                  />
                  
                  <YAxis
                    stroke="#71717A"
                    tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(16, 16, 18, 0.95)',
                      borderColor: '#2E2E33',
                      borderRadius: '14px',
                      boxShadow: '0 12px 36px rgba(0,0,0,0.8)',
                      padding: '12px 16px',
                      backdropFilter: 'blur(12px)',
                    }}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }}
                    itemStyle={{ color: '#F5F5F5', fontSize: '12px' }}
                    formatter={(value: unknown, name: unknown) => [
                      `$${Number(value || 0).toLocaleString()}`,
                      name === 'sales' ? 'Gross Revenue' : 'Operating Expenses',
                    ]}
                  />

                  {(chartView === 'all' || chartView === 'sales') && (
                    <Area
                      type="monotone"
                      dataKey="sales"
                      name="sales"
                      stroke="#FFFFFF"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#gradientSales)"
                      activeDot={{ r: 5, fill: '#FFFFFF', stroke: '#000000', strokeWidth: 2 }}
                    />
                  )}

                  {(chartView === 'all' || chartView === 'expenses') && (
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      name="expenses"
                      stroke="#F87171"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#gradientExpenses)"
                      activeDot={{ r: 4.5, fill: '#F87171', stroke: '#000000', strokeWidth: 2 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 4 Bottom Performance Callout Bento Chips */}
            <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-2.5 min-w-0">
              <motion.div
                whileHover={{ y: -2 }}
                className="p-3 rounded-xl bg-black/30 border border-white/[0.06] text-left hover:border-white/20 transition-all min-w-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold truncate">Peak Revenue</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                </div>
                <div className="text-sm font-extrabold text-white mt-1 truncate">Jul ($5,950)</div>
                <span className="text-[10px] text-[#A1A1AA] truncate block">+24% over trend</span>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="p-3 rounded-xl bg-black/30 border border-white/[0.06] text-left hover:border-white/20 transition-all min-w-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold truncate">Leanest OPEX</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] flex-shrink-0" />
                </div>
                <div className="text-sm font-extrabold text-white mt-1 truncate">Feb ($1,950)</div>
                <span className="text-[10px] text-[#4ADE80] font-semibold truncate block">-38% burn saved</span>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="p-3 rounded-xl bg-black/30 border border-white/[0.06] text-left hover:border-white/20 transition-all min-w-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold truncate">Top Margin</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] flex-shrink-0" />
                </div>
                <div className="text-sm font-extrabold text-[#4ADE80] mt-1 truncate">Feb (48.7%)</div>
                <span className="text-[10px] text-[#A1A1AA] truncate block">Optimal efficiency</span>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="p-3 rounded-xl bg-black/30 border border-white/[0.06] text-left hover:border-white/20 transition-all min-w-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold truncate">Run-Rate Est.</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                </div>
                <div className="text-sm font-extrabold text-white mt-1 truncate">$234.6k/yr</div>
                <span className="text-[10px] text-[#A1A1AA] truncate block">Extrapolated</span>
              </motion.div>
            </div>

          </div>

          {/* ─── Creative Expense Allocation Bento Grid ─────────────── */}
          <div className="bg-gradient-to-b from-[#161619] to-[#111113] border border-white/[0.08] rounded-3xl p-5 sm:p-7 shadow-xl min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Expense Distribution Breakdown
                </h3>
                <p className="text-xs text-[#71717A]">
                  Autonomous allocation across departmental cost centers
                </p>
              </div>
              <span className="text-xs font-semibold text-white px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 self-start sm:self-auto flex-shrink-0">
                100% Accounted
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="h-2.5 w-full rounded-full bg-[#1F1F24] overflow-hidden flex mb-5 p-0.5 border border-white/[0.05]">
              {expenseBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  title={`${item.category}: ${item.percentage}%`}
                  className="h-full first:rounded-l-full last:rounded-r-full border-r border-[#141416]"
                />
              ))}
            </div>

            {/* Breakdown Legend Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-0">
              {expenseBreakdown.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] hover:border-white/20 transition-all flex flex-col justify-between min-w-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-semibold text-white truncate">{item.category}</span>
                    </div>
                    <div className="text-base font-black text-white mt-1 tracking-tight truncate">{item.amount}</div>
                  </div>

                  <div className="mt-2.5 pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                    <span className="text-[#71717A] truncate">{item.percentage}%</span>
                    <span className={item.change.startsWith('+') ? 'text-white' : 'text-[#4ADE80]'}>
                      {item.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
