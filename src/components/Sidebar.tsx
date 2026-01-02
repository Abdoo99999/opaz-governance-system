"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Building2, ClipboardCheck, ShieldAlert, LineChart, Kanban, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

const menuItems = [
  { name: 'dashboard', icon: LayoutDashboard, view: 'dashboard' },
  { name: 'registry', icon: Building2, view: 'companies' },
  { name: 'assessment', icon: ClipboardCheck, view: 'maturity-assessment' },
  { name: 'compliance', icon: ShieldAlert, view: 'compliance-monitor' },
  { name: 'improvement', icon: Kanban, view: 'improvement-plan' },
  { name: 'reports', icon: LineChart, view: 'reports' },
  { name: 'settings', icon: Settings, view: 'settings' },
];

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, onNavigate, onLogout }) => {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "relative h-screen bg-royal-800/50 backdrop-blur-xl border-l border-white/5 transition-all duration-300 ease-in-out print:hidden",
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="h-20 flex items-center justify-center">
          <h1 className={cn("font-bold text-xl text-gold-500 transition-opacity duration-300", !isOpen && 'opacity-0')}>
            {t('appTitle')}
          </h1>
        </div>
        <nav className="flex-1 px-4 py-8">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="relative mb-2">
                <button
                  onClick={() => onNavigate(item.view)}
                  className={cn(
                    "flex items-center w-full py-3 px-4 rounded-md transition-colors duration-200",
                    currentView === item.view
                      ? "text-gold-400 bg-white/5"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-6 h-6 ml-4" />
                  <span className={cn("font-medium transition-opacity duration-300", !isOpen && 'opacity-0')}>
                    {t(`menu.${item.name}`)}
                  </span>
                </button>
                {currentView === item.view && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute right-0 top-0 h-full w-1 bg-gold-500 rounded-l-full"
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-4 pb-4">
            <Separator className="my-4 bg-white/10" />
             <button
                  onClick={onLogout}
                  className="flex items-center w-full py-3 px-4 rounded-md transition-colors duration-200 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="w-6 h-6 ml-4" />
                  <span className={cn("font-medium transition-opacity duration-300", !isOpen && 'opacity-0')}>
                    {t('menu.logout')}
                  </span>
                </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
