"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Line,
  LineChart,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, FileDown, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

// Mock Data
const summaryData = {
  maturity: 3.8,
  compliance: 85,
  risks: { high: 3, medium: 2 },
  actions: 12
};

const radarData = [
  { subject: 'السياسات', company: 110, sector: 90 },
  { subject: 'الهيكل', company: 98, sector: 120 },
  { subject: 'المجلس', company: 86, sector: 100 },
  { subject: 'التنفيذية', company: 130, sector: 110 },
  { subject: 'المخاطر', company: 115, sector: 105 },
  { subject: 'التدقيق', company: 95, sector: 90 },
  { subject: 'الحقوق', company: 120, sector: 115 },
  { subject: 'الإفصاح', company: 100, sector: 125 },
  { subject: 'الاستدامة', company: 75, sector: 95 },
  { subject: 'الابتكار', company: 125, sector: 110 },
];

const riskDistributionData = [
    { name: 'Medium', count: 8, color: '#FFD700' },
    { name: 'High', count: 5, color: '#FFA500' },
    { name: 'Extreme', count: 3, color: '#FF3B3B' },
    { name: 'Low', count: 12, color: '#00E096' },
];

const improvementPlanData = [
  { name: 'Completed', value: 8, color: '#00E096' },
  { name: 'In Progress', value: 12, color: '#FFD700' },
  { name: 'Not Started', value: 4, color: '#6b7280' },
];

const topGapsData = [
    { id: 45, name: 'الالتزام بأخلاقيات العمل', axis: 'الاستدامة', score: 1 },
    { id: 38, name: 'شفافية مكافآت الإدارة', axis: 'الإفصاح والشفافية', score: 2 },
    { id: 18, name: 'خطة التعاقب الوظيفي', axis: 'الإدارة التنفيذية', score: 2 },
];

const criticalRisksData = [
    { id: 1, description: 'تغيرات تنظيمية مفاجئة', category: 'استراتيجي', impact: 5, probability: 4 },
    { id: 2, description: 'هجوم سيبراني متقدم', category: 'سيبراني', impact: 5, probability: 3 },
    { id: 3, description: 'تقلبات حادة في أسعار الطاقة', category: 'مالي', impact: 4, probability: 5 },
];


