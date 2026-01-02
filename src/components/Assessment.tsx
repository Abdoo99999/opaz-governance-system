"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AXES, INDICATORS, Indicator } from '@/lib/data/indicators';
import IndicatorCard from './IndicatorCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import Confetti from 'react-dom-confetti';
import { useLanguage } from '@/context/LanguageContext';

type Scores = { [key: number]: number };
type Files = { [key: number]: File | null };

const Assessment: React.FC = () => {
    const [activeAxis, setActiveAxis] = useState(AXES[0].id);
    const [scores, setScores] = useState<Scores>({});
    const [files, setFiles] = useState<Files>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { t, language } = useLanguage();

    const indicatorsForAxis = useMemo(() => INDICATORS.filter(ind => ind.axisId === activeAxis), [activeAxis]);
    const totalCompleted = useMemo(() => Object.keys(scores).length, [scores]);
    const globalProgress = (totalCompleted / INDICATORS.length) * 100;
    
    const confettiConfig = {
        angle: 90,
        spread: 360,
        startVelocity: 40,
        elementCount: 70,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: "10px",
        height: "10px",
        perspective: "500px",
        colors: ["#D4AF37", "#E5C565", "#ffffff"]
    };

    const handleScoreChange = (indicatorId: number, score: number) => {
        setScores(prev => ({ ...prev, [indicatorId]: score }));
    };

    const handleFileChange = (indicatorId: number, file: File | null) => {
        setFiles(prev => ({ ...prev, [indicatorId]: file }));
    };

    const getAxisProgress = (axisId: number) => {
        const axisIndicators = INDICATORS.filter(i => i.axisId === axisId);
        const completedInAxis = axisIndicators.filter(i => scores[i.id] !== undefined).length;
        return (completedInAxis / axisIndicators.length) * 100;
    };

    const getMissingIndicators = () => {
        return INDICATORS.filter(indicator => scores[indicator.id] === undefined);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        const missing = getMissingIndicators();
        if (missing.length > 0) {
            setShowValidationModal(true);
        } else {
            setShowSuccess(true);
            // In a real app, you'd redirect after the animation
            setTimeout(() => {
                console.log("Assessment Submitted!", { scores, files });
            }, 3000);
        }
    };
    
    const handleJumpToIndicator = (indicator: Indicator) => {
        setActiveAxis(indicator.axisId);
        setShowValidationModal(false);
        // Optional: scroll to the indicator card after jumping
        setTimeout(() => {
            document.getElementById(`indicator-${indicator.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100); 
    };

    const missingIndicators = showValidationModal ? getMissingIndicators() : [];

    return (
        <div className="flex h-full text-white">
            {/* Internal Sidebar */}
            <aside className="w-80 h-full bg-royal-800/30 backdrop-blur-lg border-l border-white/10 p-4 overflow-y-auto">
                <h2 className="text-xl font-bold text-gold-400 mb-6 px-2">{t('assessment.title')}</h2>
                <nav>
                    <ul>
                        {AXES.map(axis => {
                            const progress = getAxisProgress(axis.id);
                            return (
                                <li key={axis.id} className="relative">
                                    <button
                                        onClick={() => setActiveAxis(axis.id)}
                                        className={cn(
                                            "w-full text-right flex items-center justify-between p-3 my-1 rounded-lg transition-colors duration-200",
                                            activeAxis === axis.id ? "bg-gold-500/10 text-gold-400" : "hover:bg-white/5"
                                        )}
                                    >
                                        <span>{language === 'ar' ? axis.title_ar : axis.title_en}</span>
                                        {progress === 100 ? (
                                            <CheckCircle className="w-5 h-5 text-success" />
                                        ) : (
                                            <span className="text-xs font-mono text-gray-400">{Math.round(progress)}%</span>
                                        )}
                                    </button>
                                     {activeAxis === axis.id && (
                                        <motion.div
                                            layoutId="active-axis-indicator"
                                            className="absolute right-0 top-0 h-full w-1 bg-gold-500 rounded-l-full"
                                        />
                                    )}
                                </li>
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
                            <span className="font-bold">{t('assessment.globalProgress')}:</span>
                             <div className="w-1/2 relative">
                                <Progress value={globalProgress} className="h-4 bg-white/10" />
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">{totalCompleted} / {INDICATORS.length} {t('assessment.completed')}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">{t('assessment.saveDraft')}</Button>
                            <Button onClick={handleSubmit} className="bg-gold-500 text-royal-900 hover:bg-gold-400">{t('assessment.submitFinal')}</Button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={activeAxis}
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
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
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

            {/* Success Confetti */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Confetti active={showSuccess} config={confettiConfig} />
            </div>
            {showSuccess && (
                 <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} className="text-center">
                        <CheckCircle className="w-24 h-24 text-success mx-auto mb-4" />
                        <h2 className="text-3xl font-bold">{t('assessment.successTitle')}</h2>
                        <p className="text-gray-300">{t('assessment.successDesc')}</p>
                    </motion.div>
                 </div>
            )}
        </div>
    );
};

export default Assessment;
