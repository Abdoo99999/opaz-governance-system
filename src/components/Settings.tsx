"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Sliders, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
    }),
};

const Settings: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="p-4 md:p-6 lg:p-8 text-white h-full">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
                <p className="text-gray-400 mt-1">{t('settings.subtitle')}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Super Admin Profile */}
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className="lg:col-span-1">
                    <Card className="glass h-full">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <User className="w-6 h-6 text-gold-400" />
                            <CardTitle>{t('settings.profile.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center text-center">
                            <Avatar className="h-32 w-32 border-4 border-gold-500/50 mb-4">
                                <AvatarImage src="https://picsum.photos/seed/architect/200/200" alt="Dr. Abdulrahman" data-ai-hint="person portrait professional" />
                                <AvatarFallback>DA</AvatarFallback>
                            </Avatar>
                            <h2 className="text-2xl font-bold text-gold-400">Dr. Abdulrahman</h2>
                            <p className="text-gray-300">{t('settings.profile.role')}</p>
                            <div className="w-full space-y-4 mt-8 text-right">
                                <div>
                                    <label className="text-sm text-gray-400">{t('settings.profile.email')}</label>
                                    <Input defaultValue="architect@oia.gov.om" className="h-12 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">{t('settings.profile.phone')}</label>
                                    <Input defaultValue="+968 99XXXXXX" className="h-12 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Governance Weights & System Info */}
                <div className="lg:col-span-2 space-y-8">
                     {/* Governance Weights */}
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
                        <Card className="glass">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Sliders className="w-6 h-6 text-gold-400" />
                                <CardTitle>{t('settings.weights.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-gray-300">{t('settings.weights.financial')}</label>
                                    <div className="flex items-center gap-4">
                                        <Slider defaultValue={[20]} max={100} step={5} className="flex-1" />
                                        <span className="font-bold text-lg w-16 text-center">20%</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-gray-300">{t('settings.weights.leadership')}</label>
                                    <div className="flex items-center gap-4">
                                        <Slider defaultValue={[15]} max={100} step={5} />
                                        <span className="font-bold text-lg w-16 text-center">15%</span>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">{t('settings.weights.reset')}</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* System Info & Credits */}
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
                        <Card className="glass">
                             <CardHeader className="flex flex-row items-center gap-4">
                                <Info className="w-6 h-6 text-gold-400" />
                                <CardTitle>{t('settings.info.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center space-y-4 text-gray-400">
                                 <p className="text-xl">{t('settings.info.version')}</p>
                                 <p>{t('settings.info.license')}</p>
                                 <p className="text-xs pt-4 border-t border-white/10 mt-4">{t('settings.info.credits')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
