'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BrandButton, CategoryCardButton, TagRemoveButton } from '@/components/buttons';
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
        <aside className="w-full max-w-lg flex flex-col gap-6">
          <h1 className="font-dm text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Choose your entertainment category
          </h1>

          <div className="flex flex-wrap gap-3 min-h-[40px]">
            {selected.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 text-base font-medium text-white"
              >
                {tag}
                <TagRemoveButton
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove ${tag}`}
                >
                  &times;
                </TagRemoveButton>
              </span>
            ))}
          </div>

          {showError && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertTriangle size={16} />
              <span>Minimum 3 category required</span>
            </div>
          )}
        </aside>

        <section className="w-full max-w-3xl flex flex-col items-end gap-8">
          <div className="grid w-full grid-cols-2 sm:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => {
              const isSelected = selected.includes(cat.name);
              return (
                <CategoryCardButton
                  key={cat.name}
                  onClick={() => toggle(cat.name)}
                  colorClass={cat.colorClass}
                  image={cat.image}
                  isSelected={isSelected}
                  name={cat.name}
                />
              );
            })}
          </div>

          <BrandButton
            onClick={handleNext}
            className="px-9 py-3 font-dm text-lg"
          >
            Next Page
          </BrandButton>
        </section>
      </div>
    </div>
  );
}
