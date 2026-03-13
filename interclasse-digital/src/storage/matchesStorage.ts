import AsyncStorage from '@react-native-async-storage/async-storage';
import { Match } from '../types';

const MATCHES_STORAGE_KEY = '@interclasse:matches';

export async function getStoredMatches(): Promise<Match[]> {
  const raw = await AsyncStorage.getItem(MATCHES_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Match[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function persistMatches(matches: Match[]): Promise<void> {
  await AsyncStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(matches));
}
