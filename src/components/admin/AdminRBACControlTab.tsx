import React, { useState } from 'react';
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
  Megaphone
} from 'lucide-react';
import { UserRole } from '../../types';

interface Props {
  onLogAudit?: (action: string, target: string) => void;
  onPreviewRole?: (role: UserRole) => void;
}

interface FeaturePermission {
  id: string;
  nameAr: string;
  category: string;
  description: string;
  rolesAllowed: Record<UserRole, boolean>;
}

const INITIAL_PERMISSIONS: FeaturePermission[] = [
  {
    id: 'e_rx_prescriptions',
    nameAr: 'إصدار وتوقيع الوصفات الطبية النفسية (E-Rx)',
    category: 'الطب النفسي والدوائي',
    description: 'صلاحية اختيار الأدوية، تحديد الجرعات والمدة وتوليد الروشتة المعتمدة.',
    rolesAllowed: {
      psychiatrist: true,
      psychologist: false,
      nutritionist: false,
      social_worker: false,
      admin: true,
      reception: false,
      support: false,
      supervisor: true
    }
  },
  {
    id: 'clinical_scales_runner',
    nameAr: 'تطبيق وتصحيح المقاييس النفسية الرقمية',
    category: 'التقييم والتشخيص',
    description: 'تشغيل مقاييس PHQ-9, GAD-7, DASS-21 وحفظ النتائج في سجل المريض.',
    rolesAllowed: {
      psychiatrist: true,
      psychologist: true,
      nutritionist: false,
      social_worker: false,
      admin: true,
      reception: false,
      support: false,
      supervisor: true
    }
  },
  {
    id: 'clinical_forms_soap',
    nameAr: 'تدوين واعتماد ملاحظات الجلسات (SOAP Notes & MSE)',
    category: 'التوثيق السريري',
    description: 'فحص الحالة العقلية، تقييم خطورة الانتحار وتوثيق مجريات الجلسة.',
    rolesAllowed: {
      psychiatrist: true,
      psychologist: true,
      nutritionist: false,
      social_worker: false,
      admin: true,
      reception: false,
      support: false,
      supervisor: true
    }
  },
  {
    id: 'nutrition_social_plans',
    nameAr: 'إعداد وتوثيق الخطط الغذائية والاجتماعية',
    category: 'الرعاية التكاملية',
    description: 'حساب الاحتياجات، رصد المتلازمة الأيضية، ودراسة الحالة الاجتماعية.',
    rolesAllowed: {
      psychiatrist: true,
      psychologist: false,
      nutritionist: true,
      social_worker: true,
      admin: true,
      reception: false,
      support: false,
      supervisor: true
    }
  },
  {
    id: 'financials_view',
    nameAr: 'الاطلاع على الحسابات والمستحقات المالية',
    category: 'المالية',
    description: 'رؤية كشف الدخل ونسب المشاركة (75%) وطلب الصرف.',
    rolesAllowed: {
      psychiatrist: true,
      psychologist: true,
      nutritionist: true,
      social_worker: true,
      admin: true,
      reception: false,
      support: false,
      supervisor: true
    }
  },
  {
    id: 'peer_consultations',
    nameAr: 'المشاركة في استشارات الزملاء والإحالات',
    category: 'التعاون المهني',
    description: 'طرح استشارات بهوية مجهولة وطلب رأي ثانٍ من الأطباء والاستشاريين.',
    rolesAllowed: {
      psychiatrist: true,
      psychologist: true,
      nutritionist: true,
      social_worker: true,
      admin: true,
      reception: false,
      support: false,
      supervisor: true
    }
  }
];

export const AdminRBACControlTab: React.FC<Props> = ({ onLogAudit, onPreviewRole }) => {
  const [permissions, setPermissions] = useState<FeaturePermission[]>(INITIAL_PERMISSIONS);
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [targetBroadcastRole, setTargetBroadcastRole] = useState<string>('all');
  const [showBroadcastSuccess, setShowBroadcastSuccess] = useState<boolean>(false);

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
    setPermissions(prev => prev.map(p => {
      if (p.id !== featId) return p;
      const currentVal = p.rolesAllowed[role];
      return {
        ...p,
        rolesAllowed: {
          ...p.rolesAllowed,
          [role]: !currentVal
        }
      };
    }));

    if (onLogAudit) {
      onLogAudit(`تعديل مصفوفة الصلاحيات للميزة: ${featId}`, `الدور: ${role}`);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
              <KeyRound className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              التحكم بواجهات العاملين ومصفوفة الصلاحيات (RBAC Customization Matrix)
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            مطلب الإدارة (8): تخصيص ميزات كل تخصص على حدة، إرسال تعاميم موجهة، ومعاينة المنظومة كدور.
          </p>
        </div>
      </div>

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
            placeholder="اكتب التوجيه أو الإعلان الداخلي هنا (مثال: نرجو من جميع المعالجين تحديث أوقات التواجد للأسبوع القادم)..."
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
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-sm"
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
              انقر على أي علامة لتفعيل أو حجب الميزة فوراً عن ذلك التخصص.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5 min-w-[200px]">الميزة الإكلينيكية / الإدارية</th>
                {rolesList.map(r => (
                  <th key={r.id} className="p-3 text-center min-w-[100px]">
                    <div className="font-bold text-[11px]">{r.label.split(' ')[0]}</div>
                    <div className="text-[9px] text-slate-400">{r.label.split(' ')[1] || ''}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {permissions.map(feat => (
                <tr key={feat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">
                      {feat.nameAr}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {feat.description}
                    </span>
                  </td>

                  {rolesList.map(r => {
                    const isAllowed = feat.rolesAllowed[r.id];
                    return (
                      <td key={r.id} className="p-3 text-center">
                        <button
                          onClick={() => handleTogglePermission(feat.id, r.id)}
                          className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center mx-auto transition-all ${
                            isAllowed
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                          }`}
                          title={isAllowed ? 'مفعل (انقر للتعطيل)' : 'معطل (انقر للتفعيل)'}
                        >
                          {isAllowed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
