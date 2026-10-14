'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className,
  padding = 'md',
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-b from-[#111114] via-[#0C0C0E] to-[#070709]',
        'border border-white/[0.08] rounded-2xl',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_16px_36px_rgba(0,0,0,0.6)]',
        'transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
        paddingStyles[padding],
        hover && 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:border-white/20 hover:-translate-y-1 cursor-pointer',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Sub-components
export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-5 pb-3 border-b border-white/[0.05]', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-base sm:text-lg font-bold text-white tracking-tight', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-xs text-[#71717A] mt-0.5', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('min-w-0', className)}>{children}</div>;
}
