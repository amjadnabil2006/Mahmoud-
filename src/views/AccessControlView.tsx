import React, { useState } from 'react';
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
  History,
  Search,
  Filter,
  Users,
  Clock
} from 'lucide-react';
import { UserRole, AuditLog, StaffUser } from '../types';

interface Props {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  auditLogs?: AuditLog[];
  currentStaff?: StaffUser | null;
}

export const AccessControlView: React.FC<Props> = ({ 
  currentRole, 
  setCurrentRole, 
  auditLogs = [],
  currentStaff
}) => {
  const [logSearchQuery, setLogSearchQuery] = useState('');

  const permissionsMatrix = [
    {
      feature: 'عرض السجلات والبيانات الديموغرافية',
      psychiatrist: true,
      psychologist: true,
      nutritionist: true,
      social_worker: true,
      supervisor: true,
      reception: false,
      admin: true
    },
    {
      feature: 'تحرير وصرف الوصفات الطبية الدوائية (Rx)',
      psychiatrist: true,
      psychologist: false,
      nutritionist: false,
      social_worker: false,
      supervisor: false,
      reception: false,
      admin: false
    },
    {
      feature: 'تطبيق وتصحيح المقاييس النفسية الرقمية',
      psychiatrist: true,
      psychologist: true,
      nutritionist: false,
      social_worker: false,
      supervisor: true,
      reception: false,
      admin: false
    },
    {
      feature: 'فحص الحالة العقلية الشامل (MSE)',
      psychiatrist: true,
      psychologist: true,
      nutritionist: false,
      social_worker: false,
      supervisor: true,
      reception: false,
      admin: false
    },
    {
      feature: 'تقييم خطورة الانتحار وإيذاء النفس (C-SSRS)',
      psychiatrist: true,
      psychologist: true,
      nutritionist: false,
      social_worker: true,
      supervisor: true,
      reception: false,
      admin: false
    },
    {
      feature: 'تعديل بروتوكولات التغذية النفسية ومؤشر الأيض',
      psychiatrist: true,
      psychologist: false,
      nutritionist: true,
      social_worker: false,
      supervisor: true,
      reception: false,
      admin: false
    },
    {
      feature: 'دراسة البيئة الأسرية والبحث الاجتماعي',
      psychiatrist: true,
      psychologist: true,
      nutritionist: false,
      social_worker: true,
      supervisor: true,
      reception: false,
      admin: false
    },
    {
      feature: 'إدارة وتأكيد مواعيد الحجوزات اليومية',
      psychiatrist: true,
      psychologist: true,
      nutritionist: true,
      social_worker: true,
      supervisor: true,
      reception: true,
      admin: true
    },
    {
      feature: 'مراجعة واعتماد الجودة وسجلات الإشراف',
      psychiatrist: false,
      psychologist: false,
      nutritionist: false,
      social_worker: false,
      supervisor: true,
      reception: false,
      admin: true
    },
    {
      feature: 'إدارة حسابات الفريق وسجلات التدقيق (Audit Logs)',
      psychiatrist: false,
      psychologist: false,
      nutritionist: false,
      social_worker: false,
      supervisor: false,
      reception: false,
      admin: true
    }
  ];

  const filteredLogs = auditLogs.filter(log => 
    log.actorName.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
    log.target.toLowerCase().includes(logSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 dark:bg-slate-800 text-teal-300 font-bold font-mono">
                HIPAA / RBAC Ready
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">نظام التحكم بالوصول والسرية والتدقيق السريري</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              مصفوفة الصلاحيات وسجلات التدقيق (Audit Trail)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              عزل الأدوار السريرية والوصفات الدوائية، توثيق كل عملية وصول وحفظ وطباعة بالفاعل الحقيقي والزمن.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-slate-500">المستخدم النشط:</span>
            <strong className="text-teal-700 dark:text-teal-400">{currentStaff?.name || 'د. طارق الحكيم'}</strong>
            <span className="font-mono text-[10px] text-slate-400">({currentRole})</span>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs overflow-x-auto space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-teal-600" />
            <span>مصفوفة الصلاحيات المهنية المعتمدة (RBAC Matrix)</span>
          </h3>
          <span className="text-xs text-slate-400">تُطبق برمجياً وتمنع أي وصول غير مصرح</span>
        </div>

        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300">
              <th className="p-3 font-bold">الميزة السريرية / الصلاحية</th>
              <th className="p-3 text-center font-bold">طبيب نفسي</th>
              <th className="p-3 text-center font-bold">أخصائي نفسي</th>
              <th className="p-3 text-center font-bold">أخصائي تغذية</th>
              <th className="p-3 text-center font-bold">خدمة اجتماعية</th>
              <th className="p-3 text-center font-bold">مشرف إكلينيكي</th>
              <th className="p-3 text-center font-bold">استقبال</th>
              <th className="p-3 text-center font-bold">مدير العيادة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {permissionsMatrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{row.feature}</td>
                <td className="p-3 text-center">{row.psychiatrist ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}</td>
                <td className="p-3 text-center">{row.psychologist ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}</td>
                <td className="p-3 text-center">{row.nutritionist ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}</td>
                <td className="p-3 text-center">{row.social_worker ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}</td>
                <td className="p-3 text-center">{row.supervisor ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}</td>
                <td className="p-3 text-center">{row.reception ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}</td>
                <td className="p-3 text-center">{row.admin ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audit Trail Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              سجل التدقيق الأمني والسريري المباشر (Immutable Audit Trail)
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={logSearchQuery}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              placeholder="بحث في الأحداث أو الفاعلين..."
              className="w-full pl-3 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300">
                <th className="p-2.5 font-bold">الوقت والتاريخ</th>
                <th className="p-2.5 font-bold">الفاعل السريري</th>
                <th className="p-2.5 font-bold">الإجراء الموثق</th>
                <th className="p-2.5 font-bold">الهدف / المريض</th>
                <th className="p-2.5 font-bold font-mono">عنوان IP</th>
                <th className="p-2.5 font-bold text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                  <td className="p-2.5 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                  <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">{log.actorName}</td>
                  <td className="p-2.5 text-slate-700 dark:text-slate-300">{log.action}</td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-400">{log.target}</td>
                  <td className="p-2.5 font-mono text-[11px] text-slate-500">{log.ipAddress}</td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
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
