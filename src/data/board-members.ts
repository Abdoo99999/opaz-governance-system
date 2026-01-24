
export interface BoardMember {
  id: number;
  name_ar: string;
  name_en: string;
  avatar: string;
  zoneId: string;
  role: 'CEO' | 'COO' | 'CFO' | 'VP of Business Development' | 'VP of Operations' | 'Investment Director';
  expertise: 'Smart City Development' | 'Logistics' | 'FDI Attraction' | 'Industrial Management' | 'Urban Planning';
  appointmentDate: string;
  expiryDate: string;
  committees: ('Audit' | 'Risk' | 'HR' | 'Nomination')[];
  nationality: string;
  qualification?: 'Bachelor' | 'Master' | 'PhD';
}

const whiteAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/epv2AAAAABJRU5ErkJggg==';

export const BOARD_MEMBERS: BoardMember[] = [
    // Duqm
    { id: 1, name_ar: "أحمد بن علي العكعاك", name_en: "Ahmed Al-Akak", avatar: whiteAvatar, zoneId: 'duqm', role: 'CEO', expertise: 'Industrial Management', appointmentDate: '2022-01-15', expiryDate: '2026-01-14', committees: ['Nomination'], nationality: 'Omani', qualification: 'Master' },
    { id: 2, name_ar: "جون ويليامز", name_en: "John Williams", avatar: whiteAvatar, zoneId: 'duqm', role: 'COO', expertise: 'Logistics', appointmentDate: '2021-08-01', expiryDate: '2025-07-31', committees: ['Risk'], nationality: 'British', qualification: 'Master' },
    { id: 3, name_ar: "مريم الشيدية", name_en: "Maryam Al-Shidi", avatar: whiteAvatar, zoneId: 'duqm', role: 'Investment Director', expertise: 'FDI Attraction', appointmentDate: '2023-02-20', expiryDate: '2027-02-19', committees: [], nationality: 'Omani', qualification: 'Bachelor' },
    
    // Sohar
    { id: 4, name_ar: "عمر المحرزي", name_en: "Omar Al-Mahrizi", avatar: whiteAvatar, zoneId: 'sohar-free', role: 'CEO', expertise: 'Logistics', appointmentDate: '2021-05-20', expiryDate: '2025-05-19', committees: ['Audit'], nationality: 'Omani', qualification: 'PhD' },
    { id: 5, name_ar: "بريانكا شارما", name_en: "Priyanka Sharma", avatar: whiteAvatar, zoneId: 'sohar-free', role: 'CFO', expertise: 'FDI Attraction', appointmentDate: '2022-11-10', expiryDate: '2026-11-09', committees: ['Risk'], nationality: 'Indian', qualification: 'Master' },
    { id: 6, name_ar: "يوسف البلوشي", name_en: "Yousuf Al-Balushi", avatar: whiteAvatar, zoneId: 'sohar-free', role: 'VP of Operations', expertise: 'Industrial Management', appointmentDate: '2020-03-01', expiryDate: '2024-02-29', committees: [], nationality: 'Omani', qualification: 'Bachelor' },

    // Madayn
    { id: 7, name_ar: "حمد القصابي", name_en: "Hamad Al-Qasabi", avatar: whiteAvatar, zoneId: 'madayn', role: 'CEO', expertise: 'Industrial Management', appointmentDate: '2020-01-01', expiryDate: '2025-01-01', committees: ['Nomination', 'Risk'], nationality: 'Omani', qualification: 'Master' },
    { id: 8, name_ar: "سعيد الراشدي", name_en: "Said Al-Rashdi", avatar: whiteAvatar, zoneId: 'madayn', role: 'VP of Operations', expertise: 'Urban Planning', appointmentDate: '2021-06-15', expiryDate: '2025-06-14', committees: [], nationality: 'Omani', qualification: 'PhD' },
    
    // Salalah
    { id: 9, name_ar: "محسن بيت فاضل", name_en: "Mohsin Bait Fadil", avatar: whiteAvatar, zoneId: 'salalah-free', role: 'CEO', expertise: 'Logistics', appointmentDate: '2023-03-10', expiryDate: '2027-03-09', committees: ['Audit'], nationality: 'Omani', qualification: 'Master' },
    { id: 10, name_ar: "بيتر فان دن بوس", name_en: "Peter van den Bosch", avatar: whiteAvatar, zoneId: 'salalah-free', role: 'COO', expertise: 'FDI Attraction', appointmentDate: '2022-09-01', expiryDate: '2026-08-31', committees: [], nationality: 'Dutch', qualification: 'Master' },

    // Khazaen
    { id: 11, name_ar: "خالد العبري", name_en: "Khalid Al-Abri", avatar: whiteAvatar, zoneId: 'khazaen', role: 'CEO', expertise: 'Smart City Development', appointmentDate: '2022-07-22', expiryDate: '2026-07-21', committees: ['Risk', 'HR'], nationality: 'Omani', qualification: 'PhD' },
    { id: 12, name_ar: "سالم الشعيلي", name_en: "Salim Al-Shuaili", avatar: whiteAvatar, zoneId: 'khazaen', role: 'VP of Business Development', expertise: 'FDI Attraction', appointmentDate: '2023-01-10', expiryDate: '2027-01-09', committees: [], nationality: 'Omani', qualification: 'Master' },

    // Al Mazunah
    { id: 13, name_ar: "سعيد البلوشي", name_en: "Saeed Al Balushi", avatar: whiteAvatar, zoneId: 'mazunah', role: 'CEO', expertise: 'Logistics', appointmentDate: '2021-10-01', expiryDate: '2025-09-30', committees: [], nationality: 'Omani', qualification: 'Bachelor' }
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
