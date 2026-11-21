// Resilient fallback data for offline / serverless environments (e.g. Vercel deployment before connecting cloud MySQL)

export const fallbackUser = {
  id: 'user-latifa-keysha',
  name: 'Latifa Keysha',
  email: 'latifa.keysha@ti.pnp.ac.id',
  nim: '2211082001',
  prodi: 'D4 Teknologi Rekayasa Perangkat Lunak',
  institution: 'Politeknik Negeri Padang',
  role: 'STUDENT',
};

export const fallbackSupervisors = [
  {
    id: 'sup-1',
    name: 'Dr. Eng. Ir. Riko Ervil, M.Kom',
    roleTitle: 'Pembimbing 1 (Utama)',
    position: 'Dosen Senior KBK Rekayasa Perangkat Lunak & Sistem Cerdas',
    phone: '+62 812-6677-8899',
    email: 'riko.ervil@pnp.ac.id',
    consultationPreferences: 'Tatap muka di Ruang Jurusan TI setiap Selasa & Kamis jam 10.00-12.00.',
  },
  {
    id: 'sup-2',
    name: 'Fitri Nova, S.T., M.Kom',
    roleTitle: 'Pembimbing 2 (Pendamping)',
    position: 'Dosen KBK Sistem Informasi & Data',
    phone: '+62 813-1122-3344',
    email: 'fitri.nova@pnp.ac.id',
    consultationPreferences: 'Fleksibel via Google Meet atau offline Rabu jam 13.30.',
  },
];

export const fallbackReviewers = [
  {
    id: 'rev-1',
    name: 'Reviewer 1',
    role: 'Reviewer 1',
    institution: 'Politeknik Negeri Padang',
    notes: 'Fokus kuat pada keabsahan dataset, metodologi text mining, dan validitas korpus dokumen.',
  },
  {
    id: 'rev-2',
    name: 'Reviewer 2',
    role: 'Reviewer 2',
    institution: 'Politeknik Negeri Padang',
    notes: 'Fokus pada konsistensi tata tulis ilmiah, arsitektur sistem, dan operasional teknis.',
  },
];

export const fallbackTasks = [
  {
    id: 'task-1',
    title: 'Penyusunan Agenda & Daftar Pertanyaan Konsultasi Bimbingan Berikutnya',
    description: 'Mempersiapkan opsi kompensasi jika admin SITA tidak dapat mengekstrak data teks abstrak.',
    category: 'Konsultasi',
    priority: 'High',
    status: 'To Do',
    deadline: new Date('2026-11-25'),
    isCompleted: false,
    subtasks: [
      { id: 'sub-1-1', title: 'Draft surat permohonan ke jurusan', isCompleted: true },
      { id: 'sub-1-2', title: 'Daftar pertanyaan batasan korpus', isCompleted: false },
    ],
  },
  {
    id: 'task-2',
    title: 'Kompilasi Matriks Literatur 15 Jurnal Topik LDA Bahasa Indonesia',
    description: 'Menyusun tabel komparasi parameter K, teknik preprocessing, dan metric Coherence.',
    category: 'Literature',
    priority: 'Medium',
    status: 'In Progress',
    deadline: new Date('2026-11-27'),
    isCompleted: false,
    subtasks: [
      { id: 'sub-2-1', title: 'Download 15 paper SINTA 2 / Scopus', isCompleted: true },
      { id: 'sub-2-2', title: 'Ekstrak tabel akurasi & coherence', isCompleted: true },
      { id: 'sub-2-3', title: 'Tulis ringkasan sintesis', isCompleted: false },
      { id: 'sub-2-4', title: 'Sinkronisasi BibTeX ke Mendeley', isCompleted: false },
    ],
  },
  {
    id: 'task-3',
    title: 'Audit Duplikasi dan Validasi Struktur Dataset Awal 374 Judul',
    description: 'Pemeriksaan integritas data historis 2021-2025 (253) dan holdout 2026 (121).',
    category: 'Dataset',
    priority: 'High',
    status: 'Completed',
    deadline: new Date('2026-10-22'),
    isCompleted: true,
    subtasks: [
      { id: 'sub-3-1', title: 'Cek duplikasi judul', isCompleted: true },
      { id: 'sub-3-2', title: 'Pisahkan Reguler vs Alih Kredit', isCompleted: true },
    ],
  },
  {
    id: 'task-4',
    title: 'Uraikan Skema Operasional Sistem: Direct API vs Batch Admin Update',
    description: 'Menindaklanjuti masukan Reviewer 2 terkait arsitektur operasional sistem.',
    category: 'Proposal',
    priority: 'High',
    status: 'To Do',
    deadline: new Date('2026-11-30'),
    isCompleted: false,
    subtasks: [
      { id: 'sub-4-1', title: 'Diagram alur batch update', isCompleted: false },
      { id: 'sub-4-2', title: 'Penjelasan di Bab III metodologi', isCompleted: false },
    ],
  },
  {
    id: 'task-5',
    title: 'Koordinasi dengan Pengelola SITA untuk Permohonan Ekstraksi Abstrak TA',
    description: 'Menindaklanjuti masukan Reviewer 1: Mengajukan surat permohonan resmi ekstraksi abstrak.',
    category: 'Revisi Reviewer',
    priority: 'Critical',
    status: 'In Progress',
    deadline: new Date('2026-11-28'),
    isCompleted: false,
    subtasks: [
      { id: 'sub-5-1', title: 'Konsultasi dengan Pembimbing 1', isCompleted: true },
      { id: 'sub-5-2', title: 'Kirim surat ke TIPD PNP', isCompleted: true },
      { id: 'sub-5-3', title: 'Terima konfirmasi format data', isCompleted: false },
      { id: 'sub-5-4', title: 'Uji impor sampel 10 abstrak', isCompleted: false },
    ],
  },
];

