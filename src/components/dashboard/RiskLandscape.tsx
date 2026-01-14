
"use client";
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const riskLevels = [
  { level: 'Low', color: 'bg-emerald-600/50', label_ar: 'منخفض', label_en: 'Low' },
  { level: 'Medium', color: 'bg-yellow-600/50', label_ar: 'متوسط', label_en: 'Medium' },
  { level: 'High', color: 'bg-orange-600/50', label_ar: 'مرتفع', label_en: 'High' },
  { level: 'Critical', color: 'bg-red-700/60', label_ar: 'حرج', label_en: 'Critical' },
];

const getRiskLevel = (impact: number, probability: number) => {
  const score = impact * probability;
  if (score >= 15) return 3; // Critical
  if (score >= 10) return 2; // High
  if (score >= 5) return 1; // Medium
  return 0; // Low
};

interface RiskLandscapeProps {
    data: { impact: number; probability: number; }[];
}

const RiskLandscape: React.FC<RiskLandscapeProps> = ({ data }) => {
    const { t, language } = useLanguage();
    
    const impactLabels = [
        t('dashboard.riskLabels.impact.minimal'),
        t('dashboard.riskLabels.impact.minor'),
        t('dashboard.riskLabels.impact.moderate'),
        t('dashboard.riskLabels.impact.major'),
        t('dashboard.riskLabels.impact.catastrophic'),
    ];
    const probabilityLabels = [
        t('dashboard.riskLabels.probability.rare'),
        t('dashboard.riskLabels.probability.unlikely'),
        t('dashboard.riskLabels.probability.possible'),
        t('dashboard.riskLabels.probability.likely'),
        t('dashboard.riskLabels.probability.certain'),
    ];

    // Group risks by cell
    const riskMatrix = Array(5).fill(null).map(() => Array(5).fill(0));
    data.forEach(risk => {
        if (risk.impact >= 1 && risk.impact <= 5 && risk.probability >= 1 && risk.probability <= 5) {
            riskMatrix[5 - risk.impact][risk.probability - 1]++;
        }
    });

    return (
        <div className="flex flex-col h-full w-full aspect-square text-xs">
            {/* Top Labels - Probability */}
            <div className="flex items-center">
                <div className="w-24 flex-shrink-0"></div>
                <div className="flex-1 grid grid-cols-5 text-center text-gray-300">
                    {probabilityLabels.map(label => (
                        <div key={label} className="p-1 font-semibold">{label}</div>
                    ))}
                </div>
            </div>
            
            <div className="flex flex-1">
                {/* Side Labels - Impact */}
                <div className="w-24 flex flex-col justify-around text-center text-gray-300">
                    {impactLabels.slice().reverse().map(label => (
                         <div key={label} className="p-1 font-semibold flex items-center justify-center h-full -rotate-90">{label}</div>
                    ))}
                </div>
                
                {/* Grid */}
                <div className="flex-1 grid grid-rows-5 gap-1">
                    {riskMatrix.map((row, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-5 gap-1">
                            {row.map((count, colIndex) => {
                                const impact = 5 - rowIndex;
                                const probability = colIndex + 1;
                                const level = getRiskLevel(impact, probability);
                                const riskInfo = riskLevels[level];
                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`relative flex items-center justify-center rounded-md text-white transition-all duration-300 hover:scale-105 hover:shadow-lg ${riskInfo.color} ${count > 0 ? 'border border-white/20' : 'bg-white/5'}`}
                                    >
                                        {count > 0 && <span className="font-bold text-lg">{count}</span>}
                                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-royal-800 ${riskInfo.color}`}></div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default RiskLandscape;
