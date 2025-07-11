
'use server';

import { generateSigil } from '@/ai/flows/generate-sigil';
import { generateSigilImage } from '@/ai/flows/generate-sigil-image';

type FormState = {
  sigilContent: string | null;
  sigilImageUrl: string | null;
  error: string | null;
};

export async function createSigilAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const query = formData.get('query') as string;

  if (!query) {
    return { sigilContent: null, sigilImageUrl: null, error: 'Query is required.' };
  }

  try {
    // Run both AI flows in parallel for maximum efficiency
    const [textOutput, imageOutput] = await Promise.all([
      generateSigil({ query }),
      generateSigilImage({ query })
    ]);
    
    return { 
      sigilContent: textOutput.sigilContent, 
      sigilImageUrl: imageOutput.imageUrl, 
      error: null 
    };

  } catch (e: any) {
    console.error(e);
    return { sigilContent: null, sigilImageUrl: null, error: e.message || 'An unknown error occurred.' };
  }
}
