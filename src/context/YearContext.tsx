
"use client";

import React, { createContext, useContext, useState } from 'react';

interface YearContextType {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];
}

const availableYears = Array.from({ length: 7 }, (_, i) => 2024 + i); // 2024 to 2030

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const value = {
    selectedYear,
    setSelectedYear,
    availableYears,
  };

  return (
    <YearContext.Provider value={value}>
      {children}
    </YearContext.Provider>
  );
};

export const useYear = (): YearContextType => {
  const context = useContext(YearContext);
  if (!context) {
    throw new Error('useYear must be used within a YearProvider');
  }
  return context;
};

