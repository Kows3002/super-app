import { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

const lastModified = new Date('2026-06-26');

const routes = [
  { path: '/', priority: 1, changeFrequency: 'monthly' },
  { path: '/register', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/categories', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/dashboard', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/entertainment', priority: 0.7, changeFrequency: 'weekly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: route.priority,
  }));
}
