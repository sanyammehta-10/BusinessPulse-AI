'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Lightbulb, TrendingUp, TrendingDown, ArrowRight, Zap, PlayCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import Link from 'next/link';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  type: 'Growth' | 'Cost-Saving' | 'Efficiency';
  metric: string;
}

export default function RecommendationsPage() {
  const { activeBusiness } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  // Simulated AI Recommendations
  const recommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Optimize Marketing Spend on Digital Channels',
      description: 'Your Customer Acquisition Cost (CAC) has increased by 15% over the last quarter. Re-allocating 20% of your print budget to digital campaigns could improve ROI by 2.5x.',
      impact: 'High',
      type: 'Efficiency',
      metric: '+$12,500/mo',
    },
    {
      id: '2',
      title: 'Increase Prices for Premium Services',
      description: 'Based on inflation trends and competitor pricing models in your sector, increasing your top-tier service pricing by 5-7% will have minimal impact on churn while boosting margins.',
      impact: 'Medium',
      type: 'Growth',
      metric: '+8% Margin',
    },
    {
      id: '3',
      title: 'Reduce Software Subscription Overlap',
      description: 'You currently have overlapping tools in project management and communication. Consolidating to a single platform could reduce operational expenses significantly.',
      impact: 'Low',
      type: 'Cost-Saving',
      metric: '-$800/mo',
    }
  ];

  useEffect(() => {
    // Simulate AI loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            AI Recommendations
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20">
              BETA
            </span>
          </h1>
          <p className="text-[#A1A1AA] mt-1">Actionable insights automatically generated from your business data.</p>
        </div>
        <Button variant="outline" className="gap-2 border-[#2A2A2D] text-[#F5F5F5] hover:bg-white/10">
          <Zap className="w-4 h-4 text-[#A3A3A3]" />
          Refresh Insights
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#171719] border border-[#2A2A2D] rounded-2xl">
          <Loader2 className="w-8 h-8 text-white animate-spin mb-4" />
          <p className="text-[#F5F5F5] font-medium animate-pulse">BusinessPulse AI is analyzing your data...</p>
          <p className="text-[#71717A] text-sm mt-2">Looking for growth and cost-saving opportunities</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <div 
              key={rec.id} 
              className="group relative bg-[#171719] border border-[#2A2A2D] rounded-2xl p-6 hover:border-[#3A3A3D] transition-all duration-300 flex flex-col h-full"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {rec.type === 'Growth' && <TrendingUp className="w-6 h-6 text-[#4ADE80]" />}
                  {rec.type === 'Cost-Saving' && <TrendingDown className="w-6 h-6 text-[#F87171]" />}
                  {rec.type === 'Efficiency' && <Lightbulb className="w-6 h-6 text-[#FBBF24]" />}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    rec.impact === 'High' ? 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20' :
                    rec.impact === 'Medium' ? 'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20' :
                    'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20'
                  }`}>
                    {rec.impact} Impact
                  </span>
                  <span className="text-sm font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded border border-white/10">
                    {rec.metric}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{rec.title}</h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6 flex-1">
                {rec.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-[#2A2A2D]">
                <Link href={`/simulator?scenario=${encodeURIComponent(rec.title)}`}>
                  <Button variant="outline" className="w-full border-[#2A2A2D] text-[#F5F5F5] hover:bg-white hover:text-[#0A0A0B] transition-all gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Simulate this Action
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats Banner */}
      {!loading && (
        <div className="mt-8 bg-[#171719] border border-[#2A2A2D] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Want more personalized insights?</h3>
            <p className="text-[#A1A1AA] text-sm mt-1">Connect more data sources like QuickBooks or Stripe to improve AI accuracy.</p>
          </div>
          <Link href="/data/sales">
            <Button className="mt-4 md:mt-0 bg-white text-[#0A0A0B] hover:bg-[#A3A3A3] font-medium gap-2">
              Connect Data Sources <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
