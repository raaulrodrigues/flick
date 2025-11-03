"use client"

import { signIn } from "next-auth/react"

export default function SignInButton() {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => signIn("github")}
        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
      >
        Entrar com GitHub
      </button>
      <button
        onClick={() => signIn("google")}
        className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
      >
        Entrar com Google
      </button>
    </div>
  )
}