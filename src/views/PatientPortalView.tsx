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
  Edit3
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
  ClinicSettings
} from '../types';
import { Department, CLINICAL_DEPARTMENTS, getDepartmentColorStyles } from '../data/departments';
import { DepartmentIcon } from '../components/DepartmentIcon';
import { INITIAL_DOCTORS, INITIAL_SETTINGS } from '../services/api';

export type PatientTabId = 'departments' | 'overview' | 'appointments' | 'meds' | 'scales' | 'exercises' | 'messages';

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
  onBookAppointmentClick: () => void;
  onBookDepartmentClick?: (deptId: string) => void;
  onOpenSelfDiagnostic: () => void;
  onTakeScaleClick: (scaleId: string) => void;
  onSendMessage: (text: string, doctorId?: string) => void;
  onToggleExercise: (id: string) => void;
  onViewPrescription: (rx: Prescription) => void;
}

export const PatientPortalView: React.FC<Props> = ({
  patient,
  patients = [],
  onSelectPatient,
  doctors = INITIAL_DOCTORS,
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
}) => {
  // Use controlled tab if provided, otherwise internal tab state
  const [internalTab, setInternalTab] = useState<PatientTabId>(controlledTab || initialTab || 'departments');
  const currentTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleTabSwitch = (tab: PatientTabId) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Selected doctor for multi-chat
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('doc-1');
  const [mobileChatView, setMobileChatView] = useState<'list' | 'chat'>('list');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState<string>('');
  
  const [todayMood, setTodayMood] = useState<'happy' | 'neutral' | 'sad' | null>('neutral');
  const [medTakenToday, setMedTakenToday] = useState<Record<string, boolean>>({});
  const [messageInput, setMessageInput] = useState<string>('');

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

  // Filter messages for current doctor
  const currentDoctorMessages = messages.filter(m => {
    // If message explicitly has doctorId
    if (m.doctorId) return m.doctorId === selectedDoctorId;
    // Otherwise fallback if sent by doc or patient
    if (m.senderId === selectedDoctorId) return true;
    if (m.senderRole === 'patient') {
      // Return if patient message was in doc-1 context or general
      return selectedDoctorId === 'doc-1';
    }
    return false;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    onSendMessage(messageInput, selectedDoctorId);
    setMessageInput('');
  };

  const handleToggleMed = (key: string) => {
    setMedTakenToday(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Unread messages count by doctor
  const getDoctorUnreadCount = (docId: string) => {
    return messages.filter(m => !m.isRead && (m.doctorId === docId || m.senderId === docId)).length;
  };

  // Last message by doctor
  const getLastDoctorMessage = (docId: string) => {
    const docMsgs = messages.filter(m => m.doctorId === docId || m.senderId === docId);
    return docMsgs[docMsgs.length - 1];
  };

  return (
    <div className="space-y-5 text-right w-full max-w-full overflow-hidden">
      
      {/* Primary Portal Tabs Navigation Bar (Available on Desktop and Tablet) */}
      <div className="hidden md:flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 items-center gap-1 overflow-x-auto shadow-2xs max-w-full">
        {[
          { id: 'departments', label: 'الرئيسية: الأقسام الأربعة', icon: Building2 },
          { id: 'overview', label: 'لوحتي الشخصية', icon: Heart },
          { id: 'messages', label: 'محادثات الأطباء', icon: MessageSquare, badge: messages.filter(m => !m.isRead).length },
          { id: 'appointments', label: 'مواعيدي وجلساتي', icon: Calendar },
          { id: 'meds', label: 'أدويتي والوصفات', icon: Pill },
          { id: 'scales', label: 'مقاييسي وتتبع التحسن', icon: Activity },
          { id: 'exercises', label: 'التمارين والواجبات', icon: CheckCircle2 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id as PatientTabId)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: DEPARTMENTS (THE CLINIC HOMEPAGE & CORE 4 SPECIALTIES) */}
      {/* ============================================================== */}
      {currentTab === 'departments' && (
        <div className="space-y-6">
          
          {/* Main Clinic Welcome Hero Banner */}
          <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden w-full max-w-full">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-100 text-xs font-bold border border-white/15">
                    <Heart className="w-3.5 h-3.5 text-rose-300 fill-current" />
                    <span>{settings.clinicNameAr || 'المنصة الرئيسية للعيادة والطب النفسي الرقمي'}</span>
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-snug">
                  {settings.heroHeadline || 'مرحباً بك في CoolMind · عيادتك النفسية الشاملة'}
                </h1>
                <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  {settings.heroSubtitle || 'تصفح الأقسام الطبية الأربعة لحجز استشارتك مع الأطباء الاستشاريين، أو أجرِ الفحص الذاتي لتشخيص حالتك بدقة، وتواصل مباشرة عبر الدردشة الطبية المعتمدة.'}
                </p>

                {/* 4 Feature Badges from Settings */}
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-teal-100">
                  {[settings.heroBadge1, settings.heroBadge2, settings.heroBadge3, settings.heroBadge4]
                    .filter(Boolean)
                    .map((badge, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10 font-medium">
                        <Check className="w-3 h-3 text-emerald-300" />
                        <span>{badge}</span>
                      </span>
                    ))}
                </div>

                {/* Quick Action Navigation Buttons on Homepage */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => handleTabSwitch('overview')}
                    className="px-3.5 py-2 rounded-xl font-bold text-xs bg-white text-teal-900 hover:bg-teal-50 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-rose-600 fill-current" />
                    <span>لوحتي الشخصية وتتبع خطتي</span>
                  </button>

                  <button
                    onClick={() => handleTabSwitch('messages')}
                    className="px-3.5 py-2 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>الدردشة مع الأطباء</span>
                  </button>

                  <button
                    onClick={onOpenSelfDiagnostic}
                    className="px-3.5 py-2 bg-teal-950/60 hover:bg-teal-950/80 text-teal-100 border border-teal-300/30 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-teal-300" />
                    <span>الفحص التشخيصي الذاتي</span>
                  </button>
                </div>
              </div>

              {/* Clinic Accreditation Badge & Quick Stats */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shrink-0 space-y-2 w-full sm:w-64">
                <div className="flex items-center gap-2 text-teal-200 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>معايير إكلينيكية معتمدة</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  استشارات افتراضية وحضورية، سرية طبية مشفرة، وتشخيص وفق معايير DSM-5 و ICD-11 الدولية.
                </p>
                {settings.showHeroStats !== false && (
                  <div className="pt-1.5 border-t border-white/15 flex items-center justify-between text-[10px] text-teal-200 font-mono">
                    <span>{departments.length} أقسام تخصصية</span>
                    <span>{doctors.length} أطباء استشاريين</span>
                    <span>دعم 24/7</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Guest / Account Access Explanatory Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    كيفية الوصول والخدمات المتاحة للزوار والمرضى المسجلين
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                    حساب نشط
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                  يمكنك تصفح العيادات والأطباء بحرية وإجراء الفحص التشخيصي الذاتي وحجز المواعيد بدون قيود. ملف المريض المفتوح حالياً هو <strong>{patient.name} ({patient.fileNumber})</strong>. يمكنك الانتقال إلى «لوحتي الشخصية» لمتابعة وصفتك ومواعيدك، أو اختيار مريض آخر.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
              {patients && patients.length > 0 && onSelectPatient && (
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  <select
                    value={patient.id}
                    onChange={(e) => {
                      const p = patients.find(item => item.id === e.target.value);
                      if (p) onSelectPatient(p);
                    }}
                    aria-label="تبديل ملف المريض"
                    className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id} className="dark:bg-slate-800">
                        {p.name} ({p.fileNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => handleTabSwitch('overview')}
                className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>فتح ملفي ولوحتي الشخصية</span>
              </button>
            </div>
          </div>

          {/* Clinical Departments Grid (Controlled by Settings) */}
          {settings?.showDepartmentsSection !== false && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      <span>الأقسام والعيادات التخصصية</span>
                    </h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                      {departments.length} أقسام
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    منظومة علاجية متكاملة تغطي الجانب الدوائي، النفسي السلوكي، التغذية العصبية، والدعم الاجتماعي
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onBookAppointmentClick}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>حجز استشارة فورية</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {departments.map(dept => {
                  const deptDoctor = doctors.find(d => d.departmentId === dept.id) || doctors[0];
                  const deptColors = getDepartmentColorStyles(dept.accentColor);

                  return (
                    <div
                      key={dept.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition-shadow relative group"
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${deptColors.badgeBg} ${deptColors.badgeText} ${deptColors.badgeBorder}`}>
                            {dept.badge}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>متاح للحجز اليوم</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${deptColors.iconBg}`}>
                            <DepartmentIcon iconName={dept.iconName} className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                              {dept.nameAr}
                            </h3>
                            <span className="text-[11px] font-mono text-slate-400 block" dir="ltr">
                              {dept.nameEn}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {dept.fullDesc || dept.shortDesc}
                        </p>

                        {/* Doctor Spotlight in Department */}
                        {deptDoctor && (
                          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                            <img 
                              src={deptDoctor.avatar} 
                              alt={deptDoctor.name} 
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover border border-teal-500/30 shrink-0" 
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                  {deptDoctor.name}
                                </span>
                                <span className="text-[11px] font-mono font-bold text-teal-700 dark:text-teal-400">
                                  {deptDoctor.priceSAR} ر.س
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                                {deptDoctor.specialty} · خبرة {deptDoctor.experienceYears} عاماً
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Target Disorders */}
                        <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5">
                          <strong className="block text-slate-900 dark:text-white text-[11px]">
                            الحالات والاضطرابات التي يعالجها القسم:
                          </strong>
                          <div className="flex flex-wrap gap-1.5">
                            {dept.targetDisorders.map((d, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 text-[10px] border border-slate-200 dark:border-slate-600 font-medium"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Department Action Buttons */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                        <button
                          onClick={() => {
                            if (onBookDepartmentClick) {
                              onBookDepartmentClick(dept.id);
                            } else {
                              onBookAppointmentClick();
                            }
                          }}
                          className="w-full sm:flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>حجز موعد في هذا القسم</span>
                        </button>

                        {deptDoctor && (
                          <button
                            onClick={() => {
                              setSelectedDoctorId(deptDoctor.id);
                              setMobileChatView('chat');
                              handleTabSwitch('messages');
                            }}
                            className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 rounded-xl text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                            title="محادثة طبيب هذا القسم"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>محادثة الطبيب</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Self-Diagnostic & Crisis Line Banners (Controlled by Settings) */}
          {(settings?.showSelfDiagnosticBanner !== false || settings?.showEmergencyBanner !== false) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Self-Diagnostic Prompt */}
              {settings?.showSelfDiagnosticBanner !== false && (
                <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-teal-950 rounded-2xl p-5 text-white shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-400/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>الفحص والتشخيص الذاتي المقنن</span>
                    </span>
                    <h3 className="font-bold text-sm text-white">
                      {settings.selfDiagnosticTitle || 'لست متأكداً أي قسم يناسب حالتك؟ ابدأ الفحص في دقيقتين'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {settings.selfDiagnosticSubtitle || 'أجب عن أسئلة إكلينيكية موجزة وسيقوم النظام بتوجيهك تلقائياً للقسم والأخصائي الأنسب مع حساب مقياس الشدة المعتمد.'}
                    </p>
                  </div>

                  <button
                    onClick={onOpenSelfDiagnostic}
                    className="w-full sm:w-auto px-4 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl text-xs font-black transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer self-start"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>بدء الفحص التشخيصي الموجه مجاناً</span>
                  </button>
                </div>
              )}

              {/* Emergency & Crisis Support */}
              {settings?.showEmergencyBanner !== false && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-5 text-rose-950 dark:text-rose-100 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                      <AlertCircle className="w-4 h-4" />
                      <span>{settings.emergencyBannerTitle || 'الخط الساخن للدعم والتدخل في الأزمات النفسية 24/7'}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      هل تمر بحالة طارئة أو تشعر بضيق شديد لا يحتمل؟
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {settings.emergencyBannerSubtitle || 'فريق التدخل النفسي العاجل جاهز لمساندتك على مدار الساعة، خدمة مجانية وسرية تماماً.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={`tel:${settings.emergencyHotline || '920000000'}`}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>الاتصال بالخط الساخن ({settings.emergencyHotline || '920000000'})</span>
                    </a>
                    <button
                      onClick={() => {
                        setSelectedDoctorId('doc-1');
                        setMobileChatView('chat');
                        handleTabSwitch('messages');
                      }}
                      className="px-3.5 py-2 bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-xl text-xs font-bold hover:bg-rose-100/50 transition-colors cursor-pointer"
                    >
                      مراسلة طبيب الطوارئ
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Doctors Spotlight Section (Controlled by Settings) */}
          {settings?.showDoctorsSection !== false && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span>الكادر الطبي واستشاريو العيادة</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    نخبة من الاستشاريين والأخصائيين المعتمدين من الهيئة السعودية للتخصصات الصحية
                  </p>
                </div>
                <button
                  onClick={onBookAppointmentClick}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  عرض جميع المواعيد المتاحة
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {doctors.slice(0, 4).map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-md transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-teal-500/30"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {doc.name}
                          </h4>
                          <span className="text-[11px] text-teal-700 dark:text-teal-400 block truncate font-medium">
                            {doc.specialty}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            خبرة {doc.experienceYears} عاماً · ★ {doc.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {doc.bio}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                        {doc.priceSAR} ر.س
                      </span>
                      <button
                        onClick={() => {
                          if (onBookDepartmentClick) {
                            onBookDepartmentClick(doc.departmentId);
                          } else {
                            onBookAppointmentClick();
                          }
                        }}
                        className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        حجز موعد
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs Section (Controlled by Settings) */}
          {settings?.showFaqSection !== false && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span>الأسئلة الشائعة حول العلاج والاستشارات</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  إجابات واضحة لضمان راحتك وسريتك التامة أثناء رحلتك العلاجية
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">هل الجلسات والاستشارات سرية ومشفرة؟</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    نعم، نلتزم بأعلى معايير حماية الخصوصية الطبية HIPAA و GDPR. ملفك ومعلوماتك لا يطّلع عليها سوى طبيبك المعالج فقط.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">كيف يتم عقد الجلسات عن بُعد؟</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    تُعقد الجلسات عبر رابط فيديو مباشر وآمن Google Meet يُنشأ تلقائياً فور تأكيد الحجز ويكون متاحاً في لوحتك الشخصية.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">ما هي سياسة إعادة الجدولة والإلغاء؟</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    {settings.cancellationPolicyAr || 'يمكنك إلغاء أو إعادة جدولة أي موعد مجاناً بالكامل قبل 4 ساعات من موعد الجلسة المحدد.'}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">هل يمكن وصف الأدوية النفسية إلكترونياً؟</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    نعم، يصدر الاستشاري وصفات طبية إلكترونية معتمدة برقم الترخيص الطبي والجرعات الدقيقة لتقديمها للصيدليات المعتمدة.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Testimonials / Success Stories (Controlled by Settings) */}
          {settings?.showTestimonialsSection !== false && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-current" />
                  <span>تجارب وقصص من رحلة التعافي</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  آراء حقيقية لمرضى استعادوا توازنهم وجودة حياتهم مع الفريق الطبي
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-1 text-amber-500 text-xs">★★★★★</div>
                  <p className="text-slate-600 dark:text-slate-300 italic text-[11px] leading-relaxed">
                    «التشخيص الدقيق والمتابعة الدوائية غيرت حياتي بعد سنوات من نوبات القلق المستمرة. ممتن جداً لدقة الاستشاري.»
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold block">مريض متعافٍ · قسم الطب النفسي</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-1 text-amber-500 text-xs">★★★★★</div>
                  <p className="text-slate-600 dark:text-slate-300 italic text-[11px] leading-relaxed">
                    «جلسات العلاج السلوكي المعرفي CBT أعطتني أدوات يومية للتعامل مع الوسواس والضغوط. المنصة سهلة وسريعة.»
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold block">مراجعة · قسم العلاج النفسي والسلوكي</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-1 text-amber-500 text-xs">★★★★★</div>
                  <p className="text-slate-600 dark:text-slate-300 italic text-[11px] leading-relaxed">
                    «خطة التغذية العصبية ساعدتني على تنظيم النوم وتقليل الخمول بالتكامل مع أدويتي. تجربة رعاية حقيقية.»
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold block">مريض · قسم التغذية العصبية</span>
                </div>
              </div>
            </div>
          )}

          {/* Comprehensive Dynamic Footer */}
          <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  {settings.clinicNameAr || 'عيادات CoolMind للطب النفسي والرعاية المتكاملة'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                  {settings.footerTextAr || 'المنظومة النفسية الإكلينيكية الرقمية الرائدة في الرعاية التخصصية المتكاملة بالمملكة والشرق الأوسط.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  {settings.clinicAddress && <span>📍 {settings.clinicAddress}</span>}
                  {settings.workingHoursAr && <span>🕒 {settings.workingHoursAr}</span>}
                  {settings.emergencyPhone && <span>📞 {settings.emergencyPhone}</span>}
                </div>
              </div>

              {settings.showFooterSocials !== false && (
                <div className="flex items-center gap-2 self-start md:self-auto">
                  {settings.twitterUrl && (
                    <a
                      href={settings.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 hover:text-teal-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      X / تويتر
                    </a>
                  )}
                  {settings.instagramUrl && (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 hover:text-teal-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      إنستغرام
                    </a>
                  )}
                  {settings.linkedinUrl && (
                    <a
                      href={settings.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 hover:text-teal-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="text-center text-[11px] text-slate-400 pb-2">
              {settings.copyrightTextAr || 'جميع الحقوق محفوظة © CoolMind Clinic'}
            </div>
          </footer>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: OVERVIEW (PATIENT'S PERSONAL HEALTH FILE & DASHBOARD)   */}
      {/* ============================================================== */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Dedicated Patient Dashboard Header with Mood Check-in */}
          <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-teal-100 text-xs font-bold border border-white/15">
                <Heart className="w-3.5 h-3.5 text-rose-300 fill-current" />
                <span>ملفي الطبي والمتابعة الإكلينيكية</span>
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                لوحتي الشخصية · {patient.name}
              </h1>
              <p className="text-xs text-teal-100 font-mono">
                رقم الملف: {patient.fileNumber} · الطبيب المشرف: {patient.assignedDoctor}
              </p>
            </div>

            {/* Daily Mood Check-in Widget */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center shrink-0 w-full sm:w-auto">
              <span className="text-[10px] text-teal-100 font-semibold block mb-1.5">تسجيل المزاج اليومي</span>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setTodayMood('happy')}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    todayMood === 'happy' ? 'bg-emerald-400 text-slate-950 scale-105 shadow-sm' : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                  title="أشعر بتحسن وطاقة"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTodayMood('neutral')}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    todayMood === 'neutral' ? 'bg-amber-300 text-slate-950 scale-105 shadow-sm' : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                  title="مستقر / عادي"
                >
                  <Meh className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTodayMood('sad')}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    todayMood === 'sad' ? 'bg-rose-400 text-slate-950 scale-105 shadow-sm' : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                  title="متعب / حزين"
                >
                  <Frown className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[9px] text-teal-200 mt-1 block">
                {todayMood === 'happy' ? 'مزاج ممتاز وطاقة مرتفعة' : todayMood === 'neutral' ? 'مزاج مستقر' : 'نشعر بك، طبيبك يتابع حالتك'}
              </span>
            </div>
          </div>
          
          {/* Notifications & Clinical Alerts Banner */}
          {notifications && notifications.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    مركز التنبيهات والإشعارات الطبية
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                    {notifications.filter(n => !n.isRead).length} غير مقروء
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">تحديث فوري للمواعيد والرسائل</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {notifications.slice(0, 3).map((n, idx) => (
                  <div 
                    key={`portal-notif-${n.id || 'notif'}-${idx}`}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                      !n.isRead 
                        ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800 text-teal-950 dark:text-teal-100'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[11px]">
                      <span>{n.title}</span>
                      <span className="text-[9px] opacity-60 font-mono">
                        {n.timestamp.includes('T') ? new Date(n.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : n.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-80 line-clamp-2 leading-relaxed">{n.description}</p>
                    {n.type === 'chat' && (
                      <button
                        onClick={() => {
                          setMobileChatView('chat');
                          handleTabSwitch('messages');
                        }}
                        className="text-[10px] font-bold text-teal-700 dark:text-teal-300 hover:underline pt-1 block cursor-pointer"
                      >
                        الرد والذهاب للدردشة ←
                      </button>
                    )}
                    {n.type === 'appointment' && n.meetUrl && (
                      <a
                        href={n.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1 flex items-center gap-1 cursor-pointer"
                      >
                        <span>فتح جلسة Google Meet</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">مؤشر التعافي والالتزام</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
                  {Math.min(95, Math.round((patient.completedScalesCount * 18) + (patient.activeMedsCount > 0 ? 35 : 15)))}%
                </span>
                <span className="text-xs text-emerald-600 font-bold">مستمر بالتحسن</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-teal-600 h-1.5 rounded-full transition-all" 
                  style={{ width: `${Math.min(95, Math.round((patient.completedScalesCount * 18) + (patient.activeMedsCount > 0 ? 35 : 15)))}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">الطبيب المشرف على حالتك</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{patient.assignedDoctor}</span>
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">استشاري الطب النفسي المعتمد</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">الأدوية المعتمدة الحالية</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{patient.activeMedsCount}</span>
                <Pill className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">وصفة إلكترونية نشطة وموثقة</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">المقاييس النفسية المكتملة</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{patient.completedScalesCount}</span>
                <Activity className="w-4 h-4 text-teal-600" />
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">آخر فحص مقياس: PHQ-9</span>
            </div>
          </div>

          {/* Next Appointment Card with Google Meet & Daily Pill Reminder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Next Appointment Spotlight with Google Meet */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">جلستك القادمة وموعد Google Meet</h3>
                </div>
                <button
                  onClick={onBookAppointmentClick}
                  className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 cursor-pointer"
                >
                  + حجز جلسة جديدة
                </button>
              </div>

              {nextAppointment ? (
                <div className="bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm block">
                        {nextAppointment.doctorName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {nextAppointment.date} · {nextAppointment.time}
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-md font-bold bg-teal-600 text-white flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      <span>{nextAppointment.type}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>هدف الجلسة:</strong> {nextAppointment.sessionGoal}
                  </p>

                  {nextAppointment.meetUrl && (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">رابط Google Meet المولد تلقائياً:</span>
                        <span className="font-mono text-teal-700 dark:text-teal-300 font-bold">{nextAppointment.meetUrl}</span>
                      </div>
                      <a
                        href={nextAppointment.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>دخول الجلسة</span>
                      </a>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      ✓ الحالة: {nextAppointment.paymentStatus} ({nextAppointment.paymentMethod})
                    </span>
                    <button
                      onClick={() => {
                        if (nextAppointment.doctorId) setSelectedDoctorId(nextAppointment.doctorId);
                        setMobileChatView('chat');
                        handleTabSwitch('messages');
                      }}
                      className="text-xs font-bold text-teal-800 dark:text-teal-300 hover:underline"
                    >
                      مراسلة الطبيب قبل الجلسة ←
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  لا توجد مواعيد قادمة مجدولة حالياً. اضغط على حجز جلسة لاختيار موعد مناسب.
                </div>
              )}
            </div>

            {/* Daily Pill Reminder Checklist */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">تذكير الأدوية والجرعات اليومية</h3>
                </div>
                <span className="text-xs text-slate-400">اليوم: {new Date().toLocaleDateString('ar-EG')}</span>
              </div>

              <div className="space-y-2.5">
                {patientPrescriptions.flatMap(p => p.items).map((item, idx) => {
                  const key = `med-${idx}`;
                  const isTaken = medTakenToday[key];

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isTaken
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 text-emerald-900 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs block text-slate-900 dark:text-white">
                          {item.tradeName} ({item.dosage})
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.frequency}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleMed(key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isTaken
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isTaken ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>تم تناول الجرعة</span>
                          </>
                        ) : (
                          <span>سجل أخذ الجرعة</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: MULTI-DOCTOR CHAT & CLINICAL COMMUNICATIONS            */}
      {/* ============================================================== */}
      {currentTab === 'messages' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
            
            {/* Left/Sidebar: Doctors & Conversations Directory */}
            <div className={`md:col-span-4 border-b md:border-b-0 md:border-l border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50 ${
              mobileChatView === 'chat' ? 'hidden md:block' : 'block'
            }`}>
              <div className="space-y-1">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center justify-between">
                  <span>المحادثات مع الأطباء</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
                    {doctors.length} استشاريين
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  اختر الطبيب للتواصل المباشر في نافذة محادثة مستقلة
                </p>
              </div>

              {/* Search Doctor Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={doctorSearchQuery}
                  onChange={(e) => setDoctorSearchQuery(e.target.value)}
                  placeholder="ابحث عن طبيب أو تخصص..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-8 pl-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              {/* Doctors List */}
              <div className="space-y-1.5 overflow-y-auto max-h-[480px]">
                {doctors
                  .filter(d => d.name.includes(doctorSearchQuery) || d.specialty.includes(doctorSearchQuery))
                  .map(doc => {
                    const isSelected = doc.id === selectedDoctorId;
                    const unread = getDoctorUnreadCount(doc.id);
                    const lastMsg = getLastDoctorMessage(doc.id);

                    return (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoctorId(doc.id);
                          setMobileChatView('chat');
                        }}
                        className={`p-3 rounded-xl transition-all cursor-pointer border flex items-start gap-3 ${
                          isSelected
                            ? 'bg-teal-50/90 dark:bg-teal-950/60 border-teal-400 dark:border-teal-700 shadow-2xs'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={doc.avatar}
                            alt={doc.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900"></span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold truncate ${
                              isSelected ? 'text-teal-900 dark:text-teal-200' : 'text-slate-900 dark:text-white'
                            }`}>
                              {doc.name}
                            </span>
                            {lastMsg && (
                              <span className="text-[9px] text-slate-400 font-mono">
                                {new Date(lastMsg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] text-teal-700 dark:text-teal-400 font-medium block truncate">
                            {doc.specialty}
                          </span>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {lastMsg ? lastMsg.text : 'بدء محادثة جديدة...'}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0 mt-1">
                          {unread > 0 && (
                            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                              {unread}
                            </span>
                          )}
                          <ChevronLeft className="w-4 h-4 text-teal-600 dark:text-teal-400 md:hidden" />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right: Active Doctor Conversation Panel (Dedicated Independent Window) */}
            <div className={`md:col-span-8 p-4 sm:p-5 flex flex-col justify-between space-y-4 ${
              mobileChatView === 'list' ? 'hidden md:flex' : 'flex'
            }`}>
              
              {/* Doctor Conversation Top Bar with Mobile Back Button */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button: Returns to Doctors Directory */}
                  <button
                    onClick={() => setMobileChatView('list')}
                    className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shrink-0 border border-slate-200 dark:border-slate-700"
                    title="العودة لقائمة الأطباء"
                  >
                    <ChevronRight className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>الأطباء</span>
                  </button>

                  <div className="relative shrink-0">
                    <img
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover border border-teal-500/40"
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                        {selectedDoctor.name}
                      </h2>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                        {selectedDoctor.specialty}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>نافذة استشارة خاصة مع {selectedDoctor.name}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {nextAppointment?.meetUrl && nextAppointment.doctorName.includes(selectedDoctor.name.split(' ')[1]) && (
                    <a
                      href={nextAppointment.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>دخول جلسة Meet ({nextAppointment.time})</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      if (onBookDepartmentClick) {
                        onBookDepartmentClick(selectedDoctor.departmentId);
                      } else {
                        onBookAppointmentClick();
                      }
                    }}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>حجز موعد جديد</span>
                  </button>
                </div>
              </div>

              {/* Quick Questions Chips Tailored to Selected Doctor */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-semibold block">
                  استفسارات مقترحة خاصة بـ ({selectedDoctor.specialty}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedDoctor.id === 'doc-1' ? [
                    'هل يمكن تعديل وقت أخذ الجرعة الدوائية عند الشعور بالنعاس؟',
                    'أشعر بتحسن ملحوظ في أعراض القلق هذا الأسبوع ولله الحمد.',
                    'أود تأكيد موعد جلستنا القادمة عبر Google Meet.',
                    'هل يؤثر المنبه أو الكافيين على فعالية خطتي العلاجية؟'
                  ] : selectedDoctor.id === 'doc-2' ? [
                    'دونت 3 مواقف سلبية في سجل أفكار CBT وأود مناقشتها معك.',
                    'ما هي أفضل تقنية للتعامل مع نوبات الهلع المفاجئة؟',
                    'تمكنت من تطبيق تمرين التعرض التدريجي بنجاح.',
                    'أود مراجعة أهدافي العلاجية للجلسة القادمة.'
                  ] : selectedDoctor.id === 'doc-3' ? [
                    'هل هناك أطعمة أو مكملات تدعم إنتاج السيروتونين الطبيعي؟',
                    'لاحظت تحسناً في انتفاخ المعدة بعد تعديل النظام الغذائي.',
                    'ما هي الجرعة المناسبة من المغنيسيوم وأوميغا-3؟',
                    'هل يؤثر الصيام المتقطع على توازن المزاج والهرمونات؟'
                  ] : [
                    'كيف أتعامل مع ضغوط العمل دون التأثير على صحتي النفسية؟',
                    'أود نصائح لمساعدة أسرتي على فهم خطتي العلاجية وتجنب الوصمة.',
                    'ما هي استراتيجيات حل النزاعات الزوجية بمرونة؟',
                    'كيف أعود للبيئة الاجتماعية تدريجياً بعد فترة العزلة؟'
                  ]).map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSendMessage(prompt, selectedDoctor.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 text-[11px] transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      + {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="h-80 sm:h-96 overflow-y-auto space-y-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                {currentDoctorMessages.length > 0 ? (
                  currentDoctorMessages.map((msg, idx) => {
                    const isMe = msg.senderRole === 'patient';
                    const messageKey = `msg-${msg.id || 'msg'}-${idx}-${msg.timestamp || ''}`;

                    return (
                      <div key={messageKey} className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
                        <div className={`max-w-[85%] sm:max-w-md break-words p-3.5 rounded-2xl space-y-1 shadow-2xs ${
                          isMe
                            ? 'bg-teal-700 text-white rounded-bl-xs'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-br-xs'
                        }`}>
                          <span className="font-bold text-[10px] block opacity-75">{msg.senderName}</span>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <span className="text-[9px] block text-left opacity-60 font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                    <MessageSquare className="w-8 h-8 opacity-40 text-teal-600" />
                    <p className="text-xs font-semibold">ابدأ محادثتك المباشرة مع {selectedDoctor.name}</p>
                    <span className="text-[11px] text-slate-400 max-w-sm">
                      يمكنك طرح أي استفسار حول خطتك العلاجية أو الأعراض وسيقوم الأخصائي بالرد عليك.
                    </span>
                  </div>
                )}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="w-full max-w-full">
                <div className="w-full max-w-full flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => onSendMessage('📎 [مرفق طبي]: تقرير الفحص المخبري لمستوى فيتامين د ووظائف الغدة', selectedDoctor.id)}
                    title="إرفاق تقرير طبي أو تحليل دم"
                    className="shrink-0 p-2 sm:p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendMessage('🎙️ [رسالة صوتية إكلينيكية]: تسجيل صوتي حول تقلبات المزاج خلال اليومين الماضيين (0:38 دقيقة)', selectedDoctor.id)}
                    title="إرسال رسالة صوتية للطبيب"
                    className="shrink-0 p-2 sm:p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`اكتب رسالتك إلى ${selectedDoctor.name}...`}
                    className="flex-1 min-w-0 bg-transparent px-2 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
                  />

                  <button
                    type="submit"
                    className="shrink-0 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline sm:inline">إرسال</span>
                  </button>
                </div>
              </form>

            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: APPOINTMENTS                                            */}
      {/* ============================================================== */}
      {currentTab === 'appointments' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">جدول جلساتي واستشاراتي</h2>
              <p className="text-xs text-slate-400">سجل المواعيد القادمة والسابقة بالعيادة أو عن بعد عبر Google Meet</p>
            </div>
            <button
              onClick={onBookAppointmentClick}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>حجز موعد جديد</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {patientAppointments.map(apt => (
              <div key={apt.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{apt.doctorName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      {apt.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {apt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {apt.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>الهدف:</strong> {apt.sessionGoal}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {apt.meetUrl && (
                    <a
                      href={apt.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>دخول رابط Google Meet</span>
                    </a>
                  )}
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {apt.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: MEDICATIONS & PRESCRIPTIONS                             */}
      {/* ============================================================== */}
      {currentTab === 'meds' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">الوصفات الطبية النفسية المعتمدة</h2>
              <p className="text-xs text-slate-400">سجل الأدوية المصروفة والجرعات الإكلينيكية ومدة الاستخدام</p>
            </div>
            <button
              onClick={() => handleTabSwitch('messages')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
            >
              استشارة الطبيب بشأن الجرعات ←
            </button>
          </div>

          <div className="space-y-4">
            {patientPrescriptions.map(rx => (
              <div key={rx.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">
                      وصفة رقم: {rx.fileNumber || rx.id}
                    </span>
                    <span className="text-xs text-slate-400">
                      حررت بواسطة: {rx.doctorName} ({rx.date})
                    </span>
                  </div>
                  <button
                    onClick={() => onViewPrescription(rx)}
                    className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>عرض وطباعة الروشتة المعتمدة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {rx.items.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                        <span>{item.tradeName}</span>
                        <span className="text-teal-600 font-mono">{item.dosage}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        الاسم العلمي: {item.genericName} · {item.frequency}
                      </p>
                      <p className="text-[11px] text-teal-800 dark:text-teal-300 font-medium">
                        التعليمات: {item.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: SCALES & ASSESSMENTS                                    */}
      {/* ============================================================== */}
      {currentTab === 'scales' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">سجل المقاييس والاختبارات النفسية</h2>
              <p className="text-xs text-slate-400">تتبع تغير درجات الشدة الإكلينيكية وقياس مدى الاستجابة للعلاج</p>
            </div>
            <button
              onClick={() => onTakeScaleClick('phq-9')}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>إجراء مقياس جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientScales.map(sc => (
              <div key={sc.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{sc.scaleName}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-bold">
                    الدرجة: {sc.totalScore}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>التاريخ: {sc.date}</span>
                  <span className="font-bold text-amber-600">{sc.severity?.labelAr || 'مستقر'}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                  <strong>التوصية الإكلينيكية:</strong> {sc.severity?.clinicalAction || 'متابعة الخطة العلاجية الدورية'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 7: THERAPY EXERCISES                                       */}
      {/* ============================================================== */}
      {currentTab === 'exercises' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">التمارين السلوكية والواجبات المنزلية (CBT)</h2>
            <p className="text-xs text-slate-400">تمارين موجهة لتخفيف التوتر، تنظيم التنفس، وتعديل الأفكار التلقائية السلبية</p>
          </div>

          <div className="space-y-3">
            {exercises.map(ex => (
              <div
                key={ex.id}
                className={`p-4 rounded-2xl border transition-all ${
                  ex.isCompletedToday
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{ex.titleAr}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                        {ex.category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">المدة المقترحة: {ex.durationMinutes} دقيقة</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                      {ex.instructions}
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleExercise(ex.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                      ex.isCompletedToday
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {ex.isCompletedToday ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم الإنجاز</span>
                      </>
                    ) : (
                      <span>تحديد كمنجز</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Quick Chat Button for Direct Access from Any Tab (Desktop Only) */}
      {currentTab !== 'messages' && (
        <button
          onClick={() => handleTabSwitch('messages')}
          className="hidden md:flex fixed bottom-6 left-6 z-30 items-center gap-2 px-4 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          title="محادثة الطبيب المباشرة"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs font-bold">محادثة الأطباء</span>
        </button>
      )}

    </div>
  );
};
