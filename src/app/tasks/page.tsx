'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Kanban,
  List,
  Clock,
  Trash2,
  X,
  GripVertical,
  ArrowDownToLine,
  Sparkles,
} from 'lucide-react';
import { formatDateIndo, getDeadlineStatus, cn } from '@/lib/utils';
import { SkeletonLoading } from '@/components/ui/SkeletonLoading';

const COLUMNS = ['To Do', 'In Progress', 'Review', 'Completed', 'Blocked'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Critical'];
const CATEGORIES = [
  'All',
  'Proposal',
  'Revisi Reviewer',
  'Dataset',
  'Experiment',
  'Konsultasi',
  'Literature',
  'General',
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Drag & Drop State (Mouse & Touch)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Mobile / Finger Touch Drag State
  const [touchDragTask, setTouchDragTask] = useState<any | null>(null);
  const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
  const touchStartRef = useRef<{
    taskId: string;
    startX: number;
    startY: number;
    task: any;
    isDragging: boolean;
  } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Proposal');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [deadline, setDeadline] = useState('');
  const [subtasksInput, setSubtasksInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: newStatus, isCompleted: newStatus === 'Completed' }
          : t
      )
    );

    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error(err);
      fetchTasks();
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Yakin ingin menghapus task ini?')) return;
    try {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
      fetchTasks();
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const subtasks = subtasksInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          status,
          deadline: deadline || null,
          subtasks,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        setDeadline('');
        setSubtasksInput('');
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // Mouse Drag & Drop Handlers (Desktop)
  // ==========================================
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, colName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colName) {
      setDragOverColumn(colName);
    }
  };

  const handleDragLeave = (e: React.DragEvent, colName: string) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverColumn === colName) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, colName: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      handleUpdateStatus(taskId, colName);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  // ==========================================
  // Touch / Finger Drag Handlers (Mobile / Tablet)
  // ==========================================
  const handleTouchStart = (e: React.TouchEvent, task: any) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      taskId: task.id,
      startX: touch.clientX,
      startY: touch.clientY,
      task,
      isDragging: false,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.startX);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.startY);

    // If dragged more than 10px, initiate finger dragging
    if (!touchStartRef.current.isDragging && (deltaX > 10 || deltaY > 10)) {
      touchStartRef.current.isDragging = true;
      setTouchDragTask(touchStartRef.current.task);
      setDraggedTaskId(touchStartRef.current.taskId);
    }

    if (touchStartRef.current.isDragging) {
      if (e.cancelable) e.preventDefault();
      setTouchPosition({ x: touch.clientX, y: touch.clientY });

      // Detect which column is under the user's finger
      const elem = document.elementFromPoint(touch.clientX, touch.clientY);
      const colElem = elem?.closest('[data-column]');
      if (colElem) {
        const colName = colElem.getAttribute('data-column');
        if (colName) {
          setDragOverColumn(colName);
        }
      } else {
        setDragOverColumn(null);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchStartRef.current?.isDragging && touchStartRef.current.taskId && dragOverColumn) {
      handleUpdateStatus(touchStartRef.current.taskId, dragOverColumn);
    }
    touchStartRef.current = null;
    setTouchDragTask(null);
    setTouchPosition(null);
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchPri = selectedPriority === 'All' || t.priority === selectedPriority;
    const matchSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchPri && matchSearch;
  });

  if (loading) {
    return <SkeletonLoading cardsCount={5} />;
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#2D2528] p-6 rounded-3xl border border-[#FFCED8] dark:border-[#4D383E] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#C75C73] dark:text-[#FFB3C6]" />
            <h2 className="text-xl font-extrabold text-[#3D3133] dark:text-[#FFF0F3]">
              Task Management
            </h2>
          </div>
          <p className="text-xs text-[#A84157] dark:text-[#FFCED8] font-semibold mt-1">
            Kelola alur kerja Proyek Akhir secara fleksibel — geser kartu dengan kursor mouse / jari, atau pilih dropdown status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#FFF4DE]/60 dark:bg-[#382C24]/80 rounded-2xl border border-[#FFE8C4] dark:border-[#4D383E]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-gradient-to-r from-[#FFCED8] to-[#FFE8C4] dark:from-[#4D2633] dark:to-[#543428] text-[#863043] dark:text-[#FFF0F3] shadow-sm border border-[#F5A8B8] dark:border-[#7A3C4E]'
                  : 'text-[#6B5A5D] dark:text-[#D4B8BE] hover:text-[#863043] dark:hover:text-[#FFF0F3]'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-[#FFCED8] to-[#FFE8C4] dark:from-[#4D2633] dark:to-[#543428] text-[#863043] dark:text-[#FFF0F3] shadow-sm border border-[#F5A8B8] dark:border-[#7A3C4E]'
                  : 'text-[#6B5A5D] dark:text-[#D4B8BE] hover:text-[#863043] dark:hover:text-[#FFF0F3]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#863043] dark:text-[#FFF0F3] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] dark:from-[#4D2633] dark:via-[#542D3B] dark:to-[#543428] hover:opacity-90 border border-[#F5A8B8] dark:border-[#7A3C4E] rounded-2xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Task Baru
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-[#2D2528] p-4 rounded-2xl border border-[#FFCED8] dark:border-[#4D383E] text-xs">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF9FA] dark:bg-[#241E20] border border-[#FFDDDD] dark:border-[#4D383E] rounded-xl flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-[#A84157] dark:text-[#FFB3C6]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama task atau deskripsi..."
            className="bg-transparent focus:outline-none w-full text-xs text-[#3D3133] dark:text-[#FFF0F3]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[#A84157] dark:text-[#FFB3C6] font-bold">Kategori:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#FFF9FA] dark:bg-[#241E20] border border-[#FFDDDD] dark:border-[#4D383E] rounded-xl px-2.5 py-1.5 text-[#3D3133] dark:text-[#FFF0F3] font-medium focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[#A84157] dark:text-[#FFB3C6] font-bold">Prioritas:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#FFF9FA] dark:bg-[#241E20] border border-[#FFDDDD] dark:border-[#4D383E] rounded-xl px-2.5 py-1.5 text-[#3D3133] dark:text-[#FFF0F3] font-medium focus:outline-none"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Helper Banner */}
      <div className="px-4 py-2.5 rounded-2xl bg-[#FFF4DE]/70 dark:bg-[#382C24]/70 border border-[#FFE8C4] dark:border-[#4D383E] flex items-center justify-between text-xs text-[#863043] dark:text-[#FFE8C4]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C75C73] dark:text-[#FFB3C6] shrink-0" />
          <span className="font-medium text-[11px] sm:text-xs">
            <strong>Drag & Drop Aktif:</strong> Geser kartu langsung dengan kursor mouse atau sentuhan jari Anda ke kolom tujuan untuk memindahkan status pekerjaan secara instan.
          </span>
        </div>
        <span className="text-[10px] font-bold hidden sm:inline-block px-2 py-0.5 rounded-full bg-white dark:bg-[#2D2528] border border-[#FFE8C4] dark:border-[#4D383E]">
          Kursor / Jari / Dropdown
        </span>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {COLUMNS.map((colName) => {
            const colTasks = filteredTasks.filter((t) => t.status === colName);
            const isColumnHovered = dragOverColumn === colName;

            const colColor =
              colName === 'Completed'
                ? 'border-t-emerald-500'
                : colName === 'In Progress'
                ? 'border-t-[#C75C73]'
                : colName === 'Blocked'
                ? 'border-t-rose-500'
                : colName === 'Review'
                ? 'border-t-[#E37F94]'
                : 'border-t-[#F5A8B8]';

            return (
              <div
                key={colName}
                data-column={colName}
                onDragOver={(e) => handleDragOver(e, colName)}
                onDragLeave={(e) => handleDragLeave(e, colName)}
                onDrop={(e) => handleDrop(e, colName)}
                className={cn(
                  'bg-[#FFF9FA] dark:bg-[#1E1719] rounded-3xl p-3 border border-[#FFDDDD] dark:border-[#4D383E] border-t-4 flex flex-col min-h-[520px] shadow-sm transition-all duration-200',
                  colColor,
                  isColumnHovered && 'ring-2 ring-[#C75C73] dark:ring-[#FFB3C6] bg-[#FFF0F3]/80 dark:bg-[#2D2226] scale-[1.01]'
                )}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#FFDDDD] dark:border-[#4D383E]">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-[#3D3133] dark:text-[#FFF0F3]">{colName}</span>
                    <span className="text-[10px] font-bold bg-white dark:bg-[#2D2528] px-2 py-0.5 rounded-full border border-[#FFCED8] dark:border-[#4D383E] text-[#863043] dark:text-[#FFCED8]">
                      {colTasks.length}
                    </span>
                  </div>
                  {isColumnHovered && (
                    <span className="text-[10px] font-bold text-[#C75C73] dark:text-[#FFB3C6] animate-pulse">
                      Lepas disini ↓
                    </span>
                  )}
                </div>

                {/* Tasks List in Column */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colTasks.map((task) => {
                    const completedSubtasks = task.subtasks?.filter((s: any) => s.isCompleted).length || 0;
                    const totalSubtasks = task.subtasks?.length || 0;
                    const isDragging = draggedTaskId === task.id;

                    return (
                      <div
                        key={task.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={(e) => handleTouchStart(e, task)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchEnd}
                        className={cn(
                          'bg-white dark:bg-[#2D2528] rounded-2xl p-3.5 border border-[#FFCED8] dark:border-[#4D383E] shadow-sm hover:shadow-md transition-all space-y-2.5 group cursor-grab active:cursor-grabbing select-none relative',
                          isDragging && 'opacity-30 scale-[0.98] border-dashed border-[#C75C73] dark:border-[#FFB3C6]'
                        )}
                      >
                        {/* Tags & Drag Grip */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF0F3] dark:bg-[#38242A] text-[#863043] dark:text-[#FFCED8] border border-[#FFCED8] dark:border-[#4D383E]">
                            {task.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                task.priority === 'Critical'
                                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200'
                                  : task.priority === 'High'
                                  ? 'bg-[#FFE8C4] dark:bg-[#4A3528] text-[#863043] dark:text-[#FFE8C4]'
                                  : 'bg-[#FFF4DE] dark:bg-[#382C24] text-[#6B5A5D] dark:text-[#D4B8BE]'
                              }`}
                            >
                              {task.priority}
                            </span>
                            {/* Grip Icon indicating drag capability */}
                            <div
                              title="Geser kartu dengan kursor atau jari"
                              className="text-[#A84157]/40 dark:text-[#FFB3C6]/40 group-hover:text-[#863043] dark:group-hover:text-[#FFCED8] transition-colors p-0.5"
                            >
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* Title & Desc */}
                        <h4 className="text-xs font-bold text-[#3D3133] dark:text-[#FFF0F3] leading-snug">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] text-[#6B5A5D] dark:text-[#D4B8BE] line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Subtasks Progress */}
                        {totalSubtasks > 0 && (
                          <div className="text-[10px] text-[#A84157] dark:text-[#FFB3C6] flex items-center justify-between pt-1 border-t border-[#FFDDDD] dark:border-[#4D383E]">
                            <span>Checklist Subtask</span>
                            <span className="font-bold text-[#863043] dark:text-[#FFCED8]">
                              {completedSubtasks}/{totalSubtasks}
                            </span>
                          </div>
                        )}

                        {/* Deadline & Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#FFDDDD] dark:border-[#4D383E] text-[11px]">
                          <div className="flex items-center gap-1 text-[#A84157] dark:text-[#FFB3C6]">
                            <Clock className="w-3 h-3" />
                            <span>{formatDateIndo(task.deadline, 'dd MMM')}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Dropdown status selection remains fully accessible */}
                            <select
                              value={task.status}
                              draggable={false}
                              onMouseDown={(e) => e.stopPropagation()}
                              onTouchStart={(e) => e.stopPropagation()}
                              onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                              className="text-[10px] font-bold bg-[#FFF9FA] dark:bg-[#241E20] border border-[#FFCED8] dark:border-[#4D383E] rounded-lg px-1.5 py-0.5 text-[#863043] dark:text-[#FFCED8] focus:outline-none cursor-pointer"
                            >
                              {COLUMNS.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              draggable={false}
                              onMouseDown={(e) => e.stopPropagation()}
                              onTouchStart={(e) => e.stopPropagation()}
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-[#A84157]/60 dark:text-[#FFB3C6]/60 hover:text-rose-600 dark:hover:text-rose-400 p-0.5"
                              title="Hapus task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty Column Drop Target */}
                  {colTasks.length === 0 && (
                    <div
                      className={cn(
                        'border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all min-h-[140px]',
                        isColumnHovered
                          ? 'border-[#C75C73] dark:border-[#FFB3C6] bg-[#FFF0F3]/60 dark:bg-[#38242A]/60 text-[#863043] dark:text-[#FFCED8]'
                          : 'border-[#FFCED8]/60 dark:border-[#4D383E]/60 text-slate-400 dark:text-[#8D767C]'
                      )}
                    >
                      <ArrowDownToLine className="w-5 h-5 mb-1.5 opacity-60" />
                      <span className="text-xs font-semibold">Tarik task ke sini</span>
                      <span className="text-[10px] opacity-75 mt-0.5">atau gunakan pilihan dropdown</span>
                    </div>
                  )}

                  {/* Drop Placeholder indicator when column has tasks and is hovered */}
                  {isColumnHovered && colTasks.length > 0 && (
                    <div className="border-2 border-dashed border-[#C75C73] dark:border-[#FFB3C6] bg-[#FFF0F3]/50 dark:bg-[#38242A]/50 rounded-2xl p-2.5 text-center text-xs font-bold text-[#863043] dark:text-[#FFCED8] animate-pulse">
                      Lepaskan task di sini
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-[#2D2528] rounded-3xl border border-[#FFCED8] dark:border-[#4D383E] shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9FA] dark:bg-[#1E1719] border-b border-[#FFDDDD] dark:border-[#4D383E] text-[#863043] dark:text-[#FFCED8] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-5">Status</th>
                <th className="p-3.5">Judul Pekerjaan</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5">Prioritas</th>
                <th className="p-3.5">Deadline</th>
                <th className="p-3.5">Subtask</th>
                <th className="p-3.5 pr-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFF0F3] dark:divide-[#3D2C31]">
              {filteredTasks.map((task) => {
                return (
                  <tr key={task.id} className="hover:bg-[#FFF9FA] dark:hover:bg-[#241E20] transition-colors">
                    <td className="p-3.5 pl-5">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                        className="text-xs font-bold bg-[#FFF9FA] dark:bg-[#241E20] border border-[#FFCED8] dark:border-[#4D383E] rounded-xl px-2 py-1 text-[#863043] dark:text-[#FFCED8] focus:outline-none"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#3D3133] dark:text-[#FFF0F3]">{task.title}</div>
                      {task.description && (
                        <div className="text-[11px] text-[#6B5A5D] dark:text-[#D4B8BE] line-clamp-1">
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-[#863043] dark:text-[#FFCED8] bg-[#FFF0F3] dark:bg-[#38242A] px-2.5 py-0.5 rounded-lg border border-[#FFCED8] dark:border-[#4D383E]">
                        {task.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-lg ${
                          task.priority === 'Critical'
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200'
                            : task.priority === 'High'
                            ? 'bg-[#FFE8C4] dark:bg-[#4A3528] text-[#863043] dark:text-[#FFE8C4]'
                            : 'bg-[#FFF4DE] dark:bg-[#382C24] text-[#6B5A5D] dark:text-[#D4B8BE]'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-[#FFF4DE] dark:bg-[#382C24] text-[#863043] dark:text-[#FFE8C4] border-[#FFE8C4] dark:border-[#4D383E]">
                        {formatDateIndo(task.deadline, 'dd MMM yyyy')}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#6B5A5D] dark:text-[#D4B8BE]">
                      {task.subtasks?.length
                        ? `${task.subtasks.filter((s: any) => s.isCompleted).length}/${
                            task.subtasks.length
                          }`
                        : '-'}
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-[#A84157]/60 dark:text-[#FFB3C6]/60 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating Touch Drag Badge for Mobile Finger Dragging */}
      {touchDragTask && touchPosition && (
        <div
          style={{
            left: `${touchPosition.x}px`,
            top: `${touchPosition.y}px`,
            transform: 'translate(-50%, -50%) rotate(2.5deg)',
          }}
          className="fixed pointer-events-none z-50 w-64 bg-white dark:bg-[#2D2528] rounded-2xl p-3 border-2 border-[#C75C73] dark:border-[#FFB3C6] shadow-2xl opacity-95 scale-105"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF0F3] dark:bg-[#38242A] text-[#863043] dark:text-[#FFCED8]">
              {touchDragTask.category}
            </span>
            <span className="text-[10px] font-bold text-[#C75C73] dark:text-[#FFB3C6]">
              {dragOverColumn ? `Pindahkan ke: ${dragOverColumn}` : 'Geser ke kolom'}
            </span>
          </div>
          <h5 className="text-xs font-bold text-[#3D3133] dark:text-[#FFF0F3] line-clamp-1">
            {touchDragTask.title}
          </h5>
        </div>
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4 overflow-hidden animate-fade-in">
          <div className="bg-white dark:bg-[#231B1E] rounded-[24px] sm:rounded-[28px] shadow-2xl shadow-[#C75C73]/25 border border-[#FFCED8] dark:border-[#4A3238] w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-modal-pop">
            {/* 1. FIXED HEADER */}
            <div className="shrink-0 px-6 py-4 bg-gradient-to-r from-[#FFF4DE] via-[#FFF0F3] to-[#FFCED8]/70 dark:from-[#35252A] dark:via-[#3E2930] dark:to-[#4A2E36] border-b border-[#FFCED8] dark:border-[#4A3238] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2D2226] text-[#C75C73] dark:text-[#FFB3C2] flex items-center justify-center shadow-sm border border-[#FFCED8]/60 dark:border-[#52373F]">
                  <CheckSquare className="w-5 h-5 text-[#C75C73]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#3D3133] dark:text-[#FFF0F3] leading-tight">
                    Tambah Pekerjaan Baru
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#863043]/80 dark:text-[#FFCED8]/80 font-medium mt-0.5">
                    Rencanakan tugas skripsi & tracking ke Kanban Board
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#863043]/70 hover:text-[#863043] dark:text-[#FFCED8]/70 dark:hover:text-[#FFF0F3] hover:bg-white/80 dark:hover:bg-[#2D2226] transition-all hover:rotate-90 duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. SCROLLABLE FORM BODY */}
            <form onSubmit={handleCreateTask} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#3D3133] dark:text-[#EAE0E3]">
                      Judul Pekerjaan / Task
                    </label>
                    <span className="text-[10px] text-[#C75C73] font-semibold bg-[#FFCED8]/40 dark:bg-[#4D2633] px-2 py-0.5 rounded-full">
                      Wajib
                    </span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Misal: Perbaiki Bab 3 metodologi n-gram & TF-IDF"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:ring-4 focus:ring-[#C75C73]/15 focus:border-[#C75C73] focus:outline-none placeholder-[#A84157]/45 transition-all text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                    Deskripsi & Detail Instruksi
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail catatan atau referensi terkait pekerjaan ini..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:ring-4 focus:ring-[#C75C73]/15 focus:border-[#C75C73] focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Kategori Bidang
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:ring-4 focus:ring-[#C75C73]/15 focus:border-[#C75C73] focus:outline-none transition-all cursor-pointer font-medium"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Tingkat Prioritas
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:ring-4 focus:ring-[#C75C73]/15 focus:border-[#C75C73] focus:outline-none transition-all cursor-pointer font-medium"
                    >
                      {PRIORITIES.filter((p) => p !== 'All').map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Status Kolom Awal
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:ring-4 focus:ring-[#C75C73]/15 focus:border-[#C75C73] focus:outline-none transition-all cursor-pointer font-medium"
                    >
                      {COLUMNS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                      Target Tenggat (Deadline)
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:ring-4 focus:ring-[#C75C73]/15 focus:border-[#C75C73] focus:outline-none transition-all cursor-pointer font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#3D3133] dark:text-[#EAE0E3] mb-1.5">
                    Subtask / Checklist Rincian <span className="text-[10px] text-slate-400 font-normal">(1 baris per langkah)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={subtasksInput}
                    onChange={(e) => setSubtasksInput(e.target.value)}
                    placeholder="Rancang matriks revisi&#10;Kompensasi stopword n-gram&#10;Update Bab III naskah"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-[#4A3238] bg-slate-50/70 dark:bg-[#1A1416] text-[#241E20] dark:text-[#FFF0F3] rounded-xl focus:bg-white dark:focus:bg-[#20181A] focus:ring-4 focus:ring-[#C75C73]/15 focus:border-[#C75C73] focus:outline-none placeholder-[#A84157]/45 transition-all text-xs"
                  />
                </div>
              </div>

              {/* 3. FIXED FOOTER WITH ANIMATED BUTTONS */}
              <div className="shrink-0 px-6 py-3.5 bg-slate-50/90 dark:bg-[#1E1719]/95 border-t border-[#FFCED8]/60 dark:border-[#4A3238] flex items-center justify-end gap-3 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary-animated px-4 py-2.5 text-xs font-bold text-[#6B5A5D] dark:text-[#D4B8BE] hover:bg-[#FFF0F3] dark:hover:bg-[#2D2226] rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="btn-primary-animated px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#C75C73] via-[#D8687F] to-[#863043] rounded-xl shadow-md shadow-[#C75C73]/30 flex items-center gap-2 group cursor-pointer disabled:opacity-50"
                >
                  <CheckSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Task Baru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
