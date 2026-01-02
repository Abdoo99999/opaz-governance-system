
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
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

const sectorPerformanceData = [
  { name: 'Energy', performance: 4000, name_ar: 'الطاقة' },
  { name: 'Logistics', performance: 3000, name_ar: 'اللوجستيات' },
  { name: 'Tourism', performance: 2000, name_ar: 'السياحة' },
  { name: 'Tech', performance: 2780, name_ar: 'التقنية' },
  { name: 'Mining', performance: 1890, name_ar: 'التعدين' },
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

  return (
    <div className="p-4 md:p-6 lg:p-8 text-white">
       <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{dashboardTitle}</h1>
      </header>

      {/* KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Strategic Radar */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4} className="lg:col-span-3">
          <Card className={cardBaseClasses}>
            <CardHeader>
              <CardTitle className="text-gold-400">{t('dashboard.strategicRadar')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#fff', fontSize: 14 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Performance" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.6} />
                  <Tooltip contentStyle={{ backgroundColor: '#001A33', border: '1px solid #D4AF37' }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Compliance and Risk */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5} className="lg:col-span-2">
          <div className="grid grid-rows-2 gap-6 h-full">
             <Card className={cardBaseClasses}>
                <CardHeader>
                  <CardTitle>{t('dashboard.compliance')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={complianceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5}>
                        <Cell key="compliant" fill="#00E096" />
                        <Cell key="non-compliant" fill="#FF3B3B" />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#001A33' }} />
                      <Legend iconType="circle" wrapperStyle={{fontSize: '14px'}}/>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className={cardBaseClasses}>
                <CardHeader>
                  <CardTitle>{t('dashboard.riskMap')}</CardTitle>
                </CardHeader>
                <CardContent>
                   <ResponsiveContainer width="100%" height={120}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" dataKey="x" name={t('compliance.probability')} unit="" tick={{ fill: '#fff' }} domain={[0, 5]} />
                      <YAxis type="number" dataKey="y" name={t('compliance.impact')} unit="" tick={{ fill: '#fff' }} domain={[0, 5]}/>
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#001A33' }} />
                      <Scatter name="Risks" data={riskMapData} fill="#FF3B3B" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Dashboard;

import { Users } from 'lucide-react';
