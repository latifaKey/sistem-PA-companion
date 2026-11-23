'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  BookOpen,
  Database,
  Save,
  Check,
  Download,
  Shield,
  Bell,
  Sparkles,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { formatDateIndo } from '@/lib/utils';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function SettingsPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [prodi, setProdi] = useState('');
  const [institution, setInstitution] = useState('');
  const [title, setTitle] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [targetCompletion, setTargetCompletion] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setUser(data.user);
      setProject(data.project);

      if (data.user) {
        setName(data.user.name || '');
        setNim(data.user.nim || '');
        setProdi(data.user.prodi || '');
        setInstitution(data.user.institution || '');
      }

      if (data.project) {
        setTitle(data.project.title || '');
        setAcademicYear(data.project.academicYear || '');
        setSemester(data.project.semester || '');
        if (data.project.targetCompletion) {
          setTargetCompletion(new Date(data.project.targetCompletion).toISOString().split('T')[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          nim,
          prodi,
          institution,
          title,
          academicYear,
          semester,
          targetCompletion,
        }),
      });

      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        fetchSettings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      user,
      project,
      exportedAt: new Date().toISOString(),
      system: 'PA Companion - Latifa Keysha',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PA_Companion_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (loading) {
    return <SkeletonLoading cardsCount={3} />;
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-[#2D2528] p-6 rounded-3xl border border-[#FFCED8] dark:border-[#4D383E] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#C75C73] dark:text-[#FFB3C6]" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-[#FFF0F3]">Pengaturan Sistem & Profil Akademik</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#D4B8BE] font-medium mt-1">
            Konfigurasi preferensi tema tampilan (terang/gelap), profil mahasiswa, judul skripsi, dan cadangan data.
          </p>
        </div>

        <button
          onClick={handleExportBackup}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#863043] dark:text-[#FFCED8] bg-[#FFF9FA] dark:bg-[#241E20] border border-[#FFCED8] dark:border-[#4D383E] hover:bg-[#FFF0F3] dark:hover:bg-[#38242A] rounded-2xl transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Ekspor Cadangan (Backup JSON)
        </button>
      </div>

      {/* Theme Appearance Selector Card */}
      <div className="bg-white dark:bg-[#2D2528] rounded-3xl border border-[#FFCED8] dark:border-[#4D383E] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#FFCED8]/40 dark:border-[#4D383E]/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C75C73] dark:text-[#FFB3C6]" />
            <div>
              <h3 className="font-bold text-sm text-[#863043] dark:text-[#FFCED8]">Tema Tampilan Sistem</h3>
              <p className="text-[11px] text-slate-500 dark:text-[#D4B8BE]">Pilih mode tampilan yang nyaman untuk mata dan selera Anda</p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-[#FFDDDD] dark:bg-[#4D2D37] text-[#863043] dark:text-[#FFCED8] border border-[#FFCED8] dark:border-[#7A3C4E]">
            Aktif: {resolvedTheme === 'dark' ? 'Mode Gelap 🌙' : 'Mode Terang ☀️'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {/* 1. Mode Terang (Light) */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              theme === 'light'
                ? 'border-[#C75C73] ring-2 ring-[#C75C73]/30 bg-gradient-to-br from-[#FFF5F7] to-[#FFF4DE]/40 shadow-sm'
                : 'border-[#FFDDDD] dark:border-[#4D383E] hover:border-[#FFCED8] bg-white dark:bg-[#241E20]'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-2 rounded-xl bg-[#FFF0F3] border border-[#FFCED8] text-[#863043]">
                <Sun className="w-4 h-4" />
              </div>
              {theme === 'light' && (
                <span className="w-5 h-5 rounded-full bg-[#C75C73] text-white flex items-center justify-center text-[10px]">
                  ✓
                </span>
              )}
            </div>
            <h4 className="font-bold text-xs text-[#3D3133] dark:text-[#FFF0F3]">Mode Terang</h4>
            <p className="text-[10px] text-[#6B5A5D] dark:text-[#D4B8BE] mt-1 leading-relaxed">
              Palet lembut Soft Pink & Warm Cream bernuansa hangat dan cerah.
            </p>
            {/* Color swatches preview */}
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#FFDDDD]/60 dark:border-[#4D383E]/60">
              <span className="w-4 h-4 rounded-full bg-[#FAF5F5] border border-[#FFCED8]" title="#FAF5F5" />
              <span className="w-4 h-4 rounded-full bg-[#FFCED8]" title="#FFCED8" />
              <span className="w-4 h-4 rounded-full bg-[#FFDDDD]" title="#FFDDDD" />
              <span className="w-4 h-4 rounded-full bg-[#FFF4DE]" title="#FFF4DE" />
              <span className="w-4 h-4 rounded-full bg-[#863043]" title="#863043" />
            </div>
          </button>

          {/* 2. Mode Gelap (Dark - #241E20) */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              theme === 'dark'
                ? 'border-[#FFCED8] ring-2 ring-[#FFCED8]/30 bg-gradient-to-br from-[#2D2528] to-[#38242A] shadow-sm'
                : 'border-[#FFDDDD] dark:border-[#4D383E] hover:border-[#FFCED8] bg-white dark:bg-[#241E20]'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-2 rounded-xl bg-[#38242A] border border-[#5E3D46] text-[#FFE8C4]">
                <Moon className="w-4 h-4" />
              </div>
              {theme === 'dark' && (
                <span className="w-5 h-5 rounded-full bg-[#FFCED8] text-[#863043] font-bold flex items-center justify-center text-[10px]">
                  ✓
                </span>
              )}
            </div>
            <h4 className="font-bold text-xs text-[#3D3133] dark:text-[#FFF0F3]">Mode Gelap</h4>
            <p className="text-[10px] text-[#6B5A5D] dark:text-[#D4B8BE] mt-1 leading-relaxed">
              Palet Velvet Rose-Ebony & Cocoa (#241E20) yang nyaman di mata untuk sesi malam.
            </p>
            {/* Color swatches preview */}
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#FFDDDD]/60 dark:border-[#4D383E]/60">
              <span className="w-4 h-4 rounded-full bg-[#241E20] border border-[#4D383E]" title="#241E20" />
              <span className="w-4 h-4 rounded-full bg-[#2D2528] border border-[#4D383E]" title="#2D2528" />
              <span className="w-4 h-4 rounded-full bg-[#4D2B36]" title="#4D2B36" />
              <span className="w-4 h-4 rounded-full bg-[#FFB3C6]" title="#FFB3C6" />
              <span className="w-4 h-4 rounded-full bg-[#FFE8C4]" title="#FFE8C4" />
            </div>
          </button>

          {/* 3. Otomatis (System) */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              theme === 'system'
                ? 'border-[#C75C73] ring-2 ring-[#C75C73]/30 bg-gradient-to-br from-[#FFF5F7] to-[#FFF4DE]/40 dark:from-[#2D2528] dark:to-[#38242A] shadow-sm'
                : 'border-[#FFDDDD] dark:border-[#4D383E] hover:border-[#FFCED8] bg-white dark:bg-[#241E20]'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-2 rounded-xl bg-[#FFF4DE] dark:bg-[#382C24] border border-[#FFE8C4] dark:border-[#4D383E] text-[#863043] dark:text-[#FFE8C4]">
                <Laptop className="w-4 h-4" />
              </div>
              {theme === 'system' && (
                <span className="w-5 h-5 rounded-full bg-[#C75C73] dark:bg-[#FFCED8] text-white dark:text-[#863043] font-bold flex items-center justify-center text-[10px]">
                  ✓
                </span>
              )}
            </div>
            <h4 className="font-bold text-xs text-[#3D3133] dark:text-[#FFF0F3]">Otomatis (Sistem)</h4>
            <p className="text-[10px] text-[#6B5A5D] dark:text-[#D4B8BE] mt-1 leading-relaxed">
              Menyesuaikan otomatis dengan pengaturan tema browser & sistem operasi perangkat Anda.
            </p>
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#FFDDDD]/60 dark:border-[#4D383E]/60">
              <span className="text-[10px] font-semibold text-[#863043] dark:text-[#FFCED8]">Auto Sinkron OS</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Student Profile Card */}
        <div className="bg-white dark:bg-[#231B1E] rounded-[28px] border border-[#FFCED8] dark:border-[#4A3238] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#FFCED8]/40 dark:border-[#4A3238]">
            <User className="w-4 h-4 text-[#C75C73] dark:text-[#FFB3C2]" />
            <h3 className="font-bold text-sm text-[#863043] dark:text-[#FFCED8]">Profil Mahasiswa</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">Nama Lengkap</label>
                <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">Wajib</span>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-semibold"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">Nomor Induk Mahasiswa (NIM)</label>
                <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">Wajib</span>
              </div>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">Program Studi</label>
                <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">Wajib</span>
              </div>
              <input
                type="text"
                value={prodi}
                onChange={(e) => setProdi(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">Institusi / Politeknik</label>
                <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">Wajib</span>
              </div>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium"
                required
              />
            </div>
          </div>
        </div>

        {/* Project Profile Card */}
        <div className="bg-white dark:bg-[#231B1E] rounded-[28px] border border-[#FFCED8] dark:border-[#4A3238] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#FFCED8]/40 dark:border-[#4A3238]">
            <BookOpen className="w-4 h-4 text-[#C75C73] dark:text-[#FFB3C2]" />
            <h3 className="font-bold text-sm text-[#863043] dark:text-[#FFCED8]">Data Proyek Akhir (PA)</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">Judul Resmi Tugas Akhir</label>
                <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">Wajib</span>
              </div>
              <textarea
                rows={3}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none placeholder-[#A84157]/45 transition-all text-xs font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">Tahun Akademik</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2026/2027"
                  className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">Semester</label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="Semester 8"
                  className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">Target Sidang Akhir</label>
                <input
                  type="date"
                  value={targetCompletion}
                  onChange={(e) => setTargetCompletion(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#FFCED8] dark:border-[#4A3238] bg-[#FFF9FA] dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-2xl focus:bg-white dark:focus:bg-[#20181A] focus:border-[#C75C73] focus:ring-4 focus:ring-[#C75C73]/15 focus:outline-none transition-all font-medium cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#C75C73] via-[#D8687F] to-[#863043] hover:opacity-95 shadow-md shadow-[#C75C73]/30 active:scale-[0.98] rounded-xl transition-all"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" /> Perubahan Tersimpan!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Simpan Pengaturan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
