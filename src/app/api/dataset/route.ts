import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        datasets: {
          include: {
            versions: { orderBy: { versionNumber: 'desc' } },
            distributions: true,
            exclusions: { orderBy: { excludedAt: 'desc' } },
          },
        },
      },
    });

    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ datasets: project.datasets });
  } catch (error) {
    console.error('Error fetching datasets:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { datasetId, versionName, rowCount, columnCount, changeNotes } = body;

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
      include: { versions: true },
    });

    if (!dataset) return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });

    const newVersionNumber = dataset.versions.length + 1;

    const newVer = await prisma.datasetVersion.create({
      data: {
        datasetId: dataset.id,
        versionNumber: newVersionNumber,
        versionName: versionName || `v1.${newVersionNumber} - Pembaruan`,
        rowCount: Number(rowCount) || dataset.initialCount,
        columnCount: Number(columnCount) || 6,
        changeNotes: changeNotes || null,
      },
    });

    await logActivity({
      projectId: dataset.projectId,
      actionType: 'UPLOAD',
      entityType: 'DATASET',
      entityId: dataset.id,
      title: `Membuat Versi Dataset Baru: ${newVer.versionName}`,
      details: changeNotes || `Jumlah data: ${newVer.rowCount}`,
    });

    return NextResponse.json({ success: true, version: newVer });
  } catch (error) {
    console.error('Error creating dataset version:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
