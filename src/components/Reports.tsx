
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Line,
  LineChart,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, FileDown, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { INDICATORS, AXES } from '@/lib/data/indicators';
import { initialTasksData } from '@/components/ImprovementPlan';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

const Reports: React.FC = () => {
    const { t, language } = useLanguage();
    const { selectedCompanyId, getSelectedCompany } = useCompany();
    const selectedCompany = getSelectedCompany();
    
    const [summaryData, setSummaryData] = useState({ maturity: 0, compliance: 0, risks: { high: 0, medium: 0, critical: 0 }, actions: 0 });
    const [radarData, setRadarData] = useState([]);
    const [riskDistributionData, setRiskDistributionData] = useState([]);
    const [improvementPlanData, setImprovementPlanData] = useState([]);
    const [topGapsData, setTopGapsData] = useState([]);
    const [criticalRisksData, setCriticalRisksData] = useState([]);


    useEffect(() => {
        if (typeof window === 'undefined' || !selectedCompanyId || selectedCompanyId === 'all') {
             setSummaryData({ maturity: 0, compliance: 0, risks: { high: 0, medium: 0, critical: 0 }, actions: 0 });
             setRadarData([]);
             setRiskDistributionData([]);
             setImprovementPlanData([]);
             setTopGapsData([]);
             setCriticalRisksData([]);
            return;
        }

        // --- Load Data from localStorage ---
        const assessmentStr = localStorage.getItem(`oia_assessment_${selectedCompanyId}`);
        const assessmentData = assessmentStr ? JSON.parse(assessmentStr) : { scores: {}, isComplete: false };

        const complianceStr = localStorage.getItem(`oia_compliance_${selectedCompanyId}`);
        const complianceData = complianceStr ? JSON.parse(complianceStr) : { compliance: {}, risks: [] };

        // --- Process Data ---

        // 1. Summary Cards
        const scores = Object.values(assessmentData.scores || {}) as number[];
        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        const maturity = scores.length > 0 ? totalScore / INDICATORS.length : 0;
        
        const complianceItems = Object.values(complianceData.compliance || {});
        const complianceRate = complianceItems.length > 0 ? (complianceItems.filter(v => v).length / complianceItems.length) * 100 : 0;

        const risks = complianceData.risks || [];
        const criticalRisks = risks.filter((r: any) => r.impact * r.probability >= 20).length;
        const highRisks = risks.filter((r: any) => r.impact * r.probability >= 15 && r.impact * r.probability < 20).length;
        const mediumRisks = risks.filter((r: any) => r.impact * r.probability >= 5 && r.impact * r.probability < 15).length;

        const totalActions = initialTasksData.length; 
        const completedActions = initialTasksData.filter(t => t.status === 'done').length;

        setSummaryData({
            maturity: parseFloat(maturity.toFixed(1)),
            compliance: Math.round(complianceRate),
            risks: { high: highRisks, medium: mediumRisks, critical: criticalRisks },
            actions: totalActions - completedActions
        });

        // 2. Radar Chart
        const newRadarData = AXES.map(axis => {
            const axisIndicators = INDICATORS.filter(ind => ind.axisId === axis.id);
            const axisScores = axisIndicators.map(ind => assessmentData.scores?.[ind.id] || 0);
            const axisSum = axisScores.reduce((a, b) => a + b, 0);
            const companyValue = axisScores.length > 0 ? (axisSum / (axisScores.length * 5)) * 150 : 0; // Scale to 150
            
            return {
                subject: language === 'ar' ? axis.title_ar : axis.title_en,
                company: companyValue,
                sector: Math.random() * 110 + 20, // Mock sector average
            };
        });
        setRadarData(newRadarData as any);
        
        // 3. Risk Distribution
        const riskCounts = risks.reduce((acc: any, risk: any) => {
            const score = risk.impact * risk.probability;
            if (score >= 20) acc.Extreme += 1;
            else if (score >= 15) acc.High += 1;
            else if (score >= 5) acc.Medium += 1;
            else acc.Low += 1;
            return acc;
        }, { Extreme: 0, High: 0, Medium: 0, Low: 0 });

        setRiskDistributionData([
            { name: 'Low', count: riskCounts.Low, color: '#00E096' },
            { name: 'Medium', count: riskCounts.Medium, color: '#FFD700' },
            { name: 'High', count: riskCounts.High, color: '#FFA500' },
            { name: 'Extreme', count: riskCounts.Extreme, color: '#FF3B3B' },
        ] as any);

        // 4. Improvement Plan
        const todo = initialTasksData.filter(t => t.status === 'todo').length;
        const inProgress = initialTasksData.filter(t => t.status === 'in-progress').length;
        setImprovementPlanData([
            { name: 'Completed', value: completedActions, color: '#00E096' },
            { name: 'In Progress', value: inProgress, color: '#FFD700' },
            { name: 'Not Started', value: todo, color: '#6b7280' },
        ] as any);
        
        // 5. Tables
        const sortedGaps = Object.entries(assessmentData.scores || {})
            .map(([id, score]) => ({ id: Number(id), score: Number(score) }))
            .filter(item => item.score < 3)
            .sort((a, b) => a.score - b.score)
            .slice(0, 3)
            .map(gap => {
                const indicator = INDICATORS.find(i => i.id === gap.id);
                const axis = AXES.find(a => a.id === indicator?.axisId);
                return {
                    id: gap.id,
                    name: language === 'ar' ? indicator?.text_ar : indicator?.text_en,
                    axis: language === 'ar' ? axis?.title_ar : axis?.title_en,
                    score: gap.score,
                }
            });
        setTopGapsData(sortedGaps as any);
        
        setCriticalRisksData(risks.filter((r: any) => r.impact * r.probability >= 15).sort((a:any, b:any) => (b.impact * b.probability) - (a.impact * a.probability)) as any);


    }, [selectedCompanyId, language]);

    const handlePrint = () => {
        window.print();
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
        <div className="p-4 md:p-6 lg:p-8 text-white print:p-0 print:bg-white print:text-black">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-center justify-between mb-8 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold">{t('reports.title')} - {selectedCompany ? (language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en) : ''}</h1>
                    <p className="text-gray-400 mt-1">{format(new Date(), "eeee, d MMMM yyyy")}</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Select defaultValue="2024">
                        <SelectTrigger className="w-[180px] glass text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                            <SelectItem value="2024">{t('reports.year')} 2024</SelectItem>
                            <SelectItem value="2023">{t('reports.year')} 2023</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handlePrint} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                        <FileDown className="ml-2 h-5 w-5" />
                        {t('reports.export')}
                    </Button>
                </div>
            </header>
            
            {/* For Print Header */}
            <div className="hidden print:block text-center mb-8">
                 <h1 className="text-3xl font-bold text-black">{t('reports.title')}</h1>
                 <h2 className="text-xl font-semibold text-gray-700">{selectedCompany ? (language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en) : ''}</h2>
                 <p className="text-gray-600 mt-1">OIA Governance System - {format(new Date(), "d MMMM yyyy")}</p>
            </div>

            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300 print:text-gray-600">{t('reports.summary.maturity')}</CardTitle>
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{summaryData.maturity}/5</div>
                            <p className="text-xs text-muted-foreground">{t('reports.summary.maturitySub')}</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300 print:text-gray-600">{t('reports.summary.compliance')}</CardTitle>
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{summaryData.compliance}%</div>
                             <p className="text-xs text-muted-foreground">{t('reports.summary.complianceSub')}</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300 print:text-gray-600">{t('reports.summary.risks')}</CardTitle>
                            <AlertCircle className="w-4 h-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">
                               <span className="text-danger">{summaryData.risks.critical} {t('registry.risks.critical')}</span> / <span className="text-yellow-400">{summaryData.risks.high} {t('registry.risks.high')}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{t('reports.summary.risksSub')}</p>
                        </CardContent>
                    </Card>
                </motion.div>
                 <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300 print:text-gray-600">{t('reports.summary.actions')}</CardTitle>
                            <AlertCircle className="w-4 h-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{summaryData.actions} {t('reports.summary.pending')}</div>
                            <p className="text-xs text-muted-foreground">{t('reports.summary.actionsSub')}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5} className="lg:col-span-2">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="text-gold-400 print:text-black">{t('reports.maturityAnalysis')}</CardTitle>
                        </CardHeader>
                        <CardContent className="print:text-black">
                            <ResponsiveContainer width="100%" height={400}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid className="stroke-white/20 print:stroke-gray-300" />
                                    <PolarAngleAxis dataKey="subject" className="fill-white text-xs print:fill-black"/>
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} className="hidden" />
                                    <Tooltip contentStyle={{ backgroundColor: '#001A33' }} labelStyle={{ color: '#E5C565' }} />
                                    <Legend wrapperStyle={{ color: '#FFFFFF' }} />
                                    <Radar name={t('reports.companyScore')} dataKey="company" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.6} />
                                    <Radar name={t('reports.sectorAverage')} dataKey="sector" stroke="#00E096" fill="#00E096" fillOpacity={0.2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
                     <Card className="glass">
                        <CardHeader>
                           <CardTitle className="text-gold-400 print:text-black">{t('reports.riskAnalysis')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={riskDistributionData} layout="vertical" margin={{ right: 20 }}>
                                    <CartesianGrid horizontal={false} className="stroke-white/10 print:stroke-gray-200" />
                                    <XAxis type="number" className="fill-white text-xs print:fill-black" />
                                    <YAxis dataKey="name" type="category" width={80} className="fill-white text-xs print:fill-black" />
                                    <Tooltip contentStyle={{ backgroundColor: '#001A33' }} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                                    <Bar dataKey="count" barSize={30} radius={[0, 10, 10, 0]}>
                                        {riskDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={(entry as any).color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                 <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7}>
                     <Card className="glass">
                        <CardHeader>
                            <CardTitle className="text-gold-400 print:text-black">{t('reports.improvementStatus')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={improvementPlanData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5}>
                                        {improvementPlanData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={(entry as any).color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#001A33' }}/>
                                    <Legend iconType="circle" wrapperStyle={{ color: '#FFFFFF' }} />
                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-3xl font-bold print:fill-black">
                                       {(improvementPlanData as any[]).reduce((acc, item) => acc + item.value, 0)}
                                    </text>
                                     <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400 text-sm print:fill-gray-600">
                                       {t('reports.actions')}
                                    </text>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            
             {/* Detailed Tables */}
            <div className="space-y-8 print:break-before-page">
                 <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={8}>
                     <Card className="glass">
                        <CardHeader><CardTitle className="text-gold-400 print:text-black">{t('reports.topGaps')}</CardTitle></CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-white/5 print:border-gray-300">
                                        <TableHead className="text-right text-white print:text-black">{t('reports.table.indicator')}</TableHead>
                                        <TableHead className="text-right text-white print:text-black">{t('reports.table.axis')}</TableHead>
                                        <TableHead className="text-center text-white print:text-black">{t('reports.table.score')}</TableHead>
                                        <TableHead className="text-right text-white print:text-black">{t('reports.table.recommendation')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topGapsData.map((gap: any) => (
                                        <TableRow key={gap.id} className="border-white/10 hover:bg-white/5 print:border-gray-200">
                                            <TableCell>{gap.id}. {gap.name}</TableCell>
                                            <TableCell>{gap.axis}</TableCell>
                                            <TableCell className="text-center"><Badge variant="destructive">{gap.score}</Badge></TableCell>
                                            <TableCell>{t('reports.developPolicy')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>
                 <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={9}>
                     <Card className="glass">
                        <CardHeader><CardTitle className="text-gold-400 print:text-black">{t('reports.criticalRisks')}</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-white/5 print:border-gray-300">
                                        <TableHead className="text-right text-white print:text-black">{t('compliance.riskForm.description')}</TableHead>
                                        <TableHead className="text-right text-white print:text-black">{t('compliance.riskForm.category')}</TableHead>
                                        <TableHead className="text-center text-white print:text-black">{t('compliance.riskForm.impact')}</TableHead>
                                        <TableHead className="text-center text-white print:text-black">{t('compliance.riskForm.probability')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {criticalRisksData.map((risk: any, index: number) => (
                                        <TableRow key={index} className="border-white/10 hover:bg-white/5 print:border-gray-200">
                                            <TableCell>{risk.description}</TableCell>
                                            <TableCell>{t(`compliance.riskCategories.${risk.category.toLowerCase()}`)}</TableCell>
                                            <TableCell className="text-center"><Badge className="bg-danger/80">{risk.impact}</Badge></TableCell>
                                            <TableCell className="text-center"><Badge className="bg-yellow-500/80">{risk.probability}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Reports;
