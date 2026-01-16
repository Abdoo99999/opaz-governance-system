
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Plus, Calendar, AlertTriangle, Edit, CalendarIcon, Save, ShieldCheck, Layers } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { COMPANIES, Company } from '@/data/companies';
import { BOARD_MEMBERS, BoardMember } from '@/data/board-members';
import { differenceInMonths, format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Checkbox } from './ui/checkbox';


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

const memberSchema = z.object({
  name_ar: z.string().min(1, 'الاسم بالعربية مطلوب'),
  name_en: z.string().min(1, 'الاسم بالانجليزية مطلوب'),
  companyId: z.string().min(1, 'الشركة مطلوبة'),
  role: z.enum(['Chairman', 'Member']),
  type: z.enum(['Independent', 'Government', 'Executive']),
  expertise: z.enum(['Legal', 'Finance', 'Engineering', 'HR', 'Strategy', 'Technology', 'Marketing']),
  appointmentDate: z.date(),
  expiryDate: z.date(),
  committees: z.array(z.string()).optional(),
});
type MemberFormData = z.infer<typeof memberSchema>;


const BoardDirectory: React.FC = () => {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [selectedCompanyId, setSelectedCompanyId] = useState('all');
    const [boardMembers, setBoardMembers] = useState<BoardMember[]>(BOARD_MEMBERS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<BoardMember | null>(null);

    const filteredMembers = useMemo(() => {
        if (selectedCompanyId === 'all') return boardMembers;
        return boardMembers.filter(m => m.companyId === selectedCompanyId);
    }, [selectedCompanyId, boardMembers]);

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

    const handleOpenForm = (member: BoardMember | null) => {
      setEditingMember(member);
      setIsFormOpen(true);
    };

    const handleSaveMember = (data: MemberFormData) => {
        if (editingMember) {
            setBoardMembers(prev => prev.map(m => m.id === editingMember.id ? { 
                ...m, 
                ...data, 
                appointmentDate: format(data.appointmentDate, 'yyyy-MM-dd'),
                expiryDate: format(data.expiryDate, 'yyyy-MM-dd'),
                committees: data.committees || [] 
            } : m));
            toast({ title: t('common.saveSuccessTitle'), description: `Updated member: ${data.name_en}` });
        } else {
            const newMember: BoardMember = {
                id: Math.max(0, ...boardMembers.map(m => m.id)) + 1,
                avatar: `https://picsum.photos/seed/${Date.now()}/100/100`,
                ...data,
                appointmentDate: format(data.appointmentDate, 'yyyy-MM-dd'),
                expiryDate: format(data.expiryDate, 'yyyy-MM-dd'),
                committees: data.committees as any || [],
            };
            setBoardMembers(prev => [...prev, newMember]);
            toast({ title: t('common.saveSuccessTitle'), description: `Added new member: ${data.name_en}` });
        }
        setIsFormOpen(false);
    };


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
                     <Button onClick={() => handleOpenForm(null)} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                        <Plus className="ml-2 h-5 w-5" />
                        {t('board_directory.addMember')}
                    </Button>
                </div>
            </header>

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
                {filteredMembers.map((member, index) => (
                    <motion.div key={member.id} variants={cardVariants} initial="hidden" animate="visible" custom={index}>
                        <Card className="glass overflow-hidden h-full flex flex-col relative">
                            <div className="absolute top-2 left-2 flex gap-1 z-10">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gold-400 bg-black/20 hover:bg-black/40" onClick={(e) => { e.stopPropagation(); handleOpenForm(member); }}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
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
            <BoardMemberFormDialog
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSave={handleSaveMember}
              member={editingMember}
              companies={COMPANIES}
              t={t}
              language={language}
            />
        </div>
    );
};


// Form Dialog Component
interface BoardMemberFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MemberFormData) => void;
  member: BoardMember | null;
  companies: Company[];
  t: (key: string) => string;
  language: 'ar' | 'en';
}

const BoardMemberFormDialog: React.FC<BoardMemberFormDialogProps> = ({ isOpen, onClose, onSave, member, companies, t, language }) => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  useEffect(() => {
    if (member) {
      reset({
        ...member,
        appointmentDate: parseISO(member.appointmentDate),
        expiryDate: parseISO(member.expiryDate),
      });
    } else {
      reset({
        name_ar: '', name_en: '', companyId: undefined,
        role: 'Member', type: 'Independent', expertise: 'Finance',
        appointmentDate: new Date(), expiryDate: new Date(),
        committees: []
      });
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
              <Input id="name_ar" {...register('name_ar')} className="bg-royal-900/50 border-white/10" dir="rtl"/>
              {errors.name_ar && <p className="text-red-500 text-sm mt-1">{errors.name_ar.message}</p>}
            </div>
            <div>
              <Label htmlFor="companyId">{t('companyForm.identity.companyName')}</Label>
              <Controller name="companyId" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-royal-900/50 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-royal-900 text-white border-white/20">
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{language === 'ar' ? c.name_ar : c.name_en}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}/>
               {errors.companyId && <p className="text-red-500 text-sm mt-1">{errors.companyId.message}</p>}
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
              <Controller name="appointmentDate" control={control} render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-royal-900/50 border-white/10", !field.value && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>{t('common.pickDate')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                </Popover>
              )}/>
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
              <Input id="name_en" {...register('name_en')} className="bg-royal-900/50 border-white/10" dir="ltr" />
               {errors.name_en && <p className="text-red-500 text-sm mt-1">{errors.name_en.message}</p>}
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
              <Controller name="expiryDate" control={control} render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-royal-900/50 border-white/10", !field.value && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>{t('common.pickDate')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                </Popover>
              )}/>
            </div>
          </div>
          
          {/* Footer */}
          <DialogFooter className="col-span-2 mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="text-white border-white/20">{t('common.cancel')}</Button>
              </DialogClose>
              <Button type="submit" className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                <Save className="mr-2 h-4 w-4"/>
                {t('common.save')}
              </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BoardDirectory;
