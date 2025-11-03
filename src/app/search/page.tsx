import SearchComponent from "@/components/search/SearchComponent"

export default function SearchPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 border-l-4 border-blue-500 pl-3">
        Buscar Filmes & Séries
      </h1>

      <SearchComponent />
    </div>
  )
}