'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Settings, User, Building2, Users, Save, Shield } from 'lucide-react';
import api from '@/lib/api-client';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export default function SettingsPage() {
  const { user, activeBusiness, setBusinesses } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'business' | 'account' | 'team'>('business');
  
  // Business State
  const [businessName, setBusinessName] = useState(activeBusiness?.name || '');
  const [industry, setIndustry] = useState(activeBusiness?.industry || '');
  const [currency, setCurrency] = useState(activeBusiness?.currency || 'USD');
  const [isSavingBusiness, setIsSavingBusiness] = useState(false);

  const handleSaveBusiness = async () => {
    if (!activeBusiness) return;
    setIsSavingBusiness(true);
    try {
      const res = await api.patch(`/businesses/${activeBusiness.id}`, {
        name: businessName,
        industry,
        currency,
      });
      // Updating store (simplified, ideally we refetch businesses)
      toast.success('Business settings updated successfully');
      // Here we would refetch businesses, but we'll just show success for now
    } catch (error) {
      toast.error('Failed to update business settings');
    } finally {
      setIsSavingBusiness(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Settings
        </h1>
        <p className="text-[#A1A1AA] mt-1">Manage your account and business preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('business')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'business'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-5 h-5" />
            Business Profile
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'account'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-5 h-5" />
            Account Settings
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'team'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-5 h-5" />
            Team Members
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-[#171719] border border-[#2A2A2D] rounded-2xl p-6">
            
            {activeTab === 'business' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Business Profile</h2>
                  <p className="text-sm text-[#A1A1AA]">Update your company&apos;s core information.</p>
                </div>
                
                <div className="space-y-4 max-w-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#F5F5F5]">Company Name</label>
                    <Input 
                      value={businessName} 
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#F5F5F5]">Industry</label>
                    <Input 
                      value={industry} 
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#F5F5F5]">Primary Currency</label>
                    <select
                      className="flex h-11 w-full rounded-xl border border-[#2A2A2D] bg-[#111113] px-3 py-2 text-sm text-[#F5F5F5] focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-[#2A2A2D]">
                    <Button 
                      onClick={handleSaveBusiness} 
                      disabled={isSavingBusiness}
                      className="bg-white hover:bg-[#A3A3A3] text-[#0A0A0B] font-medium"
                    >
                      {isSavingBusiness ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Account Settings</h2>
                  <p className="text-sm text-[#A1A1AA]">Manage your personal profile and preferences.</p>
                </div>
                <div className="space-y-4 max-w-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#F5F5F5]">Full Name</label>
                    <Input defaultValue={user?.name || ''} readOnly className="opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#F5F5F5]">Email Address</label>
                    <Input defaultValue={user?.email || ''} readOnly className="opacity-70" />
                  </div>
                  <div className="p-4 bg-[#FBBF24]/10 border border-[#FBBF24]/20 rounded-xl mt-4">
                    <p className="text-sm text-[#FBBF24] flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Account updates are currently handled by support.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Team Members</h2>
                  <p className="text-sm text-[#A1A1AA]">Manage who has access to this business data.</p>
                </div>
                
                <div className="border border-[#2A2A2D] rounded-xl overflow-hidden">
                  <div className="p-4 flex items-center justify-between border-b border-[#2A2A2D] bg-[#111113]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-[#71717A]">{user?.email}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold">
                      Owner
                    </span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full border-dashed border-[#2A2A2D] text-[#A1A1AA] hover:text-white hover:border-[#3A3A3D]">
                  + Invite Team Member
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
