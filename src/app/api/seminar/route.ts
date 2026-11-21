import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        defenseQuestions: { orderBy: { order: 'asc' } },
        defenseChecklists: true,
      },
    });

    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({
      questions: project.defenseQuestions,
      checklists: project.defenseChecklists,
    });
  } catch (error) {
    console.error('Error fetching seminar data:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionId, studentAnswer, readinessStatus, checklistId, isCompleted } = body;

    if (questionId) {
      const updated = await prisma.defenseQuestion.update({
        where: { id: questionId },
        data: {
          ...(studentAnswer !== undefined && { studentAnswer }),
          ...(readinessStatus && { readinessStatus }),
        },
      });
      return NextResponse.json({ success: true, question: updated });
    }

    if (checklistId) {
      const updated = await prisma.defenseChecklist.update({
        where: { id: checklistId },
        data: {
          isCompleted,
          verifiedAt: isCompleted ? new Date() : null,
        },
      });
      return NextResponse.json({ success: true, checklist: updated });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('Error updating seminar data:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
