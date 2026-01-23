
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
    { id: 2, title_ar: "النزاهة والشفافية والامتثال", title_en: "Integrity, Transparency & Compliance" },
    { id: 3, title_ar: "التميز التشغيلي وخدمات المستثمرين", title_en: "Operational Excellence & Investor Services" },
    { id: 4, title_ar: "إدارة المخاطر والاستدامة", title_en: "Risk Management & Sustainability" },
    { id: 5, title_ar: "حوكمة القيمة المحلية والأثر الاجتماعي (ICV)", title_en: "ICV Governance & Social Impact" },
];

export const INDICATORS: Indicator[] = [
    // Axis 1: الحوكمة الاستراتيجية والقيادة
    { id: 1, axisId: 1, text_ar: "مدى التوافق الاستراتيجي لخطة المنطقة مع رؤية \"أوباز\" وأولويات رؤية عمان 2040.", text_en: "Strategic alignment of the zone's plan with OPAZ's vision and Oman Vision 2040 priorities." },
    { id: 2, axisId: 1, text_ar: "فاعلية مصفوفة الصلاحيات المالية والإدارية (DoA) في تسريع اتخاذ القرار.", text_en: "Effectiveness of the financial and administrative Delegation of Authority (DoA) matrix in accelerating decision-making." },
    { id: 3, axisId: 1, text_ar: "جودة وكفاءة القرارات الاستثمارية الصادرة عن الإدارة التنفيذية للمنطقة.", text_en: "Quality and efficiency of investment decisions made by the zone's executive management." },
    { id: 4, axisId: 1, text_ar: "نسبة إنجاز المبادرات الاستراتيجية السنوية المعتمدة للمنطقة.", text_en: "Completion rate of the zone's approved annual strategic initiatives." },
    { id: 5, axisId: 1, text_ar: "فاعلية اللجان التوجيهية (مثل لجنة الاستثمار ولجنة المناقصات) وانتظام اجتماعاتها.", text_en: "Effectiveness of steering committees (e.g., Investment Committee, Tender Committee) and the regularity of their meetings." },
    { id: 6, axisId: 1, text_ar: "مستوى التكامل الاقتصادي مع المناطق الأخرى (تجنب المنافسة الضارة).", text_en: "Level of economic integration with other zones (avoiding harmful competition)." },

    // Axis 2: النزاهة والشفافية والامتثال
    { id: 7, axisId: 2, text_ar: "شفافية وعدالة إجراءات تخصيص الأراضي وحق الانتفاع (Land Allocation Fairness).", text_en: "Transparency and fairness of land allocation and usufruct procedures." },
    { id: 8, axisId: 2, text_ar: "مستوى الامتثال لقانون المناطق الاقتصادية والمناطق الحرة واللوائح التنفيذية.", text_en: "Level of compliance with the law of economic zones, free zones, and their executive regulations." },
    { id: 9, axisId: 2, text_ar: "فاعلية سياسات الإفصاح عن تضارب المصالح لدى المسؤولين والموظفين.", text_en: "Effectiveness of conflict of interest disclosure policies for officials and employees." },
    { id: 10, axisId: 2, text_ar: "سرعة وكفاءة إغلاق ملاحظات التدقيق الداخلي وجهاز الرقابة المالية والإدارية.", text_en: "Speed and efficiency in closing observations from internal audit and the State Audit Institution." },
    { id: 11, axisId: 2, text_ar: "مستوى الإفصاح عن البيانات التشغيلية والفرص الاستثمارية (Open Data).", text_en: "Level of disclosure of operational data and investment opportunities (Open Data)." },
    { id: 12, axisId: 2, text_ar: "وجود وفاعلية قنوات الإبلاغ عن التجاوزات وحماية المبلغين (Whistleblowing).", text_en: "Existence and effectiveness of channels for reporting violations and protecting whistleblowers." },

    // Axis 3: التميز التشغيلي وخدمات المستثمرين
    { id: 13, axisId: 3, text_ar: "كفاءة \"المحطة الواحدة\" (متوسط زمن إصدار التراخيص مقارنة بالمستهدف).", text_en: "Efficiency of the \"One-Stop-Shop\" (average license issuance time vs. target)." },
    { id: 14, axisId: 3, text_ar: "مؤشر رضا المستثمرين وسرعة الاستجابة للشكاوى والمقترحات.", text_en: "Investor satisfaction index and speed of response to complaints and suggestions." },
    { id: 15, axisId: 3, text_ar: "وضوح وثبات رحلة المستثمر (Investor Journey) وسهولة الإجراءات الرقمية.", text_en: "Clarity and stability of the Investor Journey and ease of digital procedures." },
    { id: 16, axisId: 3, text_ar: "كفاءة إدارة عقود حق الانتفاع ومتابعة تحصيل العوائد المالية.", text_en: "Efficiency in managing usufruct contracts and monitoring financial revenue collection." },
    { id: 17, axisId: 3, text_ar: "جاهزية البنية الأساسية والمرافق العامة لخدمة المشاريع الاستثمارية.", text_en: "Readiness of infrastructure and public facilities to serve investment projects." },
    { id: 18, axisId: 3, text_ar: "الالتزام باتفاقيات مستوى الخدمة (SLAs) مع الجهات الحكومية المرتبطة.", text_en: "Adherence to Service Level Agreements (SLAs) with related government entities." },

    // Axis 4: إدارة المخاطر والاستدامة
    { id: 19, axisId: 4, text_ar: "شمولية وتحديث سجل المخاطر التشغيلية (الميناء، الخدمات، الكوارث).", text_en: "Comprehensiveness and updating of the operational risk register (port, services, disasters)." },
    { id: 20, axisId: 4, text_ar: "مستوى الرقابة على الامتثال للاشتراطات البيئية (HSE) في المصانع والمشاريع.", text_en: "Level of control over compliance with environmental (HSE) requirements in factories and projects." },
    { id: 21, axisId: 4, text_ar: "فاعلية خطط استمرارية الأعمال (Business Continuity) والجاهزية للطوارئ.", text_en: "Effectiveness of Business Continuity Plans (BCP) and emergency readiness." },
    { id: 22, axisId: 4, text_ar: "نضج إجراءات الأمن السيبراني وحماية بيانات المستثمرين.", text_en: "Maturity of cybersecurity procedures and investor data protection." },
    { id: 23, axisId: 4, text_ar: "كفاءة خطط الاستدامة المالية (القدرة على تغطية النفقات التشغيلية ذاتياً).", text_en: "Efficiency of financial sustainability plans (ability to self-cover operational expenses)." },
    { id: 24, axisId: 4, text_ar: "كفاءة إدارة وصيانة أصول ومرافق المنطقة (Asset Management).", text_en: "Efficiency of asset and facility management in the zone (Asset Management)." },

    // Axis 5: حوكمة القيمة المحلية والأثر الاجتماعي (ICV)
    { id: 25, axisId: 5, text_ar: "فاعلية خطط الإحلال والتدريب المقرنة بالتشغيل للكوادر الوطنية في إدارة المنطقة.", text_en: "Effectiveness of Omanization and on-the-job training plans for national cadres in the zone's management." },
    { id: 26, axisId: 5, text_ar: "كفاءة منظومة التفتيش والرقابة على نسب التعمين لدى الشركات المستثمرة.", text_en: "Efficiency of the inspection and control system for Omanization rates in investing companies." },
    { id: 27, axisId: 5, text_ar: "الالتزام بتطبيق سياسة \"أولوية المنتج الوطني\" في مشتريات ومناقصات المنطقة.", text_en: "Commitment to applying the \"National Product Priority\" policy in the zone's procurements and tenders." },
    { id: 28, axisId: 5, text_ar: "مدى توفر حوافز وتسهيلات إجرائية فعالة لرواد الأعمال والمؤسسات الصغيرة (SMEs).", text_en: "Availability of effective incentives and procedural facilities for entrepreneurs and SMEs." },
    { id: 29, axisId: 5, text_ar: "جودة واستدامة مبادرات المسؤولية الاجتماعية (CSR) وأثرها على المجتمع المحلي.", text_en: "Quality and sustainability of Corporate Social Responsibility (CSR) initiatives and their impact on the local community." },
    { id: 30, axisId: 5, text_ar: "الأثر الاقتصادي التنموي للمنطقة على الولاية/المحافظة المحيطة (تنشيط السوق المحلي).", text_en: "The zone's developmental economic impact on the surrounding Wilayat/Governorate (stimulating the local market)." }
];
