
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, Filter, ArrowRight, Check, Star, MessageSquare, Save, ArrowLeft, AlertTriangle, Clock, CheckCircle, Upload, File as FileIcon } from 'lucide-react';
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
import { AXES, INDICATORS } from '@/lib/data/indicators';
import { useLanguage } from '@/context/LanguageContext';
import { useCompany } from '@/context/CompanyContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/app/page';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

type Status = 'todo' | 'in-progress' | 'done';
type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Task {
  id: number;
  title_en: string;
  title_ar: string;
  indicatorId?: number;
  dueDate: string;
  priority: Priority;
  assignedTo: string;
  avatar: string;
  status: Status;
  axisId: number;
  completionNotes?: string;
  evidenceFile?: { name: string; size: number };
}


const priorityConfig: Record<Priority, { className: string, glowClassName: string }> = {
    'Critical': { className: 'bg-red-500/80 border-red-400 text-red-50', glowClassName: 'shadow-[0_0_12px_rgba(255,59,59,0.7)]' },
    'High': { className: 'bg-yellow-500/80 border-yellow-400 text-yellow-50', glowClassName: 'shadow-[0_0_12px_rgba(234,179,8,0.6)]' },
    'Medium': { className: 'bg-blue-500/80 border-blue-400 text-blue-50', glowClassName: 'shadow-[0_0_12px_rgba(59,130,246,0.6)]' },
    'Low': { className: 'bg-green-600/80 border-green-500 text-green-50', glowClassName: 'shadow-[0_0_12px_rgba(22,163,74,0.5)]' }
};

const complianceQuestions: Record<string, {en: string, ar: string, axisId: number}> = {
    auditor: { en: 'Appoint external auditor', ar: 'تعيين مدقق حسابات خارجي', axisId: 6 },
    quorum: { en: 'Ensure board meeting quorum is met', ar: 'التأكد من اكتمال نصاب اجتماعات المجلس', axisId: 3 },
    doa: { en: 'Develop and approve Delegation of Authority policy', ar: 'تطوير واعتماد لائحة صلاحيات', axisId: 1 },
    conflict: { en: 'Establish a conflict of interest disclosure process', ar: 'تأسيس عملية للإفصاح عن تعارض المصالح', axisId: 7 },
};


