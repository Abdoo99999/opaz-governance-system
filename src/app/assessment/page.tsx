"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Info, Save, RotateCcw, Plus, Pencil, Trash2 } from 'lucide-react';
import { ASSESSMENT_DATA, AssessmentCategory, AssessmentIndicator } from '@/data/assessmentData'; 
import { cn } from '@/lib/utils';
import { UserRole } from '@/app/page';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const ZoneAssessmentPage = ({ userRole }: { userRole: UserRole }) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentCategory[]>(ASSESSMENT_DATA);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState<{ categoryId: string; indicator: AssessmentIndicator | null } | null>(null);

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

  const totalScore = useMemo(() => {
    let total = 0;
    assessmentData.forEach(cat => {
      cat.indicators.forEach(ind => {
        const val = inputs[ind.id] || 0;
        if (ind.type === 'select') {
          total += val * ind.weight;
        } else {
          const max = ind.maxScore || 100;
          total += (val / max) * ind.weight;
        }
      });
    });
    return parseFloat(total.toFixed(1));
  }, [inputs, assessmentData]);

  const calculateIndicatorScore = (ind: any, val: number) => {
    if (ind.type === 'select') {
      return (val * ind.weight).toFixed(1);
    } else {
      const max = ind.maxScore || 100;
      return ((val / max) * ind.weight).toFixed(1);
    }
  };

  const handleSave = () => {
    toast({
      title: "تم حفظ التقييم بنجاح",
      description: `تم تحديث البيانات. النتيجة الحالية: ${totalScore} / 100`,
    });
  };
  
  const handleOpenModal = (categoryId: string, indicator: AssessmentIndicator | null) => {
    setEditingState({ categoryId, indicator });
    setIsModalOpen(true);
  };
  
  const handleDeleteIndicator = (categoryId: string, indicatorId: string) => {
      if (confirm('هل أنت متأكد من حذف هذا المؤشر؟')) {
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
    <div className="space-y-6 pb-20 p-4 md:p-6 lg:p-8" dir="rtl">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gold-400">التقييم السنوي للمنطقة</h1>
          <p className="text-gray-400 text-sm mt-1">نموذج قياس الأداء المؤسسي والمؤشرات التشغيلية</p>
        </div>
        
        <div className="glass p-4 flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-400 font-medium uppercase">النتيجة النهائية</div>
            <div className="text-xs text-gold-500">من أصل 100 نقطة</div>
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
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  {category.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-gold-500/10 text-gold-400 border-gold-500/20 px-3">
                    الوزن: {category.weight}%
                  </Badge>
                   {userRole === 'admin' && (
                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(category.id, null)}>
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة مؤشر
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
                  <div key={indicator.id} className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 border-b border-white/5 last:border-0 ${!isEven ? 'bg-white/[0.02]' : ''}`}>
                    
                    <div className="md:col-span-5 space-y-2">
                      <Label className="text-base font-medium text-gray-100 leading-relaxed block">
                        {indicator.text}
                      </Label>
                      <div className="flex items-start gap-2 text-sm text-gray-400 bg-slate-800/50 p-2 rounded border border-white/5">
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{indicator.subText}</span>
                      </div>
                    </div>

                    <div className="md:col-span-4 flex flex-col justify-center gap-2">
                      <div className="flex justify-between text-xs text-gray-500 px-1">
                        <span>قيمة المؤشر</span>
                        <span>الوزن: {indicator.weight}</span>
                      </div>

                      {indicator.type === 'select' ? (
                        <Select 
                          onValueChange={(val) => handleSelectChange(indicator.id, val)} 
                          value={inputs[indicator.id]?.toString()}
                        >
                          <SelectTrigger className="w-full bg-royal-900 border-white/10 text-white focus:ring-gold-500/50 h-11">
                            <SelectValue placeholder="اختر من القائمة..." />
                          </SelectTrigger>
                          <SelectContent className="bg-royal-800 border-white/10 text-white">
                            {indicator.options?.map((opt, idx) => (
                              <SelectItem key={idx} value={opt.score.toString()} className="text-right">
                                {opt.label}
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
                            className="text-center font-bold text-lg bg-royal-900 border-white/10 text-white focus:border-gold-500 h-11 placeholder:text-gray-600 pl-8"
                            placeholder="0"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                            {indicator.unit || '%'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className={cn("md:col-span-2 flex flex-col items-center justify-center p-3 rounded-lg border transition-colors", Number(earnedPoints) > 0 ? "bg-gold-500/5 border-gold-500/20" : "bg-black/20 border-white/5")}>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">النقاط</span>
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
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-8">
        <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 gap-2">
            <RotateCcw className="w-4 h-4" />
            إعادة تعيين
        </Button>
        <Button onClick={handleSave} className="bg-gold-500 hover:bg-gold-600 text-royal-900 font-bold px-8 shadow-lg shadow-gold-500/10 gap-2">
            <Save className="w-4 h-4" />
            حفظ التقييم
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
    const [text, setText] = useState('');
    const [subText, setSubText] = useState('');
    const [weight, setWeight] = useState(0);

    useEffect(() => {
        if (editingState?.indicator) {
            setText(editingState.indicator.text);
            setSubText(editingState.indicator.subText);
            setWeight(editingState.indicator.weight);
        } else {
            setText('');
            setSubText('');
            setWeight(0);
        }
    }, [editingState, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const indicatorData: AssessmentIndicator = {
            id: editingState?.indicator?.id || `custom-${Date.now()}`,
            text,
            subText,
            weight,
            type: editingState?.indicator?.type || 'number', // Simplified for now
        };
        onSave(indicatorData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass text-white">
                <DialogHeader>
                    <DialogTitle className="text-gold-400 text-2xl">
                        {editingState?.indicator ? "تعديل المؤشر" : "إضافة مؤشر جديد"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div>
                        <Label>نص المؤشر</Label>
                        <Input value={text} onChange={(e) => setText(e.target.value)} className="bg-royal-900/50 border-white/10 mt-2" dir="rtl" />
                    </div>
                     <div>
                        <Label>آلية القياس</Label>
                        <Textarea value={subText} onChange={(e) => setSubText(e.target.value)} className="bg-royal-900/50 border-white/10 mt-2" dir="rtl" />
                    </div>
                    <div>
                        <Label>الوزن (الدرجة القصوى)</Label>
                        <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="bg-royal-900/50 border-white/10 mt-2" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} className="text-white border-white/20">إلغاء</Button>
                        <Button type="submit" className="bg-gold-500 text-royal-900 hover:bg-gold-400"><Save /> حفظ</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


export default ZoneAssessmentPage;

    