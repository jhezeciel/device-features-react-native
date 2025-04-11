import { ReactNode } from "react";

export interface TravelEntry {
  description: ReactNode;
  title: ReactNode;
  id: string;
  photoUri: string;
  address: string;
  date: string;
}
export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined; 
};


