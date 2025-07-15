'use server';
/**
 * @fileOverview The core agentic flow for BEEP, the command orchestrator.
 * This file defines the Genkit flow that acts as the central nervous system for ΛΞVON OS.
 * It parses user commands and determines the appropriate action, such as launching a Micro-App.
 * This is the foundation for the LangGraph state machine.
 */

import { ai } from '@/ai/genkit';
import { BeepInput, BeepOutput, BeepInputSchema, BeepOutputSchema, MicroAppType } from '@/lib/types';


/**
 * The main entry point for invoking the BEEP agent.
 * This wrapper function calls the underlying Genkit flow.
 * @param {BeepInput} input - The user's command.
 * @returns {Promise<BeepOutput>} The structured response from the agent.
 */
export async function beep(input: BeepInput): Promise<BeepOutput> {
  return beepFlow(input);
}

/**
 * The Genkit flow for BEEP.
 * This will eventually be replaced by a complex LangGraph state machine.
 * For now, it contains simple routing logic to "fake intelligence with real primitives."
 */
const beepFlow = ai.defineFlow(
  {
    name: 'beepFlow',
    inputSchema: BeepInputSchema,
    outputSchema: BeepOutputSchema,
  },
  async ({ command }) => {
    const lowerCommand = command.toLowerCase().trim();

    // Primitive routing logic. This will be replaced by LangGraph.
    if (lowerCommand.startsWith('launch')) {
      const parts = lowerCommand.split(' ');
      const appName = parts[1] as MicroAppType;
      
      const appRegistry: Record<MicroAppType, { title: string }> = {
        'Terminal': { title: 'BEEP Command Core' },
        'UsageMonitor': { title: 'Ledger of Tribute' },
      };

      if (appName && appRegistry[appName]) {
        const appInfo = appRegistry[appName];
        return {
          response: `BEEP: Summoning ${appInfo.title}...`,
          appToLaunch: {
            type: appName,
            title: appInfo.title,
          },
        };
      }
      return { response: `BEEP: Unknown Micro-App type "${appName}".` };
    }
    
    if (lowerCommand === 'clear') {
        return { response: 'BEEP: View cleared.' };
    }

    // Default response for unhandled commands
    return {
      response: `BEEP: Command processed - "${command}"`,
    };
  }
);
