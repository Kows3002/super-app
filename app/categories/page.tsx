'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  { name: 'Action', color: '#ff5108', image: '/images/categories/action.png' },
  { name: 'Drama', color: '#d6a4ff', image: '/images/categories/drama.png' },
  { name: 'Romance', color: '#148a08', image: '/images/categories/romance.png' },
  { name: 'Thriller', color: '#84c1ff', image: '/images/categories/thriller.png' },
  { name: 'Western', color: '#902400', image: '/images/categories/western.png' },
  { name: 'Horror', color: '#7358ff', image: '/images/categories/horror.png' },
  { name: 'Fantasy', color: '#ff49dd', image: '/images/categories/fantasy.png' },
  { name: 'Music', color: '#e61e32', image: '/images/categories/music.png' },
  { name: 'Fiction', color: '#6bd061', image: '/images/categories/fiction.png' },
];
export default function CategoriesPage() {
  const router = useRouter();
  const { user, selectedCategories, setSelectedCategories } = useAppStore();
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
    setSelectedCategories(selected);
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen w-full bg-black px-6 py-8 md:px-10 lg:px-16 xl:px-20">
      <p className="font-single-day text-4xl sm:text-5xl lg:text-6xl text-[#72db73] mb-8 lg:mb-10">
        Super app
      </p>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-16">
        {/* Left */}
        <aside className="w-full max-w-lg flex flex-col gap-6">
          <h1 className="font-dm-sans text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
            Choose your entertainment category
          </h1>

          {/* Selected tags */}
          <div className="flex flex-wrap gap-3 min-h-[40px]">
            {selected.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 bg-[#148a08] text-white rounded-full px-4 py-2 text-base font-medium"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-[#085b00] font-bold hover:text-white transition-colors text-lg leading-none"
                  aria-label={`Remove ${tag}`}
                >
                  ×
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
                    className={`w-full rounded-[20px] overflow-hidden transition-all duration-200 ${isSelected ? 'ring-[5px] ring-[#10b800]' : 'ring-0'
                      }`}
                    style={{ backgroundColor: cat.color }}
                  >
                    <div className="p-4 pb-3">
                      <p className="font-dm-sans text-2xl font-medium text-white mb-3">{cat.name}</p>
                      <img
                        src={cat.image}
                        alt={cat.name}
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
            className="bg-[#148a08] hover:bg-[#0f6e06] text-white font-dm-sans font-medium text-lg px-9 py-3 rounded-full transition-colors"
          >
            Next Page
          </button>
        </section>
      </div>
    </div>
  );
}
