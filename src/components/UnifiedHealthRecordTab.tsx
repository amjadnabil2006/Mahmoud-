import React from 'react';
import { 
  Activity, 
  Calendar, 
  FileText, 
  Pill, 
  Smile, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldCheck, 
  Heart,
  ChevronLeft
} from 'lucide-react';
import { Appointment, Prescription, ScaleAssessmentResult, Patient } from '../types';

interface Props {
  patient: Patient;
  appointments: Appointment[];
  prescriptions: Prescription[];
  scaleResults: ScaleAssessmentResult[];
  onTakeScale: (scaleId: string) => void;
  onViewPrescription: (rx: Prescription) => void;
}

export const UnifiedHealthRecordTab: React.FC<Props> = ({
  patient,
  appointments,
  prescriptions,
  scaleResults,
  onTakeScale,
  onViewPrescription
}) => {
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);
  const patientScales = scaleResults.filter(s => s.patientId === patient.id);

  // Timeline events combined
  const timelineEvents = [
    ...patientAppointments.map(a => ({
      type: 'appointment',
      date: a.date,
      title: `جلسة مع ${a.doctorName}`,
      desc: a.sessionGoal,
      status: a.status,
      badge: a.type
    })),
    ...patientPrescriptions.map(p => ({
      type: 'prescription',
      date: p.date,
      title: `روشتة طبية معتمدة: ${p.doctorName}`,
      desc: `التشخيص: ${p.diagnosis} (${p.items.length} أدوية)`,
      status: 'معتمد',
      raw: p
    })),
    ...patientScales.map(s => ({
      type: 'scale',
      date: s.date,
      title: `مقياس ${s.scaleName}`,
      desc: `النتيجة: ${s.totalScore} نقطة — ${s.severity.labelAr}`,
      status: 'مكتمل'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold">
            <Activity className="w-3.5 h-3.5" />
            الملف الصحي الموحد (Unified EHR)
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            السجل الطبي والرعاية المستمرة — {patient.fileNumber}
          </h3>
          <p className="text-xs text-teal-100 max-w-xl">
            سجل إكلينيكي مشفر يوثق رحلتك العلاجية، تقييمات المقاييس النفسية، ومسار التعافي وتوصيات المختصين.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center min-w-[90px]">
            <span className="text-2xl font-black text-teal-300">{patientAppointments.length}</span>
            <p className="text-[10px] text-teal-100 mt-0.5">جلسات منجزة</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center min-w-[90px]">
            <span className="text-2xl font-black text-emerald-300">{patientScales.length}</span>
            <p className="text-[10px] text-teal-100 mt-0.5">مقاييس مكتملة</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center min-w-[90px]">
            <span className="text-2xl font-black text-amber-300">{patientPrescriptions.length}</span>
            <p className="text-[10px] text-teal-100 mt-0.5">وصفات علاجية</p>
          </div>
        </div>
      </div>

      {/* Progression & Scale History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              الخط الزمني للرحلة العلاجية (Timeline)
            </h4>
            <span className="text-xs text-slate-400">{timelineEvents.length} أحداث مسجلة</span>
          </div>

          <div className="relative border-r-2 border-slate-200 dark:border-slate-800 pr-4 space-y-6 mr-2">
            {timelineEvents.map((ev, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -right-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 border-2 border-white dark:border-slate-900 shadow-sm"></div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-400 transition space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-600 dark:text-teal-400">{ev.title}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{ev.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{ev.desc}</p>
                  {ev.type === 'prescription' && (
                    <button
                      onClick={() => onViewPrescription((ev as any).raw)}
                      className="text-xs font-bold text-teal-600 hover:underline pt-1 flex items-center gap-1"
                    >
                      <span>عرض الروشتة المعتمدة والطباعة</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scales Progression Card */}
        <div className="space-y-4">
          <h4 className="font-black text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            مؤشر انحسار الأعراض والتعافي
          </h4>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold block">معدل التحسن الإكلينيكي</span>
                <span className="text-2xl font-black text-emerald-600">+64%</span>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">آخر المقاييس المطبقة:</span>
              {patientScales.slice(0, 3).map((sc, i) => (
                <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{sc.scaleName.split('(')[0]}</p>
                    <p className="text-[10px] text-slate-400">{sc.date}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 rounded font-bold">
                    {sc.totalScore} نقطة
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onTakeScale('phq-9')}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
            >
              إجراء فحص ذاتي دوري جديد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
