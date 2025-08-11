"use client";
import { useEffect, useState } from "react";
import { getHistory, clearHistory, Operation } from "@/lib/history";
import { sendTelegramMessage } from "../lib/telegram";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HistoryList() {
  const [history, setHistory] = useState<Operation[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Agrupar operações por data e numerar por dia
  let lastDate = '';
  let opNumber = 1;
  const rows = history.map((op, idx) => {
    const date = new Date(op.date).toLocaleDateString('pt-BR');
    if (date !== lastDate) {
      opNumber = 1;
      lastDate = date;
    } else {
      opNumber++;
    }
    return { ...op, date, opNumber, idx, rawDate: op.date };
  });

  // Funções para filtrar histórico
  function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }
  function isSameWeek(date1: Date, date2: Date): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const startOfWeek = (d: Date) => {
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // segunda como início
      return new Date(d.setDate(diff));
    };
    const s1 = startOfWeek(new Date(d1));
    const s2 = startOfWeek(new Date(d2));
    return s1.toDateString() === s2.toDateString();
  }
  function isSameMonth(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth();
  }

  // Função para gerar mensagem resumida
  function buildSummary(ops: Operation[]): string {
    if (ops.length === 0) return 'Nenhuma operação registrada.';
    let lastDate = '';
    let opNumber = 1;
    return ops.map((op, idx) => {
      const date = new Date(op.date).toLocaleDateString('pt-BR');
      if (date !== lastDate) {
        opNumber = 1;
        lastDate = date;
      } else {
        opNumber++;
      }
      return `${date} - Operação ${opNumber}: ${op.roi}`;
    }).join('\n');
  }

  // Handlers dos botões
  // Corrigir filtro para considerar fuso horário e datas locais
  // Enviar exatamente o que está sendo exibido na tela para cada botão
  const getRowsByPeriod = (period: 'day' | 'week' | 'month') => {
    if (rows.length === 0) return [];
    const today = new Date();
    if (period === 'day') {
      return rows.filter(op => op.date === today.toLocaleDateString('pt-BR'));
    }
    if (period === 'week') {
      // Pega todas as operações da mesma semana do ano
      const getWeek = (d: Date) => {
        const date = new Date(d.getTime());
        date.setHours(0,0,0,0);
        const firstDay = date.getDate() - date.getDay() + 1;
        const weekStart = new Date(date.setDate(firstDay));
        return weekStart;
      };
      const weekStart = getWeek(today).toLocaleDateString('pt-BR');
      return rows.filter(op => getWeek(new Date(op.rawDate)).toLocaleDateString('pt-BR') === weekStart);
    }
    if (period === 'month') {
      return rows.filter(op => {
        const d = new Date(op.rawDate);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      });
    }
    return [];
  };

  const handleSendDay = async () => {
    const ops = getRowsByPeriod('day');
    const msg = buildSummary(ops);
    await sendTelegramMessage(msg);
    alert('Histórico do dia enviado para o Telegram!');
  };
  const handleSendWeek = async () => {
    const ops = getRowsByPeriod('week');
    const msg = buildSummary(ops);
    await sendTelegramMessage(msg);
    alert('Histórico da semana enviado para o Telegram!');
  };
  const handleSendMonth = async () => {
    const ops = getRowsByPeriod('month');
    const msg = buildSummary(ops);
    await sendTelegramMessage(msg);
    alert('Histórico do mês enviado para o Telegram!');
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Histórico de Operações</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="text-muted-foreground text-center">Nenhuma operação registrada ainda.</div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-2 mb-4">
              <Button onClick={handleSendDay} variant="secondary">Enviar histórico do dia</Button>
              <Button onClick={handleSendWeek} variant="secondary">Enviar histórico da semana</Button>
              <Button onClick={handleSendMonth} variant="secondary">Enviar histórico do mês</Button>
            </div>
            <ul className="divide-y divide-gray-200">
              {rows.map((op) => (
                <li key={op.idx} className="flex justify-between py-2 text-base">
                  <span>{op.date}</span>
                  <span>Operação {op.opNumber}</span>
                  <span className="font-bold text-green-700">{op.roi}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {rows.length > 0 && (
          <Button variant="destructive" className="mt-4 w-full" onClick={() => { clearHistory(); setHistory([]); }}>
            Limpar Histórico
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
