
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, ArrowRight, Check, MessageSquare, Save, ArrowLeft, AlertTriangle, Clock, CheckCircle, Upload, File as FileIcon, Calendar, Activity, ShieldAlert, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { AXES, INDICATORS } from '@/data/indicators';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/app/page';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { useYear } from '@/context/YearContext';
import { ASSESSMENT_DATA } from '@/data/assessmentData';


type Status = 'todo' | 'in-progress' | 'done';
type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
type TaskSource = 'Performance' | 'Compliance' | 'Risk';

export interface Task {
  id: number;
  title_en: string;
  title_ar: string;
  indicatorId?: number;
  dueDate: string;
  priority: Priority;
  source: TaskSource;
  assignedTo: string;
  avatar: string;
  status: Status;
  axisId: number;
  completionNotes?: string;
  evidenceFile?: { name: string; size: number };
}

const priorityConfig: Record<Priority, { className: string, glowClassName: string }> = {
    'Critical': { className: 'bg-red-500/80 border-red-400 text-white', glowClassName: 'shadow-[0_0_10px_rgba(239,68,68,0.6)]' },
    'High': { className: 'bg-orange-500/80 border-orange-400 text-white', glowClassName: 'shadow-[0_0_10px_rgba(249,115,22,0.6)]' },
    'Medium': { className: 'bg-blue-500/80 border-blue-400 text-white', glowClassName: 'shadow-[0_0_10px_rgba(59,130,246,0.6)]' },
    'Low': { className: 'bg-slate-500/80 border-slate-400 text-white', glowClassName: 'shadow-none' }
};

