"use client"

import { ArrowLeft, Lock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PrivateRepoProps {
  project: {
    title: string;
    description: string;
    longDescription: string;
    image: string;
    technologies: string[];
    category: string[];
    type: string;
    demo: string;
    isPrivate: boolean;
    github: string;
  }
}

export function PrivateRepo({ project }: PrivateRepoProps) {
  return (
    <div className="space-y-8">
      <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft size={16} /> Kembali ke projek
      </Link>

      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">access_denied.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-2">
            <span className="text-primary">$</span> git clone {project.github.split('/').pop() || project.title.toLowerCase().replace(/\s+/g, '-')}.git
          </p>
          <div className="mb-4">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle size={16} />
              <span>Akses ditolak: Repositori ini bersifat private</span>
            </div>
            <p className="mt-2">
              <span className="text-primary">status:</span> <span className="text-red-500">Private</span>
            </p>
            <p>
              <span className="text-primary">message:</span> Repositori ini bersifat private dan hanya dapat diakses dengan izin
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-80 rounded-md overflow-hidden">
        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
          <Lock size={48} className="text-primary mb-4" />
          <p className="text-lg font-bold text-white">Repositori Private</p>
          <p className="text-sm text-muted-foreground max-w-md text-center mt-2">
            Kode sumber tidak tersedia untuk umum. Hubungi saya untuk informasi lebih lanjut.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button 
          disabled
          className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md opacity-50 cursor-not-allowed"
        >
          <Lock size={16} /> Repository Private
        </button>
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors border border-primary/30"
        >
          Demo Projek
        </a>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">DETAIL PROJEK</h2>
        <p className="text-muted-foreground">{project.longDescription}</p>
        
        <div className="mt-8 p-4 bg-secondary/20 rounded-md border border-secondary">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Lock size={16} /> Mengapa repositori ini bersifat private?
          </h3>
          <p className="text-sm text-muted-foreground">
            Repositori ini bersifat private karena beberapa alasan:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
            <li>Mengandung konfigurasi dan kredensial yang sensitif</li>
            <li>Berisi kode proprietari yang dikembangkan untuk klien atau penggunaan khusus</li>
            <li>Masih dalam tahap pengembangan aktif sebelum dirilis ke publik</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-4">
            Jika Anda tertarik dengan lebih banyak detail tentang teknologi dan arsitektur yang digunakan, silakan hubungi saya melalui halaman kontak.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-primary text-sm">Teknologi:</span>
        {project.technologies.map((tech, index) => (
          <span key={index} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
} 