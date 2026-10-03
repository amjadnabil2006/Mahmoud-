export type UserRole = 
  | 'psychiatrist' 
  | 'psychologist' 
  | 'nutritionist' 
  | 'social_worker' 
  | 'admin' 
  | 'reception' 
  | 'support' 
  | 'supervisor';

export type PortalType = 'patient' | 'doctor' | 'admin';
export type ThemeMode = 'light' | 'dark';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  doctorId: string;
  licenseNumber: string;
  specialty: string;
  avatar: string;
  departmentId: string;
  isLicensed: boolean;
  token?: string;
  lastActive: string;
}

export interface PatientAllergy {
  id: string;
  substance: string;
  severity: 'خفيفة' | 'متوسطة' | 'شديدة ومهددة للحياة';
  reaction: string;
}

export interface PatientVital {
  date: string;
  weightKg: number;
  bloodPressure: string;
  heartRate: number;
  fastingGlucoseMgDl?: number;
  notes?: string;
}

export interface TreatmentGoal {
  id: string;
  title: string;
  targetDate: string;
  status: 'قيد العمل' | 'مكتمل' | 'معلق';
  category: 'CBT' | 'نمط حياة' | 'دوائي' | 'علاقات';
}

export interface Patient {
  id: string;
  fileNumber: string;
  name: string;
  age: number;
  gender: 'ذكر' | 'أنثى';
  phone: string;
  email?: string;
  primaryDiagnosis?: string;
  icd10Code?: string;
  riskLevel: 'منخفض' | 'متوسط' | 'مرتفع' | 'حرج';
  lastVisit: string;
  assignedDoctor: string;
  assignedDoctorId?: string;
  activeMedsCount: number;
  completedScalesCount: number;
  status: 'نشط' | 'مستقر' | 'قيد المتابعة المكثفة' | 'مكتمل' | 'منقطع' | 'محول';
  allergies?: PatientAllergy[];
  chronicConditions?: string[];
  currentMedications?: string[];
  vitalsHistory?: PatientVital[];
  treatmentGoals?: TreatmentGoal[];
  socialHistory?: string;
  medicalHistory?: string;
}

export interface SavedClinicalRecord {
  id: string;
  recordNumber: string;
  patientId: string;
  patientName: string;
  patientFileNumber: string;
  doctorId: string;
  doctorName: string;
  doctorLicenseNumber: string;
  formType: 'mse' | 'suicide_risk' | 'soap_note' | 'nutrition_plan' | 'social_assessment' | 'medical_report';
  titleAr: string;
  date: string;
  status: 'مسودة' | 'معتمد وموقع سريرياً';
  formData: Record<string, any>;
  summaryText?: string;
  emergencyEscalated?: boolean;
  signatureText?: string;
  verifiedStamp?: boolean;
}

export interface DoctorSchedule {
  doctorId: string;
  availableDays: string[];
  timeSlots: string[];
  dailyCapacity: number;
  weeklyCapacity: number;
  sessionDurationMinutes: number;
  bufferMinutes: number;
  advanceNoticeHours: number;
  maxBookingDaysInAdvance: number;
  vacationDates: string[];
  timezone: string;
  onDutyNow: boolean;
  onDutyStartedAt?: string;
}

export interface PeerConsultation {
  id: string;
  title: string;
  anonymousPatientAge: number;
  anonymousPatientGender: 'ذكر' | 'أنثى';
  category: string;
  description: string;
  authorDoctorId: string;
  authorDoctorName: string;
  createdAt: string;
  replies: {
    id: string;
    doctorName: string;
    doctorSpecialty: string;
    text: string;
    timestamp: string;
  }[];
}

export interface DoctorReferral {
  id: string;
  patientId: string;
  patientName: string;
  fromDoctorId: string;
  fromDoctorName: string;
  toDoctorId: string;
  toDoctorName: string;
  toSpecialty: string;
  reason: string;
  urgency: 'عاجل' | 'روتيني';
  date: string;
  status: 'قيد المراجعة' | 'مقبول' | 'مكتمل';
}

export interface MedicalReport {
  id: string;
  reportNumber: string;
  patientId: string;
  patientName: string;
  patientFileNumber: string;
  doctorId: string;
  doctorName: string;
  type: 'تقرير طبي نفسي' | 'إجازة مرضية معتمدة' | 'خطاب تحويل استشاري' | 'إقرار وموافقة مستنيرة';
  date: string;
  validUntil?: string;
  daysGranted?: number;
  diagnosis: string;
  clinicalSummary: string;
  recommendations: string;
  isOfficialStamped: boolean;
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
  priceYER: number;
  activePatientsCount: number;
  availableDays: string[];
  nextAvailableSlot: string;
  languages: string[];
  dialect: string;
  isLicensed: boolean;
  punctualityRate: number; // e.g. 99%
  isAvailable?: boolean;
}

export type TherapyPathwayType = 'instant' | 'individual' | 'couples' | 'child';
export type SessionFormatType = 'video' | 'audio' | 'text';

export interface TherapyPackage {
  id: string;
  nameAr: string;
  nameEn: string;
  badge?: string;
  sessionsCount: number;
  validityMonths: number;
  priceUSD: number;
  priceYER: number;
  priceSAR: number;
  originalPriceUSD?: number;
  saveAmountUSD?: number;
  saveTextAr?: string;
  isPopular?: boolean;
  descriptionAr: string;
  sessionDurationText: string;
  featuresAr: string[];
  cancelAnytimeNoticeAr: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  descriptionAr: string;
  isValid: boolean;
}

export interface ClientUser {
  id: string;
  clientCode: string; // e.g. CM-884920 or CM-GUEST-7712
  nameOrAlias: string;
  email: string;
  phone: string;
  country: string; // 'YE' | 'SA' | 'AE' | 'EG' | 'OTHER'
  currency: 'USD' | 'YER' | 'SAR';
  isAnonymous: boolean;
  activePackageId?: string;
  packageSessionsRemaining: number;
  packageSessionsTotal: number;
  referralCode: string;
  referralRewardsUSD: number;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  createdAt: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  date: string;
  clientCode: string;
  clientName: string;
  description: string;
  doctorName?: string;
  amountUSD: number;
  amountYER: number;
  amountSAR: number;
  currency: 'USD' | 'YER' | 'SAR';
  paymentMethod: string;
  transactionRef: string;
  status: 'مدفوع ومكتمل' | 'مسترد بالكامل' | 'مسترد جزئياً' | 'معلق';
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  clientCode: string;
  clientAlias: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface MatchingQuestionnaireData {
  pathway: TherapyPathwayType;
  ageGroup: 'child_under_18' | 'adult_18_35' | 'adult_35_plus';
  parentalConsentAgreed?: boolean;
  problemCategory: string;
  genderPreference: 'any' | 'male' | 'female';
  dialectPreference: 'any' | 'yemeni' | 'gulf' | 'egyptian' | 'levantine' | 'standard_arabic';
  formatPreference: SessionFormatType;
  preferredTime: 'morning' | 'afternoon' | 'evening';
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
  prescriptionNumber?: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  fileNumber: string;
  date: string;
  diagnosis: string;
  icd10Code?: string;
  items: PrescriptionItem[];
  specialInstructions: string;
  doctorId?: string;
  doctorName: string;
  licenseNumber: string;
  doctorSignature?: string;
  isOfficialStamped?: boolean;
  status?: 'نشطة' | 'مكتملة' | 'موقوفة' | 'مجددة';
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
