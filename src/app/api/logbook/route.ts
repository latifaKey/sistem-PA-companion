import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

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

    if (!project) return NextResponse.json({ logbooks: [] });
    return NextResponse.json({ logbooks: project.logbooks });
  } catch (error) {
    console.error('Error fetching logbooks:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { logDate, activity, workSteps, result, obstacles, solutions, durationMinutes } = body;

    if (!activity) {
      return NextResponse.json({ error: 'Aktivitas wajib diisi' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const log = await prisma.logbook.create({
      data: {
        projectId: project.id,
        logDate: logDate ? new Date(logDate) : new Date(),
        activity,
        workSteps: workSteps || null,
        result: result || null,
        obstacles: obstacles || null,
        solutions: solutions || null,
        durationMinutes: Number(durationMinutes) || 60,
        aiPolished: true,
      },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'CREATE',
      entityType: 'LOGBOOK',
      entityId: log.id,
      title: `Mengisi Logbook Harian: ${log.activity}`,
      details: `Durasi: ${log.durationMinutes} menit`,
    });

    return NextResponse.json({ success: true, logbook: log });
  } catch (error) {
    console.error('Error creating logbook:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