export const fallbackReviewerComments = [
  {
    id: 'rev-comm-1',
    reviewerId: 'rev-1',
    reviewer: fallbackReviewers[0],
    chapter: 'BAB III',
    section: '3.2 Dataset Penelitian',
    originalComment: 'Judul tugas akhir terlalu singkat untuk pemodelan topik LDA yang akurat. Kata sangat sedikit (word sparsity tinggi). Anda harus memasukkan minimal abstrak dan kesimpulan TA!',
    actionPlan: 'Menyiapkan surat resmi ke pengelola SITA/TIPD untuk izin akses data abstrak, serta menambahkan fallback kompensasi n-gram bila abstrak parsial.',
    status: 'Belum Selesai',
    priority: 'Kritis',
    category: 'Metodologi',
    evaluationAspect: 'Validitas Data',
    studentAnalysis: 'Memerlukan koordinasi dengan TIPD PNP untuk pengambilan data teks abstrak.',
    repairPlan: 'Menyiapkan surat izin dan kompensasi n-gram bila data abstrak terbatas.',
  },
  {
    id: 'rev-comm-2',
    reviewerId: 'rev-2',
    reviewer: fallbackReviewers[1],
    chapter: 'BAB III',
    section: '3.4 Arsitektur Sistem',
    originalComment: 'Jelaskan bagaimana sistem Anda akan digunakan di lapangan. Apakah terhubung langsung ke database SITA atau admin prodi mengimpor batch data setiap akhir semester?',
    actionPlan: 'Menambahkan subbab 3.4.3 Operasional Sistem yang menguraikan mode Batch Admin Update via CSV/XLSX sebagai skema paling aman tanpa mengganggu sistem inti SITA.',
    status: 'Belum Selesai',
    priority: 'Tinggi',
    category: 'Arsitektur',
    evaluationAspect: 'Arsitektur Sistem',
    studentAnalysis: 'Sistem dirancang mandiri menggunakan skema Batch Admin Update agar tidak membutuhkan integrasi langsung ke DB inti SITA PNP.',
    repairPlan: 'Menyusun diagram arsitektur alur batch update CSV/XLSX.',
  },
  {
    id: 'rev-comm-3',
    reviewerId: 'rev-2',
    reviewer: fallbackReviewers[1],
    chapter: 'BAB I',
    section: '1.4 Manfaat Penelitian',
    originalComment: 'Format penulisan istilah asing harus konsisten dicetak miring (italic), seperti topic modeling, latent dirichlet allocation, dan text preprocessing.',
    actionPlan: 'Pemeriksaan menyeluruh tipografi dan format miring pada seluruh naskah Bab I hingga Bab III.',
    status: 'Dalam Proses',
    priority: 'Sedang',
    category: 'Format & Typo',
    evaluationAspect: 'Tata Tulis',
    studentAnalysis: 'Istilah asing perlu disisir ulang pada Bab I, II, dan III.',
    repairPlan: 'Melakukan formatting ulang italic pada istilah asing.',
  },
  {
    id: 'rev-comm-4',
    reviewerId: 'rev-1',
    reviewer: fallbackReviewers[0],
    chapter: 'BAB II',
    section: '2.3 Hyperparameter LDA',
    originalComment: 'Sertakan justifikasi pemilihan rentang nilai Alpha dan Beta pada pengujian Topic Coherence (Cv). Jangan hanya memakai nilai default Gensim.',
    actionPlan: 'Menambahkan kajian pustaka mengenai pengaruh nilai simetris vs asimetris alpha dan beta pada korpus teks bahasa Indonesia pendek.',
    status: 'Belum Selesai',
    priority: 'Tinggi',
    category: 'Literatur',
    evaluationAspect: 'Kajian Teori',
    studentAnalysis: 'Hyperparameter tuning harus diuji pada beberapa rentang nilai.',
    repairPlan: 'Menambahkan tabel pengujian Alpha & Beta di Bab III.',
  },
];

