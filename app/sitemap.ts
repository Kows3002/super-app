import { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

const routes = [
  { path: '/', priority: 1 },
  { path: '/register', priority: 0.9 },
  { path: '/categories', priority: 0.8 },
  { path: '/dashboard', priority: 0.8 },
  { path: '/entertainment', priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route.priority,
  }));
}
