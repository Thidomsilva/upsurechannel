import { Header } from '@/components/header';
import { HistoryClient } from '@/components/history-client';
import type { Bet } from '@/lib/types';

// Mock data fetching for all bets
async function getAllBets(): Promise<Bet[]> {
  return [
    { id: '1', game: 'LAL vs BOS', team1: 'Los Angeles Lakers', team2: 'Boston Celtics', bet1: { bookmaker: 'BetMGM', odds: 1.9, stake: 525.61 }, bet2: { bookmaker: 'FanDuel', odds: 2.2, stake: 474.39 }, profit: 0, status: 'Pendente', date: '2024-07-21T10:00:00Z' },
    { id: '2', game: 'NYK vs PHI', team1: 'New York Knicks', team2: 'Philadelphia 76ers', bet1: { bookmaker: 'DraftKings', odds: 1.85, stake: 531.25 }, bet2: { bookmaker: 'Caesars', odds: 2.25, stake: 468.75 }, profit: 15.63, status: 'Ganha', date: '2024-07-20T18:00:00Z', winningTeam: 'New York Knicks' },
    { id: '3', game: 'GSW vs DEN', team1: 'Golden State Warriors', team2: 'Denver Nuggets', bet1: { bookmaker: 'BetRivers', odds: 2.05, stake: 493.83 }, bet2: { bookmaker: 'PointsBet', odds: 2.05, stake: 506.17 }, profit: 12.35, status: 'Ganha', date: '2024-07-19T21:00:00Z', winningTeam: 'Denver Nuggets' },
    { id: '4', game: 'Man City vs Liverpool', team1: 'Manchester City', team2: 'Liverpool', bet1: { bookmaker: 'FanDuel', odds: 2.3, stake: 465.12 }, bet2: { bookmaker: 'Bet365', odds: 1.8, stake: 534.88 }, profit: -28.56, status: 'Perdida', date: '2024-07-18T14:00:00Z', winningTeam: 'Liverpool' },
    { id: '5', game: 'Real Madrid vs Barcelona', team1: 'Real Madrid', team2: 'Barcelona', bet1: { bookmaker: 'Unibet', odds: 2.1, stake: 487.80 }, bet2: { bookmaker: '888sport', odds: 2.0, stake: 512.20 }, profit: 24.39, status: 'Ganha', date: '2024-07-17T19:00:00Z', winningTeam: 'Real Madrid' },
    { id: '6', game: 'Juventus vs Inter Milan', team1: 'Juventus', team2: 'Inter Milan', bet1: { bookmaker: 'Betway', odds: 2.5, stake: 425.53 }, bet2: { bookmaker: 'William Hill', odds: 1.7, stake: 574.47 }, profit: 0, status: 'Pendente', date: '2024-07-22T18:45:00Z' },
  ];
}

export default async function HistoryPage() {
    const allBets = await getAllBets();
    return (
        <>
            <Header pageTitle="Histórico" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <HistoryClient initialBets={allBets} />
            </main>
        </>
    );
}
