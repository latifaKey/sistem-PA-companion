import { prisma } from './prisma';

export async function logActivity({
  projectId,
  userId,
  actionType,
  entityType,
  entityId,
  title,
  details,
}: {
  projectId: string;
  userId?: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'UPLOAD' | 'STATUS_CHANGE' | 'COMMENT';
  entityType: 'TASK' | 'PROPOSAL' | 'REVISION' | 'DATASET' | 'CONSULTATION' | 'LOGBOOK' | 'REFERENCE' | 'EXPERIMENT' | 'DOCUMENT';
  entityId?: string;
  title: string;
  details?: string;
}) {
  try {
    return await prisma.activityLog.create({
      data: {
        projectId,
        userId: userId || null,
        actionType,
        entityType,
        entityId: entityId || null,
        title,
        details: details || null,
      },
    });
  } catch (error) {
    console.error('Failed to write activity log:', error);
  }
}
