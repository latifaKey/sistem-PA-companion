import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Keyfa PA Companion — Personal Academic Management System',
  description: 'Sistem Manajemen Pribadi Proyek Akhir Mahasiswa D4 TRPL Politeknik Negeri Padang',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Resilient data fetching with fallbacks to guarantee zero server-side crashes
  let unresolvedRevisionsCount = 0;
  let pendingTasksCount = 0;
  let notifications: any[] = [];
  let projectTitle = 'Keyfa PA Companion';

  try {
    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        reviewerComments: {
          where: { status: { not: 'Selesai' } },
        },
        tasks: {
          where: { isCompleted: false },
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (project) {
      unresolvedRevisionsCount = project.reviewerComments.length || 0;
      pendingTasksCount = project.tasks.length || 0;
      notifications = project.notifications || [];
      projectTitle = project.shortTitle || project.title || 'Keyfa PA Companion';
    }
  } catch (err) {
    console.error('Database connection warning in RootLayout (using fallback):', err);
  }

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical pre-CSS reset to prevent initial image ballooning / FOUC */
              img {
                max-width: 100%;
                height: auto;
              }
              aside img, header img {
                max-height: 48px !important;
                width: auto !important;
                object-fit: contain !important;
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('pa_theme');
                  var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#FAF5F5] dark:bg-[#241E20] text-[#2D2426] dark:text-[#FFF0F3] antialiased font-sans transition-colors duration-200">
        <ThemeProvider>
          <AppShell
            unresolvedRevisionsCount={unresolvedRevisionsCount}
            pendingTasksCount={pendingTasksCount}
            notifications={notifications}
            projectTitle={projectTitle}
          >
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
