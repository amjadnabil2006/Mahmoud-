import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Stethoscope, 
  Calendar, 
  Pill, 
  TrendingUp, 
  KeyRound, 
  Database, 
  Terminal, 
  Search, 
  Plus, 
  Check, 
  Play, 
  Lock, 
  Activity,
  FileText,
  AlertTriangle,
  Server
} from 'lucide-react';
import { Doctor, Patient, ClinicAnalytics, AuditLog } from '../types';
import { api } from '../services/api';

interface Props {
  analytics: ClinicAnalytics;
  doctors: Doctor[];
  patients: Patient[];
  auditLogs: AuditLog[];
  onAddNewDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  onAddNewPatient: (patient: Omit<Patient, 'id'>) => void;
}

export const AdminPortalView: React.FC<Props> = ({
  analytics,
  doctors,
  patients,
  auditLogs,
  onAddNewDoctor,
  onAddNewPatient,
}) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'doctors' | 'patients' | 'api_explorer' | 'audit_logs'>('kpis');
  
  // API Explorer state
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/v1/patients');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);

  // New Doctor form state
  const [showAddDocModal, setShowAddDocModal] = useState<boolean>(false);
  const [newDocName, setNewDocName] = useState<string>('');
  const [newDocTitle, setNewDocTitle] = useState<string>('استشاري الطب النفسي والعصبي');
  const [newDocSpecialty, setNewDocSpecialty] = useState<Doctor['specialty']>('استشاري الطب النفسي');
  const [newDocLicense, setNewDocLicense] = useState<string>('MD-PSY-' + Math.floor(10000 + Math.random() * 90000));
  const [newDocPhone, setNewDocPhone] = useState<string>('050' + Math.floor(1000000 + Math.random() * 9000000));

  // New Patient form state
  const [showAddPatientModal, setShowAddPatientModal] = useState<boolean>(false);
  const [newPatName, setNewPatName] = useState<string>('');
  const [newPatAge, setNewPatAge] = useState<number>(28);
  const [newPatGender, setNewPatGender] = useState<'ذكر' | 'أنثى'>('أنثى');
  const [newPatDiagnosis, setNewPatDiagnosis] = useState<string>('اضطراب القلق العام وتوترات التكيف');
  const [newPatRisk, setNewPatRisk] = useState<Patient['riskLevel']>('منخفض');
  const [newPatDoctor, setNewPatDoctor] = useState<string>(doctors[0]?.name || 'د. طارق الحكيم');

  // Run simulated API request
  const handleTestEndpoint = async (endpoint: string) => {
    setSelectedEndpoint(endpoint);
    setIsLoadingApi(true);
    setApiResponse('جاري إرسال الطلب ومعالجة الاستجابة من الخادم...');

    setTimeout(async () => {
      let data: any = {};
      if (endpoint === 'GET /api/v1/patients') {
        data = await api.patients.getAll();
      } else if (endpoint === 'GET /api/v1/doctors') {
        data = await api.doctors.getAll();
      } else if (endpoint === 'GET /api/v1/appointments') {
        data = await api.appointments.getAll();
      } else if (endpoint === 'GET /api/v1/prescriptions') {
        data = await api.prescriptions.getAll();
      } else if (endpoint === 'GET /api/v1/analytics') {
        data = await api.analytics.getKPIs();
      } else if (endpoint === 'GET /api/v1/audit-logs') {
        data = await api.auditLogs.getAll();
      }
      setApiResponse(JSON.stringify(data, null, 2));
      setIsLoadingApi(false);
    }, 400);
  };

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const deptId = newDocSpecialty === 'استشاري الطب النفسي' ? 'psychiatry' :
                   newDocSpecialty === 'أخصائي أول علاج نفسي' ? 'psychotherapy' :
                   newDocSpecialty === 'أخصائي تغذية علاجية' ? 'nutrition' : 'social_work';

    onAddNewDoctor({
      name: newDocName,
      title: newDocTitle,
      departmentId: deptId,
      specialty: newDocSpecialty,
      licenseNumber: newDocLicense,
      phone: newDocPhone,
      email: `${newDocName.split(' ')[0].toLowerCase()}@coolmind.clinic`,
      avatar: '/src/assets/images/dr_tariq_avatar_1790811098620.jpg',
      bio: 'ممارس صحي مرخص ومتخصص في الرعاية النفسية المتكاملة مع خبرة إكلينيكية واسعة.',
      rating: 4.9,
      reviewsCount: 38,
      experienceYears: 10,
      priceSAR: 350,
      priceUSD: 95,
      activePatientsCount: 1,
      availableDays: ['الأحد', 'الاثنين', 'الثلاثاء'],
      nextAvailableSlot: 'غداً 05:00 م',
      languages: ['العربية', 'الإنجليزية']
    });

    setNewDocName('');
    setShowAddDocModal(false);
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatName.trim()) return;

    onAddNewPatient({
      name: newPatName,
      age: Number(newPatAge) || 28,
      gender: newPatGender,
      fileNumber: 'CM-' + Math.floor(1000 + Math.random() * 9000),
      phone: '05' + Math.floor(10000000 + Math.random() * 90000000),
      email: `${newPatName.split(' ')[0].toLowerCase()}@patient.coolmind.clinic`,
      primaryDiagnosis: newPatDiagnosis,
      assignedDoctor: newPatDoctor,
      riskLevel: newPatRisk,
      status: 'نشط',
      lastVisit: 'اليوم',
      activeMedsCount: 0,
      completedScalesCount: 0
    });

    setNewPatName('');
    setShowAddPatientModal(false);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                لوحة تحكم إدارة المنصة والعيادة (Admin & System Portal)
              </span>
              <span className="text-xs text-slate-400">CoolMind Enterprise OS</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              مركز الإدارة العليا، الصلاحيات، والـ API وقاعدة البيانات
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              متابعة مؤشرات العيادة العامة، إدارة الكادر الطبي، التحقق من السجلات، ومختبر الـ API المباشر.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-300 bg-teal-950/80 border border-teal-800 px-3 py-1.5 rounded-xl">
              ● API v1.4 Online
            </span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 flex items-center gap-1 overflow-x-auto shadow-2xs">
        {[
          { id: 'kpis', label: 'المؤشرات العامة (KPIs)', icon: TrendingUp },
          { id: 'doctors', label: 'إدارة الأطباء والكادر', icon: Stethoscope },
          { id: 'patients', label: 'سجل المرضى والحسابات', icon: Users },
          { id: 'api_explorer', label: 'مستكشف الـ API وقاعدة البيانات', icon: Terminal },
          { id: 'audit_logs', label: 'سجلات التدقيق والأمان (HIPAA)', icon: ShieldCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs dark:bg-teal-700'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: KPIS & CLINIC PERFORMANCE */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-400 block font-medium">إجمالي المرضى المسجلين</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{analytics.totalPatients} مريضاً</span>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">+18 مريضاً هذا الشهر</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-400 block font-medium">الجلسات المنفذة شهرياً</span>
              <span className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1 block">{analytics.monthlySessions} جلسة</span>
              <span className="text-[11px] text-teal-700 font-semibold block mt-1">حضوري وعن بعد</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-400 block font-medium">معدل التعافي والتحسن السريري</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">{analytics.recoveryRatePercent}%</span>
              <span className="text-[11px] text-slate-400 block mt-1">بناء على نتائج المقاييس الدورية</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-400 block font-medium">الإيرادات الشهرية التقديرية</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block font-mono">
                {analytics.monthlyRevenueSAR.toLocaleString()} ر.س
              </span>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">معدل نمو +12%</span>
            </div>

          </div>

          {/* Quick System Health Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              حالة تشغيل خوادم وقاعدة بيانات منصة CoolMind
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">محرك المقاييس النفسية (Scales API)</span>
                  <span className="text-[11px] text-slate-400">زمن الاستجابة: 24ms</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">نظام التشفير الطبي (AES-256)</span>
                  <span className="text-[11px] text-slate-400">متوافق مع HIPAA و GDPR</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">النسخ الاحتياطي التلقائي (Backup)</span>
                  <span className="text-[11px] text-slate-400">آخر نسخة: اليوم 12:00 م</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTORS MANAGEMENT */}
      {activeTab === 'doctors' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">فريق الأطباء والممارسين المعتمدين</h2>
              <p className="text-xs text-slate-400">إدارة التراخيص الطبية وساعات الجلسات المتاحة</p>
            </div>
            <button
              onClick={() => setShowAddDocModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة طبيب جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map(doc => (
              <div key={doc.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{doc.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                      {doc.specialty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{doc.title}</p>
                  <div className="text-[11px] text-slate-400 font-mono pt-1">
                    ترخيص: {doc.licenseNumber} · {doc.experienceYears} سنوات خبرة · {doc.activePatientsCount} مرضى نشطين
                  </div>
                  <div className="text-[11px] text-teal-800 dark:text-teal-300 font-semibold pt-1">
                    أيام التواجد: {doc.availableDays.join(' · ')}
                  </div>
                </div>

                <div className="text-left font-mono font-bold text-amber-600 text-xs">
                  ★ {doc.rating}
                </div>
              </div>
            ))}
          </div>

          {/* Modal for adding doctor */}
          {showAddDocModal && (
            <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 space-y-4 border border-slate-200 dark:border-slate-800 text-right">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">إضافة طبيب أو معالج جديد للمنصة</h3>
                <form onSubmit={handleCreateDoctor} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اسم الطبيب:</label>
                    <input
                      type="text"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      placeholder="مثال: د. عبدالعزيز السالم"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">التخصص:</label>
                    <select
                      value={newDocSpecialty}
                      onChange={(e) => setNewDocSpecialty(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="استشاري الطب النفسي">استشاري الطب النفسي</option>
                      <option value="أخصائي أول علاج نفسي">أخصائي أول علاج نفسي</option>
                      <option value="أخصائي تغذية علاجية">أخصائي تغذية علاجية</option>
                      <option value="أخصائي خدمة اجتماعية ونفسية">أخصائي خدمة اجتماعية ونفسية</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">رقم الترخيص الطبي:</label>
                    <input
                      type="text"
                      value={newDocLicense}
                      onChange={(e) => setNewDocLicense(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddDocModal(false)}
                      className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-teal-700 text-white rounded-xl font-bold cursor-pointer hover:bg-teal-800"
                    >
                      حفظ الطبيب
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PATIENTS MASTER DIRECTORY */}
      {activeTab === 'patients' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">سجل المرضى الكامل (Patient Directory)</h2>
              <p className="text-xs text-slate-400">إجمالي {patients.length} ملفات طبية نشطة</p>
            </div>
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>فتح ملف مريض جديد</span>
            </button>
          </div>

          {/* Modal for adding patient */}
          {showAddPatientModal && (
            <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 space-y-4 border border-slate-200 dark:border-slate-800 text-right">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">فتح ملف مريض جديد بالعيادة</h3>
                <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اسم المريض الرباعي:</label>
                    <input
                      type="text"
                      value={newPatName}
                      onChange={(e) => setNewPatName(e.target.value)}
                      placeholder="مثال: نورة فهد القحطاني"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">العمر:</label>
                      <input
                        type="number"
                        min="10"
                        max="90"
                        value={newPatAge}
                        onChange={(e) => setNewPatAge(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الجنس:</label>
                      <select
                        value={newPatGender}
                        onChange={(e) => setNewPatGender(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="أنثى">أنثى</option>
                        <option value="ذكر">ذكر</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">التشخيص الأولي:</label>
                    <input
                      type="text"
                      value={newPatDiagnosis}
                      onChange={(e) => setNewPatDiagnosis(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">مستوى الخطورة:</label>
                      <select
                        value={newPatRisk}
                        onChange={(e) => setNewPatRisk(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="منخفض">منخفض</option>
                        <option value="متوسط">متوسط</option>
                        <option value="حرج">حرج</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الطبيب المشرف:</label>
                      <select
                        value={newPatDoctor}
                        onChange={(e) => setNewPatDoctor(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        {doctors.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPatientModal(false)}
                      className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-teal-700 text-white rounded-xl font-bold cursor-pointer hover:bg-teal-800"
                    >
                      إنشاء الملف الطبي
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">رقم الملف</th>
                  <th className="p-3">اسم المريض</th>
                  <th className="p-3">العمر / الجنس</th>
                  <th className="p-3">التشخيص</th>
                  <th className="p-3">مستوى الخطر</th>
                  <th className="p-3">الطبيب المعالج</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {patients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{p.fileNumber}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{p.name}</td>
                    <td className="p-3 text-slate-500">{p.age} سنة / {p.gender}</td>
                    <td className="p-3 text-teal-800 dark:text-teal-400 font-medium">{p.primaryDiagnosis}</td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        p.riskLevel === 'حرج' ? 'bg-rose-100 text-rose-800' :
                        p.riskLevel === 'متوسط' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.riskLevel}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{p.assignedDoctor}</td>
                    <td className="p-3 text-slate-500">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: API & DATABASE EXPLORER */}
      {activeTab === 'api_explorer' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-600" />
                <h2 className="font-bold text-base text-slate-900 dark:text-white">مستكشف واجهة برمجة التطبيقات (API & DB Explorer)</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                اختبر استدعاء نهايات الـ REST API واسترجع استجابات الـ JSON الحية من قاعدة البيانات الإكلينيكية
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 font-mono text-teal-700 dark:text-teal-300 rounded-lg">
              REST JSON API v1
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Endpoints List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 block mb-2">النهايات الطرفية المتاحة (Endpoints):</span>
              {[
                { method: 'GET', path: '/api/v1/patients', label: 'قائمة المرضى والسجلات' },
                { method: 'GET', path: '/api/v1/doctors', label: 'قائمة الأطباء والتراخيص' },
                { method: 'GET', path: '/api/v1/appointments', label: 'جدول الجلسات والمواعيد' },
                { method: 'GET', path: '/api/v1/prescriptions', label: 'الوصفات الطبية النفسية' },
                { method: 'GET', path: '/api/v1/analytics', label: 'مؤشرات العيادة الحيوية' },
                { method: 'GET', path: '/api/v1/audit-logs', label: 'سجلات أمان التدقيق HIPAA' },
              ].map(ep => {
                const epFull = `${ep.method} ${ep.path}`;
                const isSelected = selectedEndpoint === epFull;

                return (
                  <button
                    key={epFull}
                    onClick={() => handleTestEndpoint(epFull)}
                    className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-teal-700 dark:border-teal-600'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="font-mono font-bold text-xs block">{epFull}</span>
                      <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                        {ep.label}
                      </span>
                    </div>
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Live JSON Response Terminal */}
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">الاستجابة الحية (Live Response):</span>
                <span className="text-[11px] font-mono text-slate-400">Status: 200 OK · Content-Type: application/json</span>
              </div>

              <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto h-80 border border-slate-800 shadow-inner">
                {isLoadingApi ? (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    جاري الاستعلام من قاعدة البيانات...
                  </div>
                ) : apiResponse ? (
                  <pre className="text-[11px] leading-relaxed whitespace-pre-wrap">{apiResponse}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                    <Terminal className="w-8 h-8 text-slate-700" />
                    <span>اضغط على أي Endpoint على اليمين لاختبار الاستجابة اللحظية.</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS & COMPLIANCE */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">سجل التدقيق والأمان الإكلينيكي (HIPAA Audit Trail)</h2>
              <p className="text-xs text-slate-400">توثيق غير قابل للتعديل لكل حركة دخول واطلاع على السجلات الطبية</p>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-200">
              سجل محمي ومؤمّن
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {auditLogs.map(log => (
              <div 
                key={log.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{log.timestamp}</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">{log.actorName}</strong> ({log.actorRole})
                    <span className="text-teal-700 dark:text-teal-400 font-sans block sm:inline sm:mr-2">
                      قام بـ: {log.action}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-500 text-[11px]">{log.target}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-sans ${
                    log.status === 'نجاح' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
