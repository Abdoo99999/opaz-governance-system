
"use client";

import React, { useState, useMemo, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Plus, Calendar, AlertTriangle, Edit, Save, ShieldCheck, Layers, Upload, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { COMPANIES, Company } from '@/data/companies';
import { BOARD_MEMBERS, BoardMember, NATIONALITIES } from '@/data/board-members';
import { differenceInMonths, format, parse, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useCompany as useCompanyContext } from '@/context/CompanyContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';


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

const expertiseOptions = ['Legal', 'Finance', 'Engineering', 'HR', 'Strategy', 'Technology', 'Marketing'];
const committeeOptions = ['Audit', 'Risk', 'HR', 'Nomination'];
const roleOptions = ['Chairman', 'Member'];
const typeOptions = ['Independent', 'Government', 'Executive'];
const qualificationOptions = ['Bachelor', 'Master', 'PhD'] as const;

const memberSchema = z.object({
  name_ar: z.string().min(1, 'الاسم بالعربية مطلوب'),
  name_en: z.string().min(1, 'الاسم بالانجليزية مطلوب'),
  nationality: z.string().min(1, 'الجنسية مطلوبة'),
  role: z.enum(['Chairman', 'Member']),
  type: z.enum(['Independent', 'Government', 'Executive']),
  qualification: z.enum(qualificationOptions),
  expertise: z.enum(['Legal', 'Finance', 'Engineering', 'HR', 'Strategy', 'Technology', 'Marketing']),
  appointmentDate: z.date(),
  expiryDate: z.date(),
  committees: z.array(z.string()).optional(),
});
type MemberFormData = z.infer<typeof memberSchema>;

interface MeetingMinute {
    id: number;
    date: string;
    type: 'Quarterly' | 'Emergency' | 'Committee';
    title: string;
    attendees: number;
    fileName: string;
}


const BoardDirectory: React.FC = () => {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const { selectedCompanyId, refreshData } = useCompanyContext();
    
    const [boardMembers, setBoardMembers] = useState<BoardMember[]>(() => {
        if (typeof window === 'undefined') return BOARD_MEMBERS;
        const savedMembers = localStorage.getItem('oia_board_members');
        return savedMembers ? JSON.parse(savedMembers) : BOARD_MEMBERS;
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
    const [isCycleSettingsOpen, setIsCycleSettingsOpen] = useState(false);
    
    // Board Cycle State - now expects string 'YYYY-MM-DD' for native date input
    const [boardCycleStart, setBoardCycleStart] = useState<string | null>(null);
    const [boardCycleEnd, setBoardCycleEnd] = useState<string | null>(null);
    
    const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
    const [isMinuteModalOpen, setIsMinuteModalOpen] = useState(false);
    
    // Load/Save Minutes from localStorage
    useEffect(() => {
        if (selectedCompanyId && selectedCompanyId !== 'all' && typeof window !== 'undefined') {
            const savedMinutes = localStorage.getItem(`board_minutes_${selectedCompanyId}`);
            if (savedMinutes) {
                setMinutes(JSON.parse(savedMinutes));
            } else {
                setMinutes([]); // Reset if no data for this company
            }
        } else {
            setMinutes([]); // Reset if 'All Companies' is selected
        }
    }, [selectedCompanyId]);

    const handleSaveMinute = (data: { date: Date; type: any; title: string; attendees: number; file: File }) => {
        const newMinute: MeetingMinute = {
            id: Date.now(),
            date: format(data.date, 'yyyy-MM-dd'),
            type: data.type,
            title: data.title,
            attendees: data.attendees,
            fileName: data.file.name,
        };
        const updatedMinutes = [...minutes, newMinute];
        setMinutes(updatedMinutes);
        if (selectedCompanyId && selectedCompanyId !== 'all') {
          localStorage.setItem(`board_minutes_${selectedCompanyId}`, JSON.stringify(updatedMinutes));
        }
        toast({ title: t('common.saveSuccessTitle'), description: t('board_directory.minutes.minuteAdded') });
        setIsMinuteModalOpen(false);
        refreshData();
    };


    const filteredMembers = useMemo(() => {
        if (selectedCompanyId === 'all') return boardMembers;
        return boardMembers.filter(m => m.companyId === selectedCompanyId);
    }, [selectedCompanyId, boardMembers]);

    // Effect to set initial board cycle from member dates
    useEffect(() => {
        if (filteredMembers.length > 0) {
            const appointmentDates = filteredMembers.map(m => parseISO(m.appointmentDate));
            const expiryDates = filteredMembers.map(m => parseISO(m.expiryDate));

            const boardStart = new Date(Math.min(...appointmentDates.map(d => d.getTime())));
            const boardEnd = new Date(Math.max(...expiryDates.map(d => d.getTime())));
            
            // Set as 'YYYY-MM-DD' string
            setBoardCycleStart(format(boardStart, 'yyyy-MM-dd'));
            setBoardCycleEnd(format(boardEnd, 'yyyy-MM-dd'));
        } else {
            setBoardCycleStart(null);
            setBoardCycleEnd(null);
        }
    }, [filteredMembers]);

    const summaryData = useMemo(() => {
        const totalMembers = filteredMembers.length;
        if (totalMembers === 0) {
            return { totalMembers: 0, independentMembersCount: 0, independentPercentage: 0, expiringSoon: 0, totalCommittees: 0 };
        }
        const independentMembersCount = filteredMembers.filter(m => m.type === 'Independent').length;
        const independentPercentage = (independentMembersCount / totalMembers) * 100;
        const expiringSoon = filteredMembers.filter(m => {
            const diff = differenceInMonths(parseISO(m.expiryDate), new Date());
            return diff >= 0 && diff <= 3;
        }).length;
        const totalCommittees = new Set(filteredMembers.flatMap(m => m.committees)).size;

        return {
            totalMembers,
            independentMembersCount,
            independentPercentage,
            expiringSoon,
            totalCommittees,
        };
    }, [filteredMembers]);

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
        if (!boardCycleStart || !boardCycleEnd) return { start: null, end: null, progress: 0 };

        const startDate = parse(boardCycleStart, 'yyyy-MM-dd', new Date());
        const endDate = parse(boardCycleEnd, 'yyyy-MM-dd', new Date());

        const totalDuration = differenceInMonths(endDate, startDate);
        const elapsedDuration = differenceInMonths(new Date(), startDate);

        const progress = totalDuration > 0 ? (elapsedDuration / totalDuration) * 100 : 0;

        return {
            start: format(startDate, 'MMM yyyy'),
            end: format(endDate, 'MMM yyyy'),
            progress: Math.min(100, Math.max(0, progress)),
        };
    }, [boardCycleStart, boardCycleEnd]);

    const handleOpenForm = (member: BoardMember | null) => {
      setEditingMember(member);
      setIsFormOpen(true);
    };

    const handleSaveMember = (data: MemberFormData) => {
        let newBoardMembers;
        if (editingMember) {
            newBoardMembers = boardMembers.map(m => m.id === editingMember.id ? { 
                ...m, 
                ...data, 
                appointmentDate: format(data.appointmentDate, 'yyyy-MM-dd'),
                expiryDate: format(data.expiryDate, 'yyyy-MM-dd'),
                committees: data.committees || [] 
            } : m);
            toast({ title: t('common.saveSuccessTitle'), description: `Updated member: ${data.name_en}` });
        } else {
            if (selectedCompanyId === 'all') {
                toast({ title: t('common.errorTitle'), description: t('common.selectCompanyToStart'), variant: 'destructive' });
                return;
            }
            const newId = boardMembers.length > 0 ? Math.max(...boardMembers.map(m => m.id)) + 1 : 1;
            newBoardMembers = [...boardMembers, {
                id: newId,
                avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/epv2AAAAABJRU5ErkJggg==',
                ...data,
                companyId: selectedCompanyId,
                appointmentDate: format(data.appointmentDate, 'yyyy-MM-dd'),
                expiryDate: format(data.expiryDate, 'yyyy-MM-dd'),
                committees: data.committees as any || [],
            }];
            toast({ title: t('common.saveSuccessTitle'), description: `Added new member: ${data.name_en}` });
        }
        
        localStorage.setItem('oia_board_members', JSON.stringify(newBoardMembers));
        setBoardMembers(newBoardMembers);
        setIsFormOpen(false);
        refreshData();
    };


    return (
        <div className="p-4 md:p-6 lg:p-8 text-white">
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{t('board_directory.title')}</h1>
                    <p className="text-gray-400 mt-1">{t('board_directory.subtitle')}</p>
                </div>
            </header>

            <Tabs defaultValue="members" className="w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <TabsList className="grid w-full grid-cols-2 bg-transparent p-1 h-auto border border-gold-400 rounded-lg">
                    <TabsTrigger value="members" className="data-[state=active]:bg-gold-400 data-[state=active]:text-black text-gold-400 rounded-md">
                        {t('board_directory.tabs.members')}
                    </TabsTrigger>
                    <TabsTrigger value="minutes" className="data-[state=active]:bg-gold-400 data-[state=active]:text-black text-gold-400 rounded-md">
                        {t('board_directory.tabs.minutes')}
                    </TabsTrigger>
                </TabsList>

                {/* MEMBERS TAB */}
                <TabsContent value="members" className="mt-8">
                    <MembersContent
                        summaryData={summaryData}
                        skillsMatrixData={skillsMatrixData}
                        boardTenure={boardTenure}
                        filteredMembers={filteredMembers}
                        handleOpenForm={handleOpenForm}
                        setIsCycleSettingsOpen={setIsCycleSettingsOpen}
                        t={t}
                        language={language}
                    />
                </TabsContent>

                {/* MINUTES TAB */}
                <TabsContent value="minutes" className="mt-8">
                   <MinutesContent
                        minutes={minutes}
                        setIsMinuteModalOpen={setIsMinuteModalOpen}
                        t={t}
                    />
                </TabsContent>
            </Tabs>
            
            <BoardMemberFormDialog
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSave={handleSaveMember}
              member={editingMember}
              t={t}
            />
            <CycleSettingsDialog
                isOpen={isCycleSettingsOpen}
                onClose={() => setIsCycleSettingsOpen(false)}
                startDate={boardCycleStart}
                endDate={boardCycleEnd}
                onSave={({ start, end }) => {
                    setBoardCycleStart(start);
                    setBoardCycleEnd(end);
                    toast({ title: t('common.saveSuccessTitle'), description: "Board cycle dates updated." });
                }}
                t={t}
            />
            <MinuteUploadDialog
                isOpen={isMinuteModalOpen}
                onClose={() => setIsMinuteModalOpen(false)}
                onSave={handleSaveMinute}
                t={t}
            />
        </div>
    );
};


// Members Tab Content Component
const MembersContent = ({ summaryData, skillsMatrixData, boardTenure, filteredMembers, handleOpenForm, setIsCycleSettingsOpen, t, language }: any) => {

    return (
        <>
            <div className="flex items-center justify-end gap-4 mb-8">
                <Button onClick={() => setIsCycleSettingsOpen(true)} variant="outline" className="text-gold-400 border-gold-500/30 hover:bg-gold-500/10">
                    <Calendar className="ml-2 h-5 w-5" />
                    {t('board_directory.form.cycleSettings')}
                </Button>
                <Button onClick={() => handleOpenForm(null)} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                    <Plus className="ml-2 h-5 w-5" />
                    {t('board_directory.addMember')}
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="glass">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">{t('board_directory.summary.total_members')}</CardTitle>
                        <Users className="h-5 w-5 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gold-400">{summaryData.totalMembers}</div>
                    </CardContent>
                </Card>
                <Card className="glass">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">{t('board_directory.summary.independent_members')}</CardTitle>
                        <ShieldCheck className="h-5 w-5 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gold-400">{summaryData.independentMembersCount}</div>
                        <p className="text-xs text-gray-400">{summaryData.independentPercentage.toFixed(0)}% {t('board_directory.summary.of_board')}</p>
                    </CardContent>
                </Card>
                <Card className="glass">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">{t('board_directory.summary.expiring_soon')}</CardTitle>
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-bold ${summaryData.expiringSoon > 0 ? 'text-yellow-400' : 'text-gold-400'}`}>{summaryData.expiringSoon}</div>
                        <p className="text-xs text-gray-400">{t('board_directory.summary.within_3_months')}</p>
                    </CardContent>
                </Card>
                <Card className="glass">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">{t('board_directory.committees')}</CardTitle>
                        <Layers className="h-5 w-5 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gold-400">{summaryData.totalCommittees}</div>
                         <p className="text-xs text-gray-400">{t('board_directory.summary.total_committees')}</p>
                    </CardContent>
                </Card>
            </div>

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
                {filteredMembers.map((member: BoardMember, index: number) => (
                    <motion.div key={member.id} variants={cardVariants} initial="hidden" animate="visible" custom={index}>
                        <Card className="glass overflow-hidden h-full flex flex-col relative">
                            <div className="absolute top-2 left-2 flex gap-1 z-10">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gold-400 bg-black/20 hover:bg-black/40" onClick={(e) => { e.stopPropagation(); handleOpenForm(member); }}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardHeader className="flex flex-row items-center gap-4 p-4">
                                <Avatar className="h-16 w-16 border-2 border-gold-500/30">
                                    <AvatarImage src={member.avatar} alt={member.name_en} />
                                    <AvatarFallback>{member.name_en.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-lg">{language === 'ar' ? member.name_ar : member.name_en}</h3>
                                    <p className="text-sm text-gold-400">{t(`board_directory.roles.${member.role.toLowerCase()}`)}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3 text-sm flex-grow">
                                <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                                    <span className="text-gray-400">{t('board_directory.form.nationality')}</span>
                                    <Badge variant="outline" className="border-purple-400/30 text-purple-300">{member.nationality}</Badge>
                                </div>
                                <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                                    <span className="text-gray-400">{t('board_directory.memberType')}</span>
                                    <Badge variant="outline" className="border-blue-400/30 text-blue-300">{t(`board_directory.types.${member.type.toLowerCase()}`)}</Badge>
                                </div>
                                {member.qualification && (
                                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                                        <span className="text-gray-400">{t('board_directory.form.qualification')}</span>
                                        <Badge variant="outline" className="border-green-400/30 text-green-300 gap-1">
                                            {t(`board_directory.qualifications.${member.qualification.toLowerCase()}`)}
                                        </Badge>
                                    </div>
                                )}
                                <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                                    <span className="text-gray-400">{t('board_directory.expertise_label')}</span>
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
        </>
    );
};


// Minutes Tab Content Component
const MinutesContent = ({ minutes, setIsMinuteModalOpen, t }: any) => {
    return (
        <>
            <div className="flex justify-end mb-8">
                 <Button onClick={() => setIsMinuteModalOpen(true)} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                    <Upload className="ml-2 h-5 w-5" />
                    {t('board_directory.minutes.upload')}
                </Button>
            </div>
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="text-gold-400">{t('board_directory.minutes.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-white/10 hover:bg-transparent">
                                <TableHead className="text-right text-white font-bold">{t('board_directory.minutes.date')}</TableHead>
                                <TableHead className="text-right text-white font-bold">{t('board_directory.minutes.meetingTitle')}</TableHead>
                                <TableHead className="text-right text-white font-bold">{t('board_directory.minutes.type')}</TableHead>
                                <TableHead className="text-center text-white font-bold">{t('board_directory.minutes.attendees')}</TableHead>
                                <TableHead className="text-center text-white font-bold">{t('board_directory.minutes.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {minutes.map((minute: MeetingMinute) => (
                                <TableRow key={minute.id} className="border-b-white/10 hover:bg-white/5">
                                    <TableCell className="text-right">{format(parseISO(minute.date), 'd MMMM yyyy')}</TableCell>
                                    <TableCell className="text-right font-medium">{minute.title}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline">{t(`board_directory.minutes.types.${minute.type.toLowerCase()}`)}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{minute.attendees}</TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="ghost" size="icon" className="text-gold-400 hover:text-gold-300">
                                            <Download className="h-5 w-5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {minutes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                                        {t('board_directory.minutes.noMinutes')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
};



// Form Dialog Component
interface BoardMemberFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MemberFormData) => void;
  member: BoardMember | null;
  t: (key: string) => string;
}

const BoardMemberFormDialog: React.FC<BoardMemberFormDialogProps> = ({ isOpen, onClose, onSave, member, t }) => {
  const { handleSubmit, control, reset, formState: { errors } } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (member) {
        reset({
          ...member,
          nationality: member.nationality || 'Omani',
          qualification: member.qualification || 'Bachelor',
          appointmentDate: parseISO(member.appointmentDate),
          expiryDate: parseISO(member.expiryDate),
        });
      } else {
        reset({
          name_ar: '', name_en: '',
          nationality: 'Omani',
          role: 'Member', type: 'Independent', expertise: 'Finance',
          qualification: 'Bachelor',
          appointmentDate: new Date(), expiryDate: new Date(),
          committees: []
        });
      }
    }
  }, [member, isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-gold-400 text-2xl">
            {member ? t('board_directory.form.title_edit') : t('board_directory.form.title_add')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4">
          
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name_ar">{t('board_directory.form.name_ar')}</Label>
              <Input id="name_ar" {...control.register('name_ar')} className="bg-royal-900/50 border-white/10" dir="rtl"/>
              {errors.name_ar && <p className="text-red-500 text-sm mt-1">{errors.name_ar.message}</p>}
            </div>
             <div>
              <Label htmlFor="type">{t('board_directory.memberType')}</Label>
              <Controller name="type" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-royal-900/50 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-royal-900 text-white border-white/20">
                    {typeOptions.map(opt => <SelectItem key={opt} value={opt}>{t(`board_directory.types.${opt.toLowerCase()}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}/>
            </div>
            <div>
              <Label htmlFor="appointmentDate">{t('board_directory.form.appointmentDate')}</Label>
               <Controller
                name="appointmentDate"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                    <Input
                    {...rest}
                    type="date"
                    className="bg-royal-900/50 border-white/10"
                    style={{ colorScheme: 'dark' }}
                    value={value ? format(value, 'yyyy-MM-dd') : ''}
                    onChange={(e) => onChange(e.target.valueAsDate)}
                    />
                )}
                />
            </div>
             <div>
              <Label>{t('board_directory.committees')}</Label>
              <Controller
                name="committees"
                control={control}
                render={({ field }) => (
                  <div className="p-3 bg-royal-900/40 rounded-lg grid grid-cols-2 gap-3">
                    {committeeOptions.map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <Checkbox
                          id={item}
                          checked={field.value?.includes(item)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), item])
                              : field.onChange(field.value?.filter((value) => value !== item))
                          }}
                        />
                        <Label htmlFor={item} className="text-sm font-medium">{t(`board_directory.committee_names.${item.toLowerCase()}`)}</Label>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
             <div>
              <Label htmlFor="name_en">{t('board_directory.form.name_en')}</Label>
              <Input id="name_en" {...control.register('name_en')} className="bg-royal-900/50 border-white/10" dir="ltr" />
               {errors.name_en && <p className="text-red-500 text-sm mt-1">{errors.name_en.message}</p>}
            </div>
             <div>
              <Label htmlFor="nationality">{t('board_directory.form.nationality')}</Label>
              <Controller name="nationality" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-royal-900/50 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-royal-900 text-white border-white/20 max-h-60">
                    {NATIONALITIES.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}/>
            </div>
            <div>
              <Label htmlFor="role">{t('board_directory.form.role')}</Label>
              <Controller name="role" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-royal-900/50 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-royal-900 text-white border-white/20">
                    {roleOptions.map(opt => <SelectItem key={opt} value={opt}>{t(`board_directory.roles.${opt.toLowerCase()}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}/>
            </div>
            <div>
                <Label htmlFor="qualification">{t('board_directory.form.qualification')}</Label>
                <Controller name="qualification" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-royal-900/50 border-white/10"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-royal-900 text-white border-white/20">
                        {qualificationOptions.map(opt => <SelectItem key={opt} value={opt}>{t(`board_directory.qualifications.${opt.toLowerCase()}`)}</SelectItem>)}
                    </SelectContent>
                    </Select>
                )}/>
            </div>
             <div>
              <Label htmlFor="expertise">{t('board_directory.expertise_label')}</Label>
               <Controller name="expertise" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-royal-900/50 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-royal-900 text-white border-white/20">
                    {expertiseOptions.map(opt => <SelectItem key={opt} value={opt}>{t(`board_directory.expertise.${opt.toLowerCase()}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}/>
            </div>
            <div>
              <Label htmlFor="expiryDate">{t('board_directory.form.expiryDate')}</Label>
              <Controller
                name="expiryDate"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                    <Input
                    {...rest}
                    type="date"
                    className="bg-royal-900/50 border-white/10"
                    style={{ colorScheme: 'dark' }}
                    value={value ? format(value, 'yyyy-MM-dd') : ''}
                    onChange={(e) => onChange(e.target.valueAsDate)}
                    />
                )}
                />
            </div>
          </div>
          
          {/* Footer */}
          <DialogFooter className="col-span-2 mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="text-white border-white/20">{t('common.cancel')}</Button>
              </DialogClose>
              <Button type="submit" className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                <Save />
                {t('common.save')}
              </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


interface CycleSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dates: { start: string | null, end: string | null }) => void;
  startDate: string | null;
  endDate: string | null;
  t: (key: string) => string;
}

