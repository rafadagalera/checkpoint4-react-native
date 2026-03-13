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
  room?: string;
  date: string;
  time: string;
  location: string;
  homeScore?: number;
  awayScore?: number;
  status?: 'Agendado' | 'Finalizado';
  result?: 'A' | 'DRAW' | 'B';
  createdAt: string;
}

export interface RankingRow {
  room: string;
  points: number;
  games: number;
}

export interface LocalRankingRow {
  room: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface CreateMatchPayload {
  sport: Sport;
  room: string;
  date: string;
  time: string;
  location: string;
  homeScore?: number;
  awayScore?: number;
}
