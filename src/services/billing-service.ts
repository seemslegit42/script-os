
/**
 * @fileoverview Service layer for billing and usage-related logic.
 * This file encapsulates the business logic for fetching workspace usage details,
 * keeping it separate from the API route handlers.
 */

/**
 * Fetches the usage details for a given workspace.
 * In a real application, this would query the database to get the user's plan
 * and aggregate their usage from the TributeLog.
 * For now, it returns mock data.
 * @param {string} workspaceId - The ID of the workspace to fetch usage for.
 * @returns {Promise<object>} An object containing the workspace's usage details.
 */
export async function getUsageDetails(workspaceId: string) {
  // Mock data representing what would be fetched from the database
  const MOCK_DATA = {
    planName: 'Artisan',
    actionsUsed: 7280,
    actionLimit: 25000,
    transactions: [
        { id: 'tx_01', type: 'DEBIT', description: 'Agent: Dr. Syntax Critique', amount: 150, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
        { id: 'tx_02', type: 'TRIBUTE', description: 'Folly: Sisyphus\'s Ascent', amount: 500, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
        { id: 'tx_03', type: 'CREDIT', description: 'Boon: Sisyphus\'s Ascent', amount: 1200, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
        { id: 'tx_04', type: 'DEBIT', description: 'Micro-App: The Rolodex', amount: 75, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
        { id: 'tx_05', type: 'DEBIT', description: 'Agent: BEEP Command', amount: 10, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    ]
  };

  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return MOCK_DATA;
}
