"use client"

import { useState } from "react"
import Image from "next/image"

interface SearchResult {
  id: number
  title?: string
  name?: string
  poster_path: string
  media_type: "movie" | "tv"
}

export default function SearchComponent() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set())

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query) return

    setIsLoading(true)
    setResults([])

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
      if (!res.ok) {
        throw new Error("Falha ao buscar")
      }
      const data = await res.json()
      setResults(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddItem = async (item: SearchResult) => {
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaId: item.id,
          mediaType: item.media_type,
          title: item.title || item.name,
          posterUrl: item.poster_path,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Falha ao adicionar item")
      }

      setAddedItems((prev) => new Set(prev).add(item.id))
    } catch (error) {
      console.error(error)
      alert((error as Error).message)
    }
  }

  const getImageUrl = (posterPath: string) => {
    return posterPath
      ? `https://image.tmdb.org/t/p/w200${posterPath}`
      : "/placeholder-image.png"
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por filme ou série..."
          className="grow px-4 py-2 rounded-md text-black"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 rounded-md disabled:bg-gray-500"
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {results.map((item) => (
          <div key={item.id} className="text-center relative">
            {addedItems.has(item.id) ? (
              <button
                disabled
                className="absolute top-1 right-1 z-10 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center"
              >
                ✓
              </button>
            ) : (
              <button
                onClick={() => handleAddItem(item)}
                className="absolute top-1 right-1 z-10 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                +
              </button>
            )}

            <Image
              src={getImageUrl(item.poster_path)}
              alt={item.title || item.name || "Poster"}
              width={200}
              height={300}
              className="rounded-md object-cover w-full h-auto"
            />
            <h3 className="text-sm mt-1">{item.title || item.name}</h3>
            <p className="text-xs text-gray-400 capitalize">
              {item.media_type === "movie" ? "Filme" : "Série"}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}