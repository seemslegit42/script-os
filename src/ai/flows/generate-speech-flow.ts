
'use server';
/**
 * @fileOverview A flow for generating speech from text using a TTS model.
 *
 * This file defines the Genkit flow responsible for taking a string of text
 * and converting it into a playable audio file in WAV format, returned as a data URI.
 * It is configured to use the "Fenrir" voice persona.
 *
 * @exports generateSpeech - The primary function to call this flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

/**
 * Defines the schema for the input to the generateSpeech flow.
 * @property {string} text - The text to be converted to speech.
 * @property {string} context - The source of the text (e.g., a scripture title) for potential future use.
 */
const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  context: z.string().describe("The source of the text (e.g., a scripture title) for potential future use."),
});
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;

/**
 * Defines the schema for the output of the generateSpeech flow.
 * @property {string} audioUrl - The data URI of the generated WAV audio file.
 */
const GenerateSpeechOutputSchema = z.object({
  audioUrl: z.string().describe("The data URI of the generated WAV audio file. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;

/**
 * Converts text to speech and returns a WAV audio data URI.
 * @param {GenerateSpeechInput} input - The text to convert and its context.
 * @returns {Promise<GenerateSpeechOutput>} A promise that resolves to the object containing the audio URL.
 */
export async function generateSpeech(input: GenerateSpeechInput): Promise<GenerateSpeechOutput> {
  return generateSpeechFlow(input);
}

const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: GenerateSpeechInputSchema,
    outputSchema: GenerateSpeechOutputSchema,
  },
  async ({ text, context }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        generationConfig: { temperature: 1.0 },
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' },
          },
        },
      },
      prompt: text,
    });
    if (!media || !media.url) {
      throw new Error('TTS generation failed to produce an output.');
    }
    
    // The media URL is a data URI with base64 encoded PCM data.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavData = await toWav(audioBuffer);
    
    return {
      audioUrl: 'data:audio/wav;base64,' + wavData,
    };
  }
);


/**
 * Converts raw PCM audio data into a WAV file format.
 * @param {Buffer} pcmData - The raw PCM audio data.
 * @param {number} [channels=1] - The number of audio channels.
 * @param {number} [rate=24000] - The sample rate.
 * @param {number} [sampleWidth=2] - The width of each sample in bytes.
 * @returns {Promise<string>} A promise that resolves to a base64 encoded string of the WAV file.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
