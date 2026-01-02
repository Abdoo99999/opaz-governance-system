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
import { Building, Wallet, Landmark, Users, ArrowLeft } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const companies = ['OQ', 'Asyad', 'Omran', 'Ithca', 'Nama', 'FDO', 'MDO', 'Oman Aviation Group', 'Fisheries Development Oman', 'Oman Logistics Company'];
const sectors = ['Energy', 'Logistics', 'Tourism', 'Technology', 'Utilities', 'Food Security', 'Mining', 'Aviation', 'Fisheries'];
const legalForms = ['Holding', 'SAOC', 'SAOG'];

const formSchema = z.object({
    companyName: z.string().min(1, 'Company name is required'),
    code: z.string(),
    sector: z.string().min(1, 'Sector is required'),
    legalForm: z.string().min(1, 'Legal form is required'),
    authorizedCapital: z.number().positive(),
    financialYearEnd: z.date(),
    lastROI: z.number(),
    usoObligations: z.boolean(),
    boardAppointmentDate: z.date(),
    expiryDate: z.date(),
    boardMembers: z.number().int().positive(),
    independentMembers: z.number().int().positive(),
    totalEmployees: z.number().int().positive(),
    omaniEmployees: z.number().int().positive(),
});

type CompanyFormValues = z.infer<typeof formSchema>;

interface CompanyFormProps {
    company?: Partial<CompanyFormValues>;
    onClose: () => void;
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

const CompanyForm: React.FC<CompanyFormProps> = ({ company, onClose }) => {
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<CompanyFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...company,
            code: company?.companyName ? `OIA-${company.companyName.toUpperCase()}` : '',
            authorizedCapital: company?.authorizedCapital || 0,
            lastROI: company?.lastROI || 0,
            boardMembers: company?.boardMembers || 0,
            independentMembers: company?.independentMembers || 0,
            totalEmployees: company?.totalEmployees || 0,
            omaniEmployees: company?.omaniEmployees || 0,
            usoObligations: company?.usoObligations || false,
        },
    });

    const watchCompanyName = watch('companyName');
    const watchBoardAppointmentDate = watch('boardAppointmentDate');
    const watchTotalEmployees = watch('totalEmployees');
    const watchOmaniEmployees = watch('omaniEmployees');

    useEffect(() => {
        if (watchCompanyName) {
            setValue('code', `OIA-${watchCompanyName.toUpperCase().replace(/\s/g, '')}`);
        }
    }, [watchCompanyName, setValue]);

    useEffect(() => {
        if (watchBoardAppointmentDate) {
            const newExpiryDate = new Date(watchBoardAppointmentDate);
            newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 3);
            setValue('expiryDate', newExpiryDate);
        }
    }, [watchBoardAppointmentDate, setValue]);

    const omanizationPercentage = (watchTotalEmployees > 0) ? (watchOmaniEmployees / watchTotalEmployees) * 100 : 0;

    const onSubmit = (data: CompanyFormValues) => {
        console.log(data);
        onClose();
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 text-white h-full overflow-y-auto">
            <header className="flex items-center justify-between mb-8">
                <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/10">
                    <ArrowLeft className="ml-2 h-5 w-5" />
                    Back to Registry
                </Button>
                <h1 className="text-3xl font-bold">
                    {company ? `Edit ${company.companyName}` : 'إضافة شركة جديدة'}
                </h1>
                <Button onClick={handleSubmit(onSubmit)} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                    Save Changes
                </Button>
            </header>

            <form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Card 1: Identity */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Building className="w-6 h-6 text-gold-400" />
                            <CardTitle>البيانات الأساسية</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label>Company Name</label>
                                <Controller
                                    name="companyName"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className={inputStyles}><SelectValue placeholder="Select a company" /></SelectTrigger>
                                            <SelectContent className="bg-royal-900 text-white border-white/20">
                                                {companies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
                            </div>
                            <div>
                                <label>Code</label>
                                <Input {...register('code')} readOnly className={inputStyles} />
                            </div>
                             <div>
                                <label>Sector</label>
                                <Controller
                                    name="sector"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className={inputStyles}><SelectValue placeholder="Select a sector" /></SelectTrigger>
                                            <SelectContent className="bg-royal-900 text-white border-white/20">
                                                {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div>
                                <label>Legal Form</label>
                                <Controller
                                    name="legalForm"
                                    control={control}
                                    render={({ field }) => (
                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className={inputStyles}><SelectValue placeholder="Select legal form" /></SelectTrigger>
                                            <SelectContent className="bg-royal-900 text-white border-white/20">
                                                {legalForms.map(lf => <SelectItem key={lf} value={lf}>{lf}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 2: Financial Position */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Wallet className="w-6 h-6 text-gold-400" />
                            <CardTitle>الموقف المالي</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div>
                                <label>Authorized Capital (OMR)</label>
                                <Input type="number" {...register('authorizedCapital', { valueAsNumber: true })} className={inputStyles} />
                            </div>
                            <div>
                                <label>Financial Year End</label>
                                <Controller
                                    name="financialYearEnd"
                                    control={control}
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className={cn(inputStyles, "w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-royal-900 border-white/20">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                            </div>
                             <div>
                                <label>Last ROI (%)</label>
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
                                    USO Obligations
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                
                {/* Card 3: Board Governance */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Landmark className="w-6 h-6 text-gold-400" />
                            <CardTitle>حوكمة المجلس</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label>Board Appointment Date</label>
                                <Controller
                                    name="boardAppointmentDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className={cn(inputStyles, "w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-royal-900 border-white/20">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                            </div>
                             <div>
                                <label>Expiry Date</label>
                                <Controller
                                    name="expiryDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Input value={field.value ? format(field.value, "PPP") : ''} readOnly className={cn(inputStyles, "bg-royal-900/80")} />
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label>No. of Members</label>
                                    <Input type="number" {...register('boardMembers', { valueAsNumber: true })} className={inputStyles} />
                                </div>
                                <div>
                                    <label>Independent</label>
                                    <Input type="number" {...register('independentMembers', { valueAsNumber: true })} className={inputStyles} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 4: Human Capital */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Users className="w-6 h-6 text-gold-400" />
                            <CardTitle>رأس المال البشري</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label>Total Employees</label>
                                    <Input type="number" {...register('totalEmployees', { valueAsNumber: true })} className={inputStyles} />
                                </div>
                                <div>
                                    <label>No. of Omanis</label>
                                    <Input type="number" {...register('omaniEmployees', { valueAsNumber: true })} className={inputStyles} />
                                </div>
                            </div>
                            <div className="pt-4">
                                <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                                    <span>Omanization Progress</span>
                                    <span>{omanizationPercentage.toFixed(1)}%</span>
                                </div>
                                <Progress value={omanizationPercentage} className="h-3" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </form>
        </div>
    );
};

export default CompanyForm;
