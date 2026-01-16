"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Landmark,
  TrendingUp,
  ArrowRightLeft,
  Target,
  UploadCloud,
  CheckSquare,
  Save,
  Filter,
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

const FinancialStatements: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const { toast } = useToast();
  const { selectedCompanyId, getSelectedCompany } = useCompany();
  const selectedCompany = getSelectedCompany();
  
  const getStorageKey = () => `oia_companies_registry`;

  const [assets, setAssets] = useState<number | ''>('');
  const [liabilities, setLiabilities] = useState<number | ''>('');
  const [revenue, setRevenue] = useState<number | ''>('');
  const [expenses, setExpenses] = useState<number | ''>('');
  const [operatingCash, setOperatingCash] = useState<number | ''>('');
  const [capex, setCapex] = useState<number | ''>('');
  const [dividends, setDividends] = useState<number | ''>(0);
  const [isDeclared, setIsDeclared] = useState(false);
  const [auditorName, setAuditorName] = useState('');

  // Load data when company changes
  useEffect(() => {
    if (!selectedCompanyId || selectedCompanyId === 'all' || typeof window === 'undefined') {
        // Reset fields if no company is selected
        setAssets(''); setLiabilities(''); setRevenue(''); setExpenses('');
        setOperatingCash(''); setCapex(''); setDividends(0); setIsDeclared(false);
        setAuditorName('');
        return;
    }

    const storageKey = getStorageKey();
    const allCompaniesStr = localStorage.getItem(storageKey);
    if (allCompaniesStr) {
        const allCompanies = JSON.parse(allCompaniesStr);
        const companyData = allCompanies.find((c: any) => c.id === selectedCompanyId);
        if(companyData) {
            setAssets(companyData.authorizedCapital || '');
            setLiabilities(companyData.liabilities || ''); // Assuming liabilities is a field
            setRevenue(companyData.revenue || ''); // Assuming revenue is a field
            setExpenses(companyData.expenses || ''); // Assuming expenses is a field
            setOperatingCash(companyData.operatingCash || '');
            setCapex(companyData.capex || '');
            setDividends(companyData.dividends || 0);
            setAuditorName(companyData.auditorName || '');
            // We don't load 'isDeclared' state
        }
    }
  }, [selectedCompanyId]);


  const equity = useMemo(() => (Number(assets) || 0) - (Number(liabilities) || 0), [assets, liabilities]);
  const netProfit = useMemo(() => (Number(revenue) || 0) - (Number(expenses) || 0), [revenue, expenses]);
  const freeCashFlow = useMemo(
    () => (Number(operatingCash) || 0) - (Number(capex) || 0),
    [operatingCash, capex]
  );
  const roi = useMemo(
    () => ((Number(assets) || 0) > 0 ? (netProfit / (Number(assets) || 1)) * 100 : 0),
    [netProfit, assets]
  );

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  const handleSave = () => {
    if (!selectedCompanyId || selectedCompanyId === 'all' || typeof window === 'undefined') {
        toast({ title: t('common.errorTitle'), description: t('common.selectCompanyToStart'), variant: 'destructive'});
        return;
    }
    
    const storageKey = getStorageKey();
    const allCompaniesStr = localStorage.getItem(storageKey);
    let allCompanies = allCompaniesStr ? JSON.parse(allCompaniesStr) : [];
    
    const companyIndex = allCompanies.findIndex((c: any) => c.id === selectedCompanyId);

    if (companyIndex > -1) {
        const companyData = allCompanies[companyIndex];
        const updatedCompany = {
            ...companyData,
            authorizedCapital: Number(assets) || 0,
            liabilities: Number(liabilities) || 0,
            revenue: Number(revenue) || 0,
            expenses: Number(expenses) || 0,
            operatingCash: Number(operatingCash) || 0,
            capex: Number(capex) || 0,
            dividends: Number(dividends) || 0,
            lastROI: roi,
            auditorName,
        };
        allCompanies[companyIndex] = updatedCompany;
    } else {
        // This case should ideally not happen if form is only shown for existing companies
        toast({ title: t('common.errorTitle'), description: "Could not find company to update.", variant: 'destructive'});
        return;
    }

    localStorage.setItem(storageKey, JSON.stringify(allCompanies));

    toast({
      title: t('common.saveSuccessTitle'),
      description: `${t('financials.saveSuccessDesc')} ${selectedCompany ? (language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en): ''}.`,
    });
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


  const inputStyles =
    'h-14 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white text-lg text-center';
  
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
    <div
      className="min-h-screen w-full p-4 md:p-6 lg:p-8 text-white"
      dir={dir}
    >
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
          placeholder={t('financials.auditorPlaceholder')}
          value={auditorName}
          onChange={(e) => setAuditorName(e.target.value)}
          className="h-12 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white text-center"
        />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Financial Position Card */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
          <Card className="glass h-full">
            <CardHeader className="flex flex-row items-center justify-center gap-4 text-center">
              <Landmark className="w-7 h-7 text-gold-500" />
              <CardTitle className="text-2xl">{t('financials.position.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">{t('financials.position.assets')}</label>
                <Input
                  type="text"
                  value={assets === '' ? '' : formatNumber(Number(assets))}
                  onChange={handleNumericInput(setAssets)}
                  className={inputStyles}
                  placeholder=""
                />
              </div>
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">{t('financials.position.liabilities')}</label>
                <Input
                  type="text"
                  value={liabilities === '' ? '' : formatNumber(Number(liabilities))}
                  onChange={handleNumericInput(setLiabilities)}
                  className={inputStyles}
                  placeholder=""
                />
              </div>
              <div className="p-4 bg-black/30 rounded-lg border border-gold-500/30 text-center mt-4">
                <p className="text-gray-400 text-sm">{t('financials.position.equity')}</p>
                <p className="text-3xl font-bold text-gold-400 tracking-wider">
                  {formatNumber(equity)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income Statement Card */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
          <Card className="glass h-full">
            <CardHeader className="flex flex-row items-center justify-center gap-4 text-center">
              <TrendingUp className="w-7 h-7 text-gold-500" />
              <CardTitle className="text-2xl">{t('financials.performance.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">{t('financials.performance.revenue')}</label>
                <Input
                  type="text"
                  value={revenue === '' ? '' : formatNumber(Number(revenue))}
                  onChange={handleNumericInput(setRevenue)}
                  className={inputStyles}
                  placeholder=""
                />
              </div>
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">{t('financials.performance.expenses')}</label>
                <Input
                  type="text"
                  value={expenses === '' ? '' : formatNumber(Number(expenses))}
                  onChange={handleNumericInput(setExpenses)}
                  className={inputStyles}
                  placeholder=""
                />
              </div>
              <div
                className={cn(
                  'p-4 bg-black/30 rounded-lg border text-center mt-4',
                  netProfit >= 0
                    ? 'border-emerald-500/30'
                    : 'border-red-500/30'
                )}
              >
                <p className="text-gray-400 text-sm">{t('financials.performance.netProfit')}</p>
                <p
                  className={cn(
                    'text-3xl font-bold tracking-wider',
                    netProfit >= 0 ? 'text-emerald-400' : 'text-red-500'
                  )}
                >
                  {formatNumber(netProfit)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Free Cash Flow Card */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
            <Card className="glass h-full">
                <CardHeader className="flex flex-row items-center justify-center gap-4 text-center">
                    <Filter className="w-7 h-7 text-gold-500" />
                    <CardTitle className="text-2xl">{t('financials.cashflow.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-4">
                    <div className="space-y-2">
                        <label className="text-right block pr-2 text-gray-300">{t('financials.cashflow.operating')}</label>
                        <Input
                            type="text"
                            value={operatingCash === '' ? '' : formatNumber(Number(operatingCash))}
                            onChange={handleNumericInput(setOperatingCash)}
                            className={inputStyles}
                            placeholder=""
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-right block pr-2 text-gray-300">{t('financials.cashflow.capex')}</label>
                        <Input
                            type="text"
                            value={capex === '' ? '' : formatNumber(Number(capex))}
                            onChange={handleNumericInput(setCapex)}
                            className={inputStyles}
                            placeholder=""
                        />
                    </div>
                    <div
                        className={cn(
                            'p-4 bg-black/30 rounded-lg border text-center mt-4',
                            freeCashFlow >= 0 ? 'border-emerald-500/30' : 'border-red-500/30'
                        )}
                    >
                        <p className="text-gray-400 text-sm">{t('financials.cashflow.fcf')}</p>
                        <p className={cn('text-3xl font-bold tracking-wider', freeCashFlow >= 0 ? 'text-emerald-400' : 'text-red-500')}>
                            {formatNumber(freeCashFlow)}
                        </p>
                        <p className={cn('text-xs mt-1', freeCashFlow >= 0 ? 'text-emerald-500' : 'text-red-600')}>
                            {freeCashFlow >= 0 ? t('financials.cashflow.fcfPositive') : t('financials.cashflow.fcfNegative')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* Investment Returns Card */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
          <Card className="glass h-full">
            <CardHeader className="flex flex-row items-center justify-center gap-4 text-center">
              <Target className="w-7 h-7 text-gold-500" />
              <CardTitle className="text-2xl">{t('financials.kpi.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">{t('financials.kpi.dividends')}</label>
                <Input
                  type="text"
                  value={dividends === '' ? '' : formatNumber(Number(dividends))}
                  onChange={handleNumericInput(setDividends)}
                  className={inputStyles}
                  placeholder=""
                />
              </div>
              <div className="p-4 bg-black/30 rounded-lg border border-emerald-500/30 mt-4 space-y-3">
                <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-300">{t('financials.kpi.roi')}</span>
                    <span className="font-bold text-emerald-400">{roi.toFixed(2)}%</span>
                </div>
                <Progress value={roi} className="h-3 [&>div]:bg-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer Section */}
      <motion.div
        className="max-w-7xl mx-auto mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-center text-xl text-gold-400">{t('financials.declaration.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative border-2 border-dashed border-gray-500 rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-300 mb-2">{t('financials.declaration.uploadDesc')}</p>
              <p className="text-xs text-gray-500">{t('financials.declaration.uploadHint')}</p>
              <Input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>

            <div className="flex items-center space-x-3 space-x-reverse justify-center">
              <Checkbox
                id="declaration"
                checked={isDeclared}
                onCheckedChange={(checked) => setIsDeclared(checked as boolean)}
                className="data-[state=checked]:bg-gold-500 data-[state=checked]:border-gold-400"
              />
              <label htmlFor="declaration" className="text-lg font-medium">
                {t('financials.declaration.checkbox')}
              </label>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                className="bg-gold-500 text-royal-900 hover:bg-gold-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed w-1/2 h-16 text-xl font-bold"
                disabled={!isDeclared}
                onClick={handleSave}
              >
                <Save className="ml-3" />
                {t('financials.declaration.saveButton')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FinancialStatements;
