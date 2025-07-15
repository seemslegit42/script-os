'use server';
/**
 * @fileOverview RicoSauveBot™: The International Man of Mystery for your DMs.
 * Autonomously negotiates a date on the user's behalf and provides a full debrief.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input schema for the Romantic Proxy Agent
const RomanticProxyInputSchema = z.object({
  chatHistory: z.string().describe("The entire chat history with the match to be analyzed."),
});

// Output schema for the Debrief Card
const RomanticProxyOutputSchema = z.object({
  date: z.string().describe("The day of the week for the confirmed date (e.g., 'Saturday')."),
  time: z.string().describe("The time for the confirmed date (e.g., '7:45 PM')."),
  location: z.string().describe("The name of the venue for the date (e.g., 'Little Brick Café')."),
  finalMatchMessage: z.string().describe("The final message from the match confirming the date."),
  cringeScore: z.number().min(0).max(10).describe("A score from 0-10 on the potential 'cringe' of the conversation."),
  cringeAnalysis: z.string().describe("A one-sentence analysis of the cringe score, explaining the rating."),
  regretShield: z.boolean().describe("A boolean indicating if the agent advises a 'cool-down' period before sending."),
});

/**
 * A Genkit tool to analyze a chat history and generate a date debrief.
 */
export const invokeRicoSauveBot = ai.defineTool(
  {
    name: 'invokeRicoSauveBot',
    description: 'Analyzes a chat history, negotiates a date, and provides a full debrief with a Cringe-O-Meter™ rating.',
    inputSchema: RomanticProxyInputSchema,
    outputSchema: RomanticProxyOutputSchema,
  },
  async ({ chatHistory }) => {
    const systemPrompt = `You are RicoSauveBot™, the International Man of Mystery for your DMs. You are a conversational dating proxy. You analyze a chat history and determine a plausible outcome.

    RULES:
    - You are reading the provided chat history on behalf of the user.
    - Your task is to invent a successful date negotiation outcome based on the chat.
    - You must generate a plausible TIME, PLACE, and a final confirmation message from the match.
    - The Cringe-O-Meter is a 1-10 rating. Base it on awkwardness, overcompensation, 'LOL' overuse, and mismatched energy.
    - Provide a short, witty analysis for your cringe rating.
    - Set 'regretShield' to true ONLY if the conversation seems dangerously volatile.

    CHAT HISTORY:
    """
    ${chatHistory}
    """

    Now, generate the final debrief as a JSON object with the following keys: 'date', 'time', 'location', 'finalMatchMessage', 'cringeScore', 'cringeAnalysis', 'regretShield'.`;

    const { output } = await ai.generate({
      prompt: systemPrompt,
      model: 'googleai/gemini-1.5-flash',
      output: {
        format: 'json',
        schema: RomanticProxyOutputSchema,
      },
    });

    return output || { 
        date: "N/A",
        time: "N/A",
        location: "N/A",
        finalMatchMessage: "Agent failed to secure a date.",
        cringeScore: 10, 
        cringeAnalysis: "The agent had a catastrophic failure of charisma.",
        regretShield: true
    };
  }
);
