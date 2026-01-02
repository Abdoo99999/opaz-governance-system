
export interface Company {
    id: string;
    name_ar: string;
    name_en: string;
    sector: string;
}

export const COMPANIES: Company[] = [
    { id: 'oq', name_ar: 'مجموعة أوكيو', name_en: 'OQ Group', sector: 'Energy' },
    { id: 'asyad', name_ar: 'مجموعة أسياد', name_en: 'Asyad Group', sector: 'Logistics' },
    { id: 'omran', name_ar: 'مجموعة عمران', name_en: 'Omran Group', sector: 'Tourism' },
    { id: 'ithca', name_ar: 'مجموعة إذكاء', name_en: 'Ithca Group', sector: 'Technology' },
    { id: 'nama', name_ar: 'مجموعة نماء', name_en: 'Nama Group', sector: 'Utilities' },
    { id: 'nitaj', name_ar: 'نتاج', name_en: 'Nitaj', sector: 'Food Security' },
    { id: 'edo', name_ar: 'تنمية طاقة عمان', name_en: 'Energy Development Oman - EDO', sector: 'Energy' },
    { id: 'mdo', name_ar: 'تنمية معادن عمان', name_en: 'Minerals Development Oman - MDO', sector: 'Mining' },
    { id: 'fdo', name_ar: 'تنمية أسماك عمان', name_en: 'Fisheries Development Oman - FDO', sector: 'Fisheries' },
    { id: 'oman_lng', name_ar: 'الشركة العمانية للغاز الطبيعي المسال', name_en: 'Oman LNG', sector: 'Energy' },
    { id: 'oman_air', name_ar: 'الطيران العماني', name_en: 'Oman Air', sector: 'Aviation' },
    { id: 'oman_airports', name_ar: 'مطارات عمان', name_en: 'Oman Airports', sector: 'Aviation' },
    { id: 'omantel', name_ar: 'عمانتل', name_en: 'Omantel', sector: 'Telecommunications' },
    { id: 'beah', name_ar: 'بيئة', name_en: 'Be\'ah', sector: 'Environmental Services' },
    { id: 'asas', name_ar: 'أساس', name_en: 'ASAS', sector: 'Investment' },
    { id: 'oman_flour_mills', name_ar: 'المطاحن العمانية', name_en: 'Oman Flour Mills', sector: 'Food' },
    { id: 'salalah_mills', name_ar: 'مطاحن صلالة', name_en: 'Salalah Mills', sector: 'Food' },
    { id: 'khazaen', name_ar: 'مدينة خزائن الاقتصادية', name_en: 'Khazaen Economic City', sector: 'Logistics' },
    { id: 'msx', name_ar: 'بورصة مسقط', name_en: 'Muscat Stock Exchange - MSX', sector: 'Finance' },
    { id: 'oman_broadband', name_ar: 'العمانية للنطاق العريض', name_en: 'Oman Broadband', sector: 'Telecommunications' },
    { id: 'karwa', name_ar: 'كروة للسيارات', name_en: 'Karwa Motors', sector: 'Automotive' },
    { id: 'vodafone', name_ar: 'فودافون عمان', name_en: 'Vodafone Oman', sector: 'Telecommunications' },
    { id: 'oman_fisheries', name_ar: 'الأسماك العمانية', name_en: 'Oman Fisheries', sector: 'Fisheries' },
    { id: 'al_bashayer', name_ar: 'البشائر للحوم', name_en: 'Al Bashayer Meat', sector: 'Food' }
];
