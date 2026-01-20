
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Send, AlertTriangle, Eye, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { useToast } from '@/hooks/use-toast';
import type { Company, SubmissionStatus } from '@/data/companies';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useYear } from '@/context/YearContext';

type ChecklistItem = {
    id: string;
    title: string;
    isComplete: boolean;
    view: string;
};

interface ReviewSubmitProps {
    onNavigate: (view: string) => void;
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({ onNavigate }) => {
    const { t, language } = useLanguage();
    const { selectedCompanyId, getSelectedCompany, dataVersion } = useCompany();
    const { selectedYear } = useYear();
    const { toast } = useToast();
    
    const [companyData, setCompanyData] = useState<any>(null);
    
    useEffect(() => {
        if (typeof window !== 'undefined' && selectedCompanyId) {
            const allCompaniesStr = localStorage.getItem('oia_companies_registry');
            if (allCompaniesStr) {
                const allCompanies = JSON.parse(allCompaniesStr);
                const currentCompany = allCompanies.find((c: any) => c.id === selectedCompanyId);
                setCompanyData(currentCompany);
            }
        }
    }, [selectedCompanyId, dataVersion]);

    const checklist = useMemo((): ChecklistItem[] => {
        if (!selectedCompanyId || typeof window === 'undefined') return [];

        // Storage keys
        const assessmentKey = `oia_assessment_${selectedCompanyId}_${selectedYear}`;
        const complianceKey = `oia_compliance_${selectedCompanyId}_${selectedYear}`;
        const financialsKey = `oia_financials_${selectedCompanyId}_${selectedYear}`;
        const evaluationKey = `board_evaluation_${selectedCompanyId}_${selectedYear}`;
        const boardMembersKey = 'oia_board_members';
        const companiesKey = 'oia_companies_registry';

        // Get data from localStorage
        const allCompaniesStr = localStorage.getItem(companiesKey);
        const allCompanies = allCompaniesStr ? JSON.parse(allCompaniesStr) : [];
        const companyDataForCheck = allCompanies.find((c: any) => c.id === selectedCompanyId);
        
        const allBoardMembersStr = localStorage.getItem(boardMembersKey);
        const allBoardMembers = allBoardMembersStr ? JSON.parse(allBoardMembersStr) : [];
        const companyMembers = allBoardMembers.filter((m: any) => m.companyId === selectedCompanyId);

        const evaluationStr = localStorage.getItem(evaluationKey);
        const evaluationData = evaluationStr ? JSON.parse(evaluationStr) : [];

        const assessmentStr = localStorage.getItem(assessmentKey);
        const assessmentData = assessmentStr ? JSON.parse(assessmentStr) : { isComplete: false };
        
        const complianceStr = localStorage.getItem(complianceKey);
        const complianceData = complianceStr ? JSON.parse(complianceStr) : { compliance: {} };

        const financialsStr = localStorage.getItem(financialsKey);
        const financialsData = financialsStr ? JSON.parse(financialsStr) : {};

        // Completion Logic
        const profileComplete = !!companyDataForCheck?.legalForm;
        const boardComplete = companyMembers.length > 0;
        const evaluationComplete = evaluationData.length > 0;
        const assessmentComplete = assessmentData.isComplete === true;
        const complianceComplete = Object.keys(complianceData.compliance || {}).length === 10;
        const financialsComplete = !!financialsData.auditorName;
        
        return [
            { id: 'profile', title: t('review.profile'), isComplete: profileComplete, view: 'companies' },
            { id: 'board', title: t('menu.board_directory'), isComplete: boardComplete, view: 'board-directory' },
            { id: 'evaluation', title: t('menu.board_evaluation'), isComplete: evaluationComplete, view: 'board-evaluation' },
            { id: 'assessment', title: t('review.assessment'), isComplete: assessmentComplete, view: 'maturity-assessment' },
            { id: 'compliance', title: t('review.compliance'), isComplete: complianceComplete, view: 'compliance-monitor' },
            { id: 'financials', title: t('menu.financials'), isComplete: financialsComplete, view: 'financial-statements' },
        ];
    }, [selectedCompanyId, t, selectedYear, dataVersion]);

    const isAllComplete = checklist.every(item => item.isComplete);
    const submissionStatus: SubmissionStatus = companyData?.submissionStatus || 'draft';

    const handleSendToOIA = () => {
        if (!isAllComplete) {
            toast({
                title: t('common.errorTitle'),
                description: t('review.subtitle'),
                variant: 'destructive',
            });
            return;
        }

        if (typeof window !== 'undefined' && selectedCompanyId) {
            const allCompaniesStr = localStorage.getItem('oia_companies_registry');
            let allCompanies = allCompaniesStr ? JSON.parse(allCompaniesStr) : [];
            allCompanies = allCompanies.map((c: any) => 
                c.id === selectedCompanyId ? { ...c, submissionStatus: 'submitted', submissionDate: new Date().toISOString() } : c
            );
            localStorage.setItem('oia_companies_registry', JSON.stringify(allCompanies));
            setCompanyData((prev: any) => ({ ...prev, submissionStatus: 'submitted' }));
            toast({
                title: t('review.submittedTitle'),
                description: t('review.submittedDesc'),
            });
        }
    };
    
    if (!companyData) {
        return (
            <div className="flex items-center justify-center h-full text-white">
                <p>{t('common.selectCompanyToStart')}</p>
            </div>
        );
    }

    const renderStatusBanner = () => {
        switch (submissionStatus) {
            case 'submitted':
                return (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 mb-8 flex items-center gap-4 border-blue-500/50">
                        <Clock className="w-12 h-12 text-blue-400" />
                        <div>
                            <h3 className="text-xl font-bold text-blue-300">{t('approvals.status.submitted')}</h3>
                            <p className="text-gray-300">{t('review.underReview')}</p>
                        </div>
                    </motion.div>
                );
            case 'returned':
                return (
                     <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 mb-8 flex items-center gap-4 border-yellow-500/50">
                        <AlertTriangle className="w-12 h-12 text-yellow-400" />
                        <div>
                            <h3 className="text-xl font-bold text-yellow-300">{t('approvals.status.returned')}</h3>
                            <p className="text-gray-300">{t('review.returned')}</p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="mt-2 text-yellow-300 border-yellow-400/50 hover:bg-yellow-400/10 hover:text-yellow-200">
                                        <Eye className="mr-2 h-4 w-4"/>
                                        {t('review.viewNotes')}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="glass text-white">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{t('approvals.returnModalTitle')}</AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-300 pt-4">{companyData.notes}</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogAction>{t('assessment.gotIt')}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </motion.div>
                );
            case 'approved':
                 return (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 mb-8 flex items-center gap-4 border-emerald-500/50">
                        <CheckCircle className="w-12 h-12 text-emerald-400" />
                        <div>
                            <h3 className="text-xl font-bold text-emerald-300">{t('approvals.status.approved')}</h3>
                            <p className="text-gray-300">تم اعتماد تقييمكم بنجاح. يمكنكم الآن استعراض الشهادة من صفحة التقارير.</p>
                             <Button onClick={() => onNavigate('reports')} variant="outline" className="mt-2 text-emerald-300 border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-200">
                                <FileText className="mr-2 h-4 w-4"/>
                                عرض شهادة النضج
                            </Button>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="p-4 md:p-6 lg:p-8 text-white max-w-4xl mx-auto">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold">{t('review.title')}</h1>
                <p className="text-gray-400 mt-2">{t('review.subtitle')}</p>
            </header>

            {renderStatusBanner()}
            
            {(submissionStatus === 'draft' || submissionStatus === 'returned') && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass">
                    <CardHeader>
                        <CardTitle className="text-gold-400">{t('review.checklistTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {checklist.map(item => (
                                <li key={item.id} className="flex items-center justify-between p-4 bg-royal-900/50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        {item.isComplete ? <CheckCircle className="w-8 h-8 text-success"/> : <XCircle className="w-8 h-8 text-danger"/>}
                                        <span className="text-lg font-medium">{item.title}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={cn("font-bold", item.isComplete ? "text-success" : "text-danger")}>
                                            {item.isComplete ? t('review.status.complete') : t('review.status.incomplete')}
                                        </span>
                                        <Button variant="outline" className="text-white border-white/20" onClick={() => onNavigate(item.view)}>{t('review.view')}</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>
            )}

            {(submissionStatus === 'draft' || submissionStatus === 'returned') && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 text-center">
                    <Button 
                        size="lg" 
                        className="bg-gold-500 text-royal-900 h-16 text-xl font-bold hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSendToOIA}
                        disabled={!isAllComplete}
                    >
                        <Send />
                        {t('review.submitButton')}
                    </Button>
                    {!isAllComplete && <p className="text-yellow-400 text-sm mt-4">{t('review.subtitle')}</p>}
                </motion.div>
            )}
        </div>
    );
};

export default ReviewSubmit;

    
