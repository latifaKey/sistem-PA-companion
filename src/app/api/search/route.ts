import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) {
      return NextResponse.json({ results: [] });
    }

    // Search across Tasks, Reviewer Comments, References, Proposals, Logbooks
    const [tasks, comments, references, logbooks] = await Promise.all([
      prisma.task.findMany({
        where: {
          projectId: project.id,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        take: 5,
      }),
      prisma.reviewerComment.findMany({
        where: {
          projectId: project.id,
          OR: [
            { originalComment: { contains: query } },
            { studentAnalysis: { contains: query } },
            { repairPlan: { contains: query } },
          ],
        },
        include: { reviewer: true },
        take: 5,
      }),
      prisma.researchReference.findMany({
        where: {
          projectId: project.id,
          OR: [
            { title: { contains: query } },
            { authors: { contains: query } },
            { method: { contains: query } },
          ],
        },
        take: 5,
      }),
      prisma.logbook.findMany({
        where: {
          projectId: project.id,
          OR: [
            { activity: { contains: query } },
            { workSteps: { contains: query } },
          ],
        },
        take: 5,
      }),
    ]);

    const results = [
      ...tasks.map((t) => ({
        type: 'TASK',
        title: t.title,
        subtitle: `Status: ${t.status} | Prioritas: ${t.priority}`,
        link: '/tasks',
      })),
      ...comments.map((c) => ({
        type: 'REVIEW',
        title: `${c.reviewer.name} (${c.evaluationAspect})`,
        subtitle: c.originalComment.slice(0, 100) + '...',
        link: '/proposal',
      })),
      ...references.map((r) => ({
        type: 'REFERENCE',
        title: r.title,
        subtitle: `${r.authors} (${r.year}) — ${r.method || 'Paper'}`,
        link: '/literature',
      })),
      ...logbooks.map((l) => ({
        type: 'LOGBOOK',
        title: l.activity,
        subtitle: `Catatan logbook ${l.durationMinutes} menit`,
        link: '/logbook',
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error during global search:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
