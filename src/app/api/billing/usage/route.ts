
import { NextResponse } from 'next/server';
import { getUsageDetails } from '@/services/billing-service';

/**
 * API route to get usage details for the current workspace.
 * This route is protected and would require an authenticated session in a real app.
 * It calls the billing service to abstract away the business logic.
 */
export async function GET(req: Request) {
  try {
    // In a real app, you'd get the workspaceId from the authenticated session.
    const mockWorkspaceId = 'ws_clx01'; 
    
    const usageDetails = await getUsageDetails(mockWorkspaceId);

    return NextResponse.json(usageDetails);
  } catch (error) {
    console.error('Failed to get usage details:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
