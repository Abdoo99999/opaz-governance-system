
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
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Building, Wallet, Landmark, Users, ArrowLeft, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';
import { COMPANIES } from '@/data/companies';
import { Badge } from './ui/badge';

const sectors = [...new Set(COMPANIES.map(c => c.sector))];
const legalForms = ['Holding', 'SAOC', 'SAOG'];

const formSchema = z.object({
    companyName: z.string().min(1, 'Company name is required'),
    code: z.string(),
    sector: z.string().min(1, 'Sector is required'),
    legalForm: z.string().min(1, 'Legal form is required'),
    authorizedCapital: z.number().positive('Must be a positive number'),
    financialYearEnd: z.date({ required_error: "A date is required." }),
    lastROI: z.number(),
    usoObligations: z.boolean(),
    totalEmployees: z.number().int().gte(0, 'Must be a non-negative number'),
    omaniEmployees: z.number().int().gte(0, 'Must be a non-negative number'),
    totalSpending: z.number().gte(0, 'Must be a non-negative number').optional(),
    localSpending: z.number().gte(0, 'Must be a non-negative number').optional(),
    smeSpending: z.number().gte(0, 'Must be a non-negative number').optional(),
}).refine(data => data.omaniEmployees <= data.totalEmployees, {
    message: "Omani employees cannot exceed total employees",
    path: ["omaniEmployees"],
}).refine(data => (data.localSpending || 0) <= (data.totalSpending || 0), {
    message: "Local spending cannot exceed total spending",
    path: ["localSpending"],
}).refine(data => (data.smeSpending || 0) <= (data.localSpending || 0), {
    message: "SME spending cannot exceed local spending",
    path: ["smeSpending"],
});


type CompanyFormValues = z.infer<typeof formSchema>;

