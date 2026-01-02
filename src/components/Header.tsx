"use client";

import React from 'react';
import { Menu, Globe } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-0 z-40 print:hidden">
      <div className="h-16 flex items-center justify-between px-4 md:px-6 m-4 rounded-lg border-b border-white/5 bg-royal-800/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-foreground hover:text-gold-400">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleLanguageChange} className="text-foreground hover:text-gold-400">
            <Globe className="h-5 w-5 ml-2" />
            <span className="text-sm font-medium">{t('common.switchLang')}</span>
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-gold-500/50">
              <AvatarImage src="https://picsum.photos/seed/admin/100/100" alt="Admin" data-ai-hint="person portrait" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:block">{t('common.admin')}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
