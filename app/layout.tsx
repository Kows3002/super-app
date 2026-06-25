import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { createPageMetadata, siteName, siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'Super App | Weather, News & Movies',
    description:
      'Discover weather updates, latest news, entertainment content, and movie recommendations in one dashboard.',
    path: '/',
    keywords: [
      'Super App',
      'Weather dashboard',
      'Latest news',
      'Movie recommendations',
      'Entertainment categories',
      'Next.js dashboard',
    ],
  }),
  metadataBase: new URL('https://super-app-iota-peach.vercel.app'),
  applicationName: siteName,
  creator: 'Kowsalya',
  publisher: siteName,
  category: 'Entertainment',
  title: {
    default: 'Super App | Weather, News & Movies',
    template: `%s | ${siteName}`,
  },
  authors: [
    {
      name: 'Kowsalya',
      url: siteUrl,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
