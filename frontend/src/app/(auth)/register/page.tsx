'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Eye, EyeOff, Zap, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth-store';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const passwordChecks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      await registerUser(data.name, data.email, data.password);
      router.push('/setup');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 mb-8 lg:hidden">
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold">BusinessPulse AI</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Create your account
        </h1>
        <p className="text-[var(--text-secondary)]">
          Start making data-driven business decisions
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-[#F87171]/10 border border-[#F87171]/20 text-sm text-[#F87171]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />

          {password && (
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {passwordChecks.map((check) => (
                <div
                  key={check.label}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    check.valid ? 'text-[#4ADE80]' : 'text-[var(--text-tertiary)]'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${check.valid ? 'text-[#4ADE80]' : 'text-[var(--border)]'}`} />
                  {check.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-[var(--text-tertiary)]">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-white hover:underline">Terms</a> and{' '}
        <a href="#" className="text-white hover:underline">Privacy Policy</a>.
      </p>

      <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-white hover:text-[#A1A1AA] underline transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
