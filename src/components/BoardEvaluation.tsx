
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Save, FileDown, TrendingUp, Check, X, Pencil, Award, UserX, UserCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { useYear } from '@/context/YearContext';
import { useToast } from '@/hooks/use-toast';
import { BOARD_MEMBERS as staticBoardMembers, BoardMember } from '@/data/board-members';
import { cn } from '@/lib/utils';

type Evaluation = {
    memberId: number;
    projectsCompletion: number;
    investmentTargets: number;
    operationalExcellence: number;
    notes?: string;
};

const BoardEvaluation: React.FC = () => {
    const { t, language } = useLanguage();
    const { selectedZoneId, refreshData } = useCompany();
    const { selectedYear } = useYear();
    const { toast } = useToast();

    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
    const [selectedMemberForNotes, setSelectedMemberForNotes] = useState<Evaluation | null>(null);
    const [notes, setNotes] = useState('');
    
    const getStorageKey = () => `board_evaluation_${selectedZoneId}_${selectedYear}`;
    
    const calculateTotalScore = (evaluation: Evaluation | undefined) => {
        if (!evaluation) return 0;
        const { projectsCompletion, investmentTargets, operationalExcellence } = evaluation;
        const weightedScore = (projectsCompletion * 0.4) + (investmentTargets * 0.3) + (operationalExcellence * 0.3);
        return Math.round(weightedScore);
    };

    useEffect(() => {
        if (!selectedZoneId || selectedZoneId === 'all' || typeof window === 'undefined') {
            setEvaluations([]);
            setBoardMembers([]);
            return;
        }

        // Load members from Local Storage
        const savedMembersStr = localStorage.getItem('oia_board_members');
        const allMembers: BoardMember[] = savedMembersStr ? JSON.parse(savedMembersStr) : staticBoardMembers;
        const zoneMembers = allMembers.filter(m => m.zoneId === selectedZoneId);
        setBoardMembers(zoneMembers);
        
        // Load or initialize evaluations for these members
        const savedData = localStorage.getItem(getStorageKey());
        if (savedData) {
            setEvaluations(JSON.parse(savedData));
        } else {
            const initialEvals = zoneMembers.map(member => ({
                memberId: member.id,
                projectsCompletion: 80 + Math.floor(Math.random() * 20),
                investmentTargets: 75 + Math.floor(Math.random() * 25),
                operationalExcellence: 85 + Math.floor(Math.random() * 15),
                notes: '',
            }));
            setEvaluations(initialEvals);
        }
    }, [selectedZoneId, selectedYear]);

    const summaryData = useMemo(() => {
        const scores = boardMembers.map(member => {
            const evaluation = evaluations.find(e => e.memberId === member.id);
            return calculateTotalScore(evaluation);
        });

        const validScores = scores.filter(s => s > 0);
        const averageScore = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
        
        let topPerformer = null;
        if (validScores.length > 0) {
            const maxScore = Math.max(...validScores);
            const topPerformerIndex = scores.indexOf(maxScore);
            if (topPerformerIndex !== -1) {
                topPerformer = boardMembers[topPerformerIndex];
            }
        }
        
        const reviewRequiredCount = scores.filter(s => s < 70).length;

        return { averageScore, topPerformer, reviewRequiredCount };
    }, [evaluations, boardMembers]);


    const handleEvaluationChange = (memberId: number, field: keyof Evaluation, value: number | string) => {
        setEvaluations(prev => {
            const existingIndex = prev.findIndex(e => e.memberId === memberId);
            if (existingIndex > -1) {
                const updatedEvals = [...prev];
                updatedEvals[existingIndex] = { ...updatedEvals[existingIndex], [field]: value };
                return updatedEvals;
            }
             // This part should ideally not be hit if initialized correctly
            return [...prev, { 
                memberId, 
                projectsCompletion: 90, 
                investmentTargets: 90, 
                operationalExcellence: 90, 
                [field]: value 
            } as Evaluation];
        });
    };

    const handleSaveNotes = () => {
        if (selectedMemberForNotes) {
            const newEvals = evaluations.map(e => e.memberId === selectedMemberForNotes.memberId ? {...e, notes: notes} : e);
            setEvaluations(newEvals);
            localStorage.setItem(getStorageKey(), JSON.stringify(newEvals));
            toast({ title: t('board_evaluation.notes.saved') });
            setSelectedMemberForNotes(null);
            setNotes('');
            refreshData();
        }
    };
    
    const handleOpenNotes = (evaluation: Evaluation) => {
        setSelectedMemberForNotes(evaluation);
        setNotes(evaluation.notes || '');
    };
    
    const getRecommendation = (score: number) => {
        if (score > 89) return { text: t('board_evaluation.renew'), badgeClass: "bg-success/20 text-success border border-success/30", icon: <Check size={14}/> };
        if (score < 70) return { text: t('board_evaluation.review'), badgeClass: "bg-destructive/20 text-destructive border border-destructive/30", icon: <X size={14}/> };
        return { text: t('board_evaluation.goodStanding'), badgeClass: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30", icon: <UserCheck size={14}/> };
    };

    const handleSave = () => {
        localStorage.setItem(getStorageKey(), JSON.stringify(evaluations));
        toast({
            title: t('common.saveSuccessTitle'),
            description: t('board_evaluation.saveSuccessDesc'),
        });
        refreshData();
    };


    if (selectedZoneId === 'all') {
         return (
            <div className="flex items-center justify-center h-full p-8 text-white">
                <div className="text-center p-8 glass">
                    <h3 className="text-2xl font-bold text-gold-400">{t('common.selectCompanyToStart')}</h3>
                    <p className="text-gray-400 mt-2">{t('reports.selectCompanyToView')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 text-white print:bg-white print:text-black">
            <header className="flex flex-col md:flex-row items-center justify-between mb-8 print:hidden">
                <h1 className="text-3xl font-bold">{t('board_evaluation.title')}</h1>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="glass print:shadow-none print:border print:border-gray-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300 print:text-gray-600">{t('board_evaluation.summary.avgScore')}</CardTitle>
                        <TrendingUp className="h-5 w-5 text-gray-400 print:text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gold-400 print:text-black">{summaryData.averageScore.toFixed(1)} / 100</div>
                    </CardContent>
                </Card>
                <Card className="glass print:shadow-none print:border print:border-gray-200">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300 print:text-gray-600">{t('board_evaluation.summary.topPerformer')}</CardTitle>
                        <Award className="h-5 w-5 text-gray-400 print:text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        {summaryData.topPerformer ? (
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-gold-500/50">
                                    <AvatarImage src={summaryData.topPerformer.avatar} />
                                    <AvatarFallback>{summaryData.topPerformer.name_en.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-bold print:text-black">
                                    {language === 'ar' ? summaryData.topPerformer.name_ar : summaryData.topPerformer.name_en}
                                </span>
                            </div>
                        ) : (
                            <div className="text-lg font-bold text-gold-400 print:text-black">-</div>
                        )}
                    </CardContent>
                </Card>
                 <Card className="glass print:shadow-none print:border print:border-gray-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300 print:text-gray-600">{t('board_evaluation.summary.reviewRequired')}</CardTitle>
                        <UserX className="h-5 w-5 text-yellow-400 print:text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                         <div className={`text-3xl font-bold ${summaryData.reviewRequiredCount > 0 ? 'text-yellow-400 print:text-yellow-500' : 'text-gold-400 print:text-black'}`}>{summaryData.reviewRequiredCount}</div>
                    </CardContent>
                </Card>
            </div>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass print:shadow-none print:border print:border-gray-200">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-white/10 hover:bg-transparent print:border-b-gray-300">
                                    <TableHead className="text-white font-bold print:text-black">{t('board_evaluation.memberInfo')}</TableHead>
                                    <TableHead className="text-white font-bold print:text-black">{t('board_evaluation.projectsCompletion')}</TableHead>
                                    <TableHead className="text-white font-bold print:text-black">{t('board_evaluation.investmentTargets')}</TableHead>
                                    <TableHead className="text-white font-bold print:text-black">{t('board_evaluation.operationalExcellence')}</TableHead>
                                    <TableHead className="text-center text-white font-bold print:text-black">{t('board_evaluation.totalScore')}</TableHead>
                                    <TableHead className="text-center text-white font-bold print:text-black">{t('board_evaluation.recommendation')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {boardMembers.map(member => {
                                    const evaluation = evaluations.find(e => e.memberId === member.id);
                                    const totalScore = calculateTotalScore(evaluation);
                                    const recommendation = getRecommendation(totalScore);

                                    return (
                                        <TableRow key={member.id} className="border-b-white/10 hover:bg-white/5 print:border-b-gray-200">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-12 w-12 border-2 border-gold-500/30">
                                                        <AvatarImage src={member.avatar} alt={member.name_en} />
                                                        <AvatarFallback>{member.name_en.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold print:text-black">{language === 'ar' ? member.name_ar : member.name_en}</p>
                                                        <p className="text-sm text-gray-400 print:text-gray-600">{t(`board_directory.roles.${member.role.toLowerCase().replace(/ /g, '_')}`)}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3 w-48">
                                                    <Slider value={[evaluation?.projectsCompletion || 0]} onValueChange={([val]) => handleEvaluationChange(member.id, 'projectsCompletion', val)} max={100} step={1} className="w-32" />
                                                    <span className="font-bold text-gold-400 w-8 text-center print:text-black">{(evaluation?.projectsCompletion || 0).toFixed(0)}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3 w-48">
                                                    <Slider value={[evaluation?.investmentTargets || 0]} onValueChange={([val]) => handleEvaluationChange(member.id, 'investmentTargets', val)} max={100} step={1} className="w-32" />
                                                    <span className="font-bold text-gold-400 w-8 text-center print:text-black">{(evaluation?.investmentTargets || 0).toFixed(0)}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                 <div className="flex items-center gap-3 w-48">
                                                     <Slider value={[evaluation?.operationalExcellence || 0]} onValueChange={([val]) => handleEvaluationChange(member.id, 'operationalExcellence', val)} max={100} step={1} className="w-32" />
                                                    <span className="font-bold text-gold-400 w-8 text-center print:text-black">{(evaluation?.operationalExcellence || 0).toFixed(0)}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={cn("text-lg print:text-black print:border print:border-gray-400 print:bg-gray-100", recommendation.badgeClass)}>
                                                    {totalScore}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Badge className={cn("flex items-center gap-1 print:text-black print:border print:border-gray-400 print:bg-gray-100", recommendation.badgeClass)}>
                                                        {recommendation.icon}
                                                        {recommendation.text}
                                                    </Badge>
                                                    {evaluation && (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gold-400 print:hidden" onClick={() => handleOpenNotes(evaluation)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="mt-8 flex justify-end gap-4 print:hidden">
                <Button onClick={handleSave} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                    <Save />
                    {t('board_evaluation.save')}
                </Button>
                <Button onClick={() => window.print()} variant="outline" className="text-white border-white/20 hover:bg-white/10">
                     <FileDown className="mr-2 h-5 w-5"/>
                    {t('board_evaluation.export')}
                </Button>
            </div>
            
            {/* Notes Dialog */}
            <Dialog open={!!selectedMemberForNotes} onOpenChange={() => setSelectedMemberForNotes(null)}>
                <DialogContent className="glass text-white">
                    <DialogHeader>
                        <DialogTitle className="text-gold-400">{t('board_evaluation.notes.title')}</DialogTitle>
                    </DialogHeader>
                    <Textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t('board_evaluation.notes.placeholder')}
                        className="bg-royal-900/50 border-white/10 min-h-[150px] mt-4"
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedMemberForNotes(null)}>{t('common.cancel')}</Button>
                        <Button onClick={handleSaveNotes} className="bg-gold-500 text-royal-900"><Save /> {t('common.save')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BoardEvaluation;
