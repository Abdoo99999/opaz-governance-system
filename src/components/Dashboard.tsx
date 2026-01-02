
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
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
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, CheckCircle, Users, Target } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { INDICATORS, AXES } from '@/lib/data/indicators';

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

const cardBaseClasses = "glass h-full";

const initialDashboardData = {
  maturityScore: 0,
  totalAssets: 14.2, 
  omanizationRate: 0,
  compliantItems: 0,
  totalComplianceItems: 4,
  risks: [],
};

const radarDataTemplate = AXES.map(axis => ({ 
    subject: axis.title_en,
    subject_ar: axis.title_ar,
    A: 0, 
    fullMark: 150 
}));

const maturityPathData = [
  { year: '2025', score: 3.2 },
  { year: '2026', score: 3.5 },
  { year: '2027', score: 3.9 },
  { year: '2028', score: 4.2 },
  { year: '2029', score: 4.6 },
  { year: '2030', score: 5.0 },
];


const Dashboard = () => {
  const { t, language } = useLanguage();
  const { getSelectedCompany, selectedCompanyId } = useCompany();
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [radarData, setRadarData] = useState(radarDataTemplate);

  const selectedCompany = getSelectedCompany();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (selectedCompanyId && selectedCompanyId !== 'all') {
        const companiesStr = localStorage.getItem('oia_companies_registry');
        const companies = companiesStr ? JSON.parse(companiesStr) : [];
        const companyData = companies.find((c: any) => c.id === selectedCompanyId);
        
        const assessmentStr = localStorage.getItem(`oia_assessment_${selectedCompanyId}`);
        const assessmentData = assessmentStr ? JSON.parse(assessmentStr) : { scores: {} };

        const complianceStr = localStorage.getItem(`oia_compliance_${selectedCompanyId}`);
        const complianceData = complianceStr ? JSON.parse(complianceStr) : { compliance: {}, risks: [] };

        const scores = Object.values(assessmentData.scores || {}) as number[];
        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        const maturityScore = scores.length > 0 ? totalScore / INDICATORS.length : 0;
         
        const newRadarData = AXES.map(axis => {
            const axisIndicators = INDICATORS.filter(ind => ind.axisId === axis.id);
            const axisScores = axisIndicators.map(ind => assessmentData.scores?.[ind.id] || 0);
            const axisSum = axisScores.reduce((a, b) => a + b, 0);
            const companyValue = axisScores.length > 0 ? (axisSum / (axisScores.length * 5)) * 150 : 0;
            return {
                subject: language === 'ar' ? axis.title_ar : axis.title_en,
                A: companyValue,
                fullMark: 150,
            };
        });
        setRadarData(newRadarData as any);

        let omanizationRate = 0;
        if (companyData?.totalEmployees > 0) {
            omanizationRate = Math.round((companyData.omaniEmployees / companyData.totalEmployees) * 100);
        }
        
        const complianceItems = Object.values(complianceData.compliance || {});
        const compliantItemsCount = complianceItems.filter(v => v === true).length;
        
        setDashboardData({
            maturityScore: parseFloat(maturityScore.toFixed(1)),
            totalAssets: (companyData?.authorizedCapital / 1000000000) || 0,
            omanizationRate: omanizationRate || 0,
            compliantItems: compliantItemsCount,
            totalComplianceItems: complianceItems.length || 4,
            risks: complianceData?.risks || []
        });

    } else {
        // Aggregate data for "All Companies"
        let totalMaturity = 0, totalOmanization = 0, totalCompliant = 0, totalItems = 0;
        const allCompaniesStr = localStorage.getItem('oia_companies_registry');
        const allCompanies = allCompaniesStr ? JSON.parse(allCompaniesStr) : [];
        let totalAssets = 0;
        let riskCount = 0;

        allCompanies.forEach((comp: any) => {
            const assessmentStr = localStorage.getItem(`oia_assessment_${comp.id}`);
            const complianceStr = localStorage.getItem(`oia_compliance_${comp.id}`);
            if (assessmentStr) {
                const assessmentData = JSON.parse(assessmentStr);
                const scores = Object.values(assessmentData.scores || {}) as number[];
                if(scores.length > 0) {
                  const totalScore = scores.reduce((sum, score) => sum + score, 0);
                  totalMaturity += totalScore / INDICATORS.length;
                }
            }
            if (complianceStr) {
                const complianceData = JSON.parse(complianceStr);
                const complianceItems = Object.values(complianceData.compliance || {});
                totalCompliant += complianceItems.filter(v => v === true).length;
                totalItems += complianceItems.length;
                riskCount += (complianceData.risks || []).length;
            }
            totalOmanization += comp.omanization || 0;
            totalAssets += (comp.authorizedCapital / 1000000000) || 0;
        });
        
        const avgMaturity = allCompanies.length > 0 ? totalMaturity / allCompanies.length : 0;
        const avgOmanization = allCompanies.length > 0 ? totalOmanization / allCompanies.length : 0;
        
        setDashboardData({
            maturityScore: parseFloat(avgMaturity.toFixed(1)),
            totalAssets: parseFloat(totalAssets.toFixed(1)),
            omanizationRate: Math.round(avgOmanization),
            compliantItems: totalCompliant,
            totalComplianceItems: totalItems || 4,
            risks: Array(riskCount).fill({probability: Math.random()*5, impact: Math.random()*5}), // Mock risks
        });
        setRadarData(radarDataTemplate.map(item => ({...item, subject: language === 'ar' ? item.subject_ar : item.subject, A: Math.random() * 120 + 30})));
    }
  }, [selectedCompanyId, language]);


  const maturityGaugeData = useMemo(() => [{ name: 'Maturity', value: dashboardData.maturityScore }], [dashboardData.maturityScore]);
  const omanizationData = useMemo(() => [{ name: 'Omanization', value: dashboardData.omanizationRate }, {name: 'Remaining', value: 100 - dashboardData.omanizationRate}], [dashboardData.omanizationRate]);
  const complianceData = useMemo(() => [
      { name: t('dashboard.compliant'), value: dashboardData.compliantItems },
      { name: t('dashboard.nonCompliant'), value: dashboardData.totalComplianceItems - dashboardData.compliantItems },
  ], [dashboardData.compliantItems, dashboardData.totalComplianceItems, t]);

  const riskMapData = useMemo(() => {
    return (dashboardData.risks || []).map((risk: any) => ({
      x: risk.probability,
      y: risk.impact,
      z: risk.probability * risk.impact * 20, // size of bubble
    }));
  }, [dashboardData.risks]);

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
          <p className="label font-bold text-lg">{`${t('dashboard.maturityScore')}: ${payload[0].value}`}</p>
          <p className="intro text-gray-300">{label}</p>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="p-4 md:p-6 lg:p-8 text-white space-y-8">
       <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{dashboardTitle}</h1>
      </header>

      {/* KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
              <Card className={`${cardBaseClasses}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">{t('dashboard.maturityGauge')}</CardTitle>
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-4xl font-bold text-gold-400">{dashboardData.maturityScore.toFixed(1)} / 5</div>
                      <p className="text-xs text-gray-400 mt-1">{t('dashboard.overallScore')}</p>
                  </CardContent>
              </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
              <Card className={`${cardBaseClasses}`}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">{t('dashboard.portfolioHealth')}</CardTitle>
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-4xl font-bold">{dashboardData.totalAssets.toFixed(1)}B</div>
                      <p className="text-xs text-gray-400 mt-1">{t('dashboard.totalAssets')} (OMR)</p>
                  </CardContent>
              </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
              <Card className={`${cardBaseClasses}`}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">{t('dashboard.omanization')}</CardTitle>
                       <Users className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-4xl font-bold">{dashboardData.omanizationRate}%</div>
                      <p className="text-xs text-gray-400 mt-1">{t('dashboard.nationalWorkforce')}</p>
                  </CardContent>
              </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
              <Card className={`${cardBaseClasses}`}>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">{t('dashboard.riskMap')}</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-4xl font-bold">{(riskMapData || []).length}</div>
                      <p className="text-xs text-gray-400 mt-1">{t('dashboard.activeRisks')}</p>
                  </CardContent>
              </Card>
          </motion.div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strategic Radar */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
          <Card className={cardBaseClasses}>
            <CardHeader>
              <CardTitle className="text-gold-400">{t('dashboard.strategicRadar')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <defs>
                    <radialGradient id="radarFill">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.1}/>
                    </radialGradient>
                  </defs>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#fff', fontSize: 14 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Performance" dataKey="A" stroke="#E5C565" strokeWidth={2} fill="url(#radarFill)" />
                  <Tooltip contentStyle={{ backgroundColor: '#001A33', border: '1px solid #D4AF37' }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Compliance and Risk */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5}>
          <div className="grid grid-rows-1 gap-6 h-full">
             <Card className={cardBaseClasses}>
                <CardHeader>
                  <CardTitle>{t('dashboard.complianceRisk')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie data={complianceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5}>
                          <Cell key="compliant" fill="#00E096" />
                          <Cell key="non-compliant" fill="#FF3B3B" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#001A33' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <Legend iconType="circle" wrapperStyle={{fontSize: '14px', color: 'white'}}/>
                  </div>
                   <div className="flex flex-col items-center justify-center">
                     <ResponsiveContainer width="100%" height={150}>
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis type="number" dataKey="x" name={t('compliance.probability')} unit="" tick={{ fill: '#fff' }} domain={[0, 5]} />
                        <YAxis type="number" dataKey="y" name={t('compliance.impact')} unit="" tick={{ fill: '#fff' }} domain={[0, 5]}/>
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#001A33' }} />
                        <Scatter name="Risks" data={riskMapData} fill="#FF3B3B" />
                      </ScatterChart>
                    </ResponsiveContainer>
                    <p className="text-sm text-gray-300 mt-2">{t('dashboard.riskMap')}</p>
                   </div>
                </CardContent>
              </Card>
          </div>
        </motion.div>
      </div>

       {/* Strategic Path Chart */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
            <Card className={cardBaseClasses}>
                <CardHeader>
                    <CardTitle className="text-gold-400 flex items-center gap-2">
                        <Target />
                        {t('dashboard.maturityPath')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            data={maturityPathData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E5C565" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#E5C565" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="year" tick={{ fill: '#A0A0A0' }} />
                            <YAxis domain={[0, 5]} tick={{ fill: '#A0A0A0' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="score" stroke="#E5C565" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>

    </div>
  );
};

export default Dashboard;
