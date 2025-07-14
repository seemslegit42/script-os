
import {NextRequest} from 'next/server';
import {createNextApiHandler} from '@genkit-ai/next';

import '@/app/actions';

const handler = createNextApiHandler();

export async function POST(req: NextRequest) {
  return handler(req);
}
