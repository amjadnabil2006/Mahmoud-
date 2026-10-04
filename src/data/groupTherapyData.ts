import { GroupTherapyProgram, CustomFormField } from '../types';

export const INITIAL_GROUP_PROGRAMS: GroupTherapyProgram[] = [
  {
    id: 'grp-anxiety-cbt',
    titleAr: 'مجموعة مهارات التعايش والتحرر من القلق ونوبات الهلع',
    titleEn: 'CBT Skills for Anxiety & Panic Disorder Group',
    category: 'قلق وتوتر',
    descriptionAr: 'برنامج علاجي جماعي أسبوعي قائم على تقنيات العلاج المعرفي السلوكي (CBT)، يركز على كسر دائرة الخوف وتفكيك التفكير الكارثي في بيئة آمنة وداعمة وسرية تماماً.',
    leadDoctorId: 'doc-moayad',
    leadDoctorName: 'أ. محمد المؤيد',
    supervisorName: 'بروفيسور سيف الدين الميري',
    maxCapacity: 10,
    enrolledCount: 7,
    sessionsCount: 8,
    scheduleText: 'كل إثنين 07:00 م - 08:30 م (عن بعد)',
    priceUSD: 120,
    priceYER: 36000,
    priceSAR: 450,
    status: 'متاح للتسجيل',
    startDate: '2026-10-15',
    meetUrl: 'https://meet.google.com/cm-grp-anx',
    prerequisites: 'جلسة تقييم ومقابلة فرز أولية مع المعالج لضمان ملائمة المجموعة للحالة.',
    rulesAgreementAr: 'الالتزام التام بالسرية المطلقة وعدم إفشاء أي معلومات عن المشاركين أو تسجيل الصوت/الفيديو، واستخدام الاسم المستعار فقط داخل الجلسات.',
    participants: [
      { id: 'gp-1', aliasName: 'نسيم الأمل', joinedDate: '2026-09-28', attendanceCount: 2, paymentStatus: 'مدفوع', confidentialitySigned: true },
      { id: 'gp-2', aliasName: 'صابر 2026', joinedDate: '2026-09-29', attendanceCount: 2, paymentStatus: 'مدفوع', confidentialitySigned: true },
      { id: 'gp-3', aliasName: 'نور الهدوء', joinedDate: '2026-10-01', attendanceCount: 1, paymentStatus: 'مدفوع', confidentialitySigned: true },
      { id: 'gp-4', aliasName: 'الباحث عن السلام', joinedDate: '2026-10-02', attendanceCount: 1, paymentStatus: 'مدفوع', confidentialitySigned: true },
      { id: 'gp-5', aliasName: 'طائر الفينيق', joinedDate: '2026-10-02', attendanceCount: 0, paymentStatus: 'مدفوع', confidentialitySigned: true },
      { id: 'gp-6', aliasName: 'أفق جديد', joinedDate: '2026-10-03', attendanceCount: 0, paymentStatus: 'مدفوع', confidentialitySigned: true },
      { id: 'gp-7', aliasName: 'هدوء الليل', joinedDate: '2026-10-03', attendanceCount: 0, paymentStatus: 'مدفوع', confidentialitySigned: true }
    ],
    materials: [
      { id: 'mat-1', title: 'كتيب تفنيد الأفكار التلقائية السلبية والقلق', type: 'PDF', date: '2026-09-28' },
      { id: 'mat-2', title: 'سجل التدرج في مواجهة المثيرات المخيفة (Exposure Hierarchy)', type: 'PDF', date: '2026-10-01' }
    ],
    sessionNotes: [
      {
        sessionNumber: 1,
        date: '2026-09-29',
        groupSummary: 'التعارف ووضع ميثاق المجموعة، شرح نموذج CBT لدائرة القلق والأعراض الجسدية.',
        attendanceAliases: ['نسيم الأمل', 'صابر 2026', 'نور الهدوء']
      }
    ]
  },
  {
    id: 'grp-depression-hope',
    titleAr: 'مجموعة التفعيل السلوكي والتعافي من الاكتئاب (خطوة بخطوة)',
    titleEn: 'Behavioral Activation & Depression Recovery Group',
    category: 'اكتئاب وخسارة',
    descriptionAr: 'برنامج تفاعلي لدعم استعادة الشغف والنشاط وبناء الروتين اليومي الإيجابي وتجاوز مشاعر العزلة واليأس بمشاركة زملاء يمرون بنفس التجربة.',
    leadDoctorId: 'doc-amer',
    leadDoctorName: 'د. محمد عامر',
    supervisorName: 'د. سهام',
    maxCapacity: 8,
    enrolledCount: 5,
    sessionsCount: 6,
    scheduleText: 'كل أربعاء 06:00 م - 07:30 م (عن بعد)',
    priceUSD: 99,
    priceYER: 29700,
    priceSAR: 370,
    status: 'متاح للتسجيل',
    startDate: '2026-10-20',
    meetUrl: 'https://meet.google.com/cm-grp-dep',
    prerequisites: 'تطبيق مقياس PHQ-9 وتأكيد عدم وجود خطر انتحاري حاد نشط.',
    rulesAgreementAr: 'ميثاق السرية التامة والاحترام المتبادل، ومنع أي توجيه للأحكام أو اللوم بين المشاركين.',
    participants: [
      { id: 'gp-10', aliasName: 'شمس الغد', joinedDate: '2026-09-30', attendanceCount: 1, paymentStatus: 'مدفوع', confidentialitySigned: true },
      { id: 'gp-11', aliasName: 'غيث الخير', joinedDate: '2026-10-01', attendanceCount: 1, paymentStatus: 'مدفوع', confidentialitySigned: true },
      { id: 'gp-12', aliasName: 'قلب قوي', joinedDate: '2026-10-02', attendanceCount: 0, paymentStatus: 'مدفوع', confidentialitySigned: true },
      { id: 'gp-13', aliasName: 'أمل متجدد', joinedDate: '2026-10-02', attendanceCount: 0, paymentStatus: 'مدفوع', confidentialitySigned: true },
      { id: 'gp-14', aliasName: 'بصيص نور', joinedDate: '2026-10-03', attendanceCount: 0, paymentStatus: 'مدفوع', confidentialitySigned: true }
    ],
    materials: [
      { id: 'mat-3', title: 'جدول التفعيل السلوكي اليومي ومقياس المتعة والإنجاز', type: 'PDF', date: '2026-09-30' }
    ]
  },
  {
    id: 'grp-family-support',
    titleAr: 'حلقة دعم وتوجيه أسر المرضى النفسيين (الإرشاد والمساندة)',
    titleEn: 'Caregivers & Family Support Circle',
    category: 'دعم أسري',
    descriptionAr: 'مجموعة إرشادية وتثقيفية مخصصة لأفراد أسر ومقدمي الرعاية لمن يعانون من اضطرابات نفسية مزمنة، لتخفيف العبء النفسي واكتساب أساليب التعامل السليمة.',
    leadDoctorId: 'doc-yosra',
    leadDoctorName: 'أ. يسرا علي',
    supervisorName: 'د. سهام',
    maxCapacity: 12,
    enrolledCount: 9,
    sessionsCount: 6,
    scheduleText: 'كل سبت 05:00 م - 06:30 م (عن بعد)',
    priceUSD: 75,
    priceYER: 22500,
    priceSAR: 280,
    status: 'قيد الانعقاد',
    startDate: '2026-10-01',
    meetUrl: 'https://meet.google.com/cm-grp-fam',
    prerequisites: 'أن يكون المشارك من أفراد أسرة شخص يتلقى رعاية نفسية.',
    rulesAgreementAr: 'السرية والخصوصية التامة لجميع الحكايات والتجارب الأسرية المطروحة.',
    participants: [
      { id: 'gp-20', aliasName: 'أم محمد', joinedDate: '2026-09-25', attendanceCount: 2, paymentStatus: 'مدفوع', confidentialitySigned: true },
      { id: 'gp-21', aliasName: 'أبو فهد', joinedDate: '2026-09-25', attendanceCount: 2, paymentStatus: 'مدفوع', confidentialitySigned: true },
      { id: 'gp-22', aliasName: 'سند الأسرة', joinedDate: '2026-09-26', attendanceCount: 2, paymentStatus: 'مدفوع', confidentialitySigned: true }
    ]
  }
];