export const fallbackConsultations = [
  {
    id: 'cons-1',
    supervisorId: 'sup-1',
    supervisor: fallbackSupervisors[0],
    consultationDate: new Date('2026-11-12'),
    mediaType: 'OFFLINE',
    chapterDiscussed: 'BAB III & Revisi Sempro',
    questionsAsked: 'Bagaimana penanganan word sparsity jika permohonan abstrak ke TIPD PNP membutuhkan waktu lama?',
    supervisorFeedback: 'Pembimbing 1 menyetujui strategi pengajuan surat izin abstrak ke TIPD PNP. Jika abstrak sulit diakses dalam 2 minggu, fokuskan kompensasi pada perluasan leksikon stopword akademik dan kombinasi bigram.',
    decisionResult: 'Lanjutkan pengajuan surat izin dan siapkan skenario mitigasi n-gram.',
    nextActionTasks: 'Susun surat permohonan ke Koordinator SITA dan update Bab III terkait arsitektur batch data.',
    followupDeadline: new Date('2026-11-26'),
  },
];

export const fallbackDatasets = [
  {
    id: 'dataset-1',
    name: 'Korpus Judul Tugas Akhir D4 TRPL SITA PNP (2021-2026)',
    version: 'v1.0-Initial-TitleBased',
    description: 'Dataset awal berbasis judul hasil ekstraksi riwayat tugas akhir SITA D4 TRPL Politeknik Negeri Padang.',
    totalRecords: 374,
    regularCount: 335,
    alihKreditCount: 39,
    finalCount: 374,
    status: 'Validated',
    distributions: [
      { id: 'dist-1', year: 2021, count: 48, program: 'Reguler' },
      { id: 'dist-2', year: 2022, count: 52, program: 'Reguler' },
      { id: 'dist-3', year: 2023, count: 58, program: 'Reguler' },
      { id: 'dist-4', year: 2024, count: 62, program: 'Reguler' },
      { id: 'dist-5', year: 2025, count: 75, program: 'Reguler' },
      { id: 'dist-6', year: 2026, count: 121, program: 'Holdout' },
    ],
    versions: [
      {
        id: 'ver-1',
        versionName: 'v1.0 - Ekstraksi Awal SITA',
        versionNumber: 1,
        rowCount: 374,
        columnCount: 8,
        createdAt: new Date('2026-10-15'),
        changeNotes: 'Ekstraksi data mentah dari riwayat SITA TRPL.',
      },
    ],
    exclusions: [],
  },
];

