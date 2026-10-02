import React, { useState } from 'react';
import { 
  Activity, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Clock, 
  FileText 
} from 'lucide-react';
import { TherapyExercise } from '../../types';

interface Props {
  exercises: TherapyExercise[];
  onAddExercise: (ex: Omit<TherapyExercise, 'id'>) => Promise<void>;
  onUpdateExercise: (id: string, updated: Partial<TherapyExercise>) => Promise<void>;
  onDeleteExercise: (id: string) => Promise<void>;
}

export const AdminExercisesTab: React.FC<Props> = ({
  exercises,
  onAddExercise,
  onUpdateExercise,
  onDeleteExercise
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [titleAr, setTitleAr] = useState<string>('');
  const [category, setCategory] = useState<TherapyExercise['category']>('تنفس واسترخاء');
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [instructions, setInstructions] = useState<string>('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim()) return;

    await onAddExercise({
      titleAr: titleAr.trim(),
      category,
      durationMinutes: Number(durationMinutes) || 10,
      isCompletedToday: false,
      instructions: instructions.trim() || 'اتبع تعليمات وتوجيهات أخصائي العلاج النفسي بدقة.'
    });

    setTitleAr('');
    setInstructions('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>إدارة التمارين والواجبات السلوكية المنزلية</span>
          </h2>
          <p className="text-xs text-slate-400">إضافة وتعديل التمارين السلوكية وجلسات الاسترخاء المتاحة للمرضى</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تمرين جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {exercises.map(ex => (
          <div
            key={ex.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 flex flex-col justify-between space-y-2 text-xs shadow-2xs"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{ex.titleAr}</span>
                <span className="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-200 dark:border-teal-800">
                  {ex.category}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{ex.instructions}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{ex.durationMinutes} دقيقة</span>
                </span>
                <span className="text-slate-400 font-mono">ID: {ex.id}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                ex.isCompletedToday
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {ex.isCompletedToday ? 'منجز اليوم' : 'غير منجز'}
              </span>

              <button
                onClick={() => onDeleteExercise(ex.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                title="حذف هذا التمرين"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 space-y-4 border border-slate-200 dark:border-slate-800 text-right shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">إضافة تمرين أو مهمة علاجية جديدة</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">عنوان التمرين:</label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مثال: تمرين التنفس الصندوقي (Box Breathing 4-4-4-4)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الفئة العلاجية:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="تنفس واسترخاء">تنفس واسترخاء</option>
                  <option value="سجل أفكار معرفي (CBT)">سجل أفكار معرفي (CBT)</option>
                  <option value="يقظة ذهنية (Mindfulness)">يقظة ذهنية (Mindfulness)</option>
                  <option value="تفريغ وتدوين مشاعر">تفريغ وتدوين مشاعر</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">المدة المقدرة (بالدقائق):</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value) || 10)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">خطوات وإرشادات التطبيق:</label>
                <textarea
                  rows={3}
                  required
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="اكتب تعليمات التمرين بالتفصيل للمريض..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 text-white rounded-xl font-bold cursor-pointer hover:bg-teal-800"
                >
                  إضافة التمرين
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
