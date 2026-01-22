
export type SubmissionStatus = 'draft' | 'submitted' | 'returned' | 'approved';

export interface Zone {
    id: string;
    name_ar: string;
    name_en: string;
    sector: string;
    submissionStatus?: SubmissionStatus;
}

export const ZONES: Zone[] = [
    { id: 'duqm', name_ar: 'المنطقة الاقتصادية الخاصة بالدقم', name_en: 'Duqm SEZ', sector: 'Integrated Economic Zone' },
    { id: 'sohar', name_ar: 'المنطقة الحرة بصحار', name_en: 'Sohar Freezone', sector: 'Industrial & Logistics' },
    { id: 'salalah', name_ar: 'المنطقة الحرة بصلالة', name_en: 'Salalah Free Zone', sector: 'Industrial & Logistics' },
    { id: 'maza', name_ar: 'مدينة مزونة الحرة', name_en: 'Al-Mazyunah Free Zone', sector: 'Commercial & Industrial' },
    { id: 'muscat', name_ar: 'مدينة مسقط للابتكار', name_en: 'Muscat Innovation City', sector: 'Technology & Innovation' },
    { id: 'nitaj', name_ar: 'نتاج', name_en: 'Nitaj', sector: 'Food Security' },
];

    