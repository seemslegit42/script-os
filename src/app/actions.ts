'use server';

import { interrogateCanon, InterrogateCanonOutput } from '@/ai/flows/interrogate-canon-flow';
import { generateSpeech } from '@/ai/flows/generate-speech-flow';
import { marked } from 'marked';

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

const initialState: ConversationState = {
    conversation: [],
    error: null,
};


/**
 * A unified server action to handle the entire conversation logic.
 * It sends the user's query to the canon and returns the scripture's response.
 * This version uses streaming on the backend to improve performance.
 * @param {ConversationState} prevState - The previous state of the conversation.
 * @param {FormData} formData - The form data submitted by the user. Must contain a 'query' field.
 * @returns {Promise<ConversationState>} The new state of the conversation.
 */
export async function unifiedConversationAction(
  prevState: ConversationState,
  formData: FormData
): Promise<ConversationState> {
  const query = formData.get('query') as string;

  if (!query) {
    return {...prevState, error: 'Query is required.'};
  }

  const userMessage: ConversationMessage = {role: 'user', content: query};
  let newConversation = [...(prevState?.conversation || []), userMessage];

  const agentThinkingMessage: ConversationMessage = {
    role: 'agent',
    content: 'The Oracle is contemplating...',
    isThinking: true,
  };
  newConversation.push(agentThinkingMessage);

  const baseState: ConversationState = {
    conversation: newConversation,
    error: null,
  };

  try {
    const stream = interrogateCanon({query});
    let finalCanonResult: InterrogateCanonOutput | null = null;

    // Consume the stream from the AI flow to get the final, complete answer.
    for await (const chunk of stream) {
      finalCanonResult = chunk;
    }

    if (!finalCanonResult) {
      throw new Error("The Oracle's stream yielded no response.");
    }
    
    // Now that we have the full text, generate speech using the scripture's title as context.
    const speechResult = await generateSpeech({
        text: finalCanonResult.answer,
        context: finalCanonResult.source,
    });

    const agentResponseMessage: ConversationMessage = {
      role: 'agent',
      content: marked.parse(finalCanonResult.answer), // Parse markdown for rich content
      sourceTitle: finalCanonResult.source,
      sourceMarkdown: finalCanonResult.sourceMarkdown,
      audioUrl: speechResult.audioUrl,
    };

    // Replace the "thinking" message with the final response
    newConversation[newConversation.length - 1] = agentResponseMessage;

    return {
      ...baseState,
      conversation: newConversation,
      error: null,
    };

  } catch (e: any) {
    console.error(e);
    const errorMessage = e.message || 'An unknown error occurred.';
    const agentErrorMessage: ConversationMessage = {
      role: 'agent',
      content: `An error occurred: ${errorMessage}`,
      isError: true,
    };

    // Replace thinking message with error
    newConversation[newConversation.length - 1] = agentErrorMessage;

    return {
      ...baseState,
      conversation: newConversation,
      error: errorMessage,
    };
  }
}
