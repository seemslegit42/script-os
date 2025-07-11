
'use server';

import { interrogateSigil, InterrogateSigilOutput } from '@/ai/flows/interrogate-sigil-flow';
import { generateSpeech } from '@/ai/flows/generate-speech-flow';

/**
 * Represents a single message in the interrogation conversation.
 */
export type ConversationMessage = {
    role: 'user' | 'agent';
    content: string;
    audioUrl?: string | null;
};

/**
 * Represents the state of the interrogation chat panel.
 * @property {Array<ConversationMessage>} conversation - A history of the conversation.
 * @property {string | null} error - An error message, if any occurred during the last turn.
 */
export type InterrogationFormState = {
    conversation: ConversationMessage[];
    error: string | null;
}

/**
 * Server action to handle a user's question about a document.
 * It calls the `interrogateSigil` AI flow with the user's query and the document context,
 * then generates speech for the answer.
 * @param {InterrogationFormState} prevState - The previous state of the conversation.
 * @param {FormData} formData - The form data containing the user's query and the document context.
 * @returns {Promise<InterrogationFormState>} The new conversation state, including the agent's answer, an audio URL, or an error.
 */
export async function interrogationAction(prevState: InterrogationFormState, formData: FormData): Promise<InterrogationFormState> {
    const query = formData.get('query') as string;
    const context = formData.get('context') as string;

    if(!query) {
        // Return previous state if query is empty, but don't show an error.
        // This can happen on initial render.
        return prevState;
    }
    
    if(!context) {
        return { ...prevState, error: "Missing context to interrogate."};
    }
    
    const userMessage: ConversationMessage = { role: 'user' as const, content: query };
    let newConversation = [...prevState.conversation, userMessage];

    try {
        const textResult: InterrogateSigilOutput = await interrogateSigil({ query, context });
        const speechResult = await generateSpeech(textResult.answer);

        const agentMessage: ConversationMessage = { 
            role: 'agent' as const, 
            content: textResult.answer,
            audioUrl: speechResult.audioUrl
        };
        newConversation = [...newConversation, agentMessage];
        return { conversation: newConversation, error: null };

    } catch (e: any) {
        console.error(e);
        const errorMessage: ConversationMessage = { 
            role: 'agent' as const, 
            content: `Error: ${e.message || 'An unknown error occurred.'}` 
        };
        newConversation = [...newConversation, errorMessage];
        return { conversation: newConversation, error: e.message };
    }
}
