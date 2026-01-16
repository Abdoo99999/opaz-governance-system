
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, FileDown, Star, TrendingUp, Check, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { useYear } from '@/context/YearContext';
import { useToast } from '@/hooks/use-toast';
import { BOARD_MEMBERS } from '@/data/board-members';
import { cn } from '@/lib/utils';

type Evaluation = {
    memberId: number;
    meetingsHeld: number;
    meetingsAttended: number;
    strategic: number;
    technical: number;
};

const BoardEvaluation: React.FC = () => {
    const { t, language } = useLanguage();
    const { selectedCompanyId } = useCompany();
    const { selectedYear } = useYear();
    const { toast } = useToast();

    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    
    const getStorageKey = () => `board_evaluation_${selectedCompanyId}_${selectedYear}`;

    useEffect(() => {
        if (!selectedCompanyId || selectedCompanyId === 'all') {
            setEvaluations([]);
            return;
        }
        const savedData = localStorage.getItem(getStorageKey());
        if (savedData) {
            setEvaluations(JSON.parse(savedData));
        } else {
            // Initialize with default values for members of the selected company
            const companyMembers = BOARD_MEMBERS.filter(m => m.companyId === selectedCompanyId);
            const initialEvals = companyMembers.map(member => ({
                memberId: member.id,
                meetingsHeld: 12,
                meetingsAttended: 10 + Math.floor(Math.random() * 3), // 10-12
                strategic: 3 + Math.random() * 2, // 3-5
                technical: 3 + Math.random() * 2, // 3-5
            }));
            setEvaluations(initialEvals);
        }
    }, [selectedCompanyId, selectedYear]);

    const filteredMembers = useMemo(() => {
        if (selectedCompanyId === 'all') return [];
        return BOARD_MEMBERS.filter(m => m.companyId === selectedCompanyId);
    }, [selectedCompanyId]);

    const handleEvaluationChange = (memberId: number, field: keyof Evaluation, value: number) => {
        setEvaluations(prev => {
            const existing = prev.find(e => e.memberId === memberId);
            if (existing) {
                return prev.map(e => e.memberId === memberId ? { ...e, [field]: value } : e);
            }
            return [...prev, { memberId, meetingsHeld: 12, meetingsAttended: 12, strategic: 4, technical: 4, [field]: value }];
        });
    };

    const calculateAttendance = (held: number, attended: number) => {
        if (!held || held === 0) return 0;
        return (attended / held) * 100;
    };
    
    const calculateTotalScore = (evaluation: Evaluation | undefined) => {
        if (!evaluation) return 0;
        const attendanceScore = calculateAttendance(evaluation.meetingsHeld, evaluation.meetingsAttended);
        const strategicScore = (evaluation.strategic / 5) * 100;
        const technicalScore = (evaluation.technical / 5) * 100;
        
        // Weights: 40% Attendance, 30% Strategic, 30% Technical
        const weightedScore = (attendanceScore * 0.4) + (strategicScore * 0.3) + (technicalScore * 0.3);
        return Math.round(weightedScore);
    };
    
    const getScoreBadgeClass = (score: number) => {
        if (score > 90) return "bg-success/20 text-success border border-success/30";
        if (score < 70) return "bg-destructive/20 text-destructive border border-destructive/30";
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    };

    const handleSave = () => {
        localStorage.setItem(getStorageKey(), JSON.stringify(evaluations));
        toast({
            title: t('common.saveSuccessTitle'),
            description: t('board_evaluation.saveSuccessDesc'),
        });
    };

    const handleExport = () => {
        toast({
            title: "Export Initiated",
            description: "Generating PDF report for the chairman...",
        });
    };

    if (selectedCompanyId === 'all') {
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
        <div className="p-4 md:p-6 lg:p-8 text-white">
            <header className="flex flex-col md:flex-row items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">{t('board_evaluation.title')}</h1>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                     <Select defaultValue="2025">
                        <SelectTrigger className="w-[280px] glass">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                            <SelectItem value="2025">{t('board_evaluation.cycle')} 2025</SelectItem>
                            <SelectItem value="2024">{t('board_evaluation.cycle')} 2024</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-white/10 hover:bg-transparent">
                                    <TableHead className="text-white font-bold">{t('board_evaluation.memberInfo')}</TableHead>
                                    <TableHead className="text-white font-bold">{t('board_evaluation.attendance')}</TableHead>
                                    <TableHead className="text-white font-bold">{t('board_evaluation.strategic')}</TableHead>
                                    <TableHead className="text-white font-bold">{t('board_evaluation.technical')}</TableHead>
                                    <TableHead className="text-center text-white font-bold">{t('board_evaluation.totalScore')}</TableHead>
                                    <TableHead className="text-center text-white font-bold">{t('board_evaluation.recommendation')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMembers.map(member => {
                                    const evaluation = evaluations.find(e => e.memberId === member.id);
                                    const totalScore = calculateTotalScore(evaluation);

                                    return (
                                        <TableRow key={member.id} className="border-b-white/10 hover:bg-white/5">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-12 w-12 border-2 border-gold-500/30">
                                                        <AvatarImage src={member.avatar} alt={member.name_en} />
                                                        <AvatarFallback>{member.name_en.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold">{language === 'ar' ? member.name_ar : member.name_en}</p>
                                                        <p className="text-sm text-gray-400">{t(`board_directory.roles.${member.role.toLowerCase()}`)}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 w-48">
                                                    <Input type="number" className="w-16 h-8 glass" value={evaluation?.meetingsAttended || ''} onChange={e => handleEvaluationChange(member.id, 'meetingsAttended', parseInt(e.target.value) || 0)} />
                                                    <span className="text-gray-400">/</span>
                                                    <Input type="number" className="w-16 h-8 glass" value={evaluation?.meetingsHeld || ''} onChange={e => handleEvaluationChange(member.id, 'meetingsHeld', parseInt(e.target.value) || 0)} />
                                                    <Badge variant="outline" className="text-xs">{calculateAttendance(evaluation?.meetingsHeld || 0, evaluation?.meetingsAttended || 0).toFixed(0)}%</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3 w-48">
                                                    <Slider
                                                        value={[evaluation?.strategic || 0]}
                                                        onValueChange={([val]) => handleEvaluationChange(member.id, 'strategic', val)}
                                                        max={5}
                                                        step={0.5}
                                                        className="w-32"
                                                    />
                                                    <span className="font-bold text-gold-400 w-8 text-center">{(evaluation?.strategic || 0).toFixed(1)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                 <div className="flex items-center gap-3 w-48">
                                                     <Slider
                                                        value={[evaluation?.technical || 0]}
                                                        onValueChange={([val]) => handleEvaluationChange(member.id, 'technical', val)}
                                                        max={5}
                                                        step={0.5}
                                                        className="w-32"
                                                    />
                                                    <span className="font-bold text-gold-400 w-8 text-center">{(evaluation?.technical || 0).toFixed(1)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={cn("text-lg", getScoreBadgeClass(totalScore))}>
                                                    {totalScore}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {totalScore > 90 && <Badge className="bg-success text-white"><Check className="mr-1" size={14}/> {t('board_evaluation.renew')}</Badge>}
                                                {totalScore < 70 && <Badge variant="destructive"><X className="mr-1" size={14}/> {t('board_evaluation.review')}</Badge>}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="mt-8 flex justify-end gap-4">
                <Button onClick={handleSave} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                    <Save className="mr-2 h-5 w-5"/>
                    {t('board_evaluation.save')}
                </Button>
                <Button onClick={handleExport} variant="outline" className="text-white border-white/20 hover:bg-white/10">
                     <FileDown className="mr-2 h-5 w-5"/>
                    {t('board_evaluation.export')}
                </Button>
            </div>
        </div>
    );
};

export default BoardEvaluation;
