'use client';

import React, { useState, useEffect } from 'react';
import {
  Milestone as MilestoneIcon,
  CheckCircle2,
  Clock,
  Circle,
  Calendar,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { formatDateIndo } from '@/lib/utils';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';

export default function TimelinePage() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMilestones = async () => {
    try {
      const res = await fetch('/api/timeline');
      const data = await res.json();
      setMilestones(data.milestones || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleToggleComplete = async (id: string, currentVal: boolean) => {
    try {
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, isCompleted: !currentVal, status: !currentVal ? 'COMPLETED' : 'IN_PROGRESS' } : m
        )
      );

      await fetch('/api/timeline', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted: !currentVal }),
      });
    } catch (err) {
      console.error(err);
      fetchMilestones();
    }
  };

  if (loading) {
    return <SkeletonLoading cardsCount={3} />;
  }

  const completedCount = milestones.filter((m) => m.isCompleted).length;
  const progressPercent = Math.round((completedCount / (milestones.length || 1)) * 100);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#FFCED8] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MilestoneIcon className="w-5 h-5 text-[#C75C73]" />
            <h2 className="text-xl font-bold text-slate-800">Timeline & Milestone Proyek Akhir</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            15 Tahapan Terstruktur dari Penentuan Topik hingga Sidang Akhir & Pengesahan
          </p>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3 bg-[#FFF4DE] border border-[#FFE8C4] px-4 py-2.5 rounded-2xl">
          <TrendingUp className="w-5 h-5 text-[#C75C73]" />
          <div>
            <span className="text-[11px] font-bold text-[#A84157] uppercase tracking-wider block">
              Progres Milestone
            </span>
            <span className="text-sm font-extrabold text-[#863043]">
              {completedCount} dari {milestones.length} Tahap ({progressPercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Visual Horizontal Timeline Track */}
      <div className="bg-white rounded-3xl border border-[#FFCED8] p-5 shadow-sm overflow-x-auto">
        <div className="min-w-[850px] flex items-center justify-between relative py-4">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#FFCED8]/50 z-0" />
          {milestones.map((m, idx) => {
            const isDone = m.isCompleted;
            const isCurrent = !isDone && milestones[idx - 1]?.isCompleted;

            return (
              <div key={m.id} className="relative z-10 flex flex-col items-center group">
                <button
                  onClick={() => handleToggleComplete(m.id, m.isCompleted)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-[#C75C73] text-white ring-4 ring-[#FFCED8] shadow-[#C75C73]/30 animate-pulse'
                      : 'bg-white border-2 border-[#FFCED8] text-slate-500 hover:border-[#C75C73]'
                  }`}
                  title={m.title}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : m.order}
                </button>
                <span className="text-[10px] font-bold text-slate-600 mt-2 max-w-[80px] text-center truncate">
                  {m.title.split(' ')[0]} {m.title.split(' ')[1] || ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Milestones List */}
      <div className="space-y-3.5">
        {milestones.map((m) => {
          const isDone = m.isCompleted;
          return (
            <div
              key={m.id}
              className={`p-5 rounded-3xl border transition-all flex flex-wrap items-center justify-between gap-4 ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : m.status === 'IN_PROGRESS'
                  ? 'bg-white border-[#C75C73] shadow-sm ring-1 ring-[#FFCED8]/60'
                  : 'bg-white border-[#FFCED8]'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleComplete(m.id, m.isCompleted)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : 'border-2 border-[#FFCED8] text-slate-400 hover:border-[#C75C73]'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : m.order}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#FFF4DE] text-[#863043] border border-[#FFE8C4]">
                      Tahap #{m.order}
                    </span>
                    <h3 className="font-bold text-sm text-slate-800">{m.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 max-w-2xl">{m.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {m.targetDate && (
                  <div className="text-right text-xs">
                    <span className="text-[11px] text-slate-400 block">Target Selesai</span>
                    <span className="font-semibold text-slate-700">
                      {formatDateIndo(m.targetDate, 'dd MMM yyyy')}
                    </span>
                  </div>
                )}

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : m.status === 'IN_PROGRESS'
                      ? 'bg-[#FFE8C4] text-[#863043] border border-[#FFE8C4]'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {isDone ? 'Selesai' : m.status === 'IN_PROGRESS' ? 'Sedang Berjalan' : 'Mendatang'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
