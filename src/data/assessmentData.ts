// src/data/assessmentData.ts

export interface SelectOption {
  label: string;
  score: number; // النقاط الفعلية (مثلاً 10، 7، 3)
}

export interface AssessmentIndicator {
  id: string;
  text: string;      // نص المؤشر من خانة التوضيح
  subText: string;   // تفاصيل إضافية
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
        subText: 'يتم احتساب الدرجة بناءً على سرعة الرد الرسمي',
        weight: 10,
        type: 'select',
        options: [
          { label: 'الاستجابة خلال 7 أيام عمل (10)', score: 10 },
          { label: 'الاستجابة خلال 15 يوم عمل (5)', score: 5 },
          { label: 'عدم الاستجابة / تأخير (0)', score: 0 }
        ]
      },
      {
        id: 'ind_1_2',
        text: 'معدل غلق الملاحظات التراكمية',
        subText: 'يتم احتسابها من قاعدة بيانات الزيارات (نسبة %)',
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
        subText: 'الامتثال بقرار الهيئة رقم 17/2021 والقرار رقم 37/2023',
        weight: 4,
        type: 'select',
        options: [
          { label: 'مراجعة ممتازة وفي الوقت (4)', score: 4 },
          { label: 'مراجعة جيدة (2.5)', score: 2.5 },
          { label: 'مراجعة ضعيفة (0)', score: 0 }
        ]
      },
      {
        id: 'ind_2_2',
        text: 'إصدار التصاريح والتراخيص البيئية',
        subText: 'الالتزام بالاشتراطات العامة والخاصة عند الإصدار',
        weight: 3,
        type: 'select',
        options: [
          { label: 'إصدار باشتراطات كاملة (3)', score: 3 },
          { label: 'إصدار باشتراطات عامة فقط (2)', score: 2 },
          { label: 'إصدار دون اشتراطات (1)', score: 1 },
          { label: 'عدم إصدار (0)', score: 0 }
        ]
      },
      {
        id: 'ind_2_3',
        text: 'استلام تقارير الرصد ومتابعتها',
        subText: 'متابعة تقارير الرصد البيئي الدورية من الشركات',
        weight: 3,
        type: 'select',
        options: [
          { label: 'مراجعة واتخاذ إجراءات (3)', score: 3 },
          { label: 'مراجعة دون إجراءات (2)', score: 2 },
          { label: 'استلام دون مراجعة (1)', score: 1 },
          { label: 'عدم استلام (0)', score: 0 }
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
        subText: 'الالتزام بالموعد المحدد لتسليم التقارير ربع السنوية',
        weight: 7.5,
        type: 'select',
        options: [
          { label: 'خلال 10 أيام من نهاية الربع (7.5)', score: 7.5 },
          { label: 'خلال 20 يوم (5)', score: 5 },
          { label: 'تأخير أكثر من 20 يوم (0)', score: 0 }
        ]
      },
      {
        id: 'ind_3_2',
        text: 'جودة البيانات وصحتها',
        subText: 'مدى صحة واكتمال البيانات الواردة في التقرير',
        weight: 7.5,
        type: 'select',
        options: [
          { label: 'بيانات مكتملة وصحيحة (7.5)', score: 7.5 },
          { label: 'بيانات مكتملة غير دقيقة (5)', score: 5 },
          { label: 'نقص في البيانات (2.5)', score: 2.5 },
          { label: 'نقص حاد / عدم تسليم (0)', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'std_4',
    title: '4. الامتثال لسياسة الإشراف والرقابة',
    title_en: '4. Compliance with Supervision Policy',
    weight: 15,
    indicators: [
      {
        id: 'ind_4_1',
        text: 'إنشاء وحدة إدارية للرقابة والتفتيش',
        subText: 'وجود وحدة مختصة وتوفير الكوادر البشرية الكافية',
        weight: 5,
        type: 'select',
        options: [
          { label: 'تم التأسيس والتمكين (5)', score: 5 },
          { label: 'تم التأسيس دون تمكين كامل (2.5)', score: 2.5 },
          { label: 'لم يتم التأسيس (0)', score: 0 }
        ]
      },
      {
        id: 'ind_4_2',
        text: 'إعداد خطة عمل سنوية للرقابة',
        subText: 'تزويد الهيئة بنسخة من الخطة قبل 15 يناير',
        weight: 5,
        type: 'select',
        options: [
          { label: 'تم الاعتماد والتزويد (5)', score: 5 },
          { label: 'تم الإعداد وتأخر التزويد (2.5)', score: 2.5 },
          { label: 'لم يتم الإعداد (0)', score: 0 }
        ]
      },
      {
        id: 'ind_4_3',
        text: 'التعاون التام مع الهيئة',
        subText: 'تسهيل مهام موظفي الهيئة وتوفير البيانات المطلوبة',
        weight: 5,
        type: 'select',
        options: [
          { label: 'تعاون تام (5)', score: 5 },
          { label: 'تعاون جزئي (2.5)', score: 2.5 },
          { label: 'عدم تعاون (0)', score: 0 }
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
        subText: 'نسبة تنفيذ الزيارات المخطط لها ربعياً',
        weight: 7.5,
        type: 'select',
        options: [
          { label: 'التزام كامل بالخطة (7.5)', score: 7.5 },
          { label: 'التزام جزئي (4)', score: 4 },
          { label: 'عدم التزام (0)', score: 0 }
        ]
      },
      {
        id: 'ind_5_2',
        text: 'متابعة نتائج الزيارات والمخالفات',
        subText: 'تصويب الأوضاع ومتابعة التقارير المستلمة من المشاريع',
        weight: 7.5,
        type: 'select',
        options: [
          { label: 'متابعة فعالة وإغلاق (7.5)', score: 7.5 },
          { label: 'متابعة دون إغلاق نهائي (4)', score: 4 },
          { label: 'عدم متابعة (0)', score: 0 }
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
        subText: 'سرعة الإبلاغ للهيئة والخروج بالتوصيات',
        weight: 10,
        type: 'select',
        options: [
          { label: 'إبلاغ فوري وتحقيق شامل (10)', score: 10 },
          { label: 'إبلاغ متأخر / تحقيق ناقص (5)', score: 5 },
          { label: 'عدم إبلاغ (0)', score: 0 }
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
        subText: 'ميزة تفاضلية ترفع من تقييم المنطقة (مبادرات إضافية)',
        weight: 15,
        type: 'select',
        options: [
          { label: 'مبادرات متميزة ومطبقة (15)', score: 15 },
          { label: 'مبادرات مقترحة / قيد التنفيذ (7.5)', score: 7.5 },
          { label: 'لا توجد مبادرات (0)', score: 0 }
        ]
      }
    ]
  }
];
