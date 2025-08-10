'use server';
/**
 * @fileOverview An AI agent that extracts betting information from a screenshot.
 *
 * - extractBettingInfo - A function that handles the extraction process.
 * - ExtractBettingInfoInput - The input type for the extractBettingInfo function.
 * - ExtractBettingInfoOutput - The return type for the extractBettingInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractBettingInfoInputSchema = z.object({
  screenshotDataUri: z
    .string()
    .describe(
      'A screenshot of a betting slip, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type ExtractBettingInfoInput = z.infer<typeof ExtractBettingInfoInputSchema>;

const ExtractBettingInfoOutputSchema = z.object({
  gameDetails: z.string().describe('Details of the game, including teams and date/time.'),
  odds: z.number().describe('The betting odds.'),
  stake: z.number().describe('The amount staked on the bet.'),
  predictedWinning: z.number().describe('The predicted winning amount for the bet.'),
});
export type ExtractBettingInfoOutput = z.infer<typeof ExtractBettingInfoOutputSchema>;

export async function extractBettingInfo(input: ExtractBettingInfoInput): Promise<ExtractBettingInfoOutput> {
  return extractBettingInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractBettingInfoPrompt',
  input: {schema: ExtractBettingInfoInputSchema},
  output: {schema: ExtractBettingInfoOutputSchema},
  prompt: `You are an expert at extracting betting information from images.

  Analyze the following screenshot of a betting slip and extract the relevant information, including game details, odds, and stake information.

  Screenshot: {{media url=screenshotDataUri}}

  Return the extracted information in a structured format.
  `,
});

const extractBettingInfoFlow = ai.defineFlow(
  {
    name: 'extractBettingInfoFlow',
    inputSchema: ExtractBettingInfoInputSchema,
    outputSchema: ExtractBettingInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
