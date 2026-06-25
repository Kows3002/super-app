'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { setNotes, useAppDispatch, useAppSelector } from '@/lib/store';
import { Cloud, Wind, Gauge, Droplets, ChevronUp, ChevronDown } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';

// ----- Weather -----
interface WeatherData {
  temp: number;
  description: string;
  wind: string;
  pressure: number;
  humidity: number;
  icon: string;
}

// ----- News -----
interface NewsItem {
  title: string;
  description: string;
  publishedAt: string;
  urlToImage: string | null;
  url: string;
}

// ----- Timer -----
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

  // redirect if not registered
  useEffect(() => {
    if (!user) router.replace('/register');
    else if (selectedCategories.length === 0) router.replace('/categories');
  }, [user, selectedCategories, router]);

  // ----- Date/Time -----
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // ----- Weather -----
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

  // ----- News -----
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

  // ----- Timer / Countdown -----
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s > 0) return s - 1;
          setMinutes((m) => {
            if (m > 0) { setSeconds(59); return m - 1; }
            setHours((h) => {
              if (h > 0) { setMinutes(59); setSeconds(59); return h - 1; }
              setRunning(false);
              return 0;
            });
            return m;
          });
          return s;
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

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const initialSeconds = 5 * 3600 + 8 * 60 + 56;
  const progress = initialSeconds > 0 ? (totalSeconds / initialSeconds) : 0;

  // ----- Notes -----
  const [localNotes, setLocalNotes] = useState(notes);
  const [showNotes, setShowNotes] = useState(false);

  function saveNotes() {
    dispatch(setNotes(localNotes));
    setShowNotes(false);
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-6 py-4 md:px-10 flex items-center justify-between border-b border-white/10">
        <span className="font-display text-3xl text-brand">Super app</span>
        <button
          onClick={() => router.push('/entertainment')}
          className="rounded-full bg-brand-dark px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-darker"
        >
          Browse Entertainment
        </button>
      </div>

      <div className="px-4 md:px-8 lg:px-12 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          {/* Profile Card */}
          <div className="relative overflow-hidden rounded-2xl bg-profile-card">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
                  <Image
                    src="https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=200"
                    alt="avatar"
                    width={80}
                    height={80}
                    priority
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user.name}</p>
                  <p className="text-white/70 text-xs">{user.email}</p>
                  <p className="text-white text-2xl font-bold mt-1">{user.username}</p>
                </div>
              </div>
              {/* Category badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCategories.map((cat) => (
                  <span key={cat} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Date/Weather Card */}
          <div className="rounded-2xl border border-white/10 bg-surface-elevated p-4">
            {/* Date & Time row */}
            <div className="mb-4 flex items-center justify-between rounded-xl bg-accentPink px-4 py-2">
              <span className="text-white font-bold text-sm">{dateStr}</span>
              <span className="text-white font-bold text-sm">{timeStr}</span>
            </div>

            {/* Weather */}
            {weatherLoading ? (
              <WeatherSkeleton />
            ) : weather && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Cloud size={32} className="text-blue-300" />
                  <div>
                    <p className="text-3xl font-bold text-white">{weather.temp}&deg;C</p>
                    <p className="text-white/60 text-xs capitalize">{weather.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-white/70">
                  <div className="flex flex-col items-center gap-1">
                    <Wind size={14} />
                    <span>{weather.wind}</span>
                    <span className="text-white/40">Wind</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Gauge size={14} />
                    <span>{weather.pressure}</span>
                    <span className="text-white/40">mbar Pressure</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Droplets size={14} />
                    <span>{weather.humidity}%</span>
                    <span className="text-white/40">Humidity</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="rounded-2xl border border-white/10 bg-surface p-4">
            {/* Circular progress */}
            <div className="flex justify-center mb-4">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" strokeWidth="8" className="stroke-white/20" />
                  <circle
                    cx="50" cy="50" r="44" fill="none"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 44}`}
                    strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
                    strokeLinecap="round"
                    className="stroke-accentPink transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-base">
                    {pad(hours)}:{pad(minutes)}:{pad(seconds)}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mb-4">
              {[
                { label: 'Hours', val: hours, field: 'h' as const },
                { label: 'Minutes', val: minutes, field: 'm' as const },
                { label: 'Seconds', val: seconds, field: 's' as const },
              ].map(({ label, val, field }) => (
                <div key={field} className="flex flex-col items-center gap-1">
                  <span className="text-white/40 text-xs">{label}</span>
                  <button onClick={() => adjustTime(field, 1)} className="text-white/60 hover:text-white transition-colors">
                    <ChevronUp size={14} />
                  </button>
                  <span className="text-white font-bold text-lg w-8 text-center">{pad(val)}</span>
                  <button onClick={() => adjustTime(field, -1)} className="text-white/60 hover:text-white transition-colors">
                    <ChevronDown size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setRunning((r) => !r)}
                className="rounded-full bg-accentPink px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accentPink-hover"
              >
                {running ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={() => { setRunning(false); setHours(5); setMinutes(8); setSeconds(56); }}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column: News */}
        <div className="flex flex-col gap-4">
          {newsLoading ? (
            <NewsSkeleton />
          ) : currentNews && (
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface">
              {/* Image */}
              {currentNews.urlToImage && (
                <div className="relative h-48 overflow-hidden shrink-0">
                  <Image
                    src={currentNews.urlToImage}
                    alt={currentNews.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}
              <div className="p-4 flex-1 overflow-y-auto">
                <h2 className="text-white font-bold text-lg mb-1 leading-tight">{currentNews.title}</h2>
                <p className="text-white/40 text-xs mb-3">{currentNews.publishedAt}</p>
                <p className="text-white/70 text-sm leading-relaxed line-clamp-6">{currentNews.description}</p>
              </div>
              {/* Dots indicator */}
              <div className="flex justify-center gap-1.5 p-3">
                {newsFeed.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setNewsIndex(i)}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${i === newsIndex ? 'bg-brand' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Notes */}
        <div className="flex flex-col gap-4">
          <div className="flex min-h-[300px] flex-col rounded-2xl bg-note p-5 text-black">
            <h3 className="font-bold text-lg mb-3">All notes</h3>
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Start typing your notes here..."
              className="flex-1 bg-transparent text-black placeholder-black/40 text-sm leading-relaxed resize-none outline-none min-h-[200px]"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={saveNotes}
                className="bg-black text-white text-xs px-4 py-2 rounded-full hover:bg-black/80 transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>

          {/* Saved notes preview */}
          {notes && (
            <div className="rounded-2xl bg-note/80 p-5 text-black">
              <h3 className="font-bold text-sm mb-2">Saved Note</h3>
              <p className="text-xs leading-relaxed line-clamp-6">{notes}</p>
            </div>
          )}

          {/* Browse button */}
          <button
            onClick={() => router.push('/entertainment')}
            className="rounded-2xl bg-brand-dark py-3 font-medium text-white transition-colors hover:bg-brand-darker"
          >
            Browse Entertainment
          </button>
        </div>
      </div>
    </div>
  );
}
