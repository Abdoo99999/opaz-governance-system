
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Building, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { ZONES } from '@/data/companies';

const zoneTypes = ['Special Economic Zone', 'Free Zone', 'Industrial City'];

const formSchema = z.object({
    companyName: z.string().min(1, 'Zone name is required'),
    code: z.string(),
    type: z.string().min(1, 'Zone type is required'),
    totalArea: z.number().positive('Must be a positive number'),
    developedArea: z.number().gte(0, 'Must be a non-negative number'),
    cumulativeInvestment: z.number().gte(0, 'Must be a non-negative number'),
    directJobs: z.number().int().gte(0, 'Must be a non-negative number'),
}).refine(data => data.developedArea <= data.totalArea, {
    message: "Developed area cannot exceed total area",
    path: ["developedArea"],
});


type CompanyFormValues = z.infer<typeof formSchema>;

interface CompanyFormProps {
    company?: Partial<CompanyFormValues> & { name_en?: string, name_ar?: string };
    onClose: () => void;
    onSave: (data: CompanyFormValues) => void;
}

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
    }),
};

const inputStyles = "h-12 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white";

const CompanyForm: React.FC<CompanyFormProps> = ({ company, onClose, onSave }) => {
    const { t, language } = useLanguage();
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<CompanyFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: company?.name_en || '',
            code: company?.code || '',
            type: company?.type || '',
            totalArea: company?.totalArea || 0,
            developedArea: company?.developedArea || 0,
            cumulativeInvestment: company?.cumulativeInvestment || 0,
            directJobs: company?.directJobs || 0,
        },
    });

    const watchCompanyName = watch('companyName');
    const zoneOptions = ZONES.map(c => ({ value: c.name_en, label: language === 'ar' ? c.name_ar : c.name_en }));

    useEffect(() => {
        if (watchCompanyName) {
            const selectedZoneData = ZONES.find(c => c.name_en === watchCompanyName);
            if(selectedZoneData) {
                setValue('code', `OPZ-${selectedZoneData.id.toUpperCase()}`);
                setValue('type', selectedZoneData.type);
            }
        }
    }, [watchCompanyName, setValue]);


    return (
        <div className="p-4 md:p-6 lg:p-8 text-white h-full overflow-y-auto">
            <header className="flex items-center justify-between mb-8">
                <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/10">
                    <ArrowLeft className="ml-2 h-5 w-5" />
                    {t('common.back')}
                </Button>
                <h1 className="text-3xl font-bold">
                    {company ? `${t('common.edit')} ${language === 'ar' ? company.name_ar : company.name_en}` : t('registry.addNew')}
                </h1>
                <Button onClick={handleSubmit(onSave)} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                    <Save/> {t('common.save')}
                </Button>
            </header>

            <form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Card 1: Identity */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
                    <Card className="glass h-full">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Building className="w-6 h-6 text-gold-400" />
                            <CardTitle>{t('companyForm.identity.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label>{t('companyForm.identity.companyName')}</label>
                                <Controller
                                    name="companyName"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className={inputStyles}><SelectValue placeholder={t('common.selectPlaceholder')} /></SelectTrigger>
                                            <SelectContent className="bg-royal-900 text-white border-white/20">
                                                {zoneOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
                            </div>
                            <div>
                                <label>{t('companyForm.identity.code')}</label>
                                <Input {...register('code')} readOnly className={cn(inputStyles, "bg-royal-900/80")} />
                            </div>
                             <div>
                                <label>{t('companyForm.identity.zoneType')}</label>
                                 <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className={inputStyles}><SelectValue placeholder={t('common.selectPlaceholder')} /></SelectTrigger>
                                            <SelectContent className="bg-royal-900 text-white border-white/20">
                                                {zoneTypes.map(zt => <SelectItem key={zt} value={zt}>{zt}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 2: Key Indicators */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
                    <Card className="glass h-full">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <TrendingUp className="w-6 h-6 text-gold-400" />
                            <CardTitle>{t('companyForm.financial.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div>
                                <label>{t('companyForm.financial.totalArea')}</label>
                                <Input type="number" {...register('totalArea', { valueAsNumber: true })} className={inputStyles} />
                                {errors.totalArea && <p className="text-red-500 text-sm mt-1">{errors.totalArea.message}</p>}
                            </div>
                            <div>
                                <label>{t('companyForm.financial.developedArea')}</label>
                                 <Input type="number" {...register('developedArea', { valueAsNumber: true })} className={inputStyles} />
                                 {errors.developedArea && <p className="text-red-500 text-sm mt-1">{errors.developedArea.message}</p>}
                            </div>
                             <div>
                                <label>{t('companyForm.financial.cumulativeInvestment')}</label>
                                <Input type="number" {...register('cumulativeInvestment', { valueAsNumber: true })} className={inputStyles} />
                            </div>
                             <div>
                                <label>{t('companyForm.financial.directJobs')}</label>
                                <Input type="number" {...register('directJobs', { valueAsNumber: true })} className={inputStyles} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </form>
        </div>
    );
};

export default CompanyForm;
