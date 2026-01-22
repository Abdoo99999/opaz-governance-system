
export type SubmissionStatus = 'draft' | 'submitted' | 'returned' | 'approved';

export interface Zone {
    id: string;
    name_ar: string;
    name_en: string;
    type: 'Free Zone' | 'Special Economic Zone' | 'Industrial City';
    totalArea: number; // in km²
    developedArea: number; // in km²
    cumulativeInvestment: number; // in million OMR
    directJobs: number;
    agreementsSigned: number;
    totalEmployees: number;
    omaniEmployees: number;
    submissionStatus?: SubmissionStatus;
    // Fields from form that might not be on every object initially
    legalForm?: string;
    lastROI?: number;
    totalSpending?: number;
    localSpending?: number;
    smeSpending?: number;
}

export const ZONES: Zone[] = [
    { id: 'duqm', name_ar: 'المنطقة الاقتصادية الخاصة بالدقم', name_en: 'Duqm SEZ', type: 'Special Economic Zone', totalArea: 2000, developedArea: 350, cumulativeInvestment: 3600, directJobs: 8000, agreementsSigned: 120, totalEmployees: 12000, omaniEmployees: 4200 },
    { id: 'sohar', name_ar: 'المنطقة الحرة بصحار', name_en: 'Sohar Freezone', type: 'Free Zone', totalArea: 45, developedArea: 20, cumulativeInvestment: 2100, directJobs: 5500, agreementsSigned: 85, totalEmployees: 9000, omaniEmployees: 3600 },
    { id: 'salalah', name_ar: 'المنطقة الحرة بصلالة', name_en: 'Salalah Free Zone', type: 'Free Zone', totalArea: 21, developedArea: 15, cumulativeInvestment: 1800, directJobs: 4000, agreementsSigned: 70, totalEmployees: 6000, omaniEmployees: 2100 },
    { id: 'maza', name_ar: 'مدينة مزونة الحرة', name_en: 'Al-Mazyunah Free Zone', type: 'Free Zone', totalArea: 15, developedArea: 7, cumulativeInvestment: 350, directJobs: 1500, agreementsSigned: 45, totalEmployees: 2500, omaniEmployees: 1000 },
    { id: 'muscat', name_ar: 'واحة المعرفة مسقط', name_en: 'Muscat Knowledge Oasis', type: 'Industrial City', totalArea: 1, developedArea: 1, cumulativeInvestment: 500, directJobs: 3000, agreementsSigned: 200, totalEmployees: 4000, omaniEmployees: 2800 },
    { id: 'nitaj', name_ar: 'نتاج', name_en: 'Nitaj', type: 'Industrial City', totalArea: 3, developedArea: 2, cumulativeInvestment: 150, directJobs: 800, agreementsSigned: 30, totalEmployees: 1200, omaniEmployees: 600 },
];
