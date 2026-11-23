import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { fallbackProject, fallbackSupervisors, fallbackConsultations, fallbackConsultationQuestions } from '@/lib/fallbackData';

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

    return NextResponse.json({
      project: {
        ...project,
        supervisors: project.supervisors?.length ? project.supervisors : fallbackSupervisors,
        consultations: project.consultations?.length ? project.consultations : fallbackConsultations,
        consultationQuestions: project.consultationQuestions?.length ? project.consultationQuestions : fallbackConsultationQuestions,
      },
    });
  } catch (error) {
    console.warn('Database offline, using fallback consultation data:', error);
    return NextResponse.json({ project: fallbackProject });
  }
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { type } = body;

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    // 1. CREATE SUPERVISOR
    if (type === 'supervisor') {
      const { name, roleTitle, position, phone, email, consultationPreferences } = body;
      if (!name) {
        return NextResponse.json({ error: 'Nama Dosen Pembimbing wajib diisi' }, { status: 400 });
      }

      if (!project) {
        return NextResponse.json({
          success: true,
          supervisor: {
            id: 'sup-' + Date.now(),
            name,
            roleTitle: roleTitle || 'Pembimbing Pendamping',
            position: position || 'Dosen Jurusan TI PNP',
            phone: phone || null,
            email: email || null,
            consultationPreferences: consultationPreferences || 'Fleksibel via tatap muka atau online.',
          },
        });
      }

      const supervisor = await prisma.supervisor.create({
        data: {
          projectId: project.id,
          name,
          roleTitle: roleTitle || 'Pembimbing Pendamping',
          position: position || null,
          phone: phone || null,
          email: email || null,
          consultationPreferences: consultationPreferences || null,
        },
      });

      await logActivity({
        projectId: project.id,
        actionType: 'CREATE',
        entityType: 'CONSULTATION',
        entityId: supervisor.id,
        title: `Menambahkan Dosen Pembimbing: ${supervisor.name}`,
        details: `Peran: ${supervisor.roleTitle}`,
      });

      return NextResponse.json({ success: true, supervisor });
    }

    // 2. CREATE CONSULTATION QUESTION (BANK PERTANYAAN)
    if (type === 'question') {
      const { supervisorId, questionText, category } = body;
      if (!questionText) {
        return NextResponse.json({ error: 'Teks pertanyaan wajib diisi' }, { status: 400 });
      }

      if (!project) {
        return NextResponse.json({
          success: true,
          question: {
            id: 'cq-' + Date.now(),
            supervisorId: supervisorId || null,
            questionText,
            category: category || 'Metodologi',
            status: 'UNASKED',
            answerNotes: null,
            createdAt: new Date(),
          },
        });
      }

      const question = await prisma.consultationQuestion.create({
        data: {
          projectId: project.id,
          supervisorId: supervisorId || null,
          questionText,
          category: category || 'Metodologi',
          status: 'UNASKED',
        },
        include: { supervisor: true },
      });

      return NextResponse.json({ success: true, question });
    }

    // 3. CREATE CONSULTATION LOG (DEFAULT)
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

    if (!supervisorId || !consultationDate) {
      return NextResponse.json(
        { error: 'Dosen Pembimbing dan Tanggal Bimbingan wajib diisi' },
        { status: 400 }
      );
    }

    if (!project) {
      return NextResponse.json({
        success: true,
        consultation: {
          id: 'cons-' + Date.now(),
          supervisorId,
          consultationDate: new Date(consultationDate),
          mediaType: mediaType || 'Offline / Tatap Muka',
          chapterDiscussed: chapterDiscussed || null,
          questionsAsked: questionsAsked || null,
          supervisorFeedback: supervisorFeedback || '(Catatan tersimpan)',
          decisionResult: decisionResult || null,
          nextActionTasks: nextActionTasks || null,
          followupDeadline: followupDeadline ? new Date(followupDeadline) : null,
          status: 'ACTION_REQUIRED',
        },
      });
    }

    const consultation = await prisma.consultation.create({
      data: {
        projectId: project.id,
        supervisorId,
        consultationDate: new Date(consultationDate),
        mediaType: mediaType || 'Offline / Tatap Muka',
        chapterDiscussed: chapterDiscussed || null,
        questionsAsked: questionsAsked || null,
        supervisorFeedback: supervisorFeedback || '(Catatan tersimpan)',
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
      title: `Mencatat Bimbingan Baru dengan ${consultation.supervisor?.name || 'Dosen'}`,
      details: `Bahasan: ${consultation.chapterDiscussed || '-'}`,
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
        mediaType: body.mediaType || 'Offline / Tatap Muka',
        chapterDiscussed: body.chapterDiscussed || null,
        questionsAsked: body.questionsAsked || null,
        supervisorFeedback: body.supervisorFeedback || '',
        decisionResult: body.decisionResult || null,
        nextActionTasks: body.nextActionTasks || null,
        followupDeadline: body.followupDeadline ? new Date(body.followupDeadline) : null,
      },
    });
  }
}

