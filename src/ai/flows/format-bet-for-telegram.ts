'use server';
/**
 * @fileOverview Um fluxo de IA que formata as informações de uma aposta para uma mensagem do Telegram.
 *
 * - formatBetForTelegram - Uma função que lida com a formatação.
 * - FormatBetForTelegramInput - O tipo de entrada para a função.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FormatBetForTelegramInputSchema = z.object({
  bettingInfo: z
    .string()
    .describe('O texto bruto de uma aposta colada pelo usuário.'),
});
export type FormatBetForTelegramInput = z.infer<
  typeof FormatBetForTelegramInputSchema
>;

export async function formatBetForTelegram(
  input: FormatBetForTelegramInput
): Promise<string> {
  const prompt = ai.definePrompt({
    name: 'formatBetForTelegramPrompt',
    input: { schema: FormatBetForTelegramInputSchema },
    prompt: `Você é um especialista em formatar informações de apostas (surebets) para o Telegram.
Sua tarefa é pegar o texto bruto fornecido e transformá-lo em uma mensagem clara e bem estruturada usando a sintaxe HTML do Telegram.

O formato de saída deve ser o seguinte:

<b>🏆 Evento:</b> [Nome do Evento e Liga]
<b>🗓️ Data:</b> [Data e Hora do Evento]

<b>Casa 1:</b> [Nome da Casa de Apostas 1]
<b>Aposta:</b> [Descrição da Aposta 1]
<b>Odd:</b> [Odd da Aposta 1]

<b>Casa 2:</b> [Nome da Casa de Apostas 2]
<b>Aposta:</b> [Descrição da Aposta 2]
<b>Odd:</b> [Odd da Aposta 2]

<b>💰 Surebet:</b> [Porcentagem de Lucro da Surebet]

Use as tags <b></b> para negrito e insira quebras de linha para separar as seções.
Analise o texto a seguir e formate-o.

Texto Bruto:
\`\`\`
{{{bettingInfo}}}
\`\`\`
`,
  });

  const { output } = await prompt(input);
  return output!;
}
