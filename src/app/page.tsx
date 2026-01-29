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
import { useCompany } from '@/context/CompanyContext';
// استيراد الصفحة الجديدة التي قمت بإنشائها
import ZoneAssessmentPage from './assessment/page';

export type UserRole = 'admin' | 'company';

// A wrapper component to use the context hook
const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const { toast } = useToast();
  const { setSelectedZoneId, getSelectedZone, getZoneSubmissionStatus } = useCompany();

  const handleLogin = (role: UserRole, zoneId?: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    if (role === 'company' && zoneId) {
        setSelectedZoneId(zoneId);
        const status = getZoneSubmissionStatus(zoneId);
        if (status === 'submitted' || status === 'approved') {
            setCurrentView('review-submit');
        } else {
            setCurrentView('companies'); // Redirect company user to registry
        }
    } else {
        setSelectedZoneId('all'); // Admin defaults to all
        setCurrentView('dashboard');
    }
    toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "أهلاً بك في نظام حوكمة أوباز.",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('admin'); // Reset role on logout
    setCurrentView('dashboard'); // Reset to default view on logout
    setSelectedZoneId('all');
    toast({
        title: "تم تسجيل الخروج بنجاح",
    });
  };

  const handleNavigate = (view: string) => {
    const zoneId = getSelectedZone()?.id;
    if (userRole === 'company' && zoneId) {
        const status = getZoneSubmissionStatus(zoneId);
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
      // --- هنا تم إضافة الصفحة الجديدة ---
      case 'new-assessment':
        return <ZoneAssessmentPage />; 
      // ----------------------------------
      case 'compliance-monitor':
        return <ComplianceMonitor onNavigate={handleNavigate} />;
      case 'improvement-plan':
        return <ImprovementPlan userRole={userRole} onNavigate={handleNavigate}/>;
      case 'financial-statements':
        return <FinancialStatements onNavigate={handleNavigate}/>;
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
      <AppContent />
  );
}