const sourceConfig: Record<TaskSource, { label_ar: string, label_en: string, icon: React.ElementType, className: string }> = {
    'Performance': { label_ar: 'أداء', label_en: 'Performance', icon: Activity, className: 'bg-purple-500/20 text-purple-300 border-purple-500/50' },
    'Compliance': { label_ar: 'امتثال', label_en: 'Compliance', icon: Scale, className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
    'Risk': { label_ar: 'مخاطر', label_en: 'Risk', icon: ShieldAlert, className: 'bg-red-500/20 text-red-300 border-red-500/50' },
};

const complianceQuestions: Record<string, {en: string, ar: string, axisId: number}> = {
    masterPlan: { en: 'Approve and update Master Plan', ar: 'اعتماد وتحديث المخطط الشمولي للمنطقة', axisId: 1 },
    regulations: { en: 'Publish regulations in Official Gazette', ar: 'نشر اللوائح التنظيمية في الجريدة الرسمية', axisId: 2 },
    budget: { en: 'Approve annual operating budget', ar: 'اعتماد الموازنة التشغيلية السنوية', axisId: 1 },
    envLicense: { en: 'Renew environmental licenses', ar: 'تجديد التراخيص البيئية للمردم والمرافق', axisId: 4 },
    insurance: { en: 'Renew insurance contracts', ar: 'تجديد عقود التأمين على الأصول', axisId: 4 },
    encroachments: { en: 'Remove land encroachments', ar: 'إزالة التعديات المرصودة على الأراضي', axisId: 2 },
    reports: { en: 'Submit quarterly reports to OPAZ', ar: 'رفع التقارير الربع سنوية للهيئة', axisId: 2 },
    audit: { en: 'Close financial audit findings', ar: 'إغلاق ملاحظات الرقابة المالية والإدارية', axisId: 2 },
    legalCases: { en: 'Resolve investor legal disputes', ar: 'تسوية القضايا القانونية مع المستثمرين', axisId: 2 },
    expropriation: { en: 'Legalize expropriation decisions', ar: 'توفيق أوضاع قرارات نزع الملكية', axisId: 2 },
};

const TimelineBar = ({ date }: { date: string }) => {
    const { language } = useLanguage();
    const dueDate = new Date(date);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let statusColor = "bg-emerald-500";
    let statusText = language === 'ar' ? `${diffDays} يوم متبقي` : `${diffDays} days left`;
    let width = "75%";

    if (diffDays < 0) {
        statusColor = "bg-red-500";
        statusText = language === 'ar' ? `متأخر ${Math.abs(diffDays)} يوم` : `Overdue ${Math.abs(diffDays)} days`;
        width = "100%";
    } else if (diffDays <= 7) {
        statusColor = "bg-amber-500";
        width = "90%";
    }

    return (
        <div className="w-full mt-3 mb-1">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span className="flex items-center gap-1"><Calendar size={10}/> {date}</span>
                <span className={cn("font-bold", diffDays < 0 ? "text-red-400" : "text-gray-400")}>{statusText}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", statusColor)} style={{ width: width }}></div>
            </div>
        </div>
    );
};

const TaskCard = ({ task, onMove, onComplete, onOpenDetails, userRole, setDraggedTask }: { task: Task; onMove: (taskId: number, newStatus: Status) => void; onComplete: (taskId: number, notes: string, file: File) => void; onOpenDetails: (task: Task) => void, userRole: UserRole, setDraggedTask: (task: Task | null) => void }) => {
    const { t, language } = useLanguage();
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    
    // --- SAFEGUARD HERE: Handle missing source for legacy data ---
    const sourceKey = (task.source && sourceConfig[task.source]) ? task.source : 'Performance';
    const config = sourceConfig[sourceKey];
    const SourceIcon = config.icon;
    // -------------------------------------------------------------

    const renderActionButtons = () => {
        const btnBase = "flex-1 justify-center h-10 font-bold transition-all duration-200 border-t border-white/10 rounded-none first:rounded-bl-lg last:rounded-br-lg hover:bg-gold-500 hover:text-royal-900";
        
        return (
            <div className="flex w-full mt-0 border-t border-white/10">
                {task.status === 'todo' && (
                    <button className={cn(btnBase, "bg-slate-800 hover:bg-emerald-600 hover:text-white")} onClick={(e) => { e.stopPropagation(); onMove(task.id, 'in-progress'); }}>
                        {t('improvement.start')} <ArrowRight />
                    </button>
                )}
                
                {task.status === 'in-progress' && (
                    <>
                        <button className={cn(btnBase, "bg-slate-800 border-r border-white/10 hover:bg-slate-700 text-gray-400")} onClick={(e) => { e.stopPropagation(); onMove(task.id, 'todo'); }}>
                           <ArrowLeft /> {t('improvement.return')}
                        </button>
                        {userRole === 'company' ? (
                             <button className={cn(btnBase, "bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400")} onClick={(e) => { e.stopPropagation(); setIsCompleteModalOpen(true); }}>
                                {t('improvement.finish')} <Check />
                             </button>
                        ) : (
                            <button className={cn(btnBase, "bg-slate-800 hover:bg-emerald-600 hover:text-white")} onClick={(e) => { e.stopPropagation(); onMove(task.id, 'done'); }}>
                                {t('improvement.finish')} <Check />
                            </button>
                        )}
                    </>
                )}

                {task.status === 'done' && (
                    <div className="flex-1 flex items-center justify-center h-10 bg-emerald-900/20 text-emerald-500 font-bold text-sm cursor-default">
                        <CheckCircle /> {t('improvement.lanes.done')}
                        {userRole === 'admin' && (
                             <button className="ml-4 text-xs underline text-gray-400 hover:text-white" onClick={(e) => { e.stopPropagation(); onMove(task.id, 'in-progress'); }}>
                                {t('improvement.reopen')}
                             </button>
                        )}
                    </div>
                )}
            </div>
        );
    };
    
    return (
        <>
            <motion.div
                layout
                draggable={true}
                onDragStart={() => setDraggedTask(task)}
                onDragEnd={() => setDraggedTask(null)}
                whileDrag={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.3)" }}
                className="bg-slate-800/80 mb-4 cursor-grab active:cursor-grabbing flex flex-col border border-white/10 hover:border-gold-500/50 transition-all rounded-lg shadow-lg group overflow-hidden"
                onClick={() => onOpenDetails(task)}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                         <div className="flex gap-2">
                             <Badge className={cn('text-[10px] px-2 py-0.5 border', priorityConfig[task.priority].className, priorityConfig[task.priority].glowClassName)}>
                                {t(`improvement.priorities.${task.priority.toLowerCase()}`)}
                             </Badge>
                             <Badge variant="outline" className={cn('text-[10px] px-2 py-0.5 flex items-center gap-1', config.className)}>
                                <SourceIcon size={10} />
                                {language === 'ar' ? config.label_ar : config.label_en}
                             </Badge>
                         </div>
                    </div>
                    <h4 className="font-bold text-sm mb-2 text-right leading-relaxed text-white group-hover:text-gold-400 transition-colors">
                        {language === 'ar' ? task.title_ar : task.title_en}
                    </h4>
                    {task.indicatorId && (
                        <p className="text-xs text-slate-400 text-right mb-2">
                            {t('improvement.linkedIndicator')} <span className="text-gold-500 font-mono">#{task.indicatorId}</span>
                        </p>
                    )}
                    <TimelineBar date={task.dueDate} />
                </div>
                {renderActionButtons()}
            </motion.div>
            <CompleteTaskModal 
                isOpen={isCompleteModalOpen}
                onClose={() => setIsCompleteModalOpen(false)}
                onComplete={onComplete}
                task={task}
            />
        </>
    );
};

const KanbanLane = ({ title, tasks, status, onMove, onComplete, onOpenDetails, userRole, draggedTask, setDraggedTask, onDrop }: { title: string, tasks: Task[], status: Status, onMove: (taskId: number, newStatus: Status) => void; onComplete: (taskId: number, notes: string, file: File) => void; onOpenDetails: (task: Task) => void, userRole: UserRole; draggedTask: Task | null; setDraggedTask: (task: Task | null) => void; onDrop: (status: Status) => void; }) => {
    const { t } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);

    const statusConfig: Record<Status, { titleKey: string; icon: React.ElementType; bgClass: string, borderClass: string, badgeClass: string }> = {
      'todo': { titleKey: 'improvement.lanes.todo', icon: AlertTriangle, bgClass: 'bg-red-900/5', borderClass: 'border-t-red-500', badgeClass: 'bg-red-500/20 text-red-300' },
      'in-progress': { titleKey: 'improvement.lanes.inProgress', icon: Clock, bgClass: 'bg-amber-900/5', borderClass: 'border-t-amber-400', badgeClass: 'bg-gold-500/20 text-gold-300' },
      'done': { titleKey: 'improvement.lanes.done', icon: CheckCircle, bgClass: 'bg-emerald-900/5', borderClass: 'border-t-emerald-500', badgeClass: 'bg-success/20 text-green-300' },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <div 
            onDrop={(e) => {
                e.preventDefault();
                onDrop(status);
                setIsHovered(false);
            }}
            onDragOver={(e) => {
                e.preventDefault();
                setIsHovered(true);
            }}
            onDragLeave={() => setIsHovered(false)}
            className={cn(
                "glass flex flex-col h-full transition-all duration-300 rounded-xl overflow-hidden hover:scale-[1.01] hover:shadow-xl hover:border-gold-500", 
                config.borderClass, 
                "border-t-4", 
                config.bgClass,
                isHovered && "bg-white/10"
            )}
        >
            <div className="flex justify-between items-center p-4 border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                    <Icon className={cn("w-5 h-5", {"text-red-400": status==='todo', "text-amber-400": status==='in-progress', "text-emerald-400": status==='done'})}/>
                    <h3 className="font-bold text-lg">{t(config.titleKey)}</h3>
                </div>
                <Badge className={cn("text-white min-w-[1.5rem] justify-center", config.badgeClass)}>{tasks.length}</Badge>
            </div>
            <div className="overflow-y-auto flex-1 p-3 custom-scrollbar space-y-3">
                <AnimatePresence>
                    {tasks.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onMove={onMove} 
                            onComplete={onComplete} 
                            onOpenDetails={onOpenDetails} 
                            userRole={userRole}
                            setDraggedTask={setDraggedTask}
                        />
                    ))}
                </AnimatePresence>
                {tasks.length === 0 && (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/5 rounded-lg text-gray-500 text-sm">
                        {t('common.noData')}
                    </div>
                )}
            </div>
        </div>
    );
};

