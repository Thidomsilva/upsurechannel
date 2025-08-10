'use server';
/**
 * @fileOverview A betting data validation and normalization AI agent.
 *
 * - validateAndNormalizeBettingData - A function that handles the betting data validation and normalization process.
 * - BettingDataInput - The input type for the validateAndNormalizeBettingData function.
 * - BettingDataOutput - The return type for the validateAndNormalizeBettingData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BettingDataInputSchema = z.object({
  bettingData: z
    .string()
    .describe('The raw text containing the betting information, including two different odds.'),
});
export type BettingDataInput = z.infer<typeof BettingDataInputSchema>;

const BettingDataOutputSchema = z.object({
  odds1: z.number().describe('The first decimal odd found in the text.'),
  odds2: z.number().describe('The second decimal odd found in the text.'),
});
export type BettingDataOutput = z.infer<typeof BettingDataOutputSchema>;

export async function validateAndNormalizeBettingData(input: BettingDataInput): Promise<BettingDataOutput> {
  const prompt = ai.definePrompt({
    name: 'bettingDataNormalizerPrompt',
    input: { schema: BettingDataInputSchema },
    output: { schema: BettingDataOutputSchema },
    prompt: `You are a data normalization expert for sports betting.
Your task is to extract the two distinct decimal odds from the provided text.
Each odd is on its own line, associated with a bookmaker (e.g., Betano, Bet365).
The correct odd is the first decimal number, usually with 3 decimal places, that appears on the line after the bet description.
Ignore any other numbers like percentages or monetary values that might appear later on the same line.

Return the two odds you find, one from each line.

Betting Data:
'''
{{{bettingData}}}
'''`,
  });

  const { output } = await prompt(input);
  if (!output) {
    throw new Error('Could not normalize betting data.');
  }
  return output;
}
