
"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { COMPANIES, Company } from '@/data/companies';

interface CompanyContextType {
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  getSelectedCompany: () => Company | null;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');

  const getSelectedCompany = (): Company | null => {
    if (selectedCompanyId === 'all') return null;
    return COMPANIES.find(c => c.id === selectedCompanyId) || null;
  };
  
  const value = {
      selectedCompanyId,
      setSelectedCompanyId,
      getSelectedCompany
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
