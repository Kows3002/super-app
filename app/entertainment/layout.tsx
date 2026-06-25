import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Personalized Entertainment',
  description:
    'Browse personalized movie recommendations by category with ratings, runtime, cast, plot details, and entertainment discovery tools.',
  path: '/entertainment',
  keywords: [
    'movie recommendations',
    'entertainment discovery',
    'movie ratings',
    'personalized movies',
    'Super App entertainment',
  ],
});

export default function EntertainmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
