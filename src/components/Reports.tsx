
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  ComposedChart,
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
import { TrendingUp, FileDown, AlertCircle, CheckCircle, Wallet, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { INDICATORS, AXES } from '@/lib/data/indicators';
import type { Task } from '@/components/ImprovementPlan';
import { cn } from '@/lib/utils';
import { useYear } from '@/context/YearContext';
import { ZONES, type Zone } from '@/data/companies';
import { BOARD_MEMBERS as staticBoardMembers, BoardMember } from '@/data/board-members';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

const cardBaseClasses = "glass h-full transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl print:shadow-none print:border-gray-200 print:bg-white";


export const RadarCustomTick = (props: any) => {
    const { payload, x, y, textAnchor, index } = props;
    const value = payload.value;
    const wordWrapThreshold = 12;

    // Manual adjustments for position
    let newX = x;
    let newY = y;
    const offset = 30; // 30px offset

    const angle = (360 / AXES.length) * index;
    
    if (angle === 0) newY -= offset; // Top
    else if (angle === 180) newY += offset; // Bottom
    else if (angle > 0 && angle < 180) newX += offset; // Right side
    else newX -= offset; // Left side
    
    // Fine-tune Y for corners
    if (angle > 0 && angle < 90) newY += offset / 3;
    if (angle > 90 && angle < 180) newY -= offset / 4;
    if (angle > 180 && angle < 270) newY -= offset / 4;
    if (angle > 270 && angle < 360) newY += offset / 3;
    
    if (value && value.length > wordWrapThreshold) {
        const words = value.split(' ');
        const lines = words.reduce((acc: string[], word: string) => {
            if (acc.length === 0) {
                acc.push(word);
            } else {
                const lastLine = acc[acc.length - 1];
                if (lastLine.length + word.length + 1 > wordWrapThreshold) {
                    acc.push(word);
                } else {
                    acc[acc.length - 1] = `${lastLine} ${word}`;
                }
            }
            return acc;
        }, []);

        return (
            <g transform={`translate(${newX}, ${newY})`}>
                <text
                    textAnchor={textAnchor}
                    fill="#fff"
                    fontSize="12px"
                    className="print:fill-black"
                >
                    {lines.map((line, i) => (
                        <tspan key={i} x={0} dy={i === 0 ? 0 : '1.2em'}>{line}</tspan>
                    ))}
                </text>
            </g>
        );
    }

    return (
        <text
            x={newX}
            y={newY}
            textAnchor={textAnchor}
            fill="#fff"
            fontSize="12px"
            className="print:fill-black"
        >
            {value}
        </text>
    );
};


const Reports: React.FC = () => {
    const { t, language } = useLanguage();
    const { selectedCompanyId, getSelectedCompany } = useCompany();
    const { selectedYear, setSelectedYear, availableYears } = useYear();
    const reportRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const selectedCompany = getSelectedCompany();
    
    const [summaryData, setSummaryData] = useState({ maturity: 0, compliance: 0, risks: { high: 0, medium: 0, critical: 0 }, actions: 0 });
    const [radarData, setRadarData] = useState([]);
    const [riskDistributionData, setRiskDistributionData] = useState([]);
    const [improvementPlanData, setImprovementPlanData] = useState([]);
    const [topGapsData, setTopGapsData] = useState([]);
    const [criticalRisksData, setCriticalRisksData] = useState([]);
    const [financialPerformanceData, setFinancialPerformanceData] = useState([]);
    const [boardIndependenceData, setBoardIndependenceData] = useState<any[]>([]);
    const [icvBarData, setIcvBarData] = useState([]);


    useEffect(() => {
        if (typeof window === 'undefined' || !selectedCompanyId || selectedCompanyId === 'all') {
             setSummaryData({ maturity: 0, compliance: 0, risks: { high: 0, medium: 0, critical: 0 }, actions: 0 });
             setRadarData([]);
             setRiskDistributionData([]);
             setImprovementPlanData([]);
             setTopGapsData([]);
             setCriticalRisksData([]);
             setFinancialPerformanceData([]);
             setBoardIndependenceData([]);
             setIcvBarData([]);
            return;
        }

        // --- Load Data from localStorage ---
        let assessmentStr = localStorage.getItem(`oia_assessment_${selectedCompanyId}_${selectedYear}`);
        if (!assessmentStr) {
            assessmentStr = localStorage.getItem(`oia_assessment_${selectedCompanyId}`);
        }
        const assessmentData = assessmentStr ? JSON.parse(assessmentStr) : { scores: {}, isComplete: false };
        
        let complianceStr = localStorage.getItem(`oia_compliance_${selectedCompanyId}_${selectedYear}`);
        if(!complianceStr){
            complianceStr = localStorage.getItem(`oia_compliance_${selectedCompanyId}`);
        }
        const complianceData = complianceStr ? JSON.parse(complianceStr) : { compliance: {}, risks: [] };

        let improvementPlanStr = localStorage.getItem(`oia_improvement_plan_${selectedCompanyId}_${selectedYear}`);
        if(!improvementPlanStr){
            improvementPlanStr = localStorage.getItem(`oia_improvement_plan_${selectedCompanyId}`);
        }
        const improvementPlanTasks: Task[] = improvementPlanStr ? JSON.parse(improvementPlanStr) : [];

        const companiesStr = localStorage.getItem('opaz_zones_registry');
        const allZonesData: Zone[] = companiesStr ? JSON.parse(companiesStr) : ZONES;
        const companyData = allZonesData.find((c: any) => c.id === selectedCompanyId);
        
        let financialsStr = localStorage.getItem(`oia_financials_${selectedCompanyId}_${selectedYear}`);
        if(!financialsStr){
            financialsStr = localStorage.getItem(`oia_financials_${selectedCompanyId}`);
        }
        const financialsData = financialsStr ? JSON.parse(financialsStr) : companyData;
        
        const allBoardMembersStr = localStorage.getItem('oia_board_members');
        const allBoardMembers: BoardMember[] = allBoardMembersStr ? JSON.parse(allBoardMembersStr) : staticBoardMembers;
        const companyBoardMembers = allBoardMembers.filter(m => m.zoneId === selectedCompanyId);


        // --- Process Data ---

        // 1. Summary Cards
        const scores = Object.values(assessmentData.scores || {}) as number[];
        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        const maturity = scores.length > 0 ? totalScore / INDICATORS.length : 0;
        
        const totalComplianceQuestions = 10;
        const complianceItems = Object.values(complianceData.compliance || {});
        const compliantCount = complianceItems.filter((v: any) => v === true).length;
        const complianceRate = totalComplianceQuestions > 0 ? (compliantCount / totalComplianceQuestions) * 100 : 0;


        const risks = complianceData.risks || [];
        
        const riskCounts = (risks || []).reduce((acc: any, risk: any) => {
            const score = risk.impact * risk.probability;
            if (score >= 15) acc.Critical++;
            else if (score >= 10) acc.High++;
            else if (score >= 5) acc.Medium++;
            else acc.Low++;
            return acc;
        }, { Critical: 0, High: 0, Medium: 0, Low: 0 });

        const totalActions = improvementPlanTasks.length; 
        const completedActions = improvementPlanTasks.filter(t => t.status === 'done').length;

        setSummaryData({
            maturity: parseFloat(maturity.toFixed(1)),
            compliance: Math.round(complianceRate),
            risks: { high: riskCounts.High, medium: riskCounts.Medium, critical: riskCounts.Critical },
            actions: totalActions - completedActions
        });

        // 2. Radar Chart
        let sectorScoresByAxis: { [key: number]: number[] } = {};
        AXES.forEach(a => sectorScoresByAxis[a.id] = []);

        allZonesData.forEach((comp: any) => {
            let compAssessmentStr = localStorage.getItem(`oia_assessment_${comp.id}_${selectedYear}`);
            if(!compAssessmentStr){
                compAssessmentStr = localStorage.getItem(`oia_assessment_${comp.id}`);
            }
            if (compAssessmentStr) {
                const compAssessmentData = JSON.parse(compAssessmentStr);
                AXES.forEach(axis => {
                    const axisIndicators = INDICATORS.filter(ind => ind.axisId === axis.id);
                    if(axisIndicators.length === 0) return;
                    const axisScores = axisIndicators.map(ind => compAssessmentData.scores?.[ind.id] || 0);
                    const axisSum = axisScores.reduce((a, b) => a + b, 0);
                    const axisAvg = axisSum / (axisIndicators.length * 5);
                    sectorScoresByAxis[axis.id].push(axisAvg);
                });
            }
        });
        const sectorAverageByAxis = AXES.map(axis => {
            const avgs = sectorScoresByAxis[axis.id] || [];
            const total = avgs.length > 0 ? avgs.reduce((a, b) => a + b, 0) / avgs.length : 0;
            return total * 150;
        });

        const newRadarData = AXES.map((axis, index) => {
            const axisIndicators = INDICATORS.filter(ind => ind.axisId === axis.id);
            if (axisIndicators.length === 0) {
                 return { subject: language === 'ar' ? axis.title_ar : axis.title_en, company: 0, sector: sectorAverageByAxis[index], fullMark: 150 };
            }
            const axisScores = axisIndicators.map(ind => assessmentData.scores?.[ind.id] || 0);
            const axisSum = axisScores.reduce((a, b) => a + b, 0);
            const companyValue = (axisSum / (axisIndicators.length * 5)) * 150;
            
            return {
                subject: language === 'ar' ? axis.title_ar : axis.title_en,
                company: companyValue,
                sector: sectorAverageByAxis[index],
            };
        });
        setRadarData(newRadarData as any);
        
        // 3. Risk Distribution
        setRiskDistributionData([
            { name: t('reports.riskLevels.low'), count: riskCounts.Low, color: '#00E096' },
            { name: t('reports.riskLevels.medium'), count: riskCounts.Medium, color: '#FFD700' },
            { name: t('reports.riskLevels.high'), count: riskCounts.High, color: '#FFA500' },
            { name: t('reports.riskLevels.critical'), count: riskCounts.Critical, color: '#FF3B3B' },
        ] as any);

        // 4. Improvement Plan
        const todo = improvementPlanTasks.filter(t => t.status === 'todo').length;
        const inProgress = improvementPlanTasks.filter(t => t.status === 'in-progress').length;
        setImprovementPlanData([
            { name: t('reports.improvement.completed'), value: completedActions, color: '#00E096' },
            { name: t('reports.improvement.inProgress'), value: inProgress, color: '#FFD700' },
            { name: t('reports.improvement.notStarted'), value: todo, color: '#6b7280' },
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

        // 6. Financial Performance Chart
        if (financialsData) {
            const revenue = financialsData.revenue || 0;
            const expenses = financialsData.expenses || 0;
            const netProfit = revenue - expenses;
            setFinancialPerformanceData([
                { name: t('reports.financial.performance'), revenue, expenses, netProfit }
            ] as any);
        }

        // 7. Board Composition Chart
        const independentCount = companyBoardMembers.filter(m => m.type === 'Independent').length;
        const nonIndependentCount = companyBoardMembers.length - independentCount;
         if (companyBoardMembers.length > 0) {
            setBoardIndependenceData([
                { name: t('dashboard.boardComposition.independent'), value: independentCount, color: '#D4AF37' },
                { name: t('dashboard.boardComposition.nonIndependent'), value: nonIndependentCount, color: '#3b82f6' },
            ]);
        } else {
            setBoardIndependenceData([]);
        }


        // 8. ICV Bar Chart
        if (companyData) {
            const totalSpending = (companyData as any).totalSpending || 0;
            const localSpending = (companyData as any).localSpending || 0;
            const smeSpending = (companyData as any).smeSpending || 0;
            setIcvBarData([
                { name: t('dashboard.icv.totalTenders'), value: totalSpending },
                { name: t('dashboard.icv.localSpending'), value: localSpending },
                { name: t('dashboard.icv.smeSpending'), value: smeSpending },
            ] as any);
        }


    }, [selectedCompanyId, language, t, selectedYear]);

    // --- ARABIC FONT FIX FOR EXPORT ---
    const handleExport = async () => {
        if (!reportRef.current) return;
        setIsExporting(true);

        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2, 
                useCORS: true, 
                backgroundColor: '#051a14', 
                logging: false,
                // THIS IS THE SECRET FIX:
                onclone: (documentClone) => {
                    // 1. Force a font that supports Arabic ligatures (System Font) on all text
                    const allElements = documentClone.querySelectorAll('*');
                    allElements.forEach((el: any) => {
                        // Apply to everything to be safe, especially SVG text
                        el.style.fontFamily = 'Arial, sans-serif'; 
                        el.style.letterSpacing = '0px'; // Prevent letter splitting
                    });

                    // 2. Specifically target SVG text (Recharts)
                    const svgTexts = documentClone.querySelectorAll('text');
                    svgTexts.forEach((el: any) => {
                        el.style.fontFamily = 'Arial, sans-serif';
                        el.style.direction = 'rtl'; // Force RTL direction
                        el.style.unicodeBidi = 'embed';
                    });
                }
            });

            const imgData = canvas.toDataURL('image/png');
            
            const pdfWidth = canvas.width * 0.264583; 
            const pdfHeight = canvas.height * 0.264583;

            const pdf = new jsPDF({
                orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            
            const filename = `OIA-Strategic-Report-${selectedCompany ? (language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en) : 'Report'}-${selectedYear}.pdf`;
            pdf.save(filename);
            
        } catch (error) {
            console.error("Export failed:", error);
            alert("حدث خطأ أثناء تصدير التقرير، يرجى المحاولة مرة أخرى.");
        } finally {
            setIsExporting(false);
        }
    };
    
    const tooltipStyle = {
        contentStyle: {
            backgroundColor: 'rgba(20, 20, 30, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            color: '#fff'
        },
        itemStyle: { color: '#fff' },
        cursor: { fill: 'rgba(255,255,255,0.05)' }
    };
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'OMR', minimumFractionDigits: 0 }).format(value);
    
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      if (percent === 0) return null;

      return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-bold drop-shadow-md print:fill-black">
          {`%${(percent * 100).toFixed(0)}`}
        </text>
      );
    };

    const renderCustomLegend = (props: any) => {
        const { payload } = props;
        if (!payload || payload.length === 0) return null;

        const companyScorePayload = payload.find((p: any) => p.dataKey === 'company');
        const sectorAveragePayload = payload.find((p: any) => p.dataKey === 'sector');

        if (!companyScorePayload || !sectorAveragePayload) return null;

        return (
            <div className="w-full flex justify-between items-center" style={{ position: 'absolute', bottom: '20px', paddingLeft: '60px', paddingRight: '60px' }}>
                <div className="flex items-center gap-2">
                     <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: sectorAveragePayload.color }} />
                     <span className="text-white print-text-black">{sectorAveragePayload.value}</span>
                </div>
                 <div className="flex items-center gap-2">
                     <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: companyScorePayload.color }} />
                     <span className="text-white print-text-black">{companyScorePayload.value}</span>
                </div>
            </div>
        );
    };


    if (!selectedCompanyId || selectedCompanyId === 'all') {
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
            {/* Header */}
            <header className="flex flex-col md:flex-row items-center justify-between mb-8 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold">{t('reports.title')} - {selectedCompany ? (language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en) : ''}</h1>
                    <p className="text-gray-300 mt-1">{format(new Date(), "eeee, d MMMM yyyy")}</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(Number(val))}>
                        <SelectTrigger className="w-[180px] glass text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                             {availableYears.map(year => (
                                <SelectItem key={year} value={String(year)}>{t('reports.year')} {year}</SelectItem>
                             ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleExport} className="bg-gold-500 text-royal-900 hover:bg-gold-400" disabled={isExporting}>
                        {isExporting ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <FileDown className="ml-2 h-5 w-5" />}
                        {isExporting ? t('common.loading') : t('reports.export')}
                    </Button>
                </div>
            </header>
            
            {/* Report Content Ref */}
            <div id="report-content" ref={reportRef} className="p-8 bg-royal-900 print:bg-white print:p-0">
                {/* For Print Header */}
                <div className="hidden print:block text-center mb-8">
                     <h1 className="text-3xl font-bold text-black print-text-black">{t('appTitle')}</h1>
                     <h2 className="text-xl font-semibold text-gray-700 print-text-black">{t('appSubtitle')}</h2>
                     <p className="text-gray-500 mt-2 print-text-black">
                        {selectedCompany ? (language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en) : ''}
                        {' - '}
                        {format(new Date(), "d MMMM yyyy")}
                     </p>
                </div>

                {/* Top Row */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 print-break-inside-avoid">
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
                        <Card className={cn(cardBaseClasses, "border-gold-500/30 hover:border-gold-500/70")}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gold-200/80 print-text-black">{t('reports.summary.maturity')}</CardTitle>
                                <TrendingUp className="w-4 h-4 text-gold-300/70" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gold-400 print-text-black">{summaryData.maturity}/5</div>
                                <p className="text-xs text-gold-300/60 print-text-black">{t('reports.summary.maturitySub')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
                        <Card className={cn(cardBaseClasses, "border-green-500/30 hover:border-green-500/70")}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-green-200/80 print-text-black">{t('reports.summary.compliance')}</CardTitle>
                                <CheckCircle className="w-4 h-4 text-green-300/70" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-400 print-text-black">{summaryData.compliance}%</div>
                                 <p className="text-xs text-green-300/60 print-text-black">{t('reports.summary.complianceSub')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
                        <Card className={cn(cardBaseClasses, "border-red-500/30 hover:border-red-500/70")}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-red-200/80 print-text-black">{t('reports.summary.risks')}</CardTitle>
                                <AlertCircle className="w-4 h-4 text-red-300/70" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold print-text-black">
                                   <span className="text-danger">{summaryData.risks.critical} {t('registry.risks.critical')}</span> / <span className="text-yellow-400">{summaryData.risks.high} {t('registry.risks.high')}</span>
                                </div>
                                <p className="text-xs text-red-300/60 print-text-black">{t('reports.summary.risksSub')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                     <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
                        <Card className={cn(cardBaseClasses, "border-blue-500/30 hover:border-blue-500/70")}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-blue-200/80 print-text-black">{t('reports.summary.actions')}</CardTitle>
                                <AlertCircle className="w-4 h-4 text-blue-300/70" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-400 print-text-black">{summaryData.actions} {t('reports.summary.pending')}</div>
                                <p className="text-xs text-blue-300/60 print-text-black">{t('reports.summary.actionsSub')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Main Visuals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print-break-inside-avoid">
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5} className="print-break-inside-avoid">
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="text-gold-400 font-bold print-text-black">{t('reports.maturityAnalysis')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                         <defs>
                                            <radialGradient id="radarFill">
                                              <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.4}/>
                                              <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.1}/>
                                            </radialGradient>
                                          </defs>
                                        <PolarGrid className="stroke-white/20 print:stroke-gray-300" />
                                        <PolarAngleAxis dataKey="subject" tick={<RadarCustomTick />} />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} className="hidden" />
                                        <Tooltip {...tooltipStyle} formatter={(value: number) => Math.round(value)} />
                                        <Legend content={renderCustomLegend} />
                                        <Radar name={t('reports.companyScore')} dataKey="company" stroke="#D4AF37" strokeWidth={2} fill="url(#radarFill)" fillOpacity={0.6} />
                                        <Radar name={t('reports.sectorAverage')} dataKey="sector" stroke="#8884d8" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6} className="print-break-inside-avoid">
                        <Card className="glass">
                            <CardHeader>
                               <CardTitle className="text-gold-400 font-bold print-text-black">{t('reports.financial.title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <ResponsiveContainer width="100%" height={400}>
                                    <ComposedChart data={financialPerformanceData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" />
                                        <XAxis dataKey="name" tick={{ fill: '#A0A0A0' }} className="print-text-black" />
                                        <YAxis tickFormatter={(value) => `${value / 1000000}M`} tick={{ fill: '#A0A0A0' }} className="print-text-black" />
                                        <Tooltip {...tooltipStyle} formatter={formatCurrency} />
                                        <Legend wrapperStyle={{ color: '#FFFFFF' }}/>
                                        <Bar dataKey="revenue" name={t('reports.financial.revenue')} barSize={50} fill="#3b82f6" />
                                        <Bar dataKey="expenses" name={t('reports.financial.expenses')} barSize={50} fill="#ef4444" />
                                        <Line type="monotone" dataKey="netProfit" name={t('reports.financial.netProfit')} stroke="#00E096" strokeWidth={3} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Board & ICV Analysis */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print-break-inside-avoid">
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7} className="print-break-inside-avoid">
                        <Card className="glass">
                            <CardHeader>
                               <CardTitle className="text-gold-400 font-bold print-text-black">{t('dashboard.boardComposition.title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                     <PieChart>
                                        <Pie 
                                          data={boardIndependenceData} 
                                          dataKey="value" 
                                          nameKey="name" 
                                          cx="50%" 
                                          cy="50%" 
                                          innerRadius={0} 
                                          outerRadius={90} 
                                          paddingAngle={5} 
                                          labelLine={false}
                                          label={renderCustomizedLabel}
                                        >
                                            {boardIndependenceData.map((entry: any, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip {...tooltipStyle} />
                                        <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{fontSize: '14px', color: 'white', paddingTop: '20px'}} className="print-text-black"/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={8} className="print-break-inside-avoid">
                        <Card className="glass">
                            <CardHeader>
                               <CardTitle className="text-gold-400 font-bold print-text-black">{t('dashboard.icv.title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={icvBarData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                        <XAxis dataKey="name" tick={{ fill: '#A0A0A0', fontSize: 12 }} className="print-text-black" />
                                        <YAxis tickFormatter={(value) => `${value / 1_000_000}M`} tick={{ fill: '#A0A0A0' }} className="print-text-black"/>
                                        <Tooltip {...tooltipStyle} formatter={formatCurrency} />
                                        <Bar dataKey="value" name={t('dashboard.icv.spending')} barSize={40} radius={[4, 4, 0, 0]}>
                                            {(icvBarData as any[]).map((entry, index) => {
                                                const colors = ['#6b7280', '#3b82f6', '#00E096'];
                                                return <Cell key={`cell-${index}`} fill={colors[index]} />;
                                            })}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print-break-inside-avoid">
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7} className="print-break-inside-avoid">
                         <Card className="glass">
                            <CardHeader>
                               <CardTitle className="text-gold-400 font-bold print-text-black">{t('reports.riskAnalysis')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart 
                                        data={riskDistributionData} 
                                        layout="vertical" 
                                        margin={{ top: 0, right: 20, left: 60, bottom: 0 }}
                                    >
                                        <CartesianGrid horizontal={false} className="stroke-white/10 print:stroke-gray-200" />
                                        <XAxis type="number" tick={{ fill: '#9CA3AF' }} className="fill-white text-xs print:fill-black" />
                                        <YAxis 
                                            dataKey="name" 
                                            type="category" 
                                            width={80}
                                            tick={{ fontSize: 14, fill: '#9ca3af' }}
                                            dx={-10}
                                        />
                                        <Tooltip {...tooltipStyle} />
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

                     <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={8} className="print-break-inside-avoid">
                         <Card className="glass">
                            <CardHeader>
                               <CardTitle className="text-gold-400 font-bold print-text-black">{t('reports.improvementStatus')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={improvementPlanData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} labelLine={false}>
                                            {improvementPlanData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={(entry as any).color} />
                                            ))}
                                        </Pie>
                                        <Tooltip {...tooltipStyle}/>
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
                     <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={9} className="print-break-inside-avoid">
                         <Card className="glass">
                            <CardHeader><CardTitle className="text-gold-400 font-bold print-text-black">{t('reports.topGaps')}</CardTitle></CardHeader>
                            <CardContent>
                                 <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10 hover:bg-transparent print:border-gray-300">
                                            <TableHead className="text-right text-white font-bold print:text-black">{t('reports.table.indicator')}</TableHead>
                                            <TableHead className="text-right text-white font-bold print:text-black">{t('reports.table.axis')}</TableHead>
                                            <TableHead className="text-center text-white font-bold print:text-black">{t('reports.table.score')}</TableHead>
                                            <TableHead className="text-right text-white font-bold print:text-black">{t('reports.table.recommendation')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topGapsData.map((gap: any) => (
                                            <TableRow key={gap.id} className="border-white/10 hover:bg-white/5 print:border-gray-200">
                                                <TableCell className="font-medium print-text-black">{gap.id}. {gap.name}</TableCell>
                                                <TableCell className="print-text-black">{gap.axis}</TableCell>
                                                <TableCell className="text-center"><Badge variant="destructive">{gap.score}</Badge></TableCell>
                                                <TableCell className="print-text-black">{t('reports.developPolicy')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </motion.div>
                     <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={10} className="print-break-inside-avoid">
                         <Card className="glass">
                            <CardHeader><CardTitle className="text-gold-400 font-bold print-text-black">{t('reports.criticalRisks')}</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10 hover:bg-transparent print:border-gray-300">
                                            <TableHead className="text-right text-white font-bold print:text-black">{t('compliance.riskForm.description')}</TableHead>
                                            <TableHead className="text-right text-white font-bold print:text-black">{t('compliance.riskForm.category')}</TableHead>
                                            <TableHead className="text-center text-white font-bold print:text-black">{t('compliance.riskForm.impact')}</TableHead>
                                            <TableHead className="text-center text-white font-bold print:text-black">{t('compliance.riskForm.probability')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {criticalRisksData.map((risk: any, index: number) => (
                                            <TableRow key={index} className="border-white/10 hover:bg-white/5 print:border-gray-200">
                                                <TableCell className="font-medium print-text-black">{risk.description}</TableCell>
                                                <TableCell className="print-text-black">{t(`compliance.riskCategories.${risk.category.toLowerCase()}`)}</TableCell>
                                                <TableCell className="text-center"><Badge className="bg-danger/80 text-danger-foreground">{risk.impact}</Badge></TableCell>
                                                <TableCell className="text-center"><Badge className="bg-yellow-500/80 text-yellow-foreground">{risk.probability}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
