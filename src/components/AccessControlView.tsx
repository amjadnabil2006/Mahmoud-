import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Check, 
  X, 
  AlertTriangle, 
  History, 
  Search, 
  Filter, 
  Users, 
  Stethoscope, 
  Sparkles,
  Pill,
  FileText,
  Activity,
  DollarSign,
  ChevronDown,
  CheckCircle2,
  Clock,
  Eye,
  LayoutGrid,
  List,
  ShieldAlert,
  ArrowUpRight,
  BadgeCheck,
  UserCheck,
  Settings2
} from 'lucide-react';
import { UserRole, AuditLog, StaffUser } from '../types';
import { staffAuthService } from '../services/staffAuth';
import { rbacService } from '../services/rbac';

interface Props {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  auditLogs?: AuditLog[];
  currentStaff?: StaffUser | null;
  onLogAudit?: (action: string, target: string) => void;
}

interface RoleConfig {
  id: UserRole;
  labelAr: string;
  badgeLabel: string;
  description: string;
  themeColor: string;
  accentBg: string;
  borderAccent: string;
  dotColor: string;
}

const ROLE_METRICS_CONFIG: RoleConfig[] = [
  { 
    id: 'psychiatrist', 
    labelAr: 'طبيب نفسي استشاري (Psychiatrist)', 
    badgeLabel: 'طب نفسي',
    description: 'تشخيص دوائي كامل، فحص MSE، وإصدار الوصفات المقيدة E-Rx.',
    themeColor: 'text-teal-600 dark:text-teal-400',
    accentBg: 'bg-teal-500/10 dark:bg-teal-500/15',
    borderAccent: 'border-teal-500/30',
    dotColor: 'bg-teal-500'
  },
  { 
    id: 'psychologist', 
    labelAr: 'أخصائي علاج نفسي وسلوكي (CBT)', 
    badgeLabel: 'علاج سلوكي',
    description: 'تطبيق مقاييس القلق والاكتئاب، جلسات CBT، وتوثيق SOAP.',
    themeColor: 'text-indigo-600 dark:text-indigo-400',
    accentBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    borderAccent: 'border-indigo-500/30',
    dotColor: 'bg-indigo-500'
  },
  { 
    id: 'nutritionist', 
    labelAr: 'أخصائي تغذية علاجية (Nutritionist)', 
    badgeLabel: 'تغذية علاجية',
    description: 'خطط التغذية لمحور الأمعاء-الدماغ وحساب المتلازمة الأيضية.',
    themeColor: 'text-emerald-600 dark:text-emerald-400',
    accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    borderAccent: 'border-emerald-500/30',
    dotColor: 'bg-emerald-500'
  },
  { 
    id: 'social_worker', 
    labelAr: 'أخصائي خدمة اجتماعية (Social Worker)', 
    badgeLabel: 'خدمة اجتماعية',
    description: 'الإرشاد الأسري، دراسة الحالة الاجتماعية، والدعم البيئي.',
    themeColor: 'text-cyan-600 dark:text-cyan-400',
    accentBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    borderAccent: 'border-cyan-500/30',
    dotColor: 'bg-cyan-500'
  },
  { 
    id: 'supervisor', 
    labelAr: 'مشرف إكلينيكي عام (Supervisor)', 
    badgeLabel: 'إشراف وجودة',
    description: 'مراجعة كافة الملفات الطبية واعتماد تقارير الجودة الإكلينيكية.',
    themeColor: 'text-purple-600 dark:text-purple-400',
    accentBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    borderAccent: 'border-purple-500/30',
    dotColor: 'bg-purple-500'
  },
  { 
    id: 'reception', 
    labelAr: 'منسق استقبال وحجوزات (Reception)', 
    badgeLabel: 'استقبال وتنسيق',
    description: 'إدارة أوقات العيادات وجدولة المواعيد وتوجيه المراجعين.',
    themeColor: 'text-slate-600 dark:text-slate-400',
    accentBg: 'bg-slate-500/10 dark:bg-slate-500/15',
    borderAccent: 'border-slate-500/30',
    dotColor: 'bg-slate-500'
  },
  { 
    id: 'support', 
    labelAr: 'دعم فني ومسؤول نظام (Support)', 
    badgeLabel: 'دعم فني',
    description: 'إدارة الحسابات، صلاحيات النظام، ومراقبة استقرار الـ API.',
    themeColor: 'text-amber-600 dark:text-amber-400',
    accentBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    borderAccent: 'border-amber-500/30',
    dotColor: 'bg-amber-500'
  }
];

