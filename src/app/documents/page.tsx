'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderArchive,
  Upload,
  Search,
  FileText,
  FileSpreadsheet,
  Download,
  Filter,
  Layers,
  Sparkles,
  X,
  FileCode,
  Image as ImageIcon,
} from 'lucide-react';
import { formatDateIndo } from '@/lib/utils';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';

const CATEGORIES = [
  'All',
  'Proposal',
  'Jurnal',
  'Dataset',
  'Surat Izin',
  'Konsultasi',
  'Revisi',
  'Eksperimen',
  'Seminar',
  'Sidang',
];

export default function DocumentCenterPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Document Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Proposal');
  const [tags, setTags] = useState('');
  const [fileType, setFileType] = useState('PDF');
  const [fileUrl, setFileUrl] = useState('/uploads/documents/document.pdf');

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          tags,
          fileType,
          fileUrl,
          fileSize: 1540000,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle('');
        setTags('');
        fetchDocuments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = documents.filter((d) => {
    const matchCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.tags && d.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  if (loading) {
    return <SkeletonLoading cardsCount={3} />;
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#FFCED8] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-[#C75C73]" />
            <h2 className="text-xl font-bold text-slate-800">Document Center & Berkas Penelitian</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pusat penyimpanan aman naskah proposal, dataset, surat izin riset prodi, diagram sistem, dan berkas seminar.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#863043] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] border border-[#F5A8B8] hover:opacity-95 rounded-2xl shadow-sm transition-all"
        >
          <Upload className="w-4 h-4" />
          + Unggah Dokumen Baru
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#FFCED8] text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF9FA] border border-[#FFCED8] rounded-xl flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama berkas, tag, atau kategori..."
            className="bg-transparent focus:outline-none w-full text-xs text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Kategori:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#FFF9FA] border border-[#FFCED8] rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => {
          const isPdf = doc.fileType === 'PDF';
          const isSpreadsheet = doc.fileType === 'CSV' || doc.fileType === 'XLSX';

          return (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-[#FFCED8] p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-[#F5A8B8] transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4]">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {doc.fileType} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-2xl mt-0.5 ${
                      isPdf
                        ? 'bg-rose-50 text-rose-600 border border-rose-100'
                        : isSpreadsheet
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-[#FFE8C4]/60 text-[#863043] border border-[#FFE8C4]'
                    }`}
                  >
                    {isPdf ? (
                      <FileText className="w-5 h-5" />
                    ) : isSpreadsheet ? (
                      <FileSpreadsheet className="w-5 h-5" />
                    ) : (
                      <FileCode className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-800 leading-snug line-clamp-2">
                      {doc.title}
                    </h4>
                    {doc.tags && (
                      <span className="text-[10px] text-slate-400 mt-1 block">Tag: {doc.tags}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#FFCED8]/40 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {formatDateIndo(doc.createdAt, 'dd MMM yyyy')}
                </span>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#863043] bg-[#FFCED8]/40 hover:bg-[#FFCED8]/70 border border-[#FFCED8] rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" /> Unduh
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#231B1E] rounded-[28px] shadow-2xl shadow-[#C75C73]/20 border border-[#FFCED8] dark:border-[#4A3238] w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-modal-pop">
            <div className="shrink-0 px-6 py-4 bg-gradient-to-r from-[#FFF4DE] via-[#FFF0F3] to-[#FFCED8]/70 dark:from-[#35252A] dark:via-[#3E2930] dark:to-[#4A2E36] border-b border-[#FFCED8] dark:border-[#4A3238] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2D2226] text-[#C75C73] dark:text-[#FFB3C2] flex items-center justify-center shadow-sm border border-[#FFCED8]/60 dark:border-[#52373F]">
                  <FolderArchive className="w-5 h-5 text-[#C75C73]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#3D3133] dark:text-[#FFF0F3] leading-tight">
                    Unggah Dokumen Penelitian Baru
                  </h3>
                  <p className="text-xs text-[#863043]/80 dark:text-[#FFCED8]/80 font-medium mt-0.5">
                    Arsipkan surat izin, lampiran bab, panduan, atau berkas pendukung
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#863043]/70 hover:text-[#863043] dark:text-[#FFCED8]/70 dark:hover:text-[#FFF0F3] hover:bg-white/80 dark:hover:bg-[#2D2226] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                      Nama Dokumen / Berkas
                    </label>
                    <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                      Wajib
                    </span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Misal: Surat Permohonan Ekstraksi Korpus Abstrak SITA"
                    className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Kategori Dokumen
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all cursor-pointer font-medium"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Format File
                    </label>
                    <select
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="PDF">📄 PDF Document</option>
                      <option value="DOCX">📝 Microsoft Word (DOCX)</option>
                      <option value="XLSX">📊 Excel Spreadsheet (XLSX)</option>
                      <option value="CSV">📑 Raw CSV Data</option>
                      <option value="PNG">🖼️ Gambar / Tangkapan Layar (PNG/JPG)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                    Tag / Kata Kunci Terkait
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Misal: Surat Izin, SITA, TIPD PNP, Berita Acara"
                    className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs font-medium"
                  />
                </div>
              </div>

              <div className="shrink-0 px-6 py-3.5 bg-[#FFF9FA]/80 dark:bg-[#1C1417]/90 border-t border-[#FFCED8]/60 dark:border-[#4A3238] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary-animated"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary-animated"
                >
                  <FolderArchive className="w-3.5 h-3.5 group-hover:rotate-6 transition-transform" />
                  Unggah Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
