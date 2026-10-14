'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api-client';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Zap,
  Building2,
  Users,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  IndianRupee,
  DollarSign,
} from 'lucide-react';

const industries = [
  'Retail', 'E-Commerce', 'Manufacturing', 'Healthcare', 'Technology',
  'Food & Beverage', 'Education', 'Real Estate', 'Financial Services',
  'Consulting', 'Logistics', 'Agriculture', 'Other',
];

const businessTypes = [
  'Sole Proprietorship', 'Partnership', 'LLP', 'Private Limited',
  'Public Limited', 'One Person Company', 'Other',
];

const businessSizes = [
  { key: 'MICRO', label: 'Micro', description: '1-10 employees' },
  { key: 'SMALL', label: 'Small', description: '11-50 employees' },
  { key: 'MEDIUM', label: 'Medium', description: '51-200 employees' },
];

const currencies = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
];

export default function SetupPage() {
  const router = useRouter();
  const { setBusinesses, setActiveBusiness, fetchUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessSize, setBusinessSize] = useState('SMALL');
  const [currency, setCurrency] = useState('INR');
  const [employeeCount, setEmployeeCount] = useState(0);
  const [branchCount, setBranchCount] = useState(1);

  const totalSteps = 3;

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/businesses', {
        name,
        industry,
        businessType,
        businessSize,
        currency,
        employeeCount,
        branchCount,
      });

      const business = data.data;

      // Complete onboarding
      await api.post(`/businesses/${business.id}/complete-onboarding`);

      // Refresh user data to pick up the new business
      await fetchUser();

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create business. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedStep1 = name.trim().length >= 2 && industry !== '';
  const canProceedStep2 = businessType !== '' && businessSize !== '';

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">
            Business<span className="text-white">Pulse</span> AI
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-all duration-500',
                  i + 1 <= step ? 'bg-white' : 'bg-[#2A2A2D]'
                )}
              />
            </div>
          ))}
          <span className="text-xs font-medium text-[var(--text-tertiary)] ml-2">
            {step}/{totalSteps}
          </span>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-md animate-fade-in">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#F87171]/10 border border-[#F87171]/20 text-sm text-[#F87171]">
              {error}
            </div>
          )}

          {/* ─── Step 1: Business Identity ─────────── */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Tell us about your business</h2>
                  <p className="text-sm text-[var(--text-tertiary)]">We&apos;ll tailor the experience for you</p>
                </div>
              </div>

              <div className="space-y-5">
                <Input
                  label="Business Name"
                  placeholder="e.g., Acme Technologies"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<Building2 className="w-4 h-4" />}
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Industry</label>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((ind) => (
                      <button
                        key={ind}
                        onClick={() => setIndustry(ind)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                          industry === ind
                            ? 'bg-white text-black border-white shadow-sm font-semibold'
                            : 'bg-[#111113] text-[#A1A1AA] border-[#2A2A2D] hover:border-[#3A3A3D] hover:text-white'
                        )}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 2: Business Details ──────────── */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Business Details</h2>
                  <p className="text-sm text-[var(--text-tertiary)]">Help us understand your scale</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Business Type</label>
                  <div className="flex flex-wrap gap-2">
                    {businessTypes.map((bt) => (
                      <button
                        key={bt}
                        onClick={() => setBusinessType(bt)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                          businessType === bt
                            ? 'bg-white text-black border-white shadow-sm font-semibold'
                            : 'bg-[#111113] text-[#A1A1AA] border-[#2A2A2D] hover:border-[#3A3A3D] hover:text-white'
                        )}
                      >
                        {bt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Business Size</label>
                  <div className="grid grid-cols-3 gap-3">
                    {businessSizes.map((size) => (
                      <button
                        key={size.key}
                        onClick={() => setBusinessSize(size.key)}
                        className={cn(
                          'p-3 rounded-xl border text-center transition-all',
                          businessSize === size.key
                            ? 'bg-white/10 border-white/30 ring-1 ring-white/20'
                            : 'border-[#2A2A2D] bg-[#111113] hover:border-[#3A3A3D]'
                        )}
                      >
                        <p className="text-sm font-bold text-[var(--text-primary)]">{size.label}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{size.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Employees"
                    type="number"
                    value={String(employeeCount)}
                    onChange={(e) => setEmployeeCount(Number(e.target.value))}
                    leftIcon={<Users className="w-4 h-4" />}
                  />
                  <Input
                    label="Branches"
                    type="number"
                    value={String(branchCount)}
                    onChange={(e) => setBranchCount(Number(e.target.value))}
                    leftIcon={<MapPin className="w-4 h-4" />}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 3: Preferences ───────────────── */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#4ADE80]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Almost There!</h2>
                  <p className="text-sm text-[var(--text-tertiary)]">Choose your preferences</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Currency</label>
                  <div className="grid grid-cols-2 gap-3">
                    {currencies.map((cur) => (
                      <button
                        key={cur.code}
                        onClick={() => setCurrency(cur.code)}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl border transition-all',
                          currency === cur.code
                            ? 'bg-[#4ADE80]/10 border-[#4ADE80]/30 ring-1 ring-[#4ADE80]/20'
                            : 'border-[#2A2A2D] bg-[#111113] hover:border-[#3A3A3D]'
                        )}
                      >
                        <span className="text-lg font-bold text-[var(--text-primary)]">{cur.symbol}</span>
                        <div className="text-left">
                          <p className="text-sm font-medium text-[var(--text-primary)]">{cur.code}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{cur.label}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 mt-4">
                  <h4 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Summary</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Business', value: name },
                      { label: 'Industry', value: industry },
                      { label: 'Type', value: businessType },
                      { label: 'Size', value: businessSizes.find(s => s.key === businessSize)?.label },
                      { label: 'Currency', value: currency },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-[var(--text-tertiary)]">{item.label}</span>
                        <span className="font-medium text-[var(--text-primary)]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Navigation Buttons ────────────────── */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
            {step > 1 ? (
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                isLoading={isLoading}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
                variant="primary"
                size="lg"
              >
                Launch Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
