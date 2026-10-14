'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Zap, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import api from '@/lib/api-client';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'login'; // login | verify-email | verify-phone | reset-password

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // For password reset flow
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'verify-email': return 'Verify your email';
      case 'verify-phone': return 'Verify your phone';
      case 'reset-password': return showPasswordField ? 'Set new password' : 'Enter reset code';
      default: return 'Enter verification code';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'verify-email': return 'We sent a 6-digit code to your email.';
      case 'verify-phone': return 'We sent a 6-digit code to your phone.';
      case 'reset-password': return showPasswordField ? 'Enter your new password below.' : 'Enter the 6-digit code we sent to reset your password.';
      default: return 'Enter the 6-digit OTP code to continue.';
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const otpType = type === 'reset-password' ? 'RESET_PASSWORD'
        : type === 'verify-email' ? 'VERIFY_EMAIL'
        : type === 'verify-phone' ? 'VERIFY_PHONE'
        : 'LOGIN';

      const { data } = await api.post('/auth/otp/verify', {
        code,
        type: otpType,
        // In real app, phone/email would come from previous step
      });

      if (type === 'reset-password' && data.data?.resetToken) {
        setResetToken(data.data.resetToken);
        setShowPasswordField(true);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await api.post('/auth/reset-password', {
        token: resetToken,
        password: newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendCooldown(30);
    try {
      // In real app, resend OTP
      await api.post('/auth/otp/send', { type: type.toUpperCase().replace('-', '_') });
    } catch {
      // Silently fail
    }
  };

  if (success) {
    return (
      <div className="animate-fade-in text-center">
        <div className="w-16 h-16 rounded-full bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <CheckCircle2 className="w-8 h-8 text-[#4ADE80]" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          {type === 'reset-password' ? 'Password reset!' : 'Verified!'}
        </h1>
        <p className="text-[var(--text-secondary)]">
          {type === 'reset-password'
            ? 'Your password has been reset. Redirecting to login...'
            : 'Your account has been verified. Redirecting...'}
        </p>
      </div>
    );
  }

  // New password form after OTP verification
  if (showPasswordField) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {getTitle()}
          </h1>
          <p className="text-[var(--text-secondary)]">{getDescription()}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[#F87171]/10 border border-[#F87171]/20 text-sm text-[#F87171]">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <Input
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            hint="Must be at least 8 characters with uppercase, lowercase, and number"
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>
        </div>
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
          {getTitle()}
        </h1>
        <p className="text-[var(--text-secondary)]">{getDescription()}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-[#F87171]/10 border border-[#F87171]/20 text-sm text-[#F87171]">
          {error}
        </div>
      )}

      {/* OTP Input */}
      <div className="flex justify-center gap-3 mb-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = e.clipboardData.getData('text');
              handleChange(index, pasted);
            }}
            className={`
              w-12 h-14 text-center text-xl font-bold rounded-xl
              bg-[var(--surface)] border-2 transition-all duration-200
              focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white
              ${digit
                ? 'border-white text-[var(--text-primary)]'
                : 'border-[var(--border)] text-[var(--text-tertiary)]'
              }
            `}
          />
        ))}
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        onClick={handleVerify}
        disabled={otp.join('').length !== 6}
      >
        Verify Code
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--text-tertiary)]">
          Didn&apos;t receive the code?{' '}
          {resendCooldown > 0 ? (
            <span className="text-[var(--text-secondary)]">
              Resend in {resendCooldown}s
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-white hover:text-[#A1A1AA] underline font-medium"
            >
              Resend code
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
