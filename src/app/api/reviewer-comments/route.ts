import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, studentAnalysis, repairPlan, repairProof } = body;

    if (!id) return NextResponse.json({ error: 'Comment ID required' }, { status: 400 });

    const updated = await prisma.reviewerComment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(studentAnalysis !== undefined && { studentAnalysis }),
        ...(repairPlan !== undefined && { repairPlan }),
        ...(repairProof !== undefined && { repairProof }),
      },
      include: { reviewer: true },
    });

    await logActivity({
      projectId: updated.projectId,
      actionType: 'STATUS_CHANGE',
      entityType: 'REVISION',
      entityId: updated.id,
      title: `Memperbarui Status Revisi: ${updated.reviewer.name} (${updated.evaluationAspect})`,
      details: `Status diubah menjadi: ${updated.status}`,
    });

    return NextResponse.json({ success: true, comment: updated });
  } catch (error) {
    console.error('Error updating reviewer comment:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}
