'use server';

import { z } from 'zod';

const sendToTelegramSchema = z.object({
  text: z.string(),
});

export async function sendToTelegram(formData: FormData) {
  try {
    const text = formData.get('text') as string;

    const validatedData = sendToTelegramSchema.parse({ text });

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
        text: validatedData.text,
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('Erro do Telegram:', result);
      throw new Error('Falha ao enviar mensagem para o Telegram.');
    }
    
    return { success: true, message: 'Mensagem enviada com sucesso para o Telegram!' };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
        return { success: false, message: 'Validação falhou', errors: error.errors };
    }
    return { success: false, message: 'Ocorreu um erro.' };
  }
}
