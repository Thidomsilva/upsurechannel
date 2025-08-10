'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from './ui/badge';
import { AlertCircle, TrendingUp } from 'lucide-react';

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
      stake2 = (numTotalStake * (1 / numOdds2)) / arbitragePercentage;
      profit = (stake1 * numOdds1) - numTotalStake;
      roi = (profit / numTotalStake) * 100;
    }
  }

  const isSurebet = arbitragePercentage > 0 && arbitragePercentage < 1;


  return (
    <Card className="w-full max-w-lg shadow-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Calculadora de Surebet</CardTitle>
        <CardDescription>
          Insira o valor total que deseja apostar e veja a divisão ideal para garantir seu lucro.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="odds1">Odd 1</Label>
            <Input id="odds1" value={odds1} onChange={(e) => setOdds1(e.target.value)} placeholder="Ex: 2.50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="odds2">Odd 2</Label>
            <Input id="odds2" value={odds2} onChange={(e) => setOdds2(e.target.value)} placeholder="Ex: 1.80" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="total-stake">Valor Total da Aposta (R$)</Label>
          <Input 
            id="total-stake" 
            value={totalStake} 
            onChange={(e) => setTotalStake(e.target.value)} 
            className="text-2xl h-14 font-bold text-center"
            placeholder="1000"
          />
        </div>
        
        {isSurebet ? (
            <div className="grid grid-cols-2 gap-4 text-center">
                 <div className="space-y-1 rounded-lg border p-4">
                    <Label className="text-sm text-muted-foreground">Entrada Aposta 1</Label>
                    <p className="text-xl font-bold">R$ {stake1.toFixed(2)}</p>
                </div>
                 <div className="space-y-1 rounded-lg border p-4">
                    <Label className="text-sm text-muted-foreground">Entrada Aposta 2</Label>
                    <p className="text-xl font-bold">R$ {stake2.toFixed(2)}</p>
                </div>
            </div>
        ) : (
             <div className="flex items-center p-4 text-sm rounded-md bg-destructive/10 text-destructive">
                <AlertCircle className="h-5 w-5 mr-3" />
                Com as odds atuais, não é possível formar uma surebet. Verifique os valores.
            </div>
        )}

      </CardContent>
      {isSurebet && (
         <CardFooter className="bg-muted/50 p-6 rounded-b-lg flex justify-between items-center">
             <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <div>
                    <p className="text-sm text-muted-foreground">Lucro Garantido</p>
                    <p className="text-2xl font-bold text-green-700">R$ {profit.toFixed(2)}</p>
                </div>
            </div>
            <Badge variant="secondary" className="text-base">{roi.toFixed(2)}% ROI</Badge>
         </CardFooter>
      )}
    </Card>
  );
}
