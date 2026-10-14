'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Home,
  BarChart2,
  Package,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  Coins,
  HeartPulse,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#030712] text-[#F5F7FB] selection:bg-[#00D2FE]/25 selection:text-white font-sans antialiased overflow-x-hidden relative">
      
      {/* ─── AMBIENT CYAN ATMOSPHERIC GLOWS ──────────────────────────── */}
      {/* Left nebula glow */}
      <div className="absolute top-[80px] left-[-18%] w-[620px] h-[620px] bg-[#00D2FE]/18 blur-[150px] rounded-full pointer-events-none -z-10" />
      {/* Right nebula glow */}
      <div className="absolute top-[80px] right-[-18%] w-[620px] h-[620px] bg-[#00D2FE]/18 blur-[150px] rounded-full pointer-events-none -z-10" />
      {/* Central glow behind hero dashboard */}
      <div className="absolute top-[380px] left-1/2 -translate-x-1/2 w-[85%] max-w-[950px] h-[400px] bg-[#00D2FE]/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* ─── 1. NAVBAR (Sticky, Brand Logo, Centered Links, Watch Demo CTA) ── */}
      <header className="sticky top-0 z-50 w-full h-[76px] bg-[#030712]/80 backdrop-blur-md">
        <div className="site-container h-full flex items-center justify-between">
          
          {/* Logo: 4 Cyan Vertical Bars + BusinessPulseAI */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-end gap-[3px] h-5">
              <span className="w-1 h-2 rounded-[1px] bg-[#00D2FE]" />
              <span className="w-1 h-3 rounded-[1px] bg-[#00D2FE]" />
              <span className="w-1 h-4 rounded-[1px] bg-[#00D2FE]" />
              <span className="w-1 h-5 rounded-[1px] bg-[#00D2FE]" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity">
              Business<span className="text-[#00D2FE]">PulseAI</span>
            </span>
          </Link>

          {/* Centered Navigation Links with 'Home' active indicator */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="relative text-sm font-medium text-white pb-1 group">
              Home
              <span className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-[#00D2FE] rounded-full" />
            </Link>
            <a href="#about" className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
              Features
            </a>
            <a href="#problem" className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#simulator" className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Button: Watch Demo Pill with Cyan Circular Play Icon */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('dashboard-preview');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-10 px-4 rounded-full border border-white/15 bg-transparent hover:border-[#00D2FE]/60 text-white text-xs sm:text-sm font-medium inline-flex items-center gap-2.5 transition-all group"
            >
              <span>Watch Demo</span>
              <div className="w-5 h-5 rounded-full bg-[#00D2FE] flex items-center justify-center text-[#030712] transition-transform group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current ml-0.5">
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              </div>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 text-[#94A3B8] hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#070D18] border-b border-white/[0.08] px-6 py-5 flex flex-col space-y-3.5 shadow-2xl"
            >
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm text-white font-medium py-1">
                Home
              </Link>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white py-1">
                Features
              </a>
              <a href="#problem" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white py-1">
                How It Works
              </a>
              <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white py-1">
                Pricing
              </a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white py-1">
                Contact
              </a>
              <div className="pt-3 flex flex-col gap-2.5 border-t border-white/[0.08]">
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full h-11 rounded-xl bg-[#00D2FE] text-[#030712] text-xs font-semibold">
                    Get Started Free
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── 2. HERO SECTION (Centered Headline, Higher Dashboard Preview) ── */}
      <section className="w-full pt-12 sm:pt-16 pb-16 text-center relative">
        <div className="site-container flex flex-col items-center">
          
          {/* Eyebrow Label: ✦ AI-Powered Business Intelligence */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00D2FE]/10 border border-[#00D2FE]/30 text-xs sm:text-sm font-medium text-white mb-6 backdrop-blur-sm shadow-[0_0_20px_rgba(0,210,254,0.15)]">
            <span className="text-[#00D2FE] text-base leading-none">✦</span>
            <span>AI-Powered Business Intelligence</span>
          </div>

          {/* Primary Headline: Know the Impact / Before You Decide */}
          <h1 className="text-[clamp(42px,6vw,76px)] font-bold text-white leading-[1.08] tracking-[-0.02em] max-w-[850px] mx-auto text-center [text-wrap:balance] mb-5">
            Know the Impact<br />Before You Decide
          </h1>

          {/* Supporting Paragraph */}
          <p className="text-[16px] sm:text-[17px] text-[#94A3B8] max-w-[620px] mx-auto text-center leading-[1.6] [text-wrap:pretty] mb-8">
            BusinessPulseAI creates a digital twin of your business, predicts the impact of your decisions, and helps you grow with confidence.
          </p>

          {/* Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <Link href="/register">
              <button className="h-12 px-6 rounded-xl bg-[#00D2FE] hover:bg-[#38E1FF] text-[#030712] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(0,210,254,0.35)] hover:shadow-[0_0_40px_rgba(0,210,254,0.55)]">
                Get Started Free
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </Link>

            <button 
              onClick={() => {
                const el = document.getElementById('dashboard-preview');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-12 px-5 rounded-xl bg-[#0A1220]/80 hover:bg-[#0E1A2E] border border-white/10 hover:border-white/20 text-white font-medium text-sm inline-flex items-center justify-center gap-3 transition-all backdrop-blur-sm"
            >
              <div className="w-5 h-5 rounded-full bg-[#00D2FE] flex items-center justify-center text-[#030712]">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current ml-0.5">
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              </div>
              <span>Watch Demo</span>
            </button>
          </div>

          {/* ─── DASHBOARD MOCKUP (Moved Higher, Shows 4 KPI Cards, Graphs Removed) ─── */}
          <div 
            id="dashboard-preview"
            className="w-full max-w-[1100px] mx-auto rounded-2xl bg-[#060B13] border border-[#00D2FE]/45 shadow-[0_0_70px_-10px_rgba(0,210,254,0.32)] relative overflow-hidden text-left"
          >
            {/* Top Bar Header */}
            <div className="h-16 px-5 sm:px-6 border-b border-[#1E293B]/60 bg-[#060B13] flex items-center justify-between gap-4">
              
              {/* Left: Dashboard Brand Logo */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div className="flex items-end gap-[3px] h-5">
                  <span className="w-1 h-2 rounded-[1px] bg-[#00D2FE]" />
                  <span className="w-1 h-3 rounded-[1px] bg-[#00D2FE]" />
                  <span className="w-1 h-4 rounded-[1px] bg-[#00D2FE]" />
                  <span className="w-1 h-5 rounded-[1px] bg-[#00D2FE]" />
                </div>
                <span className="text-base font-bold tracking-tight text-white hidden sm:inline">
                  Business<span className="text-[#00D2FE]">PulseAI</span>
                </span>
              </div>

              {/* Center: Search Bar */}
              <div className="relative w-full max-w-[320px] md:max-w-[380px] hidden sm:block">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  readOnly
                  placeholder="Search for insights, reports..."
                  className="w-full h-9 bg-[#0B1322] border border-[#1E293B]/60 rounded-lg pl-9 pr-3 text-xs text-gray-300 placeholder:text-gray-500 focus:outline-none cursor-default"
                />
              </div>

              {/* Right: Notifications & Profile */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <button className="text-[#94A3B8] hover:text-white transition-colors p-1" aria-label="Notifications">
                  <Bell className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2.5 pl-2 border-l border-[#1E293B]/60">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#00D2FE]/40 relative bg-[#1E293B]">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt="Sanyam Mehta"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="text-xs font-semibold text-white block leading-tight">Sanyam Mehta</span>
                    <span className="text-[10px] text-gray-400 block leading-tight">Business Owner</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>

            </div>

            {/* Dashboard Inner Body: Left Sidebar + Right 4-KPI Content */}
            <div className="flex">
              
              {/* Left Sidebar */}
              <aside className="hidden md:flex flex-col justify-between w-48 lg:w-52 border-r border-[#1E293B]/60 bg-[#060B13] p-3 space-y-1 flex-shrink-0">
                <div className="space-y-1">
                  <div className="bg-[#00D2FE] text-[#030712] font-semibold text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 shadow-sm cursor-pointer">
                    <Home className="w-4 h-4 fill-current" />
                    <span>Dashboard</span>
                  </div>
                  <div className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer">
                    <BarChart2 className="w-4 h-4" />
                    <span>Analytics</span>
                  </div>
                  <div className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer">
                    <Zap className="w-4 h-4" />
                    <span>Decision Simulator</span>
                  </div>
                  <div className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer">
                    <TrendingUp className="w-4 h-4" />
                    <span>Sales</span>
                  </div>
                  <div className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer">
                    <CreditCard className="w-4 h-4" />
                    <span>Expenses</span>
                  </div>
                  <div className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer">
                    <Package className="w-4 h-4" />
                    <span>Products</span>
                  </div>
                  <div className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer">
                    <Database className="w-4 h-4" />
                    <span>Inventory</span>
                  </div>
                  <div className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer">
                    <Users className="w-4 h-4" />
                    <span>Employees</span>
                  </div>
                </div>
              </aside>

              {/* Main Content: Greeting + 4 KPI Cards (Graphs Removed) */}
              <div className="flex-1 p-5 sm:p-6 bg-[#070D18]">
                
                {/* Greeting Row + Date Picker */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Welcome Back, Sanyam
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Here&apos;s your business performance overview.
                    </p>
                  </div>

                  {/* Date Filter Dropdown */}
                  <div className="bg-[#0B1322] border border-[#1E293B]/60 rounded-lg px-3 py-1.5 text-xs text-gray-300 flex items-center gap-2 self-start sm:self-auto cursor-pointer">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Jun 2025 - Jun 2026</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>

                {/* The 4 KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Card 1: Total Revenue */}
                  <div className="bg-[#0A101D] border border-[#1E293B]/70 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#00D2FE]/15 border border-[#00D2FE]/25 flex items-center justify-center text-[#00D2FE] flex-shrink-0">
                        <BarChart2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] text-[#94A3B8] block leading-tight">Total Revenue</span>
                        <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-0.5 tabular-nums">
                          ₹12.5L
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] font-mono flex items-center gap-1.5">
                      <span className="text-[#34D399] font-medium flex items-center">↑ 12.5%</span>
                      <span className="text-gray-400">this month</span>
                    </div>
                  </div>

                  {/* Card 2: Net Profit */}
                  <div className="bg-[#0A101D] border border-[#1E293B]/70 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#00D2FE]/15 border border-[#00D2FE]/25 flex items-center justify-center text-[#00D2FE] flex-shrink-0">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] text-[#94A3B8] block leading-tight">Net Profit</span>
                        <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-0.5 tabular-nums">
                          ₹3.2L
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] font-mono flex items-center gap-1.5">
                      <span className="text-[#34D399] font-medium flex items-center">↑ 8.2%</span>
                      <span className="text-gray-400">this month</span>
                    </div>
                  </div>

                  {/* Card 3: Operating Expenses */}
                  <div className="bg-[#0A101D] border border-[#1E293B]/70 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 flex-shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] text-[#94A3B8] block leading-tight">Operating Expenses</span>
                        <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-0.5 tabular-nums">
                          ₹8.4L
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] font-mono flex items-center gap-1.5">
                      <span className="text-[#FB7185] font-medium flex items-center">↓ 3.1%</span>
                      <span className="text-gray-400">this month</span>
                    </div>
                  </div>

                  {/* Card 4: Business Health */}
                  <div className="bg-[#0A101D] border border-[#1E293B]/70 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="w-9 h-9 rounded-lg bg-[#00D2FE]/15 border border-[#00D2FE]/25 flex items-center justify-center text-[#00D2FE] mb-2">
                        <HeartPulse className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] text-[#94A3B8] block leading-tight">Business Health</span>
                      <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-0.5 tabular-nums">
                        82<span className="text-xs text-gray-400 font-normal">/100</span>
                      </div>
                    </div>

                    {/* Circular Ring Gauge: 82% */}
                    <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          className="text-[#1E293B]"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          className="text-[#00D2FE]"
                          strokeWidth="3.5"
                          strokeDasharray="94.2"
                          strokeDashoffset="17.0"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-white font-mono">82%</span>
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
          <div className="flex flex-col items-center text-center mb-14">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
              ABOUT BUSINESSPULSE
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              BusinessPulse helps enterprises automate repetitive decisions, connect operational data, and build smarter workflows with AI.
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] leading-[1.6] max-w-[60ch] mx-auto text-center [text-wrap:pretty]">
              We combine intelligent simulation agents with continuous telemetry to help executive teams move faster, protect margins, and scale without guesswork.
            </p>
          </div>

          {/* 3 Stats as ONE Row with Vertical Hairlines */}
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
                <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
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
                <div className="absolute inset-16 rounded-full border border-[#00D2FE]/15" />
                
                {/* Rotating Sweep Beam */}
                <div className="absolute inset-0 rounded-full animate-radar-spin pointer-events-none">
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#00D2FE]/10 to-[#00D2FE]/20 rounded-l-full" />
                </div>

                <div className="z-10 flex items-center justify-center text-[#00D2FE]">
                  <Zap className="w-6 h-6 fill-current" />
                </div>

                {/* Plain Small Text Labels Inside Graphic Wrapper */}
                <div className="absolute top-[12%] right-[8%] z-20 text-[12px] font-mono text-[#F5F7FB] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                  AUTONOMOUS
                </div>

                <div className="absolute bottom-[12%] left-[8%] z-20 text-[12px] font-mono text-[#A1AABD] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#00D2FE]" />
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
          
          {/* Centered Header Block */}
          <div className="flex flex-col items-center text-center mb-14">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
              PLATFORM
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              One automation layer for your entire business.
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] leading-[1.6] max-w-[60ch] mx-auto text-center [text-wrap:pretty]">
              Ingest telemetry and trigger actions across your existing SaaS software in real-time.
            </p>
          </div>

          {/* ONE Row of 6 Integrations */}
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
                  <IconComponent className="w-5 h-5 text-[#00D2FE]" strokeWidth={1.75} />
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
          
          {/* Centered Header Block */}
          <div className="flex flex-col items-center text-center mb-14">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
              AI AGENTS
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              Give every workflow an intelligent operator.
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] leading-[1.6] max-w-[60ch] mx-auto text-center [text-wrap:pretty]">
              Pre-trained autonomous agents built specifically for high-growth operations.
            </p>
          </div>

          {/* 2x2 Grid of Agents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 items-stretch">
            
            {/* Sales Agent */}
            <div className="border-t border-white/[0.08] pt-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-5 h-5 text-[#00D2FE]" strokeWidth={2} />
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
                  <div className="w-[94%] h-full bg-[#00D2FE]" />
                </div>
              </div>
            </div>

            {/* Support Agent */}
            <div className="border-t border-white/[0.08] pt-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-5 h-5 text-[#00D2FE]" strokeWidth={2} />
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
                  <div className="w-[88%] h-full bg-[#00D2FE]" />
                </div>
              </div>
            </div>

            {/* Operations Agent */}
            <div className="border-t border-white/[0.08] pt-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-5 h-5 text-[#00D2FE]" strokeWidth={2} />
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
                    <DollarSign className="w-5 h-5 text-[#00D2FE]" strokeWidth={2} />
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
                  <div className="w-[96%] h-full bg-[#00D2FE]" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 7. SECTION E: READY-TO-RUN WORKFLOWS ───────────────────── */}
      <section id="workflows" className="section-wrapper">
        <div className="site-container">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-14 gap-4">
            <div>
              <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
                READY-TO-RUN WORKFLOWS
              </div>
              <h2 className="text-[clamp(24px,3.5vw,36px)] font-semibold text-[#F5F7FB] tracking-[-0.02em] [text-wrap:balance]">
                Start with the workflows your team already needs.
              </h2>
            </div>

            <Link href="/simulator" className="text-sm font-semibold text-[#00D2FE] hover:underline flex items-center gap-1 flex-shrink-0">
              Explore all templates →
            </Link>
          </div>

          {/* 3x2 Grid of Templates */}
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
                  <Link href="/simulator" className="text-sm font-medium text-[#00D2FE] hover:underline inline-flex items-center gap-1">
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
          
          {/* Centered Header Block */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
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
                  ? 'text-[#00D2FE] font-semibold border-b-2 border-[#00D2FE]'
                  : 'text-[#A1AABD] font-medium hover:text-white border-b-2 border-transparent'
              }`}
            >
              Hire 3 Senior Engineers
            </button>
            <button
              onClick={() => setSelectedScenario('pricing')}
              className={`text-sm transition-colors pb-3 -mb-3.5 ${
                selectedScenario === 'pricing'
                  ? 'text-[#00D2FE] font-semibold border-b-2 border-[#00D2FE]'
                  : 'text-[#A1AABD] font-medium hover:text-white border-b-2 border-transparent'
              }`}
            >
              Raise Enterprise Prices 15%
            </button>
            <button
              onClick={() => setSelectedScenario('marketing')}
              className={`text-sm transition-colors pb-3 -mb-3.5 ${
                selectedScenario === 'marketing'
                  ? 'text-[#00D2FE] font-semibold border-b-2 border-[#00D2FE]'
                  : 'text-[#A1AABD] font-medium hover:text-white border-b-2 border-transparent'
              }`}
            >
              Double Paid Ad Spend
            </button>
          </div>

          {/* Decision Simulator Panel */}
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

            {/* 4 Metrics in One Row Separated by Hairlines */}
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
                <div className="text-2xl sm:text-3xl font-bold text-[#00D2FE] mt-2 font-mono tabular-nums">
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
            
            {/* Left Column (5 cols) */}
            <div className="lg:col-span-5">
              <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
                FAQ
              </div>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] [text-wrap:balance] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-[16px] text-[#A1AABD] leading-relaxed">
                Learn how our predictive models and cognitive agents safeguard capital and streamline daily workflows.
              </p>
              <div className="mt-8">
                <Link href="/register" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00D2FE] hover:underline">
                  Explore documentation →
                </Link>
              </div>
            </div>

            {/* Right Column (7 cols): Accordion Rows */}
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
                      <span className="text-[17px] font-medium text-[#F5F7FB] group-hover:text-[#00D2FE] transition-colors pr-2">
                        {item.q}
                      </span>
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        {isOpen ? (
                          <X className="w-4 h-4 text-[#00D2FE]" />
                        ) : (
                          <Plus className="w-4 h-4 text-[#A1AABD] group-hover:text-[#00D2FE]" />
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

      {/* ─── 10. SECTION H: FINAL CTA ─────────────────────────────────── */}
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
              <div className="flex items-center gap-2.5">
                <div className="flex items-end gap-[3px] h-5">
                  <span className="w-1 h-2 rounded-[1px] bg-[#00D2FE]" />
                  <span className="w-1 h-3 rounded-[1px] bg-[#00D2FE]" />
                  <span className="w-1 h-4 rounded-[1px] bg-[#00D2FE]" />
                  <span className="w-1 h-5 rounded-[1px] bg-[#00D2FE]" />
                </div>
                <span className="font-bold text-white text-base tracking-tight">
                  Business<span className="text-[#00D2FE]">PulseAI</span>
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

          {/* Bottom Bar: Copyright & Legal */}
          <div className="mt-16 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#6F7B90]">
            <p>© 2026 BusinessPulseAI. All rights reserved.</p>
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
