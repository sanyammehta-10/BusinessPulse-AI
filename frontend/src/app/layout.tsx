import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BusinessPulse AI — Know the Impact Before You Decide',
  description:
    'AI-powered business decision simulator and analytics platform. Simulate hiring, expansion, pricing, and marketing decisions. See predicted impact with best, expected, and worst case scenarios.',
  keywords: [
    'business analytics',
    'AI decision making',
    'business simulator',
    'sales forecast',
    'profit prediction',
    'business intelligence',
  ],
  openGraph: {
    title: 'BusinessPulse AI — AI-Powered Business Decision Intelligence',
    description: 'Simulate the future impact of your business decisions before you commit.',
    type: 'website',
  },
};

import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
