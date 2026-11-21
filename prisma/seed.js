const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data for PA Companion...');

  // 1. Create Default User (Latifa Keysha)
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'latifa.keysha@ti.pnp.ac.id' },
    update: {},
    create: {
      name: 'Latifa Keysha',
      email: 'latifa.keysha@ti.pnp.ac.id',
      password: hashedPassword,
      nim: '2211082001',
      prodi: 'D4 Teknologi Rekayasa Perangkat Lunak',
      institution: 'Politeknik Negeri Padang',
      avatar: '/avatars/latifa.png',
      role: 'STUDENT',
    },
  });

  console.log('User created:', user.name);

  // 2. Clear previous project data if any
  const existingProject = await prisma.project.findFirst({
    where: { userId: user.id },
  });

  if (existingProject) {
    await prisma.project.delete({ where: { id: existingProject.id } });
  }

  // 3. Create Project
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      title: 'Pengembangan Sistem Pemetaan Distribusi dan Tren Topik Tugas Akhir Mahasiswa D4 TRPL pada SITA Menggunakan Latent Dirichlet Allocation (LDA)',
      shortTitle: 'Pemetaan Topik TA TRPL - LDA',
      academicYear: '2026/2027',
      semester: 'Genap',
      category: 'D4 TRPL (Reguler & Alih Kredit)',
      status: 'REVISION',
      targetCompletion: new Date('2027-01-31'),
      description: 'Sistem komputasi text mining berbasis Latent Dirichlet Allocation (LDA) untuk memetakan distribusi tematik dan tren temporal topik Tugas Akhir mahasiswa TRPL pada Sistem Informasi Tugas Akhir (SITA) PNP.',
      overallProgress: 42,
    },
  });

  console.log('Project created:', project.shortTitle);

  // 4. Create Supervisors
  const sup1 = await prisma.supervisor.create({
    data: {
      projectId: project.id,
      name: 'Dr. Eng. Ir. Riko Ervil, M.Kom',
      roleTitle: 'Pembimbing 1 (Utama)',
      position: 'Dosen Senior KBK Rekayasa Perangkat Lunak & Sistem Cerdas',
      phone: '+62 812-6677-8899',
      email: 'riko.ervil@pnp.ac.id',
      consultationPreferences: 'Tatap muka di Ruang Jurusan TI setiap Selasa & Kamis jam 10.00-12.00. Konfirmasi via WA H-1 dengan draft naskah PDF.',
    },
  });

  const sup2 = await prisma.supervisor.create({
    data: {
      projectId: project.id,
      name: 'Fitri Nova, S.T., M.Kom',
      roleTitle: 'Pembimbing 2 (Pendamping)',
      position: 'Dosen KBK Sistem Informasi & Data',
      phone: '+62 813-1122-3344',
      email: 'fitri.nova@pnp.ac.id',
      consultationPreferences: 'Fleksibel via Google Meet atau offline Rabu jam 13.30. Fokus pada perancangan arsitektur dan implementasi UI/UX.',
    },
  });

  // 5. Create Reviewers & Critical Review Comments
  const rev1 = await prisma.reviewer.create({
    data: {
      projectId: project.id,
      name: 'Reviewer 1',
      role: 'Reviewer 1',
      title: null,
      institution: 'Politeknik Negeri Padang',
      email: null,
      notes: 'Fokus kuat pada keabsahan dataset, metodologi text mining, dan validitas korpus dokumen.',
    },
  });

  const rev2 = await prisma.reviewer.create({
    data: {
      projectId: project.id,
      name: 'Reviewer 2',
      role: 'Reviewer 2',
      title: null,
      institution: 'Politeknik Negeri Padang',
      email: null,
      notes: 'Fokus pada arsitektur sistem, integrasi SITA, format penulisan, dan kejelasan implementasi teknis.',
    },
  });

  // Initial Proposal Version
  const propV1 = await prisma.proposalVersion.create({
    data: {
      projectId: project.id,
      versionName: 'v1.0 - Draft Proposal Awal Sempro',
      versionNumber: 1,
      changedChapters: 'BAB I, BAB II, BAB III (Naskah Lengkap Awal)',
      changeSummary: 'Pengajuan draft proposal untuk seminar proposal Proyek Akhir. Berisi latar belakang, metodologi LDA, dan dataset awal berbasis judul 374 rekaman.',
      fileDocx: '/uploads/proposals/Proposal_LatifaKeysha_v1.0.docx',
      filePdf: '/uploads/proposals/Proposal_LatifaKeysha_v1.0.pdf',
      approvalStatus: 'REVISION_NEEDED',
      revisionNotes: 'Perlu revisi sesuai catatan Reviewer 1 (ekspansi korpus ke abstrak/kesimpulan) dan Reviewer 2 (typo, bahasa pemrograman, dan integrasi SITA).',
      createdAt: new Date('2026-10-25'),
    },
  });

  // Critical Reviewer Comments (MUST REMAIN "Belum dikerjakan" as explicitly instructed!)
  const revComment1 = await prisma.reviewerComment.create({
    data: {
      projectId: project.id,
      reviewerId: rev1.id,
      proposalVersionId: propV1.id,
      reviewDate: new Date('2026-11-05'),
      evaluationAspect: 'Data Penelitian & Validitas Korpus',
      originalComment: 'Penelitian tidak cukup jika hanya menggunakan judul sebagai dataset. Judul Tugas Akhir sangat pendek dan memiliki sparsity tinggi. Reviewer meminta analisis isi Tugas Akhir, minimal mencakup abstrak dan kesimpulan untuk menghasilkan topik LDA yang koheren dan representatif.',
      chapterRelated: 'BAB I & BAB III',
      priority: 'Critical',
      studentAnalysis: 'Dataset awal 374 hanya berupa teks judul. Rata-rata panjang judul hanya 9-14 kata sehingga distribusi kata (Bag-of-Words) sangat jarang. Perlu mengajukan permohonan pengambilan data abstrak dan kesimpulan ke pengelola SITA PNP atau menyusun skema augmentasi data.',
      repairPlan: '1. Menemui admin/pengelola SITA PNP untuk permohonan data teks abstrak TA 2021-2026. 2. Memperbarui bab III mengenai korpus penelitian (apakah multi-field: judul + abstrak). 3. Dokumentasikan perbandingan performa model judul vs teks abstrak.',
      status: 'Belum dikerjakan',
    },
  });

  const revComment2 = await prisma.reviewerComment.create({
    data: {
      projectId: project.id,
      reviewerId: rev2.id,
      proposalVersionId: propV1.id,
      reviewDate: new Date('2026-11-05'),
      evaluationAspect: 'Format & Tata Bahasa',
      originalComment: 'Memperbaiki kesalahan ketik (typo) di seluruh naskah proposal, standarisasi istilah asing dalam format miring (italic), dan penyelarasan format sitasi IEEE.',
      chapterRelated: 'Seluruh Naskah (BAB I, II, III)',
      priority: 'Medium',
      studentAnalysis: 'Ditemukan beberapa istilah seperti "preprocessing", "tokenization", "topic coherence" belum konsisten cetak miring. Ada salah pengetikan kata penghubung dan format daftar pustaka.',
      repairPlan: 'Melakukan proofreading menyeluruh naskah proposal bab 1 sampai 3 menggunakan checklist tata bahasa akademis.',
      status: 'Belum dikerjakan',
    },
  });

  const revComment3 = await prisma.reviewerComment.create({
    data: {
      projectId: project.id,
      reviewerId: rev2.id,
      proposalVersionId: propV1.id,
      reviewDate: new Date('2026-11-05'),
      evaluationAspect: 'Spesifikasi Teknis & Bahasa Pemrograman',
      originalComment: 'Memperjelas bahasa pemrograman yang digunakan untuk preprocessing dan pemodelan LDA, serta library spesifik yang dipakai (misal Gensim, Scikit-learn, atau NLTK/Sastrawi).',
      chapterRelated: 'BAB III — Perancangan & Implementasi',
      priority: 'High',
      studentAnalysis: 'Bab III sebelumnya hanya menyebutkan "menggunakan algoritma LDA" tanpa merinci stack eksekusi (Python 3.12, Gensim untuk LDA multicore, Sastrawi untuk Indonesian stemming, dan Next.js untuk dashboard visualisasi).',
      repairPlan: 'Menambahkan subbab 3.4 Analisis Kebutuhan Perangkat Lunak dengan rincian environment Python, dependensi library, serta skema komunikasi API ke sistem web.',
      status: 'Belum dikerjakan',
    },
  });

  const revComment4 = await prisma.reviewerComment.create({
    data: {
      projectId: project.id,
      reviewerId: rev2.id,
      proposalVersionId: propV1.id,
      reviewDate: new Date('2026-11-05'),
      evaluationAspect: 'Arsitektur & Integrasi Sistem',
      originalComment: 'Menjelaskan bagaimana sistem dipakai secara operasional: apakah sistem terintegrasi langsung (live API) ke database SITA PNP, atau dikelola oleh admin/koordinator prodi secara berkala (batch export-import) untuk pembaruan data setiap tahun ajaran.',
      chapterRelated: 'BAB III — Perancangan Sistem & Batasan Masalah',
      priority: 'High',
      studentAnalysis: 'Batasan akses terhadap database live SITA PNP memerlukan izin khusus dari Unit TIPD PNP. Model batch processing melalui modul upload dataset tahunan oleh admin prodi lebih realistis dan aman.',
      repairPlan: 'Memperjelas use case diagram, arsitektur operasional (Batch Processing vs Direct API), dan mempertegas batasan masalah di Bab 1.5.',
      status: 'Belum dikerjakan',
    },
  });

  // 6. Create Milestones (15 Academic Stages)
  const milestonesData = [
    { order: 1, title: 'Persiapan & Penentuan Topik', status: 'COMPLETED', isCompleted: true, desc: 'Eksplorasi permasalahan Tugas Akhir di prodi TRPL dan persetujuan topik LDA oleh Koordinator PA.' },
    { order: 2, title: 'Studi Literatur & State-of-the-Art', status: 'IN_PROGRESS', isCompleted: false, desc: 'Kajian komparatif algoritma topic modeling, evaluasi Coherence Score, dan text mining bahasa Indonesia.' },
    { order: 3, title: 'Pengumpulan Dataset Awal SITA', status: 'COMPLETED', isCompleted: true, desc: 'Penerimaan dataset judul TA TRPL 2021-2026 sebanyak 374 rekaman.' },
    { order: 4, title: 'Penyusunan Naskah Proposal (BAB I - III)', status: 'COMPLETED', isCompleted: true, desc: 'Penyusunan naskah proposal draft v1.0 dan konsultasi pembimbing.' },
    { order: 5, title: 'Seminar Proposal (Sempro)', status: 'COMPLETED', isCompleted: true, desc: 'Presentasi proposal di hadapan Dosen Penguji dan Reviewer.' },
    { order: 6, title: 'Revisi Proposal Pasca Sempro', status: 'IN_PROGRESS', isCompleted: false, desc: 'Menyelesaikan 4 poin revisi dari Reviewer 1 dan Reviewer 2.' },
    { order: 7, title: 'Pengolahan & Ekspansi Dataset', status: 'UPCOMING', isCompleted: false, desc: 'Pembersihan data, eksplorasi korpus abstrak, penanganan noise, dan verifikasi holdout 2026.' },
    { order: 8, title: 'Eksperimen Preprocessing & Pemodelan LDA', status: 'UPCOMING', isCompleted: false, desc: 'Uji parameter K (topik 3-15), alpha, beta, serta variasi stopword dan stemming.' },
    { order: 9, title: 'Evaluasi Model & Validasi Pakar', status: 'UPCOMING', isCompleted: false, desc: 'Pengukuran Coherence Cv, Topic Diversity, Redundancy, dan validasi label topik bersama dosen KBK.' },
    { order: 10, title: 'Implementasi Sistem PA & Visualisasi Tren', status: 'UPCOMING', isCompleted: false, desc: 'Pembangunan web dashboard distribusi topik dan visualisasi tren interaktif.' },
    { order: 11, title: 'Pengujian Sistem (Black Box & UAT)', status: 'UPCOMING', isCompleted: false, desc: 'Pengujian fungsionalitas sistem dan User Acceptance Testing oleh admin/kaprodi.' },
    { order: 12, title: 'Penyusunan Naskah Laporan Akhir (BAB I - V)', status: 'UPCOMING', isCompleted: false, desc: 'Penulisan pembahasan hasil, kesimpulan, dan penyusunan lampiran penelitian.' },
    { order: 13, title: 'Seminar Hasil (Semhas)', status: 'UPCOMING', isCompleted: false, desc: 'Pemaparan hasil penelitian, model final LDA, dan demo sistem.' },
    { order: 14, title: 'Sidang Tugas Akhir', status: 'UPCOMING', isCompleted: false, desc: 'Ujian komprehensif Proyek Akhir di hadapan dewan penguji.' },
    { order: 15, title: 'Revisi Akhir & Pengumpulan Berkas', status: 'UPCOMING', isCompleted: false, desc: 'Penyelesaian revisi sidang, penandatanganan pengesahan, dan submit repositori perpustakaan.' },
  ];

  const createdMilestones = [];
  for (const m of milestonesData) {
    const created = await prisma.milestone.create({
      data: {
        projectId: project.id,
        order: m.order,
        title: m.title,
        description: m.desc,
        status: m.status,
        isCompleted: m.isCompleted,
        completedAt: m.isCompleted ? new Date('2026-11-04') : null,
        targetDate: new Date(2026, 10 + Math.floor(m.order / 3), (m.order * 5) % 28 + 1),
      },
    });
    createdMilestones.push(created);
  }

  // 7. Create Proposal Sections (Structured BAB I - III)
  const sectionsData = [
    // BAB I
    { chapter: 'BAB I', subSectionCode: '1.1', title: 'Latar Belakang', status: 'Perlu revisi', notes: 'Perkuat urgensi analisis topik Tugas Akhir dan alasan pemilihan metode LDA.' },
    { chapter: 'BAB I', subSectionCode: '1.2', title: 'Rumusan Masalah', status: 'Sedang dikerjakan', notes: 'Fokuskan pada akurasi klaster topik dan tren temporal 2021-2026.' },
    { chapter: 'BAB I', subSectionCode: '1.3', title: 'Tujuan Penelitian', status: 'Disetujui', notes: 'Menghasilkan peta topik dan tren tematik mahasiswa D4 TRPL.' },
    { chapter: 'BAB I', subSectionCode: '1.4', title: 'Manfaat Penelitian', status: 'Disetujui', notes: 'Bermanfaat bagi koordinator PA dalam monitoring sebaran topik riset.' },
    { chapter: 'BAB I', subSectionCode: '1.5', title: 'Batasan Masalah', status: 'Perlu revisi', notes: 'Perjelas integrasi SITA: operasional batch processing admin vs direct API.' },
    // BAB II
    { chapter: 'BAB II', subSectionCode: '2.1', title: 'Penelitian Terkait', status: 'Sedang dikerjakan', notes: 'Tambahkan matriks komparasi 8 jurnal LDA bahasa Indonesia terkini.' },
    { chapter: 'BAB II', subSectionCode: '2.2', title: 'Teori Penunjang (Text Mining & LDA)', status: 'Disetujui', notes: 'Konsep Dirichlet Distribution, Bag of Words, dan Coherence Cv.' },
    // BAB III
    { chapter: 'BAB III', subSectionCode: '3.1', title: 'Alur Penelitian', status: 'Disetujui', notes: 'Diagram alur CRISP-DM disesuaikan untuk pengolahan teks.' },
    { chapter: 'BAB III', subSectionCode: '3.2', title: 'Studi Literatur', status: 'Disetujui', notes: 'Proses seleksi referensi Scopus/Sinta.' },
    { chapter: 'BAB III', subSectionCode: '3.3', title: 'Pengumpulan Data', status: 'Perlu revisi', notes: 'Sesuai catatan Reviewer 1: jelaskan rencana ekspansi korpus abstrak TA.' },
    { chapter: 'BAB III', subSectionCode: '3.4', title: 'Analisis Kebutuhan Sistem', status: 'Sedang dikerjakan', notes: 'Spesifikasi library Python dan arsitektur Next.js (Reviewer 2).' },
    { chapter: 'BAB III', subSectionCode: '3.5', title: 'Perancangan Sistem', status: 'Sedang dikerjakan', notes: 'Use Case, Activity Diagram, dan skema database.' },
    { chapter: 'BAB III', subSectionCode: '3.6', title: 'Tahapan Preprocessing Teks', status: 'Sedang dikerjakan', notes: 'Case folding, cleaning simbol, tokenisasi, normalisasi slang/singkatan, stopword, stemming.' },
    { chapter: 'BAB III', subSectionCode: '3.7', title: 'Pemodelan Topic Modeling (LDA)', status: 'Sedang dikerjakan', notes: 'Penentuan Hyperparameter Alpha, Beta, dan tuning K topics.' },
    { chapter: 'BAB III', subSectionCode: '3.8', title: 'Evaluasi Model', status: 'Belum dikerjakan', notes: 'Formulasi Coherence Cv, Topic Diversity, dan pengujian pakar KBK.' },
    { chapter: 'BAB III', subSectionCode: '3.9', title: 'Pemetaan Distribusi dan Tren Topik', status: 'Belum dikerjakan', notes: 'Algoritma agregasi tahunan dan komparasi Reguler vs Alih Kredit.' },
    { chapter: 'BAB III', subSectionCode: '3.10', title: 'Implementasi Sistem Web', status: 'Belum dikerjakan', notes: 'Pembangunan antarmuka dashboard dan grafik analitik.' },
    { chapter: 'BAB III', subSectionCode: '3.11', title: 'Pengujian Sistem', status: 'Belum dikerjakan', notes: 'Skenario Black Box Testing dan UAT dengan pengguna.' },
    { chapter: 'BAB III', subSectionCode: '3.12', title: 'Hasil yang Diharapkan', status: 'Disetujui', notes: 'Model topik representatif dan dashboard visualisasi siap pakai.' },
    { chapter: 'BAB III', subSectionCode: '3.13', title: 'Jadwal Pelaksanaan Proyek Akhir', status: 'Disetujui', notes: 'Gantt chart jadwal pelaksanaan semester genap 2026/2027.' },
  ];

  for (const s of sectionsData) {
    await prisma.proposalSection.create({
      data: {
        projectId: project.id,
        chapter: s.chapter,
        subSectionCode: s.subSectionCode,
        title: s.title,
        status: s.status,
        notes: s.notes,
        contentOutline: `Rangkuman outline untuk subbab ${s.subSectionCode} ${s.title}`,
      },
    });
  }

  // 8. Create Tasks across different categories & statuses
  const revMilestone = createdMilestones[5]; // Revisi Proposal
  const dataMilestone = createdMilestones[6]; // Pengolahan Dataset

  const task1 = await prisma.task.create({
    data: {
      projectId: project.id,
      milestoneId: revMilestone.id,
      reviewerCommentId: revComment1.id,
      title: 'Koordinasi dengan Pengelola SITA untuk Permohonan Ekstraksi Abstrak TA',
      description: 'Menindaklanjuti masukan Reviewer 1: Mengajukan surat permohonan data teks abstrak dan kesimpulan TA 2021-2026 kepada koordinator PA / admin SITA.',
      category: 'Revisi Reviewer',
      priority: 'Critical',
      status: 'In Progress',
      startDate: new Date('2026-11-15'),
      deadline: new Date('2026-11-28'),
      subtasks: {
        create: [
          { title: 'Menyiapkan draf surat izin penelitian prodi', isCompleted: true },
          { title: 'Konsultasi ke Pembimbing 1 terkait format permintaan data', isCompleted: true },
          { title: 'Menemui admin SITA di laboratorium komputer TRPL', isCompleted: false },
          { title: 'Verifikasi kelengkapan dokumen abstrak yang dapat diekspor', isCompleted: false },
        ],
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      projectId: project.id,
      milestoneId: revMilestone.id,
      reviewerCommentId: revComment2.id,
      title: 'Perbaikan Typo, Format Istilah Asing, dan Standarisasi Sitasi IEEE',
      description: 'Menindaklanjuti masukan Reviewer 2: Melakukan pengecekan menyeluruh kata asing (italic) dan memperbaiki pengetikan pada Bab I - III.',
      category: 'Revisi Reviewer',
      priority: 'Medium',
      status: 'To Do',
      startDate: new Date('2026-11-20'),
      deadline: new Date('2026-12-02'),
      subtasks: {
        create: [
          { title: 'Scan kata asing: preprocessing, dataset, tokenization, topic coherence', isCompleted: false },
          { title: 'Cek kesesuaian penulisan nama penulis pada sitasi tubuh naskah', isCompleted: false },
          { title: 'Singkronisasi daftar pustaka dengan Mendeley', isCompleted: false },
        ],
      },
    },
  });

  const task3 = await prisma.task.create({
    data: {
      projectId: project.id,
      milestoneId: revMilestone.id,
      reviewerCommentId: revComment3.id,
      title: 'Perjelas Spesifikasi Bahasa Pemrograman dan Library di Bab III',
      description: 'Menindaklanjuti masukan Reviewer 2: Mendokumentasikan Python 3.12, Gensim 4.3.2, Sastrawi, Scikit-Learn, dan arsitektur Next.js di subbab 3.4.',
      category: 'Proposal',
      priority: 'High',
      status: 'To Do',
      startDate: new Date('2026-11-22'),
      deadline: new Date('2026-11-30'),
      subtasks: {
        create: [
          { title: 'Tulis tabel spesifikasi software & library dependencies', isCompleted: false },
          { title: 'Jelaskan alasan teknis pemilihan Gensim multicore LDA', isCompleted: false },
          { title: 'Gambarkan diagram integrasi Python backend service dengan frontend', isCompleted: false },
        ],
      },
    },
  });

  const task4 = await prisma.task.create({
    data: {
      projectId: project.id,
      milestoneId: revMilestone.id,
      reviewerCommentId: revComment4.id,
      title: 'Uraikan Skema Operasional Sistem: Direct API vs Batch Admin Update',
      description: 'Menindaklanjuti masukan Reviewer 2: Menjelaskan arsitektur operasional pembaruan data tahunan oleh pengelola prodi di Bab I.5 dan Bab III.5.',
      category: 'Proposal',
      priority: 'High',
      status: 'To Do',
      startDate: new Date('2026-11-22'),
      deadline: new Date('2026-11-30'),
      subtasks: {
        create: [
          { title: 'Buat Activity Diagram alur batch upload oleh koordinator prodi', isCompleted: false },
          { title: 'Tulis batasan masalah eksplisit mengenai batasan integrasi live SITA', isCompleted: false },
        ],
      },
    },
  });

  const task5 = await prisma.task.create({
    data: {
      projectId: project.id,
      milestoneId: dataMilestone.id,
      title: 'Audit Duplikasi dan Validasi Struktur Dataset Awal 374 Judul',
      description: 'Pemeriksaan integritas data historis 2021-2025 (253) dan temporal holdout 2026 (121), pengecekan kolom missing values.',
      category: 'Dataset',
      priority: 'High',
      status: 'Completed',
      startDate: new Date('2026-10-15'),
      deadline: new Date('2026-10-22'),
      isCompleted: true,
      completedAt: new Date('2026-10-21'),
    },
  });

  const task6 = await prisma.task.create({
    data: {
      projectId: project.id,
      title: 'Kompilasi Matriks Literatur 15 Jurnal Topik LDA Bahasa Indonesia',
      description: 'Menyusun tabel komparasi parameter K, teknik preprocessing, nilai Coherence Cv terbaik dari riset-riset sebelumnya.',
      category: 'Literature',
      priority: 'Medium',
      status: 'In Progress',
      startDate: new Date('2026-11-10'),
      deadline: new Date('2026-11-27'),
    },
  });

  const task7 = await prisma.task.create({
    data: {
      projectId: project.id,
      title: 'Penyusunan Agenda & Daftar Pertanyaan Konsultasi Bimbingan Berikutnya',
      description: 'Mempersiapkan opsi kompensasi jika admin SITA tidak dapat memberikan teks abstrak lengkap secara cepat.',
      category: 'Konsultasi',
      priority: 'High',
      status: 'To Do',
      startDate: new Date('2026-11-22'),
      deadline: new Date('2026-11-25'),
    },
  });

  // 9. Create Reminders (with H-7, H-3, H-1, Day-of alerts)
  await prisma.reminder.createMany({
    data: [
      {
        projectId: project.id,
        taskId: task1.id,
        title: 'Batas Konfirmasi Data Abstrak dengan Admin SITA (H-3)',
        reminderType: 'REVISION_DEADLINE',
        targetDate: new Date('2026-11-25'),
        reminderTime: '09:00',
        priority: 'Critical',
        notes: 'Pastikan surat pengantar prodi sudah ditandatangani sebelum jam 10 pagi.',
      },
      {
        projectId: project.id,
        taskId: task7.id,
        title: 'Jadwal Bimbingan Mingguan dengan Pembimbing 1 (Dr. Riko Ervil)',
        reminderType: 'SUPERVISOR_CONSULTATION',
        targetDate: new Date('2026-11-26'),
        reminderTime: '10:00',
        priority: 'High',
        notes: 'Bawa naskah proposal terupdate dan list progress revisi reviewer.',
      },
      {
        projectId: project.id,
        taskId: task3.id,
        title: 'Deadline Internal Submit Revisi Proposal Bab I - III',
        reminderType: 'PROPOSAL_SUBMISSION',
        targetDate: new Date('2026-12-05'),
        reminderTime: '17:00',
        priority: 'Critical',
        notes: 'Target verifikasi pembimbing sebelum masuk ke tahapan eksperimen korpus.',
      },
      {
        projectId: project.id,
        title: 'Evaluasi Mingguan Logbook & Target Riset PA',
        reminderType: 'PERSONAL',
        targetDate: new Date('2026-11-28'),
        reminderTime: '16:00',
        priority: 'Medium',
        notes: 'Rangkum seluruh aktivitas minggu ke-4 November ke dalam laporan mingguan.',
      },
    ],
  });

  // 10. Calendar Events
  await prisma.calendarEvent.createMany({
    data: [
      {
        projectId: project.id,
        title: 'Konsultasi Pembimbing 1 - Progress Revisi Reviewer',
        description: 'Membahas progres penanganan catatan Reviewer 1 (abstrak) dan Reviewer 2 di Ruang Jurusan TI.',
        eventType: 'CONSULTATION',
        startDate: new Date('2026-11-26T10:00:00'),
        endDate: new Date('2026-11-26T11:30:00'),
        location: 'Ruang Dosen TI PNP',
        status: 'SCHEDULED',
      },
      {
        projectId: project.id,
        title: 'Pertemuan dengan Pengelola Server SITA PNP',
        description: 'Membahas kemungkinan perizinan dump data abstrak Tugas Akhir 2021-2026.',
        eventType: 'DEADLINE',
        startDate: new Date('2026-11-25T09:30:00'),
        endDate: new Date('2026-11-25T11:00:00'),
        location: 'Laboratorium Komputer 2 TI PNP',
        status: 'SCHEDULED',
      },
      {
        projectId: project.id,
        title: 'Seminar Proposal Mahasiswa TRPL (Selesai)',
        description: 'Presentasi proposal skripsi di hadapan Reviewer 1 dan Reviewer 2.',
        eventType: 'SEMINAR',
        startDate: new Date('2026-11-05T08:30:00'),
        endDate: new Date('2026-11-05T10:00:00'),
        location: 'Ruang Sidang Jurusan TI',
        status: 'COMPLETED',
      },
    ],
  });

  // 11. Consultation Logs & Question Bank
  const c1 = await prisma.consultation.create({
    data: {
      projectId: project.id,
      supervisorId: sup1.id,
      consultationDate: new Date('2026-11-12'),
      mediaType: 'Offline / Tatap Muka',
      chapterDiscussed: 'Hasil Sempro & Strategi Revisi Reviewer',
      questionsAsked: 'Bagaimana langkah terbaik menyikapi permintaan Reviewer 1 terkait keharusan dataset abstrak, mengingat SITA belum memiliki fitur ekspor abstrak terpusat?',
      supervisorFeedback: 'Dosen Pembimbing 1 mengarahkan agar Latifa terlebih dahulu membuat surat resmi permohonan data ke Koordinator PA dan pengelola TIPD. Jika data abstrak tidak lengkap untuk tahun 2021-2022, buat batasan tegas bahwa korpus utama mencakup judul + abstrak yang tersedia, serta lakukan uji perbandingan model.',
      decisionResult: 'Tetap usahakan perolehan data abstrak. Bab III harus mencantumkan dua rencana (skenario utama: Judul + Abstrak; skenario fallback: Judul diperkaya dengan kamus kata kunci SITA).',
      nextActionTasks: 'Susun draf surat izin permohonan data dan diskusikan kembali hasil pertemuan dengan admin SITA minggu depan.',
      followupDeadline: new Date('2026-11-26'),
      status: 'ACTION_REQUIRED',
    },
  });

  await prisma.consultationQuestion.createMany({
    data: [
      {
        projectId: project.id,
        supervisorId: sup1.id,
        questionText: 'Apakah jika data abstrak hanya tersedia untuk 70% dari 374 judul, sisa dokumen dieksklusi atau diisi dengan judul saja?',
        category: 'Dataset',
        status: 'UNASKED',
      },
      {
        projectId: project.id,
        supervisorId: sup2.id,
        questionText: 'Apakah visualisasi tren topik per tahun lebih baik menggunakan diagram area bertumpuk (stacked area) atau line chart interaktif?',
        category: 'Sistem & UI/UX',
        status: 'UNASKED',
      },
      {
        projectId: project.id,
        supervisorId: sup1.id,
        questionText: 'Berapa rentang nilai K topik yang disarankan untuk diuji pada korpus tugas akhir vokasi TRPL?',
        category: 'Metodologi',
        status: 'ASKED',
        answerNotes: 'Disarankan uji rentang K antara 4 hingga 12 topik dengan evaluasi grafik Coherence Cv dan elbow method.',
      },
    ],
  });

  // 12. Dataset Management & Initial Records (Section 19 Data)
  const initialDataset = await prisma.dataset.create({
    data: {
      projectId: project.id,
      name: 'Dataset Judul Tugas Akhir D4 TRPL SITA PNP (Title-Based Initial)',
      currentVersion: 'v1.0-raw-title',
      receivedDate: new Date('2026-10-12'),
      source: 'SITA PNP (Sistem Informasi Tugas Akhir Politeknik Negeri Padang)',
      initialCount: 374,
      cleanedCount: 374,
      duplicatesRemoved: 0,
      finalCount: 374,
      regularCount: 335,
      alihKreditCount: 39,
      historicalPeriod: '2021–2025 (253 rekaman)',
      holdoutPeriod: '2026 (121 rekaman temporal holdout)',
      temporalHoldoutCount: 121,
      verificationStatus: 'INITIAL_TITLE_ONLY',
      description: 'PERHATIAN: Dataset 374 judul ini adalah dataset awal berbasis judul saja, BUKAN dataset abstrak dan kesimpulan yang diminta oleh Reviewer 1. Berdasarkan catatan Reviewer 1, data ini belum mencukupi untuk pemodelan isi dokumen Tugas Akhir akhir.',
      notes: 'Tanggal ekspor aktual dari database SITA belum terkonfirmasi oleh pengelola TIPD PNP. Data diterima pada 12 Oktober 2026.',
    },
  });

  await prisma.datasetVersion.create({
    data: {
      datasetId: initialDataset.id,
      versionNumber: 1,
      versionName: 'v1.0 - Raw Title SITA Export',
      fileName: 'dataset_ta_trpl_2021_2026_titles_raw.csv',
      fileSize: 48200,
      rowCount: 374,
      columnCount: 6,
      isFinal: false,
      changeNotes: 'Data mentah judul TA TRPL dari SITA (Tahun, Jalur, Judul, Pembimbing, Status). Belum mencakup teks abstrak dan kesimpulan.',
    },
  });

  // Dataset Distributions (Visualizations: Year and Track)
  await prisma.datasetDistribution.createMany({
    data: [
      { datasetId: initialDataset.id, categoryOrYear: '2021', count: 42, percentage: 11.23, distType: 'YEAR' },
      { datasetId: initialDataset.id, categoryOrYear: '2022', count: 48, percentage: 12.83, distType: 'YEAR' },
      { datasetId: initialDataset.id, categoryOrYear: '2023', count: 51, percentage: 13.64, distType: 'YEAR' },
      { datasetId: initialDataset.id, categoryOrYear: '2024', count: 54, percentage: 14.44, distType: 'YEAR' },
      { datasetId: initialDataset.id, categoryOrYear: '2025', count: 58, percentage: 15.51, distType: 'YEAR' },
      { datasetId: initialDataset.id, categoryOrYear: '2026 (Holdout)', count: 121, percentage: 32.35, distType: 'YEAR' },
      { datasetId: initialDataset.id, categoryOrYear: 'D4 TRPL Reguler', count: 335, percentage: 89.57, distType: 'TRACK' },
      { datasetId: initialDataset.id, categoryOrYear: 'D4 TRPL Alih Kredit', count: 39, percentage: 10.43, distType: 'TRACK' },
    ],
  });

  // 13. Research References
  const ref1 = await prisma.researchReference.create({
    data: {
      projectId: project.id,
      title: 'Latent Dirichlet Allocation',
      authors: 'David M. Blei, Andrew Y. Ng, Michael I. Jordan',
      year: 2003,
      publicationVenue: 'Journal of Machine Learning Research (JMLR)',
      volume: '3',
      issue: 'Jan',
      pages: '993-1022',
      doi: '10.1162/jmlr.2003.3.4-5.993',
      url: 'https://www.jmlr.org/papers/volume3/blei03a/blei03a.pdf',
      method: 'Generative Probabilistic Topic Modeling (LDA)',
      datasetInfo: 'Associated Press (AP) corpus dan Reuters-21578',
      researchFindings: 'Memperkenalkan model Bayesian 3-tingkat untuk mengekstrak topik laten tanpa supervisi dari kumpulan korpus dokumen teks besar.',
      advantages: 'Mengatasi kelemahan pLSA dalam generalisasi dokumen baru dan memiliki landasan probabilitas yang kokoh.',
      limitations: 'Sensitif terhadap penentuan hyperparameter prior Alpha dan Beta serta membutuhkan korpus dengan densitas kata yang memadai.',
      relevanceToThesis: 'Pondasi matematis utama untuk metode topic modeling Proyek Akhir ini.',
      chaptersCiting: 'BAB II (2.2), BAB III (3.7)',
      isCited: true,
      validationStatus: 'VERIFIED',
    },
  });

  const ref2 = await prisma.researchReference.create({
    data: {
      projectId: project.id,
      title: 'Optimizing Topic Coherence and Interpretability in Indonesian Short Texts',
      authors: 'R. H. Prasetyo, S. W. Iriananda, A. F. Hidayatullah',
      year: 2022,
      publicationVenue: 'IEEE Access / Jurnal RESTI',
      volume: '6',
      issue: '2',
      pages: '215-224',
      doi: '10.29207/resti.v6i2.3891',
      method: 'LDA + N-Gram Preprocessing + Custom Indonesian Stopwords',
      datasetInfo: '850 Dokumen Abstrak Skripsi Bidang Ilmu Komputer dalam Bahasa Indonesia',
      researchFindings: 'Penerapan N-Gram (unigram + bigram) dan penghilangan kata stopword spesifik akademik meningkatkan nilai Coherence Cv sebesar 14.8%.',
      advantages: 'Memberikan acuan daftar stopword akademik bahasa Indonesia (misal: "penelitian", "metode", "berdasarkan", "hasil").',
      limitations: 'Stemming bahasa Indonesia (Sastrawi) menambah waktu komputasi secara signifikan tanpa selalu meningkatkan coherence score.',
      relevanceToThesis: 'Menjadi acuan strategi preprocessing dan perbandingan stemming vs non-stemming pada Bab III.',
      chaptersCiting: 'BAB II (2.1), BAB III (3.6)',
      isCited: true,
      validationStatus: 'VERIFIED',
    },
  });

  const ref3 = await prisma.researchReference.create({
    data: {
      projectId: project.id,
      title: 'Exploring Topic Modeling on Short Text Data: A Comparative Study',
      authors: 'J. Qiang, Z. Qian, Y. Li, Y. Yuan, X. Wu',
      year: 2020,
      publicationVenue: 'IEEE Transactions on Knowledge and Data Engineering',
      volume: '34',
      issue: '9',
      pages: '4210-4227',
      doi: '10.1109/TKDE.2020.3032731',
      method: 'Comparative Evaluation (LDA, BTM, GSDMM, WNTM)',
      datasetInfo: 'Twitter, News Titles, and Paper Abstracts',
      researchFindings: 'Membuktikan bahwa teks yang sangat pendek (seperti judul saja tanpa abstrak) menghasilkan topik berkualitas rendah pada LDA standar akibat masalah keterbatasan kata (word sparsity). Menyarankan penggunaan abstrak lengkap atau word embeddings enrichment.',
      advantages: 'Mendukung secara ilmiah argumen Reviewer 1 bahwa dataset judul saja tidak memadai.',
      limitations: 'BTM membutuhkan komputasi biterm yang berat pada korpus besar.',
      relevanceToThesis: 'Digunakan untuk memperkuat analisis mahasiswa pada tanggapan catatan Reviewer 1 di Bab I dan Bab III.',
      chaptersCiting: 'BAB I (1.1), BAB III (3.3)',
      isCited: true,
      validationStatus: 'VERIFIED',
    },
  });

  // Reference Notes
  await prisma.referenceNote.create({
    data: {
      referenceId: ref2.id,
      noteTitle: 'Daftar Stopword Akademik Bahasa Indonesia Penting',
      content: 'Kata-kata yang harus difilter dari korpus: "penelitian", "tugas", "akhir", "pengembangan", "sistem", "informasi", "berbasis", "menggunakan", "studi", "kasus", "politeknik", "negeri", "padang". Kata-kata ini muncul di hampir 80% judul TRPL dan dapat mendominasi topik jika tidak dibersihkan.',
      tags: 'Stopword, Indonesian NLP, Preprocessing',
    },
  });

  // 14. Initial Research Experiments (Documenting baseline trials)
  const exp1 = await prisma.experiment.create({
    data: {
      projectId: project.id,
      experimentCode: 'EXP-PRE-001',
      experimentType: 'PREPROCESSING',
      name: 'Uji Pembersihan Awal Korpus Judul (374 Judul)',
      hypothesisOrGoal: 'Mengukur penurunan sparsity kata setelah case folding, normalisasi singkatan TRPL (e.g., SPK, GIS, IoT, AI), dan stopword removal dasar.',
      status: 'COMPLETED',
      notes: 'Hasil menunjukkan 374 judul hanya menghasilkan 412 kosakata unik jika unigram saja. Ini mengonfirmasi catatan Reviewer 1 bahwa korpus judul sangat minim informasi semantik.',
      executedAt: new Date('2026-10-28'),
    },
  });

  await prisma.preprocessingConfig.create({
    data: {
      experimentId: exp1.id,
      caseFolding: true,
      tokenization: true,
      normalizationDict: true,
      stopwordRemoval: true,
      ngramSetting: 'Unigram',
      stemmingMethod: 'Tanpa Stemming',
      tokenCount: 3120,
      uniqueVocabCount: 412,
      emptyDocCount: 0,
      oovRate: 0.04,
    },
  });

  const exp2 = await prisma.experiment.create({
    data: {
      projectId: project.id,
      experimentCode: 'EXP-LDA-001',
      experimentType: 'LDA',
      name: 'Baseline LDA Title-Only (K=5 Topics)',
      hypothesisOrGoal: 'Evaluasi baseline Coherence Cv menggunakan dataset awal 374 judul tanpa teks abstrak.',
      status: 'COMPLETED',
      isSelectedCandidate: false,
      notes: 'Nilai Coherence Cv hanya mencapai 0.382 (kategori rendah-sedang). Beberapa topik tumpang tindih karena banyak judul mengandung kata umum "web" dan "sistem".',
      executedAt: new Date('2026-11-02'),
    },
  });

  await prisma.ldaConfig.create({
    data: {
      experimentId: exp2.id,
      numTopicsK: 5,
      alpha: 'symmetric',
      etaBeta: 'auto',
      passes: 20,
      iterations: 200,
      randomSeed: 42,
    },
  });

  await prisma.experimentMetric.create({
    data: {
      experimentId: exp2.id,
      coherenceCv: 0.382,
      topicDiversity: 0.640,
      redundancyScore: 0.360,
      jaccardSimilarity: 0.280,
      stabilityScore: 0.710,
      expertScore: 3.2,
      interpretationNotes: 'Model baseline menunjukkan batasan nyata dari korpus judul semata. Diperlukan penambahan teks abstrak sesuai arahan Reviewer 1 untuk mendongkrak Coherence ke atas 0.500.',
    },
  });

  const topicModel1 = await prisma.topicModel.create({
    data: {
      experimentId: exp2.id,
      modelName: 'LDA Baseline Title 5 Topics',
      kValue: 5,
    },
  });

  await prisma.topic.createMany({
    data: [
      {
        topicModelId: topicModel1.id,
        topicNumber: 1,
        label: 'Sistem Informasi Manajemen & Pelayanan Publik',
        topWords: 'sistem, informasi, manajemen, pelayanan, kantor, desa, berbasis, web',
        coherenceScore: 0.412,
        interpretation: 'Didominasi topik aplikasi administratif konvensional pada instansi pemerintahan atau UMKM.',
      },
      {
        topicModelId: topicModel1.id,
        topicNumber: 2,
        label: 'Sistem Pendukung Keputusan (SPK/DSS)',
        topWords: 'pendukung, keputusan, metode, saw, ahp, topsis, pemilihan, kinerja, karyawan',
        coherenceScore: 0.445,
        interpretation: 'Klaster yang sangat jelas berisikan skripsi berbasis SPK multi-kriteria.',
      },
      {
        topicModelId: topicModel1.id,
        topicNumber: 3,
        label: 'Mobile Application & Android Development',
        topWords: 'aplikasi, android, mobile, monitoring, pemesanan, informasi, tracking',
        coherenceScore: 0.368,
        interpretation: 'Topik terkait pengembangan aplikasi bergerak.',
      },
      {
        topicModelId: topicModel1.id,
        topicNumber: 4,
        label: 'E-Commerce & Sistem Penjualan Berbasis Web',
        topWords: 'penjualan, e-commerce, toko, barang, payment, inventaris, web',
        coherenceScore: 0.354,
        interpretation: 'Banyak kata tumpang tindih dengan Topik 1 terkait framework web.',
      },
      {
        topicModelId: topicModel1.id,
        topicNumber: 5,
        label: 'Internet of Things (IoT) & Smart Devices',
        topWords: 'monitoring, sensor, iot, esp32, arduino, suhu, kendali, otomatis',
        coherenceScore: 0.332,
        interpretation: 'Topik perangkat keras cerdas dan instrumentasi.',
      },
    ],
  });

  // 15. Progress Logbooks
  await prisma.logbook.createMany({
    data: [
      {
        projectId: project.id,
        logDate: new Date('2026-11-05'),
        activity: 'Pelaksanaan Seminar Proposal dan Pencatatan Masukan Dewan Penguji',
        workSteps: 'Mempresentasikan naskah proposal di hadapan Reviewer 1 dan Reviewer 2. Mencatat setiap pertanyaan, kritik, dan rekomendasi perbaikan.',
        result: 'Proposal dinyatakan Lulus dengan Revisi. Diperoleh 4 poin utama catatan revisi terkait dataset isi TA, typo, spesifikasi library, dan model operasional sistem.',
        obstacles: 'Reviewer 1 memberikan catatan kritis bahwa analisis tidak boleh hanya mengandalkan judul TA karena keterbatasan semantik (sparsity).',
        solutions: 'Menyusun rencana koordinasi dengan pengelola SITA dan mendiskusikan alternatif ekstraksi abstrak dengan Dosen Pembimbing.',
        durationMinutes: 120,
        aiPolished: true,
      },
      {
        projectId: project.id,
        logDate: new Date('2026-11-12'),
        activity: 'Konsultasi Pasca Sempro dengan Pembimbing 1 (Dr. Riko Ervil)',
        workSteps: 'Menghadap Pembimbing 1 untuk membahas langkah taktis penyelesaian revisi Reviewer 1 dan Reviewer 2.',
        result: 'Pembimbing 1 menyetujui rencana permohonan data teks abstrak ke pengelola SITA dan meminta dibuatkan surat resmi pengantar.',
        obstacles: 'Waktu pelayanan pengelola server SITA terbatas pada hari kerja tertentu.',
        solutions: 'Membuat jadwal pertemuan khusus dan menyiapkan format struktur data yang dibutuhkan dalam format CSV/Excel.',
        durationMinutes: 90,
        aiPolished: true,
      },
      {
        projectId: project.id,
        logDate: new Date('2026-11-18'),
        activity: 'Eksplorasi Jurnal Acuan Short-Text Topic Modeling & N-Gram',
        workSteps: 'Membaca dan membedah 3 jurnal internasional mengenai penanganan sparsity pada short texts dan acuan nilai Coherence Cv.',
        result: 'Memperoleh justifikasi ilmiah mengapa penambahan teks abstrak meningkatkan coherence dan menemukan daftar stopword akademik Indonesia.',
        obstacles: 'Beberapa paper menggunakan model neural BERTopic yang membutuhkan resource GPU besar.',
        solutions: 'Fokus pada optimasi LDA klasik dengan Gensim multicore dan preprocessing terstruktur sesuai lingkup Proyek Akhir.',
        durationMinutes: 150,
        aiPolished: true,
      },
    ],
  });

  // 16. Document Center Files
  const doc1 = await prisma.document.create({
    data: {
      projectId: project.id,
      title: 'Draf Naskah Proposal Skripsi v1.0',
      category: 'Proposal',
      tags: 'Sempro, Proposal, Naskah Awal',
      currentVersion: 'v1.0',
      fileUrl: '/uploads/documents/Proposal_LatifaKeysha_v1.0.pdf',
      fileType: 'PDF',
      fileSize: 1845000,
      relatedSectionId: null,
      relatedReviewCommentId: null,
    },
  });

  await prisma.documentVersion.create({
    data: {
      documentId: doc1.id,
      versionNumber: 1,
      fileName: 'Proposal_LatifaKeysha_v1.0.pdf',
      fileUrl: '/uploads/documents/Proposal_LatifaKeysha_v1.0.pdf',
      fileSize: 1845000,
      uploadNotes: 'Naskah yang diajukan pada saat Seminar Proposal 5 November 2026.',
    },
  });

  const doc2 = await prisma.document.create({
    data: {
      projectId: project.id,
      title: 'Dataset Mentah Judul TA SITA 2021-2026 (374 Judul)',
      category: 'Dataset',
      tags: 'SITA, Raw Data, Judul, CSV',
      currentVersion: 'v1.0',
      fileUrl: '/uploads/documents/dataset_ta_trpl_2021_2026_titles_raw.csv',
      fileType: 'CSV',
      fileSize: 48200,
    },
  });

  // 17. Defense Question Bank (Seminar & Sidang Simulator)
  await prisma.defenseQuestion.createMany({
    data: [
      {
        projectId: project.id,
        category: 'Methodology / LDA',
        question: 'Mengapa Anda memilih Latent Dirichlet Allocation (LDA) dibandingkan metode clustering teks tradisional seperti K-Means atau Hierarchical Clustering?',
        suggestedAnswer: 'LDA merupakan model probabilitas generatif yang memungkinkan suatu dokumen memiliki proporsi beberapa topik sekaligus (mixed-membership model). Tugas Akhir mahasiswa TRPL sering kali bersifat multidisiplin (contoh: menggabungkan IoT dan Sistem Informasi Web), sehingga representasi probabilitas topik jauh lebih realistis daripada hard-clustering K-Means.',
        studentAnswer: 'Karena LDA adalah generative probabilistic model, sebuah skripsi bisa memiliki lebih dari 1 topik dengan bobot tertentu, tidak seperti K-Means yang hanya mengelompokkan secara kaku.',
        readinessStatus: 'SIAP',
        difficulty: 'Medium',
        order: 1,
      },
      {
        projectId: project.id,
        category: 'Reviewer Comments',
        question: 'Bagaimana Anda menindaklanjuti kritik Reviewer bahwa dataset berbasis judul saja tidak mencerminkan isi Tugas Akhir secara memadai?',
        suggestedAnswer: 'Judul dokumen memiliki sparsity kata yang sangat ekstrem (rata-rata 10 kata per judul). Berdasarkan literatur Qiang et al. (2020), keterbatasan konteks ini menyebabkan distribusi Dirichlet gagal konvergen ke topik semantik yang tajam. Saya telah memperluas korpus riset dengan mengajukan permohonan data teks abstrak dan kesimpulan TA dari SITA PNP, sehingga korpus memiliki densitas kata yang cukup untuk menghasilkan nilai Coherence Cv di atas 0.50.',
        studentAnswer: 'Kami sedang melakukan proses permohonan ekstraksi teks abstrak dari sistem SITA untuk memperluas korpus agar Coherence score model meningkat dan topik lebih representatif.',
        readinessStatus: 'SEDANG_DIPELAJARI',
        difficulty: 'Hard',
        order: 2,
      },
      {
        projectId: project.id,
        category: 'Dataset',
        question: 'Mengapa Anda membagi data menjadi 2021-2025 sebagai data historis dan 2026 sebagai temporal holdout?',
        suggestedAnswer: 'Data 2021-2025 (253 rekaman) digunakan untuk melatih model LDA dan membentuk basis distribusi topik historis. Tahun 2026 (121 rekaman) dijadikan temporal holdout untuk menguji kemampuan generalisasi model terhadap topik baru (emerging topics) yang muncul di tahun berjalan tanpa melatih ulang model dari awal.',
        studentAnswer: 'Untuk memvalidasi tren dan melihat apakah model yang dilatih pada tahun 2021-2025 mampu memetakan topik angkatan 2026 dengan baik.',
        readinessStatus: 'SIAP',
        difficulty: 'Medium',
        order: 3,
      },
      {
        projectId: project.id,
        category: 'Evaluation',
        question: 'Apa arti nilai Topic Coherence Cv dan bagaimana Anda menentukan jumlah topik K yang optimal?',
        suggestedAnswer: 'Topic Coherence Cv mengukur tingkat keterkaitan semantik kata-kata teratas (top words) dalam sebuah topik menggunakan sliding window dan Normalised Pointwise Mutual Information (NPMI). Jumlah topik K optimal dipilih pada puncak nilai Cv tertinggi sebelum kurva mengalami penurunan atau dataran tinggi (elbow point).',
        studentAnswer: 'Cv mengukur apakah kata-kata dalam satu topik masuk akal bersama-sama. Nilai K dipilih pada grafik puncak Coherence tertinggi.',
        readinessStatus: 'SEDANG_DIPELAJARI',
        difficulty: 'Hard',
        order: 4,
      },
      {
        projectId: project.id,
        category: 'System Architecture',
        question: 'Bagaimana arsitektur operasional sistem Anda digunakan oleh Program Studi TRPL setiap tahunnya?',
        suggestedAnswer: 'Sistem dirancang dengan arsitektur Batch Processing: Koordinator PA atau Admin Prodi mengunggah berkas ekspor berkala SITA (CSV/Excel) setiap akhir semester. Sistem memproses preprocessing dan inferensi model secara otomatis, lalu memperbarui visualisasi tren topik pada dashboard interaktif publik prodi.',
        studentAnswer: 'Admin prodi mengunggah data CSV dari SITA setiap tahun, lalu sistem otomatis memproses dan mengupdate grafik tren topik.',
        readinessStatus: 'SEDANG_DIPELAJARI',
        difficulty: 'Medium',
        order: 5,
      },
    ],
  });

  // 18. Defense Checklist Items
  await prisma.defenseChecklist.createMany({
    data: [
      { projectId: project.id, stage: 'SEMPRO', itemTitle: 'Naskah Proposal Bab I - III Ditandatangani Pembimbing', isRequired: true, isCompleted: true, verifiedAt: new Date('2026-11-04'), notes: 'Sudah disetujui untuk maju seminar proposal.' },
      { projectId: project.id, stage: 'SEMPRO', itemTitle: 'Slide Presentasi Seminar Proposal (Maks 15 Menit)', isRequired: true, isCompleted: true, verifiedAt: new Date('2026-11-04'), notes: 'Slide siap 12 halaman.' },
      { projectId: project.id, stage: 'SEMPRO', itemTitle: 'Dataset Awal 374 Judul dari SITA', isRequired: true, isCompleted: true, verifiedAt: new Date('2026-10-15'), notes: 'Telah terverifikasi struktur kolomnya.' },
      { projectId: project.id, stage: 'SEMHAS', itemTitle: 'Matriks Tindak Lanjut Revisi Reviewer 1 & 2', isRequired: true, isCompleted: false, notes: 'Menunggu pemenuhan data abstrak dan perbaikan naskah.' },
      { projectId: project.id, stage: 'SEMHAS', itemTitle: 'Hasil Eksperimen LDA & Grafik Coherence Score', isRequired: true, isCompleted: false, notes: 'Menunggu finalisasi korpus diperluas.' },
      { projectId: project.id, stage: 'SEMHAS', itemTitle: 'Demo Prototipe Web Dashboard Visualisasi Tren Topik', isRequired: true, isCompleted: false, notes: 'Implementasi antarmuka Next.js.' },
      { projectId: project.id, stage: 'SIDANG_AKHIR', itemTitle: 'Naskah Lengkap Laporan Akhir Bab I - V', isRequired: true, isCompleted: false },
      { projectId: project.id, stage: 'SIDANG_AKHIR', itemTitle: 'Lembar Persetujuan Sidang dari Pembimbing 1 & 2', isRequired: true, isCompleted: false },
      { projectId: project.id, stage: 'SIDANG_AKHIR', itemTitle: 'Bukti UAT / Validasi Pakar KBK RPL', isRequired: true, isCompleted: false },
    ],
  });

  // 19. Quick Capture Notes
  await prisma.quickCaptureNote.createMany({
    data: [
      {
        projectId: project.id,
        category: 'Temuan Penelitian',
        content: 'Ada istilah baru di TA 2026: "Large Language Model", "Prompt Engineering", dan "YOLOv8" yang tidak pernah muncul di TA 2021-2023. Perlu dimasukkan ke kamus normalisasi istilah.',
        isProcessed: false,
      },
      {
        projectId: project.id,
        category: 'Arahan Dosen',
        content: 'Pak Riko mengingatkan agar jangan terburu-buru menghapus stopword sebelum mengecek apakah singkatan seperti "TRPL", "PNP", "SITA" bermakna konteks penting atau sekadar noise.',
        isProcessed: false,
      },
      {
        projectId: project.id,
        category: 'Catatan Cepat',
        content: 'Perlu cek jadwal seminar hasil prodi TRPL semester ini: biasanya minggu ke-3 Januari.',
        isProcessed: false,
      },
    ],
  });

  // 20. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        projectId: project.id,
        title: 'Perhatian Revisi Reviewer 1',
        message: 'Catatan Reviewer 1 terkait keharusan dataset abstrak masih berstatus BELUM SELESAI. Segera tindak lanjuti koordinasi dengan admin SITA.',
        notificationType: 'REVIEWER_ACTION',
        priority: 'Critical',
        isRead: false,
        linkUrl: '/revisi',
      },
      {
        userId: user.id,
        projectId: project.id,
        title: 'Pengingat Konsultasi Pembimbing 1',
        message: 'Konsultasi terjadwal pada Selasa depan jam 10:00 di Ruang Dosen TI PNP. Siapkan lembar matriks revisi.',
        notificationType: 'CONSULTATION_ALERT',
        priority: 'High',
        isRead: false,
        linkUrl: '/konsultasi',
      },
      {
        userId: user.id,
        projectId: project.id,
        title: 'Dataset Awal Berbasis Judul',
        message: 'Dataset 374 judul saat ini tersimpan sebagai versi awal. Siapkan versi baru jika data abstrak sudah diperoleh.',
        notificationType: 'DEADLINE_WARNING',
        priority: 'Medium',
        isRead: true,
        linkUrl: '/dataset',
      },
    ],
  });

  // 21. Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        projectId: project.id,
        userId: user.id,
        actionType: 'CREATE',
        entityType: 'PROPOSAL',
        title: 'Mengunggah Proposal Draft v1.0',
        details: 'Proposal awal didaftarkan untuk Seminar Proposal.',
        createdAt: new Date('2026-10-25T08:00:00'),
      },
      {
        projectId: project.id,
        userId: user.id,
        actionType: 'STATUS_CHANGE',
        entityType: 'REVISION',
        title: 'Menerima Catatan Hasil Seminar Proposal',
        details: 'Reviewer 1 dan Reviewer 2 memberikan 4 butir masukan perbaikan yang ditandai sebagai belum selesai.',
        createdAt: new Date('2026-11-05T11:30:00'),
      },
      {
        projectId: project.id,
        userId: user.id,
        actionType: 'UPLOAD',
        entityType: 'DATASET',
        title: 'Mengunggah Dataset Judul SITA (374 Data)',
        details: 'Dataset judul TA TRPL 2021-2026 diimpor ke sistem dengan verifikasi status INITIAL_TITLE_ONLY.',
        createdAt: new Date('2026-10-12T14:20:00'),
      },
      {
        projectId: project.id,
        userId: user.id,
        actionType: 'CREATE',
        entityType: 'CONSULTATION',
        title: 'Mencatat Hasil Bimbingan dengan Dr. Riko Ervil',
        details: 'Arahan pembimbing terkait strategi pemenuhan data teks abstrak.',
        createdAt: new Date('2026-11-12T11:00:00'),
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
