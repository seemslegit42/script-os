
'use server';

import { interrogateCanon, InterrogateCanonOutput } from '@/ai/flows/interrogate-canon-flow';
import { generateSpeech } from '@/ai/flows/generate-speech-flow';
import { marked } from 'marked';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { redirect } from 'next/navigation';

/**
 * Represents a single message in the conversation.
 * @property {'user' | 'agent'} role - The speaker of the message.
 * @property {string} content - The text content of the message.
 * @property {string} [sourceTitle] - The title of the scripture that spoke.
 * @property {string} [sourceMarkdown] - The full markdown of the source scripture.
 * @property {string | null} [audioUrl] - The data URI for the generated speech audio.
 * @property {boolean} [isThinking] - True if this is a temporary message indicating the agent is processing.
 * @property {boolean} [isError] - True if this message represents an error.
 */
export type ConversationMessage = {
  role: 'user' | 'agent';
  content: string;
  sourceTitle?: string;
  sourceMarkdown?: string;
  audioUrl?: string | null;
  isThinking?: boolean;
  isError?: boolean;
};

/**
 * Represents the entire state of the conversation.
 * @property {ConversationMessage[]} conversation - The array of messages in the conversation history.
 * @property {string | null} error - An error message, if any occurred.
 */
export type ConversationState = {
  conversation: ConversationMessage[];
  error: string | null;
};

/**
 * A Genkit flow that replaces the server action to handle streaming.
 * It streams the AI's response back to the client.
 * @param {string} query - The user's query.
 * @returns {AsyncGenerator<ConversationMessage>} A stream of conversation messages.
 */
export const unifiedConversationAction = ai.defineFlow(
  {
    name: 'unifiedConversationAction',
    inputSchema: z.string(),
    outputSchema: z.any(),
    stream: true,
  },
  async function* (query) {
    try {
      const stream = interrogateCanon({ query });
      let finalResult: InterrogateCanonOutput | null = null;
      
      for await (const chunk of stream) {
        finalResult = chunk;
        yield {
          role: 'agent',
          content: marked.parse(chunk.answer),
          sourceTitle: chunk.source,
          sourceMarkdown: chunk.sourceMarkdown,
          audioUrl: null, // Audio will be generated after the stream is complete
        };
      }

      if (!finalResult) {
        throw new Error("The Oracle's stream yielded no response.");
      }
      
      // Now that the text stream is complete, generate the audio
      const speech = await generateSpeech({ text: finalResult.answer, context: finalResult.source });

      // Yield a final message with the audioUrl
      yield {
        role: 'agent',
        content: marked.parse(finalResult.answer),
        sourceTitle: finalResult.source,
        sourceMarkdown: finalResult.sourceMarkdown,
        audioUrl: speech.audioUrl,
      };


    } catch (e: any) {
      console.error(e);
      const errorMessage = e.message || 'An unknown error occurred.';
      yield {
        role: 'agent',
        content: `An error occurred: ${errorMessage}`,
        isError: true,
      };
    }
  }
);


/**
 * Server action to handle user sign-out.
 * In a real application, this would clear the session cookie or token.
 * For now, it just redirects to the login page.
 */
export async function signOut() {
  // In a real app: await clearSessionCookie();
  redirect('/login');
}
