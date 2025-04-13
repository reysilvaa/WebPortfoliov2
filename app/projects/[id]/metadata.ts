import type { Metadata } from 'next'
import { projects } from '../../models'

// Metadata generator untuk halaman detail proyek
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id
  const project = projects[id as keyof typeof projects]

  if (!project) {
    return {
      title: 'Projek Tidak Ditemukan',
      description: 'Maaf, projek yang Anda cari tidak ditemukan'
    }
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Reynald Silva Portfolio`,
      description: project.description,
      url: `/projects/${id}`,
      type: 'website',
      images: [
        {
          url: project.image || '/placeholder.svg',
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [project.image || '/placeholder.svg'],
    },
  }
} 