'use server';

import { extractOddsFromText } from '@/ai/flows/extract-odds';
import { z } from 'zod';

const sendToTelegramSchema = z.object({
  text: z.string(),
});

export async function sendToTelegram(formData: FormData) {
  try {
    const text = formData.get('text') as string;
    const validatedData = sendToTelegramSchema.parse({ text });

    // 1. Extrair as odds usando a nova IA
    const { odds1, odds2 } = await extractOddsFromText({
      bettingInfo: validatedData.text,
    });

    if (!odds1 || !odds2) {
      throw new Error('Não foi possível extrair as odds do texto fornecido. Por favor, verifique o formato.');
    }

    // 2. Construir o link para a calculadora
    const calculatorUrl = `https://www.surebet.com/calculator?odds-1=${odds1}&odds-2=${odds2}`;

    // 3. Montar a mensagem final
    const message = `
${validatedData.text}

---

👇 **Calcule sua entrada com qualquer valor!** 👇
Clique no link abaixo para abrir a calculadora com estas odds já preenchidas:
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
        disable_web_page_preview: true, // Para não poluir a mensagem com o preview do site
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
      return { success: false, message: 'Validação falhou', errors: error.errors };
    }
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: errorMessage };
  }
}
