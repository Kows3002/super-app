import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://super-app-iota-peach.vercel.app'),

  title: 'Super App | Weather, News & Movies',

  description:
    'Discover weather updates, latest news, entertainment content, and movie recommendations in one dashboard.',

  keywords: [
    'Super App',
    'Weather',
    'News',
    'Movies',
    'Entertainment',
    'Next.js',
    'React',
    'OpenWeatherMap',
    'News API',
    'OMDb API',
  ],

  authors: [
    {
      name: 'Kowsalya',
    },
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'Super App | Weather, News & Movies',

    description:
      'Get real-time weather, latest news, and movie recommendations in one place.',

    url: 'https://super-app-iota-peach.vercel.app',

    siteName: 'Super App',

    locale: 'en_US',

    type: 'website',

    images: [
      {
        url: '/images/og/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Super App Dashboard',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'Super App | Weather, News & Movies',

    description:
      'Get real-time weather, latest news, and movie recommendations in one place.',

    images: ['/images/og/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}