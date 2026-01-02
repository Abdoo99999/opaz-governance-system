"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, ArrowRight, Check, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { AXES } from '@/lib/data/indicators';

type Status = 'todo' | 'in-progress' | 'done';
type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

interface Task {
  id: number;
  title: string;
  indicatorId?: number;
  dueDate: string;
  priority: Priority;
  assignedTo: string;
  avatar: string;
  status: Status;
  axisId: number;
}

const initialTasks: Task[] = [
  { id: 1, title: 'Update the Whistleblowing Policy to include anonymous reporting.', indicatorId: 45, dueDate: '2024-08-15', priority: 'High', assignedTo: 'Fatma Al-Said', avatar: 'https://picsum.photos/seed/101/100/100', status: 'todo', axisId: 9 },
  { id: 2, title: 'Appoint an independent Audit Committee member.', indicatorId: 7, dueDate: '2024-07-30', priority: 'Critical', assignedTo: 'Ali Al-Habsi', avatar: 'https://picsum.photos/seed/102/100/100', status: 'todo', axisId: 2 },
  { id: 3, title: 'Formalize and document the CEO succession plan.', indicatorId: 18, dueDate: '2024-09-01', priority: 'High', assignedTo: 'Yusuf Al-Harthy', avatar: 'https://picsum.photos/seed/103/100/100', status: 'in-progress', axisId: 4 },
  { id: 4, title: 'Publish the Annual ESG Report on the company website.', indicatorId: 42, dueDate: '2024-08-20', priority: 'Medium', assignedTo: 'Maryam Al-Balushi', avatar: 'https://picsum.photos/seed/104/100/100', status: 'in-progress', axisId: 9 },
  { id: 5, title: 'Implement a cybersecurity risk assessment framework.', indicatorId: 48, dueDate: '2024-10-01', priority: 'Critical', assignedTo: 'John Doe', avatar: 'https://picsum.photos/seed/105/100/100', status: 'todo', axisId: 10 },
  { id: 6, title: 'Conduct mandatory Code of Conduct training for all employees.', dueDate: '2024-07-25', priority: 'Medium', assignedTo: 'Sara Al-Amri', avatar: 'https://picsum.photos/seed/106/100/100', status: 'done', axisId: 9 },
  { id: 7, title: 'Review and update the Delegation of Authority matrix.', indicatorId: 3, dueDate: '2024-09-15', priority: 'Low', assignedTo: 'Ahmed Al-Farsi', avatar: 'https://picsum.photos/seed/107/100/100', status: 'todo', axisId: 1 },
];

const priorityConfig: Record<Priority, { variant: 'destructive' | 'secondary' | 'default', className: string }> = {
    'Critical': { variant: 'destructive', className: 'bg-red-700/80 border-red-500' },
    'High': { variant: 'destructive', className: 'bg-red-500/80 border-red-400' },
    'Medium': { variant: 'secondary', className: 'bg-yellow-500/80 border-yellow-400' },
    'Low': { variant: 'default', className: 'bg-green-600/80 border-green-500' }
};

const statusConfig: Record<Status, { title: string; className: string }> = {
    'todo': { title: 'مهام جديدة', className: 'shadow-red-500/40' },
    'in-progress': { title: 'جاري المعالجة', className: 'shadow-gold-500/40' },
    'done': { title: 'تم الإنجاز', className: 'shadow-success/40' },
};

const TaskCard = ({ task, onMove, onOpenDetails }: { task: Task; onMove: (taskId: number, newStatus: Status) => void; onOpenDetails: (task: Task) => void }) => {
    const nextStatus = task.status === 'todo' ? 'in-progress' : 'done';
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="glass p-4 mb-4 cursor-pointer"
            onClick={() => onOpenDetails(task)}
        >
            <div className="flex justify-between items-start mb-2">
                <Badge className={cn('text-white', priorityConfig[task.priority].className)}>{task.priority}</Badge>
                <span className="text-xs text-gray-400">{task.dueDate}</span>
            </div>
            <h4 className="font-bold text-base mb-3 text-right">{task.title}</h4>
            {task.indicatorId && <p className="text-xs text-gold-400 mb-4 text-right">Linked to Indicator #{task.indicatorId}</p>}
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={task.avatar} alt={task.assignedTo} data-ai-hint="person portrait" />
                        <AvatarFallback>{task.assignedTo.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{task.assignedTo}</span>
                </div>

                {task.status !== 'done' && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); onMove(task.id, nextStatus); }}
                        className="text-gold-400 hover:bg-gold-500/10 hover:text-gold-300"
                    >
                        {task.status === 'todo' ? 'Start' : 'Finish'}
                        {task.status === 'todo' ? <ArrowRight className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                    </Button>
                )}
            </div>
        </motion.div>
    );
};

