'use client';

import React, { useState } from 'react';
import { X, Send, Check } from 'lucide-react';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  'Ide Penelitian',
  'Tugas Baru',
  'Catatan Konsultasi',
  'Arahan Dosen',
  'Temuan Penelitian',
  'Referensi Jurnal',
  'Catatan Cepat',
];

export function QuickCaptureModal({ isOpen, onClose }: QuickCaptureModalProps) {
  const [category, setCategory] = useState(CATEGORIES[0]);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#FFCED8] w-full max-w-lg overflow-hidden animate-fade-in">
        {/* Header with Color Hunt Palette */}
        <div className="p-4 bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] text-[#863043] flex items-center justify-between border-b border-[#FFCED8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white p-1 shadow-sm flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h3 className="font-extrabold text-sm">Quick Capture — Catat Cepat</h3>
          </div>
          <button onClick={onClose} className="text-[#863043]/80 hover:text-[#863043] p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3D3133] mb-1.5">
              Pilih Jenis Catatan
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-xl border transition-all ${
                    category === cat
                      ? 'bg-[#FFCED8] border-[#F5A8B8] text-[#863043] font-bold shadow-sm'
                      : 'border-[#FFDDDD] text-[#6B5A5D] bg-[#FFF9FA] hover:bg-[#FFF0F3]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D3133] mb-1.5">
              Isi Catatan / Arahan / Ide
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis ide atau temuan riset secepatnya di sini tanpa perlu mengisi form panjang..."
              className="w-full text-xs p-3 border border-[#FFCED8] bg-[#FFF8F9] rounded-xl focus:ring-2 focus:ring-[#C75C73] focus:outline-none placeholder-[#A84157]/50"
              required
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="createAsTask"
              checked={createAsTask}
              onChange={(e) => setCreateAsTask(e.target.checked)}
              className="w-4 h-4 text-[#C75C73] rounded border-[#FFCED8] focus:ring-[#C75C73]"
            />
            <label htmlFor="createAsTask" className="text-xs text-[#544447] select-none">
              Otomatis masukkan sebagai Task pekerjaan di Kanban
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#FFDDDD]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#6B5A5D] hover:bg-[#FFF0F3] rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-5 py-2 text-xs font-bold text-[#863043] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] hover:opacity-90 border border-[#F5A8B8] rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {success ? (
                <>
                  <Check className="w-4 h-4" /> Tersimpan!
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Simpan Sekarang
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
