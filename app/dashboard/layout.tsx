import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Personal Dashboard',
  description:
    'Track live weather, rotating latest news, personal notes, and a countdown timer from one optimized Super App dashboard.',
  path: '/dashboard',
  keywords: [
    'personal dashboard',
    'live weather',
    'latest news feed',
    'notes app',
    'countdown timer',
  ],
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
