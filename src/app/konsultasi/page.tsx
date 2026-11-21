'use client';

import React, { useState, useEffect } from 'react';
import {
  Users2,
  Calendar,
  Plus,
  HelpCircle,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Sparkles,
  X,
  FileCheck,
} from 'lucide-react';
import { formatDateIndo } from '@/lib/utils';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';

export default function KonsultasiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'logs' | 'questions'>('logs');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [supervisorId, setSupervisorId] = useState('');
  const [consultationDate, setConsultationDate] = useState('2026-11-21');
  const [mediaType, setMediaType] = useState('Offline / Tatap Muka');
  const [chapterDiscussed, setChapterDiscussed] = useState('BAB I & BAB III');
  const [questionsAsked, setQuestionsAsked] = useState('');
  const [supervisorFeedback, setSupervisorFeedback] = useState('');
  const [decisionResult, setDecisionResult] = useState('');
  const [nextActionTasks, setNextActionTasks] = useState('');
  const [followupDeadline, setFollowupDeadline] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/consultations');
      const json = await res.json();
      setData(json.project);
      if (json.project?.supervisors?.length && !supervisorId) {
        setSupervisorId(json.project.supervisors[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisorFeedback.trim()) return;

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supervisorId,
          consultationDate,
          mediaType,
          chapterDiscussed,
          questionsAsked,
          supervisorFeedback,
          decisionResult,
          nextActionTasks,
          followupDeadline: followupDeadline || null,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setQuestionsAsked('');
        setSupervisorFeedback('');
        setDecisionResult('');
        setNextActionTasks('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <SkeletonLoading cardsCount={2} />;
  }

  const supervisors = data?.supervisors || [];
  const consultations = data?.consultations || [];
  const questions = data?.consultationQuestions || [];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#FFCED8] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users2 className="w-5 h-5 text-[#C75C73]" />
            <h2 className="text-xl font-bold text-slate-800">Konsultasi & Bimbingan Dosen</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Dokumentasi berkala arahan dosen pembimbing, bank pertanyaan pra-konsultasi, dan tindak lanjut tugas akademik.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#863043] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] border border-[#F5A8B8] hover:opacity-95 rounded-2xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          + Catat Hasil Bimbingan
        </button>
      </div>

      {/* Supervisors Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supervisors.map((s: any) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl border border-[#FFCED8] p-5 shadow-sm space-y-3 relative overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C75C73] to-[#A84157] text-white font-bold text-base flex items-center justify-center shrink-0 shadow-md shadow-[#C75C73]/20">
                {s.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4]">
                  {s.roleTitle}
                </span>
                <h3 className="font-bold text-sm text-slate-800">{s.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{s.position}</p>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-600 space-y-1.5 border-t border-[#FFCED8]/40">
              <div className="flex items-center gap-2 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{s.phone || '-'}</span>
                <span className="text-slate-300">•</span>
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{s.email || '-'}</span>
              </div>
              <div className="text-[11px] bg-[#FFF9FA] p-2.5 rounded-xl border border-[#FFCED8]/60">
                <strong className="text-[#863043]">Preferensi Bimbingan: </strong>
                {s.consultationPreferences}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-[#FFCED8] gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'logs'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#C75C73]" />
          Riwayat Log Konsultasi ({consultations.length})
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'questions'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#A84157]" />
          Bank Pertanyaan Sebelum Konsultasi ({questions.length})
        </button>
      </div>

      {/* TAB 1: Consultation Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {consultations.map((c: any) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-[#FFCED8] p-5 shadow-sm space-y-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#FFCED8]/40">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-xs bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4] px-2.5 py-1 rounded-lg">
                    {c.supervisor.name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Media: {c.mediaType}
                  </span>
                  {c.chapterDiscussed && (
                    <span className="text-[11px] bg-[#FFCED8]/40 text-[#863043] px-2 py-0.5 rounded-lg border border-[#FFCED8]">
                      Bahasan: {c.chapterDiscussed}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#C75C73]" />
                  {formatDateIndo(c.consultationDate, 'EEEE, dd MMMM yyyy')}
                </div>
              </div>

              {/* Questions & Feedback */}
              <div className="space-y-2 text-xs">
                {c.questionsAsked && (
                  <div className="bg-[#FFF9FA] p-3 rounded-2xl border border-[#FFCED8]/60">
                    <span className="font-bold text-[#863043] block mb-1">
                      Pertanyaan yang Diajukan Mahasiswa:
                    </span>
                    <p className="text-slate-600 leading-relaxed italic">{c.questionsAsked}</p>
                  </div>
                )}

                <div className="bg-[#FFF4DE]/50 p-3.5 rounded-2xl border border-[#FFE8C4]">
                  <span className="font-bold text-[#863043] block mb-1">
                    Masukan & Arahan Dosen Pembimbing:
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">{c.supervisorFeedback}</p>
                </div>

                {/* Decisions & Follow-ups */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {c.decisionResult && (
                    <div className="p-3 bg-[#FFCED8]/30 border border-[#FFCED8] rounded-2xl">
                      <span className="font-bold text-[#863043] block mb-1">Keputusan Akhir:</span>
                      <p className="text-slate-700 text-[11px]">{c.decisionResult}</p>
                    </div>
                  )}

                  {c.nextActionTasks && (
                    <div className="p-3 bg-[#FFE8C4]/40 border border-[#FFE8C4] rounded-2xl">
                      <span className="font-bold text-[#863043] block mb-1">Tugas Tindak Lanjut:</span>
                      <p className="text-slate-700 text-[11px]">{c.nextActionTasks}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Question Bank */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-3xl border border-[#FFCED8] shadow-sm overflow-hidden">
          <div className="p-4 bg-[#FFF9FA] border-b border-[#FFCED8] flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#863043] uppercase tracking-wider">
              Daftar Pertanyaan yang Perlu Ditanyakan ke Dosen
            </h3>
            <span className="text-xs text-slate-500">
              Persiapkan pertanyaan sebelum jadwal bimbingan dimulai
            </span>
          </div>

          <div className="divide-y divide-[#FFCED8]/40 text-xs">
            {questions.map((q: any) => (
              <div key={q.id} className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#863043] bg-[#FFCED8]/40 border border-[#FFCED8] px-2 py-0.5 rounded-lg text-[11px]">
                      {q.category}
                    </span>
                    <span className="text-slate-500 font-medium">
                      Ditujukan ke: {q.supervisor?.name || 'Pembimbing'}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.status === 'ASKED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-[#FFE8C4] text-[#863043] border border-[#FFE8C4]'
                    }`}
                  >
                    {q.status === 'ASKED' ? 'Sudah Ditanyakan' : 'Belum Ditanyakan'}
                  </span>
                </div>
                <p className="text-slate-800 font-semibold text-xs leading-relaxed">{q.questionText}</p>
                {q.answerNotes && (
                  <div className="p-2.5 rounded-xl bg-[#FFF9FA] border border-[#FFCED8]/60 text-[11px] text-slate-600">
                    <strong className="text-[#863043]">Catatan Jawaban Dosen: </strong>
                    {q.answerNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Consultation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#FFCED8] w-full max-w-xl overflow-hidden animate-fade-in">
            <div className="p-4 bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] text-[#863043] border-b border-[#FFCED8] flex items-center justify-between">
              <h3 className="font-bold text-sm">Catat Sesi Bimbingan Dosen Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#863043] hover:opacity-75">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateConsultation} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosen Pembimbing</label>
                  <select
                    value={supervisorId}
                    onChange={(e) => setSupervisorId(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                    required
                  >
                    {supervisors.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Bimbingan</label>
                  <input
                    type="date"
                    value={consultationDate}
                    onChange={(e) => setConsultationDate(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Media Konsultasi</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  >
                    <option value="Offline / Tatap Muka">Offline / Tatap Muka</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bab yang Dibahas</label>
                  <input
                    type="text"
                    value={chapterDiscussed}
                    onChange={(e) => setChapterDiscussed(e.target.value)}
                    placeholder="BAB I & BAB III"
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Masukan & Arahan Dosen (Wajib)
                </label>
                <textarea
                  rows={3}
                  value={supervisorFeedback}
                  onChange={(e) => setSupervisorFeedback(e.target.value)}
                  placeholder="Arahan pembimbing terkait naskah, dataset, atau eksperimen..."
                  className="w-full p-2.5 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keputusan Bimbingan</label>
                  <textarea
                    rows={2}
                    value={decisionResult}
                    onChange={(e) => setDecisionResult(e.target.value)}
                    placeholder="Keputusan yang disepakati..."
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tugas Lanjutan</label>
                  <textarea
                    rows={2}
                    value={nextActionTasks}
                    onChange={(e) => setNextActionTasks(e.target.value)}
                    placeholder="Tugas tindak lanjut..."
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  />
                </div>
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
                  Simpan Bimbingan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
