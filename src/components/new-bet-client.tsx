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
import { Send, ClipboardPaste, CheckCircle } from 'lucide-react';
import { Textarea } from './ui/textarea';

export function NewBetClient() {
  const [betInfoText, setBetInfoText] = React.useState('');
  const { toast } = useToast();

  const handlePublish = () => {
    if (!betInfoText.trim()) {
      toast({
        title: 'Nenhuma informação fornecida',
        description: 'Por favor, cole as informações da aposta para publicar.',
        variant: 'destructive',
      });
      return;
    }

    // Aqui, no futuro, você adicionaria a lógica para enviar `betInfoText` para a API do Telegram.
    console.log('Publicando no Telegram:', betInfoText);

    toast({
      title: 'Publicado no Telegram!',
      description: 'A surebet foi enviada com sucesso para o canal.',
      action: (
        <div className="p-2 rounded-full bg-green-500">
          <CheckCircle className="text-white" />
        </div>
      ),
    });
    setBetInfoText(''); // Limpa a área de texto após a publicação
  };

  const resetState = () => {
    setBetInfoText('');
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Publicar Nova Surebet
        </CardTitle>
        <CardDescription>
          Cole o texto da surebet abaixo e clique em publicar para enviá-la ao
          seu canal do Telegram.
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
         <Button variant="ghost" onClick={resetState}>Limpar</Button>
        <Button onClick={handlePublish} disabled={!betInfoText.trim()}>
          <Send className="mr-2 h-4 w-4" /> Publicar no Telegram
        </Button>
      </CardFooter>
    </Card>
  );
}
