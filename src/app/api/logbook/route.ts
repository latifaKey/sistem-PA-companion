import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { fallbackLogbooks } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        logbooks: {
          include: { task: true },
          orderBy: { logDate: 'desc' },
        },
      },
    });

    if (!project) return NextResponse.json({ logbooks: fallbackLogbooks });
    return NextResponse.json({
      logbooks: project.logbooks.length ? project.logbooks : fallbackLogbooks,
    });
  } catch (error) {
    console.warn('Database offline, using fallback logbooks:', error);
    return NextResponse.json({ logbooks: fallbackLogbooks });
  }
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { logDate, activity, workSteps, result, obstacles, solutions, durationMinutes, taskId } = body;

    if (!activity) {
      return NextResponse.json({ error: 'Aktivitas wajib diisi' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        logbook: {
          id: 'log-' + Date.now(),
          logDate: logDate ? new Date(logDate) : new Date(),
          activity,
          workSteps: workSteps || null,
          result: result || null,
          obstacles: obstacles || null,
          solutions: solutions || null,
          durationMinutes: Number(durationMinutes) || 60,
        },
      });
    }

    const log = await prisma.logbook.create({
      data: {
        projectId: project.id,
        taskId: taskId || null,
        logDate: logDate ? new Date(logDate) : new Date(),
        activity,
        workSteps: workSteps || null,
        result: result || null,
        obstacles: obstacles || null,
        solutions: solutions || null,
        durationMinutes: Number(durationMinutes) || 60,
      },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'CREATE',
      entityType: 'LOGBOOK',
      entityId: log.id,
      title: `Menulis Entri Logbook: ${log.activity}`,
      details: `Durasi: ${log.durationMinutes} menit`,
    });

    return NextResponse.json({ success: true, logbook: log });
  } catch (error) {
    console.warn('Database offline, simulated logbook entry:', error);
    return NextResponse.json({
      success: true,
      logbook: {
        id: 'log-' + Date.now(),
        logDate: body.logDate ? new Date(body.logDate) : new Date(),
        activity: body.activity || 'Aktivitas Penelitian',
        workSteps: body.workSteps || null,
        result: body.result || null,
        obstacles: body.obstacles || null,
        solutions: body.solutions || null,
        durationMinutes: Number(body.durationMinutes) || 60,
      },
    });
  }
}
