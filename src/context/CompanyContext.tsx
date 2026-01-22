
"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ZONES, Zone, SubmissionStatus } from '@/data/companies';

interface ZoneContextType {
  selectedZoneId: string;
  setSelectedZoneId: (id: string) => void;
  getSelectedZone: () => Zone | null;
  getZoneSubmissionStatus: (id: string) => SubmissionStatus;
  dataVersion: number;
  refreshData: () => void;
}

const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

export const ZoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('all');
  const [dataVersion, setDataVersion] = useState(0);

  const refreshData = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  const getSelectedZone = (): Zone | null => {
    if (selectedZoneId === 'all' || typeof window === 'undefined') return null;
    const allZonesStr = localStorage.getItem('opaz_zones_registry');
    const allZones = allZonesStr ? JSON.parse(allZonesStr) : ZONES;
    return allZones.find((z: any) => z.id === selectedZoneId) || null;
  };

  const getZoneSubmissionStatus = (id: string): SubmissionStatus => {
      if (typeof window === 'undefined') return 'draft';
      const allZonesStr = localStorage.getItem('opaz_zones_registry');
      if (allZonesStr) {
          const allZones = JSON.parse(allZonesStr);
          const zone = allZones.find((z: any) => z.id === id);
          return zone?.submissionStatus || 'draft';
      }
      return 'draft';
  };
  
  const value = {
      selectedZoneId,
      setSelectedZoneId,
      getSelectedZone,
      getZoneSubmissionStatus,
      dataVersion,
      refreshData
  };

  return (
    <ZoneContext.Provider value={value}>
      {children}
    </ZoneContext.Provider>
  );
};

export const useCompany = (): ZoneContextType => {
  const context = useContext(ZoneContext);
  if (!context) {
    throw new Error('useZone must be used within a ZoneProvider');
  }
  return context;
};

    