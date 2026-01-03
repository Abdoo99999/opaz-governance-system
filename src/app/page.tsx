
"use client";

import React, { useState } from 'react';
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/components/Dashboard";
import CompanyRegistry from "@/components/CompanyRegistry";
import Assessment from "@/components/Assessment";
import ComplianceMonitor from "@/components/ComplianceMonitor";
import ImprovementPlan from "@/components/ImprovementPlan";
import Reports from "@/components/Reports";
import Settings from "@/components/Settings";
import Login from "@/components/Login";
import { useToast } from '@/hooks/use-toast';
import { LanguageProvider } from '@/context/LanguageContext';
import { CompanyProvider } from '@/context/CompanyContext';

export type UserRole = 'admin' | 'company';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const { toast } = useToast();

  const handleLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setUserRole(role);
    if (role === 'company') {
        setCurrentView('companies'); // Redirect company user to registry
    } else {
        setCurrentView('dashboard');
    }
    toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "أهلاً بك في نظام حوكمة جهاز الاستثمار العماني.",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('admin'); // Reset role on logout
    setCurrentView('dashboard'); // Reset to default view on logout
    toast({
        title: "تم تسجيل الخروج بنجاح",
    });
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return userRole === 'admin' ? <Dashboard /> : <CompanyRegistry />; // Fallback for company user
      case 'companies':
        return <CompanyRegistry />;
      case 'maturity-assessment':
        return <Assessment onNavigate={handleNavigate} />;
      case 'compliance-monitor':
        return <ComplianceMonitor />;
      case 'improvement-plan':
        return <ImprovementPlan />;
      case 'reports':
        return userRole === 'admin' ? <Reports /> : <CompanyRegistry />; // Fallback for company user
      case 'settings':
        return userRole === 'admin' ? <Settings /> : <CompanyRegistry />; // Fallback for company user
      default:
        return userRole === 'admin' ? <Dashboard /> : <CompanyRegistry />;
    }
  };

  return (
    <LanguageProvider>
      <CompanyProvider>
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <AppLayout 
            currentView={currentView} 
            onNavigate={handleNavigate} 
            onLogout={handleLogout}
            userRole={userRole}
          >
            {renderView()}
          </AppLayout>
        )}
      </CompanyProvider>
    </LanguageProvider>
  );
}
