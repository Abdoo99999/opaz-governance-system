
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
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { COMPANIES } from '@/data/companies';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
};

const cardBaseClasses = "bg-royal-800/40 backdrop-blur-md border border-white/5 rounded-2xl";

// Mock Data
const initialDashboardData = {
  maturityScore: 3.8,
  totalAssets: 14.2,
  omanizationRate: 82,
};

const radarData = [
  { subject: 'Governance', A: 110, fullMark: 150 },
  { subject: 'Risk', A: 98, fullMark: 150 },
  { subject: 'Strategy', A: 86, fullMark: 150 },
  { subject: 'Finance', A: 130, fullMark: 150 },
  { subject: 'Operation', A: 115, fullMark: 150 },
];
const riskMapData = [
  { x: 10, y: 200, z: 200 }, { x: 12, y: 100, z: 260 },
  { x: 17, y: 300, z: 400 }, { x: 14, y: 250, z: 280 },
  { x: 15, y: 400, z: 500 }, { x: 11, y: 280, z: 200 },
];

const sectorPerformanceData = [
  { name: 'Energy', performance: 4000 },
  { name: 'Logistics', performance: 3000 },
  { name: 'Tourism', performance: 2000 },
];
const complianceData = [
  { name: 'Compliant', value: 400 },
  { name: 'Non-Compliant', value: 78 },
];
const urgentAlerts = [
  { company: 'OQ', issue: 'Update Policy', icon: <Clock className="w-5 h-5 text-yellow-400" /> },
  { company: 'Asyad', issue: 'Audit Due', icon: <AlertTriangle className="w-5 h-5 text-red-500" /> },
  { company: 'Omran', issue: 'Review Financials', icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
];

const Dashboard = () => {
  const { t, language } = useLanguage();
  const { getSelectedCompany } = useCompany();
  const [dashboardData, setDashboardData] = useState(initialDashboardData);

  const selectedCompany = getSelectedCompany();

  useEffect(() => {
    if (selectedCompany) {
      // Simulate fetching new data for the selected company by applying a random factor
      setDashboardData({
        maturityScore: parseFloat((Math.random() * (4.5 - 2.5) + 2.5).toFixed(1)),
        totalAssets: parseFloat((Math.random() * (20 - 1) + 1).toFixed(1)),
        omanizationRate: Math.floor(Math.random() * (95 - 60) + 60),
      });
    } else {
      // Reset to aggregate data when "All Companies" is selected
      setDashboardData(initialDashboardData);
    }
  }, [selectedCompany]);

  const maturityGaugeData = useMemo(() => [{ name: 'Maturity', value: dashboardData.maturityScore }], [dashboardData.maturityScore]);
  const omanizationData = useMemo(() => [{ name: 'Omanization', value: dashboardData.omanizationRate }], [dashboardData.omanizationRate]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Maturity Gauge */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0} className="lg:col-span-1">
          <Card className={cardBaseClasses}>
            <CardHeader>
              <CardTitle>{t('dashboard.maturityGauge')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  cx="50%"
                  cy="70%"
                  innerRadius="90%"
                  outerRadius="120%"
                  barSize={20}
                  data={maturityGaugeData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                    fill="url(#goldGradient)"
                    max={5}
                  />
                  <text
                    x="50%"
                    y="70%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-3xl font-bold"
                  >
                    {dashboardData.maturityScore} / 5
                  </text>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#E5C565" />
                      <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                  </defs>
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Portfolio Health */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className="lg:col-span-1">
          <Card className={`${cardBaseClasses} flex flex-col justify-center items-center h-full`}>
            <CardHeader>
              <CardTitle>{t('dashboard.portfolioHealth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-gold-400">{dashboardData.totalAssets}B OMR</p>
              <p className="text-center text-sm text-gray-400 mt-2">{t('dashboard.totalAssets')}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Strategic Radar */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2} className="lg:col-span-1">
          <Card className={cardBaseClasses}>
            <CardHeader>
              <CardTitle>{t('dashboard.strategicRadar')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#fff' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Performance" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Map */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3} className="lg:col-span-1">
          <Card className={cardBaseClasses}>
            <CardHeader>
              <CardTitle>{t('dashboard.riskMap')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" dataKey="x" name="Impact" unit="" tick={{ fill: '#fff' }} />
                  <YAxis type="number" dataKey="y" name="Probability" unit="" tick={{ fill: '#fff' }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#001A33' }} />
                  <Scatter name="Risks" data={riskMapData} fill="#FF3B3B" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Omanization Rate */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
          <Card className={`${cardBaseClasses} flex flex-col justify-center items-center h-full`}>
            <CardHeader>
              <CardTitle>{t('dashboard.omanization')}</CardTitle>
            </CardHeader>
            <CardContent>
               <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={omanizationData}
                      cx="50%"
                      cy="50%"
                      dataKey="value"
                      innerRadius={50}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={5}
                      cornerRadius={10}
                    >
                      <Cell fill="#00E096"/>
                      <Cell fill="rgba(255,255,255,0.1)"/>
                    </Pie>
                     <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-3xl font-bold"
                    >
                      {dashboardData.omanizationRate}%
                    </text>
                  </PieChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sector Performance */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5} className="lg:col-span-1">
          <Card className={cardBaseClasses}>
            <CardHeader>
              <CardTitle>{t('dashboard.sectorPerf')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sectorPerformanceData} layout="vertical">
                  <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#fff' }} width={80} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: '#001A33' }}/>
                  <Bar dataKey="performance" barSize={20} radius={[0, 10, 10, 0]}>
                     <Cell fill="#4682B4" />
                     <Cell fill="#5F9EA0" />
                     <Cell fill="#20B2AA" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Compliance Status */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
          <Card className={cardBaseClasses}>
            <CardHeader>
              <CardTitle>{t('dashboard.compliance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={complianceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                    <Cell key="compliant" fill="#00E096" />
                    <Cell key="non-compliant" fill="#FF3B3B" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#001A33' }} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Urgent Alerts */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7} className="lg:col-span-2">
          <Card className={cardBaseClasses}>
            <CardHeader>
              <CardTitle>{t('dashboard.urgentAlerts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {urgentAlerts.map((alert, index) => (
                  <li key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-4">
                      {alert.icon}
                      <span className="font-bold">{alert.company}</span>
                      <span>{alert.issue}</span>
                    </div>
                    <button className="text-sm text-gold-400 hover:underline">{t('common.view')}</button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
