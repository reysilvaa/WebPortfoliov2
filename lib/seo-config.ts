import type { NextSeoProps } from 'next-seo';

// Konfigurasi dasar untuk SEO website
export const seoConfig: NextSeoProps = {
  title: 'Reynald Silva | Portfolio',
  description: 'Portfolio Moch Reynald Silva Baktiar - Web & Mobile Developer profesional dengan keahlian dalam React, Next.js, dan pengembangan aplikasi mobile',
  canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://reynaldsilva.vercel.app',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://reynaldsilva.vercel.app',
    title: 'Reynald Silva | Portfolio',
    description: 'Portfolio Moch Reynald Silva Baktiar - Web & Mobile Developer profesional dengan keahlian dalam React, Next.js, dan pengembangan aplikasi mobile',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Reynald Silva Portfolio',
        type: 'image/jpeg',
      },
    ],
    siteName: 'Reynald Silva | Portfolio',
  },
  twitter: {
    handle: '@reynaldsilva',
    site: '@reynaldsilva',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'web developer, mobile developer, reynald silva, portofolio, react, next.js, indonesia',
    },
    {
      name: 'author',
      content: 'Moch Reynald Silva Baktiar',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.svg',
      type: 'image/svg+xml',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
};

// Properti tambahan yang digunakan di layout.tsx
export const ogImage = '/og-image.jpg';
export const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://reynaldsilva.vercel.app'; 