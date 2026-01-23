
export interface BoardMember {
  id: number;
  name_ar: string;
  name_en: string;
  avatar: string;
  zoneId: string;
  role: 'CEO' | 'VP Operations' | 'Investment DG' | 'Planning DG';
  expertise: 'Smart City Development' | 'Logistics' | 'FDI Attraction' | 'Industrial Management' | 'Urban Planning';
  appointmentDate: string;
  expiryDate: string;
  committees: ('Audit' | 'Risk' | 'HR' | 'Nomination')[];
  nationality: string;
  qualification?: 'Bachelor' | 'Master' | 'PhD';
}

const whiteAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/epv2AAAAABJRU5ErkJggg==';

export const BOARD_MEMBERS: BoardMember[] = [
    { id: 1, name_ar: "سعادة عبدالله السالمي", name_en: "HE Abdulsalam Al Murshidi", avatar: whiteAvatar, zoneId: 'duqm', role: 'CEO', expertise: 'FDI Attraction', appointmentDate: '2022-01-15', expiryDate: '2025-01-14', committees: ['Nomination'], nationality: 'Omani', qualification: 'Master' },
    { id: 2, name_ar: "د. محمد الحارثي", name_en: "Dr. Mohammed Al-Harthy", avatar: whiteAvatar, zoneId: 'duqm', role: 'VP Operations', expertise: 'Industrial Management', appointmentDate: '2022-01-15', expiryDate: '2025-01-14', committees: ['Audit', 'Risk'], nationality: 'Omani', qualification: 'PhD' },
    { id: 3, name_ar: "م. سالم العوفي", name_en: "Eng. Salim Al Aufi", avatar: whiteAvatar, zoneId: 'sohar', role: 'CEO', expertise: 'Logistics', appointmentDate: '2021-05-20', expiryDate: '2024-05-19', committees: [], nationality: 'Omani', qualification: 'Bachelor' },
    { id: 4, name_ar: "فاطمة الشكيلية", name_en: "Fatma Al-Shukaili", avatar: whiteAvatar, zoneId: 'salalah', role: 'Planning DG', expertise: 'Urban Planning', appointmentDate: '2023-03-10', expiryDate: '2026-03-09', committees: ['HR', 'Nomination'], nationality: 'Omani', qualification: 'Master' },
    { id: 5, name_ar: "خالد الصالحي", name_en: "Khalid Al-Salhi", avatar: whiteAvatar, zoneId: 'muscat', role: 'CEO', expertise: 'Smart City Development', appointmentDate: '2023-09-01', expiryDate: '2026-08-31', committees: [], nationality: 'Omani', qualification: 'PhD' },
    { id: 6, name_ar: "علي المسكري", name_en: "Ali Al-Maskari", avatar: whiteAvatar, zoneId: 'maza', role: 'Investment DG', expertise: 'Logistics', appointmentDate: '2022-07-22', expiryDate: '2025-07-21', committees: ['Risk'], nationality: 'Omani', qualification: 'Bachelor' },
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
