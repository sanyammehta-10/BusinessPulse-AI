'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-white text-black hover:bg-[#E4E4E7] shadow-[0_10px_25px_-5px_rgba(255,255,255,0.12)] active:scale-[0.98]',
  secondary:
    'bg-[#0D0D10] text-white border border-white/[0.08] hover:bg-[#141418] hover:border-white/20 active:scale-[0.98]',
  ghost:
    'bg-transparent text-[var(--text-secondary)] hover:bg-white/[0.05] hover:text-white active:scale-[0.98]',
  danger:
    'bg-[#F87171] text-black hover:bg-[#EF4444] shadow-md hover:shadow-lg active:scale-[0.98]',
  outline:
    'bg-transparent text-white border border-white/[0.12] hover:bg-white/[0.05] hover:border-white/30 active:scale-[0.98]',
  success:
    'bg-[#4ADE80] text-black hover:bg-[#86EFAC] shadow-md hover:shadow-lg active:scale-[0.98]',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3.5 py-1.5 text-xs gap-1.5 rounded-full',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-full',
  lg: 'px-7 py-3 text-sm font-semibold gap-2.5 rounded-full',
  xl: 'px-9 py-3.5 text-base font-semibold gap-2.5 rounded-full',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium tracking-tight transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:active:scale-100',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
