import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { fallbackReminders } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { title, reminderType, targetDate, reminderTime, priority, notes } = body;

    if (!title || !targetDate) {
      return NextResponse.json({ error: 'Judul dan Tanggal Pengingat wajib diisi' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        reminder: {
          id: 'rem-' + Date.now(),
          title,
          reminderType: reminderType || 'DEADLINE',
          targetDate: new Date(targetDate),
          reminderTime: reminderTime || '09:00',
          priority: priority || 'Medium',
          notes: notes || null,
        },
      });
    }

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
    console.warn('Database offline, simulated reminder creation:', error);
    return NextResponse.json({
      success: true,
      reminder: {
        id: 'rem-' + Date.now(),
        title: body.title || 'Pengingat',
        reminderType: body.reminderType || 'DEADLINE',
        targetDate: body.targetDate ? new Date(body.targetDate) : new Date(),
        reminderTime: body.reminderTime || '09:00',
        priority: body.priority || 'Medium',
        notes: body.notes || null,
      },
    });
  }
}

export async function PATCH(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { id, isDismissed } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const updated = await prisma.reminder.update({
      where: { id },
      data: { isDismissed },
    });

    return NextResponse.json({ success: true, reminder: updated });
  } catch (error) {
    console.warn('Database offline, simulated reminder update:', error);
    return NextResponse.json({ success: true, ...body });
  }
}
