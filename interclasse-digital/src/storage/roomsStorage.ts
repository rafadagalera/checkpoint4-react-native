import AsyncStorage from '@react-native-async-storage/async-storage';
import { Room } from '../types';

const ROOMS_STORAGE_KEY = '@interclasse:rooms';

export async function getStoredRooms(): Promise<Room[]> {
  const raw = await AsyncStorage.getItem(ROOMS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Room[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function persistRooms(rooms: Room[]): Promise<void> {
  await AsyncStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
}
