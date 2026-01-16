"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/components/Dashboard";
import CompanyRegistry from "@/components/CompanyRegistry";
import BoardDirectory from "@/components/BoardDirectory";
import BoardEvaluation from "@/components/BoardEvaluation";
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
import { YearProvider } from '@/context/YearContext';

export type UserRole = 'admin' | 'company';

// A wrapper component to use the context hook
const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const { toast } = useToast();
  const { setSelectedCompanyId, getSelectedCompany, getCompanySubmissionStatus } = useCompany();

  const handleLogin = (role: UserRole, companyId?: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    if (role === 'company' && companyId) {
        setSelectedCompanyId(companyId);
        const status = getCompanySubmissionStatus(companyId);
        if (status === 'submitted' || status === 'approved') {
            setCurrentView('review-submit');
        } else {
            setCurrentView('companies'); // Redirect company user to registry
        }
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
    const companyId = getSelectedCompany()?.id;
    if (userRole === 'company' && companyId) {
        const status = getCompanySubmissionStatus(companyId);
        // Define allowed views for submitted/approved status
        const allowedViews = ['improvement-plan', 'review-submit'];
        if (status === 'approved') {
            allowedViews.push('reports');
        }

        if ((status === 'submitted' || status === 'approved') && !allowedViews.includes(view)) {
             toast({
                title: "الصفحة مقفلة",
                description: "البيانات قيد المراجعة أو معتمدة ولا يمكن تعديلها حالياً.",
                variant: 'destructive',
            });
            return;
        }
    }
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return userRole === 'admin' ? <Dashboard /> : <CompanyRegistry userRole={userRole} onNavigate={handleNavigate}/>; // Fallback for company user
      case 'companies':
        return <CompanyRegistry userRole={userRole} onNavigate={handleNavigate} />;
      case 'board-directory':
        return <BoardDirectory />;
      case 'board-evaluation':
        return <BoardEvaluation />;
      case 'maturity-assessment':
        return <Assessment onNavigate={handleNavigate} userRole={userRole} />;
      case 'compliance-monitor':
        return <ComplianceMonitor />;
      case 'improvement-plan':
        return <ImprovementPlan userRole={userRole}/>;
      case 'financial-statements':
        return <FinancialStatements />;
      case 'review-submit':
        return <ReviewSubmit onNavigate={handleNavigate} />;
      case 'approval-requests':
        return userRole === 'admin' ? <ApprovalRequests onNavigate={handleNavigate} /> : <CompanyRegistry userRole={userRole} onNavigate={handleNavigate}/>;
      case 'reports':
         return <Reports />;
      case 'settings':
        return userRole === 'admin' ? <Settings /> : <CompanyRegistry userRole={userRole} onNavigate={handleNavigate} />; // Fallback for company user
      default:
        return userRole === 'admin' ? <Dashboard /> : <CompanyRegistry userRole={userRole} onNavigate={handleNavigate}/>;
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
      <YearProvider>
        <CompanyProvider>
          <AppContent />
        </CompanyProvider>
      </YearProvider>
    </LanguageProvider>
  );
}
