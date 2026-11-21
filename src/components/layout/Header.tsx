'use client';

import React, { useState } from 'react';
import { Search, Plus, Bell, Clock, X, AlertTriangle, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { QuickCaptureModal } from '../modals/QuickCaptureModal';
import { GlobalSearchModal } from '../modals/GlobalSearchModal';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onToggleMobile?: () => void;
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    notificationType: string;
    priority: string;
    isRead: boolean;
    createdAt: Date;
    linkUrl?: string | null;
  }>;
}

export function Header({
  title = 'Dashboard Utama',
  subtitle = 'Sistem Manajemen Pribadi Proyek Akhir D4 TRPL',
  isSidebarCollapsed = false,
  onToggleSidebar,
  onToggleMobile,
  notifications = [],
}: HeaderProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <header className="h-16 bg-[#FFF9FA]/90 dark:bg-[#1E1719]/90 backdrop-blur-md border-b border-[#FFDDDD] dark:border-[#4D383E] px-3.5 sm:px-6 sticky top-0 z-30 flex items-center justify-between shadow-[0_2px_12px_rgba(255,206,216,0.12)] transition-colors duration-200">
        {/* Left: Mobile & Desktop Sidebar Toggle + Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Button (< lg) */}
          {onToggleMobile && (
            <button
              onClick={onToggleMobile}
              className="lg:hidden p-2 rounded-xl text-[#863043] dark:text-[#FFCED8] bg-[#FFF5F7] dark:bg-[#2D2528] hover:bg-[#FFDDDD] dark:hover:bg-[#4D383E] border border-[#FFCED8] dark:border-[#4D383E] transition-colors shrink-0"
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {/* Desktop Collapse Button (lg+) */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              title={isSidebarCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
              className="hidden lg:flex p-2 rounded-xl text-[#A84157] dark:text-[#FFCED8] hover:text-[#863043] hover:bg-[#FFDDDD]/60 dark:hover:bg-[#4D383E] border border-[#FFCED8] dark:border-[#4D383E] transition-colors shrink-0"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div className="min-w-0 truncate">
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-[#3D3133] dark:text-[#FFF0F3] leading-tight truncate">
              {title}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-[#A84157] dark:text-[#FFB3C6] font-medium hidden sm:block truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-[#6B5A5D] dark:text-[#D4B8BE] bg-[#FFF4DE]/70 dark:bg-[#382C24]/80 hover:bg-[#FFF4DE] dark:hover:bg-[#483424] border border-[#FFE8C4] dark:border-[#4D383E] rounded-xl transition-colors max-w-[120px] sm:max-w-none sm:w-48 md:w-60"
          >
            <Search className="w-3.5 h-3.5 text-[#A84157] dark:text-[#FFB3C6] shrink-0" />
            <span className="truncate text-[11px] sm:text-xs">Cari...</span>
            <kbd className="hidden md:inline-block ml-auto text-[10px] bg-white dark:bg-[#2D2528] border border-[#FFCED8] dark:border-[#4D383E] px-1.5 py-0.5 rounded text-[#A84157] dark:text-[#FFB3C6]">
              Ctrl+K
            </kbd>
          </button>

          {/* Quick Capture Button (Soft Rose with Warm Cream Accent) */}
          <button
            onClick={() => setIsQuickCaptureOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#863043] dark:text-[#FFF0F3] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] dark:from-[#4D2633] dark:via-[#542D3B] dark:to-[#543428] hover:opacity-90 border border-[#F5A8B8] dark:border-[#7A3C4E] rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 text-[#863043] dark:text-[#FFCED8]" />
            <span>Quick Capture</span>
          </button>

          {/* Theme Mode Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            title={resolvedTheme === 'dark' ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
            className="p-2 rounded-xl text-[#A84157] dark:text-[#FFE8C4] hover:text-[#863043] dark:hover:text-white bg-[#FFF5F7] dark:bg-[#2D2528] hover:bg-[#FFDDDD]/60 dark:hover:bg-[#4D383E] border border-[#FFCED8] dark:border-[#4D383E] transition-all transform active:scale-95 shrink-0"
            aria-label={resolvedTheme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FFE8C4] hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-[#863043] hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-[#A84157] dark:text-[#FFCED8] hover:text-[#863043] dark:hover:text-[#FFF0F3] hover:bg-[#FFDDDD]/60 dark:hover:bg-[#4D383E] border border-transparent hover:border-[#FFCED8] dark:hover:border-[#4D383E] rounded-xl transition-colors"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#2D2528] animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 md:w-96 bg-white dark:bg-[#2D2528] rounded-3xl shadow-2xl border border-[#FFCED8] dark:border-[#4D383E] py-3 z-50 animate-fade-in">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-[#FFDDDD] dark:border-[#4D383E]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#3D3133] dark:text-[#FFF0F3]">Notifikasi & Pengingat</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-[#FFDDDD] dark:bg-[#4D2D37] text-[#863043] dark:text-[#FFCED8] px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="text-slate-400 dark:text-[#D4B8BE] hover:text-slate-600 dark:hover:text-white text-xs p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#FFF0F3] dark:divide-[#3D2C31]">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#A84157] dark:text-[#FFB3C6]">Tidak ada notifikasi aktif</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-3.5 hover:bg-[#FFF9FA] dark:hover:bg-[#241E20] transition-colors">
                        <div className="flex items-start gap-2.5">
                          {n.priority === 'Critical' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-[#C75C73] dark:text-[#FFB3C6] mt-0.5 shrink-0" />
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-[#3D3133] dark:text-[#FFF0F3] leading-snug">{n.title}</h4>
                            <p className="text-[11px] text-[#6B5A5D] dark:text-[#D4B8BE] mt-0.5 leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <QuickCaptureModal isOpen={isQuickCaptureOpen} onClose={() => setIsQuickCaptureOpen(false)} />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
