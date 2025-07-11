
'use server';

import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { marked } from 'marked';
import { interrogateSigil, InterrogateSigilOutput } from '@/ai/flows/interrogate-sigil-flow';

type UploadFormState = {
  success: boolean;
  error: string | null;
};

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


export type InterrogationFormState = {
    conversation: { role: 'user' | 'agent'; content: string }[];
    error: string | null;
}

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
