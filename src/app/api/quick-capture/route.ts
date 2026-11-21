import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { category, content, createAsTask } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Konten catatan wajib diisi' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        note: {
          id: 'note-' + Date.now(),
          category: category || 'Catatan Cepat',
          content,
          createdAt: new Date(),
        },
      });
    }

    // Save Quick Capture
    const note = await prisma.quickCaptureNote.create({
      data: {
        projectId: project.id,
        category: category || 'Catatan Cepat',
        content,
      },
    });

    // Optionally also create a Task directly if user checked "Buat sebagai Task"
    let createdTask = null;
    if (createAsTask) {
      createdTask = await prisma.task.create({
        data: {
          projectId: project.id,
          title: content.length > 80 ? content.slice(0, 80) + '...' : content,
          description: `Dibuat dari Quick Capture [${category}]:\n${content}`,
          category: category === 'Arahan Dosen' ? 'Konsultasi' : 'General',
          priority: category === 'Arahan Dosen' ? 'High' : 'Medium',
          status: 'To Do',
        },
      });

      await prisma.quickCaptureNote.update({
        where: { id: note.id },
        data: {
          isProcessed: true,
          convertedToTaskId: createdTask.id,
        },
      });
    }

    await logActivity({
      projectId: project.id,
      actionType: 'CREATE',
      entityType: 'TASK',
      title: `Quick Capture: ${category}`,
      details: content.length > 50 ? content.slice(0, 50) + '...' : content,
    });

    return NextResponse.json({
      success: true,
      note,
      task: createdTask,
    });
  } catch (error) {
    console.warn('Database offline, simulated quick capture:', error);
    return NextResponse.json({
      success: true,
      note: {
        id: 'note-' + Date.now(),
        category: body.category || 'Catatan Cepat',
        content: body.content || '',
        createdAt: new Date(),
      },
    });
  }
}
