import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import Image from "next/image"
import MediaActions from "@/components/media/MediaActions"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

interface PageParams {
  params: Promise<{
    mediaType: "movie" | "tv"
    id: string
  }>
}

async function getMediaDetails(mediaType: "movie" | "tv", id: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`
    )
    if (!res.ok) throw new Error("Falha ao buscar detalhes da mídia.")
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

const getImageUrl = (path: string, size: "w500" | "original" = "w500") => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : ""
}

export default async function MediaDetailPage({ params }: PageParams) {
  const awaitedParams = await params
  const { mediaType, id } = awaitedParams

  const details = await getMediaDetails(mediaType, id)
  const session = await getServerSession(authOptions)

  if (!details) {
    return (
      <div className="container mx-auto text-center">
        <h1 className="text-2xl">Mídia não encontrada.</h1>
      </div>
    )
  }

  const title = details.title || details.name
  const overview = details.overview
  const posterPath = details.poster_path
  const posterUrl = getImageUrl(posterPath, "w500")
  const backdropUrl = getImageUrl(details.backdrop_path, "original")
  const releaseDate = details.release_date || details.first_air_date
  const score = Math.round(details.vote_average * 10)

  return (
    <div className="container mx-auto">
      <div className="relative w-full h-[30vh] md:h-[50vh] mb-8">
        <Image
          src={backdropUrl}
          alt={`${title} backdrop`}
          fill
          className="object-cover object-top opacity-30"
          priority
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-4 md:px-0 -mt-24 md:-mt-48 relative z-10">
        <div className="w-48 md:w-72 shrink-0">
          <Image
            src={posterUrl}
            alt={title}
            width={500}
            height={750}
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="grow">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
          <p className="text-lg text-gray-300 mb-4">
            {new Date(releaseDate).getFullYear()}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{score}%</span>
            </div>
            <span className="font-semibold">Nota dos Usuários</span>
          </div>

          {session && (
            <MediaActions
              mediaId={details.id}
              mediaType={mediaType}
              title={title}
              posterUrl={posterPath}
            />
          )}

          <h2 className="text-2xl font-semibold mb-2 mt-8">Sinopse</h2>
          <p className="text-gray-200 leading-relaxed">{overview}</p>
        </div>
      </div>
    </div>
  )
}