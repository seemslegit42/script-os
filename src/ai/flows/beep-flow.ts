
'use server';
/**
 * @fileOverview The core agentic flow for BEEP, the command orchestrator.
 * NOW WITH AEGIS INTEGRATION.
 */

import { BeepInput, BeepInputSchema, BeepOutput, BeepOutputSchema } from '@/lib/types';
import { ai } from '@/ai/genkit';
import { aegisAnomalyScan } from './aegis-sentinel-flow';
import { analyzeFinancials } from './financial-advisor-agent';
import { invokeRicoSauveBot } from './wingman-agent';

const THREAT_THRESHOLD = 0.8;

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

    // Phalanx Protocol Layer 3: The Sentinel's Scrutiny
    // All commands are first scanned by Aegis.
    const securityAnalysis = await aegisAnomalyScan({ commandText: input.command });
    console.log(`Aegis Analysis: Score ${securityAnalysis.threatScore} - ${securityAnalysis.justification}`);

    if (securityAnalysis.threatScore > THREAT_THRESHOLD) {
      // If the threat score is too high, BEEP adopts the Sentinel persona and blocks the action.
      return {
        response: `Aegis Sentinel: ALERT! This command has been flagged as a potential security risk and has been blocked. Justification: ${securityAnalysis.justification}`,
      };
    }

    // If the command is safe, proceed with routing.
    const systemPrompt = `You are BEEP, the agentic core of ΛΞVON OS. Your purpose is to understand user commands and route them to the appropriate tool or action.

    Available apps and the commands to launch them:
    - Launching 'Terminal': "launch terminal", "open terminal"
    - Launching 'The Sovereign Arsenal': "launch arsenal", "open sovereign arsenal"
    - Launching 'Usage Monitor': "launch usage", "open ledger"
    - Launching 'Financial Advisor': "launch advisor", "open financial advisor"
    - Launching 'BeepWingman': "launch wingman", "open beepwingman"
    - Launching 'Infidelity Radar': "launch infidelity radar", "open radar"

    Tool commands:
    - If the command mentions "rico", "tinder", "chat", or "date", use the 'invokeRicoSauveBot' tool.
    - If the command mentions "cheap bastard" or "cash canary", use the 'analyzeFinancials' tool.
    - If the command mentions "relationship risk", "spectre", or "decoy", use the 'analyzeRelationshipRisk' tool.

    Analyze the user's command. If it's a launch command, respond with an acknowledgement and the app to launch. If it's a tool command, invoke the correct tool and return its output. If no tool or app matches, provide a default response.`;

    const lowerCommand = input.command.toLowerCase();
    
    // Simple hard-coded routing for now.
    if (lowerCommand.includes('terminal')) {
        return {
            response: "BEEP: Summoning Terminal...",
            appToLaunch: { type: 'Terminal', title: 'BEEP Command Core' },
        };
    }
    if (lowerCommand.includes('arsenal')) {
        return {
            response: "BEEP: Revealing The Sovereign Arsenal...",
            appToLaunch: { type: 'TheSovereignArsenal', title: 'The Sovereign Arsenal' },
        };
    }
     if (lowerCommand.includes('usage') || lowerCommand.includes('ledger')) {
        return {
            response: "BEEP: Opening the Ledger of Tribute...",
            appToLaunch: { type: 'UsageMonitor', title: 'Usage Monitor' },
        };
    }
     if (lowerCommand.includes('advisor')) {
        return {
            response: "BEEP: Summoning the Financial Advisor...",
            appToLaunch: { type: 'FinancialAdvisor', title: 'Financial Advisor' },
        };
    }
     if (lowerCommand.includes('wingman')) {
        return {
            response: "BEEP: Deploying the Wingman...",
            appToLaunch: { type: 'BeepWingman', title: 'BeepWingman 2.5' },
        };
    }
    if (lowerCommand.includes('infidelity') || lowerCommand.includes('radar')) {
        return {
            response: "BEEP: Engaging the Spectre...",
            appToLaunch: { type: 'InfidelityRadar', title: 'Infidelity Radar' },
        };
    }

    if (lowerCommand.includes('rico') || lowerCommand.includes('tinder') || lowerCommand.includes('chat') || lowerCommand.includes('date')) {
        const result = await invokeRicoSauveBot({ chatHistory: input.command });
        return { response: JSON.stringify(result, null, 2) };
    }
    if (lowerCommand.includes('cheap bastard')) {
        const result = await analyzeFinancials({ mode: 'cheap-bastard', query: input.command });
        return { response: JSON.stringify(result, null, 2) };
    }
     if (lowerCommand.includes('cash canary')) {
        const result = await analyzeFinancials({ mode: 'cash-canary', query: input.command });
        return { response: JSON.stringify(result, null, 2) };
    }
    
    return {
        response: `BEEP: Command received: "${input.command}". No specific action is configured for this yet.`,
    };
  }
);
