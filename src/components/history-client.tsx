'use client';

import * as React from 'react';
import type { Bet } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

const getBadgeVariant = (status: Bet['status']) => {
  if (status === 'Ganha') return 'default';
  if (status === 'Perdida') return 'destructive';
  return 'secondary';
};

export function HistoryClient({ initialBets }: { initialBets: Bet[] }) {
  const [bets, setBets] = React.useState<Bet[]>(initialBets);
  const { toast } = useToast();

  const handleSettleBet = (
    betId: string,
    winningTeam: 'team1' | 'team2'
  ) => {
    setBets((prevBets) =>
      prevBets.map((bet) => {
        if (bet.id === betId) {
          const winningBet = winningTeam === 'team1' ? bet.bet1 : bet.bet2;
          const losingBet = winningTeam === 'team1' ? bet.bet2 : bet.bet1;
          const profit =
            winningBet.stake * winningBet.odds -
            winningBet.stake -
            losingBet.stake;

          toast({
            title: 'Aposta Liquidada!',
            description: `Lucro de $${profit.toFixed(2)} foi registrado.`,
          });

          return {
            ...bet,
            status: 'Ganha',
            profit: profit,
            winningTeam: winningTeam === 'team1' ? bet.team1 : bet.team2,
          };
        }
        return bet;
      })
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Histórico de Apostas</CardTitle>
        <CardDescription>
          Um registro completo de todas as suas atividades de apostas passadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jogo</TableHead>
                <TableHead>Detalhes da Aposta</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Lucro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bets.map((bet) => (
                <TableRow key={bet.id}>
                  <TableCell>
                    <div className="font-medium">{bet.game}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(bet.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">{bet.team1}:</span>{' '}
                      <span className="text-muted-foreground">
                        ${bet.bet1.stake.toFixed(2)} @ {bet.bet1.odds.toFixed(2)} ({bet.bet1.bookmaker})
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{bet.team2}:</span>{' '}
                      <span className="text-muted-foreground">
                        ${bet.bet2.stake.toFixed(2)} @ {bet.bet2.odds.toFixed(2)} ({bet.bet2.bookmaker})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getBadgeVariant(bet.status)}>
                      {bet.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      bet.profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {bet.status !== 'Pendente'
                      ? `${bet.profit >= 0 ? '+' : ''}$${bet.profit.toFixed(2)}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {bet.status === 'Pendente' ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Liquidar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Liquidar Aposta: {bet.game}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Por favor, selecione a equipe vencedora para calcular o
                              lucro e liquidar esta aposta.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleSettleBet(bet.id, 'team2')}
                            >
                              {bet.team2} Venceu
                            </AlertDialogAction>
                             <AlertDialogAction
                              onClick={() => handleSettleBet(bet.id, 'team1')}
                            >
                              {bet.team1} Venceu
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Liquidado
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
