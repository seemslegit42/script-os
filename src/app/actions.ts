
'use server';

import { generateSigil, GenerateSigilOutput } from '@/ai/flows/generate-sigil';
import { generateSigilImage } from '@/ai/flows/generate-sigil-image';

/**
 * Represents the state of the sigil creation form.
 * @property {GenerateSigilOutput | null} sigil - The generated sigil text content, or null if not yet generated.
 * @property {string | null} sigilImageUrl - The URL of the generated sigil image, or null.
 * @property {string | null} error - An error message, if any occurred during the process.
 * @property {string} query - The user's original query.
 */
type FormState = {
  sigil: GenerateSigilOutput | null;
  sigilImageUrl: string | null;
  error: string | null;
  query: string;
};

/**
 * A server action that generates a new sigil, including text and an image.
 * It calls two separate AI flows in parallel to generate the content.
 * @param {FormState} prevState - The previous state of the form.
 * @param {FormData} formData - The form data submitted by the user.
 * @returns {Promise<FormState>} The new state of the form, including the generated sigil and image URL, or an error.
 */
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
