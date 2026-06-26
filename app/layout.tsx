import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { createPageMetadata, defaultDescription, siteName, siteUrl } from '@/lib/seo';

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
  manifest: '/manifest.webmanifest',
  themeColor: '#000000',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
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

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: siteName,
  url: siteUrl,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description: defaultDescription,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Registration and onboarding',
    'Personalized entertainment categories',
    'Live weather dashboard',
    'Latest news feed',
    'Persistent notes',
    'Countdown timer',
    'Movie recommendations',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
