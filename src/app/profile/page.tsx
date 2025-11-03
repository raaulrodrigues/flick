import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient, MediaItem } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

const prisma = new PrismaClient()

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

const getImageUrl = (posterPath: string) => {
  return posterPath
    ? `https://image.tmdb.org/t/p/w200${posterPath}`
    : "/placeholder-image.png"
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/api/auth/signin?callbackUrl=/profile")
  }

  const mediaItems = await getUserMedia(session.user.id)

  const planToWatch = mediaItems.filter(
    (item: MediaItem) => item.status === "PLAN_TO_WATCH"
  )
  const watching = mediaItems.filter(
    (item: MediaItem) => item.status === "WATCHING"
  )
  const completed = mediaItems.filter(
    (item: MediaItem) => item.status === "COMPLETED"
  )
  const dropped = mediaItems.filter(
    (item: MediaItem) => item.status === "DROPPED"
  )

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Image
          src={session.user.image || ""}
          alt={session.user.name || "Avatar"}
          width={80}
          height={80}
          className="rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{session.user.name}</h1>
          <p className="text-gray-400">{session.user.email}</p>
        </div>
      </div>

      {planToWatch.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3">
            Quero Assistir
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {planToWatch.map((item: MediaItem) => (
              <div key={item.id} className="group">
                <Image
                  src={getImageUrl(item.posterUrl || "")}
                  alt={item.title}
                  width={200}
                  height={300}
                  className="rounded-md object-cover w-full h-auto"
                />
                <h3 className="text-sm mt-2 truncate">{item.title}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

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