
'use server';

import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { marked } from 'marked';
import { interrogateSigil, InterrogateSigilOutput } from '@/ai/flows/interrogate-sigil-flow';

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

    return { success: true, error: null };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || 'An unknown error occurred during upload.' };
  }
}

/**
 * Represents the state of the interrogation chat panel.
 * @property {Array<{ role: 'user' | 'agent'; content: string }>} conversation - A history of the conversation.
 * @property {string | null} error - An error message, if any occurred during the last turn.
 */
export type InterrogationFormState = {
    conversation: { role: 'user' | 'agent'; content: string }[];
    error: string | null;
}

/**
 * Server action to handle a user's question about a document.
 * It calls the `interrogateSigil` AI flow with the user's query and the document context.
 * @param {InterrogationFormState} prevState - The previous state of the conversation.
 * @param {FormData} formData - The form data containing the user's query and the document context.
 * @returns {Promise<InterrogationFormState>} The new conversation state, including the agent's answer or an error.
 */
export async function interrogationAction(prevState: InterrogationFormState, formData: FormData): Promise<InterrogationFormState> {
    const query = formData.get('query') as string;
    const context = formData.get('context') as string;

    if(!query || !context) {
        return { ...prevState, error: "Missing query or context."};
    }
    
    const userMessage = { role: 'user' as const, content: query };
    let newConversation = [...prevState.conversation, userMessage];

    try {
        const result: InterrogateSigilOutput = await interrogateSigil({ query, context });
        const agentMessage = { role: 'agent' as const, content: result.answer };
        newConversation = [...newConversation, agentMessage];
        return { conversation: newConversation, error: null };

    } catch (e: any) {
        console.error(e);
        const errorMessage = { role: 'agent' as const, content: `Error: ${e.message || 'An unknown error occurred.'}` };
        newConversation = [...newConversation, errorMessage];
        return { conversation: newConversation, error: e.message };
    }
}
