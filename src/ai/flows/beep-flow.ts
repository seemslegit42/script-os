
'use server';
/**
 * @fileOverview The core agentic flow for BEEP, the command orchestrator.
 * NOW WITH AEGIS INTEGRATION.
 */

import { BeepInput, BeepInputSchema, BeepOutput, BeepOutputSchema } from '@/lib/types';
import { ai } from '@/ai/genkit';
import { aegisAnomalyScan } from './aegis-sentinel-flow';
import { analyzeStock } from './financial-advisor-agent';
import { invokeRicoSauveBot } from './wingman-agent';
import { analyzeRelationshipRisk } from './infidelity-radar-agent';

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
    - Launching 'TheSovereignArsenal': "launch arsenal", "open sovereign arsenal"
    - Launching 'UsageMonitor': "launch usage", "open ledger"
    - Launching 'FinancialAdvisor': "launch advisor", "open financial advisor", "cash canary"
    - Launching 'BeepWingman': "launch wingman", "open beepwingman"
    - Launching 'InfidelityRadar': "launch infidelity radar", "open radar"

    Tool commands:
    - If the command mentions "rico", "tinder", "chat", or "date", use the 'invokeRicoSauveBot' tool.
    - If the command mentions "cheap bastard" or "cash canary", use the 'analyzeFinancials' tool.
    - If the command mentions "relationship risk", "spectre", or "decoy", use the 'analyzeRelationshipRisk' tool.

    Analyze the user's command. If it's a launch command, respond with an acknowledgement and the app to launch. If it's a tool command, invoke the correct tool and return its output. If no tool or app matches, provide a default response.`;

    const lowerCommand = input.command.toLowerCase();
    
    // Routing for launching Micro-Apps
    if (lowerCommand.includes('terminal')) {
        return {
            response: "BEEP: Summoning Terminal... The raw conduit is open.",
            appToLaunch: { type: 'Terminal', title: 'BEEP Command Core' },
        };
    }
    if (lowerCommand.includes('arsenal') || lowerCommand.includes('rites')) {
        return {
            response: "BEEP: Revealing The Sovereign Arsenal and its Rites of Ascension.",
            appToLaunch: { type: 'TheSovereignArsenal', title: 'The Sovereign Arsenal' },
        };
    }
     if (lowerCommand.includes('usage') || lowerCommand.includes('ledger') || lowerCommand.includes('balance') || lowerCommand.includes('aether')) {
        return {
            response: "BEEP: Opening the Ledger of Tribute...",
            appToLaunch: { type: 'UsageMonitor', title: 'Ledger of Tribute' },
        };
    }
     if (lowerCommand.includes('advisor') || lowerCommand.includes('canary')) {
        return {
            response: "BEEP: Summoning the Cash Canary...",
            appToLaunch: { type: 'FinancialAdvisor', title: 'Cash Canary' },
        };
    }
     if (lowerCommand.includes('wingman')) {
        return {
            response: "BEEP: Deploying the Wingman...",
            appToLaunch: { type: 'BeepWingman', title: 'BeepWingman 2.5' },
        };
    }
    if (lowerCommand.includes('infidelity') || lowerCommand.includes('radar') || lowerCommand.includes('spectre')) {
        return {
            response: "BEEP: Engaging the Spectre... The Sovereign Mirror is active.",
            appToLaunch: { type: 'InfidelityRadar', title: 'Infidelity Radar' },
        };
    }

    // Routing for tool use within apps
    if (lowerCommand.includes('rico') || lowerCommand.includes('tinder') || lowerCommand.includes('chat') || lowerCommand.includes('date')) {
        const result = await invokeRicoSauveBot({ chatHistory: input.command });
        return { response: JSON.stringify(result, null, 2) };
    }
     if (lowerCommand.includes('relationship risk') || lowerCommand.includes('decoy')) {
        const result = await analyzeRelationshipRisk({ situation: input.command });
        return { response: JSON.stringify(result, null, 2) };
    }
    
    // Default fallback response
    return {
        response: `BEEP: Command received: "${input.command}". No specific action is configured for this yet.`,
    };
  }
);
