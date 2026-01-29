
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Coins,
  Target,
  UploadCloud,
  Save,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCompany } from '@/context/CompanyContext';
import { Badge } from './ui/badge';
import { useYear } from '@/context/YearContext';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

interface FinancialStatementsProps {
    onNavigate: (view: string) => void;
}

const FinancialStatements: React.FC<FinancialStatementsProps> = ({ onNavigate }) => {
  const { language, dir, t } = useLanguage();
  const { toast } = useToast();
  const { selectedZoneId: selectedCompanyId, getSelectedZone, refreshData } = useCompany();
  const { selectedYear } = useYear();
  const selectedCompany = getSelectedZone();
  
  const getStorageKey = (companyId: string, year: number) => `oia_financials_${companyId}_${year}`;

  // --- State Variables ---
  const [infraAssets, setInfraAssets] = useState<number | ''>(''); 
  const [devLiabilities, setDevLiabilities] = useState<number | ''>(''); 
  
  const [usufructRevenue, setUsufructRevenue] = useState<number | ''>(''); 
  const [operatingExpenses, setOperatingExpenses] = useState<number | ''>(''); 
  
  const [govtBudget, setGovtBudget] = useState<number | ''>(''); 
  const [infraCapex, setInfraCapex] = useState<number | ''>(''); 
  const [exportsValue, setExportsValue] = useState<number | ''>(''); 
  
  const [treasuryTransfer, setTreasuryTransfer] = useState<number | ''>(0); 
  const [economicReturn, setEconomicReturn] = useState<number | ''>(''); 
  
  const [isDeclared, setIsDeclared] = useState(false);
  const [auditorName, setAuditorName] = useState('');

  // --- Load Data with DEMO VALUES ---
  useEffect(() => {
    // This function provides mock data if no real data is found.
    const setDemoData = () => {
        setInfraAssets(450000000);   // 450 Million (Assets)
        setDevLiabilities(12500000); // 12.5 Million (Liabilities)
        setUsufructRevenue(28000000); // 28 Million (Revenue)
        setOperatingExpenses(15000000); // 15 Million (Expenses)
        setGovtBudget(10000000);      // 10 Million (Budget)
        setInfraCapex(45000000);      // 45 Million (Capex)
        setExportsValue(1200000000);  // 1.2 Billion (Exports)
        setTreasuryTransfer(5000000); // 5 Million (Transfer)
        setEconomicReturn(12.5);      // 12.5 Return
        setIsDeclared(true);
        setAuditorName('Deloitte & Touche');
    };

    const resetState = () => {
        setInfraAssets(''); setDevLiabilities(''); setUsufructRevenue(''); setOperatingExpenses('');
        setGovtBudget(''); setInfraCapex(''); setExportsValue('');
        setTreasuryTransfer(0); setEconomicReturn(''); setIsDeclared(false);
        setAuditorName('');
    };

    if (!selectedCompanyId || selectedCompanyId === 'all' || typeof window === 'undefined') {
        resetState();
        return;
    }

    const loadData = () => {
        const yearStorageKey = getStorageKey(selectedCompanyId, selectedYear);
        const yearFinancialsStr = localStorage.getItem(yearStorageKey);
        
        if (yearFinancialsStr) {
            const data = JSON.parse(yearFinancialsStr);
            setInfraAssets(data.authorizedCapital || '');
            setDevLiabilities(data.liabilities || '');
            setUsufructRevenue(data.revenue || '');
            setOperatingExpenses(data.expenses || '');
            setGovtBudget(data.operatingCash || '');
            setInfraCapex(data.capex || '');
            setTreasuryTransfer(data.dividends || 0);
            setExportsValue(data.exportsValue || ''); 
            setEconomicReturn(data.economicReturn || '');
            setAuditorName(data.auditorName || '');
            return;
        }
        
        setDemoData();
    };
    
    loadData();

  }, [selectedCompanyId, selectedYear]);

  // --- Calculations ---
  const cumulativeInvestment = Number(infraAssets) || 0; 
  const operatingSurplus = useMemo(() => (Number(usufructRevenue) || 0) - (Number(operatingExpenses) || 0), [usufructRevenue, operatingExpenses]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  const handleSave = () => {
    if (!selectedCompanyId || selectedCompanyId === 'all' || typeof window === 'undefined') {
        toast({ title: t('common.errorTitle'), description: t('common.selectCompanyToStart'), variant: 'destructive'});
        return;
    }
    
    const storageKey = getStorageKey(selectedCompanyId, selectedYear);
    const financialData = {
        authorizedCapital: Number(infraAssets) || 0,
        liabilities: Number(devLiabilities) || 0,
        revenue: Number(usufructRevenue) || 0,
        expenses: Number(operatingExpenses) || 0,
        operatingCash: Number(govtBudget) || 0,
        capex: Number(infraCapex) || 0,
        dividends: Number(treasuryTransfer) || 0,
        exportsValue: Number(exportsValue) || 0,
        economicReturn: Number(economicReturn) || 0,
        lastROI: Number(economicReturn) || 0,
        auditorName,
    };

    localStorage.setItem(storageKey, JSON.stringify(financialData));

    toast({
      title: t('financials.saveSuccessDesc'),
      description: `${t('common.saveSuccessDesc')} ${selectedCompany ? (language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en) : ''}`,
    });
    
    refreshData();
    onNavigate('improvement-plan');
  };

  const handleNumericInput = (setter: React.Dispatch<React.SetStateAction<number | ''>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || value === '-') {
      setter(value);
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        setter(num);
      } else {
        setter('');
      }
    }
  };

  const inputStyles = 'h-14 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white text-lg text-center';
  
  if (!selectedCompanyId || selectedCompanyId === 'all') {
    return (
       <div className="flex items-center justify-center h-full p-8 text-white">
           <div className="text-center p-8 glass">
               <h3 className="text-2xl font-bold text-gold-400">{t('common.selectCompanyToStart')}</h3>
               <p className="text-gray-400 mt-2">{t('common.selectCompanyToStartDesc')}</p>
           </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-6 lg:p-8 text-white" dir={dir}>
      <header className="mb-8 max-w-4xl mx-auto">
        <div className="flex justify-center mb-4">
             {selectedCompany && (
                <Badge className="bg-blue-900/50 border-blue-600 text-blue-300 text-lg">
                    {t('common.editingFor')}: {language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en}
                </Badge>
            )}
        </div>
        <h1 className="text-3xl font-bold text-center mb-4 text-gold-400">{t('financials.title')}</h1>
        <Input
          placeholder={t('financials.auditor')}
          value={auditorName}
          onChange={(e) => setAuditorName(e.target.value)}
          className="h-12 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white text-center"
        />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
          <Card className="glass h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-gold-500">
            <CardHeader className="flex flex-row items-center justify-center gap-4 text-center">
              <Building2 className="w-7 h-7 text-gold-500" />
              <CardTitle className="text-2xl">{t('financials.card1.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">{t('financials.card1.label1')}</label>
                <Input type="text" value={infraAssets === '' ? '' : formatNumber(Number(infraAssets))} onChange={handleNumericInput(setInfraAssets)} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">{t('financials.card1.label2')}</label>
                <Input type="text" value={devLiabilities === '' ? '' : formatNumber(Number(devLiabilities))} onChange={handleNumericInput(setDevLiabilities)} className={inputStyles} />
              </div>
              <div className="p-4 bg-black/30 rounded-lg border border-gold-500/30 text-center mt-4">
                <p className="text-gray-400 text-sm">{t('financials.card1.result')}</p>
                <p className="text-3xl font-bold text-gold-400 tracking-wider">{formatNumber(cumulativeInvestment)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
          <Card className="glass h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-gold-500">
            <CardHeader className="flex flex-row items-center justify-center gap-4 text-center">
              <TrendingUp className="w-7 h-7 text-gold-500" />
              <CardTitle className="text-2xl">{t('financials.card2.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">{t('financials.card2.label1')}</label>
                <Input type="text" value={usufructRevenue === '' ? '' : formatNumber(Number(usufructRevenue))} onChange={handleNumericInput(setUsufructRevenue)} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">{t('financials.card2.label2')}</label>
                <Input type="text" value={operatingExpenses === '' ? '' : formatNumber(Number(operatingExpenses))} onChange={handleNumericInput(setOperatingExpenses)} className={inputStyles} />
              </div>
              <div className={cn('p-4 bg-black/30 rounded-lg border text-center mt-4', operatingSurplus >= 0 ? 'border-emerald-500/30' : 'border-red-500/30')}>
                <p className="text-gray-400 text-sm">{t('financials.card2.result')}</p>
                <p className={cn('text-3xl font-bold tracking-wider', operatingSurplus >= 0 ? 'text-emerald-400' : 'text-red-500')}>{formatNumber(operatingSurplus)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
            <Card className="glass h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-gold-500">
                <CardHeader className="flex flex-row items-center justify-center gap-4 text-center">
                    <Coins className="w-7 h-7 text-gold-500" />
                    <CardTitle className="text-2xl">{t('financials.card3.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-4">
                    <div className="space-y-2">
                        <label className="text-right block pr-2 text-gray-300">{t('financials.card3.label1')}</label>
                        <Input type="text" value={govtBudget === '' ? '' : formatNumber(Number(govtBudget))} onChange={handleNumericInput(setGovtBudget)} className={inputStyles} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-right block pr-2 text-gray-300">{t('financials.card3.label2')}</label>
                        <Input type="text" value={infraCapex === '' ? '' : formatNumber(Number(infraCapex))} onChange={handleNumericInput(setInfraCapex)} className={inputStyles} />
                    </div>
                    <div className="p-4 bg-black/30 rounded-lg border border-blue-500/30 text-center mt-4">
                        <p className="text-gray-400 text-sm mb-2">{t('financials.card3.result')}</p>
                         <Input type="text" value={exportsValue === '' ? '' : formatNumber(Number(exportsValue))} onChange={handleNumericInput(setExportsValue)} className="h-10 bg-transparent border-none text-3xl font-bold text-blue-400 text-center focus:ring-0 placeholder:text-blue-900/50" placeholder="0" />
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
          <Card className="glass h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-gold-500">
            <CardHeader className="flex flex-row items-center justify-center gap-4 text-center">
              <Target className="w-7 h-7 text-gold-500" />
              <CardTitle className="text-2xl">{t('financials.card4.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">{t('financials.card4.label1')}</label>
                <Input type="text" value={treasuryTransfer === '' ? '' : formatNumber(Number(treasuryTransfer))} onChange={handleNumericInput(setTreasuryTransfer)} className={inputStyles} />
              </div>
               <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">{t('financials.card4.label2')}</label>
                <Input type="text" value={economicReturn === '' ? '' : Number(economicReturn)} onChange={handleNumericInput(setEconomicReturn)} className={inputStyles} placeholder="0.0" />
              </div>
              <div className="p-4 bg-black/30 rounded-lg border border-emerald-500/30 mt-4 space-y-3">
                <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-300">{t('financials.card4.result')}</span>
                    <span className="font-bold text-emerald-400">{Number(economicReturn).toFixed(1)}</span>
                </div>
                <Progress value={Math.min(Number(economicReturn) * 10, 100)} className="h-3 [&>div]:bg-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div className="max-w-7xl mx-auto mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
        <Card className="glass transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-gold-500">
          <CardHeader>
            <CardTitle className="text-center text-xl text-gold-400">{t('financials.declaration')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative border-2 border-dashed border-gray-500 rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-300 mb-2">{t('financials.upload')}</p>
              <Input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <div className="flex items-center space-x-3 space-x-reverse justify-center">
              <Checkbox id="declaration" checked={isDeclared} onCheckedChange={(checked) => setIsDeclared(checked as boolean)} className="data-[state=checked]:bg-gold-500 data-[state=checked]:border-gold-400" />
              <label htmlFor="declaration" className="text-lg font-medium">{t('financials.declaration')}</label>
            </div>
            <div className="flex justify-center pt-4">
              <Button size="lg" className="bg-gold-500 text-royal-900 hover:bg-gold-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed w-1/2 h-16 text-xl font-bold" disabled={!isDeclared} onClick={handleSave}>
                <Save />
                {t('financials.save')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FinancialStatements;
