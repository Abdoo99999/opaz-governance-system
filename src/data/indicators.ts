
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
    { id: 1, title_ar: "الأداء الاقتصادي وجذب الاستثمار", title_en: "Economic Performance & Investment Attraction" },
    { id: 2, title_ar: "التشغيل والقيمة المحلية المضافة", title_en: "Operations & In-Country Value (ICV)" },
    { id: 3, title_ar: "البنية الأساسية والاستدامة", title_en: "Infrastructure & Sustainability" },
    { id: 4, title_ar: "الحوكمة والتحول الرقمي", title_en: "Governance & Digital Transformation" },
];

export const INDICATORS: Indicator[] = [
    // Axis 1: Economic Performance & Investment Attraction
    { id: 1, axisId: 1, text_ar: "معدل نمو الاستثمارات السنوية في المنطقة.", text_en: "Annual investment growth rate in the zone." },
    { id: 2, axisId: 1, text_ar: "حجم الاستثمار الأجنبي المباشر (FDI) المستقطب.", text_en: "Volume of Foreign Direct Investment (FDI) attracted." },
    { id: 3, axisId: 1, text_ar: "عدد الاتفاقيات الجديدة الموقعة مع المستثمرين.", text_en: "Number of new agreements signed with investors." },
    { id: 4, axisId: 1, text_ar: "مستوى رضا المستثمرين الحاليين عن الخدمات المقدمة.", text_en: "Satisfaction level of current investors with the services provided." },

    // Axis 2: Operations & In-Country Value (ICV)
    { id: 5, axisId: 2, text_ar: "تحقيق مستهدفات نسبة التعمين في المشاريع والشركات العاملة.", text_en: "Achievement of Omanization rate targets in projects and operating companies." },
    { id: 6, axisId: 2, text_ar: "نسبة الإنفاق على المؤسسات الصغيرة والمتوسطة من إجمالي المشتريات.", text_en: "Percentage of spending on SMEs from total procurement." },
    { id: 7, axisId: 2, text_ar: "عدد فرص العمل المباشرة وغير المباشرة التي تم استحداثها.", text_en: "Number of direct and indirect job opportunities created." },
    { id: 8, axisId: 2, text_ar: "كفاءة العمليات التشغيلية للمنطقة (مثل الخدمات اللوجستية، إدارة المرافق).", text_en: "Efficiency of the zone's operational processes (e.g., logistics, facility management)." },

    // Axis 3: Infrastructure & Sustainability
    { id: 9, axisId: 3, text_ar: "نسبة إنجاز مشاريع البنية الأساسية حسب الجدول الزمني المعتمد.", text_en: "Completion rate of infrastructure projects according to the approved schedule." },
    { id: 10, axisId: 3, text_ar: "مدى تطبيق معايير الاستدامة والامتثال البيئي في المشاريع.", text_en: "Extent of application of sustainability and environmental compliance standards in projects." },
    { id: 11, axisId: 3, text_ar: "جودة وصيانة البنية الأساسية والمرافق العامة في المنطقة.", text_en: "Quality and maintenance of infrastructure and public facilities in the zone." },
    { id: 12, axisId: 3, text_ar: "فاعلية مبادرات الطاقة النظيفة وتقليل الانبعاثات الكربونية.", text_en: "Effectiveness of clean energy and carbon emission reduction initiatives." },

    // Axis 4: Governance & Digital Transformation
    { id: 13, axisId: 4, text_ar: "متوسط سرعة إنجاز الخدمات وإصدار التراخيص عبر المحطة الواحدة.", text_en: "Average speed of service delivery and license issuance through the one-stop-shop." },
    { id: 14, axisId: 4, text_ar: "مستوى الشفافية والإفصاح عن البيانات والمعلومات الهامة للمستثمرين والجمهور.", text_en: "Level of transparency and disclosure of important data for investors and the public." },
    { id: 15, axisId: 4, text_ar: "نضج تطبيق استراتيجية التحول الرقمي وتوافر الخدمات الإلكترونية.", text_en: "Maturity of digital transformation strategy implementation and availability of e-services." },
    { id: 16, axisId: 4, text_ar: "فاعلية إطار الحوكمة وإدارة المخاطر في المنطقة.", text_en: "Effectiveness of the governance and risk management framework in the zone." },
];
