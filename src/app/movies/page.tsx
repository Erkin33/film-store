// app/movies/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch('/api/movies');
        if (!res.ok) throw new Error('Ошибка загрузки фильмов');
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  if (loading) return <div>Загрузка фильмов...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Список фильмов</h1>
      {movies.length === 0 ? (
        <p>Фильмов нет.</p>
      ) : (
        <ul className="space-y-4">
          {movies.map((movie) => (
            <li key={movie.id} className="p-4 border rounded">
              <h2 className="text-xl">{movie.title} ({movie.year})</h2>
              <p className="text-gray-600">{movie.genre}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
