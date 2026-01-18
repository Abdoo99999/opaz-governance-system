
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import CompanyForm from './CompanyForm';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { COMPANIES } from '@/data/companies';
import type { Company } from '@/data/companies';
import { useCompany } from '@/context/CompanyContext';
import { UserRole } from '@/app/page';


const initialCompaniesData = COMPANIES.map(c => ({
    ...c,
    omanization: 70 + Math.floor(Math.random() * 25), // 70-95%
    risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    submissionStatus: 'draft' as 'draft' | 'submitted' | 'returned' | 'approved',
}));


const riskVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'Low': 'default',
    'Medium': 'secondary',
    'High': 'destructive'
}

interface CompanyRegistryProps {
    userRole: UserRole;
    onNavigate: (view: string) => void;
}


const CompanyRegistry: React.FC<CompanyRegistryProps> = ({ userRole, onNavigate }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCompanyForForm, setSelectedCompanyForForm] = useState<any>(null);
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const { selectedCompanyId, refreshData } = useCompany();

    const [companies, setCompanies] = useState(() => {
        if (typeof window === 'undefined') return initialCompaniesData;
        const savedCompanies = localStorage.getItem('oia_companies_registry');
        return savedCompanies ? JSON.parse(savedCompanies) : initialCompaniesData;
    });
    
    const companiesToDisplay = useMemo(() => {
        if (userRole === 'company') {
            return companies.filter(c => c.id === selectedCompanyId);
        }
        if (userRole === 'admin' && selectedCompanyId !== 'all') {
            return companies.filter(c => c.id === selectedCompanyId);
        }
        return companies;
    }, [companies, userRole, selectedCompanyId]);

    const handleAddCompany = () => {
        setSelectedCompanyForForm(null);
        setIsFormOpen(true);
    };

    const handleEditCompany = (company: any) => {
        setSelectedCompanyForForm(company);
        setIsFormOpen(true);
    };

    const handleSaveCompany = (formData: any) => {
        const isNew = !selectedCompanyForForm;
        const companyDataFromList = COMPANIES.find(c => c.name_en === formData.companyName)

        const updatedCompanies = isNew ? 
            [...companies, {
                id: companyDataFromList?.id || formData.companyName.toLowerCase().replace(/ /g, '_'),
                name_en: formData.companyName,
                name_ar: companyDataFromList?.name_ar || formData.companyName,
                ...formData,
                omanization: formData.totalEmployees > 0 ? formData.omaniEmployees / formData.totalEmployees * 100 : 0,
                risk: 'Medium',
                submissionStatus: 'draft'
            }] :
            companies.map(c => 
                c.id === selectedCompanyForForm.id 
                ? { 
                    ...c, 
                    ...formData,
                    name_en: formData.companyName,
                    name_ar: companyDataFromList?.name_ar || formData.companyName,
                    omanization: formData.totalEmployees > 0 ? formData.omaniEmployees / formData.totalEmployees * 100 : 0,
                  } 
                : c
            );

        localStorage.setItem('oia_companies_registry', JSON.stringify(updatedCompanies));
        setCompanies(updatedCompanies);
        
        toast({
            title: t('common.saveSuccessTitle'),
            description: `${t('common.saveSuccessDesc')} ${formData.companyName}`,
        });

        setIsFormOpen(false);
        setSelectedCompanyForForm(null);
        refreshData();
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedCompanyForForm(null);
    };
    
    const handleDeleteCompany = (companyId: string) => {
        // Add confirmation dialog before deleting
        if (window.confirm(t('common.deleteConfirm'))) {
            const updatedCompanies = companies.filter(c => c.id !== companyId);
            localStorage.setItem('oia_companies_registry', JSON.stringify(updatedCompanies));
            setCompanies(updatedCompanies);
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
                            company={selectedCompanyForForm} 
                            onClose={handleCloseForm}
                            onSave={handleSaveCompany} 
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
                                    <Button onClick={handleAddCompany} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
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
                            {companiesToDisplay.map((company) => (
                                <Card key={company.id} className="bg-royal-800/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold">{language === 'ar' ? company.name_ar : company.name_en}</h2>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => handleEditCompany(company)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                {userRole === 'admin' && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => handleDeleteCompany(company.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-400 mb-4">{company.sector}</div>
                                        <div className="mb-2">
                                            <div className="flex justify-between items-center text-xs text-gray-300 mb-1">
                                                <span>{t('dashboard.omanization')}</span>
                                                <span>{company.omanization.toFixed(0)}%</span>
                                            </div>
                                            <Progress value={company.omanization} className="h-2" />
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-300 mr-2">{t('registry.riskLevel')}:</span>
                                            <Badge variant={riskVariant[company.risk]}>{t(`registry.risks.${company.risk.toLowerCase()}`)}</Badge>
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
