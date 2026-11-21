import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { fallbackUser, fallbackProject } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await prisma.user.findFirst({
      include: {
        projects: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) return NextResponse.json({ user: fallbackUser, project: fallbackProject });
    return NextResponse.json({
      user,
      project: user.projects?.[0] || fallbackProject,
    });
  } catch (error) {
    console.warn('Database offline, using fallback settings data:', error);
    return NextResponse.json({ user: fallbackUser, project: fallbackProject });
  }
}

export async function PATCH(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { name, nim, prodi, institution, title, targetCompletion, academicYear, semester } = body;

    const user = await prisma.user.findFirst({
      include: { projects: { take: 1, orderBy: { createdAt: 'desc' } } },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        user: { ...fallbackUser, name: name || fallbackUser.name, nim: nim || fallbackUser.nim },
        project: { ...fallbackProject, title: title || fallbackProject.title },
      });
    }

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
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.warn('Database offline, simulated settings update:', error);
    return NextResponse.json({
      success: true,
      user: { ...fallbackUser, ...body },
      project: { ...fallbackProject, ...body },
    });
  }
}
