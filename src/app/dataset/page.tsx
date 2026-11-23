'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
  PieChart as PieIcon,
  Layers,
  ArrowRight,
  ShieldCheck,
  Plus,
  X,
  FileText,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatDateIndo } from '@/lib/utils';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';

const PIE_COLORS = ['#C75C73', '#E37F94', '#F2BF72', '#EFA97A', '#A84157', '#F5A8B8'];

export default function DatasetPage() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'versions'>('overview');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Version Form State
  const [versionName, setVersionName] = useState('');
  const [rowCount, setRowCount] = useState('374');
  const [columnCount, setColumnCount] = useState('6');
  const [changeNotes, setChangeNotes] = useState('');

  const fetchDatasets = async () => {
    try {
      const res = await fetch('/api/dataset');
      const json = await res.json();
      setDatasets(json.datasets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleCreateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datasets[0]) return;

    try {
      const res = await fetch('/api/dataset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId: datasets[0].id,
          versionName,
          rowCount,
          columnCount,
          changeNotes,
        }),
      });

      if (res.ok) {
        setIsUploadModalOpen(false);
        setVersionName('');
        setChangeNotes('');
        fetchDatasets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <SkeletonLoading cardsCount={5} hasChart={true} />;
  }

  const dataset = datasets[0];
  const yearDistributions =
    dataset?.distributions.filter((d: any) => d.distType === 'YEAR') || [];
  const trackDistributions =
    dataset?.distributions.filter((d: any) => d.distType === 'TRACK') || [];
  const versions = dataset?.versions || [];
  const exclusions = dataset?.exclusions || [];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#FFCED8] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#C75C73]" />
            <h2 className="text-xl font-bold text-slate-800">Dataset Management & Audit Trail</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFCED8]/50 text-[#863043] border border-[#FFCED8]">
              {dataset?.currentVersion || 'v1.0-raw-title'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pengelolaan dataset Tugas Akhir SITA PNP, validasi integritas korpus, audit eksklusi, dan distribusi temporal.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#863043] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] border border-[#F5A8B8] hover:opacity-95 rounded-2xl shadow-sm transition-all"
        >
          <Upload className="w-4 h-4" />
          + Unggah Dataset Versi Baru
        </button>
      </div>

      {/* CRITICAL WARNING BANNER: Dataset is Title-Only (Reviewer 1 Note) */}
      <div className="bg-rose-50/80 border-l-4 border-rose-500 rounded-r-3xl p-5 shadow-sm border border-rose-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-rose-900">
              PENTING: Status Dataset Saat Ini Masih Berbasis Judul (Title-Based Initial)
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              Dataset <strong>374 rekaman</strong> ini adalah data awal yang hanya memuat teks judul Tugas Akhir.
              Sesuai dengan <strong>catatan kritis Reviewer 1</strong>, dataset ini <em>BUKAN</em> data final karena
              judul terlalu pendek (high sparsity) dan belum mencakup teks abstrak atau kesimpulan Tugas Akhir.
              Jangan menganggapnya sebagai data hasil pemodelan akhir sebelum korpus isi diperluas!
            </p>
            <div className="pt-1 text-[11px] font-semibold text-rose-700">
              Tanggal Diterima: {formatDateIndo(dataset?.receivedDate, 'dd MMMM yyyy')} • Status Ekspor Aktual SITA: Belum Terkonfirmasi
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Statistics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8]">
          <span className="text-xs font-semibold text-slate-500">Total Data Awal</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">{dataset?.initialCount || 374}</div>
          <span className="text-[11px] text-[#C75C73] font-medium mt-0.5 block">Rekaman Judul</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8]">
          <span className="text-xs font-semibold text-slate-500">TRPL Reguler</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">{dataset?.regularCount || 335}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">89.6% dari total</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8]">
          <span className="text-xs font-semibold text-slate-500">TRPL Alih Kredit</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">{dataset?.alihKreditCount || 39}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">10.4% dari total</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8]">
          <span className="text-xs font-semibold text-slate-500">Historis (2021-2025)</span>
          <div className="text-2xl font-bold text-[#A84157] mt-1">253</div>
          <span className="text-[11px] text-[#C75C73] font-medium mt-0.5 block">Training Set</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8]">
          <span className="text-xs font-semibold text-slate-500">Holdout (2026)</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {dataset?.temporalHoldoutCount || 121}
          </div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Temporal Test Set</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-[#FFCED8] gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'overview'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <PieIcon className="w-4 h-4 text-[#C75C73]" />
          Distribusi & Visualisasi Dataset
        </button>

        <button
          onClick={() => setActiveTab('versions')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'versions'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#A84157]" />
          Riwayat Versi Dataset ({versions.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'audit'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Dataset Audit Trail & Aturan Eksklusi
        </button>
      </div>

      {/* TAB 1: Visualizations */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Year Distribution Chart */}
          <div className="bg-white p-5 rounded-3xl border border-[#FFCED8] shadow-sm space-y-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Distribusi Data Berdasarkan Tahun (2021 — 2026)
              </h3>
              <p className="text-xs text-slate-500">
                Pemisahan antara korpus historis 2021-2025 dan temporal holdout 2026
              </p>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearDistributions} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5e8ea" />
                  <XAxis dataKey="categoryOrYear" tick={{ fontSize: 11, fill: '#863043' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#863043' }} />
                  <Tooltip
                    formatter={(val: any) => [`${val} Dokumen`, 'Jumlah']}
                    contentStyle={{ borderRadius: '16px', fontSize: '12px', borderColor: '#FFCED8' }}
                  />
                  <Bar dataKey="count" fill="#C75C73" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Track Distribution Pie Chart */}
          <div className="bg-white p-5 rounded-3xl border border-[#FFCED8] shadow-sm space-y-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Proporsi Jalur Mahasiswa (Reguler vs Alih Kredit)
              </h3>
              <p className="text-xs text-slate-500">
                Perbandingan porsi judul TA D4 TRPL Reguler (335) dan Alih Kredit (39)
              </p>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trackDistributions}
                    dataKey="count"
                    nameKey="categoryOrYear"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.categoryOrYear}: ${entry.count} (${entry.percentage}%)`}
                    labelLine={false}
                  >
                    {trackDistributions.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} Dokumen`, 'Jumlah']}
                    contentStyle={{ borderRadius: '16px', fontSize: '12px', borderColor: '#FFCED8' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Versions */}
      {activeTab === 'versions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#FFCED8] shadow-sm overflow-hidden">
            <div className="p-4 bg-[#FFF9FA] border-b border-[#FFCED8]">
              <h3 className="font-bold text-xs text-[#863043] uppercase tracking-wider">
                Riwayat Snapshot Dataset (Tidak Menimpa File Sumber Asli)
              </h3>
            </div>

            <div className="divide-y divide-[#FFCED8]/40 text-xs">
              {versions.map((v: any) => (
                <div key={v.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-slate-800 text-xs">{v.versionName}</h4>
                      <span className="text-[10px] bg-[#FFF4DE] text-[#863043] px-2 py-0.5 rounded-lg border border-[#FFE8C4]">
                        Versi #{v.versionNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{v.changeNotes || 'Data awal ekspor SITA'}</p>
                  </div>

                  <div className="flex items-center gap-4 text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-800">{v.rowCount} Baris</span> •{' '}
                      <span>{v.columnCount} Kolom</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {formatDateIndo(v.uploadedAt, 'dd MMM yyyy')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-[#FFCED8] shadow-sm p-5 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-800">Dataset Audit Trail & Aturan Eksklusi</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap penghapusan baris atau eksklusi data harus memiliki catatan aturan teknis agar proses penelitian dapat ditelusuri kembali.
            </p>
          </div>

          <div className="p-4 bg-[#FFF9FA] rounded-2xl border border-[#FFCED8]/60 text-xs space-y-2">
            <div className="font-bold text-[#863043]">Aturan Eksklusi Data Terdaftar:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
              <li><strong>E1 - Non-TRPL:</strong> Dokumen tugas akhir dari program studi luar TRPL (MI, TK) yang tidak sengaja terambil.</li>
              <li><strong>E2 - Exact Title Duplication:</strong> Judul yang sama persis oleh mahasiswa yang sama karena pengajuan ganda.</li>
              <li><strong>E3 - Sparsity Kosong:</strong> Teks judul yang setelah preprocessing stopword tidak menyisakan token kosakata unik.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Modal Upload New Version */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop-overlay p-3 sm:p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#231B1E] rounded-[28px] shadow-2xl shadow-[#C75C73]/20 border border-[#FFCED8] dark:border-[#4A3238] w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-modal-pop">
            <div className="shrink-0 px-6 py-4 bg-gradient-to-r from-[#FFF4DE] via-[#FFF0F3] to-[#FFCED8]/70 dark:from-[#35252A] dark:via-[#3E2930] dark:to-[#4A2E36] border-b border-[#FFCED8] dark:border-[#4A3238] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2D2226] text-[#C75C73] dark:text-[#FFB3C2] flex items-center justify-center shadow-sm border border-[#FFCED8]/60 dark:border-[#52373F]">
                  <Database className="w-5 h-5 text-[#C75C73]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#3D3133] dark:text-[#FFF0F3] leading-tight">
                    Unggah Versi Dataset Baru
                  </h3>
                  <p className="text-xs text-[#863043]/80 dark:text-[#FFCED8]/80 font-medium mt-0.5">
                    Catat penambahan korpus data, rincian baris, dan skema pembersihan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#863043]/70 hover:text-[#863043] dark:text-[#FFCED8]/70 dark:hover:text-[#FFF0F3] hover:bg-white/80 dark:hover:bg-[#2D2226] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVersion} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                      Nama Versi Dataset
                    </label>
                    <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                      Wajib
                    </span>
                  </div>
                  <input
                    type="text"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                    placeholder="Misal: v1.1 - Dataset Tambahan Ekstraksi Abstrak SITA PNP"
                    className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                        Jumlah Baris (Dokumen)
                      </label>
                      <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                        Wajib
                      </span>
                    </div>
                    <input
                      type="number"
                      value={rowCount}
                      onChange={(e) => setRowCount(e.target.value)}
                      placeholder="347"
                      className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                        Jumlah Kolom / Fitur
                      </label>
                      <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                        Wajib
                      </span>
                    </div>
                    <input
                      type="number"
                      value={columnCount}
                      onChange={(e) => setColumnCount(e.target.value)}
                      placeholder="7"
                      className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                      Catatan Perubahan / Sumber Data Korpus
                    </label>
                    <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                      Wajib
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={changeNotes}
                    onChange={(e) => setChangeNotes(e.target.value)}
                    placeholder="Keterangan penambahan kolom abstrak atau pembersihan duplikat..."
                    className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                    required
                  />
                </div>
              </div>

              <div className="shrink-0 px-6 py-3.5 bg-[#FFF9FA]/80 dark:bg-[#1C1417]/90 border-t border-[#FFCED8]/60 dark:border-[#4A3238] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="btn-secondary-animated px-4 py-2.5 text-xs font-bold text-[#6B5A5D] dark:text-[#D4B8BE] hover:bg-[#FFF0F3] dark:hover:bg-[#2D2226] rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary-animated px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#C75C73] via-[#D8687F] to-[#863043] rounded-xl shadow-md shadow-[#C75C73]/30 flex items-center gap-2 group cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 group-hover:rotate-6 transition-transform" />
                  Simpan Versi Dataset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
