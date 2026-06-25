import { NextResponse } from 'next/server';

export const revalidate = 120;

const fallbackNews = [
  {
    title: 'Want to climb Mount Everest?',
    description:
      "In the years since human beings first reached the summit of Mount Everest in 1953, climbing the world's highest mountain has changed dramatically...",
    publishedAt: '2023-02-20T19:35:00.000Z',
    urlToImage:
      'https://images.pexels.com/photos/2098428/pexels-photo-2098428.jpeg?auto=compress&cs=tinysrgb&w=600',
    url: '#',
  },
  {
    title: 'AI Revolution in 2024',
    description:
      "Artificial intelligence continues to reshape industries, from healthcare to entertainment, pushing the boundaries of what's possible...",
    publishedAt: '2023-02-21T09:00:00.000Z',
    urlToImage:
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
    url: '#',
  },
  {
    title: 'Space Exploration Milestones',
    description:
      'NASA announces new missions to the moon and Mars, marking a new era of human space exploration that promises to redefine our understanding...',
    publishedAt: '2023-02-22T11:30:00.000Z',
    urlToImage:
      'https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-41162.jpeg?auto=compress&cs=tinysrgb&w=600',
    url: '#',
  },
];

function normalizeNewsApiArticles(articles: any[]) {
  return articles.map((article) => ({
    title: article.title,
    description: article.description || article.content || 'Read the latest news update.',
    publishedAt: article.publishedAt,
    urlToImage: article.urlToImage,
    url: article.url,
  }));
}

function normalizeWorldNewsArticles(articles: any[]) {
  return articles.map((article) => ({
    title: article.title,
    description: article.text || article.summary || 'Read the latest world news update.',
    publishedAt: article.publish_date,
    urlToImage: article.image,
    url: article.url,
  }));
}

export async function GET() {
  try {
    const worldNewsKey = process.env.WORLD_NEWS_KEY;

    if (worldNewsKey) {
      const worldNewsRes = await fetch(
        `https://api.worldnewsapi.com/search-news?api-key=${worldNewsKey}&language=en&number=10&sort=publish-time`,
        { next: { revalidate } }
      );

      if (!worldNewsRes.ok) throw new Error('World News request failed');

      const worldNewsData = await worldNewsRes.json();
      if (!worldNewsData.news?.length) throw new Error('No World News articles');

      return NextResponse.json(normalizeWorldNewsArticles(worldNewsData.news));
    }

    const apiKey = process.env.NEWS_KEY || process.env.NEXT_PUBLIC_NEWS_KEY;
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}&pageSize=10`,
      { next: { revalidate } }
    );

    if (!res.ok) throw new Error('News request failed');

    const data = await res.json();
    if (!data.articles?.length) throw new Error('No articles');

    return NextResponse.json(normalizeNewsApiArticles(data.articles));
  } catch {
    return NextResponse.json(fallbackNews);
  }
}
