import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

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

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching proposal data:', error);
    return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 });
  }
}

// Create new Proposal Version without overwriting old versions!
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { versionName, changedChapters, changeSummary, fileDocx, filePdf } = body;

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { proposalVersions: true },
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

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
      actionType: 'CREATE',
      entityType: 'PROPOSAL',
      entityId: newVersion.id,
      title: `Membuat Versi Proposal Baru: ${newVersion.versionName}`,
      details: changeSummary || `Perubahan pada: ${changedChapters}`,
    });

    return NextResponse.json({ success: true, version: newVersion });
  } catch (error) {
    console.error('Error creating proposal version:', error);
    return NextResponse.json({ error: 'Failed to create version' }, { status: 500 });
  }
}

// Update subsection status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionId, status, notes } = body;

    if (!sectionId) return NextResponse.json({ error: 'Section ID required' }, { status: 400 });

    const updated = await prisma.proposalSection.update({
      where: { id: sectionId },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        lastEditedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, section: updated });
  } catch (error) {
    console.error('Error updating proposal section:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}
