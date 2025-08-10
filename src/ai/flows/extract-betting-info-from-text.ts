'use server';
/**
 * @fileOverview An AI agent that extracts betting information from text.
 *
 * - extractBettingInfoFromText - A function that handles the extraction process.
 * - ExtractBettingInfoFromTextInput - The input type for the extractBettingInfoFromText function.
 * - ExtractBettingInfoFromTextOutput - The return type for the extractBettingInfoFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractBettingInfoFromTextInputSchema = z.object({
  bettingInfo: z
    .string()
    .describe('A string containing betting information, likely pasted by a user.'),
});
export type ExtractBettingInfoFromTextInput = z.infer<typeof ExtractBettingInfoFromTextInputSchema>;

const ExtractBettingInfoFromTextOutputSchema = z.object({
  gameDetails: z.string().describe('Details of the game, including teams and date/time.'),
  odds: z.number().describe('The betting odds.'),
  stake: z.number().describe('The amount staked on the bet.'),
  predictedWinning: z.number().describe('The predicted winning amount for the bet.'),
});
export type ExtractBettingInfoFromTextOutput = z.infer<typeof ExtractBettingInfoFromTextOutputSchema>;

export async function extractBettingInfoFromText(input: ExtractBettingInfoFromTextInput): Promise<ExtractBettingInfoFromTextOutput> {
  return extractBettingInfoFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractBettingInfoFromTextPrompt',
  input: {schema: ExtractBettingInfoFromTextInputSchema},
  output: {schema: ExtractBettingInfoFromTextOutputSchema},
  prompt: `You are an expert at extracting betting information from raw text.

  Analyze the following text from a betting slip and extract the relevant information, including game details, odds, and stake information. The user will provide one of the bets, your job is to extract the main information from that one. Focus on the first bet listed.

  Betting Info:
  {{{bettingInfo}}}

  Return the extracted information in a structured format.
  `,
});

const extractBettingInfoFromTextFlow = ai.defineFlow(
  {
    name: 'extractBettingInfoFromTextFlow',
    inputSchema: ExtractBettingInfoFromTextInputSchema,
    outputSchema: ExtractBettingInfoFromTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
