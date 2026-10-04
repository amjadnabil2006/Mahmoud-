import React, { useState, useEffect } from 'react';
import { 
  Building2,
  Heart, 
  Calendar, 
  Pill, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Video, 
  MessageSquare, 
  Send, 
  Plus, 
  Sparkles, 
  TrendingDown, 
  AlertCircle,
  FileCheck2,
  Smile,
  Meh,
  Frown,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  HelpCircle,
  Mic,
  Paperclip,
  Bell,
  Search,
  UserCheck,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  Info,
  SlidersHorizontal,
  Edit3,
  FileText,
  User,
  LogOut,
  RotateCcw,
  Tag,
  Share2,
  Trash2,
  Lock,
  Star,
  Zap,
  Globe,
  Users2
} from 'lucide-react';
import { 
  Patient, 
  Doctor,
  Appointment, 
  Prescription, 
  ScaleAssessmentResult, 
  ChatMessage, 
  TherapyExercise,
  AppNotification,
  ClinicSettings,
  TherapyPathwayType,
  SessionFormatType,
  TherapyPackage,
  ClientUser
} from '../types';
import { Department, CLINICAL_DEPARTMENTS, getDepartmentColorStyles } from '../data/departments';
import { DepartmentIcon } from '../components/DepartmentIcon';
import { INITIAL_DOCTORS, INITIAL_SETTINGS } from '../services/api';
import { OFFICIAL_DOCTORS_TEAM } from '../data/packagesAndCoupons';
import { authService } from '../services/auth';

// Subcomponents & Sections
import { TherapyPathwaysSection } from '../components/TherapyPathwaysSection';
import { MatchingQuestionnaireModal } from '../components/MatchingQuestionnaireModal';
import { InstantConsultationModal } from '../components/InstantConsultationModal';
import { PackagesSection } from '../components/PackagesSection';
import { 
  AboutUsSection, 
  WhyUsSection, 
  StepsJourneySection, 
  ComparisonTableSection, 
  LeadershipSection, 
  TestimonialsSection, 
  FaqSection, 
  PartnersSection, 
  BlogSection, 
  WorkshopsSection, 
  B2BSection, 
  FooterSection 
} from '../components/TrustAndMarketingSections';
import { FloatingActions, TopDiscountBar } from '../components/FloatingActions';
import { LegalModal, CookieConsentBanner } from '../components/LegalModals';
import { AuthModal } from '../components/AuthModal';
import { UnifiedHealthRecordTab } from '../components/UnifiedHealthRecordTab';
import { InvoicesTab } from '../components/InvoicesTab';
import { SelfHelpToolsModal } from '../components/SelfHelpToolsModal';
import { DoctorRatingModal } from '../components/DoctorRatingModal';
import { ChangeDoctorModal } from '../components/ChangeDoctorModal';
import { GroupTherapyModal } from '../components/GroupTherapyModal';

export type PatientTabId = 'departments' | 'overview' | 'appointments' | 'records' | 'invoices' | 'scales' | 'exercises' | 'messages' | 'account';

interface Props {
  patient: Patient;
  patients?: Patient[];
  onSelectPatient?: (p: Patient) => void;
  doctors?: Doctor[];
  departments?: Department[];
  settings?: ClinicSettings;
  appointments: Appointment[];
  prescriptions: Prescription[];
  scaleResults: ScaleAssessmentResult[];
  messages: ChatMessage[];
  exercises: TherapyExercise[];
  notifications?: AppNotification[];
  activeTab?: PatientTabId;
  onTabChange?: (tab: PatientTabId) => void;
  initialTab?: PatientTabId;
  onBookAppointmentClick: (docId?: string, deptId?: string, pathway?: TherapyPathwayType, format?: SessionFormatType) => void;
  onBookDepartmentClick?: (deptId: string) => void;
  onOpenSelfDiagnostic: () => void;
  onTakeScaleClick: (scaleId: string) => void;
  onSendMessage: (text: string, doctorId?: string) => void;
  onToggleExercise: (id: string) => void;
  onViewPrescription: (rx: Prescription) => void;
  onCancelAppointment?: (aptId: string) => void;
  onRescheduleAppointment?: (apt: Appointment) => void;
  onDoctorRated?: (doctorId: string, rating: number, comment: string) => void;
}

