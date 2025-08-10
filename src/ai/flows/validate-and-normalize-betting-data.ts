'use server';

/**
 * @fileOverview Validates and normalizes betting data extracted from OCR.
 *
 * - validateAndNormalizeBettingData - A function that validates and normalizes the betting data.
 * - ValidateAndNormalizeBettingDataInput - The input type for the validateAndNormalizeBettingData function.
 * - ValidateAndNormalizeBettingDataOutput - The return type for the validateAndNormalizeBettingData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateAndNormalizeBettingDataInputSchema = z.object({
  game: z.string().optional().describe('The name of the game or event.'),
  team1: z.string().optional().describe('The name of the first team or participant.'),
  team2: z.string().optional().describe('The name of the second team or participant.'),
  odds1: z.string().optional().describe('The odds for the first team or participant.'),
  odds2: z.string().optional().describe('The odds for the second team or participant.'),
  stake: z.string().optional().describe('The stake amount.'),
  bookmaker: z.string().optional().describe('The name of the bookmaker.'),
});
export type ValidateAndNormalizeBettingDataInput = z.infer<typeof ValidateAndNormalizeBettingDataInputSchema>;

const ValidateAndNormalizeBettingDataOutputSchema = z.object({
  game: z.string().describe('The validated and normalized name of the game or event.'),
  team1: z.string().describe('The validated and normalized name of the first team or participant.'),
  team2: z.string().describe('The validated and normalized name of the second team or participant.'),
  odds1: z.number().describe('The validated and normalized odds for the first team or participant.'),
  odds2: z.number().describe('The validated and normalized odds for the second team or participant.'),
  stake: z.number().describe('The validated and normalized stake amount.'),
  bookmaker: z.string().describe('The validated and normalized name of the bookmaker.'),
});
export type ValidateAndNormalizeBettingDataOutput = z.infer<typeof ValidateAndNormalizeBettingDataOutputSchema>;

export async function validateAndNormalizeBettingData(
  input: ValidateAndNormalizeBettingDataInput
): Promise<ValidateAndNormalizeBettingDataOutput> {
  return validateAndNormalizeBettingDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateAndNormalizeBettingDataPrompt',
  input: {schema: ValidateAndNormalizeBettingDataInputSchema},
  output: {schema: ValidateAndNormalizeBettingDataOutputSchema},
  prompt: `You are an expert betting data validator and normalizer. You will receive betting data extracted from an OCR process, which may contain missing or incorrect information. Your task is to validate the provided data, fill in any missing fields, and normalize the data types.  Specifically:

1.  Ensure that odds1 and odds2 are valid numbers.
2.  Ensure that stake is a valid number.
3.  If any fields are missing, use your knowledge to fill them based on the available information.  Be as accurate as possible.

Here is the betting data:

Game: {{{game}}}
Team 1: {{{team1}}}
Team 2: {{{team2}}}
Odds 1: {{{odds1}}}
Odds 2: {{{odds2}}}
Stake: {{{stake}}}
Bookmaker: {{{bookmaker}}}

Return the validated and normalized data in JSON format.
Ensure that odds1, odds2, and stake are returned as numbers.
If any information cannot be determined, return an empty string for string fields and 0 for number fields.
`,
});

const validateAndNormalizeBettingDataFlow = ai.defineFlow(
  {
    name: 'validateAndNormalizeBettingDataFlow',
    inputSchema: ValidateAndNormalizeBettingDataInputSchema,
    outputSchema: ValidateAndNormalizeBettingDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