const CycleSettingsDialog: React.FC<CycleSettingsDialogProps> = ({ isOpen, onClose, onSave, startDate, endDate, t }) => {
    const [start, setStart] = useState<string | undefined>(startDate || undefined);
    const [end, setEnd] = useState<string | undefined>(endDate || undefined);
    
    // Use an effect to sync state with props when the dialog opens
    useEffect(() => {
        if (isOpen) {
            setStart(startDate || undefined);
            setEnd(endDate || undefined);
        }
    }, [isOpen, startDate, endDate]);

    const handleSave = () => {
        onSave({ start: start || null, end: end || null });
        onClose();
    };

    const inputStyles = "w-full bg-royal-800 border border-white/10 rounded-md p-3 text-white focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none appearance-none";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass text-white">
                <DialogHeader>
                    <DialogTitle className="text-gold-400 text-2xl">{t('board_directory.form.cycleSettings')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div>
                        <Label htmlFor="start-date" className="text-gray-300">{t('board_directory.form.termStartDate')}</Label>
                        <input
                            id="start-date"
                            type="date"
                            value={start || ''}
                            onChange={(e) => setStart(e.target.value)}
                            className={cn(inputStyles, "mt-2")}
                            style={{colorScheme: 'dark'}}
                        />
                    </div>
                     <div>
                        <Label htmlFor="end-date" className="text-gray-300">{t('board_directory.form.termEndDate')}</Label>
                        <input
                            id="end-date"
                            type="date"
                            value={end || ''}
                            onChange={(e) => setEnd(e.target.value)}
                            className={cn(inputStyles, "mt-2")}
                            style={{colorScheme: 'dark'}}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="text-white border-white/20">{t('common.cancel')}</Button>
                    </DialogClose>
                    <Button onClick={handleSave} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                        <Save />
                        {t('common.save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// Minute Upload Dialog Component
const minuteSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  date: z.date(),
  type: z.enum(['Quarterly', 'Emergency', 'Committee']),
  attendees: z.number().min(1, 'Attendees number is required'),
  file: z.instanceof(File).refine(file => file.size > 0, 'File is required'),
});
type MinuteFormData = z.infer<typeof minuteSchema>;

interface MinuteUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MinuteFormData) => void;
  t: (key: string) => string;
}

