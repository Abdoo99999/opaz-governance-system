"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t, dir } = useLanguage();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-royal-900 text-white" dir={dir}>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md z-10"
        >
            <Card className="glass">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gold-400">{t('appTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="admin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-royal-900/50">
                            <TabsTrigger value="admin">{t('common.admin')}</TabsTrigger>
                            <TabsTrigger value="company">{t('common.company')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="admin">
                            {renderLoginForm()}
                        </TabsContent>
                        <TabsContent value="company">
                            {renderLoginForm()}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </motion.div>
    </div>
  );

  function renderLoginForm() {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-6 pt-6">
            <div className="space-y-2">
                <label htmlFor="username">{t('common.username')}</label>
                <Input id="username" type="text" placeholder={t('common.usernamePlaceholder')} defaultValue="admin" className="h-12 bg-royal-900/50 border-white/10 focus:border-gold-500 rounded-lg text-white" />
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