interface CompanyFormProps {
    company?: Partial<CompanyFormValues> & { name_en?: string, name_ar?: string, totalSpending?: number, localSpending?: number, smeSpending?: number };
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
            sector: company?.sector || '',
            legalForm: company?.legalForm || '',
            authorizedCapital: company?.authorizedCapital || 0,
            financialYearEnd: company?.financialYearEnd ? new Date(company.financialYearEnd) : new Date(),
            lastROI: company?.lastROI || 0,
            usoObligations: company?.usoObligations || false,
            totalEmployees: company?.totalEmployees || 0,
            omaniEmployees: company?.omaniEmployees || 0,
            totalSpending: company?.totalSpending || 0,
            localSpending: company?.localSpending || 0,
            smeSpending: company?.smeSpending || 0,
        },
    });

    const watchCompanyName = watch('companyName');
    const watchTotalEmployees = watch('totalEmployees');
    const watchOmaniEmployees = watch('omaniEmployees');
    const watchTotalSpending = watch('totalSpending');
    const watchLocalSpending = watch('localSpending');
    const watchSmeSpending = watch('smeSpending');

    const companyOptions = COMPANIES.map(c => ({ value: c.name_en, label: language === 'ar' ? c.name_ar : c.name_en }));

    useEffect(() => {
        if (watchCompanyName) {
            const selectedCompanyData = COMPANIES.find(c => c.name_en === watchCompanyName);
            if(selectedCompanyData) {
                setValue('code', `OIA-${selectedCompanyData.id.toUpperCase()}`);
                setValue('sector', selectedCompanyData.sector);
            }
        }
    }, [watchCompanyName, setValue]);

    const omanizationPercentage = (watchTotalEmployees > 0) ? (watchOmaniEmployees / watchTotalEmployees) * 100 : 0;
    const icvPercentage = (watchTotalSpending && watchTotalSpending > 0) ? (watchLocalSpending || 0) / watchTotalSpending * 100 : 0;
    const smePercentage = (watchTotalSpending && watchTotalSpending > 0) ? (watchSmeSpending || 0) / watchTotalSpending * 100 : 0;


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
                    <Save className="ml-2 h-4 w-4"/>
                    {t('common.save')}
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
                                                {companyOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
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
                                <label>{t('companyForm.identity.sector')}</label>
                                <Input {...register('sector')} readOnly className={cn(inputStyles, "bg-royal-900/80")} />
                            </div>
                            <div>
                                <label>{t('companyForm.identity.legalForm')}</label>
                                <Controller
                                    name="legalForm"
                                    control={control}
                                    render={({ field }) => (
                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className={inputStyles}><SelectValue placeholder={t('common.selectPlaceholder')} /></SelectTrigger>
                                            <SelectContent className="bg-royal-900 text-white border-white/20">
                                                {legalForms.map(lf => <SelectItem key={lf} value={lf}>{lf}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                 {errors.legalForm && <p className="text-red-500 text-sm mt-1">{errors.legalForm.message}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 2: Financial Position */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
                    <Card className="glass h-full">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Wallet className="w-6 h-6 text-gold-400" />
                            <CardTitle>{t('companyForm.financial.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div>
                                <label>{t('companyForm.financial.capital')}</label>
                                <Input type="number" {...register('authorizedCapital', { valueAsNumber: true })} className={inputStyles} />
                                {errors.authorizedCapital && <p className="text-red-500 text-sm mt-1">{errors.authorizedCapital.message}</p>}
                            </div>
                            <div>
                                <label>{t('companyForm.financial.yearEnd')}</label>
                                <Controller
                                    name="financialYearEnd"
                                    control={control}
                                    render={({ field: { onChange, value, ...rest } }) => (
                                        <Input
                                            {...rest}
                                            type="date"
                                            className={cn(inputStyles, "w-full justify-start text-left font-normal")}
                                            style={{ colorScheme: 'dark' }}
                                            value={value ? format(new Date(value), 'yyyy-MM-dd') : ''}
                                            onChange={(e) => onChange(e.target.valueAsDate)}
                                        />
                                    )}
                                />
                                 {errors.financialYearEnd && <p className="text-red-500 text-sm mt-1">{errors.financialYearEnd.message}</p>}
                            </div>
                             <div>
                                <label>{t('companyForm.financial.roi')}</label>
                                <Input type="number" {...register('lastROI', { valueAsNumber: true })} className={inputStyles} />
                            </div>
                            <div className="flex items-center space-x-2 pt-4">
                                <Controller
                                    name="usoObligations"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox id="uso" checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <label htmlFor="uso" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {t('companyForm.financial.uso')}
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 3: ICV & National Impact */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4} className="lg:col-span-2">
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Landmark className="w-6 h-6 text-gold-400" />
                            <CardTitle>{t('companyForm.icv.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold text-lg text-gray-300">{t('dashboard.omanization')}</h4>
                                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">{omanizationPercentage.toFixed(1)}%</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
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
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div>
                                <h4 className="font-semibold text-lg text-gray-300 mb-4">{t('companyForm.icv.spendingTitle')}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label>{t('companyForm.icv.totalSpending')}</label>
                                        <Input type="number" {...register('totalSpending', { valueAsNumber: true })} className={inputStyles} placeholder="OMR" />
                                        {errors.totalSpending && <p className="text-red-500 text-sm mt-1">{errors.totalSpending.message}</p>}
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label>{t('companyForm.icv.localSpending')}</label>
                                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{icvPercentage.toFixed(1)}% ICV</Badge>
                                        </div>
                                        <Input type="number" {...register('localSpending', { valueAsNumber: true })} className={inputStyles} placeholder="OMR" />
                                        {errors.localSpending && <p className="text-red-500 text-sm mt-1">{errors.localSpending.message}</p>}
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label>{t('companyForm.icv.smeSpending')}</label>
                                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">{smePercentage.toFixed(1)}% {t('companyForm.icv.smeShort')}</Badge>
                                        </div>
                                        <Input type="number" {...register('smeSpending', { valueAsNumber: true })} className={inputStyles} placeholder="OMR" />
                                        {errors.smeSpending && <p className="text-red-500 text-sm mt-1">{errors.smeSpending.message}</p>}
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

    

    