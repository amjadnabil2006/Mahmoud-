import React from 'react';
import { 
  Users, 
  Activity, 
  Pill, 
  AlertTriangle, 
  ArrowUpRight, 
  Plus, 
  Calendar, 
  FileText,
  CheckCircle,
  HelpCircle,
  Stethoscope,
  ChevronLeft,
  Video,
  ExternalLink
} from 'lucide-react';
import { Patient, ScaleAssessmentResult, Prescription, UserRole, Appointment } from '../types';

interface DashboardProps {
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (p: Patient) => void;
  scaleResults: ScaleAssessmentResult[];
  prescriptions: Prescription[];
  appointments?: Appointment[];
  onUpdateAppointmentStatus?: (id: string, status: Appointment['status']) => void;
  onOpenQuickScale: (scaleId?: string) => void;
  onOpenNewPrescription: () => void;
  onOpenClinicalForm: (formType: 'mse' | 'suicide_risk' | 'soap_note') => void;
  onOpenOverviewModal: () => void;
  onNavigateTab: (tab: any) => void;
  currentRole: UserRole;
}

export const DashboardView: React.FC<DashboardProps> = ({
  patients,
  activePatient,
  onSelectPatient,
  scaleResults,
  prescriptions,
  appointments = [],
  onUpdateAppointmentStatus,
  onOpenQuickScale,
  onOpenNewPrescription,
  onOpenClinicalForm,
  onOpenOverviewModal,
  onNavigateTab,
  currentRole,
}) => {
  const highRiskCount = patients.filter(p => p.riskLevel === 'حرج' || p.riskLevel === 'مرتفع').length;

  return (
    <div className="space-y-6 text-right">
      
      {/* Purpose Banner Answer to User's Core Question */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold mb-3 border border-white/10">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ما هو الهدف من هذا التطبيق بالتحديد؟</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black mb-2 text-white">
            منصة CoolMind: عيادة الطب النفسي الرقمية الشاملة
          </h1>
          <p className="text-slate-200 text-sm leading-relaxed mb-4">
            الهدف الأساسي للتطبيق هو تزويد الطبيب النفسي والمعالج والأخصائي بنظام إكلينيكي متكامل يربط بين:
            <strong> التشخيص الطبي (DSM-5)</strong>، <strong>المقاييس النفسية المقننة ذات التصحيح الآلي (PHQ-9/GAD-7)</strong>، <strong>الوصفات الدوائية النفسية الرسمية</strong>، <strong>فحص الحالة العقلية (MSE)</strong>، و<strong>التغذية العلاجية والخدمة الاجتماعية</strong> في بيئة عمل واحدة وسريعة بدون إنترنت.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenOverviewModal}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>استعراض التحليل التفصيلي لمكونات التطبيق</span>
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenQuickScale('phq-9')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-teal-300" />
              <span>تجربة مقياس الاكتئاب السريري (PHQ-9)</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute left-0 bottom-0 translate-y-1/3 -translate-x-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Statistical Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">المرضى النشطون بالعيادة</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{patients.length} مرضى</span>
            <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-0.5 block">ملفات طبية محدثة</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">المقاييس النفسية المنجزة</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{scaleResults.length + 18} اختباراً</span>
            <span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold mt-0.5 block">تصحيح فوري موثق</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">الوصفات الطبية النشطة</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{prescriptions.length + 4} وصفات</span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5 block">مع مراقبة الأمان</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Pill className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">حالات الإنذار والخطورة</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">{highRiskCount} حالات</span>
            <span className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold mt-0.5 block">تتطلب خطة أمان فورية</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Active Patient & Fast Launchers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Patient Comprehensive Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs lg:col-span-2 space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white font-bold text-lg flex items-center justify-center">
                {activePatient.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{activePatient.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                    activePatient.riskLevel === 'حرج' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' :
                    activePatient.riskLevel === 'متوسط' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                    'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  }`}>
                    مستوى الخطر: {activePatient.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ملف رقم: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{activePatient.fileNumber}</span> · {activePatient.age} سنة · {activePatient.gender}
                </p>
              </div>
            </div>

            <div className="text-left">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">الطبيب المعالج</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{activePatient.assignedDoctor}</span>
            </div>
          </div>

          {/* Diagnosis & Clinical Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500 block mb-1 font-medium">التشخيص الإكلينيكي المعتمد:</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{activePatient.primaryDiagnosis || 'قيد الاستقصاء والتشخيص'}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500 block mb-1 font-medium">تاريخ آخر زيارة / حالة المتابعة:</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{activePatient.lastVisit} ({activePatient.status})</p>
            </div>
          </div>

          {/* Quick Action Buttons for Active Patient */}
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">إجراءات سريرية سريعة للمريض الحالي:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onOpenQuickScale('phq-9')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 bg-white dark:bg-slate-800 hover:bg-teal-50/50 dark:hover:bg-slate-700 text-right transition-all group cursor-pointer"
              >
                <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">فحص الاكتئاب</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">PHQ-9 Test</span>
              </button>

              <button
                onClick={() => onOpenQuickScale('gad-7')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-white dark:bg-slate-800 hover:bg-indigo-50/50 dark:hover:bg-slate-700 text-right transition-all group cursor-pointer"
              >
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">فحص القلق</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">GAD-7 Test</span>
              </button>

              <button
                onClick={() => onOpenClinicalForm('mse')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 bg-white dark:bg-slate-800 hover:bg-emerald-50/50 dark:hover:bg-slate-700 text-right transition-all group cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">فحص الحالة MSE</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Mental Status</span>
              </button>

              <button
                onClick={onOpenNewPrescription}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 bg-white dark:bg-slate-800 hover:bg-purple-50/50 dark:hover:bg-slate-700 text-right transition-all group cursor-pointer"
              >
                <Pill className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">تحرير وصفة</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Rx Prescription</span>
              </button>
            </div>
          </div>

          {/* Safety Alert if Risk is Elevated */}
          {activePatient.riskLevel !== 'منخفض' && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl p-3.5 flex items-start gap-3 text-xs text-rose-950 dark:text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-rose-900 dark:text-rose-100 block mb-0.5">تنبيه سريري: مستوى خطورة {activePatient.riskLevel}</span>
                <p className="text-rose-800 dark:text-rose-300 leading-relaxed text-[11px]">
                  يوصى بتطبيق بروتوكول تقييم خطورة الانتحار وتوثيق خطة الأمان (Safety Plan) وإشراك المرافق الموثوق.
                </p>
                <button
                  onClick={() => onOpenClinicalForm('suicide_risk')}
                  className="mt-2 text-xs font-bold text-rose-800 dark:text-rose-200 bg-rose-100 dark:bg-rose-900/60 hover:bg-rose-200 px-3 py-1 rounded-lg border border-rose-300 dark:border-rose-800 transition-colors cursor-pointer"
                >
                  فتح بروتوكول تقييم الخطورة (C-SSRS)
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Quick Launchpad & Workspaces Switcher */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 transition-colors">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
            مساحات العمل الإكلينيكية
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => onNavigateTab('psychiatry')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-300 transition-all text-right group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">أطلس التشخيصات والأدوية</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">معايير DSM-5 & ICD-11 الكاملة</span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
            </button>

            <button
              onClick={() => onNavigateTab('scales')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition-all text-right group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">مكتبة المقاييس المقننة</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">تصحيح وحساب درجات فوري</span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            </button>

            <button
              onClick={() => onNavigateTab('clinical_forms')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 transition-all text-right group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">السجلات والنماذج الطبية</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">فحص الحالة العقلية MSE وملاحظات SOAP</span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </button>

            <button
              onClick={() => onNavigateTab('nutrition_social')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-all text-right group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">التغذية والخدمة الاجتماعية</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">محور الأمعاء-الدماغ والدعم الأسري</span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
            </button>

            <button
              onClick={() => onNavigateTab('handbook')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-300 transition-all text-right group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">كتاب ودليل CoolMind</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">المرجع الإكلينيكي لأفضل الممارسات</span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </button>
          </div>
        </div>

      </div>

      {/* Incoming Appointments & Google Meet Sessions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              جدول المواعيد الواردة وجلسات Google Meet المباشرة (إشعارات الحجز والسداد)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            {appointments.length} جلسات مؤكدة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {appointments.slice(0, 4).map(apt => (
            <div
              key={apt.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 hover:border-teal-400 dark:hover:border-teal-600 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>{apt.patientName}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {apt.status} ({apt.paymentMethod || 'PayPal'})
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {apt.date} · {apt.time} ({apt.type})
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                  <strong>الهدف:</strong> {apt.sessionGoal}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between gap-2">
                {apt.meetUrl ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={apt.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Video className="w-3 h-3" />
                      <span>دخول Meet</span>
                    </a>
                    <span className="text-[10px] font-mono text-teal-700 dark:text-teal-300 truncate max-w-[120px]">
                      {apt.meetUrl.replace('https://meet.google.com/', '')}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400">جلسة حضورية</span>
                )}

                {/* Doctor Appointment Status Control */}
                {onUpdateAppointmentStatus && (
                  <div className="flex items-center gap-1">
                    {apt.status !== 'مكتمل' ? (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'مكتمل')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold transition-colors cursor-pointer border border-emerald-300 dark:border-emerald-800"
                        title="إتمام الجلسة وتوثيقها"
                      >
                        إتمام الجلسة ✓
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        مكتملة بنجاح ✓
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient List Table & Recent Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Patients Roster */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">قائمة المرضى المسجلين بالعيادة</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">{patients.length} مرضى</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {patients.map(p => {
              const isSelected = p.id === activePatient.id;
              return (
                <div 
                  key={p.id}
                  onClick={() => onSelectPatient(p)}
                  className={`py-3 px-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {p.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</span>
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-600 text-white font-semibold">
                            النشط
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {p.fileNumber} · {p.primaryDiagnosis || 'غير محدد'}
                      </span>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold block ${
                      p.riskLevel === 'حرج' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' :
                      p.riskLevel === 'متوسط' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                      'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}>
                      {p.riskLevel}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                      {p.lastVisit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Scale Assessments Completed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">أحدث تقييمات المقاييس النفسية</h3>
            <button
              onClick={() => onNavigateTab('scales')}
              className="text-xs text-teal-700 dark:text-teal-400 hover:text-teal-800 font-bold cursor-pointer"
            >
              عرض السجل الكامل ←
            </button>
          </div>

          <div className="space-y-3">
            {scaleResults.map((res) => (
              <div 
                key={res.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{res.scaleName}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">({res.date})</span>
                  </div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 block mt-0.5">
                    المريض: <strong className="text-slate-800 dark:text-slate-100">{res.patientName}</strong>
                  </span>
                  {res.clinicianNotes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1 line-clamp-1">
                      "{res.clinicianNotes}"
                    </p>
                  )}
                </div>

                <div className="text-left shrink-0">
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    {res.totalScore} نقطة
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold block mt-0.5 ${
                    res.severity.badgeColor === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                    res.severity.badgeColor === 'teal' ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300' :
                    res.severity.badgeColor === 'amber' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                    res.severity.badgeColor === 'orange' ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300' :
                    'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                  }`}>
                    {res.severity.labelAr.split('(')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
