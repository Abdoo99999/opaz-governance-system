
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
  nationality: string;
  qualification?: 'Bachelor' | 'Master' | 'PhD';
}

export const BOARD_MEMBERS: BoardMember[] = [
    { id: 1, name_ar: "سعادة عبدالله السالمي", name_en: "HE Abdulsalam Al Murshidi", avatar: "https://placehold.co/100x100/FFFFFF/FFFFFF.png", companyId: 'oq', role: 'Chairman', type: 'Government', expertise: 'Strategy', appointmentDate: '2022-01-15', expiryDate: '2025-01-14', committees: ['Nomination'], nationality: 'Omani', qualification: 'Master' },
    { id: 2, name_ar: "د. محمد الحارثي", name_en: "Dr. Mohammed Al-Harthy", avatar: "https://placehold.co/100x100/FFFFFF/FFFFFF.png", companyId: 'oq', role: 'Member', type: 'Independent', expertise: 'Finance', appointmentDate: '2022-01-15', expiryDate: '2025-01-14', committees: ['Audit', 'Risk'], nationality: 'Omani', qualification: 'PhD' },
    { id: 3, name_ar: "م. سالم العوفي", name_en: "Eng. Salim Al Aufi", avatar: "https://placehold.co/100x100/FFFFFF/FFFFFF.png", companyId: 'asyad', role: 'Chairman', type: 'Government', expertise: 'Engineering', appointmentDate: '2021-05-20', expiryDate: '2024-05-19', committees: [], nationality: 'Omani', qualification: 'Bachelor' },
    { id: 4, name_ar: "فاطمة الشكيلية", name_en: "Fatma Al-Shukaili", avatar: "https://placehold.co/100x100/FFFFFF/FFFFFF.png", companyId: 'omran', role: 'Member', type: 'Independent', expertise: 'HR', appointmentDate: '2023-03-10', expiryDate: '2026-03-09', committees: ['HR', 'Nomination'], nationality: 'Omani', qualification: 'Master' },
    { id: 5, name_ar: "خالد الصالحي", name_en: "Khalid Al-Salhi", avatar: "https://placehold.co/100x100/FFFFFF/FFFFFF.png", companyId: 'ithca', role: 'Chairman', type: 'Government', expertise: 'Technology', appointmentDate: '2023-09-01', expiryDate: '2026-08-31', committees: [], nationality: 'Omani', qualification: 'PhD' },
    { id: 6, name_ar: "علي المسكري", name_en: "Ali Al-Maskari", avatar: "https://placehold.co/100x100/FFFFFF/FFFFFF.png", companyId: 'nama', role: 'Member', type: 'Executive', expertise: 'Engineering', appointmentDate: '2022-07-22', expiryDate: '2025-07-21', committees: ['Risk'], nationality: 'Omani', qualification: 'Bachelor' },
    { id: 7, name_ar: "ناصر الجشمي", name_en: "Nasser Al-Jashmi", avatar: "https://placehold.co/100x100/FFFFFF/FFFFFF.png", companyId: 'omantel', role: 'Chairman', type: 'Government', expertise: 'Strategy', appointmentDate: '2020-11-11', expiryDate: '2024-11-10', committees: [], nationality: 'Omani', qualification: 'Master' },
    { id: 8, name_ar: "أحمد الوهيبي", name_en: "Ahmed Al-Wahaibi", avatar: "https://placehold.co/100x100/FFFFFF/FFFFFF.png", companyId: 'omantel', role: 'Member', type: 'Independent', expertise: 'Marketing', appointmentDate: '2021-08-01', expiryDate: '2024-07-31', committees: ['Audit'], nationality: 'Omani', qualification: 'Bachelor' },
    { id: 9, name_ar: "عائشة اليافعي", name_en: "Aisha Al-Yafai", avatar: "https://placehold.co/100x100/FFFFFF/FFFFFF.png", companyId: 'oq', role: 'Member', type: 'Independent', expertise: 'Legal', appointmentDate: '2022-01-15', expiryDate: '2025-01-14', committees: ['Audit'], nationality: 'Omani', qualification: 'Master' },
    { id: 10, name_ar: "هلال الخروصي", name_en: "Hilal Al-Kharusi", avatar: "https://placehold.co/100x100/FFFFFF/FFFFFF.png", companyId: 'omran', role: 'Chairman', type: 'Government', expertise: 'Strategy', appointmentDate: '2021-01-01', expiryDate: '2024-12-31', committees: [], nationality: 'Omani', qualification: 'PhD' },
    { id: 11, name_ar: "مريم الزدجالي", name_en: "Maryam Al-Zadjali", avatar: "https://placehold.co/100x100/FFFFFF/FFFFFF.png", companyId: 'asyad', role: 'Member', type: 'Independent', expertise: 'Finance', appointmentDate: '2021-05-20', expiryDate: '2024-05-19', committees: ['Audit', 'Risk'], nationality: 'Omani', qualification: 'Bachelor' },
    { id: 12, name_ar: "يوسف البلوشي", name_en: "Yousuf Al-Balushi", avatar: "https://placehold.co/100x100/FFFFFF/FFFFFF.png", companyId: 'ithca', role: 'Member', type: 'Executive', expertise: 'Technology', appointmentDate: '2023-09-01', expiryDate: '2026-08-31', committees: ['Risk'], nationality: 'Omani', qualification: 'Master' },
];

export const NATIONALITIES: string[] = [
    'Omani', 'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani',
    'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian',
    'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African',
    'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djibouti', 'Dominican',
    'Dutch', 'East Timorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French',
    'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean', 'Haitian', 'Herzegovinian',
    'Honduran', 'Hungarian', 'I-Kiribati', 'Icelandic', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese',
    'Jordanian', 'Kazakhstani', 'Kenyan', 'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner',
    'Lithuanian', 'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian',
    'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'New Zealander',
    'Nicaraguan', 'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish', 'Norwegian', 'Pakistani', 'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan',
    'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Salvadoran', 'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi',
    'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovakian', 'Slovenian', 'Solomon Islander', 'Somali', 'South African',
    'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese',
    'Tongan', 'Trinidadian or Tobago', 'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh',
    'Yemenite', 'Zambian', 'Zimbabwean'
];

    

    