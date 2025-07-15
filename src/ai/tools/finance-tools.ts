'use server';
/**
 * @fileOverview A collection of tools for interacting with financial data APIs.
 * This tool is the "eyes" of the Cash Canary, allowing it to see live market data.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StockPriceInputSchema = z.object({
  ticker: z.string().describe("The stock ticker symbol to look up."),
});

const StockPriceOutputSchema = z.object({
  price: z.number().describe("The current price of the stock."),
  ticker: z.string().describe("The ticker symbol that was looked up."),
});

/**
 * A Genkit tool that fetches the current price of a stock using the Finnhub API.
 * An API key must be provided in the .env file as FINNHUB_API_KEY.
 */
export const getStockPrice = ai.defineTool(
  {
    name: 'getStockPrice',
    description: 'Fetches the latest stock price from a financial data provider.',
    inputSchema: StockPriceInputSchema,
    outputSchema: StockPriceOutputSchema,
  },
  async ({ ticker }) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      console.error("Finnhub API key is not set in environment variables.");
      throw new Error("Financial data provider is not configured.");
    }
    
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Finnhub API error: ${response.statusText}`);
        return { price: 0, ticker };
      }
      const data = await response.json();

      // 'c' is the current price in the Finnhub quote response
      const price = data.c || 0;

      return { price, ticker };
    } catch (error) {
      console.error("Failed to fetch stock price:", error);
      throw new Error("Could not connect to financial data provider.");
    }
  }
);
