import type React from "react"
import { JetBrains_Mono } from "next/font/google"
import { DefaultSeo } from 'next-seo'
import Script from 'next/script'
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

// Impor seoConfig
import { seoConfig, ogImage, url } from '@/lib/seo-config'

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://reynaldsilva.vercel.app'),
  title: {
    default: seoConfig.title || 'Reynald Silva | Portfolio',
    template: `%s | ${seoConfig.title || 'Reynald Silva | Portfolio'}`,
  },
  description: seoConfig.description || 'Portfolio Moch Reynald Silva Baktiar - Web & Mobile Developer',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: url,
    title: seoConfig.title || 'Reynald Silva | Portfolio',
    description: seoConfig.description || 'Portfolio Moch Reynald Silva Baktiar - Web & Mobile Developer',
    siteName: seoConfig.title || 'Reynald Silva | Portfolio',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: seoConfig.title || 'Reynald Silva | Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.title || 'Reynald Silva | Portfolio',
    description: seoConfig.description || 'Portfolio Moch Reynald Silva Baktiar - Web & Mobile Developer',
    images: [ogImage],
    creator: '@reynaldsilva',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: url,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#00ff8c" />
        
        {/* Schema.org JSON-LD */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Moch Reynald Silva Baktiar',
              url: url,
              image: `${url}/profile.jpg`,
              sameAs: [
                'https://github.com/reynaldsilva',
                'https://linkedin.com/in/reynaldsilva',
                'https://twitter.com/reynaldsilva',
              ],
              jobTitle: 'Web & Mobile Developer',
              worksFor: {
                '@type': 'Organization',
                name: 'Freelancer',
              },
              description: seoConfig.description,
            }),
          }}
        />
      </head>
      <body className={`${jetbrainsMono.variable} font-mono bg-black text-white min-h-screen flex flex-col`}>
        <DefaultSeo {...seoConfig} />
        <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  )
}


import './globals.css'