const MinuteUploadDialog: React.FC<MinuteUploadDialogProps> = ({ isOpen, onClose, onSave, t }) => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<MinuteFormData>({
    resolver: zodResolver(minuteSchema),
    defaultValues: { type: 'Quarterly', date: new Date(), attendees: 1 }
  });
  
  useEffect(() => { if(isOpen) reset({ type: 'Quarterly', date: new Date(), attendees: 1, title: '', file: undefined }) }, [isOpen, reset]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="glass text-white">
            <DialogHeader>
                <DialogTitle className="text-gold-400">{t('board_directory.minutes.upload')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSave)} className="space-y-4 pt-4">
                 <div>
                    <Label>{t('board_directory.minutes.meetingTitle')}</Label>
                    <Input {...register('title')} className="bg-royal-900/50 border-white/10 mt-1" />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>{t('board_directory.minutes.date')}</Label>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field: { onChange, value, ...rest } }) => (
                                <Input
                                {...rest}
                                type="date"
                                className="bg-royal-900/50 border-white/10 mt-1"
                                style={{ colorScheme: 'dark' }}
                                value={value ? format(value, 'yyyy-MM-dd') : ''}
                                onChange={(e) => onChange(e.target.valueAsDate)}
                                />
                            )}
                        />
                         {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                    </div>
                    <div>
                        <Label>{t('board_directory.minutes.type')}</Label>
                        <Controller name="type" control={control} render={({ field }) => (
                             <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="bg-royal-900/50 border-white/10 mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-royal-900 text-white border-white/20">
                                    <SelectItem value="Quarterly">{t('board_directory.minutes.types.quarterly')}</SelectItem>
                                    <SelectItem value="Emergency">{t('board_directory.minutes.types.emergency')}</SelectItem>
                                    <SelectItem value="Committee">{t('board_directory.minutes.types.committee')}</SelectItem>
                                </SelectContent>
                             </Select>
                        )} />
                    </div>
                </div>
                <div>
                    <Label>{t('board_directory.minutes.attendees')}</Label>
                    <Input type="number" {...register('attendees', { valueAsNumber: true })} className="bg-royal-900/50 border-white/10 mt-1" />
                    {errors.attendees && <p className="text-red-500 text-xs mt-1">{errors.attendees.message}</p>}
                </div>
                 <div>
                    <Label>{t('board_directory.minutes.file')}</Label>
                    <Controller name="file" control={control} render={({ field }) => (
                        <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} className="bg-royal-900/50 border-white/10 mt-1 file:text-gold-400" />
                    )} />
                    {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file.message as string}</p>}
                </div>

                <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit" className="bg-gold-500 text-royal-900"><Save /> {t('common.save')}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
};


export default BoardDirectory;
