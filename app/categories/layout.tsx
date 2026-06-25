import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Choose Entertainment Categories',
  description:
    'Select your favorite entertainment categories in Super App to unlock personalized movie and show recommendations.',
  path: '/categories',
  keywords: [
    'entertainment categories',
    'movie preferences',
    'personalized recommendations',
    'Super App categories',
  ],
});

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
