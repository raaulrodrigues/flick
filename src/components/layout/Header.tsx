"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  return (
    <header className="w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      {}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-bold text-white">
          Flick
        </Link>
        <nav className="hidden md:flex gap-4">
          <Link href="/" className="hover:text-gray-300">
            Início
          </Link>
          <Link href="/search" className="hover:text-gray-300">
            Buscar
          </Link>
          {session && (
            <Link href="/profile" className="hover:text-gray-300">
              Meu Perfil
            </Link>
          )}
        </nav>
      </div>

      {}
      <div className="flex items-center gap-4">
        {isLoading ? (
          <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
        ) : session ? (
          <>
            <Image
              src={session.user.image || ""}
              alt={session.user.name || "Avatar"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 rounded-md text-sm"
            >
              Sair
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="px-4 py-2 bg-blue-600 rounded-md text-sm"
          >
            Login
          </button>
        )}
      </div>
    </header>
  )
}