export const fallbackReferences = [
  {
    id: 'ref-1',
    title: 'Latent Dirichlet Allocation',
    authors: 'Blei, D. M., Ng, A. Y., & Jordan, M. I.',
    year: 2003,
    publicationVenue: 'Journal of Machine Learning Research',
    venue: 'Journal of Machine Learning Research',
    citationCount: 42000,
    isKeyPaper: true,
    method: 'Probabilistic Generative Topic Modeling',
    relevanceToThesis: 'Pondasi teoretis utama algoritma LDA yang digunakan dalam pemodelan topik tugas akhir.',
  },
  {
    id: 'ref-2',
    title: 'Analisis Tren Topik Tugas Akhir Mahasiswa Menggunakan Pemodelan Topik LDA',
    authors: 'Pratama, A., & Wulandari, R.',
    year: 2022,
    publicationVenue: 'Jurnal RESTI (Rekayasa Sistem dan Teknologi Informasi)',
    venue: 'Jurnal RESTI (Rekayasa Sistem dan Teknologi Informasi)',
    citationCount: 18,
    isKeyPaper: true,
    method: 'LDA dengan Text Preprocessing Sastrawi',
    relevanceToThesis: 'Studi komparasi langsung pemodelan topik tugas akhir berbahasa Indonesia.',
  },
  {
    id: 'ref-3',
    title: 'Short Text Topic Modeling: Techniques, Challenges, and Solutions',
    authors: 'Qiang, J., Qian, Z., Li, Y., Yuan, Y., & Wu, X.',
    year: 2020,
    publicationVenue: 'IEEE Transactions on Knowledge and Data Engineering',
    venue: 'IEEE Transactions on Knowledge and Data Engineering',
    citationCount: 310,
    isKeyPaper: true,
    method: 'Biterm Topic Model & LDA Adaptations for Short Texts',
    relevanceToThesis: 'Rujukan strategi mengatasi word sparsity pada dokumen teks pendek/judul.',
  },
];

export const fallbackActivityLogs = [
  {
    id: 'act-1',
    actionType: 'STATUS_CHANGE',
    title: 'Memperbarui Task: Kompilasi Matriks Literatur 15 Jurnal Topik LDA',
    createdAt: new Date(Date.now() - 39 * 60 * 1000),
  },
  {
    id: 'act-2',
    actionType: 'CREATE',
    title: 'Mencatat Hasil Bimbingan dengan Dr. Riko Ervil',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'act-3',
    actionType: 'UPDATE',
    title: 'Menerima Catatan Hasil Seminar Proposal dari Reviewer 1 & 2',
    createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'act-4',
    actionType: 'UPLOAD',
    title: 'Mengunggah Proposal Draft v1.0',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
  },
];

export const fallbackCalendarEvents = [
  {
    id: 'evt-1',
    title: 'Konsultasi Bimbingan Bab III dengan Dr. Riko Ervil',
    description: 'Membahas permohonan surat izin abstrak SITA PNP & matriks revisi Reviewer.',
    eventType: 'CONSULTATION',
    startDate: new Date('2026-11-26T10:00:00Z'),
    endDate: new Date('2026-11-26T12:00:00Z'),
    isAllDay: false,
    location: 'Ruang Jurusan TI PNP',
    status: 'SCHEDULED',
  },
  {
    id: 'evt-2',
    title: 'Deadline Penyerahan Berita Acara & Bukti Revisi Sempro',
    description: 'Batas akhir pengesahan revisi pasca seminar proposal ke bagian akademik.',
    eventType: 'DEADLINE',
    startDate: new Date('2026-11-28T23:59:00Z'),
    endDate: new Date('2026-11-28T23:59:00Z'),
    isAllDay: true,
    location: 'SITA / Jurusan TI',
    status: 'SCHEDULED',
  },
  {
    id: 'evt-3',
    title: 'Bimbingan Metodologi & Preprocessing dengan Ibu Fitri Nova',
    description: 'Validasi kamus stopword akademik dan skema tokenisasi.',
    eventType: 'CONSULTATION',
    startDate: new Date('2026-12-03T13:30:00Z'),
    endDate: new Date('2026-12-03T15:00:00Z'),
    isAllDay: false,
    location: 'Google Meet',
    status: 'SCHEDULED',
  },
];

