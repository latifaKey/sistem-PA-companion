import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fallbackTasks, fallbackReviewerComments, fallbackReferences } from '@/lib/fallbackData';

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
      const q = query.toLowerCase();
      const results: any[] = [];
      fallbackTasks
        .filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
        .forEach((t) => results.push({ type: 'Task', id: t.id, title: t.title, subtitle: t.category, url: '/tasks' }));
      fallbackReviewerComments
        .filter((rc) => rc.originalComment.toLowerCase().includes(q) || rc.actionPlan.toLowerCase().includes(q))
        .forEach((rc) => results.push({ type: 'Revisi', id: rc.id, title: `${rc.reviewer?.name}: ${rc.evaluationAspect}`, subtitle: rc.originalComment.slice(0, 80), url: '/proposal' }));
      return NextResponse.json({ results });
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
            { result: { contains: query } },
          ],
        },
        take: 5,
      }),
    ]);

    const results = [
      ...tasks.map((t) => ({
        type: 'Task',
        id: t.id,
        title: t.title,
        subtitle: `${t.category} • ${t.status}`,
        url: '/tasks',
      })),
      ...comments.map((c) => ({
        type: 'Revisi',
        id: c.id,
        title: `${c.reviewer.name} - ${c.chapterRelated || c.evaluationAspect}`,
        subtitle: c.originalComment.slice(0, 80) + '...',
        url: '/proposal',
      })),
      ...references.map((r) => ({
        type: 'Literatur',
        id: r.id,
        title: r.title,
        subtitle: `${r.authors} (${r.year})`,
        url: '/literature',
      })),
      ...logbooks.map((l) => ({
        type: 'Logbook',
        id: l.id,
        title: l.activity,
        subtitle: new Date(l.logDate).toLocaleDateString('id-ID'),
        url: '/logbook',
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.warn('Database offline, using fallback search results:', error);
    return NextResponse.json({ results: [] });
  }
}
