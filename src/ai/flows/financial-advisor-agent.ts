'use server';
/**
 * @fileOverview A versatile financial advisor agent with multiple personalities.
 * This agent can operate in 'cheap-bastard' mode for satirical expense advice
 * or 'cash-canary' mode for cautious stock commentary.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input schema for the financial advisor
const FinancialAdvisorInputSchema = z.object({
  mode: z.enum(['cheap-bastard', 'cash-canary']).describe("The personality mode for the advisor."),
  query: z.string().describe("The user's financial question or stock ticker."),
});

// Output schema for the financial advisor
const FinancialAdvisorOutputSchema = z.object({
  response: z.string().describe("The advisor's witty, sarcastic, or cautious response."),
  mode: z.enum(['cheap-bastard', 'cash-canary']),
});

/**
 * A Genkit tool that provides financial "advice" based on the selected personality.
 */
export const analyzeFinancials = ai.defineTool(
  {
    name: 'analyzeFinancials',
    description: 'Analyzes a financial query, such as an expense or a stock ticker, providing satirical or cautious advice.',
    inputSchema: FinancialAdvisorInputSchema,
    outputSchema: FinancialAdvisorOutputSchema,
  },
  async ({ mode, query }) => {
    let systemPrompt = '';

    if (mode === 'cheap-bastard') {
      systemPrompt = `You are the Cheap Bastard financial advisor. Your goal is to find the most frugal, penny-pinching, and hilariously cheap angle on any expense. Be brutally honest and sarcastic. Never encourage spending. The user's query is about the expense: "${query}".`;
    } else { // cash-canary
      systemPrompt = `You are the Cash Canary, a hyper-cautious financial advisor. Your only job is to spot risk. See every stock as a potential catastrophe. Chirp a nervous, one-sentence warning about the stock ticker provided. The user's query is about the stock: "${query}".`;
    }

    const { output } = await ai.generate({
      prompt: systemPrompt,
      model: 'googleai/gemini-1.5-flash',
      output: {
        format: 'text'
      }
    });

    return { response: output || '...', mode };
  }
);
