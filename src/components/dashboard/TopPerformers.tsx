"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Medal, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { COMPANIES } from '@/data/companies';

// Mock data
const topPerformersData = [
    { name_ar: COMPANIES[0].name_ar, name_en: COMPANIES[0].name_en, score: 98.2 },
    { name_ar: COMPANIES[2].name_ar, name_en: COMPANIES[2].name_en, score: 95.7 },
    { name_ar: COMPANIES[4].name_ar, name_en: COMPANIES[4].name_en, score: 92.1 },
    { name_ar: COMPANIES[1].name_ar, name_en: COMPANIES[1].name_en, score: 89.5 },
    { name_ar: COMPANIES[3].name_ar, name_en: COMPANIES[3].name_en, score: 88.0 },
];

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

const RankIcon = ({ rank }: { rank: number }) => {
    const iconProps = { className: "w-8 h-8" };
    if (rank === 1) return <Trophy {...iconProps} className="text-gold-400" fill="#D4AF37" />;
    if (rank === 2) return <Medal {...iconProps} className="text-slate-400" fill="#c0c0c0" />;
    if (rank === 3) return <Award {...iconProps} className="text-orange-400" fill="#cd7f32" />;
    return <span className="font-bold text-lg text-gray-500 w-8 text-center">{rank}</span>;
};

const getProgressBarClass = (rank: number) => {
    if (rank === 1) return "[&>div]:bg-gradient-to-r [&>div]:from-gold-400 [&>div]:to-gold-500";
    if (rank === 2) return "[&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-cyan-500";
    if (rank === 3) return "[&>div]:bg-gradient-to-r [&>div]:from-orange-400 [&>div]:to-orange-500";
    return "[&>div]:bg-blue-500";
};

const TopPerformers = () => {
    const { t, language } = useLanguage();

    return (
        <Card className="glass h-full">
            <CardHeader>
                <CardTitle className="text-gold-400">{t('dashboard.top5.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <motion.ul
                    className="space-y-3"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {topPerformersData.map((performer, index) => {
                        const rank = index + 1;
                        return (
                            <motion.li
                                key={performer.name_en}
                                variants={itemVariants}
                                className={cn(
                                    "p-3 rounded-lg transition-all",
                                    rank === 1 ? 'bg-yellow-500/10 border border-yellow-500/20 shadow-lg shadow-yellow-500/5' : 'bg-black/20'
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <RankIcon rank={rank} />
                                    <div className="flex-grow">
                                        <h4 className={cn("font-bold", rank === 1 && "text-lg text-gold-300")}>
                                            {language === 'ar' ? performer.name_ar : performer.name_en}
                                        </h4>
                                        <Progress 
                                            value={performer.score} 
                                            className={cn("h-1.5 mt-1", getProgressBarClass(rank))}
                                        />
                                    </div>
                                    <div className="font-bold text-lg">
                                        {performer.score.toFixed(1)}
                                    </div>
                                </div>
                            </motion.li>
                        );
                    })}
                </motion.ul>
            </CardContent>
        </Card>
    );
};

export default TopPerformers;
