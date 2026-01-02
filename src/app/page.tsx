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

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const { toast } = useToast();

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "أهلاً بك في نظام حوكمة جهاز الاستثمار العماني.",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
        return <Dashboard />;
      case 'companies':
        return <CompanyRegistry />;
      case 'maturity-assessment':
        return <Assessment />;
      case 'compliance-monitor':
        return <ComplianceMonitor />;
      case 'improvement-plan':
        return <ImprovementPlan />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AppLayout currentView={currentView} onNavigate={handleNavigate} onLogout={handleLogout}>
      {renderView()}
    </AppLayout>
  );
}
