"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { projectsList, categories } from "../models"

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const filteredProjects =
    activeFilter === "all" ? projectsList : projectsList.filter((project) => project.category.includes(activeFilter))

  return (
    <div className="space-y-8">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">projek.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-4">
            <span className="text-primary">$</span> Menampilkan direktori projek. Pilih kategori untuk memfilter hasil.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeFilter === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.slice(0, 6).map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            technologies={project.technologies}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href="#"
          className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors border border-primary/30"
        >
          Lihat Lebih Banyak <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
