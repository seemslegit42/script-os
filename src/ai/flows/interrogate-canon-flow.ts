
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
 * Interrogates the canon, finds the most relevant scripture, and returns a stream of the response.
 * @param {InterrogateCanonInput} input - The input object containing the user's query.
 * @returns {AsyncGenerator<InterrogateCanonOutput>} An async generator that yields the complete response object.
 */
export async function* interrogateCanon(input: InterrogateCanonInput): AsyncGenerator<InterrogateCanonOutput> {
  yield* interrogateCanonFlow(input);
}

const interrogateCanonFlow = ai.defineFlow(
  {
    name: 'interrogateCanonFlow',
    inputSchema: InterrogateCanonInputSchema,
    outputSchema: z.string(), // We stream string chunks
    stream: true, // Enable streaming for this flow
  },
  async function* ({ query }) {
    // 1. Fetch all canonical documents
    const scriptures = await getDocs();
    if (!scriptures || scriptures.length === 0) {
      throw new Error("The canonical scriptures could not be found or are empty.");
    }
    
    // 2. Create a serialized version of the canon for the AI to read.
    const serializedCanon = scriptures.map(doc => 
        `## SCRIPTURE: ${doc.title}\n\n${doc.markdown}`
    ).join('\n\n---\n\n');

    // 3. Define the prompt for the AI to select a source
    const sourceSelectionPrompt = `You are an Oracle's librarian. Your task is to select the single most relevant scripture from the provided canon to answer the user's query. Respond ONLY with the title of the scripture.

    USER QUERY: "${query}"
    
    CANON TITLES:
    ---
    ${scriptures.map(s => s.title).join('\n')}
    ---
    
    INSTRUCTIONS:
    1.  Analyze the user's query and the list of scripture titles.
    2.  Identify the ONE scripture that is most relevant to the query.
    3.  Respond with the exact title of that single scripture and nothing else.`;

    const sourceSelectionResponse = await ai.generate({
      prompt: sourceSelectionPrompt,
      model: 'googleai/gemini-1.5-flash',
    });

    const sourceTitle = sourceSelectionResponse.text.trim();
    const sourceDoc = scriptures.find(doc => doc.title === sourceTitle);

    if (!sourceDoc) {
        throw new Error(`The Oracle's librarian chose an unknown source: ${sourceTitle}`);
    }

    // 4. Define the synthesis prompt using only the chosen scripture
    const synthesisPrompt = `You are an Oracle that speaks through the voice of a specific canonical scripture. Your task is to answer the user's query by embodying the provided scripture.

    USER QUERY: "${query}"

    SCRIPTURE: "${sourceDoc.title}"
    ---
    ${sourceDoc.markdown}
    ---
    
    INSTRUCTIONS:
    1.  Read the user's query and the provided scripture.
    2.  Synthesize an answer to the query based *exclusively* on the content and tone of this scripture.
    3.  Your response must be in the voice and persona of the scripture.
    4.  DO NOT mention the scripture's title in your response. Just provide the answer.`;


    // 5. Generate the response as a stream
    const { stream } = ai.generateStream({
      prompt: synthesisPrompt,
      model: 'googleai/gemini-1.5-flash',
    });

    let fullAnswer = '';
    for await (const chunk of stream) {
        fullAnswer += chunk;
        // Yielding the full object on each chunk to the server action
        // The server action will collect these before updating the client
        yield {
          source: sourceDoc.title,
          answer: fullAnswer, 
          sourceMarkdown: sourceDoc.markdown,
        };
    }
  }
);
