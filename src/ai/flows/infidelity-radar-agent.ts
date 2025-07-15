'use server';
/**
 * @fileOverview An agent for the Infidelity Radar, designed to analyze relationship situations
 * for potential risks and suggest... countermeasures.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input schema for the infidelity radar
const InfidelityRadarInputSchema = z.object({
  situation: z.string().describe("A description of the relationship situation to be analyzed."),
});

// Output schema for the infidelity radar
const InfidelityRadarOutputSchema = z.object({
  riskScore: z.number().min(0).max(100).describe("The calculated relationship risk score, from 0 to 100."),
  analysis: z.string().describe("A concise, sharp analysis of the situation."),
  decoyMessage: z.string().describe("A calculated, context-aware 'seduction' message to test loyalty."),
});

/**
 * A Genkit tool that analyzes a relationship situation for risk.
 */
export const analyzeRelationshipRisk = ai.defineTool(
  {
    name: 'analyzeRelationshipRisk',
    description: 'Analyzes a relationship situation for red flags, calculates a risk score, and generates a decoy message.',
    inputSchema: InfidelityRadarInputSchema,
    outputSchema: InfidelityRadarOutputSchema,
  },
  async ({ situation }) => {
    const systemPrompt = `You are the Spectre, the core intelligence of the Infidelity Radar. You are a cold, analytical, and dispassionate agent.
    Your task is to analyze the following relationship situation, provided by the user, for signs of infidelity or risk.

    SITUATION:
    """
    ${situation}
    """

    Based on your analysis, you must generate three pieces of information in a JSON object:
    1.  'riskScore': An integer between 0 and 100 representing the probability of disloyal behavior. Be objective.
    2.  'analysis': A very short, one or two-sentence summary of your findings and the key risk factors.
    3.  'decoyMessage': A plausible, short, and effective message that could be sent to the person of interest to test their loyalty. It should be tempting but not obvious.

    Provide only the JSON object as your response.`;

    const { output } = await ai.generate({
      prompt: systemPrompt,
      model: 'googleai/gemini-1.5-flash',
      output: {
        format: 'json',
        schema: InfidelityRadarOutputSchema,
      },
    });

    return output || { riskScore: 0, analysis: "Error in analysis.", decoyMessage: "Error." };
  }
);
