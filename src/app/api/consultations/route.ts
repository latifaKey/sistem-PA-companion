import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { fallbackProject } from '@/lib/fallbackData';

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

    if (!project) return NextResponse.json({ project: fallbackProject });

    return NextResponse.json({ project });
  } catch (error) {
    console.warn('Database offline, using fallback consultation data:', error);
    return NextResponse.json({ project: fallbackProject });
  }
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
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

    if (!supervisorId || !consultationDate || !questionsAsked) {
      return NextResponse.json(
        { error: 'Dosen Pembimbing, Tanggal, dan Pertanyaan/Topik wajib diisi' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        consultation: {
          id: 'cons-' + Date.now(),
          supervisorId,
          consultationDate: new Date(consultationDate),
          mediaType: mediaType || 'OFFLINE',
          chapterDiscussed: chapterDiscussed || null,
          questionsAsked,
          supervisorFeedback: supervisorFeedback || null,
          decisionResult: decisionResult || null,
          nextActionTasks: nextActionTasks || null,
          followupDeadline: followupDeadline ? new Date(followupDeadline) : null,
        },
      });
    }

    const consultation = await prisma.consultation.create({
      data: {
        projectId: project.id,
        supervisorId,
        consultationDate: new Date(consultationDate),
        mediaType: mediaType || 'OFFLINE',
        chapterDiscussed: chapterDiscussed || null,
        questionsAsked,
        supervisorFeedback: supervisorFeedback || null,
        decisionResult: decisionResult || null,
        nextActionTasks: nextActionTasks || null,
        followupDeadline: followupDeadline ? new Date(followupDeadline) : null,
      },
      include: { supervisor: true },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'CREATE',
      entityType: 'CONSULTATION',
      entityId: consultation.id,
      title: `Mencatat Bimbingan Baru dengan ${consultation.supervisor.name}`,
      details: `Bab: ${consultation.chapterDiscussed || '-'}`,
    });

    return NextResponse.json({ success: true, consultation });
  } catch (error) {
    console.warn('Database offline, simulated consultation save:', error);
    return NextResponse.json({
      success: true,
      consultation: {
        id: 'cons-' + Date.now(),
        supervisorId: body.supervisorId || 'sup-1',
        consultationDate: body.consultationDate ? new Date(body.consultationDate) : new Date(),
        mediaType: body.mediaType || 'OFFLINE',
        chapterDiscussed: body.chapterDiscussed || null,
        questionsAsked: body.questionsAsked || '',
        supervisorFeedback: body.supervisorFeedback || null,
        decisionResult: body.decisionResult || null,
        nextActionTasks: body.nextActionTasks || null,
        followupDeadline: body.followupDeadline ? new Date(body.followupDeadline) : null,
      },
    });
  }
}
