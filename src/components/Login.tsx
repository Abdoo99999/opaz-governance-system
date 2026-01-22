
"use client";

import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';
import { UserRole } from '@/app/page';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ZONES } from '@/data/companies';
import { Send } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole, zoneId?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t, dir, language } = useLanguage();
  const [selectedZone, setSelectedZone] = useState<string | undefined>(undefined);

  function renderLoginForm(role: UserRole) {
    const handleZoneLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (role === 'company' && !selectedZone) {
            alert('Please select a zone.'); // Or use a proper toast
            return;
        }
        onLogin(role, selectedZone);
    }
    
    return (
        <form onSubmit={role === 'company' ? handleZoneLogin : (e) => { e.preventDefault(); onLogin(role); }} className="space-y-6 pt-6" dir="rtl">
            {role === 'company' && (
                <div className="space-y-2">
                    <label htmlFor="zoneSelect" className="block text-right px-1">{t('companyForm.identity.companyName')}</label>
                    <Select onValueChange={setSelectedZone}>
                        <SelectTrigger id="zoneSelect" className="h-12 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white">
                            <SelectValue placeholder={t('common.selectPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                            {ZONES.map(z => (
                                <SelectItem key={z.id} value={z.id}>
                                    {language === 'ar' ? z.name_ar : z.name_en}
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
                <Send />
                {t('common.login')}
            </Button>
        </form>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
       // The "Middle Ground" Gradient: Rich deep navy fading to dark slate. 
       // Not too bright blue, not too black.
       background: 'linear-gradient(180deg, #172554 0%, #0b1121 100%)',
      }}
      dir={dir}
    >
        {/* The Gold Ceiling Bar (Keep it visible) */}
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '12px',
            backgroundColor: '#C5A065',
            zIndex: 50,
            boxShadow: '0 0 20px rgba(197, 160, 101, 0.4)'
        }}></div>

        {/* The Login Form Container - SCALED UP */}
        <div className="relative z-10 w-full max-w-lg transform scale-105"> 
           <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-10 rounded-2xl shadow-2xl">
              <CardHeader className="text-center pb-6 pt-0 px-0">
                  <CardTitle className="text-4xl font-bold text-gold-400">{t('appTitle')}</CardTitle>
                  <p className="text-gray-300 text-md pt-2">{t('appSubtitle')}</p>
              </CardHeader>
              <CardContent className="p-0">
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
           </div>
        </div>
        
        {/* Ambient Background Glow (Subtle) */}
        <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.15) 0%, transparent 60%)'
        }}></div>
    </div>
  );
};

export default Login;

    