// src/ai/flows/interrogate-sigil-flow.ts
'use server';

/**
 * @fileOverview A flow for interrogating a saved Sigil with a specific question.
 *
 * - interrogateSigil - A function that handles asking a question to a document.
 * - InterrogateSigilInput - The input type for the interrogateSigil function.
 * - InterrogateSigilOutput - The return type for the interrogateSigil function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterrogateSigilInputSchema = z.object({
  query: z.string().describe('The user question for the document.'),
  context: z.string().describe('The full text content of the document to be interrogated.'),
});
export type InterrogateSigilInput = z.infer<typeof InterrogateSigilInputSchema>;

const InterrogateSigilOutputSchema = z.object({
  answer: z.string().describe("The agent's answer, derived solely from the provided context."),
});
export type InterrogateSigilOutput = z.infer<typeof InterrogateSigilOutputSchema>;

export async function interrogateSigil(input: InterrogateSigilInput): Promise<InterrogateSigilOutput> {
  return interrogateSigilFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interrogateSigilPrompt',
  input: {schema: InterrogateSigilInputSchema},
  output: {schema: InterrogateSigilOutputSchema},
  prompt: `You are an archival intelligence agent within the ΛΞVON OS. Your sole purpose is to answer a user's question based *exclusively* on the provided document context.

  Do not use any external knowledge. If the answer cannot be found in the provided context, you must state that the information is not available in the document. Be concise and accurate.

  DOCUMENT CONTEXT:
  """
  {{{context}}}
  """

  USER QUESTION:
  "{{{query}}}"
  `,
});

const interrogateSigilFlow = ai.defineFlow(
  {
    name: 'interrogateSigilFlow',
    inputSchema: InterrogateSigilInputSchema,
    outputSchema: InterrogateSigilOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
