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
  AppNotification,
  ClinicSettings
} from '../types';

import { INITIAL_PATIENTS, INITIAL_ASSESSMENT_RESULTS, INITIAL_PRESCRIPTIONS } from '../data/mockPatients';
import { Department, CLINICAL_DEPARTMENTS } from '../data/departments';

export const INITIAL_SETTINGS: ClinicSettings = {
  // Identity & Contact
  clinicNameAr: 'مركز CoolMind للرعاية النفسية والاستشارات المتكاملة',
  clinicNameEn: 'CoolMind Center for Psychological & Integrative Care',
  clinicAddress: 'المركز الرئيسي: صنعاء - حدة · المملكة العربية السعودية: الرياض · استشارات دولية عن بُعد',
  clinicEmail: 'info@coolmindcenter.com',
  domainName: 'coolmindcenter.com',
  infoEmail: 'info@coolmindcenter.com',
  bookingEmail: 'booking@coolmindcenter.com',
  supportEmail: 'support@coolmindcenter.com',
  reportsEmail: 'reports@coolmindcenter.com',
  doctorsEmail: 'doctors@coolmindcenter.com',
  webmailUrl: 'https://cpl102.main-hosting.eu:2096/',
  emergencyPhone: '+967770112233',
  whatsappPhone: '+967770112233',
  workingHoursAr: 'يومياً على مدار 24 ساعة (استشارات حضورية وعن بعد)',
  defaultCurrency: 'USD',

  // Hero Section
  heroHeadline: 'الرعاية النفسية المتكاملة.. تشخيص طبي، علاج معرفي، وتغذية متخصصة',
  heroSubtitle: 'نخبة من الاستشاريين المرخصين في الطب النفسي، العلاج السلوكي المعرفي CBT، التغذية العصبية، والخدمة الاجتماعية في بيئة آمنة وسرية تماماً.',
  heroBadge1: 'أطباء واستشاريون مرخصون',
  heroBadge2: 'سرية طبية مشفرة HIPAA',
  heroBadge3: 'حجز فوري ومواعيد مرنة',
  heroBadge4: 'استشارات حضورية وأونلاين',
  showHeroStats: true,

  // Announcement Banner
  showAnnouncementBanner: true,
  announcementText: '🌟 عياداتنا معتمدة من الهيئة السعودية للتخصصات الصحية ومتوافقة مع معايير الأمان الطبي HIPAA و GDPR.',
  announcementType: 'info',

  // Crisis & Emergency Banner
  showEmergencyBanner: false,
  emergencyBannerTitle: 'خط الدعم والمساعدة النفسية والاستشارات الفورية 24/7',
  emergencyBannerSubtitle: 'فريق طوارئ وتدخل نفسي سريع متاح على مدار الساعة للحالات الحرجة ونوبات الهلع',
  emergencyHotline: '920000000',

  // Self-Diagnostic Banner
  showSelfDiagnosticBanner: true,
  selfDiagnosticTitle: 'اختبارات ومقاييس التقييم الذاتي المعتمدة سريرياً',
  selfDiagnosticSubtitle: 'اكتشف مستوى القلق، الاكتئاب، أو اضطراب النوم بمقاييس علمية دقيقة ونتائج فورية مجاناً',

  // Sections Visibility
  showDepartmentsSection: true,
  showDoctorsSection: true,
  showFaqSection: true,
  showTestimonialsSection: true,
  showFooterSocials: true,

  // Policies & Booking Pricing
  consultationDiscountPercent: 10,
  enableOnlinePayment: true,
  cancellationPolicyAr: 'إمكانية الإلغاء أو إعادة الجدولة مجاناً قبل 4 ساعات من موعد الجلسة',

  // Social Links & Footer
  twitterUrl: 'https://twitter.com/coolmind_clinic',
  instagramUrl: 'https://instagram.com/coolmind_clinic',
  linkedinUrl: 'https://linkedin.com/company/coolmind-clinic',
  youtubeUrl: 'https://youtube.com/@coolmind_clinic',
  footerTextAr: 'المنظومة النفسية الإكلينيكية الرقمية الرائدة في الرعاية التخصصية المتكاملة بالمملكة والشرق الأوسط.',
  copyrightTextAr: 'جميع الحقوق محفوظة © CoolMind Clinic'
};

import { OFFICIAL_DOCTORS_TEAM, OFFICIAL_THERAPY_PACKAGES, VALID_COUPONS, INITIAL_INVOICES, INITIAL_REVIEWS } from '../data/packagesAndCoupons';

