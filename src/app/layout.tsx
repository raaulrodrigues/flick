import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AuthProvider from "@/components/AuthProvider"
import Header from "@/components/layout/Header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flick",
  description: "Sua estante de filmes e séries.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <AuthProvider>
          <Header /> {}
          <main className="p-4 md:p-8">{children}</main> {}
        </AuthProvider>
      </body>
    </html>
  )
}