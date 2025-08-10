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
  prompt: `You are a sports betting expert. Your task is to reformat raw betting text into a structured HTML message for Telegram.
You must extract all the relevant information and format the output EXACTLY as shown in the example below, using emojis and <b> tags for emphasis.
The final output must be a single string. The Stake and Total values should NOT be included in the output.

**Example Output Format:**
<b>🚨 ORDEM DE ENTRADA — SUREBET (2 Vias)</b>
📅 <b>Data:</b> <i>DD/MM/AAAA - HH:mm</i>
🏆 <b>Liga:</b> <i>Nome da Liga</i>
⚔️ <b>Evento:</b> <i>Time A vs Time B</i>

🏠 <b>Bookmaker 1:</b> <i>Nome da Casa 1</i>
🎯 <b>Aposta:</b> <i>Descrição da Aposta 1</i>
📈 <b>Odd:</b> <code>ODD_1</code>

🏠 <b>Bookmaker 2:</b> <i>Nome da Casa 2</i>
🎯 <b>Aposta:</b> <i>Descrição da Aposta 2</i>
📈 <b>Odd:</b> <code>ODD_2</code>

---

Now, format the following text. Respond only with the formatted HTML.

Raw Text:
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
