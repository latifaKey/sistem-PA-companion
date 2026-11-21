'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Milestone as MilestoneIcon,
  CheckSquare,
  FileText,
  Users2,
  Database,
  BookOpen,
  FlaskConical,
  BookMarked,
  FolderArchive,
  GraduationCap,
  Settings,
  AlertCircle,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '../theme/ThemeProvider';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  unresolvedRevisionsCount?: number;
  pendingTasksCount?: number;
}

// 4 Logical Groups
const navGroups = [
  {
    title: 'PERENCANAAN & TUGAS',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Kalender & Pengingat', href: '/kalender', icon: Calendar },
      { name: 'Timeline Proyek', href: '/timeline', icon: MilestoneIcon },
      { name: 'Task Management', href: '/tasks', icon: CheckSquare, badgeKey: 'tasks' },
    ],
  },
  {
    title: 'BIMBINGAN & NASKAH',
    items: [
      { name: 'Proposal & Revisi', href: '/proposal', icon: FileText, badgeKey: 'revisions' },
      { name: 'Konsultasi Dosen', href: '/konsultasi', icon: Users2 },
      { name: 'Progress Logbook', href: '/logbook', icon: BookMarked },
      { name: 'Document Center', href: '/documents', icon: FolderArchive },
    ],
  },
  {
    title: 'DATA & EKSPERIMEN',
    items: [
      { name: 'Dataset Management', href: '/dataset', icon: Database },
      { name: 'Literature & Mendeley', href: '/literature', icon: BookOpen },
      { name: 'Research Experiments', href: '/experiments', icon: FlaskConical },
    ],
  },
  {
    title: 'KELULUSAN & PENGATURAN',
    items: [
      { name: 'Seminar & Sidang', href: '/seminar', icon: GraduationCap },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar({
  isCollapsed = false,
  onToggle,
  isMobileOpen = false,
  onCloseMobile,
  unresolvedRevisionsCount = 4,
  pendingTasksCount = 5,
}: SidebarProps) {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();

  // Helper render navigation items
  const renderNavList = (isCompact: boolean, isMobileView: boolean = false) => (
    <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
      {navGroups.map((group) => (
        <div key={group.title} className="space-y-1">
          {/* Category Header */}
          {!isCompact ? (
            <div className="px-3 pt-1 pb-1 text-[10px] font-extrabold tracking-wider text-[#A84157]/90 dark:text-[#FFCED8]/90 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFCED8] dark:bg-[#FFB3C6]" />
              {group.title}
            </div>
          ) : (
            <div className="h-px bg-[#FFDDDD]/60 dark:bg-[#4D383E]/60 mx-2 my-2" />
          )}

          {/* Nav Items */}
          {group.items.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                onClick={isMobileView ? onCloseMobile : undefined}
                title={isCompact ? item.name : undefined}
                className={cn(
                  'flex items-center rounded-xl text-xs font-semibold transition-all group relative',
                  isCompact ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5',
                  isActive
                    ? 'bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFF4DE] dark:from-[#4D2633] dark:via-[#542D3B] dark:to-[#543428] text-[#863043] dark:text-[#FFF0F3] shadow-sm font-bold border border-[#F5A8B8] dark:border-[#7A3C4E]'
                    : 'text-[#544447] dark:text-[#D4B8BE] hover:text-[#863043] dark:hover:text-[#FFF0F3] hover:bg-[#FFF0F3] dark:hover:bg-[#38242A]'
                )}
              >
                <div className={cn('flex items-center', isCompact ? 'justify-center' : 'gap-3')}>
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-transform group-hover:scale-110 shrink-0',
                      isActive ? 'text-[#863043] dark:text-[#FFCED8]' : 'text-[#A84157]/80 dark:text-[#FFB3C6]/80 group-hover:text-[#863043] dark:group-hover:text-[#FFF0F3]'
                    )}
                  />
                  {!isCompact && <span>{item.name}</span>}
                </div>

                {/* Badges when expanded */}
                {!isCompact && (
                  <>
                    {item.badgeKey === 'revisions' && unresolvedRevisionsCount > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {unresolvedRevisionsCount}
                      </span>
                    )}
                    {item.badgeKey === 'tasks' && pendingTasksCount > 0 && !isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE8C4] dark:bg-[#4A3528] text-[#863043] dark:text-[#FFE8C4] border border-[#FAD89E] dark:border-[#5E4232]">
                        {pendingTasksCount}
                      </span>
                    )}
                  </>
                )}

                {/* Dot indicator when collapsed */}
                {isCompact && item.badgeKey === 'revisions' && unresolvedRevisionsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#2D2528]" />
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Visible on lg+) */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen sticky top-0 border-r border-[#FFDDDD] dark:border-[#4D383E] bg-[#FFF9FA] dark:bg-[#1E1719] text-[#3D3133] dark:text-[#FFF0F3] shadow-[4px_0_24px_rgba(255,206,216,0.18)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.35)] transition-all duration-300 z-30 select-none shrink-0',
          isCollapsed ? 'w-20' : 'w-72'
        )}
      >
        {/* Brand Header: Button Interaktif Logo Langsung (Tinggi h-16 ramping sejajar dengan header utama) */}
        <button
          type="button"
          onClick={onToggle}
          title={isCollapsed ? 'Klik logo untuk membuka tabbar' : 'Klik logo untuk menutup tabbar'}
          className="w-full h-16 px-3 border-b border-[#FFDDDD]/80 dark:border-[#4D383E]/80 flex items-center justify-center cursor-pointer hover:bg-[#FFF0F3] dark:hover:bg-[#281F22] transition-all bg-gradient-to-r from-[#FFF5F7] via-[#FFF9FA] to-[#FFF4DE]/30 dark:from-[#251D20] dark:via-[#1E1719] dark:to-[#2A1F24] focus:outline-none group select-none shrink-0"
        >
          {isCollapsed ? (
            /* Saat Tertutup: Logo Gambar Badge Emblem Kotak Toga & Buku */
            <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-sm border border-[#FFCED8] dark:border-[#4D383E] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/logo-collapsed.png"
                alt="Keyfa Emblem"
                width={44}
                height={44}
                style={{ maxWidth: '44px', maxHeight: '44px', objectFit: 'contain' }}
                draggable={false}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          ) : (
            /* Saat Terbuka: Logo Mengisi Ruang Header yang Ramping & Pas */
            <div className="w-full h-full flex items-center justify-center px-1 py-1.5 max-h-16 overflow-hidden">
              <img
                src="/logo-full.png"
                alt="Keyfa PA Companion"
                width={220}
                height={48}
                style={{ maxWidth: '100%', maxHeight: '48px', objectFit: 'contain' }}
                draggable={false}
                className="w-full h-full object-contain dark:bg-white/90 dark:rounded-xl dark:px-2 dark:py-1 group-hover:scale-[1.02] transition-transform pointer-events-none"
              />
            </div>
          )}
        </button>

        {/* Navigation List Desktop */}
        {renderNavList(isCollapsed, false)}

        {/* Theme Switcher Quick Toggle in Sidebar */}
        <div className="px-3 pb-2 pt-1">
          <button
            type="button"
            onClick={toggleTheme}
            title={resolvedTheme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            className={cn(
              'w-full flex items-center rounded-xl p-2 text-xs font-semibold border transition-all',
              resolvedTheme === 'dark'
                ? 'bg-[#2D2528] text-[#FFE8C4] border-[#4D383E] hover:bg-[#362B2F]'
                : 'bg-white text-[#863043] border-[#FFCED8] hover:bg-[#FFF0F3]',
              isCollapsed ? 'justify-center' : 'justify-between px-3'
            )}
          >
            <div className="flex items-center gap-2.5">
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FFE8C4]" />
              ) : (
                <Moon className="w-4 h-4 text-[#863043]" />
              )}
              {!isCollapsed && (
                <span className="text-xs font-semibold">
                  {resolvedTheme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FFDDDD] dark:bg-[#4D2D37] text-[#863043] dark:text-[#FFCED8]">
                {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
              </span>
            )}
          </button>
        </div>

        {/* Student Profile Footer Desktop */}
        <div className="p-3 border-t border-[#FFDDDD]/80 dark:border-[#4D383E]/80 bg-[#FFF5F7] dark:bg-[#251D20]">
          <div
            className={cn(
              'flex items-center rounded-xl bg-white dark:bg-[#2D2528] border border-[#FFCED8] dark:border-[#4D383E] shadow-sm p-2 transition-all',
              isCollapsed ? 'justify-center' : 'gap-3'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFCED8] to-[#FFE8C4] dark:from-[#4D2633] dark:to-[#543428] text-[#863043] dark:text-[#FFCED8] font-bold flex items-center justify-center text-xs shrink-0 border border-[#F5A8B8] dark:border-[#7A3C4E]">
              LK
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#3D3133] dark:text-[#FFF0F3] truncate">Latifa Keysha</h4>
                <p className="text-[10px] text-[#A84157] dark:text-[#FFB3C6] font-medium truncate">D4 TRPL — PNP</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER OVERLAY (Visible on < lg when isMobileOpen) */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300',
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      {/* 3. MOBILE SLIDE-OVER DRAWER (Visible on < lg) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#FFF9FA] dark:bg-[#1E1719] text-[#3D3133] dark:text-[#FFF0F3] shadow-2xl border-r border-[#FFDDDD] dark:border-[#4D383E] flex flex-col h-full transform transition-transform duration-300 ease-out lg:hidden select-none',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Header with Logo & Theme Toggle + Close Button (Tinggi h-16 ramping) */}
        <div className="h-16 px-4 border-b border-[#FFDDDD]/80 dark:border-[#4D383E]/80 flex items-center justify-between bg-gradient-to-r from-[#FFF5F7] to-[#FFF4DE]/30 dark:from-[#251D20] dark:to-[#2A1F24] shrink-0">
          <div className="w-40 h-full flex items-center py-1.5 max-h-16 overflow-hidden">
            <img
              src="/logo-full.png"
              alt="Keyfa PA Companion"
              width={160}
              height={48}
              style={{ maxWidth: '100%', maxHeight: '48px', objectFit: 'contain' }}
              className="w-full h-full object-contain dark:bg-white/90 dark:rounded-xl dark:px-2 dark:py-1"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {/* Quick Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#863043] dark:text-[#FFE8C4] hover:bg-[#FFF0F3] dark:hover:bg-[#2D2528] border border-[#FFCED8] dark:border-[#4D383E] transition-colors"
              aria-label="Ganti Tema"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FFE8C4]" />
              ) : (
                <Moon className="w-4 h-4 text-[#863043]" />
              )}
            </button>
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-xl text-[#863043] dark:text-[#FFF0F3] hover:bg-[#FFF0F3] dark:hover:bg-[#2D2528] border border-[#FFCED8] dark:border-[#4D383E] transition-colors"
              aria-label="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nav List Mobile */}
        {renderNavList(false, true)}

        {/* Profile Footer Mobile */}
        <div className="p-3 border-t border-[#FFDDDD]/80 dark:border-[#4D383E]/80 bg-[#FFF5F7] dark:bg-[#251D20] safe-area-bottom">
          <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-[#2D2528] border border-[#FFCED8] dark:border-[#4D383E] shadow-sm p-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFCED8] to-[#FFE8C4] dark:from-[#4D2633] dark:to-[#543428] text-[#863043] dark:text-[#FFCED8] font-bold flex items-center justify-center text-xs shrink-0 border border-[#F5A8B8] dark:border-[#7A3C4E]">
              LK
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#3D3133] dark:text-[#FFF0F3] truncate">Latifa Keysha</h4>
              <p className="text-[10px] text-[#A84157] dark:text-[#FFB3C6] font-medium truncate">D4 TRPL — Politeknik Negeri Padang</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
