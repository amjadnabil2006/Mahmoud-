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
  Server,
  Layers,
  Edit3,
  Trash2,
  RotateCcw,
  SlidersHorizontal,
  Settings
} from 'lucide-react';
import { Doctor, Patient, ClinicAnalytics, AuditLog, Appointment, TherapyExercise, ClinicSettings } from '../types';
import { Department, CLINICAL_DEPARTMENTS, getDepartmentColorStyles } from '../data/departments';
import { DepartmentIcon } from '../components/DepartmentIcon';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { AdminAppointmentsTab } from '../components/admin/AdminAppointmentsTab';
import { AdminExercisesTab } from '../components/admin/AdminExercisesTab';
import { api, INITIAL_SETTINGS } from '../services/api';

export type AdminTabId = 
  | 'settings' 
  | 'departments' 
  | 'doctors' 
  | 'appointments' 
  | 'patients' 
  | 'exercises' 
  | 'kpis' 
  | 'audit_logs' 
  | 'api_explorer';

interface Props {
  analytics: ClinicAnalytics;
  doctors: Doctor[];
  patients: Patient[];
  departments?: Department[];
  appointments?: Appointment[];
  exercises?: TherapyExercise[];
  settings?: ClinicSettings;
  auditLogs: AuditLog[];
  onAddNewDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  onUpdateDoctor?: (id: string, updated: Partial<Doctor>) => Promise<void>;
  onDeleteDoctor?: (id: string) => Promise<void>;
  onAddNewPatient: (patient: Omit<Patient, 'id'>) => void;
  onUpdatePatient?: (id: string, updated: Partial<Patient>) => Promise<void>;
  onDeletePatient?: (id: string) => Promise<void>;
  onUpdateAppointment?: (id: string, updated: Partial<Appointment>) => Promise<void>;
  onDeleteAppointment?: (id: string) => Promise<void>;
  onUpdateSettings?: (settings: Partial<ClinicSettings>) => Promise<void>;
  onResetSettings?: () => Promise<void>;
  onAddExercise?: (ex: Omit<TherapyExercise, 'id'>) => Promise<void>;
  onUpdateExercise?: (id: string, updated: Partial<TherapyExercise>) => Promise<void>;
  onDeleteExercise?: (id: string) => Promise<void>;
  onCreateDepartment?: (dept: Omit<Department, 'id'> & { id?: string }) => Promise<void>;
  onUpdateDepartment?: (id: string, updated: Partial<Department>) => Promise<void>;
  onDeleteDepartment?: (id: string) => Promise<void>;
  onResetDepartments?: () => Promise<void>;
  onOpenDepartmentManagerModal?: (dept?: Department) => void;
}

