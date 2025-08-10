export type Bet = {
  id: string;
  game: string;
  team1: string;
  team2: string;
  bet1: {
    bookmaker: string;
    odds: number;
    stake: number;
  };
  bet2: {
    bookmaker: string;
    odds: number;
    stake: number;
  };
  status: 'Pendente' | 'Ganha' | 'Perdida';
  profit: number;
  date: string;
  winningTeam?: string;
};
