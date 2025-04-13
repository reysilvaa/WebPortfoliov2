import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Reynald Silva | Portfolio",
  description: "Portfolio Moch Reynald Silva Baktiar - Web & Mobile Developer",
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#00ff8c" />
      </head>
      <body className={`${jetbrainsMono.variable} font-mono bg-black text-white min-h-screen flex flex-col`}>
        <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  )
}


import './globals.css'