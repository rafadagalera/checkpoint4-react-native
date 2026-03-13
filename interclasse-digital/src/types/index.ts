export type Sport = 'Futsal' | 'Volei' | 'Basquete' | 'Esports';

export interface Room {
  id: string;
  name: string;
  createdAt: string;
}

export interface Match {
  id: string;
  sport: Sport;
  roomA: string;
  roomB: string;
  date: string;
  time: string;
  location: string;
  result?: 'A' | 'DRAW' | 'B';
  createdAt: string;
}

export interface LocalRankingRow {
  room: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
}
