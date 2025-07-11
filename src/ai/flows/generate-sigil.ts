// src/ai/flows/generate-sigil.ts
'use server';

/**
 * @fileOverview A flow for generating a Living Sigil on demand using a conversational interface.
 *
 * - generateSigil - A function that handles the generation of a Living Sigil based on a user query.
 * - GenerateSigilInput - The input type for the generateSigil function.
 * - GenerateSigilOutput - The return type for the generateSigil function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSigilInputSchema = z.object({
  query: z.string().describe('The user query for generating the Living Sigil.'),
});
export type GenerateSigilInput = z.infer<typeof GenerateSigilInputSchema>;

const GenerateSigilOutputSchema = z.object({
  sigilContent: z.string().describe('The generated content of the Living Sigil.'),
});
export type GenerateSigilOutput = z.infer<typeof GenerateSigilOutputSchema>;

export async function generateSigil(input: GenerateSigilInput): Promise<GenerateSigilOutput> {
  return generateSigilFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSigilPrompt',
  input: {schema: GenerateSigilInputSchema},
  output: {schema: GenerateSigilOutputSchema},
  prompt: `You are a Scribe Agent that generates Living Sigils on demand. A Living Sigil is a tailored explanation tool synthesized from relevant information based on a user query.

  Query: {{{query}}}

  Generate a Living Sigil that directly addresses the query, providing a comprehensive and unified explanation.
  Ensure the Living Sigil is well-structured, easy to understand, and perfectly tailored to the user's needs.
  The Living Sigil should be structured as a single string of text.
  The Living Sigil MUST NOT contain any invalid XML syntax.
  Do not include any image tags.
  Be as detailed as possible, and ensure the explanation is thorough.
  `,
});

const generateSigilFlow = ai.defineFlow(
  {
    name: 'generateSigilFlow',
    inputSchema: GenerateSigilInputSchema,
    outputSchema: GenerateSigilOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
