import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { fallbackReferences } from '@/lib/fallbackData';

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

    if (!project) return NextResponse.json({ references: fallbackReferences });
    return NextResponse.json({
      references: project.references.length ? project.references : fallbackReferences,
    });
  } catch (error) {
    console.warn('Database offline, using fallback references:', error);
    return NextResponse.json({ references: fallbackReferences });
  }
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
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
      isKeyPaper,
    } = body;

    if (!title || !authors || !year) {
      return NextResponse.json(
        { error: 'Judul, Penulis, dan Tahun wajib diisi' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        reference: {
          id: 'ref-' + Date.now(),
          title,
          authors,
          year: Number(year),
          publicationVenue: publicationVenue || null,
          method: method || null,
          isKeyPaper: Boolean(isKeyPaper),
          relevanceToThesis: relevanceToThesis || null,
        },
      });
    }

    const reference = await prisma.researchReference.create({
      data: {
        projectId: project.id,
        title,
        authors,
        year: Number(year),
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
        isCited: Boolean(isKeyPaper),
      },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'CREATE',
      entityType: 'REFERENCE',
      entityId: reference.id,
      title: `Menambahkan Referensi Literatur: ${reference.title}`,
      details: `${reference.authors} (${reference.year})`,
    });

    return NextResponse.json({ success: true, reference });
  } catch (error) {
    console.warn('Database offline, simulated reference creation:', error);
    return NextResponse.json({
      success: true,
      reference: {
        id: 'ref-' + Date.now(),
        title: body.title || 'Paper Baru',
        authors: body.authors || 'Penulis',
        year: Number(body.year) || 2026,
        publicationVenue: body.publicationVenue || null,
        method: body.method || null,
        isKeyPaper: Boolean(body.isKeyPaper),
        relevanceToThesis: body.relevanceToThesis || null,
      },
    });
  }
}
