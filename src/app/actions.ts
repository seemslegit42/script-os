'use server';

import { generateSigil, GenerateSigilOutput } from '@/ai/flows/generate-sigil';
import { generateSigilImage } from '@/ai/flows/generate-sigil-image';
import { interrogateSigil } from '@/ai/flows/interrogate-sigil-flow';
import { generateSpeech } from '@/ai/flows/generate-speech-flow';
import type { ConversationMessage } from '@/components/conversation-manager';

export type ConversationState = {
  conversation: ConversationMessage[];
  context: string | null;
  contextImageUrl: string | null;
  contextQuery: string | null;
  error: string | null;
};

export async function unifiedConversationAction(
  prevState: ConversationState,
  formData: FormData
): Promise<ConversationState> {
  const query = formData.get('query') as string;

  if (!query) {
    return { ...prevState, error: 'Query is required.' };
  }

  const userMessage: ConversationMessage = { role: 'user', content: query };
  let newConversation = [...prevState.conversation, userMessage];

  try {
    // If there is no context, this is a creation query
    if (!prevState.context) {
      const agentThinkingMessage: ConversationMessage = {
        role: 'agent',
        content: 'The Scribe is forging a new scripture...',
        isThinking: true,
      };
      newConversation.push(agentThinkingMessage);

      const [textOutput, imageOutput] = await Promise.all([
        generateSigil({ query }),
        generateSigilImage({ query }),
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

      // Replace the "thinking" message with the final response
      newConversation[newConversation.length - 1] = agentResponseMessage;

      return {
        conversation: newConversation,
        context: sigilContext,
        contextImageUrl: imageOutput.imageUrl,
        contextQuery: query,
        error: null,
      };
    } else {
      // If there is context, this is an interrogation query
      const context = prevState.context;

      const agentThinkingMessage: ConversationMessage = {
        role: 'agent',
        content: 'The Oracle is contemplating...',
        isThinking: true,
      };
      newConversation.push(agentThinkingMessage);
      
      const textResult = await interrogateSigil({ query, context });
      const speechResult = await generateSpeech(textResult.answer);

      const agentResponseMessage: ConversationMessage = {
        role: 'agent',
        content: textResult.answer,
        audioUrl: speechResult.audioUrl,
      };
      
      // Replace the "thinking" message with the final response
      newConversation[newConversation.length - 1] = agentResponseMessage;

      return {
        ...prevState,
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
    // Add error message to the conversation
    newConversation.push(agentErrorMessage);
    return {
      ...prevState,
      conversation: newConversation,
      error: errorMessage,
    };
  }
}
