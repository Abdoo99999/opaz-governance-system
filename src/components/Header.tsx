
"use client";

import React from 'react';
import { Menu, Globe, LayoutDashboard } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { COMPANIES } from '@/data/companies';
import { UserRole } from '@/app/page';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNavigate: (view: string) => void;
  userRole: UserRole;
  isSidebarVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onNavigate, userRole, isSidebarVisible }) => {
  const { language, setLanguage, t } = useLanguage();
  const { selectedCompanyId, setSelectedCompanyId, getSelectedCompany } = useCompany();
  const selectedCompany = getSelectedCompany();

  const handleLanguageChange = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-0 z-40 print:hidden">
      <div className="h-20 flex items-center justify-between px-4 md:px-6 m-4 rounded-lg border-b border-white/5 bg-royal-800/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          {isSidebarVisible ? (
            <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-foreground hover:text-gold-400">
              <Menu className="h-6 w-6" />
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onNavigate('dashboard')} className="text-gold-400 border-gold-500/50 hover:bg-gold-500/10 hover:text-gold-300">
                <LayoutDashboard className="h-5 w-5 ml-2"/>
                {t('menu.dashboard')}
            </Button>
          )}
          {userRole === 'admin' ? (
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger className="w-[280px] bg-royal-900/60 border-white/10 text-white rounded-lg h-12">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent className="bg-royal-900 text-white border-white/20">
                <SelectItem value="all">{language === 'ar' ? 'عرض الجميع' : 'All Companies'}</SelectItem>
                {COMPANIES.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {language === 'ar' ? company.name_ar : company.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            selectedCompany && <div className="text-xl font-bold">{language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en}</div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleLanguageChange} className="text-foreground hover:text-gold-400">
            <Globe className="h-5 w-5 ml-2" />
            <span className="text-sm font-medium">{t('common.switchLang')}</span>
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-gold-500/50">
              <AvatarImage src={userRole === 'admin' ? "https://picsum.photos/seed/admin/100/100" : "https://picsum.photos/seed/company/100/100" } alt="User" data-ai-hint="person portrait" />
              <AvatarFallback>{userRole === 'admin' ? 'A' : 'C'}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:block">{userRole === 'admin' ? t('common.admin') : t('common.company')}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
