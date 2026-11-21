import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        calendarEvents: { orderBy: { startDate: 'asc' } },
        reminders: {
          orderBy: { targetDate: 'asc' },
          include: { task: true },
        },
      },
    });

    if (!project) return NextResponse.json({ events: [], reminders: [] });

    return NextResponse.json({
      events: project.calendarEvents,
      reminders: project.reminders,
    });
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, eventType, startDate, endDate, isAllDay, location } = body;

    if (!title || !startDate) {
      return NextResponse.json({ error: 'Judul dan Tanggal Mulai wajib diisi' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) return NextResponse.json({ error: 'Project tidak ditemukan' }, { status: 404 });

    const event = await prisma.calendarEvent.create({
      data: {
        projectId: project.id,
        title,
        description: description || null,
        eventType: eventType || 'CONSULTATION',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isAllDay: Boolean(isAllDay),
        location: location || null,
        status: 'SCHEDULED',
      },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'CREATE',
      entityType: 'CONSULTATION',
      entityId: event.id,
      title: `Menambahkan Jadwal Baru: ${event.title}`,
      details: `Jenis: ${event.eventType}, Tanggal: ${event.startDate}`,
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
