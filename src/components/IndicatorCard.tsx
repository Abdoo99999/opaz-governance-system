
"use client";

import React, { useRef } from 'react';
import { Paperclip, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { Indicator } from '@/lib/data/indicators';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
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

interface IndicatorCardProps {
    indicator: Indicator;
    score?: number;
    file?: File | null;
    onScoreChange: (indicatorId: number, score: number) => void;
    onFileChange: (indicatorId: number, file: File | null) => void;
    isLocked?: boolean;
    onEdit: () => void;
    onDelete: () => void;
    canEdit: boolean;
}

const scoreColors = [
    '#FF3B3B', // 1 - Red (Danger)
    '#FFA500', // 2 - Orange
    '#FFD700', // 3 - Yellow
    '#20B2AA', // 4 - Teal
    '#00E096', // 5 - Neon Green (Success)
];

const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator, score, file, onScoreChange, onFileChange, isLocked, onEdit, onDelete, canEdit }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const evidenceRequired = (score ?? 0) > 3;
    const { t, language } = useLanguage();

    const handleFileClick = () => {
        if (isLocked) return;
        fileInputRef.current?.click();
    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        onFileChange(indicator.id, selectedFile);
    };

    return (
        <motion.div
            id={`indicator-${indicator.id}`}
            className={cn("glass p-6 relative transition-all duration-300 hover:scale-105", isLocked && "opacity-70 pointer-events-none")}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4 }}
        >
            {/* Edit/Delete Buttons */}
            {canEdit && (
                <div className="absolute top-3 left-3 flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gold-400" onClick={onEdit}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="glass text-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t('assessment.deleteIndicatorTitle')}</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-300 pt-2">
                                    {t('assessment.deleteIndicatorDesc')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="text-white border-white/20">{t('common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    {t('common.delete')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <Badge className="bg-gold-500 text-royal-900 text-lg font-bold">
                    {t('assessment.indicator')} #{indicator.id}
                </Badge>
                <h3 className="flex-1 text-xl font-bold text-right leading-relaxed">
                    {language === 'ar' ? indicator.text_ar : indicator.text_en}
                </h3>
            </div>
            
            {/* Scoring */}
            <div className="mb-6">
                <p className="text-gray-400 text-right mb-3 text-sm">{t('assessment.maturityLevel')}</p>
                <div className="flex justify-center items-center gap-2 md:gap-4 bg-black/20 p-3 rounded-lg">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <motion.button
                            key={value}
                            onClick={() => onScoreChange(indicator.id, value)}
                            className="w-12 h-12 md:w-16 md:h-16 text-2xl font-bold rounded-lg border-2 transition-all duration-200"
                            style={{
                                borderColor: score === value ? scoreColors[value - 1] : 'rgba(255, 255, 255, 0.2)',
                                backgroundColor: score === value ? scoreColors[value - 1] : 'transparent',
                                color: score === value ? '#001220' : 'white',
                                boxShadow: score === value ? `0 0 15px ${scoreColors[value - 1]}` : 'none'
                            }}
                            whileHover={{ scale: isLocked ? 1 : 1.15 }}
                            whileTap={{ scale: isLocked ? 1 : 0.95 }}
                            disabled={isLocked}
                        >
                            {value}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Evidence Upload */}
            <div>
                 <div className="flex items-center justify-end gap-3 text-sm">
                    {evidenceRequired && !file && <span className="text-yellow-400">{t('assessment.evidenceRequired')}</span>}
                    {evidenceRequired && file && <span className="text-green-400 flex items-center gap-1"><CheckCircle size={16}/> {t('assessment.evidenceAttached')}</span>}
                     <Button variant="outline" onClick={handleFileClick} className="bg-transparent border-white/20 hover:bg-white/10 text-white" disabled={isLocked}>
                        <Paperclip className="ml-2 h-4 w-4" />
                        {file ? t('assessment.changeEvidence') : t('assessment.attachEvidence')}
                    </Button>
                </div>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelected}
                    className="hidden"
                    disabled={isLocked}
                />
                 {file && (
                    <div className="text-right mt-2 text-xs text-gray-400">
                        {t('assessment.fileAttached')}: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default IndicatorCard;

    