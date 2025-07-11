
'use server';

import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { marked } from 'marked';

type FormState = {
  success: boolean;
  error: string | null;
};

export async function uploadSigilAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
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
