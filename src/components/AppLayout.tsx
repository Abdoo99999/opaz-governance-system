"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLanguage } from '@/context/LanguageContext';
import { UserRole } from '@/app/page';
import { useCompany } from '@/context/CompanyContext';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  userRole: UserRole;
}

export default function AppLayout({ children, currentView, onNavigate, onLogout, userRole }: AppLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { dir } = useLanguage();
  const { selectedCompanyId } = useCompany();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-royal-900 text-foreground print:h-auto" dir={dir}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        currentView={currentView} 
        onNavigate={onNavigate}
        onLogout={onLogout} 
        userRole={userRole}
      />
      <div className={cn("flex-1 flex flex-col overflow-hidden print:overflow-visible print-h-auto")}>
        <Header 
          currentView={currentView}
          onToggleSidebar={toggleSidebar} 
          onNavigate={onNavigate}
          userRole={userRole}
          isSidebarVisible={true}
        />
        <main className={cn("flex-1 overflow-x-hidden overflow-y-auto print:overflow-visible print-h-auto")}>
          {React.cloneElement(children as React.ReactElement, { userRole: userRole, key: selectedCompanyId })}
        </main>
      </div>
    </div>
  );
}
