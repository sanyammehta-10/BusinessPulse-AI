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
  BarChart3,
  LineChart,
  ShieldAlert,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  Coins,
  HeartPulse,
  Sliders,
  DollarSign,
  TrendingDown,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Store,
  Users2,
  Tag,
  BarChart2,
  CreditCard,
  Package,
  Database,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<'hire' | 'store' | 'pricing' | 'marketing'>('hire');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Illustrative Decision Simulator Scenarios
  const scenarioData = {
    hire: {
      title: 'Should I hire 50 new employees?',
      category: 'Workforce Planning',
      inputs: [
        { label: 'Headcount Addition', value: '50 employees' },
        { label: 'Avg Monthly CTC', value: '₹45,000 / head' },
        { label: 'Onboarding & Capex', value: '₹12.0 L' },
        { label: 'Time Horizon', value: '12 Months' },
      ],
      revenue: '+₹48.0 L',
      expense: '+₹27.0 L',
      profit: '+₹21.0 L',
      breakeven: '5.2 months',
      cashflowImpact: '₹34.5 L initial reserve draw',
      riskLevel: 'Moderate Operational Risk',
      riskColor: 'text-[#FBBF24]',
      keyAssumption: 'Assumes 75% capacity ramp within 60 days based on historical sales cycle.',
    },
    store: {
      title: 'Can my business afford another branch in Mumbai?',
      category: 'Business Expansion',
      inputs: [
        { label: 'Target Location', value: 'Mumbai (Andheri)' },
        { label: 'Fit-out & Deposit', value: '₹22.5 L' },
        { label: 'Monthly Operating Burn', value: '₹3.8 L / mo' },
        { label: 'Initial Inventory', value: '₹14.0 L' },
      ],
      revenue: '+₹64.2 L',
      expense: '+₹45.6 L',
      profit: '+₹18.6 L',
      breakeven: '8.4 months',
      cashflowImpact: '₹36.5 L total capital commitment',
      riskLevel: 'Capital Intensive Exposure',
      riskColor: 'text-[#FB7185]',
      keyAssumption: 'Benchmarked against your top 2 existing branch performance curves.',
    },
    pricing: {
      title: 'What happens if I increase product prices by 15%?',
      category: 'Pricing Strategy',
      inputs: [
        { label: 'Price Adjustment', value: '+15% across catalog' },
        { label: 'Historical Churn Elasticity', value: '-3.2% estimated' },
        { label: 'Target Volume Retention', value: '96.8%' },
        { label: 'Cost of Goods Delta', value: '0% change' },
      ],
      revenue: '+₹38.5 L',
      expense: '+₹1.8 L',
      profit: '+₹36.7 L',
      breakeven: 'Immediate (Month 1)',
      cashflowImpact: 'Immediate positive working capital',
      riskLevel: 'Low Financial Risk',
      riskColor: 'text-[#34D399]',
      keyAssumption: 'Models price elasticity from past 18 months of volume and customer reorder rates.',
    },
    marketing: {
      title: 'What if I increase marketing expenditure by 20%?',
      category: 'Demand Acceleration',
      inputs: [
        { label: 'Budget Escalation', value: '+20% (₹6.0 L / mo)' },
        { label: 'Target Channels', value: 'Meta & Google Ads' },
        { label: 'Current Blended CAC', value: '₹1,420' },
        { label: 'Expected Conversion Rate', value: '2.8%' },
      ],
      revenue: '+₹31.4 L',
      expense: '+₹14.4 L',
      profit: '+₹17.0 L',
      breakeven: '3.6 months',
      cashflowImpact: 'Requires ₹18.0 L ad float buffer',
      riskLevel: 'Ad Saturation & Diminishing Returns',
      riskColor: 'text-[#FBBF24]',
      keyAssumption: 'Calculates diminishing marginal returns based on previous campaign scaling tests.',
    },
  };

  const faqData = [
    {
      q: 'What is BusinessPulse AI?',
      a: 'BusinessPulse AI is an AI-powered business analytics and decision intelligence platform designed to help owners understand current performance, explore predictive forecasts, and evaluate the potential consequences of business decisions before committing real capital.',
    },
    {
      q: 'What is a Business Twin?',
      a: 'A Business Twin is a digital representation of your company built from relevant operational and financial data — including sales, revenue, expenses, inventory, staffing, and locations. It provides unified context for analytics, forecasts, and decision simulations.',
    },
    {
      q: 'How does the Decision Simulator work?',
      a: 'You enter a proposed business decision along with relevant parameters and assumptions (such as hiring headcount, opening a branch, or changing prices). The platform pairs your historical business data with analytical models to estimate potential revenue, cost changes, net profit, cash-flow implications, break-even timing, and associated risks.',
    },
    {
      q: 'Can BusinessPulse AI help me decide whether to expand?',
      a: 'Yes. It helps evaluate initial capital requirements, expected operating expenses, potential revenue curves, cash-flow vulnerability, break-even timelines, and sensitivity risks under best, expected, and conservative scenarios.',
    },
    {
      q: 'Can I forecast sales and profit?',
      a: 'Yes. The platform analyzes your historical performance, seasonal cycles, and growth trajectories to generate forward-looking projections for revenue, expenses, and profit, while explicitly stating the underlying assumptions and confidence ranges.',
    },
    {
      q: 'What business data can I add?',
      a: 'You can maintain and import data across sales transactions, operating expenses, product catalogs, inventory levels, employee headcounts & payroll, and business locations via CSV/Excel uploads or direct manual entry.',
    },
    {
      q: 'Are predictions guaranteed to be accurate?',
      a: 'No. Forecasts and simulations are analytical estimates, not guarantees. Their accuracy depends on the completeness of your data, the validity of assumptions, external market conditions, and unforeseen operational factors.',
    },
    {
      q: 'Can I compare multiple business decisions?',
      a: 'Yes. The Decision Simulator and Scenario Comparison modules allow you to evaluate alternative strategies side-by-side (e.g., hiring 10 vs 20 staff, or expanding vs increasing marketing) to understand comparative trade-offs and capital exposure.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-[#F5F7FB] selection:bg-[#00D2FE]/25 selection:text-white font-sans antialiased overflow-x-hidden relative">
      
      {/* ─── AMBIENT CYAN ATMOSPHERIC GLOWS ──────────────────────────── */}
      <div className="absolute top-[80px] left-[-18%] w-[620px] h-[620px] bg-[#00D2FE]/15 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[80px] right-[-18%] w-[620px] h-[620px] bg-[#00D2FE]/15 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[380px] left-1/2 -translate-x-1/2 w-[85%] max-w-[950px] h-[400px] bg-[#00D2FE]/18 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* ─── 1. NAVBAR ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full h-[76px] bg-[#030712]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="site-container h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-end gap-[3px] h-5">
              <span className="w-1 h-2 rounded-[1px] bg-[#00D2FE]" />
              <span className="w-1 h-3 rounded-[1px] bg-[#00D2FE]" />
              <span className="w-1 h-4 rounded-[1px] bg-[#00D2FE]" />
              <span className="w-1 h-5 rounded-[1px] bg-[#00D2FE]" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity">
              Business<span className="text-[#00D2FE]">Pulse AI</span>
            </span>
          </Link>

          {/* Centered Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="relative text-sm font-medium text-white pb-1 group">
              Home
              <span className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-[#00D2FE] rounded-full" />
            </Link>
            <a href="#platform" className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
              Platform
            </a>
            <a href="#features" className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#simulator" className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
              Decision Simulator
            </a>
            <a href="#faq" className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right-side actions: Log In & Get Started Free */}
          <div className="hidden sm:flex items-center gap-4">
            <Link 
              href="/login"
              className="text-xs sm:text-sm font-medium text-[#94A3B8] hover:text-white transition-colors px-2 py-1"
            >
              Log In
            </Link>
            <Link href="/register">
              <button className="h-10 px-4 rounded-xl bg-[#00D2FE] hover:bg-[#38E1FF] text-[#030712] text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(0,210,254,0.3)]">
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
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
              <a href="#platform" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white py-1">
                Platform
              </a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white py-1">
                Features
              </a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white py-1">
                How It Works
              </a>
              <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white py-1">
                Decision Simulator
              </a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white py-1">
                FAQ
              </a>
              <div className="pt-3 flex flex-col gap-2.5 border-t border-white/[0.08]">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full h-10 rounded-xl border border-white/15 text-white text-xs font-medium hover:border-white/30">
                    Log In
                  </button>
                </Link>
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

      {/* ─── 2. HERO SECTION ───────────────────────────────────────── */}
      <section className="w-full pt-12 sm:pt-16 pb-16 text-center relative">
        <div className="site-container flex flex-col items-center">
          
          {/* Small Product Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00D2FE]/10 border border-[#00D2FE]/30 text-xs sm:text-sm font-medium text-white mb-6 backdrop-blur-sm shadow-[0_0_20px_rgba(0,210,254,0.15)]">
            <span className="text-[#00D2FE] text-base leading-none">✦</span>
            <span>AI-Powered Business Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-[clamp(40px,5.8vw,72px)] font-bold text-white leading-[1.1] tracking-[-0.02em] max-w-[850px] mx-auto text-center [text-wrap:balance] mb-5">
            Know the Impact<br />Before You Decide
          </h1>

          {/* Short Supporting Paragraph */}
          <p className="text-[16px] sm:text-[18px] text-[#94A3B8] max-w-[660px] mx-auto text-center leading-[1.6] [text-wrap:pretty] mb-8">
            BusinessPulse AI creates a digital twin of your business, analyzes your performance, and simulates the potential impact of your decisions — helping you plan your next move with greater confidence.
          </p>

          {/* Two CTA Buttons */}
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

          {/* ─── DASHBOARD PREVIEW ─────────────────────────────────── */}
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
                  Business<span className="text-[#00D2FE]">Pulse AI</span>
                </span>
              </div>

              {/* Center: Search Bar */}
              <div className="relative w-full max-w-[320px] md:max-w-[380px] hidden sm:block">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  readOnly
                  placeholder="Search sales, expenses, decision scenarios..."
                  className="w-full h-9 bg-[#0B1322] border border-[#1E293B]/60 rounded-lg pl-9 pr-3 text-xs text-gray-300 placeholder:text-gray-500 focus:outline-none cursor-default"
                />
              </div>

              {/* Right: Notifications & Profile */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 hidden md:inline">
                  Demo Preview
                </span>

                <button className="text-[#94A3B8] hover:text-white transition-colors p-1" aria-label="Notifications">
                  <Bell className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2.5 pl-2 border-l border-[#1E293B]/60">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#00D2FE]/40 relative bg-[#1E293B]">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt="Business Owner"
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

            {/* Dashboard Inner Body */}
            <div className="flex">
              
              {/* Left Sidebar */}
              <aside className="hidden md:flex flex-col justify-between w-48 lg:w-52 border-r border-[#1E293B]/60 bg-[#060B13] p-3 space-y-1 flex-shrink-0">
                <div className="space-y-1">
                  <div className="bg-[#00D2FE] text-[#030712] font-semibold text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 shadow-sm cursor-pointer">
                    <BarChart2 className="w-4 h-4 fill-current" />
                    <span>Business Twin</span>
                  </div>
                  <Link href="/analytics" className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer block">
                    <BarChart3 className="w-4 h-4" />
                    <span>Analytics</span>
                  </Link>
                  <Link href="/simulator" className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer block">
                    <Zap className="w-4 h-4" />
                    <span>Decision Simulator</span>
                  </Link>
                  <Link href="/predictions" className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer block">
                    <TrendingUp className="w-4 h-4" />
                    <span>Forecasting</span>
                  </Link>
                  <Link href="/data/sales" className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer block">
                    <Coins className="w-4 h-4" />
                    <span>Sales & Revenue</span>
                  </Link>
                  <Link href="/data/expenses" className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer block">
                    <CreditCard className="w-4 h-4" />
                    <span>Expenses</span>
                  </Link>
                  <Link href="/data/products" className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer block">
                    <Package className="w-4 h-4" />
                    <span>Products & Stock</span>
                  </Link>
                  <Link href="/data/employees" className="text-[#94A3B8] hover:text-white hover:bg-white/5 font-medium text-xs rounded-lg px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer block">
                    <Users className="w-4 h-4" />
                    <span>Staff & Branches</span>
                  </Link>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 p-5 sm:p-6 bg-[#070D18]">
                
                {/* Greeting Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Welcome Back
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Here&apos;s your business performance overview.
                    </p>
                  </div>

                  {/* Sample Data Disclaimer Badge + Date */}
                  <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    <span className="text-[10px] text-gray-400 bg-white/5 px-2.5 py-1 rounded border border-white/10 font-mono">
                      Illustrative Sample Data
                    </span>
                    <div className="bg-[#0B1322] border border-[#1E293B]/60 rounded-lg px-3 py-1.5 text-xs text-gray-300 flex items-center gap-2 cursor-pointer">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Current Fiscal Year</span>
                    </div>
                  </div>
                </div>

                {/* 4 KPI Cards */}
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
                      <span className="text-gray-400">vs historical baseline</span>
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
                      <span className="text-gray-400">net margin 25.6%</span>
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
                      <span className="text-gray-400">controlled burn</span>
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

      {/* ─── 3. ABOUT SECTION ──────────────────────────────────────── */}
      <section id="about" className="section-wrapper border-t border-white/[0.06]">
        <div className="site-container">
          
          <div className="flex flex-col items-center text-center mb-14">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
              ABOUT BUSINESSPULSE AI
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.15] tracking-[-0.02em] max-w-[760px] mx-auto text-center [text-wrap:balance] mb-5">
              Your Business, Understood as a Whole
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] leading-[1.6] max-w-[68ch] mx-auto text-center [text-wrap:pretty]">
              BusinessPulse AI brings your business data together to help you understand current performance, identify important trends, and explore the potential impact of future decisions. By connecting analytics, forecasting, and decision simulation, the platform helps business owners move from uncertainty toward more informed planning.
            </p>
          </div>

          {/* 3 Pillars Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] items-stretch border-t border-b border-white/[0.08] py-8 md:py-0">
            <div className="px-8 first:pl-0 last:pr-0 py-6 md:py-8 flex flex-col justify-between">
              <div>
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] block">
                  01 — OBSERVE
                </span>
                <h3 className="text-xl font-semibold text-[#F5F7FB] mt-3">
                  Historical Clarity
                </h3>
                <p className="text-[15px] text-[#A1AABD] leading-relaxed mt-2.5">
                  Aggregate sales records, operating costs, catalog margins, and branch economics into a unified Business Twin.
                </p>
              </div>
            </div>

            <div className="px-8 first:pl-0 last:pr-0 py-6 md:py-8 flex flex-col justify-between">
              <div>
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] block">
                  02 — ANTICIPATE
                </span>
                <h3 className="text-xl font-semibold text-[#F5F7FB] mt-3">
                  Predictive Projections
                </h3>
                <p className="text-[15px] text-[#A1AABD] leading-relaxed mt-2.5">
                  Forecast upcoming revenue curves, seasonal fluctuations, and margin dynamics based on verifiable business trends.
                </p>
              </div>
            </div>

            <div className="px-8 first:pl-0 last:pr-0 py-6 md:py-8 flex flex-col justify-between">
              <div>
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] block">
                  03 — SIMULATE
                </span>
                <h3 className="text-xl font-semibold text-[#F5F7FB] mt-3">
                  Informed Decision-Making
                </h3>
                <p className="text-[15px] text-[#A1AABD] leading-relaxed mt-2.5">
                  Test hypothetical hiring, price shifts, marketing expansions, and new locations before committing capital.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 4. THE CHALLENGE SECTION (Replaced Old Way) ───────────── */}
      <section id="how-it-works" className="section-wrapper">
        <div className="site-container">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            
            {/* Left (7 cols): Challenge rows */}
            <div className="lg:col-span-7">
              <div>
                <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
                  THE CHALLENGE
                </div>
                <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.15] tracking-[-0.02em] [text-wrap:balance] mb-4">
                  Running a Business Shouldn&apos;t Mean Guessing Its Future
                </h2>
                <p className="text-[16px] text-[#A1AABD] leading-[1.6] max-w-[60ch] [text-wrap:pretty]">
                  Business owners regularly face critical decisions without knowing their financial and operational consequences.
                </p>
              </div>

              {/* 4 Challenges */}
              <div className="mt-12 divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
                {[
                  {
                    num: '01',
                    title: 'Decisions Without Clear Projections',
                    desc: 'Business owners understand current numbers but struggle to model the compounding financial consequences of a major decision before making it.',
                  },
                  {
                    num: '02',
                    title: 'Scattered Business Information',
                    desc: 'Sales, expenses, products, employees, and branch locations are analyzed in silos, making the company difficult to understand as a whole.',
                  },
                  {
                    num: '03',
                    title: 'Unclear Future Performance',
                    desc: 'Historical spreadsheets explain what happened in past quarters, but offer little visibility into what is likely to happen next month or next year.',
                  },
                  {
                    num: '04',
                    title: 'Uncertain Investment Outcomes',
                    desc: 'Hiring additions, branch expansions, price increases, and ad spend changes introduce significant financial exposure when uncalculated.',
                  },
                ].map((step) => (
                  <div key={step.num} className="py-5 flex items-start gap-4">
                    <span className="w-10 shrink-0 font-mono text-[14px] text-[#00D2FE] pt-0.5">
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

              <div className="mt-6 text-[15px] text-[#F5F7FB] font-medium">
                BusinessPulse AI connects these pieces to help you evaluate your options with greater clarity.
              </div>
            </div>

            {/* Right (5 cols): Connected Intelligence Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="aspect-square w-full max-w-[420px] mx-auto relative flex items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0E131F] p-6 shadow-2xl">
                
                {/* Center Node */}
                <div className="w-24 h-24 rounded-2xl bg-[#00D2FE]/15 border border-[#00D2FE]/40 flex flex-col items-center justify-center text-center p-2 z-10 shadow-[0_0_30px_rgba(0,210,254,0.25)]">
                  <HeartPulse className="w-6 h-6 text-[#00D2FE] mb-1" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-tight">Business Twin</span>
                </div>

                {/* Surrounding Connected Badges */}
                <div className="absolute top-6 left-6 text-xs bg-[#070D18] border border-white/10 rounded-lg px-3 py-1.5 text-gray-300 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-[#00D2FE]" />
                  Sales & Revenue
                </div>
                <div className="absolute top-6 right-6 text-xs bg-[#070D18] border border-white/10 rounded-lg px-3 py-1.5 text-gray-300 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#FB7185]" />
                  Operating Costs
                </div>
                <div className="absolute bottom-6 left-6 text-xs bg-[#070D18] border border-white/10 rounded-lg px-3 py-1.5 text-gray-300 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#34D399]" />
                  Inventory & Margin
                </div>
                <div className="absolute bottom-6 right-6 text-xs bg-[#070D18] border border-white/10 rounded-lg px-3 py-1.5 text-gray-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Headcount & Branches
                </div>

                {/* Orbit Lines */}
                <div className="absolute inset-10 rounded-full border border-dashed border-[#00D2FE]/20 pointer-events-none" />
                <div className="absolute inset-20 rounded-full border border-white/[0.06] pointer-events-none" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 5. THE BUSINESS TWIN PLATFORM (Replaced Integrations) ── */}
      <section id="platform" className="section-wrapper border-t border-white/[0.06]">
        <div className="site-container">
          
          <div className="flex flex-col items-center text-center mb-14">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
              THE BUSINESS TWIN
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              One Connected View of Your Business
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] leading-[1.6] max-w-[64ch] mx-auto text-center [text-wrap:pretty]">
              Build a digital representation of your business using relevant operational and financial information. Explore performance, understand trends, forecast outcomes, and simulate decisions using a consistent business context.
            </p>
          </div>

          {/* Connected Data Domains Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
            {[
              { title: 'Sales & Revenue', desc: 'Invoices, transaction trends, margin breakdown', icon: BarChart2, color: 'text-[#00D2FE]' },
              { title: 'Expenses & Profit', desc: 'Fixed overhead, variable costs, gross & net margins', icon: CreditCard, color: 'text-[#38E1FF]' },
              { title: 'Products & Inventory', desc: 'SKU unit economics, stock turns, holding costs', icon: Package, color: 'text-[#34D399]' },
              { title: 'Employees & Payroll', desc: 'Departmental headcounts, compensation, capacity', icon: Users, color: 'text-indigo-400' },
              { title: 'Locations & Branches', desc: 'Per-store profitability, footfall, regional costs', icon: Store, color: 'text-[#FBBF24]' },
              { title: 'Historical Performance', desc: 'Multi-quarter baselines and seasonal sales shifts', icon: LineChart, color: 'text-[#00D2FE]' },
              { title: 'Predictive Forecasts', desc: 'Forward projection curves with confidence bounds', icon: TrendingUp, color: 'text-[#34D399]' },
              { title: 'Decision Scenarios', desc: 'Simulated outcomes for hiring, capex, and pricing', icon: Zap, color: 'text-[#00D2FE]' },
            ].map((domain) => {
              const Icon = domain.icon;
              return (
                <div key={domain.title} className="bg-[#0A101D] border border-white/[0.08] hover:border-[#00D2FE]/40 rounded-xl p-5 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3.5">
                    <Icon className={`w-5 h-5 ${domain.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-white">{domain.title}</h3>
                  <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">{domain.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── 6. INTELLIGENCE LAYER (Replaced AI Agents) ────────────── */}
      <section className="section-wrapper border-t border-white/[0.06]">
        <div className="site-container">
          
          <div className="flex flex-col items-center text-center mb-14">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
              INTELLIGENCE LAYER
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] max-w-[720px] mx-auto text-center [text-wrap:balance] mb-4">
              From Business Data to Better Decisions
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] leading-[1.6] max-w-[60ch] mx-auto text-center [text-wrap:pretty]">
              A continuous four-stage methodology helping business owners move from raw data to confident strategic execution.
            </p>
          </div>

          {/* 4 Connected Sequential Stages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stage 1: Analyze */}
            <div className="bg-[#0A101D] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 text-xs font-mono text-[#00D2FE] font-bold">01</div>
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE]/15 flex items-center justify-center text-[#00D2FE] mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">ANALYZE</h3>
                <p className="text-[14px] text-[#A1AABD] leading-relaxed mt-2">
                  Understand current business performance and historical trends across sales, expenses, and operational units.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-[#00D2FE] font-mono">
                Baseline Validation
              </div>
            </div>

            {/* Stage 2: Forecast */}
            <div className="bg-[#0A101D] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 text-xs font-mono text-[#00D2FE] font-bold">02</div>
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE]/15 flex items-center justify-center text-[#00D2FE] mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">FORECAST</h3>
                <p className="text-[14px] text-[#A1AABD] leading-relaxed mt-2">
                  Estimate possible future revenue, expenses, and profit trajectories using seasonal patterns and trend models.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-[#00D2FE] font-mono">
                Forward Horizon
              </div>
            </div>

            {/* Stage 3: Simulate */}
            <div className="bg-[#0A101D] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 text-xs font-mono text-[#00D2FE] font-bold">03</div>
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE]/15 flex items-center justify-center text-[#00D2FE] mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">SIMULATE</h3>
                <p className="text-[14px] text-[#A1AABD] leading-relaxed mt-2">
                  Evaluate hypothetical decisions using business data and explicit assumptions before real money is spent.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-[#00D2FE] font-mono">
                Hypothesis Testing
              </div>
            </div>

            {/* Stage 4: Explain */}
            <div className="bg-[#0A101D] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 text-xs font-mono text-[#00D2FE] font-bold">04</div>
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE]/15 flex items-center justify-center text-[#00D2FE] mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">EXPLAIN</h3>
                <p className="text-[14px] text-[#A1AABD] leading-relaxed mt-2">
                  Present transparent financial results, break-even timelines, risk factors, and actionable scenario comparisons.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-[#00D2FE] font-mono">
                Grounded Insights
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 7. BUSINESS SCENARIOS (Replaced Ready-to-Run Workflows) ─ */}
      <section className="section-wrapper border-t border-white/[0.06]">
        <div className="site-container">
          
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-14 gap-4">
            <div>
              <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
                BUSINESS SCENARIOS
              </div>
              <h2 className="text-[clamp(24px,3.5vw,36px)] font-semibold text-[#F5F7FB] tracking-[-0.02em] [text-wrap:balance]">
                Explore the Decisions That Shape Your Business
              </h2>
            </div>

            <Link href="/simulator" className="text-sm font-semibold text-[#00D2FE] hover:underline flex items-center gap-1 flex-shrink-0">
              Open Decision Simulator →
            </Link>
          </div>

          {/* 3 Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Card 1: Workforce Planning */}
            <div className="bg-[#0A101D] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between hover:border-[#00D2FE]/40 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00D2FE] mb-2 uppercase">
                  <Users2 className="w-3.5 h-3.5" />
                  Scenario 01
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Workforce Planning
                </h3>
                <p className="text-sm font-medium text-[#38E1FF] mt-1">
                  &ldquo;What happens if I hire more employees?&rdquo;
                </p>
                
                <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-2">
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Example Inputs</div>
                  <ul className="text-xs text-[#94A3B8] space-y-1 list-disc list-inside">
                    <li>Number of employees & salary</li>
                    <li>Onboarding & workstation capex</li>
                    <li>Ramp-up timeline & sales assumptions</li>
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5">
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Simulated Outputs</div>
                  <p className="text-xs text-[#A1AABD]">
                    Additional monthly payroll expenditure, net margin delta, cash-flow buffer draw, and break-even month.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08]">
                <Link href="/simulator">
                  <button 
                    onClick={() => setSelectedScenario('hire')}
                    className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-[#00D2FE] hover:text-[#030712] text-xs font-semibold text-[#00D2FE] transition-colors flex items-center justify-center gap-1.5"
                  >
                    Explore Scenario
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Card 2: Business Expansion */}
            <div className="bg-[#0A101D] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between hover:border-[#00D2FE]/40 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00D2FE] mb-2 uppercase">
                  <Store className="w-3.5 h-3.5" />
                  Scenario 02
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Business Expansion
                </h3>
                <p className="text-sm font-medium text-[#38E1FF] mt-1">
                  &ldquo;What if I open another branch in a new city?&rdquo;
                </p>
                
                <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-2">
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Example Inputs</div>
                  <ul className="text-xs text-[#94A3B8] space-y-1 list-disc list-inside">
                    <li>Proposed location & initial fit-out</li>
                    <li>Estimated monthly rent & utilities</li>
                    <li>Staffing requirements & initial inventory</li>
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5">
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Simulated Outputs</div>
                  <p className="text-xs text-[#A1AABD]">
                    Total upfront capital requirement, operating burn, expected local sales curve, and regional risk score.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08]">
                <Link href="/simulator">
                  <button 
                    onClick={() => setSelectedScenario('store')}
                    className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-[#00D2FE] hover:text-[#030712] text-xs font-semibold text-[#00D2FE] transition-colors flex items-center justify-center gap-1.5"
                  >
                    Explore Scenario
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Card 3: Pricing & Marketing */}
            <div className="bg-[#0A101D] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between hover:border-[#00D2FE]/40 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00D2FE] mb-2 uppercase">
                  <Tag className="w-3.5 h-3.5" />
                  Scenario 03
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Pricing & Marketing
                </h3>
                <p className="text-sm font-medium text-[#38E1FF] mt-1">
                  &ldquo;What happens if I change prices or increase ad spend?&rdquo;
                </p>
                
                <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-2">
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Example Inputs</div>
                  <ul className="text-xs text-[#94A3B8] space-y-1 list-disc list-inside">
                    <li>Proposed price shift (+15% or -10%)</li>
                    <li>Marketing expenditure escalation</li>
                    <li>Historical conversion & elasticity data</li>
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5">
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Simulated Outputs</div>
                  <p className="text-xs text-[#A1AABD]">
                    Net profit margin elasticity, customer retention risk, marginal customer acquisition efficiency, and sensitivity.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08]">
                <Link href="/simulator">
                  <button 
                    onClick={() => setSelectedScenario('pricing')}
                    className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-[#00D2FE] hover:text-[#030712] text-xs font-semibold text-[#00D2FE] transition-colors flex items-center justify-center gap-1.5"
                  >
                    Explore Scenario
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 8. CORE FEATURES SECTION ──────────────────────────────── */}
      <section id="features" className="section-wrapper border-t border-white/[0.06]">
        <div className="site-container">
          
          <div className="flex flex-col items-center text-center mb-14">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
              PLATFORM CAPABILITIES
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] max-w-[760px] mx-auto text-center [text-wrap:balance] mb-4">
              Comprehensive Decision Intelligence Built for Owners
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] leading-[1.6] max-w-[64ch] mx-auto text-center [text-wrap:pretty]">
              Nine specialized modules that transform isolated company spreadsheets into an evidence-based strategic decision engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: Business Analytics */}
            <div className="bg-[#0A101D] border border-white/[0.08] hover:border-[#00D2FE]/40 rounded-xl p-6 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE]/15 flex items-center justify-center text-[#00D2FE] mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Understand Your Business Beyond the Numbers</h3>
                <p className="text-sm text-[#A1AABD] mt-2 leading-relaxed">
                  Bring your business data into one place and understand how revenue, expenses, profit, products, and operations are performing.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#94A3B8]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Revenue & sales pattern breakdowns</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Product & branch profit margin analysis</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Continuous business health indicator tracking</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <Link href="/analytics" className="text-xs font-semibold text-[#00D2FE] hover:underline inline-flex items-center gap-1">
                  View Analytics Module →
                </Link>
              </div>
            </div>

            {/* Feature 2: Business Forecasting */}
            <div className="bg-[#0A101D] border border-white/[0.08] hover:border-[#00D2FE]/40 rounded-xl p-6 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE]/15 flex items-center justify-center text-[#00D2FE] mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">See What Your Business Could Look Like Next</h3>
                <p className="text-sm text-[#A1AABD] mt-2 leading-relaxed">
                  Use historical performance and business trends to explore possible future revenue, expenses, profit, and growth.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#94A3B8]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Forward revenue & cost curves</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Seasonal demand cycle adjustments</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Best, expected, and conservative ranges</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <Link href="/predictions" className="text-xs font-semibold text-[#00D2FE] hover:underline inline-flex items-center gap-1">
                  View Forecasting Module →
                </Link>
              </div>
            </div>

            {/* Feature 3: Decision Simulator (USP) */}
            <div className="bg-[#0A101D] border border-[#00D2FE]/40 rounded-xl p-6 transition-all flex flex-col justify-between shadow-[0_0_25px_rgba(0,210,254,0.12)]">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE] flex items-center justify-center text-[#030712] mb-4 font-bold">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div className="text-[11px] font-mono text-[#00D2FE] uppercase font-bold tracking-wider mb-1">Main Differentiator</div>
                <h3 className="text-lg font-semibold text-white">Test Your Decisions Before You Commit</h3>
                <p className="text-sm text-[#A1AABD] mt-2 leading-relaxed">
                  Explore the potential financial and operational consequences of important business decisions using your business data.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#94A3B8]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Hiring, expansion, and capex modeling</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Estimated break-even timelines & payback</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Cash-flow reserve impact analysis</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <Link href="/simulator" className="text-xs font-semibold text-[#00D2FE] hover:underline inline-flex items-center gap-1">
                  Open Decision Simulator →
                </Link>
              </div>
            </div>

            {/* Feature 4: Scenario Comparison */}
            <div className="bg-[#0A101D] border border-white/[0.08] hover:border-[#00D2FE]/40 rounded-xl p-6 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE]/15 flex items-center justify-center text-[#00D2FE] mb-4">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Compare Your Options Before Choosing a Direction</h3>
                <p className="text-sm text-[#A1AABD] mt-2 leading-relaxed">
                  Evaluate alternative business scenarios side by side and understand how different decisions could affect your future performance.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#94A3B8]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Scenario A vs B vs C financial trade-offs</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Compare hire 10 vs hire 20 vs increase marketing</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Sensitivity to changing revenue assumptions</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <Link href="/simulator" className="text-xs font-semibold text-[#00D2FE] hover:underline inline-flex items-center gap-1">
                  Compare Scenarios →
                </Link>
              </div>
            </div>

            {/* Feature 5: AI Business Insights */}
            <div className="bg-[#0A101D] border border-white/[0.08] hover:border-[#00D2FE]/40 rounded-xl p-6 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE]/15 flex items-center justify-center text-[#00D2FE] mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Turn Business Data Into Clear Insights</h3>
                <p className="text-sm text-[#A1AABD] mt-2 leading-relaxed">
                  Identify meaningful trends, investigate unusual changes, and understand the business factors behind your numbers.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#94A3B8]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Data-grounded variance explanations</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Highlights of high-profit products vs laggards</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Early cash-flow strain warnings</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <Link href="/recommendations" className="text-xs font-semibold text-[#00D2FE] hover:underline inline-flex items-center gap-1">
                  View Recommendations →
                </Link>
              </div>
            </div>

            {/* Feature 6: Risk Analysis */}
            <div className="bg-[#0A101D] border border-white/[0.08] hover:border-[#00D2FE]/40 rounded-xl p-6 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE]/15 flex items-center justify-center text-[#00D2FE] mb-4">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Understand the Risks Before You Invest</h3>
                <p className="text-sm text-[#A1AABD] mt-2 leading-relaxed">
                  Explore the assumptions, uncertainties, and potential downside of a decision before committing resources.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#94A3B8]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Financial and cash-flow vulnerability scoring</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Operational exposure on rapid headcount scale</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Transparent assumption and downside bounds</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <Link href="/simulator" className="text-xs font-semibold text-[#00D2FE] hover:underline inline-flex items-center gap-1">
                  Analyze Decision Risk →
                </Link>
              </div>
            </div>

            {/* Feature 7: Business Data Management */}
            <div className="bg-[#0A101D] border border-white/[0.08] hover:border-[#00D2FE]/40 rounded-xl p-6 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE]/15 flex items-center justify-center text-[#00D2FE] mb-4">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">One Reliable View of Your Business</h3>
                <p className="text-sm text-[#A1AABD] mt-2 leading-relaxed">
                  Organize your business information so analytics, forecasts, and decision simulations use consistent and relevant data.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#94A3B8]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Import CSV and Excel transaction files</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Add, edit, filter sales, expenses, and staff</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Automated schema validation & missing value checks</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <Link href="/data" className="text-xs font-semibold text-[#00D2FE] hover:underline inline-flex items-center gap-1">
                  Manage Business Data →
                </Link>
              </div>
            </div>

            {/* Feature 8: Reports & Performance Tracking */}
            <div className="bg-[#0A101D] border border-white/[0.08] hover:border-[#00D2FE]/40 rounded-xl p-6 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE]/15 flex items-center justify-center text-[#00D2FE] mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Make Business Performance Easier to Understand</h3>
                <p className="text-sm text-[#A1AABD] mt-2 leading-relaxed">
                  Generate synthesized executive reports across revenue, profit margins, expense categories, and saved decision scenarios.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#94A3B8]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Revenue and profit health summaries</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Expense concentration and margin shifts</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> Exportable executive briefs</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <Link href="/reports" className="text-xs font-semibold text-[#00D2FE] hover:underline inline-flex items-center gap-1">
                  Explore Reports →
                </Link>
              </div>
            </div>

            {/* Feature 9: Pulse AI Assistant */}
            <div className="bg-[#0A101D] border border-white/[0.08] hover:border-[#00D2FE]/40 rounded-xl p-6 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00D2FE]/15 flex items-center justify-center text-[#00D2FE] mb-4">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Ask Questions About Your Own Business Data</h3>
                <p className="text-sm text-[#A1AABD] mt-2 leading-relaxed">
                  Conversational assistant grounded in your business twin. Ask questions in plain language and receive evidence-based answers.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#94A3B8]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> &ldquo;Why did my sales decline this month?&rdquo;</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> &ldquo;Which product generates the highest profit?&rdquo;</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FE]" /> &ldquo;Can my business afford another store?&rdquo;</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <Link href="/assistant" className="text-xs font-semibold text-[#00D2FE] hover:underline inline-flex items-center gap-1">
                  Chat with Pulse AI →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 9. DECISION SIMULATOR INTERACTIVE PREVIEW ──────────────── */}
      <section id="simulator" className="section-wrapper border-t border-white/[0.06]">
        <div className="site-container">
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
              DECISION SIMULATOR
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] max-w-[760px] mx-auto text-center [text-wrap:balance] mb-4">
              Test Your Decisions Before You Commit Capital
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] leading-[1.6] max-w-[64ch] mx-auto text-center [text-wrap:pretty]">
              Explore the potential impact of hiring, expansion, pricing, and investment decisions using your business data and transparent assumptions.
            </p>
          </div>

          {/* Example Question Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            <button
              onClick={() => setSelectedScenario('hire')}
              className={`text-xs sm:text-sm px-4 py-2 rounded-full border transition-all ${
                selectedScenario === 'hire'
                  ? 'bg-[#00D2FE]/15 border-[#00D2FE] text-white font-semibold shadow-[0_0_15px_rgba(0,210,254,0.25)]'
                  : 'bg-[#0A101D] border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20'
              }`}
            >
              &ldquo;Should I hire 50 new employees?&rdquo;
            </button>
            <button
              onClick={() => setSelectedScenario('store')}
              className={`text-xs sm:text-sm px-4 py-2 rounded-full border transition-all ${
                selectedScenario === 'store'
                  ? 'bg-[#00D2FE]/15 border-[#00D2FE] text-white font-semibold shadow-[0_0_15px_rgba(0,210,254,0.25)]'
                  : 'bg-[#0A101D] border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20'
              }`}
            >
              &ldquo;Can my business afford another branch in Mumbai?&rdquo;
            </button>
            <button
              onClick={() => setSelectedScenario('pricing')}
              className={`text-xs sm:text-sm px-4 py-2 rounded-full border transition-all ${
                selectedScenario === 'pricing'
                  ? 'bg-[#00D2FE]/15 border-[#00D2FE] text-white font-semibold shadow-[0_0_15px_rgba(0,210,254,0.25)]'
                  : 'bg-[#0A101D] border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20'
              }`}
            >
              &ldquo;What happens if I increase prices by 15%?&rdquo;
            </button>
            <button
              onClick={() => setSelectedScenario('marketing')}
              className={`text-xs sm:text-sm px-4 py-2 rounded-full border transition-all ${
                selectedScenario === 'marketing'
                  ? 'bg-[#00D2FE]/15 border-[#00D2FE] text-white font-semibold shadow-[0_0_15px_rgba(0,210,254,0.25)]'
                  : 'bg-[#0A101D] border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20'
              }`}
            >
              &ldquo;Should I increase my marketing budget by 20%?&rdquo;
            </button>
          </div>

          {/* Interactive Decision Simulator Panel */}
          <div className="bg-[#0E131F] border border-white/[0.08] rounded-2xl p-6 sm:p-10 shadow-2xl">
            
            {/* Top Hypothesis Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase text-[#00D2FE] bg-[#00D2FE]/10 px-2.5 py-0.5 rounded">
                    {scenarioData[selectedScenario].category}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    Illustrative Marketing Demonstration
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
                  {scenarioData[selectedScenario].title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium ${scenarioData[selectedScenario].riskColor}`}>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {scenarioData[selectedScenario].riskLevel}
                </span>
              </div>
            </div>

            {/* Split Panel: Left Inputs & Right Projected Outputs */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Panel: Inputs */}
              <div className="lg:col-span-4 bg-[#070D18] border border-white/[0.06] rounded-xl p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-4 flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#00D2FE]" />
                  Simulation Parameters
                </div>
                <div className="space-y-3.5">
                  {scenarioData[selectedScenario].inputs.map((param, i) => (
                    <div key={i} className="flex flex-col border-b border-white/[0.04] pb-2 last:border-0 last:pb-0">
                      <span className="text-[11px] text-gray-400">{param.label}</span>
                      <span className="text-sm font-semibold text-white mt-0.5 font-mono">{param.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-[#A1AABD] leading-relaxed">
                  <strong className="text-white block mb-0.5">Key Model Assumption:</strong>
                  {scenarioData[selectedScenario].keyAssumption}
                </div>
              </div>

              {/* Right Panel: Projected Impact Metrics */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#070D18] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[11px] text-[#94A3B8] block">Projected Revenue</span>
                    <div className="text-xl sm:text-2xl font-bold text-[#F5F7FB] mt-2 font-mono tabular-nums">
                      {scenarioData[selectedScenario].revenue}
                    </div>
                    <span className="text-[10px] text-[#34D399] mt-1 font-mono">12-mo forward</span>
                  </div>

                  <div className="bg-[#070D18] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[11px] text-[#94A3B8] block">Additional Expenses</span>
                    <div className="text-xl sm:text-2xl font-bold text-[#FB7185] mt-2 font-mono tabular-nums">
                      {scenarioData[selectedScenario].expense}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 font-mono">fixed & operational</span>
                  </div>

                  <div className="bg-[#070D18] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[11px] text-[#94A3B8] block">Expected Profit Delta</span>
                    <div className="text-xl sm:text-2xl font-bold text-[#34D399] mt-2 font-mono tabular-nums">
                      {scenarioData[selectedScenario].profit}
                    </div>
                    <span className="text-[10px] text-[#34D399] mt-1 font-mono">net margin impact</span>
                  </div>

                  <div className="bg-[#070D18] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[11px] text-[#94A3B8] block">Break-even Estimate</span>
                    <div className="text-xl sm:text-2xl font-bold text-[#00D2FE] mt-2 font-mono tabular-nums">
                      {scenarioData[selectedScenario].breakeven}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 font-mono">capital recovery</span>
                  </div>
                </div>

                {/* Cashflow & Downside Bar */}
                <div className="bg-[#070D18] border border-white/[0.06] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Working Capital & Cash-Flow Impact</span>
                    <span className="text-white font-semibold mt-0.5 block">{scenarioData[selectedScenario].cashflowImpact}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href="/simulator">
                      <button className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10">
                        Compare Scenarios
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Note Text + CTA Inside Card Padding */}
            <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08]">
              <p className="text-[13px] text-[#94A3B8]">
                *Values displayed in this landing page preview are illustrative demo calculations. In the application, simulations calibrate directly against your verified transactions.
              </p>
              <Link href="/simulator">
                <button className="saas-btn-primary flex items-center gap-2 flex-shrink-0">
                  Enter Your Decision
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 10. FAQ SECTION ───────────────────────────────────────── */}
      <section id="faq" className="section-wrapper border-t border-white/[0.06]">
        <div className="site-container">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
            
            {/* Left Column (5 cols) */}
            <div className="lg:col-span-5">
              <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
                FAQ
              </div>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] [text-wrap:balance] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-[16px] text-[#A1AABD] leading-relaxed">
                Everything you need to know about the Business Twin, predictive modeling, decision simulations, and data governance.
              </p>
              <div className="mt-8">
                <Link href="/simulator" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00D2FE] hover:underline">
                  Try the Decision Simulator →
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
                          <p className="text-[15px] sm:text-[16px] text-[#A1AABD] pt-3 leading-relaxed max-w-[64ch]">
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

      {/* ─── 11. FINAL CTA SECTION ─────────────────────────────────── */}
      <section className="section-wrapper border-t border-white/[0.06]">
        <div className="site-container">
          
          <div className="max-w-[760px] mx-auto text-center">
            <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#00D2FE] mb-4">
              MAKE YOUR NEXT MOVE WITH CLARITY
            </div>
            <h2 className="text-[clamp(32px,4.5vw,52px)] font-bold text-[#F5F7FB] leading-[1.12] tracking-[-0.02em] [text-wrap:balance]">
              Know the Impact Before You Decide
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#A1AABD] max-w-[580px] mx-auto text-center leading-[1.6] [text-wrap:pretty] mt-4">
              Understand your business, explore future possibilities, and evaluate important decisions with greater confidence.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link href="/register">
                <button className="saas-btn-primary flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link href="/simulator">
                <button className="saas-btn-ghost">
                  Explore Decision Simulator
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 12. FOOTER ────────────────────────────────────────────── */}
      <footer className="w-full border-t border-white/[0.08] pt-20 pb-16 bg-[#02050D]">
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
                  Business<span className="text-[#00D2FE]">Pulse AI</span>
                </span>
              </div>
              <p className="text-[14px] text-[#A1AABD] max-w-[36ch] leading-relaxed mt-4">
                &ldquo;Understand your business. Explore your future. Decide with confidence.&rdquo;
              </p>
              <p className="text-xs text-gray-500 mt-3 max-w-[40ch]">
                AI-powered business analytics, business twin modeling, predictive intelligence, and decision simulation platform.
              </p>
            </div>

            {/* Column 1: Platform (3 cols) */}
            <div className="md:col-span-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6F7B90] block">
                PLATFORM
              </span>
              <ul className="mt-5 space-y-3 text-[14px] text-[#A1AABD]">
                <li><Link href="/analytics" className="hover:text-white transition-colors">Business Analytics</Link></li>
                <li><Link href="/predictions" className="hover:text-white transition-colors">Business Forecasting</Link></li>
                <li><Link href="/simulator" className="hover:text-white transition-colors">Decision Simulator</Link></li>
                <li><Link href="/simulator" className="hover:text-white transition-colors">Scenario Comparison</Link></li>
                <li><Link href="/recommendations" className="hover:text-white transition-colors">AI Business Insights</Link></li>
              </ul>
            </div>

            {/* Column 2: Business Data (2 cols) */}
            <div className="md:col-span-2">
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6F7B90] block">
                BUSINESS DATA
              </span>
              <ul className="mt-5 space-y-3 text-[14px] text-[#A1AABD]">
                <li><Link href="/data/sales" className="hover:text-white transition-colors">Sales & Revenue</Link></li>
                <li><Link href="/data/expenses" className="hover:text-white transition-colors">Expenses</Link></li>
                <li><Link href="/data/products" className="hover:text-white transition-colors">Products & Stock</Link></li>
                <li><Link href="/data/employees" className="hover:text-white transition-colors">Staff & Locations</Link></li>
                <li><Link href="/reports" className="hover:text-white transition-colors">Reports</Link></li>
              </ul>
            </div>

            {/* Column 3: Account (2 cols) */}
            <div className="md:col-span-2">
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6F7B90] block">
                ACCOUNT
              </span>
              <ul className="mt-5 space-y-3 text-[14px] text-[#A1AABD]">
                <li><Link href="/login" className="hover:text-white transition-colors">Log In</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Get Started Free</Link></li>
                <li><Link href="/settings" className="hover:text-white transition-colors">Settings</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#6F7B90]">
            <p>© 2026 BusinessPulse AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="text-gray-400">Decisions simulated with evidence-based intelligence</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
