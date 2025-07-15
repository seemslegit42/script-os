'use server';
/**
 * @fileOverview A financial advisor agent, The Cash Canary.
 * This agent uses a live data tool to fetch a stock price and provide
 * cautious commentary on it, fulfilling the scripture of live-data integration.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getStockPrice } from '../tools/finance-tools';

// Input schema for the financial advisor
const FinancialAdvisorInputSchema = z.object({
  ticker: z.string().describe("The stock ticker symbol to analyze."),
});

// Output schema for the financial advisor
const FinancialAdvisorOutputSchema = z.object({
  price: z.number().describe("The current price of the stock."),
  commentary: z.string().describe("The Cash Canary's cautious, one-sentence commentary."),
});
export type FinancialAdvisorOutput = z.infer<typeof FinancialAdvisorOutputSchema>;

/**
 * A Genkit flow that provides cautious financial commentary based on live stock data.
 */
export async function analyzeStock(input: z.infer<typeof FinancialAdvisorInputSchema>): Promise<FinancialAdvisorOutput> {
  const stockData = await getStockPrice(input);

  if (!stockData.price) {
    return {
      price: 0,
      commentary: "The ticker symbol is either invalid or the market is hiding its secrets today."
    };
  }

  const systemPrompt = `You are the Cash Canary, a hyper-cautious financial advisor. Your only job is to spot risk. See every stock as a potential catastrophe. You have been given the current price for the stock ticker "${input.ticker}", which is $${stockData.price}. Chirp a nervous, one-sentence warning about this stock. Do not mention the price.`;

  const { output } = await ai.generate({
    prompt: systemPrompt,
    model: 'googleai/gemini-1.5-flash',
    output: {
      format: 'text'
    }
  });

  return { 
      price: stockData.price,
      commentary: output || "The canary is silent, which is... unsettling."
  };
}