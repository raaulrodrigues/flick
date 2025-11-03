import Image from "next/image"
import Link from "next/link"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

interface Movie {
  id: number
  title: string
  poster_path: string
}

async function getPopularMovies() {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) {
      throw new Error("Falha ao buscar filmes populares")
    }

    const data = await res.json()
    return data.results as Movie[]
  } catch (error) {
    console.error(error)
    return []
  }
}

const getImageUrl = (posterPath: string) => {
  return posterPath
    ? `https://image.tmdb.org/t/p/w300${posterPath}` 
    : "/placeholder-image.png"
}

export default async function HomePage() {

  const popularMovies = await getPopularMovies()

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 border-l-4 border-blue-500 pl-3">
        Filmes Populares
      </h1>

      {}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {popularMovies.map((movie) => (
          <Link
            href={`/media/movie/${movie.id}`}
            key={movie.id}
            className="group"
          >
            <div className="relative overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
              <Image
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-md object-cover w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h3 className="text-sm mt-2 truncate group-hover:text-blue-400">
              {movie.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  )
}