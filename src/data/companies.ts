export type SubmissionStatus = 'draft' | 'submitted' | 'returned' | 'approved';

export interface Zone {
    id: string;
    name_ar: string;
    name_en: string;
    logo: string;
    strategicFocus: string;
    description: string;
    stats: {
      investment: string;
      omanization: string;
      projects: number;
    };
    // Optional old properties for compatibility
    type?: 'Free Zone' | 'Special Economic Zone' | 'Industrial City';
    totalArea?: number;
    developedArea?: number;
    cumulativeInvestment?: number;
    exportsValue?: number;
    directJobs?: number;
    totalEmployees?: number;
    omaniEmployees?: number;
    submissionStatus?: SubmissionStatus;
    legalForm?: string;
    lastROI?: number;
    totalSpending?: number;
    localSpending?: number;
    smeSpending?: number;
}

export const ZONES: Zone[] = [
  {
    id: 'duqm',
    name_ar: 'المنطقة الاقتصادية الخاصة بالدقم',
    name_en: 'Special Economic Zone at Duqm (SEZAD)',
    logo: '/logos/duqm.png',
    strategicFocus: 'عاصمة الطاقة الخضراء والصناعات الثقيلة', // Green Energy & Heavy Industries
    description: 'المنطقة الأكبر استثماراً، تحتضن مصفاة الدقم، ميناء الدقم، ومشاريع الهيدروجين الأخضر ورأس مركز.',
    stats: {
      investment: '6.5 مليار ر.ع', // تقديري من أصل 20.9
      omanization: '28%',
      projects: 145
    }
  },
  {
    id: 'sohar-free',
    name_ar: 'المنطقة الحرة بصحار',
    name_en: 'Sohar Free Zone',
    logo: '/logos/sohar.png',
    strategicFocus: 'الصناعات التحويلية والخدمات اللوجستية', // Downstream & Logistics
    description: 'محرك القيمة المحلية المضافة، مرتبطة بميناء صحار والأسواق العالمية.',
    stats: {
      investment: '4.2 مليار ر.ع',
      omanization: '36%',
      projects: 210
    }
  },
  {
    id: 'khazaen',
    name_ar: 'مدينة خزائن الاقتصادية',
    name_en: 'Khazaen Economic City',
    logo: '/logos/khazaen.png',
    strategicFocus: 'الأمن الغذائي والميناء البري', // Food Security & Dry Port
    description: 'تضم السوق المركزي للخضروات والفواكه ومدينة الدواء والميناء البري.',
    stats: {
      investment: '1.1 مليار ر.ع',
      omanization: '45%',
      projects: 95
    }
  },
  {
    id: 'salalah-free',
    name_ar: 'المنطقة الحرة بصلالة',
    name_en: 'Salalah Free Zone',
    logo: '/logos/salalah.png',
    strategicFocus: 'البتروكيماويات والصناعات الدوائية', // Petrochemicals & Pharma
    description: 'مركز عالمي لتصدير الجبس ومشتقات البتروكيماويات بجوار ميناء صلالة.',
    stats: {
      investment: '3.8 مليار ر.ع',
      omanization: '32%',
      projects: 110
    }
  },
  {
    id: 'madayn',
    name_ar: 'المناطق الصناعية (مدائن)',
    name_en: 'Industrial Estates (Madayn)',
    logo: '/logos/madayn.png',
    strategicFocus: 'الصناعات الصغيرة والمتوسطة (SMEs)', // SMEs & Manufacturing
    description: 'الذراع الصناعي للمنتج الوطني، تنتشر في مختلف محافظات السلطنة.',
    stats: {
      investment: '4.9 مليار ر.ع',
      omanization: '38%',
      projects: 2300
    }
  },
  {
    id: 'mazunah',
    name_ar: 'المنطقة الحرة بالمزيونة',
    name_en: 'Al Mazunah Free Zone',
    logo: '/logos/mazunah.png',
    strategicFocus: 'بوابة التجارة الحدودية والعبور', // Trade Gateway
    description: 'المنطقة الحرة التجارية المتخصصة في التبادل التجاري والخدمي مع الجمهورية اليمنية.',
    stats: {
      investment: '0.4 مليار ر.ع',
      omanization: '55%',
      projects: 65
    }
  }
];
