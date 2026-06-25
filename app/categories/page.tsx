'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { setSelectedCategories, useAppDispatch, useAppSelector } from '@/lib/store';
import { AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  { name: 'Action', colorClass: 'bg-category-action', image: '/images/categories/action.png' },
  { name: 'Drama', colorClass: 'bg-category-drama', image: '/images/categories/drama.png' },
  { name: 'Romance', colorClass: 'bg-category-romance', image: '/images/categories/romance.png' },
  { name: 'Thriller', colorClass: 'bg-category-thriller', image: '/images/categories/thriller.png' },
  { name: 'Western', colorClass: 'bg-category-western', image: '/images/categories/western.png' },
  { name: 'Horror', colorClass: 'bg-category-horror', image: '/images/categories/horror.png' },
  { name: 'Fantasy', colorClass: 'bg-category-fantasy', image: '/images/categories/fantasy.png' },
  { name: 'Music', colorClass: 'bg-category-music', image: '/images/categories/music.png' },
  { name: 'Fiction', colorClass: 'bg-category-fiction', image: '/images/categories/fiction.png' },
];
export default function CategoriesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, selectedCategories } = useAppSelector((state) => state.app);
  const [selected, setSelected] = useState<string[]>(selectedCategories);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!user) router.replace('/register');
  }, [user, router]);

  function toggle(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
    setShowError(false);
  }

  function removeTag(name: string) {
    setSelected((prev) => prev.filter((c) => c !== name));
  }

  function handleNext() {
    if (selected.length < 3) {
      setShowError(true);
      return;
    }
    dispatch(setSelectedCategories(selected));
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen w-full bg-black px-6 py-8 md:px-10 lg:px-16 xl:px-20">
      <p className="mb-8 font-display text-4xl text-brand sm:text-5xl lg:mb-10 lg:text-6xl">
        Super app
      </p>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-16">
        {/* Left */}
        <aside className="w-full max-w-lg flex flex-col gap-6">
          <h1 className="font-dm text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Choose your entertainment category
          </h1>

          {/* Selected tags */}
          <div className="flex flex-wrap gap-3 min-h-[40px]">
            {selected.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 text-base font-medium text-white"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-lg font-bold leading-none text-brand-deepest transition-colors hover:text-white"
                  aria-label={`Remove ${tag}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {/* Error */}
          {showError && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertTriangle size={16} />
              <span>Minimum 3 category required</span>
            </div>
          )}
        </aside>

        {/* Right: grid */}
        <section className="w-full max-w-3xl flex flex-col items-end gap-8">
          <div className="grid w-full grid-cols-2 sm:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => {
              const isSelected = selected.includes(cat.name);
              return (
                <button
                  key={cat.name}
                  onClick={() => toggle(cat.name)}
                  aria-pressed={isSelected}
                  className="text-left group"
                >
                  <div
                    className={`w-full overflow-hidden rounded-[20px] transition-all duration-200 ${cat.colorClass} ${isSelected ? 'ring-[5px] ring-brand-ring' : 'ring-0'
                      }`}
                  >
                    <div className="p-4 pb-3">
                      <p className="mb-3 font-dm text-2xl font-medium text-white">{cat.name}</p>
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={220}
                        height={112}
                        sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
                        className="w-full h-28 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="rounded-full bg-brand-dark px-9 py-3 font-dm text-lg font-medium text-white transition-colors hover:bg-brand-darker"
          >
            Next Page
          </button>
        </section>
      </div>
    </div>
  );
}
