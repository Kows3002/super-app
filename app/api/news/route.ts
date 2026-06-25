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

export async function GET() {
  try {
    const apiKey = process.env.NEWS_KEY || process.env.NEXT_PUBLIC_NEWS_KEY;
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}&pageSize=10`,
      { next: { revalidate } }
    );

    if (!res.ok) throw new Error('News request failed');

    const data = await res.json();
    if (!data.articles?.length) throw new Error('No articles');

    return NextResponse.json(data.articles);
  } catch {
    return NextResponse.json(fallbackNews);
  }
}
