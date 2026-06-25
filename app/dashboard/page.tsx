'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  BrandButton,
  DarkButton,
  DotButton,
  IconControlButton,
  SecondaryButton,
} from '@/components/buttons';
import { setNotes, useAppDispatch, useAppSelector } from '@/lib/store';
import { Cloud, Wind, Droplets, ChevronUp, ChevronDown } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';

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

function WeatherSkeleton() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <Skeleton circle width={44} height={44} />
        <div className="flex-1">
          <Skeleton width={82} height={34} />
          <Skeleton width={120} height={14} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex flex-col items-center gap-2">
            <Skeleton circle width={18} height={18} />
            <Skeleton width={44} height={12} />
            <Skeleton width={68} height={10} />
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface">
      <Skeleton height={190} borderRadius={0} />
      <div className="flex-1 overflow-hidden p-4">
        <Skeleton width="85%" height={26} />
        <Skeleton width="42%" height={12} className="mt-2" />
        <Skeleton count={5} className="mt-3" />
      </div>
      <div className="flex justify-center gap-1.5 p-3">
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} circle width={6} height={6} />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, selectedCategories, notes } = useAppSelector((state) => state.app);

  useEffect(() => {
    if (!user) router.replace('/register');
    else if (selectedCategories.length === 0) router.replace('/categories');
  }, [user, selectedCategories, router]);

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather', { signal: controller.signal });
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        setWeather(data);
      } catch {
        if (controller.signal.aborted) return;
        setWeather({
          temp: 24,
          description: 'Heavy rain',
          wind: '3.7 km/h',
          pressure: 1010,
          humidity: 83,
          icon: '10d',
        });
      } finally {
        if (!controller.signal.aborted) setWeatherLoading(false);
      }
    }
    fetchWeather();
    return () => controller.abort();
  }, []);

  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const [newsIndex, setNewsIndex] = useState(0);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchNews() {
      try {
        const res = await fetch('/api/news', { signal: controller.signal });
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        if (data?.length) {
          setNewsFeed(prepareNewsFeed(data));
          setNewsIndex(0);
        } else throw new Error('no articles');
      } catch {
        if (controller.signal.aborted) return;
        setNewsFeed(prepareNewsFeed([
          {
            title: 'Want to climb Mount Everest?',
            description: 'In the years since human beings first reached the summit of Mount Everest in 1953, climbing the world\'s highest mountain has changed dramatically...',
            publishedAt: '2-20-2023 07:35 PM',
            urlToImage: 'https://images.pexels.com/photos/2098428/pexels-photo-2098428.jpeg?auto=compress&cs=tinysrgb&w=600',
            url: '#',
          },
          {
            title: 'AI Revolution in 2024',
            description: 'Artificial intelligence continues to reshape industries, from healthcare to entertainment, pushing the boundaries of what\'s possible...',
            publishedAt: '2-21-2023 09:00 AM',
            urlToImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
            url: '#',
          },
          {
            title: 'Space Exploration Milestones',
            description: 'NASA announces new missions to the moon and Mars, marking a new era of human space exploration that promises to redefine our understanding...',
            publishedAt: '2-22-2023 11:30 AM',
            urlToImage: 'https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-41162.jpeg?auto=compress&cs=tinysrgb&w=600',
            url: '#',
          },
        ]));
        setNewsIndex(0);
      } finally {
        if (!controller.signal.aborted) setNewsLoading(false);
      }
    }
    fetchNews();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (newsFeed.length < 2) return;
    const t = setInterval(() => {
      setNewsIndex((currentIndex) => {
        const currentNewsKey = getNewsKey(newsFeed[currentIndex]);

        for (let offset = 1; offset < newsFeed.length; offset += 1) {
          const nextIndex = (currentIndex + offset) % newsFeed.length;
          if (getNewsKey(newsFeed[nextIndex]) !== currentNewsKey) return nextIndex;
        }

        return currentIndex;
      });
    }, 2000);
    return () => clearInterval(t);
  }, [newsFeed]);

  const currentNews = newsFeed[newsIndex] || null;

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

  const [localNotes, setLocalNotes] = useState(notes);

  function saveNotes() {
    dispatch(setNotes(localNotes));
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black p-5 text-white md:p-10">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[286px_266px_262px] lg:items-start">
        <section className="space-y-5">
          <div className="rounded-lg bg-[#5746ea] p-4">
            <div className="flex gap-5">
              <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-[32px] border-2 border-white shadow-lg">
                <Image
                  src="https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="avatar"
                  fill
                  priority
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 pt-3">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-white/85">{user.email}</p>
                <p className="mt-1 truncate text-2xl font-bold">{user.username}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {selectedCategories.slice(0, 4).map((cat) => (
                    <span key={cat} className="rounded-full bg-[#9f94ff] px-4 py-1 text-center text-xs text-white">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-[#101744]">
            <div className="flex items-center justify-between bg-[#ff40d1] px-5 py-2 text-2xl font-bold">
              <span>{dateStr}</span>
              <span>{timeStr}</span>
            </div>
            <div className="p-4">
              {weatherLoading ? (
                <WeatherSkeleton />
              ) : weather && (
                <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr] items-center gap-4">
                  <div className="text-center">
                    <Cloud size={46} className="mx-auto text-white" />
                    <p className="mt-1 text-sm capitalize">{weather.description}</p>
                  </div>
                  <div className="h-16 bg-white/40" />
                  <div className="text-center">
                    <p className="text-4xl font-light">{weather.temp}&deg;C</p>
                    <p className="mt-2 text-xs">{weather.pressure} mbar<br />Pressure</p>
                  </div>
                  <div className="h-16 bg-white/40" />
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Wind size={18} />
                      <span>{weather.wind}<br />Wind</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets size={18} />
                      <span>{weather.humidity}%<br />Humidity</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="flex min-h-[302px] flex-col rounded-lg bg-[#f2c94c] p-7 text-black">
          <h2 className="text-2xl font-bold">All notes</h2>
          <textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            placeholder="This is how I am going to learn MERN Stack in next 3 months."
            className="mt-6 min-h-[180px] flex-1 resize-none bg-transparent text-sm leading-relaxed text-black outline-none placeholder:text-black"
          />
          <div className="mt-4 flex justify-end">
            <DarkButton onClick={saveNotes}>Save Notes</DarkButton>
          </div>
        </section>

        <section className="row-span-2 flex min-h-[510px] flex-col overflow-hidden rounded-lg bg-white text-black">
          {newsLoading ? (
            <NewsSkeleton />
          ) : currentNews && (
            <>
              {currentNews.urlToImage && (
                <div className="relative h-56 shrink-0">
                  <Image
                    src={currentNews.urlToImage}
                    alt={currentNews.title}
                    fill
                    sizes="262px"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-4 text-white">
                    <h2 className="text-lg font-bold leading-tight">{currentNews.title}</h2>
                    <p className="mt-1 text-xs">{currentNews.publishedAt}</p>
                  </div>
                </div>
              )}
              <div className="flex-1 p-6 text-justify text-xs leading-6 text-black">
                {currentNews.description}
              </div>
              <div className="flex justify-center gap-1.5 p-3">
                {newsFeed.map((_, i) => (
                  <DotButton key={i} onClick={() => setNewsIndex(i)} active={i === newsIndex} />
                ))}
              </div>
            </>
          )}
        </section>

        <section className="rounded-lg border-2 border-sky-500 bg-[#1b2148] p-4 lg:col-span-2">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[190px_1fr]">
            <div className="relative mx-auto h-36 w-36">
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
                  className="stroke-[#ff6b6b] transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                {pad(hours)}:{pad(minutes)}:{pad(seconds)}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Hours', val: hours, field: 'h' as const },
                  { label: 'Minutes', val: minutes, field: 'm' as const },
                  { label: 'Seconds', val: seconds, field: 's' as const },
                ].map(({ label, val, field }) => (
                  <div key={field} className="flex flex-col items-center gap-2">
                    <span className="text-sm text-white/45">{label}</span>
                    <IconControlButton onClick={() => adjustTime(field, 1)}>
                      <ChevronUp size={24} fill="currentColor" />
                    </IconControlButton>
                    <span className="w-16 text-3xl font-light">{pad(val)}</span>
                    <IconControlButton onClick={() => adjustTime(field, -1)}>
                      <ChevronDown size={24} fill="currentColor" />
                    </IconControlButton>
                  </div>
                ))}
              </div>
              <BrandButton
                onClick={() => setRunning((r) => !r)}
                className="mt-4 w-full bg-[#ff6b6b] py-2 text-lg hover:bg-[#ff5b5b]"
              >
                {running ? 'Pause' : 'Start'}
              </BrandButton>
              <SecondaryButton
                onClick={() => { setRunning(false); setHours(0); setMinutes(0); setSeconds(0); }}
                className="mt-3 w-full"
              >
                Reset
              </SecondaryButton>
            </div>
          </div>
        </section>

        <div className="flex justify-end lg:col-start-3">
          <BrandButton onClick={() => router.push('/entertainment')} className="px-8">
            Browse
          </BrandButton>
        </div>
      </div>
    </div>
  );
}
