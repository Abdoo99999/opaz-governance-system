
export const translations = {
  ar: {
    appTitle: "منظومة إتقان",
    appSubtitle: "لإدارة المناطق الاقتصادية الخاصة والمناطق الحرة",
    menu: {
      dashboard: "لوحة القيادة",
      registry: "سجل المناطق والمدن",
      company_profile: "بيانات المنطقة",
      board_directory: "سجل القيادات التنفيذية",
      board_evaluation: "مؤشرات القيادة",
      assessment: "تقييم الأداء المؤسسي",
      compliance: "الامتثال والمخاطر",
      improvement: "خطة التحسين",
      financials: "المؤشرات الاقتصادية",
      reports: "التقارير",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      review: "المراجعة والإرسال",
      approvals: "طلبات الموافقة"
    },
    dashboard: {
      strategicRadar: "رادار الأداء الاستراتيجي",
      portfolioHealth: "إجمالي حجم الاستثمار",
      maturityGauge: "مقياس النضج العام",
      riskMap: "خارطة المخاطر",
      sectorPerf: "أداء القطاعات",
      omanization: "نسبة التعمين",
      compliance: "حالة الامتثال",
      urgentAlerts: "تنبيهات عاجلة",
      totalAssets: "إجمالي الاستثمارات (مليون ر.ع)",
      nationalWorkforce: "من إجمالي القوى العاملة",
      activeRisks: "مخاطر نشطة مسجلة",
      overallScore: "متوسط نتيجة التقييم",
      complianceRisk: "الامتثال والمخاطر",
      maturityPath: "مسار النضج الاستراتيجي",
      maturityScore: "مستوى النضج",
      compliant: "ممتثل",
      nonCompliant: "غير ممتثل",
      improvementStatus: {
        title: "موقف خطة التحسين"
      },
      boardComposition: {
        title: "تحليل القيادات التنفيذية",
        independence: "استقلالية القيادة",
        independent: "أعضاء مستقلون",
        nonIndependent: "أعضاء غير مستقلين",
        omanization: "التعمين في المناصب"
      },
      icv: {
          title: "المناقصات والإنفاق المحلي",
          totalTenders: "الإجمالي",
          omanizationRate: "نسبة التعمين",
          smeSpending: "المؤسسات الصغيرة (SMEs)",
          localSpending: "الشركات المحلية",
          spending: "قيمة المناقصات",
          actualSpending: "الإنفاق الفعلي",
          target: "المستهدف"
      },
      financial: {
        hubTitle: "محور الأداء المالي",
        netProfit: "عدد الاتفاقيات الموقعة",
        equity: "المساحة المشغولة (كم²)",
        freeCashFlow: "المساحة المشغولة (كم²)",
        roi: "نسبة التعمين"
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
      },
      top5: {
        title: "أفضل 5 مناطق أداءً"
      }
    },
    registry: {
      title: "سجل المناطق والمدن",
      addNew: "إضافة منطقة جديدة",
      searchPlaceholder: "بحث باسم المنطقة أو الكود...",
      riskLevel: "مستوى الخطورة",
      risks: {
        low: "منخفض",
        medium: "متوسط",
        high: "مرتفع",
        critical: "حرج"
      }
    },
    board_directory: {
      title: "سجل القيادات التنفيذية",
      subtitle: "عرض بيانات القيادات التنفيذية ومؤشرات الأداء",
      addMember: "إضافة مسؤول جديد",
      saveSuccessDesc: "تم حفظ بيانات سجل القيادات بنجاح.",
      skillsMatrix: "مصفوفة المهارات والخبرات",
      boardTenure: "الدورة الحالية للقيادة",
      currentTerm: "الدورة الحالية",
      noData: "لا توجد بيانات لعرضها",
      membersCount: "عدد المسؤولين",
      memberType: "الدور التنفيذي",
      expertise_label: "الخبرة الأساسية",
      committees: "عضوية اللجان",
      noCommittees: "لا يوجد",
      expiresSoon: "تنتهي العضوية قريباً",
      summary: {
        total_members: "إجمالي القيادات",
        independent_members: "الأعضاء المستقلون",
        of_board: "من القيادة",
        expiring_soon: "عضويات تنتهي قريباً",
        within_3_months: "خلال 3 أشهر",
        total_committees: "لجنة عاملة"
      },
      tabs: {
        members: "القيادات والمهارات",
        minutes: "الاجتماعات والمحاضر"
      },
      minutes: {
        title: "مستودع محاضر الاجتماعات",
        upload: "رفع محضر جديد",
        date: "تاريخ الاجتماع",
        meetingTitle: "عنوان الاجتماع/المحضر",
        type: "نوع الاجتماع",
        attendees: "عدد الحاضرين",
        actions: "إجراءات",
        noMinutes: "لا توجد محاضر محفوظة لهذه المنطقة.",
        minuteAdded: "تمت إضافة المحضر بنجاح.",
        types: {
            quarterly: "دوري",
            emergency: "طارئ",
            committee: "لجنة"
        }
      },
      roles: {
        ceo: "الرئيس التنفيذي",
        coo: "الرئيس التنفيذي للعمليات",
        cfo: "المدير المالي",
        'vp_operations': "نائب الرئيس للعمليات",
        'vp_of_business_development': "نائب الرئيس لتطوير الأعمال",
        'investment_director': "مدير الاستثمار"
      },
      types: { 
        independent: "مستقل",
        government: "ممثل حكومي",
        executive: "تنفيذي"
      },
      expertise: {
        'smart_city_development': "تطوير المدن الذكية",
        'logistics': "اللوجستيات",
        'fdi_attraction': "جذب الاستثمار الأجنبي",
        'industrial_management': "الإدارة الصناعية",
        'urban_planning': "التخطيط العمراني"
      },
      committee_names: {
        audit: "التدقيق",
        risk: "المخاطر",
        hr: "الموارد البشرية",
        nomination: "الترشيحات والمكافآت"
      },
      form: {
        title_add: 'إضافة مسؤول جديد',
        title_edit: 'تعديل بيانات المسؤول',
        name_ar: 'الاسم بالعربية',
        name_en: 'الاسم بالإنجليزية',
        nationality: 'الجنسية',
        role: 'الدور التنفيذي',
        appointmentDate: 'تاريخ التعيين',
        expiryDate: 'تاريخ انتهاء الصلاحية',
        cycleSettings: 'إعدادات الدورة',
        termStartDate: 'تاريخ بدء الدورة',
        termEndDate: 'تاريخ انتهاء الدورة',
        qualification: 'المؤهل العلمي',
      },
      qualifications: {
        bachelor: 'بكالوريوس',
        master: 'ماجستير',
        phd: 'دكتوراه'
      }
    },
    board_evaluation: {
        title: "مؤشرات أداء القيادات",
        cycle: "دورة التقييم",
        memberInfo: "المسؤول التنفيذي",
        projectsCompletion: "نسبة إنجاز المشاريع",
        investmentTargets: "تحقيق مستهدفات الاستثمار",
        operationalExcellence: "التميز التشغيلي",
        totalScore: "النتيجة النهائية",
        recommendation: "التوصية",
        renew: "تجديد العضوية",
        review: "إعادة نظر",
        goodStanding: "وضع جيد",
        save: "حفظ التقييم",
        export: "تصدير التقرير",
        saveSuccessDesc: "تم حفظ بيانات مؤشرات القيادة بنجاح.",
        summary: {
            avgScore: "متوسط أداء القيادة",
            topPerformer: "المسؤول الأعلى أداءً",
            reviewRequired: "مسؤولون للمراجعة"
        },
        notes: {
            title: "ملاحظات التقييم",
            placeholder: "أضف ملاحظات أو مبررات للتقييم...",
            saved: "تم حفظ الملاحظات."
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
        saveSuccessDesc: "تم حفظ بيانات تقييم منطقة",
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
            conflict: "هل تم الإفصاح عن تعارض المصالح للأعضاء؟",
            legalStatus: "هل السجل التجاري والشهادات الضريبية سارية المفعول؟",
            dividends: "هل تم تحويل أرباح جهاز الاستثمار في الموعد المحدد؟",
            agmApproval: "هل تم اعتماد القوائم المالية من الجمعية العامة السنوية؟",
            reporting: "هل تم نشر التقرير السنوي المدقق للجمهور؟",
            legalIssues: "هل تخلو المنطقة من قضايا قانونية جوهرية غير مفصح عنها؟",
            minutesArchiving: "هل جميع محاضر اجتماعات المجلس واللجان موقعة ومؤرشفة؟"
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
        saveSuccessDesc: "تم حفظ بيانات خطة التحسين لمنطقة",
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
      title: "المؤشرات الاقتصادية",
      auditorPlaceholder: "اسم مكتب التدقيق الخارجي...",
      saveSuccessDesc: "تم حفظ المؤشرات الاقتصادية لمنطقة",
      position: {
        title: "حجم الاستثمار",
        assets: "إجمالي الأصول والاستثمارات",
        liabilities: "إجمالي الالتزامات",
        equity: "صافي قيمة الأصول"
      },
      performance: {
        title: "الأداء التشغيلي",
        revenue: "الإيرادات التشغيلية",
        expenses: "المصروفات التشغيلية",
        netProfit: "صافي الدخل"
      },
      cashflow: {
        title: "السيولة والتدفق النقدي",
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
        checkbox: "أقر بصحة البيانات المقدمة",
        saveButton: "حفظ المؤشرات الاقتصادية"
      }
    },
    reports: {
        title: "التقرير الاستراتيجي الشامل",
        selectCompanyToView: "يرجى اختيار منطقة لعرض تقريرها التفصيلي.",
        year: "عام",
        export: "تصدير PDF",
        boardAndIcvAnalysis: "تحليل القيادة والقيمة المحلية",
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
        maturityAnalysis: "تحليل نضج الحوكمة (المنطقة مقابل المتوسط)",
        companyScore: "نتيجة المنطقة",
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
          critical: "حرج"
        },
        improvement: {
          completed: "تم الإنجاز",
          inProgress: "قيد التنفيذ",
          notStarted: "قيد الانتظار"
        },
        financial: {
            title: "ملخص الأداء الاقتصادي",
            performance: "الأداء",
            revenue: "الإيرادات",
            expenses: "المصروفات",
            netProfit: "صافي الدخل"
        }
    },
    settings: {
      title: "الإعدادات",
      subtitle: "إدارة متغيرات النظام والبيانات",
      profile: {
          title: "الملف الشخصي للمشرف",
          role: "المشرف العام ومهندس النظام",
          email: "البريد الإلكتروني",
          phone: "رقم الهاتف",
      },
      preferences: {
          title: "تفضيلات النظام",
          language: "اللغة",
          theme: "المظهر",
          notifications: "الإشعارات"
      },
      info: {
          title: "معلومات النظام",
          version: "OPAZ GRC v1.0 (Foundation)",
          license: "مرخص حصرياً للهيئة العامة للمناطق الاقتصادية الخاصة والمناطق الحرة",
          credits: "صمم وهندس بواسطة د. عبدالرحمن النوفلي"
      },
      data: {
          title: "إدارة البيانات",
          description: "سيؤدي هذا الإجراء إلى حذف جميع البيانات المدخلة في التطبيق بشكل نهائي، بما في ذلك بيانات المناطق والتقييمات والمخاطر وخطط التحسين. استخدم هذا الخيار بحذر شديد.",
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
            companyName: "اسم المنطقة/المدينة",
            code: "الرمز",
            sector: "القطاع", // Fallback
            legalForm: "الشكل القانوني", // Fallback, to be replaced
            zoneType: "نوع المنطقة"
        },
        financial: {
            title: "المؤشرات الرئيسية",
            capital: "رأس المال المصرح به (ر.ع.)", // Fallback
            yearEnd: "نهاية السنة المالية", // Fallback
            roi: "آخر عائد على الاستثمار (%)",
            uso: "التزامات الخدمة الشاملة",
            totalArea: "المساحة الإجمالية (كم²)",
            developedArea: "المساحة المطورة (كم²)",
            cumulativeInvestment: "حجم الاستثمار التراكمي (مليون ر.ع)",
            directJobs: "عدد الوظائف المباشرة"
        },
        board: {
            title: "حوكمة القيادة",
            appointmentDate: "تاريخ تعيين القيادة",
            expiryDate: "تاريخ انتهاء الصلاحية",
            members: "عدد المسؤولين",
            independent: "الأعضاء المستقلون",
        },
        icv: {
            title: "القيمة المحلية والأثر الوطني",
            workforceTitle: "القوى العاملة",
            spendingTitle: "المناقصات والإنفاق المحلي",
            totalEmployees: "إجمالي القوى العاملة",
            omanis: "عدد العمانيين",
            omanizationRate: "نسبة التعمين",
            totalSpending: "إجمالي قيمة المناقصات السنوية",
            localSpending: "المسندة لشركات محلية",
            smeSpending: "المسندة للمؤسسات الصغيرة والمتوسطة",
            icvPercentage: "قيمة محلية مضافة",
            smePercentage: "حصة المؤسسات الصغيرة والمتوسطة",
            smeShort: "مصغرة ومتوسطة"
        }
    },
    approvals: {
      title: "طلبات الموافقة",
      companyName: "اسم المنطقة",
      submissionDate: "تاريخ الإرسال",
      maturityScore: "نتيجة النضج",
      actions: "إجراءات",
      view: "معاينة",
      return: "إعادة للتعديل",
      approve: "موافقة نهائية",
      returnModalTitle: "إعادة التقييم للمراجعة",
      returnModalDesc: "يرجى كتابة الملاحظات المطلوبة من المنطقة قبل إعادة الإرسال.",
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
      subtitle: "يرجى التأكد من اكتمال جميع الأقسام قبل إرسال التقييم إلى الهيئة للمراجعة النهائية.",
      checklistTitle: "قائمة التحقق من الاكتمال",
      profile: "الملف التعريفي للمنطقة",
      assessment: "تقييم الأداء المؤسسي",
      compliance: "الامتثال والمخاطر",
      status: {
        complete: "مكتمل",
        incomplete: "غير مكتمل"
      },
      view: "مراجعة",
      submitButton: "إرسال إلى الهيئة",
      submittedTitle: "تم الإرسال بنجاح",
      submittedDesc: "تم إرسال تقييم منطقتكم بنجاح. سيتم إشعاركم عند اكتمال المراجعة من قبل فريق الحوكمة في الهيئة.",
      underReview: "التقييم قيد المراجعة حالياً من قبل الهيئة. لا يمكن إجراء تعديلات في هذه المرحلة.",
      returned: "تمت إعادة التقييم من قبل الهيئة مع الملاحظات التالية:",
      viewNotes: "عرض الملاحظات"
    },
    common: {
      admin: "مدير النظام",
      company: "بوابة المنطقة",
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
      selectAllCompanies: "عرض كل المناطق",
      selectCompanyToStart: "اختر منطقة للبدء",
      selectCompanyToStartDesc: "يرجى اختيار منطقة من القائمة أعلاه لعرض أو تعديل بياناتها.",
      saveSuccessTitle: "تم الحفظ بنجاح",
      saveSuccessDesc: "تم حفظ بيانات المنطقة:",
      deleteConfirm: "هل أنت متأكد من رغبتك في حذف هذه المنطقة؟ لا يمكن التراجع عن هذا الإجراء.",
      deleteSuccessTitle: "تم الحذف بنجاح",
      errorTitle: "خطأ",
      fillAllFields: "يرجى تعبئة جميع الحقول المطلوبة.",
      loading: "جاري التصدير..."
    }
  },
  en: {
    appTitle: "ITQAN Platform",
    appSubtitle: "For OPAZ Governance Management",
    menu: {
      dashboard: "Dashboard",
      registry: "Zones Registry",
      company_profile: "Zone Profile",
      board_directory: "Executive Leadership",
      board_evaluation: "Leadership KPIs",
      assessment: "Institutional Performance",
      compliance: "Compliance & Risk",
      improvement: "Improvement Plan",
      financials: "Economic Indicators",
      reports: "Reports",
      settings: "Settings",
      logout: "Logout",
      review: "Review & Submit",
      approvals: "Approval Requests"
    },
    dashboard: {
      strategicRadar: "Strategic Performance Radar",
      portfolioHealth: "Total Investment Volume",
      maturityGauge: "Overall Maturity Gauge",
      riskMap: "Risk Map",
      sectorPerf: "Sector Performance",
      omanization: "Omanization Rate",
      compliance: "Compliance Status",
      urgentAlerts: "Urgent Alerts",
      totalAssets: "Total Investments (OMR M)",
      nationalWorkforce: "of total workforce",
      activeRisks: "Active risks logged",
      overallScore: "Overall assessment score",
      complianceRisk: "Compliance & Risk",
      maturityPath: "Strategic Maturity Path",
      maturityScore: "Maturity Score",
      compliant: "Compliant",
      nonCompliant: "Non-Compliant",
      improvementStatus: {
        title: "Improvement Plan Status"
      },
      boardComposition: {
        title: "Executive Leadership Analysis",
        independence: "Leadership Independence",
        independent: "Independent Members",
        nonIndependent: "Non-Independent",
        omanization: "Omanization in Leadership"
      },
      icv: {
          title: "Tenders & Local Spending",
          totalTenders: "Total Tenders",
          omanizationRate: "Omanization Rate",
          smeSpending: "SMEs",
          localSpending: "Local Companies",
          spending: "Tender Value",
          actualSpending: "Actual Spending",
          target: "Target"
      },
      financial: {
        hubTitle: "Financial Performance Hub",
        netProfit: "Signed Agreements",
        equity: "Occupied Area (km²)",
        freeCashFlow: "Occupied Area (km²)",
        roi: "Omanization Rate"
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
      },
      top5: {
        title: "Top 5 Performing Zones"
      }
    },
    registry: {
        title: "Zones Registry",
        addNew: "Add New Zone",
        searchPlaceholder: "Search by zone name or code...",
        riskLevel: "Risk Level",
        risks: {
            low: "Low",
            medium: "Medium",
            high: "High",
            critical: "Critical"
        }
    },
     board_directory: {
      title: "Executive Leadership Registry",
      subtitle: "View and analyze executive leadership data and performance",
      addMember: "Add New Official",
      saveSuccessDesc: "Leadership registry data has been saved successfully.",
      skillsMatrix: "Skills & Expertise Matrix",
      boardTenure: "Current Leadership Tenure",
      currentTerm: "Current Term",
      noData: "No data to display",
      membersCount: "Officials",
      memberType: "Executive Role",
      expertise_label: "Primary Expertise",
      committees: "Committee Memberships",
      noCommittees: "None",
      expiresSoon: "Tenure expires soon",
      summary: {
        total_members: "Total Officials",
        independent_members: "Independent Members",
        of_board: "of the leadership team",
        expiring_soon: "Tenures Expiring Soon",
        within_3_months: "within 3 months",
        total_committees: "Active Committees"
      },
      tabs: {
        members: "Officials & Skills",
        minutes: "Meetings & Minutes"
      },
      minutes: {
        title: "Meeting Minutes Repository",
        upload: "Upload Minute",
        date: "Meeting Date",
        meetingTitle: "Meeting Title / Minute",
        type: "Meeting Type",
        attendees: "Attendees",
        actions: "Actions",
        noMinutes: "No minutes have been saved for this zone.",
        minuteAdded: "Minute added successfully.",
        types: {
            quarterly: "Quarterly",
            emergency: "Emergency",
            committee: "Committee"
        }
      },
      roles: {
        ceo: "CEO",
        coo: "COO",
        cfo: "CFO",
        'vp_operations': "VP of Operations",
        'vp_of_business_development': "VP of Business Development",
        'investment_director': "Investment Director"
      },
      types: { 
        independent: "Independent",
        government: "Government Rep.",
        executive: "Executive"
      },
      expertise: {
        'smart_city_development': "Smart City Development",
        'logistics': "Logistics",
        'fdi_attraction': "FDI Attraction",
        'industrial_management': "Industrial Management",
        'urban_planning': "Urban Planning"
      },
      committee_names: {
        audit: "Audit",
        risk: "Risk",
        hr: "Human Resources",
        nomination: "Nomination"
      },
      form: {
        title_add: 'Add New Official',
        title_edit: 'Edit Official Details',
        name_ar: 'Name (Arabic)',
        name_en: 'Name (English)',
        nationality: 'Nationality',
        role: 'Executive Role',
        appointmentDate: 'Appointment Date',
        expiryDate: 'Expiry Date',
        cycleSettings: 'Cycle Settings',
        termStartDate: 'Term Start Date',
        termEndDate: 'Term End Date',
        qualification: 'Academic Qualification',
      },
      qualifications: {
        bachelor: 'Bachelor',
        master: 'Master',
        phd: 'PhD'
      }
    },
    board_evaluation: {
        title: "Leadership Performance KPIs",
        cycle: "Evaluation Cycle",
        memberInfo: "Executive Official",
        projectsCompletion: "Projects Completion %",
        investmentTargets: "Investment Targets",
        operationalExcellence: "Operational Excellence",
        totalScore: "Final Score",
        recommendation: "Recommendation",
        renew: "Renew Term",
        review: "Review / Replace",
        goodStanding: "Good Standing",
        save: "Save Evaluation",
        export: "Export Report",
        saveSuccessDesc: "Leadership evaluation data has been saved successfully.",
        summary: {
            avgScore: "Avg. Leadership Score",
            topPerformer: "Top Performer",
            reviewRequired: "Officials to Review"
        },
        notes: {
            title: "Evaluation Notes",
            placeholder: "Add notes or justifications for the evaluation...",
            saved: "Notes saved."
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
            conflict: "Have conflicts of interest been disclosed by members?",
            legalStatus: "Are Commercial Registration & Tax Certificates valid?",
            dividends: "Were OIA dividends transferred on schedule?",
            agmApproval: "Were financial statements approved by the AGM?",
            reporting: "Was the audited Annual Report published to the public?",
            legalIssues: "Is the zone free from undisclosed material legal cases?",
            minutesArchiving: "Are all Board & Committee minutes signed and archived?"
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
      title: "Economic Indicators",
      auditorPlaceholder: "External Auditor's Office Name...",
      saveSuccessDesc: "Economic indicators have been saved for",
      position: {
        title: "Investment Volume",
        assets: "Total Assets & Investments",
        liabilities: "Total Liabilities",
        equity: "Net Asset Value"
      },
      performance: {
        title: "Operational Performance",
        revenue: "Operating Revenue",
        expenses: "Operating Expenses",
        netProfit: "Net Income"
      },
      cashflow: {
        title: "Liquidity & Cash Flow",
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
        checkbox: "I hereby declare the provided data is accurate",
        saveButton: "Save Economic Indicators"
      }
    },
    reports: {
        title: "Comprehensive Strategic Report",
        selectCompanyToView: "Please select a zone to view its detailed report.",
        year: "Year",
        export: "Export PDF",
        boardAndIcvAnalysis: "Leadership & National Value Analysis",
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
        maturityAnalysis: "Governance Maturity Analysis (Zone vs. Average)",
        companyScore: "Zone Score",
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
          critical: "Critical"
        },
        improvement: {
          completed: "Completed",
          inProgress: "In Progress",
          notStarted: "Not Started"
        },
        financial: {
            title: "Economic Performance Snapshot",
            performance: "Performance",
            revenue: "Revenue",
            expenses: "Expenses",
            netProfit: "Net Income"
        }
    },
    settings: {
      title: "Settings",
      subtitle: "Manage system variables and data",
      profile: {
          title: "Supervisor Profile",
          role: "General Supervisor & System Architect",
          email: "Email",
          phone: "Phone Number",
      },
      preferences: {
          title: "System Preferences",
          language: "Language",
          theme: "Theme",
          notifications: "Notifications"
      },
      info: {
          title: "System Information",
          version: "OPAZ GRC v1.0 (Foundation)",
          license: "Exclusively licensed for OPAZ",
          credits: "Designed & Architected by Dr. Abdulrahman Al-Nofali"
      },
      data: {
          title: "Data Management",
          description: "This action will permanently delete all data entered into the application, including zone data, assessments, risks, and improvement plans. Use this option with extreme caution.",
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
            companyName: "Zone/City Name",
            code: "Code",
            sector: "Sector", // Fallback
            legalForm: "Legal Form", // Fallback, to be replaced
            zoneType: "Zone Type"
        },
        financial: {
            title: "Key Indicators",
            capital: "Authorized Capital (OMR)", // Fallback
            yearEnd: "Financial Year End", // Fallback
            roi: "Last ROI (%)",
            uso: "USO Obligations",
            totalArea: "Total Area (km²)",
            developedArea: "Developed Area (km²)",
            cumulativeInvestment: "Cumulative Investment (OMR M)",
            directJobs: "Direct Jobs Created"
        },
        board: {
            title: "Leadership Governance",
            appointmentDate: "Leadership Appointment Date",
            expiryDate: "Expiry Date",
            members: "No. of Officials",
            independent: "Independent Members",
        },
        icv: {
            title: "ICV & National Impact",
            workforceTitle: "Workforce",
            spendingTitle: "Tenders & Local Spending",
            totalEmployees: "Total Employees",
            omanis: "No. of Omanis",
            omanizationRate: "Omanization Rate",
            totalSpending: "Total Annual Spending (OMR)",
            localSpending: "Awarded to Local Companies",
            smeSpending: "Awarded to SMEs",
            icvPercentage: "ICV Percentage",
            smePercentage: "SME Share",
            smeShort: "SMEs"
        }
    },
    approvals: {
      title: "Approval Requests",
      companyName: "Zone Name",
      submissionDate: "Submission Date",
      maturityScore: "Maturity Score",
      actions: "Actions",
      view: "View",
      return: "Return for Edits",
      approve: "Final Approve",
      returnModalTitle: "Return Assessment for Review",
      returnModalDesc: "Please provide the required feedback for the zone before they resubmit.",
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
      subtitle: "Please ensure all sections are complete before sending the assessment to the Authority for final review.",
      checklistTitle: "Completion Checklist",
      profile: "Zone Profile Data",
      assessment: "Institutional Performance Assessment",
      compliance: "Compliance & Risk Registry",
      status: {
        complete: "Complete",
        incomplete: "Incomplete"
      },
      view: "Review",
      submitButton: "Send to Authority",
      submittedTitle: "Successfully Submitted",
      submittedDesc: "Your zone's assessment has been sent successfully. You will be notified once the review by the Authority's governance team is complete.",
      underReview: "The assessment is currently under review by the Authority. No edits can be made at this stage.",
      returned: "The assessment has been returned by the Authority with the following feedback:",
      viewNotes: "View Notes"
    },
    common: {
      admin: "System Admin",
      company: "Zone Portal",
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
      selectAllCompanies: "All Zones View",
      selectCompanyToStart: "Select a Zone to Begin",
      selectCompanyToStartDesc: "Please select a zone from the dropdown above to view or edit its data.",
      saveSuccessTitle: "Saved Successfully",
      saveSuccessDesc: "Zone data has been saved for:",
      deleteConfirm: "Are you sure you want to delete this zone? This action cannot be undone.",
      deleteSuccessTitle: "Deleted Successfully",
      errorTitle: "Error",
      fillAllFields: "Please fill all required fields.",
      loading: "Exporting..."
    }
  }
};
