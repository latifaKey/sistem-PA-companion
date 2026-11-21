# KEYFA PA COMPANION — PERSONAL ACADEMIC MANAGEMENT SYSTEM
## Dokumentasi Sistem, Palet Warna Soft Pink, Dark Mode & Panduan Fitur Terbaru

Dokumen ini berisi rangkuman dan penjelasan lengkap mengenai pembaruan desain dan fungsionalitas aplikasi web full-stack **Keyfa PA Companion**.

---

### Profil Mahasiswa & Proyek Akhir (Seed Context)
- **Nama Mahasiswa:** Latifa Keysha
- **NIM:** 2211082001
- **Program Studi:** D4 Teknologi Rekayasa Perangkat Lunak (TRPL)
- **Jurusan / Institusi:** Teknologi Informasi, Politeknik Negeri Padang (PNP)
- **Judul Proyek Akhir:** 
  > *"Pengembangan Sistem Pemetaan Distribusi dan Tren Topik Tugas Akhir Mahasiswa D4 TRPL pada SITA Menggunakan Latent Dirichlet Allocation (LDA)"*
- **Kategori Penelitian:** D4 TRPL Reguler & Alih Kredit
- **Status Pengerjaan:** Revisi Proposal Pasca Sempro (Tahap 6 dari 15 Milestone)
- **Target Kelulusan / Sidang:** 31 Januari 2027
- **Aplikasi Berjalan di:** `http://localhost:3000`

---

## 1. Integrasi Penuh Palet Warna: Soft Pink & Warm Cream (Mode Terang)

