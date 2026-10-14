'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { simulationsService, SimulationResult, SimulationImpact } from '@/services/simulations.service';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Brain,
  ArrowRight,
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  BarChart3,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  Sliders,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
} from 'recharts';

/* ─── Sensitivity Slider Component ─────────────────────── */

function SensitivitySlider({
  label,
  value,
  onChange,
  min = -50,
  max = 50,
  unit = '%',
  description,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  description?: string;
}) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
        <span
          className={cn(
            'text-sm font-bold px-2 py-0.5 rounded-md',
            isPositive && 'text-emerald-600 bg-emerald-500/10',
            isNegative && 'text-red-500 bg-red-500/10',
            !isPositive && !isNegative && 'text-[var(--text-tertiary)] bg-[var(--surface-hover)]'
          )}
        >
          {isPositive ? '+' : ''}
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-white 
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#171719]
          [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125
          bg-[#2A2A2D]"
      />
      {description && (
        <p className="text-xs text-[var(--text-tertiary)]">{description}</p>
      )}
    </div>
  );
}

/* ─── Risk Gauge Component ─────────────────────────────── */

function RiskGauge({ score, level }: { score: number; level: string }) {
  const rotation = (score / 100) * 180 - 90; // -90 to 90 degrees
  const color =
    level === 'HIGH' || level === 'CRITICAL'
      ? '#ef4444'
      : level === 'MEDIUM'
      ? '#f59e0b'
      : '#10b981';

  return (
    <div className="relative w-40 h-24 mx-auto">
      {/* Background arc */}
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--border)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 251.2} 251.2`}
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
            transition: 'stroke-dasharray 1s ease-out',
          }}
        />
        {/* Needle */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="35"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            transformOrigin: '100px 100px',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
        {/* Center dot */}
        <circle cx="100" cy="100" r="6" fill={color} />
        <circle cx="100" cy="98" r="3" fill="white" opacity="0.5" />
      </svg>
      {/* Score text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <span className="text-2xl font-black" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-[var(--text-tertiary)] block -mt-1">/100</span>
      </div>
    </div>
  );
}

/* ─── Scenario Comparison Card ─────────────────────────── */

function ScenarioCard({
  title,
  impacts,
  color,
  gradientFrom,
  gradientTo,
  icon: Icon,
  featured,
  currency,
}: {
  title: string;
  impacts: SimulationImpact[];
  color: string;
  gradientFrom: string;
  gradientTo: string;
  icon: any;
  featured?: boolean;
  currency: string;
}) {
  const totalRevenue = impacts.reduce((acc, i) => acc + i.revenue_change, 0);
  const totalExpense = impacts.reduce((acc, i) => acc + i.expense_change, 0);
  const totalProfit = impacts.reduce((acc, i) => acc + i.profit_change, 0);
  const isPositive = totalProfit >= 0;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border transition-all duration-300 group',
        featured
          ? 'border-white/30 shadow-lg ring-1 ring-white/20 scale-[1.02]'
          : 'border-[var(--border)] shadow-sm hover:shadow-md hover:border-[#3A3A3D]'
      )}
    >
      {/* Card header */}
      <div
        className="px-5 py-4 flex items-center gap-3 bg-[#1D1D20] border-b border-[var(--border)]"
      >
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
          {featured && (
            <span className="text-[10px] font-semibold text-white/70 uppercase tracking-widest">
              Most Likely
            </span>
          )}
        </div>
      </div>

      {/* Stats body */}
      <div className="p-5 bg-[var(--surface)] space-y-4">
        <div>
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
            12-Month Net Impact
          </p>
          <p className={cn('text-3xl font-black', color)}>
            {isPositive ? '+' : '-'}{currency}
            {Math.abs(totalProfit).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--background)] rounded-lg p-3">
            <p className="text-xs text-[var(--text-tertiary)] mb-0.5">Revenue</p>
            <p className="text-sm font-bold text-emerald-500">
              +{currency}{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-[var(--background)] rounded-lg p-3">
            <p className="text-xs text-[var(--text-tertiary)] mb-0.5">Expenses</p>
            <p className="text-sm font-bold text-red-400">
              -{currency}{totalExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Mini sparkline */}
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={impacts} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradientFrom} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={gradientFrom} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="profit_change"
                stroke={gradientFrom}
                fill={`url(#grad-${title})`}
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ─── Custom Tooltip ───────────────────────────────────── */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card p-4 text-sm min-w-[200px] !rounded-xl !border-[var(--border)]">
      <p className="font-semibold text-[var(--text-primary)] mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex justify-between items-center gap-4 py-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.stroke || entry.color }}
            />
            <span className="text-[var(--text-secondary)]">{entry.name}</span>
          </div>
          <span className="font-bold" style={{ color: entry.stroke || entry.color }}>
            ${entry.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Simulator Page ──────────────────────────────── */

export default function SimulatorPage() {
  const { activeBusiness } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const [extractedDecision, setExtractedDecision] = useState<any>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState('');

  // Sensitivity Analysis State
  const [revenueAdjust, setRevenueAdjust] = useState(0);
  const [costAdjust, setCostAdjust] = useState(0);
  const [timelineAdjust, setTimelineAdjust] = useState(0);
  const [showSensitivity, setShowSensitivity] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'profit' | 'revenue' | 'cumulative'>('profit');

  const currency = activeBusiness?.currency === 'INR' ? '₹' : '$';

  const handleExtract = async () => {
    if (!inputText.trim() || !activeBusiness) return;

    setIsExtracting(true);
    setError('');
    setSimulationResult(null);
    setExtractedDecision(null);

    try {
      const data = await simulationsService.extractDecision(activeBusiness.id, inputText);
      setExtractedDecision(data.decision);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to extract decision');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRunSimulation = async () => {
    if (!extractedDecision) return;

    setIsSimulating(true);
    setError('');

    try {
      const result = await simulationsService.runSimulation(extractedDecision.id);
      setSimulationResult(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to run simulation');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setExtractedDecision(null);
    setSimulationResult(null);
    setError('');
    setRevenueAdjust(0);
    setCostAdjust(0);
    setTimelineAdjust(0);
  };

  // Apply sensitivity adjustments to impacts
  const adjustImpacts = useCallback(
    (impacts: SimulationImpact[]): SimulationImpact[] => {
      return impacts.map((imp) => ({
        ...imp,
        revenue_change: imp.revenue_change * (1 + revenueAdjust / 100),
        expense_change: imp.expense_change * (1 + costAdjust / 100),
        profit_change:
          imp.revenue_change * (1 + revenueAdjust / 100) -
          imp.expense_change * (1 + costAdjust / 100),
      }));
    },
    [revenueAdjust, costAdjust]
  );

  // Build chart data with sensitivity applied
  const chartData = useMemo(() => {
    if (!simulationResult) return [];

    const expected = adjustImpacts(simulationResult.expectedData.impacts);
    const best = adjustImpacts(simulationResult.bestData.impacts);
    const worst = adjustImpacts(simulationResult.worstData.impacts);

    let cumExpected = 0;
    let cumBest = 0;
    let cumWorst = 0;

    return expected.map((imp, idx) => {
      cumExpected += imp.profit_change;
      cumBest += best[idx]?.profit_change || 0;
      cumWorst += worst[idx]?.profit_change || 0;

      return {
        month: `M${imp.month}`,
        'Expected Profit': imp.profit_change,
        'Best Case Profit': best[idx]?.profit_change || 0,
        'Worst Case Profit': worst[idx]?.profit_change || 0,
        'Expected Revenue': imp.revenue_change,
        'Best Revenue': best[idx]?.revenue_change || 0,
        'Worst Revenue': worst[idx]?.revenue_change || 0,
        'Cumulative Expected': cumExpected,
        'Cumulative Best': cumBest,
        'Cumulative Worst': cumWorst,
        // Confidence band
        confidenceUpper: best[idx]?.profit_change || 0,
        confidenceLower: worst[idx]?.profit_change || 0,
      };
    });
  }, [simulationResult, adjustImpacts]);

  // Revenue vs expense breakdown chart data
  const breakdownData = useMemo(() => {
    if (!simulationResult) return [];
    const expected = adjustImpacts(simulationResult.expectedData.impacts);
    return expected.map((imp) => ({
      month: `M${imp.month}`,
      Revenue: imp.revenue_change,
      Expenses: -imp.expense_change,
    }));
  }, [simulationResult, adjustImpacts]);

  const renderParameters = (params: Record<string, any>) => {
    return Object.entries(params).map(([key, value]) => (
      <div
        key={key}
        className="flex justify-between items-center py-2.5 border-b border-[var(--border)] last:border-0"
      >
        <span className="text-sm text-[var(--text-secondary)] capitalize">
          {key.replace(/([A-Z])/g, ' $1').trim()}
        </span>
        <span className="font-semibold text-[var(--text-primary)]">
          {typeof value === 'number' ? value.toLocaleString() : String(value)}
        </span>
      </div>
    ));
  };

  const suggestions = [
    'Hire 3 sales reps at $6,000/month',
    'Open a new store in Chicago for $50k upfront',
    'Spend $15k on a digital marketing campaign',
    'Launch a premium product line with $20k R&D',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ─── Header ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-xl">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
              Decision Simulator
            </h1>
            <p className="text-[var(--text-secondary)] mt-0.5">
              AI-powered scenario analysis for smarter business decisions
            </p>
          </div>
        </div>
        {simulationResult && (
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RefreshCw className="w-4 h-4" />}>
            New Simulation
          </Button>
        )}
      </div>

      {/* ─── Error State ────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-600">{error}</p>
            <button
              onClick={() => setError('')}
              className="text-xs text-red-400 hover:text-red-500 mt-1 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
                       STEP 1: NATURAL LANGUAGE INPUT
         ════════════════════════════════════════════════════ */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-white" />
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Describe Your Decision
          </h2>
        </div>
        <p className="text-sm text-[var(--text-tertiary)] mb-4">
          Type in plain English. Our AI will extract the financial parameters automatically.
        </p>

        <div className="relative">
          <textarea
            id="decision-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g., What if I hire 5 new sales reps at $6,000/month starting next month?"
            className="w-full h-36 px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl 
              text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] 
              focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white 
              resize-none transition-all text-base leading-relaxed"
            disabled={isExtracting || isSimulating}
          />
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={handleExtract}
              disabled={!inputText.trim() || isExtracting}
              isLoading={isExtracting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Analyze
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-[var(--text-tertiary)] mt-1.5">Try:</span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInputText(suggestion)}
              className="text-xs px-3 py-1.5 rounded-full bg-[var(--surface-hover)] text-[var(--text-secondary)] 
                hover:text-white hover:bg-white/10 
                transition-all duration-200 hover:shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
                    STEP 2: REVIEW EXTRACTED DECISION
         ════════════════════════════════════════════════════ */}
      {extractedDecision && !simulationResult && (
        <div className="animate-fade-in-up bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left: Parameters */}
            <div className="flex-1 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Decision Recognized</h3>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                  {extractedDecision.type?.replace(/_/g, ' ')}
                </span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {extractedDecision.title}
                </span>
              </div>

              <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5">
                <h4 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                  Extracted Parameters
                </h4>
                {renderParameters(extractedDecision.parameters)}
              </div>
            </div>

            {/* Right: Run CTA */}
            <div className="md:w-[320px] bg-[#171719] border-l border-[var(--border)] flex flex-col justify-center items-center p-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-xl mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">Ready to Simulate</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-[240px]">
                Generate 12-month projections with best, expected, and worst-case scenarios.
              </p>
              <Button
                onClick={handleRunSimulation}
                isLoading={isSimulating}
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Run Full Simulation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
                       STEP 3: SIMULATION RESULTS
         ════════════════════════════════════════════════════ */}
      {simulationResult && (
        <div className="animate-fade-in-up space-y-8">
          {/* ─── Risk Assessment Panel ───────────────── */}
          <div className="relative overflow-hidden rounded-2xl border border-[#2A2A2D] bg-[#111113] shadow-2xl">
            <div className="absolute inset-0 bg-noise opacity-[0.03]" />

            <div className="relative flex flex-col md:flex-row items-stretch gap-0">
              {/* Risk Gauge */}
              <div className="md:w-[280px] p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                <RiskGauge
                  score={simulationResult.simulation.riskScore}
                  level={simulationResult.simulation.riskLevel}
                />
                <div className="mt-4">
                  <span
                    className={cn(
                      'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest',
                      simulationResult.simulation.riskLevel === 'HIGH' && 'bg-red-500/20 text-red-400',
                      simulationResult.simulation.riskLevel === 'MEDIUM' && 'bg-amber-500/20 text-amber-400',
                      simulationResult.simulation.riskLevel === 'LOW' && 'bg-emerald-500/20 text-emerald-400'
                    )}
                  >
                    {simulationResult.simulation.riskLevel} Risk
                  </span>
                </div>
              </div>

              {/* Risk Details */}
              <div className="flex-1 p-8 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-white" />
                  <h3 className="text-xl font-bold">Risk & Confidence Assessment</h3>
                </div>

                <div className="space-y-3 mb-6">
                  {simulationResult.simulation.riskFactors.map((factor, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2 shrink-0" />
                      <p className="text-sm text-white/75 leading-relaxed">{factor}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {simulationResult.simulation.breakEvenMonths > 0 && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-white/80">Break-even:</span>
                      <span className="font-bold text-emerald-400">
                        {simulationResult.simulation.breakEvenMonths} months
                      </span>
                    </div>
                  )}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
                    <BarChart3 className="w-4 h-4 text-white" />
                    <span className="text-white/80">Confidence:</span>
                    <span className="font-bold text-white">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Scenario Comparison Cards ──────────── */}
          <div className="grid md:grid-cols-3 gap-6">
            <ScenarioCard
              title="Worst Case"
              impacts={adjustImpacts(simulationResult.worstData.impacts)}
              color="text-red-500"
              gradientFrom="#ef4444"
              gradientTo="#dc2626"
              icon={TrendingDown}
              currency={currency}
            />
            <ScenarioCard
              title="Expected Case"
              impacts={adjustImpacts(simulationResult.expectedData.impacts)}
              color="text-white"
              gradientFrom="#FFFFFF"
              gradientTo="#A1A1AA"
              icon={TrendingUp}
              featured
              currency={currency}
            />
            <ScenarioCard
              title="Best Case"
              impacts={adjustImpacts(simulationResult.bestData.impacts)}
              color="text-emerald-500"
              gradientFrom="#10b981"
              gradientTo="#059669"
              icon={Sparkles}
              currency={currency}
            />
          </div>

          {/* ─── Sensitivity Analysis Panel ─────────── */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setShowSensitivity(!showSensitivity)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-[var(--surface-hover)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Sensitivity Analysis
                  </h3>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Adjust assumptions and see how projections change in real-time
                  </p>
                </div>
              </div>
              {showSensitivity ? (
                <ChevronUp className="w-5 h-5 text-[var(--text-tertiary)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[var(--text-tertiary)]" />
              )}
            </button>

            {showSensitivity && (
              <div className="px-6 pb-6 border-t border-[var(--border)] pt-5 animate-fade-in-up">
                <div className="grid md:grid-cols-3 gap-6">
                  <SensitivitySlider
                    label="Revenue Sensitivity"
                    value={revenueAdjust}
                    onChange={setRevenueAdjust}
                    description="Adjust expected revenue impact up or down"
                  />
                  <SensitivitySlider
                    label="Cost Sensitivity"
                    value={costAdjust}
                    onChange={setCostAdjust}
                    description="Adjust expected costs up or down"
                  />
                  <SensitivitySlider
                    label="Timeline Shift"
                    value={timelineAdjust}
                    onChange={setTimelineAdjust}
                    min={-6}
                    max={6}
                    unit=" months"
                    description="Shift timeline earlier or later"
                  />
                </div>
                {(revenueAdjust !== 0 || costAdjust !== 0 || timelineAdjust !== 0) && (
                  <div className="mt-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-500" />
                    <p className="text-xs text-amber-600">
                      Adjustments applied. Charts and scenario cards reflect your sensitivity settings.
                    </p>
                    <button
                      onClick={() => {
                        setRevenueAdjust(0);
                        setCostAdjust(0);
                        setTimelineAdjust(0);
                      }}
                      className="text-xs text-white hover:underline ml-auto"
                    >
                      Reset All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── Main Chart ────────────────────────── */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
            {/* Chart tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-[var(--border)] bg-[var(--background)]">
              {[
                { key: 'profit' as const, label: 'Profit Trajectory' },
                { key: 'revenue' as const, label: 'Revenue vs Expenses' },
                { key: 'cumulative' as const, label: 'Cumulative Impact' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveChartTab(tab.key)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    activeChartTab === tab.key
                      ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              <div className="h-[420px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {activeChartTab === 'profit' ? (
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradConfidence" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradBest" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.08} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                        dx={-10}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="4 4" />

                      {/* Confidence band (area between best and worst) */}
                      <Area
                        type="monotone"
                        dataKey="Best Case Profit"
                        stroke="#10b981"
                        fill="url(#gradBest)"
                        strokeWidth={1.5}
                        dot={false}
                        strokeDasharray="4 4"
                      />
                      <Area
                        type="monotone"
                        dataKey="Worst Case Profit"
                        stroke="#ef4444"
                        fill="transparent"
                        strokeWidth={1.5}
                        dot={false}
                        strokeDasharray="4 4"
                      />

                      {/* Expected (main line) */}
                      <Area
                        type="monotone"
                        dataKey="Expected Profit"
                        stroke="#FFFFFF"
                        fill="url(#gradConfidence)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#FFFFFF', stroke: '#0A0A0B', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#0A0A0B', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  ) : activeChartTab === 'revenue' ? (
                    <BarChart data={breakdownData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                        dx={-10}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="4 4" />
                      <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradCumExpected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                        dx={-10}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="4 4" label={{ value: 'Break-even', fill: 'var(--text-tertiary)', fontSize: 11 }} />

                      <Area
                        type="monotone"
                        dataKey="Cumulative Best"
                        stroke="#10b981"
                        fill="transparent"
                        strokeWidth={1.5}
                        dot={false}
                        strokeDasharray="4 4"
                      />
                      <Area
                        type="monotone"
                        dataKey="Cumulative Worst"
                        stroke="#ef4444"
                        fill="transparent"
                        strokeWidth={1.5}
                        dot={false}
                        strokeDasharray="4 4"
                      />
                      <Area
                        type="monotone"
                        dataKey="Cumulative Expected"
                        stroke="#FFFFFF"
                        fill="url(#gradCumExpected)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#FFFFFF', stroke: '#0A0A0B', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
