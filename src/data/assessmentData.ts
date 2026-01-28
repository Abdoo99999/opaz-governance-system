// src/data/assessmentData.ts

export interface SelectOption {
  label: string;
  score: number; // 1 = درجة كاملة، 0.5 = نصف الدرجة، 0 = صفر
}

export interface AssessmentIndicator {
  id: string;
  text: string;      // اسم المؤشر من الإكسل
  subText: string;   // آلية القياس
  weight: number;    // الوزن (الدرجة القصوى لهذا السؤال)
  type: 'number' | 'select'; // نوع السؤال: رقم أو قائمة
  options?: SelectOption[];  // الخيارات (للقوائم فقط)
  maxScore?: number; // الحد الأقصى للإدخال (للأرقام فقط)
  unit?: string;     // الوحدة (يوم، %، عدد)
}

export interface AssessmentCategory {
  id: string;
  title: string;
  weight: number; // وزن المحور بالكامل
  indicators: AssessmentIndicator[];
}

export const ASSESSMENT_DATA: AssessmentCategory[] = [
  {
    id: 'operational',
    title: 'الكفاءة التشغيلية (30%)',
    weight: 30,
    indicators: [
      {
        id: 'visit_response',
        text: 'الاستجابة لتقارير الزيارة الميدانية',
        subText: 'قياس سرعة استجابة المنطقة للملاحظات الواردة في تقارير الزيارات.',
        weight: 5,
        type: 'select',
        options: [
          { label: 'الرد خلال 5 أيام عمل (درجة كاملة)', score: 1 },
          { label: 'الرد خلال 6-10 أيام عمل (نصف الدرجة)', score: 0.5 },
          { label: 'الرد بعد أكثر من 10 أيام (صفر)', score: 0 }
        ]
      },
      {
        id: 'observations_closing',
        text: 'معدل غلق الملاحظات التراكمية',
        subText: 'نسبة الملاحظات التي تم معالجتها وإغلاقها نهائياً.',
        weight: 5,
        type: 'number',
        maxScore: 100,
        unit: '%'
      },
      {
        id: 'digital_services',
        text: 'نسبة الخدمات المؤتمتة',
        subText: 'نسبة الخدمات المقدمة إلكترونياً مقارنة بإجمالي الخدمات.',
        weight: 10,
        type: 'number',
        maxScore: 100,
        unit: '%'
      },
      {
        id: 'one_stop_shop',
        text: 'تفعيل المحطة الواحدة (OSS)',
        subText: 'مدى توفر ممثلي الجهات الحكومية وصلاحياتهم.',
        weight: 10,
        type: 'select',
        options: [
          { label: 'جميع الجهات متواجدة ولديها صلاحيات', score: 1 },
          { label: 'بعض الجهات متواجدة / صلاحيات منقوصة', score: 0.5 },
          { label: 'غير مفعل', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'compliance',
    title: 'الامتثال والبيئة (25%)',
    weight: 25,
    indicators: [
      {
        id: 'eia_studies',
        text: 'مراجعة دراسات الأثر البيئي',
        subText: 'كفاءة المنطقة في مراجعة الدراسات فنياً.',
        weight: 10,
        type: 'select',
        options: [
          { label: 'تتم المراجعة داخلياً بكفاءة', score: 1 },
          { label: 'يتم الاستعانة بجهات خارجية', score: 0.5 },
          { label: 'لا توجد آلية واضحة', score: 0 }
        ]
      },
      {
        id: 'permit_issuance',
        text: 'الالتزام بوقت إصدار التصاريح',
        subText: 'مدى الالتزام بالوقت المحدد في دليل الخدمات.',
        weight: 15,
        type: 'select',
        options: [
          { label: 'إصدار فوري / حسب الوقت المحدد', score: 1 },
          { label: 'تأخير بسيط (أقل من 20%)', score: 0.7 },
          { label: 'تأخير متكرر', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'economic',
    title: 'الأداء الاقتصادي (45%)',
    weight: 45,
    indicators: [
      {
        id: 'investment_volume',
        text: 'تحقيق مستهدف حجم الاستثمار',
        subText: 'نسبة تحقيق المستهدف السنوي لجذب الاستثمارات.',
        weight: 15,
        type: 'number',
        maxScore: 100,
        unit: '%'
      },
      {
        id: 'omanization_rate',
        text: 'نسبة التعمين',
        subText: 'تحقيق نسب التعمين المقررة في المنطقة.',
        weight: 15,
        type: 'number',
        maxScore: 100,
        unit: '%'
      },
      {
        id: 'sme_support',
        text: 'دعم المؤسسات الصغيرة والمتوسطة (LCC)',
        subText: 'مدى إسناد عقود للمؤسسات المحلية.',
        weight: 15,
        type: 'select',
        options: [
          { label: 'ممتاز (تجاوز المستهدف)', score: 1 },
          { label: 'جيد (حقق المستهدف)', score: 0.8 },
          { label: 'متوسط (أقل من المستهدف بقليل)', score: 0.5 },
          { label: 'ضعيف', score: 0 }
        ]
      }
    ]
  }
];