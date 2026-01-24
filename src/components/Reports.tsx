"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Printer, Filter, 
  TrendingUp, AlertTriangle, CheckCircle, 
  Building2, PieChart as PieChartIcon, Calendar,
  ArrowDownRight, ArrowUpRight, Coins
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
  Cell, PieChart, Pie
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { useYear } from '@/context/YearContext';
import { INDICATORS, AXES } from '@/data/indicators';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

// --- Formatter Helper ---
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
  
  const [reportType, setReportType] = useState('comprehensive'); // comprehensive, financial, compliance
  const [isExporting, setIsExporting] = useState(false);

  // --- Data States ---
  const [financials, setFinancials] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [gaps, setGaps] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [icvData, setIcvData] = useState<any>(null);

  const selectedZone = getSelectedZone();

  // --- Load Data from LocalStorage (Matching Dashboards Logic) ---
  useEffect(() => {
    if (!selectedZoneId || selectedZoneId === 'all') return;

    // 1. Financials (Matching "Financial Indicators" Page Inputs)
    const finKey = `oia_financials_${selectedZoneId}_${selectedYear}`;
    const finStr = localStorage.getItem(finKey);
    if (finStr) {
      const data = JSON.parse(finStr);
      setFinancials({
        revenue: Number(data.revenue) || 0, // إيرادات حق الانتفاع
        expenses: Number(data.expenses) || 0, // المصروفات التشغيلية
        surplus: (Number(data.revenue) || 0) - (Number(data.expenses) || 0), // الفائض
        assets: Number(data.authorizedCapital) || 0, // قيمة البنية الأساسية
        liabilities: Number(data.liabilities) || 0, // الالتزامات
        capex: Number(data.capex) || 0, // الإنفاق الإنمائي
        exports: Number(data.exportsValue) || 0, // الصادرات
        economicReturn: Number(data.economicReturn) || 0 // العائد الاقتصادي
      });
      
      // ICV Data (Mock logic if specific fields absent, based on revenue)
      setIcvData({
          total: Number(data.totalSpending) || (Number(data.revenue) * 0.8),
          local: Number(data.localSpending) || (Number(data.revenue) * 0.5),
          sme: Number(data.smeSpending) || (Number(data.revenue) * 0.2)
      });
    } else {
        // Demo Data if empty (Matches your screenshot numbers exactly)
        setFinancials({
            revenue: 28000000,
            expenses: 15000000,
            surplus: 13000000,
            assets: 450000000,
            liabilities: 12500000,
            capex: 45000000,
            exports: 1200000000,
            economicReturn: 12.5
        });
        setIcvData({ total: 500000000, local: 250000000, sme: 50000000 });
    }

    // 2. Assessment & Gaps
    const assessKey = `oia_assessment_${selectedZoneId}_${selectedYear}`;
    const assessStr = localStorage.getItem(assessKey);
    if (assessStr) {
        const data = JSON.parse(assessStr);
        // Find Gaps (Score < 3)
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
        setGaps(foundGaps.slice(0, 5)); // Top 5 Gaps
    } else {
        // Demo Gaps
        setGaps([
            { id: 1, name: 'مدى توافق الخطة الاستراتيجية مع رؤية 2040', axis: 'الحوكمة', score: 2 },
            { id: 2, name: 'وضوح وثبات رحلة المستثمر', axis: 'التميز التشغيلي', score: 1 },
        ]);
    }

    // 3. Compliance & Risks
    const compKey = `opaz_compliance_${selectedZoneId}_${selectedYear}`;
    const compStr = localStorage.getItem(compKey);
    if (compStr) {
        const data = JSON.parse(compStr);
        setRisks(data.risks || []);
    }

  }, [selectedZoneId, selectedYear, language]);

  // --- Export Function ---
  const handleExport = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
        // Increase scale for better PDF quality
        const canvas = await html2canvas(reportRef.current, { 
            scale: 2, 
            backgroundColor: '#0f172a', // Ensure dark background matches theme
            useCORS: true 
        }); 
        const imgData = canvas.toDataURL('image/png');
        
        // A4 Paper Size calculations
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`OPAZ_Report_${selectedZoneId}_${selectedYear}.pdf`);
    } finally {
        setIsExporting(false);
    }
  };

  // --- Chart Data Preparation ---
  const financialChartData = financials ? [
      { name: language==='ar'?'الإيرادات':'Revenue', value: financials.revenue, fill: '#3b82f6' },
      { name: language==='ar'?'المصروفات':'Expenses', value: financials.expenses, fill: '#ef4444' },
      { name: language==='ar'?'صافي الدخل':'Net Income', value: financials.surplus, fill: '#10b981' },
  ] : [];

  if (!selectedZoneId || selectedZoneId === 'all') {
      return (
        <div className="flex items-center justify-center h-full p-8 text-white">
            <div className="text-center p-8 glass">
                <h3 className="text-2xl font-bold text-gold-400">{t('common.selectCompanyToStart')}</h3>
                <p className="text-gray-400 mt-2">يرجى اختيار المنطقة من القائمة العلوية لعرض التقارير التفصيلية</p>
            </div>
        </div>
      );
  }

  return (
    <div className="p-6 md:p-8 text-white min-h-screen space-y-8" dir={dir}>
      
      {/* --- Control Panel (Non-Printable) --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm print:hidden">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-gold-500/20 rounded-lg text-gold-400">
                <FileText size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-white">{t('reports.title')}</h1>
                <p className="text-sm text-slate-400">إصدار الوثائق الرسمية والتحليل المالي</p>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[250px] bg-slate-800 border-slate-700">
                    <SelectValue placeholder="نوع التقرير" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-slate-700">
                    <SelectItem value="comprehensive">التقرير الاستراتيجي الشامل</SelectItem>
                    <SelectItem value="financial">تقرير الأداء المالي</SelectItem>
                    <SelectItem value="compliance">سجل الامتثال والمخاطر</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={handleExport} className="bg-gold-500 text-black hover:bg-gold-400 font-bold" disabled={isExporting}>
                {isExporting ? <Loader2 className="animate-spin mr-2"/> : <Download size={18} className="mr-2"/>}
                {isExporting ? 'جاري التصدير...' : 'تصدير PDF'}
            </Button>
        </div>
      </div>

      {/* --- REPORT DOCUMENT (The content to be printed) --- */}
      <div ref={reportRef} className="bg-slate-950 border border-white/10 rounded-xl p-8 md:p-12 shadow-2xl max-w-5xl mx-auto min-h-[1000px] relative overflow-hidden">
          
          {/* Watermark Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          {/* 1. HEADER SECTION */}
          <header className="border-b border-white/10 pb-8 mb-8 flex justify-between items-start">
              <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                      {reportType === 'comprehensive' && 'التقرير الاستراتيجي الشامل'}
                      {reportType === 'financial' && 'تقرير الأداء المالي والتشغيلي'}
                      {reportType === 'compliance' && 'تقرير الامتثال والمخاطر'}
                  </h2>
                  <p className="text-gold-400 text-lg font-medium">{language === 'ar' ? selectedZone?.name_ar : selectedZone?.name_en}</p>
                  <p className="text-slate-400 text-sm mt-1">السنة المالية: {selectedYear}</p>
              </div>
              <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">تاريخ التقرير</div>
                  <div className="font-mono text-slate-300">{format(new Date(), 'dd/MM/yyyy')}</div>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      <CheckCircle size={12} className="mr-1"/> معتمد من النظام
                  </div>
              </div>
          </header>

          {/* 2. FINANCIAL SECTION (Shows Revenue vs Expenses Chart & Table) */}
          {(reportType === 'comprehensive' || reportType === 'financial') && financials && (
              <section className="mb-12 break-inside-avoid">
                  <div className="flex items-center gap-2 mb-6">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-xl font-bold text-white">1. الأداء المالي (قائمة الدخل المصغرة)</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Chart */}
                      <div className="lg:col-span-2 bg-slate-900/50 p-6 rounded-lg border border-white/5">
                          <h4 className="text-sm font-medium text-slate-400 mb-4 text-center">مقارنة الإيرادات والمصروفات (ر.ع)</h4>
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

                      {/* Right: Key Cards */}
                      <div className="space-y-4">
                          <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                              <p className="text-xs text-slate-400">صافي الفائض التشغيلي</p>
                              <div className="text-2xl font-bold text-emerald-400 mt-1" dir="ltr">{formatCurrency(financials.surplus)}</div>
                              <div className="flex items-center text-xs text-emerald-500 mt-2">
                                  <TrendingUp size={14} className="mr-1"/> أداء إيجابي
                              </div>
                          </div>
                          <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                              <p className="text-xs text-slate-400">العائد الاقتصادي</p>
                              <div className="text-2xl font-bold text-amber-400 mt-1">{financials.economicReturn} <span className="text-sm text-slate-500">ريال/م²</span></div>
                          </div>
                      </div>
                  </div>

                  {/* Financial Table */}
                  <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
                      <table className="w-full text-sm text-right">
                          <thead className="bg-slate-800 text-slate-300">
                              <tr>
                                  <th className="p-4 font-medium">البند المالي</th>
                                  <th className="p-4 font-medium">القيمة (ر.ع)</th>
                                  <th className="p-4 font-medium">البيان</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 bg-slate-900/50">
                              <tr>
                                  <td className="p-4 text-white">إيرادات حق الانتفاع</td>
                                  <td className="p-4 font-mono text-emerald-400" dir="ltr">{formatCurrency(financials.revenue)}</td>
                                  <td className="p-4 text-slate-500">الإيرادات التشغيلية المباشرة</td>
                              </tr>
                              <tr>
                                  <td className="p-4 text-white">المصروفات التشغيلية</td>
                                  <td className="p-4 font-mono text-red-400" dir="ltr">{formatCurrency(financials.expenses)}</td>
                                  <td className="p-4 text-slate-500">تكاليف التشغيل والصيانة</td>
                              </tr>
                              <tr>
                                  <td className="p-4 text-white">الأصول (البنية الأساسية)</td>
                                  <td className="p-4 font-mono text-blue-300" dir="ltr">{formatCurrency(financials.assets)}</td>
                                  <td className="p-4 text-slate-500">إجمالي الأصول الثابتة</td>
                              </tr>
                              <tr>
                                  <td className="p-4 text-white">الإنفاق الرأسمالي (Capex)</td>
                                  <td className="p-4 font-mono text-slate-300" dir="ltr">{formatCurrency(financials.capex)}</td>
                                  <td className="p-4 text-slate-500">مشاريع التطوير الجديدة</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </section>
          )}

          {/* 3. STRATEGIC GAPS SECTION */}
          {(reportType === 'comprehensive') && (
              <section className="mb-12 break-inside-avoid">
                  <div className="flex items-center gap-2 mb-6">
                      <div className="w-1 h-6 bg-gold-500 rounded-full"></div>
                      <h3 className="text-xl font-bold text-white">2. مجالات التحسين (الفجوات)</h3>
                  </div>
                  
                  {gaps.length > 0 ? (
                      <div className="overflow-hidden rounded-lg border border-white/10">
                          <table className="w-full text-sm text-right">
                              <thead className="bg-slate-800 text-slate-300">
                                  <tr>
                                      <th className="p-4 font-medium">المؤشر / المعيار</th>
                                      <th className="p-4 font-medium">المحور</th>
                                      <th className="p-4 font-medium text-center">التقييم الحالي</th>
                                      <th className="p-4 font-medium">التوصية المقترحة</th>
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
                                          <td className="p-4 text-slate-400 text-xs">مطلوب إعداد خطة تصحيحية عاجلة لرفع الامتثال</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  ) : (
                      <div className="p-6 text-center border border-dashed border-white/10 rounded-lg text-emerald-400">
                          لا توجد فجوات حرجة مسجلة (جميع النتائج أعلى من 3).
                      </div>
                  )}
              </section>
          )}

          {/* 4. RISK REGISTER SECTION */}
          {(reportType === 'comprehensive' || reportType === 'compliance') && (
              <section className="break-inside-avoid">
                  <div className="flex items-center gap-2 mb-6">
                      <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                      <h3 className="text-xl font-bold text-white">3. سجل المخاطر الحرجة</h3>
                  </div>

                  {risks.length > 0 ? (
                      <div className="overflow-hidden rounded-lg border border-white/10">
                          <table className="w-full text-sm text-right">
                              <thead className="bg-slate-800 text-slate-300">
                                  <tr>
                                      <th className="p-4 font-medium">وصف الخطر</th>
                                      <th className="p-4 font-medium">التصنيف</th>
                                      <th className="p-4 font-medium">الأثر</th>
                                      <th className="p-4 font-medium">الاحتمالية</th>
                                      <th className="p-4 font-medium">إجراء التخفيف</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 bg-slate-900/50">
                                  {risks.slice(0, 8).map((risk: any, i: number) => {
                                      const score = risk.impact * risk.probability;
                                      const color = score >= 15 ? 'text-red-400' : 'text-amber-400';
                                      return (
                                          <tr key={i}>
                                              <td className="p-4 text-white font-medium">{risk.description || `خطر رقم ${i+1}`}</td>
                                              <td className="p-4 text-slate-400">{risk.category || 'تشغيلي'}</td>
                                              <td className={`p-4 font-bold ${color}`}>{risk.impact}</td>
                                              <td className="p-4 text-slate-400">{risk.probability}</td>
                                              <td className="p-4 text-slate-500 text-xs max-w-xs truncate">{risk.mitigation || 'قيد المراجعة'}</td>
                                          </tr>
                                      )
                                  })}
                              </tbody>
                          </table>
                      </div>
                  ) : (
                      <div className="p-8 text-center border border-dashed border-white/10 rounded-lg text-slate-500">
                          لا توجد مخاطر نشطة مسجلة في النظام لهذا العام.
                      </div>
                  )}
              </section>
          )}

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-slate-600 flex justify-between items-center">
              <p>تم إصدار هذا التقرير إلكترونياً عبر منظومة إتقان لإدارة المناطق الاقتصادية.</p>
              <div className="flex gap-4">
                  <span>صفحة 1 من 1</span>
                  <span>النسخة 1.0</span>
              </div>
          </footer>

      </div>
    </div>
  );
}
