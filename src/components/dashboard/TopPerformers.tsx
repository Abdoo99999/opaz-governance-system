"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export interface Performer {
    name_ar: string;
    name_en: string;
    score: number; // Expecting a score from 0 to 5
}

interface TopPerformersProps {
    data: Performer[];
}

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
    if (rank === 1) return <Trophy {...iconProps} className="text-gold-400" fill="currentColor" />;
    if (rank === 2) return <Medal {...iconProps} className="text-slate-400" fill="currentColor" />;
    if (rank === 3) return <Award {...iconProps} className="text-orange-400" fill="currentColor" />;
    return <span className="font-bold text-lg text-gray-500 w-8 text-center">{rank}</span>;
};

const getProgressBarClass = (rank: number) => {
    if (rank === 1) return "[&>div]:bg-gold-500";
    if (rank === 2) return "[&>div]:bg-cyan-400";
    if (rank === 3) return "[&>div]:bg-orange-600";
    return "[&>div]:bg-blue-500";
};

const TopPerformers: React.FC<TopPerformersProps> = ({ data }) => {
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
                    {data.map((performer, index) => {
                        const rank = index + 1;
                        const progressValue = performer.score * 20; // Convert 0-5 score to 0-100 for progress bar

                        return (
                            <motion.li
                                key={performer.name_en}
                                variants={itemVariants}
                                className={cn(
                                    "p-3 rounded-r-lg transition-all",
                                    rank === 1
                                        ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border-l-4 border-yellow-500'
                                        : rank === 2
                                        ? 'bg-black/20 border-l-4 border-gray-400'
                                        : rank === 3
                                        ? 'bg-black/20 border-l-4 border-orange-600'
                                        : 'bg-black/20 border-l-4 border-transparent'
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <RankIcon rank={rank} />
                                    <div className="flex-grow">
                                        <h4 className={cn("font-bold", rank === 1 && "text-lg text-gold-300")}>
                                            {language === 'ar' ? performer.name_ar : performer.name_en}
                                        </h4>
                                        <Progress 
                                            value={progressValue} 
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
