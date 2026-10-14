'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api-client';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  Target,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';

/* ─── Time Period Selector ─────────────────────────────── */

type Period = 'week' | 'month' | 'quarter' | 'year';

function PeriodSelector({
  value,
  onChange,
}: {
  value: Period;
  onChange: (val: Period) => void;
}) {
  const periods: { key: Period; label: string }[] = [
    { key: 'week', label: '7D' },
    { key: 'month', label: '30D' },
    { key: 'quarter', label: '90D' },
    { key: 'year', label: '1Y' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--background)] border border-[var(--border)]">
      {periods.map((p) => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
            value === p.key
              ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Stat Card ────────────────────────────────────────── */

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  iconColor,
  prefix = '',
  suffix = '',
}: {
  label: string;
  value: string | number;
  change?: number;
  icon: any;
  iconColor: string;
  prefix?: string;
  suffix?: string;
}) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:shadow-md hover:border-[var(--primary-light)] transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
            iconColor
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold',
              isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-[var(--text-primary)] mb-0.5">
        {prefix}
        {typeof value === 'number' ? value.toLocaleString() : value}
        {suffix}
      </p>
      <p className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

/* ─── Custom Tooltip ───────────────────────────────────── */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-[var(--text-primary)] mb-1.5">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[var(--text-secondary)]">{entry.name}:</span>
          <span className="font-bold" style={{ color: entry.color }}>
            ${entry.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Chart Colors ─────────────────────────────────────── */

const CHART_COLORS = ['#FFFFFF', '#D4D4D8', '#A1A1AA', '#71717A', '#52525B', '#3F3F46', '#4ADE80', '#FBBF24'];

/* ─── Main Analytics Page ──────────────────────────────── */

export default function AnalyticsPage() {
  const { activeBusiness } = useAuthStore();
  const [period, setPeriod] = useState<Period>('month');

  const businessId = activeBusiness?.id;
  const currency = activeBusiness?.currency === 'INR' ? '₹' : '$';

  // Fetch metrics
  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics', businessId],
    queryFn: async () => {
      if (!businessId) return null;
      const res = await api.get(`/businesses/${businessId}/metrics/snapshot`);
      return res.data.data;
    },
    enabled: !!businessId,
  });

  // Fetch data quality
  const { data: dqData } = useQuery({
    queryKey: ['data-quality', businessId],
    queryFn: async () => {
      if (!businessId) return null;
      const res = await api.get(`/businesses/${businessId}/data-quality/score`);
      return res.data.data;
    },
    enabled: !!businessId,
  });

  // Fetch expense breakdown
  const { data: expenseBreakdown } = useQuery({
    queryKey: ['expense-breakdown', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const res = await api.get(`/businesses/${businessId}/metrics/expenses/breakdown`);
      return res.data.data || [];
    },
    enabled: !!businessId,
  });

  // Fetch revenue by product
  const { data: revenueByProduct } = useQuery({
    queryKey: ['revenue-by-product', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const res = await api.get(`/businesses/${businessId}/metrics/revenue/by-product`);
      return res.data.data || [];
    },
    enabled: !!businessId,
  });

  // Generate demo monthly trend data (since we don't have a time-series endpoint yet)
  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseRevenue = metricsData?.totalRevenue?.value || 500000;
    const baseExpense = metricsData?.totalExpenses?.value || 350000;

    return months.map((month, i) => {
      const seasonality = 1 + Math.sin((i / 12) * Math.PI * 2 - Math.PI / 2) * 0.15;
      const growth = 1 + i * 0.02;
      const rev = Math.round((baseRevenue / 12) * seasonality * growth);
      const exp = Math.round((baseExpense / 12) * (1 + Math.random() * 0.1));
      return {
        month,
        Revenue: rev,
        Expenses: exp,
        Profit: rev - exp,
      };
    });
  }, [metricsData]);

  // Pie data for expenses
  const expensePieData = useMemo(() => {
    if (!expenseBreakdown?.length) {
      return [
        { name: 'Salaries', value: 40, color: CHART_COLORS[0] },
        { name: 'Rent', value: 20, color: CHART_COLORS[1] },
        { name: 'Marketing', value: 15, color: CHART_COLORS[2] },
        { name: 'Operations', value: 15, color: CHART_COLORS[3] },
        { name: 'Other', value: 10, color: CHART_COLORS[4] },
      ];
    }
    return expenseBreakdown.slice(0, 6).map((item: any, i: number) => ({
      name: item.category,
      value: item.percentage || Math.round(item.amount),
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [expenseBreakdown]);

  // Product revenue data
  const productData = useMemo(() => {
    if (!revenueByProduct?.length) {
      return [
        { name: 'Product A', revenue: 180000 },
        { name: 'Product B', revenue: 120000 },
        { name: 'Product C', revenue: 90000 },
        { name: 'Product D', revenue: 60000 },
        { name: 'Product E', revenue: 45000 },
      ];
    }
    return revenueByProduct.slice(0, 6).map((item: any) => ({
      name: item.productName,
      revenue: Math.round(item.revenue),
    }));
  }, [revenueByProduct]);

  // Data quality gauge
  const dqScore = dqData?.score ?? 78;
  const dqGrade = dqData?.grade ?? 'B+';
  const dataQualityGauge = [
    { name: 'Score', value: dqScore, fill: dqScore >= 75 ? '#10b981' : dqScore >= 50 ? '#f59e0b' : '#ef4444' },
  ];

  const metrics = metricsData;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ─── Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
              Analytics
            </h1>
            <p className="text-[var(--text-secondary)] text-sm mt-0.5">
              Deep dive into your business performance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PeriodSelector value={period} onChange={setPeriod} />
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* ─── KPI Grid ────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={metrics?.totalRevenue?.value ?? 0}
          change={metrics?.totalRevenue?.changePercent ?? 12.5}
          icon={DollarSign}
          iconColor="bg-[#4ADE80]/10 text-[#4ADE80]"
          prefix={currency}
        />
        <StatCard
          label="Net Profit"
          value={metrics?.netProfit?.value ?? 0}
          change={metrics?.netProfit?.changePercent ?? 8.3}
          icon={TrendingUp}
          iconColor="bg-white/10 text-white"
          prefix={currency}
        />
        <StatCard
          label="Gross Margin"
          value={metrics?.grossMargin?.value ?? 0}
          change={metrics?.grossMargin?.changePercent}
          icon={Target}
          iconColor="bg-[#FBBF24]/10 text-[#FBBF24]"
          suffix="%"
        />
        <StatCard
          label="Revenue / Employee"
          value={metrics?.revenuePerEmployee?.value ?? 0}
          change={metrics?.revenuePerEmployee?.changePercent}
          icon={Users}
          iconColor="bg-white/10 text-[#A1A1AA]"
          prefix={currency}
        />
      </div>

      {/* ─── Revenue & Profit Trend ──────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-white" />
            <CardTitle>Revenue & Profit Trend</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#4ADE80" stopOpacity={0} />
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
                  tickFormatter={(val) => `${currency}${(val / 1000).toFixed(0)}k`}
                  dx={-10}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '16px' }} />
                <Area
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#FFFFFF"
                  fill="url(#gradRev)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#FFFFFF', stroke: '#0A0A0B', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="Profit"
                  stroke="#4ADE80"
                  fill="url(#gradProfit)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: '#4ADE80', stroke: '#0A0A0B', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="Expenses"
                  stroke="#F87171"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ─── Two Column: Expense Pie + Product Revenue Bar ─ */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-white" />
              <CardTitle>Expense Breakdown</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="w-[200px] h-[200px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {expensePieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value}%`, '']}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-md)',
                        background: 'var(--surface)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2.5">
                {expensePieData.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-[var(--text-secondary)]">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Product */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-white" />
              <CardTitle>Revenue by Product</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productData}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
                    tickFormatter={(val) => `${currency}${(val / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                    width={90}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#FFFFFF"
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Bottom Row: Data Quality + Quick Stats ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Data Quality Gauge */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#4ADE80]" />
              <CardTitle>Data Quality</CardTitle>
            </div>
            <Badge
              variant={dqScore >= 75 ? 'success' : dqScore >= 50 ? 'warning' : 'danger'}
              dot
            >
              {dqGrade}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-[160px] h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="100%"
                    innerRadius="80%"
                    outerRadius="100%"
                    barSize={12}
                    data={dataQualityGauge}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      background={{ fill: 'var(--border)' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center -mt-4">
                <p className="text-4xl font-black text-[var(--text-primary)]">{dqScore}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">out of 100</p>
              </div>
              {dqData?.issues?.length > 0 && (
                <div className="mt-4 w-full space-y-1.5">
                  {dqData.issues.slice(0, 3).map((issue: any, i: number) => (
                    <div
                      key={i}
                      className="text-xs text-[var(--text-tertiary)] flex items-start gap-2 bg-[var(--background)] rounded-lg p-2"
                    >
                      <span className="text-amber-500 mt-0.5">⚠</span>
                      {issue.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Operational Metrics */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-white" />
                <CardTitle>Operational Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  {
                    label: 'Avg Order Value',
                    value: `${currency}${(metrics?.averageOrderValue?.value ?? 0).toLocaleString()}`,
                    trend: metrics?.averageOrderValue?.trend,
                  },
                  {
                    label: 'Total Sales Count',
                    value: (metrics?.totalSalesCount?.value ?? 0).toLocaleString(),
                    trend: metrics?.totalSalesCount?.trend,
                  },
                  {
                    label: 'Employee Count',
                    value: (metrics?.employeeCount?.value ?? 0).toLocaleString(),
                    trend: metrics?.employeeCount?.trend,
                  },
                  {
                    label: 'Net Profit Margin',
                    value: `${metrics?.netProfitMargin?.value ?? 0}%`,
                    trend: metrics?.netProfitMargin?.trend,
                  },
                  {
                    label: 'Employee Cost',
                    value: `${currency}${(metrics?.totalEmployeeCost?.value ?? 0).toLocaleString()}`,
                    trend: metrics?.totalEmployeeCost?.trend,
                  },
                  {
                    label: 'Net Cash Flow',
                    value: `${currency}${(metrics?.netCashFlow?.value ?? 0).toLocaleString()}`,
                    trend: metrics?.netCashFlow?.trend,
                  },
                ].map((metric, i) => (
                  <div
                    key={i}
                    className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 hover:border-[var(--primary-light)] transition-colors"
                  >
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5 font-medium">
                      {metric.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-[var(--text-primary)]">{metric.value}</p>
                      {metric.trend && (
                        <span
                          className={cn(
                            'text-xs',
                            metric.trend === 'up' ? 'text-emerald-500' : metric.trend === 'down' ? 'text-red-400' : 'text-[var(--text-tertiary)]'
                          )}
                        >
                          {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
