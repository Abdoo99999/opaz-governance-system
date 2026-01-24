export interface Axis {
  id: number;
  title_ar: string;
  title_en: string;
}
export interface Indicator { id: number; axisId: number; text_ar: string; text_en: string; }

export const AXES: Axis[] = [ { id: 1, title_ar: 'الحوكمة الاستراتيجية والقيادة', title_en: 'Strategic Governance & Leadership' }, { id: 2, title_ar: 'النزاهة والشفافية والامتثال', title_en: 'Integrity, Transparency & Compliance' }, { id: 3, title_ar: 'التميز التشغيلي وخدمات المستثمرين', title_en: 'Operational Excellence & Investor Services' }, { id: 4, title_ar: 'إدارة المخاطر والاستدامة', title_en: 'Risk Management & Sustainability' }, { id: 5, title_ar: 'القيمة المحلية والأثر الوطني', title_en: 'ICV & National Impact' } ];

export const INDICATORS: Indicator[] = [ 
  // --- المحور الأول: الحوكمة الاستراتيجية والقيادة (1-6) --- 
  { id: 1, axisId: 1, text_ar: 'مدى توافق الخطة الاستراتيجية للمنطقة مع رؤية "أوباز" وأهداف 2040.', text_en: 'Alignment of zone strategic plan with OPAZ vision and 2040 goals.' }, 
  { id: 2, axisId: 1, text_ar: 'فاعلية مصفوفة الصلاحيات (DoA) في تسريع القرارات التشغيلية والاستثمارية.', text_en: 'Effectiveness of Delegation of Authority (DoA) in accelerating operational and investment decisions.' }, 
  { id: 3, axisId: 1, text_ar: 'وجود هيكل تنظيمي معتمد وواضح يحدد الأدوار والمسؤوليات بدقة.', text_en: 'Existence of an approved organizational structure defining roles and responsibilities.' }, 
  { id: 4, axisId: 1, text_ar: 'كفاءة الإدارة التنفيذية في تحقيق مؤشرات الأداء الرئيسية (KPIs) المعتمدة.', text_en: 'Efficiency of executive management in achieving approved Key Performance Indicators (KPIs).' }, 
  { id: 5, axisId: 1, text_ar: 'وجود سياسات واضحة لإدارة الموارد البشرية وتخطيط التعاقب الوظيفي للقيادات.', text_en: 'Clear policies for HR management and leadership succession planning.' }, 
  { id: 6, axisId: 1, text_ar: 'دورية وفعالية التقارير المرفوعة من إدارة المنطقة إلى الهيئة (OPAZ).', text_en: 'Regularity and effectiveness of reports submitted by zone management to OPAZ.' },

  // --- المحور الثاني: النزاهة والشفافية والامتثال (7-12) --- 
  { id: 7, axisId: 2, text_ar: 'وجود مدونة قواعد سلوك وظيفي مفعلة ومعممة على جميع موظفي المنطقة.', text_en: 'Existence of an activated Code of Conduct distributed to all zone employees.' }, 
  { id: 8, axisId: 2, text_ar: 'فاعلية نظام الإفصاح عن تضارب المصالح للمسؤولين والموظفين.', text_en: 'Effectiveness of Conflict of Interest disclosure system for officials and staff.' }, 
  { id: 9, axisId: 2, text_ar: 'وجود قنوات آمنة وسرية للإبلاغ عن التجاوزات (Whistleblowing).', text_en: 'Existence of secure and confidential Whistleblowing channels.' }, 
  { id: 10, axisId: 2, text_ar: 'استقلالية وظيفة التدقيق والامتثال وكفاءة التقارير الصادرة عنها.', text_en: 'Independence of Audit & Compliance function and efficiency of its reports.' }, 
  { id: 11, axisId: 2, text_ar: 'مستوى الامتثال للقوانين واللوائح الصادرة عن الهيئة وتشريعات الدولة.', text_en: 'Level of compliance with OPAZ regulations and national legislations.' }, 
  { id: 12, axisId: 2, text_ar: 'شفافية وعدالة إجراءات تخصيص الأراضي وحق الانتفاع (Land Allocation).', text_en: 'Transparency and fairness of Land Allocation and Usufruct procedures.' },

  // --- المحور الثالث: التميز التشغيلي وخدمات المستثمرين (13-18) --- 
  { id: 13, axisId: 3, text_ar: 'وضوح وثبات رحلة المستثمر (Investor Journey) وسهولة الإجراءات الرقمية.', text_en: 'Clarity and consistency of Investor Journey and ease of digital procedures.' }, 
  { id: 14, axisId: 3, text_ar: 'نسبة الخدمات المقدمة عبر المحطة الواحدة (One-Stop Shop) إلكترونياً.', text_en: 'Percentage of services provided electronically via One-Stop Shop.' }, 
  { id: 15, axisId: 3, text_ar: 'الالتزام باتفاقيات مستوى الخدمة (SLAs) المبرمة مع المستثمرين.', text_en: 'Adherence to Service Level Agreements (SLAs) with investors.' }, 
  { id: 16, axisId: 3, text_ar: 'وجود آلية فعالة لقياس رضا المستثمرين ومعالجة الشكاوى بسرعة.', text_en: 'Effective mechanism for measuring investor satisfaction and handling complaints quickly.' }, 
  { id: 17, axisId: 3, text_ar: 'كفاءة إدارة وصيانة البنية الأساسية والمرافق العامة في المنطقة.', text_en: 'Efficiency of infrastructure and public utilities management and maintenance.' }, 
  { id: 18, axisId: 3, text_ar: 'تبني تقنيات التحول الرقمي والأتمتة لتقليل المعاملات الورقية.', text_en: 'Adoption of digital transformation and automation to reduce paperwork.' },

  // --- المحور الرابع: إدارة المخاطر والاستدامة (19-24) --- 
  { id: 19, axisId: 4, text_ar: 'شمولية سجل المخاطر التشغيلية والاستراتيجية وتحديثه دورياً.', text_en: 'Comprehensiveness and regular update of operational and strategic Risk Register.' }, 
  { id: 20, axisId: 4, text_ar: 'فاعلية خطط استمرارية الأعمال (BCP) والجاهزية لإدارة الأزمات.', text_en: 'Effectiveness of Business Continuity Plans (BCP) and crisis management readiness.' }, 
  { id: 21, axisId: 4, text_ar: 'الالتزام بمعايير الصحة والسلامة والبيئة (HSE) داخل المنطقة.', text_en: 'Compliance with HSE standards within the zone.' }, 
  { id: 22, axisId: 4, text_ar: 'تطبيق ممارسات الاستدامة البيئية وكفاءة استهلاك الطاقة.', text_en: 'Implementation of environmental sustainability and energy efficiency practices.' }, 
  { id: 23, axisId: 4, text_ar: 'وجود مبادرات للمسؤولية الاجتماعية (CSR) تخدم المجتمع المحلي المحيط.', text_en: 'Existence of CSR initiatives serving the surrounding local community.' }, 
  { id: 24, axisId: 4, text_ar: 'الاستدامة المالية للمنطقة وقدرتها على تغطية تكاليفها التشغيلية.', text_en: 'Financial sustainability of the zone and ability to cover operational costs.' },

  // --- المحور الخامس: القيمة المحلية والأثر الوطني (25-30) --- 
  { id: 25, axisId: 5, text_ar: 'نسبة العقود والمناقصات المسندة للشركات المحلية (Local Content).', text_en: 'Percentage of contracts and tenders awarded to local companies.' }, 
  { id: 26, axisId: 5, text_ar: 'مدى توفر حوافز وتسهيلات حقيقية للمؤسسات الصغيرة والمتوسطة (SMEs).', text_en: 'Availability of real incentives and facilities for SMEs.' }, 
  { id: 27, axisId: 5, text_ar: 'تحقيق نسب التعمين المستهدفة في الوظائف النوعية والقيادية بالمنطقة.', text_en: 'Achieving Omanization targets in qualitative and leadership roles within the zone.' }, 
  { id: 28, axisId: 5, text_ar: 'جهود المنطقة في تدريب وتأهيل الكوادر الوطنية وتمكينهم.', text_en: 'Zone efforts in training, qualifying, and empowering national cadres.' }, 
  { id: 29, axisId: 5, text_ar: 'حجم الاستثمار الأجنبي المباشر (FDI) الذي تم جذبه فعلياً خلال العام.', text_en: 'Volume of Foreign Direct Investment (FDI) actually attracted during the year.' }, 
  { id: 30, axisId: 5, text_ar: 'الأثر الاقتصادي للمنطقة في تنويع مصادر الدخل الوطني وجذب العملة الصعبة.', text_en: 'Economic impact of the zone in diversifying national income sources and attracting foreign currency.' } 
];