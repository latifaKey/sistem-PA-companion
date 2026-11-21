'use client';

import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Plus,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Sliders,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatDateIndo } from '@/lib/utils';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'models' | 'preprocessing' | 'topics'>('models');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Experiment Form State
  const [name, setName] = useState('');
  const [experimentCode, setExperimentCode] = useState('EXP-LDA-002');
  const [numTopicsK, setNumTopicsK] = useState('8');
  const [alpha, setAlpha] = useState('symmetric');
  const [passes, setPasses] = useState('30');
  const [coherenceCv, setCoherenceCv] = useState('0.448');
  const [topicDiversity, setTopicDiversity] = useState('0.680');
  const [redundancyScore, setRedundancyScore] = useState('0.320');
  const [hypothesisOrGoal, setHypothesisOrGoal] = useState('');

  const fetchExperiments = async () => {
    try {
      const res = await fetch('/api/experiments');
      const data = await res.json();
      setExperiments(data.experiments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const handleCreateExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          experimentCode,
          numTopicsK,
          alpha,
          passes,
          coherenceCv,
          topicDiversity,
          redundancyScore,
          hypothesisOrGoal,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setName('');
        setHypothesisOrGoal('');
        fetchExperiments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCandidate = async (id: string, currentVal: boolean) => {
    try {
      setExperiments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isSelectedCandidate: !currentVal } : e))
      );
      await fetch('/api/experiments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isSelectedCandidate: !currentVal }),
      });
    } catch (err) {
      console.error(err);
      fetchExperiments();
    }
  };

  if (loading) {
    return <SkeletonLoading cardsCount={4} hasChart={true} />;
  }

  // Coherence Curve Chart Data
  const ldaRuns = experiments.filter((e) => e.experimentType === 'LDA');
  const chartData = [
    { k: 'K=4', cv: 0.354 },
    { k: 'K=5 (Exp 1)', cv: 0.382 },
    { k: 'K=6', cv: 0.412 },
    { k: 'K=8 (Target)', cv: 0.448 },
    { k: 'K=10', cv: 0.425 },
    { k: 'K=12', cv: 0.398 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#FFCED8] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#C75C73]" />
            <h2 className="text-xl font-bold text-slate-800">Research Experiments & LDA Tuning</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Dokumentasi komparatif eksperimen Preprocessing teks bahasa Indonesia dan tuning hyperparameter model LDA.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#863043] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] border border-[#F5A8B8] hover:opacity-95 rounded-2xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          + Catat Uji Coba Baru
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#FFCED8] gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('models')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'models'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#C75C73]" />
          Eksperimen LDA & Evaluasi Metrik ({ldaRuns.length})
        </button>

        <button
          onClick={() => setActiveTab('preprocessing')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'preprocessing'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#A84157]" />
          Preprocessing & Karakteristik Korpus
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'topics'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Hasil Klaster Topik & Kata Kunci
        </button>
      </div>

      {/* TAB 1: Models & Metrics */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          {/* Metric Curve Chart */}
          <div className="bg-white p-5 rounded-3xl border border-[#FFCED8] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-800">
                  Kurva Topic Coherence (Cv) vs Jumlah Topik (K)
                </h3>
                <p className="text-xs text-slate-500">
                  Titik optimum menunjukkan jumlah klaster topik paling koheren secara semantik
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFCED8]/50 text-[#863043] border border-[#FFCED8]">
                Elbow Point: K = 8
              </span>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5e8ea" />
                  <XAxis dataKey="k" tick={{ fontSize: 11, fill: '#863043' }} />
                  <YAxis domain={[0.3, 0.5]} tick={{ fontSize: 11, fill: '#863043' }} />
                  <Tooltip
                    formatter={(val: any) => [val, 'Coherence Cv']}
                    contentStyle={{ borderRadius: '16px', fontSize: '12px', borderColor: '#FFCED8' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cv"
                    stroke="#C75C73"
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: '#C75C73' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Comparison Table */}
          <div className="bg-white rounded-3xl border border-[#FFCED8] shadow-sm overflow-hidden">
            <div className="p-4 bg-[#FFF9FA] border-b border-[#FFCED8] flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#863043] uppercase tracking-wider">
                Tabel Komparasi Eksperimen Pemodelan LDA
              </h3>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9FA] text-[#863043] font-semibold uppercase tracking-wider border-b border-[#FFCED8]">
                <tr>
                  <th className="p-3.5 pl-5">Kode & Nama Model</th>
                  <th className="p-3.5">Topik K</th>
                  <th className="p-3.5">Alpha / Beta</th>
                  <th className="p-3.5">Coherence (Cv)</th>
                  <th className="p-3.5">Topic Diversity</th>
                  <th className="p-3.5">Redundancy</th>
                  <th className="p-3.5">Kandidat Terpilih</th>
                  <th className="p-3.5 pr-5">Tanggal Eksekusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFCED8]/40">
                {experiments.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#FFF9FA] transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-slate-800">{exp.name}</div>
                      <span className="text-[10px] font-mono bg-[#FFF4DE] text-[#863043] px-1.5 py-0.5 rounded border border-[#FFE8C4]">
                        {exp.experimentCode}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-700">{exp.ldaConfig?.numTopicsK || '-'}</td>
                    <td className="p-3.5 text-slate-600">{exp.ldaConfig?.alpha || '-'} / {exp.ldaConfig?.etaBeta || '-'}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-[#863043] bg-[#FFCED8]/40 border border-[#FFCED8] px-2 py-0.5 rounded-lg">
                        {exp.metric?.coherenceCv?.toFixed(3) || '-'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">{exp.metric?.topicDiversity?.toFixed(3) || '-'}</td>
                    <td className="p-3.5 text-slate-500">{exp.metric?.redundancyScore?.toFixed(3) || '-'}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleCandidate(exp.id, exp.isSelectedCandidate)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 transition-all ${
                          exp.isSelectedCandidate
                            ? 'bg-[#FFE8C4] text-[#863043] border-[#FFE8C4]'
                            : 'bg-[#FFF9FA] text-slate-500 border-[#FFCED8] hover:bg-[#FFF0F3]'
                        }`}
                      >
                        <Award className="w-3 h-3 text-[#C75C73]" />
                        {exp.isSelectedCandidate ? 'Kandidat Utama' : 'Jadikan Kandidat'}
                      </button>
                    </td>
                    <td className="p-3.5 pr-5 text-slate-400">
                      {formatDateIndo(exp.executedAt, 'dd MMM yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Preprocessing */}
      {activeTab === 'preprocessing' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#FFCED8] shadow-sm space-y-2">
              <span className="text-xs font-bold text-[#863043] uppercase">Case Folding & Tokenisasi</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pembersihan simbol non-alfanumerik, konversi huruf kecil (lowercasing), dan pemisahan kata majemuk TRPL.
              </p>
              <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                Status: Selesai diuji pada 374 judul
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#FFCED8] shadow-sm space-y-2">
              <span className="text-xs font-bold text-[#863043] uppercase">Stopword Removal</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kombinasi stopword Sastrawi dan 35 kata stopword akademik (e.g., "sistem", "informasi", "berbasis", "menggunakan", "tugas", "akhir").
              </p>
              <div className="text-[11px] font-semibold text-[#863043] bg-[#FFF4DE] border border-[#FFE8C4] p-2.5 rounded-xl">
                Daftar Stopword Akademik Tersimpan
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#FFCED8] shadow-sm space-y-2">
              <span className="text-xs font-bold text-[#863043] uppercase">Stemming Comparison</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Perbandingan algoritma Sastrawi vs Tanpa Stemming untuk mencegah overstemming istilah teknis IT (e.g. "pemrograman" vs "program").
              </p>
              <div className="text-[11px] font-semibold text-[#863043] bg-[#FFCED8]/40 border border-[#FFCED8] p-2.5 rounded-xl">
                Direkomendasikan: Tanpa Stemming
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Discovered Topics */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiments[0]?.topicModels?.[0]?.topics?.map((topic: any) => (
              <div
                key={topic.id}
                className="bg-white rounded-3xl border border-[#FFCED8] p-5 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4]">
                    Topik #{topic.topicNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Coherence: {topic.coherenceScore}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-800">{topic.label}</h4>

                <div className="p-3 bg-[#FFF9FA] rounded-2xl border border-[#FFCED8]/60 text-xs">
                  <span className="text-[11px] font-bold text-[#A84157] uppercase block mb-1">
                    Top Words (Kata Kunci Pembentuk):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.topWords.split(',').map((w: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-white border border-[#FFCED8] text-[#863043] font-medium text-[11px]"
                      >
                        {w.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {topic.interpretation && (
                  <p className="text-[11px] text-slate-500 italic leading-relaxed">
                    Interpretasi: {topic.interpretation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Experiment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#FFCED8] w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-4 bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] text-[#863043] border-b border-[#FFCED8] flex items-center justify-between">
              <h3 className="font-bold text-sm">Catat Uji Coba Eksperimen LDA Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#863043] hover:opacity-75">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExperiment} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Eksperimen</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Uji Tuning Topik K=8 dengan Alpha Symmetric"
                  className="w-full p-2.5 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Eksperimen</label>
                  <input
                    type="text"
                    value={experimentCode}
                    onChange={(e) => setExperimentCode(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jumlah Topik (K)</label>
                  <input
                    type="number"
                    value={numTopicsK}
                    onChange={(e) => setNumTopicsK(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coherence (Cv)</label>
                  <input
                    type="text"
                    value={coherenceCv}
                    onChange={(e) => setCoherenceCv(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Topic Diversity</label>
                  <input
                    type="text"
                    value={topicDiversity}
                    onChange={(e) => setTopicDiversity(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Redundancy</label>
                  <input
                    type="text"
                    value={redundancyScore}
                    onChange={(e) => setRedundancyScore(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tujuan / Catatan Analisis</label>
                <textarea
                  rows={2}
                  value={hypothesisOrGoal}
                  onChange={(e) => setHypothesisOrGoal(e.target.value)}
                  placeholder="Catatan hasil pengujian model..."
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
                  Simpan Eksperimen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
