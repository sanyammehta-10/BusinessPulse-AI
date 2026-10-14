'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changePeriod?: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  isCurrency?: boolean;
  currency?: string;
  className?: string;
}

export default function KPICard({
  title,
  value,
  change,
  changePeriod = 'vs last month',
  prefix,
  suffix,
  icon,
  iconBg = 'bg-white/10 text-white',
  isCurrency = false,
  currency = 'INR',
  className,
}: KPICardProps) {
  const displayValue = isCurrency
    ? formatCurrency(typeof value === 'string' ? parseFloat(value) : value, currency)
    : value;

  const isPositive = typeof change === 'number' && change > 0;
  const isNegative = typeof change === 'number' && change < 0;
  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  // Mini decorative sparkline heights based on title/value
  const barHeights = [40, 60, 45, 80, 65, 90, 100];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-5',
        'bg-gradient-to-b from-[#111114] via-[#0C0C0E] to-[#070709]',
        'border border-white/[0.08] hover:border-white/25',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_16px_36px_rgba(0,0,0,0.6)]',
        'transition-all duration-300 group flex flex-col justify-between min-w-0',
        className,
      )}
    >
      {/* Subtle Ambient Hover Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl pointer-events-none group-hover:bg-white/[0.06] transition-all" />

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-[#71717A] truncate">
            {title}
          </p>
          {icon && (
            <div className={cn('p-2 rounded-xl flex-shrink-0 shadow-inner border border-white/10', iconBg)}>
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1 my-1 min-w-0">
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
            {prefix}
            {displayValue}
            {suffix}
          </h3>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between min-w-0">
        {typeof change === 'number' ? (
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold flex-shrink-0',
                isPositive && 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20',
                isNegative && 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20',
                change === 0 && 'bg-white/5 text-[#A1A1AA] border border-white/10',
              )}
            >
              <TrendIcon className="w-3 h-3" />
              {formatPercentage(change)}
            </div>
            <span className="text-[11px] text-[#71717A] truncate">{changePeriod}</span>
          </div>
        ) : (
          <span className="text-[11px] text-[#71717A]">Active telemetry</span>
        )}

        {/* Micro 5-bar decorative sparkline indicator */}
        <div className="flex items-end gap-1 h-3.5 flex-shrink-0 opacity-40 group-hover:opacity-80 transition-opacity">
          {barHeights.slice(2).map((h, i) => (
            <div
              key={i}
              className={cn(
                'w-1 rounded-full transition-all duration-300',
                i === 4 ? (isPositive ? 'bg-[#4ADE80]' : isNegative ? 'bg-[#F87171]' : 'bg-white') : 'bg-white/40',
              )}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
