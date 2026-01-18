
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Cell, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface FinancialHubProps {
    roi: number;
    netProfit: number;
    equity: number;
    freeCashFlow: number;
}

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

const cardBaseClasses = "glass h-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl";


const ChartCard = ({ title, value, unit, children, color }: { title: string, value: string, unit: string, children: React.ReactNode, color: string }) => {
    return (
        <Card className={cn(cardBaseClasses, "relative overflow-hidden flex flex-col justify-between")} style={{ borderColor: `${color}40`, '--glow-color': color } as React.CSSProperties}>
             <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-transparent via-[var(--glow-color)] to-transparent"></div>
             <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-[var(--glow-color)]/5 blur-3xl"></div>

            <CardContent className="p-4 flex flex-col items-center justify-center text-center flex-grow relative">
                <div className="h-[100px] w-full">
                    {children}
                </div>
                <div className="mt-2 text-center">
                    <p className="text-gray-300 text-sm mb-1">{title}</p>
                    <span className="text-3xl font-bold text-white tracking-tighter">{value}</span>
                    <span className="text-sm font-bold ml-1" style={{ color }}>{unit}</span>
                </div>
            </CardContent>
        </Card>
    );
};

const FinancialHub: React.FC<FinancialHubProps> = ({ roi, netProfit, equity, freeCashFlow }) => {
    const { t } = useLanguage();
    
    const roiData = [{ name: 'ROI', value: roi }];
    const equityData = [{ name: 'Equity', value: 90 }]; // Static for visual effect
    const cashFlowData = [{ name: 'Cash', value: 60 }]; // Static for visual effect
    
    const profitData = [
        { name: 'Q1', value: netProfit * 0.2 },
        { name: 'Q2', value: netProfit * 0.3 },
        { name: 'Q3', value: netProfit * 0.15 },
        { name: 'Q4', value: netProfit * 0.35 },
    ];
    
    const formatMillion = (num: number) => {
        if (Math.abs(num) >= 1_000_000) {
            return `${(num / 1_000_000).toFixed(1)}M`;
        }
        if (Math.abs(num) >= 1_000) {
            return `${(num / 1_000).toFixed(1)}K`;
        }
        return num.toFixed(0);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gold-400 mb-4">{t('dashboard.financial.hubTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0}>
                    <ChartCard 
                        title={t('dashboard.financial.freeCashFlow')}
                        value={formatMillion(freeCashFlow)}
                        unit="OMR"
                        color="#8b5cf6"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                data={cashFlowData}
                                barSize={12}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar
                                    background={{fill: 'rgba(139, 92, 246, 0.1)'}}
                                    dataKey="value"
                                    angleAxisId={0}
                                    fill="#8b5cf6"
                                    cornerRadius={6}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </motion.div>

                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
                     <ChartCard 
                        title={t('dashboard.financial.equity')}
                        value={formatMillion(equity)}
                        unit="OMR"
                        color="#3b82f6"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                data={equityData}
                                barSize={12}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar
                                    background={{fill: 'rgba(59, 130, 246, 0.1)'}}
                                    dataKey="value"
                                    angleAxisId={0}
                                    fill="#3b82f6"
                                    cornerRadius={6}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </motion.div>
                
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
                    <ChartCard 
                        title={t('dashboard.financial.netProfit')}
                        value={formatMillion(netProfit)}
                        unit="OMR"
                        color="#10B981"
                    >
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={profitData}>
                               <defs>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="url(#colorProfit)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </motion.div>

                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
                    <ChartCard 
                        title={t('companyForm.financial.roi')}
                        value={roi.toFixed(1)}
                        unit="%"
                        color="#D4AF37"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                data={roiData}
                                startAngle={180}
                                endAngle={0}
                                barSize={12}
                            >
                                <PolarAngleAxis type="number" domain={[0, Math.max(25, roi)]} angleAxisId={0} tick={false} />
                                <RadialBar
                                    background={{fill: 'rgba(212, 175, 55, 0.1)'}}
                                    dataKey="value"
                                    angleAxisId={0}
                                    fill="#D4AF37"
                                    cornerRadius={6}
                                    className="drop-shadow-[0_2px_4px_var(--glow-color)]"
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </motion.div>
            </div>
        </div>
    );
};

export default FinancialHub;
