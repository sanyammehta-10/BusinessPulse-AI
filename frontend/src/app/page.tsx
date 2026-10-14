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
  FileText,
  ShoppingBag,
  CreditCard,
  Users,
  Database,
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

// Mock telemetry data for the hero preview
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
      
      {/* ─── 1. NAVBAR (Sticky, 72px, 3 Zones) ────────────────────────── */}
      <header className="sticky top-0 z-50 w-full h-[72px] bg-[#080B12]/85 backdrop-blur-md border-b border-white/[0.08]">
        <div className="site-container h-full flex items-center justify-between">
          
          {/* Zone 1: Logo (Left, Plain Icon, No Box) */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Zap className="w-5 h-5 text-[#35C9F5]" />
            <span className="text-base font-bold tracking-tight text-[#F5F7FB] group-hover:text-[#35C9F5] transition-colors">
              Business<span className="text-[#35C9F5]">Pulse</span> <span className="text-xs font-mono font-medium text-[#A1AABD]">AI</span>
            </span>
          </Link>

          {/* Zone 2: Navigation Links (Centered, 32px Gaps) */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              About
            </a>
            <a href="#problem" className="text-sm font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              The Old Way
            </a>
            <a href="#platform" className="text-sm font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              Platform
            </a>
            <a href="#agents" className="text-sm font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              AI Agents
            </a>
            <a href="#workflows" className="text-sm font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              Workflows
            </a>
            <a href="#simulator" className="text-sm font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              Simulator
            </a>
            <a href="#faq" className="text-sm font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Zone 3: Login + Book A Demo CTA (Right, Vertically Centered) */}
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-[#A1AABD] hover:text-[#F5F7FB] transition-colors">
              Login
            </Link>
            
            <Link href="/register">
              <button className="saas-btn-primary">
                Book A Demo
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 text-[#A1AABD] hover:text-[#F5F7FB] focus:outline-none"
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
              className="lg:hidden bg-[#0D111B] border-b border-white/[0.08] px-6 py-5 flex flex-col space-y-3.5"
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
              <div className="pt-3 flex flex-col gap-2.5 border-t border-white/[0.08]">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full saas-btn-ghost">
                    Login
                  </button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full saas-btn-primary">
                    Book A Demo
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── 2. HERO SECTION ─────────────────────────────────────────── */}
      <section className="w-full pt-24 pb-20 text-center">
        <div className="site-container flex flex-col items-center">
          
          {/* Eyebrow Label (Plain Text Only, 13px, Cyan, Tracking 0.08em) */}
          <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#35C9F5] mb-6">
            DECISION INTELLIGENCE PLATFORM
          </div>

          {/* Primary Headline (Line-height 1.05, Max 14ch per line, Breaks Cleanly) */}
          <h1 className="text-[clamp(40px,6vw,72px)] font-bold text-[#F5F7FB] leading-[1.05] tracking-[-0.02em] max-w-[700px] mx-auto text-center [text-wrap:balance] mb-6">
            Know the Impact Before You Decide.
          </h1>

          {/* Supporting Paragraph (17-18px, Line-height 1.6, Muted Color) */}
          <p className="text-[17px] sm:text-[18px] text-[#A1AABD] max-w-[640px] mx-auto text-center leading-[1.6] [text-wrap:pretty] mb-10">
            Turn business data into actionable forecasts, scenario simulations, and
            insights that help you make smarter decisions with confidence.
          </p>

          {/* CTA Buttons (Side by Side, 12px gap, 80px above dashboard) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
            <Link href="/register">
              <button className="saas-btn-primary flex items-center justify-center gap-2">
                Book A Demo
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </Link>

            <Link href="/simulator">
              <button className="saas-btn-ghost flex items-center justify-center gap-2">
                Explore Simulator
              </button>
            </Link>
          </div>

          {/* Surface #1: Dashboard Preview Mockup (Max-width 1040px, 24-32px Padding, Hairline Border) */}
          <div className="w-full max-w-[1040px] mx-auto rounded-xl bg-[#0E131F] border border-white/[0.08] p-6 sm:p-8 text-left relative">
            
            {/* 1. Header Row (Welcome Left, System State Right) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/[0.08]">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#F5F7FB] tracking-tight">
                  Welcome back, <span className="text-[#35C9F5]">John Doe</span>
                </h2>
                <p className="text-[13px] text-[#A1AABD] mt-1">
                  Automation & Decision Score: 92/100
                </p>
              </div>

              {/* System State Telemetry (Plain Inline, No Box) */}
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" className="text-white/[0.08]" strokeWidth="3" stroke="currentColor" fill="none" />
                    <circle cx="18" cy="18" r="15" className="text-[#34D399]" strokeWidth="3" strokeDasharray="94.2" strokeDashoffset="7.5" strokeLinecap="round" stroke="currentColor" fill="none" />
                  </svg>
                  <span className="absolute text-[11px] font-bold text-[#F5F7FB] font-mono">92%</span>
                </div>
                <div>
                  <div className="text-[12px] text-[#6F7B90] uppercase font-mono tracking-wider">System State</div>
                  <div className="text-[13px] font-medium text-[#34D399] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                    Optimal Telemetry
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Four KPIs in One Row Separated by Hairlines (No Cards, No Icon Tiles) */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] items-stretch">
              <div className="py-4 sm:py-0 px-6 first:pl-0 last:pr-0 flex flex-col justify-between">
                <span className="text-[13px] text-[#A1AABD] block leading-tight">Tasks Automated</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#F5F7FB] font-mono mt-2 tabular-nums">1,248</div>
                <span className="text-[13px] text-[#34D399] font-medium font-mono mt-2">+12% this week</span>
              </div>

              <div className="py-4 sm:py-0 px-6 first:pl-0 last:pr-0 flex flex-col justify-between">
                <span className="text-[13px] text-[#A1AABD] block leading-tight">Time Saved</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#F5F7FB] font-mono mt-2 tabular-nums">342 hrs</div>
                <span className="text-[13px] text-[#34D399] font-medium font-mono mt-2">≈ ₹8,550 saved</span>
              </div>

              <div className="py-4 sm:py-0 px-6 first:pl-0 last:pr-0 flex flex-col justify-between">
                <span className="text-[13px] text-[#A1AABD] block leading-tight">Forecast Accuracy</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#F5F7FB] font-mono mt-2 tabular-nums">99.7%</div>
                <span className="text-[13px] text-[#35C9F5] font-medium font-mono mt-2">▲ 0.2% variance</span>
              </div>

              <div className="py-4 sm:py-0 px-6 first:pl-0 last:pr-0 flex flex-col justify-between">
                <span className="text-[13px] text-[#A1AABD] block leading-tight">Active AI Agents</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#F5F7FB] font-mono mt-2 tabular-nums">47</div>
                <span className="text-[13px] text-[#34D399] font-medium font-mono mt-2">+3 deployed</span>
              </div>
            </div>

            {/* 3. Lower Row: Chart (~2fr) & Recent Agent Activity (~1fr), 48px gap */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              
              {/* Left: Performance Telemetry Area Chart (~2fr) */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-lg font-semibold text-[#F5F7FB] leading-snug">Automation Activity</h3>
                      <span className="text-[13px] text-[#6F7B90]">(Last 7 Days)</span>
                    </div>

                    {/* Chart Tabs: Plain Text with Active Underlined */}
                    <div className="flex items-center gap-4">
                      {(['Daily', 'Weekly', 'Monthly'] as const).map((range) => (
                        <button
                          key={range}
                          onClick={() => setActivityRange(range)}
                          className={`text-[13px] font-medium transition-colors pb-1 ${
                            activityRange === range
                              ? 'text-[#35C9F5] border-b-2 border-[#35C9F5]'
                              : 'text-[#A1AABD] hover:text-white border-b-2 border-transparent'
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
                            <stop offset="5%" stopColor="#35C9F5" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#35C9F5" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#6F7B90" fontSize={11} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
                        <YAxis stroke="#6F7B90" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0E131F',
                            borderColor: 'rgba(255,255,255,0.12)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#F5F7FB',
                          }}
                        />
                        <Area type="monotone" dataKey="tasks" stroke="#35C9F5" strokeWidth={1.5} fillOpacity={1} fill="url(#chartGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-[13px] text-[#A1AABD] mt-4">
                  <span>Peak throughput: 590 events/hr</span>
                  <span className="text-[#35C9F5] font-medium">99.98% runtime reliability</span>
                </div>
              </div>

              {/* Right: Recent Agent Activity List (~1fr) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#F5F7FB] leading-snug">Recent Agent Activity</h3>
                    <Link href="/simulator" className="text-xs text-[#35C9F5] hover:underline flex items-center gap-1 font-medium">
                      View All <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="divide-y divide-white/[0.08]">
                    {[
                      { bot: 'Support Copilot', task: 'Ticket Escalation', status: 'Completed', time: '2m ago', color: 'text-[#34D399] bg-[#34D399]' },
                      { bot: 'Sales Agent', task: 'Lead Qualification', status: 'Running', time: '8m ago', color: 'text-[#35C9F5] bg-[#35C9F5]' },
                      { bot: 'Finance Agent', task: 'Invoice Reconcile', status: 'Completed', time: '24m ago', color: 'text-[#34D399] bg-[#34D399]' },
                      { bot: 'Inventory Bot', task: 'Stock Level Forecast', status: 'Pending', time: '45m ago', color: 'text-[#FBBF24] bg-[#FBBF24]' },
                    ].map((row, idx) => (
                      <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-sm text-[#F5F7FB] block leading-tight">{row.bot}</span>
                          <span className="text-[13px] text-[#6F7B90] mt-0.5 block">{row.task}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                            <span className={`w-1.5 h-1.5 rounded-full ${row.color}`} />
                            <span className={row.color.split(' ')[0]}>{row.status}</span>
                          </span>
                          <span className="text-[13px] text-[#6F7B90] font-mono hidden sm:inline">{row.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/simulator">
                    <button className="w-full saas-btn-ghost">
                      Launch Autonomous Agent →
                    </button>
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─── 3. SECTION A: ABOUT BUSINESSPULSE ───────────────────────── */}
      <section id="about" className="section-wrapper">
        <div className="site-container">
          
          {/* Centered Header Block: Eyebrow, 16px, H2, 16px, Subtext, 56px */}
          <div className="flex flex-col items-center text-center mb-14">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#35C9F5] mb-4">
              ABOUT BUSINESSPULSE
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              BusinessPulse helps enterprises automate repetitive decisions, connect operational data, and build smarter workflows with AI.
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] leading-[1.6] max-w-[60ch] mx-auto text-center [text-wrap:pretty]">
              We combine intelligent simulation agents with continuous telemetry to help executive teams move faster, protect margins, and scale without guesswork.
            </p>
          </div>

          {/* 3 Stats as ONE Row with Vertical Hairlines (No Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] items-stretch">
            <div className="px-8 first:pl-0 last:pr-0 py-6 md:py-0 flex flex-col justify-between">
              <div>
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#A1AABD] block">
                  TASKS AUTOMATED
                </span>
                <div className="text-4xl sm:text-5xl font-bold text-[#F5F7FB] font-mono tracking-tight tabular-nums mt-4">
                  67%
                </div>
              </div>
              <p className="text-[15px] text-[#A1AABD] leading-relaxed max-w-[32ch] mt-4">
                Reduction in routine manual administrative operations across connected teams.
              </p>
            </div>

            <div className="px-8 first:pl-0 last:pr-0 py-6 md:py-0 flex flex-col justify-between">
              <div>
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#A1AABD] block">
                  SAVED / WEEK
                </span>
                <div className="text-4xl sm:text-5xl font-bold text-[#F5F7FB] font-mono tracking-tight tabular-nums mt-4">
                  32 hrs
                </div>
              </div>
              <p className="text-[15px] text-[#A1AABD] leading-relaxed max-w-[32ch] mt-4">
                Reclaimed engineering and managerial bandwidth redirected to growth.
              </p>
            </div>

            <div className="px-8 first:pl-0 last:pr-0 py-6 md:py-0 flex flex-col justify-between">
              <div>
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#A1AABD] block">
                  FASTER RESPONSE TIME
                </span>
                <div className="text-4xl sm:text-5xl font-bold text-[#F5F7FB] font-mono tracking-tight tabular-nums mt-4">
                  52%
                </div>
              </div>
              <p className="text-[15px] text-[#A1AABD] leading-relaxed max-w-[32ch] mt-4">
                Accelerated time-to-decision on enterprise pricing, hiring, and budget shifts.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 4. SECTION B: THE OLD WAY / BUSINESS PROBLEMS ──────────── */}
      <section id="problem" className="section-wrapper">
        <div className="site-container">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            
            {/* Left (7 cols): Header Block + 4 Plain Rows */}
            <div className="lg:col-span-7">
              <div>
                <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#35C9F5] mb-4">
                  THE OLD WAY
                </div>
                <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] [text-wrap:balance] mb-4">
                  Your team shouldn&apos;t be the integration layer.
                </h2>
                <p className="text-[16px] text-[#A1AABD] leading-[1.6] max-w-[60ch] [text-wrap:pretty]">
                  Replace manual coordination bottlenecks with autonomous neural loops.
                </p>
              </div>

              {/* 4 Plain Rows with Hairline Dividers */}
              <div className="mt-12 divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
                {[
                  { num: '001', title: 'Manual data entry', desc: 'Your team spends hours moving information between fragmented spreadsheets and portals.' },
                  { num: '002', title: 'Disconnected tools', desc: 'Critical corporate information is scattered across isolated stacks without a single source of truth.' },
                  { num: '003', title: 'Repetitive decisions', desc: 'People execute the same routine operational decisions every day with high variance and delay.' },
                  { num: '004', title: 'Slow execution', desc: 'Simple strategic workflows take weeks to simulate and execute, costing market momentum.' },
                ].map((step) => (
                  <div key={step.num} className="py-5 flex items-start gap-4">
                    <span className="w-12 shrink-0 font-mono text-[14px] text-[#6F7B90] pt-0.5">
                      {step.num}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-[#F5F7FB] leading-[1.3]">
                        {step.title}
                      </h3>
                      <p className="text-[15px] text-[#A1AABD] leading-relaxed mt-1.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right (5 cols): Simplified Radar Graphic Centered in Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="aspect-square w-full max-w-[400px] mx-auto relative flex items-center justify-center rounded-full border border-white/[0.08] bg-[#0E131F]">
                <div className="absolute inset-8 rounded-full border border-white/[0.06]" />
                <div className="absolute inset-16 rounded-full border border-[#35C9F5]/15" />
                
                {/* Rotating Sweep Beam */}
                <div className="absolute inset-0 rounded-full animate-radar-spin pointer-events-none">
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#35C9F5]/10 to-[#35C9F5]/20 rounded-l-full" />
                </div>

                <div className="z-10 flex items-center justify-center text-[#35C9F5]">
                  <Zap className="w-6 h-6 fill-current" />
                </div>

                {/* Plain Small Text Labels Inside Graphic Wrapper */}
                <div className="absolute top-[12%] right-[8%] z-20 text-[12px] font-mono text-[#F5F7FB] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                  AUTONOMOUS
                </div>

                <div className="absolute bottom-[12%] left-[8%] z-20 text-[12px] font-mono text-[#A1AABD] flex items-center gap-1.5">
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
          
          {/* Centered Header Block: Eyebrow, 16px, H2, 16px, Subtext, 56px */}
          <div className="flex flex-col items-center text-center mb-14">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#35C9F5] mb-4">
              PLATFORM
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              One automation layer for your entire business.
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] leading-[1.6] max-w-[60ch] mx-auto text-center [text-wrap:pretty]">
              Ingest telemetry and trigger actions across your existing SaaS software in real-time.
            </p>
          </div>

          {/* ONE Row of 6 Integrations (No Tile Borders, Plain Stroke Icons) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 text-center items-center">
            {[
              { name: 'Notion', desc: 'SOPs & Docs', icon: FileText },
              { name: 'Slack', desc: 'Alerts & Copilot', icon: MessageSquare },
              { name: 'Shopify', desc: 'Orders & GMV', icon: ShoppingBag },
              { name: 'Stripe', desc: 'Cashflow & MRR', icon: CreditCard },
              { name: 'HubSpot', desc: 'CRM Pipelines', icon: Users },
              { name: 'PostgreSQL', desc: 'Raw Telemetry', icon: Database },
            ].map((app) => {
              const IconComponent = app.icon;
              return (
                <div key={app.name} className="flex flex-col items-center justify-center">
                  <IconComponent className="w-5 h-5 text-[#35C9F5]" strokeWidth={1.75} />
                  <span className="text-[15px] font-semibold text-[#F5F7FB] block mt-3">{app.name}</span>
                  <span className="text-[13px] text-[#A1AABD] mt-1">{app.desc}</span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── 6. SECTION D: AI AGENTS ───────────────────────────────── */}
      <section id="agents" className="section-wrapper">
        <div className="site-container">
          
          {/* Centered Header Block: Eyebrow, 16px, H2, 16px, Subtext, 56px */}
          <div className="flex flex-col items-center text-center mb-14">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#35C9F5] mb-4">
              AI AGENTS
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              Give every workflow an intelligent operator.
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] leading-[1.6] max-w-[60ch] mx-auto text-center [text-wrap:pretty]">
              Pre-trained autonomous agents built specifically for high-growth operations.
            </p>
          </div>

          {/* 2x2 Grid of Equal-Height Agents (Hairline on Top, No Card Box) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 items-stretch">
            
            {/* Sales Agent */}
            <div className="border-t border-white/[0.08] pt-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-5 h-5 text-[#35C9F5]" strokeWidth={2} />
                    <h3 className="text-lg font-semibold text-[#F5F7FB]">Sales Agent</h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#34D399] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                    Active
                  </span>
                </div>
                <p className="text-[15px] sm:text-[16px] text-[#A1AABD] leading-relaxed max-w-[52ch] mt-3">
                  Qualifies incoming leads, updates CRM pipelines, schedules automated follow-ups, and detects customer churn signals before contracts lapse.
                </p>
              </div>

              <div className="mt-6">
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="text-[#A1AABD]">Prediction Accuracy</span>
                  <span className="font-semibold text-[#F5F7FB] tabular-nums">94%</span>
                </div>
                <div className="w-full mt-2 h-0.5 bg-white/[0.08]">
                  <div className="w-[94%] h-full bg-[#35C9F5]" />
                </div>
              </div>
            </div>

            {/* Support Agent */}
            <div className="border-t border-white/[0.08] pt-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-5 h-5 text-[#35C9F5]" strokeWidth={2} />
                    <h3 className="text-lg font-semibold text-[#F5F7FB]">Support Agent</h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#34D399] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                    Active
                  </span>
                </div>
                <p className="text-[15px] sm:text-[16px] text-[#A1AABD] leading-relaxed max-w-[52ch] mt-3">
                  Resolves common customer requests, categorizes incoming tickets, drafts high-context replies, and autonomously routes high-priority escalations.
                </p>
              </div>

              <div className="mt-6">
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="text-[#A1AABD]">Autonomous Resolution</span>
                  <span className="font-semibold text-[#F5F7FB] tabular-nums">88%</span>
                </div>
                <div className="w-full mt-2 h-0.5 bg-white/[0.08]">
                  <div className="w-[88%] h-full bg-[#35C9F5]" />
                </div>
              </div>
            </div>

            {/* Operations Agent */}
            <div className="border-t border-white/[0.08] pt-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-5 h-5 text-[#35C9F5]" strokeWidth={2} />
                    <h3 className="text-lg font-semibold text-[#F5F7FB]">Operations Agent</h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#34D399] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                    Active
                  </span>
                </div>
                <p className="text-[15px] sm:text-[16px] text-[#A1AABD] leading-relaxed max-w-[52ch] mt-3">
                  Monitors daily business pipelines, flags supply chain anomalies, reconciles inventory variances, and dispatches proactive alert reports.
                </p>
              </div>

              <div className="mt-6">
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="text-[#A1AABD]">System Uptime</span>
                  <span className="font-semibold text-[#F5F7FB] tabular-nums">99.9%</span>
                </div>
                <div className="w-full mt-2 h-0.5 bg-white/[0.08]">
                  <div className="w-[99.9%] h-full bg-[#34D399]" />
                </div>
              </div>
            </div>

            {/* Finance Agent */}
            <div className="border-t border-white/[0.08] pt-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-5 h-5 text-[#35C9F5]" strokeWidth={2} />
                    <h3 className="text-lg font-semibold text-[#F5F7FB]">Finance Agent</h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#34D399] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                    Active
                  </span>
                </div>
                <p className="text-[15px] sm:text-[16px] text-[#A1AABD] leading-relaxed max-w-[52ch] mt-3">
                  Processes vendor invoices, reconciles expense trends, and models forward working capital before liabilities accrue or runway drops.
                </p>
              </div>

              <div className="mt-6">
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="text-[#A1AABD]">Invoice Verification</span>
                  <span className="font-semibold text-[#F5F7FB] tabular-nums">96%</span>
                </div>
                <div className="w-full mt-2 h-0.5 bg-white/[0.08]">
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
          
          {/* Header Row: Eyebrow + H2 on Left, Action Link on Right */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-14 gap-4">
            <div>
              <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#35C9F5] mb-4">
                READY-TO-RUN WORKFLOWS
              </div>
              <h2 className="text-[clamp(24px,3.5vw,36px)] font-semibold text-[#F5F7FB] tracking-[-0.02em] [text-wrap:balance]">
                Start with the workflows your team already needs.
              </h2>
            </div>

            <Link href="/simulator" className="text-sm font-semibold text-[#35C9F5] hover:underline flex items-center gap-1 flex-shrink-0">
              Explore all templates →
            </Link>
          </div>

          {/* 3x2 Grid of Templates (Hairline on Top, No Card Borders) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14 items-stretch">
            {[
              { id: '001', title: 'Customer Onboarding', pipeline: 'Website → AI Agent → CRM → Slack' },
              { id: '002', title: 'Lead Qualification', pipeline: 'Signup → Verification → CRM → Welcome' },
              { id: '003', title: 'Invoice Processing', pipeline: 'Email → AI → Accounting → Approval' },
              { id: '004', title: 'Support Escalation', pipeline: 'Ticket → AI Classification → Team' },
              { id: '005', title: 'Employee Onboarding', pipeline: 'HR → AI → Documents → Access' },
              { id: '006', title: 'Weekly Reporting', pipeline: 'Data → AI Analysis → Executive Report' },
            ].map((flow) => (
              <div key={flow.id} className="border-t border-white/[0.08] pt-5 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[13px] text-[#6F7B90] block">
                    /{flow.id}
                  </span>
                  <h3 className="text-lg font-semibold text-[#F5F7FB] mt-3">
                    {flow.title}
                  </h3>
                  <p className="text-[15px] text-[#A1AABD] mt-2 leading-relaxed">
                    {flow.pipeline}
                  </p>
                </div>

                <div className="mt-5">
                  <Link href="/simulator" className="text-sm font-medium text-[#35C9F5] hover:underline inline-flex items-center gap-1">
                    Use template →
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 8. SECTION F: DECISION SIMULATOR ───────────────────────── */}
      <section id="simulator" className="section-wrapper">
        <div className="site-container">
          
          {/* Centered Header Block: Eyebrow, 16px, H2, 16px, Subtext, 48px */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#35C9F5] mb-4">
              DECISION SIMULATOR
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              Test scenarios before you commit capital.
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] leading-[1.6] max-w-[60ch] mx-auto text-center [text-wrap:pretty]">
              Simulate strategic options against live historical data with probabilistic outcome trees.
            </p>
          </div>

          {/* Scenario Switcher as Single Row of Text Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-6 border-b border-white/[0.08] pb-3">
            <button
              onClick={() => setSelectedScenario('hire')}
              className={`text-sm transition-colors pb-3 -mb-3.5 ${
                selectedScenario === 'hire'
                  ? 'text-[#35C9F5] font-semibold border-b-2 border-[#35C9F5]'
                  : 'text-[#A1AABD] font-medium hover:text-white border-b-2 border-transparent'
              }`}
            >
              Hire 3 Senior Engineers
            </button>
            <button
              onClick={() => setSelectedScenario('pricing')}
              className={`text-sm transition-colors pb-3 -mb-3.5 ${
                selectedScenario === 'pricing'
                  ? 'text-[#35C9F5] font-semibold border-b-2 border-[#35C9F5]'
                  : 'text-[#A1AABD] font-medium hover:text-white border-b-2 border-transparent'
              }`}
            >
              Raise Enterprise Prices 15%
            </button>
            <button
              onClick={() => setSelectedScenario('marketing')}
              className={`text-sm transition-colors pb-3 -mb-3.5 ${
                selectedScenario === 'marketing'
                  ? 'text-[#35C9F5] font-semibold border-b-2 border-[#35C9F5]'
                  : 'text-[#A1AABD] font-medium hover:text-white border-b-2 border-transparent'
              }`}
            >
              Double Paid Ad Spend
            </button>
          </div>

          {/* Surface #2: Decision Simulator Panel (32-40px Padding, Hairline Border, Radius 12px) */}
          <div className="bg-[#0E131F] border border-white/[0.08] rounded-xl p-8 sm:p-10">
            
            {/* Top Hypothesis Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/[0.08]">
              <div>
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#6F7B90] block">
                  TARGET SIMULATION HYPOTHESIS
                </span>
                <h3 className="text-xl font-semibold text-[#F5F7FB] mt-1">
                  {scenarioData[selectedScenario].title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-mono font-medium text-[#34D399]">
                  <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                  {scenarioData[selectedScenario].confidence}% confidence
                </span>
              </div>
            </div>

            {/* 4 Metrics in One Row Separated by Hairlines (No Tiles) */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] items-stretch">
              <div className="px-6 first:pl-0 last:pr-0 py-4 md:py-0 flex flex-col justify-between">
                <span className="text-[13px] text-[#A1AABD] block">Projected Revenue</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#F5F7FB] mt-2 font-mono tabular-nums">
                  {scenarioData[selectedScenario].revenue}
                </div>
              </div>

              <div className="px-6 first:pl-0 last:pr-0 py-4 md:py-0 flex flex-col justify-between">
                <span className="text-[13px] text-[#A1AABD] block">Additional Cost</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#FB7185] mt-2 font-mono tabular-nums">
                  {scenarioData[selectedScenario].expense}
                </div>
              </div>

              <div className="px-6 first:pl-0 last:pr-0 py-4 md:py-0 flex flex-col justify-between">
                <span className="text-[13px] text-[#A1AABD] block">Net Margin Delta</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#34D399] mt-2 font-mono tabular-nums">
                  {scenarioData[selectedScenario].profit}
                </div>
              </div>

              <div className="px-6 first:pl-0 last:pr-0 py-4 md:py-0 flex flex-col justify-between">
                <span className="text-[13px] text-[#A1AABD] block">Payback Period</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#35C9F5] mt-2 font-mono tabular-nums">
                  {scenarioData[selectedScenario].breakeven}
                </div>
              </div>
            </div>

            {/* Bottom Row: Note Text + CTA Inside Card Padding */}
            <div className="mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08]">
              <p className="text-[14px] text-[#A1AABD]">
                Simulate 12-month projections tailored to your historical enterprise records.
              </p>
              <Link href="/simulator">
                <button className="saas-btn-primary flex items-center gap-2">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            
            {/* Left Column (5 cols): Heading & Documentation CTA */}
            <div className="lg:col-span-5">
              <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#35C9F5] mb-4">
                FAQ
              </div>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] [text-wrap:balance] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-[16px] text-[#A1AABD] leading-relaxed">
                Learn how our predictive models and cognitive agents safeguard capital and streamline daily workflows.
              </p>
              <div className="mt-8">
                <Link href="/register" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#35C9F5] hover:underline">
                  Explore documentation →
                </Link>
              </div>
            </div>

            {/* Right Column (7 cols): Accordion Rows with Hairlines */}
            <div className="lg:col-span-7 divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
              {faqData.map((item, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="py-[22px]">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left group gap-4"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[17px] font-medium text-[#F5F7FB] group-hover:text-[#35C9F5] transition-colors pr-2">
                        {item.q}
                      </span>
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        {isOpen ? (
                          <X className="w-4 h-4 text-[#35C9F5]" />
                        ) : (
                          <Plus className="w-4 h-4 text-[#A1AABD] group-hover:text-[#35C9F5]" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <p className="text-[16px] text-[#A1AABD] pt-3 leading-relaxed max-w-[64ch]">
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

      {/* ─── 10. SECTION H: FINAL CTA (No Card Box, Centered) ─────────── */}
      <section className="section-wrapper">
        <div className="site-container">
          
          <div className="max-w-[720px] mx-auto text-center">
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] [text-wrap:balance]">
              Your next hire could be an AI agent.
            </h2>
            <p className="text-[16px] text-[#A1AABD] max-w-[560px] mx-auto text-center leading-[1.6] [text-wrap:pretty] mt-4">
              Simulate before you invest. Join forward-thinking operators making decisions with quantitative precision.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <button className="saas-btn-primary flex items-center gap-2">
                  Book A Demo
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link href="/simulator">
                <button className="saas-btn-ghost">
                  Explore Platform
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 11. SECTION I: FOOTER ──────────────────────────────────── */}
      <footer className="w-full border-t border-white/[0.08] pt-20 pb-16">
        <div className="site-container">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Brand Info (5 cols) */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#35C9F5]" />
                <span className="font-bold text-[#F5F7FB] text-base tracking-tight">
                  BusinessPulse AI
                </span>
              </div>
              <p className="text-[14px] text-[#A1AABD] max-w-[36ch] leading-relaxed mt-4">
                Autonomous decision intelligence platform for fast-moving businesses. Know the operational impact before you commit capital.
              </p>
            </div>

            {/* Column 1: Platform (2 cols) */}
            <div className="md:col-span-2">
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6F7B90] block">
                PLATFORM
              </span>
              <ul className="mt-5 space-y-3 text-[14px] text-[#A1AABD]">
                <li><Link href="/simulator" className="hover:text-white transition-colors">Decision Simulator</Link></li>
                <li><Link href="/predictions" className="hover:text-white transition-colors">Predictive Forecasts</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">Executive Telemetry</Link></li>
              </ul>
            </div>

            {/* Column 2: Workflows (2 cols) */}
            <div className="md:col-span-2">
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6F7B90] block">
                WORKFLOWS
              </span>
              <ul className="mt-5 space-y-3 text-[14px] text-[#A1AABD]">
                <li><Link href="/simulator" className="hover:text-white transition-colors">Headcount Planning</Link></li>
                <li><Link href="/simulator" className="hover:text-white transition-colors">Pricing Elasticity</Link></li>
                <li><Link href="/simulator" className="hover:text-white transition-colors">Expansion Modeling</Link></li>
              </ul>
            </div>

            {/* Column 3: Security (3 cols) */}
            <div className="md:col-span-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6F7B90] block">
                SECURITY
              </span>
              <ul className="mt-5 space-y-3 text-[14px] text-[#A1AABD]">
                <li><span className="text-[#F5F7FB] flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#34D399]" /> AES-256 Encryption</span></li>
                <li><span>TLS 1.3 Transport Protocol</span></li>
                <li><span>Zero Public Model Training</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright (Left) & Legal Links (Right) */}
          <div className="mt-16 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#6F7B90]">
            <p>© 2026 BusinessPulse AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
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
