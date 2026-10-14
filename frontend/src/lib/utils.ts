import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString('en-IN');
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getGrowthColor(value: number): string {
  if (value > 0) return 'text-emerald-500';
  if (value < 0) return 'text-red-500';
  return 'text-gray-500';
}

export function getRiskColor(level: string): string {
  switch (level?.toUpperCase()) {
    case 'LOW': return 'text-emerald-500';
    case 'MEDIUM': return 'text-amber-500';
    case 'HIGH': return 'text-orange-500';
    case 'CRITICAL': return 'text-red-500';
    default: return 'text-gray-500';
  }
}

export function getRiskBgColor(level: string): string {
  switch (level?.toUpperCase()) {
    case 'LOW': return 'bg-emerald-500/10 border-emerald-500/20';
    case 'MEDIUM': return 'bg-amber-500/10 border-amber-500/20';
    case 'HIGH': return 'bg-orange-500/10 border-orange-500/20';
    case 'CRITICAL': return 'bg-red-500/10 border-red-500/20';
    default: return 'bg-gray-500/10 border-gray-500/20';
  }
}
