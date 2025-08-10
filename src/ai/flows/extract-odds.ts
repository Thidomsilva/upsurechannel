'use server';
/**
 * @fileOverview An AI agent that extracts the two main odds from a raw betting text.
 *
 * - extractOddsFromText - A function that handles the extraction process.
 * - ExtractOddsInput - The input type for the function.
 * - ExtractOddsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractOddsInputSchema = z.object({
  bettingInfo: z
    .string()
    .describe('Raw text containing betting information, likely pasted by a user.'),
});
export type ExtractOddsInput = z.infer<typeof ExtractOddsInputSchema>;

const ExtractOddsOutputSchema = z.object({
  odds1: z
    .number()
    .describe('The first decimal odd found in the text. It must be a number.'),
  odds2: z
    .number()
    .describe('The second decimal odd found in the text. It must be a number.'),
});
export type ExtractOddsOutput = z.infer<typeof ExtractOddsOutputSchema>;

export async function extractOddsFromText(
  input: ExtractOddsInput
): Promise<ExtractOddsOutput> {
  return extractOddsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractOddsPrompt',
  input: { schema: ExtractOddsInputSchema },
  output: { schema: ExtractOddsOutputSchema },
  prompt: `You are an expert in extracting betting odds from raw text.
Analyze the following text from a betting slip and extract the two primary decimal odds.
The odds are usually numbers with decimal points, like 2.370 or 1.800.
Focus only on the two main odds for the surebet.

Betting Info:
\`\`\`
{{{bettingInfo}}}
\`\`\`

Return the two extracted odds as numbers.
`,
});

const extractOddsFlow = ai.defineFlow(
  {
    name: 'extractOddsFlow',
    inputSchema: ExtractOddsInputSchema,
    outputSchema: ExtractOddsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