export const AccessControlView: React.FC<Props> = ({ 
  currentRole, 
  setCurrentRole, 
  auditLogs = [],
  currentStaff,
  onLogAudit
}) => {
  const [staffList, setStaffList] = useState<StaffUser[]>(() => staffAuthService.getAllStaffUsers());
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // Sync staff list on external updates
  useEffect(() => {
    const handleListUpdate = (e: any) => {
      if (e.detail) {
        setStaffList(e.detail);
      } else {
        setStaffList(staffAuthService.getAllStaffUsers());
      }
    };
    window.addEventListener('coolmind_staff_list_updated', handleListUpdate);
    return () => window.removeEventListener('coolmind_staff_list_updated', handleListUpdate);
  }, []);

  // Immediate role update handler
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const targetUser = staffList.find(u => u.id === userId);
    const oldRole = targetUser?.role || 'غير محدد';

    const updated = staffAuthService.updateStaffUserRole(userId, newRole);
    setStaffList(updated);

    const roleConfig = ROLE_METRICS_CONFIG.find(r => r.id === newRole);
    setSuccessToast(`تم بنجاح تحديث صلاحيات [${targetUser?.name || 'الموظف'}] فورياً إلى: ${roleConfig?.badgeLabel || newRole}`);
    setTimeout(() => setSuccessToast(null), 3800);

    if (currentStaff && currentStaff.id === userId) {
      setCurrentRole(newRole);
    }

    if (onLogAudit) {
      onLogAudit(
        `تعديل مصفوفة الصلاحيات من [${oldRole}] إلى [${newRole}]`,
        `الموظف: ${targetUser?.name || userId} (${targetUser?.licenseNumber || ''})`
      );
    }
  };

  const handleSwitchToStaff = (userId: string) => {
    const user = staffAuthService.switchStaffUser(userId);
    setCurrentRole(user.role);
    setSuccessToast(`تم التبديل لتصفح المنصة بصلاحيات الموظف: ${user.name}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Filter staff members
  const filteredStaff = staffList.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = activeRoleFilter === 'all' || user.role === activeRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredLogs = auditLogs.filter(log => 
    log.actorName.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
    log.target.toLowerCase().includes(logSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-7 text-right">
      
      {/* 1. Architectural Geometric Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-lg">
        {/* Geometric Abstract Grid Lines */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span className="font-mono text-xs uppercase tracking-wider text-teal-400 font-bold">
                Access Control & RBAC Governance Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              نظام إدارة الصلاحيات وهيكلة الكادر السريري
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              تحكم ديناميكي ولحظي بالأدوار الوظيفية، الصلاحيات الدوائية والسريرية، مع عزل أمني مشفر مطابق لمتطلبات HIPAA.
            </p>
          </div>

          {/* Active Clinician Geometric Badge */}
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 flex items-center gap-3.5 shrink-0 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">ACTIVE CLINICIAN CONTEXT</span>
              <strong className="text-sm font-bold text-white block">
                {currentStaff?.name || 'د. طارق الحكيم'}
              </strong>
              <span className="text-xs text-teal-400 font-bold">
                {ROLE_METRICS_CONFIG.find(r => r.id === currentRole)?.badgeLabel || currentRole}
              </span>
            </div>
          </div>
        </div>

        {/* Geometric Metrics Counters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800 text-xs">
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
            <span className="text-slate-400 block mb-1">إجمالي الكادر الطبي</span>
            <strong className="text-lg font-black text-white">{staffList.length} ممارساً</strong>
          </div>
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
            <span className="text-slate-400 block mb-1">صلاحية وصف الأدوية (E-Rx)</span>
            <strong className="text-lg font-black text-teal-400">
              {staffList.filter(s => rbacService.isFeatureAllowed(s.role, 'e_rx_prescriptions')).length} أطباء
            </strong>
          </div>
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
            <span className="text-slate-400 block mb-1">العلاج السلوكي والمقاييس</span>
            <strong className="text-lg font-black text-indigo-400">
              {staffList.filter(s => rbacService.isFeatureAllowed(s.role, 'clinical_scales_runner')).length} أخصائيين
            </strong>
          </div>
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
            <span className="text-slate-400 block mb-1">التوثيق السريري (SOAP/MSE)</span>
            <strong className="text-lg font-black text-purple-400">
              {staffList.filter(s => rbacService.isFeatureAllowed(s.role, 'clinical_forms_soap')).length} معتمدين
            </strong>
          </div>
        </div>
      </div>

      {/* Floating Dynamic Success Notice */}
      {successToast && (
        <div className="p-4 bg-emerald-600 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-slideUp">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{successToast}</span>
          </div>
          <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-lg font-mono">
            LIVE SYNC COMPLETE
          </span>
        </div>
      )}

      {/* 2. Structured Control Toolbar: Filter Tabs + Search + View Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، رقم الترخيص، التخصص الدقيق..."
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>

          {/* Right Controls: View Toggle (Grid / Table) */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">طريقة العرض:</span>
            <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewLayout('grid')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewLayout === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="عرض البطاقات الهندسية المنظمة"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">شبكة هندسية</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('table')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewLayout === 'table'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="عرض الجدول المصفى"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">جدول إداري</span>
              </button>
            </div>
          </div>
        </div>

        {/* Role Segmented Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveRoleFilter('all')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeRoleFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-teal-700 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            كافة الكادر ({staffList.length})
          </button>
          {ROLE_METRICS_CONFIG.map(role => {
            const count = staffList.filter(s => s.role === role.id).length;
            const isActive = activeRoleFilter === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveRoleFilter(role.id)}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-teal-700 shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${role.dotColor}`}></span>
                <span>{role.badgeLabel}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. STAFF DISPLAY (GEOMETRIC GRID VIEW) */}
      {viewLayout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredStaff.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
              <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="font-bold text-sm">لا يوجد ممارسون يطابقون معايير البحث والفلترة.</p>
            </div>
          ) : (
            filteredStaff.map(user => {
              const roleConfig = ROLE_METRICS_CONFIG.find(r => r.id === user.role) || ROLE_METRICS_CONFIG[0];
              const isCurrentActive = currentStaff?.id === user.id;

              // Capabilities evaluation based on active RBAC rules
              const canPrescribe = rbacService.isFeatureAllowed(user.role, 'e_rx_prescriptions');
              const canRunScales = rbacService.isFeatureAllowed(user.role, 'clinical_scales_runner');
              const canDoSoap = rbacService.isFeatureAllowed(user.role, 'clinical_forms_soap');
              const canViewFinances = rbacService.isFeatureAllowed(user.role, 'financials_view');

              return (
                <div
                  key={user.id}
                  className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border transition-all hover:shadow-lg flex flex-col justify-between ${
                    isCurrentActive 
                      ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Top Geometric Accent Band */}
                  <div className={`h-1.5 w-full ${roleConfig.dotColor}`} />

                  <div className="p-5 sm:p-6 space-y-5">
                    
                    {/* Header: Avatar, Name, License, Role Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 shadow-inner">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80'}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                          {user.isLicensed && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center justify-center">
                              <Check className="w-2 h-2 text-white stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isCurrentActive && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-600 text-white font-bold">
                                أنت الآن
                              </span>
                            )}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5 line-clamp-1">
                            {user.specialty}
                          </span>
                        </div>
                      </div>

                      {/* License Tag */}
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold shrink-0">
                        {user.licenseNumber}
                      </span>
                    </div>

                    {/* Interactive Role Switcher Block */}
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/70 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                          <span>الصلاحية والدور الإكلينيكي:</span>
                        </span>
                        <span className={`text-[11px] font-bold ${roleConfig.themeColor}`}>
                          {roleConfig.badgeLabel}
                        </span>
                      </div>

                      {/* The Instant Dropdown Menu */}
                      <div className="relative">
                        <select
                          value={user.role}
                          onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                          className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border-2 border-teal-500/40 hover:border-teal-500 dark:border-teal-600/60 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-2xs transition-all"
                        >
                          {ROLE_METRICS_CONFIG.map(opt => (
                            <option key={opt.id} value={opt.id}>
                              {opt.labelAr}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-teal-600 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Geometric 4-Module Capability Grid */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                        المصفوفة الإكلينيكية الفعالة لهذا الموظف
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        
                        {/* 1. Rx Module */}
                        <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-1.5 transition-colors ${
                          canPrescribe 
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200' 
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <Pill className={`w-3.5 h-3.5 shrink-0 ${canPrescribe ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span className="font-bold text-[11px]">الوصفات E-Rx</span>
                          </div>
                          {canPrescribe ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                        </div>

                        {/* 2. Scales Module */}
                        <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-1.5 transition-colors ${
                          canRunScales 
                            ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200' 
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <Activity className={`w-3.5 h-3.5 shrink-0 ${canRunScales ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className="font-bold text-[11px]">المقاييس النفسية</span>
                          </div>
                          {canRunScales ? <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                        </div>

                        {/* 3. SOAP & MSE Module */}
                        <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-1.5 transition-colors ${
                          canDoSoap 
                            ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-200' 
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <FileText className={`w-3.5 h-3.5 shrink-0 ${canDoSoap ? 'text-purple-600' : 'text-slate-400'}`} />
                            <span className="font-bold text-[11px]">ملاحظات SOAP</span>
                          </div>
                          {canDoSoap ? <Check className="w-3.5 h-3.5 text-purple-600 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                        </div>

                        {/* 4. Finances Module */}
                        <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-1.5 transition-colors ${
                          canViewFinances 
                            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200' 
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className={`w-3.5 h-3.5 shrink-0 ${canViewFinances ? 'text-amber-600' : 'text-slate-400'}`} />
                            <span className="font-bold text-[11px]">كشف الحساب 75%</span>
                          </div>
                          {canViewFinances ? <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Card Bottom Actions */}
                  <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
                      {user.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSwitchToStaff(user.id)}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-teal-700 hover:text-white dark:hover:bg-teal-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold shadow-2xs border border-slate-200 dark:border-slate-600 transition-all flex items-center gap-1 cursor-pointer"
                      title="معاينة المنصة بصلاحيات هذا الموظف مباشرة"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>معاينة كدور</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* 4. ALTERNATIVE: COMPACT CLINICAL DATA TABLE */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  <th className="p-4">الموظف والمسمى</th>
                  <th className="p-4">الترخيص والبريد</th>
                  <th className="p-4">تعديل الدور (فوري)</th>
                  <th className="p-4 text-center">الوصفات</th>
                  <th className="p-4 text-center">المقاييس</th>
                  <th className="p-4 text-center">SOAP</th>
                  <th className="p-4 text-center">المالية</th>
                  <th className="p-4 text-center">معاينة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStaff.map(user => {
                  const roleConfig = ROLE_METRICS_CONFIG.find(r => r.id === user.role) || ROLE_METRICS_CONFIG[0];
                  const canPrescribe = rbacService.isFeatureAllowed(user.role, 'e_rx_prescriptions');
                  const canRunScales = rbacService.isFeatureAllowed(user.role, 'clinical_scales_runner');
                  const canDoSoap = rbacService.isFeatureAllowed(user.role, 'clinical_forms_soap');
                  const canViewFinances = rbacService.isFeatureAllowed(user.role, 'financials_view');

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80'}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                            <span className="text-[11px] text-slate-400">{user.specialty}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-teal-600 font-bold">{user.licenseNumber}</div>
                        <div className="text-[11px] text-slate-400 font-mono" dir="ltr">{user.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="relative w-44">
                          <select
                            value={user.role}
                            onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                            className="w-full pl-6 pr-2.5 py-1.5 bg-white dark:bg-slate-800 border border-teal-500/50 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer"
                          >
                            {ROLE_METRICS_CONFIG.map(opt => (
                              <option key={opt.id} value={opt.id}>{opt.labelAr}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-teal-600 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {canPrescribe ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        {canRunScales ? <Check className="w-4 h-4 text-blue-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        {canDoSoap ? <Check className="w-4 h-4 text-purple-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        {canViewFinances ? <Check className="w-4 h-4 text-amber-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleSwitchToStaff(user.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="معاينة"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Immutable Audit Trail Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-teal-600">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                سجل التدقيق الأمني ومتابعة تغيير الصلاحيات (Audit Trail)
              </h3>
              <span className="text-[11px] text-slate-400">توثيق ثابت غير قابل للتعديل لكل عملية تغيير صلاحية أو دخول</span>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={logSearchQuery}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              placeholder="ابحث في سجل العمليات والفاعلين..."
              className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold">
                <th className="p-3">التاريخ والوقت</th>
                <th className="p-3">الفاعل المسؤول</th>
                <th className="p-3">الإجراء الموثق</th>
                <th className="p-3">الهدف المعني</th>
                <th className="p-3 font-mono">عنوان IP</th>
                <th className="p-3 text-center">حالة التدقيق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredLogs.slice(0, 10).map(log => (
                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{log.actorName}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{log.action}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{log.target}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-500">{log.ipAddress}</td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
