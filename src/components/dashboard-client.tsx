'use client';

import * as React from 'react';
import {
  Activity,
  Archive,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Bet } from '@/lib/types';

const chartData = [
  { month: 'Janeiro', profit: 186 },
  { month: 'Fevereiro', profit: 305 },
  { month: 'Março', profit: 237 },
  { month: 'Abril', profit: 73 },
  { month: 'Maio', profit: 209 },
  { month: 'Junho', profit: 214 },
];

const chartConfig = {
  profit: {
    label: 'Lucro',
    color: 'hsl(var(--primary))',
  },
};

export function DashboardClient({ recentBets }: { recentBets: Bet[] }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% do último mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.34%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% do último mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Apostas Ativas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+57</div>
            <p className="text-xs text-muted-foreground">
              +1 desde a última hora
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liquidado</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% do último mês
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle className="font-headline">Visão Geral de Lucros</CardTitle>
              <CardDescription>
                Lucro mensal das atividades de apostas.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Apostas Recentes</CardTitle>
            <CardDescription>
              Um registro das surebets criadas mais recentemente.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8">
            {recentBets.slice(0, 5).map((bet) => (
              <div key={bet.id} className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">{bet.game}</p>
                  <p className="text-sm text-muted-foreground">
                    {bet.bet1.bookmaker} vs {bet.bet2.bookmaker}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {bet.profit > 0 ? `+${bet.profit.toFixed(2)}%` : `${bet.profit.toFixed(2)}%`}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
