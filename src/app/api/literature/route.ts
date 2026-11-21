import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        references: {
          include: { notes: true, citationUsages: true },
          orderBy: { year: 'desc' },
        },
      },
    });

    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ references: project.references });
  } catch (error) {
    console.error('Error fetching literature:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      authors,
      year,
      publicationVenue,
      volume,
      issue,
      pages,
      doi,
      url,
      method,
      datasetInfo,
      researchFindings,
      advantages,
      limitations,
      relevanceToThesis,
      chaptersCiting,
      isCited,
    } = body;

    if (!title || !authors) {
      return NextResponse.json({ error: 'Judul dan Penulis wajib diisi' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const ref = await prisma.researchReference.create({
      data: {
        projectId: project.id,
        title,
        authors,
        year: Number(year) || 2024,
        publicationVenue: publicationVenue || null,
        volume: volume || null,
        issue: issue || null,
        pages: pages || null,
        doi: doi || null,
        url: url || null,
        method: method || null,
        datasetInfo: datasetInfo || null,
        researchFindings: researchFindings || null,
        advantages: advantages || null,
        limitations: limitations || null,
        relevanceToThesis: relevanceToThesis || null,
        chaptersCiting: chaptersCiting || null,
        isCited: Boolean(isCited),
        validationStatus: 'VERIFIED',
      },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'CREATE',
      entityType: 'REFERENCE',
      entityId: ref.id,
      title: `Menambahkan Referensi: ${ref.title}`,
      details: `${ref.authors} (${ref.year})`,
    });

    return NextResponse.json({ success: true, reference: ref });
  } catch (error) {
    console.error('Error creating reference:', error);
    return NextResponse.json({ error: 'Failed to create reference' }, { status: 500 });
  }
}
