
import { NextResponse } from 'next/server';
import { getUsageDetails } from '@/services/ledger-service';

/**
 * An API route to fetch usage and transaction data for the Usage Monitor.
 * It now calls the ledger-service to get data from the database, replacing
 * the previous mock implementation.
 * 
 * NOTE: In a real, authenticated application, the userId would be derived
 * from a validated session token (e.g., JWT). For now, it is mocked.
 */
export async function GET() {
  try {
    // MOCK: In a real app, you'd get the userId from the session.
    const mockUserId = 'user_clx01_sovereign_initiate';
    const usageDetails = await getUsageDetails(mockUserId);
    return NextResponse.json(usageDetails);
  } catch (error) {
    console.error('Failed to get usage details:', error);
    return NextResponse.json({ error: 'Failed to load usage details from ledger' }, { status: 500 });
  }
}
