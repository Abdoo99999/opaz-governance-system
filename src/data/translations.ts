
export const translations = {
  ar: {
    appTitle: "البرنامج الالكتروني لقياس نضج الحوكمة",
    appSubtitle: "لشركات جهاز الاستثمار العماني",
    menu: {
      dashboard: "لوحة القيادة",
      registry: "سجل الشركات",
      assessment: "تقييم النضج",
      compliance: "الامتثال والمخاطر",
      improvement: "خطة التحسين",
      financials: "القوائم المالية",
      reports: "التقارير",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      review: "المراجعة والإرسال",
      approvals: "طلبات الاعتماد"
    },
    dashboard: {
      strategicRadar: "رادار الأداء الاستراتيجي",
      portfolioHealth: "صحة المحفظة",
      maturityGauge: "مقياس النضج العام",
      riskMap: "خارطة المخاطر",
      sectorPerf: "أداء القطاعات",
      omanization: "نسبة التعمين",
      compliance: "حالة الامتثال",
      urgentAlerts: "تنبيهات عاجلة",
      totalAssets: "إجمالي الأصول",
      nationalWorkforce: "من إجمالي القوى العاملة",
      activeRisks: "مخاطر نشطة مسجلة",
      overallScore: "متوسط نتيجة التقييم",
      complianceRisk: "الامتثال والمخاطر",
      maturityPath: "مسار النضج الاستراتيجي",
      maturityScore: "مستوى النضج",
      compliant: "ممتثل",
      nonCompliant: "غير ممتثل",
      financial: {
        hubTitle: "محور الأداء المالي",
        netProfit: "صافي الأرباح",
        equity: "حقوق الملكية",
        freeCashFlow: "التدفق النقدي الحر",
        roi: "العائد على الاستثمار"
      },
      riskLabels: {
          impact: {
            minimal: 'ضئيل',
            minor: 'بسيط',
            moderate: 'متوسط',
            major: 'كبير',
            catastrophic: 'كارثي'
          },
          probability: {
            rare: 'نادر',
            unlikely: 'غير محتمل',
            possible: 'ممكن',
            likely: 'محتمل',
            certain: 'مؤكد'
          }
      }
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
        critical: "حرج"
      }
    },
    assessment: {
        title: "محاور التقييم",
        globalProgress: "التقدم الكلي",
        completed: "مكتمل",
        saveDraft: "حفظ التقييم",
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
        successDesc: "تم حفظ واعتماد التقييم بنجاح.",
        saveSuccessDesc: "تم حفظ بيانات تقييم شركة",
        viewResults: "عرض النتائج",
        stayHere: "البقاء هنا",
        locked: "التقييم معتمد ومغلق",
        nextCompliance: "التالي: مراقبة الامتثال والمخاطر",
        addIndicator: "إضافة مؤشر جديد",
        editIndicator: "تعديل المؤشر",
        indicatorTextAr: "نص المؤشر (بالعربية)",
        indicatorTextEn: "نص المؤشر (بالانجليزية)",
        axis: "المحور",
        indicatorAdded: "تمت إضافة المؤشر بنجاح.",
        indicatorUpdated: "تم تحديث المؤشر بنجاح.",
        indicatorDeleted: "تم حذف المؤشر.",
        deleteIndicatorTitle: "هل أنت متأكد؟",
        deleteIndicatorDesc: "سيتم حذف هذا المؤشر بشكل نهائي. لا يمكن التراجع عن هذا الإجراء."
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
            cyber: "سيبراني",
            rare: "نادر",
            likely: "محتمل",
            certain: "مؤكد"
        }
    },
    improvement: {
        addTask: "إضافة مهمة يدوية",
        filterPriority: "فلترة حسب الأولوية",
        filterAxis: "فلترة حسب المحور",
        allAxes: "كل المحاور",
        lanes: {
            todo: "مهام جديدة",
            inProgress: "قيد التنفيذ",
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
        start: "بدء المهمة",
        finish: "إنهاء المهمة",
        return: "إرجاع",
        reopen: "إعادة فتح",
        dueDate: "تاريخ الاستحقاق:",
        assignedTo: "مسند إلى:",
        description: "الوصف",
        placeholderDesc: "هذه المهمة لمعالجة فجوة حوكمية تم تحديدها أثناء تقييم النضج. الهدف الأساسي هو ضمان الامتثال وتحسين إطار الحوكمة.",
        relatedAxis: "المحور المرتبط",
        comments: "التعليقات",
        commentsPlaceholder: "مكان مخصص لتعليقات ومناقشات الفريق...",
        saveSuccessDesc: "تم حفظ بيانات خطة التحسين لشركة",
        completeTaskTitle: "إنهاء المهمة وتقديم الدليل",
        completeTaskDesc: "يرجى تقديم ملاحظات حول كيفية إنجاز المهمة وإرفاق دليل الإنجاز.",
        completionNotes: "ملاحظات الإنجاز",
        completionNotesPlaceholder: "مثال: تم عقد اجتماع مجلس الإدارة وتحديث السياسة...",
        attachEvidence: "إرفاق الدليل",
        attachEvidenceHint: "اسحب وأفلت ملفًا هنا، أو انقر للاختيار",
        completeError: "يرجى كتابة الملاحظات وإرفاق ملف الدليل.",
        taskCompleted: "تم إنجاز المهمة بنجاح!",
        attachedEvidence: "الدليل المرفق"
    },
    financials: {
      title: "القوائم المالية والحوكمة",
      auditorPlaceholder: "اسم مكتب التدقيق الخارجي...",
      saveSuccessDesc: "تم حفظ البيانات المالية لشركة",
      position: {
        title: "المركز المالي",
        assets: "إجمالي الأصول",
        liabilities: "إجمالي الالتزامات",
        equity: "حقوق الملكية"
      },
      performance: {
        title: "الأداء المالي",
        revenue: "الإيرادات",
        expenses: "المصروفات",
        netProfit: "صافي الربح/الخسارة"
      },
      cashflow: {
        title: "السيولة والتدفق النقدي الحر",
        operating: "النقد التشغيلي",
        capex: "الإنفاق الرأسمالي (CAPEX)",
        fcf: "التدفق النقدي الحر (FCF)",
        fcfPositive: "متاح للتوزيعات/سداد الديون",
        fcfNegative: "إحتراق نقدي"
      },
      kpi: {
        title: "مؤشرات الأداء",
        dividends: "توزيعات الأرباح المعلنة",
        roi: "العائد على الاستثمار (ROI)"
      },
      declaration: {
        title: "المرفقات والإقرار",
        uploadDesc: "قم بسحب وإفلات تقرير المدقق المالي (PDF) هنا، أو اضغط للاختيار",
        uploadHint: "حجم الملف الأقصى: 10MB",
        checkbox: "أقر بصحة البيانات المالية المقدمة",
        saveButton: "حفظ البيانات المالية"
      }
    },
    reports: {
        title: "التقرير الاستراتيجي الشامل",
        selectCompanyToView: "يرجى اختيار شركة لعرض تقريرها التفصيلي.",
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
        companyScore: "نتيجة الشركة",
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
        },
        riskLevels: {
          low: "منخفض",
          medium: "متوسط",
          high: "مرتفع",
          extreme: "حرج"
        },
        improvement: {
          completed: "تم الإنجاز",
          inProgress: "قيد التنفيذ",
          notStarted: "قيد الانتظار"
        },
        financial: {
            title: "ملخص الأداء المالي",
            performance: "الأداء",
            revenue: "الإيرادات",
            expenses: "المصروفات",
            netProfit: "صافي الربح"
        }
    },
    settings: {
        title: "الإعدادات المتقدمة",
        subtitle: "إدارة متغيرات النظام والبيانات",
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
            credits: "صمم وهندس بواسطة د. عبدالرحمن النوفلي"
        },
        data: {
            title: "إدارة البيانات",
            description: "سيؤدي هذا الإجراء إلى حذف جميع البيانات المدخلة في التطبيق بشكل نهائي، بما في ذلك بيانات الشركات والتقييمات والمخاطر وخطط التحسين. استخدم هذا الخيار بحذر شديد.",
            resetButton: "إعادة ضبط بيانات التطبيق",
            confirmTitle: "هل أنت متأكد؟",
            confirmDesc: "سيتم حذف جميع البيانات بشكل نهائي ولا يمكن التراجع عن هذا الإجراء. هل ترغب في المتابعة؟",
            confirmButton: "نعم، قم بإعادة الضبط",
            resetSuccessTitle: "تمت إعادة الضبط بنجاح",
            resetSuccessDesc: "تم مسح جميع بيانات التطبيق. سيتم إعادة تحميل الصفحة الآن."
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
    approvals: {
      title: "طلبات الاعتماد",
      companyName: "اسم الشركة",
      submissionDate: "تاريخ الإرسال",
      maturityScore: "نتيجة النضج",
      actions: "الإجراءات",
      view: "معاينة",
      return: "إعادة للتعديل",
      approve: "اعتماد نهائي",
      returnModalTitle: "إعادة التقييم للمراجعة",
      returnModalDesc: "يرجى كتابة الملاحظات المطلوبة من الشركة قبل إعادة الإرسال.",
      notesPlaceholder: "مثال: يرجى استكمال بيانات التدقيق الداخلي...",
      sendFeedback: "إرسال الملاحظات",
      approveConfirmTitle: "هل أنت متأكد؟",
      approveConfirmDesc: "سيتم اعتماد التقييم بشكل نهائي وإصدار الشهادة. لا يمكن التراجع عن هذا الإجراء.",
      status: {
        draft: "مسودة",
        submitted: "قيد المراجعة",
        returned: "مُعاد للتعديل",
        approved: "معتمد"
      }
    },
    review: {
      title: "المراجعة النهائية والإرسال",
      subtitle: "يرجى التأكد من اكتمال جميع الأقسام قبل إرسال التقييم إلى جهاز الاستثمار العماني للمراجعة النهائية.",
      checklistTitle: "قائمة التحقق من الاكتمال",
      profile: "الملف التعريفي للشركة",
      assessment: "تقييم نضج الحوكمة",
      compliance: "الامتثال والمخاطر",
      status: {
        complete: "مكتمل",
        incomplete: "غير مكتمل"
      },
      view: "مراجعة",
      submitButton: "إرسال إلى جهاز الاستثمار",
      submittedTitle: "تم الإرسال بنجاح",
      submittedDesc: "تم إرسال تقييم شركتكم بنجاح. سيتم إشعاركم عند اكتمال المراجعة من قبل فريق الحوكمة في جهاز الاستثمار العماني.",
      underReview: "التقييم قيد المراجعة حالياً من قبل جهاز الاستثمار. لا يمكن إجراء تعديلات في هذه المرحلة.",
      returned: "تمت إعادة التقييم من قبل جهاز الاستثمار مع الملاحظات التالية:",
      viewNotes: "عرض الملاحظات"
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
      delete: "حذف",
      view: "عرض",
      editingFor: "جاري التعديل لـ",
      selectAllCompanies: "عرض كل الشركات",
      selectCompanyToStart: "اختر شركة للبدء",
      selectCompanyToStartDesc: "يرجى اختيار شركة من القائمة أعلاه لعرض أو تعديل بياناتها.",
      saveSuccessTitle: "تم الحفظ بنجاح",
      saveSuccessDesc: "تم حفظ بيانات الشركة:",
      deleteConfirm: "هل أنت متأكد من رغبتك في حذف هذه الشركة؟ لا يمكن التراجع عن هذا الإجراء.",
      deleteSuccessTitle: "تم الحذف بنجاح",
      errorTitle: "خطأ",
      fillAllFields: "يرجى تعبئة جميع الحقول المطلوبة.",
      loading: "جاري التصدير..."
    }
  },
  en: {
    appTitle: "Electronic Program for Governance Maturity Measurement",
    appSubtitle: "for OIA Companies",
    menu: {
      dashboard: "Dashboard",
      registry: "Company Registry",
      assessment: "Maturity Assessment",
      compliance: "Compliance & Risk",
      improvement: "Improvement Plan",
      financials: "Financial Statements",
      reports: "Reports",
      settings: "Settings",
      logout: "Logout",
      review: "Review & Submit",
      approvals: "Approval Requests"
    },
    dashboard: {
      strategicRadar: "Strategic Performance Radar",
      portfolioHealth: "Portfolio Health",
      maturityGauge: "Overall Maturity Gauge",
      riskMap: "Risk Map",
      sectorPerf: "Sector Performance",
      omanization: "Omanization Rate",
      compliance: "Compliance Status",
      urgentAlerts: "Urgent Alerts",
      totalAssets: "Total Assets",
      nationalWorkforce: "of total workforce",
      activeRisks: "Active risks logged",
      overallScore: "Overall assessment score",
      complianceRisk: "Compliance & Risk",
      maturityPath: "Strategic Maturity Path",
      maturityScore: "Maturity Score",
      compliant: "Compliant",
      nonCompliant: "Non-Compliant",
      financial: {
        hubTitle: "Financial Position Hub",
        netProfit: "Net Profit",
        equity: "Equity",
        freeCashFlow: "Free Cash Flow",
        roi: "Return on Investment"
      },
      riskLabels: {
          impact: {
            minimal: 'Minimal',
            minor: 'Minor',
            moderate: 'Moderate',
            major: 'Major',
            catastrophic: 'Catastrophic'
          },
          probability: {
            rare: 'Rare',
            unlikely: 'Unlikely',
            possible: 'Possible',
            likely: 'Likely',
            certain: 'Certain'
          }
      }
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
            critical: "Critical"
        }
    },
    assessment: {
        title: "Assessment Axes",
        globalProgress: "Global Progress",
        completed: "Completed",
        saveDraft: "Save Assessment",
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
        successDesc: "Assessment has been saved and submitted successfully.",
        saveSuccessDesc: "Assessment data saved for",
        viewResults: "View Results",
        stayHere: "Stay Here",
        locked: "Assessment Locked",
        nextCompliance: "Next: Compliance & Risk",
        addIndicator: "Add New Indicator",
        editIndicator: "Edit Indicator",
        indicatorTextAr: "Indicator Text (Arabic)",
        indicatorTextEn: "Indicator Text (English)",
        axis: "Axis",
        indicatorAdded: "Indicator added successfully.",
        indicatorUpdated: "Indicator updated successfully.",
        indicatorDeleted: "Indicator deleted.",
        deleteIndicatorTitle: "Are you sure?",
        deleteIndicatorDesc: "This will permanently delete the indicator. This action cannot be undone."
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
            cyber: "Cyber",
            rare: "Rare",
            likely: "Likely",
            certain: "Certain"
        }
    },
    improvement: {
        addTask: "Add Manual Task",
        filterPriority: "Filter by Priority",
        filterAxis: "Filter by Axis",
        allAxes: "All Axes",
        lanes: {
            todo: "Identified Gaps",
            inProgress: "In Progress",
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
        start: "Start Task",
        finish: "Complete Task",
        return: "Return",
        reopen: "Re-open",
        dueDate: "Due by:",
        assignedTo: "Assigned to:",
        description: "Description",
        placeholderDesc: "This task is to address a governance gap identified during the maturity assessment. The primary goal is to ensure compliance and improve the governance framework.",
        relatedAxis: "Related Axis",
        comments: "Comments",
        commentsPlaceholder: "Placeholder for team comments and discussion threads...",
        saveSuccessDesc: "Improvement plan data saved for",
        completeTaskTitle: "Complete Task & Submit Evidence",
        completeTaskDesc: "Please provide notes on how the task was completed and attach the evidence of completion.",
        completionNotes: "Completion Notes",
        completionNotesPlaceholder: "e.g., The board meeting was held and the policy was updated...",
        attachEvidence: "Attach Evidence",
        attachEvidenceHint: "Drag & drop a file here, or click to select",
        completeError: "Please provide completion notes and attach an evidence file.",
        taskCompleted: "Task completed successfully!",
        attachedEvidence: "Attached Evidence"
    },
    financials: {
      title: "Financial Statements & Governance",
      auditorPlaceholder: "External Auditor's Office Name...",
      saveSuccessDesc: "Financial data has been saved for",
      position: {
        title: "Financial Position",
        assets: "Total Assets",
        liabilities: "Total Liabilities",
        equity: "Equity"
      },
      performance: {
        title: "Financial Performance",
        revenue: "Revenue",
        expenses: "Expenses",
        netProfit: "Net Profit/Loss"
      },
      cashflow: {
        title: "Liquidity & Free Cash Flow",
        operating: "Operating Cash",
        capex: "Capital Expenditure (CAPEX)",
        fcf: "Free Cash Flow (FCF)",
        fcfPositive: "Available for distribution/debt repayment",
        fcfNegative: "Cash Burn"
      },
      kpi: {
        title: "Performance Indicators",
        dividends: "Declared Dividends",
        roi: "Return on Investment (ROI)"
      },
      declaration: {
        title: "Attachments & Declaration",
        uploadDesc: "Drag and drop the financial auditor's report (PDF) here, or click to select",
        uploadHint: "Maximum file size: 10MB",
        checkbox: "I hereby declare the provided financial data is accurate",
        saveButton: "Save Financial Data"
      }
    },
    reports: {
        title: "Comprehensive Strategic Report",
        selectCompanyToView: "Please select a company to view its detailed report.",
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
        },
        riskLevels: {
            low: "Low",
            medium: "Medium",
            high: "High",
            extreme: "Extreme"
        },
        improvement: {
          completed: "Completed",
          inProgress: "In Progress",
          notStarted: "Not Started"
        },
        financial: {
            title: "Financial Performance Snapshot",
            performance: "Performance",
            revenue: "Revenue",
            expenses: "Expenses",
            netProfit: "Net Profit"
        }
    },
    settings: {
        title: "Advanced Settings",
        subtitle: "Manage system variables and data",
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
            credits: "Designed & Architected by Dr. Abdulrahman Al-Nofali"
        },
        data: {
            title: "Data Management",
            description: "This action will permanently delete all data entered into the application, including company data, assessments, risks, and improvement plans. Use this option with extreme caution.",
            resetButton: "Reset Application Data",
            confirmTitle: "Are you sure?",
            confirmDesc: "All data will be permanently deleted. This action cannot be undone. Do you wish to proceed?",
            confirmButton: "Yes, Reset Data",
            resetSuccessTitle: "Reset Successful",
            resetSuccessDesc: "All application data has been cleared. The page will now reload."
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
    approvals: {
      title: "Approval Requests",
      companyName: "Company Name",
      submissionDate: "Submission Date",
      maturityScore: "Maturity Score",
      actions: "Actions",
      view: "View",
      return: "Return for Edits",
      approve: "Final Approve",
      returnModalTitle: "Return Assessment for Review",
      returnModalDesc: "Please provide the required feedback for the company before they resubmit.",
      notesPlaceholder: "e.g., Please complete the internal audit section...",
      sendFeedback: "Send Feedback",
      approveConfirmTitle: "Are you sure?",
      approveConfirmDesc: "The assessment will be finally approved and the certificate will be issued. This action cannot be undone.",
      status: {
        draft: "Draft",
        submitted: "Submitted",
        returned: "Returned",
        approved: "Approved"
      }
    },
    review: {
      title: "Final Review and Submission",
      subtitle: "Please ensure all sections are complete before sending the assessment to OIA for final review.",
      checklistTitle: "Completion Checklist",
      profile: "Company Profile Data",
      assessment: "Governance Maturity Assessment",
      compliance: "Compliance & Risk Registry",
      status: {
        complete: "Complete",
        incomplete: "Incomplete"
      },
      view: "Review",
      submitButton: "Send to OIA",
      submittedTitle: "Successfully Submitted",
      submittedDesc: "Your company's assessment has been sent successfully. You will be notified once the review by OIA's governance team is complete.",
      underReview: "The assessment is currently under review by OIA. No edits can be made at this stage.",
      returned: "The assessment has been returned by OIA with the following feedback:",
      viewNotes: "View Notes"
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
      delete: "Delete",
      view: "View",
      editingFor: "Editing for",
      selectAllCompanies: "All Companies View",
      selectCompanyToStart: "Select a Company to Begin",
      selectCompanyToStartDesc: "Please select a company from the dropdown above to view or edit its data.",
      saveSuccessTitle: "Saved Successfully",
      saveSuccessDesc: "Company data has been saved for:",
      deleteConfirm: "Are you sure you want to delete this company? This action cannot be undone.",
      deleteSuccessTitle: "Deleted Successfully",
      errorTitle: "Error",
      fillAllFields: "Please fill all required fields.",
      loading: "Exporting..."
    }
  }
};
