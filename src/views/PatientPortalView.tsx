import React, { useState, useEffect } from 'react';
import { 
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
  ExternalLink,
  Layers,
  HelpCircle,
  Mic,
  Paperclip,
  Bell
} from 'lucide-react';
import { 
  Patient, 
  Appointment, 
  Prescription, 
  ScaleAssessmentResult, 
  ChatMessage, 
  TherapyExercise,
  AppNotification
} from '../types';
import { CLINICAL_DEPARTMENTS } from '../data/departments';

interface Props {
  patient: Patient;
  appointments: Appointment[];
  prescriptions: Prescription[];
  scaleResults: ScaleAssessmentResult[];
  messages: ChatMessage[];
  exercises: TherapyExercise[];
  notifications?: AppNotification[];
  initialTab?: 'overview' | 'departments' | 'appointments' | 'meds' | 'scales' | 'exercises' | 'messages';
  onBookAppointmentClick: () => void;
  onBookDepartmentClick?: (deptId: string) => void;
  onOpenSelfDiagnostic: () => void;
  onTakeScaleClick: (scaleId: string) => void;
  onSendMessage: (text: string) => void;
  onToggleExercise: (id: string) => void;
  onViewPrescription: (rx: Prescription) => void;
}

export const PatientPortalView: React.FC<Props> = ({
  patient,
  appointments,
  prescriptions,
  scaleResults,
  messages,
  exercises,
  notifications,
  initialTab,
  onBookAppointmentClick,
  onBookDepartmentClick,
  onOpenSelfDiagnostic,
  onTakeScaleClick,
  onSendMessage,
  onToggleExercise,
  onViewPrescription,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'appointments' | 'meds' | 'scales' | 'exercises' | 'messages'>(initialTab || 'overview');
  const [todayMood, setTodayMood] = useState<'happy' | 'neutral' | 'sad' | null>('neutral');
  const [medTakenToday, setMedTakenToday] = useState<Record<string, boolean>>({});
  const [messageInput, setMessageInput] = useState<string>('');

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);
  const patientScales = scaleResults.filter(s => s.patientId === patient.id);

  const nextAppointment = patientAppointments.find(a => a.status === 'قادم' || a.status === 'مؤكد');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    onSendMessage(messageInput);
    setMessageInput('');
  };

  const handleToggleMed = (key: string) => {
    setMedTakenToday(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Patient Welcome Header & Recovery Index */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-100 text-xs font-bold border border-white/15">
              <Heart className="w-3.5 h-3.5 text-rose-300 fill-current" />
              <span>بوابة العميل والمريض (Patient Care Portal)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              مرحباً بك، {patient.name}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-xl leading-relaxed">
              اختر أحد الأقسام الطبية الأربعة لحجز استشارتك مع أفضل الأطباء، أو ابدأ الفحص الذاتي لتشخيص حالتك بدقة، ومتابعة أدويتك وجلسات Google Meet.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={onBookAppointmentClick}
                className="px-4 py-2 bg-white text-teal-900 rounded-xl font-black text-xs hover:bg-teal-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-teal-700" />
                <span>حجز استشارة جديدة واختيار طبيب</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl font-black text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>الدردشة والتواصل مع الطبيب</span>
              </button>

              <button
                onClick={onOpenSelfDiagnostic}
                className="px-4 py-2 bg-teal-950/40 hover:bg-teal-950/60 text-teal-100 border border-teal-300/30 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>الفحص التشخيصي الذاتي</span>
              </button>
            </div>
          </div>

          {/* Daily Mood Check-in Widget */}
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 text-center shrink-0">
            <span className="text-[11px] text-teal-100 font-semibold block mb-2">كيف تشعر اليوم؟ (تسجيل المزاج)</span>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setTodayMood('happy')}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  todayMood === 'happy' ? 'bg-emerald-400 text-slate-950 scale-110 shadow-sm' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
                title="أشعر بتحسن وطاقة"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTodayMood('neutral')}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  todayMood === 'neutral' ? 'bg-amber-300 text-slate-950 scale-110 shadow-sm' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
                title="مستقر / عادي"
              >
                <Meh className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTodayMood('sad')}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  todayMood === 'sad' ? 'bg-rose-400 text-slate-950 scale-110 shadow-sm' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
                title="متعب / حزين"
              >
                <Frown className="w-5 h-5" />
              </button>
            </div>
            <span className="text-[10px] text-teal-200/80 mt-1 block">
              {todayMood === 'happy' ? 'مزاجك ممتاز وطاقتك مرتفعة' : todayMood === 'neutral' ? 'مزاج مستقر' : 'نشعر بك، طبيبك يتابع حالتك'}
            </span>
          </div>
        </div>
      </div>

      {/* Portal Tabs Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 flex items-center gap-1 overflow-x-auto shadow-2xs">
        {[
          { id: 'overview', label: 'لوحتي الشخصية', icon: Heart },
          { id: 'departments', label: 'الأقسام والعيادات الأربعة', icon: Layers },
          { id: 'appointments', label: 'مواعيدي وجلساتي', icon: Calendar },
          { id: 'scales', label: 'مقاييسي وتتبع التحسن', icon: Activity },
          { id: 'meds', label: 'أدويتي ووصفاتي', icon: Pill },
          { id: 'exercises', label: 'التمارين والواجبات', icon: CheckCircle2 },
          { id: 'messages', label: 'محادثة الطبيب', icon: MessageSquare },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
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
                {notifications.slice(0, 3).map(n => (
                  <div 
                    key={n.id}
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
                        onClick={() => setActiveTab('messages')}
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
          
          {/* 4 Core Departments Highlight Cards */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>الأقسام التخصصية الأساسية الأربعة في المنصة:</span>
                </h3>
                <p className="text-xs text-slate-400">اختر القسم للبدء في حجز الطبيب وإتمام الدفع</p>
              </div>
              <button
                onClick={onBookAppointmentClick}
                className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <span>حجز موعد فوري</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {CLINICAL_DEPARTMENTS.map(dept => (
                <div
                  key={dept.id}
                  onClick={() => onBookDepartmentClick ? onBookDepartmentClick(dept.id) : onBookAppointmentClick()}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100/80 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      {dept.badge}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                      {dept.nameAr}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {dept.shortDesc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px] font-bold text-teal-700 dark:text-teal-400">
                    <span>اختيار الطبيب والحجز</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Tests & Self-Assessment Hub */}
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-teal-950 rounded-2xl p-5 text-white shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مركز الفحص والتشخيص الذاتي (Psychological Self-Testing)</span>
                </span>
                <h3 className="font-bold text-sm text-white">
                  اختبارات للمريض لمعرفة وتشخيص مرضه واختيار الطبيب الأنسب تلقائياً
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl">
                  تتيح لك منصة CoolMind إجراء اختبارات ومقاييس مقننة سريرياً لحساب درجة الشدة (اكتئاب، قلق، هلع، أرق) مع ترشيح فوري للطبيب المعالج.
                </p>
              </div>

              <button
                onClick={onOpenSelfDiagnostic}
                className="px-4 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl text-xs font-black transition-colors shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>بدء الفحص التشخيصي الموجه</span>
              </button>
            </div>

            {/* Quick Test Launchers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => onTakeScaleClick('phq-9')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-right transition-colors cursor-pointer group"
              >
                <span className="text-[10px] text-teal-300 font-bold block">مقياس الاكتئاب</span>
                <span className="text-xs font-bold text-white group-hover:text-teal-300">PHQ-9 (9 أسئلة)</span>
              </button>

              <button
                onClick={() => onTakeScaleClick('gad-7')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-right transition-colors cursor-pointer group"
              >
                <span className="text-[10px] text-indigo-300 font-bold block">مقياس القلق والهلع</span>
                <span className="text-xs font-bold text-white group-hover:text-indigo-300">GAD-7 (7 أسئلة)</span>
              </button>

              <button
                onClick={() => onTakeScaleClick('isi-insomnia')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-right transition-colors cursor-pointer group"
              >
                <span className="text-[10px] text-amber-300 font-bold block">مؤشر شدة الأرق</span>
                <span className="text-xs font-bold text-white group-hover:text-amber-300">ISI Insomnia</span>
              </button>

              <button
                onClick={() => onTakeScaleClick('pcl-5-ptsd')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-right transition-colors cursor-pointer group"
              >
                <span className="text-[10px] text-rose-300 font-bold block">مقياس الصدمات</span>
                <span className="text-xs font-bold text-white group-hover:text-rose-300">PCL-5 PTSD</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">مؤشر التعافي والتحسن</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-teal-600 dark:text-teal-400">72%</span>
                <span className="text-xs text-emerald-600 font-bold flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 rotate-180" />
                  <span>+14% تحسن</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">بناءً على نتائج المقاييس الدورية</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">الأدوية الملتزم بها</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {patient.activeMedsCount} أدوية
              </span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                ✓ التزام بنسبة 100% هذا الأسبوع
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">المقاييس المكتملة</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
                {patientScales.length} مقاييس
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                آخر فحص: {patientScales[0]?.scaleName.split('(')[0] || 'PHQ-9'}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">الجلسة القادمة</span>
              <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">
                {nextAppointment ? nextAppointment.date : 'لا يوجد موعد مجدول'}
              </span>
              <span className="text-[10px] text-teal-600 font-bold mt-1 block">
                مع {patient.assignedDoctor.split('(')[0]}
              </span>
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
                      onClick={() => setActiveTab('messages')}
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

      {/* TAB 2: DEPARTMENTS (THE 4 CORE SPECIALTIES) */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                العيادات التخصصية الأربعة
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                تصفح الأقسام الطبية والنفسية المتكاملة
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                اختر القسم المناسب لحالتك للانتقال فورياً لصفحة اختيار الطبيب والدفع عبر PayPal أو البطاقات
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {CLINICAL_DEPARTMENTS.map(dept => (
                <div
                  key={dept.id}
                  className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                        {dept.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {dept.doctorCount} أطباء معتمدين
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {dept.nameAr}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {dept.fullDesc}
                    </p>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                      <strong className="block text-slate-900 dark:text-white">الحالات والاضطرابات التي يعالجها القسم:</strong>
                      <ul className="text-slate-600 dark:text-slate-300 space-y-1 list-disc mr-4 text-[11px]">
                        {dept.targetDisorders.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onBookAppointmentClick}
                      className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>حجز موعد في هذا القسم (PayPal / Mada / Visa)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPOINTMENTS */}
      {activeTab === 'appointments' && (
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
                    <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      {apt.type}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      apt.status === 'قادم' ? 'bg-amber-100 text-amber-800' :
                      apt.status === 'مؤكد' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {apt.status}
                    </span>
                    {apt.paymentStatus && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-700">
                        {apt.paymentStatus} ({apt.paymentMethod})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    التاريخ: {apt.date} · الساعة: {apt.time}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    هدف الجلسة: {apt.sessionGoal}
                  </p>
                  {apt.meetUrl && (
                    <div className="text-[11px] font-mono text-teal-700 dark:text-teal-300 pt-1">
                      رابط الجلسة: {apt.meetUrl}
                    </div>
                  )}
                </div>

                {apt.meetUrl && apt.status !== 'ملغي' && (
                  <a
                    href={apt.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>انضمام إلى Google Meet</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCALES & PROGRESS */}
      {activeTab === 'scales' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">سجل درجاتي ومقاييسي النفسية</h2>
              <p className="text-xs text-slate-400">تتبع تقدمك وتراجع شدة الأعراض مع خطة العلاج</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onOpenSelfDiagnostic}
                className="px-3.5 py-1.5 bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                الفحص الذاتي لتحديد مرضي
              </button>
              <button
                onClick={() => onTakeScaleClick('phq-9')}
                className="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                + فحص جديد (PHQ-9)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {patientScales.map(res => (
              <div key={res.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">{res.scaleName}</span>
                  <span className="text-xs text-slate-400 font-mono">تاريخ التقييم: {res.date}</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{res.severity.interpretation}</p>
                </div>
                <div className="text-left shrink-0">
                  <span className="text-xl font-black text-slate-900 dark:text-white block font-mono">{res.totalScore} نقطة</span>
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-300 block">{res.severity.labelAr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MEDICATIONS */}
      {activeTab === 'meds' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">وصفاتي الطبية المعتمدة</h2>
              <p className="text-xs text-slate-400">جميع الأدوية المصروفة لك من قِبل الطبيب النفسي المعالج</p>
            </div>
          </div>

          <div className="space-y-4">
            {patientPrescriptions.map(rx => (
              <div key={rx.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">وصفة طبية رقم: {rx.id}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{rx.date} · الطبيب: {rx.doctorName}</span>
                  </div>
                  <button
                    onClick={() => onViewPrescription(rx)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>معاينة وطباعة الوصفة الرسمية</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {rx.items.map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>{item.tradeName} ({item.genericName})</span>
                        <span className="text-teal-700 dark:text-teal-400">{item.duration}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">الجرعة: {item.dosage} · {item.frequency}</p>
                      {item.instructions && <p className="text-[11px] text-slate-500 italic mt-0.5">تعليمات: {item.instructions}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: EXERCISES */}
      {activeTab === 'exercises' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">التمارين السلوكية والواجبات المنزلية (CBT Exercises)</h2>
            <p className="text-xs text-slate-400">التمارين المعرفية وتقنيات الاسترخاء المحددة من قِبل معالجك</p>
          </div>

          <div className="space-y-3">
            {exercises.map(ex => (
              <div
                key={ex.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  ex.isCompletedToday
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 text-emerald-900 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{ex.titleAr}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {ex.durationMinutes} دقائق
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ex.instructions}</p>
                </div>

                <button
                  onClick={() => onToggleExercise(ex.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                    ex.isCompletedToday
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {ex.isCompletedToday ? '✓ مكتمل اليوم' : 'تحديد كمكتمل'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">المحادثة والتواصل الإكلينيكي المباشر</h2>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{patient.assignedDoctor} متصل لاستقبال الاستفسارات ومتابعة الخطة العلاجية</span>
              </span>
            </div>

            {nextAppointment?.meetUrl && (
              <a
                href={nextAppointment.meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>دخول جلسة Meet ({nextAppointment.time})</span>
              </a>
            )}
          </div>

          {/* Consultation Google Meet Alert Banner */}
          {nextAppointment && (
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>
                  موعد جلستك المعتمدة: <strong>{nextAppointment.date} في تمام {nextAppointment.time}</strong> ({nextAppointment.type})
                </span>
              </div>
              <span className="text-[10px] text-teal-700 dark:text-teal-300 font-bold">
                {nextAppointment.paymentStatus}
              </span>
            </div>
          )}

          {/* Quick Questions Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-semibold block">أسئلة واستفسارات سريعة مقترحة:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'هل يمكن تعديل وقت أخذ الجرعة عند الشعور بالنعاس؟',
                'أشعر بتحسن ملحوظ بعد الجلسة الأخيرة ولله الحمد.',
                'أود تأكيد رابط جلسة Google Meet للموعد القادم.',
                'هل يؤثر المنبه أو الكافيين على فعالية خطتي العلاجية؟'
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 text-[11px] transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  + {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 overflow-y-auto space-y-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            {messages.map((msg, idx) => {
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
            })}
          </div>

          <form onSubmit={handleSendMessage} className="w-full max-w-full">
            <div className="w-full max-w-full flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <button
                type="button"
                onClick={() => onSendMessage('📎 [مرفق طبي]: تقرير الفحص المخبري لمستوى فيتامين د ووظائف الغدة')}
                title="إرفاق تقرير طبي أو تحليل دم"
                className="shrink-0 p-2 sm:p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSendMessage('🎙️ [رسالة صوتية إكلينيكية]: تسجيل صوتي حول تقلبات المزاج خلال اليومين الماضيين (0:38 دقيقة)')}
                title="إرسال رسالة صوتية للطبيب"
                className="shrink-0 p-2 sm:p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="اكتب استفسارك لطبيبك المعالج..."
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
      )}

      {/* Floating Quick Chat Button for Direct Access from Any Tab */}
      {activeTab !== 'messages' && (
        <button
          onClick={() => setActiveTab('messages')}
          className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-30 flex items-center gap-2 px-4 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          title="محادثة الطبيب المباشرة"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs font-bold">محادثة الطبيب</span>
        </button>
      )}

    </div>
  );
};
