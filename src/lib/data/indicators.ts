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
    { id: 3, axisId: 1, text_ar: "فاعلية تطبيق سياسة تفويض السلطات في تسريع القرار.", text_en: "Effectiveness of Delegation of Authority Policy in decision making" },
    { id: 4, axisId: 1, text_ar: "مدى الالتزام بتطبيق لائحة عمل مجلس الإدارة.", text_en: "Commitment to applying Board of Directors' Bylaws" },
    { id: 5, axisId: 1, text_ar: "دورية تحديث السياسات الأساسية (مالية، موارد بشرية) لمواكبة المتغيرات.", text_en: "Periodicity of updating Core Policies to keep up with changes" },

    // Axis 2: هيكل الحوكمة
    { id: 6, axisId: 2, text_ar: "وضوح الهيكل التنظيمي للشركة وتناغمه مع الاستراتيجية.", text_en: "Clarity of Organizational Structure and alignment with Strategy" },
    // Re-numbered (was 9) -> Now 7
    { id: 7, axisId: 2, text_ar: "كفاءة ودور أمين سر المجلس في دعم الأعضاء.", text_en: "Competence and role of Board Secretary in supporting members" },
    // Re-numbered (was 10) -> Now 8
    { id: 8, axisId: 2, text_ar: "كفاءة آليات التواصل والتنسيق بين لجان المجلس والإدارة التنفيذية.", text_en: "Efficiency of Communication between Board Committees and Executive Management" },

    // Axis 3: مجلس الإدارة
    // Re-numbered (was 13) -> Now 9
    { id: 9, axisId: 3, text_ar: "أثر مخرجات تقييم المجلس على تحسين الأداء.", text_en: "Impact of Board Evaluation outcomes on performance improvement" },
    // Re-numbered (was 14) -> Now 10
    { id: 10, axisId: 3, text_ar: "جودة النقاشات في اجتماعات المجلس وعمق القرارات الاستراتيجية.", text_en: "Quality of discussions in Board meetings and depth of strategic decisions" },

    // Axis 4: الإدارة التنفيذية
    // Re-numbered (was 16) -> Now 11
    { id: 11, axisId: 4, text_ar: "مدى تمكين الرئيس التنفيذي من الصلاحيات اللازمة للتنفيذ.", text_en: "Extent of CEO empowerment with necessary execution authorities" },
    // Re-numbered (was 18) -> Now 12
    { id: 12, axisId: 4, text_ar: "واقعية وفاعلية خطة التعاقب الوظيفي للقيادات.", text_en: "Realism and effectiveness of Succession Plan for leaders" },
    // Re-numbered (was 19) -> Now 13
    { id: 13, axisId: 4, text_ar: "ارتباط تقييم الإدارة التنفيذية بمؤشرات الأداء المؤسسي (KPIs).", text_en: "Linkage of Executive Evaluation to Corporate KPIs" },
    // Re-numbered (was 20) -> Now 14
    { id: 14, axisId: 4, text_ar: "جودة ودقة التقارير المقدمة من الإدارة للمجلس لاتخاذ القرار.", text_en: "Quality and accuracy of Management Reports submitted to the Board" },

    // Axis 5: إدارة المخاطر والامتثال
    { id: 15, axisId: 5, text_ar: "نضج ثقافة إدارة المخاطر لدى الموظفين والقيادة.", text_en: "Maturity of Risk Management culture among employees and leadership" },
    { id: 16, axisId: 5, text_ar: "شمولية تقييم المخاطر الاستراتيجية والتشغيلية.", text_en: "Comprehensiveness of Strategic and Operational Risk Assessment" },
    { id: 17, axisId: 5, text_ar: "فاعلية خطط الاستجابة والتعامل مع المخاطر المرصودة.", text_en: "Effectiveness of Response Plans for identified risks" },
    { id: 18, axisId: 5, text_ar: "استقلالية وقوة وظيفة الامتثال في الشركة.", text_en: "Independence and strength of the Compliance function" },
    { id: 19, axisId: 5, text_ar: "سجل الشركة في الالتزام وعدم وجود مخالفات جسيمة.", text_en: "Company's track record in compliance and absence of major violations" },

    // Axis 6: التدقيق الداخلي
    { id: 20, axisId: 6, text_ar: "مستوى الحيادية والاستقلال للمدقق الداخلي.", text_en: "Level of impartiality and independence of Internal Auditor" },
    { id: 21, axisId: 6, text_ar: "تغطية خطة التدقيق للمناطق عالية الخطورة.", text_en: "Audit Plan coverage of high-risk areas" },
    { id: 22, axisId: 6, text_ar: "القيمة المضافة من تقارير التدقيق الداخلي في تحسين العمليات.", text_en: "Value added by Internal Audit reports in improving processes" },
    { id: 23, axisId: 6, text_ar: "سرعة وجدية الإدارة في إغلاق ملاحظات التدقيق.", text_en: "Speed and seriousness of Management in closing audit observations" },
    { id: 24, axisId: 6, text_ar: "فاعلية التواصل بين المدقق الداخلي ولجنة التدقيق.", text_en: "Effectiveness of communication between Internal Auditor and Audit Committee" },

    // Axis 7: حقوق المساهمين
    { id: 25, axisId: 7, text_ar: "وضوح واستقرار سياسة توزيع الأرباح.", text_en: "Clarity and stability of Dividend Distribution Policy" },
    { id: 26, axisId: 7, text_ar: "العدالة في التعامل مع جميع الأطراف المعنية.", text_en: "Fairness in dealing with all stakeholders" },
    { id: 27, axisId: 7, text_ar: "سهولة وسرعة الوصول للمعلومات الجوهرية.", text_en: "Ease and speed of access to material information" },
    { id: 28, axisId: 7, text_ar: "دقة ضبط التعاملات مع الأطراف ذات العلاقة (RPTs).", text_en: "Strict control over Related Party Transactions (RPTs)" },
    { id: 29, axisId: 7, text_ar: "كفاءة آليات حماية أصول الشركة.", text_en: "Efficiency of Company Asset Protection mechanisms" },

    // Axis 8: الإفصاح والشفافية
    { id: 30, axisId: 8, text_ar: "الشفافية في عرض التحديات وليس فقط الإنجازات.", text_en: "Transparency in presenting challenges, not just achievements" },
    { id: 31, axisId: 8, text_ar: "الالتزام بالتوقيتات الزمنية للإفصاحات الدورية.", text_en: "Adherence to timelines for periodic disclosures" },
    { id: 32, axisId: 8, text_ar: "وضوح تفاصيل مكافآت الإدارة العليا في التقرير السنوي.", text_en: "Clarity of Senior Management remuneration details in Annual Report" },
    { id: 33, axisId: 8, text_ar: "فاعلية التنسيق المستمر مع جهاز الاستثمار العماني.", text_en: "Effectiveness of continuous coordination with OIA" },
    { id: 34, axisId: 8, text_ar: "حداثة وشمولية المعلومات على الموقع الإلكتروني.", text_en: "Recency and comprehensiveness of information on the website" },

    // Axis 9: الاستدامة (ESG)
    { id: 35, axisId: 9, text_ar: "مدى دمج الاستدامة في صلب القرارات الاستثمارية.", text_en: "Integration of Sustainability into core investment decisions" },
    { id: 36, axisId: 9, text_ar: "فاعلية مبادرات تقليل البصمة الكربونية والأثر البيئي.", text_en: "Effectiveness of carbon footprint reduction initiatives" },
    { id: 37, axisId: 9, text_ar: "الأثر الاجتماعي الملموس لمبادرات المسؤولية الاجتماعية.", text_en: "Tangible social impact of CSR initiatives" },
    { id: 38, axisId: 9, text_ar: "قوة الممارسات الأخلاقية وثقافة مكافحة الفساد.", text_en: "Strength of ethical practices and anti-corruption culture" },

    // Axis 10: التحول الرقمي والابتكار
    { id: 39, axisId: 10, text_ar: "وضوح خارطة الطريق للتحول الرقمي.", text_en: "Clarity of Digital Transformation roadmap" },
    { id: 40, axisId: 10, text_ar: "كفاية الميزانية المرصودة للتقنية والابتكار.", text_en: "Adequacy of budget allocated for Tech and Innovation" },
    { id: 41, axisId: 10, text_ar: "نضج إجراءات الأمن السيبراني وحماية البيانات.", text_en: "Maturity of Cybersecurity and Data Protection procedures" },
    { id: 42, axisId: 10, text_ar: "استخدام البيانات (Data Analytics) في اتخاذ القرار.", text_en: "Use of Data Analytics in decision making" },
    { id: 43, axisId: 10, text_ar: "حجم العوائد أو التوفير الناتج عن مبادرات الابتكار.", text_en: "Volume of returns or savings resulting from Innovation initiatives" }
];