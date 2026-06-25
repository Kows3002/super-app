'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector } from '@/lib/store';
import { X, Star, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

interface MovieDetail {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
  Genre: string;
  Director: string;
  Actors: string;
  imdbRating: string;
  Runtime: string;
  Released: string;
}

const CATEGORY_SEARCH_TERMS: Record<string, string> = {
  Action: 'action hero',
  Drama: 'drama life',
  Romance: 'love romance',
  Thriller: 'thriller suspense',
  Western: 'western cowboy',
  Horror: 'horror scary',
  Fantasy: 'fantasy magic',
  Music: 'music band',
  Fiction: 'science fiction',
};

const FALLBACK_MOVIES: Record<string, Movie[]> = {
  Action: [
    { imdbID: 'tt1375666', Title: 'Inception', Year: '2010', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0468569', Title: 'The Dark Knight', Year: '2008', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt4154796', Title: 'Avengers: Endgame', Year: '2019', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt6320628', Title: 'Spider-Man: Far From Home', Year: '2019', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
  ],
  Drama: [
    { imdbID: 'tt0111161', Title: 'The Shawshank Redemption', Year: '1994', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0068646', Title: 'The Godfather', Year: '1972', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0108052', Title: "Schindler's List", Year: '1993', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0167260', Title: 'The Lord of the Rings', Year: '2003', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
  ],
  Thriller: [
    { imdbID: 'tt0110912', Title: 'Pulp Fiction', Year: '1994', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0137523', Title: 'Fight Club', Year: '1999', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0816692', Title: 'Interstellar', Year: '2014', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt1345836', Title: 'The Dark Knight Rises', Year: '2012', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
  ],
  Romance: [
    { imdbID: 'tt0109830', Title: 'Forrest Gump', Year: '1994', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0120338', Title: 'Titanic', Year: '1997', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0317248', Title: 'City of God', Year: '2002', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0245429', Title: 'Spirited Away', Year: '2001', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
  ],

  Horror: [
    { imdbID: 'tt1462297', Title: 'The Conjuring', Year: '2013', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0050083', Title: '12 Angry Men', Year: '1957', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0120689', Title: 'The Green Mile', Year: '1999', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0027977', Title: 'Modern Times', Year: '1936', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
  ],

  Western: [
    { imdbID: 'tt0114369', Title: 'Se7en', Year: '1995', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0114814', Title: 'The Usual Suspects', Year: '1995', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0482571', Title: 'The Prestige', Year: '2006', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0407887', Title: 'The Departed', Year: '2006', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
  ],

  Fantasy: [
    { imdbID: 'tt0118715', Title: 'The Big Lebowski', Year: '1998', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0172495', Title: 'Gladiator', Year: '2000', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0180093', Title: 'Requiem for a Dream', Year: '2000', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0209144', Title: 'Memento', Year: '2000', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
  ],

  Music: [
    { imdbID: 'tt0338013', Title: 'Eternal Sunshine', Year: '2004', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0361748', Title: 'Inglourious Basterds', Year: '2009', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0405094', Title: 'The Lives of Others', Year: '2006', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0986264', Title: 'Into the Wild', Year: '2007', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
  ],

  Fiction: [
    { imdbID: 'tt0816692', Title: 'Interstellar', Year: '2014', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt1375666', Title: 'Inception', Year: '2010', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt0133093', Title: 'The Matrix', Year: '1999', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
    { imdbID: 'tt5311514', Title: 'Your Name', Year: '2016', Poster: '/images/entertainment/actionent.png', Type: 'movie' },
  ],
};

function MovieGridSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      {[0, 1, 2].map((section) => (
        <section key={section}>
          <Skeleton width={120} height={18} className="mb-4" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[0, 1, 2, 3].map((card) => (
              <div key={card} className="aspect-video">
                <Skeleton height="100%" borderRadius={8} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function MoviePoster({
  alt,
  className,
  fill = false,
  sizes,
  src,
}: {
  alt: string;
  className: string;
  fill?: boolean;
  sizes?: string;
  src: string;
}) {
  const fallbackSrc =
    'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300';
  const [imageSrc, setImageSrc] = useState(src !== 'N/A' ? src : fallbackSrc);

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        onError={() => setImageSrc(fallbackSrc)}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={300}
      height={450}
      sizes={sizes}
      className={className}
      onError={() => setImageSrc(fallbackSrc)}
    />
  );
}

export default function EntertainmentPage() {
  const router = useRouter();
  const { user, selectedCategories } = useAppSelector((state) => state.app);

  const [moviesByCategory, setMoviesByCategory] = useState<Record<string, Movie[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (!user) router.replace('/register');
  }, [user, router]);

  const fetchMovies = useCallback(async (signal: AbortSignal) => {
    const results: Record<string, Movie[]> = {};

    for (const cat of selectedCategories) {
      const searchTerm = CATEGORY_SEARCH_TERMS[cat] || cat;
      try {
        const res = await fetch(
          `/api/movies?search=${encodeURIComponent(searchTerm)}`,
          { signal }
        );
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        if (data.Search?.length) {
          results[cat] = data.Search.slice(0, 4);
        } else throw new Error('no results');
      } catch {
        if (signal.aborted) return;
        results[cat] = FALLBACK_MOVIES[cat] || [];
      }
    }
    if (signal.aborted) return;
    setMoviesByCategory(results);
    setLoading(false);
  }, [selectedCategories]);

  useEffect(() => {
    if (selectedCategories.length === 0) return;
    const controller = new AbortController();
    fetchMovies(controller.signal);
    return () => controller.abort();
  }, [fetchMovies, selectedCategories]);

  async function openModal(movie: Movie) {
    setModalLoading(true);
    setSelectedMovie({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Plot: '',
      Genre: '',
      Director: '',
      Actors: '',
      imdbRating: 'N/A',
      Runtime: 'N/A',
      Released: 'N/A',
    });
    try {
      const res = await fetch(`/api/movies?id=${encodeURIComponent(movie.imdbID)}`);
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      if (data.Response === 'True') {
        setSelectedMovie(data);
      } else {
        setSelectedMovie({
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster,
          Plot: 'An exciting film worth watching.',
          Genre: 'Various',
          Director: 'Unknown',
          Actors: 'Various',
          imdbRating: '7.5',
          Runtime: '120 min',
          Released: movie.Year,
        });
      }
    } catch {
      setSelectedMovie((prev) => prev ? { ...prev, Plot: 'An exciting film worth watching.' } : null);
    } finally {
      setModalLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-6 py-4 md:px-10 flex items-center justify-between border-b border-white/10 sticky top-0 bg-black/90 backdrop-blur-sm z-40">
        <span className="font-display text-3xl text-brand">Super app</span>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
            <Image
              src="https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=80"
              alt="avatar"
              width={32}
              height={32}
              priority
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 py-8">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <h1 className="text-white text-2xl font-bold mb-8">Entertainment according to your choice</h1>

        {loading ? (
          <MovieGridSkeleton />
        ) : (
          <div className="flex flex-col gap-10">
            {selectedCategories.map((cat) => (
              <section key={cat}>
                <h2 className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">{cat}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  {(moviesByCategory[cat] || []).map((movie) => (
                    <button
                      key={movie.imdbID}
                      onClick={() => openModal(movie)}
                      className="group relative overflow-hidden rounded-lg aspect-[16/9] bg-white/5 hover:scale-105 transition-all duration-300"
                    >
                      <MoviePoster
                        src={movie.Poster}
                        alt={movie.Title}
                        fill
                        sizes="(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <p className="text-white font-bold text-sm">
                          {movie.Title}
                        </p>
                        <p className="text-white/70 text-xs">
                          {movie.Year}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedMovie && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col sm:flex-row gap-0">
              {/* Poster */}
              <div className="sm:w-56 shrink-0">
                <MoviePoster
                  src={selectedMovie.Poster}
                  alt={selectedMovie.Title}
                  className="w-full sm:h-full object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none max-h-64 sm:max-h-none"
                />
              </div>
              {/* Details */}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <h2 className="text-white font-bold text-2xl leading-tight">{selectedMovie.Title}</h2>

                <div className="flex flex-wrap gap-2">
                  {selectedMovie.Genre && selectedMovie.Genre !== 'N/A' &&
                    selectedMovie.Genre.split(', ').map((g) => (
                      <span key={g} className="bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded-full">{g}</span>
                    ))
                  }
                </div>

                <div className="flex items-center gap-4 text-sm">
                  {selectedMovie.imdbRating !== 'N/A' && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={14} fill="currentColor" />
                      <span className="font-bold">{selectedMovie.imdbRating}</span>
                    </div>
                  )}
                  {selectedMovie.Runtime !== 'N/A' && (
                    <div className="flex items-center gap-1 text-white/60">
                      <Clock size={14} />
                      <span>{selectedMovie.Runtime}</span>
                    </div>
                  )}
                  {selectedMovie.Released !== 'N/A' && (
                    <div className="flex items-center gap-1 text-white/60">
                      <Calendar size={14} />
                      <span>{selectedMovie.Year}</span>
                    </div>
                  )}
                </div>

                {modalLoading ? (
                  <div className="text-sm leading-relaxed">
                    <Skeleton count={3} />
                  </div>
                ) : selectedMovie.Plot && selectedMovie.Plot !== 'N/A' && (
                  <p className="text-white/70 text-sm leading-relaxed">
                    {selectedMovie.Plot}
                  </p>
                )}

                {selectedMovie.Director && selectedMovie.Director !== 'N/A' && (
                  <div>
                    <span className="text-white/40 text-xs">Director</span>
                    <p className="text-white text-sm">{selectedMovie.Director}</p>
                  </div>
                )}

                {selectedMovie.Actors && selectedMovie.Actors !== 'N/A' && (
                  <div>
                    <span className="text-white/40 text-xs">Cast</span>
                    <p className="text-white text-sm">{selectedMovie.Actors}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