Sesuai palet Color Hunt (**https://colorhunt.co/palette/ffced8ffddddfff4deffe8c4**), seluruh halaman (13 modul utama, modal, filter, grafik, dan tabel) telah **100% terintegrasi sempurna** tanpa ada warna dingin atau biru/indigo yang tersisa:

| Warna | Hex Code | Karakteristik & Penggunaan dalam Mode Terang |
|---|---|---|
| **Soft Rose Pink** | `#FFCED8` | Aksen tombol aktif, border card (rounded-3xl), highlight navigasi, badge versi naskah, dan outline modal. |
| **Blush / Pale Pink** | `#FFDDDD` | Background hover, badge status revisi, pembatas grup menu sidebar, dan ring fokus formulir. |
| **Warm Cream / Ivory** | `#FFF4DE` | Warna latar belakang card sekunder, kolom input pencarian, kategori tag, dan aksen kontras teks. |
| **Soft Peach / Apricot** | `#FFE8C4` | Aksen gradien banner selamat datang, gauge bar progress, badge reviewer, dan kartu pengingat bimbingan. |
| **Terracotta / Deep Rose** | `#863043` / `#A84157` / `#C75C73` | Warna teks utama, judul menu, tombol aksi primer, ikon Lucide, serta garis kurva Coherence ($C_v$) Recharts. |

Latar belakang aplikasi menggunakan nuansa hangat nan bersih (`#FAF5F5`), memberikan kesan estetik, rapi, dan tidak membosankan untuk penggunaan sehari-hari.

---

## 2. Sistem Mode Gelap & Mode Terang (Dark / Light Theme Harmonization)

Sistem tema terang dan gelap telah diintegrasikan secara menyeluruh di seluruh aplikasi, dengan preferensi warna malam yang diekstrak langsung dari referensi pengguna:

### Palet Warna Mode Gelap (Dark Mode Harmony):
- **Latar Belakang Utama:** `#241E20` (Dark Velvet Rose-Ebony / Warm Cocoa)
- **Latar Belakang Card & Kontainer:** `#2D2528` / `#362B2F`
- **Sidebar & Header:** `#1E1719` dengan backdrop blur 90%
- **Border Card & Garis Pembatas:** `#4D383E` (lembut, tidak silau)
- **Teks Utama:** `#FFF0F3` (warm off-white yang nyaman untuk membaca jangka panjang)
- **Teks Sekunder & Muted:** `#D4B8BE` / `#A88E94`
- **Aksen Tombol & Sorotan:** `#FFCED8`, `#FFB3C6`, dan `#FFE8C4`
- **Scrollbar Mode Gelap:** Track `#2D2528`, Thumb `#5A3B44`, Hover `#863043`

### Fitur Pengubah Tema Interaktif:
1. **Header Switcher:** Tombol ikon Matahari (`Sun`) / Bulan (`Moon`) di sudut kanan atas header dengan animasi rotasi halus dan status aktif.
2. **Sidebar Switcher:** Tombol cepat pengalih tema di bagian bawah navigasi sidebar (tersedia baik saat sidebar terbuka maupun ciut/collapsed).
3. **Mobile Drawer Switcher:** Tombol toggle di bilah atas drawer navigasi mobile (khusus layar smartphone).
4. **Halaman Pengaturan (`/settings`):** Panel kartu interaktif 3 opsi:
   - ☀️ **Mode Terang:** Soft Pink & Warm Cream.
   - 🌙 **Mode Gelap:** Velvet Rose-Ebony & Cocoa (`#241E20`).
   - 💻 **Otomatis (Sistem):** Menyesuaikan preferensi OS/perangkat secara dinamis.
5. **Penyimpanan Status:** Tersimpan di `localStorage` (`pa_theme`).
6. **Zero Flash of Unstyled Theme (FOUC):** Dilengkapi skrip inline di `<head>` sehingga saat membuka atau me-refresh halaman tidak ada kedipan warna putih.

---

## 3. Fitur Drag & Drop Interaktif pada Kanban Board (/tasks)

Kini kartu pekerjaan (tasks) pada Kanban Board dapat dipindahkan secara fleksibel melalui **3 metode sekaligus**:

1. **Geser dengan Kursor Mouse (Desktop Drag & Drop):**
   - Kartu dapat diklik dan diseret (*drag*) langsung menggunakan kursor ke kolom tujuan (`To Do`, `In Progress`, `Review`, `Completed`, `Blocked`).
   - Kolom tujuan akan otomatis menyala (*glow & highlight ring*) dengan teks petunjuk *"Lepas disini ↓"*.
   - Dilengkapi area penampung kosong (*drop zone*) berpola garis putus-putus pada kolom yang belum memiliki task.

2. **Geser dengan Jari / Touch (Mobile & Tablet Finger Drag):**
   - Pada layar sentuh (*touchscreen*), cukup sentuh kartu atau ikon pegangan (*grip handle*) dan geser langsung dengan jari.
   - Mengambang lencana visual (*floating badge*) interaktif yang mengikuti ujung jari dan menunjukkan target kolom yang sedang dituju.
   - Saat jari diangkat (*release/touch end*), kartu seketika berpindah ke kolom tersebut dan tersimpan secara otomatis ke database.

3. **Pilihan Dropdown Cadangan (Dropdown Selection):**
   - Menu *dropdown* status di pojok kanan bawah setiap kartu tetap dipertahankan penuh, sehingga pengguna tetap bisa memilih status secara manual jika diinginkan tanpa harus menggeser kartu.

---

## 4. Logo Kustom & Favicon Tab Browser (Penggantian Penuh Logo Next.js)

Logo default bawaan Next.js telah diganti 100% menggunakan identitas logo kustom Keyfa PA Companion:
1. **Favicon Tab Browser (`favicon.ico`):** Multi-resolusi (16px, 32px, 48px, 64px, 128px, 256px) dengan emblem toga & buku riset.
2. **App Icon PWA / Mobile (`icon.png`):** Resolusi tinggi 192x192 untuk browser modern dan shortcut beranda.
3. **Apple Touch Icon (`apple-icon.png`):** Resolusi 180x180 untuk perangkat iOS Safari.
4. **Header Sidebar Desktop & Mobile Drawer:** Memakai `/logo-full.png` proporsional.

---

## 5. Pengelompokan Navigasi Sidebar (4 Kategori)

Seluruh 13 menu navigasi dikelompokkan secara terstruktur ke dalam **4 Kategori Logis**:

### A. PERENCANAAN & TUGAS
1. **Dashboard (`/`):** Ringkasan seluruh aktivitas, Today's Focus, Upcoming Deadlines, grafik 6 pilar riset, dan audit log.
2. **Kalender & Pengingat (`/kalender`):** Kalender bulanan, pengingat H-7, H-3, H-1, jadwal bimbingan, dan tenggat naskah.
3. **Timeline Proyek (`/timeline`):** 15 Milestone tahapan akademik dari penentuan topik hingga pengesahan naskah.
4. **Task Management (`/tasks`):** Kanban board interaktif dengan **Drag & Drop (Kursor & Jari)** serta List view.

### B. BIMBINGAN & NASKAH
5. **Proposal & Revisi (`/proposal`):** Snapshot versi proposal tanpa menimpa naskah lama, outline BAB I — III, serta matriks perbaikan catatan Reviewer 1 & 2.
6. **Konsultasi Dosen (`/konsultasi`):** Profil pembimbing, catatan arahan, keputusan, dan bank pertanyaan pra-konsultasi.
7. **Progress Logbook (`/logbook`):** Jurnal harian riset, langkah kerja, hasil, kendala, solusi, jam kerja, dan ekspor CSV.
8. **Document Center (`/documents`):** Pusat berkas penelitian (Proposal, Dataset, Surat Izin TIPD, Diagram, Naskah).

### C. DATA & EKSPERIMEN
9. **Dataset Management (`/dataset`):** Verifikasi data awal SITA (374 judul), grafik distribusi 2021–2025 vs 2026, proporsi Reguler vs Alih Kredit, dan audit eksklusi.
10. **Literature & Mendeley (`/literature`):** Katalog paper ilmiah, matriks komparasi, dan ekspor BibTeX.
11. **Research Experiments (`/experiments`):** Dokumentasi preprocessing teks bahasa Indonesia, uji parameter LDA ($K, \alpha, \beta$), grafik kurva Coherence ($C_v$), dan kandidat model terbaik.

### D. KELULUSAN & PENGATURAN
12. **Seminar & Sidang (`/seminar`):** Checklist kelengkapan berkas sidang, Bank Pertanyaan Penguji LDA, dan Simulator Mock Defense.
13. **Settings (`/settings`):** Pemilihan Tema Tampilan (Terang / Gelap / Sistem), konfigurasi profil mahasiswa, judul naskah resmi, target tanggal kelulusan, dan pencadangan database (Backup JSON).

---

## 6. Penanganan Khusus Catatan Reviewer & Dataset Awal

1. **Reviewer 1:** Menuntut analisis isi Tugas Akhir (minimal abstrak dan kesimpulan) karena judul saja memiliki *word sparsity* tinggi. Status: **BELUM SELESAI / UNRESOLVED**.
2. **Reviewer 2:** Perbaikan typo, bahasa pemrograman di Bab III, dan model operasional sistem (batch update vs live SITA). Status: **BELUM SELESAI / UNRESOLVED**.
3. **Penyebutan Dewan Penguji:** Dituliskan secara objektif dan rapi sebagai **Reviewer 1** dan **Reviewer 2** tanpa menyebutkan nama spesifik dosen penguji.
4. **Dataset 374 Judul:** Berstatus **Title-Based Initial** (Reguler: 335, Alih Kredit: 39; 2021–2025: 253, Holdout 2026: 121) dan bukan data final pemodelan isi sebelum abstrak diintegrasikan.
