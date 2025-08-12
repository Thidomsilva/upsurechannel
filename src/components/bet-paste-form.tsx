"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Save, Calculator, RotateCcw, Copy, Send } from "lucide-react";
import { sendSurebetToTelegram } from "@/lib/telegram";
import { saveOperation } from "@/lib/history";


// Parser Surebet.com (original)
function parseSurebetData(data: string) {
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

// Parser BetBurger.com
function parseBetburgerData(data: string) {
  const lines = data.trim().split('\n').filter(line => line.trim());
  if (lines.length < 3) throw new Error('Formato inválido: dados insuficientes');
  // Exemplo:
  // 12 ago 05:00\tFutebol.New Lambton 2 - Newcastle Olympic Reserves (Australia. NPL NNSW Reserves) 0.83%
  // Bet365\tAH1(+1.75)\t1.975\t277.87\tBRL\t4.51
  // Pinnacle\tAH2(-1.75)\t2.060\t266.41\tBRL\t4.52
  const firstLine = lines[0].split('\t');
  const dataHora = firstLine[0]?.trim() || '';
  // Separar evento, modalidade e ROI
  const eventoModalRoi = firstLine[1]?.trim() || '';
  const roiMatch = eventoModalRoi.match(/([\d.,]+)%$/);
  const roi = roiMatch ? roiMatch[1] + '%' : '';
  const eventoModal = eventoModalRoi.replace(/([\d.,]+)%$/, '').trim();
  // Modalidade: antes do primeiro ponto
  const modalidadeMatch = eventoModal.match(/^([^.]+)\./);
  const modalidade = modalidadeMatch ? modalidadeMatch[1] : '';
  // Evento: depois do primeiro ponto
  const evento = eventoModal.replace(/^([^.]+)\./, '').trim();
  // Casas
  const casa1Line = lines[1].split('\t');
  const casa1 = casa1Line[0]?.trim() || '';
  const mercado1 = casa1Line[1]?.trim() || '';
  const odds1 = casa1Line[2]?.trim() || '';
  const stake1 = casa1Line[3]?.trim() || '';
  const moeda1 = casa1Line[4]?.trim() || '';
  // const lucro1 = casa1Line[5]?.trim() || '';
  const casa2Line = lines[2].split('\t');
  const casa2 = casa2Line[0]?.trim() || '';
  const mercado2 = casa2Line[1]?.trim() || '';
  const odds2 = casa2Line[2]?.trim() || '';
  const stake2 = casa2Line[3]?.trim() || '';
  const moeda2 = casa2Line[4]?.trim() || '';
  // const lucro2 = casa2Line[5]?.trim() || '';
  // Total investido
  const totalStake = (parseFloat(stake1) + parseFloat(stake2)).toFixed(2);
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
    totalStake: `${totalStake} ${moeda1}`,
    lucroEsperado: '-',
    margem: roi,
    lucro1: '-',
    lucro2: '-',
  };
}


