
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';
import { UserRole } from '@/app/page';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { COMPANIES } from '@/data/companies';

interface LoginProps {
  onLogin: (role: UserRole, companyId?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t, dir, language } = useLanguage();
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(undefined);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-royal-900 text-white" dir={dir}>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-lg z-10"
        >
            <Card className="glass">
                <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-gold-400">{t('appTitle')}</CardTitle>
                    <p className="text-gray-300 text-sm pt-2">{t('appSubtitle')}</p>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="admin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-royal-900/50">
                            <TabsTrigger value="admin">{t('common.admin')}</TabsTrigger>
                            <TabsTrigger value="company">{t('common.company')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="admin">
                            {renderLoginForm('admin')}
                        </TabsContent>
                        <TabsContent value="company">
                            {renderLoginForm('company')}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </motion.div>
    </div>
  );

  function renderLoginForm(role: UserRole) {
    const handleCompanyLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (role === 'company' && !selectedCompany) {
            alert('Please select a company.'); // Or use a proper toast
            return;
        }
        onLogin(role, selectedCompany);
    }
    
    return (
        <form onSubmit={role === 'company' ? handleCompanyLogin : (e) => { e.preventDefault(); onLogin(role); }} className="space-y-6 pt-6">
            {role === 'company' && (
                <div className="space-y-2">
                    <label htmlFor="companySelect">{t('companyForm.identity.companyName')}</label>
                    <Select onValueChange={setSelectedCompany}>
                        <SelectTrigger id="companySelect" className="h-12 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white">
                            <SelectValue placeholder={t('common.selectPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                            {COMPANIES.map(c => (
                                <SelectItem key={c.id} value={c.id}>
                                    {language === 'ar' ? c.name_ar : c.name_en}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div className="space-y-2">
                <label htmlFor="username">{t('common.username')}</label>
                <Input id="username" type="text" placeholder={t('common.usernamePlaceholder')} defaultValue={role === 'admin' ? 'admin' : 'company_user'} className="h-12 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white" />
            </div>
            <div className="space-y-2">
                <label htmlFor="password">{t('common.password')}</label>
                <Input id="password" type="password" placeholder={t('common.passwordPlaceholder')} defaultValue="password" className="h-12 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white" />
            </div>
            <Button type="submit" className="w-full h-12 bg-gold-500 text-royal-900 hover:bg-gold-400 text-lg font-bold">
                {t('common.login')}
            </Button>
        </form>
    );
  }
};

export default Login;

    