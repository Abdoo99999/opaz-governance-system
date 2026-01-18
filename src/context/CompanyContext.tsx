
"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { COMPANIES, Company, SubmissionStatus } from '@/data/companies';

interface CompanyContextType {
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  getSelectedCompany: () => Company | null;
  getCompanySubmissionStatus: (id: string) => SubmissionStatus;
  dataVersion: number;
  refreshData: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
  const [dataVersion, setDataVersion] = useState(0);

  const refreshData = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  const getSelectedCompany = (): Company | null => {
    if (selectedCompanyId === 'all' || typeof window === 'undefined') return null;
    const allCompaniesStr = localStorage.getItem('oia_companies_registry');
    const allCompanies = allCompaniesStr ? JSON.parse(allCompaniesStr) : COMPANIES;
    return allCompanies.find((c: any) => c.id === selectedCompanyId) || null;
  };

  const getCompanySubmissionStatus = (id: string): SubmissionStatus => {
      if (typeof window === 'undefined') return 'draft';
      const allCompaniesStr = localStorage.getItem('oia_companies_registry');
      if (allCompaniesStr) {
          const allCompanies = JSON.parse(allCompaniesStr);
          const company = allCompanies.find((c: any) => c.id === id);
          return company?.submissionStatus || 'draft';
      }
      return 'draft';
  };
  
  const value = {
      selectedCompanyId,
      setSelectedCompanyId,
      getSelectedCompany,
      getCompanySubmissionStatus,
      dataVersion,
      refreshData
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
