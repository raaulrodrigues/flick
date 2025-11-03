"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
      <div className="container mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-2xl font-bold text-white tracking-tighter"
          >
            Flick
          </Link>
          <nav className="hidden md:flex items-center gap-5">
            <Link
              href="/"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Início
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Buscar
            </Link>
            {session && (
              <Link
                href="/profile"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Meu Perfil
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
          ) : session ? (
            <>
              <button
                onClick={() => signOut()}
                className="text-sm px-4 py-1.5 bg-red-600 rounded-md font-medium text-white hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
              <Link href="/profile" className="shrink-0">
                <Image
                  src={session.user.image || ""}
                  alt={session.user.name || "Avatar"}
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-gray-600 hover:border-blue-400 transition-colors"
                />
              </Link>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="text-sm px-4 py-1.5 bg-blue-600 rounded-md font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Fazer Login
            </button>
          )}
        </div>
      </div>
    </header>
  )
}