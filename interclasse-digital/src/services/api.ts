import axios from 'axios';
import { Platform } from 'react-native';
import { Match, Room } from '../types';

const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

export interface ExternalMatch {
  id: number;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  hour: string;
  court: string;
}

export interface RoomPayload {
  Name: string;
  ID: string;
}

export interface MatchPayload {
  sport: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  hour: string;
  court: string;
}

export async function postRoomApi(room: Room) {
  const payload: RoomPayload = {
    Name: room.name,
    ID: room.id,
  };
  const response = await api.post('/classrooms', payload);
  return response.data;
}

export async function postMatchApi(match: Match) {
  const payload: MatchPayload = {
    sport: match.sport,
    homeTeam: match.roomA,
    awayTeam: match.roomB,
    date: match.date,
    hour: match.time,
    court: match.location,
  };
  const response = await api.post('/matches', payload);
  return response.data;
}

export async function getMatchesApi(): Promise<ExternalMatch[]> {
  const response = await api.get<ExternalMatch[]>('/matches', {
    params: { _limit: 8 },
  });
  return response.data;
}
