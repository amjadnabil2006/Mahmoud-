import React from 'react';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Pill, 
  Activity, 
  FileText, 
  Apple, 
  BookOpen, 
  ShieldCheck, 
  Sparkles,
  Users
} from 'lucide-react';
import { UserRole } from '../types';

export type TabId = 
  | 'dashboard' 
  | 'psychiatry' 
  | 'prescriptions' 
  | 'scales' 
  | 'clinical_forms' 
  | 'nutrition_social' 
  | 'handbook' 
  | 'access_control';

interface SidebarProps {
  currentTab: TabId;
  setCurrentTab: (tab: TabId) => void;
  currentRole: UserRole;
  pendingRiskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  pendingRiskCount,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as TabId,
      label: 'لوحة القيادة الإكلينيكية',
      icon: LayoutDashboard,
      badge: null,
      desc: 'المؤشرات والملفات الحالية'
    },
    {
      id: 'psychiatry' as TabId,
      label: 'الطب النفسي والتشخيصات',
      icon: Stethoscope,
      badge: 'DSM-5',
      desc: 'الدليل التشخيصي والدوائي'
    },
    {
      id: 'scales' as TabId,
      label: 'المقاييس والاختبارات النفسية',
      icon: Activity,
      badge: 'تصحيح آلي',
      desc: 'PHQ-9, GAD-7, Y-BOCS...'
    },
    {
      id: 'prescriptions' as TabId,
      label: 'الوصفات الطبية النفسية',
      icon: Pill,
      badge: null,
      desc: 'إصدار وطباعة الوصفات'
    },
    {
      id: 'clinical_forms' as TabId,
      label: 'النماذج الإكلينيكية (MSE/SOAP)',
      icon: FileText,
      badge: pendingRiskCount > 0 ? `${pendingRiskCount} خطر` : null,
      desc: 'فحص الحالة العقلية وتقييم الخطر'
    },
    {
      id: 'nutrition_social' as TabId,
      label: 'التغذية والخدمة الاجتماعية',
      icon: Apple,
      badge: null,
      desc: 'محور الأمعاء-الدماغ والدعم الأسري'
    },
    {
      id: 'handbook' as TabId,
      label: 'دليل كول مايند السريري',
      icon: BookOpen,
      badge: 'مرجع',
      desc: 'دليل الممارسة والبروتوكولات'
    },
    {
      id: 'access_control' as TabId,
      label: 'الأمان والسرية والصلاحيات',
      icon: ShieldCheck,
      badge: 'HIPAA',
      desc: 'أدوار النظام وسجلات الوصول'
    }
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shrink-0 p-4 flex flex-col justify-between transition-colors">
      
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          مساحات العمل التخصصية (Workspaces)
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-right transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs block leading-tight">{item.label}</span>
                    <span className={`text-[10px] block mt-0.5 ${isActive ? 'text-teal-200' : 'text-slate-400 dark:text-slate-500'}`}>
                      {item.desc}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    item.badge.includes('خطر')
                      ? 'bg-rose-500 text-white animate-pulse'
                      : isActive
                      ? 'bg-white/20 text-teal-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Clinic Status Box */}
      <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-right">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">حالة قاعدة البيانات الإكلينيكية</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            محرك المقاييس والأدوية متصل محلياً بكفاءة 100% بدون إنترنت (Offline-First).
          </p>
          <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>CoolMind OS</span>
            <span>RTL Ready</span>
          </div>
        </div>
      </div>

    </aside>
  );
};
