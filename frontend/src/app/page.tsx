'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  ArrowRight,
  Menu,
  X,
  Plus,
  Activity,
  Cpu,
  Lock,
  DollarSign,
  MessageSquare,
  Clock,
  Bot,
  Layers,
  BarChart3,
  CheckCircle2,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// Chart mock telemetry data for the hero preview
const activityDataWeekly = [
  { name: 'Mon', tasks: 160 },
  { name: 'Tue', tasks: 240 },
  { name: 'Wed', tasks: 380 },
  { name: 'Thu', tasks: 310 },
  { name: 'Fri', tasks: 520 },
  { name: 'Sat', tasks: 420 },
  { name: 'Sun', tasks: 590 },
];

const activityDataDaily = [
  { name: '00:00', tasks: 45 },
  { name: '04:00', tasks: 30 },
  { name: '08:00', tasks: 120 },
  { name: '12:00', tasks: 260 },
  { name: '16:00', tasks: 340 },
  { name: '20:00', tasks: 210 },
  { name: '23:59', tasks: 150 },
];

const activityDataMonthly = [
  { name: 'W1', tasks: 1250 },
  { name: 'W2', tasks: 1980 },
  { name: 'W3', tasks: 2450 },
  { name: 'W4', tasks: 3100 },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activityRange, setActivityRange] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [selectedScenario, setSelectedScenario] = useState<'hire' | 'pricing' | 'marketing'>('hire');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const scenarioData = {
    hire: {
      title: 'What if I hire 3 Senior Engineers?',
      revenue: '+₹42.5 L',
      expense: '+₹28.0 L',
      profit: '+₹14.5 L',
      breakeven: '5 months',
      confidence: 94,
    },
    pricing: {
      title: 'What if I raise Enterprise prices by 15%?',
      revenue: '+₹36.0 L',
      expense: '+₹2.5 L',
      profit: '+₹33.5 L',
      breakeven: 'Immediate',
      confidence: 91,
    },
    marketing: {
      title: 'What if I double Google Ads spend?',
      revenue: '+₹25.8 L',
      expense: '+₹12.0 L',
      profit: '+₹13.8 L',
      breakeven: '3 months',
      confidence: 88,
    },
  };

  const faqData = [
    {
      q: 'What is AI decision automation?',
      a: 'AI decision automation combines predictive machine learning with financial multi-scenario modeling to simulate the exact revenue, cost, and cashflow outcomes of strategic business choices before capital is committed.',
    },
    {
      q: 'Do I need technical knowledge to use BusinessPulse?',
      a: 'No technical knowledge is required. You can type plain English questions into the Decision Simulator, upload raw CSV or Excel transaction receipts, or connect existing accounting software in just two clicks.',
    },
    {
      q: 'Can BusinessPulse work with our existing tools?',
      a: 'Yes. BusinessPulse connects directly with Notion, Slack, Shopify, Stripe, Tally, Zoho, and standard SQL databases to maintain real-time telemetry across your entire operations.',
    },
    {
      q: 'Can AI agents make decisions on their own?',
      a: 'By default, all agents operate in advisory copilot mode, providing high-precision recommendations, confidence intervals, and scenario audits. You retain complete human-in-the-loop governance.',
    },
    {
      q: 'Is our corporate financial data secure?',
      a: 'Your data is strictly encrypted in transit via TLS 1.3 and at rest with AES-256. We enforce tenant database isolation, and your corporate records are never used to train public foundational models.',
    },
  ];

  const currentChartData =
    activityRange === 'Daily'
      ? activityDataDaily
      : activityRange === 'Weekly'
      ? activityDataWeekly
      : activityDataMonthly;

  return (
    <div className="min-h-screen bg-[#080B12] text-[#F5F7FB] selection:bg-[#35C9F5]/25 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ─── 1. NAVBAR (Sticky, 64px, 3 Zones) ────────────────────────── */}
      <header className="sticky top-0 z-50 w-full h-16 bg-[#080B12]/90 backdrop-blur-md border-b border-[#253044]">
        <div className="site-container h-full flex items-center justify-between">
          
          {/* Zone 1: Logo (Left) */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#35C9F5]/10 border border-[#35C9F5]/30 flex items-center justify-center text-[#35C9F5] transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-[#F5F7FB] group-hover:text-[#35C9F5] transition-colors">
              Business<span className="text-[#35C9F5]">Pulse</span> <span className="text-xs font-mono font-medium text-[#6F7B90]">AI</span>
            </span>
          </Link>

          {/* Zone 2: Navigation Links (Centered, Equal Gaps) */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#about" className="text-xs font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              About
            </a>
            <a href="#problem" className="text-xs font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              The Old Way
            </a>
            <a href="#platform" className="text-xs font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              Platform
            </a>
            <a href="#agents" className="text-xs font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              AI Agents
            </a>
            <a href="#workflows" className="text-xs font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              Workflows
            </a>
            <a href="#simulator" className="text-xs font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              Simulator
            </a>
            <a href="#faq" className="text-xs font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Zone 3: Login + Book A Demo CTA (Right, Vertically Centered) */}
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/login" className="text-xs font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              Login
            </Link>
            
            <Link href="/register">
              <button className="saas-btn-primary min-h-[44px] h-[44px] px-5 text-xs font-semibold">
                Book A Demo
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#A1AABD] hover:text-[#F5F7FB] focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#F5F7FB]" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#0D111B] border-b border-[#253044] px-6 py-5 flex flex-col space-y-3.5 shadow-xl"
            >
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#A1AABD] hover:text-white py-1">
                About
              </a>
              <a href="#problem" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#A1AABD] hover:text-white py-1">
                The Old Way
              </a>
              <a href="#platform" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#A1AABD] hover:text-white py-1">
                Platform
              </a>
              <a href="#agents" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#A1AABD] hover:text-white py-1">
                AI Agents
              </a>
              <a href="#workflows" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#A1AABD] hover:text-white py-1">
                Workflows
              </a>
              <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#A1AABD] hover:text-white py-1">
                Simulator
              </a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#A1AABD] hover:text-white py-1">
                FAQ
              </a>
              <div className="pt-3 flex flex-col gap-2.5 border-t border-[#253044]">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full min-h-[44px] h-[44px] rounded-lg border border-[#253044] text-xs font-medium text-[#F5F7FB]">
                    Login
                  </button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full saas-btn-primary min-h-[44px] h-[44px] text-xs font-semibold">
                    Book A Demo
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── 2. HERO SECTION ─────────────────────────────────────────── */}
      <section className="w-full pt-16 sm:pt-24 pb-16 sm:pb-24 text-center">
        <div className="site-container flex flex-col items-center">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#35C9F5]/10 border border-[#35C9F5]/25 text-xs font-semibold text-[#35C9F5] mb-6">
            <span>✦</span>
            <span>DECISION INTELLIGENCE PLATFORM</span>
            <span>✦</span>
          </div>

          {/* Primary Headline (Balanced, No Orphan Word) */}
          <h1 className="text-[clamp(36px,5.5vw,64px)] font-bold tracking-tight text-[#F5F7FB] leading-[1.12] max-w-[900px] mx-auto text-center [text-wrap:balance] mb-6">
            Know the Impact Before You Decide.
          </h1>

          {/* Supporting Paragraph (Centered, Readable) */}
          <p className="text-[clamp(15px,2vw,18px)] text-[#A1AABD] max-w-[640px] mx-auto text-center leading-relaxed [text-wrap:pretty] mb-8">
            Turn business data into actionable forecasts, scenario simulations, and
            insights that help you make smarter decisions with confidence.
          </p>

          {/* CTA Buttons (Side by Side, 16px gap, min-h-[44px]) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <button className="saas-btn-primary min-h-[44px] h-12 px-7 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm">
                Book A Demo
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </Link>

            <Link href="/simulator">
              <button className="saas-btn-secondary min-h-[44px] h-12 px-7 rounded-xl font-medium text-sm flex items-center justify-center gap-2">
                Explore Simulator
              </button>
            </Link>
          </div>

          {/* Dashboard Preview Mockup (Max-width 1100px, Exact Centered Axis) */}
          <div className="w-full max-w-[1100px] mx-auto rounded-2xl bg-[#0D111B] border border-[#253044] shadow-2xl overflow-hidden relative text-left">
            
            {/* Top Cyan Highlight Border */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#35C9F5]/80 to-transparent" />

            <div className="flex">
              
              {/* Left 56px Icon Sidebar */}
              <div className="hidden md:flex flex-col items-center justify-between py-6 px-2.5 border-r border-[#253044]/60 bg-[#080B12]/70 w-14 flex-shrink-0">
                <div className="space-y-4">
                  <div className="w-9 h-9 rounded-xl bg-[#35C9F5] text-[#080B12] flex items-center justify-center font-bold shadow-sm cursor-pointer">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 rounded-xl text-[#6F7B90] hover:text-[#35C9F5] hover:bg-[#111827] flex items-center justify-center transition-colors cursor-pointer">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="w-9 h-9 rounded-xl text-[#6F7B90] hover:text-[#35C9F5] hover:bg-[#111827] flex items-center justify-center transition-colors cursor-pointer">
                    <Bot className="w-4 h-4" />
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl text-[#6F7B90] hover:text-white hover:bg-[#111827] flex items-center justify-center transition-colors cursor-pointer">
                  <Sliders className="w-4 h-4" />
                </div>
              </div>

              {/* Main Dashboard Canvas Area */}
              <div className="flex-1 p-5 sm:p-6 lg:p-7 space-y-6">
                
                {/* 1. Header Row (Welcome Left, System State Right) */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#253044]/60">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FB] tracking-tight">
                      Welcome back, <span className="text-[#35C9F5]">John Doe</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#A1AABD] mt-0.5">
                      Automation & Decision Score: 92/100
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-[#111827] border border-[#253044] px-4 py-2 rounded-xl">
                    <div className="relative w-9 h-9 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" className="text-[#151D2B]" strokeWidth="3.5" stroke="currentColor" fill="none" />
                        <circle cx="18" cy="18" r="15" className="text-[#36D399]" strokeWidth="3.5" strokeDasharray="94.2" strokeDashoffset="7.5" strokeLinecap="round" stroke="currentColor" fill="none" />
                      </svg>
                      <span className="absolute text-[11px] font-bold text-[#F5F7FB] font-mono">92%</span>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#6F7B90] uppercase font-mono tracking-wider">System State</div>
                      <div className="text-xs font-semibold text-[#36D399] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#36D399] animate-pulse" />
                        Optimal Telemetry
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Four KPI Cards Grid (Equal Heights & Padding) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                  <div className="p-4 rounded-xl bg-[#111827] border border-[#253044] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#35C9F5]/10 border border-[#35C9F5]/20 flex items-center justify-center text-[#35C9F5] flex-shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#A1AABD] block leading-tight">Tasks Automated</span>
                      <div className="text-lg font-bold text-[#F5F7FB] font-mono mt-0.5 tabular-nums">1,248</div>
                      <span className="text-[10px] text-[#36D399] font-medium font-mono">+12% this week</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#111827] border border-[#253044] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#35C9F5]/10 border border-[#35C9F5]/20 flex items-center justify-center text-[#35C9F5] flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#A1AABD] block leading-tight">Time Saved</span>
                      <div className="text-lg font-bold text-[#F5F7FB] font-mono mt-0.5 tabular-nums">342 hrs</div>
                      <span className="text-[10px] text-[#36D399] font-medium font-mono">≈ ₹8,550 saved</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#111827] border border-[#253044] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#35C9F5]/10 border border-[#35C9F5]/20 flex items-center justify-center text-[#35C9F5] flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#A1AABD] block leading-tight">Forecast Accuracy</span>
                      <div className="text-lg font-bold text-[#F5F7FB] font-mono mt-0.5 tabular-nums">99.7%</div>
                      <span className="text-[10px] text-[#35C9F5] font-medium font-mono">▲ 0.2% variance</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#111827] border border-[#253044] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#35C9F5]/10 border border-[#35C9F5]/20 flex items-center justify-center text-[#35C9F5] flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#A1AABD] block leading-tight">Active AI Agents</span>
                      <div className="text-lg font-bold text-[#F5F7FB] font-mono mt-0.5 tabular-nums">47</div>
                      <span className="text-[10px] text-[#36D399] font-medium font-mono">+3 deployed</span>
                    </div>
                  </div>
                </div>

                {/* 3. Lower Row (Chart ~2fr & Recent Activity ~1fr) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                  
                  {/* Left: Performance Telemetry Area Chart (~2fr) */}
                  <div className="lg:col-span-7 p-5 rounded-xl bg-[#111827] border border-[#253044] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#F5F7FB]">Automation Activity</h3>
                          <span className="text-xs text-[#6F7B90]">(Last 7 Days)</span>
                        </div>

                        <div className="flex items-center gap-1 bg-[#080B12] p-1 rounded-lg border border-[#253044]">
                          {(['Daily', 'Weekly', 'Monthly'] as const).map((range) => (
                            <button
                              key={range}
                              onClick={() => setActivityRange(range)}
                              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                                activityRange === range
                                  ? 'bg-[#35C9F5] text-[#080B12] font-bold'
                                  : 'text-[#A1AABD] hover:text-white'
                              }`}
                            >
                              {range}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="w-full h-48 sm:h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#35C9F5" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#35C9F5" stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#6F7B90" fontSize={11} tickLine={false} axisLine={{ stroke: '#253044' }} />
                            <YAxis stroke="#6F7B90" fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#0D111B',
                                borderColor: '#253044',
                                borderRadius: '8px',
                                fontSize: '12px',
                                color: '#F5F7FB',
                              }}
                            />
                            <Area type="monotone" dataKey="tasks" stroke="#35C9F5" strokeWidth={2} fillOpacity={1} fill="url(#chartGradient)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#253044] text-[11px] text-[#A1AABD]">
                      <span>Peak throughput: 590 events/hr</span>
                      <span className="text-[#35C9F5] font-medium">99.98% runtime reliability</span>
                    </div>
                  </div>

                  {/* Right: Recent Agent Activity Table (~1fr) */}
                  <div className="lg:col-span-5 p-5 rounded-xl bg-[#111827] border border-[#253044] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <h3 className="text-sm font-bold text-[#F5F7FB]">Recent Agent Activity</h3>
                        <Link href="/simulator" className="text-xs text-[#35C9F5] hover:underline flex items-center gap-1">
                          View All <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="space-y-2.5">
                        {[
                          { bot: 'Support Copilot', task: 'Ticket Escalation', status: 'Completed', time: '2m ago', color: 'text-[#36D399] bg-[#36D399]/10 border-[#36D399]/20' },
                          { bot: 'Sales Agent', task: 'Lead Qualification', status: 'Running', time: '8m ago', color: 'text-[#35C9F5] bg-[#35C9F5]/10 border-[#35C9F5]/20' },
                          { bot: 'Finance Agent', task: 'Invoice Reconcile', status: 'Completed', time: '24m ago', color: 'text-[#36D399] bg-[#36D399]/10 border-[#36D399]/20' },
                          { bot: 'Inventory Bot', task: 'Stock Level Forecast', status: 'Pending', time: '45m ago', color: 'text-[#F6BD60] bg-[#F6BD60]/10 border-[#F6BD60]/20' },
                        ].map((row, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-[#080B12] border border-[#253044]/60 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded bg-[#35C9F5]/10 text-[#35C9F5] flex items-center justify-center font-bold text-[10px]">
                                {row.bot.charAt(0)}
                              </div>
                              <div>
                                <span className="font-semibold text-[#F5F7FB] block leading-tight">{row.bot}</span>
                                <span className="text-[10px] text-[#6F7B90]">{row.task}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${row.color}`}>
                                {row.status}
                              </span>
                              <span className="text-[10px] text-[#6F7B90] font-mono hidden sm:inline">{row.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3">
                      <Link href="/simulator">
                        <button className="w-full min-h-[44px] h-[44px] rounded-lg bg-[#35C9F5]/10 text-[#35C9F5] hover:bg-[#35C9F5] hover:text-[#080B12] border border-[#35C9F5]/25 text-xs font-semibold transition-all">
                          Launch Autonomous Agent →
                        </button>
                      </Link>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─── 3. SECTION A: ABOUT BUSINESSPULSE ───────────────────────── */}
      <section id="about" className="section-wrapper">
        <div className="site-container">
          
          {/* Centered Header Block */}
          <div className="flex flex-col items-center text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35C9F5]/10 border border-[#35C9F5]/25 text-[10px] font-mono tracking-[0.2em] uppercase text-[#35C9F5] mb-4">
              ✦ ABOUT BUSINESSPULSE
            </span>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-[#F5F7FB] leading-snug tracking-tight max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              BusinessPulse helps enterprises automate repetitive decisions, connect operational data, and build smarter workflows with AI.
            </h2>
            <p className="text-[clamp(14px,1.5vw,16px)] text-[#A1AABD] max-w-[60ch] mx-auto text-center [text-wrap:pretty] leading-relaxed">
              We combine intelligent simulation agents with continuous telemetry to help executive teams move faster, protect margins, and scale without guesswork.
            </p>
          </div>

          {/* 3 Equal Stat Cards Grid (Equal Heights & Padding) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div className="saas-card flex flex-col justify-between p-6">
              <div>
                <span className="text-[11px] font-mono tracking-[0.16em] uppercase text-[#A1AABD] mb-4 block">
                  TASKS AUTOMATED
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-sm text-[#35C9F5] font-mono font-bold">|</span>
                  <span className="text-4xl sm:text-5xl font-black text-[#F5F7FB] font-mono tracking-tight tabular-nums">
                    67%
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#A1AABD] mt-6 pt-4 border-t border-[#253044]/60">
                Reduction in routine manual administrative operations across connected teams.
              </p>
            </div>

            <div className="saas-card flex flex-col justify-between p-6">
              <div>
                <span className="text-[11px] font-mono tracking-[0.16em] uppercase text-[#A1AABD] mb-4 block">
                  SAVED / WEEK
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-sm text-[#35C9F5] font-mono font-bold">|</span>
                  <span className="text-4xl sm:text-5xl font-black text-[#F5F7FB] font-mono tracking-tight tabular-nums">
                    32 hrs
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#A1AABD] mt-6 pt-4 border-t border-[#253044]/60">
                Reclaimed engineering and managerial bandwidth redirected to growth.
              </p>
            </div>

            <div className="saas-card flex flex-col justify-between p-6">
              <div>
                <span className="text-[11px] font-mono tracking-[0.16em] uppercase text-[#A1AABD] mb-4 block">
                  FASTER RESPONSE TIME
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-sm text-[#35C9F5] font-mono font-bold">|</span>
                  <span className="text-4xl sm:text-5xl font-black text-[#F5F7FB] font-mono tracking-tight tabular-nums">
                    52%
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#A1AABD] mt-6 pt-4 border-t border-[#253044]/60">
                Accelerated time-to-decision on enterprise pricing, hiring, and budget shifts.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 4. SECTION B: THE OLD WAY / BUSINESS PROBLEMS ──────────── */}
      <section id="problem" className="section-wrapper">
        <div className="site-container">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left (7 cols): Header Block + 4 Problem Cards */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35C9F5]/10 border border-[#35C9F5]/25 text-[10px] font-mono tracking-[0.2em] uppercase text-[#35C9F5] mb-4">
                  ✦ THE OLD WAY
                </span>
                <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-[#F5F7FB] tracking-tight [text-wrap:balance] mb-3">
                  Your team shouldn&apos;t be the integration layer.
                </h2>
                <p className="text-sm text-[#A1AABD] max-w-[60ch] [text-wrap:pretty]">
                  Replace manual coordination bottlenecks with autonomous neural loops.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { num: '001', title: 'Manual data entry', desc: 'Your team spends hours moving information between fragmented spreadsheets and portals.' },
                  { num: '002', title: 'Disconnected tools', desc: 'Critical corporate information is scattered across isolated stacks without a single source of truth.' },
                  { num: '003', title: 'Repetitive decisions', desc: 'People execute the same routine operational decisions every day with high variance and delay.' },
                  { num: '004', title: 'Slow execution', desc: 'Simple strategic workflows take weeks to simulate and execute, costing market momentum.' },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="p-5 rounded-xl bg-[#111827] border border-[#253044] hover:border-[#35C9F5]/40 transition-all flex items-start gap-4"
                  >
                    <div className="w-9 flex-shrink-0 text-center font-mono font-semibold text-xs text-[#35C9F5] py-0.5 rounded bg-[#35C9F5]/10 border border-[#35C9F5]/20">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#F5F7FB] mb-1 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs text-[#A1AABD] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right (5 cols): Radar Visual Square Centered in Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="aspect-square w-full max-w-[380px] mx-auto relative flex items-center justify-center rounded-full border border-[#253044] bg-[#0D111B] shadow-lg">
                <div className="absolute inset-8 rounded-full border border-[#253044]/60" />
                <div className="absolute inset-16 rounded-full border border-[#35C9F5]/20" />
                
                {/* Rotating Sweep Beam */}
                <div className="absolute inset-0 rounded-full animate-radar-spin pointer-events-none">
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#35C9F5]/10 to-[#35C9F5]/25 rounded-l-full" />
                </div>

                <div className="z-10 w-12 h-12 rounded-xl bg-[#35C9F5] text-[#080B12] flex items-center justify-center shadow-sm">
                  <Zap className="w-6 h-6 fill-current" />
                </div>

                <div className="absolute top-[12%] right-[8%] z-20 bg-[#151D2B] border border-[#253044] rounded-lg px-2.5 py-1 text-[10px] font-mono text-[#F5F7FB] flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#36D399] animate-pulse" />
                  AUTONOMOUS
                </div>

                <div className="absolute bottom-[12%] left-[8%] z-20 bg-[#151D2B] border border-[#253044] rounded-lg px-2.5 py-1 text-[10px] font-mono text-[#A1AABD] flex items-center gap-1.5 shadow-sm">
                  <Activity className="w-3.5 h-3.5 text-[#35C9F5]" />
                  94% EFFICIENCY
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 5. SECTION C: PLATFORM / INTEGRATIONS ─────────────────── */}
      <section id="platform" className="section-wrapper">
        <div className="site-container">
          
          {/* Centered Header Block Over Full Container Width */}
          <div className="flex flex-col items-center text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35C9F5]/10 border border-[#35C9F5]/25 text-[10px] font-mono tracking-[0.2em] uppercase text-[#35C9F5] mb-4">
              ✦ PLATFORM
            </span>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-[#F5F7FB] tracking-tight max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              One automation layer for your entire business.
            </h2>
            <p className="text-sm text-[#A1AABD] max-w-[60ch] mx-auto text-center [text-wrap:pretty]">
              Ingest telemetry and trigger actions across your existing SaaS software in real-time.
            </p>
          </div>

          {/* 6 Integration Cards Grid (6 on desktop, 3 on tablet, 2 on mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch">
            {[
              { name: 'Notion', desc: 'SOPs & Docs', icon: '📝' },
              { name: 'Slack', desc: 'Alerts & Copilot', icon: '💬' },
              { name: 'Shopify', desc: 'Orders & GMV', icon: '🛍️' },
              { name: 'Stripe', desc: 'Cashflow & MRR', icon: '💳' },
              { name: 'HubSpot', desc: 'CRM Pipelines', icon: '🎯' },
              { name: 'PostgreSQL', desc: 'Raw Telemetry', icon: '🗄️' },
            ].map((app) => (
              <div
                key={app.name}
                className="p-5 rounded-xl bg-[#111827] border border-[#253044] hover:border-[#35C9F5]/40 transition-all text-center flex flex-col items-center justify-center group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#35C9F5]/10 border border-[#35C9F5]/20 flex items-center justify-center text-lg mb-2.5 transition-transform group-hover:scale-105">
                  {app.icon}
                </div>
                <span className="text-xs font-bold text-[#F5F7FB] block mb-0.5">{app.name}</span>
                <span className="text-[10px] text-[#A1AABD] font-mono">{app.desc}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 6. SECTION D: AI AGENTS ───────────────────────────────── */}
      <section id="agents" className="section-wrapper">
        <div className="site-container">
          
          {/* Centered Header Block */}
          <div className="flex flex-col items-center text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35C9F5]/10 border border-[#35C9F5]/25 text-[10px] font-mono tracking-[0.2em] uppercase text-[#35C9F5] mb-4">
              ✦ AI AGENTS
            </span>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-[#F5F7FB] tracking-tight max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              Give every workflow an intelligent operator.
            </h2>
            <p className="text-sm text-[#A1AABD] max-w-[60ch] mx-auto text-center [text-wrap:pretty]">
              Pre-trained autonomous agents built specifically for high-growth operations.
            </p>
          </div>

          {/* 2x2 Grid of Equal-Height Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Sales Agent */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#253044] hover:border-[#35C9F5]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#35C9F5]/10 border border-[#35C9F5]/25 flex items-center justify-center text-[#35C9F5]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#36D399]/10 border border-[#36D399]/20 text-[#36D399] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#36D399] animate-pulse" />
                    ACTIVE
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#F5F7FB] mb-1.5">Sales Agent</h3>
                <p className="text-xs text-[#A1AABD] leading-relaxed mb-6">
                  Qualifies incoming leads, updates CRM pipelines, schedules automated follow-ups, and detects customer churn signals before contracts lapse.
                </p>
              </div>
              <div className="pt-4 border-t border-[#253044]/60">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#6F7B90]">PREDICTION ACCURACY</span>
                  <span className="text-xs font-bold text-[#F5F7FB] tabular-nums">94%</span>
                </div>
                <div className="w-full mt-2 h-1.5 bg-[#151D2B] rounded-full overflow-hidden">
                  <div className="w-[94%] h-full bg-[#35C9F5]" />
                </div>
              </div>
            </div>

            {/* Support Agent */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#253044] hover:border-[#35C9F5]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#35C9F5]/10 border border-[#35C9F5]/25 flex items-center justify-center text-[#35C9F5]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#36D399]/10 border border-[#36D399]/20 text-[#36D399] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#36D399] animate-pulse" />
                    ACTIVE
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#F5F7FB] mb-1.5">Support Agent</h3>
                <p className="text-xs text-[#A1AABD] leading-relaxed mb-6">
                  Resolves common customer requests, categorizes incoming tickets, drafts high-context replies, and autonomously routes high-priority escalations.
                </p>
              </div>
              <div className="pt-4 border-t border-[#253044]/60">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#6F7B90]">AUTONOMOUS RESOLUTION</span>
                  <span className="text-xs font-bold text-[#F5F7FB] tabular-nums">88%</span>
                </div>
                <div className="w-full mt-2 h-1.5 bg-[#151D2B] rounded-full overflow-hidden">
                  <div className="w-[88%] h-full bg-[#35C9F5]" />
                </div>
              </div>
            </div>

            {/* Operations Agent */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#253044] hover:border-[#35C9F5]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#35C9F5]/10 border border-[#35C9F5]/25 flex items-center justify-center text-[#35C9F5]">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#36D399]/10 border border-[#36D399]/20 text-[#36D399] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#36D399] animate-pulse" />
                    ACTIVE
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#F5F7FB] mb-1.5">Operations Agent</h3>
                <p className="text-xs text-[#A1AABD] leading-relaxed mb-6">
                  Monitors daily business pipelines, flags supply chain anomalies, reconciles inventory variances, and dispatches proactive alert reports.
                </p>
              </div>
              <div className="pt-4 border-t border-[#253044]/60">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#6F7B90]">SYSTEM UPTIME</span>
                  <span className="text-xs font-bold text-[#F5F7FB] tabular-nums">99.9%</span>
                </div>
                <div className="w-full mt-2 h-1.5 bg-[#151D2B] rounded-full overflow-hidden">
                  <div className="w-[99.9%] h-full bg-[#36D399]" />
                </div>
              </div>
            </div>

            {/* Finance Agent */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#253044] hover:border-[#35C9F5]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#35C9F5]/10 border border-[#35C9F5]/25 flex items-center justify-center text-[#35C9F5]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#36D399]/10 border border-[#36D399]/20 text-[#36D399] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#36D399] animate-pulse" />
                    ACTIVE
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#F5F7FB] mb-1.5">Finance Agent</h3>
                <p className="text-xs text-[#A1AABD] leading-relaxed mb-6">
                  Processes vendor invoices, reconciles expense trends, and models forward working capital before liabilities accrue or runway drops.
                </p>
              </div>
              <div className="pt-4 border-t border-[#253044]/60">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#6F7B90]">INVOICE VERIFICATION</span>
                  <span className="text-xs font-bold text-[#F5F7FB] tabular-nums">96%</span>
                </div>
                <div className="w-full mt-2 h-1.5 bg-[#151D2B] rounded-full overflow-hidden">
                  <div className="w-[96%] h-full bg-[#35C9F5]" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 7. SECTION E: READY-TO-RUN WORKFLOWS ───────────────────── */}
      <section id="workflows" className="section-wrapper">
        <div className="site-container">
          
          {/* Header Row: Eyebrow + H2 on Left, Action Button on Right */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35C9F5]/10 border border-[#35C9F5]/25 text-[10px] font-mono tracking-[0.2em] uppercase text-[#35C9F5] mb-3">
                ✦ READY-TO-RUN WORKFLOWS
              </span>
              <h2 className="text-[clamp(24px,3.5vw,36px)] font-bold text-[#F5F7FB] tracking-tight [text-wrap:balance]">
                Start with the workflows your team already needs.
              </h2>
            </div>

            <Link href="/simulator">
              <button className="min-h-[44px] px-5 rounded-lg border border-[#253044] bg-[#111827] text-xs font-mono text-[#35C9F5] hover:border-[#35C9F5]/40 transition-all flex-shrink-0">
                EXPLORE ALL TEMPLATES →
              </button>
            </Link>
          </div>

          {/* 3x2 Grid of Equal-Height Template Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {[
              { id: '001', title: 'Customer Onboarding', pipeline: 'Website → AI Agent → CRM → Slack' },
              { id: '002', title: 'Lead Qualification', pipeline: 'Signup → Verification → CRM → Welcome' },
              { id: '003', title: 'Invoice Processing', pipeline: 'Email → AI → Accounting → Approval' },
              { id: '004', title: 'Support Escalation', pipeline: 'Ticket → AI Classification → Team' },
              { id: '005', title: 'Employee Onboarding', pipeline: 'HR → AI → Documents → Access' },
              { id: '006', title: 'Weekly Reporting', pipeline: 'Data → AI Analysis → Executive Report' },
            ].map((flow) => (
              <div
                key={flow.id}
                className="p-6 rounded-xl bg-[#111827] border border-[#253044] hover:border-[#35C9F5]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#35C9F5]/10 border border-[#35C9F5]/20 flex items-center justify-center text-[#35C9F5] mb-3.5">
                    <span className="font-mono text-xs font-bold">/{flow.id}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6F7B90] block mb-1">
                    • TEMPLATE {flow.id}
                  </span>
                  <h4 className="text-sm font-bold text-[#F5F7FB] mb-1.5">{flow.title}</h4>
                  <p className="text-xs font-mono text-[#A1AABD] mb-6">{flow.pipeline}</p>
                </div>

                <Link href="/simulator">
                  <button className="w-full min-h-[44px] h-[44px] rounded-lg border border-[#253044] bg-[#0D111B] text-xs font-mono text-[#A1AABD] hover:text-[#35C9F5] hover:border-[#35C9F5]/40 transition-all font-medium">
                    USE TEMPLATE →
                  </button>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 8. SECTION F: DECISION SIMULATOR ───────────────────────── */}
      <section id="simulator" className="section-wrapper">
        <div className="site-container">
          
          {/* Centered Header Block */}
          <div className="flex flex-col items-center text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35C9F5]/10 border border-[#35C9F5]/25 text-[10px] font-mono tracking-[0.2em] uppercase text-[#35C9F5] mb-4">
              ✦ DECISION SIMULATOR
            </span>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-[#F5F7FB] tracking-tight max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              Test scenarios before you commit capital.
            </h2>
            <p className="text-sm text-[#A1AABD] max-w-[60ch] mx-auto text-center [text-wrap:pretty]">
              Simulate strategic options against live historical data with probabilistic outcome trees.
            </p>
          </div>

          {/* Scenario Tab Pills (Centered Row, 12px gap, min-h-[40px]) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedScenario('hire')}
              className={`min-h-[40px] px-5 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedScenario === 'hire'
                  ? 'bg-[#35C9F5] text-[#080B12] font-semibold'
                  : 'bg-[#111827] border border-[#253044] text-[#A1AABD] hover:text-[#F5F7FB]'
              }`}
            >
              Hire 3 Senior Engineers
            </button>
            <button
              onClick={() => setSelectedScenario('pricing')}
              className={`min-h-[40px] px-5 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedScenario === 'pricing'
                  ? 'bg-[#35C9F5] text-[#080B12] font-semibold'
                  : 'bg-[#111827] border border-[#253044] text-[#A1AABD] hover:text-[#F5F7FB]'
              }`}
            >
              Raise Enterprise Prices 15%
            </button>
            <button
              onClick={() => setSelectedScenario('marketing')}
              className={`min-h-[40px] px-5 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedScenario === 'marketing'
                  ? 'bg-[#35C9F5] text-[#080B12] font-semibold'
                  : 'bg-[#111827] border border-[#253044] text-[#A1AABD] hover:text-[#F5F7FB]'
              }`}
            >
              Double Paid Ad Spend
            </button>
          </div>

          {/* Simulation Panel (24-32px padding, all elements inside) */}
          <div className="bg-[#0D111B] border border-[#253044] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* Top Hypothesis Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#253044]/70">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6F7B90]">
                  TARGET SIMULATION HYPOTHESIS
                </span>
                <h3 className="text-lg font-bold text-[#F5F7FB] mt-0.5">
                  {scenarioData[selectedScenario].title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#36D399]/10 border border-[#36D399]/25 text-xs font-bold text-[#36D399] font-mono">
                  {scenarioData[selectedScenario].confidence}% CONFIDENCE
                </span>
              </div>
            </div>

            {/* 4 Equal Metric Tiles Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 items-stretch">
              <div className="p-4 rounded-xl bg-[#111827] border border-[#253044]">
                <span className="text-[10px] text-[#A1AABD] uppercase font-mono block">Projected Revenue</span>
                <div className="text-xl font-bold text-[#F5F7FB] mt-1 font-mono tabular-nums">
                  {scenarioData[selectedScenario].revenue}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111827] border border-[#253044]">
                <span className="text-[10px] text-[#A1AABD] uppercase font-mono block">Additional Cost</span>
                <div className="text-xl font-bold text-[#FB7185] mt-1 font-mono tabular-nums">
                  {scenarioData[selectedScenario].expense}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111827] border border-[#253044]">
                <span className="text-[10px] text-[#A1AABD] uppercase font-mono block">Net Margin Delta</span>
                <div className="text-xl font-bold text-[#36D399] mt-1 font-mono tabular-nums">
                  {scenarioData[selectedScenario].profit}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111827] border border-[#253044]">
                <span className="text-[10px] text-[#A1AABD] uppercase font-mono block">Payback Period</span>
                <div className="text-xl font-bold text-[#35C9F5] mt-1 font-mono tabular-nums">
                  {scenarioData[selectedScenario].breakeven}
                </div>
              </div>
            </div>

            {/* Bottom Row: Note Text + CTA Inside Card Padding */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#253044]/70">
              <p className="text-xs text-[#A1AABD]">
                Simulate 12-month projections tailored to your historical enterprise records.
              </p>
              <Link href="/simulator">
                <button className="saas-btn-primary min-h-[44px] h-[44px] px-6 text-xs font-semibold flex items-center gap-2">
                  Simulate Your Decision
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 9. SECTION G: FAQ ───────────────────────────────────────── */}
      <section id="faq" className="section-wrapper">
        <div className="site-container">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column (5 cols): Heading & Documentation CTA */}
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35C9F5]/10 border border-[#35C9F5]/25 text-[10px] font-mono uppercase tracking-[0.2em] text-[#35C9F5]">
                ✦ FAQ
              </span>
              <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-[#F5F7FB] tracking-tight leading-tight [text-wrap:balance]">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-[#A1AABD] leading-relaxed">
                Learn how our predictive models and cognitive agents safeguard capital and streamline daily workflows.
              </p>
              <div className="pt-2">
                <Link href="/register">
                  <button className="min-h-[44px] px-5 rounded-lg border border-[#253044] bg-[#111827] text-xs font-mono text-[#F5F7FB] hover:border-[#35C9F5]/40 transition-all">
                    EXPLORE DOCUMENTATION →
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column (7 cols): Clean Accordion Stack */}
            <div className="lg:col-span-7 divide-y divide-[#253044]">
              {faqData.map((item, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="py-4">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left group gap-4"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-[#F5F7FB] group-hover:text-[#35C9F5] transition-colors pr-2">
                        {item.q}
                      </span>
                      <div className="w-8 h-8 rounded-md border border-[#253044] bg-[#111827] flex items-center justify-center text-[#F5F7FB] flex-shrink-0 transition-transform duration-200">
                        {isOpen ? (
                          <X className="w-3.5 h-3.5 text-[#35C9F5]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-[#A1AABD] group-hover:text-[#35C9F5]" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-[#A1AABD] pt-3 leading-relaxed">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ─── 10. SECTION H: FINAL CTA ───────────────────────────────── */}
      <section className="section-wrapper">
        <div className="site-container">
          
          <div className="rounded-2xl bg-[#0D111B] border border-[#253044] p-8 sm:p-14 text-center space-y-4 shadow-xl">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#35C9F5]">
              ✦ READY TO AUTOMATE?
            </span>
            <h2 className="text-[clamp(24px,3.5vw,40px)] font-bold text-[#F5F7FB] tracking-tight [text-wrap:balance]">
              Your next hire could be an AI agent.
            </h2>
            <p className="text-xs sm:text-sm text-[#A1AABD] max-w-[560px] mx-auto text-center leading-relaxed [text-wrap:pretty]">
              Simulate before you invest. Join forward-thinking operators making decisions with quantitative precision.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link href="/register">
                <button className="saas-btn-primary min-h-[44px] h-[44px] px-7 rounded-lg text-xs font-bold inline-flex items-center gap-2 shadow-sm active:scale-[0.98]">
                  Book A Demo
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link href="/simulator">
                <button className="saas-btn-secondary min-h-[44px] h-[44px] px-6 rounded-lg text-xs font-semibold">
                  Explore Platform
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 11. SECTION I: FOOTER ──────────────────────────────────── */}
      <footer className="w-full border-t border-[#253044] py-14">
        <div className="site-container">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#253044]">
            
            {/* Brand Info (1.5fr / 5 cols) */}
            <div className="md:col-span-5 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#35C9F5]/10 border border-[#35C9F5]/30 flex items-center justify-center text-[#35C9F5]">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-[#F5F7FB] text-sm tracking-tight">
                  BusinessPulse AI
                </span>
              </div>
              <p className="text-xs text-[#A1AABD] max-w-sm leading-relaxed">
                Autonomous decision intelligence platform for fast-moving businesses. Know the operational impact before you commit capital.
              </p>
            </div>

            {/* Column 1: Platform (2 cols) */}
            <div className="md:col-span-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#F5F7FB] block mb-3 font-semibold">
                PLATFORM
              </span>
              <ul className="space-y-1.5 text-xs text-[#A1AABD]">
                <li><Link href="/simulator" className="hover:text-[#F5F7FB] transition-colors">Decision Simulator</Link></li>
                <li><Link href="/predictions" className="hover:text-[#F5F7FB] transition-colors">Predictive Forecasts</Link></li>
                <li><Link href="/analytics" className="hover:text-[#F5F7FB] transition-colors">Executive Telemetry</Link></li>
              </ul>
            </div>

            {/* Column 2: Workflows (2 cols) */}
            <div className="md:col-span-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#F5F7FB] block mb-3 font-semibold">
                WORKFLOWS
              </span>
              <ul className="space-y-1.5 text-xs text-[#A1AABD]">
                <li><Link href="/simulator" className="hover:text-[#F5F7FB] transition-colors">Headcount Planning</Link></li>
                <li><Link href="/simulator" className="hover:text-[#F5F7FB] transition-colors">Pricing Elasticity</Link></li>
                <li><Link href="/simulator" className="hover:text-[#F5F7FB] transition-colors">Expansion Modeling</Link></li>
              </ul>
            </div>

            {/* Column 3: Security (3 cols) */}
            <div className="md:col-span-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#F5F7FB] block mb-3 font-semibold">
                SECURITY
              </span>
              <ul className="space-y-1.5 text-xs text-[#A1AABD]">
                <li><span className="text-[#F5F7FB] flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#36D399]" /> AES-256 Encryption</span></li>
                <li><span>TLS 1.3 Transport Protocol</span></li>
                <li><span>Zero Public Model Training</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright (Left) & Legal Links (Right) */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6F7B90]">
            <p>© 2026 BusinessPulse AI. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Security Architecture</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
