'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Database,
  BarChart3,
  TrendingUp,
  Brain,
  MessageSquare,
  Bell,
  FileText,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  MapPin,
  LineChart,
  Lightbulb,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getInitials } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: { label: string; href: string; icon: React.ReactNode }[];
}

const navigation: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Business Data',
    href: '/data',
    icon: <Database className="w-5 h-5" />,
    children: [
      { label: 'Sales', href: '/data/sales', icon: <ShoppingCart className="w-4 h-4" /> },
      { label: 'Expenses', href: '/data/expenses', icon: <DollarSign className="w-4 h-4" /> },
      { label: 'Products', href: '/data/products', icon: <Package className="w-4 h-4" /> },
      { label: 'Employees', href: '/data/employees', icon: <Users className="w-4 h-4" /> },
      { label: 'Locations', href: '/data/locations', icon: <MapPin className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: 'Predictions',
    href: '/predictions',
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: 'Decision Simulator',
    href: '/simulator',
    icon: <Brain className="w-5 h-5" />,
  },
  {
    label: 'AI Assistant',
    href: '/assistant',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    label: 'Recommendations',
    href: '/recommendations',
    icon: <Lightbulb className="w-5 h-5" />,
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, activeBusiness, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const toggleExpand = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─── Desktop Sticky Sidebar ─────────────────── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-[#060608] border-r border-white/[0.08] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex-shrink-0 sticky top-0 h-screen z-40',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.08]">
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <span className="text-base font-bold text-white truncate tracking-tight">
                Business<span className="text-[#A1A1AA]">Pulse</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717A] hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            const expanded = expandedItem === item.label;

            return (
              <div key={item.label}>
                {item.children ? (
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200',
                      active
                        ? 'bg-white text-black font-semibold shadow-[0_2px_10px_rgba(255,255,255,0.12)]'
                        : 'text-[#A1A1AA] hover:bg-white/[0.05] hover:text-white',
                    )}
                  >
                    <span className={cn(active ? 'text-black' : 'text-[#71717A]')}>{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronRight
                          className={cn(
                            'w-3.5 h-3.5 transition-transform',
                            expanded && 'rotate-90',
                          )}
                        />
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200',
                      active
                        ? 'bg-white text-black font-semibold shadow-[0_2px_10px_rgba(255,255,255,0.12)]'
                        : 'text-[#A1A1AA] hover:bg-white/[0.05] hover:text-white',
                    )}
                  >
                    <span className={cn(active ? 'text-black' : 'text-[#71717A]')}>{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                    {item.label === 'Decision Simulator' && !collapsed && (
                      <span className="ml-auto px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-white/10 border border-white/20 text-white">
                        AI
                      </span>
                    )}
                  </Link>
                )}

                {/* Sub-navigation */}
                {item.children && expanded && !collapsed && (
                  <div className="ml-6 mt-1 space-y-0.5 border-l-2 border-[var(--border)] pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                          pathname === child.href
                            ? 'text-white font-medium bg-white/10'
                            : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]',
                        )}
                      >
                        {child.icon}
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-[var(--border)] p-3">
          <div className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors',
            collapsed && 'justify-center px-0',
          )}>
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user ? getInitials(user.name) : '?'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] truncate">
                  {activeBusiness?.name || 'No business'}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => logout()}
                className="text-[var(--text-tertiary)] hover:text-[#F87171] transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ─── Mobile Drawer (Drawer Mode) ────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col transition-all duration-300 ease-in-out w-[260px] lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border)]">
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--text-primary)] truncate">
              BusinessPulse
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-tertiary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive(item.href) ? 'bg-white/10 text-white font-semibold' : 'text-[var(--text-secondary)]'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* ─── Main Content Wrapper ───────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-[#060608]/90 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-[var(--text-secondary)]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {activeBusiness?.name || 'BusinessPulse AI'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F87171]" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-6 w-full min-w-0 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
