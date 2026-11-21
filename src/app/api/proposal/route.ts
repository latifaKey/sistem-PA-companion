import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { fallbackProject } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        proposalVersions: { orderBy: { versionNumber: 'desc' } },
        proposalSections: { orderBy: [{ chapter: 'asc' }, { subSectionCode: 'asc' }] },
        reviewerComments: {
          include: {
            reviewer: true,
            proposalVersion: true,
            revisionActions: true,
          },
          orderBy: { reviewDate: 'desc' },
        },
        reviewers: true,
      },
    });

    if (!project) return NextResponse.json({ project: fallbackProject });

    return NextResponse.json({ project });
  } catch (error) {
    console.warn('Database offline, using fallback proposal data:', error);
    return NextResponse.json({ project: fallbackProject });
  }
}

// Create new Proposal Version without overwriting old versions!
export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { versionName, changedChapters, changeSummary, fileDocx, filePdf } = body;

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { proposalVersions: true },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        version: {
          id: 'ver-prop-' + Date.now(),
          versionName: versionName || 'v2.0 - Revisi',
          versionNumber: 3,
          changedChapters: changedChapters || null,
          changeSummary: changeSummary || null,
          approvalStatus: 'UNDER_REVIEW',
          createdAt: new Date(),
        },
      });
    }

    const nextVersionNumber = project.proposalVersions.length + 1;

    const newVersion = await prisma.proposalVersion.create({
      data: {
        projectId: project.id,
        versionName: versionName || `v${nextVersionNumber}.0 - Revisi`,
        versionNumber: nextVersionNumber,
        changedChapters: changedChapters || null,
        changeSummary: changeSummary || null,
        fileDocx: fileDocx || null,
        filePdf: filePdf || null,
        approvalStatus: 'UNDER_REVIEW',
      },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'UPLOAD',
      entityType: 'PROPOSAL',
      entityId: newVersion.id,
      title: `Mengunggah Versi Proposal Baru: ${newVersion.versionName}`,
      details: `Bab diubah: ${newVersion.changedChapters || '-'}`,
    });

    return NextResponse.json({ success: true, version: newVersion });
  } catch (error) {
    console.warn('Database offline, simulated proposal upload:', error);
    return NextResponse.json({
      success: true,
      version: {
        id: 'ver-prop-' + Date.now(),
        versionName: body.versionName || 'Versi Baru',
        versionNumber: 3,
        changedChapters: body.changedChapters || null,
        changeSummary: body.changeSummary || null,
        approvalStatus: 'UNDER_REVIEW',
        createdAt: new Date(),
      },
    });
  }
}
