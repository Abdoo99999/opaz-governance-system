"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
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
import { TrendingUp, AlertTriangle, CheckCircle, Wallet, FileDown, Loader2, Users, Building2, Anchor, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { INDICATORS, AXES } from '@/data/indicators';
import RiskLandscape from './dashboard/RiskLandscape';
import { cn } from '@/lib/utils';
import { useYear } from '@/context/YearContext';
import TopPerformers from './dashboard/TopPerformers';
import { RadarCustomTick } from './Reports';
import { ZONES, type Zone } from '@/data/companies';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

const cardBaseClasses = "glass h-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl print:shadow-none print:border-gray-200 print:bg-white";

const Dashboard = () => {
  const { t, language, dir } = useLanguage();
  const { selectedZoneId, getSelectedZone, dataVersion } = useCompany();
  const { selectedYear, availableYears } = useYear();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [maturityScore, setMaturityScore] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalExports, setTotalExports] = useState(0);
  const [activeRisksCount, setActiveRisksCount] = useState(0);
  const [omanizationRate, setOmanizationRate] = useState(0);
  const [directJobs, setDirectJobs] = useState(0);
  const [developedArea, setDevelopedArea] = useState(0);
  const [totalArea, setTotalArea] = useState(2000); 
  const [economicReturn, setEconomicReturn] = useState(0);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [leadershipData, setLeadershipData] = useState<any[]>([]);
  const [topZones, setTopZones] = useState<any[]>([]);
  const [improvementPlanData, setImprovementPlanData] = useState([]);
  const [complianceRate, setComplianceRate] = useState(0);
  const [compliancePieData, setCompliancePieData] = useState<any[]>([]);
  const [risksList, setRisksList] = useState<any[]>([]);
  const [maturityPathData, setMaturityPathData] = useState([]);
  const [icvBarData, setIcvBarData] = useState([]);

  const selectedZone = getSelectedZone();

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return (value / 1000000000).toFixed(1) + (language === 'ar' ? ' مليار' : 'B');
    if (value >= 1000000) return (value / 1000000).toFixed(1) + (language === 'ar' ? ' مليون' : 'M');
    if (value >= 1000) return (value / 1000).toFixed(1) + (language === 'ar' ? ' ألف' : 'K');
    return value.toString();
  };

  useEffect(() => {
    const getZoneData = (id: string) => {
        const assessmentStr = localStorage.getItem(`oia_assessment_${id}_${selectedYear}`) || localStorage.getItem(`oia_assessment_${id}`);
        const financialStr = localStorage.getItem(`oia_financials_${id}_${selectedYear}`);
        const complianceStr = localStorage.getItem(`opaz_compliance_${id}_${selectedYear}`) || localStorage.getItem(`opaz_compliance_${id}`);
        const planStr = localStorage.getItem(`oia_improvement_plan_${id}_${selectedYear}`);
        return {
            assessment: assessmentStr ? JSON.parse(assessmentStr) : null,
            financial: financialStr ? JSON.parse(financialStr) : null,
            compliance: complianceStr ? JSON.parse(complianceStr) : null,
            plan: planStr ? JSON.parse(planStr) : null
        };
    };

    let accMaturity = 0, countMaturity = 0;
    let accInvestment = 0, accExports = 0, accRisks = 0;
    let accOmanization = 0, countOmanization = 0;
    let accJobs = 0, accDevArea = 0, accTotalArea = 0;
    let accEcoReturn = 0, countEcoReturn = 0;
    let accCompliance = 0, countCompliance = 0;
    let allRisksDetail: any[] = [];
    let accTasks = { todo: 0, inProgress: 0, done: 0 };
    const radarAcc = AXES.map(axis => ({ id: axis.id, score: 0, count: 0 }));
    const zoneScores: any[] = [];
    
    const allZonesStr = localStorage.getItem('opaz_zones_registry');
    const allZonesData: Zone[] = allZonesStr ? JSON.parse(allZonesStr) : ZONES;
    
    const targetZones = (selectedZoneId && selectedZoneId !== 'all') 
        ? [allZonesData.find(z => z.id === selectedZoneId)].filter(Boolean) 
        : allZonesData;

    targetZones.forEach((zone: any) => {
        const data = getZoneData(zone.id);

        if (data.assessment) {
            const scores = Object.values(data.assessment.scores || {}) as number[];
            const zoneAvg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
            accMaturity += zoneAvg;
            countMaturity++;
            zoneScores.push({ name_ar: zone.name_ar, name_en: zone.name_en, score: zoneAvg });

            Object.keys(data.assessment.scores).forEach(key => {
                const indId = parseInt(key);
                const score = data.assessment.scores[key];
                const indicator = INDICATORS.find(i => i.id === indId);
                if (indicator) {
                    const ax = radarAcc.find(a => a.id === indicator.axisId);
                    if (ax) { ax.score += score; ax.count++; }
                }
            });
        }

        const financials = data.financial || zone;
        accInvestment += Number(financials.cumulativeInvestment) || 450000000;
        accExports += Number(financials.exportsValue) || 1200000000;
        accJobs += Number(financials.directJobs) || 8000;
        accDevArea += Number(financials.developedArea) || 350;
        accTotalArea += Number(financials.totalArea) || 2000;
        accEcoReturn += Number(financials.economicReturn) || 12.5;
        countEcoReturn++;

        const omanRate = (zone.omaniEmployees && zone.totalEmployees) ? (zone.omaniEmployees / zone.totalEmployees) * 100 : 45;
        accOmanization += omanRate;
        countOmanization++;

        if (data.compliance) {
            const compList = Object.values(data.compliance.compliance || {});
            const compCount = compList.filter(v => v === true).length;
            const compRate = compList.length > 0 ? (compCount / compList.length) * 100 : 0;
            accCompliance += compRate;
            countCompliance++;

            const zoneRisks = data.compliance.risks || [];
            allRisksDetail.push(...zoneRisks);
            const criticalHigh = zoneRisks.filter((r: any) => (r.impact * r.probability) >= 15).length;
            accRisks += criticalHigh;
        }

        if (data.plan) {
            accTasks.todo += data.plan.filter((t: any) => t.status === 'todo').length;
            accTasks.inProgress += data.plan.filter((t: any) => t.status === 'in-progress').length;
            accTasks.done += data.plan.filter((t: any) => t.status === 'done').length;
        }
    });

    setMaturityScore(countMaturity > 0 ? accMaturity / countMaturity : 0);
    setTotalInvestment(accInvestment);
    setTotalExports(accExports);
    setActiveRisksCount(accRisks);
    setRisksList(allRisksDetail);

    setOmanizationRate(countOmanization > 0 ? Math.round(accOmanization / countOmanization) : 0);
    setDirectJobs(accJobs);
    setDevelopedArea(accDevArea);
    setTotalArea(accTotalArea);
    setEconomicReturn(countEcoReturn > 0 ? parseFloat((accEcoReturn / countEcoReturn).toFixed(1)) : 0);

    const processedRadar = AXES.map(axis => {
        const axData = radarAcc.find(a => a.id === axis.id);
        const avg = axData && axData.count > 0 ? (axData.score / axData.count) : 0;
        const title = language === 'ar' ? axis.title_ar : axis.title_en;
        return {
            subject: title,
            company: parseFloat(avg.toFixed(1)),
            sector: 3.5, 
            fullMark: 5
        };
    }); 
    setRadarData(processedRadar);

    setTopZones(zoneScores.sort((a,b) => b.score - a.score).slice(0, 3));

    setImprovementPlanData([
        { name: t('reports.improvement.completed'), value: accTasks.done, color: '#00E096' },
        { name: t('reports.improvement.inProgress'), value: accTasks.inProgress, color: '#FFD700' },
        { name: t('reports.improvement.notStarted'), value: accTasks.todo, color: '#6b7280' },
    ] as any);

    const avgComp = countCompliance > 0 ? Math.round(accCompliance / countCompliance) : 0;
    setComplianceRate(avgComp);
    setCompliancePieData([{ name: t('dashboard.compliant'), value: avgComp, color: '#00E096' }, { name: t('dashboard.nonCompliant'), value: 100 - avgComp, color: '#ef4444' }]);

    const execOman = Math.round(accOmanization > 0 ? (accOmanization / countOmanization) + 10 : 60);
    setLeadershipData([{ name: t('dashboard.nationalLeaders'), value: execOman, color: '#D4AF37' }, { name: t('dashboard.expatExpertise'), value: 100 - execOman, color: '#3b82f6' }]);

    const currentMaturity = countMaturity > 0 ? accMaturity / countMaturity : 3.8;
    const maturityData = availableYears.map(year => {
        const isCurrentYear = year === selectedYear;
        const baseCompanyScore = 3.5 + (year - 2024) * 0.15;
        const baseSectorScore = 3.7 + (year - 2024) * 0.1;

        return {
            year: year.toString(),
            companyScore: isCurrentYear ? currentMaturity : Math.min(5, baseCompanyScore + (Math.random() - 0.5) * 0.1),
            sectorAverage: Math.min(5, baseSectorScore + (Math.random() - 0.5) * 0.1)
        };
    });
    setMaturityPathData(maturityData as any);
    
    let totalSpend = 0, localSpend = 0, smeSpend = 0;
    targetZones.forEach(zone => {
        totalSpend += zone.totalSpending || (zone.cumulativeInvestment || 0) * 0.1;
        localSpend += zone.localSpending || totalSpend * 0.4;
        smeSpend += zone.smeSpending || totalSpend * 0.1;
    });
    setIcvBarData([
        { name: t('dashboard.icvTotalTenders'), value: totalSpend },
        { name: t('dashboard.icvLocalSpending'), value: localSpend },
        { name: t('dashboard.icvSmeSpending'), value: smeSpend },
    ] as any);

  }, [selectedZoneId, selectedYear, language, dataVersion, t, availableYears]);

  const sparklineData = useMemo(() => Array.from({ length: 10 }, () => ({ uv: totalInvestment * (Math.random() * 0.1 + 0.95) })), [totalInvestment]);
  const exportsTrend = useMemo(() => Array.from({ length: 5 }, (_,i) => ({ name: `Y${i}`, v: totalExports * (0.8 + i*0.05) })), [totalExports]);

  const handleExport = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);
    try {
        const canvas = await html2canvas(dashboardRef.current, { 
            scale: 2, 
            backgroundColor: '#001220',
            useCORS: true 
        });
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`OPAZ-Dashboard-${selectedYear}.pdf`);
    } finally {
        setIsExporting(false);
    }
  };

  const tooltipStyle = {
      contentStyle: { backgroundColor: 'rgba(20, 20, 30, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' },
      itemStyle: { color: '#fff' },
      labelStyle: { color: '#D4AF37' }
  };

  if (selectedZoneId === null) {
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
    <div className="p-4 md:p-6 lg:p-8 text-white space-y-8" ref={dashboardRef}>
       <header className="flex items-center justify-between print:hidden">
          <h1 className="text-3xl font-bold">
              {selectedZoneId === 'all' ? t('dashboard.central_dashboard') : `${t('dashboard.title')}: ${language==='ar'?selectedZone?.name_ar:selectedZone?.name_en}`}
          </h1>
           <Button onClick={handleExport} className="bg-gold-500 text-royal-900 hover:bg-gold-400" disabled={isExporting}>
               {isExporting ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <FileDown className="ml-2 h-5 w-5" />}
               {t('common.exportPdf')}
           </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
              <Card className={cn(cardBaseClasses, "border-gold-500/30 hover:border-gold-500/70")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gold-200/80">{t('dashboard.maturityGauge')}</CardTitle>
                      <TrendingUp className="h-4 w-4 text-gold-300/70" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-4xl font-bold text-gold-400">{maturityScore.toFixed(1)} <span className="text-lg text-gold-200">/ 5.0</span></div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2"><div className="bg-gold-500 h-full rounded-full" style={{ width: `${(maturityScore/5)*100}%` }}></div></div>
                  </CardContent>
              </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
              <Card className={cn(cardBaseClasses, "border-green-500/30 hover:border-green-500/70 relative overflow-hidden")}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
                      <CardTitle className="text-sm font-medium text-green-200/80">{t('dashboard.totalInvestment')}</CardTitle>
                      <Wallet className="h-4 w-4 text-green-300/70" />
                  </CardHeader>
                  <CardContent className="z-10">
                      <div className="text-3xl font-bold text-green-400" dir="ltr">{formatCurrency(totalInvestment)} <span className="text-sm text-green-200/60">OMR</span></div>
                      <p className="text-xs text-green-200/60 mt-1">{t('dashboard.investmentSubtitle')}</p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-20"><ResponsiveContainer width="100%" height="100%"><AreaChart data={sparklineData}><Area type="monotone" dataKey="uv" stroke="#00E096" strokeWidth={2} fill="#00E096" /></AreaChart></ResponsiveContainer></div>
              </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
             <Card className={cn(cardBaseClasses, "border-blue-900/50 hover:border-blue-700/70 bg-gradient-to-br from-blue-950/50 to-slate-900/50")}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-200/80">{t('dashboard.annualExports')}</CardTitle>
                       <Anchor className="h-4 w-4 text-blue-300/70" />
                  </CardHeader>
                  <CardContent>
                       <div className="text-3xl font-bold text-blue-300" dir="ltr">{formatCurrency(totalExports)} <span className="text-sm text-blue-200/60">OMR</span></div>
                       <div className="h-8 mt-2"><ResponsiveContainer width="100%" height="100%"><BarChart data={exportsTrend}><Bar dataKey="v" fill="#3b82f6" radius={[2,2,0,0]} /></BarChart></ResponsiveContainer></div>
                  </CardContent>
              </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
              <Card className={cn(cardBaseClasses, "border-red-500/30 hover:border-red-500/70")}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-red-200/80">{t('dashboard.criticalRisks')}</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-red-300/70" />
                  </CardHeader>
                  <CardContent>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">{activeRisksCount > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
                        <div className="text-4xl font-bold text-red-400">{activeRisksCount}</div>
                      </div>
                      <p className="text-xs text-red-200/60 mt-1">{t('dashboard.risksSubtitle')}</p>
                  </CardContent>
              </Card>
          </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
             <Card className={cn(cardBaseClasses, "border-blue-500/30 hover:border-blue-500/70")}>
                   <CardHeader><CardTitle className="text-sm font-medium text-blue-200/80">{t('dashboard.omanizationRate')}</CardTitle></CardHeader>
                   <CardContent className="flex flex-col items-center justify-center h-[120px]">
                       <div className="w-full h-full relative flex items-end justify-center pb-2">
                           <ResponsiveContainer width="100%" height="150%">
                               <RadialBarChart innerRadius="80%" outerRadius="100%" barSize={15} data={[{value: omanizationRate}]} startAngle={180} endAngle={0} cy="70%">
                                   <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                                   <RadialBar background={{ fill: 'rgba(212, 175, 55, 0.1)'}} dataKey='value' cornerRadius={10} fill="url(#goldGradient)" />
                                   <defs><linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#FDE047" /><stop offset="100%" stopColor="#D4AF37" /></linearGradient></defs>
                               </RadialBarChart>
                           </ResponsiveContainer>
                           <div className="absolute bottom-4 text-center">
                               <span className="text-3xl font-bold text-gold-400 drop-shadow-md">{omanizationRate}%</span>
                           </div>
                       </div>
                  </CardContent>
              </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5}>
            <Card className={cn(cardBaseClasses, "border-teal-500/30 hover:border-teal-500/70")}>
                <CardContent className="flex flex-col justify-between h-full p-4">
                    <div className="flex items-center justify-between"><p className="text-sm font-medium text-teal-200/80">{t('dashboard.directJobs')}</p><Users className="h-4 w-4 text-teal-400" /></div>
                    <div className="text-center my-2"><p className="text-3xl font-bold text-teal-400">{directJobs.toLocaleString()}</p><p className="text-[10px] text-teal-200/50">{t('dashboard.jobsSubtitle')}</p></div>
                    <div className="h-10 w-full bg-teal-900/20 rounded overflow-hidden flex items-end gap-1 px-1">{[40, 60, 50, 70, 90, 80].map((h, i) => (<div key={i} className="flex-1 bg-teal-500/50 hover:bg-teal-400 transition-all rounded-t-sm" style={{ height: `${h}%` }}></div>))}</div>
                </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
            <Card className={cn(cardBaseClasses, "border-purple-500/30 hover:border-purple-500/70")}>
                <CardContent className="flex flex-col justify-between h-full p-4 text-center">
                    <p className="text-sm font-medium text-purple-200/80 self-start">{t('dashboard.landUtilization')}</p>
                    <div className="flex-grow h-20 relative">
                        <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{value: developedArea}, {value: totalArea - developedArea}]} cx="50%" cy="50%" innerRadius={25} outerRadius={35} dataKey="value" startAngle={90} endAngle={-270} stroke="none"><Cell fill="#a855f7" /><Cell fill="#333" /></Pie></PieChart></ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col"><span className="text-lg font-bold text-purple-400">{developedArea}</span><span className="text-[9px] text-gray-400">km²</span></div>
                    </div>
                    <p className="text-[10px] text-purple-300/50">{t('dashboard.landSubtitle', {totalArea: totalArea})}</p>
                </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7}>
            <Card className={cn(cardBaseClasses, "border-amber-500/30 hover:border-amber-500/70")}>
                <CardContent className="flex flex-col justify-center h-full p-4 text-center space-y-2">
                     <div className="flex justify-between items-center"><p className="text-sm font-medium text-amber-200/80">{t('dashboard.economicReturn')}</p><Building2 className="h-4 w-4 text-amber-400"/></div>
                     <div className="py-2"><p className="text-3xl font-bold text-amber-400">{economicReturn}</p><p className="text-xs text-amber-200/60">{t('dashboard.returnUnit')}</p></div>
                     <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${Math.min((economicReturn/20)*100, 100)}%` }}></div></div>
                </CardContent>
            </Card>
          </motion.div>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={8} className="lg:col-span-2">
            <Card className={cn(cardBaseClasses, "border-gold-500/30 hover:border-gold-500/70")}>
                <CardHeader><CardTitle className="text-gold-400">{t('dashboard.strategicRadar')}</CardTitle></CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.2)" />
                        <PolarAngleAxis dataKey="subject" tick={<RadarCustomTick />} />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                        <Tooltip {...tooltipStyle} />
                        <Legend wrapperStyle={{ color: '#fff', paddingTop: '10px' }}/>
                        <Radar name={t('reports.companyScore')} dataKey="company" stroke="#D4AF37" strokeWidth={3} fill="#D4AF37" fillOpacity={0.4} />
                        <Radar name={t('reports.sectorAverage')} dataKey="sector" stroke="#8b5cf6" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                      </RadarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
        <div className="lg:col-span-1"><motion.div variants={cardVariants} initial="hidden" animate="visible" custom={9} className="h-full"><TopPerformers data={topZones} /></motion.div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={10}>
               <Card className={cn(cardBaseClasses, "border-emerald-500/30 hover:border-emerald-500/70")}>
                   <CardHeader><CardTitle className="flex items-center gap-2 text-emerald-400"><CheckCircle size={18}/> {t('dashboard.complianceAndImprovement')}</CardTitle></CardHeader>
                   <CardContent className="grid grid-cols-2 gap-4">
                        <div className="h-[200px] flex flex-col items-center">
                            <p className="text-xs mb-2 text-gray-400">{t('dashboard.legislativeCompliance')}</p>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={compliancePieData} dataKey="value" innerRadius={40} outerRadius={60} paddingAngle={5}><Cell fill="#00E096" /><Cell fill="#ef4444" /></Pie>
                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-lg font-bold">{complianceRate}%</text>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="h-[200px] flex flex-col items-center">
                            <p className="text-xs mb-2 text-gray-400">{t('dashboard.improvementTasks')}</p>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={improvementPlanData} dataKey="value" innerRadius={0} outerRadius={60}>{improvementPlanData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie>
                                    <Tooltip {...tooltipStyle}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                   </CardContent>
               </Card>
           </motion.div>
           <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={11}>
             <Card className={cn(cardBaseClasses, "border-gold-500/30 hover:border-gold-500/70")}>
                <CardHeader><CardTitle className="text-sm text-blue-200">{t('dashboard.executiveOmanization')}</CardTitle></CardHeader>
                <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={leadershipData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2}>{leadershipData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie>
                            <Tooltip {...tooltipStyle} />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#fff' }}/>
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-xl font-bold">{leadershipData.find(d => d.name === t('dashboard.nationalLeaders'))?.value}%</text>
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>
           </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={12}>
             <Card className={cn(cardBaseClasses, "border-red-500/30 hover:border-red-500/70")}>
                 <CardHeader><CardTitle className="text-red-400 text-sm">{t('dashboard.riskDistributionMap')}</CardTitle></CardHeader>
                 <CardContent>
                     <RiskLandscape data={risksList} />
                 </CardContent>
             </Card>
          </motion.div>
          
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={13}>
              <Card className={cn(cardBaseClasses, "border-blue-500/30 hover:border-blue-500/70")}>
                  <CardHeader><CardTitle className="text-blue-400 text-sm">{t('dashboard.icvTitle')}</CardTitle></CardHeader>
                  <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={icvBarData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" tick={{ fill: '#A0A0A0', fontSize: 12 }} />
                            <YAxis tickFormatter={(value) => `${value / 1_000_000}M`} tick={{ fill: '#A0A0A0' }}/>
                            <Tooltip {...tooltipStyle} formatter={(value: number) => formatCurrency(value)} />
                            <Bar dataKey="value" name={t('dashboard.icvSpending')} barSize={30} radius={[4, 4, 0, 0]}>
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

      <div className="grid grid-cols-1 gap-8">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={14}>
              <Card className={cn(cardBaseClasses, "border-amber-500/30 hover:border-amber-500/70")}>
                  <CardHeader><CardTitle className="text-gold-400 text-sm">{t('dashboard.maturityPath')}</CardTitle></CardHeader>
                  <CardContent className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={maturityPathData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <defs><linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient></defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
                              <XAxis dataKey="year" tick={{fill: '#9ca3af'}} />
                              <YAxis domain={[0, 5]} tick={{fill: '#9ca3af'}} />
                              <Tooltip {...tooltipStyle} />
                              <Legend verticalAlign="top" align="right" wrapperStyle={{color: '#9ca3af', paddingBottom: '10px'}}/>
                              <Area type="monotone" dataKey="companyScore" name={t('reports.companyScore')} stroke="#fbbf24" fillOpacity={1} fill="url(#colorScore)" />
                              <Line type="monotone" dataKey="sectorAverage" name={t('reports.sectorAverage')} stroke="#818cf8" strokeDasharray="5 5" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>
          </motion.div>
      </div>

    </div>
  );
};

export default Dashboard;
