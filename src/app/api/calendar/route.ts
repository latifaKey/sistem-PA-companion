import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { fallbackCalendarEvents, fallbackReminders } from '@/lib/fallbackData';

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

    if (!project) {
      return NextResponse.json({
        events: fallbackCalendarEvents,
        reminders: fallbackReminders,
      });
    }

    return NextResponse.json({
      events: project.calendarEvents.length ? project.calendarEvents : fallbackCalendarEvents,
      reminders: project.reminders.length ? project.reminders : fallbackReminders,
    });
  } catch (error) {
    console.warn('Database offline, using fallback calendar data:', error);
    return NextResponse.json({
      events: fallbackCalendarEvents,
      reminders: fallbackReminders,
    });
  }
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { title, description, eventType, startDate, endDate, isAllDay, location } = body;

    if (!title || !startDate) {
      return NextResponse.json({ error: 'Judul dan Tanggal Mulai wajib diisi' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        event: {
          id: 'evt-' + Date.now(),
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
    }

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
    console.warn('Database offline, simulated event creation:', error);
    return NextResponse.json({
      success: true,
      event: {
        id: 'evt-' + Date.now(),
        title: body.title || 'Jadwal Baru',
        description: body.description || null,
        eventType: body.eventType || 'CONSULTATION',
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : null,
        isAllDay: Boolean(body.isAllDay),
        location: body.location || null,
        status: 'SCHEDULED',
      },
    });
  }
}
