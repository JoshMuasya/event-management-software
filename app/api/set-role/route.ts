import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminAuth } from '@/lib/firebase/admin';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, role } = await req.json();
  if (!['admin', 'guest'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  try {
    await adminAuth.setCustomUserClaims(userId, { role });
    return NextResponse.json({ message: `Set role to ${role} for user ${userId}` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to set role' }, { status: 500 });
  }
}