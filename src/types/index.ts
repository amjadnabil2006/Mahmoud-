export type UserRole = 'psychiatrist' | 'psychologist' | 'nutritionist' | 'social_worker' | 'admin';
export type PortalType = 'patient' | 'doctor' | 'admin';
export type ThemeMode = 'light' | 'dark';

export interface Patient {
  id: string;
  fileNumber: string;
  name: string;
  age: number;
  gender: 'ذكر' | 'أنثى';
  phone: string;
  email?: string;
  primaryDiagnosis?: string;
  riskLevel: 'منخفض' | 'متوسط' | 'مرتفع' | 'حرج';
  lastVisit: string;
  assignedDoctor: string;
  assignedDoctorId?: string;
  activeMedsCount: number;
  completedScalesCount: number;
  status: 'نشط' | 'مستقر' | 'قيد المتابعة المكثفة' | 'مكتمل';
}

export type { Department } from '../data/departments';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  specialty: string;
  licenseNumber: string;
  phone: string;
  email: string;
  avatar: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  priceSAR: number;
  priceUSD: number;
  activePatientsCount: number;
  availableDays: string[];
  nextAvailableSlot: string;
  languages: string[];
  isAvailable?: boolean;
}

export interface ClinicSettings {
  // Identity & Contact
  clinicNameAr: string;
  clinicNameEn: string;
  clinicAddress: string;
  clinicEmail: string;
  emergencyPhone: string;
  whatsappPhone: string;
  workingHoursAr: string;
  defaultCurrency: 'SAR' | 'USD';

  // Hero Section
  heroHeadline: string;
  heroSubtitle: string;
  heroBadge1: string;
  heroBadge2: string;
  heroBadge3: string;
  heroBadge4: string;
  showHeroStats: boolean;

  // Announcement Banner
  showAnnouncementBanner: boolean;
  announcementText: string;
  announcementType: 'info' | 'warning' | 'success';

  // Crisis & Emergency Banner
  showEmergencyBanner: boolean;
  emergencyBannerTitle: string;
  emergencyBannerSubtitle: string;
  emergencyHotline: string;

  // Self-Diagnostic Banner
  showSelfDiagnosticBanner: boolean;
  selfDiagnosticTitle: string;
  selfDiagnosticSubtitle: string;

  // Sections Visibility
  showDepartmentsSection: boolean;
  showDoctorsSection: boolean;
  showFaqSection: boolean;
  showTestimonialsSection: boolean;
  showFooterSocials: boolean;

  // Policies & Booking Pricing
  consultationDiscountPercent: number;
  enableOnlinePayment: boolean;
  cancellationPolicyAr: string;

  // Social Links & Footer
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  footerTextAr: string;
  copyrightTextAr: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  departmentName?: string;
  date: string;
  time: string;
  type: 'حضوري بالعيادة' | 'جلسة عن بُعد (فيديو)';
  status: 'مؤكد' | 'قادم' | 'مكتمل' | 'ملغي';
  sessionGoal: string;
  meetUrl?: string; // Automatically generated Google Meet URL
  paymentStatus: 'مدفوع بالكامل' | 'معلق' | 'مسترد';
  paymentMethod: 'PayPal' | 'مدى (Mada)' | 'بطاقة ائتمان (Visa/MC)' | 'Apple Pay' | 'STC Pay';
  amountSAR: number;
  transactionId: string;
  notes?: string;
}

export interface BookingTransaction {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  amountSAR: number;
  amountUSD: number;
  vatAmountSAR: number;
  paymentMethod: 'PayPal' | 'مدى (Mada)' | 'بطاقة ائتمان (Visa/MC)' | 'Apple Pay' | 'STC Pay';
  transactionRef: string;
  date: string;
  status: 'ناجحة ومؤكدة' | 'معلقة' | 'ملغاة';
  meetUrl: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor' | 'admin';
  text: string;
  timestamp: string;
  isRead: boolean;
  doctorId?: string;
  doctorName?: string;
  patientId?: string;
}

export interface TherapyExercise {
  id: string;
  titleAr: string;
  category: 'تنفس واسترخاء' | 'سجل أفكار معرفي (CBT)' | 'يقظة ذهنية (Mindfulness)' | 'تفريغ وتدوين مشاعر';
  durationMinutes: number;
  isCompletedToday: boolean;
  instructions: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  ipAddress: string;
  status: 'نجاح' | 'تنبيه أمان' | 'محظور';
}

