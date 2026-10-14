'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-[#1D1D20] text-[#A1A1AA] border border-[#2A2A2D]',
  success: 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20',
  warning: 'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20',
  danger: 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20',
  info: 'bg-[#2A2A2D] text-[#A1A1AA] border border-[#3A3A3D]',
  primary: 'bg-white/10 text-white border border-white/20',
};

const dotColors: Record<string, string> = {
  default: 'bg-[#71717A]',
  success: 'bg-[#4ADE80]',
  warning: 'bg-[#FBBF24]',
  danger: 'bg-[#F87171]',
  info: 'bg-[#A1A1AA]',
  primary: 'bg-white',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
