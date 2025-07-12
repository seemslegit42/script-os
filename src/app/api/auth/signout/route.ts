
import { getAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = cookies().get('session')?.value || '';

  if (!session) {
    return NextResponse.json({ isLoggedOut: true });
  }

  try {
    const decodedClaims = await getAuth().verifySessionCookie(session, true);
    await getAuth().revokeRefreshTokens(decodedClaims.sub);
  } catch (error) {
    console.error('Error revoking session:', error);
    // Even if revocation fails (e.g., cookie expired), we clear the client-side cookie.
  }
  
  cookies().delete('session');

  return NextResponse.json({ isLoggedOut: true });
}
