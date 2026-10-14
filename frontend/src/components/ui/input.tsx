'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none z-10">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full py-2.5 text-sm rounded-lg',
              'bg-[var(--surface)] text-[var(--text-primary)]',
              'border border-[var(--border)]',
              'placeholder:text-[var(--text-tertiary)]',
              'transition-all duration-200',
              'hover:border-[#3A3A3D]',
              'focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/50',
              error && 'border-[#F87171] focus:ring-[#F87171]/30 focus:border-[#F87171]',
              props.disabled && 'opacity-50 cursor-not-allowed bg-[var(--surface-hover)]',
              className,
            )}
            style={{
              paddingLeft: leftIcon ? '2.5rem' : '1rem',
              paddingRight: rightIcon ? '2.5rem' : '1rem',
            }}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
