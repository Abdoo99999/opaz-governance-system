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
    { id: 1, title_ar: "السياسات واللوائح", title_en: "Policies & Regulations" },
    { id: 2, title_ar: "هيكل الحوكمة", title_en: "Governance Structure" },
    { id: 3, title_ar: "مجلس الإدارة", title_en: "Board of Directors" },
    { id: 4, title_ar: "الإدارة التنفيذية", title_en: "Executive Management" },
    { id: 5, title_ar: "إدارة المخاطر والامتثال", title_en: "Risk & Compliance" },
    { id: 6, title_ar: "التدقيق الداخلي", title_en: "Internal Audit" },
    { id: 7, title_ar: "حقوق المساهمين", title_en: "Shareholder Rights" },
    { id: 8, title_ar: "الإفصاح والشفافية", title_en: "Disclosure & Transparency" },
    { id: 9, title_ar: "الاستدامة", title_en: "Sustainability (ESG)" },
    { id: 10, title_ar: "التحول الرقمي والابتكار", title_en: "Digital Transformation & Innovation" },
];

export const INDICATORS: Indicator[] = [
    // Axis 1: السياسات واللوائح
    { id: 1, axisId: 1, text_ar: "مدى التوافق التنظيمي للشركة مع ميثاق جهاز الاستثمار العماني.", text_en: "Regulatory Alignment with OIA Charter" },
    { id: 2, axisId: 1, text_ar: "وضوح وكفاءة مصفوفة الصلاحيات (RACI Matrix).", text_en: "Clarity and Efficiency of Authority Matrix (RACI)" },
    { id: 3, axisId: 1, text_ar: "وجود وتطبيق سياسة لتفويض السلطات.", text_en: "Existence and Application of a Delegation of Authority Policy" },
    { id: 4, axisId: 1, text_ar: "وجود وتطبيق لائحة عمل مجلس الإدارة.", text_en: "Existence and Application of Board of Directors' Bylaws" },
    { id: 5, axisId: 1, text_ar: "اكتمال ومراجعة السياسات الأساسية (مالية، موارد بشرية، مشتريات).", text_en: "Completeness and Review of Core Policies (Financial, HR, Procurement)" },

    // Axis 2: هيكل الحوكمة
    { id: 6, axisId: 2, text_ar: "وضوح الهيكل التنظيمي للشركة.", text_en: "Clarity of the Company's Organizational Structure" },
    { id: 7, axisId: 2, text_ar: "وجود وتفعيل لجان مجلس الإدارة (التدقيق، الترشيحات والمكافآت).", text_en: "Existence and Activation of Board Committees (Audit, Nominations & Remunerations)" },
    { id: 8, axisId: 2, text_ar: "استقلالية وموضوعية أعضاء لجان المجلس.", text_en: "Independence and Objectivity of Committee Members" },
    { id: 9, axisId: 2, text_ar: "وجود أمين سر للمجلس يتمتع بالخبرة والكفاءة.", text_en: "Presence of an Experienced and Competent Board Secretary" },
    { id: 10, axisId: 2, text_ar: "كفاءة آليات التواصل والتنسيق بين لجان المجلس والإدارة التنفيذية.", text_en: "Efficiency of Communication and Coordination Mechanisms between Board Committees and Executive Management" },

    // Axis 3: مجلس الإدارة
    { id: 11, axisId: 3, text_ar: "توازن تشكيل المجلس من حيث الخبرات والتنوع.", text_en: "Balance in Board Composition in terms of Expertise and Diversity" },
    { id: 12, axisId: 3, text_ar: "نسبة الأعضاء المستقلين وغير التنفيذيين في المجلس.", text_en: "Percentage of Independent and Non-Executive Members on the Board" },
    { id: 13, axisId: 3, text_ar: "وجود آلية واضحة لتقييم أداء المجلس وأعضائه.", text_en: "Existence of a Clear Mechanism for Evaluating the Performance of the Board and its Members" },
    { id: 14, axisId: 3, text_ar: "فعالية اجتماعات المجلس (التحضير، جدول الأعمال، إدارة النقاش، محاضر الاجتماعات).", text_en: "Effectiveness of Board Meetings (Preparation, Agenda, Discussion Management, Minutes)" },
    { id: 15, axisId: 3, text_ar: "مستوى مشاركة ومساهمة الأعضاء في مداولات المجلس.", text_en: "Level of Member Participation and Contribution in Board Deliberations" },

    // Axis 4: الإدارة التنفيذية
    { id: 16, axisId: 4, text_ar: "وجود رئيس تنفيذي يتمتع بالصلاحيات الكافية.", text_en: "Presence of a CEO with Sufficient Authority" },
    { id: 17, axisId: 4, text_ar: "وضوح الفصل بين مهام رئيس المجلس والرئيس التنفيذي.", text_en: "Clear Separation of Duties between the Chairman and the CEO" },
    { id: 18, axisId: 4, text_ar: "وجود خطة تعاقب وظيفي واضحة للوظائف القيادية.", text_en: "Existence of a Clear Succession Plan for Leadership Positions" },
    { id: 19, axisId: 4, text_ar: "كفاءة آلية تقييم أداء الإدارة التنفيذية وربطها بالأهداف الاستراتيجية.", text_en: "Efficiency of the Performance Evaluation Mechanism for Executive Management and its Link to Strategic Goals" },
    { id: 20, axisId: 4, text_ar: "جودة وكفاية التقارير المقدمة من الإدارة التنفيذية للمجلس.", text_en: "Quality and Adequacy of Reports Submitted by Executive Management to the Board" },

    // Axis 5: إدارة المخاطر والامتثال
    { id: 21, axisId: 5, text_ar: "وجود إطار عمل متكامل لإدارة المخاطر بالشركة.", text_en: "Existence of an Integrated Risk Management Framework in the Company" },
    { id: 22, axisId: 5, text_ar: "تحديد وتقييم المخاطر الاستراتيجية والتشغيلية بشكل دوري.", text_en: "Regular Identification and Assessment of Strategic and Operational Risks" },
    { id: 23, axisId: 5, text_ar: "وجود سجل للمخاطر وخطة للتعامل معها.", text_en: "Existence of a Risk Register and a Plan to Address Risks" },
    { id: 24, axisId: 5, text_ar: "وجود وظيفة امتثال مستقلة وفعالة.", text_en: "Existence of an Independent and Effective Compliance Function" },
    { id: 25, axisId: 5, text_ar: "مدى الالتزام بالمتطلبات القانونية والتنظيمية.", text_en: "Extent of Compliance with Legal and Regulatory Requirements" },

    // Axis 6: التدقيق الداخلي
    { id: 26, axisId: 6, text_ar: "استقلالية وظيفة التدقيق الداخلي وحصولها على الموارد الكافية.", text_en: "Independence of the Internal Audit Function and its Access to Adequate Resources" },
    { id: 27, axisId: 6, text_ar: "وجود خطة تدقيق داخلي سنوية مبنية على تقييم المخاطر.", text_en: "Existence of an Annual Internal Audit Plan Based on Risk Assessment" },
    { id: 28, axisId: 6, text_ar: "جودة تنفيذ عمليات التدقيق الداخلي والتقارير الصادرة عنها.", text_en: "Quality of Internal Audit Execution and the Resulting Reports" },
    { id: 29, axisId: 6, text_ar: "متابعة تنفيذ توصيات التدقيق الداخلي والخارجي.", text_en: "Follow-up on the Implementation of Internal and External Audit Recommendations" },
    { id: 30, axisId: 6, text_ar: "فعالية قنوات التواصل بين التدقيق الداخلي ولجنة التدقيق والمجلس.", text_en: "Effectiveness of Communication Channels between Internal Audit, the Audit Committee, and the Board" },

    // Axis 7: حقوق المساهمين
    { id: 31, axisId: 7, text_ar: "وضوح سياسة توزيع الأرباح.", text_en: "Clarity of the Dividend Distribution Policy" },
    { id: 32, axisId: 7, text_ar: "عدالة وشفافية التعامل مع جميع المساهمين (جهاز الاستثمار العماني).", text_en: "Fair and Transparent Treatment of all Shareholders (Oman Investment Authority)" },
    { id: 33, axisId: 7, text_ar: "سهولة حصول المساهم على المعلومات الجوهرية.", text_en: "Ease of Access for Shareholders to Material Information" },
    { id: 34, axisId: 7, text_ar: "وجود آلية للتعامل مع المعاملات مع الأطراف ذات العلاقة.", text_en: "Existence of a Mechanism for Handling Related Party Transactions" },
    { id: 35, axisId: 7, text_ar: "حماية أصول الشركة وعدم استغلالها لتحقيق مصالح شخصية.", text_en: "Protection of Company Assets and Prevention of their Use for Personal Gain" },

    // Axis 8: الإفصاح والشفافية
    { id: 36, axisId: 8, text_ar: "جودة ودقة التقارير المالية وغير المالية السنوية.", text_en: "Quality and Accuracy of Annual Financial and Non-Financial Reports" },
    { id: 37, axisId: 8, text_ar: "الالتزام بالإفصاح عن المعلومات الجوهرية في الوقت المناسب.", text_en: "Commitment to Timely Disclosure of Material Information" },
    { id: 38, axisId: 8, text_ar: "شفافية الإفصاح عن مكافآت أعضاء مجلس الإدارة والإدارة التنفيذية.", text_en: "Transparency in Disclosing Remuneration of Board Members and Executive Management" },
    { id: 39, axisId: 8, text_ar: "وجود قناة تواصل فعالة مع جهاز الاستثمار العماني.", text_en: "Existence of an Effective Communication Channel with the Oman Investment Authority" },
    { id: 40, axisId: 8, text_ar: "استخدام الموقع الإلكتروني للشركة كأداة فعالة للإفصاح.", text_en: "Use of the Company's Website as an Effective Disclosure Tool" },

    // Axis 9: الاستدامة (ESG)
    { id: 41, axisId: 9, text_ar: "دمج اعتبارات الاستدامة (البيئية والاجتماعية والحوكمة) في استراتيجية الشركة.", text_en: "Integration of Sustainability Considerations (ESG) into the Company's Strategy" },
    { id: 42, axisId: 9, text_ar: "وجود تقرير استدامة سنوي وفق المعايير المعترف بها.", text_en: "Existence of an Annual Sustainability Report in Accordance with Recognized Standards" },
    { id: 43, axisId: 9, text_ar: "قياس وإدارة الأثر البيئي لعمليات الشركة.", text_en: "Measurement and Management of the Environmental Impact of the Company's Operations" },
    { id: 44, axisId: 9, text_ar: "تطبيق مبادرات وبرامج المسؤولية الاجتماعية.", text_en: "Implementation of Social Responsibility Initiatives and Programs" },
    { id: 45, axisId: 9, text_ar: "الالتزام بأخلاقيات العمل ومكافحة الفساد.", text_en: "Commitment to Business Ethics and Anti-Corruption" },

    // Axis 10: التحول الرقمي والابتكار
    { id: 46, axisId: 10, text_ar: "وجود استراتيجية واضحة للتحول الرقمي.", text_en: "Existence of a Clear Digital Transformation Strategy" },
    { id: 47, axisId: 10, text_ar: "تخصيص الموارد اللازمة (المالية والبشرية) لدعم التحول الرقمي.", text_en: "Allocation of Necessary Resources (Financial and Human) to Support Digital Transformation" },
    { id: 48, axisId: 10, text_ar: "مستوى أمن المعلومات والأمن السيبراني في الشركة.", text_en: "Level of Information Security and Cybersecurity in the Company" },
    { id: 49, axisId: 10, text_ar: "استخدام التكنولوجيا لتحسين كفاءة العمليات الداخلية وخدمة العملاء.", text_en: "Use of Technology to Improve Internal Process Efficiency and Customer Service" },
    { id: 50, axisId: 10, text_ar: "تبني ثقافة الابتكار وتشجيع المبادرات الجديدة.", text_en: "Adoption of an Innovation Culture and Encouragement of New Initiatives" }
];
