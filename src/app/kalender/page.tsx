'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  AlertTriangle,
  Bell,
  CheckCircle2,
  CalendarCheck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { formatDateIndo, getDeadlineStatus } from '@/lib/utils';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { id } from 'date-fns/locale';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';

export default function KalenderPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 21)); // November 2026
  const [events, setEvents] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date(2026, 10, 26));
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-26');
  const [eventTime, setEventTime] = useState('10:00');
  const [eventType, setEventType] = useState('CONSULTATION');
  const [eventLocation, setEventLocation] = useState('Ruang Dosen TI PNP');
  const [eventDesc, setEventDesc] = useState('');

  // New Reminder Form State
  const [remTitle, setRemTitle] = useState('');
  const [remDate, setRemDate] = useState('2026-11-28');
  const [remType, setRemType] = useState('REVISION_DEADLINE');
  const [remPriority, setRemPriority] = useState('High');
  const [remNotes, setRemNotes] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/calendar');
      const data = await res.json();
      setEvents(data.events || []);
      setReminders(data.reminders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle,
          description: eventDesc,
          eventType,
          startDate: `${eventDate}T${eventTime}:00`,
          location: eventLocation,
        }),
      });
      if (res.ok) {
        setIsEventModalOpen(false);
        setEventTitle('');
        setEventDesc('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: remTitle,
          reminderType: remType,
          targetDate: remDate,
          priority: remPriority,
          notes: remNotes,
        }),
      });
      if (res.ok) {
        setIsReminderModalOpen(false);
        setRemTitle('');
        setRemNotes('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calendar Days calculation
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (loading) {
    return <SkeletonLoading cardsCount={4} />;
  }
  const selectedDayEvents = events.filter((e) => isSameDay(new Date(e.startDate), selectedDay));
  const selectedDayReminders = reminders.filter((r) => isSameDay(new Date(r.targetDate), selectedDay));

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#FFCED8] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Kalender Akademik & Sistem Pengingat</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Jadwal bimbingan, deadline revisi dosen, seminar, dan target eksperimen Proyek Akhir
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReminderModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#863043] bg-[#FFF9FA] border border-[#FFCED8] hover:bg-[#FFF0F3] rounded-2xl transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            + Buat Pengingat
          </button>
          <button
            onClick={() => setIsEventModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#863043] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] border border-[#F5A8B8] hover:opacity-95 rounded-2xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            + Jadwal Agenda
          </button>
        </div>
      </div>

      {/* Reminder Alert Cards: H-7, H-3, H-1, Day-of */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="bg-gradient-to-br from-rose-50/80 to-white p-4 rounded-2xl border border-rose-200">
          <div className="flex items-center justify-between text-rose-700 font-bold text-xs">
            <span>Peringatan H-3</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-800 mt-2">Konfirmasi Data Abstrak SITA</p>
          <span className="text-[11px] text-rose-600 mt-1 block">Tenggat: 25 Nov 2026</span>
        </div>

        <div className="bg-gradient-to-br from-[#FFE8C4]/40 to-white p-4 rounded-2xl border border-[#FFE8C4]">
          <div className="flex items-center justify-between text-[#863043] font-bold text-xs">
            <span>Peringatan H-5</span>
            <Clock className="w-4 h-4 text-[#A84157]" />
          </div>
          <p className="text-xs font-bold text-slate-800 mt-2">Bimbingan Pembimbing 1</p>
          <span className="text-[11px] text-[#863043] mt-1 block">Selasa, 26 Nov 2026 • 10.00</span>
        </div>

        <div className="bg-gradient-to-br from-[#FFF4DE]/60 to-white p-4 rounded-2xl border border-[#FFE8C4]">
          <div className="flex items-center justify-between text-[#863043] font-bold text-xs">
            <span>Target Internal H-9</span>
            <CalendarCheck className="w-4 h-4 text-[#C75C73]" />
          </div>
          <p className="text-xs font-bold text-slate-800 mt-2">Selesai Typo & Bahasa (Reviewer 2)</p>
          <span className="text-[11px] text-[#A84157] mt-1 block">Tenggat: 30 Nov 2026</span>
        </div>

        <div className="bg-gradient-to-br from-[#FFCED8]/40 to-white p-4 rounded-2xl border border-[#FFCED8]">
          <div className="flex items-center justify-between text-[#863043] font-bold text-xs">
            <span>Target Uji Korpus H-14</span>
            <CheckCircle2 className="w-4 h-4 text-[#C75C73]" />
          </div>
          <p className="text-xs font-bold text-slate-800 mt-2">Submit Revisi Naskah Lengkap</p>
          <span className="text-[11px] text-[#A84157] mt-1 block">Tenggat: 05 Des 2026</span>
        </div>
      </div>

      {/* Main Calendar & Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#FFCED8] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#FFCED8]/40">
            <h3 className="font-bold text-sm text-[#863043]">
              {format(currentDate, 'MMMM yyyy', { locale: id })}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-1.5 hover:bg-[#FFF0F3] rounded-xl text-[#863043]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-1.5 hover:bg-[#FFF0F3] rounded-xl text-[#863043]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 text-center font-bold text-[11px] text-[#A84157]/70 py-1">
            <span>Min</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
          </div>

          {/* Month Day Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {daysInMonth.map((day) => {
              const dayEvents = events.filter((e) => isSameDay(new Date(e.startDate), day));
              const dayReminders = reminders.filter((r) => isSameDay(new Date(r.targetDate), day));
              const isSelected = isSameDay(day, selectedDay);
              const today = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[72px] p-1.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-[#FFCED8]/30 border-[#C75C73] ring-2 ring-[#C75C73]/20'
                      : 'border-slate-100 hover:border-[#FFCED8] hover:bg-[#FFF9FA]'
                  }`}
                >
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded-lg inline-block w-fit ${
                      today
                        ? 'bg-[#C75C73] text-white'
                        : isSelected
                        ? 'text-[#863043] font-extrabold bg-[#FFCED8]/60'
                        : 'text-slate-700'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>

                  <div className="space-y-0.5 mt-1 w-full overflow-hidden">
                    {dayEvents.map((e) => (
                      <div
                        key={e.id}
                        className="text-[9px] font-semibold px-1 py-0.5 rounded-md bg-[#FFE8C4] text-[#863043] border border-[#FFE8C4] truncate"
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayReminders.map((r) => (
                      <div
                        key={r.id}
                        className="text-[9px] font-semibold px-1 py-0.5 rounded-md bg-[#FFCED8] text-[#863043] border border-[#FFCED8] truncate"
                      >
                        {r.title}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector */}
        <div className="bg-white rounded-3xl border border-[#FFCED8] p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-[#FFCED8]/40">
            <span className="text-[11px] font-bold text-[#A84157] uppercase tracking-wider block">
              Agenda Hari Terpilih
            </span>
            <h4 className="text-base font-bold text-slate-800 mt-0.5">
              {formatDateIndo(selectedDay, 'EEEE, dd MMMM yyyy')}
            </h4>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-[#863043] block">Jadwal Pertemuan / Acara:</span>
            {selectedDayEvents.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Tidak ada agenda pada tanggal ini</p>
            ) : (
              selectedDayEvents.map((e) => (
                <div
                  key={e.id}
                  className="p-3 rounded-2xl bg-[#FFF4DE]/70 border border-[#FFE8C4] text-xs space-y-1"
                >
                  <div className="font-bold text-[#863043]">{e.title}</div>
                  {e.location && (
                    <div className="flex items-center gap-1 text-[11px] text-[#A84157]">
                      <MapPin className="w-3 h-3" /> {e.location}
                    </div>
                  )}
                  {e.description && (
                    <p className="text-[11px] text-slate-600 mt-1">{e.description}</p>
                  )}
                </div>
              ))
            )}

            <div className="pt-2">
              <span className="text-xs font-bold text-[#863043] block mb-2">
                Pengingat & Tenggat Hari Ini:
              </span>
              {selectedDayReminders.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Tidak ada pengingat tenggat</p>
              ) : (
                selectedDayReminders.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-2xl bg-[#FFCED8]/30 border border-[#FFCED8] text-xs space-y-1"
                  >
                    <div className="font-bold text-[#863043]">{r.title}</div>
                    <div className="text-[11px] text-[#A84157] font-semibold">
                      Prioritas: {r.priority} • Jam: {r.reminderTime || '09:00'}
                    </div>
                    {r.notes && <p className="text-[11px] text-slate-600 mt-1">{r.notes}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Add Event */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#FFCED8] w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-4 bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] text-[#863043] border-b border-[#FFCED8] flex items-center justify-between">
              <h3 className="font-bold text-sm">Jadwalkan Agenda Baru</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-[#863043] hover:opacity-75">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Agenda</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Misal: Bimbingan Bab III dengan Pembimbing 1"
                  className="w-full p-2.5 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Waktu</label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lokasi / Media</label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Ruang Dosen TI PNP / Google Meet"
                  className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi & Catatan</label>
                <textarea
                  rows={2}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Hal yang dibahas..."
                  className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#FFCED8]/40">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-[#FFF0F3] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#C75C73] hover:bg-[#A84157] rounded-xl shadow-sm transition-all"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Reminder */}
      {isReminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#FFCED8] w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-4 bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] text-[#863043] border-b border-[#FFCED8] flex items-center justify-between">
              <h3 className="font-bold text-sm">Buat Pengingat Tenggat (Reminder)</h3>
              <button onClick={() => setIsReminderModalOpen(false)} className="text-[#863043] hover:opacity-75">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Pengingat</label>
                <input
                  type="text"
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  placeholder="Misal: Batas akhir revisi format IEEE"
                  className="w-full p-2.5 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Tenggat</label>
                  <input
                    type="date"
                    value={remDate}
                    onChange={(e) => setRemDate(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prioritas</label>
                  <select
                    value={remPriority}
                    onChange={(e) => setRemPriority(e.target.value)}
                    className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  value={remNotes}
                  onChange={(e) => setRemNotes(e.target.value)}
                  placeholder="Detail pengingat..."
                  className="w-full p-2 border border-[#FFCED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C75C73]/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#FFCED8]/40">
                <button
                  type="button"
                  onClick={() => setIsReminderModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-[#FFF0F3] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#C75C73] hover:bg-[#A84157] rounded-xl shadow-sm transition-all"
                >
                  Simpan Pengingat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
