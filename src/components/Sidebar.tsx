
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Building2, ClipboardCheck, ShieldAlert, LineChart, Kanban, Settings, LogOut, FileText, Send, GitPullRequest, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { useLanguage } from '@/context/LanguageContext';
import { UserRole } from '@/app/page';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useCompany } from '@/context/CompanyContext';
import type { SubmissionStatus } from '@/data/companies';

const allMenuItems = [
  { name: 'dashboard', icon: LayoutDashboard, view: 'dashboard', roles: ['admin'], requiredStatus: 'none' },
  { name: 'registry', icon: Building2, view: 'companies', roles: ['admin', 'company'], requiredStatus: 'profile' },
  { name: 'assessment', icon: ClipboardCheck, view: 'maturity-assessment', roles: ['admin', 'company'], requiredStatus: 'assessment' },
  { name: 'compliance', icon: ShieldAlert, view: 'compliance-monitor', roles: ['admin', 'company'], requiredStatus: 'compliance' },
  { name: 'financials', icon: FileText, view: 'financial-statements', roles: ['admin', 'company'], requiredStatus: 'financials' },
  { name: 'improvement', icon: Kanban, view: 'improvement-plan', roles: ['admin', 'company'], requiredStatus: 'improvement' },
  { name: 'review', icon: Send, view: 'review-submit', roles: ['company'], requiredStatus: 'review' },
  { name: 'approvals', icon: GitPullRequest, view: 'approval-requests', roles: ['admin'], requiredStatus: 'none' },
  { name: 'reports', icon: LineChart, view: 'reports', roles: ['admin'], requiredStatus: 'none' },
  { name: 'settings', icon: Settings, view: 'settings', roles: ['admin'], requiredStatus: 'none' },
];

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, onNavigate, onLogout, userRole }) => {
  const { t } = useLanguage();
  const { selectedCompanyId, getCompanySubmissionStatus } = useCompany();

  const getCompletionStatus = (companyId: string) => {
    if (typeof window === 'undefined') return { 
        profileComplete: false, 
        assessmentComplete: false, 
        complianceComplete: false, 
        financialsComplete: false, 
        improvementComplete: false,
        submissionStatus: 'draft' as SubmissionStatus,
    };

    const companiesStr = localStorage.getItem('oia_companies_registry');
    const companies = companiesStr ? JSON.parse(companiesStr) : [];
    const companyData = companies.find((c: any) => c.id === companyId);
    
    const profileComplete = !!companyData?.legalForm;

    const assessmentStr = localStorage.getItem(`oia_assessment_${companyId}`);
    const assessmentData = assessmentStr ? JSON.parse(assessmentStr) : { isComplete: false };
    const assessmentComplete = assessmentData.isComplete;

    const complianceStr = localStorage.getItem(`oia_compliance_${companyId}`);
    const complianceData = complianceStr ? JSON.parse(complianceStr) : { compliance: {} };
    const complianceComplete = Object.keys(complianceData.compliance || {}).length > 0;
    
    const financialsComplete = !!companyData?.revenue;

    const improvementStr = localStorage.getItem(`oia_improvement_plan_${companyId}`);
    const improvementTasks = improvementStr ? JSON.parse(improvementStr) : [];
    const improvementComplete = improvementTasks.length > 0;
    
    const submissionStatus = getCompanySubmissionStatus(companyId);

    return { profileComplete, assessmentComplete, complianceComplete, financialsComplete, improvementComplete, submissionStatus };
  };
  
  const completionStatus = userRole === 'company' && selectedCompanyId ? getCompletionStatus(selectedCompanyId) : null;

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));
  
  // MOCK: Get pending count for admin
  const pendingApprovals = 3; 

  const isMenuItemDisabled = (item: (typeof menuItems)[0]) => {
      if (userRole !== 'company' || !completionStatus) return false;
      
      const { submissionStatus } = completionStatus;

      // Logic for submitted/approved state
      if (submissionStatus === 'submitted' || submissionStatus === 'approved') {
          const allowedViews = ['improvement-plan', 'review-submit'];
          if (submissionStatus === 'approved') {
              allowedViews.push('reports');
          }
          return !allowedViews.includes(item.view);
      }

      // Logic for draft/returned state (progressive enabling)
      switch (item.requiredStatus) {
          case 'profile':
              return false; // Always enabled
          case 'assessment':
              return !completionStatus.profileComplete;
          case 'compliance':
              return !completionStatus.assessmentComplete;
          case 'financials':
              return !completionStatus.complianceComplete;
          case 'improvement':
              return !completionStatus.financialsComplete;
          case 'review':
              return !completionStatus.improvementComplete;
          default:
              return false;
      }
  };
  
  const getDisabledTooltip = (item: (typeof menuItems)[0]): string => {
       if (isMenuItemDisabled(item)) {
           if (completionStatus?.submissionStatus === 'submitted' || completionStatus?.submissionStatus === 'approved') {
               return "البيانات قيد المراجعة، هذه الصفحة مقفلة حالياً.";
           }
           switch(item.requiredStatus) {
               case 'assessment': return "يرجى إكمال بيانات الشركة أولاً";
               case 'compliance': return "يرجى إكمال واعتماد تقييم النضج أولاً";
               case 'financials': return "يرجى حفظ بيانات الامتثال والمخاطر أولاً";
               case 'improvement': return "يرجى إنشاء وحفظ خطة التحسين أولاً";
               case 'review': return "يرجى إنشاء وحفظ خطة التحسين أولاً";
               default: return "أكمل الخطوة السابقة أولاً";
           }
       }
       return '';
  };


  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative h-screen bg-royal-800/50 backdrop-blur-xl border-l border-white/5 transition-all duration-300 ease-in-out print:hidden",
          isOpen ? 'w-72' : 'w-20'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-24 flex items-center justify-center px-4">
            <h1 className={cn("font-bold text-base text-center leading-snug text-gold-500 transition-opacity duration-300", !isOpen && 'opacity-0')}>
              {t('appTitle')}
            </h1>
          </div>
          <nav className="flex-1 px-2 py-4">
            <ul>
              {menuItems.map((item) => {
                const isDisabled = isMenuItemDisabled(item);
                const tooltipContent = getDisabledTooltip(item);

                const menuItemContent = (
                    <button
                      onClick={() => !isDisabled && onNavigate(item.view)}
                      className={cn(
                        "flex items-center w-full py-3 px-4 rounded-md transition-colors duration-200",
                        currentView === item.view
                          ? "text-gold-400 bg-white/5"
                          : "text-gray-300 hover:text-white hover:bg-white/5",
                        isDisabled ? "cursor-not-allowed opacity-50 text-gray-500 hover:bg-transparent" : ""
                      )}
                      disabled={isDisabled}
                    >
                      {isDisabled && !isOpen ? <Lock className="w-6 h-6 ml-4" /> : <item.icon className="w-6 h-6 ml-4" />}
                      <span className={cn("font-medium mr-4 transition-opacity duration-300 flex-1 text-right", !isOpen && 'opacity-0')}>
                        {t(`menu.${item.name}`)}
                      </span>
                       {isDisabled && isOpen && <Lock size={16} />}
                      {item.name === 'approvals' && pendingApprovals > 0 && isOpen && (
                        <Badge className="bg-red-500 text-white">{pendingApprovals}</Badge>
                      )}
                    </button>
                );

                return (
                  <li key={item.name} className="relative mb-2 transition-transform duration-200 ease-in-out hover:scale-105">
                     <Tooltip>
                        <TooltipTrigger asChild>
                            {menuItemContent}
                        </TooltipTrigger>
                        {(isOpen && isDisabled && tooltipContent) || (!isOpen && tooltipContent) ? (
                            <TooltipContent side="left" className="glass text-white">
                                <p>{tooltipContent}</p>
                            </TooltipContent>
                        ) : null}
                    </Tooltip>
                    {currentView === item.view && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute right-0 top-0 h-full w-1 bg-gold-500 rounded-l-full"
                      />
                    )}
                    {item.name === 'approvals' && pendingApprovals > 0 && !isOpen && (
                        <div className="absolute top-1 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-royal-800"></div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="px-4 pb-4">
              <Separator className="my-4 bg-white/10" />
               <button
                    onClick={onLogout}
                    className="flex items-center w-full py-3 px-4 rounded-md transition-colors duration-200 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <LogOut className="w-6 h-6 ml-4" />
                    <span className={cn("font-medium mr-4 transition-opacity duration-300", !isOpen && 'opacity-0')}>
                      {t('menu.logout')}
                    </span>
                  </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;

    