import type { MetadataRoute } from 'next';
import { defaultDescription, siteName, siteUrl } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} - Weather, News and Movies`,
    short_name: siteName,
    description: defaultDescription,
    start_url: '/register',
    scope: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    categories: ['entertainment', 'lifestyle', 'productivity'],
    lang: 'en',
    orientation: 'portrait-primary',
    icons: [
      {
        src: `${siteUrl}/icon.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
