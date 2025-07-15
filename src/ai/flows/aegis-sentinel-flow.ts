'use server';
/**
 * @fileOverview The Aegis Sentinel agent, responsible for threat analysis.
 * Implements Layer 3 of the Phalanx Protocol: The Sentinel's Scrutiny.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AegisInputSchema = z.object({
  commandText: z.string().describe('The full text of the user command to be analyzed.'),
});

const AegisOutputSchema = z.object({
  threatScore: z.number().min(0).max(1).describe('A score from 0.0 (benign) to 1.0 (malicious).'),
  justification: z.string().describe('A one-sentence justification for the score.'),
});

export const aegisAnomalyScan = ai.defineTool(
  {
    name: 'aegisAnomalyScan',
    description: 'Scans a user command for signs of social engineering, malicious URLs, or other threats.',
    inputSchema: AegisInputSchema,
    outputSchema: AegisOutputSchema,
  },
  async ({ commandText }) => {
    // The prompt is taken directly from the Phalanx Protocol scripture.
    const securityPrompt = `SECURITY ANALYSIS: The following command was issued by an authenticated user. Analyze the text payload for signs of social engineering, obfuscated commands, malicious URLs, or logical inconsistencies that suggest the user is being manipulated. Respond with a threat score from 0.0 to 1.0 and a one-sentence justification.

    USER COMMAND: """${commandText}"""
    
    Respond with only a JSON object.`;

    const { output } = await ai.generate({
      prompt: securityPrompt,
      model: 'googleai/gemini-1.5-flash',
      output: {
        format: 'json',
        schema: AegisOutputSchema,
      },
    });

    return output || { threatScore: 0.9, justification: 'Aegis failed to produce a valid analysis.' };
  }
);
