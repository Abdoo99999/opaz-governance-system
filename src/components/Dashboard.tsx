
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  ComposedChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, CheckCircle, Users, Target, PieChartIcon, Wallet, BarChart2, Briefcase, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { INDICATORS, AXES } from '@/lib/data/indicators';
import RiskLandscape from './dashboard/RiskLandscape';
import { cn } from '@/lib/utils';
import { useYear } from '@/context/YearContext';
import TopPerformers, { Performer } from './dashboard/TopPerformers';
import type { Task } from '@/components/ImprovementPlan';
import { COMPANIES } from '@/data/companies';
import { BOARD_MEMBERS } from '@/data/board-members';


const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

const cardBaseClasses = "glass h-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent === 0) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-bold drop-shadow-md">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


const RadarCustomTick = (props: any) => {
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


const Dashboard = () => {
  const { t, language } = useLanguage();
  const { getSelectedCompany, selectedCompanyId } = useCompany();
  const { selectedYear } = useYear();

  // State for all dashboard data
  const [maturityScore, setMaturityScore] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [omanizationRate, setOmanizationRate] = useState(0);
  const [risks, setRisks] = useState<any[]>([]);
  const [netProfit, setNetProfit] = useState(0);
  const [equity, setEquity] = useState(0);
  const [freeCashFlow, setFreeCashFlow] = useState(0);
  const [lastROI, setLastROI] = useState(0);
  const [topPerformers, setTopPerformers] = useState<Performer[]>([]);
  const [improvementPlanData, setImprovementPlanData] = useState([]);
  const [boardIndependenceData, setBoardIndependenceData] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [icvBarData, setIcvBarData] = useState([]);
  const [compliancePieData, setCompliancePieData] = useState([]);
  const [maturityPathData, setMaturityPathData] = useState([]);
  
  const selectedCompany = getSelectedCompany();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let currentMaturityScore = 0;
    const allCompaniesStr = localStorage.getItem('oia_companies_registry');
    const allCompanies = allCompaniesStr ? JSON.parse(allCompaniesStr) : COMPANIES;
    let sectorScoresByAxis: { [key: number]: number[] } = {};
    AXES.forEach(a => sectorScoresByAxis[a.id] = []);

    allCompanies.forEach((comp: any) => {
         const compAssessmentStr = localStorage.getItem(`oia_assessment_${comp.id}`);
         if (compAssessmentStr) {
             const compAssessmentData = JSON.parse(compAssessmentStr);
             AXES.forEach(axis => {
                const axisIndicators = INDICATORS.filter(ind => ind.axisId === axis.id);
                if(axisIndicators.length === 0) return;
                const axisScores = axisIndicators.map(ind => compAssessmentData.scores?.[ind.id] || 0);
                const axisSum = axisScores.reduce((a, b) => a + b, 0);
                const axisAvg = axisSum / (axisIndicators.length * 5); // Score is out of 5
                sectorScoresByAxis[axis.id].push(axisAvg);
             });
         }
    });
    const sectorAverageByAxis = AXES.map(axis => {
        const avgs = sectorScoresByAxis[axis.id] || [];
        const total = avgs.length > 0 ? avgs.reduce((a, b) => a + b, 0) / avgs.length : 0;
        return total * 150; // Scale to 150 for radar
    });


    if (selectedCompanyId && selectedCompanyId !== 'all') {
        const companyData = allCompanies.find((c: any) => c.id === selectedCompanyId);
        if (!companyData) return;
        
        const assessmentStr = localStorage.getItem(`oia_assessment_${selectedCompanyId}`);
        const assessmentData = assessmentStr ? JSON.parse(assessmentStr) : { scores: {} };

        const complianceStr = localStorage.getItem(`oia_compliance_${selectedCompanyId}`);
        const complianceData = complianceStr ? JSON.parse(complianceStr) : { compliance: {}, risks: [] };
        
        const improvementPlanStr = localStorage.getItem(`oia_improvement_plan_${selectedCompanyId}`);
        const improvementPlanTasks: Task[] = improvementPlanStr ? JSON.parse(improvementPlanStr) : [];

        const scores = Object.values(assessmentData.scores || {}) as number[];
        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        currentMaturityScore = scores.length > 0 ? totalScore / INDICATORS.length : 0;
        setMaturityScore(currentMaturityScore);

        setTotalAssets(companyData.authorizedCapital || 0);
        setOmanizationRate(companyData.totalEmployees > 0 ? Math.round((companyData.omaniEmployees / companyData.totalEmployees) * 100) : 0);
        setRisks(complianceData?.risks || []);

        setNetProfit((companyData.revenue || 0) - (companyData.expenses || 0));
        setEquity((companyData.authorizedCapital || 0) - (companyData.liabilities || 0));
        setFreeCashFlow((companyData.operatingCash || 0) - (companyData.capex || 0));
        setLastROI(companyData.lastROI || 0);

        const todo = improvementPlanTasks.filter(t => t.status === 'todo').length;
        const inProgress = improvementPlanTasks.filter(t => t.status === 'in-progress').length;
        const completed = improvementPlanTasks.filter(t => t.status === 'done').length;
        setImprovementPlanData([
            { name: t('reports.improvement.completed'), value: completed, color: '#00E096' },
            { name: t('reports.improvement.inProgress'), value: inProgress, color: '#FFD700' },
            { name: t('reports.improvement.notStarted'), value: todo, color: '#6b7280' },
        ] as any);

        const members = BOARD_MEMBERS.filter(m => m.companyId === selectedCompanyId);
        const independentCount = members.filter(m => m.type === 'Independent').length;
        setBoardIndependenceData([
            { name: t('dashboard.boardComposition.independent'), value: independentCount, color: '#D4AF37' },
            { name: t('dashboard.boardComposition.nonIndependent'), value: members.length - independentCount, color: '#3b82f6' },
        ] as any);
        
        const newRadarData = AXES.map((axis, index) => {
            const axisIndicators = INDICATORS.filter(ind => ind.axisId === axis.id);
            const companyAxisScores = axisIndicators.map(ind => assessmentData.scores?.[ind.id] || 0);
            const companyAxisSum = companyAxisScores.reduce((a, b) => a + b, 0);
            const companyValue = axisIndicators.length > 0 ? (companyAxisSum / (axisIndicators.length * 5)) * 150 : 0;
            
            return { subject: language === 'ar' ? axis.title_ar : axis.title_en, company: companyValue, sector: sectorAverageByAxis[index], fullMark: 150 };
        });
        setRadarData(newRadarData as any);
        
        setIcvBarData([
            { name: t('dashboard.icv.totalTenders'), value: companyData.totalSpending || 0 },
            { name: t('dashboard.icv.localSpending'), value: companyData.localSpending || 0 },
            { name: t('dashboard.icv.smeSpending'), value: companyData.smeSpending || 0 },
        ] as any);

        const complianceItems = Object.values(complianceData.compliance || {});
        setCompliancePieData([
          { name: t('dashboard.compliant'), value: complianceItems.filter(v => v === true).length },
          { name: t('dashboard.nonCompliant'), value: complianceItems.filter(v => v === false).length },
        ] as any);

    } else { // "All Companies" selected
        let totalMaturity = 0, totalOmanization = 0, totalCompliant = 0;
        let totalAssetsAgg = 0, totalNetProfitAgg = 0, totalEquityAgg = 0, totalFreeCashFlowAgg = 0, totalROIAgg = 0;
        let allRisksAgg: any[] = [];
        let allImprovementTasksAgg: Task[] = [];
        let allMembersCount = 0, allIndependentCount = 0;
        let totalSpendingAgg = 0, totalLocalSpendingAgg = 0, totalSmeSpendingAgg = 0;
        let allCompanyScores: Performer[] = [];
        let totalComplianceItemsCount = 0;

        allCompanies.forEach((comp: any) => {
            const assessmentStr = localStorage.getItem(`oia_assessment_${comp.id}`);
            if (assessmentStr) {
                const assessmentData = JSON.parse(assessmentStr);
                const scores = Object.values(assessmentData.scores || {}) as number[];
                if(scores.length > 0) {
                  const totalScore = scores.reduce((sum, score) => sum + score, 0);
                  const companyMaturity = totalScore / INDICATORS.length;
                  totalMaturity += companyMaturity;
                  allCompanyScores.push({ name_ar: comp.name_ar, name_en: comp.name_en, score: companyMaturity });
                }
            }
            const complianceStr = localStorage.getItem(`oia_compliance_${comp.id}`);
            if (complianceStr) {
                const complianceData = JSON.parse(complianceStr);
                const complianceItems = Object.values(complianceData.compliance || {});
                totalCompliant += complianceItems.filter(v => v === true).length;
                totalComplianceItemsCount += complianceItems.length;
                allRisksAgg.push(...(complianceData.risks || []));
            }
            const improvementPlanStr = localStorage.getItem(`oia_improvement_plan_${comp.id}`);
            if (improvementPlanStr) {
                allImprovementTasksAgg.push(...(JSON.parse(improvementPlanStr)));
            }
            totalAssetsAgg += comp.authorizedCapital || 0;
            totalNetProfitAgg += (comp.revenue || 0) - (comp.expenses || 0);
            totalEquityAgg += (comp.authorizedCapital || 0) - (comp.liabilities || 0);
            totalFreeCashFlowAgg += (comp.operatingCash || 0) - (comp.capex || 0);
            totalROIAgg += comp.lastROI || 0;
            totalOmanization += comp.totalEmployees > 0 ? Math.round((comp.omaniEmployees / comp.totalEmployees) * 100) : 0;
            totalSpendingAgg += comp.totalSpending || 0;
            totalLocalSpendingAgg += comp.localSpending || 0;
            totalSmeSpendingAgg += comp.smeSpending || 0;
        });

        const numCompanies = allCompanies.length || 1;
        currentMaturityScore = totalMaturity / allCompanyScores.length;
        setMaturityScore(currentMaturityScore);
        setTotalAssets(totalAssetsAgg);
        setOmanizationRate(Math.round(totalOmanization / numCompanies));
        setRisks(allRisksAgg);
        setNetProfit(totalNetProfitAgg);
        setEquity(totalEquityAgg);
        setFreeCashFlow(totalFreeCashFlowAgg);
        setLastROI(totalROIAgg / numCompanies);
        
        setTopPerformers(allCompanyScores.sort((a,b) => b.score - a.score).slice(0, 5));

        const todo = allImprovementTasksAgg.filter(t => t.status === 'todo').length;
        const inProgress = allImprovementTasksAgg.filter(t => t.status === 'in-progress').length;
        const completed = allImprovementTasksAgg.filter(t => t.status === 'done').length;
        setImprovementPlanData([
            { name: t('reports.improvement.completed'), value: completed, color: '#00E096' },
            { name: t('reports.improvement.inProgress'), value: inProgress, color: '#FFD700' },
            { name: t('reports.improvement.notStarted'), value: todo, color: '#6b7280' },
        ] as any);

        allIndependentCount = BOARD_MEMBERS.filter(m => m.type === 'Independent').length;
        allMembersCount = BOARD_MEMBERS.length;
        setBoardIndependenceData([
            { name: t('dashboard.boardComposition.independent'), value: allIndependentCount, color: '#D4AF37' },
            { name: t('dashboard.boardComposition.nonIndependent'), value: allMembersCount - allIndependentCount, color: '#3b82f6' },
        ] as any);

        const allCompaniesRadarData = AXES.map((axis, index) => {
            const companyValue = index === 0 ? currentMaturityScore * 30 : Math.random() * 100 + 40;
            return {
                subject: language === 'ar' ? axis.title_ar : axis.title_en,
                company: companyValue,
                sector: sectorAverageByAxis[index],
                fullMark: 150
            };
        });
        setRadarData(allCompaniesRadarData);
        
        setIcvBarData([
            { name: t('dashboard.icv.totalTenders'), value: totalSpendingAgg },
            { name: t('dashboard.icv.localSpending'), value: totalLocalSpendingAgg },
            { name: t('dashboard.icv.smeSpending'), value: totalSmeSpendingAgg },
        ] as any);

         setCompliancePieData([
          { name: t('dashboard.compliant'), value: totalCompliant },
          { name: t('dashboard.nonCompliant'), value: totalComplianceItemsCount - totalCompliant },
        ] as any);
    }
    
    const path = Array.from({ length: 7 }, (_, i) => {
        const year = 2024 + i;
        const baseScore = currentMaturityScore || 3.0;
        const companyScore = year >= selectedYear 
            ? baseScore + (year - selectedYear) * 0.2 + (Math.random() - 0.5) * 0.1
            : baseScore - (selectedYear - year) * 0.15 + (Math.random() - 0.5) * 0.1;
        const sectorAverage = baseScore * 0.9 + (year - selectedYear) * 0.15 + (Math.random() - 0.5) * 0.15;
        const target = 3.5 + i * 0.25;

        return {
            year: year.toString(),
            companyScore: Math.max(1, Math.min(5, parseFloat(companyScore.toFixed(1)))),
            sectorAverage: Math.max(1, Math.min(5, parseFloat(sectorAverage.toFixed(1)))),
            target: Math.min(5, parseFloat(target.toFixed(1))),
        };
    });
    setMaturityPathData(path as any);

  }, [selectedCompanyId, language, selectedYear, t]);


  const sparklineData = useMemo(() => 
    Array.from({ length: 10 }, () => ({
      uv: totalAssets * (Math.random() * 0.4 + 0.8)
    })), 
  [totalAssets]);

  const dashboardTitle = useMemo(() => {
    if (selectedCompany) {
      return language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en;
    }
    return t('menu.dashboard');
  }, [selectedCompany, language, t]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 glass text-white rounded-lg">
           <p className="label font-bold text-lg mb-2">{`${t('reports.year')} ${label}`}</p>
           {payload.map((p: any) => (
             <div key={p.dataKey} style={{ color: p.color }} className="flex justify-between gap-4">
                <span>{p.name}:</span>
                <span className="font-bold">{p.value.toFixed(1)}</span>
             </div>
           ))}
        </div>
      );
    }
    return null;
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
        labelStyle: { color: '#D4AF37' }
    };
    
    const currencyFormatter = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'OMR', notation: 'compact' }).format(value);

    const totalComplianceItems = (compliancePieData as any[]).reduce((acc, item) => acc + item.value, 0);
    const compliantItems = (compliancePieData.find(item => (item as any).name === t('dashboard.compliant')) as any)?.value || 0;
    const compliancePercentage = totalComplianceItems > 0
        ? Math.round((compliantItems / totalComplianceItems) * 100)
        : 0;

  return (
    <div className="p-4 md:p-6 lg:p-8 text-white space-y-8">
       <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{dashboardTitle}</h1>
      </header>

      {/* Row 1 & 2 : KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
              <Card className={cn(cardBaseClasses, "border-gold-500/30 hover:border-gold-500/70")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gold-200/80">{t('dashboard.maturityGauge')}</CardTitle>
                      <TrendingUp className="h-4 w-4 text-gold-300/70" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-4xl font-bold text-gold-400">{maturityScore.toFixed(1)} / 5</div>
                      <p className="text-xs text-gold-200/60 mt-1">{t('dashboard.overallScore')}</p>
                  </CardContent>
              </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
              <Card className={cn(cardBaseClasses, "border-green-500/30 hover:border-green-500/70 relative overflow-hidden")}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
                      <CardTitle className="text-sm font-medium text-green-200/80">{t('dashboard.portfolioHealth')}</CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-300/70" />
                  </CardHeader>
                  <CardContent className="z-10">
                      <div className="text-4xl font-bold text-green-400">{currencyFormatter(totalAssets)}</div>
                      <p className="text-xs text-green-200/60 mt-1">{t('dashboard.totalAssets')}</p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-20">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparklineData}>
                            <defs>
                                <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00E096" stopOpacity={0.5}/>
                                    <stop offset="95%" stopColor="#00E096" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="uv" stroke="#00E096" strokeWidth={2} fill="url(#colorAssets)" />
                        </AreaChart>
                    </ResponsiveContainer>
                  </div>
              </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
             <Card className={cn(cardBaseClasses, "border-blue-500/30 hover:border-blue-500/70")}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-200/80">{t('dashboard.omanization')}</CardTitle>
                       <Users className="h-4 w-4 text-blue-300/70" />
                  </CardHeader>
                  <CardContent className="h-[100px] flex items-center justify-center">
                       <div className="w-24 h-24 relative">
                           <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius="70%" 
                                    outerRadius="100%" 
                                    barSize={8} 
                                    data={[{name: 'Omanization', value: omanizationRate}]}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                    <RadialBar background={{ fill: 'rgba(255,255,255,0.1)'}} dataKey='value' cornerRadius={4} className="fill-blue-500" />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-blue-300">{omanizationRate}%</span>
                            </div>
                        </div>
                  </CardContent>
              </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
              <Card className={cn(cardBaseClasses, "border-red-500/30 hover:border-red-500/70")}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-red-200/80">{t('dashboard.riskMap')}</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-red-300/70" />
                  </CardHeader>
                  <CardContent>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <div className="text-4xl font-bold text-red-400">{risks.length}</div>
                      </div>
                      <p className="text-xs text-red-200/60 mt-1">{t('dashboard.activeRisks')}</p>
                  </CardContent>
              </Card>
          </motion.div>
          
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
            <Card className={cn(cardBaseClasses, "border-purple-500/30 hover:border-purple-500/70")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-200/80">{t('dashboard.financial.freeCashFlow')}</CardTitle>
                    <Wallet className="h-4 w-4 text-purple-300/70" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-purple-400">{currencyFormatter(freeCashFlow)}</div>
                    <p className="text-xs text-purple-200/60 mt-1">{t('financials.cashflow.fcf')}</p>
                </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5}>
            <Card className={cn(cardBaseClasses, "border-sky-500/30 hover:border-sky-500/70")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-sky-200/80">{t('dashboard.financial.equity')}</CardTitle>
                    <Briefcase className="h-4 w-4 text-sky-300/70" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-sky-400">{currencyFormatter(equity)}</div>
                    <p className="text-xs text-sky-200/60 mt-1">{t('financials.position.equity')}</p>
                </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
            <Card className={cn(cardBaseClasses, "border-teal-500/30 hover:border-teal-500/70")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-teal-200/80">{t('dashboard.financial.netProfit')}</CardTitle>
                    <BarChart2 className="h-4 w-4 text-teal-300/70" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-teal-400">{currencyFormatter(netProfit)}</div>
                    <p className="text-xs text-teal-200/60 mt-1">{t('financials.performance.netProfit')}</p>
                </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7}>
            <Card className={cn(cardBaseClasses, "border-amber-500/30 hover:border-amber-500/70")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-200/80">{t('dashboard.financial.roi')}</CardTitle>
                    <FileText className="h-4 w-4 text-amber-300/70" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-amber-400">{lastROI.toFixed(1)}%</div>
                    <p className="text-xs text-amber-200/60 mt-1">{t('financials.kpi.roi')}</p>
                </CardContent>
            </Card>
          </motion.div>
      </div>

       {/* Row 3: Highlights & Action */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
              <TopPerformers data={topPerformers} />
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5}>
                <Card className={"glass h-full"}>
                    <CardHeader>
                        <CardTitle className="text-gold-400">{t('dashboard.boardComposition.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={boardIndependenceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={0} outerRadius={90} paddingAngle={5} labelLine={false} label={renderCustomizedLabel}>
                                    {(boardIndependenceData as any[]).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip {...tooltipStyle}/>
                                <Legend iconType="circle" wrapperStyle={{ color: '#FFFFFF' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>
      </div>
      
      {/* Row 4: Strategic Radar */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={9}>
        <Card className={"glass h-full"}>
          <CardHeader>
            <CardTitle className="text-gold-400">{t('dashboard.strategicRadar')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
               <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <defs>
                  <radialGradient id="radarFillGold">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.1}/>
                  </radialGradient>
                </defs>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={<RadarCustomTick />} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Tooltip {...tooltipStyle} formatter={(value: number) => value.toFixed(1)} />
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingRight: '20px', color: '#FFFFFF', lineHeight: '2.5rem' }} iconType="circle" />
                <Radar name={t('reports.companyScore')} dataKey="company" stroke="#D4AF37" strokeWidth={2} fill="url(#radarFillGold)" fillOpacity={0.6} dot={{ r: 4, strokeWidth: 2 }} />
                <Radar name={t('reports.sectorAverage')} dataKey="sector" stroke="#8b5cf6" strokeWidth={2} fill="transparent" strokeDasharray="5 5" dot={{ r: 4, strokeWidth: 2 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Row 5: Operations & Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={8}>
              <Card className={"glass h-full"}>
                  <CardHeader>
                      <CardTitle className="text-gold-400">{t('dashboard.improvementStatus.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                              <Pie 
                                data={improvementPlanData} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={70} 
                                outerRadius={100} 
                                paddingAngle={5} 
                                labelLine={false}
                              >
                                  {(improvementPlanData as any[]).map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                              </Pie>
                              <Tooltip {...tooltipStyle} />
                              <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{fontSize: '14px', color: 'white', paddingTop: '20px'}}/>
                               <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-3xl font-bold">
                                    {(improvementPlanData as any[]).reduce((acc, item) => acc + item.value, 0)}
                                </text>
                                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400 text-sm">
                                  {t('reports.actions')}
                                </text>
                          </PieChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>
          </motion.div>
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={9}>
                <Card className={"glass h-full"}>
                    <CardHeader>
                        <CardTitle className="text-gold-400">{t('dashboard.icv.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-6">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={icvBarData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="name" tick={{ fill: '#A0A0A0', fontSize: 12 }} />
                                <YAxis tickFormatter={(value) => `${value / 1_000_000}M`} tick={{ fill: '#A0A0A0' }} />
                                <Tooltip {...tooltipStyle} formatter={currencyFormatter} />
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

      {/* Row 6: Risk and Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={10}>
                <Card className={"glass h-full"}>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold-400">
                        <AlertTriangle />
                         {t('dashboard.riskMap')}
                    </CardTitle>
                    </CardHeader>
                    <CardContent className='h-[300px]'>
                        <RiskLandscape data={risks} />
                    </CardContent>
                </Card>
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={11}>
                <Card className={"glass h-full"}>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold-400">
                        <PieChartIcon />
                        {t('dashboard.compliance')}
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={compliancePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false}>
                                    <Cell key="compliant" fill="#00E096" />
                                    <Cell key="non-compliant" fill="#FF3B3B" />
                                </Pie>
                                 <Tooltip {...tooltipStyle} />
                                <Legend iconType="circle" wrapperStyle={{fontSize: '14px', color: 'white'}}/>
                                 <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-3xl font-bold print:fill-black">
                                    {`${compliancePercentage}%`}
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
      
      {/* Row 7: Strategic Path */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={12}>
          <Card className={"glass h-full"}>
              <CardHeader>
                  <CardTitle className="text-gold-400 flex items-center gap-2">
                      <Target />
                      {t('dashboard.maturityPath')}
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart
                          data={maturityPathData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                          <defs>
                              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <XAxis dataKey="year" tick={{ fill: '#A0A0A0' }} />
                          <YAxis domain={[1, 5]} tick={{ fill: '#A0A0A0' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ color: '#FFFFFF', lineHeight: '2.5rem' }} iconType="circle" />
                          <Line type="monotone" dataKey="companyScore" name={t('reports.companyScore')} stroke="#fbbf24" strokeWidth={3} dot={{r: 4}} />
                          <Line type="monotone" dataKey="sectorAverage" name={t('reports.sectorAverage')} stroke="#34d399" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="target" name={t('dashboard.maturityPath')} stroke="#818cf8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      </ComposedChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
