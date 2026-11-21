'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Download,
  Eye,
  GitBranch,
  BookOpen,
  ArrowRight,
  Sparkles,
  Edit3,
  X,
  FileCheck,
} from 'lucide-react';
import { formatDateIndo } from '@/lib/utils';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';

export default function ProposalPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reviewer' | 'outline' | 'versions'>('reviewer');
  const [editingComment, setEditingComment] = useState<any>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // New Version Form State
  const [versionName, setVersionName] = useState('');
  const [changedChapters, setChangedChapters] = useState('BAB I, BAB III');
  const [changeSummary, setChangeSummary] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/proposal');
      const json = await res.json();
      setData(json.project);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment) return;

    try {
      const res = await fetch('/api/reviewer-comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingComment.id,
          status: editingComment.status,
          studentAnalysis: editingComment.studentAnalysis,
          repairPlan: editingComment.repairPlan,
          repairProof: editingComment.repairProof,
        }),
      });

      if (res.ok) {
        setEditingComment(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSectionStatus = async (sectionId: string, newStatus: string) => {
    try {
      await fetch('/api/proposal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, status: newStatus }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionName,
          changedChapters,
          changeSummary,
          fileDocx: '/uploads/proposals/Proposal_v1.1_Revision.docx',
          filePdf: '/uploads/proposals/Proposal_v1.1_Revision.pdf',
        }),
      });

      if (res.ok) {
        setIsVersionModalOpen(false);
        setVersionName('');
        setChangeSummary('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <SkeletonLoading cardsCount={4} />;
  }

  const comments = data?.reviewerComments || [];
  const sections = data?.proposalSections || [];
  const versions = data?.proposalVersions || [];

  const completedCommentsCount = comments.filter((c: any) => c.status === 'Selesai').length;
  const unresolvedCommentsCount = comments.filter((c: any) => c.status !== 'Selesai').length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#FFCED8] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Proposal & Reviewer Management</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFCED8]/50 text-[#863043] border border-[#FFCED8]">
              {versions[0]?.versionName || 'v1.0'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-2xl">
            Pusat pengawasan naskah proposal, struktur BAB I - III, serta tindak lanjut catatan kritis dewan penguji pasca Sempro.
          </p>
        </div>

        <button
          onClick={() => setIsVersionModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#863043] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] border border-[#F5A8B8] hover:opacity-95 rounded-2xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Unggah Revisi Versi Baru
        </button>
      </div>

      {/* Reviewer Status Counters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8]">
          <span className="text-xs font-semibold text-slate-500">Total Catatan Reviewer</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">{comments.length} Poin</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Reviewer 1 & Reviewer 2</span>
        </div>

        <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200">
          <span className="text-xs font-bold text-rose-700">Belum Selesai (Unresolved)</span>
          <div className="text-2xl font-bold text-rose-700 mt-1">{unresolvedCommentsCount} Catatan</div>
          <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">
            Wajib diperbaiki & diverifikasi
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8]">
          <span className="text-xs font-semibold text-slate-500">Revisi Selesai</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{completedCommentsCount} Catatan</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Disetujui Dosen</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8]">
          <span className="text-xs font-semibold text-slate-500">Riwayat Versi Tersimpan</span>
          <div className="text-2xl font-bold text-[#C75C73] mt-1">{versions.length} Versi</div>
          <span className="text-[11px] text-[#A84157] font-medium mt-0.5 block">
            Tidak ada versi lama yang tertimpa
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#FFCED8] gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('reviewer')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'reviewer'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Matriks Catatan Reviewer & Tindak Lanjut ({comments.length})
        </button>

        <button
          onClick={() => setActiveTab('outline')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'outline'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#C75C73]" />
          Proposal Outline (BAB I — III) ({sections.length} Subbab)
        </button>

        <button
          onClick={() => setActiveTab('versions')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'versions'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <GitBranch className="w-4 h-4 text-[#A84157]" />
          Riwayat Versi Naskah ({versions.length})
        </button>
      </div>

      {/* TAB 1: Reviewer Comments Matrix */}
      {activeTab === 'reviewer' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <strong>Pemberitahuan Sistem:</strong> Seluruh catatan reviewer asli disimpan permanen tanpa diubah.
              Status tetap <em>"Belum dikerjakan"</em> sampai mahasiswa melampirkan analisis, rencana perbaikan, dan
              diverifikasi dosen pembimbing.
            </div>
          </div>

          <div className="space-y-4">
            {comments.map((rc: any) => (
              <div
                key={rc.id}
                className="bg-white rounded-3xl border border-[#FFCED8] p-5 shadow-sm space-y-4"
              >
                {/* Header Card */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#FFCED8]/40">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs px-2.5 py-1 rounded-lg bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4]">
                      {rc.reviewer.name} ({rc.reviewer.role})
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      Aspek: {rc.evaluationAspect}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Terkait: {rc.chapterRelated || 'Seluruh Naskah'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        rc.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : rc.status === 'Sedang dikerjakan'
                          ? 'bg-[#FFE8C4]/60 text-[#863043] border border-[#FFE8C4]'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {rc.status}
                    </span>
                    <button
                      onClick={() => setEditingComment(rc)}
                      className="p-1.5 text-[#C75C73] hover:bg-[#FFF0F3] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Perbarui Rencana & Bukti
                    </button>
                  </div>
                </div>

                {/* Original Reviewer Comment */}
                <div className="p-3.5 bg-[#FFF9FA] border border-[#FFCED8]/60 rounded-2xl text-xs space-y-1">
                  <span className="text-[11px] font-bold text-[#A84157] uppercase tracking-wider block">
                    Komentar Asli Reviewer:
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed italic">
                    "{rc.originalComment}"
                  </p>
                </div>

                {/* Student Analysis & Repair Plan Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#FFF4DE]/50 border border-[#FFE8C4] rounded-2xl">
                    <span className="font-bold text-[#863043] block mb-1">1. Analisis Mahasiswa</span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {rc.studentAnalysis || 'Belum diisi'}
                    </p>
                  </div>

                  <div className="p-3 bg-[#FFCED8]/30 border border-[#FFCED8] rounded-2xl">
                    <span className="font-bold text-[#863043] block mb-1">2. Rencana Perbaikan</span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {rc.repairPlan || 'Belum diisi'}
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                    <span className="font-bold text-emerald-900 block mb-1">3. Bukti Perbaikan</span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {rc.repairProof || 'Belum ada bukti yang dilampirkan'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Proposal Outline (BAB I - III) */}
      {activeTab === 'outline' && (
        <div className="bg-white rounded-3xl border border-[#FFCED8] shadow-sm overflow-hidden">
          <div className="p-4 bg-[#FFF9FA] border-b border-[#FFCED8] flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#863043] uppercase tracking-wider">
              Daftar Struktur Subbab Naskah Proposal
            </h3>
            <span className="text-xs text-slate-500">
              Ubah status subbab secara real-time untuk memantau kemajuan penulisan
            </span>
          </div>

          <div className="divide-y divide-[#FFCED8]/40 text-xs">
            {sections.map((sec: any) => (
              <div
                key={sec.id}
                className="p-4 hover:bg-[#FFF9FA] transition-colors flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold px-2 py-0.5 rounded-lg bg-[#FFF4DE] text-[#863043] text-[11px] border border-[#FFE8C4]">
                      {sec.chapter} — {sec.subSectionCode}
                    </span>
                    <h4 className="font-bold text-slate-800 text-xs">{sec.title}</h4>
                  </div>
                  {sec.notes && <p className="text-[11px] text-slate-500 pl-1">{sec.notes}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={sec.status}
                    onChange={(e) => handleUpdateSectionStatus(sec.id, e.target.value)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-xl border focus:outline-none ${
                      sec.status === 'Disetujui'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : sec.status === 'Perlu revisi'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : sec.status === 'Sedang dikerjakan'
                        ? 'bg-[#FFE8C4]/60 text-[#863043] border border-[#FFE8C4]'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <option value="Belum dikerjakan">Belum dikerjakan</option>
                    <option value="Sedang dikerjakan">Sedang dikerjakan</option>
                    <option value="Perlu revisi">Perlu revisi</option>
                    <option value="Menunggu pemeriksaan">Menunggu pemeriksaan</option>
                    <option value="Disetujui">Disetujui</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Proposal Versions */}
      {activeTab === 'versions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {versions.map((v: any) => (
              <div
                key={v.id}
                className="bg-white rounded-3xl border border-[#FFCED8] p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#C75C73]" />
                    <h4 className="font-bold text-sm text-slate-800">{v.versionName}</h4>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4]">
                    {formatDateIndo(v.createdAt, 'dd MMM yyyy')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <div>
                    <span className="font-semibold text-slate-700">Bab yang Diubah: </span>
                    <span>{v.changedChapters || 'Semua Bab'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Ringkasan Perubahan: </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {v.changeSummary || 'Tidak ada catatan'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[#FFCED8]/40">
                  {v.filePdf && (
                    <a
                      href={v.filePdf}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold text-[#863043] bg-[#FFCED8]/40 hover:bg-[#FFCED8]/70 border border-[#FFCED8] rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh PDF
                    </a>
                  )}
                  {v.fileDocx && (
                    <a
                      href={v.fileDocx}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold text-[#863043] bg-[#FFE8C4]/50 hover:bg-[#FFE8C4]/80 border border-[#FFE8C4] rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh DOCX
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Reviewer Comment Modal */}
      {editingComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#FFCED8] w-full max-w-xl overflow-hidden animate-fade-in">
            <div className="p-4 bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] text-[#863043] border-b border-[#FFCED8] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Tindak Lanjut Catatan Reviewer</h3>
                <p className="text-xs text-[#863043]/80">{editingComment.reviewer.name}</p>
              </div>
              <button onClick={() => setEditingComment(null)} className="text-[#863043] hover:opacity-75">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateComment} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Revisi</label>
                <select
                  value={editingComment.status}
                  onChange={(e) =>
                    setEditingComment({ ...editingComment, status: e.target.value })
                  }
                  className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                >
                  <option value="Belum dikerjakan">Belum dikerjakan</option>
                  <option value="Sedang dikerjakan">Sedang dikerjakan</option>
                  <option value="Menunggu validasi dosen">Menunggu validasi dosen</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Perlu revisi ulang">Perlu revisi ulang</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Analisis Mahasiswa</label>
                <textarea
                  rows={2}
                  value={editingComment.studentAnalysis || ''}
                  onChange={(e) =>
                    setEditingComment({ ...editingComment, studentAnalysis: e.target.value })
                  }
                  placeholder="Pemahaman masalah dan urgensi revisi..."
                  className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rencana Perbaikan</label>
                <textarea
                  rows={2}
                  value={editingComment.repairPlan || ''}
                  onChange={(e) =>
                    setEditingComment({ ...editingComment, repairPlan: e.target.value })
                  }
                  placeholder="Langkah konkret perbaikan..."
                  className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bukti Perbaikan</label>
                <textarea
                  rows={2}
                  value={editingComment.repairProof || ''}
                  onChange={(e) =>
                    setEditingComment({ ...editingComment, repairProof: e.target.value })
                  }
                  placeholder="Penjelasan paragraf baru, tabel, lampiran..."
                  className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#FFCED8]/40">
                <button
                  type="button"
                  onClick={() => setEditingComment(null)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-[#FFF0F3] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#C75C73] hover:bg-[#A84157] rounded-xl shadow-sm transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload New Version Modal */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#FFCED8] w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-4 bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] text-[#863043] border-b border-[#FFCED8] flex items-center justify-between">
              <h3 className="font-bold text-sm">Unggah Versi Proposal Baru</h3>
              <button onClick={() => setIsVersionModalOpen(false)} className="text-[#863043] hover:opacity-75">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVersion} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Versi</label>
                <input
                  type="text"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder="Misal: v1.1 - Perbaikan Pasca Sempro"
                  className="w-full p-2.5 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bab yang Diubah</label>
                <input
                  type="text"
                  value={changedChapters}
                  onChange={(e) => setChangedChapters(e.target.value)}
                  placeholder="Misal: BAB I, BAB III"
                  className="w-full p-2.5 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ringkasan Perubahan</label>
                <textarea
                  rows={3}
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  placeholder="Jelaskan penambahan atau penyesuaian yang telah dilakukan..."
                  className="w-full p-2.5 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#FFCED8]/40">
                <button
                  type="button"
                  onClick={() => setIsVersionModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-[#FFF0F3] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#C75C73] hover:bg-[#A84157] rounded-xl shadow-sm transition-all"
                >
                  Simpan Versi Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
