export interface Axis {
  id: number;
  title_ar: string;
  title_en: string;
}
export interface Indicator { id: number; axisId: number; text_ar: string; text_en: string; }

export const AXES: Axis[] = [
  { id: 1, title_ar: 'الحوكمة الاستراتيجية والقيادة', title_en: 'Strategic Governance & Leadership' },
  { id: 2, title_ar: 'النزاهة والشفافية والامتثال', title_en: 'Integrity, Transparency & Compliance' },
  { id: 3, title_ar: 'التميز التشغيلي وخدمات المستثمرين', title_en: 'Operational Excellence & Investor Services' },
  { id: 4, title_ar: 'إدارة المخاطر والاستدامة', title_en: 'Risk Management & Sustainability' },
  { id: 5, title_ar: 'القيمة المحلية والأثر الوطني', title_en: 'ICV & National Impact' }
];
export const INDICATORS: Indicator[] = [ // المحور 1 
{ id: 1, axisId: 1, text_ar: 'مدى توافق الخطة الاستراتيجية للمنطقة مع رؤية "الهيئة" وأهداف 2040.', text_en: 'Alignment of zone strategic plan with OPAZ vision.' }, 
{ id: 2, axisId: 1, text_ar: 'فاعلية مصفوفة الصلاحيات (DoA) في تسريع القرارات التشغيلية والاستثمارية.', text_en: 'Effectiveness of Delegation of Authority (DoA).' }, 
{ id: 3, axisId: 1, text_ar: 'وجود هيكل تنظيمي معتمد وواضح يحدد الأدوار والمسؤوليات بدقة.', text_en: 'Approved organizational structure defining roles.' }, 
{ id: 4, axisId: 1, text_ar: 'كفاءة الإدارة التنفيذية في تحقيق مؤشرات الأداء الرئيسية (KPIs).', text_en: 'Efficiency of executive management in achieving KPIs.' }, 
{ id: 5, axisId: 1, text_ar: 'وجود سياسات واضحة لإدارة الموارد البشرية وتخطيط التعاقب الوظيفي.', text_en: 'Clear HR policies and succession planning.' }, 
{ id: 6, axisId: 1, text_ar: 'دورية وفعالية التقارير المرفوعة من إدارة المنطقة إلى الهيئة.', text_en: 'Regularity of reports submitted to OPAZ.' }, 
// المحور 2 
{ id: 7, axisId: 2, text_ar: 'وجود مدونة قواعد سلوك وظيفي مفعلة ومعممة على جميع الموظفين.', text_en: 'Code of Conduct distributed to all employees.' }, 
{ id: 8, axisId: 2, text_ar: 'فاعلية نظام الإفصاح عن تضارب المصالح للمسؤولين والموظفين.', text_en: 'Conflict of Interest disclosure system.' }, 
{ id: 9, axisId: 2, text_ar: 'وجود قنوات آمنة وسرية للإبلاغ عن التجاوزات (Whistleblowing).', text_en: 'Secure Whistleblowing channels.' }, 
{ id: 10, axisId: 2, text_ar: 'استقلالية وظيفة التدقيق والامتثال وكفاءة التقارير الصادرة عنها.', text_en: 'Independence of Audit & Compliance function.' }, 
{ id: 11, axisId: 2, text_ar: 'مستوى الامتثال للقوانين واللوائح الصادرة عن الهيئة وتشريعات الدولة.', text_en: 'Compliance with OPAZ regulations.' }, 
{ id: 12, axisId: 2, text_ar: 'شفافية وعدالة إجراءات تخصيص الأراضي وحق الانتفاع.', text_en: 'Transparency of Land Allocation procedures.' }, 
// المحور 3 
{ id: 13, axisId: 3, text_ar: 'وضوح وثبات رحلة المستثمر وسهولة الإجراءات الرقمية.', text_en: 'Clarity of Investor Journey and digital procedures.' }, 
{ id: 14, axisId: 3, text_ar: 'نسبة الخدمات المقدمة عبر المحطة الواحدة إلكترونياً.', text_en: 'Percentage of e-services via One-Stop Shop.' }, 
{ id: 15, axisId: 3, text_ar: 'الالتزام باتفاقيات مستوى الخدمة (SLAs) مع المستثمرين.', text_en: 'Adherence to SLAs with investors.' }, 
{ id: 16, axisId: 3, text_ar: 'وجود آلية فعالة لقياس رضا المستثمرين ومعالجة الشكاوى.', text_en: 'Mechanism for investor satisfaction and complaints.' }, 
{ id: 17, axisId: 3, text_ar: 'كفاءة إدارة وصيانة البنية الأساسية والمرافق العامة.', text_en: 'Efficiency of infrastructure maintenance.' }, 
{ id: 18, axisId: 3, text_ar: 'تبني تقنيات التحول الرقمي والأتمتة.', text_en: 'Digital transformation and automation.' }, 
// المحور 4 
{ id: 19, axisId: 4, text_ar: 'شمولية سجل المخاطر التشغيلية والاستراتيجية وتحديثه دورياً.', text_en: 'Comprehensive Risk Register update.' }, 
{ id: 20, axisId: 4, text_ar: 'فاعلية خطط استمرارية الأعمال (BCP) والجاهزية لإدارة الأزمات.', text_en: 'Effectiveness of BCP and crisis management.' }, 
{ id: 21, axisId: 4, text_ar: 'الالتزام بمعايير الصحة والسلامة والبيئة (HSE).', text_en: 'Compliance with HSE standards.' }, 
{ id: 22, axisId: 4, text_ar: 'تطبيق ممارسات الاستدامة البيئية وكفاءة الطاقة.', text_en: 'Environmental sustainability practices.' }, 
{ id: 23, axisId: 4, text_ar: 'وجود مبادرات للمسؤولية الاجتماعية (CSR) تخدم المجتمع.', text_en: 'CSR initiatives serving the community.' }, 
{ id: 24, axisId: 4, text_ar: 'الاستدامة المالية للمنطقة وقدرتها على تغطية التكاليف.', text_en: 'Financial sustainability of the zone.' }, 
// المحور 5 
{ id: 25, axisId: 5, text_ar: 'نسبة العقود والمناقصات المسندة للشركات المحلية.', text_en: 'Local Content in contracts.' }, 
{ id: 26, axisId: 5, text_ar: 'مدى توفر حوافز وتسهيلات للمؤسسات الصغيرة والمتوسطة.', text_en: 'Incentives for SMEs.' }, 
{ id: 27, axisId: 5, text_ar: 'تحقيق نسب التعمين المستهدفة في الوظائف النوعية.', text_en: 'Achieving Omanization targets.' }, 
{ id: 28, axisId: 5, text_ar: 'جهود المنطقة في تدريب وتأهيل الكوادر الوطنية.', text_en: 'Training and qualifying national cadres.' }, 
{ id: 29, axisId: 5, text_ar: 'حجم الاستثمار الأجنبي المباشر (FDI) المجتذب.', text_en: 'Volume of FDI attracted.' }, 
{ id: 30, axisId: 5, text_ar: 'الأثر الاقتصادي للمنطقة في تنويع الدخل الوطني.', text_en: 'Economic impact in diversifying income.' } 
];