export interface ClinicAnalytics {
  totalPatients: number;
  totalDoctors: number;
  monthlySessions: number;
  totalPrescriptions: number;
  recoveryRatePercent: number;
  highRiskAlerts: number;
  monthlyRevenueSAR: number;
}

export interface ScaleOption {
  value: number;
  labelAr: string;
}

export interface ScaleQuestion {
  id: number;
  textAr: string;
  options?: ScaleOption[];
}

export interface SeverityLevel {
  min: number;
  max: number;
  labelAr: string;
  badgeColor: string; // e.g. 'emerald', 'teal', 'amber', 'orange', 'rose'
  interpretation: string;
  clinicalAction: string;
}

export interface PsychologicalScale {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  category: 'الاكتئاب' | 'القلق والهلع' | 'الوسواس القهري' | 'الصدمة والضغوط' | 'النوم والأرق' | 'ADHD والنمائي' | 'الشخصية والمزاج';
  estimatedMinutes: number;
  targetPopulation: string;
  descriptionAr: string;
  defaultOptions: ScaleOption[];
  questions: ScaleQuestion[];
  scoringCriteria: SeverityLevel[];
  referenceCitation: string;
}

export interface ScaleAssessmentResult {
  id: string;
  patientId: string;
  patientName: string;
  scaleId: string;
  scaleName: string;
  date: string;
  totalScore: number;
  severity: SeverityLevel;
  answers: Record<number, number>;
  clinicianNotes?: string;
}

export interface PsychiatricMed {
  id: string;
  genericName: string;
  tradeNames: string[];
  classAr: 'مضادات الاكتئاب (SSRIs)' | 'مضادات الاكتئاب (SNRIs)' | 'مضادات الذهان غير التقليدية (Atypical)' | 'مثبتات المزاج' | 'مضادات القلق والمهدئات' | 'منبهات الجهاز العصبي (ADHD)';
  startingDose: string;
  targetDose: string;
  maxDose: string;
  primaryIndications: string[];
  majorSideEffects: string[];
  blackBoxWarning?: string;
  metabolicMonitoringRequired: boolean;
  halfLife: string;
  clinicalPearls: string;
}

export interface PrescriptionItem {
  medId: string;
  genericName: string;
  tradeName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  fileNumber: string;
  date: string;
  diagnosis: string;
  items: PrescriptionItem[];
  specialInstructions: string;
  doctorName: string;
  licenseNumber: string;
}

export interface DisorderInfo {
  id: string;
  codeDSM5: string;
  codeICD11: string;
  nameAr: string;
  nameEn: string;
  category: 'اضطرابات المزاج' | 'اضطرابات القلق' | 'طيف الوسواس القهري' | 'اضطرابات الصدمة' | 'الاضطرابات الذهانية' | 'الاضطرابات النمائية العصبية' | 'اضطرابات الأكل والنوم';
  coreCriteriaAr: string[];
  diagnosticDuration: string;
  differentialDiagnoses: string[];
  recommendedScales: string[];
  firstLineTherapy: string;
  firstLinePharmacotherapy: string;
}

export interface ClinicalFormTemplate {
  id: string;
  code: string;
  titleAr: string;
  descriptionAr: string;
  category: 'فحص الحالة العقلية (MSE)' | 'المقابلة التشخيصية الأولى' | 'تقييم خطورة الانتحار' | 'تقرير جلسة علاجية (SOAP)';
  sections: {
    title: string;
    fields: {
      id: string;
      label: string;
      type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox_group';
      options?: string[];
      placeholder?: string;
      defaultValue?: any;
    }[];
  }[];
}

export interface NutritionAssessment {
  id: string;
  title: string;
  category: 'محور الأمعاء-الدماغ' | 'اضطرابات الأكل' | 'المتلازمة الأيضية لمضادات الذهان' | 'المغذيات العصبية';
  summaryAr: string;
  targetNutrients: { name: string; benefit: string; foodSources: string; mentalHealthRole: string }[];
  clinicalChecklist: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'appointment' | 'payment' | 'chat' | 'scale' | 'system';
  isRead: boolean;
  meetUrl?: string;
}
