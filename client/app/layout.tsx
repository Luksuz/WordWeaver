import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WordWeaver",
  description: "Generate high-quality content with AI assistance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <div className="flex min-h-screen">
            <Navigation />
            <main className="flex-1">{children}</main>
          </div>
      </body>
    </html>
  )
}

