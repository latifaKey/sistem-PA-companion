import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { fallbackProject } from '@/lib/fallbackData';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Database,
  FileText,
  Users2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ResearchProgressChart } from '@/components/dashboard/ResearchProgressChart';
import { formatDateIndo, formatRelativeTime, getDeadlineStatus } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return 'Selamat Pagi';
  if (hour >= 11 && hour < 15) return 'Selamat Siang';
  if (hour >= 15 && hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

export default async function DashboardPage() {
  let project: any = null;

  try {
    project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        milestones: { orderBy: { order: 'asc' } },
        tasks: {
          orderBy: { deadline: 'asc' },
          include: { subtasks: true },
        },
        reviewerComments: {
          include: { reviewer: true },
          where: { status: { not: 'Selesai' } },
        },
        reminders: {
          where: { isDismissed: false },
          orderBy: { targetDate: 'asc' },
          take: 5,
        },
        consultations: {
          orderBy: { consultationDate: 'desc' },
          take: 1,
          include: { supervisor: true },
        },
        datasets: {
          include: { distributions: true },
        },
        references: true,
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 6,
        },
      },
    });
  } catch (error) {
    console.warn('Database offline or unreachable, using fallback project data:', error);
    project = fallbackProject;
  }

  if (!project) {
    project = fallbackProject;
  }

  // Calculate statistics
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t: any) => t.isCompleted || t.status === 'Completed').length;
  const inProgressTasks = project.tasks.filter((t: any) => t.status === 'In Progress').length;
  const pendingTasks = project.tasks.filter((t: any) => t.status === 'To Do' || t.status === 'Blocked').length;
  const unresolvedRevisions = project.reviewerComments.length;
  const totalReferences = project.references.length;
  const initialDataset = project.datasets[0];

  // Research Progress metrics
  const researchStagesData = [
    { stage: 'Penulisan Proposal', progress: 85, target: 100 },
    { stage: 'Revisi Reviewer', progress: 25, target: 100 },
    { stage: 'Pengolahan Dataset', progress: 30, target: 100 },
    { stage: 'Eksperimen LDA', progress: 20, target: 100 },
    { stage: 'Implementasi Sistem', progress: 10, target: 100 },
    { stage: 'Pengujian Sistem', progress: 0, target: 100 },
  ];

  const greeting = getTimeGreeting();

  // Filter tasks with deadlines
  const upcomingDeadlines = project.tasks
    .filter((t: any) => t.deadline && !t.isCompleted)
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Welcome Section with Soft Rose & Peach Gradient */}
      <div className="bg-gradient-to-r from-[#A84157] via-[#C75C73] to-[#E37F94] rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-[#FFCED8]/40 relative overflow-hidden border border-[#FFCED8]/40">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[#FFF4DE] border border-white/30 text-xs font-bold mb-3 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#FFF4DE]" />
                {greeting}, {project.user.name} 🌸
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white max-w-3xl leading-snug">
                {project.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#FFF4DE]">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#FFE8C4] animate-pulse" />
                  Status: <strong>Revisi Proposal Pasca Sempro</strong>
                </span>
                <span>•</span>
                <span>Prodi: {project.user.prodi}</span>
                <span>•</span>
                <span>
                  Target Sidang: <strong>{formatDateIndo(project.targetCompletion)}</strong>
                </span>
              </div>
            </div>

            {/* Overall Progress Gauge */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/25 min-w-[180px] text-center shadow-inner">
              <span className="text-[11px] font-bold text-[#FFF4DE] uppercase tracking-wider block">
                Progres Keseluruhan
              </span>
              <div className="text-3xl md:text-4xl font-black text-white mt-1">
                {project.overallProgress}%
              </div>
              <div className="w-full bg-black/15 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-[#FFE8C4] h-full rounded-full transition-all duration-500"
                  style={{ width: `${project.overallProgress}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-[#FFF4DE] mt-1.5 block">
                Tahap 6 dari 15 Milestone
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Progress Overview Cards (Soft Pink Palette) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5A5D]">Task Berjalan</span>
            <span className="p-1.5 bg-[#FFDDDD] text-[#863043] rounded-xl border border-[#FFCED8]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-[#3D3133] mt-2">{inProgressTasks}</div>
          <span className="text-[11px] text-[#A84157] font-semibold mt-0.5 block">
            {pendingTasks} Menunggu (To Do)
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5A5D]">Task Selesai</span>
            <span className="p-1.5 bg-[#FFF4DE] text-[#C75C73] rounded-xl border border-[#FFE8C4]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-[#3D3133] mt-2">{completedTasks}</div>
          <span className="text-[11px] text-[#863043] font-semibold mt-0.5 block">
            dari {totalTasks} pekerjaan
          </span>
        </div>

        {/* Critical Revisions Alert Card */}
        <div className="bg-[#FFF0F3] p-4 rounded-2xl border-2 border-[#F5A8B8] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#863043]">Revisi Reviewer</span>
            <span className="p-1.5 bg-[#FFCED8] text-[#863043] rounded-xl border border-[#F5A8B8]">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-[#863043] mt-2">{unresolvedRevisions}</div>
          <span className="text-[11px] text-[#863043] font-bold mt-0.5 block">
            Belum Selesai (Perlu Aksi)
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5A5D]">Referensi Jurnal</span>
            <span className="p-1.5 bg-[#FFE8C4] text-[#863043] rounded-xl border border-[#FAD89E]">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-[#3D3133] mt-2">{totalReferences}</div>
          <span className="text-[11px] text-[#863043] font-semibold mt-0.5 block">
            Tervalidasi & Sitasi
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5A5D]">Dataset SITA</span>
            <span className="p-1.5 bg-[#FFDDDD] text-[#863043] rounded-xl border border-[#FFCED8]">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-[#3D3133] mt-2">
            {initialDataset?.finalCount || 374}
          </div>
          <span className="text-[11px] text-[#A84157] font-semibold mt-0.5 block truncate">
            {initialDataset?.regularCount || 335} Reg / {initialDataset?.alihKreditCount || 39} AK
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FFCED8] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5A5D]">Bimbingan Terakhir</span>
            <span className="p-1.5 bg-[#FFF4DE] text-[#A84157] rounded-xl border border-[#FFE8C4]">
              <Users2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xs font-black text-[#3D3133] mt-2.5 truncate">
            {project.consultations[0]?.supervisor.name.split(',')[0]}
          </div>
          <span className="text-[11px] text-[#A84157] mt-0.5 block font-medium">
            {formatDateIndo(project.consultations[0]?.consultationDate, 'dd MMM yyyy')}
          </span>
        </div>
      </div>

      {/* 3. Today's Focus & Critical Alert Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Focus & Unresolved Reviewer Revisions */}
        <div className="lg:col-span-2 space-y-6">
          {/* CRITICAL ATTENTION: Reviewer Revision Notice (Soft Pink / Rose Alert) */}
          <div className="bg-[#FFF8F9] border-l-4 border-[#C75C73] rounded-r-2xl p-5 shadow-sm border-t border-b border-r border-[#FFDDDD]">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#FFDDDD] rounded-xl text-[#863043] shrink-0 border border-[#FFCED8]">
                <AlertTriangle className="w-5 h-5 text-[#863043]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#863043]">
                    Fokus Utama: Catatan Reviewer Pasca Sempro (Status: Belum Selesai)
                  </h3>
                  <Link
                    href="/proposal"
                    className="text-xs font-bold text-[#A84157] hover:text-[#863043] flex items-center gap-1"
                  >
                    Buka Matriks Revisi <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-xs text-[#544447] mt-1 leading-relaxed">
                  Seluruh catatan revisi ditandai <strong>BELUM SELESAI</strong> sampai perbaikan
                  analisis korpus abstrak dan tata bahasa diverifikasi oleh dosen pembimbing.
                </p>

                {/* List of active critical reviewer comments */}
                <div className="mt-3.5 space-y-2.5">
                  {project.reviewerComments.map((rc: any) => (
                    <div
                      key={rc.id}
                      className="bg-white border border-[#FFCED8] rounded-xl p-3 text-xs text-[#3D3133] flex items-start justify-between gap-3 shadow-sm hover:border-[#F5A8B8] transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#863043]">{rc.reviewer.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF4DE] text-[#863043] font-bold border border-[#FFE8C4]">
                            {rc.evaluationAspect}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFDDDD] text-[#863043] font-bold">
                            {rc.status}
                          </span>
                        </div>
                        <p className="text-[#544447] mt-1 line-clamp-2 italic font-medium">
                          "{rc.originalComment}"
                        </p>
                      </div>
                      <Link
                        href="/proposal"
                        className="text-[#A84157] hover:text-[#863043] font-bold text-[11px] whitespace-nowrap mt-1"
                      >
                        Tindak Lanjut &rarr;
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Focus Tasks */}
          <div className="bg-white rounded-3xl border border-[#FFCED8] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#FFDDDD] text-[#863043] rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-[#3D3133]">Tugas Mendesak Hari Ini</h3>
              </div>
              <Link
                href="/tasks"
                className="text-xs font-bold text-[#A84157] hover:text-[#863043] flex items-center gap-1"
              >
                Lihat Semua Task <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {project.tasks.slice(0, 4).map((task: any) => {
                const statusInfo = getDeadlineStatus(task.deadline, task.isCompleted);
                return (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl border border-[#FFF0F3] hover:border-[#FFCED8] hover:bg-[#FFF9FA] transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          task.priority === 'Critical'
                            ? 'bg-[#A84157]'
                            : task.priority === 'High'
                            ? 'bg-[#E37F94]'
                            : 'bg-[#F2BF72]'
                        }`}
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#3D3133] truncate group-hover:text-[#863043] transition-colors">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-[#A84157] mt-0.5">
                          <span>{task.category}</span>
                          <span>•</span>
                          <span>Deadline: {formatDateIndo(task.deadline, 'dd MMM yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-[#FFF4DE] text-[#863043] border-[#FFE8C4]">
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Research Progress Chart */}
          <div className="bg-white rounded-3xl border border-[#FFCED8] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#FFE8C4] text-[#863043] rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-[#3D3133]">
                  Grafik Perkembangan Riset & Implementasi
                </h3>
              </div>
              <span className="text-xs text-[#A84157] font-semibold">6 Pilar Utama Proyek Akhir</span>
            </div>
            <ResearchProgressChart data={researchStagesData} />
          </div>
        </div>

        {/* Right Column: Deadlines, Reminders & Recent Activities */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-3xl border border-[#FFCED8] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#A84157]" />
                <h3 className="font-extrabold text-sm text-[#3D3133]">Upcoming Deadlines</h3>
              </div>
              <Link href="/kalender" className="text-xs text-[#A84157] font-bold hover:underline">
                Kalender
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-[#A84157] py-3 text-center">Tidak ada deadline terdekat</p>
              ) : (
                upcomingDeadlines.map((item: any) => {
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#FFDDDD] flex items-start justify-between gap-2"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-[#3D3133] leading-snug line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[#A84157] mt-1 flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3 h-3 text-[#A84157]" />
                          {formatDateIndo(item.deadline, 'dd MMM yyyy')}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-[#FFDDDD] text-[#863043] border-[#FFCED8]">
                        {item.priority}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Supervisor Reminder Card (Warm Cream & Blush Gradient) */}
          <div className="bg-gradient-to-br from-[#FFF4DE] via-[#FFF9FA] to-[#FFDDDD]/60 rounded-3xl border border-[#FFE8C4] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Users2 className="w-4 h-4 text-[#863043]" />
              <h3 className="font-extrabold text-sm text-[#863043]">Jadwal Bimbingan Berikutnya</h3>
            </div>
            <div className="p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-[#FFE8C4] text-xs space-y-2">
              <div className="font-extrabold text-[#3D3133]">Dr. Eng. Ir. Riko Ervil, M.Kom</div>
              <p className="text-[#544447] leading-relaxed text-[11px]">
                Agenda: Konsultasi kemajuan surat izin teks abstrak SITA PNP & matriks revisi Reviewer.
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#863043] font-bold pt-1.5 border-t border-[#FFDDDD]">
                <span>Selasa, 26 Nov 2026 • 10.00 WIB</span>
                <Link href="/konsultasi" className="hover:underline">
                  Siapkan Pertanyaan &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white rounded-3xl border border-[#FFCED8] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-[#3D3133]">Aktivitas Terkini (Audit Log)</h3>
              <span className="text-[10px] font-bold text-[#A84157] bg-[#FFDDDD] px-2 py-0.5 rounded-full">
                Tercatat
              </span>
            </div>

            <div className="space-y-3">
              {project.activityLogs.map((log: any) => (
                <div key={log.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#E37F94] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#3D3133] truncate">{log.title}</p>
                    <p className="text-[11px] text-[#A84157] mt-0.5">
                      {formatRelativeTime(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
