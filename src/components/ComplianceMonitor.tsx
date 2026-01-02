"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { useLanguage } from '@/context/LanguageContext';

const complianceItems = [
    { id: 'auditor', question: 'compliance.questions.auditor' },
    { id: 'quorum', question: 'compliance.questions.quorum' },
    { id: 'doa', question: 'compliance.questions.doa' },
    { id: 'conflict', question: 'compliance.questions.conflict' },
];

const riskSchema = z.object({
    description: z.string().min(1, 'وصف الخطر مطلوب'),
    category: z.string().min(1, 'التصنيف مطلوب'),
    impact: z.number().min(1).max(5),
    probability: z.number().min(1).max(5),
    mitigation: z.string().min(1, 'خطة المعالجة مطلوبة'),
});

type RiskFormValues = z.infer<typeof riskSchema>;

// Initialize with a few risks for demonstration
const initialRisks = [
    { description: "Cyber attack", category: "Cyber", impact: 5, probability: 4, mitigation: "Strengthen firewall" },
    { description: "Market downturn", category: "Financial", impact: 4, probability: 3, mitigation: "Diversify investments" },
    { description: "Regulatory changes", category: "Strategic", impact: 3, probability: 5, mitigation: "Lobbying efforts" },
    { description: "Operational failure", category: "Operational", impact: 5, probability: 5, mitigation: "Redundancy systems" },
    { description: "Another operational failure", category: "Operational", impact: 5, probability: 5, mitigation: "More redundancy" },
];

