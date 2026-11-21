import { prisma } from './prisma';
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  try {
    // Check if session cookie exists
    const cookieStore = cookies();
    const sessionEmail = cookieStore.get('pa_session_email')?.value;

    const email = sessionEmail || 'latifa.keysha@ti.pnp.ac.id';

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        projects: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (user) {
      return {
        ...user,
        currentProject: user.projects[0] || null,
      };
    }

    // Fallback: return first user if any
    const firstUser = await prisma.user.findFirst({
      include: {
        projects: {
          take: 1,
        },
      },
    });

    if (firstUser) {
      return {
        ...firstUser,
        currentProject: firstUser.projects[0] || null,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}
