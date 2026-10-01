import { 
  Patient, 
  Doctor, 
  Appointment, 
  Prescription, 
  ScaleAssessmentResult, 
  ChatMessage, 
  AuditLog, 
  ClinicAnalytics,
  TherapyExercise,
  BookingTransaction,
  AppNotification
} from '../types';

import { INITIAL_PATIENTS, INITIAL_ASSESSMENT_RESULTS, INITIAL_PRESCRIPTIONS } from '../data/mockPatients';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'د. طارق الحكيم',
    title: 'استشاري أول الطب النفسي والتشخيص الإكلينيكي',
    departmentId: 'psychiatry',
    specialty: 'استشاري الطب النفسي',
    licenseNumber: 'MD-PSY-98442',
    phone: '0505112233',
    email: 'dr.tareq@coolmind.clinic',
    avatar: '/src/assets/images/dr_tariq_avatar_1790811098620.jpg',
    bio: 'استشاري معتمد بخبرة 16 عاماً في تشخيص وعلاج الاكتئاب المقاوم، اضطرابات القلق، اضطراب ثنائي القطب والوسواس، خبير بروتوكولات الأدوية النفسية الحديثة.',
    rating: 4.9,
    reviewsCount: 384,
    experienceYears: 16,
    priceSAR: 350,
    priceUSD: 93,
    activePatientsCount: 42,
    availableDays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
    nextAvailableSlot: 'اليوم · 04:30 م',
    languages: ['العربية', 'الإنجليزية']
  },
  {
    id: 'doc-2',
    name: 'أ. مها الغامدي',
    title: 'أخصائية أولى في العلاج النفسي المعرفي السلوكي (CBT) وعلاج الصدمات (EMDR)',
    departmentId: 'psychotherapy',
    specialty: 'أخصائي أول علاج نفسي',
    licenseNumber: 'CP-THER-44102',
    phone: '0505445566',
    email: 'maha.ghamdi@coolmind.clinic',
    avatar: '/src/assets/images/ms_maha_avatar_1790811107885.jpg',
    bio: 'أخصائية مرخصة متخصصة في علاج الصدمات النفسية، نوبات الهلع، الفوبيا، الرهاب الاجتماعي، وإعادة بناء التقدير الذاتي بتقنيات حديثة قائمة على الدليل.',
    rating: 4.9,
    reviewsCount: 295,
    experienceYears: 11,
    priceSAR: 280,
    priceUSD: 75,
    activePatientsCount: 36,
    availableDays: ['الأحد', 'الثلاثاء', 'الأربعاء', 'الخميس'],
    nextAvailableSlot: 'غداً · 05:00 م',
    languages: ['العربية', 'الإنجليزية']
  },
  {
    id: 'doc-3',
    name: 'أ. ريم الزهراني',
    title: 'استشارية التغذية العلاجية النفسية ومحور الأمعاء-الدماغ (Nutritional Psychiatry)',
    departmentId: 'nutrition',
    specialty: 'أخصائي تغذية علاجية',
    licenseNumber: 'CN-NUT-33190',
    phone: '0505778899',
    email: 'reem.zahrani@coolmind.clinic',
    avatar: '/src/assets/images/ms_reem_avatar_1790811117719.jpg',
    bio: 'متخصصة في علاج اضطرابات الأكل (القهم والشره)، وربط الميكروبيوم بالأمراض العصبية وتثبيط الآثار الجانبية الأيضية لمضادات الذهان والاكتئاب.',
    rating: 4.8,
    reviewsCount: 168,
    experienceYears: 8,
    priceSAR: 220,
    priceUSD: 59,
    activePatientsCount: 22,
    availableDays: ['الاثنين', 'الثلاثاء', 'الخميس'],
    nextAvailableSlot: 'الخميس · 06:30 م',
    languages: ['العربية', 'الإنجليزية']
  },
  {
    id: 'doc-4',
    name: 'أ. عبدالعزيز التميمي',
    title: 'استشاري الخدمة الاجتماعية النفسية والإرشاد الأسري والتأهيل',
    departmentId: 'social_work',
    specialty: 'أخصائي خدمة اجتماعية ونفسية',
    licenseNumber: 'SW-SOC-11082',
    phone: '0505990011',
    email: 'aziz.tamimi@coolmind.clinic',
    avatar: '/src/assets/images/mr_abdulaziz_avatar_1790811127736.jpg',
    bio: 'خبير العلاقات الأسرية ودعم بيئة المريض النفسي، حل النزاعات الزوجية، ومساعدة المتعافين على العودة للبيئة الوظيفية والمجتمعية بدون وصمة.',
    rating: 4.7,
    reviewsCount: 142,
    experienceYears: 13,
    priceSAR: 200,
    priceUSD: 53,
    activePatientsCount: 27,
    availableDays: ['الأحد', 'الاثنين', 'الأربعاء'],
    nextAvailableSlot: 'الأحد القادم · 04:00 م',
    languages: ['العربية']
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-2026-101',
    patientId: 'pat-101',
    patientName: 'سارة خالد المنصور',
    doctorId: 'doc-1',
    doctorName: 'د. طارق الحكيم',
    departmentName: 'قسم الطب النفسي والاستشارات الإكلينيكية',
    date: '2026-10-02',
    time: '04:30 مساءً',
    type: 'جلسة عن بُعد (فيديو)',
    status: 'قادم',
    sessionGoal: 'مراجعة الاستجابة لعقار Cipralex وإعادة تطبيق مقياس PHQ-9',
    meetUrl: 'https://meet.google.com/cm-psy-984',
    paymentStatus: 'مدفوع بالكامل',
    paymentMethod: 'PayPal',
    amountSAR: 350,
    transactionId: 'TXN-PAYPAL-881920',
    notes: 'تم إرسال رابط Google Meet المشفر للمريض وتأكيد الموعد.'
  },
  {
    id: 'apt-2026-102',
    patientId: 'pat-102',
    patientName: 'عبدالله محمد الشهري',
    doctorId: 'doc-1',
    doctorName: 'د. طارق الحكيم',
    departmentName: 'قسم الطب النفسي والاستشارات الإكلينيكية',
    date: '2026-10-04',
    time: '06:00 مساءً',
    type: 'حضوري بالعيادة',
    status: 'مؤكد',
    sessionGoal: 'جلسة التعرض ومنع الاستجابة (ERP) لطقوس النظافة والترتيب',
    paymentStatus: 'مدفوع بالكامل',
    paymentMethod: 'مدى (Mada)',
    amountSAR: 350,
    transactionId: 'TXN-MADA-552140',
  },
  {
    id: 'apt-2026-103',
    patientId: 'pat-103',
    patientName: 'ريما فهد السديري',
    doctorId: 'doc-2',
    doctorName: 'أ. مها الغامدي',
    departmentName: 'قسم العلاج النفسي وتعديل السلوك',
    date: '2026-10-05',
    time: '05:00 مساءً',
    type: 'جلسة عن بُعد (فيديو)',
    status: 'قادم',
    sessionGoal: 'تمارين التعامل مع نوبات الهلع وتفكيك التفكير الكارثي',
    meetUrl: 'https://meet.google.com/cm-emdr-441',
    paymentStatus: 'مدفوع بالكامل',
    paymentMethod: 'Apple Pay',
    amountSAR: 280,
    transactionId: 'TXN-APPLE-330192',
  }
];

