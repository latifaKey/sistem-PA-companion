'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Calendar,
  Menu,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onOpenMobileMenu: () => void;
  onOpenQuickCapture: () => void;
  unresolvedRevisionsCount?: number;
  pendingTasksCount?: number;
}

export function BottomNav({
  onOpenMobileMenu,
  onOpenQuickCapture,
  unresolvedRevisionsCount = 0,
  pendingTasksCount = 0,
}: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Tugas', href: '/tasks', icon: CheckSquare, badge: pendingTasksCount },
    { name: 'Revisi', href: '/proposal', icon: FileText, badge: unresolvedRevisionsCount },
    { name: 'Kalender', href: '/kalender', icon: Calendar },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF9FA]/95 dark:bg-[#1E1719]/95 backdrop-blur-md border-t border-[#FFDDDD] dark:border-[#4D383E] shadow-[0_-4px_20px_rgba(255,206,216,0.25)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] px-3 py-1.5 flex items-center justify-around safe-area-bottom transition-colors duration-200">
      {/* First 2 items */}
      {navItems.slice(0, 2).map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            prefetch={true}
            className={cn(
              'flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all relative min-w-[56px]',
              isActive ? 'text-[#863043] dark:text-[#FFCED8] font-bold' : 'text-[#6B5A5D] dark:text-[#D4B8BE] hover:text-[#863043] dark:hover:text-[#FFF0F3]'
            )}
          >
            <div className="relative">
              <Icon className={cn('w-5 h-5', isActive ? 'text-[#C75C73] dark:text-[#FFB3C6]' : 'text-[#A84157]/80 dark:text-[#FFB3C6]/80')} />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#FFE8C4] dark:bg-[#4A3528] text-[#863043] dark:text-[#FFE8C4] text-[9px] font-extrabold rounded-full flex items-center justify-center border border-[#FAD89E] dark:border-[#5E4232]">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">{item.name}</span>
          </Link>
        );
      })}

      {/* Center Action: Quick Capture Button */}
      <button
        type="button"
        onClick={onOpenQuickCapture}
        aria-label="Quick Capture"
        className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] dark:from-[#4D2633] dark:via-[#542D3B] dark:to-[#543428] text-[#863043] dark:text-[#FFCED8] flex items-center justify-center shadow-md border-2 border-white dark:border-[#2D2528] hover:scale-105 active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6 text-[#863043] dark:text-[#FFCED8]" />
      </button>

      {/* Next item: Revisi */}
      {navItems.slice(2, 3).map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            prefetch={true}
            className={cn(
              'flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all relative min-w-[56px]',
              isActive ? 'text-[#863043] dark:text-[#FFCED8] font-bold' : 'text-[#6B5A5D] dark:text-[#D4B8BE] hover:text-[#863043] dark:hover:text-[#FFF0F3]'
            )}
          >
            <div className="relative">
              <Icon className={cn('w-5 h-5', isActive ? 'text-[#C75C73] dark:text-[#FFB3C6]' : 'text-[#A84157]/80 dark:text-[#FFB3C6]/80')} />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">{item.name}</span>
          </Link>
        );
      })}

      {/* Menu Drawer Toggle */}
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center p-1.5 rounded-2xl text-[#6B5A5D] dark:text-[#D4B8BE] hover:text-[#863043] dark:hover:text-[#FFF0F3] transition-all min-w-[56px]"
      >
        <Menu className="w-5 h-5 text-[#A84157]/80 dark:text-[#FFB3C6]/80" />
        <span className="text-[10px] mt-0.5">Semua</span>
      </button>
    </div>
  );
}
