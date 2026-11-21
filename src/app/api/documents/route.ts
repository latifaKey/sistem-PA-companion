import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        documents: {
          include: { versions: { orderBy: { versionNumber: 'desc' } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) return NextResponse.json({ documents: [] });
    return NextResponse.json({ documents: project.documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, tags, fileUrl, fileType, fileSize } = body;

    if (!title || !fileUrl) {
      return NextResponse.json({ error: 'Judul dan File wajib diisi' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const doc = await prisma.document.create({
      data: {
        projectId: project.id,
        title,
        category: category || 'Proposal',
        tags: tags || null,
        fileUrl,
        fileType: fileType || 'PDF',
        fileSize: Number(fileSize) || 1024000,
        versions: {
          create: {
            versionNumber: 1,
            fileName: title,
            fileUrl,
            fileSize: Number(fileSize) || 1024000,
            uploadNotes: 'Upload awal',
          },
        },
      },
      include: { versions: true },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'UPLOAD',
      entityType: 'DOCUMENT',
      entityId: doc.id,
      title: `Mengunggah Dokumen: ${doc.title}`,
      details: `Kategori: ${doc.category}, Format: ${doc.fileType}`,
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
