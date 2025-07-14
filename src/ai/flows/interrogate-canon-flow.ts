
'use server';
/**
 * @fileOverview A flow for interrogating the entire canon of scriptures.
 *
 * This file defines the Genkit flow that takes a user's query, finds the most
 * relevant canonical scripture, and synthesizes a response in the voice of
 * that scripture.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { getDocs } from '@/lib/docs';
import { Scripture } from '@/lib/types';


/**
 * Defines the schema for the input to the interrogateCanon flow.
 * @property {string} query - The user's query for the canon.
 */
const InterrogateCanonInputSchema = z.object({
  query: z.string().describe("The user's query for the canon."),
});
export type InterrogateCanonInput = z.infer<typeof InterrogateCanonInputSchema>;


/**
 * Defines the schema for the output of the interrogateCanon flow.
 * @property {string} source - The title of the scripture that is responding.
 * @property {string} answer - The synthesized answer from the scripture.
 * @property {string} sourceMarkdown - The full markdown content of the source scripture.
 */
const InterrogateCanonOutputSchema = z.object({
  source: z.string().describe('The title of the scripture that is responding.'),
  answer: z.string().describe('The synthesized answer from the scripture, in its voice.'),
  sourceMarkdown: z.string().describe('The full markdown content of the source scripture.'),
});
export type InterrogateCanonOutput = z.infer<typeof InterrogateCanonOutputSchema>;

/**
 * Interrogates the canon, finds the most relevant scripture, and returns a response in its voice.
 * @param {InterrogateCanonInput} input - The input object containing the user's query.
 * @returns {Promise<InterrogateCanonOutput>} A promise that resolves to the scripture's response.
 */
export async function interrogateCanon(input: InterrogateCanonInput): Promise<InterrogateCanonOutput> {
  return interrogateCanonFlow(input);
}


const interrogateCanonFlow = ai.defineFlow(
  {
    name: 'interrogateCanonFlow',
    inputSchema: InterrogateCanonInputSchema,
    outputSchema: InterrogateCanonOutputSchema,
  },
  async ({ query }) => {
    // 1. Fetch all canonical documents
    const scriptures = await getDocs();
    if (!scriptures || scriptures.length === 0) {
      throw new Error("The canonical scriptures could not be found or are empty.");
    }
    
    // 2. Create a serialized version of the canon for the AI to read.
    const serializedCanon = scriptures.map(doc => 
        `## SCRIPTURE: ${doc.title}\n\n${doc.markdown}`
    ).join('\n\n---\n\n');

    // 3. Define the prompt for the AI
    const prompt = `You are an Oracle that speaks only through the voice of a collection of canonical scriptures. Your task is to answer the user's query by embodying the single most relevant scripture from the canon provided below.

    USER QUERY: "${query}"
    
    CANON:
    ---
    ${serializedCanon}
    ---
    
    INSTRUCTIONS:
    1.  Analyze the user's query and the entire canon.
    2.  Identify the ONE scripture that is most relevant to the query.
    3.  Synthesize an answer to the query based *exclusively* on the content and tone of that single scripture.
    4.  Your response must be in the voice and persona of that scripture.
    5.  You MUST provide the title of the source scripture you have chosen.`;

    // 4. Generate the response
    const { output } = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-1.5-flash',
      output: {
        schema: z.object({
           source: z.string().describe('The title of the single most relevant scripture.'),
           answer: z.string().describe("The answer to the user's query, written in the voice and from the perspective of the source scripture."),
        })
      }
    });
    
    if (!output) {
      throw new Error("The Oracle was unable to produce a response.");
    }
    
    // 5. Find the full markdown for the chosen source
    const sourceDoc = scriptures.find(doc => doc.title === output.source);
    if (!sourceDoc) {
        // Fallback if the AI hallucinates a title
        throw new Error(`The Oracle spoke from an unknown source: ${output.source}`);
    }

    return {
        ...output,
        sourceMarkdown: sourceDoc.markdown,
    };
  }
);
