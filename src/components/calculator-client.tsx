'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from './ui/badge';
import { AlertCircle, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';
import { Separator } from './ui/separator';

export function CalculatorClient() {
  const searchParams = useSearchParams();
  const [totalStake, setTotalStake] = React.useState('1000');
  const [odds1, setOdds1] = React.useState('');
  const [odds2, setOdds2] = React.useState('');

  React.useEffect(() => {
    const o1 = searchParams.get('odds1');
    const o2 = searchParams.get('odds2');
    if (o1) setOdds1(o1);
    if (o2) setOdds2(o2);
  }, [searchParams]);

  const numOdds1 = parseFloat(odds1);
  const numOdds2 = parseFloat(odds2);
  const numTotalStake = parseFloat(totalStake);

  let stake1 = 0;
  let stake2 = 0;
  let profit = 0;
  let roi = 0;
  let arbitragePercentage = 0;

  if (!isNaN(numOdds1) && !isNaN(numOdds2) && numOdds1 > 0 && numOdds2 > 0 && !isNaN(numTotalStake) && numTotalStake > 0) {
    arbitragePercentage = (1 / numOdds1) + (1 / numOdds2);
    if (arbitragePercentage < 1) {
      stake1 = (numTotalStake * (1 / numOdds1)) / arbitragePercentage;
      stake2 = numTotalStake - stake1; // More stable calculation
      profit = (stake1 * numOdds1) - numTotalStake;
      roi = (profit / numTotalStake) * 100;
    }
  }

  const isSurebet = arbitragePercentage > 0 && arbitragePercentage < 1;

  return (
    <Card className="w-full max-w-2xl shadow-2xl overflow-hidden">
      <CardHeader className="bg-muted/30 p-6">
        <CardTitle className="font-headline text-2xl">Calculadora de Surebet</CardTitle>
        <CardDescription>
          Insira o valor total que deseja apostar e veja a divisão ideal para garantir seu lucro.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 grid md:grid-cols-2 gap-8 items-start">
        {/* Coluna da Esquerda: Entradas */}
        <div className="grid gap-6">
           <div className="space-y-2">
              <Label htmlFor="total-stake" className="text-lg font-semibold">Valor Total da Aposta (R$)</Label>
              <Input 
                id="total-stake" 
                value={totalStake} 
                onChange={(e) => setTotalStake(e.target.value)} 
                className="h-16 text-4xl font-bold text-center tracking-tight"
                placeholder="1000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="odds1">Odd Casa 1</Label>
                <Input id="odds1" value={odds1} onChange={(e) => setOdds1(e.target.value)} placeholder="Ex: 2.50" className="text-center font-medium"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="odds2">Odd Casa 2</Label>
                <Input id="odds2" value={odds2} onChange={(e) => setOdds2(e.target.value)} placeholder="Ex: 1.80" className="text-center font-medium" />
              </div>
            </div>
        </div>

        {/* Coluna da Direita: Resultados */}
        <div className="rounded-lg border bg-background p-6 space-y-4">
            <h3 className="font-semibold text-lg text-center">Resultado da Simulação</h3>
             {isSurebet ? (
                <div className='space-y-4'>
                    <div className="flex items-center justify-around text-center p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="space-y-1">
                            <Label className="text-sm text-green-800">Entrada Casa 1</Label>
                            <p className="text-2xl font-bold text-green-700">R$ {stake1.toFixed(2)}</p>
                        </div>
                        <ArrowRight className="h-6 w-6 text-green-400" />
                        <div className="space-y-1">
                            <Label className="text-sm text-green-800">Entrada Casa 2</Label>
                            <p className="text-2xl font-bold text-green-700">R$ {stake2.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className='text-center'>
                      <p className='text-sm text-muted-foreground'>Você arrisca R$ {numTotalStake.toFixed(2)} e tem um retorno de R$ {(numTotalStake + profit).toFixed(2)} em qualquer resultado.</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-4 rounded-md bg-destructive/10 text-destructive text-center h-full">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p className='font-semibold'>Não é uma Surebet</p>
                    <p className='text-sm'>Com as odds atuais, não é possível garantir lucro. Verifique os valores inseridos.</p>
                </div>
            )}
        </div>
      </CardContent>
      {isSurebet && (
         <CardFooter className="bg-green-600 text-white p-4 flex justify-around items-center">
             <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6" />
                <div>
                    <p className="text-sm opacity-90">Lucro Garantido</p>
                    <p className="text-2xl font-bold">R$ {profit.toFixed(2)}</p>
                </div>
            </div>
            <Separator orientation='vertical' className='h-10 bg-green-500' />
            <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6" />
                <div>
                    <p className="text-sm opacity-90">Retorno Sobre Investimento</p>
                    <p className="text-2xl font-bold">{roi.toFixed(2)}%</p>
                </div>
            </div>
         </CardFooter>
      )}
    </Card>
  );
}