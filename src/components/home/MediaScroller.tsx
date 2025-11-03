import Image from "next/image"
import Link from "next/link"

interface MediaItem {
  id: number
  title: string
  poster_path: string
  media_type: "movie" | "tv"
}

interface MediaScrollerProps {
  title: string
  items: MediaItem[]
}

const getImageUrl = (path: string) => {
  return path
    ? `https://image.tmdb.org/t/p/w200${path}`
    : "/placeholder-image.png"
}

export default function MediaScroller({ title, items }: MediaScrollerProps) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-300 mb-4 border-l-4 border-blue-500 pl-3">
        {title}
      </h2>
      <div className="flex overflow-x-auto gap-4 pb-4 -mb-4">
        {items.map((item) => (
          <Link
            href={`/media/${item.media_type || "movie"}/${item.id}`}
            key={item.id}
            className="group"
          >
            <div className="w-40 shrink-0">
              <div className="aspect-2/3 w-full overflow-hidden rounded-md bg-gray-800">
                <Image
                  src={getImageUrl(item.poster_path)}
                  alt={item.title}
                  width={200}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-sm mt-2 truncate text-gray-200 group-hover:text-white">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}