import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 text-center">
      <div className="terminal-window max-w-xl w-full">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">error.sh</div>
        </div>
        <div className="terminal-content p-4">
          <div className="mb-6">
            <p className="text-primary mb-2">$ system.locateResource("/404")</p>
            <p className="text-destructive text-xl font-bold mb-2">ERROR_404: RESOURCE_NOT_FOUND</p>
            <div className="text-muted-foreground mb-4 border border-primary/20 p-2 bg-black/50">
              <p>Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.</p>
              <p>Path yang diminta tidak ada dalam sistem.</p>
            </div>
            <p className="text-primary mb-2">$ system.suggestAction()</p>
            <p className="text-white">Kembali ke beranda dan coba navigasi dari sana.</p>
          </div>
          <div className="mt-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors border border-primary/30"
            >
              &lt; Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
      <div className="glitch text-xl" data-text="404">404</div>
    </div>
  );
} 