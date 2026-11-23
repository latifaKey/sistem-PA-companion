'use client';

import React, { useState } from 'react';
import { X, Send, Check, Sparkles, Lightbulb, CheckSquare, MessageSquare, GraduationCap, Microscope, BookOpen, StickyNote } from 'lucide-react';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { name: 'Ide Penelitian', icon: Lightbulb, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { name: 'Tugas Baru', icon: CheckSquare, color: 'text-rose-500 bg-rose-50 border-rose-200' },
  { name: 'Catatan Konsultasi', icon: MessageSquare, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
  { name: 'Arahan Dosen', icon: GraduationCap, color: 'text-purple-500 bg-purple-50 border-purple-200' },
  { name: 'Temuan Penelitian', icon: Microscope, color: 'text-teal-500 bg-teal-50 border-teal-200' },
  { name: 'Referensi Jurnal', icon: BookOpen, color: 'text-blue-500 bg-blue-50 border-blue-200' },
  { name: 'Catatan Cepat', icon: StickyNote, color: 'text-pink-500 bg-pink-50 border-pink-200' },
];

export function QuickCaptureModal({ isOpen, onClose }: QuickCaptureModalProps) {
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [content, setContent] = useState('');
  const [createAsTask, setCreateAsTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quick-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, content, createAsTask }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setContent('');
          setSuccess(false);
          onClose();
          window.location.reload();
        }, 500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop-overlay p-3 sm:p-4 overflow-hidden animate-fade-in">
      <div className="bg-white dark:bg-[#231B1E] rounded-[24px] sm:rounded-[28px] shadow-2xl shadow-[#C75C73]/25 border border-[#FFCED8] dark:border-[#4A3238] w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-modal-pop">
        {/* 1. FIXED HEADER */}
        <div className="shrink-0 px-6 py-4 bg-gradient-to-r from-[#FFF4DE] via-[#FFF0F3] to-[#FFCED8]/70 dark:from-[#35252A] dark:via-[#3E2930] dark:to-[#4A2E36] border-b border-[#FFCED8] dark:border-[#4A3238] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2D2226] text-[#C75C73] dark:text-[#FFB3C2] flex items-center justify-center shadow-sm border border-[#FFCED8]/60 dark:border-[#52373F]">
              <Sparkles className="w-5 h-5 text-[#C75C73]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#3D3133] dark:text-[#FFF0F3] leading-tight">
                Quick Capture
              </h3>
              <p className="text-[11px] sm:text-xs text-[#863043]/80 dark:text-[#FFCED8]/80 font-medium mt-0.5">
                Catat cepat ide, arahan dosen, atau tugas seketika
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#863043]/70 hover:text-[#863043] dark:text-[#FFCED8]/70 dark:hover:text-[#FFF0F3] hover:bg-white/80 dark:hover:bg-[#2D2226] transition-all hover:rotate-90 duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. SCROLLABLE FORM BODY */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1 text-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3] flex items-center gap-1.5">
                  Pilih Kategori Catatan
                </label>
                <span className="text-[11px] text-[#863043] dark:text-[#FFCED8] font-semibold">
                  {category}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.name;
                  return (
                    <button
                      type="button"
                      key={cat.name}
                      onClick={() => setCategory(cat.name)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#C75C73] border-[#C75C73] text-white shadow-sm shadow-[#C75C73]/30 scale-[1.03]'
                          : 'border-slate-200 dark:border-[#4A3238] text-[#544447] dark:text-[#D4B8BE] bg-slate-50/70 dark:bg-[#1E1719] hover:bg-rose-50 dark:hover:bg-[#2C1D22] hover:scale-102'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#C75C73]'}`} />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                  Isi Catatan / Arahan / Ide
                </label>
                <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                  Wajib
                </span>
              </div>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis ide atau temuan riset secepatnya di sini tanpa perlu mengisi form panjang..."
                className="w-full text-xs p-3.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:ring-4 focus:ring-[#C75C73]/15 focus:border-[#C75C73] focus:outline-none placeholder-[#A84157]/45 transition-all"
                required
                autoFocus
              />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF9FA] dark:bg-[#261D20] border border-[#FFCED8]/60 dark:border-[#452D34]">
              <input
                type="checkbox"
                id="createAsTask"
                checked={createAsTask}
                onChange={(e) => setCreateAsTask(e.target.checked)}
                className="w-4 h-4 text-[#C75C73] rounded border-[#FFCED8] focus:ring-[#C75C73] accent-[#C75C73] cursor-pointer"
              />
              <label htmlFor="createAsTask" className="text-xs font-medium text-[#544447] dark:text-[#D4B8BE] select-none cursor-pointer">
                Otomatis sinkronkan juga sebagai <span className="font-bold text-[#863043] dark:text-[#FFCED8]">Task Baru</span> di Kanban Board
              </label>
            </div>
          </div>

          {/* 3. FIXED FOOTER WITH ANIMATED BUTTONS */}
          <div className="shrink-0 px-6 py-3.5 bg-slate-50/90 dark:bg-[#1E1719]/95 border-t border-[#FFCED8]/60 dark:border-[#4A3238] flex items-center justify-end gap-3 backdrop-blur-sm">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary-animated px-4 py-2.5 text-xs font-bold text-[#6B5A5D] dark:text-[#D4B8BE] hover:bg-[#FFF0F3] dark:hover:bg-[#2D2226] rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="btn-primary-animated px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#C75C73] via-[#D8687F] to-[#863043] rounded-xl shadow-md shadow-[#C75C73]/30 flex items-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              {success ? (
                <>
                  <Check className="w-4 h-4" /> Tersimpan!
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  <span>Simpan Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
