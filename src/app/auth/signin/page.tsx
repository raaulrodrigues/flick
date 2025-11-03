import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import SignInButton from "@/components/auth/SignInButton"

export default async function SignInPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/profile")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <div className="p-8 md:p-12 bg-gray-900 rounded-xl shadow-2xl w-full max-w-sm border border-gray-800">
        <h1 className="text-4xl font-bold text-center text-white mb-6">
          Flick
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Entre ou crie uma conta para começar sua estante.
        </p>
        <SignInButton />
      </div>
    </div>
  )
}