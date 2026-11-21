import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { fallbackTasks } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) return NextResponse.json({ tasks: fallbackTasks });

    const where: any = { projectId: project.id };
    if (category && category !== 'All') where.category = category;
    if (priority && priority !== 'All') where.priority = priority;
    if (status && status !== 'All') where.status = status;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        subtasks: true,
        milestone: true,
        reviewerComment: {
          include: { reviewer: true },
        },
      },
      orderBy: [{ status: 'asc' }, { deadline: 'asc' }],
    });

    return NextResponse.json({ tasks: tasks.length ? tasks : fallbackTasks });
  } catch (error) {
    console.warn('Database offline, using fallback tasks:', error);
    return NextResponse.json({ tasks: fallbackTasks });
  }
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const {
      title,
      description,
      category,
      priority,
      status,
      startDate,
      deadline,
      milestoneId,
      subtasks,
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Judul task wajib diisi' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        task: {
          id: 'task-' + Date.now(),
          title,
          description: description || null,
          category: category || 'General',
          priority: priority || 'Medium',
          status: status || 'To Do',
          startDate: startDate ? new Date(startDate) : null,
          deadline: deadline ? new Date(deadline) : null,
          isCompleted: status === 'Completed',
          subtasks: subtasks?.map((s: string, idx: number) => ({ id: `sub-${Date.now()}-${idx}`, title: s, isCompleted: false })) || [],
        },
      });
    }

    const task = await prisma.task.create({
      data: {
        projectId: project.id,
        milestoneId: milestoneId || null,
        title,
        description: description || null,
        category: category || 'General',
        priority: priority || 'Medium',
        status: status || 'To Do',
        startDate: startDate ? new Date(startDate) : null,
        deadline: deadline ? new Date(deadline) : null,
        isCompleted: status === 'Completed',
        completedAt: status === 'Completed' ? new Date() : null,
        subtasks: subtasks?.length
          ? {
              create: subtasks.map((s: string) => ({ title: s })),
            }
          : undefined,
      },
      include: { subtasks: true },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'CREATE',
      entityType: 'TASK',
      entityId: task.id,
      title: `Membuat Task Baru: ${task.title}`,
      details: `Kategori: ${task.category}, Prioritas: ${task.priority}`,
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.warn('Database offline, simulated task creation:', error);
    return NextResponse.json({
      success: true,
      task: {
        id: 'task-' + Date.now(),
        title: body.title || 'Task Baru',
        description: body.description || null,
        category: body.category || 'General',
        priority: body.priority || 'Medium',
        status: body.status || 'To Do',
        startDate: body.startDate ? new Date(body.startDate) : null,
        deadline: body.deadline ? new Date(body.deadline) : null,
        isCompleted: body.status === 'Completed',
        subtasks: body.subtasks?.map((s: string, idx: number) => ({ id: `sub-${Date.now()}-${idx}`, title: s, isCompleted: false })) || [],
      },
    });
  }
}

export async function PATCH(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { id, status, isCompleted, title, description, priority, category, deadline } = body;

    if (!id) return NextResponse.json({ error: 'Task ID diperlukan' }, { status: 400 });

    const isDone = isCompleted !== undefined ? isCompleted : status === 'Completed';

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(isDone !== undefined && { isCompleted: isDone }),
        ...(isDone && { completedAt: new Date() }),
        ...(!isDone && status && { completedAt: null }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(priority && { priority }),
        ...(category && { category }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      },
      include: { subtasks: true },
    });

    await logActivity({
      projectId: updatedTask.projectId,
      actionType: 'STATUS_CHANGE',
      entityType: 'TASK',
      entityId: updatedTask.id,
      title: `Memperbarui Task: ${updatedTask.title}`,
      details: `Status: ${updatedTask.status}, Selesai: ${updatedTask.isCompleted}`,
    });

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    console.warn('Database offline, simulated task update:', error);
    return NextResponse.json({ success: true, task: body });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Task ID diperlukan' }, { status: 400 });

    const task = await prisma.task.delete({ where: { id } });

    await logActivity({
      projectId: task.projectId,
      actionType: 'DELETE',
      entityType: 'TASK',
      entityId: id,
      title: `Menghapus Task: ${task.title}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn('Database offline, simulated task delete:', error);
    return NextResponse.json({ success: true });
  }
}
