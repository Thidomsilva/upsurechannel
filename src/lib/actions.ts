'use server';

import { validateAndNormalizeBettingData, type BettingDataInput } from '@/ai/flows/validate-and-normalize-betting-data';
import { z } from 'zod';

const sendToTelegramSchema = z.object({
  text: z.string().min(1, 'O texto da aposta não pode estar vazio.'),
  odds1: z.string().refine(val => !isNaN(parseFloat(val)), { message: 'A Odd 1 deve ser um número.' }),
  odds2: z.string().refine(val => !isNaN(parseFloat(val)), { message: 'A Odd 2 deve ser um número.' }),
});

export async function sendToTelegram(formData: FormData) {
  try {
    const validatedData = sendToTelegramSchema.parse({
      text: formData.get('text'),
      odds1: formData.get('odds1'),
      odds2: formData.get('odds2'),
    });

    const { text, odds1, odds2 } = validatedData;
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error('A variável de ambiente NEXT_PUBLIC_BASE_URL não está configurada.');
    }

    const calculatorUrl = `${baseUrl}/calculator?odds1=${odds1}&odds2=${odds2}`;

    const message = `
${text}

---

👇 **Calcule sua entrada com qualquer valor!** 👇
Clique no link abaixo para abrir a nossa calculadora com estas odds já preenchidas:
<a href="${calculatorUrl}">Calculadora de Surebet</a>
`;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      throw new Error('As variáveis de ambiente do Telegram não estão configuradas.');
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('Erro do Telegram:', result);
      throw new Error(`Falha ao enviar mensagem para o Telegram: ${result.description}`);
    }

    return { success: true, message: 'Mensagem enviada com sucesso para o Telegram!' };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(e => e.message).join('\n');
      return { success: false, message: `Erro de validação:\n${formattedErrors}` };
    }
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: errorMessage };
  }
}


export async function extractOddsFromText(bettingData: string): Promise<{ odds1: number, odds2: number } | { error: string }> {
    if (!bettingData.trim()) {
        return { error: 'O texto da aposta está vazio.' };
    }
    try {
        const input: BettingDataInput = { bettingData };
        const result = await validateAndNormalizeBettingData(input);
        return { odds1: result.odds1, odds2: result.odds2 };
    } catch (error) {
        console.error('AI Error:', error);
        return { error: 'A IA não conseguiu extrair as odds. Verifique o texto ou a chave de API.' };
    }
}
