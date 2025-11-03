"use client"

import { useState, useEffect, useOptimistic } from "react"

interface MediaActionsProps {
  mediaId: number
  mediaType: "movie" | "tv"
  title: string
  posterUrl: string
}

interface MediaState {
  isWatched: boolean
  isLiked: boolean
  isWatchlisted: boolean
}

export default function MediaActions({
  mediaId,
  mediaType,
  title,
  posterUrl,
}: MediaActionsProps) {
  const [state, setState] = useState<MediaState>({
    isWatched: false,
    isLiked: false,
    isWatchlisted: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, newState: Partial<MediaState>) => ({
      ...currentState,
      ...newState,
    })
  )

  useEffect(() => {
    const fetchMediaState = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/media?mediaId=${mediaId}`)
        if (res.ok) {
          const data = await res.json()
          setState({
            isWatched: data.status === "COMPLETED",
            isLiked: data.isLiked || false,
            isWatchlisted: data.isWatchlisted || false,
          })
        }
      } catch (error) {
        console.error("Item não encontrado na lista", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMediaState()
  }, [mediaId])

  const handleAction = async (action: keyof MediaState) => {
    const newState = { ...state }
    newState[action] = !newState[action]

    setOptimisticState(newState)
    setState(newState)

    const status = newState.isWatched ? "COMPLETED" : "PLAN_TO_WATCH"

    await fetch("/api/media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mediaId: mediaId,
        mediaType: mediaType,
        title: title,
        posterUrl: posterUrl,
        status: status,
        isLiked: newState.isLiked,
        isWatchlisted: newState.isWatchlisted,
      }),
    })
  }

  const WatchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path
        fillRule="evenodd"
        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a.75.75 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
        clipRule="evenodd"
      />
    </svg>
  )

  const HeartIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  )

  const WatchlistIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
        clipRule="evenodd"
      />
    </svg>
  )

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 mt-6 p-4 bg-gray-800 rounded-lg shadow-inner h-14 animate-pulse" />
    )
  }

  return (
    <div className="flex items-center gap-4 mt-6 p-4 bg-gray-800 rounded-lg shadow-inner">
      <button
        onClick={() => handleAction("isWatched")}
        title={optimisticState.isWatched ? "Visto" : "Marcar como Visto"}
        className={`flex flex-col items-center p-2 rounded-md ${
          optimisticState.isWatched
            ? "text-green-400"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <WatchIcon />
        <span className="text-xs">
          {optimisticState.isWatched ? "Visto" : "Visto"}
        </span>
      </button>

      <button
        onClick={() => handleAction("isLiked")}
        title={optimisticState.isLiked ? "Gostei" : "Gostar"}
        className={`flex flex-col items-center p-2 rounded-md ${
          optimisticState.isLiked
            ? "text-red-500"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <HeartIcon />
        <span className="text-xs">
          {optimisticState.isLiked ? "Gostei" : "Gostar"}
        </span>
      </button>

      <button
        onClick={() => handleAction("isWatchlisted")}
        title={
          optimisticState.isWatchlisted ? "Na Watchlist" : "Adicionar à Watchlist"
        }
        className={`flex flex-col items-center p-2 rounded-md ${
          optimisticState.isWatchlisted
            ? "text-blue-400"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <WatchlistIcon />
        <span className="text-xs">Watchlist</span>
      </button>
    </div>
  )
}