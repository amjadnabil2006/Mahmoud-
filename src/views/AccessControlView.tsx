import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  FileLock2, 
  Check, 
  X,
  AlertTriangle,
  History
} from 'lucide-react';
import { UserRole } from '../types';

interface Props {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

export const AccessControlView: React.FC<Props> = ({ currentRole, setCurrentRole }) => {
  const permissionsMatrix = [
    {
      feature: 'عرض السجلات والبيانات الديموغرافية',
      psychiatrist: true,
      psychologist: true,
      nutritionist: true,
      social_worker: true,
      admin: true
    },
    {
      feature: 'تحرير وصرف الوصفات الطبية الدوائية (Rx)',
      psychiatrist: true,
      psychologist: false,
      nutritionist: false,
      social_worker: false,
      admin: false
    },
    {
      feature: 'تطبيق وتصحيح المقاييس النفسية الرقمية',
      psychiatrist: true,
      psychologist: true,
      nutritionist: false,
      social_worker: false,
      admin: false
    },
    {
      feature: 'فحص الحالة العقلية الشامل (MSE)',
      psychiatrist: true,
      psychologist: true,
      nutritionist: false,
      social_worker: false,
      admin: false
    },
    {
      feature: 'تقييم خطورة الانتحار وإيذاء النفس (C-SSRS)',
      psychiatrist: true,
      psychologist: true,
      nutritionist: false,
      social_worker: true,
      admin: false
    },
    {
      feature: 'تعديل بروتوكولات التغذية النفسية ومؤشر الأيض',
      psychiatrist: true,
      psychologist: false,
      nutritionist: true,
      social_worker: false,
      admin: false
    },
    {
      feature: 'دراسة البيئة الأسرية والبحث الاجتماعي',
      psychiatrist: true,
      psychologist: true,
      nutritionist: false,
      social_worker: true,
      admin: false
    },
    {
      feature: 'إدارة حسابات الفريق وسجلات التدقيق (Audit Logs)',
      psychiatrist: false,
      psychologist: false,
      nutritionist: false,
      social_worker: false,
      admin: true
    }
  ];

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 dark:bg-slate-800 text-teal-300 font-bold font-mono">
                HIPAA / GDPR Ready
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">نظام التحكم بالوصول والسرية الطبية الفائقة</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              إدارة الصلاحيات والأمان والسرية الطبية (RBAC)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              حماية خصوصية ملفات المرضى النفسيين وتطبيق مبدأ الحد الأدنى من الإفصاح الضروري (Need-to-Know Principle).
            </p>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>التشفير المحلي للبيانات: <strong className="text-emerald-700 dark:text-emerald-400">مفعل (AES-256)</strong></span>
          </div>
        </div>
      </div>

      {/* Role Switcher Sandbox for Testing */}
      <div className="bg-slate-900 dark:bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-teal-400" />
            <h2 className="font-bold text-sm">اختبار وتجربة الأدوار الوظيفية (Role Switcher)</h2>
          </div>
          <span className="text-xs text-teal-300 font-mono">الدور الحالي: {currentRole}</span>
        </div>
        <p className="text-xs text-slate-300">
          اختر دوراً لتجربة كيف تتكيف المنصة وشاشاتها فورياً حسب صلاحيات الممارس الصحي:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {[
            { id: 'psychiatrist', label: 'طبيب نفسي' },
            { id: 'psychologist', label: 'أخصائي نفسي' },
            { id: 'nutritionist', label: 'أخصائي تغذية' },
            { id: 'social_worker', label: 'أخصائي اجتماعي' },
            { id: 'admin', label: 'إدارة العيادة' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setCurrentRole(r.id as UserRole)}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentRole === r.id
                  ? 'bg-teal-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="font-bold text-slate-900 dark:text-white text-base">
            مصفوفة الصلاحيات السريرية والإدارية (Access Control Matrix)
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            توزيع الصلاحيات وفق المعايير الطبية الدولية لتفادي تداخل الاختصاصات
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">الوظيفة / الإجراء السريري</th>
                <th className="p-3 text-center">طبيب نفسي</th>
                <th className="p-3 text-center">معالج نفسي</th>
                <th className="p-3 text-center">أخصائي تغذية</th>
                <th className="p-3 text-center">أخصائي اجتماعي</th>
                <th className="p-3 text-center">إدارة العيادة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{item.feature}</td>
                  
                  <td className="p-3 text-center">
                    {item.psychiatrist ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {item.psychologist ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {item.nutritionist ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {item.social_worker ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {item.admin ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Principles & Audit Log Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>معايير الخصوصية الصارمة للمريض النفسي</span>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed list-disc mr-4">
            <li><strong>فصل الملاحظات الخاصة:</strong> ملاحظات الجلسات التحليلية غير متاحة للموظفين الإداريين أو الاستقبال.</li>
            <li><strong>تشفير الوصفات الطبية:</strong> الوصفات تحمي بيانات الأدوية وتمنع التلاعب بالجرعات أو تكرار الصرف غير المشروع.</li>
            <li><strong>سجل التدقيق الرقمي:</strong> يُسجل وقت وتاريخ وهوية كل ممارس قام بالاطلاع على أي ملف مريض.</li>
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
              <History className="w-4 h-4 text-slate-500" />
              <span>سجل النشاط والأمان المباشر (Audit Log)</span>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">آمن</span>
          </div>

          <div className="space-y-2 text-[11px] font-mono text-slate-600 dark:text-slate-400">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400">13:45</span> · د. طارق الحكيم أجرى مقياس PHQ-9 للمريضة سارة المنصور (CM-2026-081).
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400">13:30</span> · تم إصدار وصفة Escitalopram 10mg للملف (CM-2026-081).
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400">12:15</span> · تم اعتماد فحص الحالة العقلية MSE بنجاح للملف (CM-2026-089).
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
