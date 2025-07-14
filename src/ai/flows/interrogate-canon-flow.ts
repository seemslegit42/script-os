
'use server';
/**
 * @fileOverview A flow for interrogating the canon using Retrieval-Augmented Generation (RAG).
 *
 * This file defines the Genkit flow that takes a user's query, finds the most
 * relevant canonical scriptures from a vector database, and synthesizes a response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { embed } from 'genkit/ai';
import { textEmbedding004 } from '@genkit-ai/googleai';
import { Firestore, FieldValue } from '@google-cloud/firestore';


// Define the structure of a document in our vector collection
const ScriptureVectorSchema = z.object({
    text: z.string(),
    title: z.string(),
    docId: z.string(),
  });
type ScriptureVector = z.infer<typeof ScriptureVectorSchema>;
  
let db: Firestore;

function getDb() {
    if (!db) {
        // Check for emulator environment
        if (process.env.FIRESTORE_EMULATOR_HOST) {
            console.log(`Connecting to Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
            db = new Firestore({
                host: process.env.FIRESTORE_EMULATOR_HOST,
                projectId: process.env.GCP_PROJECT_ID || 'demo-project', // Default project for emulator
                ssl: false,
            });
        } else {
            console.log('Connecting to production Firestore.');
            db = new Firestore({
                projectId: process.env.GCP_PROJECT_ID!,
                credentials: {
                  client_email: process.env.GCP_CLIENT_EMAIL!,
                  private_key: process.env.GCP_PRIVATE_KEY!.replace(/\\n/g, '\n'),
                },
            });
        }
    }
    return db;
}
  

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
    // 1. Generate an embedding for the user's query
    const queryEmbedding = await embed({
        embedder: textEmbedding004,
        content: query,
    });
    
    // 2. Perform a vector search to find the most relevant documents
    const firestoreDb = getDb();
    const scripturesCollection = firestoreDb.collection('scriptures');
    const vectorQuery = scripturesCollection.findNearest('embedding', FieldValue.vector(queryEmbedding), {
        limit: 5,
        distanceMeasure: 'COSINE',
    });
    const searchResult = await vectorQuery.get();

    const relevantDocs = searchResult.docs.map(doc => doc.data() as ScriptureVector);
    
    if (!relevantDocs || relevantDocs.length === 0) {
      throw new Error("The Oracle's memory found nothing relevant to your query.");
    }
    
    // 3. Create a serialized version of the retrieved context for the AI.
    const serializedContext = relevantDocs.map(doc => 
        `## SCRIPTURE: ${doc.title}\n\n${doc.text}`
    ).join('\n\n---\n\n');

    // 4. Define the prompt for the AI to select a source and synthesize an answer
    const synthesisPrompt = `You are an Oracle that speaks through the voice of a specific canonical scripture. Your task is to answer the user's query by embodying the persona of the most relevant scripture from the provided context.

    CONTEXT:
    ---
    ${serializedContext}
    ---

    USER QUERY: "${query}"
    
    INSTRUCTIONS:
    1.  Read the user's query and the entire context provided.
    2.  First, determine which SINGLE scripture from the context is the most relevant and authoritative source for answering the query. This scripture's "voice" and "persona" you will adopt.
    3.  Synthesize a comprehensive answer to the query. You may draw knowledge from any part of the provided context to form your answer, but your tone, style, and perspective must be that of the primary source scripture you identified.
    4.  Begin your response with a special marker: "SOURCE: [The Exact Title of the Scripture You Are Embodying]".
    5.  Following the marker, provide your synthesized answer. Do not mention the scripture's title again. Just provide the answer.`;


    // 5. Generate the response as a stream
    const { stream } = ai.generateStream({
      prompt: synthesisPrompt,
      model: 'googleai/gemini-1.5-flash',
    });

    let fullResponse = '';
    let sourceDoc: ScriptureVector | undefined;
    let answerStarted = false;
    let answer = '';

    for await (const chunk of stream) {
        fullResponse += chunk;

        if (!sourceDoc) {
            const sourceMatch = fullResponse.match(/^SOURCE:\s*(.*)/);
            if (sourceMatch && sourceMatch[1]) {
                const sourceTitle = sourceMatch[1].trim();
                sourceDoc = relevantDocs.find(doc => doc.title === sourceTitle);
                if (sourceDoc) {
                    const restOfChunk = fullResponse.substring(sourceMatch[0].length).trim();
                    if (restOfChunk) {
                        answerStarted = true;
                        answer += restOfChunk;
                    }
                }
            }
        } else if (!answerStarted) {
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
              sourceMarkdown: sourceDoc.text,
            };
        }
    }
     // Final yield in case the last chunk completes the answer.
     if (sourceDoc && answerStarted) {
        yield {
            source: sourceDoc.title,
            answer: answer,
            sourceMarkdown: sourceDoc.text,
        };
    } else if (!sourceDoc) {
        // Fallback if the AI fails to provide a SOURCE marker
        const fallbackSource = relevantDocs[0] || { title: 'Unknown Scripture', text: 'No content available.' };
        yield {
            source: fallbackSource.title,
            answer: fullResponse.trim() || "The Oracle chose to remain silent on this matter.",
            sourceMarkdown: fallbackSource.text,
        };
    }
  }
);
