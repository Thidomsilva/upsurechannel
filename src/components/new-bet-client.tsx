'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calculator, CheckCircle, ClipboardPaste, Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { sendToTelegram } from '@/lib/actions';
import { Input } from './ui/input';

export function NewBetClient() {
  const [betInfoText, setBetInfoText] = React.useState('');
  const [odds1, setOdds1] = React.useState('');
  const [odds2, setOdds2] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handlePublish = async () => {
    if (!betInfoText.trim() || !odds1.trim() || !odds2.trim()) {
      toast({
        title: 'Informações Incompletas',
        description:
          'Por favor, preencha o texto da aposta e as duas odds para continuar.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('text', betInfoText);
    formData.append('odds1', odds1);
    formData.append('odds2', odds2);

    const result = await sendToTelegram(formData);

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Publicado no Telegram!',
        description: 'A surebet e o link da calculadora foram enviados.',
        action: (
          <div className="p-2 rounded-full bg-green-500">
            <CheckCircle className="text-white" />
          </div>
        ),
      });
      resetState();
    } else {
      toast({
        title: 'Erro ao Publicar',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const resetState = () => {
    setBetInfoText('');
    setOdds1('');
    setOdds2('');
  };

  const canSubmit = betInfoText.trim() && odds1.trim() && odds2.trim() && !isSubmitting;


  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Publicar Nova Surebet com Calculadora
        </CardTitle>
        <CardDescription>
          Cole o texto da surebet, insira as duas odds principais e o sistema
          enviará a aposta com um link de calculadora para o seu canal do
          Telegram.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ClipboardPaste className="h-5 w-5" />
            <Label htmlFor="bet-info" className="font-semibold">
              1. Cole as Informações da Surebet Aqui
            </Label>
          </div>
          <Textarea
            id="bet-info"
            name="text"
            className="w-full min-h-[150px] font-code"
            placeholder={`Exemplo:
2025-08-10 17:00	San Cristobal – Salcedo FC	Futebol / Dominican Republic - Liga Mayor
Pinnacle (BR)	H1(+0.25) 1º o período	2.370
Bet365 (Full)	H2(−0.25) 1º o período	1.800`}
            value={betInfoText}
            onChange={(e) => setBetInfoText(e.target.value)}
          />
        </div>
        <div className="space-y-2">
           <Label className="font-semibold">2. Insira as Odds</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="odds1">Odd 1</Label>
              <Input
                id="odds1"
                name="odds1"
                type="number"
                placeholder="Ex: 2.370"
                value={odds1}
                onChange={(e) => setOdds1(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="odds2">Odd 2</Label>
              <Input
                id="odds2"
                name="odds2"
                type="number"
                placeholder="Ex: 1.800"
                value={odds2}
                onChange={(e) => setOdds2(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={resetState} disabled={isSubmitting}>
          Limpar
        </Button>
        <Button onClick={handlePublish} disabled={!canSubmit}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Calculator className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? 'Enviando...' : 'Enviar com Calculadora'}
        </Button>
      </CardFooter>
    </Card>
  );
}
