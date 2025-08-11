// Função utilitária para enviar texto simples ao canal
export async function sendTelegramMessage(message: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHANNEL,
      text: message,
      parse_mode: "Markdown",
      disable_web_page_preview: false
    })
  });
  if (!res.ok) {
    throw new Error("Erro ao enviar mensagem para o Telegram");
  }
  return await res.json();
}
const TELEGRAM_BOT_TOKEN = "8208024793:AAH_kdUGpNG5q-LQ_iOJfxZP0fDiSDGcjFU";
const TELEGRAM_CHANNEL = "@upsurechanel"; // ou use o ID do canal

export async function sendSurebetToTelegram({
  evento,
  data,
  modalidade,
  casa1,
  mercado1,
  odds1,
  casa2,
  mercado2,
  odds2,
  margem,
  calculatorUrl
}: {
  evento: string;
  data: string;
  modalidade: string;
  casa1: string;
  mercado1: string;
  odds1: string;
  casa2: string;
  mercado2: string;
  odds2: string;
  margem: string;
  calculatorUrl: string;
}) {
  const message = `🚨 ORDEM DE ENTRADA — SUREBET (2 Vias)\n` +
    `📅 ${data}\n` +
    `🏆 ${modalidade}\n` +
    `⚔️ ${evento}\n\n` +
    `🏠 ${casa1}\n` +
    `🎯 ${mercado1}\n` +
    `📈 Odd: ${odds1}\n\n` +
    `🏠 ${casa2}\n` +
    `🎯 ${mercado2}\n` +
    `📈 Odd: ${odds2}\n\n` +
    `📊 ROI: ${margem}\n\n` +
    `👇 Calcule sua entrada com qualquer valor!\n` +
    `[ABRIR CALCULADORA DE SUREBET](${calculatorUrl})`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHANNEL,
      text: message,
      parse_mode: "Markdown",
      disable_web_page_preview: false
    })
  });
  if (!res.ok) {
    throw new Error("Erro ao enviar mensagem para o Telegram");
  }
  return await res.json();
}
