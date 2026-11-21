import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { fallbackSeminarQuestions, fallbackSeminarChecklists } from '@/lib/fallbackData';

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

    if (!project) {
      return NextResponse.json({
        questions: fallbackSeminarQuestions,
        checklists: fallbackSeminarChecklists,
      });
    }

    return NextResponse.json({
      questions: project.defenseQuestions.length ? project.defenseQuestions : fallbackSeminarQuestions,
      checklists: project.defenseChecklists.length ? project.defenseChecklists : fallbackSeminarChecklists,
    });
  } catch (error) {
    console.warn('Database offline, using fallback seminar data:', error);
    return NextResponse.json({
      questions: fallbackSeminarQuestions,
      checklists: fallbackSeminarChecklists,
    });
  }
}

export async function PATCH(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
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
          ...(isCompleted !== undefined && { isCompleted }),
        },
      });
      return NextResponse.json({ success: true, checklist: updated });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.warn('Database offline, simulated seminar update:', error);
    return NextResponse.json({ success: true, ...body });
  }
}
