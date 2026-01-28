"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// تم إضافة Target هنا للأيقونة الجديدة
import { LayoutDashboard, Building2, ShieldAlert, LineChart, Kanban, Settings, LogOut, FileText, Send, GitPullRequest, Lock, Users, ClipboardEdit, Star, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { useLanguage } from '@/context/LanguageContext';
import { UserRole } from '@/app/page';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useCompany } from '@/context/CompanyContext';
import type { SubmissionStatus, Zone } from '@/data/companies';
import { useYear } from '@/context/YearContext';

const allMenuItems = [
  { name: 'dashboard', icon: LayoutDashboard, view: 'dashboard', roles: ['admin'], requiredStatus: 'none' },
  { name: 'registry', icon: Building2, view: 'companies', roles: ['admin', 'company'], requiredStatus: 'profile' },
  { name: 'board_directory', icon: Users, view: 'board-directory', roles: ['admin', 'company'], requiredStatus: 'board' },
  { name: 'board_evaluation', icon: ClipboardEdit, view: 'board-evaluation', roles: ['admin', 'company'], requiredStatus: 'evaluation' },
  { name: 'assessment', icon: Star, view: 'maturity-assessment', roles: ['admin', 'company'], requiredStatus: 'assessment' },
  // --- تم إضافة الصفحة الجديدة هنا ---
  { name: 'zone_assessment', icon: Target, view: 'new-assessment', roles: ['admin', 'company'], requiredStatus: 'assessment' },
  // ----------------------------------
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
  const { selectedZoneId, getZoneSubmissionStatus, dataVersion } = useCompany();
  const { selectedYear } = useYear();

  const [completion, setCompletion] = useState({
      profile: false, board: false, evaluation: false, assessment: false, compliance: false, financials: false
  });

  const [pendingApprovals, setPendingApprovals] = useState(0);

    useEffect(() => {
        if (userRole === 'admin' && typeof window !== 'undefined') {
            const allZonesStr = localStorage.getItem('opaz_zones_registry');
            if (allZonesStr) {
                const allZones: Zone[] = JSON.parse(allZonesStr);
                const submittedCount = allZones.filter(zone => zone.submissionStatus === 'submitted').length;
                setPendingApprovals(submittedCount);
            } else {
                setPendingApprovals(0);
            }
        }
  }, [dataVersion, userRole]);


  useEffect(() => {
    if (userRole === 'company' && selectedZoneId && typeof window !== 'undefined') {
        const getCompletionStates = () => {
            const allZonesStr = localStorage.getItem('opaz_zones_registry');
            const allZones = allZonesStr ? JSON.parse(allZonesStr) : [];
            const zoneData = allZones.find((c: any) => c.id === selectedZoneId);
            const profileComplete = !!zoneData?.type;

            const boardMembersStr = localStorage.getItem('oia_board_members');
            const allBoardMembers = boardMembersStr ? JSON.parse(boardMembersStr) : [];
            const zoneMembers = allBoardMembers.filter((m: any) => m.zoneId === selectedZoneId);
            const boardComplete = zoneMembers.length > 0;

            const evaluationStr = localStorage.getItem(`board_evaluation_${selectedZoneId}_${selectedYear}`);
            const evaluationData = evaluationStr ? JSON.parse(evaluationStr) : [];
            const evaluationComplete = evaluationData.length > 0;

            let assessmentStr = localStorage.getItem(`oia_assessment_${selectedZoneId}_${selectedYear}`);
            if (!assessmentStr) {
                assessmentStr = localStorage.getItem(`oia_assessment_${selectedZoneId}`);
            }
            const assessmentData = assessmentStr ? JSON.parse(assessmentStr) : { isComplete: false };
            const assessmentComplete = assessmentData.isComplete === true;
            
            let complianceStr = localStorage.getItem(`opaz_compliance_${selectedZoneId}_${selectedYear}`);
             if (!complianceStr) {
                 complianceStr = localStorage.getItem(`oia_compliance_${selectedZoneId}`);
            }
            const complianceData = complianceStr ? JSON.parse(complianceStr) : { compliance: {} };
            const complianceComplete = Object.keys(complianceData.compliance || {}).length === 10;

            let financialsStr = localStorage.getItem(`oia_financials_${selectedZoneId}_${selectedYear}`);
            if (!financialsStr) {
                financialsStr = localStorage.getItem(`oia_financials_${selectedZoneId}`);
            }
            const financialsData = financialsStr ? JSON.parse(financialsStr) : {};
            const financialsComplete = !!financialsData.auditorName;

            setCompletion({
                profile: profileComplete,
                board: boardComplete,
                evaluation: evaluationComplete,
                assessment: assessmentComplete,
                compliance: complianceComplete,
                financials: financialsComplete,
            });
        };
        getCompletionStates();
    }
  }, [selectedZoneId, userRole, currentView, selectedYear, dataVersion]);

  const submissionStatus = userRole === 'company' && selectedZoneId 
      ? getZoneSubmissionStatus(selectedZoneId) 
      : 'draft';

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));
  

  const isMenuItemDisabled = (item: (typeof menuItems)[0]) => {
      if (userRole !== 'company') return false;
      
      // Logic for submitted/approved state (highest priority)
      if (submissionStatus === 'submitted' || submissionStatus === 'approved') {
          const allowedViews = ['review-submit', 'improvement-plan'];
           if (submissionStatus === 'approved') {
              allowedViews.push('reports');
           }
          return !allowedViews.includes(item.view);
      }

      // Logic for sequential unlocking (if draft or returned)
      switch(item.view) {
          case 'companies': return false;
          case 'board-directory': return !completion.profile;
          case 'board-evaluation': return !completion.profile || !completion.board;
          case 'maturity-assessment': return !completion.profile || !completion.board || !completion.evaluation;
          // --- شرط فتح الصفحة الجديدة (تفتح بعد إكمال التقييم السابق) ---
          case 'new-assessment': return !completion.profile || !completion.board || !completion.evaluation || !completion.assessment;
          // -------------------------------------------------------------
          case 'compliance-monitor': return !completion.profile || !completion.board || !completion.evaluation || !completion.assessment;
          case 'financial-statements': return !completion.profile || !completion.board || !completion.evaluation || !completion.assessment || !completion.compliance;
          case 'improvement-plan': return !completion.profile || !completion.board || !completion.evaluation || !completion.assessment;
          case 'review-submit': return !completion.profile || !completion.board || !completion.evaluation || !completion.assessment || !completion.compliance || !completion.financials;
          default: return false;
      }
  };
  
  const getDisabledTooltip = (item: (typeof menuItems)[0]): string => {
       if (isMenuItemDisabled(item)) {
           if (submissionStatus === 'submitted' || submissionStatus === 'approved') {
               return "البيانات قيد المراجعة، هذه الصفحة مقفلة حالياً.";
           }
            
            let requiredStep = '';
            switch (item.view) {
                case 'board-directory': requiredStep = t('menu.company_profile'); break;
                case 'board-evaluation': requiredStep = t('menu.board_directory'); break;
                case 'maturity-assessment': requiredStep = t('menu.board_evaluation'); break;
                // --- رسالة التنبيه للصفحة الجديدة ---
                case 'new-assessment': requiredStep = t('menu.assessment'); break;
                // -----------------------------------
                case 'compliance-monitor': requiredStep = t('menu.assessment'); break;
                case 'financial-statements': requiredStep = t('menu.compliance'); break;
                case 'improvement-plan': requiredStep = t('menu.assessment'); break;
                case 'review-submit': requiredStep = t('menu.financials'); break;
            }
            if (requiredStep) {
                return `يجب إكمال وحفظ بيانات '${requiredStep}' أولاً.`;
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
                
                // تحديد اسم الصفحة
                let label = t(`menu.${item.name}`);
                if (userRole === 'company' && item.name === 'registry') {
                     label = t('menu.company_profile');
                }
                // --- اسم الصفحة الجديدة (يدوياً حتى لا تحتاج لملفات الترجمة) ---
                if (item.name === 'zone_assessment') {
                    label = "تقييم المنطقة (الجديد)";
                }
                // -------------------------------------------------------------

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
                  <li key={item.name} className="relative mb-2 transition-all duration-200 ease-in-out hover:scale-105 rounded-md border border-transparent hover:border-gold-500/50">
                      <Tooltip>
                        <TooltipTrigger asChild>
                            {menuItemContent}
                        </TooltipTrigger>
                        {( (isOpen && isDisabled) || (!isOpen) ) && tooltipContent ? (
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