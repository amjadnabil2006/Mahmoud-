import React, { useState } from 'react';
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
  ExternalLink,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Send,
  MessageSquare,
  Sparkles,
  Lock
} from 'lucide-react';
import { Patient, ScaleAssessmentResult, Prescription, UserRole, Appointment, StaffUser } from '../types';

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
  currentStaff?: StaffUser | null;
  onOpenPatientFileModal?: (patient: Patient) => void;
  onOpenSendScaleModal?: (patient: Patient) => void;
  onOpenChatWithPatient?: (patient: Patient) => void;
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
  currentStaff,
  onOpenPatientFileModal,
  onOpenSendScaleModal,
  onOpenChatWithPatient
}) => {
  const [patientFilter, setPatientFilter] = useState<'my_patients' | 'all_patients'>('my_patients');
  const [accessReasonModalOpen, setAccessReasonModalOpen] = useState(false);
  const [accessReason, setAccessReason] = useState('تغطية استشارية بديلة / مراجعة إكلينيكية طارئة');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const doctorId = currentStaff?.doctorId || 'doc-hakim';

  // Filter patients by assigned doctor (OBS-D-004)
  const myPatients = patients.filter(p => 
    p.assignedDoctorId === doctorId || p.assignedDoctor.includes(currentStaff?.name || 'د. طارق الحكيم')
  );

  const baseList = (patientFilter === 'my_patients' && currentRole !== 'reception' && currentRole !== 'admin')
    ? (myPatients.length > 0 ? myPatients : patients)
    : patients;

  const filteredPatients = baseList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.fileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.primaryDiagnosis?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || p.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const highRiskCount = patients.filter(p => p.riskLevel === 'حرج' || p.riskLevel === 'مرتفع').length;

  const handleToggleAllPatients = () => {
    if (patientFilter === 'my_patients') {
      setAccessReasonModalOpen(true);
    } else {
      setPatientFilter('my_patients');
    }
  };

  const handleConfirmAccessAll = () => {
    setPatientFilter('all_patients');
    setAccessReasonModalOpen(false);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold mb-3 border border-white/10">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>عيادة الطبيب والمعالج المعتمدة · كول مايند</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black mb-2 text-white">
            مرحباً بك، {currentStaff?.name || 'د. طارق الحكيم'}
          </h1>
          <p className="text-slate-200 text-xs leading-relaxed mb-4">
            تخصصك المعتمد: <strong>{currentStaff?.specialty || 'استشاري الطب النفسي'}</strong> (ترخيص: <span className="font-mono">{currentStaff?.licenseNumber || 'MD-PSY-98442'}</span>). 
            ملفات المرضى محمية بروتوكولياً ومربوطة بجدول مواعيدك ونظام المقاييس والوصفات.
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenClinicalForm('soap_note')}
              className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>توثيق جلسة علاجية (SOAP)</span>
            </button>

            {currentRole === 'psychiatrist' && (
              <button
                onClick={onOpenNewPrescription}
                className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20 cursor-pointer"
              >
                <Pill className="w-4 h-4 text-teal-300" />
                <span>إصدار وصفة دوائية (E-Rx)</span>
              </button>
            )}

            <button
              onClick={() => onOpenQuickScale('phq-9')}
              className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-teal-300" />
              <span>تطبيق مقياس نفسي (PHQ-9)</span>
            </button>
          </div>
        </div>

        <div className="absolute left-0 bottom-0 translate-y-1/3 -translate-x-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Statistical Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">مرضاي النشطون</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {myPatients.length} <span className="text-xs font-normal text-slate-400">ملف</span>
            </div>
            <span className="text-[11px] text-teal-600 font-bold">معزولة حسب المختص ✓</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">المقاييس المكتملة</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {scaleResults.length} <span className="text-xs font-normal text-slate-400">تقييم</span>
            </div>
            <span className="text-[11px] text-teal-600 font-bold">48 مقياس معتمد</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">الوصفات النشطة</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {prescriptions.length} <span className="text-xs font-normal text-slate-400">وصفة</span>
            </div>
            <span className="text-[11px] text-teal-600 font-bold">E-Rx معتمدة ومختومة</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">إنذارات الخطورة</span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
              {highRiskCount} <span className="text-xs font-normal text-slate-400">حالة</span>
            </div>
            <span className="text-[11px] text-rose-600 font-bold">بروتوكول C-SSRS نشط</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Patients Section with Isolation & Search (OBS-D-004 & OBS-D-019) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        
        {/* Filter bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-850">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPatientFilter('my_patients')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                patientFilter === 'my_patients'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              مرضاي المعالجون فقط ({myPatients.length})
            </button>

            <button
              onClick={handleToggleAllPatients}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                patientFilter === 'all_patients'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              جميع مرضى العيادة (اطلاع مقيد)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم أو التشخيص..."
                className="w-full pl-3 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="all">كل درجات الخطورة</option>
              <option value="منخفض">منخفض</option>
              <option value="متوسط">متوسط</option>
              <option value="مرتفع">مرتفع</option>
            </select>
          </div>

        </div>

        {/* Patients Cards List */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatients.map(patient => {
            const isSelected = patient.id === activePatient.id;
            return (
              <div
                key={patient.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isSelected
                    ? 'bg-teal-50/40 dark:bg-teal-950/30 border-teal-500 shadow-xs'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-teal-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center text-sm">
                      {patient.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">{patient.name}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {patient.fileNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {patient.age} سنة · {patient.gender} · آخر زيارة: {patient.lastVisit}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    patient.riskLevel === 'مرتفع' || patient.riskLevel === 'حرج'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-teal-50 text-teal-800 border-teal-200'
                  }`}>
                    {patient.riskLevel}
                  </span>
                </div>

                {/* Diagnosis */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                  <strong>التشخيص:</strong> {patient.primaryDiagnosis}
                </div>

                {/* Quick patient actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    {onOpenPatientFileModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPatient(patient);
                          onOpenPatientFileModal(patient);
                        }}
                        className="px-2.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>فتح الملف الطبي</span>
                      </button>
                    )}

                    {onOpenChatWithPatient && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPatient(patient);
                          onOpenChatWithPatient(patient);
                        }}
                        className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs cursor-pointer"
                        title="محادثة المريض"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectPatient(patient)}
                    className="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                  >
                    {isSelected ? 'المريض النشط ✓' : 'تحديد للعيادة'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Access Reason Modal (OBS-D-004) */}
      {accessReasonModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 text-right space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" />
              <span>إذن الاطلاع على ملفات خارج نطاق الإشراف المباشر</span>
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              للحفاظ على الخصوصية والسرية الطبية (HIPAA)، يتطلب استعراض ملفات مرضى الأطباء الآخرين تسجيل سبب سريري رسمي، ويتم توثيق هذا الإجراء في سجل التدقيق التلقائي.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                السبب السريري المسجل للاطلاع:
              </label>
              <textarea
                rows={2}
                value={accessReason}
                onChange={(e) => setAccessReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAccessReasonModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-500 font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmAccessAll}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold"
              >
                تأكيد وتسجيل في التدقيق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
