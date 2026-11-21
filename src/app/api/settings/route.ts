import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await prisma.user.findFirst({
      include: {
        projects: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user, project: user.projects[0] });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, nim, prodi, institution, title, targetCompletion, academicYear, semester } = body;

    const user = await prisma.user.findFirst({
      include: { projects: { take: 1, orderBy: { createdAt: 'desc' } } },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name }),
        ...(nim && { nim }),
        ...(prodi && { prodi }),
        ...(institution && { institution }),
      },
    });

    const project = user.projects[0];
    if (project) {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          ...(title && { title }),
          ...(targetCompletion && { targetCompletion: new Date(targetCompletion) }),
          ...(academicYear && { academicYear }),
          ...(semester && { semester }),
        },
      });

      await logActivity({
        projectId: project.id,
        actionType: 'UPDATE',
        entityType: 'TASK',
        title: 'Memperbarui Konfigurasi Sistem & Profil Mahasiswa',
      });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
