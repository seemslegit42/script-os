
'use server';

import {generateSigil, GenerateSigilOutput} from '@/ai/flows/generate-sigil';
import {generateSigilImage} from '@/ai/flows/generate-sigil-image';
import {interrogateSigil} from '@/ai/flows/interrogate-sigil-flow';
import {generateSpeech} from '@/ai/flows/generate-speech-flow';
import { getDocs } from '@/lib/docs';
import { marked } from 'marked';

/**
 * Represents a single message in the conversation.
 * @property {'user' | 'agent'} role - The speaker of the message.
 * @property {string} content - The text content of the message.
 * @property {GenerateSigilOutput} [sigil] - The generated 'Why' and 'How' content, if the message is a creation response.
 * @property {string} [imageUrl] - The URL of the generated image for a new scripture.
 * @property {string} [query] - The original user query that resulted in this message.
 * @property {string | null} [audioUrl] - The data URI for the generated speech audio.
 * @property {boolean} [isThinking] - True if this is a temporary message indicating the agent is processing.
 * @property {boolean} [isCreation] - True if this message represents the creation of a new scripture.
 * @property {boolean} [isError] - True if this message represents an error.
 */
export type ConversationMessage = {
  role: 'user' | 'agent';
  content: string;
  sigil?: GenerateSigilOutput;
  imageUrl?: string;
  query?: string;
  audioUrl?: string | null;
  isThinking?: boolean;
  isCreation?: boolean;
  isError?: boolean;
};

/**
 * Represents the entire state of the conversation.
 * @property {ConversationMessage[]} conversation - The array of messages in the conversation history.
 * @property {string | null} context - The full text of the current scripture being interrogated.
 * @property {string | null} contextImageUrl - The image URL of the scripture being interrogated.
 * @property {string | null} contextQuery - The original query for the scripture being interrogated.
 * @property {string | null} error - An error message, if any occurred.
 * @property {boolean} [isCreation] - True if the last action was a scripture creation.
 */
export type ConversationState = {
  conversation: ConversationMessage[];
  context: string | null;
  contextImageUrl: string | null;
  contextQuery: string | null;
  error: string | null;
  isCreation?: boolean;
};

const initialState: ConversationState = {
    conversation: [],
    context: null,
    contextImageUrl: null,
    contextQuery: null,
    error: null,
};


/**
 * A unified server action to handle the entire conversation logic.
 * It manages both the creation of new scriptures ("sigils") and the interrogation of existing ones.
 * This function is designed to be used with `useActionState`.
 * @param {ConversationState} prevState - The previous state of the conversation.
 * @param {FormData} formData - The form data submitted by the user. Must contain a 'query' field.
 *   Can also contain 'context', 'contextImageUrl', 'contextQuery', and 'reset'.
 * @returns {Promise<ConversationState>} The new state of the conversation.
 */
export async function unifiedConversationAction(
  prevState: ConversationState,
  formData: FormData
): Promise<ConversationState> {
  const query = formData.get('query') as string;
  const context = formData.get('context') as string | null;
  const contextImageUrl = formData.get('contextImageUrl') as string | null;
  const contextQuery = formData.get('contextQuery') as string | null;
  const reset = formData.get('reset') === 'true';

  // This handles switching from an interrogated doc back to a clean slate
  if (reset) {
    return initialState;
  }
  
  // This handles loading a new document into the context for interrogation
  if (!query && context) {
    return {
        ...initialState,
        context,
        contextImageUrl,
        contextQuery
    };
  }
  
  if (!query) {
    return {...prevState, error: 'Query is required.'};
  }

  const userMessage: ConversationMessage = {role: 'user', content: query};
  let newConversation = [...(prevState?.conversation || []), userMessage];

  const baseState: ConversationState = {
    conversation: newConversation,
    isCreation: false,
    context: context,
    contextImageUrl: contextImageUrl,
    contextQuery: contextQuery,
    error: null,
  };

  const agentThinkingMessage: ConversationMessage = {
    role: 'agent',
    content: 'The Oracle is contemplating...',
    isThinking: true,
  };
  newConversation.push(agentThinkingMessage);

  try {
    // If there is no context, this is a creation query
    if (!context) {
      agentThinkingMessage.content = 'The Scribe is forging a new scripture...';

      const [textOutput, imageOutput] = await Promise.all([
        generateSigil({query}),
        generateSigilImage({query}),
      ]);

      const sigilContext = `${textOutput.why}\n\n${textOutput.how}`;
      const agentResponseMessage: ConversationMessage = {
        role: 'agent',
        content: `I have forged the scripture for "${query}". You may now interrogate it.`,
        sigil: textOutput,
        imageUrl: imageOutput.imageUrl,
        query: query,
        isCreation: true,
      };

      newConversation[newConversation.length - 1] = agentResponseMessage;

      return {
        conversation: newConversation,
        context: sigilContext,
        contextImageUrl: imageOutput.imageUrl,
        contextQuery: query,
        error: null,
        isCreation: true,
      };
    } else {
      // If there is context, this is an interrogation query
      agentThinkingMessage.content = `Interrogating scripture for "${query}"...`;
      const textResult = await interrogateSigil({query, context});
      const speechResult = await generateSpeech(textResult.answer);

      const agentResponseMessage: ConversationMessage = {
        role: 'agent',
        content: marked.parse(textResult.answer), // Parse markdown for rich content
        audioUrl: speechResult.audioUrl,
      };

      newConversation[newConversation.length - 1] = agentResponseMessage;

      return {
        ...baseState,
        conversation: newConversation,
        error: null,
      };
    }
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

/**
 * Fetches the canonical documents from the local filesystem.
 * @returns {Promise<any[]>} A promise that resolves to an array of document objects.
 */
export async function getDocsAction() {
    const docs = await getDocs();
    return docs;
}