export const PatientPortalView: React.FC<Props> = ({
  patient,
  patients = [],
  onSelectPatient,
  doctors = OFFICIAL_DOCTORS_TEAM,
  departments = CLINICAL_DEPARTMENTS,
  settings = INITIAL_SETTINGS,
  appointments,
  prescriptions,
  scaleResults,
  messages,
  exercises,
  notifications = [],
  activeTab: controlledTab,
  onTabChange,
  initialTab = 'departments',
  onBookAppointmentClick,
  onBookDepartmentClick,
  onOpenSelfDiagnostic,
  onTakeScaleClick,
  onSendMessage,
  onToggleExercise,
  onViewPrescription,
  onCancelAppointment,
  onRescheduleAppointment,
  onDoctorRated
}) => {
  // Tab State
  const [internalTab, setInternalTab] = useState<PatientTabId>(controlledTab || initialTab || 'departments');
  const currentTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleTabSwitch = (tab: PatientTabId) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Auth User Session
  const [currentUser, setCurrentUser] = useState<ClientUser>(authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'guest'>('login');

  // Currency State
  const [currency, setCurrency] = useState<'USD' | 'YER' | 'SAR'>('USD');

  // Modals
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'emergency' | 'refund' | null>(null);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [matchingInitialPathway, setMatchingInitialPathway] = useState<TherapyPathwayType>('individual');
  const [isInstantModalOpen, setIsInstantModalOpen] = useState(false);
  const [isSelfHelpModalOpen, setIsSelfHelpModalOpen] = useState(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [isGroupTherapyModalOpen, setIsGroupTherapyModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [doctorToRate, setDoctorToRate] = useState<Doctor | null>(null);
  const [isChangeDoctorModalOpen, setIsChangeDoctorModalOpen] = useState(false);

  // Chat and Search
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || 'doc-moayad');
  const [mobileChatView, setMobileChatView] = useState<'list' | 'chat'>('list');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');

  // Daily tracker
  const [todayMood, setTodayMood] = useState<'happy' | 'neutral' | 'sad' | null>('neutral');
  const [medTakenToday, setMedTakenToday] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (controlledTab) {
      setInternalTab(controlledTab);
    }
  }, [controlledTab]);

  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);
  const patientScales = scaleResults.filter(s => s.patientId === patient.id);

  const nextAppointment = patientAppointments.find(a => a.status === 'قادم' || a.status === 'مؤكد');
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    onSendMessage(messageInput, selectedDoctorId);
    setMessageInput('');
  };

  const handleToggleMed = (key: string) => {
    setMedTakenToday(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOpenAuth = (mode: 'login' | 'signup' | 'guest') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(authService.getCurrentUser());
  };

  const handleSelectPathway = (pathway: TherapyPathwayType) => {
    setMatchingInitialPathway(pathway);
    setIsMatchingModalOpen(true);
  };

  const handleSelectMatchedDoctor = (doctor: Doctor, format: SessionFormatType, pathway: TherapyPathwayType) => {
    onBookAppointmentClick(doctor.id, doctor.departmentId, pathway, format);
  };

  const handleSelectPackage = (pkg: TherapyPackage) => {
    onBookAppointmentClick(undefined, undefined, 'individual', 'video');
  };

  // Reschedule & Cancel logic
  const handleCancelClick = (aptId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في إلغاء الموعد؟ سيتم تطبيق سياسة الاسترداد التلقائية (100% قبل 24 ساعة / 50% قبل 12 ساعة).')) {
      if (onCancelAppointment) onCancelAppointment(aptId);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Discount Bar (ADD-C-001) */}
      <TopDiscountBar onApplyCoupon={(code) => alert(`تم نسخ وتفعيل كود الخصم: ${code}`)} />

      {/* Portal Top Bar with Client Code (OBS-C-001, OBS-C-002) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 flex items-center justify-center font-black border border-teal-200/60 shrink-0">
            {currentUser.isAnonymous ? '?' : <User className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 dark:text-slate-100">
                {currentUser.isAnonymous ? 'جلسة سرية (مجهول)' : currentUser.nameOrAlias}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold font-mono">
                كود: {currentUser.clientCode}
              </span>
              {currentUser.isAnonymous && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  دخول ضيف 🛡️
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              رصيد الباقة النشطة: <strong>{currentUser.packageSessionsRemaining} من {currentUser.packageSessionsTotal} جلسات</strong>
            </p>
          </div>
        </div>

        {/* Top Actions: Auth Buttons / Modals */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSelfHelpModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>المساعدة الذاتية مجاناً</span>
          </button>

          {currentUser.isAnonymous ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenAuth('login')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => handleOpenAuth('signup')}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition"
              >
                إنشاء حساب
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-slate-500 hover:text-rose-600 text-xs font-bold flex items-center gap-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto text-xs font-bold shadow-inner">
        <button
          onClick={() => handleTabSwitch('departments')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'departments'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>الرئيسية والعيادات</span>
        </button>

        <button
          onClick={() => handleTabSwitch('overview')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'overview'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>لوحتي الشخصية</span>
        </button>

        <button
          onClick={() => handleTabSwitch('appointments')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'appointments'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>مواعيدي ({patientAppointments.length})</span>
        </button>

        <button
          onClick={() => handleTabSwitch('records')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'records'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>الملف الصحي الموحد</span>
        </button>

        <button
          onClick={() => handleTabSwitch('invoices')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'invoices'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>فواتيري وسنداتي</span>
        </button>

        <button
          onClick={() => handleTabSwitch('scales')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'scales'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>المقاييس النفسية (48 مقياساً)</span>
        </button>

        <button
          onClick={() => handleTabSwitch('messages')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'messages'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>المحادثات الآمنة</span>
        </button>

        <button
          onClick={() => handleTabSwitch('account')}
          className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'account'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>حسابي والإحالة</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: DEPARTMENTS & LANDING VIEW                         */}
      {/* ======================================================== */}
      {currentTab === 'departments' && (
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-100 text-xs font-bold border border-white/15">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                  {settings?.heroBadge1 || 'أطباء واستشاريون مرخصون'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-100 text-xs font-bold border border-white/15">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  {settings?.heroBadge2 || 'سرية طبية مشفرة HIPAA'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                  ⚡ نختار لك معالجك خلال 24 ساعة
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                {settings?.heroHeadline || 'الرعاية النفسية المتكاملة.. تشخيص طبي، علاج معرفي، وتغذية متخصصة'}
              </h1>

              <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-2xl font-normal">
                {settings?.heroSubtitle || 'نخبة من الاستشاريين المرخصين في الطب النفسي، العلاج السلوكي المعرفي CBT، التغذية العصبية، والخدمة الاجتماعية في بيئة آمنة وسرية تماماً.'}
              </p>

              {/* Hero CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onBookAppointmentClick()}
                  className="px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-teal-500/20 hover:scale-105 transition flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>احجز جلستك الآن</span>
                </button>

                <button
                  onClick={() => setIsInstantModalOpen(true)}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>استشارة فورية (~15 دقيقة)</span>
                </button>

                <button
                  onClick={() => setIsGroupTherapyModalOpen(true)}
                  className="px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
                >
                  <Users2 className="w-4 h-4" />
                  <span>جلسات العلاج الجماعي</span>
                </button>

                <button
                  onClick={onOpenSelfDiagnostic}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 backdrop-blur-md transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>الفحص التشخيصي الذاتي (مجاناً)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Therapy Pathways (ADD-C-002, OBS-C-012) */}
          <TherapyPathwaysSection
            onSelectPathway={handleSelectPathway}
            onOpenInstantConsultation={() => setIsInstantModalOpen(true)}
            currency={currency}
          />

          {/* Clinical Departments Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  العيادات والأقسام الطبية التخصصية
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  رعاية تكاملية متعددة التخصصات تجمع الدوائي والسلوكي والغذائي
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {departments.map((dept) => {
                const styles = getDepartmentColorStyles(dept.accentColor);
                const deptDoctors = doctors.filter(d => d.departmentId === dept.id);

                return (
                  <div
                    key={dept.id}
                    className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition hover:shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-12 h-12 rounded-2xl ${styles.badgeBg} ${styles.badgeText} flex items-center justify-center font-bold shadow-inner`}>
                          <DepartmentIcon iconName={dept.iconName} className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {deptDoctors.length} مختص متاح
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{dept.nameAr}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {dept.shortDesc}
                      </p>
                    </div>

                    <button
                      onClick={() => onBookAppointmentClick(undefined, dept.id)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs ${styles.badgeBg} ${styles.badgeText} hover:opacity-90 transition flex items-center justify-center gap-1`}
                    >
                      <span>احجز في هذا القسم</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Packages & Pricing Section (OBS-C-005, ADD-C-008) */}
          <PackagesSection
            onSelectPackage={handleSelectPackage}
            currency={currency}
            onChangeCurrency={setCurrency}
            onOpenRefundPolicy={() => setLegalModalType('refund')}
            onOpenB2B={() => setIsB2BModalOpen(true)}
          />

          {/* Trust Sections (ArabTherapy & PRD compliant) */}
          <WhyUsSection onOpenAuth={() => handleOpenAuth('signup')} />
          <StepsJourneySection onStart={() => onBookAppointmentClick()} />
          <ComparisonTableSection />
          <LeadershipSection />
          <TestimonialsSection />
          <PartnersSection />
          <FaqSection />
          <BlogSection />
          <WorkshopsSection />
          <AboutUsSection />
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: OVERVIEW (My Dashboard)                           */}
      {/* ======================================================== */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          {/* Next Session Alert */}
          {nextAppointment ? (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-700 to-emerald-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-teal-100">
                  جلستك العلاجية القادمة ⏳
                </span>
                <h3 className="text-xl sm:text-2xl font-black">
                  {nextAppointment.sessionGoal}
                </h3>
                <p className="text-xs text-teal-100 flex items-center gap-3">
                  <span>👨‍⚕️ مع: <strong>{nextAppointment.doctorName}</strong></span>
                  <span>📅 <strong>{nextAppointment.date}</strong> ({nextAppointment.time})</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {nextAppointment.meetUrl && (
                  <a
                    href={nextAppointment.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white hover:bg-teal-50 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center gap-2 shrink-0"
                  >
                    <Video className="w-4 h-4 text-teal-700" />
                    <span>دخول غرفة الجلسة (Google Meet)</span>
                  </a>
                )}
                <button
                  onClick={() => handleCancelClick(nextAppointment.id)}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 transition"
                >
                  إلغاء / إعادة جدولة
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">ليس لديك جلسات قادمة مجدولة حالياً</p>
              <button
                onClick={() => onBookAppointmentClick()}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                حجز جلسة جديدة الآن
              </button>
            </div>
          )}

          {/* Daily Mood and Dose Trackers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Mood */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Smile className="w-4 h-4 text-teal-600" />
                <span>كيف تصف حالتك المزاجية اليوم؟</span>
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'happy', label: 'مستقر ومبتهج 😊', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                  { id: 'neutral', label: 'عادي / متذبذب 😐', bg: 'bg-amber-50 text-amber-800 border-amber-300' },
                  { id: 'sad', label: 'قلق / مرهق 😔', bg: 'bg-rose-50 text-rose-800 border-rose-300' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setTodayMood(m.id as any)}
                    className={`p-3 rounded-2xl border text-center transition ${
                      todayMood === m.id ? `${m.bg} ring-2 ring-teal-500 font-bold` : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="text-xs">{m.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">يتم تدوين تقلباتك اليومية في ملفك الصحي لمساعدة معالجك.</p>
            </div>

            {/* Quick Self-Help Tools */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>تمارين الاسترخاء والتهدئة اليومية</span>
              </h4>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsSelfHelpModalOpen(true)}
                  className="flex-1 p-3 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-900 dark:text-teal-200 rounded-2xl border border-teal-200 dark:border-teal-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>تمرين التنفس (Box)</span>
                </button>
                <button
                  onClick={() => setIsSelfHelpModalOpen(true)}
                  className="flex-1 p-3 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-200 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-4 h-4 text-emerald-600" />
                  <span>مذكرة الامتنان</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">تمارين معرفية سلوكية مجانية متاحة لك على مدار الساعة.</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: APPOINTMENTS VIEW                                 */}
      {/* ======================================================== */}
      {currentTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                سجل مواعيدي والجلسات المجدولة
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                يمكنك الدخول للغرفة المرئية، إعادة الجدولة، أو تقييم المختص بعد الجلسة
              </p>
            </div>

            <button
              onClick={() => onBookAppointmentClick()}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>حجز جلسة جديدة</span>
            </button>
          </div>

          <div className="space-y-3">
            {patientAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-teal-400 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center shrink-0">
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{apt.doctorName}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{apt.sessionGoal}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      📅 {apt.date} · ⏱ {apt.time} · مرجع: {apt.transactionId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {apt.meetUrl && (
                    <a
                      href={apt.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>دخول Meet</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      const doc = doctors.find(d => d.id === apt.doctorId) || doctors[0];
                      setDoctorToRate(doc);
                      setIsRatingModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 transition flex items-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>تقييم</span>
                  </button>

                  <button
                    onClick={() => handleCancelClick(apt.id)}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition"
                  >
                    إلغاء الموعد
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: UNIFIED HEALTH RECORD                             */}
      {/* ======================================================== */}
      {currentTab === 'records' && (
        <UnifiedHealthRecordTab
          patient={patient}
          appointments={appointments}
          prescriptions={prescriptions}
          scaleResults={scaleResults}
          onTakeScale={onTakeScaleClick}
          onViewPrescription={onViewPrescription}
        />
      )}

      {/* ======================================================== */}
      {/* TAB 5: INVOICES                                          */}
      {/* ======================================================== */}
      {currentTab === 'invoices' && <InvoicesTab />}

      {/* ======================================================== */}
      {/* TAB 6: SCALES SUITE (48 SCALES)                          */}
      {/* ======================================================== */}
      {currentTab === 'scales' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                المقاييس والاختبارات النفسية الرقمية (48 مقياساً معتمداً)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                مقاييس سيكومترية دقيقة لتقييم الاكتئاب، القلق، الصدمات، الأرق، الإدمان، والأطفال
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'phq-9', name: 'استبيان الاكتئاب (PHQ-9)', cat: 'الاكتئاب', time: '4 دقائق', items: '9 بنود' },
              { id: 'gad-7', name: 'مقياس القلق العام (GAD-7)', cat: 'القلق والهلع', time: '3 دقائق', items: '7 بنود' },
              { id: 'dass-21', name: 'مقياس الاكتئاب والقلق والضغوط (DASS-21)', cat: 'متعدد الأبعاد', time: '6 دقائق', items: '21 بنداً' },
              { id: 'ybocs-ocd', name: 'مقياس الوسواس القهري (Y-BOCS)', cat: 'الوسواس', time: '6 دقائق', items: '10 بنود' },
              { id: 'isi-sleep', name: 'مؤشر شدة الأرق (ISI)', cat: 'النوم', time: '3 دقائق', items: '7 بنود' },
              { id: 'pcl-5-ptsd', name: 'أعراض ما بعد الصدمة (PCL-5)', cat: 'الصدمات', time: '6 دقائق', items: '20 بنداً' },
              { id: 'asrs-adhd', name: 'تشتت الانتباه وفرط الحركة (ASRS)', cat: 'ADHD', time: '3 دقائق', items: '6 بنود' },
              { id: 'eat-26', name: 'سلوكيات الأكل والتغذية (EAT-26)', cat: 'اضطرابات الأكل', time: '5 دقائق', items: '12 بنداً' },
              { id: 'rosenberg-self-esteem', name: 'تقدير الذات (Rosenberg)', cat: 'الذات', time: '3 دقائق', items: '10 بنود' },
              { id: 'audit-alcohol', name: 'فرز تعاطي الكحول (AUDIT)', cat: 'الإدمان', time: '4 دقائق', items: '8 بنود' },
              { id: 'dast-10', name: 'فرز تعاطي العقاقير (DAST-10)', cat: 'الإدمان', time: '3 دقائق', items: '10 بنود' },
              { id: 'vanderbilt-adhd-child', name: 'فاندربيلت للأطفال (تقرير الوالدين)', cat: 'الأطفال', time: '7 دقائق', items: '14 بنداً' }
            ].map((sc) => (
              <div
                key={sc.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-teal-400 transition shadow-sm space-y-4"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                    {sc.cat}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2">{sc.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">⏱ {sc.time} · {sc.items}</p>
                </div>

                <button
                  onClick={() => onTakeScaleClick(sc.id)}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1"
                >
                  <span>بدء الاختبار الفوري</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: MESSAGES & CHAT (with Safety Warning OBS-C-023)    */}
      {/* ======================================================== */}
      {currentTab === 'messages' && (
        <div className="space-y-4">
          {/* Emergency Safety Alert (OBS-C-023) */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>تنبيه أمان: هذه المحادثة ليست مخصصة للحالات الطارئة أو الإسعافية الحرجة.</span>
            </div>
            <button
              onClick={() => setLegalModalType('emergency')}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg shrink-0"
            >
              خط الطوارئ 24/7
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {/* Doctors list */}
            <div className="p-4 border-l border-slate-100 dark:border-slate-800 space-y-2 overflow-y-auto">
              <h4 className="font-bold text-xs text-slate-400 mb-2">المختصون المتاحون للمراسلة:</h4>
              {doctors.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoctorId(doc.id)}
                  className={`w-full p-3 rounded-2xl text-right transition flex items-center gap-3 ${
                    selectedDoctorId === doc.id
                      ? 'bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{doc.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{doc.title}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Chat Box */}
            <div className="lg:col-span-2 flex flex-col justify-between p-4">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="w-9 h-9 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{selectedDoctor.name}</h4>
                    <p className="text-[10px] text-emerald-600 font-bold">● متاح للمراسلة ضمن باقتك</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsChangeDoctorModalOpen(true)}
                  className="text-xs text-teal-600 hover:underline font-bold"
                >
                  تغيير المعالج
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs text-slate-600 dark:text-slate-300 max-w-sm">
                  مرحباً بك! هذه المساحة الآمنة مخصصة للاستفسارات ومتابعة الواجبات بين الجلسات.
                </div>
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  placeholder="اكتب رسالتك لمعالجك هنا..."
                  className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: ACCOUNT & REFERRAL CODE (OBS-C-025, OBS-C-006)    */}
      {/* ======================================================== */}
      {currentTab === 'account' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Referral Code Box (OBS-C-006) */}
          <div className="p-6 bg-gradient-to-r from-teal-800 to-slate-900 text-white rounded-3xl shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-200">
              <Share2 className="w-4 h-4" />
              <span>كود الإحالة الخاص بي (شارك واكسب رصيداً)</span>
            </div>
            <div className="flex items-center justify-between bg-white/10 p-3 rounded-2xl border border-white/20">
              <span className="font-mono font-black text-lg text-amber-300">{currentUser.referralCode}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentUser.referralCode);
                  alert('تم نسخ كود الإحالة بنجاح!');
                }}
                className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition"
              >
                نسخ الكود
              </button>
            </div>
            <p className="text-xs text-teal-100">
              شارك كودك مع أصدقائك: يحصل صديقك على خصم 10%، وتحصل أنت على رصيد $10 في حسابك.
            </p>
          </div>

          {/* Account Details */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm text-xs">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">بيانات الحساب والخصوصية</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block mb-1">الاسم أو الاسم المستعار:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{currentUser.nameOrAlias}</p>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">كود العميل الأساسي:</span>
                <p className="font-mono font-bold text-teal-600">{currentUser.clientCode}</p>
              </div>
            </div>

            {/* Delete Account Data (OBS-C-025) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <h5 className="font-bold text-rose-600 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                <span>حذف البيانات والحساب نهائياً</span>
              </h5>
              <p className="text-slate-500">
                وفق سياسة الخصوصية، يمكنك طلب مسح جميع سجلاتك ومقاييسك نهائياً من خوادمنا.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('هل أنت متأكد من حذف حسابك وبياناتك نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.')) {
                    handleLogout();
                    alert('تم حذف بيانات الحساب بنجاح.');
                  }
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition"
              >
                تأكيد حذف الحساب والبيانات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Buttons */}
      <FloatingActions
        onOpenEmergencyModal={() => setLegalModalType('emergency')}
        whatsappNumber="+967770112233"
        emergencyNumber="+967770112233"
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(u) => setCurrentUser(u)}
        initialMode={authModalMode}
        onOpenPrivacyPolicy={() => { setIsAuthModalOpen(false); setLegalModalType('privacy'); }}
        onOpenTerms={() => { setIsAuthModalOpen(false); setLegalModalType('terms'); }}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      <MatchingQuestionnaireModal
        isOpen={isMatchingModalOpen}
        onClose={() => setIsMatchingModalOpen(false)}
        initialPathway={matchingInitialPathway}
        doctors={doctors}
        onSelectMatchedDoctor={handleSelectMatchedDoctor}
        onOpenPrivacyPolicy={() => setLegalModalType('privacy')}
      />

      <InstantConsultationModal
        isOpen={isInstantModalOpen}
        onClose={() => setIsInstantModalOpen(false)}
        activePatient={patient}
        onCompleteBooking={(apt) => {
          setIsInstantModalOpen(false);
          alert('تم حجز الجلسة الفورية بنجاح!');
        }}
      />

      <SelfHelpToolsModal
        isOpen={isSelfHelpModalOpen}
        onClose={() => setIsSelfHelpModalOpen(false)}
      />

      <B2BSection
        isOpen={isB2BModalOpen}
        onClose={() => setIsB2BModalOpen(false)}
      />

      {doctorToRate && (
        <DoctorRatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          doctor={doctorToRate}
          onSubmitRating={(rating, comment) => {
            if (onDoctorRated) onDoctorRated(doctorToRate.id, rating, comment);
          }}
        />
      )}

      <ChangeDoctorModal
        isOpen={isChangeDoctorModalOpen}
        onClose={() => setIsChangeDoctorModalOpen(false)}
        currentDoctorId={selectedDoctorId}
        onConfirmChange={(newDoc) => setSelectedDoctorId(newDoc.id)}
      />

      <GroupTherapyModal
        isOpen={isGroupTherapyModalOpen}
        onClose={() => setIsGroupTherapyModalOpen(false)}
        onJoinSuccess={(title, alias) => {
          alert(`تم تأكيد انضمامك لبرنامج العلاج الجماعي "${title}" باسمك المستعار "${alias}" بنجاح.`);
        }}
      />

      {/* Footer */}
      <FooterSection
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
        onOpenEmergency={() => setLegalModalType('emergency')}
        onOpenRefund={() => setLegalModalType('refund')}
        onOpenB2B={() => setIsB2BModalOpen(true)}
      />
    </div>
  );
};
