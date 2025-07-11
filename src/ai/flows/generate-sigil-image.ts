// src/ai/flows/generate-sigil-image.ts
'use server';

/**
 * @fileOverview A flow for generating a symbolic image for a Living Sigil.
 *
 * This file defines the Genkit flow responsible for creating an abstract, symbolic
 * image based on a user's query. The image is styled to fit the futuristic,
 * mystical aesthetic of the ΛΞVON OS.
 *
 * @exports generateSigilImage - The primary function to call this flow.
 * @exports GenerateSigilImageInput - The Zod schema for the flow's input.
 * @exports GenerateSigilImageOutput - The Zod schema for the flow's output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the schema for the input to the generateSigilImage flow.
 * @property {string} query - The user's query that will be used as a prompt to generate the image.
 */
const GenerateSigilImageInputSchema = z.object({
  query: z.string().describe('The user query to generate an image from.'),
});
export type GenerateSigilImageInput = z.infer<typeof GenerateSigilImageInputSchema>;

/**
 * Defines the schema for the output of the generateSigilImage flow.
 * @property {string} imageUrl - The data URI of the generated image.
 */
const GenerateSigilImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateSigilImageOutput = z.infer<typeof GenerateSigilImageOutputSchema>;

/**
 * Generates a symbolic image based on a user query.
 * This function serves as the entry point to the `generateSigilImageFlow`.
 * @param {GenerateSigilImageInput} input - The input object containing the user's query.
 * @returns {Promise<GenerateSigilImageOutput>} A promise that resolves to the object containing the generated image URL.
 */
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
