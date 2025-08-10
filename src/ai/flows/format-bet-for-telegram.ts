'use server';
/**
 * @fileOverview A betting data formatting AI agent for Telegram.
 *
 * - formatBetForTelegram - A function that takes raw betting data and formats it into a clean HTML message for Telegram.
 * - BettingDataInput - The input type for the formatBetForTelegram function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BettingDataInputSchema = z.object({
  bettingData: z
    .string()
    .describe('The raw text containing the betting information.'),
});
export type BettingDataInput = z.infer<typeof BettingDataInputSchema>;

const FormattedBetOutputSchema = z.string().describe('The formatted HTML string for the Telegram message.');

const formatBetPrompt = ai.definePrompt({
  name: 'formatBetPrompt',
  input: { schema: BettingDataInputSchema },
  output: { schema: FormattedBetOutputSchema },
  prompt: `You are a sports betting expert who creates clean, easy-to-read Telegram messages.
Your task is to reformat the user's raw betting text into a structured HTML message.

You must extract the following information and format it exactly like the example:
- The main event (e.g., the two teams playing).
- The league or competition.
- The two betting opportunities, including the bookmaker, the specific bet, and the odd.

Use the following HTML tags:
- <b> for bold text.
- <i> for italic text.
- <code> for fixed-width text (for odds).
- New lines to separate sections.

Example of the desired output format:
<b>⚽ Herrera FC vs San Francisco FC</b>
<i>Panama LPF</i>

<b>Aposta 1:</b> Bet365
Acima 1 1º o período
<b>ODD:</b> <code>1.975</code>

<b>Aposta 2:</b> Pinnacle
Abaixo 1 1º o período
<b>ODD:</b> <code>2.100</code>

---

Here is the raw text to format:
'''
{{{bettingData}}}
'''
`,
});


export async function formatBetForTelegram(input: BettingDataInput): Promise<string> {
  const { output } = await formatBetPrompt(input);
  if (!output) {
    throw new Error('Could not format betting data.');
  }
  return output;
}
