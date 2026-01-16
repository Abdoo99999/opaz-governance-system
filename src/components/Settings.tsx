"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Sliders, Info, Trash2, DatabaseZap, ShieldCheck, Languages, SunMoon, Bell } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { COMPANIES } from '@/data/companies';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
    }),
};

const Settings: React.FC = () => {
    const { t, language, setLanguage } = useLanguage();
    const { toast } = useToast();

    const handleResetData = () => {
        if (typeof window === 'undefined') return;

        // Keys to remove
        const baseKeys = ['oia_companies_registry', 'oia_indicators_data'];
        const companySpecificKeys = [
            'oia_assessment_',
            'oia_compliance_',
            'oia_improvement_plan_'
        ];

        // Remove base keys
        baseKeys.forEach(key => localStorage.removeItem(key));

        // Remove company-specific keys
        COMPANIES.forEach(company => {
            companySpecificKeys.forEach(prefix => {
                localStorage.removeItem(`${prefix}${company.id}`);
            });
        });
        
        toast({
            title: t('settings.data.resetSuccessTitle'),
            description: t('settings.data.resetSuccessDesc'),
        });

        // Reload to apply changes
        setTimeout(() => window.location.reload(), 1500);
    };

    const handleLanguageToggle = () => {
        setLanguage(language === 'ar' ? 'en' : 'ar');
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 text-white h-full space-y-8">
            <header className="mb-4">
                <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
                <p className="text-gray-400 mt-1">{t('settings.subtitle')}</p>
            </header>

            {/* Profile Card */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
                <Card className="glass flex items-center p-6">
                    <Avatar className="h-24 w-24 border-4 border-gold-500/50 bg-royal-800/50">
                        <div className="w-full h-full flex items-center justify-center">
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M25 85L35 25L45 85" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M30 65H40" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round"/>
                                <path d="M55 85V25L75 85V25" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </Avatar>
                    <div className="mr-6 flex-grow">
                        <h2 className="text-3xl font-bold text-gold-400">Dr. Abdulrahman Al-Nofali</h2>
                        <p className="text-gray-300 mt-1">{t('settings.profile.role')}</p>
                    </div>
                    <div className="flex flex-col items-center">
                         <Badge className="bg-success/20 text-success border-success/30">
                           <ShieldCheck className="h-4 w-4 ml-1"/>
                           {t('common.admin')}
                         </Badge>
                    </div>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* System Preferences */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
                    <Card className="glass h-full">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Sliders className="w-6 h-6 text-gold-400" />
                            <CardTitle>System Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-2">
                            <div className="flex items-center justify-between p-3 bg-royal-900/40 rounded-lg">
                                <div className='flex items-center gap-3'>
                                    <Languages className="w-5 h-5 text-gray-400"/>
                                    <Label htmlFor="language-switch" className="text-lg">Language</Label>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className='text-gray-400'>EN</span>
                                    <Switch
                                        id="language-switch"
                                        checked={language === 'ar'}
                                        onCheckedChange={handleLanguageToggle}
                                    />
                                    <span className='text-gold-400 font-bold'>AR</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-royal-900/40 rounded-lg">
                                <div className='flex items-center gap-3'>
                                    <SunMoon className="w-5 h-5 text-gray-400"/>
                                    <Label htmlFor="theme-switch" className="text-lg">Theme</Label>
                                </div>
                                <Switch id="theme-switch" disabled />
                            </div>
                             <div className="flex items-center justify-between p-3 bg-royal-900/40 rounded-lg">
                                <div className='flex items-center gap-3'>
                                    <Bell className="w-5 h-5 text-gray-400"/>
                                    <Label htmlFor="notifications-switch" className="text-lg">Notifications</Label>
                                </div>
                                <Switch id="notifications-switch" defaultChecked disabled />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* System Info */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
                    <Card className="glass h-full">
                         <CardHeader className="flex flex-row items-center gap-4">
                            <Info className="w-6 h-6 text-gold-400" />
                            <CardTitle>{t('settings.info.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4 text-gray-300">
                             <p className="text-xl">{t('settings.info.version')}</p>
                             <p>{t('settings.info.license')}</p>
                             <p className="text-xs pt-4 border-t border-white/10 mt-4">{t('settings.info.credits')}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Danger Zone */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
                 <Card className="glass border-danger/30">
                     <CardHeader className="flex flex-row items-center gap-4">
                        <DatabaseZap className="w-6 h-6 text-danger" />
                        <CardTitle className="text-red-400">{t('settings.data.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-300 mb-6">{t('settings.data.description')}</p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full md:w-auto">
                                    <Trash2 className="mr-2 h-5 w-5" />
                                    {t('settings.data.resetButton')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass text-white">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('settings.data.confirmTitle')}</AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-300 pt-2">
                                        {t('settings.data.confirmDesc')}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="text-white border-white/20">{t('common.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleResetData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        {t('settings.data.confirmButton')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Settings;
