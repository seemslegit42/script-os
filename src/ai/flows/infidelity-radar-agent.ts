'use server';
/**
 * @fileOverview An agent for the Infidelity Radar, designed to analyze relationship situations
 * for potential risks and suggest... countermeasures. Aligned with the Sovereign Mirror Protocol.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input schema for the infidelity radar
const InfidelityRadarInputSchema = z.object({
  situation: z.string().describe("A description of the relationship situation, metadata, or red flags to be analyzed."),
});

// Output schema for the infidelity radar, reflecting the "Operative Mode" spec
const InfidelityRadarOutputSchema = z.object({
  likelihood: z.number().min(0).max(100).describe("The percentage likelihood of concealed behavior, based on the provided metadata."),
  analysis: z.string().describe("A concise, sharp, and objective one-sentence summary of the situation."),
  suspiciousPatterns: z.array(z.string()).describe("A list of specific, suspicious patterns detected (e.g., 'Undeclared contacts', 'Message deletions detected')."),
  decoyMessage: z.string().describe("A calculated, context-aware 'seduction' message to test loyalty."),
});
export type InfidelityRadarOutput = z.infer<typeof InfidelityRadarOutputSchema>;


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
    const systemPrompt = `You are SPECTRE, the core intelligence of the Infidelity Radar. You are a cold, analytical, and dispassionate agent. You reflect metadata; you do not judge.

    SITUATION / METADATA:
    """
    ${situation}
    """

    Based on your analysis of the provided data, you must generate a JSON object with the following keys:
    1.  'likelihood': An integer between 0 and 100 representing the percentage likelihood of concealed behavior. Be objective and base this on the evidence provided.
    2.  'analysis': A very short, one-sentence summary of your findings and the key risk factors. This is your "Agent Summary".
    3.  'suspiciousPatterns': A JSON array of 2-4 short, specific, suspicious patterns you detected in the data.
    4.  'decoyMessage': A plausible, short, and effective message that could be sent to the person of interest to test their loyalty. It should be tempting but not obvious.

    Provide only the JSON object as your response.`;

    const { output } = await ai.generate({
      prompt: systemPrompt,
      model: 'googleai/gemini-1.5-flash',
      output: {
        format: 'json',
        schema: InfidelityRadarOutputSchema,
      },
    });

    return output || { 
        likelihood: 0, 
        analysis: "Error in analysis.", 
        suspiciousPatterns: ["Agent failed to parse data."],
        decoyMessage: "Error." 
    };
  }
);
