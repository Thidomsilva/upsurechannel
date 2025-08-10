'use server';
/**
 * @fileOverview A betting data extraction AI agent.
 *
 * - extractBettingData - A function that takes raw betting data and extracts structured information.
 * - BettingDataInput - The input type for the extractBettingData function.
 * - ExtractedBettingData - The output type for the extractBettingData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const BettingDataInputSchema = z.object({
  bettingData: z
    .string()
    .describe('The raw text containing the betting information.'),
});
export type BettingDataInput = z.infer<typeof BettingDataInputSchema>;

export const ExtractedBettingDataSchema = z.object({
  date: z.string().describe('The date and time of the event (e.g., DD/MM/AAAA - HH:mm).'),
  league: z.string().describe('The name of the league or tournament.'),
  event: z.string().describe('The event description, including the teams (e.g., Time A vs Time B).'),
  bookmaker1: z.string().describe('The name of the first bookmaker.'),
  bet1: z.string().describe('The description of the first bet (e.g., H1(+0.25)).'),
  odd1: z.string().describe('The odd for the first bet.'),
  bookmaker2: z.string().describe('The name of the second bookmaker.'),
  bet2: z.string().describe('The description of the second bet (e.g., H2(−0.25)).'),
  odd2: z.string().describe('The odd for the second bet.'),
});
export type ExtractedBettingData = z.infer<typeof ExtractedBettingDataSchema>;

const extractBetPrompt = ai.definePrompt({
  name: 'extractBetPrompt',
  input: { schema: BettingDataInputSchema },
  output: { schema: ExtractedBettingDataSchema },
  prompt: `You are a data extraction expert. Your task is to extract the specified information from the raw betting text.

Raw Text:
'''
{{{bettingData}}}
'''
`,
});


export async function extractBettingData(input: BettingDataInput): Promise<ExtractedBettingData> {
  const { output } = await extractBetPrompt(input);
  if (!output) {
    throw new Error('Could not extract betting data.');
  }
  return output;
}
