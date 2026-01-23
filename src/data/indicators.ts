export interface Axis {
    id: number;
    title_ar: string;
    title_en: string;
  }
  
  export interface Indicator {
    id: number;
    axisId: number;
    text_ar: string;
    text_en: string;
  }
  
  export const AXES: Axis[] = [
    { id: 1, title_ar: "الحوكمة الاستراتيجية والقيادة", title_en: "Strategic Governance & Leadership" },
    { id: 2, title_ar: "النزاهة والشفافية والامتثال", title_en: "Integrity & Compliance" },
    { id: 3, title_ar: "التميز التشغيلي وخدمات المستثمرين", title_en: "Operational Excellence & Investor Services" },
    { id: 4, title_ar: "إدارة المخاطر والاستدامة", title_en: "Risk Management & Sustainability" },
    { id: 5, title_ar: "القيمة المحلية والأثر الوطني", title_en: "ICV & National Impact" },
  ];
  
  export const INDICATORS: Indicator[] = [
    // Axis 1: الحوكمة الاستراتيجية والقيادة
    { id: 1, axisId: 1, text_ar: "مدى توافق الخطة الاستراتيجية للمنطقة مع رؤية \"أوباز\" وأهداف 2040.", text_en: "Alignment of the zone's strategic plan with OPAZ's vision and Vision 2040 objectives." },
    { id: 2, axisId: 1, text_ar: "فاعلية مصفوفة الصلاحيات (DoA) في تسريع القرارات التشغيلية والاستثمارية.", text_en: "Effectiveness of the Delegation of Authority (DoA) matrix in accelerating operational and investment decisions." },
    { id: 3, axisId: 1, text_ar: "جودة القرارات الصادرة عن الإدارة التنفيذية للمنطقة وتوثيقها.", text_en: "Quality and documentation of decisions issued by the zone's executive management." },
    { id: 4, axisId: 1, text_ar: "نسبة إنجاز المبادرات الاستراتيجية المعتمدة في الخطة السنوية.", text_en: "Completion rate of strategic initiatives approved in the annual plan." },
    { id: 5, axisId: 1, text_ar: "انتظام وفاعلية اجتماعات اللجان التوجيهية والإدارية بالمنطقة.", text_en: "Regularity and effectiveness of steering and administrative committee meetings in the zone." },
    { id: 6, axisId: 1, text_ar: "مستوى التكامل والتنسيق مع المناطق الاقتصادية الأخرى (منع الازدواجية).", text_en: "Level of integration and coordination with other economic zones (preventing duplication)." },
  
    // Axis 2: النزاهة والامتثال
    { id: 7, axisId: 2, text_ar: "شفافية وعدالة إجراءات تخصيص الأراضي وحق الانتفاع (Land Allocation).", text_en: "Transparency and fairness of land allocation and usufruct procedures." },
    { id: 8, axisId: 2, text_ar: "مستوى الامتثال لقانون المناطق الاقتصادية واللوائح التنفيذية للهيئة.", text_en: "Level of compliance with the Economic Zones Law and the Authority's executive regulations." },
    { id: 9, axisId: 2, text_ar: "فاعلية سياسات الإفصاح عن تضارب المصالح لدى الموظفين والمسؤولين.", text_en: "Effectiveness of conflict of interest disclosure policies for employees and officials." },
    { id: 10, axisId: 2, text_ar: "سرعة إغلاق ملاحظات التدقيق الداخلي والرقابة المالية.", text_en: "Speed of closing findings from internal audit and financial oversight." },
    { id: 11, axisId: 2, text_ar: "مستوى الشفافية في نشر البيانات التشغيلية والفرص الاستثمارية (Open Data).", text_en: "Level of transparency in publishing operational data and investment opportunities (Open Data)." },
    { id: 12, axisId: 2, text_ar: "وجود قنوات فعالة وآمنة للإبلاغ عن المخالفات (Whistleblowing).", text_en: "Existence of effective and secure channels for reporting violations (Whistleblowing)." },
  
    // Axis 3: التميز التشغيلي وخدمات المستثمرين
    { id: 13, axisId: 3, text_ar: "كفاءة \"المحطة الواحدة\" (متوسط زمن إصدار التراخيص والموافقات).", text_en: "Efficiency of the \"One-Stop Shop\" (average time for issuing licenses and approvals)." },
    { id: 14, axisId: 3, text_ar: "مؤشر رضا المستثمرين وسرعة الاستجابة للمقترحات والشكاوى.", text_en: "Investor satisfaction index and speed of response to suggestions and complaints." },
    { id: 15, axisId: 3, text_ar: "وضوح وثبات رحلة المستثمر (Investor Journey) وسهولة الإجراءات الرقمية.", text_en: "Clarity and stability of the Investor Journey and ease of digital procedures." },
    { id: 16, axisId: 3, text_ar: "كفاءة إدارة عقود الانتفاع وتحصيل العوائد المالية في وقتها.", text_en: "Efficiency in managing usufruct contracts and timely collection of financial revenues." },
    { id: 17, axisId: 3, text_ar: "جاهزية البنية الأساسية والمرافق العامة لخدمة المشاريع القائمة.", text_en: "Readiness of infrastructure and public facilities to serve existing projects." },
    { id: 18, axisId: 3, text_ar: "الالتزام باتفاقيات مستوى الخدمة (SLAs) مع الجهات الحكومية المرتبطة.", text_en: "Adherence to Service Level Agreements (SLAs) with related government entities." },
  
    // Axis 4: إدارة المخاطر والاستدامة
    { id: 19, axisId: 4, text_ar: "شمولية وتحديث سجل المخاطر التشغيلية (الموانئ، الخدمات، الطوارئ).", text_en: "Comprehensiveness and updating of the operational risk register (ports, services, emergencies)." },
    { id: 20, axisId: 4, text_ar: "مستوى الرقابة على التزام المصانع بالاشتراطات البيئية (HSE).", text_en: "Level of control over factories' compliance with environmental (HSE) requirements." },
    { id: 21, axisId: 4, text_ar: "فاعلية خطط استمرارية الأعمال (Business Continuity) والجاهزية للأزمات.", text_en: "Effectiveness of Business Continuity Plans (BCP) and crisis readiness." },
    { id: 22, axisId: 4, text_ar: "نضج إجراءات الأمن السيبراني وحماية بيانات المستثمرين.", text_en: "Maturity of cybersecurity procedures and protection of investor data." },
    { id: 23, axisId: 4, text_ar: "كفاءة خطط الاستدامة المالية (تعظيم الإيرادات وضبط المصروفات).", text_en: "Efficiency of financial sustainability plans (maximizing revenues and controlling expenses)." },
    { id: 24, axisId: 4, text_ar: "كفاءة برامج صيانة الأصول والمرافق الحكومية في المنطقة.", text_en: "Efficiency of maintenance programs for government assets and facilities in the zone." },
  
    // Axis 5: القيمة المحلية والأثر الوطني
    { id: 25, axisId: 5, text_ar: "فاعلية خطط الإحلال والتدريب للموظفين العمانيين في إدارة المنطقة.", text_en: "Effectiveness of succession and training plans for Omani employees in the zone's management." },
    { id: 26, axisId: 5, text_ar: "كفاءة منظومة التفتيش على نسب التعمين لدى الشركات المستثمرة.", text_en: "Efficiency of the inspection system for Omanization rates in investing companies." },
    { id: 27, axisId: 5, text_ar: "الالتزام بإعطاء الأولوية للمنتج الوطني في مشتريات ومناقصات المنطقة.", text_en: "Commitment to prioritizing the national product in the zone's procurements and tenders." },
    { id: 28, axisId: 5, text_ar: "مدى توفر حوافز وتسهيلات حقيقية للمؤسسات الصغيرة والمتوسطة (SMEs).", text_en: "Availability of genuine incentives and facilities for Small and Medium Enterprises (SMEs)." },
    { id: 29, axisId: 5, text_ar: "جودة واستدامة مبادرات المسؤولية الاجتماعية (CSR) تجاه المجتمع المحلي.", text_en: "Quality and sustainability of Corporate Social Responsibility (CSR) initiatives towards the local community." },
    { id: 30, axisId: 5, text_ar: "الأثر الاقتصادي التنموي للمنطقة على الولاية/المحافظة المحيطة.", text_en: "The zone's developmental economic impact on the surrounding Wilayat/Governorate." }
  ];