
"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Plus, Calendar, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { COMPANIES } from '@/data/companies';
import { BOARD_MEMBERS, BoardMember } from '@/data/board-members';
import { differenceInMonths, format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';


const expertiseColors: { [key: string]: string } = {
  'Legal': '#3b82f6',
  'Finance': '#10b981',
  'Engineering': '#f97316',
  'HR': '#8b5cf6',
  'Strategy': '#d946ef',
  'Technology': '#14b8a6',
  'Marketing': '#ec4899',
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

const BoardDirectory: React.FC = () => {
    const { t, language } = useLanguage();
    const [selectedCompanyId, setSelectedCompanyId] = useState('all');

    const filteredMembers = useMemo(() => {
        if (selectedCompanyId === 'all') return BOARD_MEMBERS;
        return BOARD_MEMBERS.filter(m => m.companyId === selectedCompanyId);
    }, [selectedCompanyId]);

    const skillsMatrixData = useMemo(() => {
        const expertiseCounts = filteredMembers.reduce((acc, member) => {
            acc[member.expertise] = (acc[member.expertise] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        return Object.keys(expertiseColors).map(expertise => ({
            subject: t(`board_directory.expertise.${expertise.toLowerCase()}`),
            count: expertiseCounts[expertise] || 0,
            fullMark: Math.max(5, ...Object.values(expertiseCounts)),
        }));
    }, [filteredMembers, t]);

    const boardTenure = useMemo(() => {
        if (filteredMembers.length === 0) return { start: null, end: null, progress: 0 };
        
        const appointmentDates = filteredMembers.map(m => parseISO(m.appointmentDate));
        const expiryDates = filteredMembers.map(m => parseISO(m.expiryDate));

        const boardStart = new Date(Math.min(...appointmentDates.map(d => d.getTime())));
        const boardEnd = new Date(Math.max(...expiryDates.map(d => d.getTime())));

        const totalDuration = differenceInMonths(boardEnd, boardStart);
        const elapsedDuration = differenceInMonths(new Date(), boardStart);

        const progress = totalDuration > 0 ? (elapsedDuration / totalDuration) * 100 : 0;

        return {
            start: format(boardStart, 'MMM yyyy'),
            end: format(boardEnd, 'MMM yyyy'),
            progress: Math.min(100, Math.max(0, progress)),
        };
    }, [filteredMembers]);

    return (
        <div className="p-4 md:p-6 lg:p-8 text-white">
            <header className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{t('board_directory.title')}</h1>
                    <p className="text-gray-400 mt-1">{t('board_directory.subtitle')}</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                        <SelectTrigger className="w-[280px] glass text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                            <SelectItem value="all">{t('common.selectAllCompanies')}</SelectItem>
                            {COMPANIES.map(company => (
                                <SelectItem key={company.id} value={company.id}>
                                    {language === 'ar' ? company.name_ar : company.name_en}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Button className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                        <Plus className="ml-2 h-5 w-5" />
                        {t('board_directory.addMember')}
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2">
                    <Card className="glass h-full">
                        <CardHeader>
                            <CardTitle className="text-gold-400">{t('board_directory.skillsMatrix')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={300}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsMatrixData}>
                                    <PolarGrid className="stroke-white/20" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'white', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 1']} tick={false} axisLine={false}/>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 26, 20, 0.8)', border: '1px solid #D4AF37' }} />
                                    <Radar name={t('board_directory.membersCount')} dataKey="count" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.6} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                     <Card className="glass h-full">
                        <CardHeader>
                            <CardTitle className="text-gold-400">{t('board_directory.boardTenure')}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-center h-full pt-8">
                             {boardTenure.start ? (
                                <>
                                    <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                                        <span>{boardTenure.start}</span>
                                        <span>{boardTenure.end}</span>
                                    </div>
                                    <Progress value={boardTenure.progress} className="h-3" />
                                    <p className="text-center text-gray-400 mt-4 text-xs">{t('board_directory.currentTerm')}</p>
                                </>
                            ) : (
                                <p className="text-center text-gray-400">{t('board_directory.noData')}</p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.map((member, index) => (
                    <motion.div key={member.id} variants={cardVariants} initial="hidden" animate="visible" custom={index}>
                        <Card className="glass overflow-hidden h-full flex flex-col">
                            <CardHeader className="flex flex-row items-center gap-4 p-4">
                                <Avatar className="h-16 w-16 border-2 border-gold-500/30">
                                    <AvatarImage src={member.avatar} alt={member.name_en} data-ai-hint="person portrait" />
                                    <AvatarFallback>{member.name_en.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-lg">{language === 'ar' ? member.name_ar : member.name_en}</h3>
                                    <p className="text-sm text-gold-400">{t(`board_directory.roles.${member.role.toLowerCase()}`)}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3 text-sm flex-grow">
                                <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                                    <span className="text-gray-400">{t('board_directory.memberType')}</span>
                                    <Badge variant="outline" className="border-blue-400/30 text-blue-300">{t(`board_directory.types.${member.type.toLowerCase()}`)}</Badge>
                                </div>
                                <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                                    <span className="text-gray-400">{t('board_directory.expertise')}</span>
                                    <Badge style={{ backgroundColor: `${expertiseColors[member.expertise]}30`, color: expertiseColors[member.expertise], borderColor: `${expertiseColors[member.expertise]}50` }}>
                                        {t(`board_directory.expertise.${member.expertise.toLowerCase()}`)}
                                    </Badge>
                                </div>
                                <div className="bg-black/20 p-2 rounded-md">
                                    <div className="flex justify-between text-xs text-gray-400">
                                       <span>{format(parseISO(member.appointmentDate), 'd MMM yyyy')}</span>
                                       <span>{format(parseISO(member.expiryDate), 'd MMM yyyy')}</span>
                                    </div>
                                    <Progress 
                                        value={differenceInMonths(new Date(), parseISO(member.appointmentDate)) / differenceInMonths(parseISO(member.expiryDate), parseISO(member.appointmentDate)) * 100}
                                        className="h-1.5 mt-1" />
                                    {differenceInMonths(parseISO(member.expiryDate), new Date()) <= 3 && (
                                        <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3"/> {t('board_directory.expiresSoon')}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                            <div className="p-4 border-t border-white/10 mt-auto">
                                <p className="text-xs text-gray-400 mb-2">{t('board_directory.committees')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {member.committees.length > 0 ? member.committees.map(c => (
                                        <Badge key={c} variant="secondary">{t(`board_directory.committee_names.${c.toLowerCase()}`)}</Badge>
                                    )) : <p className="text-xs text-gray-500">{t('board_directory.noCommittees')}</p>}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default BoardDirectory;
