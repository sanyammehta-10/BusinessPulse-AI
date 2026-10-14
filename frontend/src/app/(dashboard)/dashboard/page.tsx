'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  Brain,
  Sparkles,
  AlertTriangle,
  Zap,
  Activity,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import KPICard from '@/components/charts/kpi-card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Link from 'next/link';

// Demo data for initial dashboard display
const kpis = [
  {
    title: 'Total Revenue',
    value: 4850000,
    change: 12.5,
    icon: <IndianRupee className="w-5 h-5" />,
    iconBg: 'bg-[#4ADE80]/10 text-[#4ADE80]',
    isCurrency: true,
  },
  {
    title: 'Net Profit',
    value: 1250000,
    change: 8.3,
    icon: <TrendingUp className="w-5 h-5" />,
    iconBg: 'bg-white/10 text-white',
    isCurrency: true,
  },
  {
    title: 'Total Expenses',
    value: 3600000,
    change: -3.2,
    icon: <TrendingDown className="w-5 h-5" />,
    iconBg: 'bg-[#FBBF24]/10 text-[#FBBF24]',
    isCurrency: true,
  },
  {
    title: 'Total Orders',
    value: '2,847',
    change: 15.8,
    icon: <ShoppingCart className="w-5 h-5" />,
    iconBg: 'bg-white/10 text-[#A1A1AA]',
  },
];

const recentInsights = [
  {
    type: 'opportunity',
    title: 'Product A demand increased by 22%',
    description: 'Consider increasing inventory to meet growing demand.',
    priority: 'high' as const,
    tag: 'Inventory Alert',
  },
  {
    type: 'warning',
    title: 'Salary expenses growing faster than revenue',
    description: 'Employee costs have increased 18% while revenue grew only 12%.',
    priority: 'medium' as const,
    tag: 'Margin Compression',
  },
  {
    type: 'insight',
    title: 'Best sales period approaching',
    description: 'October–December historically accounts for 40% of annual revenue.',
    priority: 'info' as const,
    tag: 'Seasonality Model',
  },
];

const recentDecisions = [
  { title: 'Hire 25 employees', type: 'Hiring', risk: 'Medium', impact: '+8% growth', date: '2 days ago' },
  { title: 'Open Chandigarh branch', type: 'Expansion', risk: 'High', impact: '+18% revenue', date: '5 days ago' },
  { title: 'Increase Product B price by 10%', type: 'Pricing', risk: 'Low', impact: '+5% profit', date: '1 week ago' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 w-full min-w-0 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#222226]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/15">
              Live Feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Real-time business telemetry, autonomous diagnostics, and strategic impact tracking.
          </p>
        </div>
        <Link href="/simulator">
          <Button
            variant="primary"
            className="bg-white hover:bg-[#E4E4E7] text-black font-semibold gap-2 shadow-lg shadow-white/5"
            leftIcon={<Brain className="w-4 h-4 text-black" />}
            rightIcon={<ArrowUpRight className="w-4 h-4 text-black" />}
          >
            New Decision
          </Button>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 min-w-0">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 items-start">
        {/* AI Insights (2 cols) */}
        <div className="lg:col-span-2 min-w-0">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle>AI Insights & Recommendations</CardTitle>
                  <span className="text-[11px] text-[#71717A]">Autonomous cognitive analysis</span>
                </div>
              </div>
              <Badge variant="primary" dot>Live Sync</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentInsights.map((insight, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-start gap-3.5 p-4 rounded-xl bg-black/30 border border-white/[0.06] hover:border-white/20 transition-all group min-w-0"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner border border-white/10 ${
                        insight.type === 'opportunity'
                          ? 'bg-[#4ADE80]/10 text-[#4ADE80]'
                          : insight.type === 'warning'
                          ? 'bg-[#FBBF24]/10 text-[#FBBF24]'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {insight.type === 'opportunity' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : insight.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-sm font-bold text-white truncate">
                          {insight.title}
                        </p>
                        <span className="text-[10px] text-[#71717A] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] flex-shrink-0">
                          {insight.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[#A1A1AA] leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions (1 col) */}
        <div className="min-w-0">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Decision Actions</CardTitle>
                <span className="text-[11px] text-[#71717A]">Fast execution pipelines</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                <Link href="/simulator" className="block">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-black/25 border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white group-hover:scale-105 transition-transform flex-shrink-0 shadow-inner">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">Simulate Decision</p>
                      <p className="text-[11px] text-[#71717A] truncate">Predict revenue & cost delta</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#71717A] group-hover:text-white transition-colors flex-shrink-0" />
                  </motion.div>
                </Link>

                <Link href="/data/sales" className="block">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-black/25 border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white group-hover:scale-105 transition-transform flex-shrink-0 shadow-inner">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">Add Sales Stream</p>
                      <p className="text-[11px] text-[#71717A] truncate">Sync CSV or API receipts</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#71717A] group-hover:text-white transition-colors flex-shrink-0" />
                  </motion.div>
                </Link>

                <Link href="/predictions" className="block">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-black/25 border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white group-hover:scale-105 transition-transform flex-shrink-0 shadow-inner">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">View Forecasts</p>
                      <p className="text-[11px] text-[#71717A] truncate">AI revenue trajectory model</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#71717A] group-hover:text-white transition-colors flex-shrink-0" />
                  </motion.div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Decisions Table Card */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle>Recent Decision Simulations</CardTitle>
              <span className="text-[11px] text-[#71717A]">Audited scenario testing history</span>
            </div>
          </div>
          <Link href="/simulator">
            <Button variant="ghost" size="sm" className="text-xs text-[#A1A1AA] hover:text-white gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-white/[0.05]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-black/30">
                  <th className="py-3 px-4 text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Decision Name</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Classification</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Risk Level</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Projected Delta</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Executed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentDecisions.map((d, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-sm font-bold text-white">{d.title}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">
                        {d.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          d.risk === 'Low'
                            ? 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20'
                            : d.risk === 'Medium'
                            ? 'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20'
                            : 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            d.risk === 'Low'
                              ? 'bg-[#4ADE80]'
                              : d.risk === 'Medium'
                              ? 'bg-[#FBBF24]'
                              : 'bg-[#F87171]'
                          }`}
                        />
                        {d.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-bold text-[#4ADE80]">{d.impact}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-[#71717A]">{d.date}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
