
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
    outputSchema: z.any(), // We stream a complex object
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

    // 3. Define the prompt for the AI to select a source and synthesize an answer
    const synthesisPrompt = `You are an Oracle that speaks through the voice of a specific canonical scripture. Your task is to answer the user's query by embodying the persona of the most relevant scripture from the provided canon.

    CANON:
    ---
    ${serializedCanon}
    ---

    USER QUERY: "${query}"
    
    INSTRUCTIONS:
    1.  Read the user's query and the entire canon provided.
    2.  First, determine which SINGLE scripture is the most relevant and authoritative source for answering the query. This scripture's "voice" and "persona" you will adopt.
    3.  Synthesize a comprehensive answer to the query. You may draw knowledge from any part of the canon to form your answer, but your tone, style, and perspective must be that of the primary source scripture you identified.
    4.  Begin your response with a special marker: "SOURCE: [The Exact Title of the Scripture You Are Embodying]".
    5.  Following the marker, provide your synthesized answer. Do not mention the scripture's title again. Just provide the answer.`;


    // 5. Generate the response as a stream
    const { stream } = ai.generateStream({
      prompt: synthesisPrompt,
      model: 'googleai/gemini-1.5-flash',
    });

    let fullResponse = '';
    let sourceDoc: Scripture | undefined;
    let answerStarted = false;
    let answer = '';

    for await (const chunk of stream) {
        fullResponse += chunk;

        if (!sourceDoc) {
            const sourceMatch = fullResponse.match(/^SOURCE:\s*(.*)/);
            if (sourceMatch && sourceMatch[1]) {
                const sourceTitle = sourceMatch[1].trim();
                sourceDoc = scriptures.find(doc => doc.title === sourceTitle);
                if (sourceDoc) {
                    // Check if there is any answer content after the source marker in the current chunk
                    const restOfChunk = fullResponse.substring(sourceMatch[0].length).trim();
                    if (restOfChunk) {
                        answerStarted = true;
                        answer += restOfChunk;
                    }
                }
            }
        } else if (!answerStarted) {
            // This case handles the transition right after the source is found.
            // The rest of the first chunk containing the source is the beginning of the answer.
            const potentialAnswer = fullResponse.substring(`SOURCE: ${sourceDoc.title}`.length).trim();
            if (potentialAnswer) {
                answerStarted = true;
                answer = potentialAnswer;
            }
        } else {
            answer += chunk;
        }

        if (sourceDoc && answerStarted) {
            yield {
              source: sourceDoc.title,
              answer: answer, 
              sourceMarkdown: sourceDoc.markdown,
            };
        }
    }
     // Final yield in case the last chunk completes the answer.
     if (sourceDoc && answerStarted) {
        yield {
            source: sourceDoc.title,
            answer: answer,
            sourceMarkdown: sourceDoc.markdown,
        };
    } else if (!sourceDoc) {
        // Fallback if the AI fails to provide a SOURCE marker
        // We'll use the full response and a default source.
        const fallbackSource = scriptures[0] || { title: 'Unknown Scripture', markdown: 'No content available.' };
        yield {
            source: fallbackSource.title,
            answer: fullResponse.trim() || "The Oracle chose to remain silent on this matter.",
            sourceMarkdown: fallbackSource.markdown,
        };
    }
  }
);
