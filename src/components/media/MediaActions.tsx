"use client"

import { useState } from "react"

interface MediaActionsProps {
  mediaId: number
  mediaType: "movie" | "tv"
  title: string
  posterUrl: string
}

export default function MediaActions({
  mediaId,
  mediaType,
  title,
  posterUrl,
}: MediaActionsProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddItem = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaId: mediaId,
          mediaType: mediaType,
          title: title,
          posterUrl: posterUrl,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Falha ao adicionar item")
      }

      setIsAdded(true)
    } catch (error) {
      console.error(error)
      alert((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-8">
      {isAdded ? (
        <button
          disabled
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold"
        >
          ✓ Adicionado à sua lista
        </button>
      ) : (
        <button
          onClick={handleAddItem}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-500"
        >
          {isLoading ? "Adicionando..." : "Adicionar à Lista"}
        </button>
      )}

      {}
    </div>
  )
}