import { MetadataRoute } from 'next'
import { projects, projectsList } from './models'

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reynaldsilva.vercel.app'
  
  // Halaman statis
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFreq: 'daily' as ChangeFreq,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFreq: 'daily' as ChangeFreq,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFreq: 'weekly' as ChangeFreq,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFreq: 'weekly' as ChangeFreq,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFreq: 'daily' as ChangeFreq,
      priority: 0.7,
    }
  ]
  
  // Halaman proyek dinamis
  const projectsPages = Object.keys(projects).map(projectId => ({
    url: `${baseUrl}/projects/${projectId}`,
    lastModified: new Date(),
    changeFreq: 'daily' as ChangeFreq,
    priority: 0.7,
  }))
  
  return [...staticPages, ...projectsPages]
} 