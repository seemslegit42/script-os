
'use server';

import { generateSigil, GenerateSigilOutput } from '@/ai/flows/generate-sigil';
import { generateSigilImage } from '@/ai/flows/generate-sigil-image';

type FormState = {
  sigil: GenerateSigilOutput | null;
  sigilImageUrl: string | null;
  error: string | null;
  query: string;
};

export async function createSigilAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const query = formData.get('query') as string;

  if (!query) {
    return { sigil: null, sigilImageUrl: null, error: 'Query is required.', query: '' };
  }

  try {
    // Run both AI flows in parallel for maximum efficiency
    const [textOutput, imageOutput] = await Promise.all([
      generateSigil({ query }),
      generateSigilImage({ query })
    ]);
    
    return { 
      sigil: textOutput, 
      sigilImageUrl: imageOutput.imageUrl, 
      error: null,
      query: query
    };

  } catch (e: any) {
    console.error(e);
    return { sigil: null, sigilImageUrl: null, error: e.message || 'An unknown error occurred.', query: query };
  }
}
