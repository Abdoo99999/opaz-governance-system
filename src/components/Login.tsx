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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
     style={{
       // Make the background distinct Navy (Not Black)
       background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
     }}
     dir={dir}
>
    {/* 1. THE GOLD CEILING BAR (Physical Element - Cannot be hidden) */}
    <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '12px', // Thick visible bar
        backgroundColor: '#C5A065', // OIA Copper Gold
        zIndex: 50, // Force on top
        boxShadow: '0 0 15px rgba(197, 160, 101, 0.5)' // Gold Glow
    }}></div>

    {/* 2. THE AMBIENT GLOW (Behind the Form) */}
    <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(30, 58, 138, 0.4) 0%, transparent 70%)',
        zIndex: 0
    }}></div>

    {/* 3. THE LOGIN FORM */}
    <div className="relative z-10 w-full max-w-md mt-10"> 
       <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full"
        >
            <Card className="glass">
                <CardHeader className="text-center pb-6 pt-8">
                    <CardTitle className="text-4xl font-bold text-gold-400">{t('appTitle')}</CardTitle>
                    <p className="text-gray-300 text-md pt-2">{t('appSubtitle')}</p>
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
        <form onSubmit={role === 'company' ? handleCompanyLogin : (e) => { e.preventDefault(); onLogin(role); }} className="space-y-6 pt-6" dir="rtl">
            {role === 'company' && (
                <div className="space-y-2">
                    <label htmlFor="companySelect" className="block text-right px-1">{t('companyForm.identity.companyName')}</label>
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
                <label htmlFor="username" className="block text-right px-1">{t('common.username')}</label>
                <Input id="username" type="text" placeholder={t('common.usernamePlaceholder')} defaultValue={role === 'admin' ? 'admin' : 'company_user'} className="h-12 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white text-right" />
            </div>
            <div className="space-y-2">
                <label htmlFor="password" className="block text-right px-1">{t('common.password')}</label>
                <Input id="password" type="password" placeholder={t('common.passwordPlaceholder')} defaultValue="password" className="h-12 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white text-right" />
            </div>
            <Button type="submit" className="w-full h-12 bg-gold-500 text-royal-900 hover:bg-gold-400 text-lg font-bold">
                {t('common.login')}
            </Button>
        </form>
    );
  }
};

export default Login;
