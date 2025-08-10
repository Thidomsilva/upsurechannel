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
  game: z.string().optional().describe('O nome do jogo ou evento.'),
  team1: z.string().optional().describe('O nome da primeira equipa ou participante.'),
  team2: z.string().optional().describe('O nome da segunda equipa ou participante.'),
  odds1: z.string().optional().describe('As odds para a primeira equipa ou participante.'),
  odds2: z.string().optional().describe('As odds para a segunda equipa ou participante.'),
  stake: z.string().optional().describe('O montante da aposta.'),
  bookmaker: z.string().optional().describe('O nome da casa de apostas.'),
});
export type ValidateAndNormalizeBettingDataInput = z.infer<typeof ValidateAndNormalizeBettingDataInputSchema>;

const ValidateAndNormalizeBettingDataOutputSchema = z.object({
  game: z.string().describe('O nome validado e normalizado do jogo ou evento.'),
  team1: z.string().describe('O nome validado e normalizado da primeira equipa ou participante.'),
  team2: z.string().describe('O nome validado e normalizado da segunda equipa ou participante.'),
  odds1: z.number().describe('As odds validadas e normalizadas para a primeira equipa ou participante.'),
  odds2: z.number().describe('As odds validadas e normalizadas para a segunda equipa ou participante.'),
  stake: z.number().describe('O montante validado e normalizado da aposta.'),
  bookmaker: z.string().describe('O nome validado e normalizado da casa de apostas.'),
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
  prompt: `Você é um especialista em validação e normalização de dados de apostas. Você receberá dados de apostas extraídos de um processo de OCR, que podem conter informações ausentes ou incorretas. Sua tarefa é validar os dados fornecidos, preencher quaisquer campos ausentes e normalizar os tipos de dados. Especificamente:

1.  Garanta que odds1 e odds2 sejam números válidos.
2.  Garanta que a aposta seja um número válido.
3.  Se algum campo estiver ausente, use seu conhecimento para preenchê-lo com base nas informações disponíveis. Seja o mais preciso possível.

Aqui estão os dados da aposta:

Jogo: {{{game}}}
Equipa 1: {{{team1}}}
Equipa 2: {{{team2}}}
Odds 1: {{{odds1}}}
Odds 2: {{{odds2}}}
Aposta: {{{stake}}}
Casa de Apostas: {{{bookmaker}}}

Retorne os dados validados e normalizados em formato JSON.
Garanta que odds1, odds2 e aposta sejam retornados como números.
Se alguma informação não puder ser determinada, retorne uma string vazia para campos de string e 0 para campos numéricos.
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
