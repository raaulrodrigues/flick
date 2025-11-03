import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const mediaId = searchParams.get("mediaId")

  if (!mediaId) {
    return NextResponse.json(
      { error: "mediaId é obrigatório" },
      { status: 400 }
    )
  }

  const item = await prisma.mediaItem.findUnique({
    where: {
      userId_mediaId: {
        userId: session.user.id,
        mediaId: String(mediaId),
      },
    },
  })

  if (!item) {
    return NextResponse.json(null, { status: 404 })
  }

  return NextResponse.json(item)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const userId = session.user.id
  const body = await request.json()
  const {
    mediaId,
    mediaType,
    title,
    posterUrl,
    status,
    isLiked,
    isWatchlisted,
    rating,
  } = body

  if (!mediaId || !mediaType || !title) {
    return NextResponse.json(
      { error: "Dados da mídia ausentes" },
      { status: 400 }
    )
  }

  try {
    const upsertedItem = await prisma.mediaItem.upsert({
      where: {
        userId_mediaId: {
          userId: userId,
          mediaId: String(mediaId),
        },
      },
      update: {
        status: status,
        isLiked: isLiked,
        isWatchlisted: isWatchlisted,
        rating: rating,
        updatedAt: new Date(),
      },
      create: {
        userId: userId,
        mediaId: String(mediaId),
        mediaType: mediaType,
        title: title,
        posterUrl: posterUrl,
        status: status,
        isLiked: isLiked,
        isWatchlisted: isWatchlisted,
        rating: rating,
      },
    })

    return NextResponse.json(upsertedItem, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao salvar o item" },
      { status: 500 }
    )
  }
}