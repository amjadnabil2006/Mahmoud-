import { Patient, ScaleAssessmentResult, Prescription } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-101',
    fileNumber: 'CM-2026-081',
    name: 'سارة خالد المنصور',
    age: 28,
    gender: 'أنثى',
    phone: '0501234567',
    primaryDiagnosis: 'اضطراب الاكتئاب الجسيم (MDD) مع قلق ثانوي',
    riskLevel: 'متوسط',
    lastVisit: '2026-09-28',
    assignedDoctor: 'د. طارق الحكيم (استشاري الطب النفسي)',
    activeMedsCount: 2,
    completedScalesCount: 3,
    status: 'قيد المتابعة المكثفة'
  },
  {
    id: 'pat-102',
    fileNumber: 'CM-2026-089',
    name: 'عبدالله محمد الشهري',
    age: 34,
    gender: 'ذكر',
    phone: '0559876543',
    primaryDiagnosis: 'اضطراب الوسواس القهري (OCD) وأرق مزمن',
    riskLevel: 'منخفض',
    lastVisit: '2026-09-25',
    assignedDoctor: 'د. طارق الحكيم (استشاري الطب النفسي)',
    activeMedsCount: 1,
    completedScalesCount: 4,
    status: 'نشط'
  },
  {
    id: 'pat-103',
    fileNumber: 'CM-2026-094',
    name: 'ريما فهد السديري',
    age: 22,
    gender: 'أنثى',
    phone: '0533344556',
    primaryDiagnosis: 'اضطراب الهلع (Panic Disorder) مع رهاب الساح',
    riskLevel: 'منخفض',
    lastVisit: '2026-09-29',
    assignedDoctor: 'أ. مها الغامدي (أخصائية العلاج النفسي)',
    activeMedsCount: 1,
    completedScalesCount: 2,
    status: 'مستقر'
  },
  {
    id: 'pat-104',
    fileNumber: 'CM-2026-102',
    name: 'فيصل عبدالرحمن القحطاني',
    age: 31,
    gender: 'ذكر',
    phone: '0567788990',
    primaryDiagnosis: 'اضطراب تشتت الانتباه وفرط الحركة للبالغين (Adult ADHD)',
    riskLevel: 'منخفض',
    lastVisit: '2026-09-22',
    assignedDoctor: 'د. طارق الحكيم (استشاري الطب النفسي)',
    activeMedsCount: 1,
    completedScalesCount: 2,
    status: 'مستقر'
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
    patientId: 'pat-101',
    patientName: 'سارة خالد المنصور',
    patientAge: 28,
    fileNumber: 'CM-2026-081',
    date: '2026-09-28',
    diagnosis: 'اضطراب الاكتئاب الجسيم (MDD)',
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
    doctorName: 'د. طارق الحكيم',
    licenseNumber: 'MD-PSY-98442'
  }
];
