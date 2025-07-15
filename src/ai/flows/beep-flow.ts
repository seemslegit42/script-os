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

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-70b-versatile",
});

// For now, the agent has no tools. This will be expanded later.
const tools: any[] = [];

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

    // Define a system prompt to guide the agent's behavior
    const systemPrompt = `You are BEEP, the agentic core of ΛΞVON OS. Your purpose is to understand user commands and respond with both a natural language message and a structured action.
    
    Available actions:
    - Launching a Micro-App. The available apps are: 'Terminal', 'TheSovereignArsenal', 'UsageMonitor'.
    
    Your response format must be a structured object. For now, you will just provide a 'response' string.
    If the user asks to launch an app, make your response acknowledge the request.
    
    Examples:
    - User command: "launch the terminal" -> Your text response: "BEEP: Summoning Terminal..."
    - User command: "show me my arsenal" -> Your text response: "BEEP: Revealing The Sovereign Arsenal..."
    - User command: "open the sovereign arsenal" -> Your text response: "BEEP: Revealing The Sovereign Arsenal..."
    - User command: "show me my usage" -> Your text response: "BEEP: Unsealing the Ledger of Tribute..."
    - User command: "what's my balance" -> Your text response: "BEEP: Unsealing the Ledger of Tribute..."
    - User command: "tribute log" -> Your text response: "BEEP: Unsealing the Ledger of Tribute..."
    - User command: "hello" -> Your text response: "BEEP: Acknowledged."
    
    Focus on generating the 'response' text. The structured action part will be handled by the calling function for now.`;


    try {
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

        // The output from the agent is in result.messages
        const agentResponseContent = result.messages[result.messages.length - 1].content;
        
        if (typeof agentResponseContent !== 'string') {
            console.error('Unexpected agent response format:', agentResponseContent);
            return { response: "BEEP: My apologies, I received an unexpected thought pattern." };
        }
        
        console.log("Agent raw response:", agentResponseContent);

        // Simple logic to determine if an app should be launched based on the response.
        // This will be replaced by structured tool calling later.
        const lowerResponse = agentResponseContent.toLowerCase();
        let output: BeepOutput = { response: agentResponseContent };

        if (lowerResponse.includes('terminal')) {
            output.appToLaunch = { type: 'Terminal', title: 'BEEP Command Core' };
        } else if (lowerResponse.includes('arsenal')) {
            output.appToLaunch = { type: 'TheSovereignArsenal', title: 'The Sovereign Arsenal' };
        } else if (lowerResponse.includes('ledger') || lowerResponse.includes('tribute')) {
             output.appToLaunch = { type: 'UsageMonitor', title: 'Ledger of Tribute' };
        } else if (lowerResponse.includes('clear')) {
            output.response = "BEEP: View cleared."
        }


        return output;

    } catch (error) {
        console.error("Error invoking LangGraph agent:", error);
        return {
            response: "Aegis Alert: The BEEP agent's connection to the Groq cortex has been severed. The command could not be processed."
        };
    }
  }
);