export async function PATCH(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { type, id } = body;

    if (!id) return NextResponse.json({ error: 'ID wajib disertakan' }, { status: 400 });

    // 1. UPDATE SUPERVISOR
    if (type === 'supervisor') {
      const { name, roleTitle, position, phone, email, consultationPreferences } = body;
      const updatedSupervisor = await prisma.supervisor.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(roleTitle && { roleTitle }),
          ...(position !== undefined && { position }),
          ...(phone !== undefined && { phone }),
          ...(email !== undefined && { email }),
          ...(consultationPreferences !== undefined && { consultationPreferences }),
        },
      });

      return NextResponse.json({ success: true, supervisor: updatedSupervisor });
    }

    // 2. UPDATE QUESTION
    if (type === 'question') {
      const { questionText, category, status, answerNotes, supervisorId } = body;
      const updatedQuestion = await prisma.consultationQuestion.update({
        where: { id },
        data: {
          ...(questionText && { questionText }),
          ...(category && { category }),
          ...(status && { status }),
          ...(answerNotes !== undefined && { answerNotes }),
          ...(supervisorId !== undefined && { supervisorId }),
        },
        include: { supervisor: true },
      });

      return NextResponse.json({ success: true, question: updatedQuestion });
    }

    // 3. UPDATE CONSULTATION LOG (DEFAULT)
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
      status,
    } = body;

    const updatedConsultation = await prisma.consultation.update({
      where: { id },
      data: {
        ...(supervisorId && { supervisorId }),
        ...(consultationDate && { consultationDate: new Date(consultationDate) }),
        ...(mediaType && { mediaType }),
        ...(chapterDiscussed !== undefined && { chapterDiscussed }),
        ...(questionsAsked !== undefined && { questionsAsked }),
        ...(supervisorFeedback !== undefined && { supervisorFeedback }),
        ...(decisionResult !== undefined && { decisionResult }),
        ...(nextActionTasks !== undefined && { nextActionTasks }),
        ...(followupDeadline !== undefined && {
          followupDeadline: followupDeadline ? new Date(followupDeadline) : null,
        }),
        ...(status && { status }),
      },
      include: { supervisor: true },
    });

    return NextResponse.json({ success: true, consultation: updatedConsultation });
  } catch (error) {
    console.warn('Database offline, simulated update:', error);
    return NextResponse.json({ success: true, item: body });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'consultation';

    if (!id) return NextResponse.json({ error: 'ID wajib disertakan' }, { status: 400 });

    if (type === 'supervisor') {
      await prisma.supervisor.delete({ where: { id } });
      return NextResponse.json({ success: true, message: 'Dosen Pembimbing dihapus' });
    }

    if (type === 'question') {
      await prisma.consultationQuestion.delete({ where: { id } });
      return NextResponse.json({ success: true, message: 'Pertanyaan dihapus' });
    }

    // Delete consultation
    await prisma.consultation.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Log konsultasi dihapus' });
  } catch (error) {
    console.warn('Database offline, simulated deletion:', error);
    return NextResponse.json({ success: true, message: 'Deleted (simulated)' });
  }
}
