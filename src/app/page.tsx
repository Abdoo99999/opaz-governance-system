"use client";

import React, { useState } from 'react';
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/components/Dashboard";
import CompanyRegistry from "@/components/CompanyRegistry";
import Assessment from "@/components/Assessment";
import ComplianceMonitor from "@/components/ComplianceMonitor";
import ImprovementPlan from "@/components/ImprovementPlan";
import Reports from "@/components/Reports";
import Login from "@/components/Login";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
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
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AppLayout currentView={currentView} onNavigate={handleNavigate}>
      {renderView()}
    </AppLayout>
  );
}