export const INITIAL_EXERCISES: TherapyExercise[] = [
  {
    id: 'ex-1',
    titleAr: 'تمرين التنفس الرئوي المربع (Box Breathing 4-4-4-4)',
    category: 'تنفس واسترخاء',
    durationMinutes: 5,
    isCompletedToday: true,
    instructions: 'شهيق لـ 4 ثوانٍ، حبس النفس لـ 4 ثوانٍ، زفير لـ 4 ثوانٍ، استراحة لـ 4 ثوانٍ. يهدئ العصب الحائر ويخفض هرمون الكورتيزول.'
  },
  {
    id: 'ex-2',
    titleAr: 'سجل تفنيد الأفكار التلقائية السلبية (CBT Thought Record)',
    category: 'سجل أفكار معرفي (CBT)',
    durationMinutes: 10,
    isCompletedToday: false,
    instructions: 'سجل الموقف الذي أثار ضيقك، الفكرة المشوهة التلقائية، والدليل المعاكس الواقعي مع صياغة فكرة بديلة متوازنة.'
  },
  {
    id: 'ex-3',
    titleAr: 'مسح الجسد واليقظة الذهنية (Body Scan for Stress Release)',
    category: 'يقظة ذهنية (Mindfulness)',
    durationMinutes: 12,
    isCompletedToday: false,
    instructions: 'التركيز على إرخاء عضلات الكتفين والفك والجبين مع ملاحظة الإحساس الجسدي دون إطلاق أحكام.'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  // Conversation with Dr. Tariq Al-Hakim (Psychiatry)
  {
    id: 'msg-1',
    senderId: 'doc-1',
    senderName: 'د. طارق الحكيم',
    senderRole: 'doctor',
    doctorId: 'doc-1',
    doctorName: 'د. طارق الحكيم',
    patientId: 'pat-101',
    text: 'أهلاً بك يا سارة، كيف تسير الأمور مع جرعة دواء سيبرالكس في الأيام الثلاثة الأخيرة؟',
    timestamp: '2026-09-29T10:15:00Z',
    isRead: true
  },
  {
    id: 'msg-2',
    senderId: 'pat-101',
    senderName: 'سارة خالد المنصور',
    senderRole: 'patient',
    doctorId: 'doc-1',
    doctorName: 'د. طارق الحكيم',
    patientId: 'pat-101',
    text: 'أهلاً دكتور، الغثيان الخفيف اختفى تماماً وبدأت أشعر بتحسن بسيط في ساعات الصباح، وأتممت تمرين التنفس اليومي.',
    timestamp: '2026-09-29T10:22:00Z',
    isRead: true
  },
  {
    id: 'msg-3',
    senderId: 'doc-1',
    senderName: 'د. طارق الحكيم',
    senderRole: 'doctor',
    doctorId: 'doc-1',
    doctorName: 'د. طارق الحكيم',
    patientId: 'pat-101',
    text: 'ممتاز جداً ومبشر، استمري على نفس الجرعة وسنراجع مقياس PHQ-9 في جلستنا القادمة يوم الأربعاء عبر Google Meet.',
    timestamp: '2026-09-29T10:30:00Z',
    isRead: true
  },

  // Conversation with Ms. Maha Al-Ghamdi (Psychotherapy CBT)
  {
    id: 'msg-4',
    senderId: 'doc-2',
    senderName: 'أ. مها الغامدي',
    senderRole: 'doctor',
    doctorId: 'doc-2',
    doctorName: 'أ. مها الغامدي',
    patientId: 'pat-101',
    text: 'مرحباً سارة، هل تمكنتِ من تدوين الأفكار التلقائية السلبية في مفكرة CBT لهذا الأسبوع؟',
    timestamp: '2026-09-29T14:10:00Z',
    isRead: true
  },
  {
    id: 'msg-5',
    senderId: 'pat-101',
    senderName: 'سارة خالد المنصور',
    senderRole: 'patient',
    doctorId: 'doc-2',
    doctorName: 'أ. مها الغامدي',
    patientId: 'pat-101',
    text: 'نعم أستاذة مها، دونت ثلاثة مواقف شعرت فيها بالقلق الاجتماعي وحاولت كتابة أفكار بديلة منطقية.',
    timestamp: '2026-09-29T14:45:00Z',
    isRead: true
  },
  {
    id: 'msg-6',
    senderId: 'doc-2',
    senderName: 'أ. مها الغامدي',
    senderRole: 'doctor',
    doctorId: 'doc-2',
    doctorName: 'أ. مها الغامدي',
    patientId: 'pat-101',
    text: 'رائع جداً! هذا تقدم ملموس في تفكيك التفكير الكارثي، سنناقشها سوياً في جلستنا الافتراضية القادمة.',
    timestamp: '2026-09-29T15:00:00Z',
    isRead: true
  },

  // Conversation with Ms. Reem Al-Zahrani (Nutritional Psychiatry)
  {
    id: 'msg-7',
    senderId: 'doc-3',
    senderName: 'أ. ريم الزهراني',
    senderRole: 'doctor',
    doctorId: 'doc-3',
    doctorName: 'أ. ريم الزهراني',
    patientId: 'pat-101',
    text: 'السلام عليكم سارة، راجعت جدولك الغذائي الداعم لمحور الأمعاء-الدماغ، كيف كانت استجابة جهازك الهضمي للألياف المخمرة والبروبيوتيك؟',
    timestamp: '2026-09-28T11:20:00Z',
    isRead: true
  },
  {
    id: 'msg-8',
    senderId: 'pat-101',
    senderName: 'سارة خالد المنصور',
    senderRole: 'patient',
    doctorId: 'doc-3',
    doctorName: 'أ. ريم الزهراني',
    patientId: 'pat-101',
    text: 'وعليكم السلام، الانتفاخ قلّ كثيراً وطاقتي في فترة بعد الظهر أصبحت أفضل مع تقليل السكريات المكررة.',
    timestamp: '2026-09-28T12:05:00Z',
    isRead: true
  },
  {
    id: 'msg-9',
    senderId: 'doc-3',
    senderName: 'أ. ريم الزهراني',
    senderRole: 'doctor',
    doctorId: 'doc-3',
    doctorName: 'أ. ريم الزهراني',
    patientId: 'pat-101',
    text: 'أخبار سارة جداً! سنضيف مصادر غنية بالمغنيسيوم وأوميغا-3 لدعم تصنيع السيروتونين الطبيعي.',
    timestamp: '2026-09-28T12:30:00Z',
    isRead: true
  },

  // Conversation with Mr. Abdulaziz Al-Tamimi (Psychiatric Social Work)
  {
    id: 'msg-10',
    senderId: 'doc-4',
    senderName: 'أ. عبدالعزيز التميمي',
    senderRole: 'doctor',
    doctorId: 'doc-4',
    doctorName: 'أ. عبدالعزيز التميمي',
    patientId: 'pat-101',
    text: 'أهلاً سارة، كيف تسير خطة إعادة ترتيب بيئة العمل والتواصل الصحي مع الأسرة؟ فريقنا الاجتماعي متواجد دائماً لمساندتك.',
    timestamp: '2026-09-27T16:00:00Z',
    isRead: true
  },
  {
    id: 'msg-11',
    senderId: 'pat-101',
    senderName: 'سارة خالد المنصور',
    senderRole: 'patient',
    doctorId: 'doc-4',
    doctorName: 'أ. عبدالعزيز التميمي',
    patientId: 'pat-101',
    text: 'شكراً أستاذ عبدالعزيز، تحدثت مع أسرتي حول حاجتي لأوقات راحة وبدأوا يتفهمون الخطة العلاجية بشكل ممتاز.',
    timestamp: '2026-09-27T16:30:00Z',
    isRead: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-30 15:05:12',
    actorName: 'د. طارق الحكيم',
    actorRole: 'استشاري الطب النفسي',
    action: 'إصدار وصفة طبية نفسية E-Prescription',
    target: 'المريضة سارة المنصور (CM-2026-081)',
    ipAddress: '192.168.1.45',
    status: 'نجاح'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-30 14:48:30',
    actorName: 'سارة المنصور',
    actorRole: 'مريض / عميل',
    action: 'إتمام مقياس استبيان الاكتئاب (PHQ-9)',
    target: 'النتيجة: 16 نقطة (اكتئاب متوسط إلى شديد)',
    ipAddress: '176.44.201.88',
    status: 'نجاح'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-30 13:20:10',
    actorName: 'أ. مها الغامدي',
    actorRole: 'أخصائية علاج نفسي',
    action: 'اعتماد ملاحظة الجلسة العلاجية (SOAP Note)',
    target: 'المريض عبدالله الشهري (CM-2026-089)',
    ipAddress: '192.168.1.52',
    status: 'نجاح'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-30 11:10:05',
    actorName: 'بوابة الدفع الإلكتروني (PayPal & Mada Gate)',
    actorRole: 'Payment Service',
    action: 'معالجة وتأكيد سداد جلسة فيديو وتوليد رابط Google Meet',
    target: 'المعاملة: TXN-PAYPAL-881920 بمبلغ 350 ر.س',
    ipAddress: '54.210.12.98',
    status: 'نجاح'
  }
];

export const INITIAL_ANALYTICS: ClinicAnalytics = {
  totalPatients: 148,
  totalDoctors: 12,
  monthlySessions: 420,
  totalPrescriptions: 215,
  recoveryRatePercent: 78.4,
  highRiskAlerts: 4,
  monthlyRevenueSAR: 284500
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'موعد استشارة مؤكد عبر Google Meet',
    description: 'تم تأكيد موعد جلستك مع د. طارق الحكيم يوم الأربعاء 05:00 مساءً بنجاح.',
    timestamp: '2026-09-30 15:20',
    type: 'appointment',
    isRead: false,
    meetUrl: 'https://meet.google.com/cm-med-2026'
  },
  {
    id: 'notif-2',
    title: 'إيصال سداد إلكتروني (PayPal)',
    description: 'تم سداد رسوم الاستشارة الطبية بمبلغ 350 ر.س بنجاح.',
    timestamp: '2026-09-30 15:18',
    type: 'payment',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'رسالة إكلينيكية جديدة من الطبيب',
    description: 'د. طارق الحكيم: مرحباً بك سارة، أرجو تجهيز نتائج الفحص قبل الجلسة.',
    timestamp: '2026-09-30 14:45',
    type: 'chat',
    isRead: false
  },
  {
    id: 'notif-4',
    title: 'تذكير بالفحص التشخيصي الذاتي',
    description: 'يمكنك إتمام مقياس PHQ-9 لمقارنة مؤشرات التحسن قبل الجلسة.',
    timestamp: '2026-09-30 12:00',
    type: 'scale',
    isRead: true
  }
];

