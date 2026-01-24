'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Building2,
  Anchor,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { useYear } from '@/context/YearContext';
import { AXES, INDICATORS } from '@/data/indicators';
import { ZONES } from '@/data/companies';

// --- Custom Components ---
const RadarCustomTick = ({ payload, x, y, cx, cy, ...rest }: any) => {
  return (
    <text
      {...rest}
      y={y + (y - cy) / 10}
      x={x + (x - cx) / 10}
      fill="#9CA3AF"
      fontSize="11px"
      textAnchor="middle"
    >
      {payload.value}
    </text>
  );
};

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { getSelectedZone, selectedZoneId } = useCompany();
  const { selectedYear } = useYear();
  const selectedZone = getSelectedZone();

  // --- State ---
  const [radarData, setRadarData] = useState<any[]>([]);
  const [maturityTrend, setMaturityTrend] = useState<any[]>([]);
  const [improvementData, setImprovementData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    maturity: 0,
    compliance: 0,
    risks: 0,
    exports: 0,
    investment: 0,
    jobs: 0,
    omanization: 0,
  });

  useEffect(() => {
    // Common data for both views
    const trendData = [
      { year: '2021', score: 2.8, sectorAverage: 3.0 },
      { year: '2022', score: 3.2, sectorAverage: 3.2 },
      { year: '2023', score: 3.5, sectorAverage: 3.3 },
      { year: '2024', score: 3.9, sectorAverage: 3.4 },
      { year: '2025', score: 4.2, sectorAverage: 3.6 },
      { year: '2026', score: 4.5, sectorAverage: 3.8 },
    ];
    setMaturityTrend(trendData);
    setImprovementData([
      { name: language === 'ar' ? 'مكتمل' : 'Completed', value: 12, color: '#10b981' },
      { name: language === 'ar' ? 'قيد التنفيذ' : 'In Progress', value: 8, color: '#f59e0b' },
      { name: language === 'ar' ? 'جديد' : 'New', value: 5, color: '#6b7280' },
    ]);

    if (selectedZone) {
      // 1. Single Zone View
      const processedRadar = AXES.map((axis) => ({
        subject: language === 'ar' ? axis.title_ar : axis.title_en,
        score: Math.random() * 2 + 3,
        sectorAverage: 3.5,
        fullMark: 5,
      }));
      setRadarData(processedRadar);

      setStats({
        maturity: 3.3,
        compliance: 78,
        risks: 1,
        exports: (selectedZone as any).exportsValue
          ? (selectedZone as any).exportsValue * 1000000
          : 1200000000,
        investment: (selectedZone as any).cumulativeInvestment
          ? (selectedZone as any).cumulativeInvestment * 1000000
          : 450000000,
        jobs: (selectedZone as any).totalEmployees || 8000,
        omanization: 40,
      });
    } else {
      // 2. Aggregated "All Zones" View
      const totalInvestment = ZONES.reduce((acc, z) => acc + (z.cumulativeInvestment || 0), 0) * 1000000;
      const totalExports = ZONES.reduce((acc, z) => acc + (z.exportsValue || 0), 0) * 1000000;
      const totalJobs = ZONES.reduce((acc, z) => acc + (z.totalEmployees || 0), 0);
      
      setStats({
          maturity: 3.8, // Mock aggregated value
          compliance: 85, // Mock aggregated value
          risks: 5, // Mock aggregated value
          exports: totalExports,
          investment: totalInvestment,
          jobs: totalJobs,
          omanization: 35 // Mock aggregated value
      });

      const aggregatedRadar = AXES.map((axis) => ({
        subject: language === 'ar' ? axis.title_ar : axis.title_en,
        score: 3.5 + (Math.random() - 0.5),
        sectorAverage: 3.5,
        fullMark: 5,
      }));
      setRadarData(aggregatedRadar);
    }
  }, [selectedZoneId, selectedYear, language, selectedZone]);

  // Helper for currency
  const formatCurrency = (val: number) => {
    if (val >= 1000000000) {
      return (val / 1000000000).toFixed(1) + (language === 'ar' ? ' مليار' : 'B');
    }
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + (language === 'ar' ? ' مليون' : 'M');
    }
    return val.toLocaleString();
  };

  return (
    <div className="p-6 space-y-6 text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
                {selectedZone ? `${t('menu.dashboard')} - ${language === 'ar' ? selectedZone.name_ar : selectedZone.name_en}` : 'لوحة القيادة المركزية'}
            </h1>
        </div>

      {/* --- Top Stats Row --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">مقياس النضج العام</p>
              <div className="text-3xl font-bold text-gold-400 mt-1">
                {stats.maturity} <span className="text-sm text-slate-500">/ 5</span>
              </div>
            </div>
            <Activity className="text-gold-500 h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">إجمالي حجم الاستثمار</p>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {formatCurrency(stats.investment)} <span className="text-xs">OMR</span>
              </div>
            </div>
            <Building2 className="text-emerald-500 h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">حجم الصادرات السنوي</p>
              <div className="text-2xl font-bold text-blue-400 mt-1">
                {formatCurrency(stats.exports)} <span className="text-xs">OMR</span>
              </div>
            </div>
            <Anchor className="text-blue-500 h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">المخاطر الحرجة</p>
              <div className="text-3xl font-bold text-red-500 mt-1">{stats.risks}</div>
            </div>
            <AlertTriangle className="text-red-500 h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
      </div>
      {/* --- Main Charts Row --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Improvement Plan (Pie with Labels) */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-gold-400 flex items-center gap-2">
              <CheckCircle size={18} />
              حالة الامتثال وخطة التحسين
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={improvementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {improvementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-2xl font-bold text-white">
                {improvementData.reduce((acc, curr) => acc + curr.value, 0)}
              </div>
              <div className="text-xs text-slate-400">إجراء</div>
            </div>
          </CardContent>
        </Card>
        {/* 2. Radar Chart (Dual Layer) */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-gold-400 flex items-center gap-2">
              <Target size={18} />
              رادار الأداء الاستراتيجي (مقارنة معيارية)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={<RadarCustomTick />} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Legend />
                <Radar name={language === 'ar' ? 'نتيجة المنطقة' : 'Zone Score'} dataKey="score" stroke="#D4AF37" strokeWidth={3} fill="#D4AF37" fillOpacity={0.4} />
                <Radar name={language === 'ar' ? 'متوسط القطاع' : 'Sector Avg'} dataKey="sectorAverage" stroke="#8b5cf6" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* --- Bottom Row: Trend & Risk Map --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Maturity Path (Two Paths) */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-gold-400 flex items-center gap-2">
              <TrendingUp size={18} />
              مسار النضج الاستراتيجي (التقدم الزمني)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={maturityTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSector" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 5]} />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Legend />
                <Area type="monotone" dataKey="score" name={language === 'ar' ? 'نتيجة المنطقة' : 'Zone'} stroke="#D4AF37" fillOpacity={1} fill="url(#colorScore)" />
                <Area type="monotone" dataKey="sectorAverage" name={language === 'ar' ? 'متوسط القطاع' : 'Sector'} stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSector)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* 4. Risk Heatmap (Custom CSS Grid) */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-gold-400 flex items-center gap-2">
              <AlertTriangle size={18} />
              خارطة توزيع المخاطر (Heatmap)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col justify-center items-center">
            <div className="flex w-full h-full">
              {/* Y Axis Label (Rotated properly) */}
              <div className="flex items-center justify-center w-8 -rotate-90 whitespace-nowrap text-slate-400 text-xs font-bold tracking-widest">
                الاحتمالية (Probability)
              </div>
              {/* The Grid */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 grid grid-rows-5 grid-cols-5 gap-1 p-2">
                  {/* Generating 5x5 Grid Cells */}
                  {Array.from({ length: 25 }).map((_, i) => {
                    const row = Math.floor(i / 5); // 0 to 4
                    const col = i % 5; // 0 to 4
                    // Risk Logic: (Red: Top Right), (Green: Bottom Left)
                    const impact = col + 1;
                    const probability = 5 - row;
                    const score = impact * probability;

                    let bgClass = 'bg-emerald-900/40'; // Low
                    if (score >= 15) bgClass = 'bg-red-900/60'; // Critical
                    else if (score >= 8) bgClass = 'bg-yellow-900/50'; // Medium
                    // Mock placing a risk bubble in a specific cell
                    const hasRisk =
                      row === 1 && col === 3 ? 1 : row === 0 && col === 4 ? 2 : null;
                    return (
                      <div
                        key={i}
                        className={`rounded ${bgClass} flex items-center justify-center relative border border-white/5 hover:border-white/20 transition-all`}
                      >
                        {hasRisk && (
                          <span className="w-6 h-6 rounded-full bg-white text-black text-xs font-bold flex items-center justify-center shadow-lg animate-pulse">
                            {hasRisk}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* X Axis Label */}
                <div className="text-center text-slate-400 text-xs font-bold tracking-widest mt-1">
                  الأثر (Impact)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
