
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Building, TrendingUp, Users } from 'lucide-react';
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
    totalEmployees: z.number().int().gte(0, 'Must be a non-negative number'),
    omaniEmployees: z.number().int().gte(0, 'Must be a non-negative number'),
    totalSpending: z.number().gte(0, 'Must be a non-negative number'),
    localSpending: z.number().gte(0, 'Must be a non-negative number'),
    smeSpending: z.number().gte(0, 'Must be a non-negative number'),
}).refine(data => data.developedArea <= data.totalArea, {
    message: "Developed area cannot exceed total area",
    path: ["developedArea"],
}).refine(data => data.omaniEmployees <= data.totalEmployees, {
    message: "Omani employees cannot exceed total employees",
    path: ["omaniEmployees"],
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
            totalEmployees: (company as any)?.totalEmployees || 0,
            omaniEmployees: (company as any)?.omaniEmployees || 0,
            totalSpending: (company as any)?.totalSpending || 0,
            localSpending: (company as any)?.localSpending || 0,
            smeSpending: (company as any)?.smeSpending || 0,
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

    const watchTotalEmployees = watch('totalEmployees');
    const watchOmaniEmployees = watch('omaniEmployees');
    const watchTotalSpending = watch('totalSpending');
    const watchLocalSpending = watch('localSpending');
    const watchSmeSpending = watch('smeSpending');

    const omanizationRate = useMemo(() => {
        if (!watchTotalEmployees || watchTotalEmployees === 0) return 0;
        return Math.round((watchOmaniEmployees / watchTotalEmployees) * 100);
    }, [watchTotalEmployees, watchOmaniEmployees]);

    const icvPercentage = useMemo(() => {
        if (!watchTotalSpending || watchTotalSpending === 0) return 0;
        return Math.round((watchLocalSpending / watchTotalSpending) * 100);
    }, [watchTotalSpending, watchLocalSpending]);
    
    const smePercentage = useMemo(() => {
        if (!watchTotalSpending || watchTotalSpending === 0) return 0;
        return Math.round((watchSmeSpending / watchTotalSpending) * 100);
    }, [watchTotalSpending, watchSmeSpending]);


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

                 {/* Card 3: ICV */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3} className="lg:col-span-2">
                    <Card className="glass h-full">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Users className="w-6 h-6 text-gold-400" />
                            <CardTitle>{t('companyForm.icv.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Workforce Section */}
                            <div className="space-y-4 p-4 bg-black/20 rounded-lg">
                                <h4 className="text-lg font-semibold text-center text-gold-300">{t('companyForm.icv.workforceTitle')}</h4>
                                <div>
                                    <label>{t('companyForm.icv.totalEmployees')}</label>
                                    <Input type="number" {...register('totalEmployees', { valueAsNumber: true })} className={inputStyles} />
                                    {errors.totalEmployees && <p className="text-red-500 text-sm mt-1">{errors.totalEmployees.message}</p>}
                                </div>
                                <div>
                                    <label>{t('companyForm.icv.omanis')}</label>
                                    <Input type="number" {...register('omaniEmployees', { valueAsNumber: true })} className={inputStyles} />
                                    {errors.omaniEmployees && <p className="text-red-500 text-sm mt-1">{errors.omaniEmployees.message}</p>}
                                </div>
                                <div className="p-3 bg-royal-800 rounded-lg text-center mt-2">
                                    <p className="text-gray-400 text-sm">{t('companyForm.icv.omanizationRate')}</p>
                                    <p className="text-2xl font-bold text-gold-400">{omanizationRate}%</p>
                                </div>
                            </div>

                            {/* Spending Section */}
                            <div className="space-y-4 p-4 bg-black/20 rounded-lg">
                                <h4 className="text-lg font-semibold text-center text-gold-300">{t('companyForm.icv.spendingTitle')}</h4>
                                <div>
                                    <label>{t('companyForm.icv.totalSpending')}</label>
                                    <Input type="number" {...register('totalSpending', { valueAsNumber: true })} className={inputStyles} />
                                </div>
                                <div>
                                    <label>{t('companyForm.icv.localSpending')}</label>
                                    <Input type="number" {...register('localSpending', { valueAsNumber: true })} className={inputStyles} />
                                </div>
                                <div>
                                    <label>{t('companyForm.icv.smeSpending')}</label>
                                    <Input type="number" {...register('smeSpending', { valueAsNumber: true })} className={inputStyles} />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="p-2 bg-royal-800 rounded-lg text-center">
                                        <p className="text-gray-400 text-xs">{t('companyForm.icv.icvPercentage')}</p>
                                        <p className="font-bold text-gold-400">{icvPercentage}%</p>
                                    </div>
                                    <div className="p-2 bg-royal-800 rounded-lg text-center">
                                        <p className="text-gray-400 text-xs">{t('companyForm.icv.smeShort')}</p>
                                        <p className="font-bold text-gold-400">{smePercentage}%</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </form>
        </div>
    );
};

export default CompanyForm;