export const AdminPortalView: React.FC<Props> = ({
  analytics,
  doctors,
  patients,
  departments = CLINICAL_DEPARTMENTS,
  appointments = [],
  exercises = [],
  settings = INITIAL_SETTINGS,
  auditLogs,
  onAddNewDoctor,
  onUpdateDoctor,
  onDeleteDoctor,
  onAddNewPatient,
  onUpdatePatient,
  onDeletePatient,
  onUpdateAppointment,
  onDeleteAppointment,
  onUpdateSettings,
  onResetSettings,
  onAddExercise,
  onUpdateExercise,
  onDeleteExercise,
  onCreateDepartment,
  onUpdateDepartment,
  onDeleteDepartment,
  onResetDepartments,
  onOpenDepartmentManagerModal,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabId>('settings');
  
  // API Explorer state
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/v1/patients');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);

  // New Doctor form state
  const [showAddDocModal, setShowAddDocModal] = useState<boolean>(false);
  const [newDocName, setNewDocName] = useState<string>('');
  const [newDocTitle, setNewDocTitle] = useState<string>('استشاري الطب النفسي والعصبي');
  const [newDocDepartmentId, setNewDocDepartmentId] = useState<string>(departments[0]?.id || 'psychiatry');
  const [newDocSpecialty, setNewDocSpecialty] = useState<string>('استشاري الطب النفسي');
  const [newDocLicense, setNewDocLicense] = useState<string>('MD-PSY-' + Math.floor(10000 + Math.random() * 90000));
  const [newDocPhone, setNewDocPhone] = useState<string>('050' + Math.floor(1000000 + Math.random() * 9000000));
  
  // Local department search & delete state in Admin
  const [deptSearchQuery, setDeptSearchQuery] = useState<string>('');
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);

  // Doctor edit and delete states
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  // New Patient form state
  const [showAddPatientModal, setShowAddPatientModal] = useState<boolean>(false);
  const [newPatName, setNewPatName] = useState<string>('');
  const [newPatAge, setNewPatAge] = useState<number>(28);
  const [newPatGender, setNewPatGender] = useState<'ذكر' | 'أنثى'>('أنثى');
  const [newPatDiagnosis, setNewPatDiagnosis] = useState<string>('اضطراب القلق العام وتوترات التكيف');
  const [newPatRisk, setNewPatRisk] = useState<Patient['riskLevel']>('منخفض');
  const [newPatDoctor, setNewPatDoctor] = useState<string>(doctors[0]?.name || 'د. طارق الحكيم');

  // Patient edit and delete states
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

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

    const deptId = newDocDepartmentId || (
      newDocSpecialty === 'استشاري الطب النفسي' ? 'psychiatry' :
      newDocSpecialty === 'أخصائي أول علاج نفسي' ? 'psychotherapy' :
      newDocSpecialty === 'أخصائي تغذية علاجية' ? 'nutrition' : 'social_work'
    );

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
          { id: 'settings', label: 'إعدادات الموقع والمنصة', icon: Settings },
          { id: 'departments', label: 'إدارة الأقسام الطبية', icon: Layers },
          { id: 'doctors', label: 'إدارة الأطباء والكادر', icon: Stethoscope },
          { id: 'appointments', label: 'إدارة المواعيد والحجوزات', icon: Calendar },
          { id: 'patients', label: 'سجل وحسابات المرضى', icon: Users },
          { id: 'exercises', label: 'التمارين والمهام السلوكية', icon: Activity },
          { id: 'kpis', label: 'المؤشرات العامة (KPIs)', icon: TrendingUp },
          { id: 'audit_logs', label: 'سجلات التدقيق والأمان (HIPAA)', icon: ShieldCheck },
          { id: 'api_explorer', label: 'مستكشف الـ API وقاعدة البيانات', icon: Terminal },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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

      {/* TAB: SITE & PLATFORM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-teal-600" />
              <span>التحكم في إعدادات المنصة وهوية الصفحة الرئيسية</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              تعديل أسماء العيادة، العناوين الترحيبية، أرقام الطوارئ، وتفعيل شريط الإعلانات العاجلة في أعلى الموقع
            </p>
          </div>

          <AdminSettingsTab
            settings={settings}
            onUpdateSettings={onUpdateSettings || (async () => {})}
            onResetSettings={onResetSettings || (async () => {})}
          />
        </div>
      )}

      {/* TAB: APPOINTMENTS MANAGEMENT */}
      {activeTab === 'appointments' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <AdminAppointmentsTab
            appointments={appointments}
            doctors={doctors}
            patients={patients}
            onUpdateAppointment={onUpdateAppointment || (async () => {})}
            onDeleteAppointment={onDeleteAppointment || (async () => {})}
          />
        </div>
      )}

      {/* TAB: EXERCISES MANAGEMENT */}
      {activeTab === 'exercises' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <AdminExercisesTab
            exercises={exercises}
            onAddExercise={onAddExercise || (async () => {})}
            onUpdateExercise={onUpdateExercise || (async () => {})}
            onDeleteExercise={onDeleteExercise || (async () => {})}
          />
        </div>
      )}

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

      {/* TAB: DEPARTMENTS MANAGEMENT */}
      {activeTab === 'departments' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  إدارة الأقسام والعيادات الطبية التخصصية
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
                  {departments.length} أقسام معتمدة
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                التحكم الكامل في الأقسام الطبية المعروضة في الصفحة الرئيسية: إضافة عيادات جديدة، تعديل الاضطرابات، أو حذف الأقسام
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onResetDepartments && (
                <button
                  onClick={async () => {
                    if (confirm('هل ترغب في استعادة الأقسام الطبية الافتراضية الأربعة الأصلية؟')) {
                      await onResetDepartments();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                  title="استعادة الأقسام الأصلية"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة الافتراضي</span>
                </button>
              )}
              <button
                onClick={() => onOpenDepartmentManagerModal ? onOpenDepartmentManagerModal() : null}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قسم جديد</span>
              </button>
            </div>
          </div>

          {/* Department KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">الأقسام الفعالة</span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">{departments.length}</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">معروضة في الرئيسية ونظام الحجز</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">الأطباء الموزعين</span>
              <span className="text-xl font-black text-teal-600 dark:text-teal-400 mt-1 block">{doctors.length} ممارساً</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">مرتبطين بالعيادات التخصصية</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">الاضطرابات والحالات المغطاة</span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
                {departments.reduce((acc, d) => acc + (d.targetDisorders?.length || 0), 0)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">تشخيصات إكلينيكية مدرجة</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">البروتوكولات العلاجية</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
                {departments.reduce((acc, d) => acc + (d.recommendedTreatments?.length || 0), 0)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">طرق وتدخلات دوائية وسلوكية</span>
            </div>
          </div>

          {/* Department Search */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={deptSearchQuery}
              onChange={(e) => setDeptSearchQuery(e.target.value)}
              placeholder="ابحث عن قسم في لوحة الإدارة بالاسم أو الوصف..."
              className="w-full pr-9 pl-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments
              .filter(d => {
                if (!deptSearchQuery.trim()) return true;
                const q = deptSearchQuery.toLowerCase();
                return d.nameAr.toLowerCase().includes(q) || d.nameEn.toLowerCase().includes(q) || d.badge.toLowerCase().includes(q);
              })
              .map(dept => {
                const assignedDocs = doctors.filter(d => d.departmentId === dept.id);
                const colors = getDepartmentColorStyles(dept.accentColor);

                return (
                  <div
                    key={dept.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colors.iconBg}`}>
                            <DepartmentIcon iconName={dept.iconName} className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                              {dept.nameAr}
                            </h3>
                            <span className="text-[11px] font-mono text-slate-400 block" dir="ltr">
                              {dept.nameEn}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onOpenDepartmentManagerModal ? onOpenDepartmentManagerModal(dept) : null}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/60 dark:text-slate-400 dark:hover:text-teal-300 transition-colors cursor-pointer"
                            title="تعديل القسم"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {onDeleteDepartment && (
                            <button
                              onClick={() => setDeptToDelete(dept)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition-colors cursor-pointer"
                              title="حذف القسم"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-2 text-xs">
                        <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}>
                          {dept.badge}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {assignedDocs.length} أطباء مسجلين
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          ID: {dept.id}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {dept.fullDesc || dept.shortDesc}
                      </p>

                      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200/70 dark:border-slate-800 text-xs space-y-1.5">
                        <strong className="block text-slate-800 dark:text-slate-200 text-[11px]">
                          الاضطرابات المستهدفة ({dept.targetDisorders.length}):
                        </strong>
                        <div className="flex flex-wrap gap-1">
                          {dept.targetDisorders.map((disorder, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium"
                            >
                              {disorder}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>معروض ونشط في الرئيسية</span>
                      </span>

                      <button
                        onClick={() => onOpenDepartmentManagerModal ? onOpenDepartmentManagerModal(dept) : null}
                        className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل التفاصيل</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Delete confirmation dialog inside Admin */}
          {deptToDelete && (
            <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 text-right border border-rose-200 dark:border-rose-900/50 shadow-2xl space-y-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    تأكيد حذف قسم "{deptToDelete.nameAr}"
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    سيتم إزالة هذا القسم فوراً من الصفحة الرئيسية ولوحة الأقسام ولن يظهر في خيارات الحجز.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setDeptToDelete(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={async () => {
                      if (onDeleteDepartment) {
                        await onDeleteDepartment(deptToDelete.id);
                        setDeptToDelete(null);
                      }
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    تأكيد الحذف نهائياً
                  </button>
                </div>
              </div>
            </div>
          )}
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
              <div key={doc.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{doc.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                        {doc.specialty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{doc.title}</p>
                    <div className="text-[11px] text-slate-400 font-mono pt-1">
                      ترخيص: {doc.licenseNumber} · {doc.experienceYears} سنوات خبرة · {doc.priceSAR} ر.س
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingDoctor(doc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/60 transition-colors"
                      title="تعديل بيانات الطبيب"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDoctorToDelete(doc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                      title="حذف الطبيب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <button
                    onClick={async () => {
                      if (onUpdateDoctor) {
                        await onUpdateDoctor(doc.id, { isAvailable: doc.isAvailable === false ? true : false });
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      doc.isAvailable !== false
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${doc.isAvailable !== false ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    <span>{doc.isAvailable !== false ? 'متاح للحجز الفوري' : 'في إجازة / غير متاح'}</span>
                  </button>

                  <span className="font-mono font-bold text-amber-600 text-xs">
                    ★ {doc.rating} ({doc.reviewsCount})
                  </span>
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
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">القسم الطبي التابع له:</label>
                    <select
                      value={newDocDepartmentId}
                      onChange={(e) => setNewDocDepartmentId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.nameAr} ({dept.badge})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">المسمى والتخصص الوظيفي:</label>
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

          {/* Modal for editing doctor */}
          {editingDoctor && (
            <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 space-y-4 border border-slate-200 dark:border-slate-800 text-right">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">تعديل بيانات الطبيب: {editingDoctor.name}</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (onUpdateDoctor) {
                      await onUpdateDoctor(editingDoctor.id, editingDoctor);
                      setEditingDoctor(null);
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الاسم:</label>
                    <input
                      type="text"
                      value={editingDoctor.name}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">القسم الطبي:</label>
                    <select
                      value={editingDoctor.departmentId}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, departmentId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.nameAr}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">السعر (ر.س):</label>
                      <input
                        type="number"
                        value={editingDoctor.priceSAR}
                        onChange={(e) => setEditingDoctor({ ...editingDoctor, priceSAR: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">سنوات الخبرة:</label>
                      <input
                        type="number"
                        value={editingDoctor.experienceYears}
                        onChange={(e) => setEditingDoctor({ ...editingDoctor, experienceYears: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">نبذة الطبيب:</label>
                    <textarea
                      rows={2}
                      value={editingDoctor.bio}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, bio: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingDoctor(null)}
                      className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800"
                    >
                      حفظ التعديلات
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Doctor Modal */}
          {doctorToDelete && (
            <div className="fixed inset-0 z-60 bg-slate-900/80 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 text-right space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  تأكيد حذف الطبيب
                </h3>
                <p className="text-xs text-slate-500">
                  هل أنت متأكد من حذف الطبيب {doctorToDelete.name}؟ لن يظهر الطبيب في قائمة الأطباء أو حجز المواعيد.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setDoctorToDelete(null)}
                    className="px-3 py-1.5 text-xs text-slate-600"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={async () => {
                      if (onDeleteDoctor) {
                        await onDeleteDoctor(doctorToDelete.id);
                        setDoctorToDelete(null);
                      }
                    }}
                    className="px-4 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold"
                  >
                    تأكيد الحذف
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: PATIENTS MASTER DIRECTORY */}
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
                  <th className="p-3 text-center">الإجراءات</th>
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
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setEditingPatient(p)}
                          className="p-1 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/50"
                          title="تعديل ملف المريض"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPatientToDelete(p)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title="حذف ملف المريض"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Patient Modal */}
          {editingPatient && (
            <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 space-y-4 border border-slate-200 dark:border-slate-800 text-right text-xs">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">تعديل ملف المريض: {editingPatient.name}</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (onUpdatePatient) {
                      await onUpdatePatient(editingPatient.id, editingPatient);
                      setEditingPatient(null);
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الاسم:</label>
                    <input
                      type="text"
                      value={editingPatient.name}
                      onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">التشخيص الأساسي:</label>
                    <input
                      type="text"
                      value={editingPatient.primaryDiagnosis}
                      onChange={(e) => setEditingPatient({ ...editingPatient, primaryDiagnosis: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">مستوى الخطورة:</label>
                      <select
                        value={editingPatient.riskLevel}
                        onChange={(e) => setEditingPatient({ ...editingPatient, riskLevel: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="منخفض">منخفض</option>
                        <option value="متوسط">متوسط</option>
                        <option value="حرج">حرج</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">حالة الملف:</label>
                      <select
                        value={editingPatient.status}
                        onChange={(e) => setEditingPatient({ ...editingPatient, status: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="نشط">نشط</option>
                        <option value="مستقر">مستقر</option>
                        <option value="قيد المتابعة المكثفة">قيد المتابعة المكثفة</option>
                        <option value="مكتمل">مكتمل</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingPatient(null)}
                      className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800"
                    >
                      حفظ التعديلات
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Patient Modal */}
          {patientToDelete && (
            <div className="fixed inset-0 z-60 bg-slate-900/80 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 text-right space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">تأكيد حذف ملف المريض</h3>
                <p className="text-xs text-slate-500">
                  هل أنت متأكد من حذف ملف المريض {patientToDelete.name} ({patientToDelete.fileNumber}) نهائياً؟
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setPatientToDelete(null)}
                    className="px-3 py-1.5 text-xs text-slate-600"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={async () => {
                      if (onDeletePatient) {
                        await onDeletePatient(patientToDelete.id);
                        setPatientToDelete(null);
                      }
                    }}
                    className="px-4 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold"
                  >
                    تأكيد الحذف
                  </button>
                </div>
              </div>
            </div>
          )}
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
