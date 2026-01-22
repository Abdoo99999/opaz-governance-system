
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Users, Briefcase, Map, Waypoints } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CompanyForm from './CompanyForm';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { ZONES } from '@/data/companies';
import type { Zone } from '@/data/companies';
import { useCompany } from '@/context/CompanyContext';
import { UserRole } from '@/app/page';


const initialZonesData: Zone[] = ZONES.map(c => ({
    ...c,
    submissionStatus: 'draft' as 'draft' | 'submitted' | 'returned' | 'approved',
}));


interface CompanyRegistryProps {
    userRole: UserRole;
    onNavigate: (view: string) => void;
}


const CompanyRegistry: React.FC<CompanyRegistryProps> = ({ userRole, onNavigate }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedZoneForForm, setSelectedZoneForForm] = useState<any>(null);
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const { selectedZoneId, refreshData } = useCompany();

    const [zones, setZones] = useState<Zone[]>(() => {
        if (typeof window === 'undefined') return initialZonesData;
        const savedZones = localStorage.getItem('opaz_zones_registry');
        return savedZones ? JSON.parse(savedZones) : initialZonesData;
    });
    
    const zonesToDisplay = useMemo(() => {
        if (userRole === 'company') {
            return zones.filter(c => c.id === selectedZoneId);
        }
        if (userRole === 'admin' && selectedZoneId !== 'all') {
            return zones.filter(c => c.id === selectedZoneId);
        }
        return zones;
    }, [zones, userRole, selectedZoneId]);

    const handleAddZone = () => {
        setSelectedZoneForForm(null);
        setIsFormOpen(true);
    };

    const handleEditZone = (zone: any) => {
        setSelectedZoneForForm(zone);
        setIsFormOpen(true);
    };

    const handleSaveZone = (formData: any) => {
        const isNew = !selectedZoneForForm;
        const zoneDataFromList = ZONES.find(c => c.name_en === formData.companyName)

        const updatedZones = isNew ? 
            [...zones, {
                id: zoneDataFromList?.id || formData.companyName.toLowerCase().replace(/ /g, '_'),
                name_en: formData.companyName,
                name_ar: zoneDataFromList?.name_ar || formData.companyName,
                ...formData,
                submissionStatus: 'draft'
            }] :
            zones.map(c => 
                c.id === selectedZoneForForm.id 
                ? { 
                    ...c, 
                    ...formData,
                    name_en: formData.companyName,
                    name_ar: zoneDataFromList?.name_ar || formData.companyName,
                  } 
                : c
            );

        localStorage.setItem('opaz_zones_registry', JSON.stringify(updatedZones));
        setZones(updatedZones);
        
        toast({
            title: t('common.saveSuccessTitle'),
            description: `${t('common.saveSuccessDesc')} ${formData.companyName}`,
        });

        setIsFormOpen(false);
        setSelectedZoneForForm(null);
        refreshData();
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedZoneForForm(null);
    };
    
    const handleDeleteZone = (zoneId: string) => {
        if (window.confirm(t('common.deleteConfirm'))) {
            const updatedZones = zones.filter(c => c.id !== zoneId);
            localStorage.setItem('opaz_zones_registry', JSON.stringify(updatedZones));
            setZones(updatedZones);
            toast({
                title: t('common.deleteSuccessTitle'),
                variant: 'destructive',
            });
            refreshData();
        }
    };


    return (
        <div className="p-4 md:p-6 lg:p-8 text-white">
            <AnimatePresence>
                {isFormOpen ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="absolute inset-0 z-50 bg-royal-900"
                    >
                        <CompanyForm 
                            company={selectedZoneForForm} 
                            onClose={handleCloseForm}
                            onSave={handleSaveZone} 
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="registry"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <header className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold">{userRole === 'company' ? t('menu.company_profile') : t('registry.title')}</h1>
                            {userRole === 'admin' && (
                                <div className="flex items-center gap-4">
                                     <Button onClick={() => onNavigate('board-directory')} variant="outline" className="text-gold-400 border-gold-500/30 hover:bg-gold-500/10">
                                        <Users className="ml-2 h-5 w-5" />
                                        {t('menu.board_directory')}
                                    </Button>
                                    <Button onClick={handleAddZone} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                                        <Plus className="ml-2 h-5 w-5" />
                                        {t('registry.addNew')}
                                    </Button>
                                </div>
                            )}
                        </header>
                        
                        {userRole === 'admin' && (
                            <div className="mb-8 relative">
                                <Input
                                    type="text"
                                    placeholder={t('registry.searchPlaceholder')}
                                    className="h-12 w-full pl-12 bg-royal-800/40 backdrop-blur-md border-white/10 focus:border-gold-500 rounded-lg text-white"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {zonesToDisplay.map((zone) => (
                                <Card key={zone.id} className="bg-royal-800/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold">{language === 'ar' ? zone.name_ar : zone.name_en}</h2>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => handleEditZone(zone)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                {userRole === 'admin' && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => handleDeleteZone(zone.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-400 mb-4">{zone.type}</div>
                                        
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                                                <span className="text-gray-400 flex items-center gap-2"><Map size={14}/> {t('companyForm.financial.totalArea')}</span>
                                                <Badge variant="outline" className="border-purple-400/30 text-purple-300">{zone.totalArea} كم²</Badge>
                                            </div>
                                            <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                                                <span className="text-gray-400 flex items-center gap-2"><Briefcase size={14}/> {t('companyForm.financial.cumulativeInvestment')}</span>
                                                <Badge variant="outline" className="border-blue-400/30 text-blue-300">{zone.cumulativeInvestment} مليون</Badge>
                                            </div>
                                            <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                                                <span className="text-gray-400 flex items-center gap-2"><Users size={14}/> {t('companyForm.financial.directJobs')}</span>
                                                <Badge variant="outline" className="border-green-400/30 text-green-300">{zone.directJobs}</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CompanyRegistry;
