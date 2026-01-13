
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Send, X, Eye, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import type { Company, SubmissionStatus } from '@/data/companies';
import { format, parseISO } from 'date-fns';

const ApprovalRequests: React.FC = () => {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    
    // MOCK DATA: In a real app, this would come from a global state/API
    const [companies, setCompanies] = useState<any[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [returnNotes, setReturnNotes] = useState('');

    useEffect(() => {
         if (typeof window === 'undefined') return;
         const savedCompanies = localStorage.getItem('oia_companies_registry');
         if(savedCompanies){
             const parsed = JSON.parse(savedCompanies);
             // Add mock data for submitted companies
             parsed[1].submissionStatus = 'submitted';
             parsed[1].submissionDate = new Date().toISOString();
             parsed[2].submissionStatus = 'submitted';
             parsed[2].submissionDate = new Date().toISOString();
             parsed[4].submissionStatus = 'submitted';
             parsed[4].submissionDate = new Date().toISOString();
             setCompanies(parsed);
         }
    }, []);
    
    const submittedCompanies = companies.filter(c => c.submissionStatus === 'submitted');
    
    const updateCompanyStatus = (companyId: string, status: SubmissionStatus, notes?: string) => {
        setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, submissionStatus: status, notes: notes || c.notes } : c));
        // In a real app, you'd also save this back to localStorage or your backend
        localStorage.setItem('oia_companies_registry', JSON.stringify(companies.map(c => c.id === companyId ? { ...c, submissionStatus: status, notes: notes || c.notes } : c)));
    };
    
    const handleReturn = () => {
        if (!selectedCompany || !returnNotes) {
            toast({
                title: t('common.errorTitle'),
                description: t('common.fillAllFields'),
                variant: 'destructive',
            });
            return;
        }
        updateCompanyStatus(selectedCompany.id, 'returned', returnNotes);
        toast({ title: t('approvals.return'), description: `تم إعادة تقييم شركة ${selectedCompany.name_ar} للتعديل.` });
        setIsReturnModalOpen(false);
        setReturnNotes('');
        setSelectedCompany(null);
    };
    
    const handleApprove = (companyId: string) => {
        updateCompanyStatus(companyId, 'approved');
        const company = companies.find(c => c.id === companyId);
        toast({ title: t('approvals.approve'), description: `تم اعتماد تقييم شركة ${company?.name_ar} نهائياً.` });
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 text-white">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">{t('approvals.title')}</h1>
            </header>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass">
                    <CardContent className="p-0">
                         <Table>
                            <TableHeader>
                                <TableRow className="border-b-white/10 hover:bg-transparent">
                                    <TableHead className="text-white font-bold">{t('approvals.companyName')}</TableHead>
                                    <TableHead className="text-white font-bold">{t('approvals.submissionDate')}</TableHead>
                                    <TableHead className="text-center text-white font-bold">{t('approvals.maturityScore')}</TableHead>
                                    <TableHead className="text-center text-white font-bold">{t('approvals.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submittedCompanies.map(company => (
                                    <TableRow key={company.id} className="border-b-white/10 hover:bg-white/5">
                                        <TableCell className="font-medium">{language === 'ar' ? company.name_ar : company.name_en}</TableCell>
                                        <TableCell>{format(parseISO(company.submissionDate), 'd MMMM yyyy')}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge className="bg-gold-500/20 text-gold-300 border-gold-500/30">4.1 / 5</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                                    <FileText className="h-5 w-5"/>
                                                </Button>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                       <Button variant="outline" size="icon" className="text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10 hover:text-yellow-300" onClick={() => { setSelectedCompany(company); setIsReturnModalOpen(true); }}>
                                                            <Send className="h-5 w-5"/>
                                                        </Button>
                                                    </DialogTrigger>
                                                </Dialog>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="icon" className="text-emerald-400 border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300">
                                                            <Check className="h-5 w-5"/>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="glass text-white">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>{t('approvals.approveConfirmTitle')}</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-gray-300 pt-2">{t('approvals.approveConfirmDesc')}</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleApprove(company.id)} className="bg-success text-white">{t('approvals.approve')}</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
            
            {/* Return for Edits Modal */}
            <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
                <DialogContent className="glass text-white">
                    <DialogHeader>
                        <DialogTitle className="text-gold-400">{t('approvals.returnModalTitle')}</DialogTitle>
                        <DialogDescription className="text-gray-300 pt-2">{t('approvals.returnModalDesc')}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea 
                            value={returnNotes}
                            onChange={(e) => setReturnNotes(e.target.value)}
                            placeholder={t('approvals.notesPlaceholder')}
                            className="bg-royal-900/50 border-white/20 min-h-[120px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReturnModalOpen(false)}>{t('common.cancel')}</Button>
                        <Button onClick={handleReturn} className="bg-gold-500 text-royal-900">{t('approvals.sendFeedback')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ApprovalRequests;
