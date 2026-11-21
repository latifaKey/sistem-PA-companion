import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isPast, isToday, addDays } from 'date-fns';
import { id } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateIndo(date: Date | string | null | undefined, formatStr = 'dd MMMM yyyy') {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr, { locale: id });
}

export function formatRelativeTime(date: Date | string | null | undefined) {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: id });
}

export function getDeadlineStatus(date: Date | string | null | undefined, isCompleted = false) {
  if (isCompleted) return { label: 'Selesai', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (!date) return { label: 'Tanpa Deadline', color: 'bg-slate-50 text-slate-600 border-slate-200' };

  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  if (isPast(d) && !isToday(d)) {
    return { label: 'Terlambat (Overdue)', color: 'bg-red-50 text-red-700 border-red-200', isOverdue: true };
  }

  if (isToday(d)) {
    return { label: 'Hari Ini (Due Today)', color: 'bg-amber-50 text-amber-700 border-amber-200', isDueSoon: true };
  }

  const soon = addDays(now, 3);
  if (d <= soon) {
    return { label: 'Segera (Due Soon)', color: 'bg-orange-50 text-orange-700 border-orange-200', isDueSoon: true };
  }

  return { label: 'Mendatang', color: 'bg-[#FFF0F3] text-[#863043] border-[#FFCED8]' };
}
