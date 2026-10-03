import { Patient, ScaleAssessmentResult, Prescription } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-101',
    fileNumber: 'CM-2026-081',
    name: 'سارة خالد المنصور',
    age: 28,
    gender: 'أنثى',
    phone: '0501234567',
    email: 'sara.almansoor@example.com',
    primaryDiagnosis: 'اضطراب الاكتئاب الجسيم (MDD) مع قلق ثانوي',
    icd10Code: 'F32.1',
    riskLevel: 'متوسط',
    lastVisit: '2026-09-28',
    assignedDoctor: 'د. طارق الحكيم (استشاري الطب النفسي)',
    assignedDoctorId: 'doc-hakim',
    activeMedsCount: 1,
    completedScalesCount: 3,
    status: 'قيد المتابعة المكثفة',
    allergies: [
      {
        id: 'alg-1',
        substance: 'البنسلين ومشتتقاته (Penicillins)',
        severity: 'شديدة ومهددة للحياة',
        reaction: 'طفح جلدي تحسسي حاد مع ضيق في التنفس وتورم الحنجرة.'
      },
      {
        id: 'alg-2',
        substance: 'السلفا (Sulfonamides)',
        severity: 'متوسطة',
        reaction: 'حكة جلدية واحمرار.'
      }
    ],
    chronicConditions: ['خمول الغدة الدرقية (تتناول الثيروكسين 50mcg)', 'نقص فيتامين د'],
    currentMedications: ['Cipralex 10mg (Escitalopram) قرص صباحاً', 'Euthyrox 50mcg قرص صباحاً على الريق'],
    vitalsHistory: [
      {
        date: '2026-09-28',
        weightKg: 62.5,
        bloodPressure: '118/76',
        heartRate: 74,
        fastingGlucoseMgDl: 92,
        notes: 'مؤشرات حيوية مستقرة. لا توجد تقلبات ضغط مع الدواء.'
      },
      {
        date: '2026-09-14',
        weightKg: 63.8,
        bloodPressure: '122/80',
        heartRate: 82,
        fastingGlucoseMgDl: 95,
        notes: 'الزيارة الأولى قبل بدء الجرعة الدوائية.'
      }
    ],
    treatmentGoals: [
      {
        id: 'tg-1',
        title: 'خفض درجة مقياس الاكتئاب PHQ-9 إلى ما دون 8 درجات خلال 6 أسابيع',
        targetDate: '2026-11-10',
        status: 'قيد العمل',
        category: 'CBT'
      },
      {
        id: 'tg-2',
        title: 'تنظيم جدول النوم واليقظة (النوم 11:30 م والاستيقاظ 07:00 ص)',
        targetDate: '2026-10-20',
        status: 'قيد العمل',
        category: 'نمط حياة'
      },
      {
        id: 'tg-3',
        title: 'تطبيق سجل الأفكار المعرفي يومياً عند مواجهة مواقف الضغط المهني',
        targetDate: '2026-10-30',
        status: 'قيد العمل',
        category: 'CBT'
      }
    ],
    medicalHistory: 'لا توجد سوابق استشفاء نفسي، بدأت الأعراض بعد فقدان وظيفة سابقة منذ 4 أشهر. تاريخ أسري إيجابي للاكتئاب لدى الوالدة.',
    socialHistory: 'متزوجة، أم لطفل (3 سنوات)، تعمل كأخصائية موارد بشرية، تعيش في بيئة أسرية داعمة ومتعاونة.'
  },
  {
    id: 'pat-102',
    fileNumber: 'CM-2026-089',
    name: 'عبدالله محمد الشهري',
    age: 34,
    gender: 'ذكر',
    phone: '0559876543',
    email: 'a.alshehri@example.com',
    primaryDiagnosis: 'اضطراب الوسواس القهري (OCD) وأرق مزمن',
    icd10Code: 'F42.2',
    riskLevel: 'منخفض',
    lastVisit: '2026-09-25',
    assignedDoctor: 'أ. محمد المؤيد (أخصائي العلاج النفسي)',
    assignedDoctorId: 'doc-moayad',
    activeMedsCount: 1,
    completedScalesCount: 4,
    status: 'نشط',
    allergies: [],
    chronicConditions: ['القولون العصبي (IBS) المرتبط بالتوتر النفسي'],
    currentMedications: ['Fevarin 100mg (Fluvoxamine) قرص مساءً'],
    vitalsHistory: [
      {
        date: '2026-09-25',
        weightKg: 78.0,
        bloodPressure: '125/82',
        heartRate: 70,
        notes: 'مؤشرات طبيعية.'
      }
    ],
    treatmentGoals: [
      {
        id: 'tg-ocd-1',
        title: 'تقليص زمن طقوس الغسيل والتأكد من 4 ساعات إلى أقل من 30 دقيقة يومياً عبر التعرض ومنع الاستجابة (ERP)',
        targetDate: '2026-11-15',
        status: 'قيد العمل',
        category: 'CBT'
      }
    ],
    medicalHistory: 'الأعراض الوسواسية بدأت في سن 22 وتفاقمت مع ضغوط العمل المصرفي.',
    socialHistory: 'مهندس برمجيات، يقيم بالرياض، أعزب.'
  },
  {
    id: 'pat-103',
    fileNumber: 'CM-2026-094',
    name: 'ريما فهد السديري',
    age: 22,
    gender: 'أنثى',
    phone: '0533344556',
    email: 'reema.sudairi@example.com',
    primaryDiagnosis: 'اضطراب الهلع (Panic Disorder) مع رهاب الساح',
    icd10Code: 'F41.0',
    riskLevel: 'منخفض',
    lastVisit: '2026-09-29',
    assignedDoctor: 'د. محمد عامر (استشاري العلاج النفسي)',
    assignedDoctorId: 'doc-amer',
    activeMedsCount: 0,
    completedScalesCount: 2,
    status: 'مستقر',
    allergies: [
      {
        id: 'alg-3',
        substance: 'الأسبرين ومضادات الالتهاب غير الستيرويدية (NSAIDs)',
        severity: 'متوسطة',
        reaction: 'حموضة حادة وتهيج بالمعدة وضيق تنفس.'
      }
    ],
    chronicConditions: ['الربو القصبي التحسسي الخفيف'],
    currentMedications: ['بخاخ فنتولين عند اللزوم'],
    treatmentGoals: [
      {
        id: 'tg-panic-1',
        title: 'التعرف على الإشارات الجسدية لنوبات الهلع وممارسات التنفس البطني دون الهروب من الأماكن المغلقة',
        targetDate: '2026-10-25',
        status: 'قيد العمل',
        category: 'CBT'
      }
    ]
  },
  {
    id: 'pat-104',
    fileNumber: 'CM-2026-102',
    name: 'فيصل عبدالرحمن القحطاني',
    age: 31,
    gender: 'ذكر',
    phone: '0567788990',
    email: 'faisal.qahtani@example.com',
    primaryDiagnosis: 'اضطراب تشتت الانتباه وفرط الحركة للبالغين (Adult ADHD)',
    icd10Code: 'F90.0',
    riskLevel: 'منخفض',
    lastVisit: '2026-09-22',
    assignedDoctor: 'د. طارق الحكيم (استشاري الطب النفسي)',
    assignedDoctorId: 'doc-hakim',
    activeMedsCount: 1,
    completedScalesCount: 2,
    status: 'مستقر',
    allergies: [],
    chronicConditions: [],
    currentMedications: ['Concerta 36mg (Methylphenidate) قرص صباحاً']
  }
];

