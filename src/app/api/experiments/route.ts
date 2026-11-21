import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        experiments: {
          include: {
            preprocessingConfig: true,
            ldaConfig: true,
            metric: true,
            topicModels: {
              include: { topics: true },
            },
          },
          orderBy: { executedAt: 'desc' },
        },
      },
    });

    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ experiments: project.experiments });
  } catch (error) {
    console.error('Error fetching experiments:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      experimentCode,
      experimentType,
      hypothesisOrGoal,
      numTopicsK,
      alpha,
      etaBeta,
      passes,
      iterations,
      coherenceCv,
      topicDiversity,
      redundancyScore,
      notes,
    } = body;

    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const exp = await prisma.experiment.create({
      data: {
        projectId: project.id,
        experimentCode: experimentCode || `EXP-LDA-${Date.now().toString().slice(-3)}`,
        experimentType: experimentType || 'LDA',
        name,
        hypothesisOrGoal: hypothesisOrGoal || null,
        status: 'COMPLETED',
        notes: notes || null,
        executedAt: new Date(),
        ldaConfig: {
          create: {
            numTopicsK: Number(numTopicsK) || 5,
            alpha: alpha || 'symmetric',
            etaBeta: etaBeta || 'auto',
            passes: Number(passes) || 20,
            iterations: Number(iterations) || 200,
          },
        },
        metric: {
          create: {
            coherenceCv: parseFloat(coherenceCv) || 0.42,
            topicDiversity: parseFloat(topicDiversity) || 0.65,
            redundancyScore: parseFloat(redundancyScore) || 0.35,
            stabilityScore: 0.75,
          },
        },
      },
    });

    await logActivity({
      projectId: project.id,
      actionType: 'CREATE',
      entityType: 'EXPERIMENT',
      entityId: exp.id,
      title: `Menjalankan Eksperimen: ${exp.name}`,
      details: `K=${numTopicsK || 5}, Coherence Cv: ${coherenceCv || 0.42}`,
    });

    return NextResponse.json({ success: true, experiment: exp });
  } catch (error) {
    console.error('Error creating experiment:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isSelectedCandidate } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const updated = await prisma.experiment.update({
      where: { id },
      data: { isSelectedCandidate },
    });

    return NextResponse.json({ success: true, experiment: updated });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
