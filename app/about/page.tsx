"use client"

import { useState } from "react"
import { Terminal } from "@/components/terminal"
import { skillGroups, experiences, education } from "../models"

export default function AboutPage() {
  const [introComplete, setIntroComplete] = useState(false)
  const [bioComplete, setBioComplete] = useState(false)

  return (
    <div className="space-y-16">
      <section>
        <Terminal
          text="Moch Reynald Silva Baktiar | Developer | 2004 - 2025"
          typingSpeed={30}
          className="max-w-3xl mx-auto"
          onComplete={() => setIntroComplete(true)}
        />

        {introComplete && (
          <Terminal
            text="TENTANG SAYA"
            typingSpeed={20}
            className="max-w-3xl mx-auto mt-4"
            showPrompt={false}
            onComplete={() => setBioComplete(true)}
          />
        )}

        {bioComplete && (
          <div className="mt-6 space-y-6 max-w-3xl mx-auto">
            <p className="text-muted-foreground">
              Sebagai developer dengan keahlian di bidang web dan mobile development, saya menggabungkan ketepatan
              teknis dengan estetika yang bersih. Pendekatan saya fokus pada pembuatan solusi teknis yang elegan namun
              fungsional.
            </p>

            <blockquote className="border-l-4 border-primary pl-4 italic">
              "Saya percaya bahwa kode yang baik harus seperti prosa yang jelas—mudah dibaca, dipahami, dan dipelihara.
              Kerangka berpikir ini saya terapkan di setiap proyek yang saya kerjakan"
            </blockquote>

            <p className="text-muted-foreground">
              Dengan latar belakang pendidikan di bidang teknologi informasi dan pengalaman profesional dalam
              pengembangan aplikasi, saya berusaha menciptakan produk digital yang tidak hanya memenuhi kebutuhan
              fungsional tetapi juga memberikan pengalaman pengguna yang intuitif.
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">KEAHLIAN UTAMA</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card p-4 rounded-md border border-border/40">
                  <p className="text-primary">Web Development</p>
                </div>
                <div className="bg-card p-4 rounded-md border border-border/40">
                  <p className="text-primary">Mobile Apps</p>
                </div>
                <div className="bg-card p-4 rounded-md border border-border/40">
                  <p className="text-primary">UX Design</p>
                </div>
                <div className="bg-card p-4 rounded-md border border-border/40">
                  <p className="text-primary">Problem Solving</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Keahlian</h2>
        <div className="space-y-8">
          {skillGroups.map((skillGroup, groupIndex) => (
            <div key={groupIndex} className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-button terminal-button-red"></div>
                <div className="terminal-button terminal-button-yellow"></div>
                <div className="terminal-button terminal-button-green"></div>
                <div className="terminal-title">{`${groupIndex + 1 < 10 ? "0" : ""}${groupIndex + 1}/0${skillGroups.length} - ${skillGroup.category}`}</div>
              </div>
              <div className="terminal-content">
                <p className="mb-4">
                  <span className="text-primary">$</span> cat {skillGroup.category.toLowerCase().replace(/\s+/g, "_")}
                  .txt
                </p>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary">SKILLSET {skillGroup.category.toUpperCase()}</h3>
                  <div className="space-y-3">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <div key={skillIndex} className="space-y-1">
                        <div className="flex justify-between">
                          <span>{skill.name}</span>
                          <span>{skill.percentage}%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${skill.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Pengalaman</h2>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-button terminal-button-red"></div>
                <div className="terminal-button terminal-button-yellow"></div>
                <div className="terminal-button terminal-button-green"></div>
                <div className="terminal-title">{`${index + 1 < 10 ? "0" : ""}${index + 1}/0${experiences.length} - ${exp.company}`}</div>
              </div>
              <div className="terminal-content">
                <p className="mb-1">
                  <span className="text-primary">$</span> cat job_details.txt
                </p>
                <div className="mb-4">
                  <h3 className="text-lg font-bold">{exp.title}</h3>
                  <p className="text-primary">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mb-4">{exp.period}</p>

                  <div className="space-y-2">
                    <p className="text-primary">DESKRIPSI PEKERJAAN</p>
                    <ul className="space-y-1">
                      {exp.description.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Pendidikan</h2>
        <div className="space-y-8">
          {education.map((edu, index) => (
            <div key={index} className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-button terminal-button-red"></div>
                <div className="terminal-button terminal-button-yellow"></div>
                <div className="terminal-button terminal-button-green"></div>
                <div className="terminal-title">{edu.period}</div>
              </div>
              <div className="terminal-content">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">{edu.degree}</h3>
                  <p className="text-primary">
                    {edu.department} • {edu.institution}
                  </p>

                  <div className="mt-4 space-y-4">
                    <p className="text-primary">PENGALAMAN</p>
                    <ul className="space-y-1">
                      {edu.experiences.map((exp, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {exp}
                        </li>
                      ))}
                    </ul>

                    <p className="text-primary mt-4">SKILLSET</p>
                    <div className="flex flex-wrap gap-2">
                      {edu.skills.map((skill, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
