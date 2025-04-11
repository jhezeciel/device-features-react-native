import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelEntry } from '../types';

const ENTRIES_KEY = 'TRAVEL_ENTRIES';

export const getEntries = async (): Promise<TravelEntry[]> => {
  const data = await AsyncStorage.getItem(ENTRIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEntry = async (entry: TravelEntry) => {
  const entries = await getEntries();
  const newEntries = [entry, ...entries];
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(newEntries));
};

export const removeEntry = async (id: string) => {
  const entries = await getEntries();
  const filtered = entries.filter(entry => entry.id !== id);
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(filtered));
};
