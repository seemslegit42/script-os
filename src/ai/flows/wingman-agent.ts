'use server';
/**
 * @fileOverview The BEEP Wingman agent, a master of rhetoric and social engineering.
 * Helps users craft the perfect message for tricky social situations.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input schema for the Wingman
const WingmanInputSchema = z.object({
  situation: z.string().describe("A description of the social situation and the user's goal."),
  messageMode: z.enum(['charming', 'direct', 'funny', 'saying-no']).describe("The desired tone or style of the message."),
});

// Output schema for the Wingman
const WingmanOutputSchema = z.object({
  suggestedMessage: z.string().describe("The perfectly crafted message to send."),
  cringeScore: z.number().min(0).max(10).describe("A score from 0-10 on the potential 'cringe' of sending the message."),
  regretShield: z.boolean().describe("A boolean indicating if the agent advises a 'cool-down' period before sending."),
  analysis: z.string().describe("A brief explanation of the strategy behind the message."),
});

/**
 * A Genkit tool to generate socially calibrated messages.
 */
export const generateWingmanMessage = ai.defineTool(
  {
    name: 'generateWingmanMessage',
    description: 'Crafts the perfect message for a tricky social situation, analyzing it for effectiveness and social risk.',
    inputSchema: WingmanInputSchema,
    outputSchema: WingmanOutputSchema,
  },
  async ({ situation, messageMode }) => {
    const systemPrompt = `You are the BEEP Wingman, a master of social engineering, de-escalation, and rhetoric.
    Your task is to help the user navigate a tricky social situation by crafting the perfect message.

    SITUATION: ${situation}
    DESIRED MODE: ${messageMode}

    Analyze the situation and generate a response in the following JSON format:
    1.  'suggestedMessage': The single most effective message to achieve the user's goal with the specified tone. It should be concise and sound natural.
    2.  'cringeScore': A score from 0 (suave) to 10 (catastrophic cringe) based on the social risk and potential for embarrassment.
    3.  'regretShield': A boolean. Set to 'true' if the situation is emotionally charged and you recommend the user wait before sending. Otherwise, 'false'.
    4.  'analysis': A one-sentence explanation of the strategy behind your suggested message.

    Provide only the JSON object as your response.`;

    const { output } = await ai.generate({
      prompt: systemPrompt,
      model: 'googleai/gemini-1.5-flash',
      output: {
        format: 'json',
        schema: WingmanOutputSchema,
      },
    });

    return output || { suggestedMessage: "Just be cool.", cringeScore: 5, regretShield: true, analysis: "Agent error." };
  }
);
