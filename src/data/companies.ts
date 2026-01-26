
export type SubmissionStatus = 'draft' | 'submitted' | 'returned' | 'approved';

export interface Zone {
    id: string;
    name_ar: string;
    name_en: string;
    logo?: string;
    type?: 'Free Zone' | 'Special Economic Zone' | 'Industrial City';
    // Base data
    totalArea?: number; // in km²
    // Demo/Fallback Data
    developedArea?: number; // in km²
    cumulativeInvestment?: number; // in million OMR
    exportsValue?: number; // in million OMR
    directJobs?: number;
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
    logo: '/logos/sohar.png',
    type: 'Free Zone',
    totalArea: 45,
    developedArea: 25,
    cumulativeInvestment: 3500,
    exportsValue: 2800,
    directJobs: 12000,
    totalEmployees: 18000,
    omaniEmployees: 6300,
  },
  {
    id: 'madayn',
    name_ar: 'المناطق الصناعية (مدائن)',
    name_en: 'Industrial Estates (Madayn)',
    logo: '/logos/madayn.png',
    type: 'Industrial City',
    totalArea: 100,
    developedArea: 75,
    cumulativeInvestment: 4200,
    exportsValue: 3100,
    directJobs: 45000,
    totalEmployees: 65000,
    omaniEmployees: 26000,
  },
  {
    id: 'khazaen',
    name_ar: 'مدينة خزائن الاقتصادية',
    name_en: 'Khazaen Economic City',
    logo: '/logos/khazaen.png',
    type: 'Special Economic Zone',
    totalArea: 51,
    developedArea: 15,
    cumulativeInvestment: 800,
    exportsValue: 450,
    directJobs: 5000,
    totalEmployees: 7500,
    omaniEmployees: 3000,
  },
  {
    id: 'duqm',
    name_ar: 'المنطقة الاقتصادية الخاصة بالدقم',
    name_en: 'Special Economic Zone at Duqm',
    logo: '/logos/duqm.png',
    type: 'Special Economic Zone',
    totalArea: 2000,
    developedArea: 230,
    cumulativeInvestment: 5500,
    exportsValue: 1800,
    directJobs: 15000,
    totalEmployees: 22000,
    omaniEmployees: 7700,
  },
  {
    id: 'salalah-free',
    name_ar: 'المنطقة الحرة بصلالة',
    name_en: 'Salalah Free Zone',
    logo: '/logos/salalah.png',
    type: 'Free Zone',
    totalArea: 21,
    developedArea: 18,
    cumulativeInvestment: 2800,
    exportsValue: 2100,
    directJobs: 8000,
    totalEmployees: 11000,
    omaniEmployees: 4400,
  },
  {
    id: 'mazunah',
    name_ar: 'المنطقة الحرة بالمزيونة',
    name_en: 'Al Mazunah Free Zone',
    logo: '/logos/mazunah.png',
    type: 'Free Zone',
    totalArea: 15,
    developedArea: 10,
    cumulativeInvestment: 350,
    exportsValue: 500,
    directJobs: 2500,
    totalEmployees: 4000,
    omaniEmployees: 1000,
  }
];