export const INITIAL_CUSTOM_FORM_FIELDS: CustomFormField[] = [
  {
    id: 'fld-1',
    label: 'هل سبق لك تجربة العلاج النفسي أو تناول أدوية نفسية من قبل؟',
    type: 'select',
    targetForm: 'client_intake',
    options: ['نعم - علاج دوائي فقط', 'نعم - جلسات كلامية فقط', 'نعم - كلاهما معاً', 'لا - هذه أول تجربة لي'],
    isRequired: true
  },
  {
    id: 'fld-2',
    label: 'مستوى الدافعية للالتزام بالخطة السلوكية المنزلية (من 1 إلى 10)',
    type: 'scale_1_10',
    targetForm: 'first_session',
    isRequired: true
  },
  {
    id: 'fld-3',
    label: 'أهم هدف شخصي تتمنى تحقيقه بنهاية الجلسات العلاجية',
    type: 'textarea',
    targetForm: 'client_intake',
    isRequired: false,
    placeholder: 'اكتب باختصار ما تتمنى أن يتغير في حياتك...'
  },
  {
    id: 'fld-4',
    label: 'مدى تحسن الأعراض الجسدية المصاحبة للتوتر منذ الجلسة السابقة',
    type: 'select',
    targetForm: 'followup_session',
    options: ['تحسن ملحوظ جداً (+50%)', 'تحسن طفيف', 'لا تغيير', 'زيادة في حدة الأعراض'],
    isRequired: false
  }
];