function BetPasteForm() {
  const [rawData, setRawData] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [format, setFormat] = useState<'surebet' | 'betburger'>('surebet');

  const handleProcess = () => {
    setIsProcessing(true);
    setError("");
    try {
      const parsed = format === 'surebet' ? parseSurebetData(rawData) : parseBetburgerData(rawData);
      setResult(parsed);
    } catch (e: any) {
      setResult(null);
      setError(e.message || "Erro ao processar dados");
    }
    setIsProcessing(false);
  };

  const handleClear = () => {
    setRawData("");
    setResult(null);
    setError("");
  };

  const sampleDataSurebet = `2025-07-19 02:00\tWellington Phoenix – Wrexham\tFutebol / Club Friendlies\nPinnacle (BR)\tH1(+0.75) 1º o período\t2.060\t0.0\t2.060\t47.00\t0\tBRL\t1.82\t2.75%\nBet365 (Full)\tH2(−0.75) 1º o período\t2.050\t0.0\t2.050\t48.00\t0\tBRL\t3.40\n\t\t\t\t\t95\t\tBRL`;
  const sampleDataBetburger = `12 ago 05:00\tFutebol.New Lambton 2 - Newcastle Olympic Reserves (Australia. NPL NNSW Reserves) 0.83%\nBet365\tAH1(+1.75)\t1.975\t277.87\tBRL\t4.51\nPinnacle\tAH2(-1.75)\t2.060\t266.41\tBRL\t4.52`;

  async function handleSendTelegram() {
    if (!result) return;
    setSending(true);
    setSuccess("");
    setError("");
    try {
      // Monta a URL da calculadora
  const calculatorUrl = `https://upsurechannel.vercel.app/calculator?odds1=${encodeURIComponent(result.odds1)}&odds2=${encodeURIComponent(result.odds2)}&bookmaker1=${encodeURIComponent(result.casa1)}&bookmaker2=${encodeURIComponent(result.casa2)}`;
      await sendSurebetToTelegram({
        evento: result.evento,
        data: result.data,
        modalidade: result.modalidade,
        casa1: result.casa1,
        mercado1: result.mercado1,
        odds1: result.odds1,
        casa2: result.casa2,
        mercado2: result.mercado2,
        odds2: result.odds2,
        margem: result.margem,
        calculatorUrl
      });
      // Salva no histórico local
      saveOperation({
        date: new Date().toISOString(),
        roi: result.margem || "-"
      });
      setSuccess("Enviado para o Telegram com sucesso!");
    } catch (e: any) {
      setError(e.message || "Erro ao enviar para o Telegram");
    }
    setSending(false);
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Importar Dados de Aposta</CardTitle>
        <CardDescription>Cole os dados copiados da calculadora Surebet.com</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-center mb-2">
          <Label htmlFor="bet-data">Dados</Label>
          <div className="flex gap-2">
            <Button type="button" variant={format === 'surebet' ? 'default' : 'outline'} size="sm" onClick={() => setFormat('surebet')}>Surebet.com</Button>
            <Button type="button" variant={format === 'betburger' ? 'default' : 'outline'} size="sm" onClick={() => setFormat('betburger')}>BetBurger.com</Button>
          </div>
        </div>
        <Textarea
          id="bet-data"
          value={rawData}
          onChange={e => setRawData(e.target.value)}
          placeholder={format === 'surebet' ? "Cole aqui os dados copiados do Surebet.com..." : "Cole aqui os dados copiados do BetBurger.com..."}
          className="min-h-[120px] font-mono"
        />
        <div className="flex gap-2">
          <Button onClick={handleProcess} disabled={isProcessing || !rawData.trim()}>
            {isProcessing ? "Processando..." : "Processar Dados"}
            <Calculator className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setRawData(format === 'surebet' ? sampleDataSurebet : sampleDataBetburger)}>
            <Copy className="mr-2 h-4 w-4" />Exemplo
          </Button>
          <Button variant="destructive" onClick={handleClear} disabled={!rawData && !result}>
            <RotateCcw className="mr-2 h-4 w-4" />Limpar
          </Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {result && (
          <div className="space-y-2 mt-4">
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Evento</Label>
                <Input value={result.evento} readOnly />
              </div>
              <div>
                <Label>Data/Hora</Label>
                <Input value={result.data} readOnly />
              </div>
              <div>
                <Label>Modalidade</Label>
                <Input value={result.modalidade} readOnly />
              </div>
              <div>
                <Label>Casa 1</Label>
                <Input value={result.casa1} readOnly />
              </div>
              <div>
                <Label>Odds 1</Label>
                <Input value={result.odds1} readOnly />
              </div>
              <div>
                <Label>Casa 2</Label>
                <Input value={result.casa2} readOnly />
              </div>
              <div>
                <Label>Odds 2</Label>
                <Input value={result.odds2} readOnly />
              </div>
              <div>
                <Label>Stake 1</Label>
                <Input value={result.stake1} readOnly />
              </div>
              <div>
                <Label>Stake 2</Label>
                <Input value={result.stake2} readOnly />
              </div>
              <div>
                <Label>Total Investido</Label>
                <Input value={result.totalStake} readOnly />
              </div>
              <div>
                <Label>Lucro Esperado</Label>
                <Input value={result.lucroEsperado} readOnly />
              </div>
              <div>
                <Label>ROI</Label>
                <Input value={result.margem} readOnly />
              </div>
            </div>
            <Button onClick={handleSendTelegram} disabled={sending} className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-700 text-white font-bold shadow-lg hover:from-blue-700 hover:to-green-600 py-4 text-lg rounded-xl">
              {sending ? 'Enviando...' : 'Enviar para o Telegram'}
              <Send className="ml-2 h-5 w-5" />
            </Button>
            {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
            {error && !sending && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BetPasteForm;
