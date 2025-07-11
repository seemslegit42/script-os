
'use server';

import { generateSigil } from '@/ai/flows/generate-sigil';

type FormState = {
  sigilContent: string | null;
  error: string | null;
};

export async function createSigilAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const query = formData.get('query') as string;

  if (!query) {
    return { sigilContent: null, error: 'Query is required.' };
  }

  try {
    const output = await generateSigil({ query });
    return { sigilContent: output.sigilContent, error: null };
  } catch (e: any) {
    console.error(e);
    return { sigilContent: null, error: e.message || 'An unknown error occurred.' };
  }
}
