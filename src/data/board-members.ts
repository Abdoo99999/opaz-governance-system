
export interface BoardMember {
  id: number;
  name_ar: string;
  name_en: string;
  avatar: string;
  companyId: string;
  role: 'Chairman' | 'Member';
  type: 'Independent' | 'Government' | 'Executive';
  expertise: 'Legal' | 'Finance' | 'Engineering' | 'HR' | 'Strategy' | 'Technology' | 'Marketing';
  appointmentDate: string;
  expiryDate: string;
  committees: ('Audit' | 'Risk' | 'HR' | 'Nomination')[];
}

export const BOARD_MEMBERS: BoardMember[] = [
    { id: 1, name_ar: "سعادة عبدالله السالمي", name_en: "HE Abdulsalam Al Murshidi", avatar: "https://picsum.photos/seed/1/100/100", companyId: 'oq', role: 'Chairman', type: 'Government', expertise: 'Strategy', appointmentDate: '2022-01-15', expiryDate: '2025-01-14', committees: ['Nomination'] },
    { id: 2, name_ar: "د. محمد الحارثي", name_en: "Dr. Mohammed Al-Harthy", avatar: "https://picsum.photos/seed/2/100/100", companyId: 'oq', role: 'Member', type: 'Independent', expertise: 'Finance', appointmentDate: '2022-01-15', expiryDate: '2025-01-14', committees: ['Audit', 'Risk'] },
    { id: 3, name_ar: "م. سالم العوفي", name_en: "Eng. Salim Al Aufi", avatar: "https://picsum.photos/seed/3/100/100", companyId: 'asyad', role: 'Chairman', type: 'Government', expertise: 'Engineering', appointmentDate: '2021-05-20', expiryDate: '2024-05-19', committees: [] },
    { id: 4, name_ar: "فاطمة الشكيلية", name_en: "Fatma Al-Shukaili", avatar: "https://picsum.photos/seed/4/100/100", companyId: 'omran', role: 'Member', type: 'Independent', expertise: 'HR', appointmentDate: '2023-03-10', expiryDate: '2026-03-09', committees: ['HR', 'Nomination'] },
    { id: 5, name_ar: "خالد الصالحي", name_en: "Khalid Al-Salhi", avatar: "https://picsum.photos/seed/5/100/100", companyId: 'ithca', role: 'Chairman', type: 'Government', expertise: 'Technology', appointmentDate: '2023-09-01', expiryDate: '2026-08-31', committees: [] },
    { id: 6, name_ar: "علي المسكري", name_en: "Ali Al-Maskari", avatar: "https://picsum.photos/seed/6/100/100", companyId: 'nama', role: 'Member', type: 'Executive', expertise: 'Engineering', appointmentDate: '2022-07-22', expiryDate: '2025-07-21', committees: ['Risk'] },
    { id: 7, name_ar: "ناصر الجشمي", name_en: "Nasser Al-Jashmi", avatar: "https://picsum.photos/seed/7/100/100", companyId: 'omantel', role: 'Chairman', type: 'Government', expertise: 'Strategy', appointmentDate: '2020-11-11', expiryDate: '2024-11-10', committees: [] },
    { id: 8, name_ar: "أحمد الوهيبي", name_en: "Ahmed Al-Wahaibi", avatar: "https://picsum.photos/seed/8/100/100", companyId: 'omantel', role: 'Member', type: 'Independent', expertise: 'Marketing', appointmentDate: '2021-08-01', expiryDate: '2024-07-31', committees: ['Audit'] },
    { id: 9, name_ar: "عائشة اليافعي", name_en: "Aisha Al-Yafai", avatar: "https://picsum.photos/seed/9/100/100", companyId: 'oq', role: 'Member', type: 'Independent', expertise: 'Legal', appointmentDate: '2022-01-15', expiryDate: '2025-01-14', committees: ['Audit'] },
    { id: 10, name_ar: "هلال الخروصي", name_en: "Hilal Al-Kharusi", avatar: "https://picsum.photos/seed/10/100/100", companyId: 'omran', role: 'Chairman', type: 'Government', expertise: 'Strategy', appointmentDate: '2021-01-01', expiryDate: '2024-12-31', committees: [] },
    { id: 11, name_ar: "مريم الزدجالي", name_en: "Maryam Al-Zadjali", avatar: "https://picsum.photos/seed/11/100/100", companyId: 'asyad', role: 'Member', type: 'Independent', expertise: 'Finance', appointmentDate: '2021-05-20', expiryDate: '2024-05-19', committees: ['Audit', 'Risk'] },
    { id: 12, name_ar: "يوسف البلوشي", name_en: "Yousuf Al-Balushi", avatar: "https://picsum.photos/seed/12/100/100", companyId: 'ithca', role: 'Member', type: 'Executive', expertise: 'Technology', appointmentDate: '2023-09-01', expiryDate: '2026-08-31', committees: ['Risk'] },
];
