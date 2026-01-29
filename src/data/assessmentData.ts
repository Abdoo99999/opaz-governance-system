// src/data/assessmentData.ts

export interface SelectOption {
  label: string;
  label_en: string;
  score: number; // النقاط الفعلية (مثلاً 10، 7، 3)
}

export interface AssessmentIndicator {
  id: string;
  text: string;      // نص المؤشر من خانة التوضيح
  text_en: string;
  subText: string;   // تفاصيل إضافية
  subText_en: string;
  weight: number;    // وزن المؤشر
  type: 'number' | 'select';
  options?: SelectOption[];
  maxScore?: number; // الحد الأقصى (للنسبة المئوية عادة 100)
  unit?: string;
}

export interface AssessmentCategory {
  id: string;
  title: string;
  title_en: string;
  weight: number;
  indicators: AssessmentIndicator[];
}

export const ASSESSMENT_DATA: AssessmentCategory[] = [
  {
    id: 'std_1',
    title: '1. الاستجابة لملاحظات الهيئة',
    title_en: '1. Response to OPAZ Feedback',
    weight: 20,
    indicators: [
      {
        id: 'ind_1_1',
        text: 'المدة التي استغرقتها المنطقة للاستجابة على تقرير زيارة الهيئة',
        text_en: 'Time taken by the zone to respond to the Authority\'s visit report',
        subText: 'يتم احتساب الدرجة بناءً على سرعة الرد الرسمي',
        subText_en: 'Score is calculated based on the speed of the official response',
        weight: 10,
        type: 'select',
        options: [
          { label: 'الاستجابة خلال 7 أيام عمل (10)', label_en: 'Response within 7 working days (10)', score: 10 },
          { label: 'الاستجابة خلال 15 يوم عمل (5)', label_en: 'Response within 15 working days (5)', score: 5 },
          { label: 'عدم الاستجابة / تأخير (0)', label_en: 'No response / delay (0)', score: 0 }
        ]
      },
      {
        id: 'ind_1_2',
        text: 'معدل غلق الملاحظات التراكمية',
        text_en: 'Rate of closing cumulative observations',
        subText: 'يتم احتسابها من قاعدة بيانات الزيارات (نسبة %)',
        subText_en: 'Calculated from the visit database (%)',
        weight: 10,
        type: 'number',
        maxScore: 100,
        unit: '%'
      }
    ]
  },
  {
    id: 'std_2',
    title: '2. الامتثال بقرارات الإدارة البيئية',
    title_en: '2. Compliance with Environmental Decisions',
    weight: 10,
    indicators: [
      {
        id: 'ind_2_1',
        text: 'قدرة إدارة المنطقة في مراجعة دراسات تقييم الأثر البيئي',
        text_en: 'Zone management\'s ability to review Environmental Impact Assessment (EIA) studies',
        subText: 'الامتثال بقرار الهيئة رقم 17/2021 والقرار رقم 37/2023',
        subText_en: 'Compliance with Authority Decision No. 17/2021 and Decision No. 37/2023',
        weight: 4,
        type: 'select',
        options: [
          { label: 'مراجعة ممتازة وفي الوقت (4)', label_en: 'Excellent and timely review (4)', score: 4 },
          { label: 'مراجعة جيدة (2.5)', label_en: 'Good review (2.5)', score: 2.5 },
          { label: 'مراجعة ضعيفة (0)', label_en: 'Poor review (0)', score: 0 }
        ]
      },
      {
        id: 'ind_2_2',
        text: 'إصدار التصاريح والتراخيص البيئية',
        text_en: 'Issuance of environmental permits and licenses',
        subText: 'الالتزام بالاشتراطات العامة والخاصة عند الإصدار',
        subText_en: 'Adherence to general and special conditions upon issuance',
        weight: 3,
        type: 'select',
        options: [
          { label: 'إصدار باشتراطات كاملة (3)', label_en: 'Issued with full conditions (3)', score: 3 },
          { label: 'إصدار باشتراطات عامة فقط (2)', label_en: 'Issued with general conditions only (2)', score: 2 },
          { label: 'إصدار دون اشتراطات (1)', label_en: 'Issued without conditions (1)', score: 1 },
          { label: 'عدم إصدار (0)', label_en: 'Not issued (0)', score: 0 }
        ]
      },
      {
        id: 'ind_2_3',
        text: 'استلام تقارير الرصد ومتابعتها',
        text_en: 'Receiving and following up on monitoring reports',
        subText: 'متابعة تقارير الرصد البيئي الدورية من الشركات',
        subText_en: 'Follow-up on periodic environmental monitoring reports from companies',
        weight: 3,
        type: 'select',
        options: [
          { label: 'مراجعة واتخاذ إجراءات (3)', label_en: 'Review and take action (3)', score: 3 },
          { label: 'مراجعة دون إجراءات (2)', label_en: 'Review without action (2)', score: 2 },
          { label: 'استلام دون مراجعة (1)', label_en: 'Received without review (1)', score: 1 },
          { label: 'عدم استلام (0)', label_en: 'Not received (0)', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'std_3',
    title: '3. استلام التقارير الدورية',
    title_en: '3. Submission of Periodic Reports',
    weight: 15,
    indicators: [
      {
        id: 'ind_3_1',
        text: 'المدة المستغرقة لتسليم التقارير الدورية',
        text_en: 'Time taken to submit periodic reports',
        subText: 'الالتزام بالموعد المحدد لتسليم التقارير ربع السنوية',
        subText_en: 'Adherence to the deadline for submitting quarterly reports',
        weight: 7.5,
        type: 'select',
        options: [
          { label: 'خلال 10 أيام من نهاية الربع (7.5)', label_en: 'Within 10 days of quarter end (7.5)', score: 7.5 },
          { label: 'خلال 20 يوم (5)', label_en: 'Within 20 days (5)', score: 5 },
          { label: 'تأخير أكثر من 20 يوم (0)', label_en: 'Delay of more than 20 days (0)', score: 0 }
        ]
      },
      {
        id: 'ind_3_2',
        text: 'جودة البيانات وصحتها',
        text_en: 'Data quality and accuracy',
        subText: 'مدى صحة واكتمال البيانات الواردة في التقرير',
        subText_en: 'Accuracy and completeness of the data in the report',
        weight: 7.5,
        type: 'select',
        options: [
          { label: 'بيانات مكتملة وصحيحة (7.5)', label_en: 'Complete and accurate data (7.5)', score: 7.5 },
          { label: 'بيانات مكتملة غير دقيقة (5)', label_en: 'Complete but inaccurate data (5)', score: 5 },
          { label: 'نقص في البيانات (2.5)', label_en: 'Incomplete data (2.5)', score: 2.5 },
          { label: 'نقص حاد / عدم تسليم (0)', label_en: 'Severe shortage / non-submission (0)', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'std_4',
    title: '4. الالتزام بسياسة الإشراف والرقابة',
    title_en: '4. Compliance with Supervision Policy',
    weight: 15,
    indicators: [
      {
        id: 'ind_4_1',
        text: 'إنشاء وحدة إدارية للرقابة والتفتيش',
        text_en: 'Establishment of an administrative unit for supervision and inspection',
        subText: 'وجود وحدة مختصة وتوفير الكوادر البشرية الكافية',
        subText_en: 'Presence of a specialized unit and provision of adequate human resources',
        weight: 5,
        type: 'select',
        options: [
          { label: 'تم التأسيس والتمكين (5)', label_en: 'Established and empowered (5)', score: 5 },
          { label: 'تم التأسيس دون تمكين كامل (2.5)', label_en: 'Established without full empowerment (2.5)', score: 2.5 },
          { label: 'لم يتم التأسيس (0)', label_en: 'Not established (0)', score: 0 }
        ]
      },
      {
        id: 'ind_4_2',
        text: 'إعداد خطة عمل سنوية للرقابة',
        text_en: 'Preparation of an annual supervision action plan',
        subText: 'تزويد الهيئة بنسخة من الخطة قبل 15 يناير',
        subText_en: 'Provide the Authority with a copy of the plan before January 15',
        weight: 5,
        type: 'select',
        options: [
          { label: 'تم الاعتماد والتزويد (5)', label_en: 'Approved and provided (5)', score: 5 },
          { label: 'تم الإعداد وتأخر التزويد (2.5)', label_en: 'Prepared but provided late (2.5)', score: 2.5 },
          { label: 'لم يتم الإعداد (0)', label_en: 'Not prepared (0)', score: 0 }
        ]
      },
      {
        id: 'ind_4_3',
        text: 'التعاون التام مع الهيئة',
        text_en: 'Full cooperation with the Authority',
        subText: 'تسهيل مهام موظفي الهيئة وتوفير البيانات المطلوبة',
        subText_en: 'Facilitating the tasks of the Authority\'s employees and providing the required data',
        weight: 5,
        type: 'select',
        options: [
          { label: 'تعاون تام (5)', label_en: 'Full cooperation (5)', score: 5 },
          { label: 'تعاون جزئي (2.5)', label_en: 'Partial cooperation (2.5)', score: 2.5 },
          { label: 'عدم تعاون (0)', label_en: 'No cooperation (0)', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'std_5',
    title: '5. الرقابة على المشاريع',
    title_en: '5. Project Monitoring',
    weight: 15,
    indicators: [
      {
        id: 'ind_5_1',
        text: 'الالتزام بخطة الرقابة ومتابعة الزيارات',
        text_en: 'Adherence to the supervision plan and follow-up on visits',
        subText: 'نسبة تنفيذ الزيارات المخطط لها ربعياً',
        subText_en: 'Percentage of planned quarterly visits executed',
        weight: 7.5,
        type: 'select',
        options: [
          { label: 'التزام كامل بالخطة (7.5)', label_en: 'Full adherence to the plan (7.5)', score: 7.5 },
          { label: 'التزام جزئي (4)', label_en: 'Partial adherence (4)', score: 4 },
          { label: 'عدم التزام (0)', label_en: 'No adherence (0)', score: 0 }
        ]
      },
      {
        id: 'ind_5_2',
        text: 'متابعة نتائج الزيارات والمخالفات',
        text_en: 'Follow-up on visit results and violations',
        subText: 'تصويب الأوضاع ومتابعة التقارير المستلمة من المشاريع',
        subText_en: 'Rectifying situations and following up on reports received from projects',
        weight: 7.5,
        type: 'select',
        options: [
          { label: 'متابعة فعالة وإغلاق (7.5)', label_en: 'Effective follow-up and closure (7.5)', score: 7.5 },
          { label: 'متابعة دون إغلاق نهائي (4)', label_en: 'Follow-up without final closure (4)', score: 4 },
          { label: 'عدم متابعة (0)', label_en: 'No follow-up (0)', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'std_6',
    title: '6. الإبلاغ عن الحوادث',
    title_en: '6. Incident Reporting',
    weight: 10,
    indicators: [
      {
        id: 'ind_6_1',
        text: 'الالتزام بالإبلاغ عن الحوادث والتحقيق فيها',
        text_en: 'Commitment to reporting and investigating incidents',
        subText: 'سرعة الإبلاغ للهيئة والخروج بالتوصيات',
        subText_en: 'Speed of reporting to the Authority and issuing recommendations',
        weight: 10,
        type: 'select',
        options: [
          { label: 'إبلاغ فوري وتحقيق شامل (10)', label_en: 'Immediate reporting and comprehensive investigation (10)', score: 10 },
          { label: 'إبلاغ متأخر / تحقيق ناقص (5)', label_en: 'Late reporting / incomplete investigation (5)', score: 5 },
          { label: 'عدم إبلاغ (0)', label_en: 'No reporting (0)', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'std_7',
    title: '7. المبادرات النوعية',
    title_en: '7. Qualitative Initiatives',
    weight: 15,
    indicators: [
      {
        id: 'ind_7_1',
        text: 'المبادرات في مجال الالتزام والبيئة',
        text_en: 'Initiatives in the field of compliance and environment',
        subText: 'ميزة تفاضلية ترفع من تقييم المنطقة (مبادرات إضافية)',
        subText_en: 'A differentiating feature that raises the zone\'s assessment (additional initiatives)',
        weight: 15,
        type: 'select',
        options: [
          { label: 'مبادرات متميزة ومطبقة (15)', label_en: 'Outstanding and implemented initiatives (15)', score: 15 },
          { label: 'مبادرات مقترحة / قيد التنفيذ (7.5)', label_en: 'Proposed / in-progress initiatives (7.5)', score: 7.5 },
          { label: 'لا توجد مبادرات (0)', label_en: 'No initiatives (0)', score: 0 }
        ]
      }
    ]
  }
];
