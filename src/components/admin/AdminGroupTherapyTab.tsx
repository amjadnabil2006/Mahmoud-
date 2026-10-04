import React, { useState } from 'react';
import { 
  Users2, 
  Plus, 
  Calendar, 
  Clock, 
  DollarSign, 
  Check, 
  X, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  FileText, 
  Link as LinkIcon, 
  Video, 
  Sparkles,
  AlertCircle,
  Eye,
  UserCheck
} from 'lucide-react';
import { GroupTherapyProgram, GroupTherapyParticipant, Doctor } from '../../types';
import { INITIAL_GROUP_PROGRAMS } from '../../data/groupTherapyData';

interface Props {
  doctors: Doctor[];
  onLogAudit?: (action: string, target: string) => void;
}

export const AdminGroupTherapyTab: React.FC<Props> = ({ doctors, onLogAudit }) => {
  const [programs, setPrograms] = useState<GroupTherapyProgram[]>(INITIAL_GROUP_PROGRAMS);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedProgram, setSelectedProgram] = useState<GroupTherapyProgram | null>(null);

  // New program state
  const [newTitleAr, setNewTitleAr] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('قلق وتوتر');
  const [newLeadDoctorId, setNewLeadDoctorId] = useState<string>(doctors[0]?.id || 'doc-moayad');
  const [newSupervisor, setNewSupervisor] = useState<string>('بروفيسور سيف الدين الميري');
  const [newMaxCapacity, setNewMaxCapacity] = useState<number>(10);
  const [newSessionsCount, setNewSessionsCount] = useState<number>(8);
  const [newScheduleText, setNewScheduleText] = useState<string>('كل أربعاء 07:00 م - 08:30 م (عن بعد)');
  const [newPriceUSD, setNewPriceUSD] = useState<number>(120);
  const [newStartDate, setNewStartDate] = useState<string>('2026-11-01');
  const [newDescAr, setNewDescAr] = useState<string>('');
  const [newPrerequisites, setNewPrerequisites] = useState<string>('جلسة تقييم وفرز أولية مع المعالج.');

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleAr.trim()) return;

    const leadDoc = doctors.find(d => d.id === newLeadDoctorId) || doctors[0];
    const newProg: GroupTherapyProgram = {
      id: 'grp-' + Date.now().toString(36),
      titleAr: newTitleAr,
      titleEn: 'Group Therapy Program',
      category: newCategory,
      descriptionAr: newDescAr || 'برنامج علاجي جماعي متخصص في بيئة آمنة وسرية.',
      leadDoctorId: leadDoc.id,
      leadDoctorName: leadDoc.name,
      supervisorName: newSupervisor,
      maxCapacity: newMaxCapacity,
      enrolledCount: 0,
      sessionsCount: newSessionsCount,
      scheduleText: newScheduleText,
      priceUSD: newPriceUSD,
      priceYER: newPriceUSD * 300,
      priceSAR: Math.round(newPriceUSD * 3.75),
      status: 'متاح للتسجيل',
      startDate: newStartDate,
      meetUrl: `https://meet.google.com/cm-grp-${Date.now().toString(36).slice(-4)}`,
      prerequisites: newPrerequisites,
      rulesAgreementAr: 'الالتزام التام بالسرية المطلقة وعدم إفشاء أي معلومات عن المشاركين أو تسجيل الصوت/الفيديو، واستخدام الاسم المستعار فقط داخل الجلسات.',
      participants: []
    };

    setPrograms([newProg, ...programs]);
    setShowCreateModal(false);

    if (onLogAudit) {
      onLogAudit(`إنشاء برنامج علاج جماعي جديد: ${newTitleAr}`, `بإشراف المعالج: ${leadDoc.name}`);
    }

    // Reset
    setNewTitleAr('');
    setNewDescAr('');
  };

  const handleToggleStatus = (progId: string) => {
    setPrograms(prev => prev.map(p => {
      if (p.id !== progId) return p;
      const nextStatus = p.status === 'متاح للتسجيل' ? 'قيد الانعقاد' : p.status === 'قيد الانعقاد' ? 'مكتمل' : 'متاح للتسجيل';
      return { ...p, status: nextStatus };
    }));
  };

  const handleDeleteProgram = (progId: string, title: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في أرشفة وحذف مجموعة "${title}"؟`)) return;
    setPrograms(prev => prev.filter(p => p.id !== progId));
    if (selectedProgram?.id === progId) setSelectedProgram(null);
    if (onLogAudit) {
      onLogAudit(`أرشفة مجموعة علاج جماعي: ${title}`, `معرف البرنامج: ${progId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
              <Users2 className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              إدارة مجموعات العلاج الجماعي (Group Therapy Management)
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            إنشاء وإدارة برامج العلاج الجماعي، متابعة سعة المقاعد، المشاركين بالأسماء المستعارة، وضوابط السرية المطلقة.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          إنشاء مجموعة علاجية جديدة
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي المجموعات</span>
          <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{programs.length}</span>
          <span className="text-xs text-purple-600 block mt-1">تغطي القلق، الاكتئاب، والدعم الأسري</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">المشاركون النشطون (بأسماء مستعارة)</span>
          <span className="text-3xl font-black text-emerald-600">
            {programs.reduce((acc, p) => acc + (p.participants?.length || 0), 0)}
          </span>
          <span className="text-xs text-emerald-500 block mt-1">✓ وقعوا ميثاق السرية الرقمي</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي عائدات العلاج الجماعي</span>
          <span className="text-3xl font-black text-teal-600">
            {programs.reduce((acc, p) => acc + ((p.participants?.length || 0) * p.priceSAR), 0).toLocaleString()} ر.س
          </span>
          <span className="text-xs text-slate-400 block mt-1">75% للمعالج المشرف / 25% للمنصة</span>
        </div>
      </div>

      {/* Programs List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {programs.map(prog => (
          <div
            key={prog.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4 hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    {prog.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    prog.status === 'متاح للتسجيل' ? 'bg-emerald-100 text-emerald-700' :
                    prog.status === 'قيد الانعقاد' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {prog.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {prog.titleAr}
                </h3>
              </div>

              <div className="text-left flex-shrink-0">
                <span className="text-lg font-black text-slate-900 dark:text-slate-100 block">
                  ${prog.priceUSD}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  ({prog.priceSAR} ر.س / {prog.priceYER.toLocaleString()} ر.ي)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {prog.descriptionAr}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
              <div>
                <span className="text-slate-400 text-[11px] block">المعالج الميسر:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{prog.leadDoctorName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">المشرف الإكلينيكي:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{prog.supervisorName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">السعة والتسجيل:</span>
                <span className="font-bold text-emerald-600">{prog.participants.length} من {prog.maxCapacity} مقاعد</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">عدد الجلسات:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{prog.sessionsCount} جلسات أسبوعية</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedProgram(prog)}
                className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                <Eye className="w-3.5 h-3.5" />
                عرض قائمة المشاركين والملاحظات
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(prog.id)}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
                >
                  تغيير الحالة
                </button>
                <button
                  onClick={() => handleDeleteProgram(prog.id, prog.titleAr)}
                  className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  title="حذف المجموعة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mb-1 inline-block">
                  {selectedProgram.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedProgram.titleAr}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                المشاركون المسجلون بالأسماء المستعارة ({selectedProgram.participants.length} مشارك)
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedProgram.participants.map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-[11px]">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{p.aliasName}</span>
                        <span className="text-[11px] text-slate-400 block">تاريخ الانضمام: {p.joinedDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-600 font-bold">✓ ميثاق السرية موقع</span>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {p.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                إنشاء برنامج علاج جماعي جديد (New Group Program)
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">عنوان البرنامج العلاجي</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مجموعة التعايش مع الوسواس القهري وتقنيات ERP..."
                  value={newTitleAr}
                  onChange={e => setNewTitleAr(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">المعالج الميسر</label>
                  <select
                    value={newLeadDoctorId}
                    onChange={e => setNewLeadDoctorId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">تصنيف المجموعة</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  >
                    <option value="قلق وتوتر">قلق وتوتر وهلع</option>
                    <option value="اكتئاب وخسارة">اكتئاب وتفعيل سلوكي</option>
                    <option value="دعم أسري">دعم وإرشاد أسري</option>
                    <option value="إدمان وسلوكيات">إدمان وسلوكيات قهرية</option>
                    <option value="مهارات CBT">مهارات CBT وتنظيم المشاعر</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">السعة القصوى</label>
                  <input
                    type="number"
                    min={4}
                    max={15}
                    value={newMaxCapacity}
                    onChange={e => setNewMaxCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">عدد الجلسات</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={newSessionsCount}
                    onChange={e => setNewSessionsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">سعر البرنامج ($)</label>
                  <input
                    type="number"
                    min={20}
                    value={newPriceUSD}
                    onChange={e => setNewPriceUSD(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">وصف وأهداف البرنامج</label>
                <textarea
                  rows={2}
                  placeholder="وصف مختصر لموضوع الجلسات ومخرجات التعافي المتوقعة..."
                  value={newDescAr}
                  onChange={e => setNewDescAr(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-sm"
                >
                  حفظ ونشر المجموعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
