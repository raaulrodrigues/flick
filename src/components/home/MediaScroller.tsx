import Image from "next/image"
import Link from "next/link"
import { PlayCircle, PlusCircle } from "lucide-react"

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
    ? `https://image.tmdb.org/t/p/w300${path}`
    : "/placeholder-image.png"
}

export default function MediaScroller({ title, items }: MediaScrollerProps) {
  return (
    <section className="mb-14">
      <h2 className="text-2xl font-extrabold text-violet-600 mb-6 tracking-wide uppercase px-4 md:px-0">
        {title}
      </h2>
      <div className="flex overflow-x-auto gap-5 pb-4 pl-4 md:pl-0 hide-scrollbar">
        {items.map((item) => (
          <Link
            href={`/media/${item.media_type || "movie"}/${item.id}`}
            key={item.id}
            className="group"
          >
            <div className="w-44 shrink-0">
              <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl shadow-2xl shadow-zinc-900 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-violet-600/50">
                <Image
                  src={getImageUrl(item.poster_path)}
                  alt={item.title}
                  width={300}
                  height={450}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="text-white w-12 h-12 opacity-90 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-white text-center mt-2 px-1">
                    {item.title}
                  </span>
                </div>
                <div className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlusCircle className="text-white w-6 h-6" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}