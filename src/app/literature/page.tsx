'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  ExternalLink,
  Download,
  Filter,
  CheckCircle2,
  FileText,
  Table,
  Layers,
  Sparkles,
  X,
  Bookmark,
} from 'lucide-react';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';

export default function LiteraturePage() {
  const [references, setReferences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Reference Form State
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [year, setYear] = useState('2024');
  const [publicationVenue, setPublicationVenue] = useState('');
  const [doi, setDoi] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('LDA');
  const [datasetInfo, setDatasetInfo] = useState('');
  const [researchFindings, setResearchFindings] = useState('');
  const [advantages, setAdvantages] = useState('');
  const [limitations, setLimitations] = useState('');
  const [relevanceToThesis, setRelevanceToThesis] = useState('');
  const [chaptersCiting, setChaptersCiting] = useState('BAB II');
  const [isCited, setIsCited] = useState(true);

  const fetchReferences = async () => {
    try {
      const res = await fetch('/api/literature');
      const data = await res.json();
      setReferences(data.references || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  const handleCreateReference = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/literature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          authors,
          year,
          publicationVenue,
          doi,
          url,
          method,
          datasetInfo,
          researchFindings,
          advantages,
          limitations,
          relevanceToThesis,
          chaptersCiting,
          isCited,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle('');
        setAuthors('');
        setResearchFindings('');
        fetchReferences();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export to BibTeX string
  const handleExportBibTeX = () => {
    const bibtex = references
      .map((r) => {
        const key = `${r.authors.split(' ')[0].toLowerCase()}${r.year}`;
        return `@article{${key},
  author = {${r.authors}},
  title = {${r.title}},
  journal = {${r.publicationVenue || 'Journal'}},
  year = {${r.year}},
  doi = {${r.doi || ''}}
}`;
      })
      .join('\n\n');

    const blob = new Blob([bibtex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PA_Companion_References.bib';
    a.click();
  };

  // Filter references
  const filtered = references.filter((r) => {
    const matchSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.method && r.method.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  if (loading) {
    return <SkeletonLoading cardsCount={3} />;
  }

  const citedCount = references.filter((r) => r.isCited).length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#FFCED8] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C75C73]" />
            <h2 className="text-xl font-bold text-slate-800">Literature & Reference Management</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Matriks literatur komparatif, ekstraksi temuan, acuan metodologi LDA, dan sinkronisasi sitasi naskah proposal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBibTeX}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#863043] bg-[#FFF9FA] border border-[#FFCED8] hover:bg-[#FFF0F3] rounded-2xl transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Ekspor BibTeX
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#863043] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] border border-[#F5A8B8] hover:opacity-95 rounded-2xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            + Tambah Referensi Baru
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#FFCED8] text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF9FA] border border-[#FFCED8] rounded-xl flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul paper, penulis, atau kata kunci..."
            className="bg-transparent focus:outline-none w-full text-xs text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">
            Status Sitasi: <strong className="text-[#863043]">{citedCount} Disitasi</strong> / {references.length} Total
          </span>

          <div className="flex items-center p-1 bg-[#FFF9FA] rounded-2xl border border-[#FFCED8]">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-gradient-to-r from-[#FFCED8] to-[#FFE8C4] text-[#863043] shadow-sm'
                  : 'text-slate-600 hover:text-[#863043]'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              Cards
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition-all ${
                viewMode === 'matrix'
                  ? 'bg-gradient-to-r from-[#FFCED8] to-[#FFE8C4] text-[#863043] shadow-sm'
                  : 'text-slate-600 hover:text-[#863043]'
              }`}
            >
              <Table className="w-3 h-3" />
              Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div className="space-y-4">
          {filtered.map((ref) => (
            <div
              key={ref.id}
              className="bg-white rounded-3xl border border-[#FFCED8] p-5 shadow-sm space-y-3.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4]">
                      Tahun {ref.year}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#FFF9FA] text-slate-600 border border-[#FFCED8]">
                      Metode: {ref.method || 'General'}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {ref.chaptersCiting ? `Disitasi di: ${ref.chaptersCiting}` : 'Belum disitasi'}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 leading-snug">{ref.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {ref.authors} • <em>{ref.publicationVenue || 'Journal Venue'}</em>
                  </p>
                </div>

                {ref.url && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#C75C73] hover:bg-[#FFF0F3] rounded-xl flex items-center gap-1 text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Buka Paper
                  </a>
                )}
              </div>

              {/* Research Findings & Matrix Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 bg-[#FFF9FA] border border-[#FFCED8]/60 rounded-2xl">
                  <span className="font-bold text-[#863043] block mb-1">Temuan Utama</span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{ref.researchFindings}</p>
                </div>

                <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                  <span className="font-bold text-emerald-900 block mb-1">Kelebihan</span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">{ref.advantages}</p>
                </div>

                <div className="p-3 bg-[#FFE8C4]/40 border border-[#FFE8C4] rounded-2xl">
                  <span className="font-bold text-[#863043] block mb-1">Keterbatasan</span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">{ref.limitations}</p>
                </div>
              </div>

              {ref.relevanceToThesis && (
                <div className="p-2.5 bg-[#FFF4DE]/60 rounded-2xl border border-[#FFE8C4] text-[11px] text-[#863043]">
                  <strong className="text-[#863043]">Relevansi terhadap Proyek Akhir: </strong>
                  {ref.relevanceToThesis}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Matrix View */
        <div className="bg-white rounded-3xl border border-[#FFCED8] shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-[#FFF9FA] border-b border-[#FFCED8] text-[#863043] font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-5">Paper & Penulis</th>
                <th className="p-3.5">Tahun</th>
                <th className="p-3.5">Metode</th>
                <th className="p-3.5">Dataset</th>
                <th className="p-3.5">Temuan Kunci</th>
                <th className="p-3.5">Kelebihan</th>
                <th className="p-3.5 pr-5">Keterbatasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFCED8]/40">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#FFF9FA] transition-colors">
                  <td className="p-3.5 pl-5 max-w-[220px]">
                    <div className="font-bold text-slate-800 leading-snug">{r.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{r.authors}</div>
                  </td>
                  <td className="p-3.5 font-bold text-slate-700">{r.year}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-lg bg-[#FFCED8]/40 text-[#863043] border border-[#FFCED8] font-semibold text-[10px]">
                      {r.method}
                    </span>
                  </td>
                  <td className="p-3.5 text-[11px] text-slate-600 max-w-[150px]">{r.datasetInfo || '-'}</td>
                  <td className="p-3.5 text-[11px] text-slate-600 max-w-[200px]">{r.researchFindings || '-'}</td>
                  <td className="p-3.5 text-[11px] text-emerald-700 max-w-[150px]">{r.advantages || '-'}</td>
                  <td className="p-3.5 pr-5 text-[11px] text-amber-700 max-w-[150px]">{r.limitations || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Add Reference */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#FFCED8] w-full max-w-xl overflow-hidden animate-fade-in">
            <div className="p-4 bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] text-[#863043] border-b border-[#FFCED8] flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Referensi Literatur Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#863043] hover:opacity-75">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReference} className="p-5 space-y-3 text-xs max-h-[85vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Paper / Jurnal</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Latent Dirichlet Allocation"
                  className="w-full p-2.5 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penulis</label>
                  <input
                    type="text"
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                    placeholder="David M. Blei, Andrew Y. Ng"
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Terbit</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Jurnal / Prosiding</label>
                  <input
                    type="text"
                    value={publicationVenue}
                    onChange={(e) => setPublicationVenue(e.target.value)}
                    placeholder="Journal of Machine Learning Research"
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Metode Utama</label>
                  <input
                    type="text"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    placeholder="LDA, N-Gram, BERTopic"
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Temuan Utama (Findings)</label>
                <textarea
                  rows={2}
                  value={researchFindings}
                  onChange={(e) => setResearchFindings(e.target.value)}
                  placeholder="Hasil kunci penelitian..."
                  className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#FFCED8]/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-[#FFF0F3] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#C75C73] hover:bg-[#A84157] rounded-xl shadow-sm transition-all"
                >
                  Simpan Referensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
