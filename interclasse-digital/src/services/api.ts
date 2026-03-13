import axios from 'axios';
import { Platform } from 'react-native';
import { Match } from '../types';

const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

export interface ExternalPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface RoomPayload {
  name: string;
}

export interface MatchPayload {
  title: string;
  body: string;
  userId: number;
}

export async function postRoomApi(payload: RoomPayload) {
  const response = await api.post('/users', {
    name: payload.name,
    username: payload.name.toLowerCase().replace(/\s+/g, '_'),
    email: `${payload.name.toLowerCase().replace(/\s+/g, '')}@escola.com`,
  });
  return response.data;
}

export async function postMatchApi(match: Match) {
  const payload: MatchPayload = {
    title: `${match.sport}: ${match.roomA} x ${match.roomB}`,
    body: `Data ${match.date} ${match.time} - Local ${match.location}`,
    userId: match.roomA.length + match.roomB.length,
  };
  const response = await api.post('/posts', payload);
  return response.data;
}

export async function getMatchesApi(): Promise<ExternalPost[]> {
  const response = await api.get<ExternalPost[]>('/posts', {
    params: { _limit: 8 },
  });
  return response.data;
}
