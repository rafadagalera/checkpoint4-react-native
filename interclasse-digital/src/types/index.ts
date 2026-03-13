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
  createdAt: string;
}

export interface RankingRow {
  room: string;
  points: number;
  games: number;
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
