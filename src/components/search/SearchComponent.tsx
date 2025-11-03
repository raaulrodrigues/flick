"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface SearchResult {
  id: number
  title?: string
  name?: string
  poster_path: string
  media_type: "movie" | "tv"
  release_date?: string
  first_air_date?: string
}

export default function SearchComponent() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query) return

    setIsLoading(true)
    setResults([])

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error("Falha ao buscar")
      const data: SearchResult[] = await res.json()

      const validResults = data.filter(
        (item) => item.poster_path && (item.title || item.name)
      )
      setResults(validResults)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getImageUrl = (posterPath: string) => {
    return posterPath
      ? `https://image.tmdb.org/t/p/w200${posterPath}`
      : "/placeholder-image.png"
  }

  const getYear = (item: SearchResult) => {
    const date = item.release_date || item.first_air_date
    return date ? new Date(date).getFullYear() : "N/A"
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por filme ou série..."
          className="grow px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 rounded-md font-medium text-white hover:bg-blue-700 transition-colors disabled:bg-gray-700"
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {results.map((item) => (
          <Link
            href={`/media/${item.media_type}/${item.id}`}
            key={item.id}
            className="flex gap-4 bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800/80 transition-colors"
          >
            <div className="w-24 shrink-0">
              <Image
                src={getImageUrl(item.poster_path)}
                alt={item.title || item.name || "Poster"}
                width={100}
                height={150}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="py-4 pr-4">
              <h3 className="text-lg font-semibold text-white">
                {item.title || item.name}
              </h3>
              <p className="text-gray-400">{getYear(item)}</p>
              <p className="text-sm text-gray-500 capitalize">
                {item.media_type === "movie" ? "Filme" : "Série"}
              </p>
            </div>
          </Link>
        ))}
        {results.length === 0 && !isLoading && (
          <p className="text-gray-500">Nenhum resultado encontrado.</p>
        )}
      </div>
    </div>
  )
}