export const fallbackReminders = [
  {
    id: 'rem-1',
    title: 'Batas Penyerahan Bukti Revisi Sempro ke Penguji',
    targetDate: new Date('2026-11-28'),
    isDismissed: false,
  },
  {
    id: 'rem-2',
    title: 'Jadwal Bimbingan Lanjutan Dr. Riko Ervil',
    targetDate: new Date('2026-11-26'),
    isDismissed: false,
  },
];

export const fallbackMilestones = [
  { id: 'm-1', title: 'Penentuan Judul & Topik TA', order: 1, isCompleted: true, status: 'COMPLETED' },
  { id: 'm-2', title: 'Penyusunan Proposal (Bab I-III)', order: 2, isCompleted: true, status: 'COMPLETED' },
  { id: 'm-3', title: 'Persetujuan Pembimbing untuk Sempro', order: 3, isCompleted: true, status: 'COMPLETED' },
  { id: 'm-4', title: 'Seminar Proposal (Sempro)', order: 4, isCompleted: true, status: 'COMPLETED' },
  { id: 'm-5', title: 'Penerimaan Catatan Revisi Penguji', order: 5, isCompleted: true, status: 'COMPLETED' },
  { id: 'm-6', title: 'Penyelesaian Revisi Pasca Sempro', order: 6, isCompleted: false, status: 'IN_PROGRESS' },
  { id: 'm-7', title: 'Pengesahan Proposal Pasca Revisi', order: 7, isCompleted: false, status: 'PENDING' },
  { id: 'm-8', title: 'Pengumpulan & Ekstraksi Korpus SITA', order: 8, isCompleted: false, status: 'PENDING' },
  { id: 'm-9', title: 'Eksperimen Preprocessing & Tuning LDA', order: 9, isCompleted: false, status: 'PENDING' },
  { id: 'm-10', title: 'Pembangunan Sistem Aplikasi', order: 10, isCompleted: false, status: 'PENDING' },
  { id: 'm-11', title: 'Pengujian Sistem & Evaluasi Coherence', order: 11, isCompleted: false, status: 'PENDING' },
  { id: 'm-12', title: 'Penyusunan Naskah Lengkap (Bab I-V)', order: 12, isCompleted: false, status: 'PENDING' },
  { id: 'm-13', title: 'Persetujuan Maju Sidang Akhir', order: 13, isCompleted: false, status: 'PENDING' },
  { id: 'm-14', title: 'Sidang Tugas Akhir', order: 14, isCompleted: false, status: 'PENDING' },
  { id: 'm-15', title: 'Revisi Sidang & Pengesahan Naskah', order: 15, isCompleted: false, status: 'PENDING' },
];

export const fallbackProposalVersions = [
  {
    id: 'ver-prop-1',
    versionName: 'v1.0 - Draft Seminar Proposal',
    versionNumber: 1,
    changedChapters: 'Bab I - Bab III',
    changeSummary: 'Naskah lengkap yang dipresentasikan pada Seminar Proposal tanggal 4 November 2026.',
    approvalStatus: 'REVISION_REQUIRED',
    createdAt: new Date('2026-11-04'),
  },
  {
    id: 'ver-prop-2',
    versionName: 'v1.1 - Revisi Bab III Korpus & Arsitektur',
    versionNumber: 2,
    changedChapters: 'Bab III (Subbab 3.2 & 3.4)',
    changeSummary: 'Penambahan skema batch update CSV dan strategi mitigasi data teks abstrak SITA.',
    approvalStatus: 'UNDER_REVIEW',
    createdAt: new Date('2026-11-18'),
  },
];

