# Keyfa PA Companion — Personal Academic Management System

<p align="center">
  <img src="public/logo-full.png" alt="Keyfa PA Companion Logo" width="380" />
</p>

<p align="center">
  <strong>Sistem Manajemen Pribadi Proyek Akhir Mahasiswa D4 TRPL Politeknik Negeri Padang</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Prisma-5.22-38a169?style=flat-square&logo=prisma" />
  <img src="https://img.shields.io/badge/Theme-Dark%20%26%20Light-ffced8?style=flat-square" />
</p>

---

## 📌 Profil Mahasiswa & Proyek Akhir

- **Nama Mahasiswa:** Latifa Keysha
- **NIM:** 2211082001
- **Program Studi:** D4 Teknologi Rekayasa Perangkat Lunak (TRPL)
- **Jurusan / Institusi:** Teknologi Informasi, Politeknik Negeri Padang (PNP)
- **Judul Proyek Akhir:** 
  > *"Pengembangan Sistem Pemetaan Distribusi dan Tren Topik Tugas Akhir Mahasiswa D4 TRPL pada SITA Menggunakan Latent Dirichlet Allocation (LDA)"*
- **Status Akademik:** Revisi Proposal Pasca Sempro (Tahap 6 dari 15 Milestone)
- **Target Kelulusan:** 31 Januari 2027

---

## 🎨 Palet Warna & Tampilan Sistem

Aplikasi ini mengusung desain yang estetik, rapi, dan nyaman di mata:

1. **Mode Terang (Light Mode):**
   - Menggunakan palet [Color Hunt](https://colorhunt.co/palette/ffced8ffddddfff4deffe8c4):
     - Soft Rose Pink: `#FFCED8`
     - Blush / Pale Pink: `#FFDDDD`
     - Warm Cream: `#FFF4DE`
     - Soft Peach: `#FFE8C4`
     - Latar Belakang: `#FAF5F5` dengan tipografi deep rose/burgundy (`#863043`, `#A84157`).

2. **Mode Gelap (Dark Mode):**
   - Velvet Rose-Ebony & Warm Cocoa (`#241E20`)
   - Card Background: `#2D2528` / `#362B2F`
   - Garis Tepi (*Border*): `#4D383E`
   - Teks Utama: `#FFF0F3` (putih lembut tidak silau)
   - Dilengkapi *Theme Switcher* interaktif di Header, Sidebar, dan Pengaturan.

---

## 🚀 Fitur Unggulan

1. **Task Management Kanban (Drag & Drop):**
   - Pengelolaan pekerjaan berbasis Kanban Board (*To Do, In Progress, Review, Completed, Blocked*) dan List View.
   - **Mendukung Drag & Drop:** Geser kartu langsung menggunakan **kursor mouse** atau **sentuhan jari** pada layar sentuh mobile/tablet, serta opsi dropdown manual.
2. **Dashboard Utama:** Ringkasan progres riset, Today's Focus, Upcoming Deadlines, grafik 6 pilar riset, dan audit aktivitas.
3. **Proposal & Revisi Naskah:** Matriks catatan perbaikan Reviewer 1 & Reviewer 2, outline Bab I–III, dan pencatatan snapshot berkas.
4. **Kalender & Pengingat:** Kalender bulanan, pengingat H-7, H-3, H-1, jadwal bimbingan, dan tenggat sidang.
5. **Timeline Proyek:** 15 Milestone tahapan akademik dari awal hingga pengesahan.
6. **Konsultasi Dosen:** Pencatatan log bimbingan, rekomendasi dosen, dan bank pertanyaan pra-konsultasi.
7. **Dataset Management:** Audit korpus awal 374 judul SITA, grafik distribusi tahunan, dan rasio Reguler vs Alih Kredit.
8. **Literature & Mendeley:** Matriks komparasi paper ilmiah (Blei 2003, RESTI 2022, Qiang 2020) dan ekspor BibTeX.
9. **Research Experiments:** Preprocessing bahasa Indonesia, uji parameter LDA ($K, \alpha, \beta$), dan grafik Topic Coherence ($C_v$).
10. **Progress Logbook:** Log harian riset terstruktur, durasi pengerjaan, dan ekspor CSV.
11. **Document Center:** Repositori berkas naskah, dataset, diagram arsitektur, dan surat izin penelitian.
12. **Seminar & Sidang:** Bank pertanyaan dewan penguji seputar LDA, rating kesiapan, dan Mock Defense simulator interaktif.
13. **Settings & Backup:** Pengaturan profil akademik, preferensi tema, dan ekspor cadangan data JSON.

---

## 💻 Panduan Menjalankan Sistem Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) v18+ atau v20+ / v22+
- MySQL / MariaDB (misal via XAMPP) berjalan pada port 3306
- Git

### Langkah Instalasi

1. **Clone Repositori:**
   ```bash
   git clone https://github.com/<username-github-anda>/<nama-repo>.git
   cd <nama-repo>
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment (`.env`):**
   Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Pastikan konfigurasi `DATABASE_URL` sesuai dengan MySQL Anda (default database: `pa_companion`).

4. **Inisialisasi Database:**
   ```bash
   npx prisma db push
   npx prisma generate
   node prisma/seed.js
   ```

5. **Jalankan Aplikasi:**
   ```bash
   npm run dev
   ```
   Buka browser di: **`http://localhost:3000`**

---

## 📄 Lisensi
Proyek Akademik Pribadi — Latifa Keysha (D4 TRPL Politeknik Negeri Padang).
