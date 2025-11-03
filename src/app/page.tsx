import { authOptions } from "./api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import Link from "next/link"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Flick</h1>
      {session ? (
        <div className="text-center">
          <p>Logado como {session.user?.name}</p>
          <p>{session.user?.email}</p>
          <img
            src={session.user?.image || ""}
            alt="User Avatar"
            className="rounded-full w-16 h-16 mx-auto my-4"
          />
          <Link
            href="/api/auth/signout"
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Sair
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <p>Você não está logado.</p>
          <Link
            href="/api/auth/signin"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Fazer Login
          </Link>
        </div>
      )}
    </main>
  )
}