const TaskDetailsModal = ({ task, isOpen, onClose }: { task: Task | null; isOpen: boolean; onClose: () => void }) => {
    const { t, language } = useLanguage();
    if (!task) return null;
    const axis = AXES.find(a => a.id === task.axisId);
    
    // SAFEGUARD HERE TOO
    const sourceKey = (task.source && sourceConfig[task.source]) ? task.source : 'Performance';
    const config = sourceConfig[sourceKey];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass text-white max-w-2xl border border-white/10">
                <DialogHeader>
                    <div className="flex gap-2 mb-2">
                        <Badge className={cn('text-white w-fit', priorityConfig[task.priority].className)}>{t(`improvement.priorities.${task.priority.toLowerCase()}`)}</Badge>
                        <Badge variant="outline" className={cn('text-white w-fit flex items-center gap-1', config.className)}>
                            {language === 'ar' ? config.label_ar : config.label_en}
                        </Badge>
                    </div>
                    <DialogTitle className="text-gold-400 text-2xl leading-relaxed">{language === 'ar' ? task.title_ar : task.title_en}</DialogTitle>
                    <DialogDescription className="text-gray-300 pt-2 flex items-center gap-4">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {task.dueDate}</span>
                         • 
                        <span>{t('improvement.assignedTo')} {task.assignedTo}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    <div>
                        <h5 className="font-bold mb-2 text-gold-200">{t('improvement.description')}</h5>
                        <p className="text-gray-300 bg-slate-900/50 p-4 rounded-lg border border-white/5">{t('improvement.placeholderDesc')}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         {axis && (
                            <div className="bg-slate-900/30 p-3 rounded-lg border border-white/5">
                                <h5 className="text-xs text-gray-400 mb-1">{t('improvement.relatedAxis')}</h5>
                                <p className="font-medium text-sm">{language === 'ar' ? axis.title_ar : axis.title_en}</p>
                            </div>
                        )}
                        {task.indicatorId && (
                             <div className="bg-slate-900/30 p-3 rounded-lg border border-white/5">
                                <h5 className="text-xs text-gray-400 mb-1">{t('improvement.linkedIndicator')}</h5>
                                <p className="font-medium text-sm font-mono text-gold-400">#{task.indicatorId}</p>
                            </div>
                        )}
                    </div>
                    {task.status === 'done' && task.completionNotes && (
                         <div>
                            <h5 className="font-bold mb-2 text-emerald-400">{t('improvement.completionNotes')}</h5>
                            <p className="text-gray-300 bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-lg whitespace-pre-wrap">{task.completionNotes}</p>
                        </div>
                    )}
                    {task.status === 'done' && task.evidenceFile && (
                         <div>
                            <h5 className="font-bold mb-2 text-emerald-400">{t('improvement.attachedEvidence')}</h5>
                            <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-white/10 text-gold-400 hover:bg-slate-900/80 cursor-pointer transition-colors">
                                <FileIcon size={20}/>
                                <span className="font-medium">{task.evidenceFile.name}</span>
                                <span className="text-xs text-gray-500 ml-auto">({(task.evidenceFile.size / 1024).toFixed(2)} KB)</span>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

const CompleteTaskModal = ({ isOpen, onClose, onComplete, task }: { isOpen: boolean; onClose: () => void; onComplete: (taskId: number, notes: string, file: File) => void; task: Task; }) => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [notes, setNotes] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        if (!notes || !file) {
            toast({
                title: t('common.errorTitle'),
                description: t('improvement.completeError'),
                variant: 'destructive',
            });
            return;
        }
        onComplete(task.id, notes, file);
        onClose();
        setNotes('');
        setFile(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass text-white border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-gold-400 text-2xl">{t('improvement.completeTaskTitle')}</DialogTitle>
                    <DialogDescription className="text-gray-300 pt-2">{t('improvement.completeTaskDesc')}</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                    <div>
                        <label className="text-gray-300 block mb-2">{t('improvement.completionNotes')}</label>
                        <Textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-royal-900/50 border-white/10 min-h-[120px] focus:border-gold-500"
                            placeholder={t('improvement.completionNotesPlaceholder')}
                        />
                    </div>
                    <div>
                        <label className="text-gray-300 block mb-2">{t('improvement.attachEvidence')}</label>
                        <div 
                            className="mt-1 flex flex-col justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gold-400 hover:bg-white/5 transition-all"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                            {file ? (
                                <div className="text-center">
                                    <p className="text-gold-400 font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                            ) : (
                                <div className="text-center space-y-1">
                                     <p className="text-sm text-gray-300 font-medium">{t('improvement.attachEvidenceHint')}</p>
                                     <p className="text-xs text-gray-500">PDF, DOCX, JPG (Max 5MB)</p>
                                </div>
                            )}
                            <Input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} className="text-white border-white/20 hover:bg-white/10">{t('common.cancel')}</Button>
                    <Button onClick={handleSubmit} className="bg-gold-500 text-royal-900 hover:bg-gold-400 font-bold">{t('improvement.finish')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function ImprovementPlan({ userRole, onNavigate }: { userRole: UserRole, onNavigate: (view: string) => void; }) {
    const { t, language } = useLanguage();
    const { getSelectedZone, refreshData } = useCompany();
    const selectedCompanyId = getSelectedZone()?.id;
    const { selectedYear } = useYear();
    const { toast } = useToast();
    const selectedCompany = getSelectedZone();
    
    const getStorageKey = (companyId: string, year: number) => `oia_improvement_plan_${companyId}_${year}`;
    
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterAxis, setFilterAxis] = useState('All');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);

    // RELOAD data when company or year changes
    useEffect(() => {
        if (typeof window === 'undefined' || !selectedCompanyId || selectedCompanyId === 'all') {
            setTasks([]);
            return;
        }

        const oldKey = `oia_improvement_plan_${selectedCompanyId}`;
        const newKey = getStorageKey(selectedCompanyId, selectedYear);
        
        let savedDataStr = localStorage.getItem(newKey);
        if (!savedDataStr) {
            savedDataStr = localStorage.getItem(oldKey);
        }
        
        // --- 1. PATCH LEGACY DATA ON LOAD ---
        let existingTasks: Task[] = savedDataStr ? JSON.parse(savedDataStr) : [];
        existingTasks = existingTasks.map(t => ({
            ...t,
            source: t.source || 'Performance' // Default source if missing
        }));
        // -------------------------------------

        const generatedTasks: Task[] = [];
        let nextId = existingTasks.length > 0 ? Math.max(...existingTasks.map(t => t.id)) + 1 : 1;

        // 1. Generate tasks from Assessment (Performance)
        const assessmentKey = `oia_assessment_${selectedCompanyId}_${selectedYear}`;
        const assessmentStr = localStorage.getItem(assessmentKey);
        if (assessmentStr) {
            const assessmentData = JSON.parse(assessmentStr);
            const scores = assessmentData.scores || {};
            for (const indicatorIdStr in scores) {
                const indicatorId = parseInt(indicatorIdStr, 10);
                const score = scores[indicatorId];
                if (score < 3) {
                    const indicator = INDICATORS.find(i => i.id === indicatorId);
                    if (indicator && !existingTasks.some(t => t.indicatorId === indicatorId)) {
                        generatedTasks.push({
                            id: nextId++,
                            title_en: `Address gap for indicator: "${indicator.text_en}"`,
                            title_ar: `معالجة الفجوة للمؤشر: "${indicator.text_ar}"`,
                            indicatorId: indicator.id,
                            dueDate: '2026-06-30',
                            priority: score === 1 ? 'Critical' : 'High',
                            source: 'Performance',
                            assignedTo: 'Governance Lead',
                            avatar: '',
                            status: 'todo',
                            axisId: indicator.axisId
                        });
                    }
                }
            }
        }
        
        // 2. Generate tasks from Compliance
        const complianceKey = `opaz_compliance_${selectedCompanyId}_${selectedYear}`;
        const complianceStr = localStorage.getItem(complianceKey);
        if (complianceStr) {
            const complianceData = JSON.parse(complianceStr);
            const complianceState = complianceData.compliance || {};
            
            for (const key in complianceState) {
                if (complianceState[key] === false) {
                      const question = complianceQuestions[key];
                      const indicatorId = 2000 + Object.keys(complianceQuestions).indexOf(key);
                      
                      if (question && !existingTasks.some(t => t.indicatorId === indicatorId)) {
                          generatedTasks.push({
                              id: nextId++,
                              title_en: `Non-Compliance: ${question.en}`,
                              title_ar: `عدم امتثال: ${question.ar}`,
                              indicatorId: indicatorId,
                              dueDate: '2026-03-31',
                              priority: 'Critical',
                              source: 'Compliance',
                              assignedTo: 'Compliance Officer',
                              avatar: '',
                              status: 'todo',
                              axisId: question.axisId
                          });
                      }
                }
            }
        }

        // 3. Generate tasks from Risks
        if (complianceStr) {
            const complianceData = JSON.parse(complianceStr);
            const risks = complianceData.risks || [];
            
            risks.forEach((risk: any, index: number) => {
                const impactScore = risk.impact * risk.probability;
                if (impactScore >= 10) {
                    const riskId = 3000 + index;
                    if (!existingTasks.some(t => t.indicatorId === riskId)) {
                        generatedTasks.push({
                            id: nextId++,
                            title_en: `Mitigate Risk: ${risk.description}`,
                            title_ar: `معالجة خطر: ${risk.description}`,
                            indicatorId: riskId,
                            dueDate: '2026-04-15',
                            priority: impactScore >= 15 ? 'Critical' : 'High',
                            source: 'Risk',
                            assignedTo: 'Risk Manager',
                            avatar: '',
                            status: 'todo',
                            axisId: 4
                        });
                    }
                }
            });
        }
        
        // 4. Generate tasks from Operational Compliance Assessment
        const opAssessKey = `opaz_operational_assessment_${selectedCompanyId}_${selectedYear}`;
        const opAssessStr = localStorage.getItem(opAssessKey);
        if (opAssessStr) {
            const opAssessData = JSON.parse(opAssessStr);
            const inputs = opAssessData.inputs || {};
            let opIndicatorIndex = 0;

            ASSESSMENT_DATA.forEach(category => {
                category.indicators.forEach(indicator => {
                    const numericIndicatorId = 4000 + opIndicatorIndex;
                    opIndicatorIndex++;

                    if (!existingTasks.some(t => t.indicatorId === numericIndicatorId)) {
                        const value = inputs[indicator.id] || 0;
                        let achievementPercentage = 0;

                        if (indicator.type === 'select' && indicator.options) {
                            const maxScore = Math.max(...indicator.options.map(o => o.score));
                            if (maxScore > 0) {
                                achievementPercentage = (value / indicator.weight) * 100;
                            }
                        } else if (indicator.type === 'number' && indicator.maxScore) {
                            const earnedPoints = (value / indicator.maxScore) * indicator.weight;
                            achievementPercentage = (earnedPoints / indicator.weight) * 100;
                        }

                        if (achievementPercentage < 60) { // Threshold for weakness
                            generatedTasks.push({
                                id: nextId++,
                                title_en: `Operational Gap: ${category.title_en}`,
                                title_ar: `فجوة تشغيلية: ${indicator.text}`,
                                indicatorId: numericIndicatorId,
                                dueDate: '2026-05-30',
                                priority: achievementPercentage < 30 ? 'High' : 'Medium',
                                source: 'Compliance', // Re-using 'Compliance' source
                                assignedTo: 'Operations Lead',
                                avatar: '',
                                status: 'todo',
                                axisId: 3 // Defaulting to Operational Excellence axis
                            });
                        }
                    }
                });
            });
        }

        const allTasks = [...existingTasks, ...generatedTasks];
        setTasks(allTasks);

    }, [selectedCompanyId, selectedYear]);

    const handleSave = () => {
        if (!selectedCompanyId || selectedCompanyId === 'all' || typeof window === 'undefined') return;
        const storageKey = getStorageKey(selectedCompanyId, selectedYear);
        localStorage.setItem(storageKey, JSON.stringify(tasks));
        toast({
            title: t('common.saveSuccessTitle'),
            description: `${t('improvement.saveSuccessDesc')} ${selectedCompany?.name_ar}`,
        });
        refreshData();
        onNavigate('review-submit');
    };

    const handleMoveTask = (taskId: number, newStatus: Status) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
    };

    const handleDrop = (status: Status) => {
        if (!draggedTask || draggedTask.status === status) return;
        handleMoveTask(draggedTask.id, status);
    };

    const handleCompleteTask = (taskId: number, notes: string, file: File) => {
        const newTasks = tasks.map(task =>
            task.id === taskId ? { 
                ...task, 
                status: 'done',
                completionNotes: notes,
                evidenceFile: { name: file.name, size: file.size }
            } : task
        );
        setTasks(newTasks);
        if (selectedCompanyId && selectedCompanyId !== 'all') {
            localStorage.setItem(getStorageKey(selectedCompanyId, selectedYear), JSON.stringify(newTasks));
        }
        toast({ title: t('improvement.taskCompleted') });
        refreshData();
    };

    const handleOpenDetails = (task: Task) => setSelectedTask(task);
    const handleCloseDetails = () => setSelectedTask(null);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const priorityMatch = filterPriority === 'All' || task.priority === filterPriority;
            const axisMatch = filterAxis === 'All' || String(task.axisId) === filterAxis;
            return priorityMatch && axisMatch;
        });
    }, [tasks, filterPriority, filterAxis]);
    
    const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

    return (
        <div className="flex flex-col h-full text-white p-4 md:p-6 lg:p-8">
            <header className="flex items-center justify-between mb-8 flex-shrink-0">
                 <div>
                    <h1 className="text-3xl font-bold text-gold-400">{t('menu.improvement')}</h1>
                    {selectedCompany ? (
                        <Badge className="bg-blue-900/50 border-blue-600 text-blue-300 mt-2 text-base px-3 py-1">
                            {t('common.editingFor')}: {language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en}
                        </Badge>
                    ) : (
                         <Badge variant="outline" className="mt-2">{t('common.selectAllCompanies')}</Badge>
                    )}
                 </div>
                <div className="flex items-center gap-3">
                    <Filter className="text-gray-400" />
                     <Select onValueChange={setFilterPriority} defaultValue="All">
                        <SelectTrigger className="w-[180px] glass h-10 border-white/10"><SelectValue placeholder={t('improvement.filterPriority')} /></SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                            {priorities.map(p => <SelectItem key={p} value={p}>{t(`improvement.priorities.${p.toLowerCase()}`)}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select onValueChange={setFilterAxis} defaultValue="All">
                        <SelectTrigger className="w-[220px] glass h-10 border-white/10"><SelectValue placeholder={t('improvement.filterAxis')} /></SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                            <SelectItem value="All">{t('improvement.allAxes')}</SelectItem>
                            {AXES.map(axis => <SelectItem key={axis.id} value={String(axis.id)}>{language === 'ar' ? axis.title_ar : axis.title_en}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {userRole === 'admin' && (
                        <Button className="bg-gold-500 text-royal-900 hover:bg-gold-400 font-bold" disabled={!selectedCompanyId || selectedCompanyId === 'all'}>
                            <Plus /> {t('improvement.addTask')}
                        </Button>
                    )}
                     <Button onClick={handleSave} className="bg-emerald-600 text-white hover:bg-emerald-500 font-bold" disabled={!selectedCompanyId || selectedCompanyId === 'all'}>
                        <Save />{t('common.save')}
                     </Button>
                </div>
            </header>
            
            {(!selectedCompanyId || selectedCompanyId === 'all') ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-12 glass border border-white/10 rounded-2xl max-w-lg">
                        <h3 className="text-2xl font-bold text-gold-400 mb-3">{t('common.selectCompanyToStart')}</h3>
                        <p className="text-gray-400">{t('common.selectCompanyToStartDesc')}</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                    <KanbanLane key="todo" title="Identified Gaps" status="todo" tasks={filteredTasks.filter(t => t.status === 'todo')} onMove={handleMoveTask} onComplete={handleCompleteTask} onOpenDetails={handleOpenDetails} userRole={userRole} draggedTask={draggedTask} setDraggedTask={setDraggedTask} onDrop={handleDrop} />
                     <KanbanLane key="in-progress" title="In Remediation" status="in-progress" tasks={filteredTasks.filter(t => t.status === 'in-progress')} onMove={handleMoveTask} onComplete={handleCompleteTask} onOpenDetails={handleOpenDetails} userRole={userRole} draggedTask={draggedTask} setDraggedTask={setDraggedTask} onDrop={handleDrop} />
                     <KanbanLane key="done" title="Resolved" status="done" tasks={filteredTasks.filter(t => t.status === 'done')} onMove={handleMoveTask} onComplete={handleCompleteTask} onOpenDetails={handleOpenDetails} userRole={userRole} draggedTask={draggedTask} setDraggedTask={setDraggedTask} onDrop={handleDrop} />
                </div>
            )}
            <TaskDetailsModal task={selectedTask} isOpen={!!selectedTask} onClose={handleCloseDetails} />
        </div>
    );
}
