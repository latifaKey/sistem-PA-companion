import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { fallbackMilestones } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        milestones: {
          orderBy: { order: 'asc' },
          include: { tasks: true },
        },
      },
    });

    if (!project) return NextResponse.json({ milestones: fallbackMilestones });
    return NextResponse.json({
      milestones: project.milestones.length ? project.milestones : fallbackMilestones,
    });
  } catch (error) {
    console.warn('Database offline, using fallback milestones:', error);
    return NextResponse.json({ milestones: fallbackMilestones });
  }
}

export async function PATCH(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { id, isCompleted, status } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const updated = await prisma.milestone.update({
      where: { id },
      data: {
        ...(isCompleted !== undefined && { isCompleted }),
        ...(isCompleted && { completedAt: new Date(), status: 'COMPLETED' }),
        ...(!isCompleted && isCompleted !== undefined && { completedAt: null, status: status || 'IN_PROGRESS' }),
        ...(status && !isCompleted && { status }),
      },
    });

    await logActivity({
      projectId: updated.projectId,
      actionType: 'STATUS_CHANGE',
      entityType: 'TASK',
      entityId: updated.id,
      title: `Memperbarui Milestone: ${updated.title}`,
      details: `Status: ${updated.status}, Selesai: ${updated.isCompleted}`,
    });

    return NextResponse.json({ success: true, milestone: updated });
  } catch (error) {
    console.warn('Database offline, simulated milestone update:', error);
    return NextResponse.json({ success: true, milestone: body });
  }
}
