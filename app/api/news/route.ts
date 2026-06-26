import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface NewsArticle {
  title?: string;
  description?: string | null;
  content?: string | null;
  publishedAt?: string;
  urlToImage?: string | null;
  url?: string;
}

interface WorldNewsArticle {
  title?: string;
  text?: string | null;
  summary?: string | null;
  publish_date?: string;
  image?: string | null;
  url?: string;
}

interface NormalizedArticle {
  title: string;
  description: string;
  publishedAt: string;
  urlToImage: string | null;
  url: string;
}

const fallbackNews: NormalizedArticle[] = [];

function isUsableArticle(article: NormalizedArticle) {
  return Boolean(article.title?.trim() && article.description?.trim() && article.url?.trim());
}

function normalizeNewsApiArticles(articles: NewsArticle[]): NormalizedArticle[] {
  return articles
    .map((article) => ({
      title: article.title?.replace(/\s+-\s+[^-]+$/, '').trim() || '',
      description: article.description || article.content || 'Read the latest news update.',
      publishedAt: article.publishedAt || new Date().toISOString(),
      urlToImage: article.urlToImage || null,
      url: article.url || '#',
    }))
    .filter(isUsableArticle);
}

function normalizeWorldNewsArticles(articles: WorldNewsArticle[]): NormalizedArticle[] {
  return articles
    .map((article) => ({
      title: article.title?.trim() || '',
      description: article.text || article.summary || 'Read the latest world news update.',
      publishedAt: article.publish_date || new Date().toISOString(),
      urlToImage: article.image || null,
      url: article.url || '#',
    }))
    .filter(isUsableArticle);
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTagValue(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

function getEnclosureImage(xml: string) {
  const mediaMatch = xml.match(/<media:content[^>]+url="([^"]+)"/i);
  const enclosureMatch = xml.match(/<enclosure[^>]+url="([^"]+)"/i);
  return mediaMatch?.[1] || enclosureMatch?.[1] || null;
}

async function fetchLiveRssNews(): Promise<NormalizedArticle[]> {
  const rssRes = await fetch('https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en', {
    cache: 'no-store',
  });

  if (!rssRes.ok) throw new Error('Live RSS request failed');

  const xml = await rssRes.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];

  return items
    .slice(0, 10)
    .map((item) => ({
      title: getTagValue(item, 'title').replace(/\s+-\s+[^-]+$/, '').trim(),
      description: getTagValue(item, 'description') || 'Read the latest news update.',
      publishedAt: new Date(getTagValue(item, 'pubDate') || Date.now()).toISOString(),
      urlToImage: getEnclosureImage(item),
      url: getTagValue(item, 'link') || '#',
    }))
    .filter(isUsableArticle);
}

function sortByLatest(articles: NormalizedArticle[]) {
  return [...articles].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA);
  });
}

export async function GET() {
  try {
    const worldNewsKey = process.env.WORLD_NEWS_API_KEY || process.env.WORLD_NEWS_KEY;
    const newsApiKey = process.env.NEWS_API_KEY || process.env.NEWS_KEY || process.env.NEXT_PUBLIC_NEWS_KEY;

    if (worldNewsKey) {
      const params = new URLSearchParams({
        'api-key': worldNewsKey,
        language: 'en',
        number: '10',
        sort: 'publish-time',
        'source-countries': 'in,us,gb',
      });

      const worldNewsRes = await fetch(`https://api.worldnewsapi.com/search-news?${params}`, {
        cache: 'no-store',
      });

      if (!worldNewsRes.ok) throw new Error('World News request failed');

      const worldNewsData = await worldNewsRes.json();
      if (!worldNewsData.news?.length) throw new Error('No World News articles');

      return NextResponse.json(sortByLatest(normalizeWorldNewsArticles(worldNewsData.news)));
    }

    if (!newsApiKey) {
      return NextResponse.json(sortByLatest(await fetchLiveRssNews()));
    }

    const params = new URLSearchParams({
      country: 'in',
      pageSize: '10',
      apiKey: newsApiKey,
    });

    const res = await fetch(`https://newsapi.org/v2/top-headlines?${params}`, {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('News request failed');

    const data = await res.json();
    if (!data.articles?.length) throw new Error('No articles');

    return NextResponse.json(sortByLatest(normalizeNewsApiArticles(data.articles)));
  } catch {
    try {
      return NextResponse.json(sortByLatest(await fetchLiveRssNews()));
    } catch {
      return NextResponse.json(fallbackNews);
    }
  }
}
