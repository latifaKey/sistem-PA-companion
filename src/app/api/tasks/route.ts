import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

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

    if (!project) return NextResponse.json({ tasks: [] });

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

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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

    if (!project) return NextResponse.json({ error: 'Project tidak ditemukan' }, { status: 404 });

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
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
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
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
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
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
