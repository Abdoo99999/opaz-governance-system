"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLanguage } from '@/context/LanguageContext';
import { UserRole } from '@/app/page';

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

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-royal-900 text-foreground" dir={dir}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        currentView={currentView} 
        onNavigate={onNavigate}
        onLogout={onLogout} 
        userRole={userRole}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