export const fallbackDocuments = [
  {
    id: 'doc-1',
    title: 'Proposal Tugas Akhir v1.0 - Sempro',
    category: 'Naskah Proposal',
    fileType: 'PDF',
    fileSize: 2450000,
    fileUrl: '/uploads/proposal-v1.0.pdf',
    createdAt: new Date('2026-11-04'),
    versions: [
      { id: 'dv-1', versionNumber: 1, versionName: 'v1.0 Sempro', createdAt: new Date('2026-11-04') },
    ],
  },
  {
    id: 'doc-2',
    title: 'Surat Permohonan Ekstraksi Korpus Abstrak SITA ke TIPD',
    category: 'Surat & Izin',
    fileType: 'DOCX',
    fileSize: 450000,
    fileUrl: '/uploads/surat-permohonan-sita.docx',
    createdAt: new Date('2026-11-15'),
    versions: [
      { id: 'dv-2', versionNumber: 1, versionName: 'Draft Surat Permohonan', createdAt: new Date('2026-11-15') },
    ],
  },
  {
    id: 'doc-3',
    title: 'Kompilasi Matriks Literatur 15 Jurnal Topik LDA',
    category: 'Literatur & Referensi',
    fileType: 'XLSX',
    fileSize: 850000,
    fileUrl: '/uploads/matriks-literatur-15-jurnal.xlsx',
    createdAt: new Date('2026-11-18'),
    versions: [
      { id: 'dv-3', versionNumber: 1, versionName: 'Matriks v1.0', createdAt: new Date('2026-11-18') },
    ],
  },
];

export const fallbackExperiments = [
  {
    id: 'exp-1',
    name: 'Eksperimen 1: Baseline LDA Judul Singkat (K=5..15)',
    description: 'Pengujian dasar Topic Coherence (Cv & UMass) pada korpus 374 judul tanpa teks abstrak.',
    executedAt: new Date('2026-11-10'),
    status: 'COMPLETED',
    preprocessingConfig: {
      caseFolding: true,
      removePunctuation: true,
      removeNumbers: true,
      stopwordRemoval: 'Sastrawi + Stopword Akademik PNP',
      stemming: 'Sastrawi Stemmer',
      tokenFilterLengthMin: 3,
    },
    ldaConfig: {
      numTopics: 8,
      alpha: 'symmetric (0.1)',
      beta: 'symmetric (0.01)',
      passes: 20,
      iterations: 200,
      randomState: 42,
    },
    metric: {
      coherenceCv: 0.432,
      coherenceUMass: -3.81,
      perplexity: -6.42,
    },
  },
];

export const fallbackLogbooks = [
  {
    id: 'log-1',
    logDate: new Date('2026-11-15'),
    activity: 'Penyusunan draf surat izin ekstraksi abstrak tugas akhir ke TIPD PNP',
    workSteps: '1. Konsultasi format surat dengan pembimbing; 2. Menyiapkan daftar variabel yang dibutuhkan (judul, tahun, peminatan, abstrak).',
    result: 'Draf surat siap dimintakan tanda tangan Ketua KBK RPL.',
    obstacles: 'Perlu kejelasan apakah TIPD menyediakan akses dump SQL atau export format CSV.',
    solutions: 'Menyediakan lampiran format CSV yang diharapkan.',
    durationMinutes: 120,
  },
  {
    id: 'log-2',
    logDate: new Date('2026-11-18'),
    activity: 'Eksperimen preprocessing korpus judul 374 data pada notebook Google Colab',
    workSteps: '1. Case folding & cleansing karakter khusus; 2. Stopword removal sastrawi; 3. Evaluasi word cloud.',
    result: 'Ditemukan kata umum "sistem", "informasi", "berbasis", "web", "android" memiliki frekuensi dominan dan perlu dimasukkan ke custom stopwords.',
    obstacles: 'Word sparsity tinggi karena rata-rata panjang teks judul hanya 8-12 kata.',
    solutions: 'Membentuk n-gram (bigram) untuk istilah spesifik seperti "deep_learning" dan "machine_learning".',
    durationMinutes: 180,
  },
];

