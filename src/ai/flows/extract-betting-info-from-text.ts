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
    .describe('Uma string contendo informações de aposta, provavelmente colada por um usuário.'),
});
export type ExtractBettingInfoFromTextInput = z.infer<typeof ExtractBettingInfoFromTextInputSchema>;

const ExtractBettingInfoFromTextOutputSchema = z.object({
  gameDetails: z.string().describe('Detalhes do jogo, incluindo equipas e data/hora.'),
  odds: z.number().describe('As odds da aposta.'),
  stake: z.number().describe('O montante apostado na aposta.'),
  predictedWinning: z.number().describe('O montante previsto de ganho para a aposta.'),
});
export type ExtractBettingInfoFromTextOutput = z.infer<typeof ExtractBettingInfoFromTextOutputSchema>;

export async function extractBettingInfoFromText(input: ExtractBettingInfoFromTextInput): Promise<ExtractBettingInfoFromTextOutput> {
  return extractBettingInfoFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractBettingInfoFromTextPrompt',
  input: {schema: ExtractBettingInfoFromTextInputSchema},
  output: {schema: ExtractBettingInfoFromTextOutputSchema},
  prompt: `Você é um especialista em extrair informações de apostas de texto bruto.

  Analise o seguinte texto de um boletim de apostas e extraia as informações relevantes, incluindo detalhes do jogo, odds e informações da aposta. O usuário fornecerá uma das apostas, seu trabalho é extrair as informações principais dessa. Concentre-se na primeira aposta listada.

  Informações da Aposta:
  {{{bettingInfo}}}

  Retorne as informações extraídas em um formato estruturado.
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
