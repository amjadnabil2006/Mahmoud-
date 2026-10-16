import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Check, 
  X, 
  Eye, 
  Lock, 
  Unlock, 
  Users, 
  Sparkles, 
  RotateCcw,
  Megaphone,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { UserRole } from '../../types';
import { rbacService, FeaturePermission } from '../../services/rbac';

interface Props {
  onLogAudit?: (action: string, target: string) => void;
  onPreviewRole?: (role: UserRole) => void;
}

export const AdminRBACControlTab: React.FC<Props> = ({ onLogAudit, onPreviewRole }) => {
  const [permissions, setPermissions] = useState<FeaturePermission[]>(() => rbacService.getPermissions());
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [targetBroadcastRole, setTargetBroadcastRole] = useState<string>('all');
  const [showBroadcastSuccess, setShowBroadcastSuccess] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    const handleRbacUpdate = () => {
      setPermissions(rbacService.getPermissions());
    };
    window.addEventListener('coolmind_rbac_updated', handleRbacUpdate);
    return () => window.removeEventListener('coolmind_rbac_updated', handleRbacUpdate);
  }, []);

  const rolesList: { id: UserRole; label: string; badgeColor: string }[] = [
    { id: 'psychiatrist', label: 'طبيب نفسي (Psychiatrist)', badgeColor: 'teal' },
    { id: 'psychologist', label: 'أخصائي نفسي (CBT)', badgeColor: 'indigo' },
    { id: 'nutritionist', label: 'تغذية علاجية', badgeColor: 'emerald' },
    { id: 'social_worker', label: 'خدمة اجتماعية', badgeColor: 'cyan' },
    { id: 'supervisor', label: 'مشرف إكلينيكي', badgeColor: 'purple' },
    { id: 'reception', label: 'استقبال وتنسيق', badgeColor: 'slate' },
    { id: 'support', label: 'دعم فني', badgeColor: 'amber' },
  ];

  const handleTogglePermission = (featId: string, role: UserRole) => {
    const updated = rbacService.togglePermission(featId, role);
    setPermissions(updated);

    const feat = updated.find(p => p.id === featId);
    const newStatus = feat?.rolesAllowed[role] ? 'منح صلاحية' : 'حجب صلاحية';

    setSavedNotice(`تم تحديث الصلاحية بنجاح: ${newStatus} (${feat?.nameAr}) لدور [${role}]`);
    setTimeout(() => setSavedNotice(null), 3500);

    if (onLogAudit) {
      onLogAudit(`${newStatus}: ${feat?.nameAr}`, `الدور: ${role}`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('هل ترغب في إعادة ضبط مصفوفة الصلاحيات إلى التوزيع القياسي الافتراضي؟')) {
      const reset = rbacService.resetToDefault();
      setPermissions(reset);
      setSavedNotice('تمت استعادة مصفوفة الصلاحيات الافتراضية المعتمدة.');
      setTimeout(() => setSavedNotice(null), 3000);
      if (onLogAudit) {
        onLogAudit('استعادة الصلاحيات الافتراضية للعيادة', 'كافة الأدوار الإكلينيكية');
      }
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    if (onLogAudit) {
      onLogAudit(`إرسال تعميم إداري داخلي للكادر: ${broadcastMessage}`, `الفئة المستهدفة: ${targetBroadcastRole}`);
    }

    setShowBroadcastSuccess(true);
    setBroadcastMessage('');
    setTimeout(() => setShowBroadcastSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
              <KeyRound className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              التحكم الفعلي بواجهات العاملين ومصفوفة الصلاحيات (RBAC Customization Matrix)
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            مطلب الإدارة (8): تخصيص ميزات كل تخصص على حدة، حجب أو إتاحة الوصفات والتقارير والنماذج فعلياً في واجهات الأطباء.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>استعادة الضبط الافتراضي</span>
        </button>
      </div>

      {/* Live Saved Alert */}
      {savedNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
          <span className="text-[10px] opacity-75 font-normal mr-auto">يتم تطبيق القيود فوراً على عيادة الطبيب المعني</span>
        </div>
      )}

      {/* Internal Staff Broadcast Banner Form */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white p-5 rounded-2xl border border-indigo-500/30 shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold">إرسال تعميم وتوجيه إداري داخلي للكادر (Staff Broadcast)</h3>
        </div>

        <form onSubmit={handleSendBroadcast} className="flex flex-col sm:flex-row items-stretch gap-2 text-xs">
          <input
            type="text"
            required
            placeholder="اكتب التوجيه أو الإعلان الداخلي هنا (مثال: نرجو من جميع المعالجين الالتزام بتدوين ملاحظات SOAP خلال 24 ساعة)..."
            value={broadcastMessage}
            onChange={e => setBroadcastMessage(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            value={targetBroadcastRole}
            onChange={e => setTargetBroadcastRole(e.target.value)}
            className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
          >
            <option value="all">كافة الكادر الطبي والإداري</option>
            <option value="psychiatrist">الأطباء النفسيون فقط</option>
            <option value="psychologist">أخصائيو العلاج السلوكي فقط</option>
            <option value="nutritionist">أخصائيو التغذية فقط</option>
            <option value="social_worker">الأخصائيون الاجتماعيون فقط</option>
          </select>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            نشر التعميم
          </button>
        </form>

        {showBroadcastSuccess && (
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
            <Check className="w-4 h-4" />
            تم إرسال ونشر التعميم الإداري لجميع الكوادر المستهدفة بنجاح.
          </div>
        )}
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              مصفوفة التحكم بالميزات الإكلينيكية والتشغيلية لكل دور
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              انقر على أي علامة لتفعيل (أخضر) أو حجب (أحمر) الميزة فوراً عن ذلك التخصص. التعديلات تحفظ سحابياً وتطبق لحظياً.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                <th className="p-4 w-72">الميزة والوظيفة الإكلينيكية</th>
                <th className="p-4 w-32">التصنيف</th>
                {rolesList.map(r => (
                  <th key={r.id} className="p-4 text-center font-bold">
                    <div className="text-xs">{r.label.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-normal">
                      {r.id === 'psychiatrist' ? 'طبيب' : r.id === 'psychologist' ? 'نفسي' : r.id === 'nutritionist' ? 'تغذية' : r.id === 'social_worker' ? 'اجتماعي' : r.id}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {permissions.map(feat => (
                <tr key={feat.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{feat.nameAr}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{feat.description}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      {feat.category}
                    </span>
                  </td>
                  {rolesList.map(r => {
                    const isAllowed = feat.rolesAllowed[r.id];
                    return (
                      <td key={r.id} className="p-4 text-center">
                        <button
                          onClick={() => handleTogglePermission(feat.id, r.id)}
                          type="button"
                          className={`w-8 h-8 rounded-xl inline-flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                            isAllowed
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white ring-2 ring-emerald-500/30'
                              : 'bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-600 dark:text-rose-400'
                          }`}
                          title={`${isAllowed ? 'مفعل ومسموح' : 'محجوب وممنوع'} - انقر للتبديل`}
                        >
                          {isAllowed ? <Check className="w-4 h-4 stroke-[2.5]" /> : <X className="w-4 h-4 stroke-[2.5]" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>أخضر: ميزة متاحة ومصرح بها للدور</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>أحمر: محجوبة بقفل أمني وتظهر مقفلة للممارس</span>
            </span>
          </div>
          <span className="font-mono text-[11px]">
            التحديثات تُسجل في الـ Audit Log فوراً
          </span>
        </div>
      </div>
    </div>
  );
};
