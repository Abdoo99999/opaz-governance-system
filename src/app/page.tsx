
"use client";

import React, { useState } from 'react';
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/components/Dashboard";
import CompanyRegistry from "@/components/CompanyRegistry";
import Assessment from "@/components/Assessment";
import ComplianceMonitor from "@/components/ComplianceMonitor";
import ImprovementPlan from "@/components/ImprovementPlan";
import FinancialStatements from "@/components/FinancialStatements";
import Reports from "@/components/Reports";
import Settings from "@/components/Settings";
import Login from "@/components/Login";
import ReviewSubmit from '@/components/ReviewSubmit';
import ApprovalRequests from '@/components/ApprovalRequests';
import { useToast } from '@/hooks/use-toast';
import { LanguageProvider } from '@/context/LanguageContext';
import { CompanyProvider, useCompany } from '@/context/CompanyContext';

export type UserRole = 'admin' | 'company';

// A wrapper component to use the context hook
const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const { toast } = useToast();
  const { setSelectedCompanyId } = useCompany();

  const handleLogin = (role: UserRole, companyId?: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    if (role === 'company' && companyId) {
        setSelectedCompanyId(companyId);
        setCurrentView('companies'); // Redirect company user to registry
    } else {
        setSelectedCompanyId('all'); // Admin defaults to all
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
    setSelectedCompanyId('all');
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
        return <CompanyRegistry userRole={userRole} />;
      case 'maturity-assessment':
        return <Assessment onNavigate={handleNavigate} userRole={userRole} />;
      case 'compliance-monitor':
        return <ComplianceMonitor />;
      case 'improvement-plan':
        return <ImprovementPlan userRole={userRole}/>;
      case 'financial-statements':
        return <FinancialStatements />;
      case 'review-submit':
        return userRole === 'company' ? <ReviewSubmit /> : <CompanyRegistry userRole={userRole} />;
      case 'approval-requests':
        return userRole === 'admin' ? <ApprovalRequests /> : <CompanyRegistry userRole={userRole} />;
      case 'reports':
        return userRole === 'admin' ? <Reports /> : <CompanyRegistry userRole={userRole} />; // Fallback for company user
      case 'settings':
        return userRole === 'admin' ? <Settings /> : <CompanyRegistry userRole={userRole} />; // Fallback for company user
      default:
        return userRole === 'admin' ? <Dashboard /> : <CompanyRegistry userRole={userRole} />;
    }
  };

  return !isLoggedIn ? (
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
  );
}


export default function Home() {
  return (
    <LanguageProvider>
      <CompanyProvider>
        <AppContent />
      </CompanyProvider>
    </LanguageProvider>
  );
}
