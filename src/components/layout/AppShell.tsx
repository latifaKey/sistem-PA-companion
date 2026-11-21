'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { RouteProgressBar } from './RouteProgressBar';
import { QuickCaptureModal } from '../modals/QuickCaptureModal';

interface AppShellProps {
  unresolvedRevisionsCount: number;
  pendingTasksCount: number;
  notifications: any[];
  projectTitle: string;
  children: React.ReactNode;
}

export function AppShell({
  unresolvedRevisionsCount,
  pendingTasksCount,
  notifications,
  projectTitle,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);

  // Sync desktop sidebar state with localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pa_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Automatically close mobile drawer when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleToggleDesktop = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('pa_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  const handleToggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#FAF5F5] dark:bg-[#241E20] text-[#2D2426] dark:text-[#FFF0F3] antialiased font-sans transition-colors duration-200">
      {/* 1. Global Route Transition Top Progress Bar */}
      <RouteProgressBar />

      {/* 2. Responsive Sidebar (Desktop Collapsible & Mobile Off-canvas Drawer) */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={handleToggleDesktop}
        isMobileOpen={isMobileOpen}
        onCloseMobile={handleCloseMobile}
        unresolvedRevisionsCount={unresolvedRevisionsCount}
        pendingTasksCount={pendingTasksCount}
      />

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Header
          title={projectTitle || 'Keyfa PA Companion'}
          subtitle="Sistem Manajemen Proyek Akhir D4 TRPL PNP"
          notifications={notifications}
          isSidebarCollapsed={isCollapsed}
          onToggleSidebar={handleToggleDesktop}
          onToggleMobile={handleToggleMobile}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto pb-24 lg:pb-8">
          <div className="page-transition">
            {children}
          </div>
        </main>
      </div>

      {/* 4. Native-Feeling Mobile Bottom Navigation Bar (< lg) */}
      <BottomNav
        onOpenMobileMenu={handleToggleMobile}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        unresolvedRevisionsCount={unresolvedRevisionsCount}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Quick Capture Modal from Mobile Bottom Bar */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
      />
    </div>
  );
}
