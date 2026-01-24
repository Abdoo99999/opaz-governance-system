
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart,
  PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, RadialBar, RadialBarChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, CheckCircle, Wallet, FileDown, Loader2, Users, Briefcase, LandPlot, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { INDICATORS, AXES } from '@/data/indicators';
import RiskLandscape from './dashboard/RiskLandscape';
import { cn } from '@/lib/utils';
import { useYear } from '@/context/YearContext';
import { ZONES, type Zone } from '@/data/companies';
import { RadarCustomTick } from './Reports';

// --- Visual Styles ---
const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};
const cardBaseClasses = "glass h-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl print:shadow-none print:border-gray-200 print:bg-white";

// --- Formatter ---
const formatCurrency = (value: number) => {
    if (value >= 1000000000) return (value / 1000000000).toFixed(1) + 'B';
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toString();
};

const Dashboard = () => {
  const { t, language } = useLanguage();
  const { getSelectedZone, dataVersion } = useCompany();
  const selectedCompanyId = getSelectedZone()?.id;
  const { selectedYear } = useYear();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // --- State Variables ---
  const [maturityScore, setMaturityScore] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [risks, setRisks] = useState<any[]>([]);
  const [omanizationRate, setOmanizationRate] = useState(0);
  const [directJobs, setDirectJobs] = useState(0);
  const [developedArea, setDevelopedArea] = useState(0);
  const [totalArea, setTotalArea] = useState(0);
  const [economicReturn, setEconomicReturn] = useState(0);
  const [radarData, setRadarData] = useState([]);

  const selectedZone = getSelectedZone();

  // --- LOAD DATA ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // --- AGGREGATION FOR "ALL ZONES" ---
    if (!selectedCompanyId || selectedCompanyId === 'all') {
      const allZonesStr = localStorage.getItem('opaz_zones_registry');
      const allZones: Zone[] = allZonesStr ? JSON.parse(allZonesStr) : ZONES;
      
      let totalMaturityAgg = 0, numScoredZones = 0, totalInvestmentAgg = 0;
      let totalOmanizationAgg = 0, totalDirectJobsAgg = 0, totalDevelopedAreaAgg = 0;
      let totalEcoReturnAgg = 0, totalAreaAgg = 0;
      let allRisksAgg: any[] = [];
      
      allZones.forEach(zone => {
        // Assessment
        const assessmentKey = `oia_assessment_${zone.id}_${selectedYear}`;
        const assessmentStr = localStorage.getItem(assessmentKey);
        if (assessmentStr) {
          const data = JSON.parse(assessmentStr);
          const scores = Object.values(data.scores || {}) as number[];
          if (scores.length > 0) {
            totalMaturityAgg += scores.reduce((a, b) => a + b, 0) / scores.length;
            numScoredZones++;
          }
        }
        
        // Risks
        const complianceKey = `opaz_compliance_${zone.id}_${selectedYear}`;
        const complianceStr = localStorage.getItem(complianceKey);
        if (complianceStr) {
          allRisksAgg.push(...(JSON.parse(complianceStr).risks || []));
        }

        // Zone Data
        totalInvestmentAgg += zone.cumulativeInvestment || 0;
        totalDirectJobsAgg += zone.directJobs || 0;
        totalDevelopedAreaAgg += zone.developedArea || 0;
        totalAreaAgg += zone.totalArea || 0;
        
        if (zone.totalEmployees && zone.totalEmployees > 0) {
            totalOmanizationAgg += (zone.omaniEmployees / zone.totalEmployees) * 100;
        }

        const financialKey = `oia_financials_${zone.id}_${selectedYear}`;
        const financialStr = localStorage.getItem(financialKey);
        if(financialStr) {
            totalEcoReturnAgg += JSON.parse(financialStr).economicReturn || 0;
        }
      });
      
      setMaturityScore(numScoredZones > 0 ? totalMaturityAgg / numScoredZones : 0);
      setTotalInvestment(totalInvestmentAgg);
      setOmanizationRate(allZones.length > 0 ? totalOmanizationAgg / allZones.length : 0);
      setDirectJobs(totalDirectJobsAgg);
      setDevelopedArea(totalDevelopedAreaAgg);
      setTotalArea(totalAreaAgg);
      setEconomicReturn(numScoredZones > 0 ? totalEcoReturnAgg / numScoredZones : 0);
      setRisks(allRisksAgg);

    } else { // --- SINGLE ZONE VIEW ---
        // 1. Get zone data
        const allZonesStr = localStorage.getItem('opaz_zones_registry');
        const allZones = allZonesStr ? JSON.parse(allZonesStr) : ZONES;
        const zoneData = allZones.find((z: any) => z.id === selectedCompanyId);

        if (!zoneData) return;

        // 2. Assessment Score
        const assessmentKey = `oia_assessment_${selectedCompanyId}_${selectedYear}`;
        const assessmentStr = localStorage.getItem(assessmentKey);
        const assessmentData = assessmentStr ? JSON.parse(assessmentStr) : { scores: {} };
        const scores = Object.values(assessmentData.scores || {}) as number[];
        const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        setMaturityScore(avgScore);

        // 3. Risks
        const complianceKey = `opaz_compliance_${selectedCompanyId}_${selectedYear}`;
        const complianceStr = localStorage.getItem(complianceKey);
        const complianceData = complianceStr ? JSON.parse(complianceStr) : { risks: [] };
        setRisks(complianceData.risks || []);

        // 4. Zone-specific KPIs
        setTotalInvestment(zoneData.cumulativeInvestment || 0);
        setDirectJobs(zoneData.directJobs || 0);
        setDevelopedArea(zoneData.developedArea || 0);
        setTotalArea(zoneData.totalArea || 0);

        const oRate = (zoneData.totalEmployees && zoneData.totalEmployees > 0)
            ? Math.round((zoneData.omaniEmployees / zoneData.totalEmployees) * 100)
            : 0;
        setOmanizationRate(oRate);

        const financialKey = `oia_financials_${selectedCompanyId}_${selectedYear}`;
        const financialStr = localStorage.getItem(financialKey);
        if (financialStr) {
            setEconomicReturn(JSON.parse(financialStr).economicReturn || 0);
        } else {
             setEconomicReturn(12.5); // fallback
        }
    }
    
    // RADAR - Always calculate sector average
    let sectorScoresByAxis: { [key: number]: number[] } = {};
    AXES.forEach(a => sectorScoresByAxis[a.id] = []);
    const allZonesForRadar: Zone[] = (localStorage.getItem('opaz_zones_registry') ? JSON.parse(localStorage.getItem('opaz_zones_registry')!) : ZONES);
    
    allZonesForRadar.forEach((zone: any) => {
        let compAssessmentStr = localStorage.getItem(`oia_assessment_${zone.id}_${selectedYear}`);
        if (compAssessmentStr) {
            const compAssessmentData = JSON.parse(compAssessmentStr);
            AXES.forEach(axis => {
               const axisIndicators = INDICATORS.filter(ind => ind.axisId === axis.id);
               if(axisIndicators.length === 0) return;
               const axisScores = axisIndicators.map(ind => compAssessmentData.scores?.[ind.id] || 0);
               const axisAvg = axisScores.reduce((a, b) => a + b, 0) / (axisIndicators.length * 5);
               sectorScoresByAxis[axis.id].push(axisAvg);
            });
        }
    });

    const sectorAverageByAxis = AXES.map(axis => {
        const avgs = sectorScoresByAxis[axis.id] || [];
        return avgs.length > 0 ? (avgs.reduce((a, b) => a + b, 0) / avgs.length) * 150 : 0;
    });

    const companyScores = (selectedCompanyId && selectedCompanyId !== 'all') 
        ? JSON.parse(localStorage.getItem(`oia_assessment_${selectedCompanyId}_${selectedYear}`) || '{ "scores": {} }').scores
        : null;

    const newRadarData = AXES.map((axis, index) => {
        let companyValue = 0;
        if(companyScores) {
            const axisIndicators = INDICATORS.filter(ind => ind.axisId === axis.id);
            if(axisIndicators.length > 0) {
                const companyAxisSum = axisIndicators.map(ind => companyScores?.[ind.id] || 0).reduce((a, b) => a + b, 0);
                companyValue = (companyAxisSum / (axisIndicators.length * 5)) * 150;
            }
        } else {
            // For 'all' view, company score is the sector average
            companyValue = sectorAverageByAxis[index];
        }
        return { 
            subject: language === 'ar' ? axis.title_ar : axis.title_en, 
            company: companyValue, 
            sector: sectorAverageByAxis[index], 
            fullMark: 150 
        };
    });
    setRadarData(newRadarData as any);


  }, [selectedCompanyId, selectedYear, language, dataVersion]);

  // --- Chart Memos ---
  const sparklineData = useMemo(() => Array.from({ length: 10 }, () => ({ uv: totalInvestment * (Math.random() * 0.2 + 0.8) })), [totalInvestment]);
  const jobsTrendData = useMemo(() => [
      { name: 'Q1', v: directJobs * 0.9 }, { name: 'Q2', v: directJobs * 0.95 },
      { name: 'Q3', v: directJobs * 0.98 }, { name: 'Q4', v: directJobs }
  ], [directJobs]);

  const dashboardTitle = useMemo(() => {
    if (selectedZone) return language === 'ar' ? selectedZone.name_ar : selectedZone.name_en;
    return t('menu.dashboard');
  }, [selectedZone, language, t]);

  if (!selectedCompanyId) {
    return <div className="flex items-center justify-center h-full p-8 text-white"><div className="text-center p-8 glass"><h3 className="text-2xl font-bold text-gold-400">{t('common.selectCompanyToStart')}</h3></div></div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 text-white space-y-8" ref={dashboardRef}>
       <header className="flex items-center justify-between print:hidden">
          <h1 className="text-3xl font-bold">{dashboardTitle}</h1>
           <Button onClick={() => {}} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
               <FileDown className="ml-2 h-5 w-5" /> {t('reports.export')}
           </Button>
      </header>

      {/* --- ROW 1: MAIN METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
              <Card className={cn(cardBaseClasses, "border-gold-500/30 hover:border-gold-500/70")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gold-200/80">{t('dashboard.maturityGauge')}</CardTitle>
                      <TrendingUp className="h-4 w-4 text-gold-300/70" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-4xl font-bold text-gold-400">{maturityScore.toFixed(1)} <span className="text-lg text-gold-200">/ 5.0</span></div>
                      <p className="text-xs text-gold-200/60 mt-1">{t('dashboard.overallScore')}</p>
                  </CardContent>
              </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
              <Card className={cn(cardBaseClasses, "border-green-500/30 hover:border-green-500/70 relative overflow-hidden")}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
                      <CardTitle className="text-sm font-medium text-green-200/80">{t('dashboard.portfolioHealth')}</CardTitle>
                      <Wallet className="h-4 w-4 text-green-300/70" />
                  </CardHeader>
                  <CardContent className="z-10">
                      <div className="text-3xl font-bold text-green-400">OMR {formatCurrency(totalInvestment)}</div>
                      <p className="text-xs text-green-200/60 mt-1">{t('dashboard.totalAssets')}</p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-20"><ResponsiveContainer width="100%" height="100%"><AreaChart data={sparklineData}><Area type="monotone" dataKey="uv" stroke="#00E096" strokeWidth={2} fill="#00E096" /></AreaChart></ResponsiveContainer></div>
              </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
             <Card className={cn(cardBaseClasses, "border-blue-500/30 hover:border-blue-500/70")}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-200/80">{t('dashboard.omanization')}</CardTitle>
                       <Users className="h-4 w-4 text-blue-300/70" />
                  </CardHeader>
                  <CardContent>
                       <div className="text-4xl font-bold text-blue-400">{omanizationRate.toFixed(0)}%</div>
                       <p className="text-xs text-blue-200/60 mt-1">{t('dashboard.nationalWorkforce')}</p>
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
                        <span className="relative flex h-3 w-3">{risks.length > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
                        <div className="text-4xl font-bold text-red-400">{risks.length}</div>
                      </div>
                      <p className="text-xs text-red-200/60 mt-1">{t('dashboard.activeRisks')}</p>
                  </CardContent>
              </Card>
          </motion.div>
      </div>

      {/* --- ROW 2: DETAILED INDICATORS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
             <Card className={cn(cardBaseClasses, "border-sky-500/30 hover:border-sky-500/70")}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-sky-200/80">{t('dashboard.financial.freeCashFlow')}</CardTitle>
                       <LandPlot className="h-4 w-4 text-sky-300/70" />
                  </CardHeader>
                   <CardContent className="h-[120px] flex items-center justify-center">
                       <div className="w-24 h-24 relative">
                           <ResponsiveContainer width="100%" height="100%">
                               <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={8} data={[{value: totalArea > 0 ? (developedArea / totalArea) * 100 : 0}]} startAngle={90} endAngle={-270}>
                                   <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                   <RadialBar background={{ fill: 'rgba(56, 189, 248, 0.1)'}} dataKey='value' cornerRadius={4} fill="#0ea5e9" />
                               </RadialBarChart>
                           </ResponsiveContainer>
                           <div className="absolute inset-0 flex items-center justify-center flex-col">
                               <span className="text-xl font-bold text-sky-300">{developedArea.toLocaleString()}</span>
                               <span className="text-[10px] text-sky-300/60">km²</span>
                           </div>
                       </div>
                  </CardContent>
              </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5}>
            <Card className={cn(cardBaseClasses, "border-teal-500/30 hover:border-teal-500/70")}>
                <CardContent className="flex flex-col justify-end h-full p-4 text-center">
                    <div className="flex-grow h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={jobsTrendData}>
                                <defs><linearGradient id="jobsGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2dd4bf" /><stop offset="100%" stopColor="#14b8a6" /></linearGradient></defs>
                                <Bar dataKey="v" fill="url(#jobsGradient)" radius={[4, 4, 0, 0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2">
                        <p className="text-sm font-medium text-teal-200/80">{t('dashboard.financial.netProfit')}</p>
                        <p className="text-2xl font-bold text-teal-400">{directJobs.toLocaleString()}</p>
                    </div>
                </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
            <Card className={cn(cardBaseClasses, "border-purple-500/30 hover:border-purple-500/70")}>
                <CardContent className="flex flex-col justify-center h-full p-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                        <Coins className="w-10 h-10 text-purple-400" />
                        <div>
                             <p className="text-sm font-medium text-purple-200/80">{t('dashboard.financial.equity')}</p>
                             <p className="text-2xl font-bold text-purple-400">{developedArea.toLocaleString()} <span className="text-sm">km²</span></p>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7}>
            <Card className={cn(cardBaseClasses, "border-amber-500/30 hover:border-amber-500/70")}>
                <CardContent className="flex flex-col justify-between h-full p-4 text-center">
                      <div className="flex-grow h-24">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart innerRadius="80%" outerRadius="120%" data={[{ value: economicReturn > 20 ? 100 : (economicReturn/20)*100 }]} startAngle={180} endAngle={0} barSize={15} cy="90%">
                                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                                <RadialBar background={{ fill: 'rgba(212, 175, 55, 0.15)' }} dataKey="value" cornerRadius={10} fill="#fbbf24" />
                            </RadialBarChart>
                          </ResponsiveContainer>
                      </div>
                    <div className="mt-2">
                         <p className="text-sm font-medium text-amber-200/80">{t('dashboard.financial.roi')}</p>
                         <p className="text-2xl font-bold text-amber-400">{economicReturn.toFixed(1)} <span className="text-sm">OMR/m²</span></p>
                    </div>
                </CardContent>
            </Card>
          </motion.div>
      </div>
      
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
                <Tooltip contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', border: '1px solid #D4AF37' }} formatter={(value: number) => Math.round(value)} />
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingRight: '20px', color: '#FFFFFF', lineHeight: '2.5rem' }} iconType="circle" />
                <Radar name={t('reports.companyScore')} dataKey="company" stroke="#fbbf24" strokeWidth={3} fill="url(#radarFillGold)" fillOpacity={0.6} dot={{ r: 5, fill: '#fbbf24', stroke: '#001220', strokeWidth: 2 }} />
                <Radar name={t('reports.sectorAverage')} dataKey="sector" stroke="#8b5cf6" strokeDasharray="8 8" strokeWidth={3} fill="transparent" dot={{ r: 5, fill: '#8b5cf6', stroke: '#001220', strokeWidth: 2 }}/>
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
};

export default Dashboard;

    