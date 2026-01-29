"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Printer, Filter, 
  TrendingUp, AlertTriangle, CheckCircle, 
  Building2, PieChart as PieChartIcon, Calendar,
  ArrowDownRight, ArrowUpRight, Coins, Loader2, ShieldCheck, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { useYear } from '@/context/YearContext';
import { INDICATORS, AXES } from '@/data/indicators';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ASSESSMENT_DATA } from '@/data/assessmentData';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const RadarCustomTick = (props: any) => {
    const { x, y, payload } = props;
    const words = payload.value.split(' ');
    const maxChars = 20;
  
    if (words.length === 1 || payload.value.length < maxChars) {
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={4} textAnchor="middle" fill="#9ca3af" fontSize={11} className="print:text-gray-600 print:text-xs">
            {payload.value}
          </text>
        </g>
      );
    }
    
    let line = '';
    const lines = [];
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (testLine.length > maxChars) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
  
    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((l, i) => (
          <text key={i} x={0} y={i * 12} dy={4} textAnchor="middle" fill="#9ca3af" fontSize={10} className="print:text-gray-600 print:text-xs">
            {l.trim()}
          </text>
        ))}
      </g>
    );
};

export default function Reports() {
  const { t, language, dir } = useLanguage();
  const { getSelectedZone, selectedZoneId } = useCompany();
  const { selectedYear } = useYear();
  const reportRef = useRef<HTMLDivElement>(null);
  
  const [reportType, setReportType] = useState('comprehensive');
  const [isExporting, setIsExporting] = useState(false);

  const [financials, setFinancials] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [gaps, setGaps] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [icvData, setIcvData] = useState<any>(null);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [operationalComplianceRadarData, setOperationalComplianceRadarData] = useState<any[]>([]);
  const [operationalTotalScore, setOperationalTotalScore] = useState(0);

  const selectedZone = getSelectedZone();

  // حساب النتائج الإجمالية للكورنر
  const institutionalTotal = useMemo(() => {
    if (radarData.length === 0) return 0;
    const sum = radarData.reduce((acc, item) => acc + item.company, 0);
    return (sum / radarData.length).toFixed(1);
  }, [radarData]);

  useEffect(() => {
    if (!selectedZoneId || selectedZoneId === 'all') return;

    // Financials
    const finKey = `oia_financials_${selectedZoneId}_${selectedYear}`;
    const finStr = localStorage.getItem(finKey);
    if (finStr) {
      const data = JSON.parse(finStr);
      setFinancials({
        revenue: Number(data.revenue) || 0,
        expenses: Number(data.expenses) || 0,
        surplus: (Number(data.revenue) || 0) - (Number(data.expenses) || 0),
        assets: Number(data.authorizedCapital) || 0,
        liabilities: Number(data.liabilities) || 0,
        capex: Number(data.capex) || 0,
        exports: Number(data.exportsValue) || 0,
        economicReturn: Number(data.economicReturn) || 0
      });
      
      setIcvData({
          total: Number(data.totalSpending) || (Number(data.revenue) * 0.8),
          local: Number(data.localSpending) || (Number(data.revenue) * 0.5),
          sme: Number(data.smeSpending) || (Number(data.revenue) * 0.2)
      });
    } else {
        setFinancials({ revenue: 28000000, expenses: 15000000, surplus: 13000000, assets: 450000000, liabilities: 12500000, capex: 45000000, exports: 1200000000, economicReturn: 12.5 });
        setIcvData({ total: 500000000, local: 250000000, sme: 50000000 });
    }

    // Institutional Assessment
    const assessKey = `oia_assessment_${selectedZoneId}_${selectedYear}`;
    const assessStr = localStorage.getItem(assessKey);
    if (assessStr) {
        const data = JSON.parse(assessStr);
        const foundGaps: any[] = [];
        Object.entries(data.scores || {}).forEach(([idStr, score]: [string, any]) => {
            if (score < 3) {
                const indicator = INDICATORS.find(i => i.id === Number(idStr));
                const axis = AXES.find(a => a.id === indicator?.axisId);
                if (indicator) {
                    foundGaps.push({
                        id: indicator.id,
                        name: language === 'ar' ? indicator.text_ar : indicator.text_en,
                        axis: language === 'ar' ? axis?.title_ar : axis?.title_en,
                        score: score
                    });
                }
            }
        });
        setGaps(foundGaps.slice(0, 5));
        
        const scores = data.scores || {};
        const radarAcc = AXES.map(axis => ({ id: axis.id, score: 0, count: 0 }));
        Object.keys(scores).forEach(key => {
            const indId = parseInt(key);
            const score = scores[key];
            const indicator = INDICATORS.find(i => i.id === indId);
            if (indicator) {
                const ax = radarAcc.find(a => a.id === indicator.axisId);
                if (ax) { ax.score += score; ax.count++; }
            }
        });

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

    } else {
        setGaps([{ id: 1, name: t('demo.gaps.1.name'), axis: t('demo.gaps.1.axis'), score: 2 }]);
        const demoRadar = AXES.map(axis => ({
            subject: language === 'ar' ? axis.title_ar : axis.title_en,
            company: 3.8 + (Math.random() - 0.5),
            sector: 3.5,
            fullMark: 5
        }));
        setRadarData(demoRadar);
    }
    
    // Operational Compliance Assessment
    const opAssessKey = `opaz_operational_assessment_${selectedZoneId}_${selectedYear}`;
    const opAssessStr = localStorage.getItem(opAssessKey);
    if (opAssessStr) {
        const opAssessData = JSON.parse(opAssessStr);
        const inputs = opAssessData.inputs || {};
        let totalScore = 0;

        const newOpRadarData = ASSESSMENT_DATA.map(category => {
            let earnedPoints = 0;
            category.indicators.forEach(ind => {
                const val = inputs[ind.id] || 0;
                if (ind.type === 'select') {
                    earnedPoints += val;
                } else {
                    const max = ind.maxScore || 100;
                    earnedPoints += (val / max) * ind.weight;
                }
            });
            totalScore += earnedPoints;
            const percentageScore = category.weight > 0 ? (earnedPoints / category.weight) * 100 : 0;
            const titleAr = category.title.substring(category.title.indexOf('.') + 2);
            const titleEn = category.title_en.substring(category.title_en.indexOf('.') + 2);
    
            return {
                subject: language === 'ar' ? titleAr : titleEn,
                company: percentageScore,
                sector: 80,
            };
        });
        setOperationalComplianceRadarData(newOpRadarData);
        setOperationalTotalScore(totalScore);
    }

    // Risks
    const compKey = `opaz_compliance_${selectedZoneId}_${selectedYear}`;
    const compStr = localStorage.getItem(compKey);
    if (compStr) {
        const data = JSON.parse(compStr);
        setRisks(data.risks || []);
    }

  }, [selectedZoneId, selectedYear, language, t]);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
        const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#0f172a', useCORS: true }); 
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`OPAZ_Report_${selectedZoneId}_${selectedYear}.pdf`);
    } finally { setIsExporting(false); }
  };

  const financialChartData = financials ? [
      { name: t('reports.financialTable.revenue'), value: financials.revenue, fill: '#3b82f6' },
      { name: t('reports.financialTable.expenses'), value: financials.expenses, fill: '#ef4444' },
      { name: t('reports.netSurplus'), value: financials.surplus, fill: '#10b981' },
  ] : [];

  if (!selectedZoneId || selectedZoneId === 'all') {
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
    <div className="p-6 md:p-8 text-white min-h-screen space-y-8" dir={dir}>
      
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm print:hidden">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-gold-500/20 rounded-lg text-gold-400"><FileText size={24} /></div>
            <div>
                <h1 className="text-2xl font-bold text-white">{t('reports.title')}</h1>
                <p className="text-sm text-slate-400">{t('reports.subtitle')}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[250px] bg-slate-800 border-slate-700">
                    <SelectValue placeholder={t('reports.reportType')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-slate-700">
                    <SelectItem value="comprehensive">{t('reports.comprehensive')}</SelectItem>
                    <SelectItem value="financial">{t('reports.financial')}</SelectItem>
                    <SelectItem value="compliance">{t('reports.compliance')}</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={handleExport} className="bg-gold-500 text-black hover:bg-gold-400 font-bold" disabled={isExporting}>
                {isExporting ? <Loader2 className="animate-spin mr-2"/> : <Download size={18} className="mr-2"/>}
                {isExporting ? t('common.loading') : t('common.exportPdf')}
            </Button>
        </div>
      </div>

      {/* Main Report Document */}
      <div ref={reportRef} className="bg-slate-950 border border-white/10 rounded-xl p-8 md:p-12 shadow-2xl max-w-5xl mx-auto min-h-[1000px] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          {/* Document Header */}
          <header className="border-b border-white/10 pb-8 mb-8 flex justify-between items-start">
              <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                      {reportType === 'comprehensive' && t('reports.comprehensive')}
                      {reportType === 'financial' && t('reports.financial')}
                      {reportType === 'compliance' && t('reports.compliance')}
                  </h2>
                  <p className="text-gold-400 text-lg font-medium">{language === 'ar' ? selectedZone?.name_ar : selectedZone?.name_en}</p>
                  <p className="text-slate-400 text-sm mt-1">{t('reports.year')}: {selectedYear}</p>
              </div>
              <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">{t('reports.reportDate')}</div>
                  <div className="font-mono text-slate-300">{format(new Date(), 'dd/MM/yyyy')}</div>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      <CheckCircle size={12} className="mr-1"/> {t('reports.generatedBy')}
                  </div>
              </div>
          </header>

          {/* Dual Radar Charts Section */}
          {(reportType === 'comprehensive') && (
            <section className="mb-12 break-inside-avoid">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-6 bg-gold-500 rounded-full"></div>
                    <h3 className="text-xl font-bold text-white">{t('reports.maturitySection')}</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Radar 1: Institutional Performance */}
                    <div className="relative bg-slate-900/50 p-6 rounded-lg border border-white/5 h-[400px]">
                        {/* FLOATING SCORE BADGE */}
                        <div className="absolute top-4 left-4 z-10 flex flex-col items-center bg-slate-950/80 backdrop-blur-md border border-gold-500/30 p-2 rounded-xl min-w-[70px] shadow-lg">
                            <span className="text-[10px] text-gold-400/70 font-bold uppercase tracking-wider">{language === 'ar' ? 'المعدل' : 'SCORE'}</span>
                            <span className="text-2xl font-black text-gold-500 leading-tight">{institutionalTotal}</span>
                        </div>
                        
                        <h4 className="text-center text-sm font-bold text-slate-400 mb-2 flex items-center justify-center gap-2">
                           <Target size={14} className="text-gold-500" /> {language === 'ar' ? 'الأداء المؤسسي' : 'Institutional Performance'}
                        </h4>
                        
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={<RadarCustomTick />} />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                                <RechartsTooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
                                <Radar name='reports.companyScore' dataKey="company" stroke="#D4AF37" strokeWidth={3} fill="#D4AF37" fillOpacity={0.4} />
                                <Radar name='reports.sectorAverage' dataKey="sector" stroke="#8b5cf6" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Radar 2: Operational Compliance (The New One) */}
                    <div className="relative bg-slate-900/50 p-6 rounded-lg border border-white/5 h-[400px]">
                        {/* FLOATING SCORE BADGE */}
                        <div className="absolute top-4 right-4 z-10 flex flex-col items-center bg-slate-950/80 backdrop-blur-md border border-purple-500/30 p-2 rounded-xl min-w-[70px] shadow-lg">
                            <span className="text-[10px] text-purple-400/70 font-bold uppercase tracking-wider">{language === 'ar' ? 'الامتثال' : 'COMPLIANCE'}</span>
                            <span className="text-2xl font-black text-purple-400 leading-tight">{operationalTotalScore.toFixed(1)}</span>
                        </div>

                        <h4 className="text-center text-sm font-bold text-slate-400 mb-2 flex items-center justify-center gap-2">
                           <ShieldCheck size={14} className="text-gold-500" /> {language === 'ar' ? 'الامتثال التشغيلي' : 'Operational Compliance'}
                        </h4>

                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={operationalComplianceRadarData}>
                                <defs>
                                    <radialGradient id="radarFillCopperRep">
                                        <stop offset="0%" stopColor="#A57C5B" stopOpacity={0.5}/>
                                        <stop offset="100%" stopColor="#A57C5B" stopOpacity={0.1}/>
                                    </radialGradient>
                                </defs>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={<RadarCustomTick />} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <RechartsTooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} formatter={(v: number) => `${v.toFixed(1)}%`} />
                                <Radar name='Zone Performance' dataKey="company" stroke="#A57C5B" strokeWidth={3} fill="url(#radarFillCopperRep)" fillOpacity={0.7} />
                                <Radar name='Sector Average' dataKey="sector" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="6 6" fill="transparent" />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </section>
          )}

          {/* Financials Section */}
          {(reportType === 'comprehensive' || reportType === 'financial') && financials && (
              <section className="mb-12 break-inside-avoid">
                  <div className="flex items-center gap-2 mb-6">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-xl font-bold text-white">{t('reports.financialSection')}</h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 bg-slate-900/50 p-6 rounded-lg border border-white/5">
                          <h4 className="text-sm font-medium text-slate-400 mb-4 text-center">{t('reports.financialChartTitle')}</h4>
                          <div className="h-[250px]">
                              <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={financialChartData} barSize={50}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                      <XAxis dataKey="name" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                                      <YAxis tickFormatter={(val) => `${val/1000000}M`} tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                                      <RechartsTooltip contentStyle={{backgroundColor: '#1e293b', border: 'none'}} formatter={(val: number) => formatCurrency(val)} />
                                      <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                                  </BarChart>
                              </ResponsiveContainer>
                          </div>
                      </div>
                      <div className="space-y-4">
                          <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                              <p className="text-xs text-slate-400">{t('reports.netSurplus')}</p>
                              <div className="text-2xl font-bold text-emerald-400 mt-1" dir="ltr">{formatCurrency(financials.surplus)}</div>
                          </div>
                          <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                              <p className="text-xs text-slate-400">{t('reports.economicReturn')}</p>
                              <div className="text-2xl font-bold text-amber-400 mt-1">{financials.economicReturn} <span className="text-sm text-slate-500">{t('dashboard.returnUnit')}</span></div>
                          </div>
                      </div>
                  </div>
              </section>
          )}

          {/* Gaps and Risks Sections (Abbreviated for brevity) */}
          {(reportType === 'comprehensive') && (
              <section className="mb-12 break-inside-avoid">
                  <div className="flex items-center gap-2 mb-6"><div className="w-1 h-6 bg-gold-500 rounded-full"></div><h3 className="text-xl font-bold text-white">{t('reports.improvementSection')}</h3></div>
                  {gaps.length > 0 ? (
                      <div className="overflow-hidden rounded-lg border border-white/10">
                          <table className="w-full text-sm text-right">
                              <thead className="bg-slate-800 text-slate-300">
                                  <tr><th className="p-4 font-medium">{t('reports.gapsTable.indicator')}</th><th className="p-4 font-medium text-center">{t('reports.gapsTable.score')}</th><th className="p-4 font-medium">{t('reports.gapsTable.recommendation')}</th></tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 bg-slate-900/50">
                                  {gaps.map((gap, idx) => (
                                      <tr key={idx}><td className="p-4 text-white font-medium">{gap.name}</td><td className="p-4 text-center"><span className="px-2 py-1 bg-red-500/20 text-red-400 rounded font-bold text-xs">{gap.score.toFixed(1)}</span></td><td className="p-4 text-slate-400 text-xs">{t('reports.gapsTable.action')}</td></tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  ) : <div className="p-6 text-center border border-dashed border-white/10 rounded-lg text-emerald-400">{t('reports.gapsTable.noGaps')}</div>}
              </section>
          )}

          <footer className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-slate-600 flex justify-between items-center">
              <p>{t('reports.footer')}</p>
              <div className="flex gap-4">
                  <span>{t('reports.pageOf', {currentPage: 1, totalPages: 1})}</span>
                  <span>{t('reports.version', {version: '1.0'})}</span>
              </div>
          </footer>

      </div>
    </div>
  );
}
