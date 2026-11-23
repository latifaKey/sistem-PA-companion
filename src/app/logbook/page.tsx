'use client';

import React, { useState, useEffect } from 'react';
import {
  BookMarked,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';
import { formatDateIndo } from '@/lib/utils';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';

export default function LogbookPage() {
  const [logbooks, setLogbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Logbook Form State
  const [logDate, setLogDate] = useState('2026-11-21');
  const [activity, setActivity] = useState('');
  const [workSteps, setWorkSteps] = useState('');
  const [result, setResult] = useState('');
  const [obstacles, setObstacles] = useState('');
  const [solutions, setSolutions] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('90');

  const fetchLogbooks = async () => {
    try {
      const res = await fetch('/api/logbook');
      const data = await res.json();
      setLogbooks(data.logbooks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogbooks();
  }, []);

  const handleCreateLogbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) return;

    try {
      const res = await fetch('/api/logbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logDate,
          activity,
          workSteps,
          result,
          obstacles,
          solutions,
          durationMinutes,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setActivity('');
        setWorkSteps('');
        setResult('');
        setObstacles('');
        setSolutions('');
        fetchLogbooks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Tanggal,Aktivitas,Langkah Kerja,Hasil,Kendala,Solusi,Durasi (Menit)\n';
    const rows = logbooks
      .map(
        (l) =>
          `"${formatDateIndo(l.logDate)}","${l.activity}","${l.workSteps || ''}","${l.result || ''}","${
            l.obstacles || ''
          }","${l.solutions || ''}",${l.durationMinutes}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Logbook_Proyek_Akhir_Latifa_Keysha.csv';
    a.click();
  };

  if (loading) {
    return <SkeletonLoading cardsCount={3} />;
  }

  const totalMinutes = logbooks.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#FFCED8] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-[#C75C73]" />
            <h2 className="text-xl font-bold text-slate-800">Progress Logbook Harian</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pusat catatan harian aktivitas, kendala teknis, solusi, serta durasi pengerjaan Proyek Akhir.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#863043] bg-[#FFF9FA] border border-[#FFCED8] hover:bg-[#FFF0F3] rounded-2xl transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Ekspor CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#863043] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] border border-[#F5A8B8] hover:opacity-95 rounded-2xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            + Tambah Log Harian
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8]">
          <span className="text-xs font-semibold text-slate-500">Total Hari Tercatat</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">{logbooks.length} Entri</div>
          <span className="text-[11px] text-[#C75C73] font-medium mt-0.5 block">Logbook Resmi PA</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8]">
          <span className="text-xs font-semibold text-slate-500">Akumulasi Waktu Riset</span>
          <div className="text-2xl font-bold text-[#A84157] mt-1">{totalHours} Jam</div>
          <span className="text-[11px] text-[#863043] font-medium mt-0.5 block">
            {totalMinutes} Menit Pengerjaan
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8]">
          <span className="text-xs font-semibold text-slate-500">AI Polish Assistant</span>
          <div className="text-sm font-bold text-emerald-600 mt-2 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Tata Bahasa Akademis Aktif
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Merapikan kalimat tanpa mengubah fakta
          </span>
        </div>
      </div>

      {/* Logbook Entries Feed */}
      <div className="space-y-4">
        {logbooks.map((log) => (
          <div
            key={log.id}
            className="bg-white rounded-3xl border border-[#FFCED8] p-5 shadow-sm space-y-3.5 hover:border-[#F5A8B8] transition-all"
          >
            {/* Entry Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#FFCED8]/40">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-xs px-2.5 py-1 rounded-lg bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4]">
                  {formatDateIndo(log.logDate, 'EEEE, dd MMMM yyyy')}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#C75C73]" /> {log.durationMinutes} Menit
                </span>
              </div>

              {log.aiPolished && (
                <span className="text-[10px] font-semibold text-[#863043] bg-[#FFCED8]/40 border border-[#FFCED8] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C75C73]" /> AI Formatted
                </span>
              )}
            </div>

            {/* Activity Title */}
            <div>
              <h3 className="font-bold text-sm text-slate-800 leading-snug">{log.activity}</h3>
              {log.workSteps && (
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{log.workSteps}</p>
              )}
            </div>

            {/* Results, Obstacles, Solutions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#FFF9FA] border border-[#FFCED8]/60 rounded-2xl">
                <span className="font-bold text-[#863043] block mb-1">Hasil yang Dicapai</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">{log.result || '-'}</p>
              </div>

              <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl">
                <span className="font-bold text-rose-900 block mb-1">Kendala / Masalah</span>
                <p className="text-slate-700 leading-relaxed text-[11px]">{log.obstacles || '-'}</p>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                <span className="font-bold text-emerald-900 block mb-1">Solusi yang Diterapkan</span>
                <p className="text-slate-700 leading-relaxed text-[11px]">{log.solutions || '-'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Logbook */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop-overlay p-3 sm:p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#231B1E] rounded-[28px] shadow-2xl shadow-[#C75C73]/20 border border-[#FFCED8] dark:border-[#4A3238] w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-modal-pop">
            {/* Modal Header */}
            <div className="shrink-0 px-6 py-4 bg-gradient-to-r from-[#FFF4DE] via-[#FFF0F3] to-[#FFCED8]/70 dark:from-[#35252A] dark:via-[#3E2930] dark:to-[#4A2E36] border-b border-[#FFCED8] dark:border-[#4A3238] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2D2226] text-[#C75C73] dark:text-[#FFB3C2] flex items-center justify-center shadow-sm border border-[#FFCED8]/60 dark:border-[#52373F]">
                  <BookMarked className="w-5 h-5 text-[#C75C73]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#3D3133] dark:text-[#FFF0F3] leading-tight">
                    Tambah Entri Logbook Harian
                  </h3>
                  <p className="text-xs text-[#863043]/80 dark:text-[#FFCED8]/80 font-medium mt-0.5">
                    Dokumentasikan kemajuan riset, aktivitas, kendala, dan solusinya
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

            {/* Modal Form with Scrollable Body & Pinned Footer */}
            <form onSubmit={handleCreateLogbook} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                        Tanggal Aktivitas
                      </label>
                      <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                        Wajib
                      </span>
                    </div>
                    <input
                      type="date"
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                        Durasi (Menit)
                      </label>
                      <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                        Wajib
                      </span>
                    </div>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      placeholder="120"
                      className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                      Aktivitas Utama Riset
                    </label>
                    <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                      Wajib
                    </span>
                  </div>
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    placeholder="Misal: Uji Coba Stopword Removal pada Korpus Abstrak TA 2021-2025"
                    className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                    Langkah Kerja yang Dilakukan
                  </label>
                  <textarea
                    rows={2}
                    value={workSteps}
                    onChange={(e) => setWorkSteps(e.target.value)}
                    placeholder="Rincian tahapan langkah teknis pengerjaan..."
                    className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                    Hasil yang Dicapai & Temuan
                  </label>
                  <textarea
                    rows={2}
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    placeholder="Output data, akurasi, grafik, atau hasil naskah..."
                    className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Kendala / Error Dihadapi
                    </label>
                    <textarea
                      rows={2}
                      value={obstacles}
                      onChange={(e) => setObstacles(e.target.value)}
                      placeholder="Masalah teknis atau teori..."
                      className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Solusi / Mitigasi yang Diambil
                    </label>
                    <textarea
                      rows={2}
                      value={solutions}
                      onChange={(e) => setSolutions(e.target.value)}
                      placeholder="Cara menyelesaikan kendala..."
                      className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Pinned Footer with Animated Buttons */}
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
                  <BookMarked className="w-3.5 h-3.5 group-hover:rotate-6 transition-transform" />
                  Simpan Catatan Logbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
