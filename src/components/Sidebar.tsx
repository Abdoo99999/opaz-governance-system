"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Building2, ShieldAlert, LineChart, Kanban, Settings, LogOut, FileText, Send, GitPullRequest, Lock, Users, ClipboardEdit, Star } from 'lucide-react';
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
  { name: 'board_directory', icon: Users, view: 'board-directory', roles: ['admin', 'company'], requiredStatus: 'none' },
  { name: 'board_evaluation', icon: ClipboardEdit, view: 'board-evaluation', roles: ['admin', 'company'], requiredStatus: 'none' },
  { name: 'assessment', icon: Star, view: 'maturity-assessment', roles: ['admin', 'company'], requiredStatus: 'assessment' },
  { name: 'compliance', icon: ShieldAlert, view: 'compliance-monitor', roles: ['admin', 'company'], requiredStatus: 'compliance' },
  { name: 'financials', icon: FileText, view: 'financial-statements', roles: ['admin', 'company'], requiredStatus: 'financials' },
  { name: 'improvement', icon: Kanban, view: 'improvement-plan', roles: ['admin', 'company'], requiredStatus: 'improvement' },
  { name: 'review', icon: Send, view: 'review-submit', roles: ['company'], requiredStatus: 'review' },
  { name: 'approvals', icon: GitPullRequest, view: 'approval-requests', roles: ['admin'], requiredStatus: 'none' },
  { name: 'reports', icon: LineChart, view: 'reports', roles: ['admin', 'company'], requiredStatus: 'none' },
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

  const completionStatus = userRole === 'company' && selectedCompanyId ? { submissionStatus: getCompanySubmissionStatus(selectedCompanyId) } : null;

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));
  
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

      // If status is 'draft' or 'returned', nothing is disabled.
      return false;
  };
  
  const getDisabledTooltip = (item: (typeof menuItems)[0]): string => {
       if (isMenuItemDisabled(item)) {
           if (completionStatus?.submissionStatus === 'submitted' || completionStatus?.submissionStatus === 'approved') {
               return "البيانات قيد المراجعة، هذه الصفحة مقفلة حالياً.";
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
          <div className="h-24 flex flex-col items-center justify-center px-4 text-center">
            <h1 className={cn("font-bold text-xl text-gold-400 transition-opacity duration-300", !isOpen && 'opacity-0')}>
              {t('appTitle')}
            </h1>
             <p className={cn("text-xs text-gray-400 transition-opacity duration-300 mt-1", !isOpen && 'opacity-0')}>
                {t('appSubtitle')}
            </p>
          </div>
          <nav className="flex-1 px-2 py-4">
            <ul>
              {menuItems.map((item) => {
                const isDisabled = isMenuItemDisabled(item);
                const tooltipContent = getDisabledTooltip(item);
                const label = (userRole === 'company' && item.name === 'registry') ? t('menu.company_profile') : t(`menu.${item.name}`);


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
                        {label}
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
