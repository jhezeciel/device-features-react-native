import React, { createContext, useState, ReactNode } from 'react';

interface Entry {
  id: string;
  photoUri: string;
  address: string;
  date: string;
  title: string;
  description: string;
}

interface TravelDiaryContextProps {
  entries: Entry[];
  addEntry: (entry: Entry) => void;
}

export const TravelDiaryContext = createContext<TravelDiaryContextProps | undefined>(undefined);

export const TravelDiaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Entry[]>([]);

  const addEntry = (entry: Entry) => {
    setEntries((prevEntries) => [...prevEntries, entry]);
  };

  return (
    <TravelDiaryContext.Provider value={{ entries, addEntry }}>
      {children}
    </TravelDiaryContext.Provider>
  );
};
