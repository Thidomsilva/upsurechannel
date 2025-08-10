'use server';

import { formatBetForTelegram } from '@/ai/flows/format-bet-for-telegram';
import { z } from 'zod';

const sendToTelegramSchema = z.object({
  text: z.string(),
});

export async function sendToTelegram(formData: FormData) {
  try {
    const text = formData.get('text') as string;

    const validatedData = sendToTelegramSchema.parse({ text });

    // Formata a mensagem usando IA
    const formattedText = await formatBetForTelegram({
      bettingInfo: validatedData.text,
    });

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      throw new Error('As variáveis de ambiente do Telegram não estão configuradas.');
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedText,
        parse_mode: 'HTML', // Habilita a formatação HTML
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