const ComplianceMonitor: React.FC = () => {
    const [complianceState, setComplianceState] = useState({
        auditor: true,
        quorum: true,
        doa: false,
        conflict: true,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [risks, setRisks] = useState<RiskFormValues[]>(initialRisks);
    const { t } = useLanguage();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<RiskFormValues>({
        resolver: zodResolver(riskSchema),
        defaultValues: {
            impact: 1,
            probability: 1,
        }
    });

    const handleToggle = (id: keyof typeof complianceState) => {
        setComplianceState(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const onSubmitRisk = (data: RiskFormValues) => {
        setRisks(prev => [...prev, data]);
        setIsModalOpen(false);
        reset();
    };

    const getRiskCount = (impact: number, probability: number) => {
        return risks.filter(r => r.impact === impact && r.probability === probability).length;
    };
    
    const getCellColor = (impact: number, probability: number) => {
        const score = impact * probability;
        if (score >= 15) return 'bg-red-800/60 border-red-600/80';
        if (score >= 10) return 'bg-red-600/50 border-red-500/70';
        if (score >= 5) return 'bg-yellow-500/50 border-yellow-400/70';
        return 'bg-green-600/50 border-green-500/70';
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 text-white grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

            {/* Right Section: Statutory Compliance */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card className="glass h-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gold-400">{t('compliance.statutoryTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {complianceItems.map(item => {
                            const isCompliant = complianceState[item.id as keyof typeof complianceState];
                            return (
                                <motion.div
                                    key={item.id}
                                    className={cn(
                                        "glass p-4 transition-all duration-300",
                                        isCompliant ? "border-success/80" : "border-danger/80"
                                    )}
                                    animate={{ borderColor: isCompliant ? 'rgba(0, 224, 150, 0.8)' : 'rgba(255, 59, 59, 0.8)' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg flex-1">{t(item.question)}</p>
                                        <div className="flex items-center gap-4">
                                            {!isCompliant && (
                                                <Badge variant="destructive" className="flex items-center gap-1">
                                                    <AlertTriangle size={14} />
                                                    {t('compliance.nonCompliant')}
                                                </Badge>
                                            )}
                                            <Switch
                                                checked={isCompliant}
                                                onCheckedChange={() => handleToggle(item.id as keyof typeof complianceState)}
                                                className="data-[state=checked]:bg-success data-[state=unchecked]:bg-danger/50"
                                                style={{ transform: 'scale(1.3)' }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Left Section: Risk Management */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <Card className="glass h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gold-400">{t('dashboard.riskMap')}</CardTitle>
                        <Button onClick={() => setIsModalOpen(true)} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                            <Plus className="ml-2 h-5 w-5" />
                            {t('compliance.addRisk')}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex">
                            <div className="flex flex-col-reverse justify-around text-center text-sm font-bold w-16">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 flex items-center justify-center"><span>{i}</span></div>)}
                            </div>
                            <div className="flex-1 grid grid-cols-5 gap-1">
                                {Array.from({ length: 5 }, (_, probIndex) => (
                                    Array.from({ length: 5 }, (_, impactIndex) => {
                                        const impact = 5 - impactIndex;
                                        const probability = probIndex + 1;
                                        const riskCount = getRiskCount(impact, probability);
                                        return (
                                            <div
                                                key={`${impact}-${probability}`}
                                                className={cn(
                                                    'w-full h-16 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105',
                                                    getCellColor(impact, probability)
                                                )}
                                            >
                                                {riskCount > 0 && (
                                                    <Badge className="bg-black/50 text-white">{riskCount}</Badge>
                                                )}
                                            </div>
                                        );
                                    }).reverse()
                                ))}
                            </div>
                        </div>
                         <div className="flex justify-around text-center text-sm font-bold mt-2 ml-16">
                            {[1, 2, 3, 4, 5].map(p => <div key={p} className="w-16"><span>{p}</span></div>)}
                        </div>
                        <div className="text-center mt-4 font-bold text-lg text-gold-400">{t('compliance.probability')}</div>
                    </CardContent>
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 transform -rotate-90 font-bold text-lg text-gold-400">{t('compliance.impact')}</div>
                </Card>
            </motion.div>

            {/* Add Risk Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="glass text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-gold-400 text-2xl">{t('compliance.addRisk')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmitRisk)} className="space-y-6 pt-4">
                        <div>
                            <label className="text-gray-300">{t('compliance.riskForm.description')}</label>
                            <Input {...register('description')} className="bg-royal-900/50 border-white/10 mt-2" />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>
                        <div>
                            <label className="text-gray-300">{t('compliance.riskForm.category')}</label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="bg-royal-900/50 border-white/10 mt-2"><SelectValue placeholder={t('common.selectPlaceholder')} /></SelectTrigger>
                                        <SelectContent className="bg-royal-900 text-white border-white/20">
                                            <SelectItem value="Financial">{t('compliance.riskCategories.financial')}</SelectItem>
                                            <SelectItem value="Operational">{t('compliance.riskCategories.operational')}</SelectItem>
                                            <SelectItem value="Strategic">{t('compliance.riskCategories.strategic')}</SelectItem>
                                            <SelectItem value="Cyber">{t('compliance.riskCategories.cyber')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-gray-300">{t('compliance.riskForm.impact')}</label>
                                <Controller
                                    name="impact"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={String(field.value)}>
                                            <SelectTrigger className="bg-royal-900/50 border-white/10 mt-2"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-royal-900 text-white border-white/20">
                                                {[1,2,3,4,5].map(i => <SelectItem key={i} value={String(i)}>{i}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div>
                                <label className="text-gray-300">{t('compliance.riskForm.probability')}</label>
                                <Controller
                                    name="probability"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={String(field.value)}>
                                            <SelectTrigger className="bg-royal-900/50 border-white/10 mt-2"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-royal-900 text-white border-white/20">
                                                {[1,2,3,4,5].map(i => <SelectItem key={i} value={String(i)}>{i}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-gray-300">{t('compliance.riskForm.mitigation')}</label>
                            <Textarea {...register('mitigation')} className="bg-royal-900/50 border-white/10 mt-2" />
                            {errors.mitigation && <p className="text-red-500 text-sm mt-1">{errors.mitigation.message}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-white border-white/20">{t('common.cancel')}</Button>
                            <Button type="submit" className="bg-gold-500 text-royal-900 hover:bg-gold-400">{t('common.save')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ComplianceMonitor;
