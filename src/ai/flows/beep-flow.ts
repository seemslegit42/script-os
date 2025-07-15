
'use server';
/**
 * @fileOverview The core agentic flow for BEEP, the command orchestrator.
 */

import { BeepInput, BeepInputSchema, BeepOutput, BeepOutputSchema } from '@/lib/types';
import { ai } from '@/ai/genkit';

/**
 * The main entry point for invoking the BEEP agent.
 * @param {BeepInput} input - The user's command.
 * @returns {Promise<BeepOutput>} The structured response from the agent.
 */
export async function beep(input: BeepInput): Promise<BeepOutput> {
  return beepFlow(input);
}

const beepFlow = ai.defineFlow(
  {
    name: 'beepFlow',
    inputSchema: BeepInputSchema,
    outputSchema: BeepOutputSchema,
  },
  async (input) => {
    console.log(`Invoking BEEP agent with command: "${input.command}"`);

    const systemPrompt = `You are BEEP, the agentic core of ΛΞVON OS. Your purpose is to understand user commands and respond with both a natural language message and a structured action.

    Available apps and the commands to launch them:
    - Launching 'Terminal': "launch terminal", "open terminal"
    
    If the user command clearly maps to launching one of the above apps, your text response should acknowledge the request and you should set the appToLaunch property.

    Analyze the user's command and decide whether to launch an app or perform another action. Your primary job is to orchestrate.`;

    const lowerCommand = input.command.toLowerCase();
    
    // Simple hard-coded routing for now.
    if (lowerCommand.includes('terminal')) {
        return {
            response: "BEEP: Summoning Terminal...",
            appToLaunch: { type: 'Terminal', title: 'BEEP Command Core' },
        };
    }
    
    return {
        response: `BEEP: Command received: "${input.command}". No specific action is configured for this yet.`,
    };
  }
);
