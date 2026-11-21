'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  HelpCircle,
  Play,
  Award,
  Sparkles,
  Clock,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';

export default function SeminarPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bank' | 'simulator' | 'checklist'>('bank');
  const [simIndex, setSimIndex] = useState(0);
  const [simTimer, setSimTimer] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/seminar');
      const data = await res.json();
      setQuestions(data.questions || []);
      setChecklists(data.checklists || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && simTimer > 0) {
      interval = setInterval(() => setSimTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, simTimer]);

  const handleUpdateAnswer = async (questionId: string, studentAnswer: string, readinessStatus: string) => {
    try {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, studentAnswer, readinessStatus } : q))
      );

      await fetch('/api/seminar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, studentAnswer, readinessStatus }),
      });
    } catch (err) {
      console.error(err);
      fetchData();
    }
  };

  const handleToggleChecklist = async (checklistId: string, isCompleted: boolean) => {
    try {
      setChecklists((prev) =>
        prev.map((c) => (c.id === checklistId ? { ...c, isCompleted: !isCompleted } : c))
      );

      await fetch('/api/seminar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklistId, isCompleted: !isCompleted }),
      });
    } catch (err) {
      console.error(err);
      fetchData();
    }
  };

  if (loading) {
    return <SkeletonLoading cardsCount={3} />;
  }

  const currentSimQuestion = questions[simIndex] || questions[0];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#FFCED8] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#C75C73]" />
            <h2 className="text-xl font-bold text-slate-800">Seminar & Sidang Akhir Management</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Bank pertanyaan dewan penguji seputar topik LDA, simulator tanya jawab pertahanan skripsi, dan checklist kesiapan sidang.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveTab('simulator');
            setSimTimer(120);
            setIsTimerRunning(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#863043] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] border border-[#F5A8B8] hover:opacity-95 rounded-2xl shadow-sm transition-all"
        >
          <Play className="w-3.5 h-3.5" />
          Mulai Simulasi Sidang (Mock Defense)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#FFCED8] gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('bank')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'bank'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#C75C73]" />
          Bank Pertanyaan Penguji ({questions.length})
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'simulator'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <Play className="w-4 h-4 text-[#A84157]" />
          Simulator Tanya Jawab Interaktif
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'checklist'
              ? 'border-[#C75C73] text-[#863043]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Checklist Persyaratan Sidang
        </button>
      </div>

      {/* TAB 1: Defense Question Bank */}
      {activeTab === 'bank' && (
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-3xl border border-[#FFCED8] p-5 shadow-sm space-y-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4]">
                    {q.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      q.readinessStatus === 'SIAP' || q.readinessStatus === 'SANGAT_SIAP'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-[#FFE8C4] text-[#863043] border-[#FFE8C4]'
                    }`}
                  >
                    Kesiapan: {q.readinessStatus}
                  </span>
                </div>

                <select
                  value={q.readinessStatus}
                  onChange={(e) =>
                    handleUpdateAnswer(q.id, q.studentAnswer || '', e.target.value)
                  }
                  className="text-xs font-semibold bg-[#FFF9FA] border border-[#FFCED8] rounded-xl px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                >
                  <option value="BELUM_SIAP">Belum Siap</option>
                  <option value="SEDANG_DIPELAJARI">Sedang Dipelajari</option>
                  <option value="SIAP">Siap</option>
                  <option value="SANGAT_SIAP">Sangat Siap</option>
                </select>
              </div>

              <h3 className="font-bold text-sm text-slate-800 leading-snug">{q.question}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3.5 bg-[#FFF4DE]/60 rounded-2xl border border-[#FFE8C4] space-y-1">
                  <span className="font-bold text-[#863043] block">Kunci Jawaban Ilmiah Acuan:</span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">{q.suggestedAnswer}</p>
                </div>

                <div className="p-3.5 bg-[#FFF9FA] rounded-2xl border border-[#FFCED8]/60 space-y-1">
                  <span className="font-bold text-[#863043] block">Draft Jawaban Mahasiswa:</span>
                  <textarea
                    rows={3}
                    value={q.studentAnswer || ''}
                    onChange={(e) =>
                      setQuestions((prev) =>
                        prev.map((item) =>
                          item.id === q.id ? { ...item, studentAnswer: e.target.value } : item
                        )
                      )
                    }
                    onBlur={(e) =>
                      handleUpdateAnswer(q.id, e.target.value, q.readinessStatus)
                    }
                    placeholder="Tuliskan jawaban latihan Anda..."
                    className="w-full text-xs p-2 bg-white border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Defense Simulator */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-3xl border border-[#FFCED8] p-6 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-[#FFCED8]/40">
            <div>
              <span className="text-[11px] font-bold text-[#A84157] uppercase tracking-wider block">
                Simulasi Sidang Proyek Akhir
              </span>
              <h3 className="text-base font-bold text-slate-800 mt-0.5">
                Pertanyaan #{simIndex + 1} dari {questions.length}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF9FA] border border-[#FFCED8] font-mono font-bold text-xs text-[#863043]">
                <Clock className="w-4 h-4 text-[#C75C73]" />
                <span>
                  {Math.floor(simTimer / 60)}:{(simTimer % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4]"
              >
                {isTimerRunning ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4]">
              Kategori: {currentSimQuestion?.category}
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
              "{currentSimQuestion?.question}"
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <label className="block font-bold text-[#863043]">Jawaban Lisan Mahasiswa:</label>
            <textarea
              rows={4}
              value={currentSimQuestion?.studentAnswer || ''}
              onChange={(e) =>
                handleUpdateAnswer(
                  currentSimQuestion.id,
                  e.target.value,
                  currentSimQuestion.readinessStatus
                )
              }
              placeholder="Jelaskan jawaban secara akademis dan percaya diri..."
              className="w-full text-xs p-3 border border-[#FFCED8] rounded-2xl focus:ring-2 focus:ring-[#C75C73]/30 focus:outline-none"
            />
          </div>

          <div className="p-4 bg-[#FFF4DE]/60 rounded-2xl border border-[#FFE8C4] text-xs space-y-1">
            <span className="font-bold text-[#863043] block">Kunci Penjelasan Ideal:</span>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              {currentSimQuestion?.suggestedAnswer}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#FFCED8]/40">
            <button
              disabled={simIndex === 0}
              onClick={() => {
                setSimIndex(simIndex - 1);
                setSimTimer(120);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-[#FFF9FA] border border-[#FFCED8] rounded-xl disabled:opacity-40"
            >
              &larr; Pertanyaan Sebelumnya
            </button>
            <button
              disabled={simIndex >= questions.length - 1}
              onClick={() => {
                setSimIndex(simIndex + 1);
                setSimTimer(120);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#C75C73] hover:bg-[#A84157] rounded-xl disabled:opacity-40 flex items-center gap-1.5 shadow-sm"
            >
              Pertanyaan Berikutnya &rarr;
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Checklist */}
      {activeTab === 'checklist' && (
        <div className="bg-white rounded-3xl border border-[#FFCED8] shadow-sm overflow-hidden">
          <div className="p-4 bg-[#FFF9FA] border-b border-[#FFCED8]">
            <h3 className="font-bold text-xs text-[#863043] uppercase tracking-wider">
              Checklist Kelengkapan Administrasi & Berkas Sidang
            </h3>
          </div>

          <div className="divide-y divide-[#FFCED8]/40 text-xs">
            {checklists.map((c) => (
              <div
                key={c.id}
                onClick={() => handleToggleChecklist(c.id, c.isCompleted)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[#FFF9FA] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={c.isCompleted}
                    onChange={() => {}}
                    className="w-4 h-4 text-[#C75C73] rounded border-[#FFCED8] pointer-events-none accent-[#C75C73]"
                  />
                  <div>
                    <h4
                      className={`font-semibold text-xs ${
                        c.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {c.itemTitle}
                    </h4>
                    {c.notes && <p className="text-[11px] text-slate-400 mt-0.5">{c.notes}</p>}
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4]">
                  {c.stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
