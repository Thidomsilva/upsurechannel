'use server';

import { extractBettingData } from '@/lib/ai';
import { extractOddsFromText } from './actions-client';
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
    
    const numOdds1 = parseFloat(odds1);
    const numOdds2 = parseFloat(odds2);

    // 1. Extract structured data using the AI flow
    const extractedData = await extractBettingData({ bettingData: text });

    // 2. Format the main message body using the extracted data
    const mainMessage = `🚨 <b>ORDEM DE ENTRADA — SUREBET (2 Vias)</b>
📅 ${extractedData.date}
🏆 ${extractedData.league}
⚔️ ${extractedData.event}

🏠 <b>${extractedData.bookmaker1}</b>
🎯 ${extractedData.bet1}
📈 Odd: <code>${extractedData.odd1}</code>

🏠 <b>${extractedData.bookmaker2}</b>
🎯 ${extractedData.bet2}
📈 Odd: <code>${extractedData.odd2}</code>`;

    // 3. Calculate profit percentage
    let footer = '';
    const arbitragePercentage = (1 / numOdds1) + (1 / numOdds2);
    if (arbitragePercentage < 1) {
      const profit = (1 / arbitragePercentage - 1) * 100;
      footer += `\n\n📊 <b>ROI: +${profit.toFixed(2)}%</b>`;
    }

    // 4. Construct calculator URL, now with bookmaker names
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (baseUrl) {
      const calculatorUrl = `${baseUrl}/calculator?odds1=${numOdds1}&odds2=${numOdds2}&bookmaker1=${encodeURIComponent(extractedData.bookmaker1)}&bookmaker2=${encodeURIComponent(extractedData.bookmaker2)}`;
       // 5. Add calculator link to the footer
      footer += `\n\n👇 <b>Calcule sua entrada com qualquer valor!</b>
<a href="${calculatorUrl}">ABRIR CALCULADORA DE SUREBET</a>`;
    }


    // 6. Build the final message
    const message = `${mainMessage}${footer}`;

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

export { extractOddsFromText };
