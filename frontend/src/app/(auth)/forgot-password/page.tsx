'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Zap, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import api from '@/lib/api-client';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    try {
      setIsLoading(true);
      setError('');
      await api.post('/auth/forgot-password', { email: data.email });
      setSubmitted(true);
    } catch (err: any) {
      // Don't reveal if email exists — always show success
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="animate-fade-in text-center">
        <div className="w-16 h-16 rounded-full bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#4ADE80]" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Check your email
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          If an account exists for <strong>{getValues('email')}</strong>, we&apos;ve sent a password reset OTP.
        </p>

        <Link href="/verify?type=reset-password">
          <Button variant="primary" size="lg" fullWidth>
            Enter OTP
          </Button>
        </Link>

        <p className="mt-6 text-sm text-[var(--text-tertiary)]">
          Didn&apos;t receive the email?{' '}
          <button
            onClick={() => setSubmitted(false)}
            className="text-white hover:text-[#A1A1AA] underline font-medium"
          >
            Try again
          </button>
        </p>

        <Link
          href="/login"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 mb-8 lg:hidden">
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold">BusinessPulse AI</span>
      </div>

      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Reset your password
        </h1>
        <p className="text-[var(--text-secondary)]">
          Enter your email and we&apos;ll send you an OTP to reset your password.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-[#F87171]/10 border border-[#F87171]/20 text-sm text-[#F87171]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@company.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
          Send Reset OTP
        </Button>
      </form>
    </div>
  );
}
