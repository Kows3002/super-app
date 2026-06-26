import type { Metadata } from 'next';

export const siteUrl = 'https://super-app-iota-peach.vercel.app';
export const siteName = 'Super App';
export const ogImage = '/images/og/og-image.png';
export const defaultDescription =
  'Personalize a dashboard with live weather, latest news, notes, a countdown timer, and movie recommendations in Super App.';

type PageSeo = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: PageSeo): Metadata {
  const url = `${siteUrl}${path}`;
  const imageUrl = `${siteUrl}${ogImage}`;

  return {
    title,
    description,
    keywords,
    applicationName: siteName,
    creator: 'Kowsalya',
    publisher: siteName,
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}