const KanbanLane = ({ title, tasks, status, onMove, onOpenDetails }: { title: string, tasks: Task[], status: Status, onMove: (taskId: number, newStatus: Status) => void, onOpenDetails: (task: Task) => void }) => {
    return (
        <div className="flex-shrink-0 w-[380px] h-full">
            <div className="p-4 rounded-lg h-full flex flex-col">
                <div className={cn("flex justify-between items-center mb-4 p-2 rounded-t-lg", statusConfig[status].className)} style={{textShadow: '0 0 10px'}}>
                    <h3 className="font-bold text-lg">{title}</h3>
                    <Badge variant="secondary">{tasks.length}</Badge>
                </div>
                <div className="overflow-y-auto flex-1 pr-2">
                    <AnimatePresence>
                        {tasks.map(task => (
                            <TaskCard key={task.id} task={task} onMove={onMove} onOpenDetails={onOpenDetails} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const TaskDetailsModal = ({ task, isOpen, onClose }: { task: Task | null; isOpen: boolean; onClose: () => void }) => {
    if (!task) return null;
    const axis = AXES.find(a => a.id === task.axisId);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass text-white max-w-2xl" dir="rtl">
                <DialogHeader>
                    <Badge className={cn('text-white w-fit mb-2', priorityConfig[task.priority].className)}>{task.priority}</Badge>
                    <DialogTitle className="text-gold-400 text-2xl">{task.title}</DialogTitle>
                    <DialogDescription className="text-gray-300 pt-2">
                        Due by {task.dueDate} • Assigned to {task.assignedTo}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div>
                        <h5 className="font-bold mb-2">Description</h5>
                        <p className="text-gray-300 bg-black/20 p-3 rounded-md">This task is to address a governance gap identified during the maturity assessment. The primary goal is to ensure compliance and improve the governance framework.</p>
                    </div>
                    {axis && (
                         <div>
                            <h5 className="font-bold mb-2">Related Axis</h5>
                            <p className="text-gray-300">{axis.title_ar}</p>
                        </div>
                    )}
                    {task.indicatorId && (
                         <div>
                            <h5 className="font-bold mb-2">Linked Indicator</h5>
                            <p className="text-gray-300">#{task.indicatorId}</p>
                        </div>
                    )}
                     <div>
                        <h5 className="font-bold mb-2 flex items-center gap-2"><MessageSquare size={18}/> Comments</h5>
                        <div className="space-y-3 mt-3">
                           <div className="text-sm text-gray-400 bg-black/20 p-3 rounded-md">Placeholder for team comments and discussion threads...</div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function ImprovementPlan() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterAxis, setFilterAxis] = useState('All');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleMoveTask = (taskId: number, newStatus: Status) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
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

    const lanes: { status: Status; title: string; }[] = [
        { status: 'todo', title: 'Identified Gaps' },
        { status: 'in-progress', title: 'In Remediation' },
        { status: 'done', title: 'Resolved' },
    ];
    
    const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

    return (
        <div className="flex flex-col h-full text-white p-4 md:p-6 lg:p-8" dir="rtl">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">خطة التحسين</h1>
                <div className="flex items-center gap-4">
                    <Filter className="text-gray-400" />
                     <Select onValueChange={setFilterPriority} defaultValue="All">
                        <SelectTrigger className="w-[180px] glass"><SelectValue placeholder="Filter by Priority" /></SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                            {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select onValueChange={setFilterAxis} defaultValue="All">
                        <SelectTrigger className="w-[220px] glass"><SelectValue placeholder="Filter by Axis" /></SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                            <SelectItem value="All">All Axes</SelectItem>
                            {AXES.map(axis => <SelectItem key={axis.id} value={String(axis.id)}>{axis.title_ar}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                        <Plus className="ml-2 h-5 w-5" />
                        إضافة مهمة يدوية
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
                {lanes.map(lane => (
                    <KanbanLane
                        key={lane.status}
                        title={statusConfig[lane.status].title}
                        status={lane.status}
                        tasks={filteredTasks.filter(t => t.status === lane.status)}
                        onMove={handleMoveTask}
                        onOpenDetails={handleOpenDetails}
                    />
                ))}
            </div>
            
            <TaskDetailsModal task={selectedTask} isOpen={!!selectedTask} onClose={handleCloseDetails} />
        </div>
    );
}
