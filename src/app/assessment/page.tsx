
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Info, Save, RotateCcw, Plus, Pencil, Trash2, FileText, Paperclip } from 'lucide-react';
import { ASSESSMENT_DATA, AssessmentCategory, AssessmentIndicator } from '@/data/assessmentData'; 
import { cn } from '@/lib/utils';
import { UserRole } from '@/app/page';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { useYear } from '@/context/YearContext';


const ZoneAssessmentPage = ({ userRole }: { userRole: UserRole }) => {
  const { t, language } = useLanguage();
  const { selectedZoneId, refreshData } = useCompany();
  const { selectedYear } = useYear();
  const [assessmentData, setAssessmentData] = useState<AssessmentCategory[]>(ASSESSMENT_DATA);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState<{ categoryId: string; indicator: AssessmentIndicator | null } | null>(null);

  const getStorageKey = (companyId: string, year: number) => `opaz_operational_assessment_${companyId}_${year}`;

  useEffect(() => {
    if (typeof window === 'undefined' || !selectedZoneId || selectedZoneId === 'all') {
        setInputs({});
        setNotes({});
        setFiles({});
        return;
    }
    
    const storageKey = getStorageKey(selectedZoneId, selectedYear);
    const savedDataStr = localStorage.getItem(storageKey);
    
    if (savedDataStr) {
        const { inputs: savedInputs, notes: savedNotes } = JSON.parse(savedDataStr);
        setInputs(savedInputs || {});
        setNotes(savedNotes || {});
    } else {
        setInputs({});
        setNotes({});
    }
    setFiles({});
  }, [selectedZoneId, selectedYear]);

  const handleSelectChange = (indicatorId: string, valueStr: string) => {
    const value = parseFloat(valueStr);
    setInputs(prev => ({ ...prev, [indicatorId]: value }));
  };

  const handleNumberChange = (indicatorId: string, valueStr: string, maxScore: number = 100) => {
    let numValue = parseFloat(valueStr);
    if (isNaN(numValue)) numValue = 0;
    if (numValue > maxScore) numValue = maxScore;
    if (numValue < 0) numValue = 0;

    setInputs(prev => ({ ...prev, [indicatorId]: numValue }));
  };

  const handleNoteChange = (indicatorId: string, text: string) => {
    setNotes(prev => ({ ...prev, [indicatorId]: text }));
  };

  const handleFileChange = (indicatorId: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [indicatorId]: file }));
  };

  const totalScore = useMemo(() => {
    let total = 0;
    assessmentData.forEach(cat => {
      cat.indicators.forEach(ind => {
        const val = inputs[ind.id] || 0;
        if (ind.type === 'select') {
          total += val;
        } else {
          const max = ind.maxScore || 100;
          total += (val / max) * ind.weight;
        }
      });
    });
    return parseFloat(total.toFixed(2));
  }, [inputs, assessmentData]);

  const calculateIndicatorScore = (ind: any, val: number) => {
    if (ind.type === 'select') {
      return val.toFixed(1);
    } else {
      const max = ind.maxScore || 100;
      return ((val / max) * ind.weight).toFixed(1);
    }
  };

  const handleSave = () => {
    if (!selectedZoneId || selectedZoneId === 'all') {
        toast({
            title: t('common.errorTitle'),
            description: t('common.selectCompanyToStart'),
            variant: 'destructive',
        });
        return;
    }
    const storageKey = getStorageKey(selectedZoneId, selectedYear);
    const dataToSave = {
        inputs: inputs,
        notes: notes,
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));

    toast({
      title: t('common.saveSuccessTitle'),
      description: `${t('assessment.saveSuccessDesc')} ${totalScore} / 100`,
    });
    refreshData();
  };
  
  const handleOpenModal = (categoryId: string, indicator: AssessmentIndicator | null) => {
    setEditingState({ categoryId, indicator });
    setIsModalOpen(true);
  };
  
  const handleDeleteIndicator = (categoryId: string, indicatorId: string) => {
      if (confirm(t('assessment.deleteIndicatorTitle'))) {
          setAssessmentData(prevData =>
              prevData.map(cat =>
                  cat.id === categoryId
                      ? { ...cat, indicators: cat.indicators.filter(ind => ind.id !== indicatorId) }
                      : cat
              )
          );
      }
  };

  const handleSaveIndicator = (indicatorData: AssessmentIndicator) => {
    if (!editingState) return;
    const { categoryId, indicator } = editingState;

    setAssessmentData(prevData =>
        prevData.map(cat => {
            if (cat.id === categoryId) {
                if (indicator) { // Editing existing
                    return {
                        ...cat,
                        indicators: cat.indicators.map(ind =>
                            ind.id === indicator.id ? indicatorData : ind
                        )
                    };
                } else { // Adding new
                    const newIndicatorWithId = { ...indicatorData, id: `custom-${Date.now()}`};
                    return {
                        ...cat,
                        indicators: [...cat.indicators, newIndicatorWithId]
                    };
                }
            }
            return cat;
        })
    );
    setIsModalOpen(false);
    setEditingState(null);
  };


  return (
    <div className="space-y-6 pb-20 p-4 md:p-6 lg:p-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gold-400">{t('menu.zone_assessment')}</h1>
          <p className="text-gray-400 text-sm mt-1">{t('zone_assessment.subtitle')}</p>
        </div>
        
        <div className="glass p-4 flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-400 font-medium uppercase">{t('zone_assessment.finalScore')}</div>
            <div className="text-xs text-gold-500">{t('zone_assessment.outOf100')}</div>
          </div>
          <div className="h-10 w-px bg-white/10"></div>
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-bold ${totalScore >= 80 ? 'text-green-400' : totalScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {totalScore}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {assessmentData.map((category) => (
          <Card key={category.id} className="glass transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-gold-500 overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-gold-400">
                  {language === 'ar' ? category.title : category.title_en}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-gold-500/10 text-gold-400 border-gold-500/20 px-3">
                    {t('zone_assessment.weight')}: {category.weight}%
                  </Badge>
                   {userRole === 'admin' && (
                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(category.id, null)}>
                            <Plus className="w-4 h-4 ml-2" />
                            {t('zone_assessment.addIndicator')}
                        </Button>
                    )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {category.indicators.map((indicator, index) => {
                const currentValue = inputs[indicator.id] || 0;
                const earnedPoints = calculateIndicatorScore(indicator, currentValue);
                const isEven = index % 2 === 0;

                return (
                  <div key={indicator.id} className={`p-6 border-b border-white/5 last:border-0 ${!isEven ? 'bg-white/[0.02]' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-4">
                        <div className="md:col-span-5 space-y-2">
                          <Label className="text-base font-medium text-gray-100 leading-relaxed block">
                            {language === 'ar' ? indicator.text : indicator.text_en}
                          </Label>
                          <div className="flex items-start gap-2 text-sm text-gray-400 bg-slate-800/50 p-2 rounded border border-white/5">
                            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                            <span className="leading-relaxed">{language === 'ar' ? indicator.subText : indicator.subText_en}</span>
                          </div>
                        </div>

                        <div className="md:col-span-4 flex flex-col justify-center gap-2">
                          <div className="flex justify-between text-xs text-gray-500 px-1">
                            <span>{t('zone_assessment.indicatorValue')}</span>
                            <span>{t('zone_assessment.weight')}: {indicator.weight}</span>
                          </div>

                          {indicator.type === 'select' ? (
                            <Select 
                              onValueChange={(val) => handleSelectChange(indicator.id, val)} 
                              value={inputs[indicator.id]?.toString()}
                              dir={language === 'ar' ? 'rtl' : 'ltr'}
                            >
                              <SelectTrigger className="w-full bg-royal-900 border-white/10 text-white focus:ring-gold-500/50 h-11">
                                <SelectValue placeholder={t('common.selectPlaceholder')} />
                              </SelectTrigger>
                              <SelectContent className="bg-royal-800 border-white/10 text-white">
                                {indicator.options?.map((opt, idx) => (
                                  <SelectItem key={idx} value={opt.score.toString()} className="text-right hover:!bg-gold-500 !bg-gold-500">
                                    {language === 'ar' ? opt.label : opt.label_en}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="relative">
                              <Input
                                type="number"
                                min="0"
                                max={indicator.maxScore || 100}
                                value={currentValue === 0 ? '' : currentValue}
                                onChange={(e) => handleNumberChange(indicator.id, e.target.value, indicator.maxScore)}
                                className="text-center font-bold text-lg bg-royal-900 border-white/10 text-white focus:border-gold-500 h-11 placeholder:text-gray-600 pr-8"
                                placeholder="0"
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                {indicator.unit || '%'}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className={cn("md:col-span-2 flex flex-col items-center justify-center p-3 rounded-lg border transition-colors", Number(earnedPoints) > 0 ? "bg-gold-500/5 border-gold-500/20" : "bg-black/20 border-white/5")}>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">{t('zone_assessment.points')}</span>
                          <span className={cn("text-2xl font-bold", Number(earnedPoints) > 0 ? 'text-gold-400' : 'text-gray-600')}>
                            {earnedPoints}
                          </span>
                        </div>

                        <div className="md:col-span-1 flex items-center justify-center gap-1">
                            {userRole === 'admin' && (
                                <>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal(category.id, indicator)}>
                                        <Pencil className="w-4 h-4 text-gray-400 hover:text-gold-400"/>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteIndicator(category.id, indicator.id)}>
                                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500"/>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                     <div className="mt-4 pt-4 border-t border-white/5">
                        <div className={cn("grid grid-cols-1 gap-6", userRole === 'admin' && 'md:grid-cols-2')}>
                            <div className={cn(userRole !== 'admin' && 'md:col-span-2')}>
                                <Label className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                    <Paperclip className="w-3 h-3" /> {t('assessment.attachEvidence')}
                                </Label>
                                <div className="relative mt-2">
                                    <Input 
                                        id={`file-input-${indicator.id}`}
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(indicator.id, e.target.files?.[0] || null)} 
                                    />
                                    <label htmlFor={`file-input-${indicator.id}`} className="cursor-pointer w-full flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/10 hover:border-gold-500/50 transition-colors">
                                        <span className="text-sm text-gray-400 truncate">
                                            {files[indicator.id] ? files[indicator.id].name : t('assessment.noEvidenceAttached')}
                                        </span>
                                        <span className="flex-shrink-0 text-xs font-bold bg-gold-500 text-royal-900 px-3 py-1 rounded-md">
                                            {t('assessment.browse')}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {userRole === 'admin' && (
                                <div>
                                    <Label className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> {t('zone_assessment.assessorNotes')}
                                    </Label>
                                    <Textarea 
                                        placeholder={t('zone_assessment.assessorNotesPlaceholder')} 
                                        className="bg-black/20 border-white/10 text-gray-300 min-h-[60px] focus:border-gold-500/30 resize-none text-sm mt-2"
                                        value={notes[indicator.id] || ''}
                                        onChange={(e) => handleNoteChange(indicator.id, e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-8">
        <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 gap-2">
            <RotateCcw className="w-4 h-4" />
            {t('zone_assessment.reset')}
        </Button>
        <Button onClick={handleSave} className="bg-gold-500 hover:bg-gold-600 text-royal-900 font-bold px-8 shadow-lg shadow-gold-500/10 gap-2">
            <Save className="w-4 h-4" />
            {t('common.save')}
        </Button>
      </div>

       <IndicatorFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            editingState={editingState}
            onSave={handleSaveIndicator}
        />
    </div>
  );
};

interface IndicatorFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: AssessmentIndicator) => void;
    editingState: { categoryId: string; indicator: AssessmentIndicator | null } | null;
}

const IndicatorFormModal: React.FC<IndicatorFormModalProps> = ({ isOpen, onClose, onSave, editingState }) => {
    const { t, language } = useLanguage();
    const [text, setText] = useState('');
    const [subText, setSubText] = useState('');
    const [weight, setWeight] = useState(0);

    useEffect(() => {
        if (editingState?.indicator) {
            setText(language === 'ar' ? editingState.indicator.text : editingState.indicator.text_en);
            setSubText(language === 'ar' ? (editingState.indicator.subText || '') : (editingState.indicator.subText_en || ''));
            setWeight(editingState.indicator.weight);
        } else {
            setText('');
            setSubText('');
            setWeight(0);
        }
    }, [editingState, isOpen, language]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const indicatorData: AssessmentIndicator = {
            id: editingState?.indicator?.id || `custom-${Date.now()}`,
            text: editingState?.indicator?.text || text,
            text_en: editingState?.indicator?.text_en || text,
            subText: editingState?.indicator?.subText || subText,
            subText_en: editingState?.indicator?.subText_en || subText,
            weight,
            type: editingState?.indicator?.type || 'number', 
        };
        onSave(indicatorData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass text-white">
                <DialogHeader>
                    <DialogTitle className="text-gold-400 text-2xl">
                        {editingState?.indicator ? t('zone_assessment.editIndicator') : t('zone_assessment.addIndicatorTitle')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div>
                        <Label>{t('zone_assessment.indicatorText')}</Label>
                        <Input value={text} onChange={(e) => setText(e.target.value)} className="bg-royal-900/50 border-white/10 mt-2" dir={language === 'ar' ? 'rtl' : 'ltr'} />
                    </div>
                     <div>
                        <Label>{t('zone_assessment.measurementMechanism')}</Label>
                        <Textarea value={subText} onChange={(e) => setSubText(e.target.value)} className="bg-royal-900/50 border-white/10 mt-2" dir={language === 'ar' ? 'rtl' : 'ltr'} />
                    </div>
                    <div>
                        <Label>{t('zone_assessment.maxWeight')}</Label>
                        <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="bg-royal-900/50 border-white/10 mt-2" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} className="text-white border-white/20">{t('common.cancel')}</Button>
                        <Button type="submit" className="bg-gold-500 text-royal-900 hover:bg-gold-400"><Save /> {t('common.save')}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ZoneAssessmentPage;
