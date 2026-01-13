
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface FinancialHubProps {
    roi: number;
    netProfit: number;
    equity: number;
}

const ChartCard = ({ title, value, unit, chartData, color, isSemiCircle = false }: { title: string, value: string, unit: string, chartData: any[], color: string, isSemiCircle?: boolean }) => {
    const endAngle = isSemiCircle ? 0 : 360;
    const startAngle = isSemiCircle ? 180 : 0;
    
    return (
        <Card className="glass relative overflow-hidden h-full flex flex-col justify-between transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl" style={{ borderColor: `${color}40`, '--glow-color': color } as React.CSSProperties}>
             <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-transparent via-[var(--glow-color)] to-transparent"></div>
             <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-[var(--glow-color)]/5 blur-3xl"></div>

            <CardContent className="p-4 flex flex-col items-center justify-center text-center flex-grow relative">
                <ResponsiveContainer width="100%" height={150}>
                    <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        data={chartData}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        barSize={12}
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar
                            background
                            dataKey="value"
                            angleAxisId={0}
                            fill={color}
                            cornerRadius={6}
                            className="drop-shadow-[0_2px_4px_var(--glow-color)]"
                        />
                         <defs>
                            <filter id={`glow-${color.slice(1)}`}>
                                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
                    <p className="text-gray-300 text-xs mb-1">{title}</p>
                    <span className="text-3xl font-bold text-white tracking-tighter">{value}</span>
                    <span className="text-sm font-bold" style={{ color }}>{unit}</span>
                </div>
            </CardContent>
        </Card>
    );
};

const FinancialHub: React.FC<FinancialHubProps> = ({ roi, netProfit, equity }) => {
    const { t } = useLanguage();
    
    const roiData = [{ name: 'ROI', value: roi * 10 }]; // Scale for 0-100 domain
    const profitData = [{ name: 'Profit', value: 85 }]; // Example static value for full ring
    const equityData = [{ name: 'Equity', value: 90 }];
    const cashFlowData = [{ name: 'Cash', value: 60 }];
    
    const formatMillion = (num: number) => {
        if (num >= 1_000_000) {
            return `${(num / 1_000_000).toFixed(1)}M`;
        }
        if (num >= 1_000) {
            return `${(num / 1_000).toFixed(1)}K`;
        }
        return num.toFixed(0);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gold-400 mb-4">{t('companyForm.financial.title')} Hub</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ChartCard 
                    title={t('companyForm.financial.roi')}
                    value={roi.toFixed(1)}
                    unit="%"
                    chartData={roiData}
                    color="#D4AF37"
                    isSemiCircle
                />
                <ChartCard 
                    title="صافي الأرباح"
                    value={formatMillion(netProfit)}
                    unit="OMR"
                    chartData={profitData}
                    color="#10B981"
                />
                <ChartCard 
                    title="حقوق الملكية"
                    value={formatMillion(equity)}
                    unit="OMR"
                    chartData={equityData}
                    color="#3b82f6"
                />
                <ChartCard 
                    title="التدفق النقدي الحر"
                    value={formatMillion(netProfit * 0.2)}
                    unit="OMR"
                    chartData={cashFlowData}
                    color="#8b5cf6"
                />
            </div>
        </div>
    );
};

export default FinancialHub;

    