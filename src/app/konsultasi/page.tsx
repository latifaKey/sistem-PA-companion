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
  Pencil,
  Trash2,
  MessageSquare,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { formatDateIndo } from '@/lib/utils';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';
import { fallbackProject, fallbackSupervisors, fallbackConsultations, fallbackConsultationQuestions } from '@/lib/fallbackData';

interface Supervisor {
  id: string;
  name: string;
  roleTitle: string;
  position?: string | null;
  phone?: string | null;
  email?: string | null;
  consultationPreferences?: string | null;
}

interface Consultation {
  id: string;
  supervisorId: string;
  supervisor?: Supervisor;
  consultationDate: Date | string;
  mediaType: string;
  chapterDiscussed?: string | null;
  questionsAsked?: string | null;
  supervisorFeedback: string;
  decisionResult?: string | null;
  nextActionTasks?: string | null;
  followupDeadline?: Date | string | null;
  status?: string;
}

interface ConsultationQuestion {
  id: string;
  supervisorId?: string | null;
  supervisor?: Supervisor | null;
  questionText: string;
  category: string;
  status: string; // UNASKED, ASKED, RESOLVED
  answerNotes?: string | null;
  createdAt?: Date | string;
}

export default function KonsultasiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'logs' | 'questions'>('logs');

  // Supervior state list
  const [supervisors, setSupervisors] = useState<Supervisor[]>(fallbackSupervisors);
  const [consultations, setConsultations] = useState<Consultation[]>(fallbackConsultations);
  const [questions, setQuestions] = useState<ConsultationQuestion[]>(fallbackConsultationQuestions);

  // Modal 1: Consultation Log (Create & Edit)
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [editingConsultationId, setEditingConsultationId] = useState<string | null>(null);
  const [supervisorId, setSupervisorId] = useState('');
  const [consultationDate, setConsultationDate] = useState('2026-11-21');
  const [mediaType, setMediaType] = useState('Offline / Tatap Muka');
  const [chapterDiscussed, setChapterDiscussed] = useState('BAB III & Revisi Sempro');
  const [questionsAsked, setQuestionsAsked] = useState('');
  const [supervisorFeedback, setSupervisorFeedback] = useState('');
  const [decisionResult, setDecisionResult] = useState('');
  const [nextActionTasks, setNextActionTasks] = useState('');
  const [followupDeadline, setFollowupDeadline] = useState('');

  // Modal 2: Supervisor (Create & Edit)
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
  const [editingSupervisorId, setEditingSupervisorId] = useState<string | null>(null);
  const [supName, setSupName] = useState('');
  const [supRoleTitle, setSupRoleTitle] = useState('Pembimbing 1 (Utama)');
  const [supPosition, setSupPosition] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supPreferences, setSupPreferences] = useState('');

  // Modal 3: Question Bank (Create & Edit)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qSupervisorId, setQSupervisorId] = useState('');
  const [qText, setQText] = useState('');
  const [qCategory, setQCategory] = useState('Metodologi');
  const [qStatus, setQStatus] = useState('UNASKED');
  const [qAnswerNotes, setQAnswerNotes] = useState('');

  // Question filter
  const [questionFilter, setQuestionFilter] = useState<'ALL' | 'UNASKED' | 'ASKED'>('ALL');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/consultations');
      const json = await res.json();
      const proj = json.project || fallbackProject;
      setData(proj);

      if (proj.supervisors?.length) {
        setSupervisors(proj.supervisors);
        if (!supervisorId) setSupervisorId(proj.supervisors[0].id);
      }
      if (proj.consultations?.length) {
        setConsultations(proj.consultations);
      }
      if (proj.consultationQuestions?.length) {
        setQuestions(proj.consultationQuestions);
      }
    } catch (err) {
      console.warn('Using local fallback state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // CONSULTATION CRUD HANDLERS
  // ==========================================
  const handleOpenAddConsultation = () => {
    setEditingConsultationId(null);
    setSupervisorId(supervisors[0]?.id || '');
    setConsultationDate(new Date().toISOString().split('T')[0]);
    setMediaType('Offline / Tatap Muka');
    setChapterDiscussed('');
    setQuestionsAsked('');
    setSupervisorFeedback('');
    setDecisionResult('');
    setNextActionTasks('');
    setFollowupDeadline('');
    setIsConsultationModalOpen(true);
  };

  const handleOpenEditConsultation = (c: Consultation) => {
    setEditingConsultationId(c.id);
    setSupervisorId(c.supervisorId);
    const dateStr = typeof c.consultationDate === 'string' 
      ? c.consultationDate.split('T')[0] 
      : new Date(c.consultationDate).toISOString().split('T')[0];
    setConsultationDate(dateStr);
    setMediaType(c.mediaType || 'Offline / Tatap Muka');
    setChapterDiscussed(c.chapterDiscussed || '');
    setQuestionsAsked(c.questionsAsked || '');
    setSupervisorFeedback(c.supervisorFeedback || '');
    setDecisionResult(c.decisionResult || '');
    setNextActionTasks(c.nextActionTasks || '');
    setFollowupDeadline(
      c.followupDeadline
        ? (typeof c.followupDeadline === 'string' ? c.followupDeadline.split('T')[0] : new Date(c.followupDeadline).toISOString().split('T')[0])
        : ''
    );
    setIsConsultationModalOpen(true);
  };

  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisorId || !consultationDate) {
      alert('Dosen Pembimbing dan Tanggal Konsultasi wajib dipilih.');
      return;
    }

    const targetSupervisor = supervisors.find((s) => s.id === supervisorId) || supervisors[0];

    if (editingConsultationId) {
      // UPDATE
      const updatedItem: Consultation = {
        id: editingConsultationId,
        supervisorId,
        supervisor: targetSupervisor,
        consultationDate: new Date(consultationDate),
        mediaType,
        chapterDiscussed,
        questionsAsked,
        supervisorFeedback,
        decisionResult,
        nextActionTasks,
        followupDeadline: followupDeadline ? new Date(followupDeadline) : null,
      };

      setConsultations((prev) =>
        prev.map((item) => (item.id === editingConsultationId ? updatedItem : item))
      );
      setIsConsultationModalOpen(false);

      try {
        await fetch('/api/consultations', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'consultation',
            ...updatedItem,
          }),
        });
      } catch (err) {
        console.warn('Offline update:', err);
      }
    } else {
      // CREATE
      const newItem: Consultation = {
        id: 'cons-' + Date.now(),
        supervisorId,
        supervisor: targetSupervisor,
        consultationDate: new Date(consultationDate),
        mediaType,
        chapterDiscussed,
        questionsAsked,
        supervisorFeedback: supervisorFeedback || '(Catatan tersimpan)',
        decisionResult,
        nextActionTasks,
        followupDeadline: followupDeadline ? new Date(followupDeadline) : null,
      };

      setConsultations((prev) => [newItem, ...prev]);
      setIsConsultationModalOpen(false);

      try {
        await fetch('/api/consultations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'consultation',
            ...newItem,
          }),
        });
      } catch (err) {
        console.warn('Offline creation:', err);
      }
    }
  };

  const handleDeleteConsultation = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan bimbingan ini?')) return;

    setConsultations((prev) => prev.filter((item) => item.id !== id));

    try {
      await fetch(`/api/consultations?type=consultation&id=${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Offline delete:', err);
    }
  };

  // ==========================================
  // SUPERVISOR CRUD HANDLERS
  // ==========================================
  const handleOpenAddSupervisor = () => {
    setEditingSupervisorId(null);
    setSupName('');
    setSupRoleTitle('Pembimbing 1 (Utama)');
    setSupPosition('Dosen Jurusan TI Politeknik Negeri Padang');
    setSupPhone('+62 ');
    setSupEmail('');
    setSupPreferences('Tatap muka di Ruang Jurusan TI setiap Selasa & Kamis jam 10.00-12.00.');
    setIsSupervisorModalOpen(true);
  };

  const handleOpenEditSupervisor = (s: Supervisor) => {
    setEditingSupervisorId(s.id);
    setSupName(s.name);
    setSupRoleTitle(s.roleTitle);
    setSupPosition(s.position || '');
    setSupPhone(s.phone || '');
    setSupEmail(s.email || '');
    setSupPreferences(s.consultationPreferences || '');
    setIsSupervisorModalOpen(true);
  };

  const handleSaveSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim()) {
      alert('Nama Dosen Pembimbing wajib diisi.');
      return;
    }

    if (editingSupervisorId) {
      // UPDATE
      const updatedSup: Supervisor = {
        id: editingSupervisorId,
        name: supName.trim(),
        roleTitle: supRoleTitle,
        position: supPosition.trim() || null,
        phone: supPhone.trim() || null,
        email: supEmail.trim() || null,
        consultationPreferences: supPreferences.trim() || null,
      };

      setSupervisors((prev) =>
        prev.map((s) => (s.id === editingSupervisorId ? updatedSup : s))
      );
      // also update in consultation items
      setConsultations((prev) =>
        prev.map((c) => (c.supervisorId === editingSupervisorId ? { ...c, supervisor: updatedSup } : c))
      );
      setIsSupervisorModalOpen(false);

      try {
        await fetch('/api/consultations', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'supervisor',
            ...updatedSup,
          }),
        });
      } catch (err) {
        console.warn('Offline update supervisor:', err);
      }
    } else {
      // CREATE
      const newSup: Supervisor = {
        id: 'sup-' + Date.now(),
        name: supName.trim(),
        roleTitle: supRoleTitle,
        position: supPosition.trim() || null,
        phone: supPhone.trim() || null,
        email: supEmail.trim() || null,
        consultationPreferences: supPreferences.trim() || null,
      };

      setSupervisors((prev) => [...prev, newSup]);
      setIsSupervisorModalOpen(false);

      try {
        await fetch('/api/consultations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'supervisor',
            ...newSup,
          }),
        });
      } catch (err) {
        console.warn('Offline create supervisor:', err);
      }
    }
  };

  const handleDeleteSupervisor = async (id: string) => {
    if (supervisors.length <= 1) {
      alert('Minimal harus ada 1 Dosen Pembimbing di dalam sistem.');
      return;
    }
    if (!confirm('Hapus profil dosen pembimbing ini? Catatan riwayat bimbingannya tetap tersimpan.')) return;

    setSupervisors((prev) => prev.filter((s) => s.id !== id));

    try {
      await fetch(`/api/consultations?type=supervisor&id=${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Offline delete supervisor:', err);
    }
  };

  // ==========================================
  // QUESTION BANK CRUD HANDLERS
  // ==========================================
  const handleOpenAddQuestion = () => {
    setEditingQuestionId(null);
    setQSupervisorId(supervisors[0]?.id || '');
    setQText('');
    setQCategory('Metodologi');
    setQStatus('UNASKED');
    setQAnswerNotes('');
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: ConsultationQuestion) => {
    setEditingQuestionId(q.id);
    setQSupervisorId(q.supervisorId || supervisors[0]?.id || '');
    setQText(q.questionText);
    setQCategory(q.category || 'Metodologi');
    setQStatus(q.status || 'UNASKED');
    setQAnswerNotes(q.answerNotes || '');
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) {
      alert('Teks pertanyaan wajib diisi.');
      return;
    }

    const targetSupervisor = supervisors.find((s) => s.id === qSupervisorId) || supervisors[0];

    if (editingQuestionId) {
      // UPDATE
      const updatedQ: ConsultationQuestion = {
        id: editingQuestionId,
        supervisorId: qSupervisorId,
        supervisor: targetSupervisor,
        questionText: qText.trim(),
        category: qCategory,
        status: qStatus,
        answerNotes: qAnswerNotes.trim() || null,
      };

      setQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestionId ? updatedQ : q))
      );
      setIsQuestionModalOpen(false);

      try {
        await fetch('/api/consultations', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'question',
            ...updatedQ,
          }),
        });
      } catch (err) {
        console.warn('Offline update question:', err);
      }
    } else {
      // CREATE
      const newQ: ConsultationQuestion = {
        id: 'cq-' + Date.now(),
        supervisorId: qSupervisorId,
        supervisor: targetSupervisor,
        questionText: qText.trim(),
        category: qCategory,
        status: qStatus,
        answerNotes: qAnswerNotes.trim() || null,
        createdAt: new Date(),
      };

      setQuestions((prev) => [newQ, ...prev]);
      setIsQuestionModalOpen(false);

      try {
        await fetch('/api/consultations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'question',
            ...newQ,
          }),
        });
      } catch (err) {
        console.warn('Offline create question:', err);
      }
    }
  };

  const handleToggleQuestionStatus = async (q: ConsultationQuestion) => {
    const nextStatus = q.status === 'ASKED' ? 'UNASKED' : 'ASKED';
    setQuestions((prev) =>
      prev.map((item) => (item.id === q.id ? { ...item, status: nextStatus } : item))
    );

    try {
      await fetch('/api/consultations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'question',
          id: q.id,
          status: nextStatus,
        }),
      });
    } catch (err) {
      console.warn('Offline toggle status:', err);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Hapus pertanyaan ini dari bank pertanyaan?')) return;

    setQuestions((prev) => prev.filter((q) => q.id !== id));

    try {
      await fetch(`/api/consultations?type=question&id=${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Offline delete question:', err);
    }
  };

  // Convert Question to Consultation
  const handleConvertQuestionToConsultation = (q: ConsultationQuestion) => {
    setEditingConsultationId(null);
    setSupervisorId(q.supervisorId || supervisors[0]?.id || '');
    setConsultationDate(new Date().toISOString().split('T')[0]);
    setMediaType('Offline / Tatap Muka');
    setChapterDiscussed(`Topik: ${q.category}`);
    setQuestionsAsked(q.questionText);
    setSupervisorFeedback(q.answerNotes || '');
    setDecisionResult('');
    setNextActionTasks('');
    setFollowupDeadline('');
    setIsConsultationModalOpen(true);
  };

  if (loading) {
    return <SkeletonLoading cardsCount={2} />;
  }

  const filteredQuestions = questions.filter((q) => {
    if (questionFilter === 'UNASKED') return q.status !== 'ASKED';
    if (questionFilter === 'ASKED') return q.status === 'ASKED';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Top Header */}
      <div className="bg-white dark:bg-[#2D2528] p-6 rounded-3xl border border-[#FFCED8] dark:border-[#4D383E] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users2 className="w-5 h-5 text-[#C75C73] dark:text-[#FFB3C6]" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-[#FFF0F3]">Konsultasi & Bimbingan Dosen</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#D4B8BE] font-medium mt-1">
            Dokumentasi berkala arahan dosen pembimbing, bank pertanyaan pra-konsultasi, dan tindak lanjut tugas akademik.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAddSupervisor}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#863043] dark:text-[#FFCED8] bg-[#FFF5F7] dark:bg-[#38242A] border border-[#FFCED8] dark:border-[#5E3D46] hover:bg-[#FFDDDD] rounded-2xl shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            + Tambah Pembimbing
          </button>

          <button
            onClick={handleOpenAddConsultation}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#863043] dark:text-[#FFF0F3] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] dark:from-[#4D2633] dark:via-[#542D3B] dark:to-[#543428] border border-[#F5A8B8] dark:border-[#7A3C4E] hover:opacity-95 rounded-2xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            + Catat Hasil Bimbingan
          </button>
        </div>
      </div>

      {/* 2. Supervisors Profile Cards (Full CRUD) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#863043] dark:text-[#FFCED8]">
            Tim Dosen Pembimbing Tugas Akhir ({supervisors.length})
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-[#D4B8BE]">
            Klik tombol pensil untuk mengubah nama, kontak, atau preferensi dosen
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supervisors.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-[#2D2528] rounded-3xl border border-[#FFCED8] dark:border-[#4D383E] p-5 shadow-sm space-y-3 relative group hover:shadow-md transition-all"
            >
              {/* Action Buttons: Edit & Delete */}
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#FFF9FA] dark:bg-[#38242A] p-1 rounded-xl border border-[#FFCED8]/70 dark:border-[#5E3D46]">
                <button
                  onClick={() => handleOpenEditSupervisor(s)}
                  title="Edit Data Dosen"
                  className="p-1.5 text-slate-500 hover:text-[#C75C73] hover:bg-white dark:hover:bg-[#241E20] rounded-lg transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteSupervisor(s.id)}
                  title="Hapus Pembimbing"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-[#241E20] rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-start gap-4 pr-16">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C75C73] to-[#A84157] text-white font-black text-base flex items-center justify-center shrink-0 shadow-md shadow-[#C75C73]/20">
                  {s.name ? s.name.charAt(0) : 'D'}
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#FFF4DE] dark:bg-[#3D3123] text-[#863043] dark:text-[#FFE8C4] border border-[#FFE8C4] dark:border-[#54422E]">
                    {s.roleTitle}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-[#FFF0F3] truncate" title={s.name}>
                    {s.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#D4B8BE] font-medium truncate">
                    {s.position || 'Dosen Jurusan TI PNP'}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-600 dark:text-[#D4B8BE] space-y-1.5 border-t border-[#FFCED8]/40 dark:border-[#4D383E]">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <a
                    href={s.phone ? `tel:${s.phone}` : undefined}
                    className="flex items-center gap-1.5 text-slate-600 dark:text-[#D4B8BE] hover:text-[#C75C73]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C75C73]" />
                    <span>{s.phone || '-'}</span>
                  </a>
                  <span className="text-slate-300">•</span>
                  <a
                    href={s.email ? `mailto:${s.email}` : undefined}
                    className="flex items-center gap-1.5 text-slate-600 dark:text-[#D4B8BE] hover:text-[#C75C73]"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C75C73]" />
                    <span>{s.email || '-'}</span>
                  </a>
                </div>

                <div className="text-[11px] bg-[#FFF9FA] dark:bg-[#241E20] p-2.5 rounded-xl border border-[#FFCED8]/60 dark:border-[#4D383E] leading-relaxed">
                  <strong className="text-[#863043] dark:text-[#FFCED8]">Preferensi Bimbingan: </strong>
                  {s.consultationPreferences || 'Fleksibel via tatap muka atau Google Meet.'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Tab Switcher */}
      <div className="flex border-b border-[#FFCED8] dark:border-[#4D383E] gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'logs'
              ? 'border-[#C75C73] text-[#863043] dark:text-[#FFCED8]'
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
              ? 'border-[#C75C73] text-[#863043] dark:text-[#FFCED8]'
              : 'border-transparent text-slate-500 hover:text-[#863043]'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#A84157]" />
          Bank Pertanyaan Sebelum Konsultasi ({questions.length})
        </button>
      </div>

      {/* TAB 1: Consultation Logs (Full CRUD) */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {consultations.length === 0 ? (
            <div className="bg-white dark:bg-[#2D2528] p-12 text-center rounded-3xl border border-[#FFCED8] dark:border-[#4D383E] space-y-3">
              <Users2 className="w-10 h-10 text-[#C75C73] mx-auto opacity-40" />
              <h4 className="font-bold text-slate-700 dark:text-[#FFF0F3]">Belum ada riwayat bimbingan</h4>
              <p className="text-xs text-slate-500 dark:text-[#D4B8BE] max-w-sm mx-auto">
                Mulai catat sesi bimbingan pertama Anda agar progres arahan dosen pembimbing terekam rapi.
              </p>
              <button
                onClick={handleOpenAddConsultation}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#C75C73] hover:bg-[#A84157] rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Catat Bimbingan Sekarang
              </button>
            </div>
          ) : (
            consultations.map((c) => {
              const supervisorName =
                c.supervisor?.name ||
                supervisors.find((s) => s.id === c.supervisorId)?.name ||
                'Dosen Pembimbing';

              return (
                <div
                  key={c.id}
                  className="bg-white dark:bg-[#2D2528] rounded-3xl border border-[#FFCED8] dark:border-[#4D383E] p-5 shadow-sm space-y-3.5 relative group hover:border-[#F5A8B8] transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#FFCED8]/40 dark:border-[#4D383E]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs bg-[#FFF4DE] dark:bg-[#3D3123] text-[#863043] dark:text-[#FFE8C4] border border-[#FFE8C4] dark:border-[#54422E] px-2.5 py-1 rounded-lg">
                        {supervisorName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-[#D4B8BE] font-medium bg-[#F8F9FA] dark:bg-[#241E20] px-2 py-0.5 rounded-md border border-slate-200 dark:border-[#4D383E]">
                        Media: {c.mediaType}
                      </span>
                      {c.chapterDiscussed && (
                        <span className="text-[11px] bg-[#FFCED8]/40 dark:bg-[#4D242C] text-[#863043] dark:text-[#FFCED8] px-2 py-0.5 rounded-lg border border-[#FFCED8] dark:border-[#5E3D46]">
                          Bahasan: {c.chapterDiscussed}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#D4B8BE] font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#C75C73]" />
                        {formatDateIndo(c.consultationDate, 'EEEE, dd MMMM yyyy')}
                      </div>

                      {/* Log Action Buttons: Edit & Delete */}
                      <div className="flex items-center gap-1 bg-[#FFF9FA] dark:bg-[#38242A] p-1 rounded-xl border border-[#FFCED8]/70 dark:border-[#5E3D46]">
                        <button
                          onClick={() => handleOpenEditConsultation(c)}
                          title="Edit Catatan Bimbingan"
                          className="p-1.5 text-slate-500 hover:text-[#C75C73] hover:bg-white dark:hover:bg-[#241E20] rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteConsultation(c.id)}
                          title="Hapus Catatan Bimbingan"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-[#241E20] rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Questions & Feedback */}
                  <div className="space-y-2 text-xs">
                    {/* MAHASISWA'S QUESTIONS (prominently displayed) */}
                    <div className="bg-[#FFF9FA] dark:bg-[#241E20] p-3.5 rounded-2xl border border-[#FFCED8]/70 dark:border-[#4D383E]">
                      <span className="font-extrabold text-[#863043] dark:text-[#FFCED8] flex items-center gap-1.5 mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-[#C75C73]" />
                        Pertanyaan yang Diajukan Mahasiswa:
                      </span>
                      <p className="text-slate-700 dark:text-[#D4B8BE] leading-relaxed italic">
                        {c.questionsAsked || '(Tidak ada catatan pertanyaan khusus)'}
                      </p>
                    </div>

                    {/* SUPERVISOR'S FEEDBACK */}
                    <div className="bg-[#FFF4DE]/60 dark:bg-[#382C24] p-3.5 rounded-2xl border border-[#FFE8C4] dark:border-[#54422E]">
                      <span className="font-extrabold text-[#863043] dark:text-[#FFE8C4] block mb-1">
                        Masukan & Arahan Dosen Pembimbing:
                      </span>
                      <p className="text-slate-800 dark:text-[#FFF0F3] leading-relaxed font-medium">
                        {c.supervisorFeedback}
                      </p>
                    </div>

                    {/* Decisions & Follow-ups */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {c.decisionResult && (
                        <div className="p-3 bg-[#FFCED8]/30 dark:bg-[#38242A] border border-[#FFCED8] dark:border-[#5E3D46] rounded-2xl">
                          <span className="font-extrabold text-[#863043] dark:text-[#FFCED8] block mb-1">
                            Keputusan Akhir:
                          </span>
                          <p className="text-slate-700 dark:text-[#D4B8BE] text-[11px] leading-relaxed">
                            {c.decisionResult}
                          </p>
                        </div>
                      )}

                      {c.nextActionTasks && (
                        <div className="p-3 bg-[#FFE8C4]/40 dark:bg-[#3D3123] border border-[#FFE8C4] dark:border-[#54422E] rounded-2xl">
                          <span className="font-extrabold text-[#863043] dark:text-[#FFE8C4] block mb-1">
                            Tugas Tindak Lanjut:
                          </span>
                          <p className="text-slate-700 dark:text-[#D4B8BE] text-[11px] leading-relaxed">
                            {c.nextActionTasks}
                          </p>
                          {c.followupDeadline && (
                            <div className="mt-1.5 pt-1.5 border-t border-[#FFE8C4]/60 dark:border-[#54422E] text-[10px] text-[#863043] dark:text-[#FFE8C4] font-bold">
                              Deadline: {formatDateIndo(c.followupDeadline, 'dd MMM yyyy')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: Question Bank (Full CRUD) */}
      {activeTab === 'questions' && (
        <div className="bg-white dark:bg-[#2D2528] rounded-3xl border border-[#FFCED8] dark:border-[#4D383E] shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 bg-[#FFF9FA] dark:bg-[#38242A] border-b border-[#FFCED8] dark:border-[#4D383E] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-xs text-[#863043] dark:text-[#FFCED8] uppercase tracking-wider">
                Daftar Pertanyaan yang Perlu Ditanyakan ke Dosen
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#D4B8BE] mt-0.5">
                Persiapkan poin diskusi sebelum sesi bimbingan agar konsultasi terarah dan produktif.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter */}
              <div className="flex bg-white dark:bg-[#241E20] border border-[#FFCED8] dark:border-[#5E3D46] rounded-xl p-0.5 text-[11px] font-bold">
                <button
                  onClick={() => setQuestionFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    questionFilter === 'ALL'
                      ? 'bg-[#FFCED8] text-[#863043] dark:bg-[#5E3D46] dark:text-[#FFF0F3]'
                      : 'text-slate-500'
                  }`}
                >
                  Semua ({questions.length})
                </button>
                <button
                  onClick={() => setQuestionFilter('UNASKED')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    questionFilter === 'UNASKED'
                      ? 'bg-[#FFCED8] text-[#863043] dark:bg-[#5E3D46] dark:text-[#FFF0F3]'
                      : 'text-slate-500'
                  }`}
                >
                  Belum Ditanyakan ({questions.filter((q) => q.status !== 'ASKED').length})
                </button>
                <button
                  onClick={() => setQuestionFilter('ASKED')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    questionFilter === 'ASKED'
                      ? 'bg-[#FFCED8] text-[#863043] dark:bg-[#5E3D46] dark:text-[#FFF0F3]'
                      : 'text-slate-500'
                  }`}
                >
                  Sudah Terjawab ({questions.filter((q) => q.status === 'ASKED').length})
                </button>
              </div>

              <button
                onClick={handleOpenAddQuestion}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#C75C73] hover:bg-[#A84157] rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                + Tambah Pertanyaan
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#FFCED8]/40 dark:divide-[#4D383E] text-xs">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-[#D4B8BE]">
                Tidak ada pertanyaan dalam kategori ini.
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const targetSupervisor =
                  q.supervisor?.name ||
                  supervisors.find((s) => s.id === q.supervisorId)?.name ||
                  'Dosen Pembimbing';

                return (
                  <div key={q.id} className="p-4 sm:p-5 space-y-2.5 hover:bg-[#FFFDFC] dark:hover:bg-[#241E20]/50 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#863043] dark:text-[#FFCED8] bg-[#FFCED8]/40 dark:bg-[#4D242C] border border-[#FFCED8] dark:border-[#5E3D46] px-2 py-0.5 rounded-lg text-[11px]">
                          {q.category}
                        </span>
                        <span className="text-slate-500 dark:text-[#D4B8BE] font-medium text-[11px]">
                          Ditujukan ke: <strong>{targetSupervisor}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Toggle Status Button */}
                        <button
                          onClick={() => handleToggleQuestionStatus(q)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                            q.status === 'ASKED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                              : 'bg-[#FFF4DE] text-[#863043] border-[#FFE8C4] dark:bg-[#3D3123] dark:text-[#FFE8C4]'
                          }`}
                        >
                          {q.status === 'ASKED' ? '✓ Sudah Ditanyakan' : '⏳ Belum Ditanyakan'}
                        </button>

                        {/* Convert to Consultation Log */}
                        <button
                          onClick={() => handleConvertQuestionToConsultation(q)}
                          title="Jadikan Log Konsultasi"
                          className="flex items-center gap-1 text-[11px] font-bold text-[#C75C73] dark:text-[#FFCED8] bg-[#FFF0F3] dark:bg-[#38242A] px-2.5 py-1 rounded-lg border border-[#FFCED8] dark:border-[#5E3D46] hover:bg-[#FFDDDD]"
                        >
                          <Plus className="w-3 h-3" />
                          Catat Hasilnya
                        </button>

                        {/* Edit & Delete */}
                        <button
                          onClick={() => handleOpenEditQuestion(q)}
                          title="Edit Pertanyaan"
                          className="p-1 text-slate-500 hover:text-[#C75C73]"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          title="Hapus Pertanyaan"
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-800 dark:text-[#FFF0F3] font-semibold text-xs leading-relaxed">
                      {q.questionText}
                    </p>

                    {q.answerNotes && (
                      <div className="p-3 rounded-2xl bg-[#FFF9FA] dark:bg-[#241E20] border border-[#FFCED8]/60 dark:border-[#4D383E] text-[11px] text-slate-700 dark:text-[#D4B8BE] leading-relaxed">
                        <strong className="text-[#863043] dark:text-[#FFCED8]">Catatan Jawaban Dosen: </strong>
                        {q.answerNotes}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: CATAT / EDIT HASIL BIMBINGAN (WITH PERTANYAAN FIELD) */}
      {/* ============================================================ */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop-overlay p-3 sm:p-4 overflow-hidden animate-fade-in">
          <div className="bg-white dark:bg-[#231B1E] rounded-[24px] sm:rounded-[28px] shadow-2xl shadow-[#C75C73]/25 border border-[#FFCED8] dark:border-[#4A3238] w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-modal-pop">
            {/* 1. FIXED HEADER */}
            <div className="shrink-0 px-6 py-4 bg-gradient-to-r from-[#FFF4DE] via-[#FFF0F3] to-[#FFCED8]/70 dark:from-[#35252A] dark:via-[#3E2930] dark:to-[#4A2E36] border-b border-[#FFCED8] dark:border-[#4A3238] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2D2226] text-[#C75C73] dark:text-[#FFB3C2] flex items-center justify-center shadow-sm border border-[#FFCED8]/60 dark:border-[#52373F]">
                  <FileCheck className="w-5 h-5 text-[#C75C73]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#3D3133] dark:text-[#FFF0F3] leading-tight">
                    {editingConsultationId ? 'Edit Catatan Sesi Bimbingan' : 'Catat Sesi Bimbingan Baru'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#863043]/80 dark:text-[#FFCED8]/80 font-medium mt-0.5">
                    Dokumentasikan poin pertanyaan mahasiswa & arahan tindak lanjut dosen
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConsultationModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#863043]/70 hover:text-[#863043] dark:text-[#FFCED8]/70 dark:hover:text-[#FFF0F3] hover:bg-white/80 dark:hover:bg-[#2D2226] transition-all hover:rotate-90 duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. SCROLLABLE FORM BODY */}
            <form onSubmit={handleSaveConsultation} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1 text-xs">
                {/* SECTION 1: SESI & DOSEN */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-1 border-b border-[#FFCED8]/40 dark:border-[#4A3238]">
                    <Users2 className="w-3.5 h-3.5 text-[#C75C73]" />
                    <span className="font-extrabold text-[#863043] dark:text-[#FFCED8]">Informasi Sesi Konsultasi</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                          Dosen Pembimbing
                        </label>
                        <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                          Wajib
                        </span>
                      </div>
                      <select
                        value={supervisorId}
                        onChange={(e) => setSupervisorId(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all cursor-pointer font-medium"
                        required
                      >
                        {supervisors.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.roleTitle})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                          Tanggal Bimbingan
                        </label>
                        <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                          Wajib
                        </span>
                      </div>
                      <input
                        type="date"
                        value={consultationDate}
                        onChange={(e) => setConsultationDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all cursor-pointer font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                        Media / Jalur Pertemuan
                      </label>
                      <select
                        value={mediaType}
                        onChange={(e) => setMediaType(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all cursor-pointer font-medium"
                      >
                        <option value="Offline / Tatap Muka">🏢 Offline / Tatap Muka</option>
                        <option value="Google Meet">📹 Google Meet</option>
                        <option value="Zoom">💻 Zoom Meeting</option>
                        <option value="WhatsApp">💬 WhatsApp Call / Chat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                        Bab / Topik Bahasan
                      </label>
                      <input
                        type="text"
                        value={chapterDiscussed}
                        onChange={(e) => setChapterDiscussed(e.target.value)}
                        placeholder="Contoh: BAB III & Matriks Revisi Reviewer"
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: PERTANYAAN MAHASISWA */}
                <div className="p-4 rounded-2xl bg-[#FFF4DE]/30 dark:bg-[#2B2124] border border-[#FFE8C4] dark:border-[#4D363E] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-[#863043] dark:text-[#FFB3C2] flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#C75C73]" />
                      Pertanyaan / Kendala yang Diajukan Mahasiswa
                    </label>
                    <span className="text-[10px] text-[#863043] dark:text-[#FFCED8] font-bold bg-[#FFCED8]/60 dark:bg-[#4D2633] px-2.5 py-0.5 rounded-full">
                      Mahasiswa
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={questionsAsked}
                    onChange={(e) => setQuestionsAsked(e.target.value)}
                    placeholder="Contoh: Bagaimana penanganan word sparsity jika teks abstrak belum diekstraksi dari SITA PNP?"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#20181A] border border-[#FFCED8] dark:border-[#5E3D46] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                  />
                </div>

                {/* SECTION 3: ARAHAN & MASUKAN DOSEN */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-1 border-b border-[#FFCED8]/40 dark:border-[#4A3238]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C75C73]" />
                    <span className="font-extrabold text-[#863043] dark:text-[#FFCED8]">Arahan & Keputusan Dosen</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                        Masukan & Arahan Dosen Pembimbing
                      </label>
                      <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                        Wajib
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={supervisorFeedback}
                      onChange={(e) => setSupervisorFeedback(e.target.value)}
                      placeholder="Catat seluruh arahan dosen, masukan perbaikan naskah, dataset, metodologi atau eksperimen..."
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                        Keputusan Akhir Bimbingan
                      </label>
                      <textarea
                        rows={2}
                        value={decisionResult}
                        onChange={(e) => setDecisionResult(e.target.value)}
                        placeholder="Contoh: Menyetujui skema batch CSV & lanjut eksperimen."
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                        Tugas Tindak Lanjut (Action Tasks)
                      </label>
                      <textarea
                        rows={2}
                        value={nextActionTasks}
                        onChange={(e) => setNextActionTasks(e.target.value)}
                        placeholder="Contoh: Kirim draf surat izin ke TIPD PNP."
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Target Selesai Tugas Tindak Lanjut <span className="text-[10px] text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="date"
                      value={followupDeadline}
                      onChange={(e) => setFollowupDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all cursor-pointer font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 3. FIXED FOOTER WITH ANIMATED BUTTONS */}
              <div className="shrink-0 px-6 py-3.5 bg-slate-50/90 dark:bg-[#1E1719]/95 border-t border-[#FFCED8]/60 dark:border-[#4A3238] flex items-center justify-end gap-3 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setIsConsultationModalOpen(false)}
                  className="btn-secondary-animated px-4 py-2.5 text-xs font-bold text-[#6B5A5D] dark:text-[#D4B8BE] hover:bg-[#FFF0F3] dark:hover:bg-[#2D2226] rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary-animated px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#C75C73] via-[#D8687F] to-[#863043] rounded-xl shadow-md shadow-[#C75C73]/30 flex items-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>{editingConsultationId ? 'Simpan Perubahan' : 'Simpan Catatan Bimbingan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: TAMBAH / EDIT DOSEN PEMBIMBING (SUPERVISOR CRUD)     */}
      {/* ============================================================ */}
      {isSupervisorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop-overlay p-3 sm:p-4 overflow-hidden animate-fade-in">
          <div className="bg-white dark:bg-[#231B1E] rounded-[24px] sm:rounded-[28px] shadow-2xl shadow-[#C75C73]/25 border border-[#FFCED8] dark:border-[#4A3238] w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-modal-pop">
            {/* 1. FIXED HEADER */}
            <div className="shrink-0 px-6 py-4 bg-gradient-to-r from-[#FFF4DE] via-[#FFF0F3] to-[#FFCED8]/70 dark:from-[#35252A] dark:via-[#3E2930] dark:to-[#4A2E36] border-b border-[#FFCED8] dark:border-[#4A3238] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2D2226] text-[#C75C73] dark:text-[#FFB3C2] flex items-center justify-center shadow-sm border border-[#FFCED8]/60 dark:border-[#52373F]">
                  <Users2 className="w-5 h-5 text-[#C75C73]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#3D3133] dark:text-[#FFF0F3] leading-tight">
                    {editingSupervisorId ? 'Edit Data Dosen Pembimbing' : 'Tambah Dosen Pembimbing'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#863043]/80 dark:text-[#FFCED8]/80 font-medium mt-0.5">
                    Kelola nama, kontak resmi, dan preferensi jadwal bimbingan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSupervisorModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#863043]/70 hover:text-[#863043] dark:text-[#FFCED8]/70 dark:hover:text-[#FFF0F3] hover:bg-white/80 dark:hover:bg-[#2D2226] transition-all hover:rotate-90 duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. SCROLLABLE FORM BODY */}
            <form onSubmit={handleSaveSupervisor} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                      Nama Lengkap & Gelar Akademik
                    </label>
                    <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                      Wajib
                    </span>
                  </div>
                  <input
                    type="text"
                    value={supName}
                    onChange={(e) => setSupName(e.target.value)}
                    placeholder="Contoh: Dr. Eng. Ir. Riko Ervil, M.Kom"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Peran Pembimbing
                    </label>
                    <select
                      value={supRoleTitle}
                      onChange={(e) => setSupRoleTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="Pembimbing 1 (Utama)">Pembimbing 1 (Utama)</option>
                      <option value="Pembimbing 2 (Pendamping)">Pembimbing 2 (Pendamping)</option>
                      <option value="Pembimbing Eksternal">Pembimbing Eksternal</option>
                      <option value="Dosen Penguji / Reviewer">Dosen Penguji / Reviewer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      KBK / Posisi Akademik
                    </label>
                    <input
                      type="text"
                      value={supPosition}
                      onChange={(e) => setSupPosition(e.target.value)}
                      placeholder="Contoh: Dosen KBK Rekayasa Perangkat Lunak"
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      No. WhatsApp / HP
                    </label>
                    <input
                      type="text"
                      value={supPhone}
                      onChange={(e) => setSupPhone(e.target.value)}
                      placeholder="+62 812-xxxx-xxxx"
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Email Resmi Kampus
                    </label>
                    <input
                      type="email"
                      value={supEmail}
                      onChange={(e) => setSupEmail(e.target.value)}
                      placeholder="nama.dosen@pnp.ac.id"
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                    Preferensi & Jadwal Bimbingan
                  </label>
                  <textarea
                    rows={2}
                    value={supPreferences}
                    onChange={(e) => setSupPreferences(e.target.value)}
                    placeholder="Contoh: Tatap muka di Ruang Jurusan TI setiap Selasa & Kamis jam 10.00-12.00."
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                  />
                </div>
              </div>

              {/* 3. FIXED FOOTER WITH ANIMATED BUTTONS */}
              <div className="shrink-0 px-6 py-3.5 bg-slate-50/90 dark:bg-[#1E1719]/95 border-t border-[#FFCED8]/60 dark:border-[#4A3238] flex items-center justify-end gap-3 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setIsSupervisorModalOpen(false)}
                  className="btn-secondary-animated px-4 py-2.5 text-xs font-bold text-[#6B5A5D] dark:text-[#D4B8BE] hover:bg-[#FFF0F3] dark:hover:bg-[#2D2226] rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary-animated px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#C75C73] via-[#D8687F] to-[#863043] rounded-xl shadow-md shadow-[#C75C73]/30 flex items-center gap-2 group cursor-pointer"
                >
                  <Users2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                  <span>{editingSupervisorId ? 'Simpan Perubahan' : 'Tambahkan Dosen'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: TAMBAH / EDIT PERTANYAAN (QUESTION BANK CRUD)       */}
      {/* ============================================================ */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop-overlay p-3 sm:p-4 overflow-hidden animate-fade-in">
          <div className="bg-white dark:bg-[#231B1E] rounded-[24px] sm:rounded-[28px] shadow-2xl shadow-[#C75C73]/25 border border-[#FFCED8] dark:border-[#4A3238] w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-modal-pop">
            {/* 1. FIXED HEADER */}
            <div className="shrink-0 px-6 py-4 bg-gradient-to-r from-[#FFF4DE] via-[#FFF0F3] to-[#FFCED8]/70 dark:from-[#35252A] dark:via-[#3E2930] dark:to-[#4A2E36] border-b border-[#FFCED8] dark:border-[#4A3238] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2D2226] text-[#C75C73] dark:text-[#FFB3C2] flex items-center justify-center shadow-sm border border-[#FFCED8]/60 dark:border-[#52373F]">
                  <HelpCircle className="w-5 h-5 text-[#C75C73]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#3D3133] dark:text-[#FFF0F3] leading-tight">
                    {editingQuestionId ? 'Edit Pertanyaan Pra-Konsultasi' : 'Tambah Pertanyaan Pra-Konsultasi'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#863043]/80 dark:text-[#FFCED8]/80 font-medium mt-0.5">
                    Siapkan poin diskusi sebelum menghadap dosen pembimbing
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#863043]/70 hover:text-[#863043] dark:text-[#FFCED8]/70 dark:hover:text-[#FFF0F3] hover:bg-white/80 dark:hover:bg-[#2D2226] transition-all hover:rotate-90 duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. SCROLLABLE FORM BODY */}
            <form onSubmit={handleSaveQuestion} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Ditujukan Kepada
                    </label>
                    <select
                      value={qSupervisorId}
                      onChange={(e) => setQSupervisorId(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all cursor-pointer font-medium"
                    >
                      {supervisors.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.roleTitle})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Kategori Bahasan
                    </label>
                    <select
                      value={qCategory}
                      onChange={(e) => setQCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="Metodologi">Metodologi & Algoritma</option>
                      <option value="Dataset">Dataset & Korpus Dokumen</option>
                      <option value="Revisi Reviewer">Tindak Lanjut Catatan Reviewer</option>
                      <option value="Format Penulisan">Tata Tulis & Format Naskah</option>
                      <option value="Pengujian">Pengujian & Metrik Evaluasi</option>
                      <option value="Umum">Umum / Persiapan Sidang</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                      Teks Pertanyaan / Poin Diskusi
                    </label>
                    <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                      Wajib
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="Tuliskan pertanyaan spesifik yang ingin Anda sampaikan ke dosen pembimbing..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                    Status Pertanyaan
                  </label>
                  <select
                    value={qStatus}
                    onChange={(e) => setQStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all cursor-pointer font-medium"
                  >
                    <option value="UNASKED">⏳ Belum Ditanyakan</option>
                    <option value="ASKED">✓ Sudah Ditanyakan & Terjawab</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                    Catatan Jawaban Dosen <span className="text-[10px] text-slate-400 font-normal">(Bila sudah dijawab)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={qAnswerNotes}
                    onChange={(e) => setQAnswerNotes(e.target.value)}
                    placeholder="Catatan ringkas jawaban dosen atas pertanyaan ini..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                  />
                </div>
              </div>

              {/* 3. FIXED FOOTER WITH ANIMATED BUTTONS */}
              <div className="shrink-0 px-6 py-3.5 bg-slate-50/90 dark:bg-[#1E1719]/95 border-t border-[#FFCED8]/60 dark:border-[#4A3238] flex items-center justify-end gap-3 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="btn-secondary-animated px-4 py-2.5 text-xs font-bold text-[#6B5A5D] dark:text-[#D4B8BE] hover:bg-[#FFF0F3] dark:hover:bg-[#2D2226] rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary-animated px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#C75C73] via-[#D8687F] to-[#863043] rounded-xl shadow-md shadow-[#C75C73]/30 flex items-center gap-2 group cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                  <span>{editingQuestionId ? 'Simpan Perubahan' : 'Simpan Pertanyaan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
