
/**
 * @fileoverview Service layer for billing and usage-related logic.
 * This file encapsulates the business logic for fetching workspace usage details
 * and debiting agent actions, keeping it separate from API route handlers.
 * Fulfills the 'CORE-SUBSYSTEMS/BILLING-SERVICE.md' scripture.
 */

// A central, configurable map that stores the base cost (in Agent Actions)
// for every defined action_type.
const ActionCostRegistry: Record<string, number> = {
    'SIMPLE_LLM': 10,
    'COMPLEX_LLM': 50,
    'TOOL_USE': 25,
    'IMAGE_GENERATION': 200,
    'TTS_GENERATION': 75,
    'EXTERNAL_API': 15,
};

// Mock database representing workspace subscriptions and usage
const workspaceData: Record<string, { planName: string; actionLimit: number; actionsUsed: number; transactions: any[] }> = {
    'ws_clx01': {
        planName: 'Artisan',
        actionLimit: 25000,
        actionsUsed: 7280,
        transactions: [
            { id: 'tx_01', type: 'DEBIT', description: 'Agent: Dr. Syntax Critique', amount: 50, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
            { id: 'tx_02', type: 'TRIBUTE', description: 'Folly: Sisyphus\'s Ascent', amount: 500, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
            { id: 'tx_03', type: 'CREDIT', description: 'Boon: Sisyphus\'s Ascent', amount: 1200, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
            { id: 'tx_04', type: 'DEBIT', description: 'Micro-App: The Rolodex', amount: 25, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
        ]
    }
};

/**
 * Fetches the usage details for a given workspace.
 * @param {string} workspaceId - The ID of the workspace to fetch usage for.
 * @returns {Promise<object>} An object containing the workspace's usage details.
 */
export async function getUsageDetails(workspaceId: string) {
  const data = workspaceData[workspaceId];
  if (!data) {
    throw new Error('Workspace not found.');
  }
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    planName: data.planName,
    actionsUsed: data.actionsUsed,
    actionLimit: data.actionLimit,
    transactions: data.transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  };
}

/**
 * Authorizes and debits a workspace for a specific number of agent actions.
 * In a real application, this would be an atomic database transaction.
 * @param {string} workspaceId - The ID of the workspace to debit.
 * @param {string} actionType - The type of action being performed (e.g., 'SIMPLE_LLM').
 * @param {string} description - A human-readable description of the transaction.
 * @returns {Promise<{success: boolean, message: string}>} The result of the debit operation.
 */
export async function authorizeAndDebitAgentActions(workspaceId: string, actionType: string, description: string) {
    const cost = ActionCostRegistry[actionType];
    if (cost === undefined) {
        return { success: false, message: 'Unknown action type.' };
    }

    const data = workspaceData[workspaceId];
    if (!data) {
        return { success: false, message: 'Workspace not found.' };
    }

    if (data.actionsUsed + cost > data.actionLimit) {
        return { success: false, message: 'Insufficient agent action balance.' };
    }

    // Simulate the debit and logging
    data.actionsUsed += cost;
    data.transactions.push({
        id: `tx_${Date.now()}`,
        type: 'DEBIT',
        description: description,
        amount: cost,
        timestamp: new Date().toISOString(),
    });

    console.log(`DEBIT: ${cost} actions from ${workspaceId} for "${description}". New balance: ${data.actionsUsed}/${data.actionLimit}`);
    
    return { success: true, message: 'Debit successful.' };
}
