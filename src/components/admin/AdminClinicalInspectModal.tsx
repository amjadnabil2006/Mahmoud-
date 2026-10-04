import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Unlock, 
  FileText, 
  Pill, 
  Activity, 
  AlertTriangle, 
  X, 
  Check, 
  Eye, 
  Printer, 
  Download,
  Calendar,
  User,
  Stethoscope
} from 'lucide-react';
import { Patient, Doctor, ScaleAssessmentResult, Prescription } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  doctors: Doctor[];
  scaleResults: ScaleAssessmentResult[];
  prescriptions: Prescription[];
  onLogAudit: (action: string, target: string) => void;
}

export const AdminClinicalInspectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  patients,
  doctors,
  scaleResults,
  prescriptions,
  onLogAudit
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [inspectionReason, setInspectionReason] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [activeDocTab, setActiveDocTab] = useState<'notes' | 'scales' | 'rx' | 'vitals'>('notes');

  if (!isOpen) return null;

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const patientScales = scaleResults.filter(s => s.patientId === currentPatient?.id);
  const patientRx = prescriptions.filter(rx => rx.patientId === currentPatient?.id);

  const handleUnlockRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectionReason.trim()) return;

    setIsUnlocked(true);
    onLogAudit(
      `اطلاع إداري مطلق موثق على الملف السريري للمريض (${currentPatient.name}) - السبب: ${inspectionReason}`,
      `الملف الطبي: ${currentPatient.fileNumber}`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/20 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </span>
            <div>
              <h3 className="text-base font-bold">
                منظومة الاطلاع الإداري المطلق الموثق (Audited Clinical Records Access)
              </h3>
              <p className="text-xs text-amber-100">
                مطلب الإدارة (7): صلاحية مراجعة ملفات الجلسات الأولى والمتابعة مع التوثيق الإلزامي.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Screen if not verified */}
        {!isUnlocked ? (
          <div className="p-8 space-y-6 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                تأكيد هوية وسبب الاطلاع السريري
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                حسب معايير الأمان الطبي والسرية HIPAA/GDPR، الاطلاع على الملاحظات السريرية من قبل الإدارة يتطلب تسجيل سبب رسمي يُسجل في سجل التدقيق غير القابل للتعديل.
              </p>
            </div>

            <form onSubmit={handleUnlockRecord} className="space-y-4 text-right text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">اختر المريض المطلوب معاينة ملفه:</label>
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.fileNumber}) - المعالج: {p.assignedDoctor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">سبب الاطلاع الإداري (إلزامي للتدقيق):</label>
                <select
                  value={inspectionReason}
                  onChange={e => setInspectionReason(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold mb-2"
                >
                  <option value="">-- اختر سبب المراجعة --</option>
                  <option value="مراجعة وتدقيق الجودة الإكلينيكية الدورية">مراجعة وتدقيق الجودة الإكلينيكية الدورية</option>
                  <option value="متابعة حالة خطورة حرجة وتفعيل بروتوكول الأمان">متابعة حالة خطورة حرجة وتفعيل بروتوكول الأمان</option>
                  <option value="التحقيق في طلب استرداد أو شكوى جودة خدمة">التحقيق في طلب استرداد أو شكوى جودة خدمة</option>
                  <option value="اعتماد تقرير طبي رسمي مرفوع لجهة رسمية">اعتماد تقرير طبي رسمي مرفوع لجهة رسمية</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!inspectionReason}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                تأكيد والاطلاع على الملف وتوثيق الإجراء
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Clinical Viewer */
          <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
            {/* Patient Header Banner */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm">
                  {currentPatient.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {currentPatient.name} ({currentPatient.fileNumber})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    العمر: {currentPatient.age} سنة | الجنس: {currentPatient.gender} | المعالج المشرف: {currentPatient.assignedDoctor}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  طباعة
                </button>
                <button
                  onClick={() => setIsUnlocked(false)}
                  className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg font-semibold flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  قفل الملف
                </button>
              </div>
            </div>

            {/* Document Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              {[
                { id: 'notes', label: 'ملاحظات الجلسات (SOAP & Intake)', icon: FileText },
                { id: 'scales', label: 'المقاييس النفسية الرقمية', icon: Activity },
                { id: 'rx', label: 'الوصفات الطبية E-Rx', icon: Pill },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDocTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    activeDocTab === tab.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notes View */}
            {activeDocTab === 'notes' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 font-bold">
                    <span>الجلسة رقم 1: المقابلة التشخيصية الأولى (Intake Evaluation)</span>
                    <span>2026-09-28</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">الملاحظة الذاتية (S):</p>
                    <p className="text-slate-600 dark:text-slate-300">يشكو المريض من نوبات قلق وتوتر مستمرة وصعوبات في الاسترخاء منذ 3 أشهر.</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">الخطة العلاجية والتدخل (P):</p>
                    <p className="text-slate-600 dark:text-slate-300">البدء في تمارين التنفس الرئوي المربع وجدول سجل الأفكار المعرفي السلبي.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Scales View */}
            {activeDocTab === 'scales' && (
              <div className="space-y-2">
                {patientScales.length === 0 ? (
                  <p className="text-center text-slate-400 py-6">لا توجد مقاييس منجزة لهذا المريض بعد.</p>
                ) : (
                  patientScales.map(s => (
                    <div key={s.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-100 block">{s.scaleName}</span>
                        <span className="text-[11px] text-slate-400">التاريخ: {s.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-amber-600">الدرجة: {s.totalScore}</span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px]">{s.severity?.labelAr}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Rx View */}
            {activeDocTab === 'rx' && (
              <div className="space-y-2">
                {patientRx.length === 0 ? (
                  <p className="text-center text-slate-400 py-6">لا توجد وصفات دوائية مسجلة لهذا المريض.</p>
                ) : (
                  patientRx.map(rx => (
                    <div key={rx.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-100 block">وصفة رقم {rx.prescriptionNumber || rx.id}</span>
                        <span className="text-[11px] text-slate-400">الطبيب المعالج: {rx.doctorName} | التاريخ: {rx.date}</span>
                      </div>
                      <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold text-[10px]">معتمدة ومختومة</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
