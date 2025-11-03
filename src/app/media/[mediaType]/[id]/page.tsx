import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import Image from "next/image"
import MediaActions from "@/components/media/MediaActions"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const TMDB_API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

interface PageParams {
  params: Promise<{
    mediaType: "movie" | "tv"
    id: string
  }>
}

interface CrewMember {
  name: string
  job: string
}

interface CastMember {
  name: string
  character: string
  profile_path: string | null
}

async function getMediaDetails(mediaType: "movie" | "tv", id: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=pt-BR&append_to_response=credits`
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
      <div className="container mx-auto text-center py-10">
        <h1 className="text-2xl text-white">Mídia não encontrada.</h1>
      </div>
    )
  }

  const title = details.title || details.name
  const overview = details.overview
  const posterPath = details.poster_path
  const posterUrl = getImageUrl(posterPath, "w500")
  const backdropUrl = getImageUrl(details.backdrop_path, "original")
  const releaseDate = details.release_date || details.first_air_date
  const runtime = details.runtime || details.episode_run_time?.[0]
  const genres = details.genres?.map((g: { name: string }) => g.name).join(", ")
  const score = Math.round(details.vote_average * 10)

  const directors =
    details.credits?.crew
      .filter((c: CrewMember) => c.job === "Director")
      .map((c: CrewMember) => c.name)
      .join(", ") || "N/A"

  const writers =
    details.credits?.crew
      .filter((c: CrewMember) => c.job === "Writer")
      .map((c: CrewMember) => c.name)
      .join(", ") || "N/A"

  const cast = details.credits?.cast
    .slice(0, 5)
    .map((c: CastMember) => c) || []

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100">
      <div className="relative w-full h-80 md:h-[450px] overflow-hidden">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={`${title} backdrop`}
            fill
            className="object-cover object-top opacity-30"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-40 md:-mt-64 relative z-10 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 shrink-0">
          <div className="relative w-full h-[450px] rounded-lg shadow-xl overflow-hidden">
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {session && (
            <div className="mt-6">
              <MediaActions
                mediaId={details.id}
                mediaType={mediaType}
                title={title}
                posterUrl={posterPath}
              />
            </div>
          )}
        </div>

        <div className="w-full md:w-3/4 grow">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {title}
            </h1>
            <p className="text-lg text-gray-400">
              {directors && <span className="font-semibold">{directors}</span>}{" "}
              {releaseDate && `(${new Date(releaseDate).getFullYear()})`}
            </p>
            <p className="text-sm text-gray-500">{genres}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg mb-6 flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">
                {score > 0 ? `${score}%` : "N/A"}
              </span>
              <span className="text-sm text-gray-400">Popularidade</span>
            </div>
            <div className="grow">
              <h2 className="text-xl font-semibold text-white mb-2">Sinopse</h2>
              <p className="text-gray-300 leading-relaxed">{overview}</p>
            </div>
          </div>

          {cast.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Elenco Principal</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cast.map((member: CastMember) => (
                  <div key={member.name} className="flex flex-col items-center text-center">
                    {member.profile_path ? (
                      <Image
                        src={getImageUrl(member.profile_path, "w500")}
                        alt={member.name}
                        width={100}
                        height={100}
                        className="rounded-full object-cover w-20 h-20 mb-2"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-2 text-gray-400 text-sm">
                        N/A
                      </div>
                    )}
                    <p className="text-sm font-semibold text-white">{member.name}</p>
                    <p className="text-xs text-gray-400 italic">{member.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-800 pt-6 mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Detalhes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              {runtime && (
                <div>
                  <span className="font-semibold">Duração:</span> {runtime} min
                </div>
              )}
              {writers !== "N/A" && (
                <div>
                  <span className="font-semibold">Escrito por:</span> {writers}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}