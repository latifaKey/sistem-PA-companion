import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, reminderType, targetDate, reminderTime, priority, notes } = body;

    if (!title || !targetDate) {
      return NextResponse.json({ error: 'Judul dan Tanggal Pengingat wajib diisi' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) return NextResponse.json({ error: 'Project tidak ditemukan' }, { status: 404 });

    const reminder = await prisma.reminder.create({
      data: {
        projectId: project.id,
        title,
        reminderType: reminderType || 'DEADLINE',
        targetDate: new Date(targetDate),
        reminderTime: reminderTime || '09:00',
        priority: priority || 'Medium',
        notes: notes || null,
      },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'CREATE',
      entityType: 'TASK',
      entityId: reminder.id,
      title: `Membuat Pengingat: ${reminder.title}`,
      details: `Target: ${reminder.targetDate}, Waktu: ${reminder.reminderTime}`,
    });

    return NextResponse.json({ success: true, reminder });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isDismissed } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const updated = await prisma.reminder.update({
      where: { id },
      data: { isDismissed },
    });

    return NextResponse.json({ success: true, reminder: updated });
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 });
  }
}
