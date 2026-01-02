
export const translations = {
  ar: {
    appTitle: "مركز حوكمة جهاز الاستثمار",
    menu: {
      dashboard: "لوحة القيادة",
      registry: "سجل الشركات",
      assessment: "تقييم النضج",
      compliance: "مراقب الامتثال",
      improvement: "خطة التحسين",
      reports: "التقارير",
      settings: "الإعدادات",
      logout: "تسجيل الخروج"
    },
    dashboard: {
      strategicRadar: "الرادار الاستراتيجي",
      portfolioHealth: "صحة المحفظة",
      maturityGauge: "مقياس النضج",
      riskMap: "خارطة المخاطر",
      sectorPerf: "أداء القطاعات",
      omanization: "نسبة التعمين",
      compliance: "حالة الامتثال",
      urgentAlerts: "تنبيهات عاجلة",
      totalAssets: "إجمالي الأصول"
    },
    registry: {
      title: "سجل الشركات",
      addNew: "إضافة شركة جديدة",
      searchPlaceholder: "بحث باسم الشركة أو الكود...",
      riskLevel: "مستوى الخطورة",
      risks: {
        low: "منخفض",
        medium: "متوسط",
        high: "مرتفع",
      }
    },
    assessment: {
        title: "محاور التقييم",
        globalProgress: "التقدم الكلي",
        completed: "مكتمل",
        saveDraft: "حفظ مسودة",
        submitFinal: "اعتماد نهائي",
        indicator: "المؤشر",
        maturityLevel: "حدد مستوى النضج (1 = الأدنى, 5 = الأعلى)",
        evidenceRequired: "مطلوب إرفاق دليل",
        evidenceAttached: "الدليل مرفق",
        attachEvidence: "إرفاق دليل",
        changeEvidence: "تغيير الدليل",
        fileAttached: "ملف مرفق",
        incompleteTitle: "التقييم غير مكتمل",
        incompleteDesc: "يجب الإجابة على جميع المؤشرات قبل الاعتماد النهائي. المؤشرات المتبقية:",
        goTo: "اذهب للسؤال",
        gotIt: "حسناً، فهمت",
        successTitle: "تم الاعتماد بنجاح!",
        successDesc: "تم اعتماد التقييم بنجاح. يمكنك الآن مراجعة النتائج أو استكمال العمل.",
        viewResults: "عرض النتائج",
        stayHere: "البقاء هنا",
        locked: "التقييم معتمد ومغلق",
        nextCompliance: "التالي: مراقبة الامتثال والمخاطر"
    },
    compliance: {
        saveButton: "حفظ سجل الامتثال والمخاطر",
        statutoryTitle: "الامتثال النظامي والتشريعي",
        nonCompliant: "غير ممتثل",
        addRisk: "تسجيل خطر جديد",
        probability: "الاحتمالية",
        impact: "الأثر",
        questions: {
            auditor: "هل تم تعيين مدقق حسابات خارجي؟",
            quorum: "هل اكتمل نصاب اجتماعات المجلس (4 مرات سنوياً)؟",
            doa: "هل توجد لائحة صلاحيات مالية وإدارية معتمدة؟",
            conflict: "هل تم الإفصاح عن تعارض المصالح للأعضاء؟"
        },
        riskForm: {
            description: "وصف الخطر",
            category: "التصنيف",
            impact: "الأثر (1-5)",
            probability: "الاحتمالية (1-5)",
            mitigation: "خطة المعالجة"
        },
        riskCategories: {
            financial: "مالي",
            operational: "تشغيلي",
            strategic: "استراتيجي",
            cyber: "سيبراني"
        }
    },
    improvement: {
        addTask: "إضافة مهمة يدوية",
        filterPriority: "فلترة حسب الأولوية",
        filterAxis: "فلترة حسب المحور",
        allAxes: "كل المحاور",
        lanes: {
            todo: "مهام جديدة",
            inProgress: "جاري المعالجة",
            done: "تم الإنجاز"
        },
        priorities: {
            all: "الكل",
            critical: "حرجة",
            high: "عالية",
            medium: "متوسطة",
            low: "منخفضة"
        },
        linkedIndicator: "مرتبط بالمؤشر",
        start: "بدء",
        finish: "إنهاء",
        dueDate: "تاريخ الاستحقاق:",
        assignedTo: "مسند إلى:",
        description: "الوصف",
        placeholderDesc: "هذه المهمة لمعالجة فجوة حوكمية تم تحديدها أثناء تقييم النضج. الهدف الأساسي هو ضمان الامتثال وتحسين إطار الحوكمة.",
        relatedAxis: "المحور المرتبط",
        comments: "التعليقات",
        commentsPlaceholder: "مكان مخصص لتعليقات ومناقشات الفريق...",
    },
    reports: {
        title: "التقرير الاستراتيجي الشامل",
        year: "عام",
        export: "تصدير PDF",
        summary: {
            maturity: "النضج العام",
            maturitySub: "+0.2 عن العام الماضي",
            compliance: "معدل الامتثال",
            complianceSub: "4 عناصر غير ممتثلة",
            risks: "المخاطر النشطة",
            risksSub: "في المناطق الحرجة",
            actions: "إجراءات التحسين",
            pending: "معلقة",
            actionsSub: "8 مكتملة هذا العام"
        },
        maturityAnalysis: "تحليل نضج الحوكمة (الشركة مقابل القطاع)",
        companyScore: "คะแนน الشركة",
        sectorAverage: "متوسط القطاع",
        riskAnalysis: "تحليل المخاطر حسب الشدة",
        improvementStatus: "حالة خطة التحسين",
        actions: "إجراءات",
        topGaps: "أبرز الفجوات الاستراتيجية",
        criticalRisks: "المخاطر الحرجة المسجلة",
        developPolicy: "تطوير واعتماد السياسة",
        table: {
            indicator: "المؤشر",
            axis: "المحور",
            score: "التقييم",
            recommendation: "الإجراء الموصى به"
        }
    },
    settings: {
        title: "الإعدادات المتقدمة",
        subtitle: "إدارة متغيرات النظام والأوزان",
        profile: {
            title: "الملف الشخصي للمشرف",
            role: "المشرف العام ومهندس النظام",
            email: "البريد الإلكتروني",
            phone: "رقم الهاتف",
        },
        weights: {
            title: "أوزان محاور التقييم",
            financial: "وزن المحور المالي",
            leadership: "وزن محور القيادة",
            reset: "إعادة تعيين للأوزان الافتراضية"
        },
        info: {
            title: "معلومات النظام",
            version: "OIA GRC v2.0 (Elite Edition)",
            license: "مرخص حصرياً لجهاز الاستثمار العماني",
            credits: "صمم وهندس بواسطة د. عبدالرحمن"
        }
    },
    companyForm: {
        identity: {
            title: "البيانات الأساسية",
            companyName: "اسم الشركة",
            code: "الرمز",
            sector: "القطاع",
            legalForm: "الشكل القانوني",
        },
        financial: {
            title: "الموقف المالي",
            capital: "رأس المال المصرح به (ر.ع.)",
            yearEnd: "نهاية السنة المالية",
            roi: "آخر عائد على الاستثمار (%)",
            uso: "التزامات الخدمة الشاملة",
        },
        board: {
            title: "حوكمة المجلس",
            appointmentDate: "تاريخ تعيين المجلس",
            expiryDate: "تاريخ انتهاء الصلاحية",
            members: "عدد الأعضاء",
            independent: "الأعضاء المستقلون",
        },
        hr: {
            title: "رأس المال البشري",
            totalEmployees: "إجمالي الموظفين",
            omanis: "عدد العمانيين",
        }
    },
    common: {
      admin: "مدير النظام",
      company: "بوابة الشركة",
      switchLang: "English",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      usernamePlaceholder: "أدخل اسم المستخدم",
      passwordPlaceholder: "أدخل كلمة المرور",
      back: "العودة للسجل",
      edit: "تعديل",
      save: "حفظ التغييرات",
      selectPlaceholder: "اختر...",
      pickDate: "اختر تاريخ",
      cancel: "إلغاء",
      view: "عرض",
      editingFor: "جاري التعديل لـ",
      selectAllCompanies: "عرض كل الشركات",
      selectCompanyToStart: "اختر شركة للبدء",
      selectCompanyToStartDesc: "يرجى اختيار شركة من القائمة أعلاه لعرض أو تعديل بياناتها."
    }
  },
  en: {
    appTitle: "OIA Governance Center",
    menu: {
      dashboard: "Dashboard",
      registry: "Company Registry",
      assessment: "Maturity Assessment",
      compliance: "Compliance Monitor",
      improvement: "Improvement Plan",
      reports: "Reports",
      settings: "Settings",
      logout: "Logout"
    },
    dashboard: {
      strategicRadar: "Strategic Radar",
      portfolioHealth: "Portfolio Health",
      maturityGauge: "Maturity Gauge",
      riskMap: "Risk Map",
      sectorPerf: "Sector Performance",
      omanization: "Omanization Rate",
      compliance: "Compliance Status",
      urgentAlerts: "Urgent Alerts",
      totalAssets: "Total Assets"
    },
    registry: {
        title: "Company Registry",
        addNew: "Add New Company",
        searchPlaceholder: "Search by company name or code...",
        riskLevel: "Risk Level",
        risks: {
            low: "Low",
            medium: "Medium",
            high: "High",
        }
    },
    assessment: {
        title: "Assessment Axes",
        globalProgress: "Global Progress",
        completed: "Completed",
        saveDraft: "Save Draft",
        submitFinal: "Submit Final",
        indicator: "Indicator",
        maturityLevel: "Select maturity level (1 = Lowest, 5 = Highest):",
        evidenceRequired: "Evidence required",
        evidenceAttached: "Evidence attached",
        attachEvidence: "Attach Evidence",
        changeEvidence: "Change Evidence",
        fileAttached: "File attached",
        incompleteTitle: "Incomplete Assessment",
        incompleteDesc: "All indicators must be answered before final submission. Remaining indicators:",
        goTo: "Go to Question",
        gotIt: "Okay, I understand",
        successTitle: "Submitted Successfully!",
        successDesc: "Assessment submitted successfully. You can now review the results or continue your work.",
        viewResults: "View Results",
        stayHere: "Stay Here",
        locked: "Assessment Locked",
        nextCompliance: "Next: Compliance & Risk"
    },
    compliance: {
        saveButton: "Save Compliance & Risks",
        statutoryTitle: "Statutory Compliance",
        nonCompliant: "Non-Compliant",
        addRisk: "Add New Risk",
        probability: "Probability",
        impact: "Impact",
        questions: {
            auditor: "Has an external auditor been appointed?",
            quorum: "Has the board meeting quorum been met (4 times annually)?",
            doa: "Is there an approved Delegation of Authority policy?",
            conflict: "Have conflicts of interest been disclosed by members?"
        },
        riskForm: {
            description: "Risk Description",
            category: "Category",
            impact: "Impact (1-5)",
            probability: "Probability (1-5)",
            mitigation: "Mitigation Plan"
        },
        riskCategories: {
            financial: "Financial",
            operational: "Operational",
            strategic: "Strategic",
            cyber: "Cyber"
        }
    },
    improvement: {
        addTask: "Add Manual Task",
        filterPriority: "Filter by Priority",
        filterAxis: "Filter by Axis",
        allAxes: "All Axes",
        lanes: {
            todo: "Identified Gaps",
            inProgress: "In Remediation",
            done: "Resolved"
        },
        priorities: {
            all: "All",
            critical: "Critical",
            high: "High",
            medium: "Medium",
            low: "Low"
        },
        linkedIndicator: "Linked to Indicator",
        start: "Start",
        finish: "Finish",
        dueDate: "Due by:",
        assignedTo: "Assigned to:",
        description: "Description",
        placeholderDesc: "This task is to address a governance gap identified during the maturity assessment. The primary goal is to ensure compliance and improve the governance framework.",
        relatedAxis: "Related Axis",
        comments: "Comments",
        commentsPlaceholder: "Placeholder for team comments and discussion threads...",
    },
    reports: {
        title: "Comprehensive Strategic Report",
        year: "Year",
        export: "Export PDF",
        summary: {
            maturity: "Overall Maturity",
            maturitySub: "+0.2 from last year",
            compliance: "Compliance Rate",
            complianceSub: "4 non-compliant items",
            risks: "Active Risks",
            risksSub: "in critical zones",
            actions: "Improvement Actions",
            pending: "Pending",
            actionsSub: "8 Completed this year"
        },
        maturityAnalysis: "Governance Maturity Analysis (Company vs. Sector)",
        companyScore: "Company Score",
        sectorAverage: "Sector Average",
        riskAnalysis: "Risk Analysis by Severity",
        improvementStatus: "Improvement Plan Status",
        actions: "Actions",
        topGaps: "Top Strategic Gaps",
        criticalRisks: "Critical Risks Logged",
        developPolicy: "Develop and approve policy",
        table: {
            indicator: "Indicator",
            axis: "Axis",
            score: "Score",
            recommendation: "Recommended Action"
        }
    },
    settings: {
        title: "Advanced Settings",
        subtitle: "Manage system variables and weights",
        profile: {
            title: "Supervisor Profile",
            role: "General Supervisor & System Architect",
            email: "Email",
            phone: "Phone Number",
        },
        weights: {
            title: "Assessment Axes Weights",
            financial: "Financial Axis Weight",
            leadership: "Leadership Axis Weight",
            reset: "Reset to Default Weights"
        },
        info: {
            title: "System Information",
            version: "OIA GRC v2.0 (Elite Edition)",
            license: "Exclusively licensed for Oman Investment Authority",
            credits: "Designed & Architected by Dr. Abdulrahman"
        }
    },
    companyForm: {
        identity: {
            title: "Basic Identity",
            companyName: "Company Name",
            code: "Code",
            sector: "Sector",
            legalForm: "Legal Form",
        },
        financial: {
            title: "Financial Position",
            capital: "Authorized Capital (OMR)",
            yearEnd: "Financial Year End",
            roi: "Last ROI (%)",
            uso: "USO Obligations",
        },
        board: {
            title: "Board Governance",
            appointmentDate: "Board Appointment Date",
            expiryDate: "Expiry Date",
            members: "No. of Members",
            independent: "Independent Members",
        },
        hr: {
            title: "Human Capital",
            totalEmployees: "Total Employees",
            omanis: "No. of Omanis",
        }
    },
    common: {
      admin: "Admin Access",
      company: "Company Portal",
      switchLang: "عربي",
      username: "Username",
      password: "Password",
      login: "Login",
      usernamePlaceholder: "Enter your username",
      passwordPlaceholder: "Enter your password",
      back: "Back to Registry",
      edit: "Edit",
      save: "Save Changes",
      selectPlaceholder: "Select...",
      pickDate: "Pick a date",
      cancel: "Cancel",
      view: "View",
      editingFor: "Editing for",
      selectAllCompanies: "All Companies View",
      selectCompanyToStart: "Select a Company to Begin",
      selectCompanyToStartDesc: "Please select a company from the dropdown above to view or edit its data."
    }
  }
};

    