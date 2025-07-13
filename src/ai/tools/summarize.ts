
// src/ai/tools/summarize.ts
'use server';
/**
 * @fileOverview A tool for summarizing a document.
 * This file defines a Genkit tool that can be used by an AI agent to generate
 * a concise summary of a given text.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeInputSchema = z.object({
  document: z.string().describe('The document content to be summarized.'),
});

const SummarizeOutputSchema = z.string().describe('The generated summary.');

export const summarizeDocumentTool = ai.defineTool(
  {
    name: 'summarizeDocumentTool',
    description: 'Generates a concise summary of a provided document.',
    inputSchema: SummarizeInputSchema,
    outputSchema: SummarizeOutputSchema,
  },
  async ({ document }) => {
    const { output } = await ai.generate({
      prompt: `Provide a concise, detailed summary of the following document. Capture the key points and main arguments.\n\nDOCUMENT:\n${document}`,
      model: 'googleai/gemini-1.5-flash',
    });
    return output?.text || 'Summary could not be generated.';
  }
);
