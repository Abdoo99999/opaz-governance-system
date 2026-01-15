
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Plus, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { useToast } from '@/hooks/use-toast';
import RiskLandscape from './dashboard/RiskLandscape';

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

type ComplianceState = {
    auditor: boolean;
    quorum: boolean;
    doa: boolean;
    conflict: boolean;
};

const initialComplianceState: ComplianceState = {
    auditor: true,
    quorum: true,
    doa: false,
    conflict: true,
};

const ComplianceMonitor: React.FC = () => {
    const { t, language } = useLanguage();
    const { selectedCompanyId, getSelectedCompany } = useCompany();
    const { toast } = useToast();
    const selectedCompany = getSelectedCompany();
    
    const getStorageKey = (companyId: string) => `oia_compliance_${companyId}`;

    const [complianceState, setComplianceState] = useState<ComplianceState>(() => {
        if (typeof window === 'undefined' || !selectedCompanyId || selectedCompanyId === 'all') return initialComplianceState;
        const saved = localStorage.getItem(getStorageKey(selectedCompanyId));
        return saved ? JSON.parse(saved).compliance : initialComplianceState;
    });

    const [risks, setRisks] = useState<RiskFormValues[]>(() => {
        if (typeof window === 'undefined' || !selectedCompanyId || selectedCompanyId === 'all') return [];
        const saved = localStorage.getItem(getStorageKey(selectedCompanyId));
        return saved ? JSON.parse(saved).risks : [];
    });
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<RiskFormValues>({
        resolver: zodResolver(riskSchema),
        defaultValues: { impact: 1, probability: 1 }
    });


    // RELOAD data when company changes
    useEffect(() => {
        if (typeof window === 'undefined' || !selectedCompanyId || selectedCompanyId === 'all') {
            setComplianceState(initialComplianceState);
            setRisks([]);
            return;
        }

        const storageKey = getStorageKey(selectedCompanyId);
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
            const { compliance, risks: savedRisks } = JSON.parse(savedData);
            setComplianceState(compliance || initialComplianceState);
            setRisks(savedRisks || []);
        } else {
            // CRITICAL: If no data exists, RESET the form
            setComplianceState(initialComplianceState);
            setRisks([]);
        }
        // Also reset the form when company changes
        reset({ impact: 1, probability: 1, description: '', category: '', mitigation: '' });
    }, [selectedCompanyId, reset]);

    const handleSave = () => {
        if (!selectedCompanyId || selectedCompanyId === 'all' || typeof window === 'undefined') return;
        
        const dataToSave = {
            compliance: complianceState,
            risks: risks,
        };
        const storageKey = getStorageKey(selectedCompanyId);
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));

        toast({
            title: "تم الحفظ بنجاح",
            description: `تم حفظ بيانات الامتثال والمخاطر لشركة ${selectedCompany?.name_ar}`,
        });
    };

    const handleToggle = (id: keyof typeof complianceState) => {
        setComplianceState(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const onSubmitRisk = (data: RiskFormValues) => {
        setRisks(prev => [...prev, data]);
        setIsModalOpen(false);
        reset({ impact: 1, probability: 1, description: '', category: '', mitigation: '' });
    };

    const handleRiskCellClick = (impact: number, probability: number) => {
        reset({
            impact: impact,
            probability: probability,
            description: '',
            category: '',
            mitigation: ''
        });
        setIsModalOpen(true);
    };
    
    if (typeof window === 'undefined' || !selectedCompanyId || selectedCompanyId === 'all') {
         return (
            <div className="flex items-center justify-center h-full p-8 text-white">
                <div className="text-center p-8 glass">
                    <h3 className="text-2xl font-bold text-gold-400">{t('common.selectCompanyToStart')}</h3>
                    <p className="text-gray-400 mt-2">{t('common.selectCompanyToStartDesc')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 text-white h-full flex flex-col">
            <header className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-4">
                    {selectedCompany && (
                        <Badge className="bg-blue-900/50 border-blue-600 text-blue-300">
                            {t('common.editingFor')}: {language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en}
                        </Badge>
                    )}
                 </div>
                 <div className="flex items-center gap-4">
                     <Button onClick={() => {
                        reset({ impact: 1, probability: 1, description: '', category: '', mitigation: '' });
                        setIsModalOpen(true);
                     }} className="bg-gold-500/10 text-gold-300 border border-gold-500/20 hover:bg-gold-500/20">
                        <Plus className="ml-2 h-5 w-5" />
                        {t('compliance.addRisk')}
                     </Button>
                    <Button onClick={handleSave} variant="outline" className="text-white border-white/20 hover:bg-white/10">
                        <Save className="ml-2 h-5 w-5" />
                        {t('compliance.saveButton')}
                    </Button>
                 </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
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
                                                    className="data-[state=checked]:bg-success data-[state=unchecked]:bg-danger"
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
                    <Card className="glass h-full flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl font-bold text-gold-400">{t('dashboard.riskMap')}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                           <RiskLandscape data={risks} onCellClick={handleRiskCellClick} />
                        </CardContent>
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
                                            <Select onValueChange={(v) => field.onChange(parseInt(v))} value={String(field.value)}>
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
                                            <Select onValueChange={(v) => field.onChange(parseInt(v))} value={String(field.value)}>
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
        </div>
    );
};

export default ComplianceMonitor;

    