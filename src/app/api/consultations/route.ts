import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        supervisors: true,
        consultations: {
          include: { supervisor: true },
          orderBy: { consultationDate: 'desc' },
        },
        consultationQuestions: {
          include: { supervisor: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      supervisorId,
      consultationDate,
      mediaType,
      chapterDiscussed,
      questionsAsked,
      supervisorFeedback,
      decisionResult,
      nextActionTasks,
      followupDeadline,
    } = body;

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const consultation = await prisma.consultation.create({
      data: {
        projectId: project.id,
        supervisorId,
        consultationDate: consultationDate ? new Date(consultationDate) : new Date(),
        mediaType: mediaType || 'Offline / Tatap Muka',
        chapterDiscussed: chapterDiscussed || null,
        questionsAsked: questionsAsked || null,
        supervisorFeedback,
        decisionResult: decisionResult || null,
        nextActionTasks: nextActionTasks || null,
        followupDeadline: followupDeadline ? new Date(followupDeadline) : null,
        status: 'ACTION_REQUIRED',
      },
      include: { supervisor: true },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'CREATE',
      entityType: 'CONSULTATION',
      entityId: consultation.id,
      title: `Mencatat Bimbingan dengan ${consultation.supervisor.name}`,
      details: `Bab: ${consultation.chapterDiscussed || '-'}, Keputusan: ${consultation.decisionResult || '-'}`,
    });

    return NextResponse.json({ success: true, consultation });
  } catch (error) {
    console.error('Error creating consultation:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
