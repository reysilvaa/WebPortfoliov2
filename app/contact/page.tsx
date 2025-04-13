"use client"

import { useState } from "react"
import { Terminal } from "@/components/terminal"
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <div className="space-y-16">
      <section>
        <Terminal
          text="Mari Terhubung"
          typingSpeed={30}
          className="max-w-3xl mx-auto"
          onComplete={() => setIntroComplete(true)}
        />

        {introComplete && (
          <div className="mt-4 max-w-3xl mx-auto">
            <p className="text-muted-foreground">
              Tertarik untuk bekerja sama atau memiliki pertanyaan? Jangan ragu untuk menghubungi saya melalui form atau
              kontak di bawah ini.
            </p>
          </div>
        )}
      </section>

      <section>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-button terminal-button-red"></div>
              <div className="terminal-button terminal-button-yellow"></div>
              <div className="terminal-button terminal-button-green"></div>
              <div className="terminal-title">contact_form.sh</div>
            </div>
            <div className="terminal-content">
              <p className="mb-4">
                <span className="text-primary">$</span> ./send_message.sh
              </p>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm mb-1">
                    <span className="text-primary">Nama:</span>
                  </label>
                  <Input id="name" placeholder="Masukkan nama Anda" className="bg-background border-border" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm mb-1">
                    <span className="text-primary">Email:</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email Anda"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm mb-1">
                    <span className="text-primary">Subjek:</span>
                  </label>
                  <Input id="subject" placeholder="Masukkan subjek pesan" className="bg-background border-border" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm mb-1">
                    <span className="text-primary">Pesan:</span>
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Masukkan pesan Anda"
                    rows={4}
                    className="bg-background border-border"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Kirim Pesan
                </Button>
              </form>
            </div>
          </div>

          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-button terminal-button-red"></div>
              <div className="terminal-button terminal-button-yellow"></div>
              <div className="terminal-button terminal-button-green"></div>
              <div className="terminal-title">contact_info.sh</div>
            </div>
            <div className="terminal-content">
              <p className="mb-4">
                <span className="text-primary">$</span> cat contact_details.txt
              </p>
              <div className="space-y-6">
                <div>
                  <p className="mb-1 text-primary">Email:</p>
                  <Link
                    href="mailto:reynaldsilva123@gmail.com"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Mail size={16} />
                    reynaldsilva123@gmail.com
                  </Link>
                </div>
                <div>
                  <p className="mb-1 text-primary">Telepon:</p>
                  <Link
                    href="tel:+6285232152313"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Phone size={16} />
                    +62 852 3215-2313
                  </Link>
                </div>
                <div>
                  <p className="mb-1 text-primary">Alamat:</p>
                  <p className="flex items-start gap-2">
                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                    <span>Jl. Bauksit No 90C, Kel. Purwantoro, Kec. Blimbing, Kota Malang, Indonesia</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <p className="mb-3 text-primary">/ social media</p>
                  <div className="flex space-x-4">
                    <Link
                      href="https://github.com/reysilvaa"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github size={20} />
                      <span className="sr-only">GitHub</span>
                    </Link>
                    <Link
                      href="https://twitter.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter size={20} />
                      <span className="sr-only">Twitter</span>
                    </Link>
                    <Link
                      href="https://linkedin.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin size={20} />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
