"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import CompanyForm from './CompanyForm';

const companiesData = [
    { name: 'OQ', sector: 'Energy', omanization: 85, risk: 'Low' },
    { name: 'Asyad', sector: 'Logistics', omanization: 78, risk: 'Medium' },
    { name: 'Omran', sector: 'Tourism', omanization: 92, risk: 'Low' },
    { name: 'Ithca', sector: 'Technology', omanization: 60, risk: 'High' },
    { name: 'Nama', sector: 'Utilities', omanization: 88, risk: 'Medium' },
    { name: 'Food and Dairy Group (FDO)', sector: 'Food Security', omanization: 75, risk: 'Low' },
    { name: 'Minerals Development Oman (MDO)', sector: 'Mining', omanization: 80, risk: 'Medium' },
    { name: 'Oman Aviation Group', sector: 'Aviation', omanization: 70, risk: 'High' },
    { name: 'Fisheries Development Oman (FDO)', sector: 'Fisheries', omanization: 95, risk: 'Low' },
    { name: 'Oman Logistics Company (Khazaen)', sector: 'Logistics', omanization: 82, risk: 'Medium' },
];

const riskVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'Low': 'default',
    'Medium': 'secondary',
    'High': 'destructive'
}

const CompanyRegistry: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);

    const handleAddCompany = () => {
        setSelectedCompany(null);
        setIsFormOpen(true);
    };

    const handleEditCompany = (company: any) => {
        setSelectedCompany(company);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
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
                        <CompanyForm company={selectedCompany} onClose={handleCloseForm} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="registry"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <header className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold">سجل الشركات</h1>
                            <Button onClick={handleAddCompany} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                                <Plus className="ml-2 h-5 w-5" />
                                إضافة شركة جديدة
                            </Button>
                        </header>

                        <div className="mb-8 relative">
                            <Input
                                type="text"
                                placeholder="بحث باسم الشركة أو الكود..."
                                className="h-12 w-full pl-12 bg-royal-800/40 backdrop-blur-md border-white/10 focus:border-gold-500 rounded-lg text-white"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {companiesData.map((company, index) => (
                                <Card key={index} className="bg-royal-800/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold">{company.name}</h2>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => handleEditCompany(company)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-400 mb-4">{company.sector}</div>
                                        <div className="mb-2">
                                            <div className="flex justify-between items-center text-xs text-gray-300 mb-1">
                                                <span>Omanization</span>
                                                <span>{company.omanization}%</span>
                                            </div>
                                            <Progress value={company.omanization} className="h-2" />
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-300 mr-2">Risk Level:</span>
                                            <Badge variant={riskVariant[company.risk]}>{company.risk}</Badge>
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
