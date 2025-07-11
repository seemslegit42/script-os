
'use server';

import { generateSigil, GenerateSigilOutput } from '@/ai/flows/generate-sigil';
import { generateSigilImage } from '@/ai/flows/generate-sigil-image';
import { interrogateSigil } from '@/ai/flows/interrogate-sigil-flow';
import { generateSpeech } from '@/ai/flows/generate-speech-flow';
import { Scripture } from '@/lib/types';

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

export type ConversationState = {
  conversation: ConversationMessage[];
  context: string | null;
  contextImageUrl: string | null;
  contextQuery: string | null;
  error: string | null;
  isCreation?: boolean;
};

export async function unifiedConversationAction(
  prevState: ConversationState,
  formData: FormData
): Promise<ConversationState> {
  const query = formData.get('query') as string;
  const context = formData.get('context') as string | null;
  const contextImageUrl = formData.get('contextImageUrl') as string | null;
  const contextQuery = formData.get('contextQuery') as string | null;

  if (!query) {
    return { ...prevState, error: 'Query is required.' };
  }

  const userMessage: ConversationMessage = { role: 'user', content: query };
  let newConversation = [...prevState.conversation, userMessage];
  
  const baseState = { 
      ...prevState,
      isCreation: false,
      context: context,
      contextImageUrl: contextImageUrl,
      contextQuery: contextQuery
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
        generateSigil({ query }),
        generateSigilImage({ query }),
      ]);

      const sigilContext = `${textOutput.why}\n\n${textOutput.how}`;
      const agentResponseMessage: ConversationMessage = {
        role: 'agent',
        content: `I have forged the scripture for "${query}". You may now interrogate it or bind it to your Scriptorium.`,
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
      const textResult = await interrogateSigil({ query, context });
      const speechResult = await generateSpeech(textResult.answer);

      const agentResponseMessage: ConversationMessage = {
        role: 'agent',
        content: textResult.answer,
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
