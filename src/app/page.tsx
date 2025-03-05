// app/page.tsx
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  coverUrl: string;
  description: string;
  genre: string;
}

export default async function HomePage() {
  // Получаем данные с API. Для локальной разработки используется NEXTAUTH_URL или http://localhost:3000.
  const res = await fetch(
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/movies`,
    { cache: 'no-store' }
  );
  const movies: Movie[] = await res.json();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Шапка */}
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">ANIMEONE</h1>
          <nav className="space-x-4 hidden sm:block">
            <a href="#" className="hover:text-gray-300">Топ 100</a>
            <a href="#" className="hover:text-gray-300">Новости</a>
            <a href="#" className="hover:text-gray-300">Сериалы</a>
            <a href="#" className="hover:text-gray-300">Фильмы</a>
            <a href="#" className="hover:text-gray-300">Многосерийные</a>
            <a href="#" className="hover:text-gray-300">Закладки</a>
          </nav>
        </div>
      </header>

      {/* Основной блок */}
      <div className="container mx-auto px-4 py-6 flex">
        {/* Левая колонка (жанры, фильтры) */}
        <aside className="hidden lg:block w-64 mr-6">
          <div className="bg-white rounded shadow p-4 mb-4">
            <h2 className="text-lg font-bold mb-2">Жанры</h2>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Приключения
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Экшен
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Комедия
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Драма
                </a>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-bold mb-2">Годы</h2>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  2023
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  2022
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  2021
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Центральная часть (карточки аниме) */}
        <main className="flex-1">
          {/* Заголовок или слайдер */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Смотреть аниме онлайн</h2>
            <p className="text-gray-600">
              Здесь можно добавить описание или баннер
            </p>
          </div>

          {/* Сетка карточек */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <div key={movie.id} className="bg-white rounded shadow overflow-hidden">
                {/* Обложка аниме */}
                <div className="relative w-full h-48">
                  {movie.coverUrl && movie.coverUrl.trim() !== '' ? (
                    <Image
                      src={movie.coverUrl}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold truncate">{movie.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {movie.description}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">{movie.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
