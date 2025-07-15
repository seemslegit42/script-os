import { NextResponse } from 'next/server';

/**
 * An API route to fetch mock usage and transaction data for the Usage Monitor.
 * In a real application, this would fetch data from a combination of the
 * billing service and the Obelisk Pay ledger service for the currently
 * authenticated user's workspace.
 */
export async function GET() {
  try {
    // Mock data based on the canon and scriptures
    const usageDetails = {
      planName: 'Artisan',
      actionsUsed: 812,
      actionLimit: 2000,
      transactions: [
        {
          id: 'tx_001',
          type: 'CREDIT',
          description: 'Founder\'s Aether Grant',
          amount: 10000,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'tx_002',
            type: 'DEBIT',
            description: 'Acquisition: The Sovereign Arsenal',
            amount: 2500,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'tx_003',
          type: 'TRIBUTE',
          description: 'Tribute to Sisyphus\'s Ascent',
          amount: 500,
          timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'tx_004',
            type: 'CREDIT',
            description: 'Boon from Sisyphus\'s Ascent (Reprieve)',
            amount: 1000,
            timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'tx_005',
            type: 'DEBIT',
            description: 'Agent Action: BEEP Command Core',
            amount: 10,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'tx_006',
            type: 'DEBIT',
            description: 'Agent Action: BEEP Command Core',
            amount: 10,
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        }
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), // Sort by most recent
    };

    return NextResponse.json(usageDetails);
  } catch (error) {
    console.error('Failed to get usage details:', error);
    return NextResponse.json({ error: 'Failed to load usage details' }, { status: 500 });
  }
}
