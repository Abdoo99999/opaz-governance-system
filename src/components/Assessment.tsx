"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AXES, INDICATORS as initialIndicators, Indicator } from '@/data/indicators';
import IndicatorCard from './IndicatorCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, ArrowRight, Save, Plus, Pencil, Trash2, Send, RefreshCw } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import Confetti from 'react-dom-confetti';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/app/page';
import { useYear } from '@/context/YearContext';

type Scores = { [key: number]: number };
type Files = { [key: number]: File | { name: string; size: number } | null };

interface AssessmentProps {
    onNavigate: (view: string) => void;
    userRole: UserRole;
}

const Assessment: React.FC<AssessmentProps> = ({ onNavigate, userRole }) => {
    const { t, language } = useLanguage();
    const { getSelectedZone, refreshData } = useCompany();
    const selectedCompanyId = getSelectedZone()?.id;
    const { selectedYear } = useYear();
    const { toast } = useToast();
    const selectedCompany = getSelectedZone();
    const contentAreaRef = useRef<HTMLDivElement>(null);
    
    const [indicators, setIndicators] = useState<Indicator[]>(() => {
        if (typeof window === 'undefined') return initialIndicators;
        const savedIndicators = localStorage.getItem('oia_indicators_data');
        return savedIndicators ? JSON.parse(savedIndicators) : initialIndicators;
    });

    const activeAxis = AXES[0].id;

    const getAssessmentStorageKey = (companyId: string, year: number) => `oia_assessment_${companyId}_${year}`;

    const [scores, setScores] = useState<Scores>({});
    const [files, setFiles] = useState<Files>({});
    const [isAssessmentComplete, setIsAssessmentComplete] = useState<boolean>(false);

    const [showValidationModal, setShowValidationModal] = useState(false);
    const [indicatorToEdit, setIndicatorToEdit] = useState<Indicator | null>(null);
    const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);
    const [currentActiveAxis, setCurrentActiveAxis] = useState(activeAxis);

    // RELOAD data when company or year changes
    useEffect(() => {
        if (!selectedCompanyId || selectedCompanyId === 'all' || typeof window === 'undefined') {
            setScores({});
            setFiles({});
            setIsAssessmentComplete(false);
            return;
        }

        const oldKey = `oia_assessment_${selectedCompanyId}`;
        const newKey = getAssessmentStorageKey(selectedCompanyId, selectedYear);
        
        let savedDataStr = localStorage.getItem(newKey);
        // Fallback to old key for migration
        if (!savedDataStr) {
            savedDataStr = localStorage.getItem(oldKey);
        }

        if (savedDataStr) {
            const { scores: savedScores, isComplete: savedIsComplete } = JSON.parse(savedDataStr);
            
             // --- DATA VALIDATION LOGIC ---
            const savedIndicatorCount = Object.keys(savedScores || {}).length;
            if (savedIndicatorCount > initialIndicators.length && savedIndicatorCount > 0) {
                localStorage.removeItem(newKey);
                if (localStorage.getItem(oldKey)) {
                    localStorage.removeItem(oldKey);
                }
                // Also clear the indicators from local storage to force re-read from file
                localStorage.removeItem('oia_indicators_data');
    
                toast({
                    title: "تم تحديث المؤشرات",
                    description: "تم اكتشاف بيانات تقييم قديمة وغير متوافقة. سيتم إعادة تعيين التقييم.",
                    variant: "default",
                });
                
                // Force reload to clear state and use new indicators
                setTimeout(() => window.location.reload(), 1500);
                return; // Stop processing this render
            }

            setScores(savedScores || {});
            setIsAssessmentComplete(savedIsComplete || false);
        } else {
            setScores({});
            setIsAssessmentComplete(false);
        }
        setFiles({}); // Files are not persisted in localStorage

    }, [selectedCompanyId, selectedYear, toast]);
    
    // Save indicators whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('oia_indicators_data', JSON.stringify(indicators));
        }
    }, [indicators]);

    const handleAxisChange = (axisId: number) => {
        setCurrentActiveAxis(axisId);
        if (contentAreaRef.current) {
            contentAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };


    const handleSave = () => {
        if (!selectedCompanyId || selectedCompanyId === 'all' || typeof window === 'undefined') return;
        
        const dataToSave = {
            scores: scores,
            isComplete: isAssessmentComplete,
        };
        const storageKey = getAssessmentStorageKey(selectedCompanyId, selectedYear);
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        
        toast({
            title: t('common.saveSuccessTitle'),
            description: `${t('assessment.saveSuccessDesc')} ${selectedCompany ? (language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en): ''}`,
        });
        refreshData();
    };

    const handleResetData = () => {
        if (!selectedCompanyId || selectedCompanyId === 'all' || typeof window === 'undefined') return;
        const storageKey = getAssessmentStorageKey(selectedCompanyId, selectedYear);
        const oldKey = `oia_assessment_${selectedCompanyId}`;

        // مسح البيانات الخاصة بالمنطقة الحالية
        localStorage.removeItem(storageKey);
        // مسح أي مفاتيح قديمة قد تكون عالقة
        localStorage.removeItem(oldKey);

        toast({
            title: "تم إعادة التعيين",
            description: "تم مسح بيانات التقييم لهذه المنطقة. سيتم إعادة تحميل الصفحة.",
        });

        // إعادة تحميل قوية للصفحة
        window.location.reload();
    };
    
    const handleSubmit = () => {
        if (!selectedCompanyId || selectedCompanyId === 'all') return;
        const missing = getMissingIndicators();
        if (missing.length > 0) {
            setShowValidationModal(true);
        } else {
            setIsAssessmentComplete(true);
            const dataToSave = { scores: scores, isComplete: true };
            localStorage.setItem(getAssessmentStorageKey(selectedCompanyId, selectedYear), JSON.stringify(dataToSave));
            toast({
                title: t('assessment.successTitle'),
                description: t('assessment.successDesc'),
            });
            refreshData();
            onNavigate('compliance-monitor');
        }
    };

    const handleOpenIndicatorModal = (indicator: Indicator | null) => {
        setIndicatorToEdit(indicator);
        setIsIndicatorModalOpen(true);
    };

    const handleSaveIndicator = (formData: { text_ar: string, text_en: string, axisId: number }) => {
        if (indicatorToEdit) {
            // Edit existing
            setIndicators(prev => prev.map(ind => ind.id === indicatorToEdit.id ? { ...ind, ...formData } : ind));
            toast({ title: t('assessment.indicatorUpdated') });
        } else {
            // Add new
            const newId = Math.max(...indicators.map(i => i.id)) + 1;
            const newIndicator: Indicator = { id: newId, ...formData };
            setIndicators(prev => [...prev, newIndicator]);
            toast({ title: t('assessment.indicatorAdded') });
        }
        setIsIndicatorModalOpen(false);
    };

    const handleDeleteIndicator = (indicatorId: number) => {
        setIndicators(prev => prev.filter(ind => ind.id !== indicatorId));
        // Also remove score associated with it
        setScores(prev => {
            const newScores = { ...prev };
            delete newScores[indicatorId];
            return newScores;
        });
        toast({ title: t('assessment.indicatorDeleted'), variant: 'destructive' });
    };

    const indicatorsForAxis = useMemo(() => indicators.filter(ind => ind.axisId === currentActiveAxis), [currentActiveAxis, indicators]);
    const totalCompleted = useMemo(() => Object.keys(scores).length, [scores]);
    const globalProgress = (totalCompleted / indicators.length) * 100;
    
    const handleScoreChange = (indicatorId: number, score: number) => {
        if (isAssessmentComplete) return;
        setScores(prev => ({ ...prev, [indicatorId]: score }));
    };

    const handleFileChange = (indicatorId: number, file: File | null) => {
        if (isAssessmentComplete) return;
        setFiles(prev => ({ ...prev, [indicatorId]: file }));
    };

    const getAxisProgress = (axisId: number) => {
        const axisIndicators = indicators.filter(i => i.axisId === axisId);
        if (axisIndicators.length === 0) return 0;
        const completedInAxis = axisIndicators.filter(i => scores[i.id] !== undefined).length;
        return (completedInAxis / axisIndicators.length) * 100;
    };

    const getMissingIndicators = () => {
        return indicators.filter(indicator => scores[indicator.id] === undefined);
    };

    const handleJumpToIndicator = (indicator: Indicator) => {
        handleAxisChange(indicator.axisId);
        setShowValidationModal(false);
        setTimeout(() => {
            document.getElementById(`indicator-${indicator.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100); 
    };

    const missingIndicators = showValidationModal ? getMissingIndicators() : [];

    return (
        <div className="flex h-full text-white">
            {/* Internal Sidebar */}
            <aside className="w-80 h-full bg-royal-800/30 backdrop-blur-lg border-l border-white/10 p-4 flex flex-col">
                <h2 className="text-xl font-bold text-gold-400 mb-4 px-2">{t('assessment.title')}</h2>
                {userRole === 'admin' && (
                    <Button onClick={() => handleOpenIndicatorModal(null)} className="mb-4 bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 border border-gold-500/30">
                        <Plus className="ml-2 h-4 w-4"/> {t('assessment.addIndicator')}
                    </Button>
                )}
                <nav className="flex-1 overflow-y-auto">
                    <ul>
                        {AXES.map(axis => {
                            const progress = getAxisProgress(axis.id);
                            const axisIndicatorCount = indicators.filter(i => i.axisId === axis.id).length;
                            if (axisIndicatorCount === 0) return null;

                            return (
                                <motion.li 
                                    key={axis.id} 
                                    className="relative"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        onClick={() => handleAxisChange(axis.id)}
                                        className={cn(
                                            "w-full text-right flex items-center justify-between p-3 my-1 rounded-lg transition-colors duration-200",
                                            currentActiveAxis === axis.id ? "bg-gold-500/10 text-gold-400" : "hover:bg-white/5"
                                        )}
                                    >
                                        <span className="flex-1">{language === 'ar' ? axis.title_ar : axis.title_en}</span>
                                        {progress === 100 ? (
                                            <CheckCircle className="w-5 h-5 text-success" />
                                        ) : (
                                            <span className="text-xs font-mono text-gray-400">{Math.round(progress)}%</span>
                                        )}
                                    </button>
                                     {currentActiveAxis === axis.id && (
                                        <motion.div
                                            layoutId="active-axis-indicator"
                                            className="absolute right-0 top-0 h-full w-1 bg-gold-500 rounded-l-full"
                                        />
                                    )}
                                </motion.li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                 {/* Sticky Top Bar */}
                <header className="sticky top-0 z-10 p-4 bg-royal-900/80 backdrop-blur-sm border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            {selectedCompany ? (
                                <Badge className="bg-blue-900/50 border-blue-600 text-blue-300">
                                    {t('common.editingFor')}: {language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en}
                                </Badge>
                            ) : (
                                <Badge variant="outline">{t('common.selectAllCompanies')}</Badge>
                            )}
                             <div className="w-1/2 relative">
                                <Progress value={globalProgress} className="h-4 bg-white/10" />
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">{totalCompleted} / {indicators.length} {t('assessment.completed')}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <Button variant="destructive" size="sm" disabled={isAssessmentComplete || !selectedCompanyId || selectedCompanyId === 'all'}>
                                        <RefreshCw className="ml-2 h-4 w-4"/>
                                        إعادة تعيين
                                     </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="glass text-white">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>إعادة تعيين بيانات التقييم؟</AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-300 pt-2">
                                           سيتم حذف جميع درجات هذا التقييم للمنطقة الحالية والعام المحدد فقط. هل أنت متأكد؟
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="text-white border-white/20">{t('common.cancel')}</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleResetData} className="bg-destructive hover:bg-destructive/90">
                                            نعم، قم بإعادة التعيين
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                             <Button onClick={handleSave} variant="outline" className="text-white border-white/20 hover:bg-white/10" disabled={isAssessmentComplete || !selectedCompanyId || selectedCompanyId === 'all'}>
                                 <Save className="ml-2 h-4 w-4"/>
                                 {t('assessment.saveDraft')}
                             </Button>
                            <Button onClick={handleSubmit} className="bg-gold-500 text-royal-900 hover:bg-gold-400" disabled={isAssessmentComplete || !selectedCompanyId || selectedCompanyId === 'all'}>
                                <Send /> {t('assessment.submitFinal')}
                            </Button>
                        </div>
                    </div>
                </header>

                <div ref={contentAreaRef} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {!selectedCompanyId || selectedCompanyId === 'all' ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center p-8 glass">
                                <h3 className="text-2xl font-bold text-gold-400">{t('common.selectCompanyToStart')}</h3>
                                <p className="text-gray-400 mt-2">{t('common.selectCompanyToStartDesc')}</p>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentActiveAxis}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {indicatorsForAxis.map(indicator => (
                                    <IndicatorCard
                                        key={indicator.id}
                                        indicator={indicator}
                                        score={scores[indicator.id]}
                                        file={files[indicator.id]}
                                        onScoreChange={handleScoreChange}
                                        onFileChange={handleFileChange}
                                        isLocked={isAssessmentComplete}
                                        onEdit={() => handleOpenIndicatorModal(indicator)}
                                        onDelete={() => handleDeleteIndicator(indicator.id)}
                                        canEdit={userRole === 'admin'}
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </main>
            
            {/* Validation Modal */}
            <AlertDialog open={showValidationModal} onOpenChange={setShowValidationModal}>
                <AlertDialogContent className="glass text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                           <AlertTriangle className="text-gold-400" />
                           {t('assessment.incompleteTitle')}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300 pt-4">
                           {t('assessment.incompleteDesc')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="max-h-60 overflow-y-auto my-4 pr-2 space-y-2">
                        {missingIndicators.map(ind => (
                            <div key={ind.id} className="flex justify-between items-center bg-white/5 p-2 rounded-md">
                                <span>{ind.id}. {language === 'ar' ? ind.text_ar : ind.text_en}</span>
                                <Button size="sm" variant="ghost" className="text-gold-400 hover:text-gold-500" onClick={() => handleJumpToIndicator(ind)}>
                                    {t('assessment.goTo')}
                                </Button>
                            </div>
                        ))}
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowValidationModal(false)} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                           {t('assessment.gotIt')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            {/* Indicator Add/Edit Modal */}
            <IndicatorFormModal
                isOpen={isIndicatorModalOpen}
                onClose={() => setIsIndicatorModalOpen(false)}
                onSave={handleSaveIndicator}
                indicator={indicatorToEdit}
            />
        </div>
    );
};

// IndicatorFormModal Component
interface IndicatorFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { text_ar: string, text_en: string, axisId: number }) => void;
    indicator: Indicator | null;
}

const IndicatorFormModal: React.FC<IndicatorFormModalProps> = ({ isOpen, onClose, onSave, indicator }) => {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [textAr, setTextAr] = useState('');
    const [textEn, setTextEn] = useState('');
    const [axisId, setAxisId] = useState<number>(1);

    useEffect(() => {
        if (indicator) {
            setTextAr(indicator.text_ar);
            setTextEn(indicator.text_en);
            setAxisId(indicator.axisId);
        } else {
            setTextAr('');
            setTextEn('');
            setAxisId(1);
        }
    }, [indicator, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!textAr || !textEn || !axisId) {
            toast({
                title: t('common.errorTitle'),
                description: t('common.fillAllFields'),
                variant: 'destructive'
            });
            return;
        }
        onSave({ text_ar: textAr, text_en: textEn, axisId: Number(axisId) });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass text-white">
                <DialogHeader>
                    <DialogTitle className="text-gold-400 text-2xl">
                        {indicator ? t('assessment.editIndicator') : t('assessment.addIndicator')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div>
                        <label className="text-gray-300">{t('assessment.indicatorTextAr')}</label>
                        <Textarea value={textAr} onChange={(e) => setTextAr(e.target.value)} className="bg-royal-900/50 border-white/10 mt-2" dir="rtl" />
                    </div>
                     <div>
                        <label className="text-gray-300">{t('assessment.indicatorTextEn')}</label>
                        <Textarea value={textEn} onChange={(e) => setTextEn(e.target.value)} className="bg-royal-900/50 border-white/10 mt-2" dir="ltr" />
                    </div>
                    <div>
                        <label className="text-gray-300">{t('assessment.axis')}</label>
                         <Select value={String(axisId)} onValueChange={(val) => setAxisId(Number(val))}>
                            <SelectTrigger className="bg-royal-900/50 border-white/10 mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-royal-900 text-white border-white/20">
                                {AXES.map(axis => (
                                    <SelectItem key={axis.id} value={String(axis.id)}>
                                        {language === 'ar' ? axis.title_ar : axis.title_en}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" variant="outline" className="text-white border-white/20">{t('common.cancel')}</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-gold-500 text-royal-900 hover:bg-gold-400"><Save /> {t('common.save')}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


export default Assessment;
