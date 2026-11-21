import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

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

    if (!project) return NextResponse.json({ milestones: [] });
    return NextResponse.json({ milestones: project.milestones });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json({ error: 'Failed to fetch milestones' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
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
    console.error('Error updating milestone:', error);
    return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 });
  }
}
