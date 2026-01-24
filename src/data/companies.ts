
export type SubmissionStatus = 'draft' | 'submitted' | 'returned' | 'approved';

export interface Zone {
    id: string;
    name_ar: string;
    name_en: string;
    logo?: string;
    type?: 'Free Zone' | 'Special Economic Zone' | 'Industrial City';
    totalArea?: number; // in km²
    developedArea?: number; // in km²
    cumulativeInvestment?: number; // in million OMR
    directJobs?: number;
    agreementsSigned?: number;
    totalEmployees?: number;
    omaniEmployees?: number;
    submissionStatus?: SubmissionStatus;
    // Fields from form that might not be on every object initially
    legalForm?: string;
    lastROI?: number;
    totalSpending?: number;
    localSpending?: number;
    smeSpending?: number;
}

export const ZONES: Zone[] = [
  {
    id: 'sohar-free',
    name_ar: 'المنطقة الحرة بصحار',
    name_en: 'Sohar Free Zone',
    logo: '/logos/sohar.png'
  },
  {
    id: 'madayn',
    name_ar: 'المناطق الصناعية (مدائن)',
    name_en: 'Industrial Estates (Madayn)',
    logo: '/logos/madayn.png'
  },
  {
    id: 'khazaen',
    name_ar: 'مدينة خزائن الاقتصادية',
    name_en: 'Khazaen Economic City',
    logo: '/logos/khazaen.png'
  },
  {
    id: 'duqm',
    name_ar: 'المنطقة الاقتصادية الخاصة بالدقم',
    name_en: 'Special Economic Zone at Duqm',
    logo: '/logos/duqm.png'
  },
  {
    id: 'salalah-free',
    name_ar: 'المنطقة الحرة بصلالة',
    name_en: 'Salalah Free Zone',
    logo: '/logos/salalah.png'
  },
  {
    id: 'mazunah',
    name_ar: 'المنطقة الحرة بالمزيونة',
    name_en: 'Al Mazunah Free Zone',
    logo: '/logos/mazunah.png'
  }
];
