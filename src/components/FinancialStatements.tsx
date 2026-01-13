"use client";

import React, { useState, useMemo } from 'react';
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
  const { t, dir } = useLanguage();
  const { toast } = useToast();


  const [assets, setAssets] = useState<number | ''>('');
  const [liabilities, setLiabilities] = useState<number | ''>('');
  const [revenue, setRevenue] = useState<number | ''>('');
  const [expenses, setExpenses] = useState<number | ''>('');
  const [operatingCash, setOperatingCash] = useState<number | ''>('');
  const [capex, setCapex] = useState<number | ''>('');
  const [dividends, setDividends] = useState<number | ''>('');
  const [isDeclared, setIsDeclared] = useState(false);

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
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ بياناتك المالية.",
    });
  };

  const handleNumericInput = (setter: React.Dispatch<React.SetStateAction<number | ''>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || value === '-') {
      setter(value);
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        setter(num);
      }
    }
  };


  const inputStyles =
    'h-14 bg-[#112620] border-white/10 focus:border-gold-500 rounded-lg text-white text-lg text-center';

  return (
    <div
      className="min-h-screen w-full p-4 md:p-6 lg:p-8 text-white"
      style={{ background: '#051a14' }}
      dir={dir}
    >
      <header className="mb-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 text-gold-400">القوائم المالية والحوكمة</h1>
        <Input
          placeholder="اسم مكتب التدقيق الخارجي..."
          className="h-12 bg-[#112620]/80 border-white/10 focus:border-gold-500 rounded-lg text-white text-center"
        />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Financial Position Card */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
          <Card className="glass bg-[#112620] border-white/10 h-full">
            <CardHeader className="flex flex-row items-center justify-center gap-4 text-center">
              <Landmark className="w-7 h-7 text-gold-500" />
              <CardTitle className="text-2xl">المركز المالي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">إجمالي الأصول</label>
                <Input
                  type="text"
                  pattern="[0-9-]*"
                  value={assets === '' ? '' : formatNumber(assets)}
                  onChange={(e) => setAssets(e.target.value.replace(/,/g, '')==='-'?'-':(parseFloat(e.target.value.replace(/,/g, '')) || ''))}
                  className={inputStyles}
                  placeholder=""
                />
              </div>
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">إجمالي الالتزامات</label>
                <Input
                  type="text"
                  pattern="[0-9-]*"
                  value={liabilities === '' ? '' : formatNumber(liabilities)}
                  onChange={(e) => setLiabilities(e.target.value.replace(/,/g, '')==='-'?'-':(parseFloat(e.target.value.replace(/,/g, '')) || ''))}
                  className={inputStyles}
                  placeholder=""
                />
              </div>
              <div className="p-4 bg-black/30 rounded-lg border border-gold-500/30 text-center mt-4">
                <p className="text-gray-400 text-sm">حقوق الملكية</p>
                <p className="text-3xl font-bold text-gold-400 tracking-wider">
                  {formatNumber(equity)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income Statement Card */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
          <Card className="glass bg-[#112620] border-white/10 h-full">
            <CardHeader className="flex flex-row items-center justify-center gap-4 text-center">
              <TrendingUp className="w-7 h-7 text-gold-500" />
              <CardTitle className="text-2xl">الأداء المالي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">الإيرادات</label>
                <Input
                  type="text"
                  pattern="[0-9-]*"
                  value={revenue === '' ? '' : formatNumber(revenue)}
                  onChange={(e) => setRevenue(e.target.value.replace(/,/g, '')==='-'?'-':(parseFloat(e.target.value.replace(/,/g, '')) || ''))}
                  className={inputStyles}
                  placeholder=""
                />
              </div>
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">المصروفات</label>
                <Input
                  type="text"
                  pattern="[0-9-]*"
                  value={expenses === '' ? '' : formatNumber(expenses)}
                  onChange={(e) => setExpenses(e.target.value.replace(/,/g, '')==='-'?'-':(parseFloat(e.target.value.replace(/,/g, '')) || ''))}
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
                <p className="text-gray-400 text-sm">صافي الربح/الخسارة</p>
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
            <Card className="glass bg-[#112620] border-white/10 h-full">
                <CardHeader className="flex flex-row items-center justify-center gap-4 text-center">
                    <Filter className="w-7 h-7 text-gold-500" />
                    <CardTitle className="text-2xl">السيولة والتدفق النقدي الحر</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-4">
                    <div className="space-y-2">
                        <label className="text-right block pr-2 text-gray-300">النقد التشغيلي</label>
                        <Input
                            type="text"
                            pattern="[0-9-]*"
                            value={operatingCash === '' ? '' : formatNumber(operatingCash)}
                            onChange={(e) => setOperatingCash(e.target.value.replace(/,/g, '')==='-'?'-':(parseFloat(e.target.value.replace(/,/g, '')) || ''))}
                            className={inputStyles}
                            placeholder=""
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-right block pr-2 text-gray-300">الإنفاق الرأسمالي (CAPEX)</label>
                        <Input
                            type="text"
                            pattern="[0-9-]*"
                            value={capex === '' ? '' : formatNumber(capex)}
                            onChange={(e) => setCapex(e.target.value.replace(/,/g, '')==='-'?'-':(parseFloat(e.target.value.replace(/,/g, '')) || ''))}
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
                        <p className="text-gray-400 text-sm">التدفق النقدي الحر (FCF)</p>
                        <p className={cn('text-3xl font-bold tracking-wider', freeCashFlow >= 0 ? 'text-emerald-400' : 'text-red-500')}>
                            {formatNumber(freeCashFlow)}
                        </p>
                        <p className={cn('text-xs mt-1', freeCashFlow >= 0 ? 'text-emerald-500' : 'text-red-600')}>
                            {freeCashFlow >= 0 ? 'متاح للتوزيعات/سداد الديون' : 'إحتراق نقدي'}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* Investment Returns Card */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
          <Card className="glass bg-[#112620] border-white/10 h-full">
            <CardHeader className="flex flex-row items-center justify-center gap-4 text-center">
              <Target className="w-7 h-7 text-gold-500" />
              <CardTitle className="text-2xl">مؤشرات الأداء</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-right block pr-2 text-gray-300">توزيعات الأرباح المعلنة</label>
                <Input
                  type="text"
                  pattern="[0-9-]*"
                  value={dividends === '' ? '' : formatNumber(dividends)}
                  onChange={(e) => setDividends(e.target.value.replace(/,/g, '')==='-'?'-':(parseFloat(e.target.value.replace(/,/g, '')) || ''))}
                  className={inputStyles}
                  placeholder=""
                />
              </div>
              <div className="p-4 bg-black/30 rounded-lg border border-emerald-500/30 mt-4 space-y-3">
                <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-300">العائد على الاستثمار (ROI)</span>
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
        <Card className="glass bg-[#112620] border-white/10">
          <CardHeader>
            <CardTitle className="text-center text-xl text-gold-400">المرفقات والإقرار</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative border-2 border-dashed border-gray-500 rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-300 mb-2">قم بسحب وإفلات تقرير المدقق المالي (PDF) هنا، أو اضغط للاختيار</p>
              <p className="text-xs text-gray-500">حجم الملف الأقصى: 10MB</p>
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
                أقر بصحة البيانات المالية المقدمة
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
                حفظ البيانات المالية
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FinancialStatements;

    