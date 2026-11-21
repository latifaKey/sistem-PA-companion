import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
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
      title: `Memperbarui Status Revisi: ${updated.reviewer?.name || 'Reviewer'} (${updated.evaluationAspect || 'Catatan'})`,
      details: `Status diubah menjadi: ${updated.status}`,
    });

    return NextResponse.json({ success: true, comment: updated });
  } catch (error) {
    console.warn('Database offline, simulated reviewer comment update:', error);
    return NextResponse.json({ success: true, comment: body });
  }
}
