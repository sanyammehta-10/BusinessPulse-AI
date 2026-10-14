import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#111113] border-r border-[#2A2A2D] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/[0.03] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-[#F5F5F5]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">BusinessPulse AI</span>
          </Link>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4 leading-tight text-white">
              Make Decisions with Confidence
            </h2>
            <p className="text-lg text-[#A1A1AA] leading-relaxed">
              Simulate the impact of your business decisions using AI.
              See what happens before you commit.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'AI-powered decision simulations',
                'Sales & profit forecasting',
                'Risk analysis & scoring',
                'Best/Expected/Worst case scenarios',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#A1A1AA]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-[#71717A]">
            © 2026 BusinessPulse AI. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
