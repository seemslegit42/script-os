
import { getDocs } from '@/lib/docs';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

/**
 * An API route to fetch all documentation scriptures.
 * This is used by the client-side 3D library page to get the document list,
 * as a Server Component cannot directly pass complex objects to a Client Component
 * that needs to be interactive at this level.
 * @returns {Promise<NextResponse>} A JSON response containing the array of scriptures.
 */
export async function GET() {
  try {
    const docs = await getDocs();
    return NextResponse.json(docs);
  } catch (error) {
    console.error("Failed to get docs:", error);
    return NextResponse.json({ error: 'Failed to load scriptures' }, { status: 500 });
  }
}
