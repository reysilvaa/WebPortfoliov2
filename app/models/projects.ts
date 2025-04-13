// Definisi interface untuk objek proyek
interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string[];
  github: string;
  demo: string;
  longDescription: string;
  type: string;
  featured: boolean;
  order: number;
  isPrivate: boolean;
}

// Interface untuk item proyek yang ditampilkan di list
interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string[];
}

// Objek utama dengan semua data proyek
export const projects: Record<string, Project> = {
  "rosantibike-booking": {
    title: "Booking Sewa Motor Online Rosantibike Motorent",
    description: "Sistem pemesanan online untuk rental motor dengan manajemen administrasi dan invoice otomatis dengan menggunakan Laravel, TailwindCSS, MySQL, Nginx.",
    image: "/projects/rosantibikeLaravel.png",
    technologies: ["Laravel", "MySQL", "Nginx", "TailwindCSS"],
    category: ["web", "api"],
    github: "https://github.com/reysilvaa",
    demo: "https://rosantibikemotorent.com",
    longDescription:
      "Projek ini merupakan sistem pemesanan online untuk rental motor dengan fitur manajemen administrasi dan pembuatan invoice otomatis. Sistem ini dibangun menggunakan Laravel untuk backend dan Flutter untuk aplikasi mobile. Database menggunakan MySQL dan dihosting pada VPS dengan Nginx sebagai web service.",
    type: "Projek Mandiri",
    featured: false,
    order: 2,
    isPrivate: false
  },
  "rosantibike-booking-v2": {
    title: "Booking Sewa Motor Online Rosantibike Motorent",
    description: "Sistem pemesanan online untuk rental motor dengan manajemen administrasi dan invoice otomatis dengan menggunakan NextJS dan NestJS API, TailwindCSS, MySQL, Nginx.",
    image: "/projects/rosantibikev2.png",
    technologies: ["NextJS", "NestJS API", "TailwindCSS", "MySQL", "Nginx"],
    category: ["web", "api"],
    github: "https://github.com/reysilvaa/private",
    demo: "https://rosantibikemotorent.com",
    longDescription:
      "Projek ini merupakan sistem pemesanan online untuk rental motor dengan fitur manajemen administrasi dan pembuatan invoice otomatis. Sistem ini dibangun menggunakan NextJS untuk frontend dan NestJS API untuk backend. Database menggunakan MySQL dan dihosting pada VPS dengan Nginx sebagai web service.",
    type: "Projek Mandiri",
    featured: true,
    order: 1,
    isPrivate: true
  },
  "sikep": {
    title: "Sikep - Sistem Informasi Kependudukan",
    description: "Aplikasi web untuk manajemen pendataan dengan fitur sistem pendukung keputusan dengan menggunakan Laravel, MySQL, MEREC, ARAS, TailwindCSS.",
    image: "/projects/sikep.png",
    technologies: ["Laravel", "MySQL", "MEREC", "ARAS", "TailwindCSS"],
    category: ["web"],
    github: "https://github.com/Naufall1/SIKEP",
    demo: "https://sikep.example.com",
    longDescription:
      "Sikep adalah aplikasi web untuk manajemen pendataan yang dilengkapi dengan fitur sistem pendukung keputusan menggunakan metode MEREC dan ARAS. Aplikasi ini dikembangkan menggunakan framework Laravel dengan database MySQL. Fitur utama meliputi manajemen data, perhitungan sistem pendukung keputusan, dan pelaporan hasil keputusan.",
    type: "Proyek Akhir Semester 4",
    featured: true,
    order: 2,
    isPrivate: false
  },
  "myrosantibike-mobile": {
    title: "myRosantibike Mobile",
    description: "Aplikasi mobile untuk pengelolaan rental motor dengan fitur pemesanan dan tracking.",
    image: "/projects/myRosantibikeMobileApp.png",
    technologies: ["Flutter", "Laravel API"],
    category: ["mobile", "api"],
    github: "https://github.com/reysilvaa/rosantibike_mobile",
    demo: "https://play.google.com/store",
    longDescription:
      "myRosantibike Mobile adalah aplikasi mobile untuk pengelolaan rental motor dengan fitur pemesanan dan tracking. Aplikasi ini dibangun menggunakan Flutter dengan backend Laravel API. Fitur utama meliputi pemesanan motor, tracking status pemesanan, notifikasi, dan pembayaran online.",
    type: "Proyek Mandiri",
    featured: true,
    order: 3,
    isPrivate: false
  },
  "skincare-recommendation": {
    title: "Rekomendasi Skincare",
    description: "Aplikasi mobile untuk rekomendasi skincare menggunakan deep learning (YOLOv8).",
    image: "/placeholder.svg?height=600&width=800",
    technologies: ["Flutter", "Laravel", "YOLOv8", "Deep Learning"],
    category: ["mobile", "ai"],
    github: "https://github.com/reysilvaa/PBL-rekomendasi-skincare",
    demo: "https://play.google.com/store",
    longDescription:
      "Aplikasi Rekomendasi Skincare adalah aplikasi mobile yang menggunakan deep learning (YOLOv8) untuk menganalisis kondisi kulit pengguna dan memberikan rekomendasi produk skincare yang sesuai. Aplikasi ini dibangun menggunakan Flutter dengan backend Laravel dan model deep learning YOLOv8.",
    type: "Proyek Tim",
    featured: false,
    order: 4,
    isPrivate: false
  },
  "laundry-management": {
    title: "Sistem Manajemen Laundry",
    description: "Aplikasi web untuk manajemen laundry dengan fitur pemesanan dan tracking.",
    image: "/placeholder.svg?height=600&width=800",
    technologies: ["React", "Node.js", "MongoDB"],
    category: ["web", "api"],
    github: "https://github.com/reysilvaa/NODE_REACT--Laundry--UKK",
    demo: "https://laundry-management.example.com",
    longDescription:
      "Sistem Manajemen Laundry adalah aplikasi web untuk pengelolaan bisnis laundry dengan fitur pemesanan dan tracking. Aplikasi ini dibangun menggunakan React untuk frontend, Node.js untuk backend, dan MongoDB sebagai database. Fitur utama meliputi manajemen pesanan, tracking status pesanan, manajemen pelanggan, dan laporan keuangan.",
    type: "Proyek Akhir Semester 3",
    featured: false,
    order: 5,
    isPrivate: false
  },
  "pelaporan-pelanggaran": {
    title: "Aplikasi Pelaporan Pelanggaran Mahasiswa",
    description: "Aplikasi web untuk pelaporan pelanggaran mahasiswa dengan fitur notifikasi dan tracking.",
    image: "/placeholder.svg?height=600&width=800",
    technologies: ["PHP", "MySQL", "Bootstrap"],
    category: ["web"],
    github: "https://github.com/reysilvaa/SiTatibJTI",
    demo: "https://pelaporan.example.com",
    longDescription:
      "Aplikasi Pelaporan Pelanggaran Mahasiswa adalah aplikasi web yang memudahkan pelaporan dan manajemen pelanggaran mahasiswa. Aplikasi ini dibangun menggunakan PHP native dengan database MySQL dan Bootstrap untuk antarmuka. Fitur utama meliputi pelaporan pelanggaran, tracking status pelaporan, notifikasi, dan dashboard untuk monitoring pelanggaran.",
    type: "Proyek Tim",
    featured: false,
    order: 6,
    isPrivate: false
  },
  "iot-monitoring": {
    title: "Sistem Monitoring IoT",
    description: "Aplikasi untuk monitoring perangkat IoT dengan visualisasi data real-time.",
    image: "/placeholder.svg?height=600&width=800",
    technologies: ["Arduino", "React", "Node.js", "MQTT"],
    category: ["iot"],
    github: "https://github.com/reysilvaa",
    demo: "https://iot-monitoring.example.com",
    longDescription:
      "Sistem Monitoring IoT adalah aplikasi untuk memantau perangkat IoT dengan visualisasi data real-time. Sistem ini menggunakan Arduino untuk sensor dan aktuator, MQTT sebagai protokol komunikasi, Node.js untuk backend, dan React untuk frontend. Fitur utama meliputi dashboard real-time, notifikasi, kontrol perangkat, dan analisis data historis.",
    type: "Proyek Mandiri",
    featured: false,
    order: 7,
    isPrivate: false
  },
}

// Helper untuk mengubah object menjadi array dengan key sebagai id
const projectToArray = (project: Project, id: string): ProjectItem => ({
  id,
  title: project.title,
  description: project.description,
  image: project.image,
  technologies: project.technologies,
  category: project.category,
})

// Mendeklarasikan projectsList berdasarkan projects
export const projectsList: ProjectItem[] = Object.entries(projects).map(
  ([id, project]) => projectToArray(project, id)
).sort((a, b) => projects[a.id].order - projects[b.id].order)

// Mendeklarasikan featuredProjects berdasarkan projects
export const featuredProjects: ProjectItem[] = Object.entries(projects)
  .filter(([, project]) => project.featured)
  .map(([id, project]) => projectToArray(project, id))
  .sort((a, b) => projects[a.id].order - projects[b.id].order)

export const categories = [
  { id: "all", name: "Semua Projek" },
  { id: "web", name: "Web Development" },
  { id: "mobile", name: "Mobile Apps" },
  { id: "ai", name: "AI & Machine Learning" },
  { id: "iot", name: "IoT" },
] 