export const fallbackSeminarQuestions = [
  {
    id: 'sem-q-1',
    question: 'Mengapa Anda memilih algoritma Latent Dirichlet Allocation (LDA) dibandingkan metode clustering teks seperti K-Means atau BERTopic?',
    studentAnswer: 'LDA adalah model generatif probabilistik yang memungkinkan satu dokumen memiliki proporsi keanggotaan pada beberapa topik sekaligus (soft clustering/mixed membership), yang sangat sesuai dengan sifat judul dan abstrak tugas akhir interdisipliner.',
    readinessStatus: 'READY',
    order: 1,
  },
  {
    id: 'sem-q-2',
    question: 'Bagaimana cara Anda membuktikan bahwa model LDA Anda tidak mengalami overfitting pada dataset kecil (374 data)?',
    studentAnswer: 'Kami membagi dataset menjadi training (2021-2025: 253 dokumen) dan holdout test set (2026: 121 dokumen), serta mengukur metrik Topic Coherence Cv dan Perplexity pada data uji yang belum pernah dilihat model.',
    readinessStatus: 'READY',
    order: 2,
  },
  {
    id: 'sem-q-3',
    question: 'Bagaimana Anda mengatasi kendala jumlah kata yang sangat sedikit jika hanya menggunakan judul tugas akhir?',
    studentAnswer: 'Prioritas utama adalah mengajukan permohonan teks abstrak ke TIPD PNP. Jika data abstrak terbatas, kami menerapkan tokenisasi n-gram (bigram), penambahan leksikon sinonim akademik TRPL, dan eksperimen biterm aggregation.',
    readinessStatus: 'IN_PROGRESS',
    order: 3,
  },
];

export const fallbackSeminarChecklists = [
  { id: 'chk-1', title: 'Slide Presentasi PowerPoint / Canva Disiapkan', isCompleted: true, category: 'Presentasi' },
  { id: 'chk-2', title: 'Naskah Proposal D4 TRPL Dijilid dan Dibagikan ke Dosen Penguji', isCompleted: true, category: 'Administrasi' },
  { id: 'chk-3', title: 'Matriks Rangkuman Revisi Sempro Disiapkan', isCompleted: true, category: 'Revisi' },
  { id: 'chk-4', title: 'Simulasi Tanya Jawab dengan Pembimbing Selesai', isCompleted: false, category: 'Persiapan' },
];

export const fallbackProject = {
  id: 'project-pemetaan-topik-lda',
  userId: fallbackUser.id,
  user: fallbackUser,
  title: 'Pengembangan Sistem Pemetaan Distribusi dan Tren Topik Tugas Akhir Mahasiswa D4 TRPL pada SITA Menggunakan Latent Dirichlet Allocation (LDA)',
  shortTitle: 'Pemetaan Topik TA TRPL - LDA',
  academicYear: '2026/2027',
  semester: 'Genap',
  category: 'D4 TRPL (Reguler & Alih Kredit)',
  status: 'REVISION',
  targetCompletion: new Date('2027-01-31'),
  overallProgress: 42,
  milestones: fallbackMilestones,
  tasks: fallbackTasks,
  reviewerComments: fallbackReviewerComments,
  reviewers: fallbackReviewers,
  supervisors: fallbackSupervisors,
  reminders: fallbackReminders,
  consultations: fallbackConsultations,
  datasets: fallbackDatasets,
  references: fallbackReferences,
  activityLogs: fallbackActivityLogs,
  calendarEvents: fallbackCalendarEvents,
  proposalVersions: fallbackProposalVersions,
  documents: fallbackDocuments,
  experiments: fallbackExperiments,
  logbooks: fallbackLogbooks,
  defenseQuestions: fallbackSeminarQuestions,
  defenseChecklists: fallbackSeminarChecklists,
  proposalSections: [
    { id: 'sec-1', chapter: 'BAB I', subSectionCode: '1.1', title: 'Latar Belakang', isCompleted: true },
    { id: 'sec-2', chapter: 'BAB I', subSectionCode: '1.2', title: 'Rumusan Masalah', isCompleted: true },
    { id: 'sec-3', chapter: 'BAB II', subSectionCode: '2.1', title: 'Kajian Pustaka', isCompleted: true },
    { id: 'sec-4', chapter: 'BAB III', subSectionCode: '3.1', title: 'Metodologi Penelitian', isCompleted: false },
  ],
};
