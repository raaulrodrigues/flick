import MediaScroller from "@/components/home/MediaScroller"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

interface Movie {
  id: number
  title: string
  poster_path: string
  media_type: "movie"
}

interface TVShow {
  id: number
  name: string
  poster_path: string
  media_type: "tv"
}

type Media = (Movie | TVShow) & { title: string }

async function fetchMedia(endpoint: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`,
      {
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) throw new Error("Falha ao buscar dados do TMDB")
    const data = await res.json()

    return data.results.map((item: Movie | TVShow) => ({
      ...item,
      title: (item as Movie).title || (item as TVShow).name,
      media_type: (item as Movie).title ? "movie" : "tv",
    })) as Media[]
  } catch (error) {
    console.error(error)
    return []
  }
}

export default async function HomePage() {
  const popularMovies = await fetchMedia("movie/popular")
  const trendingMedia = await fetchMedia("trending/all/week")
  const upcomingMovies = await fetchMedia("movie/upcoming")

  return (
    <div className="container mx-auto">
      <MediaScroller title="Populares" items={popularMovies} />
      <MediaScroller title="Em Alta" items={trendingMedia} />
      <MediaScroller title="Próximas Estreias" items={upcomingMovies} />
    </div>
  )
}