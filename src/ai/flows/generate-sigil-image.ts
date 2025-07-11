// src/ai/flows/generate-sigil-image.ts
'use server';

/**
 * @fileOverview A flow for generating a symbolic image for a Living Sigil.
 *
 * - generateSigilImage - A function that handles the generation of an image based on a user query.
 * - GenerateSigilImageInput - The input type for the generateSigilImage function.
 * - GenerateSigilImageOutput - The return type for the generateSigilImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSigilImageInputSchema = z.object({
  query: z.string().describe('The user query to generate an image from.'),
});
export type GenerateSigilImageInput = z.infer<typeof GenerateSigilImageInputSchema>;

const GenerateSigilImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateSigilImageOutput = z.infer<typeof GenerateSigilImageOutputSchema>;

export async function generateSigilImage(input: GenerateSigilImageInput): Promise<GenerateSigilImageOutput> {
  return generateSigilImageFlow(input);
}

const generateSigilImageFlow = ai.defineFlow(
  {
    name: 'generateSigilImageFlow',
    inputSchema: GenerateSigilImageInputSchema,
    outputSchema: GenerateSigilImageOutputSchema,
  },
  async ({query}) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a symbolic, abstract, and slightly mystical image that represents the core concept of the following query: "${query}". 
      The style should be minimalist, with glowing lines and geometric shapes on a dark background, fitting a futuristic and sophisticated OS aesthetic. 
      Think of it as a "sigil" or a "glyph" that visually encapsulates the idea.
      For example, for a query about "networking," you might generate an image of interconnected nodes. For "security," a stylized shield or a keyhole.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed to produce an output.');
    }
    
    return {
      imageUrl: media.url,
    };
  }
);
