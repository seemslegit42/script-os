
import { NextResponse } from 'next/server';
import { z } from 'zod';

const initiateSchema = z.object({
  email: z.string().email(),
});

/**
 * API route to initiate the passwordless login process.
 * In a real application, this would:
 * 1. Find or create a user with the given email.
 * 2. Generate a secure, single-use token.
 * 3. Send an email (e.g., using Resend) with a magic link containing the token.
 * 
 * For this mock implementation, it simply validates the email and returns a success message.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = initiateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email provided.' }, { status: 400 });
    }

    const { email } = parsed.data;

    // In a real app, you would generate and send a magic link here.
    // For now, we just simulate a successful initiation.
    console.log(`Initiating login for: ${email}`);

    return NextResponse.json({ message: 'Login initiated. Please check your email for the magic link.' });
  } catch (error) {
    console.error('Login initiation failed:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
