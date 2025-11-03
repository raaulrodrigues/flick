import { NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json(
      { error: "Query de busca é obrigatória" },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}&language=pt-BR&include_adult=false`
    )

    if (!res.ok) {
      throw new Error("Falha ao buscar dados do TMDB")
    }

    const data = await res.json()

    const filteredResults = data.results.filter(
      (item: any) => item.media_type === "movie" || item.media_type === "tv"
    )

    return NextResponse.json(filteredResults)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}