const Reports: React.FC = () => {

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 text-white print:p-0 print:bg-white print:text-black" dir="rtl">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-center justify-between mb-8 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold">التقرير الاستراتيجي الشامل</h1>
                    <p className="text-gray-400 mt-1">{format(new Date(), "eeee, d MMMM yyyy")}</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Select defaultValue="2024">
                        <SelectTrigger className="w-[180px] glass text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-royal-900 text-white border-white/20">
                            <SelectItem value="2024">عام 2024</SelectItem>
                            <SelectItem value="2023">عام 2023</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handlePrint} className="bg-gold-500 text-royal-900 hover:bg-gold-400">
                        <FileDown className="ml-2 h-5 w-5" />
                        تصدير PDF
                    </Button>
                </div>
            </header>
            
            {/* For Print Header */}
            <div className="hidden print:block text-center mb-8">
                 <h1 className="text-3xl font-bold text-black">التقرير الاستراتيجي الشامل</h1>
                 <p className="text-gray-600 mt-1">OIA Governance System - {format(new Date(), "d MMMM yyyy")}</p>
            </div>

            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1}>
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300 print:text-gray-600">Overall Maturity</CardTitle>
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{summaryData.maturity}/5</div>
                            <p className="text-xs text-muted-foreground">+0.2 from last year</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2}>
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300 print:text-gray-600">Compliance Rate</CardTitle>
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{summaryData.compliance}%</div>
                             <p className="text-xs text-muted-foreground">4 non-compliant items</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3}>
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300 print:text-gray-600">Active Risks</CardTitle>
                            <AlertCircle className="w-4 h-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                               <span className="text-danger">{summaryData.risks.high} High</span> / <span className="text-yellow-400">{summaryData.risks.medium} Medium</span>
                            </div>
                            <p className="text-xs text-muted-foreground">in critical zones</p>
                        </CardContent>
                    </Card>
                </motion.div>
                 <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300 print:text-gray-600">Improvement Actions</CardTitle>
                            <AlertCircle className="w-4 h-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{summaryData.actions} Pending</div>
                            <p className="text-xs text-muted-foreground">8 Completed this year</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5} className="lg:col-span-2">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="text-gold-400 print:text-black">تحليل نضج الحوكمة (Company vs. Sector)</CardTitle>
                        </CardHeader>
                        <CardContent className="print:text-black">
                            <ResponsiveContainer width="100%" height={400}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid className="stroke-white/20 print:stroke-gray-300" />
                                    <PolarAngleAxis dataKey="subject" className="fill-white text-xs print:fill-black"/>
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} className="hidden" />
                                    <Tooltip contentStyle={{ backgroundColor: '#001A33' }} labelStyle={{ color: '#E5C565' }} />
                                    <Legend wrapperStyle={{ color: '#FFFFFF' }} />
                                    <Radar name="Company Score" dataKey="company" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.6} />
                                    <Radar name="Sector Average" dataKey="sector" stroke="#00E096" fill="#00E096" fillOpacity={0.2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
                     <Card className="glass">
                        <CardHeader>
                           <CardTitle className="text-gold-400 print:text-black">تحليل المخاطر حسب الشدة</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={riskDistributionData} layout="vertical" margin={{ right: 20 }}>
                                    <CartesianGrid horizontal={false} className="stroke-white/10 print:stroke-gray-200" />
                                    <XAxis type="number" className="fill-white text-xs print:fill-black" />
                                    <YAxis dataKey="name" type="category" width={80} className="fill-white text-xs print:fill-black" />
                                    <Tooltip contentStyle={{ backgroundColor: '#001A33' }} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                                    <Bar dataKey="count" barSize={30} radius={[0, 10, 10, 0]}>
                                        {riskDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                 <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7}>
                     <Card className="glass">
                        <CardHeader>
                            <CardTitle className="text-gold-400 print:text-black">حالة خطة التحسين</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={improvementPlanData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5}>
                                        {improvementPlanData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#001A33' }}/>
                                    <Legend iconType="circle" wrapperStyle={{ color: '#FFFFFF' }} />
                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-3xl font-bold print:fill-black">
                                       {improvementPlanData.reduce((acc, item) => acc + item.value, 0)}
                                    </text>
                                     <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400 text-sm print:fill-gray-600">
                                       Actions
                                    </text>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            
             {/* Detailed Tables */}
            <div className="space-y-8 print:break-before-page">
                 <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={8}>
                     <Card className="glass">
                        <CardHeader><CardTitle className="text-gold-400 print:text-black">أبرز الفجوات الاستراتيجية</CardTitle></CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-white/5 print:border-gray-300">
                                        <TableHead className="text-right text-white print:text-black">المؤشر</TableHead>
                                        <TableHead className="text-right text-white print:text-black">المحور</TableHead>
                                        <TableHead className="text-center text-white print:text-black">التقييم</TableHead>
                                        <TableHead className="text-right text-white print:text-black">الإجراء الموصى به</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topGapsData.map((gap) => (
                                        <TableRow key={gap.id} className="border-white/10 hover:bg-white/5 print:border-gray-200">
                                            <TableCell>{gap.id}. {gap.name}</TableCell>
                                            <TableCell>{gap.axis}</TableCell>
                                            <TableCell className="text-center"><Badge variant="destructive">{gap.score}</Badge></TableCell>
                                            <TableCell>تطوير واعتماد السياسة</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>
                 <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={9}>
                     <Card className="glass">
                        <CardHeader><CardTitle className="text-gold-400 print:text-black">المخاطر الحرجة المسجلة</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-white/5 print:border-gray-300">
                                        <TableHead className="text-right text-white print:text-black">وصف الخطر</TableHead>
                                        <TableHead className="text-right text-white print:text-black">التصنيف</TableHead>
                                        <TableHead className="text-center text-white print:text-black">الأثر</TableHead>
                                        <TableHead className="text-center text-white print:text-black">الاحتمالية</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {criticalRisksData.map((risk) => (
                                        <TableRow key={risk.id} className="border-white/10 hover:bg-white/5 print:border-gray-200">
                                            <TableCell>{risk.description}</TableCell>
                                            <TableCell>{risk.category}</TableCell>
                                            <TableCell className="text-center"><Badge className="bg-danger/80">{risk.impact}</Badge></TableCell>
                                            <TableCell className="text-center"><Badge className="bg-yellow-500/80">{risk.probability}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Reports;
