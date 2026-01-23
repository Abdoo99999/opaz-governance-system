
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
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
import { TrendingUp, AlertTriangle, CheckCircle, Users, Target, PieChartIcon, Wallet, Briefcase, FileDown, Loader2, FileSignature, LandPlot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { INDICATORS, AXES } from '@/data/indicators';
import RiskLandscape from './dashboard/RiskLandscape';
import { cn } from '@/lib/utils';
import { useYear } from '@/context/YearContext';
import TopPerformers from './dashboard/TopPerformers';
import type { Task } from '@/components/ImprovementPlan';
import { ZONES, type Zone } from '@/data/companies';
import { BOARD_MEMBERS as staticBoardMembers, BoardMember } from '@/data/board-members';
import { RadarCustomTick } from './Reports';


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

const cardBaseClasses = "glass h-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl print:shadow-none print:border-gray-200 print:bg-white";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent === 0) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-bold drop-shadow-md print:fill-black">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Dashboard = () => {
  const { t, language } = useLanguage();
  const { getSelectedZone, dataVersion } = useCompany();
  const selectedCompanyId = getSelectedZone()?.id
  const { selectedYear } = useYear();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // State for all dashboard data
  const [maturityScore, setMaturityScore] = useState(0);
  const [omanizationRate, setOmanizationRate] = useState(0);
  const [risks, setRisks] = useState<any[]>([]);
  const [agreementsSigned, setAgreementsSigned] = useState(0);
  const [developedArea, setDevelopedArea] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [lastROI, setLastROI] = useState(0);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [improvementPlanData, setImprovementPlanData] = useState([]);
  const [boardIndependenceData, setBoardIndependenceData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState([]);
  const [icvBarData, setIcvBarData] = useState([]);
  const [compliancePieData, setCompliancePieData] = useState<any[]>([]);
  const [maturityPathData, setMaturityPathData] = useState([]);
  
  const selectedZone = getSelectedZone();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // --- Central Data Loading ---
    const allZonesStr = localStorage.getItem('opaz_zones_registry');
    const allZones: Zone[] = allZonesStr ? JSON.parse(allZonesStr) : ZONES;
    const allBoardMembersStr = localStorage.getItem('oia_board_members');
    const allBoardMembers : BoardMember[] = allBoardMembersStr ? JSON.parse(allBoardMembersStr) : staticBoardMembers;
    
    let maturityScoreVal = 0, omanizationRateVal = 0, totalInvestmentVal = 0;
    let agreementsSignedVal = 0, developedAreaVal = 0, lastROIVal = 0;
    let risksArr: any[] = [];
    let allImprovementTasks: Task[] = [];
    let boardMembersArr: BoardMember[] = [];
    let icvData = { total: 0, local: 0, sme: 0 };
    let totalCompliantItems = 0;
    let totalComplianceQuestions = 0;

    // --- Sector Average Calculation (Always needed for Radar) ---
    let sectorScoresByAxis: { [key: number]: number[] } = {};
    AXES.forEach(a => sectorScoresByAxis[a.id] = []);
    allZones.forEach((comp: any) => {
         let compAssessmentStr = localStorage.getItem(`oia_assessment_${comp.id}_${selectedYear}`);
         if (!compAssessmentStr) {
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

    if (selectedCompanyId && selectedCompanyId !== 'all') {
        const zoneData = allZones.find((c: any) => c.id === selectedCompanyId);
        if (!zoneData) return;

        let assessmentStr = localStorage.getItem(`oia_assessment_${selectedCompanyId}_${selectedYear}`);
        if (!assessmentStr) {
            assessmentStr = localStorage.getItem(`oia_assessment_${selectedCompanyId}`);
        }
        const assessmentData = assessmentStr ? JSON.parse(assessmentStr) : { scores: {} };

        let complianceStr = localStorage.getItem(`oia_compliance_${selectedCompanyId}_${selectedYear}`);
        if (!complianceStr) {
            complianceStr = localStorage.getItem(`oia_compliance_${selectedCompanyId}`);
        }
        const complianceData = complianceStr ? JSON.parse(complianceStr) : { compliance: {}, risks: [] };
        
        let improvementPlanStr = localStorage.getItem(`oia_improvement_plan_${selectedCompanyId}_${selectedYear}`);
        if (!improvementPlanStr) {
            improvementPlanStr = localStorage.getItem(`oia_improvement_plan_${selectedCompanyId}`);
        }
        allImprovementTasks = improvementPlanStr ? JSON.parse(improvementPlanStr) : [];
        
        const financialsData = zoneData;
        
        boardMembersArr = allBoardMembers.filter(m => m.zoneId === selectedCompanyId);
        risksArr = complianceData.risks || [];
        
        const complianceItems = Object.values(complianceData.compliance || {});
        totalCompliantItems = complianceItems.filter(v => v === true).length;
        totalComplianceQuestions = 10; 

        const scores = Object.values(assessmentData.scores || {}) as number[];
        maturityScoreVal = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / INDICATORS.length : 0;
        
        omanizationRateVal = (financialsData as any).totalEmployees > 0 ? Math.round(((financialsData as any).omaniEmployees / (financialsData as any).totalEmployees) * 100) : 0;
        
        totalInvestmentVal = financialsData.cumulativeInvestment || 0;
        agreementsSignedVal = financialsData.agreementsSigned || 0;
        developedAreaVal = financialsData.developedArea || 0;
        lastROIVal = financialsData.lastROI || 0;
        
        icvData = {
          total: (financialsData as any).totalSpending || 0,
          local: (financialsData as any).localSpending || 0,
          sme: (financialsData as any).smeSpending || 0
        };

        const newRadarData = AXES.map((axis, index) => {
            const axisIndicators = INDICATORS.filter(ind => ind.axisId === axis.id);
            if (axisIndicators.length === 0) {
                 return { subject: language === 'ar' ? axis.title_ar : axis.title_en, company: 0, sector: sectorAverageByAxis[index], fullMark: 150 };
            }
            const companyAxisScores = axisIndicators.map(ind => assessmentData.scores?.[ind.id] || 0);
            const companyAxisSum = companyAxisScores.reduce((a, b) => a + b, 0);
            const companyValue = (companyAxisSum / (axisIndicators.length * 5)) * 150;
            
            return { subject: language === 'ar' ? axis.title_ar : axis.title_en, company: companyValue, sector: sectorAverageByAxis[index], fullMark: 150 };
        });
        setRadarData(newRadarData as any);

    } else { 
        let totalMaturityAgg = 0, totalOmanizationAgg = 0, totalInvestmentAgg = 0, totalAgreementsAgg = 0, totalDevelopedAreaAgg = 0, totalROIAgg = 0;
        let allRisksAgg: any[] = [];
        let allZoneScores: any[] = [];
        let totalSpendingAgg = 0, localSpendingAgg = 0, smeSpendingAgg = 0;
        
        allZones.forEach((comp: any) => {
            let assessmentStr = localStorage.getItem(`oia_assessment_${comp.id}_${selectedYear}`);
            if (!assessmentStr) {
                assessmentStr = localStorage.getItem(`oia_assessment_${comp.id}`);
            }
            if (assessmentStr) {
                const assessmentData = JSON.parse(assessmentStr);
                const scores = Object.values(assessmentData.scores || {}) as number[];
                if(scores.length > 0) {
                  const totalScore = scores.reduce((sum, score) => sum + score, 0);
                  const companyMaturity = totalScore / INDICATORS.length;
                  totalMaturityAgg += companyMaturity;
                  allZoneScores.push({ name_ar: comp.name_ar, name_en: comp.name_en, score: companyMaturity });
                }
            }
            let complianceStr = localStorage.getItem(`oia_compliance_${comp.id}_${selectedYear}`);
            if (!complianceStr) {
                complianceStr = localStorage.getItem(`oia_compliance_${comp.id}`);
            }
            if (complianceStr) {
                const complianceData = JSON.parse(complianceStr);
                const complianceItems = Object.values(complianceData.compliance || {});
                totalCompliantItems += complianceItems.filter(v => v === true).length;
                totalComplianceQuestions += 10;
                allRisksAgg.push(...(complianceData.risks || []));
            } else {
                 totalComplianceQuestions += 10;
            }
            let improvementPlanStr = localStorage.getItem(`oia_improvement_plan_${comp.id}_${selectedYear}`);
             if (!improvementPlanStr) {
                improvementPlanStr = localStorage.getItem(`oia_improvement_plan_${comp.id}`);
            }
            if (improvementPlanStr) {
                allImprovementTasks.push(...(JSON.parse(improvementPlanStr)));
            }
            
            const financialsData = comp;

            totalInvestmentAgg += financialsData.cumulativeInvestment || 0;
            agreementsSignedVal += financialsData.agreementsSigned || 0;
            developedAreaVal += financialsData.developedArea || 0;
            totalROIAgg += financialsData.lastROI || 0;

            totalOmanizationAgg += comp.totalEmployees > 0 ? Math.round((comp.omaniEmployees / comp.totalEmployees) * 100) : 0;
            totalSpendingAgg += comp.totalSpending || 0;
            localSpendingAgg += comp.localSpending || 0;
            smeSpendingAgg += comp.smeSpending || 0;
        });

        const numZones = allZones.length || 1;
        const numScoredZones = allZoneScores.length || 1;
        
        maturityScoreVal = totalMaturityAgg / numScoredZones;
        omanizationRateVal = Math.round(totalOmanizationAgg / numZones);
        totalInvestmentVal = totalInvestmentAgg;
        agreementsSignedVal = agreementsSignedVal;
        developedAreaVal = developedAreaVal;
        lastROIVal = totalROIAgg / numZones;
        risksArr = allRisksAgg;
        boardMembersArr = allBoardMembers;
        
        setTopPerformers(allZoneScores.sort((a,b) => b.score - a.score).slice(0, 5));
        
        const allZonesRadarData = AXES.map((axis, index) => ({
            subject: language === 'ar' ? axis.title_ar : axis.title_en,
            company: sectorAverageByAxis[index],
            sector: sectorAverageByAxis[index],
            fullMark: 150
        }));
        setRadarData(allZonesRadarData as any);
        
        icvData = { total: totalSpendingAgg, local: localSpendingAgg, sme: smeSpendingAgg };
    }

    setMaturityScore(maturityScoreVal);
    setOmanizationRate(omanizationRateVal);
    setTotalInvestment(totalInvestmentVal);
    setAgreementsSigned(agreementsSignedVal);
    setDevelopedArea(developedAreaVal);
    setLastROI(lastROIVal);
    setRisks(risksArr);

    const todo = allImprovementTasks.filter(t => t.status === 'todo').length;
    const inProgress = allImprovementTasks.filter(t => t.status === 'in-progress').length;
    const completed = allImprovementTasks.filter(t => t.status === 'done').length;
    setImprovementPlanData([
        { name: t('reports.improvement.completed'), value: completed, color: '#00E096' },
        { name: t('reports.improvement.inProgress'), value: inProgress, color: '#FFD700' },
        { name: t('reports.improvement.notStarted'), value: todo, color: '#6b7280' },
    ] as any);

    const independentCount = boardMembersArr.filter((m: any) => m.type === 'Independent').length;
    const nonIndependentCount = boardMembersArr.length - independentCount;
    if (boardMembersArr.length > 0) {
        setBoardIndependenceData([
            { name: t('dashboard.boardComposition.independent'), value: independentCount, color: '#D4AF37' },
            { name: t('dashboard.boardComposition.nonIndependent'), value: nonIndependentCount, color: '#3b82f6' },
        ]);
    } else {
        setBoardIndependenceData([]);
    }
    
    setIcvBarData([
        { name: t('dashboard.icv.totalTenders'), value: icvData.total },
        { name: t('dashboard.icv.localSpending'), value: icvData.local },
        { name: t('dashboard.icv.smeSpending'), value: icvData.sme },
    ] as any);
    
    if (totalComplianceQuestions > 0) {
        setCompliancePieData([
          { name: t('dashboard.compliant'), value: totalCompliantItems },
          { name: t('dashboard.nonCompliant'), value: totalComplianceQuestions - totalCompliantItems },
        ]);
    } else {
        setCompliancePieData([]);
    }


    const path = Array.from({ length: 7 }, (_, i) => {
        const year = 2024 + i;
        const baseScore = maturityScoreVal || 3.0;
        const companyScore = year >= selectedYear 
            ? baseScore + (year - selectedYear) * 0.2 + (Math.random() - 0.5) * 0.1
            : baseScore - (selectedYear - year) * 0.15 + (Math.random() - 0.5) * 0.1;
        const sectorAvg = baseScore * 0.9 + (year - selectedYear) * 0.15 + (Math.random() - 0.5) * 0.15;
        const target = 3.5 + i * 0.25;

        return {
            year: year.toString(),
            companyScore: Math.max(1, Math.min(5, parseFloat(companyScore.toFixed(1)))),
            sectorAverage: Math.max(1, Math.min(5, parseFloat(sectorAvg.toFixed(1)))),
            target: Math.min(5, parseFloat(target.toFixed(1))),
        };
    });
    setMaturityPathData(path as any);

  }, [selectedCompanyId, language, selectedYear, t, dataVersion]);


  const sparklineData = useMemo(() => 
    Array.from({ length: 10 }, () => ({
      uv: totalInvestment * (Math.random() * 0.4 + 0.8)
    })), 
  [totalInvestment]);
  
  const agreementsChartData = useMemo(() => {
    const base = agreementsSigned > 0 ? agreementsSigned : 100;
    return Array.from({ length: 4 }, (_, i) => ({
      name: `Q${i + 1}`,
      v: base * (Math.random() * (0.4 - i * 0.05) + (0.6 - i * 0.1))
    }));
  }, [agreementsSigned]);

  const dashboardTitle = useMemo(() => {
    if (selectedZone) {
      return language === 'ar' ? selectedZone.name_ar : selectedZone.name_en;
    }
    return t('menu.dashboard');
  }, [selectedZone, language, t]);
  
    const handleExport = async () => {
        if (!dashboardRef.current) return;
        setIsExporting(true);

        try {
            const canvas = await html2canvas(dashboardRef.current, {
                scale: 2, 
                useCORS: true, 
                backgroundColor: '#001220',
                logging: false,
                onclone: (documentClone) => {
                    const allElements = documentClone.querySelectorAll('*');
                    allElements.forEach((el: any) => {
                        el.style.fontFamily = 'Arial, sans-serif'; 
                        el.style.letterSpacing = '0px';
                    });
                    const svgTexts = documentClone.querySelectorAll('text');
                    svgTexts.forEach((el: any) => {
                        el.style.fontFamily = 'Arial, sans-serif';
                        el.style.direction = 'rtl';
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
            
            const filename = `OPAZ-Executive-Dashboard-${selectedZone ? (language === 'ar' ? selectedZone.name_ar : selectedZone.name_en) : 'Overall'}-${selectedYear}.pdf`;
            pdf.save(filename);
            
        } catch (error) {
            console.error("Export failed:", error);
            alert("حدث خطأ أثناء تصدير التقرير، يرجى المحاولة مرة أخرى.");
        } finally {
            setIsExporting(false);
        }
    };

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
    
    const developedAreaPercentage = developedArea > 0 ? Math.min(100, developedArea) : 0;


  return (
    <div className="p-4 md:p-6 lg:p-8 text-white space-y-8" ref={dashboardRef}>
       {/* For Print Header */}
        <div className="hidden print:block text-center mb-8">
            <h1 className="text-3xl font-bold text-black print-text-black">{t('appTitle')}</h1>
            <h2 className="text-xl font-semibold text-gray-700 print-text-black">{dashboardTitle}</h2>
            <p className="text-gray-500 mt-2 print-text-black">
                {format(new Date(), "d MMMM yyyy")}
            </p>
        </div>

       <header className="flex items-center justify-between print:hidden">
          <h1 className="text-3xl font-bold">{dashboardTitle}</h1>
           <Button onClick={handleExport} className="bg-gold-500 text-royal-900 hover:bg-gold-400" disabled={isExporting}>
                {isExporting ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <FileDown className="ml-2 h-5 w-5" />}
                {isExporting ? t('common.loading') : t('reports.export')}
            </Button>
      </header>

      {/* Row 1 & 2 : KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
              <Card className={cn(cardBaseClasses, "border-gold-500/30 hover:border-gold-500/70")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gold-200/80 print-text-black">{t('dashboard.maturityGauge')}</CardTitle>
                      <TrendingUp className="h-4 w-4 text-gold-300/70" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-4xl font-bold text-gold-400 print-text-black">{maturityScore.toFixed(1)} / 5</div>
                      <p className="text-xs text-gold-200/60 print-text-black mt-1">{t('dashboard.overallScore')}</p>
                  </CardContent>
              </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
              <Card className={cn(cardBaseClasses, "border-green-500/30 hover:border-green-500/70 relative overflow-hidden")}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
                      <CardTitle className="text-sm font-medium text-green-200/80 print-text-black">{t('dashboard.portfolioHealth')}</CardTitle>
                      <Wallet className="h-4 w-4 text-green-300/70" />
                  </CardHeader>
                  <CardContent className="z-10">
                      <div className="text-4xl font-bold text-green-400 print-text-black">{currencyFormatter(totalInvestment)}</div>
                      <p className="text-xs text-green-200/60 print-text-black mt-1">{t('dashboard.totalAssets')}</p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 print:hidden">
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
                      <CardTitle className="text-sm font-medium text-blue-200/80 print-text-black">{t('dashboard.omanization')}</CardTitle>
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
                                    <RadialBar background={{ fill: 'rgba(255,255,255,0.1)'}} dataKey='value' cornerRadius={4} className="fill-blue-500 print:fill-blue-500" />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-blue-300 print-text-black">{omanizationRate}%</span>
                            </div>
                        </div>
                  </CardContent>
              </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
              <Card className={cn(cardBaseClasses, "border-red-500/30 hover:border-red-500/70")}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-red-200/80 print-text-black">{t('dashboard.riskMap')}</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-red-300/70" />
                  </CardHeader>
                  <CardContent>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 print:hidden"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <div className="text-4xl font-bold text-red-400 print-text-black">{risks.length}</div>
                      </div>
                      <p className="text-xs text-red-200/60 print-text-black mt-1">{t('dashboard.activeRisks')}</p>
                  </CardContent>
              </Card>
          </motion.div>
          
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
            <Card className={cn(cardBaseClasses, "border-purple-500/30 hover:border-purple-500/70")}>
                <CardContent className="flex flex-col justify-end h-full p-4 text-center">
                    <div className="flex-grow h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                data={[{ value: developedAreaPercentage }]}
                                startAngle={90}
                                endAngle={-270}
                                barSize={12}
                            >
                                <defs>
                                    <linearGradient id="fcfGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#a855f7" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                                <RadialBar
                                    background={{ fill: 'rgba(139, 92, 246, 0.15)' }}
                                    dataKey="value"
                                    cornerRadius={6}
                                    fill="url(#fcfGradient)"
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2">
                        <p className="text-sm font-medium text-purple-200/80 print-text-black">{t('dashboard.financial.equity')}</p>
                        <p className="text-2xl font-bold text-purple-400 print-text-black">{developedArea.toFixed(0)} km²</p>
                    </div>
                </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5}>
            <Card className={cn(cardBaseClasses, "border-sky-500/30 hover:border-sky-500/70")}>
                <CardContent className="flex flex-col justify-end h-full p-4 text-center">
                    <div className="flex-grow h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                data={[{ value: developedAreaPercentage }]}
                                startAngle={90}
                                endAngle={-270}
                                barSize={12}
                            >
                                <defs>
                                     <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#38bdf8" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                                <RadialBar
                                    background={{ fill: 'rgba(59, 130, 246, 0.15)' }}
                                    dataKey="value"
                                    cornerRadius={6}
                                    fill="url(#equityGradient)"
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2">
                        <p className="text-sm font-medium text-sky-200/80 print-text-black">{t('dashboard.financial.freeCashFlow')}</p>
                        <p className="text-2xl font-bold text-sky-400 print-text-black">{developedArea.toFixed(0)} km²</p>
                    </div>
                </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
            <Card className={cn(cardBaseClasses, "border-teal-500/30 hover:border-teal-500/70")}>
                <CardContent className="flex flex-col justify-end h-full p-4 text-center">
                    <div className="flex-grow h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={agreementsChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                 <defs>
                                     <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2dd4bf" />
                                        <stop offset="100%" stopColor="#14b8a6" />
                                    </linearGradient>
                                </defs>
                                <Bar dataKey="v" fill="url(#profitGradient)" radius={[4, 4, 0, 0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2">
                        <p className="text-sm font-medium text-teal-200/80 print-text-black">{t('dashboard.financial.netProfit')}</p>
                        <p className="text-2xl font-bold text-teal-400 print-text-black">{Math.round(agreementsSigned)}</p>
                    </div>
                </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7}>
            <Card className={cn(cardBaseClasses, "border-amber-500/30 hover:border-amber-500/70")}>
                <CardContent className="flex flex-col justify-between h-full p-4 text-center">
                     <div className="flex-grow h-24">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="80%"
                                outerRadius="120%"
                                data={[{ value: lastROI > 100 ? 100 : lastROI }]}
                                startAngle={180}
                                endAngle={0}
                                barSize={20}
                                cy="90%"
                            >
                                <defs>
                                    <radialGradient id="roiGradient" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#FDE047" />
                                        <stop offset="100%" stopColor="#D4AF37" />
                                    </radialGradient>
                                </defs>
                                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                                <RadialBar
                                    background={{ fill: 'rgba(212, 175, 55, 0.15)' }}
                                    dataKey="value"
                                    cornerRadius={10}
                                    fill="url(#roiGradient)"
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2">
                         <p className="text-sm font-medium text-amber-200/80 print-text-black">{t('dashboard.financial.roi')}</p>
                         <p className="text-2xl font-bold text-amber-400 print-text-black">{omanizationRate.toFixed(1)}%</p>
                    </div>
                </CardContent>
            </Card>
          </motion.div>
      </div>

      
      {/* Row 3: Highlights & Action -> NOW RADAR */}
       <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={9} className="lg:col-span-3">
        <Card className={"glass h-full"}>
          <CardHeader>
            <CardTitle className="text-gold-400 print-text-black">{t('dashboard.strategicRadar')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <defs>
                  <radialGradient id="radarFillGold">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.1}/>
                  </radialGradient>
                </defs>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={<RadarCustomTick />} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Tooltip {...tooltipStyle} formatter={(value: number) => Math.round(value)} />
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingRight: '20px', color: '#FFFFFF', lineHeight: '2.5rem' }} iconType="circle" />
                <Radar name={t('reports.companyScore')} dataKey="company" stroke="#fbbf24" strokeWidth={3} fill="url(#radarFillGold)" fillOpacity={0.6} dot={{ r: 5, fill: '#fbbf24', stroke: '#001220', strokeWidth: 2 }} />
                <Radar name={t('reports.sectorAverage')} dataKey="sector" stroke="#8b5cf6" strokeDasharray="8 8" strokeWidth={3} fill="transparent" dot={{ r: 5, fill: '#8b5cf6', stroke: '#001220', strokeWidth: 2 }}/>
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

       {/* Row 4: Board & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5}>
                <Card className={"glass h-full"}>
                    <CardHeader>
                        <CardTitle className="text-gold-400 print-text-black">{t('dashboard.boardComposition.title')}</CardTitle>
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
                                <Legend iconType="circle" wrapperStyle={{ color: '#FFFFFF' }} className="print-text-black"/>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>
             <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
              <TopPerformers data={topPerformers} />
            </motion.div>
      </div>
      

      {/* Row 5: Operations & Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={9}>
                <Card className={"glass h-full"}>
                    <CardHeader>
                        <CardTitle className="text-gold-400 print-text-black">{t('dashboard.icv.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-6">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={icvBarData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="name" tick={{ fill: '#A0A0A0', fontSize: 12 }} className="print-text-black"/>
                                <YAxis tickFormatter={(value) => `${value / 1_000_000}M`} tick={{ fill: '#A0A0A0' }} className="print-text-black"/>
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
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={8}>
              <Card className={"glass h-full"}>
                  <CardHeader>
                      <CardTitle className="text-gold-400 print-text-black">{t('dashboard.improvementStatus.title')}</CardTitle>
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
                              <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{fontSize: '14px', color: 'white', paddingTop: '20px'}} className="print-text-black"/>
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

      {/* Row 6: Risk and Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={10}>
                <Card className={"glass h-full"}>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold-400 print-text-black">
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
                    <CardTitle className="flex items-center gap-2 text-gold-400 print-text-black">
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
                                <Legend iconType="circle" wrapperStyle={{fontSize: '14px', color: 'white'}} className="print-text-black"/>
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
                  <CardTitle className="text-gold-400 flex items-center gap-2 print-text-black">
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
                          <XAxis dataKey="year" tick={{ fill: '#A0A0A0' }} className="print-text-black"/>
                          <YAxis domain={[1, 5]} tick={{ fill: '#A0A0A0' }} className="print-text-black"/>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ color: '#FFFFFF', lineHeight: '2.5rem' }} iconType="circle" className="print-text-black"/>
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

    