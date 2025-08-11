"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CalculatorClient } from '@/components/calculator-client';
import BetPasteForm from '@/components/bet-paste-form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { sendSurebetToTelegram } from '@/lib/telegram';
import { Icons } from '@/components/icons';
import { Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';



export default function CalculatorPage() {
  const [betData, setBetData] = useState<string>("");
  const router = useRouter();
  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");

  // Função de parsing local (igual do BetPasteForm)
  function parseBetData(data: string) {
    const lines = data.trim().split('\n').filter(line => line.trim());
    if (lines.length < 3) throw new Error('Formato inválido: dados insuficientes');
    const firstLine = lines[0].split('\t');
    const dataHora = firstLine[0]?.trim() || '';
    const evento = firstLine[1]?.trim() || '';
    const modalidade = firstLine[2]?.trim() || '';
    const casa1Line = lines[1].split('\t');
    const casa1 = casa1Line[0]?.trim() || '';
    const mercado1 = casa1Line[1]?.trim() || '';
    const odds1 = casa1Line[2]?.trim() || '';
    const stake1 = casa1Line[5]?.trim() || '';
    const moeda1 = casa1Line[7]?.trim() || '';
    const lucro1 = casa1Line[8]?.trim() || '';
    const roi = casa1Line[9]?.trim() || '';
    const casa2Line = lines[2].split('\t');
    const casa2 = casa2Line[0]?.trim() || '';
    const mercado2 = casa2Line[1]?.trim() || '';
    const odds2 = casa2Line[2]?.trim() || '';
    const stake2 = casa2Line[5]?.trim() || '';
    const moeda2 = casa2Line[7]?.trim() || '';
    const lucro2 = casa2Line[8]?.trim() || '';
    const totalLine = lines[3] || '';
    const totalParts = totalLine.split('\t').filter(part => part.trim());
    const totalStake = totalParts.find(part => /^\d+$/.test(part)) || '';
    const moedaTotal = totalParts.find(part => /^[A-Z]{3}$/.test(part)) || moeda1;
    const lucroTotal = (parseFloat(lucro1) + parseFloat(lucro2)).toFixed(2);
    return {
      evento,
      data: dataHora,
      modalidade,
      casa1,
      casa2,
      mercado1,
      mercado2,
      odds1,
      odds2,
      stake1: `${stake1} ${moeda1}`,
      stake2: `${stake2} ${moeda2}`,
      totalStake: `${totalStake} ${moedaTotal}`,
      lucroEsperado: `${lucroTotal} ${moeda1}`,
      margem: roi,
      lucro1: `${lucro1} ${moeda1}`,
      lucro2: `${lucro2} ${moeda2}`,
    };
  }

  function handleProcess() {
    setError("");
    try {
      const parsed = parseBetData(betData);
      setParsedData(parsed);
    } catch (e: any) {
      setParsedData(null);
      setError(e.message || "Erro ao processar dados");
    }
  }

  async function handleSendTelegram() {
    if (!parsedData) return;
    setSending(true);
    setSuccess("");
    setError("");
    try {
      // Monta a URL da calculadora (ajuste conforme necessário)
  const calculatorUrl = `https://upsurechannel.vercel.app/calculator?odds1=${encodeURIComponent(parsedData.odds1)}&odds2=${encodeURIComponent(parsedData.odds2)}&bookmaker1=${encodeURIComponent(parsedData.casa1)}&bookmaker2=${encodeURIComponent(parsedData.casa2)}`;
      await sendSurebetToTelegram({
        evento: parsedData.evento,
        data: parsedData.data,
        modalidade: parsedData.modalidade,
        casa1: parsedData.casa1,
        mercado1: parsedData.mercado1,
        odds1: parsedData.odds1,
        casa2: parsedData.casa2,
        mercado2: parsedData.mercado2,
        odds2: parsedData.odds2,
        margem: parsedData.margem,
        calculatorUrl
      });
      setSuccess("Enviado para o Telegram com sucesso!");
    } catch (e: any) {
      setError(e.message || "Erro ao enviar para o Telegram");
    }
    setSending(false);
  }

  function handleLogout() {
    // Remove o token de autenticação do localStorage (ou cookies, se usar)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('upsure_auth');
      router.replace('/login');
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] p-4 relative">
      {/* Botão de sair, só aparece se autenticado */}
      {typeof window !== 'undefined' && localStorage.getItem('upsure_auth') && (
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 z-50"
        >
          Sair
        </button>
      )}
      {/* Botão de sair, só aparece se autenticado */}
      {typeof window !== 'undefined' && localStorage.getItem('upsure_auth') && (
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 z-50"
        >
          Sair
        </button>
      )}
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-10 drop-shadow-lg text-center">Colar Surebet</h1>
  <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-stretch">
        {/* Card 1: Colagem e processamento */}
  <Card className="flex-1 shadow-2xl rounded-3xl border border-blue-100 bg-white/95 p-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-blue-700">Cole sua Surebet</CardTitle>
            <CardDescription className="text-gray-500">Cole abaixo os dados copiados da calculadora Surebet.com ou de outra fonte compatível.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="w-full min-h-[140px] font-mono border border-blue-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition text-base bg-blue-50"
              value={betData}
              onChange={e => setBetData(e.target.value)}
              placeholder="Cole aqui os dados copiados..."
            />
            <Button onClick={handleProcess} disabled={!betData.trim()} className="w-full bg-gradient-to-r from-blue-600 to-primary text-white font-bold shadow-lg hover:from-primary hover:to-blue-700 py-4 text-lg rounded-xl">
              Processar Dados
            </Button>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </CardContent>
        </Card>
        {/* Card 2: Validação antes de submeter ao Telegram */}
  <Card className="flex-1 shadow-2xl rounded-3xl border border-blue-100 bg-white/95 p-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-blue-700">Validação dos Dados</CardTitle>
            <CardDescription className="text-gray-500">Confira os dados extraídos antes de enviar ao Telegram</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {parsedData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-blue-800">Evento:</span> <span className="text-gray-900">{parsedData.evento}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">Data/Hora:</span> <span className="text-gray-900">{parsedData.data}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">Modalidade:</span> <span className="text-gray-900">{parsedData.modalidade}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">Casa 1:</span> <span className="text-gray-900">{parsedData.casa1}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">Odds 1:</span> <span className="text-gray-900">{parsedData.odds1}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">Casa 2:</span> <span className="text-gray-900">{parsedData.casa2}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">Odds 2:</span> <span className="text-gray-900">{parsedData.odds2}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">Stake 1:</span> <span className="text-gray-900">{parsedData.stake1}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">Stake 2:</span> <span className="text-gray-900">{parsedData.stake2}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">Total Investido:</span> <span className="text-gray-900">{parsedData.totalStake}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">Lucro Esperado:</span> <span className="text-gray-900">{parsedData.lucroEsperado}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">ROI:</span> <span className="text-gray-900">{parsedData.margem}</span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Nenhum dado processado ainda.</div>
            )}
            {parsedData && (
              <Button onClick={handleSendTelegram} disabled={sending} className="w-full bg-gradient-to-r from-green-500 to-blue-700 text-white font-bold shadow-lg hover:from-blue-700 hover:to-green-600 py-4 text-lg rounded-xl">
                {sending ? 'Enviando...' : 'Enviar para o Telegram'}
              </Button>
            )}
            {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
            {error && !sending && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
