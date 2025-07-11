
'use server';

import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { marked } from 'marked';
import { interrogateSigil, InterrogateSigilOutput } from '@/ai/flows/interrogate-sigil-flow';
import { getDocs } from '@/lib/docs';
import { generateSpeech } from '@/ai/flows/generate-speech-flow';
import { revalidatePath } from 'next/cache';

/**
 * Represents the state of the sigil upload form.
 * @property {boolean} success - Indicates whether the upload was successful.
 * @property {string | null} error - An error message, if any occurred.
 */
type UploadFormState = {
  success: boolean;
  error: string | null;
};

/**
 * Server action to handle the upload of a Markdown file.
 * It verifies user authentication, processes the .md file, converts it to HTML,
 * and saves both versions to Firestore.
 * @param {UploadFormState} prevState - The previous state of the form.
 * @param {FormData} formData - The form data containing the file to upload.
 * @returns {Promise<UploadFormState>} The new state of the form, indicating success or failure.
 */
export async function uploadSigilAction(
  prevState: UploadFormState,
  formData: FormData
): Promise<UploadFormState> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return { success: false, error: 'You must be logged in to upload a file.' };
  }

  let decodedClaims;
  try {
    decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
  } catch (error) {
    return { success: false, error: 'Invalid session. Please log in again.' };
  }
  
  const userId = decodedClaims.uid;
  const file = formData.get('markdownFile') as File;

  if (!file || file.type !== 'text/markdown') {
    return { success: false, error: 'Invalid file type. Only .md files are accepted.' };
  }

  try {
    const markdownContent = await file.text();
    const htmlContent = await marked(markdownContent);

    await db.collection('sigils').add({
      userId: userId,
      fileName: file.name,
      markdown: markdownContent,
      html: htmlContent,
      createdAt: new Date(),
    });

    revalidatePath('/forge');
    return { success: true, error: null };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || 'An unknown error occurred during upload.' };
  }
}

/**
 * Represents a single message in the interrogation conversation.
 */
type ConversationMessage = {
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

    if(!query || !context) {
        return { ...prevState, error: "Missing query or context."};
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


/**
 * Server action to fetch and parse all canonical documentation from the /docs directory.
 * @returns {Promise<Array<{id: string, title: string, html: string, markdown: string}>>} A promise that resolves to an array of document objects.
 */
export async function getDocsAction(): Promise<Array<{id: string, title: string, html: string, markdown: string}>> {
    return getDocs();
}

/**
 * Server action to delete a sigil document from Firestore.
 * It verifies the user is authenticated before performing the deletion.
 * @param {string} docId - The ID of the Firestore document to delete.
 * @returns {Promise<{success: boolean, error: string | null}>} An object indicating the outcome of the operation.
 */
export async function deleteSigilAction(docId: string): Promise<{success: boolean, error: string | null}> {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return { success: false, error: 'You must be logged in to unbind a scripture.' };
    }
  
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
      const sigilRef = db.collection('sigils').doc(docId);
      const sigilDoc = await sigilRef.get();

      if (!sigilDoc.exists) {
        return { success: false, error: "Scripture not found." };
      }

      if (sigilDoc.data()?.userId !== decodedClaims.uid) {
        return { success: false, error: "You do not have permission to unbind this scripture." };
      }

      await sigilRef.delete();
      revalidatePath('/forge');
      return { success: true, error: null };

    } catch (e: any) {
      console.error('Deletion error:', e);
      return { success: false, error: e.message || 'An unknown error occurred during unbinding.' };
    }
}

    