export const INITIAL_ASSESSMENT_RESULTS: ScaleAssessmentResult[] = [
  {
    id: 'res-01',
    patientId: 'pat-101',
    patientName: 'سارة خالد المنصور',
    scaleId: 'phq-9',
    scaleName: 'مقياس استبيان صحة المريض للاكتئاب (PHQ-9)',
    date: '2026-09-28',
    totalScore: 16,
    severity: {
      min: 15,
      max: 19,
      labelAr: 'اكتئاب متوسط إلى شديد (Moderately Severe)',
      badgeColor: 'orange',
      interpretation: 'معاناة سريرية واضحة تستدعي تدخلاً علاجياً متكاملاً دون تأخير.',
      clinicalAction: 'يوصى بالعلاج الدوائي المباشر (SSRIs) متزامناً مع جلسات العلاج النفسي المعرفي السلوكي.'
    },
    answers: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 1, 6: 2, 7: 2, 8: 1, 9: 1 },
    clinicianNotes: 'المريضة تشكو من تدني حاد في الدافعية وثقل حركي. البند 9 سجل (1) دون نية أو خطة مع روادع أسرية قوية.'
  },
  {
    id: 'res-02',
    patientId: 'pat-102',
    patientName: 'عبدالله محمد الشهري',
    scaleId: 'ybocs-ocd',
    scaleName: 'مقياس ييل-براون للوسواس القهري (Y-BOCS)',
    date: '2026-09-25',
    totalScore: 26,
    severity: {
      min: 24,
      max: 31,
      labelAr: 'وسواس قهري شديد (Severe OCD)',
      badgeColor: 'orange',
      interpretation: 'استنزاف يومي هائل وطقوس تكرارية خانقة تقيد حرية المريض بالكامل.',
      clinicalAction: 'علاج دوائي مكثف مع جلسات ERP مكثفة مرتين أسبوعياً.'
    },
    answers: { 1: 3, 2: 3, 3: 3, 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 2, 10: 2 },
    clinicianNotes: 'طقوس غسيل وتأكد متكررة تستغرق أكثر من 4 ساعات يومياً وتعطله عن عمله الصباحي.'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-2026-001',
    prescriptionNumber: 'RX-2026-98442-01',
    patientId: 'pat-101',
    patientName: 'سارة خالد المنصور',
    patientAge: 28,
    fileNumber: 'CM-2026-081',
    date: '2026-09-28',
    diagnosis: 'اضطراب الاكتئاب الجسيم (MDD)',
    icd10Code: 'F32.1',
    items: [
      {
        medId: 'escitalopram',
        genericName: 'Escitalopram',
        tradeName: 'Cipralex 10mg',
        dosage: '10 مجم (قرص واحد)',
        frequency: 'مرة واحدة يومياً صباحاً بعد الإفطار',
        duration: 'لمدة شهر (30 يوماً)',
        instructions: 'يؤخذ بانتظام دون انقطاع، مع الحذر من التوقف المفاجئ. المفعول يبدأ بعد 2-3 أسابيع.'
      }
    ],
    specialInstructions: 'مراجعة العيادة بعد 4 أسابيع لإعادة تقييم مقياس PHQ-9 وتعديل الجرعة إذا لزم.',
    doctorId: 'doc-hakim',
    doctorName: 'د. طارق الحكيم',
    licenseNumber: 'MD-PSY-98442',
    doctorSignature: 'د. طارق الحكيم — استشاري أول الطب النفسي',
    isOfficialStamped: true,
    status: 'نشطة'
  }
];
