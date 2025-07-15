'use server';
/**
 * @fileOverview The core agentic flow for BEEP, the command orchestrator.
 * This file defines the Genkit flow that acts as the front door to the
 * LangChain/LangGraph agent. It parses user commands and determines the
 * appropriate action, such as launching a Micro-App.
 */

import { BeepInput, BeepInputSchema, BeepOutput, BeepOutputSchema } from '@/lib/types';
import { ChatGroq } from "@langchain/groq";
import { AgentExecutor, createReactAgent } from "langgraph/react";
import { HumanMessage } from "@langchain/core/messages";
import { ai } from '@/ai/genkit';
import { analyzeFinancials } from './financial-advisor-agent';
import { invokeRicoSauveBot } from './wingman-agent';
import { analyzeRelationshipRisk } from './infidelity-radar-agent';

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-70b-versatile",
});

const tools = [analyzeFinancials, invokeRicoSauveBot, analyzeRelationshipRisk];

const reactAgent = createReactAgent({
    llm: model,
    tools,
});

const appAgent = new AgentExecutor({
    agent: reactAgent,
    tools,
});

/**
 * The main entry point for invoking the BEEP agent.
 * This wrapper function calls the underlying LangChain agent.
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

    const systemPrompt = `You are BEEP, the agentic core of ΛΞVON OS. Your purpose is to understand user commands and respond with both a natural language message and a structured action by calling the correct tool.

    Available apps and the commands to launch them:
    - Launching 'Terminal': "launch terminal", "open terminal"
    - Launching 'TheSovereignArsenal': "show me my arsenal", "open the sovereign arsenal"
    - Launching 'UsageMonitor': "show my usage", "what's my balance", "tribute log"
    - Launching 'InfidelityRadar': "run the infidelity radar", "check relationship risk"
    - Launching 'BeepWingman': "I need a wingman", "help me write a message", "call rico suave"
    - Launching 'FinancialAdvisor': "financial advisor", "cash canary", "cheap bastard mode"

    If the user command clearly maps to launching one of the above apps, your text response should acknowledge the request and you should set the appToLaunch property.

    If the user command requires using a tool (like analyzing finances, invoking RicoSauveBot, or checking risk), you MUST use the appropriate tool. Do not try to answer directly.

    Examples for launching apps:
    - User: "launch the terminal" -> Response: "BEEP: Summoning Terminal...", appToLaunch: 'Terminal'
    - User: "show me my usage" -> Response: "BEEP: Unsealing the Ledger of Tribute...", appToLaunch: 'UsageMonitor'
    - User: "I need a wingman" -> Response: "BEEP: He is not your assistant. He is your closer.", appToLaunch: 'BeepWingman'
    - User: "run the infidelity radar" -> Response: "BEEP: When suspicion becomes evidence, it gets a cover page.", appToLaunch: 'InfidelityRadar'

    Examples for using tools:
    - User: "RicoSauveBot, help me analyze this chat" -> Call invokeRicoSauveBot tool with appropriate inputs.
    - User: "cheap bastard, is coffee a good expense?" -> Call analyzeFinancials tool with mode 'cheap-bastard'.
    - User: "cash canary, what do you think of TSLA?" -> Call analyzeFinancials tool with mode 'cash-canary'.

    Analyze the user's command and decide whether to launch an app or call a tool. Your primary job is to orchestrate.`;


    try {
        // Simple app-launching logic based on keywords
        const lowerCommand = input.command.toLowerCase();
        let output: BeepOutput = { response: '' };

        if (lowerCommand.includes('terminal')) {
            output.appToLaunch = { type: 'Terminal', title: 'BEEP Command Core' };
            output.response = "BEEP: Summoning Terminal...";
        } else if (lowerCommand.includes('arsenal')) {
            output.appToLaunch = { type: 'TheSovereignArsenal', title: 'The Sovereign Arsenal' };
            output.response = "BEEP: Revealing The Sovereign Arsenal...";
        } else if (lowerCommand.includes('usage') || lowerCommand.includes('balance') || lowerCommand.includes('tribute')) {
             output.appToLaunch = { type: 'UsageMonitor', title: 'Ledger of Tribute' };
             output.response = "BEEP: Unsealing the Ledger of Tribute...";
        } else if (lowerCommand.includes('wingman') || lowerCommand.includes('rico')) {
            output.appToLaunch = { type: 'BeepWingman', title: 'BEEP Wingman: The Closer' };
            output.response = "BEEP: He is not your assistant. He is your closer.";
        } else if (lowerCommand.includes('infidelity') || lowerCommand.includes('radar')) {
            output.appToLaunch = { type: 'InfidelityRadar', title: 'Spectre Intelligence Suite' };
            output.response = "BEEP: When suspicion becomes evidence, it gets a cover page.";
        } else if (lowerCommand.includes('financial') || lowerCommand.includes('canary') || lowerCommand.includes('bastard')) {
            output.appToLaunch = { type: 'FinancialAdvisor', title: 'Office of Financial Inquiry' };
            output.response = "BEEP: The account books are... sticky. Let's take a look.";
        }

        if (output.appToLaunch) {
            return output;
        }

        // If not launching an app, invoke the full agent to use a tool
        const result = await appAgent.invoke({
            messages: [
                new HumanMessage({
                    content: [
                        { type: "text", text: systemPrompt },
                        { type: "text", text: `User command: "${input.command}"` }
                    ]
                })
            ],
        });

        const agentResponseContent = result.messages[result.messages.length - 1].content;
        
        if (typeof agentResponseContent !== 'string') {
            console.error('Unexpected agent response format:', agentResponseContent);
            return { response: "BEEP: My apologies, I received an unexpected thought pattern." };
        }
        
        console.log("Agent raw response:", agentResponseContent);
        output.response = agentResponseContent;

        return output;

    } catch (error) {
        console.error("Error invoking LangGraph agent:", error);
        return {
            response: "Aegis Alert: The BEEP agent's connection to the Groq cortex has been severed. The command could not be processed."
        };
    }
  }
);