const TaskCard = ({ task, onMove, onComplete, onOpenDetails, userRole, setDraggedTask }: { task: Task; onMove: (taskId: number, newStatus: Status) => void; onComplete: (taskId: number, notes: string, file: File) => void; onOpenDetails: (task: Task) => void, userRole: UserRole, setDraggedTask: (task: Task | null) => void }) => {
    const { t } = useLanguage();
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

    const renderAdminButtons = () => {
        const buttonClasses = "border-gray-600 text-gray-300 hover:bg-gold-500 hover:text-black hover:border-gold-500";
        return (
            <div className="flex justify-between items-center gap-2">
                {task.status === 'in-progress' && (
                    <Button variant="outline" size="sm" className={buttonClasses} onClick={(e) => { e.stopPropagation(); onMove(task.id, 'todo'); }}>
                        <ArrowLeft className="mr-1 h-4 w-4" /> {t('improvement.return')}
                    </Button>
                )}
                {task.status === 'done' && (
                    <Button variant="outline" size="sm" className={buttonClasses} onClick={(e) => { e.stopPropagation(); onMove(task.id, 'in-progress'); }}>
                        <ArrowLeft className="mr-1 h-4 w-4" /> {t('improvement.reopen')}
                    </Button>
                )}
            </div>
        );
    };

    const renderCompanyButtons = () => {
        const buttonClasses = "border-gray-600 text-gray-300 hover:bg-gold-500 hover:text-black hover:border-gold-500";
        return (
             <div className="flex justify-end items-center gap-2">
                 {task.status === 'todo' && (
                    <Button variant="outline" size="sm" className={buttonClasses} onClick={(e) => { e.stopPropagation(); onMove(task.id, 'in-progress'); }}>
                        {t('improvement.start')} <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                )}
                {task.status === 'in-progress' && (
                    <Button variant="outline" size="sm" className={buttonClasses} onClick={(e) => { e.stopPropagation(); setIsCompleteModalOpen(true); }}>
                        {t('improvement.finish')} <Check className="ml-1 h-4 w-4" />
                    </Button>
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
                className="bg-slate-800/50 p-4 mb-4 cursor-grab active:cursor-grabbing flex flex-col border border-white/10 hover:border-white/20 transition-all rounded-lg"
                onClick={() => onOpenDetails(task)}
            >
                <div className="flex justify-between items-start mb-3">
                    <p className="text-xs text-gray-400">{task.dueDate}</p>
                    <Badge className={cn('text-white text-[10px] px-2 py-0.5', priorityConfig[task.priority].className, priorityConfig[task.priority].glowClassName)}>{t(`improvement.priorities.${task.priority.toLowerCase()}`)}</Badge>
                </div>
                
                <h4 className="font-bold text-sm mb-2 text-right leading-relaxed text-white">{task.title_ar}</h4>
                {task.indicatorId && <p className="text-xs text-gold-400 mb-4 text-right">{t('improvement.linkedIndicator')} #{task.indicatorId}</p>}
                
                <div className="flex-grow min-h-[1rem]"></div>
                
                 <div className="flex justify-between items-center p-3 bg-black/20 mt-4 -mx-4 -mb-4 rounded-b-lg min-h-[60px]">
                    {userRole === 'admin' ? renderAdminButtons() : renderCompanyButtons()}
                 </div>
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
      'todo': { titleKey: 'improvement.lanes.todo', icon: AlertTriangle, bgClass: 'bg-red-900/10', borderClass: 'border-t-red-500', badgeClass: 'bg-red-500/20 text-red-300' },
      'in-progress': { titleKey: 'improvement.lanes.inProgress', icon: Clock, bgClass: 'bg-amber-900/10', borderClass: 'border-t-amber-400', badgeClass: 'bg-gold-500/20 text-gold-300' },
      'done': { titleKey: 'improvement.lanes.done', icon: CheckCircle, bgClass: 'bg-emerald-900/10', borderClass: 'border-t-emerald-500', badgeClass: 'bg-success/20 text-green-300' },
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
                "glass flex flex-col h-full transition-colors duration-300", 
                config.borderClass, 
                "border-t-4", 
                config.bgClass,
                isHovered && "bg-gold-500/10"
            )}
        >
            <div className="flex justify-between items-center p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <Icon className={cn("w-6 h-6", {"text-red-400": status==='todo', "text-amber-400": status==='in-progress', "text-emerald-400": status==='done'})}/>
                    <h3 className="font-bold text-xl">{t(config.titleKey)}</h3>
                </div>
                <Badge className={cn("text-white text-base", config.badgeClass)}>{tasks.length}</Badge>
            </div>
            <div className="overflow-y-auto flex-1 p-4 custom-scrollbar">
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
            </div>
        </div>
    );
};

const TaskDetailsModal = ({ task, isOpen, onClose }: { task: Task | null; isOpen: boolean; onClose: () => void }) => {
    const { t, language } = useLanguage();
    if (!task) return null;
    const axis = AXES.find(a => a.id === task.axisId);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass text-white max-w-2xl">
                <DialogHeader>
                    <Badge className={cn('text-white w-fit mb-2', priorityConfig[task.priority].className, priorityConfig[task.priority].glowClassName)}>{t(`improvement.priorities.${task.priority.toLowerCase()}`)}</Badge>
                    <DialogTitle className="text-gold-400 text-2xl">{language === 'ar' ? task.title_ar : task.title_en}</DialogTitle>
                    <DialogDescription className="text-gray-300 pt-2">
                        {t('improvement.dueDate')} {task.dueDate} • {t('improvement.assignedTo')} {task.assignedTo}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    <div>
                        <h5 className="font-bold mb-2">{t('improvement.description')}</h5>
                        <p className="text-gray-300 bg-black/20 p-3 rounded-md">{t('improvement.placeholderDesc')}</p>
                    </div>
                    {axis && (
                         <div>
                            <h5 className="font-bold mb-2">{t('improvement.relatedAxis')}</h5>
                            <p className="text-gray-300">{language === 'ar' ? axis.title_ar : axis.title_en}</p>
                        </div>
                    )}
                    {task.indicatorId && (
                         <div>
                            <h5 className="font-bold mb-2">{t('improvement.linkedIndicator')}</h5>
                            <p className="text-gray-300">#{task.indicatorId}</p>
                        </div>
                    )}
                    {task.status === 'done' && task.completionNotes && (
                         <div>
                            <h5 className="font-bold mb-2 text-emerald-400">{t('improvement.completionNotes')}</h5>
                            <p className="text-gray-300 bg-black/20 p-3 rounded-md whitespace-pre-wrap">{task.completionNotes}</p>
                        </div>
                    )}
                    {task.status === 'done' && task.evidenceFile && (
                         <div>
                            <h5 className="font-bold mb-2 text-emerald-400">{t('improvement.attachedEvidence')}</h5>
                            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-md text-gold-400">
                                <FileIcon size={18}/>
                                <span>{task.evidenceFile.name}</span>
                                <span className="text-xs text-gray-500">({(task.evidenceFile.size / 1024).toFixed(2)} KB)</span>
                            </div>
                        </div>
                    )}
                     <div>
                        <h5 className="font-bold mb-2 flex items-center gap-2"><MessageSquare size={18}/> {t('improvement.comments')}</h5>
                        <div className="space-y-3 mt-3">
                           <div className="text-sm text-gray-400 bg-black/20 p-3 rounded-md">{t('improvement.commentsPlaceholder')}</div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// New Modal for Completing a Task
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
            <DialogContent className="glass text-white">
                <DialogHeader>
                    <DialogTitle className="text-gold-400 text-2xl">{t('improvement.completeTaskTitle')}</DialogTitle>
                    <DialogDescription className="text-gray-300 pt-2">{t('improvement.completeTaskDesc')}</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                    <div>
                        <label className="text-gray-300">{t('improvement.completionNotes')}</label>
                        <Textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-royal-900/50 border-white/10 mt-2 min-h-[120px]"
                            placeholder={t('improvement.completionNotesPlaceholder')}
                        />
                    </div>
                    <div>
                        <label className="text-gray-300">{t('improvement.attachEvidence')}</label>
                        <div 
                            className="mt-2 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:border-gold-400"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                {file ? (
                                    <p className="text-gold-400">{file.name}</p>
                                ) : (
                                    <p className="text-sm text-gray-400">{t('improvement.attachEvidenceHint')}</p>
                                )}
                            </div>
                            <Input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} className="text-white border-white/20">{t('common.cancel')}</Button>
                    <Button onClick={handleSubmit} className="bg-gold-500 text-royal-900 hover:bg-gold-400">{t('improvement.finish')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function ImprovementPlan({ userRole }: { userRole: UserRole }) {
    const { t, language } = useLanguage();
    const { selectedCompanyId, getSelectedCompany } = useCompany();
    const { toast } = useToast();
    const selectedCompany = getSelectedCompany();
    
    const getStorageKey = (companyId: string) => `oia_improvement_plan_${companyId}`;
    
    const [tasks, setTasks] = useState<Task[]>([]);
    
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterAxis, setFilterAxis] = useState('All');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);


    // RELOAD data when company changes
    useEffect(() => {
        if (typeof window === 'undefined' || !selectedCompanyId || selectedCompanyId === 'all') {
            setTasks([]);
            return;
        }

        const storageKey = getStorageKey(selectedCompanyId);
        const savedData = localStorage.getItem(storageKey);
        let existingTasks: Task[] = savedData ? JSON.parse(savedData) : [];
        const generatedTasks: Task[] = [];
        let nextId = existingTasks.length > 0 ? Math.max(...existingTasks.map(t => t.id)) + 1 : 1;

        // 1. Generate tasks from Assessment Gaps
        const assessmentStr = localStorage.getItem(`oia_assessment_${selectedCompanyId}`);
        if (assessmentStr) {
            const assessmentData = JSON.parse(assessmentStr);
            const scores = assessmentData.scores || {};
            for (const indicatorIdStr in scores) {
                const indicatorId = parseInt(indicatorIdStr, 10);
                const score = scores[indicatorId];
                if (score < 3) { // Gap detected
                    const indicator = INDICATORS.find(i => i.id === indicatorId);
                    if (indicator && !existingTasks.some(t => t.indicatorId === indicatorId)) {
                        generatedTasks.push({
                            id: nextId++,
                            title_en: `Address gap for indicator: "${indicator.text_en}"`,
                            title_ar: `معالجة الفجوة للمؤشر: "${indicator.text_ar}"`,
                            indicatorId: indicator.id,
                            dueDate: '2024-12-31',
                            priority: score === 1 ? 'Critical' : 'High',
                            assignedTo: 'Governance Lead',
                            avatar: '', // No avatar
                            status: 'todo',
                            axisId: indicator.axisId
                        });
                    }
                }
            }
        }
        
        // 2. Generate tasks from Compliance Gaps
        const complianceStr = localStorage.getItem(`oia_compliance_${selectedCompanyId}`);
        if (complianceStr) {
            const complianceData = JSON.parse(complianceStr);
            const complianceState = complianceData.compliance || {};
            for (const key in complianceState) {
                if (!complianceState[key]) { // Non-compliant
                     const question = complianceQuestions[key];
                     const indicatorId = 1000 + Object.keys(complianceQuestions).indexOf(key); // unique virtual ID
                     if (question && !existingTasks.some(t => t.indicatorId === indicatorId)) {
                         generatedTasks.push({
                             id: nextId++,
                             title_en: question.en,
                             title_ar: question.ar,
                             indicatorId: indicatorId, // Virtual ID to prevent duplicates
                             dueDate: '2024-11-30',
                             priority: 'Critical',
                             assignedTo: 'Compliance Officer',
                             avatar: '', // No avatar
                             status: 'todo',
                             axisId: question.axisId
                         });
                     }
                }
            }
        }
        
        // Combine and set tasks
        const allTasks = [...existingTasks, ...generatedTasks];
        setTasks(allTasks);

    }, [selectedCompanyId]);

    const handleSave = () => {
        if (!selectedCompanyId || selectedCompanyId === 'all' || typeof window === 'undefined') return;
        
        const storageKey = getStorageKey(selectedCompanyId);
        localStorage.setItem(storageKey, JSON.stringify(tasks));
        
        toast({
            title: t('common.saveSuccessTitle'),
            description: `${t('improvement.saveSuccessDesc')} ${selectedCompany?.name_ar}`,
        });
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
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { 
                    ...task, 
                    status: 'done',
                    completionNotes: notes,
                    evidenceFile: { name: file.name, size: file.size }
                } : task
            )
        );
        toast({ title: t('improvement.taskCompleted') });
    };

    const handleOpenDetails = (task: Task) => {
        setSelectedTask(task);
    };
    
    const handleCloseDetails = () => {
        setSelectedTask(null);
    };

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
                    <h1 className="text-3xl font-bold">{t('menu.improvement')}</h1>
                    {selectedCompany ? (
                        <Badge className="bg-blue-900/50 border-blue-600 text-blue-300 mt-2">
                            {t('common.editingFor')}: {language === 'ar' ? selectedCompany.name_ar : selectedCompany.name_en}
                        </Badge>
                    ) : (
                         <Badge variant="outline" className="mt-2">
                            {t('common.selectAllCompanies')}
                        </Badge>
                    )}
                 </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400" />
                     <Select onValueChange={setFilterPriority} defaultValue="All">
                        <SelectTrigger className="w-[180px] glass"><SelectValue placeholder={t('improvement.filterPriority')} /></SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                            {priorities.map(p => <SelectItem key={p} value={p}>{t(`improvement.priorities.${p.toLowerCase()}`)}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select onValueChange={setFilterAxis} defaultValue="All">
                        <SelectTrigger className="w-[220px] glass"><SelectValue placeholder={t('improvement.filterAxis')} /></SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                            <SelectItem value="All">{t('improvement.allAxes')}</SelectItem>
                            {AXES.map(axis => <SelectItem key={axis.id} value={String(axis.id)}>{language === 'ar' ? axis.title_ar : axis.title_en}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {userRole === 'admin' && (
                        <Button className="bg-gold-500 text-royal-900 hover:bg-gold-400" disabled={!selectedCompanyId || selectedCompanyId === 'all'}>
                            <Plus className="ml-2 h-5 w-5" />
                            {t('improvement.addTask')}
                        </Button>
                    )}
                     <Button onClick={handleSave} variant="outline" className="text-white border-white/20 hover:bg-white/10" disabled={!selectedCompanyId || selectedCompanyId === 'all'}>
                        <Save className="ml-2 h-4 w-4"/>
                        {t('common.save')}
                     </Button>
                </div>
            </header>
            
            {(!selectedCompanyId || selectedCompanyId === 'all') ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-8 glass">
                        <h3 className="text-2xl font-bold text-gold-400">{t('common.selectCompanyToStart')}</h3>
                        <p className="text-gray-400 mt-2">{t('common.selectCompanyToStartDesc')}</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
                    <KanbanLane
                        key="todo"
                        title="Identified Gaps"
                        status="todo"
                        tasks={filteredTasks.filter(t => t.status === 'todo')}
                        onMove={handleMoveTask}
                        onComplete={handleCompleteTask}
                        onOpenDetails={handleOpenDetails}
                        userRole={userRole}
                        draggedTask={draggedTask}
                        setDraggedTask={setDraggedTask}
                        onDrop={handleDrop}
                    />
                     <KanbanLane
                        key="in-progress"
                        title="In Remediation"
                        status="in-progress"
                        tasks={filteredTasks.filter(t => t.status === 'in-progress')}
                        onMove={handleMoveTask}
                        onComplete={handleCompleteTask}
                        onOpenDetails={handleOpenDetails}
                        userRole={userRole}
                        draggedTask={draggedTask}
                        setDraggedTask={setDraggedTask}
                        onDrop={handleDrop}
                    />
                     <KanbanLane
                        key="done"
                        title="Resolved"
                        status="done"
                        tasks={filteredTasks.filter(t => t.status === 'done')}
                        onMove={handleMoveTask}
                        onComplete={handleCompleteTask}
                        onOpenDetails={handleOpenDetails}
                        userRole={userRole}
                        draggedTask={draggedTask}
                        setDraggedTask={setDraggedTask}
                        onDrop={handleDrop}
                    />
                </div>
            )}
            
            <TaskDetailsModal task={selectedTask} isOpen={!!selectedTask} onClose={handleCloseDetails} />
        </div>
    );
}

    

    

    

    