// Storage helper functions
const getStorage = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(`coolmind_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const setStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`coolmind_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
};

export const generateUniqueId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const generateGoogleMeetUrl = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const segment1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const segment2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const segment3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `https://meet.google.com/${segment1}-${segment2}-${segment3}`;
};

// Simulated API Client with latency and persistence
export const api = {
  patients: {
    getAll: async (): Promise<Patient[]> => {
      return getStorage('patients', INITIAL_PATIENTS);
    },
    saveAll: async (data: Patient[]): Promise<void> => {
      setStorage('patients', data);
    },
    create: async (patient: Omit<Patient, 'id'>): Promise<Patient> => {
      const all = getStorage('patients', INITIAL_PATIENTS);
      const newPatient: Patient = {
        ...patient,
        id: generateUniqueId('pat')
      };
      all.unshift(newPatient);
      setStorage('patients', all);
      return newPatient;
    }
  },

  doctors: {
    getAll: async (): Promise<Doctor[]> => {
      return getStorage('doctors', INITIAL_DOCTORS);
    },
    getByDepartment: async (deptId: string): Promise<Doctor[]> => {
      const all = getStorage('doctors', INITIAL_DOCTORS);
      return all.filter(d => d.departmentId === deptId);
    },
    saveAll: async (data: Doctor[]): Promise<void> => {
      setStorage('doctors', data);
    },
    create: async (doc: Omit<Doctor, 'id'>): Promise<Doctor> => {
      const all = getStorage('doctors', INITIAL_DOCTORS);
      const newDoc: Doctor = {
        ...doc,
        id: generateUniqueId('doc')
      };
      all.unshift(newDoc);
      setStorage('doctors', all);
      return newDoc;
    }
  },

  appointments: {
    getAll: async (): Promise<Appointment[]> => {
      return getStorage('appointments', INITIAL_APPOINTMENTS);
    },
    create: async (apt: Omit<Appointment, 'id' | 'meetUrl'>): Promise<Appointment> => {
      const all = getStorage('appointments', INITIAL_APPOINTMENTS);
      const newApt: Appointment = {
        ...apt,
        id: generateUniqueId('apt'),
        meetUrl: apt.type === 'جلسة عن بُعد (فيديو)' ? generateGoogleMeetUrl() : undefined
      };
      all.unshift(newApt);
      setStorage('appointments', all);
      return newApt;
    },
    updateStatus: async (id: string, status: Appointment['status']): Promise<void> => {
      const all = getStorage('appointments', INITIAL_APPOINTMENTS);
      const updated = all.map(a => a.id === id ? { ...a, status } : a);
      setStorage('appointments', updated);
    }
  },

  prescriptions: {
    getAll: async (): Promise<Prescription[]> => {
      return getStorage('prescriptions', INITIAL_PRESCRIPTIONS);
    },
    create: async (rx: Prescription): Promise<Prescription> => {
      const all = getStorage('prescriptions', INITIAL_PRESCRIPTIONS);
      all.unshift(rx);
      setStorage('prescriptions', all);
      return rx;
    }
  },

  scales: {
    getResults: async (): Promise<ScaleAssessmentResult[]> => {
      return getStorage('scale_results', INITIAL_ASSESSMENT_RESULTS);
    },
    saveResult: async (res: ScaleAssessmentResult): Promise<ScaleAssessmentResult> => {
      const all = getStorage('scale_results', INITIAL_ASSESSMENT_RESULTS);
      all.unshift(res);
      setStorage('scale_results', all);
      return res;
    }
  },

  messages: {
    getAll: async (): Promise<ChatMessage[]> => {
      const all = getStorage('messages', INITIAL_MESSAGES);
      const seen = new Set<string>();
      const deduplicated: ChatMessage[] = [];
      let hasDuplicates = false;

      for (const m of all) {
        if (!m.id || seen.has(m.id)) {
          hasDuplicates = true;
          const freshId = generateUniqueId('msg');
          seen.add(freshId);
          deduplicated.push({ ...m, id: freshId });
        } else {
          seen.add(m.id);
          deduplicated.push(m);
        }
      }

      if (hasDuplicates) {
        setStorage('messages', deduplicated);
      }
      return deduplicated;
    },
    send: async (msg: Omit<ChatMessage, 'id' | 'timestamp'> & Partial<Pick<ChatMessage, 'id' | 'timestamp'>>): Promise<ChatMessage> => {
      const all = getStorage('messages', INITIAL_MESSAGES);
      const newMsg: ChatMessage = {
        ...msg,
        id: generateUniqueId('msg'),
        timestamp: new Date().toISOString()
      };
      all.push(newMsg);
      setStorage('messages', all);
      return newMsg;
    }
  },

  exercises: {
    getAll: async (): Promise<TherapyExercise[]> => {
      return getStorage('exercises', INITIAL_EXERCISES);
    },
    toggleComplete: async (id: string): Promise<TherapyExercise[]> => {
      const all = getStorage('exercises', INITIAL_EXERCISES);
      const updated = all.map(e => e.id === id ? { ...e, isCompletedToday: !e.isCompletedToday } : e);
      setStorage('exercises', updated);
      return updated;
    }
  },

  analytics: {
    getKPIs: async (): Promise<ClinicAnalytics> => {
      return INITIAL_ANALYTICS;
    }
  },

  auditLogs: {
    getAll: async (): Promise<AuditLog[]> => {
      return getStorage('audit_logs', INITIAL_AUDIT_LOGS);
    },
    log: async (entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> => {
      const all = getStorage('audit_logs', INITIAL_AUDIT_LOGS);
      const newEntry: AuditLog = {
        ...entry,
        id: 'log-' + Date.now(),
        timestamp: new Date().toLocaleString('sv').replace('T', ' ')
      };
      all.unshift(newEntry);
      setStorage('audit_logs', all.slice(0, 50));
    }
  },

  notifications: {
    getAll: async (): Promise<AppNotification[]> => {
      const all = getStorage('notifications', INITIAL_NOTIFICATIONS);
      const seen = new Set<string>();
      const deduplicated: AppNotification[] = [];
      let hasDuplicates = false;

      for (const n of all) {
        if (!n.id || seen.has(n.id)) {
          hasDuplicates = true;
          const freshId = generateUniqueId('notif');
          seen.add(freshId);
          deduplicated.push({ ...n, id: freshId });
        } else {
          seen.add(n.id);
          deduplicated.push(n);
        }
      }

      if (hasDuplicates) {
        setStorage('notifications', deduplicated);
      }
      return deduplicated;
    },
    add: async (notif: Omit<AppNotification, 'id' | 'timestamp'>): Promise<AppNotification> => {
      const all = await api.notifications.getAll();
      const newNotif: AppNotification = {
        ...notif,
        id: generateUniqueId('notif'),
        timestamp: new Date().toISOString()
      };
      all.unshift(newNotif);
      setStorage('notifications', all);
      return newNotif;
    },
    markAllAsRead: async (): Promise<AppNotification[]> => {
      const all = await api.notifications.getAll();
      const updated = all.map(n => ({ ...n, isRead: true }));
      setStorage('notifications', updated);
      return updated;
    }
  }
};
