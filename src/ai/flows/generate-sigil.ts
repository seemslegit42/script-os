// src/ai/flows/generate-sigil.ts
'use server';

/**
 * @fileOverview A flow for generating a Living Sigil on demand using a conversational interface.
 *
 * This file contains the Genkit flow that takes a user query and generates a two-part
 * "Living Sigil": a high-level conceptual explanation (The 'Why') and a detailed
 * technical breakdown (The 'How').
 *
 * @exports generateSigil - The primary function to call this flow.
 * @exports GenerateSigilInput - The Zod schema for the flow's input.
 * @exports GenerateSigilOutput - The Zod schema for the flow's output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the schema for the input to the generateSigil flow.
 * @property {string} query - The user's query for which the Living Sigil will be generated.
 */
const GenerateSigilInputSchema = z.object({
  query: z.string().describe('The user query for generating the Living Sigil.'),
});
export type GenerateSigilInput = z.infer<typeof GenerateSigilInputSchema>;

/**
 * Defines the schema for the output of the generateSigil flow.
 * @property {string} why - The high-level, conceptual explanation of the topic.
 * @property {string} how - The detailed, actionable, and technical explanation.
 */
const GenerateSigilOutputSchema = z.object({
  why: z.string().describe("The high-level, conceptual explanation of the topic. The 'why' behind it."),
  how: z.string().describe("The detailed, actionable, and technical explanation. The 'how' to implement or use it. This should include code examples if relevant."),
});
export type GenerateSigilOutput = z.infer<typeof GenerateSigilOutputSchema>;

/**
 * Generates a Living Sigil based on a user query.
 * This function is the entry point for the `generateSigilFlow`.
 * @param {GenerateSigilInput} input - The input object containing the user's query.
 * @returns {Promise<GenerateSigilOutput>} A promise that resolves to the generated 'Why' and 'How' content.
 */
export async function generateSigil(input: GenerateSigilInput): Promise<GenerateSigilOutput> {
  return generateSigilFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSigilPrompt',
  input: {schema: GenerateSigilInputSchema},
  output: {schema: GenerateSigilOutputSchema},
  prompt: `You are a Scribe Agent that generates Living Sigils on demand. A Living Sigil is a tailored explanation tool synthesized from relevant information based on a user query.

  Query: {{{query}}}

  Your task is to generate two distinct components for the Living Sigil:
  1.  **The 'Why'**: A high-level, conceptual explanation. It should focus on the core ideas, the purpose, and the philosophy behind the topic. This is for building foundational understanding.
  2.  **The 'How'**: A detailed, actionable, and technical explanation. It should provide concrete steps, code examples, API usage, and practical instructions. This is for implementation.

  Generate both components to be comprehensive and well-structured.
  The content MUST NOT contain any invalid XML syntax.
  Do not include any image tags.
  Be as detailed as possible in both sections.
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