export const INITIAL_DOCTORS: Doctor[] = OFFICIAL_DOCTORS_TEAM;

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-2026-101',
    patientId: 'pat-101',
    patientName: 'عميل المنصة (كود CM-984420)',
    doctorId: 'doc-moayad',
    doctorName: 'أ. محمد المؤيد',
    departmentName: 'قسم العلاج النفسي وتعديل السلوك (CBT)',
    date: '2026-10-02',
    time: '05:00 مساءً',
    type: 'جلسة عن بُعد (فيديو)',
    status: 'قادم',
    sessionGoal: 'جلسة علاج سلوكي معرفي (CBT) لتفكيك التفكير الكارثي وإعادة هيكلة الأفكار',
    meetUrl: 'https://meet.google.com/cm-psy-984',
    paymentStatus: 'مدفوع بالكامل',
    paymentMethod: 'PayPal',
    amountSAR: 146,
    transactionId: 'TXN-PAYPAL-881920',
    notes: 'تم إرسال رابط Google Meet المشفر للمريض وتأكيد الموعد.'
  },
  {
    id: 'apt-2026-102',
    patientId: 'pat-102',
    patientName: 'عميل المنصة (كود CM-984421)',
    doctorId: 'doc-seham',
    doctorName: 'د. سهام',
    departmentName: 'قسم الطب النفسي والاستشارات الإكلينيكية',
    date: '2026-10-04',
    time: '04:00 مساءً',
    type: 'جلسة عن بُعد (فيديو)',
    status: 'مؤكد',
    sessionGoal: 'متابعة الاستجابة للخطة الدوائية وتطبيق مقياس PHQ-9',
    paymentStatus: 'مدفوع بالكامل',
    paymentMethod: 'بطاقة ائتمان (Visa/MC)',
    amountSAR: 146,
    transactionId: 'TXN-VISA-552140',
  },
  {
    id: 'apt-2026-103',
    patientId: 'pat-103',
    patientName: 'عميل المنصة (كود CM-984422)',
    doctorId: 'doc-amer',
    doctorName: 'د. محمد عامر',
    departmentName: 'قسم العلاج النفسي وتعديل السلوك',
    date: '2026-10-05',
    time: '04:00 مساءً',
    type: 'جلسة عن بُعد (فيديو)',
    status: 'قادم',
    sessionGoal: 'جلسة معالجة الصدمات وإزالة التحسس (EMDR)',
    meetUrl: 'https://meet.google.com/cm-emdr-441',
    paymentStatus: 'مدفوع بالكامل',
    paymentMethod: 'Apple Pay',
    amountSAR: 146,
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
  // Conversation with Mr. Mohammed Al-Moayad (CBT)
  {
    id: 'msg-1',
    senderId: 'doc-moayad',
    senderName: 'أ. محمد المؤيد',
    senderRole: 'doctor',
    doctorId: 'doc-moayad',
    doctorName: 'أ. محمد المؤيد',
    patientId: 'pat-101',
    text: 'أهلاً بك يا سارة، كيف تسير الأمور مع الواجب السلوكي وتدوين الأفكار التلقائية في الأيام الأخيرة؟',
    timestamp: '2026-09-29T10:15:00Z',
    isRead: true
  },
  {
    id: 'msg-2',
    senderId: 'pat-101',
    senderName: 'سارة خالد المنصور',
    senderRole: 'patient',
    doctorId: 'doc-moayad',
    doctorName: 'أ. محمد المؤيد',
    patientId: 'pat-101',
    text: 'أهلاً أستاذ محمد، دونت ثلاثة مواقف شعرت فيها بالقلق الاجتماعي وحاولت كتابة أفكار بديلة منطقية.',
    timestamp: '2026-09-29T10:22:00Z',
    isRead: true
  },
  {
    id: 'msg-3',
    senderId: 'doc-moayad',
    senderName: 'أ. محمد المؤيد',
    senderRole: 'doctor',
    doctorId: 'doc-moayad',
    doctorName: 'أ. محمد المؤيد',
    patientId: 'pat-101',
    text: 'ممتاز جداً ومبشر! استمري على نفس التمارين وسنراجع مقياس PHQ-9 في جلستنا القادمة.',
    timestamp: '2026-09-29T10:30:00Z',
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
    },
    update: async (id: string, updatedData: Partial<Patient>): Promise<Patient> => {
      const all = getStorage('patients', INITIAL_PATIENTS);
      const idx = all.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Patient not found');
      const updated = { ...all[idx], ...updatedData, id };
      all[idx] = updated;
      setStorage('patients', all);
      return updated;
    },
    delete: async (id: string): Promise<void> => {
      const all = getStorage('patients', INITIAL_PATIENTS);
      setStorage('patients', all.filter(p => p.id !== id));
    }
  },

  settings: {
    get: async (): Promise<ClinicSettings> => {
      return getStorage('clinic_settings', INITIAL_SETTINGS);
    },
    update: async (newSettings: Partial<ClinicSettings>): Promise<ClinicSettings> => {
      const current = getStorage('clinic_settings', INITIAL_SETTINGS);
      const updated = { ...current, ...newSettings };
      setStorage('clinic_settings', updated);
      return updated;
    },
    reset: async (): Promise<ClinicSettings> => {
      setStorage('clinic_settings', INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
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
    },
    update: async (id: string, updatedData: Partial<Doctor>): Promise<Doctor> => {
      const all = getStorage('doctors', INITIAL_DOCTORS);
      const idx = all.findIndex(d => d.id === id);
      if (idx === -1) throw new Error('Doctor not found');
      const updated = { ...all[idx], ...updatedData, id };
      all[idx] = updated;
      setStorage('doctors', all);
      return updated;
    },
    delete: async (id: string): Promise<void> => {
      const all = getStorage('doctors', INITIAL_DOCTORS);
      setStorage('doctors', all.filter(d => d.id !== id));
    }
  },

  departments: {
    getAll: async (): Promise<Department[]> => {
      return getStorage('departments', CLINICAL_DEPARTMENTS);
    },
    saveAll: async (data: Department[]): Promise<void> => {
      setStorage('departments', data);
    },
    create: async (dept: Omit<Department, 'id'> & { id?: string }): Promise<Department> => {
      const all = getStorage('departments', CLINICAL_DEPARTMENTS);
      const generatedSlug = (dept.nameEn || 'dept')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '') || 'dept';
      
      let candidateId = dept.id?.trim() || generatedSlug;
      if (all.some(d => d.id === candidateId)) {
        candidateId = `${candidateId}_${Date.now().toString(36)}`;
      }

      const newDept: Department = {
        ...dept,
        id: candidateId,
        doctorCount: dept.doctorCount || 0
      };
      all.push(newDept);
      setStorage('departments', all);
      return newDept;
    },
    update: async (id: string, updated: Partial<Department>): Promise<Department> => {
      const all = getStorage('departments', CLINICAL_DEPARTMENTS);
      const index = all.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Department not found');
      const updatedDept: Department = { ...all[index], ...updated, id };
      all[index] = updatedDept;
      setStorage('departments', all);
      return updatedDept;
    },
    delete: async (id: string): Promise<void> => {
      const all = getStorage('departments', CLINICAL_DEPARTMENTS);
      const filtered = all.filter(d => d.id !== id);
      setStorage('departments', filtered);
    },
    resetToDefault: async (): Promise<Department[]> => {
      setStorage('departments', CLINICAL_DEPARTMENTS);
      return CLINICAL_DEPARTMENTS;
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
    },
    update: async (id: string, updatedData: Partial<Appointment>): Promise<Appointment> => {
      const all = getStorage('appointments', INITIAL_APPOINTMENTS);
      const idx = all.findIndex(a => a.id === id);
      if (idx === -1) throw new Error('Appointment not found');
      const updated = { ...all[idx], ...updatedData, id };
      all[idx] = updated;
      setStorage('appointments', all);
      return updated;
    },
    delete: async (id: string): Promise<void> => {
      const all = getStorage('appointments', INITIAL_APPOINTMENTS);
      setStorage('appointments', all.filter(a => a.id !== id));
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
    },
    delete: async (id: string): Promise<void> => {
      const all = getStorage('prescriptions', INITIAL_PRESCRIPTIONS);
      setStorage('prescriptions', all.filter(rx => rx.id !== id));
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
    },
    delete: async (id: string): Promise<ChatMessage[]> => {
      const all = getStorage('messages', INITIAL_MESSAGES);
      const filtered = all.filter(m => m.id !== id);
      setStorage('messages', filtered);
      return filtered;
    },
    togglePin: async (id: string): Promise<ChatMessage[]> => {
      const all = getStorage('messages', INITIAL_MESSAGES);
      const updated = all.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m);
      setStorage('messages', updated);
      return updated;
    },
    toggleFavorite: async (id: string): Promise<ChatMessage[]> => {
      const all = getStorage('messages', INITIAL_MESSAGES);
      const updated = all.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m);
      setStorage('messages', updated);
      return updated;
    },
    react: async (id: string, emoji: string): Promise<ChatMessage[]> => {
      const all = getStorage('messages', INITIAL_MESSAGES);
      const updated = all.map(m => {
        if (m.id !== id) return m;
        const currentReactions = { ...(m.reactions || {}) };
        currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
        return { ...m, reactions: currentReactions };
      });
      setStorage('messages', updated);
      return updated;
    },
    saveToJournal: async (id: string): Promise<ChatMessage[]> => {
      const all = getStorage('messages', INITIAL_MESSAGES);
      const updated = all.map(m => m.id === id ? { ...m, savedToJournal: true } : m);
      setStorage('messages', updated);
      return updated;
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
    },
    create: async (exercise: Omit<TherapyExercise, 'id'>): Promise<TherapyExercise> => {
      const all = getStorage('exercises', INITIAL_EXERCISES);
      const newEx: TherapyExercise = {
        ...exercise,
        id: generateUniqueId('ex')
      };
      all.push(newEx);
      setStorage('exercises', all);
      return newEx;
    },
    update: async (id: string, updatedData: Partial<TherapyExercise>): Promise<TherapyExercise> => {
      const all = getStorage('exercises', INITIAL_EXERCISES);
      const idx = all.findIndex(e => e.id === id);
      if (idx === -1) throw new Error('Exercise not found');
      const updated = { ...all[idx], ...updatedData, id };
      all[idx] = updated;
      setStorage('exercises', all);
      return updated;
    },
    delete: async (id: string): Promise<void> => {
      const all = getStorage('exercises', INITIAL_EXERCISES);
      setStorage('exercises', all.filter(e => e.id !== id));
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
