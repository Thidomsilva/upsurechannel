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
import { Send, ClipboardPaste, CheckCircle, Loader2, Calculator } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { sendToTelegram } from '@/lib/actions';

export function NewBetClient() {
  const [betInfoText, setBetInfoText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handlePublish = async () => {
    if (!betInfoText.trim()) {
      toast({
        title: 'Nenhuma informação fornecida',
        description: 'Por favor, cole as informações da aposta para publicar.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('text', betInfoText);

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
      setBetInfoText('');
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
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Publicar Nova Surebet com Calculadora
        </CardTitle>
        <CardDescription>
          Cole o texto da surebet abaixo. O sistema irá extrair as odds, gerar um link de calculadora e enviar tudo para o seu canal do Telegram.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] flex flex-col justify-center items-center">
        <div className="w-full p-4 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ClipboardPaste className="h-5 w-5" />
            <Label htmlFor="bet-info" className="font-semibold">
              Cole as Informações da Surebet Aqui
            </Label>
          </div>
          <Textarea
            id="bet-info"
            name="text"
            className="w-full min-h-[200px] font-code"
            placeholder={`Exemplo:
2025-08-10 17:00	San Cristobal – Salcedo FC	Futebol / Dominican Republic - Liga Mayor
Pinnacle (BR)	H1(+0.25) 1º o período	2.370
Bet365 (Full)	H2(−0.25) 1º o período	1.800`}
            value={betInfoText}
            onChange={(e) => setBetInfoText(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
         <Button variant="ghost" onClick={resetState} disabled={isSubmitting}>Limpar</Button>
        <Button onClick={handlePublish} disabled={!betInfoText.trim() || isSubmitting}>
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
