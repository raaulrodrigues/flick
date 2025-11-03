import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient, MediaItem } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

const prisma = new PrismaClient()

const getImageUrl = (posterPath: string) => {
  return posterPath
    ? `https://image.tmdb.org/t/p/w200${posterPath}`
    : "/placeholder-image.png"
}

async function getUserMedia(userId: string) {
  const mediaItems = await prisma.mediaItem.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })
  return mediaItems
}

interface PosterGridProps {
  title: string
  items: MediaItem[]
}

const PosterGrid = ({ title, items }: PosterGridProps) => {
  if (items.length === 0) return null

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">
        {title}
      </h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {items.map((item) => (
          <Link
            href={`/media/${item.mediaType}/${item.mediaId}`}
            key={item.id}
            className="group relative"
          >
            <div className="aspect-2/3 w-full overflow-hidden rounded-md bg-gray-800">
              <Image
                src={getImageUrl(item.posterUrl || "")}
                alt={item.title}
                width={200}
                height={300}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/api/auth/signin?callbackUrl=/profile")
  }

  const mediaItems = await getUserMedia(session.user.id)

  const likedItems = mediaItems.filter((item) => item.isLiked).slice(0, 10)
  const watchlistedItems = mediaItems
    .filter((item) => item.isWatchlisted)
    .slice(0, 10)
  const completedItems = mediaItems
    .filter((item) => item.status === "COMPLETED")
    .slice(0, 10)

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-6 border-b border-gray-700 pb-8 mb-8">
        <Image
          src={session.user.image || ""}
          alt={session.user.name || "Avatar"}
          width={100}
          height={100}
          className="rounded-full border-4 border-gray-700"
        />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold">{session.user.name}</h1>
          <p className="text-gray-400">{session.user.email}</p>
        </div>
        <div className="flex gap-6 ml-auto text-center">
          <div>
            <span className="text-2xl font-bold text-white">
              {completedItems.length}
            </span>
            <p className="text-sm text-gray-400">Vistos</p>
          </div>
          <div>
            <span className="text-2xl font-bold text-white">
              {likedItems.length}
            </span>
            <p className="text-sm text-gray-400">Curtidos</p>
          </div>
          <div>
            <span className="text-2xl font-bold text-white">
              {watchlistedItems.length}
            </span>
            <p className="text-sm text-gray-400">Watchlist</p>
          </div>
        </div>
      </div>

      <PosterGrid title="Curtidos Recentemente" items={likedItems} />
      <PosterGrid title="Watchlist" items={watchlistedItems} />
      <PosterGrid title="Vistos Recentemente" items={completedItems} />

      {mediaItems.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg">Sua estante está vazia.</p>
          <p>
            Use a página de{" "}
            <Link href="/search" className="text-blue-400 hover:underline">
              Busca
            </Link>{" "}
            para adicionar filmes e séries!
          </p>
        </div>
      )}
    </div>
  )
}