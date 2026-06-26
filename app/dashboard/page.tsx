'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  IconControlButton,
} from '@/components/buttons';
import { setNotes, useAppDispatch, useAppSelector } from '@/lib/store';
import {
  ChevronDown,
  ChevronUp,
  Cloud,
  Droplets,
  Wind,
} from 'lucide-react';

interface WeatherData {
  temp: number;
  description: string;
  wind: string;
  pressure: number;
  humidity: number;
  icon: string;
}

interface NewsItem {
  title: string;
  description: string;
  publishedAt: string;
  urlToImage: string | null;
  url: string;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatNewsDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'numeric', day: '2-digit', year: 'numeric' });
}

function getNewsKey(news: NewsItem) {
  return `${news.title.trim().toLowerCase()}-${news.url?.trim().toLowerCase() ?? ''}`;
}

function prepareNewsFeed(articles: NewsItem[]) {
  const uniqueNews = new Map<string, NewsItem>();

  articles.forEach((article) => {
    if (!article.title?.trim()) return;
    uniqueNews.set(getNewsKey(article), article);
  });

  return Array.from(uniqueNews.values()).sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA);
  });
}

async function getWeather(signal?: AbortSignal): Promise<WeatherData> {
  try {
    const res = await fetch('/api/weather', { signal });
    if (!res.ok) throw new Error('failed');
    return res.json();
  } catch {
    if (signal?.aborted) throw new Error('aborted');
    return {
      temp: 24,
      description: 'Heavy rain',
      wind: '3.7 km/h',
      pressure: 1010,
      humidity: 83,
      icon: '10d',
    };
  }
}

async function getNews(signal?: AbortSignal): Promise<NewsItem[]> {
  try {
    const res = await fetch('/api/news', { signal });
    if (!res.ok) throw new Error('failed');
    const data = await res.json();
    if (data?.length) return prepareNewsFeed(data);
    throw new Error('no articles');
  } catch {
    if (signal?.aborted) throw new Error('aborted');
    return prepareNewsFeed([
      {
        title: 'Latest news is temporarily unavailable',
        description: 'Please check your connection or refresh the dashboard to load the newest headlines.',
        publishedAt: new Date().toISOString(),
        urlToImage: null,
        url: '#',
      },
    ]);
  }
}

function WeatherSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr] items-center gap-5">
        <div className="mx-auto h-16 w-16 rounded-full bg-white/15" />
        <div className="h-16 bg-white/20" />
        <div className="space-y-3">
          <div className="mx-auto h-8 w-20 rounded bg-white/15" />
          <div className="mx-auto h-4 w-24 rounded bg-white/15" />
        </div>
        <div className="h-16 bg-white/20" />
        <div className="space-y-3">
          <div className="h-4 w-20 rounded bg-white/15" />
          <div className="h-4 w-20 rounded bg-white/15" />
        </div>
      </div>
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-lg bg-white">
      <div className="h-[340px] bg-neutral-300" />
      <div className="mx-5 mt-4 flex-1 p-3">
        <div className="h-5 w-full rounded bg-neutral-200" />
        <div className="mt-3 h-5 w-11/12 rounded bg-neutral-200" />
        <div className="mt-3 h-5 w-10/12 rounded bg-neutral-200" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, selectedCategories, notes } = useAppSelector((state) => state.app);
  const [hydrated, setHydrated] = useState(false);
  const displayUser = hydrated && user ? user : {
    name: 'Jeevankumar',
    username: 'jeevan_kumar',
    email: 'jeev@gmail.com',
    mobile: '',
  };
  const displayCategories = hydrated && selectedCategories.length > 0
    ? selectedCategories
    : ['Action', 'Romance', 'Western', 'Drama'];

  useEffect(() => {
    setHydrated(true);
  }, []);

  const [now, setNow] = useState(() => new Date('2026-06-26T00:00:00+05:30'));
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ['weather'],
    queryFn: ({ signal }) => getWeather(signal),
    staleTime: 5 * 60 * 1000,
  });

  const defaultNewsFeed = useMemo<NewsItem[]>(() => [
    {
      title: 'Latest headlines',
      description: 'Live news updates are loading. Hover over this card to pause the rotating feed.',
      publishedAt: '2026-06-26T00:00:00.000Z',
      urlToImage: null,
      url: '#',
    },
  ], []);
  const { data: fetchedNewsFeed, isLoading: newsLoading } = useQuery({
    queryKey: ['news'],
    queryFn: ({ signal }) => getNews(signal),
    staleTime: 60 * 1000,
  });
  const newsFeed = fetchedNewsFeed ?? defaultNewsFeed;
  const [newsIndex, setNewsIndex] = useState(0);
  const [newsPaused, setNewsPaused] = useState(false);

  useEffect(() => {
    setNewsIndex(0);
  }, [fetchedNewsFeed]);

  useEffect(() => {
    if (newsFeed.length < 2 || newsPaused) return;
    const t = setInterval(() => {
      setNewsIndex((currentIndex) => {
        const currentNewsKey = getNewsKey(newsFeed[currentIndex]);

        for (let offset = 1; offset < newsFeed.length; offset += 1) {
          const nextIndex = (currentIndex + offset) % newsFeed.length;
          if (getNewsKey(newsFeed[nextIndex]) !== currentNewsKey) return nextIndex;
        }

        return currentIndex;
      });
    }, 4000);
    return () => clearInterval(t);
  }, [newsFeed, newsPaused]);

  const currentNews = newsFeed[newsIndex] || null;
  const currentNewsImage = '/images/categories/fantasy.png';

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s < 59) return s + 1;

          setMinutes((m) => {
            if (m < 59) return m + 1;

            setHours((h) => Math.min(99, h + 1));
            return 0;
          });

          return 0;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  function adjustTime(field: 'h' | 'm' | 's', delta: number) {
    if (running) return;
    if (field === 'h') setHours((v) => Math.max(0, Math.min(99, v + delta)));
    if (field === 'm') setMinutes((v) => Math.max(0, Math.min(59, v + delta)));
    if (field === 's') setSeconds((v) => Math.max(0, Math.min(59, v + delta)));
  }

  const progress = seconds / 60;

  const [localNotes, setLocalNotes] = useState('');

  useEffect(() => {
    if (hydrated) setLocalNotes(notes);
  }, [hydrated, notes]);

  function saveNotes() {
    dispatch(setNotes(localNotes));
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white md:px-8 lg:px-10">
      <h1 className="sr-only">Super App personal dashboard</h1>
      <main className="mx-auto grid min-h-[calc(100vh-48px)] w-full max-w-[1640px] grid-cols-1 gap-7 lg:grid-cols-[32%_30%_29%] lg:items-start lg:justify-center">
        <section className="space-y-5">
          <div className="rounded-lg bg-[#5746ea] p-5">
            <div className="flex gap-6">
              <div className="relative h-[145px] w-[84px] shrink-0 overflow-hidden rounded-[30px] border-2 border-white shadow-lg">
                <Image
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="avatar"
                  fill
                  priority
                  sizes="84px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 pt-3">
                <p className="truncate text-base font-semibold">{displayUser.name}</p>
                <p className="truncate text-sm text-white/90">{displayUser.email}</p>
                <p className="mt-2 truncate text-3xl font-bold leading-none">{displayUser.username}</p>
                <div className="mt-7 grid grid-cols-2 gap-3">
                  {displayCategories.slice(0, 4).map((cat) => (
                    <span key={cat} className="rounded-full bg-[#d8d3ff] px-3 py-1.5 text-center text-xs font-bold text-[#21156b]">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-[#101744]">
            <div className="flex items-center justify-between bg-[#ff40d1] px-10 py-2 text-2xl font-bold">
              <span>{dateStr}</span>
              <span>{timeStr}</span>
            </div>
            <div className="px-6 py-4">
              {weatherLoading ? (
                <WeatherSkeleton />
              ) : weather && (
                <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr] items-center gap-5">
                  <div className="text-center">
                    <Cloud size={42} className="mx-auto text-white" />
                    <p className="mt-2 text-sm capitalize">{weather.description}</p>
                  </div>
                  <div className="h-16 bg-white/40" />
                  <div className="text-center">
                    <p className="text-4xl font-light">{weather.temp}&deg;C</p>
                    <div className="mt-2 flex items-center justify-center gap-3 text-xs">
                      <img
                        src="/images/svg/temperature.svg"
                        alt=""
                        aria-hidden="true"
                        className="h-7 w-4 shrink-0"
                      />
                      <p className="text-left">
                        {weather.pressure} mbar<br />Pressure
                      </p>
                    </div>
                  </div>
                  <div className="h-16 bg-white/40" />
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Wind size={17} />
                      <span>{weather.wind}<br />Wind</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets size={17} />
                      <span>{weather.humidity}%<br />Humidity</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="flex min-h-[338px] flex-col rounded-lg bg-[#f2c94c] px-8 py-7 text-black">
          <h2 className="text-3xl font-bold">All notes</h2>
          <textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            placeholder="This is how I am going to learn MERN Stack in next 3 months."
            className="notes-scrollbar-only mt-6 h-[220px] resize-none overflow-y-scroll bg-transparent pr-5 text-lg leading-7 text-black outline-none placeholder:text-black"
          />
          <button
            type="button"
            onClick={saveNotes}
            className="ml-auto mt-4 rounded-full bg-black px-6 py-3 text-base font-semibold text-white"
          >
            Save Notes
          </button>
        </section>

        <section
          className="row-span-2 flex w-full max-w-[360px] flex-col overflow-hidden rounded-lg bg-white text-black"
          onMouseEnter={() => setNewsPaused(true)}
          onMouseLeave={() => setNewsPaused(false)}
        >
          {newsLoading ? (
            <NewsSkeleton />
          ) : currentNews && (
            <>
              <div className="relative h-[310px] shrink-0">
                <Image
                  src={currentNewsImage}
                  alt={currentNews.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/65 px-5 py-5 text-white">
                  <h2 className="text-2xl font-bold leading-tight drop-shadow">{currentNews.title}</h2>
                  <p className="mt-3 text-sm font-semibold">{formatNewsDate(currentNews.publishedAt)}</p>
                </div>
              </div>
              <div className="p-7 text-justify text-sm leading-7 text-black">
                {currentNews.description}
              </div>
            </>
          )}
        </section>

        <section className="rounded-lg bg-[#1b2148] p-6 lg:col-span-2">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[250px_1fr]">
            <div className="relative mx-auto h-[175px] w-[175px]">
              <svg className="h-full w-full -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" className="stroke-black/30" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress)}`}
                  strokeLinecap="round"
                  className="stroke-[#fb7185] transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                {pad(hours)}:{pad(minutes)}:{pad(seconds)}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-6 text-center">
                {[
                  { label: 'Hours', val: hours, field: 'h' as const },
                  { label: 'Minutes', val: minutes, field: 'm' as const },
                  { label: 'Seconds', val: seconds, field: 's' as const },
                ].map(({ label, val, field }) => (
                  <div key={field} className="flex flex-col items-center gap-3">
                    <span className="text-lg text-white/85">{label}</span>
                    <IconControlButton
                      onClick={() => adjustTime(field, 1)}
                      aria-label={`Increase ${label.toLowerCase()}`}
                    >
                      <ChevronUp size={28} fill="currentColor" />
                    </IconControlButton>
                    <span className="w-20 text-4xl font-light">{pad(val)}</span>
                    <IconControlButton
                      onClick={() => adjustTime(field, -1)}
                      aria-label={`Decrease ${label.toLowerCase()}`}
                    >
                      <ChevronDown size={28} fill="currentColor" />
                    </IconControlButton>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setRunning((r) => !r)}
                className="mt-4 w-full rounded-xl bg-[#ff6b6b] py-3 text-xl font-semibold text-white"
              >
                {running ? 'Pause' : 'Start'}
              </button>
              <button
                type="button"
                onClick={() => { setRunning(false); setHours(0); setMinutes(0); setSeconds(0); }}
                className="sr-only"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end lg:col-start-3">
          <button
            type="button"
            onClick={() => router.push('/entertainment')}
            className="rounded-full bg-brand-dark px-10 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-darker"
          >
            Browse
          </button>
        </div>
      </main>
    </div>
  );
}
