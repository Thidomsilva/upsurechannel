import { Header } from '@/components/header';
import { DashboardClient } from '@/components/dashboard-client';
import type { Bet } from '@/lib/types';

// Mock data fetching
async function getRecentBets(): Promise<Bet[]> {
  return [
    {
      id: '1',
      game: 'LAL vs BOS',
      team1: 'Los Angeles Lakers',
      team2: 'Boston Celtics',
      bet1: { bookmaker: 'BetMGM', odds: 1.9, stake: 525.61 },
      bet2: { bookmaker: 'FanDuel', odds: 2.2, stake: 474.39 },
      profit: 2.1,
      status: 'Pendente',
      date: '2024-07-21T10:00:00Z',
    },
    {
      id: '2',
      game: 'NYK vs PHI',
      team1: 'New York Knicks',
      team2: 'Philadelphia 76ers',
      bet1: { bookmaker: 'DraftKings', odds: 1.85, stake: 531.25 },
      bet2: { bookmaker: 'Caesars', odds: 2.25, stake: 468.75 },
      profit: 1.56,
      status: 'Ganha',
      date: '2024-07-20T18:00:00Z',
      winningTeam: 'New York Knicks',
    },
     {
      id: '3',
      game: 'GSW vs DEN',
      team1: 'Golden State Warriors',
      team2: 'Denver Nuggets',
      bet1: { bookmaker: 'BetRivers', odds: 2.05, stake: 493.83 },
      bet2: { bookmaker: 'PointsBet', odds: 2.05, stake: 506.17 },
      profit: 1.25,
      status: 'Ganha',
      date: '2024-07-19T21:00:00Z',
      winningTeam: 'Denver Nuggets'
    },
    {
      id: '4',
      game: 'Man City vs Liverpool',
      team1: 'Manchester City',
      team2: 'Liverpool',
      bet1: { bookmaker: 'FanDuel', odds: 2.3, stake: 465.12 },
      bet2: { bookmaker: 'Bet365', odds: 1.8, stake: 534.88 },
      profit: -2.33,
      status: 'Perdida',
      date: '2024-07-18T14:00:00Z',
    },
  ];
}

export default async function DashboardPage() {
  const recentBets = await getRecentBets();

  return (
    <>
      <Header pageTitle="Painel" />
      <DashboardClient recentBets={recentBets} />
    </>
  );
}
