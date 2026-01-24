"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Printer, Filter, 
  TrendingUp, AlertTriangle, CheckCircle, 
  Building2, PieChart as PieChartIcon, Calendar,
  ArrowDownRight, ArrowUpRight, Coins, Loader2
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
          <text x={0} y={0} dy={4} textAnchor="middle" fill="#9ca3af" fontSize={12} className="print:text-gray-600 print:text-xs">
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
          <text key={i} x={0} y={i * 12} dy={4} textAnchor="middle" fill="#9ca3af" fontSize={12} className="print:text-gray-600 print:text-xs">
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

  const selectedZone = getSelectedZone();

  useEffect(() => {
    if (!selectedZoneId || selectedZoneId === 'all') return;

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
        setGaps([
            { id: 1, name: t('demo.gaps.1.name'), axis: t('demo.gaps.1.axis'), score: 2 },
            { id: 2, name: t('demo.gaps.2.name'), axis: t('demo.gaps.2.axis'), score: 1 },
        ]);
        
        const demoRadar = AXES.map(axis => {
            const title = language === 'ar' ? axis.title_ar : axis.title_en;
            return {
              subject: title,
              company: 3.8 + (Math.random() - 0.5),
              sector: 3.5,
              fullMark: 5
            }
        });
        setRadarData(demoRadar);
    }

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
        const canvas = await html2canvas(reportRef.current, { 
            scale: 2, 
            backgroundColor: '#0f172a',
            useCORS: true 
        }); 
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`OPAZ_Report_${selectedZoneId}_${selectedYear}.pdf`);
    } finally {
        setIsExporting(false);
    }
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
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm print:hidden">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-gold-500/20 rounded-lg text-gold-400">
                <FileText size={24} />
            </div>
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

      <div ref={reportRef} className="bg-slate-950 border border-white/10 rounded-xl p-8 md:p-12 shadow-2xl max-w-5xl mx-auto min-h-[1000px] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
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
                                      <RechartsTooltip 
                                        contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}}
                                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                        formatter={(val: number) => formatCurrency(val)}
                                      />
                                      <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                                  </BarChart>
                              </ResponsiveContainer>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                              <p className="text-xs text-slate-400">{t('reports.netSurplus')}</p>
                              <div className="text-2xl font-bold text-emerald-400 mt-1" dir="ltr">{formatCurrency(financials.surplus)}</div>
                              <div className="flex items-center text-xs text-emerald-500 mt-2">
                                  <TrendingUp size={14} className="mr-1"/> {t('reports.positivePerformance')}
                              </div>
                          </div>
                          <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                              <p className="text-xs text-slate-400">{t('reports.economicReturn')}</p>
                              <div className="text-2xl font-bold text-amber-400 mt-1">{financials.economicReturn} <span className="text-sm text-slate-500">{t('dashboard.returnUnit')}</span></div>
                          </div>
                      </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
                      <table className="w-full text-sm text-right">
                          <thead className="bg-slate-800 text-slate-300">
                              <tr>
                                  <th className="p-4 font-medium">{t('reports.financialTable.item')}</th>
                                  <th className="p-4 font-medium">{t('reports.financialTable.value')}</th>
                                  <th className="p-4 font-medium">{t('reports.financialTable.statement')}</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 bg-slate-900/50">
                              <tr>
                                  <td className="p-4 text-white">{t('reports.financialTable.revenue')}</td>
                                  <td className="p-4 font-mono text-emerald-400" dir="ltr">{formatCurrency(financials.revenue)}</td>
                                  <td className="p-4 text-slate-500">{t('reports.financialTable.revenueDesc')}</td>
                              </tr>
                              <tr>
                                  <td className="p-4 text-white">{t('reports.financialTable.expenses')}</td>
                                  <td className="p-4 font-mono text-red-400" dir="ltr">{formatCurrency(financials.expenses)}</td>
                                  <td className="p-4 text-slate-500">{t('reports.financialTable.expensesDesc')}</td>
                              </tr>
                              <tr>
                                  <td className="p-4 text-white">{t('reports.financialTable.assets')}</td>
                                  <td className="p-4 font-mono text-blue-300" dir="ltr">{formatCurrency(financials.assets)}</td>
                                  <td className="p-4 text-slate-500">{t('reports.financialTable.assetsDesc')}</td>
                              </tr>
                              <tr>
                                  <td className="p-4 text-white">{t('reports.financialTable.capex')}</td>
                                  <td className="p-4 font-mono text-slate-300" dir="ltr">{formatCurrency(financials.capex)}</td>
                                  <td className="p-4 text-slate-500">{t('reports.financialTable.capexDesc')}</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </section>
          )}
          
          {(reportType === 'comprehensive') && (
            <section className="mb-12 break-inside-avoid">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-6 bg-gold-500 rounded-full"></div>
                    <h3 className="text-xl font-bold text-white">{t('reports.maturitySection')}</h3>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-lg border border-white/5 h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.2)" />
                            <PolarAngleAxis dataKey="subject" tick={<RadarCustomTick />} />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                            <RechartsTooltip 
                                contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}}
                                formatter={(value: any, name: any) => [value, t(name)]}
                            />
                            <Legend formatter={(value) => t(value)} wrapperStyle={{ color: '#fff', paddingTop: '20px' }}/>
                            <Radar name='reports.companyScore' dataKey="company" stroke="#D4AF37" strokeWidth={3} fill="#D4AF37" fillOpacity={0.4} />
                            <Radar name='reports.sectorAverage' dataKey="sector" stroke="#8b5cf6" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </section>
          )}

          {(reportType === 'comprehensive') && (
              <section className="mb-12 break-inside-avoid">
                  <div className="flex items-center gap-2 mb-6">
                      <div className="w-1 h-6 bg-gold-500 rounded-full"></div>
                      <h3 className="text-xl font-bold text-white">{t('reports.improvementSection')}</h3>
                  </div>
                  
                  {gaps.length > 0 ? (
                      <div className="overflow-hidden rounded-lg border border-white/10">
                          <table className="w-full text-sm text-right">
                              <thead className="bg-slate-800 text-slate-300">
                                  <tr>
                                      <th className="p-4 font-medium">{t('reports.gapsTable.indicator')}</th>
                                      <th className="p-4 font-medium">{t('reports.gapsTable.axis')}</th>
                                      <th className="p-4 font-medium text-center">{t('reports.gapsTable.score')}</th>
                                      <th className="p-4 font-medium">{t('reports.gapsTable.recommendation')}</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 bg-slate-900/50">
                                  {gaps.map((gap, idx) => (
                                      <tr key={idx}>
                                          <td className="p-4 text-white font-medium">{gap.name}</td>
                                          <td className="p-4 text-slate-400">{gap.axis}</td>
                                          <td className="p-4 text-center">
                                              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded font-bold text-xs">{gap.score.toFixed(1)}</span>
                                          </td>
                                          <td className="p-4 text-slate-400 text-xs">{t('reports.gapsTable.action')}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  ) : (
                      <div className="p-6 text-center border border-dashed border-white/10 rounded-lg text-emerald-400">
                          {t('reports.gapsTable.noGaps')}
                      </div>
                  )}
              </section>
          )}

          {(reportType === 'comprehensive' || reportType === 'compliance') && (
              <section className="break-inside-avoid">
                  <div className="flex items-center gap-2 mb-6">
                      <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                      <h3 className="text-xl font-bold text-white">{t('reports.riskSection')}</h3>
                  </div>

                  {risks.length > 0 ? (
                      <div className="overflow-hidden rounded-lg border border-white/10">
                          <table className="w-full text-sm text-right">
                              <thead className="bg-slate-800 text-slate-300">
                                  <tr>
                                      <th className="p-4 font-medium">{t('reports.risksTable.description')}</th>
                                      <th className="p-4 font-medium">{t('reports.risksTable.category')}</th>
                                      <th className="p-4 font-medium">{t('reports.risksTable.impact')}</th>
                                      <th className="p-4 font-medium">{t('reports.risksTable.probability')}</th>
                                      <th className="p-4 font-medium">{t('reports.risksTable.mitigation')}</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 bg-slate-900/50">
                                  {risks.slice(0, 8).map((risk: any, i: number) => {
                                      const score = risk.impact * risk.probability;
                                      const color = score >= 15 ? 'text-red-400' : 'text-amber-400';
                                      return (
                                          <tr key={i}>
                                              <td className="p-4 text-white font-medium">{risk.description || `${t('reports.risksTable.risk')} ${i+1}`}</td>
                                              <td className="p-4 text-slate-400">{risk.category || t('compliance.riskCategories.operational')}</td>
                                              <td className={`p-4 font-bold ${color}`}>{risk.impact}</td>
                                              <td className="p-4 text-slate-400">{risk.probability}</td>
                                              <td className="p-4 text-slate-500 text-xs max-w-xs truncate">{risk.mitigation || t('reports.risksTable.review')}</td>
                                          </tr>
                                      )
                                  })}
                              </tbody>
                          </table>
                      </div>
                  ) : (
                      <div className="p-8 text-center border border-dashed border-white/10 rounded-lg text-slate-500">
                          {t('reports.risksTable.noRisks')}
                      </div>
                  )}
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
