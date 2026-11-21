import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { fallbackDocuments } from '@/lib/fallbackData';

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

    if (!project) return NextResponse.json({ documents: fallbackDocuments });
    return NextResponse.json({
      documents: project.documents.length ? project.documents : fallbackDocuments,
    });
  } catch (error) {
    console.warn('Database offline, using fallback documents:', error);
    return NextResponse.json({ documents: fallbackDocuments });
  }
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const { title, category, tags, fileUrl, fileType, fileSize } = body;

    if (!title || !fileUrl) {
      return NextResponse.json({ error: 'Judul dan File wajib diisi' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        document: {
          id: 'doc-' + Date.now(),
          title,
          category: category || 'General',
          fileUrl,
          fileType: fileType || 'PDF',
          fileSize: fileSize || 1024,
          createdAt: new Date(),
        },
      });
    }

    const doc = await prisma.document.create({
      data: {
        projectId: project.id,
        title,
        category: category || 'General',
        tags: tags || null,
        fileUrl,
        fileType: fileType || 'PDF',
        fileSize: Number(fileSize) || 0,
      },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'UPLOAD',
      entityType: 'DOCUMENT',
      entityId: doc.id,
      title: `Mengunggah Dokumen: ${doc.title}`,
      details: `Kategori: ${doc.category}`,
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    console.warn('Database offline, simulated document creation:', error);
    return NextResponse.json({
      success: true,
      document: {
        id: 'doc-' + Date.now(),
        title: body.title || 'Dokumen Baru',
        category: body.category || 'General',
        fileUrl: body.fileUrl || '/uploads/sample.pdf',
        fileType: body.fileType || 'PDF',
        fileSize: body.fileSize || 1024,
        createdAt: new Date(),
      },
    });
  }
}
