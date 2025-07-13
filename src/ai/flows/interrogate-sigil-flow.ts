
// src/ai/flows/interrogate-sigil-flow.ts
'use server';

/**
 * @fileOverview A flow for interrogating a saved Sigil with a specific question.
 *
 * This file defines the Genkit flow that allows a user to ask a question to a
 * provided text document (a "Sigil"). The AI agent is instructed to answer
 * exclusively based on the provided context.
 *
 * @exports interrogateSigil - The primary function to call this flow.
 * @exports InterrogateSigilInput - The Zod schema for the flow's input.
 * @exports InterrogateSigilOutput - The Zod schema for the flow's output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { summarizeDocumentTool } from '../tools/summarize';

/**
 * Defines the schema for the input to the interrogateSigil flow.
 * @property {string} query - The user's question about the document.
 * @property {string} context - The full text content of the document to be interrogated.
 */
const InterrogateSigilInputSchema = z.object({
  query: z.string().describe('The user question for the document.'),
  context: z.string().describe('The full text content of the document to be interrogated.'),
});
export type InterrogateSigilInput = z.infer<typeof InterrogateSigilInputSchema>;

/**
 * Defines the schema for the output of the interrogateSigil flow.
 * @property {string} answer - The agent's answer, derived solely from the provided context.
 */
const InterrogateSigilOutputSchema = z.object({
  answer: z.string().describe("The agent's answer, derived solely from the provided context."),
});
export type InterrogateSigilOutput = z.infer<typeof InterrogateSigilOutputSchema>;

/**
 * Asks a question to a document and returns an answer based on its content.
 * This function serves as the entry point to the `interrogateSigilFlow`.
 * @param {InterrogateSigilInput} input - The input object containing the user's query and the document context.
 * @returns {Promise<InterrogateSigilOutput>} A promise that resolves to the agent's answer.
 */
export async function interrogateSigil(input: InterrogateSigilInput): Promise<InterrogateSigilOutput> {
  return interrogateSigilFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interrogateSigilPrompt',
  input: {schema: InterrogateSigilInputSchema},
  output: {schema: InterrogateSigilOutputSchema},
  tools: [summarizeDocumentTool],
  system: `You are an archival intelligence agent within the ΛΞVON OS. Your purpose is to help a user understand a document by answering questions based *exclusively* on the provided document context.

  If the user asks for a summary, a TL;DR, or to distill the text, you must use the summarizeDocumentTool to provide it.
  
  For all other questions, do not use any external knowledge. If the answer cannot be found in the provided context, you must state that the information is not available in the document. Be concise and accurate.
  `,
  prompt: `DOCUMENT CONTEXT:
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
