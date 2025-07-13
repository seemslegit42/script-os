import { config } from 'dotenv';
config();

import '@/ai/flows/generate-sigil.ts';
import '@/ai/flows/generate-sigil-image.ts';
import '@/ai/flows/interrogate-sigil-flow.ts';
import '@/ai/flows/generate-speech-flow.ts';
import '@/ai/tools/summarize.ts';
