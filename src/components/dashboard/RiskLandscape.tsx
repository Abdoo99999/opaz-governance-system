
"use client";
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

const riskLevels = [
  { level: 'Low', color: 'from-emerald-500/10 to-emerald-900/10', borderColor: 'border-emerald-500/20', label_ar: 'منخفض', label_en: 'Low' },
  { level: 'Medium', color: 'from-yellow-500/10 to-yellow-800/10', borderColor: 'border-yellow-500/30', label_ar: 'متوسط', label_en: 'Medium' },
  { level: 'High', color: 'from-orange-500/15 to-orange-800/15', borderColor: 'border-orange-500/40', label_ar: 'مرتفع', label_en: 'High' },
  { level: 'Critical', color: 'from-red-500/20 to-red-800/20', borderColor: 'border-red-500/50', label_ar: 'حرج', label_en: 'Critical' },
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
        <div className="flex flex-col h-full w-full text-xs">
             <div className="grid grid-cols-6 gap-1 flex-grow">
                {/* Y-Axis Header - Empty Top-Left Cell */}
                <div />
                
                {/* X-Axis Headers (Probability) */}
                {probabilityLabels.map((label, i) => (
                    <div key={i} className="flex items-center justify-center text-center text-gray-400 font-semibold p-1">
                        {label}
                    </div>
                ))}

                {/* Y-Axis Labels and Grid Cells */}
                {riskMatrix.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        <div className="flex items-center justify-center text-center -rotate-90 text-gray-400 font-semibold p-1">
                            {impactLabels[4-rowIndex]}
                        </div>
                        {row.map((count, colIndex) => {
                            const impact = 5 - rowIndex;
                            const probability = colIndex + 1;
                            const level = getRiskLevel(impact, probability);
                            const riskInfo = riskLevels[level];
                            return (
                                <motion.div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`relative flex items-center justify-center rounded-lg text-white transition-all duration-300 ${count > 0 ? `bg-gradient-to-br ${riskInfo.color} ${riskInfo.borderColor} border shadow-inner shadow-black/20` : 'bg-white/5'}`}
                                    whileHover={{ scale: 1.1, zIndex: 10, boxShadow: '0 0 15px rgba(255, 255, 255, 0.1)' }}
                                >
                                    {count > 0 && <span className="font-bold text-xl drop-shadow-lg">{count}</span>}
                                </motion.div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};


export default RiskLandscape;
