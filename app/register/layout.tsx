import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Create Your Super App Account',
  description:
    'Sign up for Super App to personalize your weather dashboard, latest news feed, notes, timer, and movie recommendations.',
  path: '/register',
  keywords: [
    'Super App signup',
    'create account',
    'personal dashboard',
    'weather news movies app',
  ],
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
