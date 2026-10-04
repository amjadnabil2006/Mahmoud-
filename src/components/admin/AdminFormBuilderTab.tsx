import React, { useState } from 'react';
import { 
  FileCode, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Eye, 
  Layers, 
  Sparkles,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { CustomFormField } from '../../types';
import { INITIAL_CUSTOM_FORM_FIELDS } from '../../data/groupTherapyData';

interface Props {
  onLogAudit?: (action: string, target: string) => void;
}

export const AdminFormBuilderTab: React.FC<Props> = ({ onLogAudit }) => {
  const [fields, setFields] = useState<CustomFormField[]>(INITIAL_CUSTOM_FORM_FIELDS);
  const [selectedTargetForm, setSelectedTargetForm] = useState<CustomFormField['targetForm']>('client_intake');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form input states
  const [newLabel, setNewLabel] = useState<string>('');
  const [newType, setNewType] = useState<CustomFormField['type']>('text');
  const [newIsRequired, setNewIsRequired] = useState<boolean>(true);
  const [newPlaceholder, setNewPlaceholder] = useState<string>('');
  const [newOptionsText, setNewOptionsText] = useState<string>('خيار 1, خيار 2, خيار 3');

  const filteredFields = fields.filter(f => f.targetForm === selectedTargetForm);

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const options = (newType === 'select' || newType === 'radio') 
      ? newOptionsText.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const newField: CustomFormField = {
      id: 'fld-' + Date.now().toString(36),
      label: newLabel,
      type: newType,
      targetForm: selectedTargetForm,
      options,
      isRequired: newIsRequired,
      placeholder: newPlaceholder
    };

    setFields([...fields, newField]);
    setShowAddModal(false);

    if (onLogAudit) {
      onLogAudit(`إضافة حقل مخصص جديد: ${newLabel}`, `النموذج المستهدف: ${selectedTargetForm}`);
    }

    setNewLabel('');
    setNewPlaceholder('');
  };

  const handleDeleteField = (id: string, label: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    if (onLogAudit) {
      onLogAudit(`حذف حقل مخصص: ${label}`, `النموذج: ${selectedTargetForm}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <FileCode className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              منشئ النماذج والاستبيانات الإكلينيكية (Visual Form Builder)
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            إضافة وتعديل بنود استبيان تسجيل العميل، نماذج الجلسة الأولى والمتابعة الدورية دون تعديل الأكواد البرمجية.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          إضافة بند / سؤال جديد
        </button>
      </div>

      {/* Target Form Tabs */}
      <div className="flex items-center gap-2 flex-wrap bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        {[
          { id: 'client_intake', label: '1. استبيان فرز وتسجيل العميل (Client Intake)' },
          { id: 'first_session', label: '2. نموذج تقييم الجلسة الأولى (Initial Assessment)' },
          { id: 'followup_session', label: '3. نموذج جلسات المتابعة (Follow-up Notes)' },
          { id: 'group_intake', label: '4. استبيان قبول العلاج الجماعي (Group Triage)' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTargetForm(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedTargetForm === t.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Fields List & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fields List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              الحقول والبنود المعتمدة ({filteredFields.length} بند)
            </h3>
            <span className="text-[11px] text-slate-400">تظهر تلقائياً في واجهات التعبئة</span>
          </div>

          {filteredFields.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">لا توجد حقول إضافية في هذا النموذج حالياً.</p>
          ) : (
            <div className="space-y-3">
              {filteredFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{field.label}</span>
                      {field.isRequired && (
                        <span className="text-rose-500 font-bold text-[11px]">* إلزامي</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 pr-7">
                      النوع: <span className="font-mono text-indigo-600">{field.type}</span>
                      {field.options && ` | الخيارات: ${field.options.join(', ')}`}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteField(field.id, field.label)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                    title="حذف الحقل"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              معاينة النموذج التفاعلي كما يراه المستخدم (Live Preview)
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
              معاينة حية
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            {filteredFields.map(field => (
              <div key={field.id} className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  {field.label}
                  {field.isRequired && <span className="text-rose-500">*</span>}
                </label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    placeholder={field.placeholder || 'اكتب الإجابة هنا...'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    disabled
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    rows={2}
                    placeholder={field.placeholder || 'اكتب التفاصيل هنا...'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    disabled
                  />
                )}

                {field.type === 'select' && (
                  <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs" disabled>
                    {field.options?.map((opt, i) => (
                      <option key={i}>{opt}</option>
                    ))}
                  </select>
                )}

                {field.type === 'scale_1_10' && (
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <button
                        key={n}
                        type="button"
                        className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-indigo-50"
                        disabled
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Field Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              إضافة بند استبيان جديد (Add Form Field)
            </h3>

            <form onSubmit={handleAddField} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">نص السؤال / البند</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: هل تعاني من أي صعوبات في النوم مؤخراً؟"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">نوع الإدخال</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="text">نص قصير (Text)</option>
                    <option value="textarea">نص طويل (Textarea)</option>
                    <option value="select">قائمة منسدلة (Select)</option>
                    <option value="radio">اختيار وحيد (Radio)</option>
                    <option value="scale_1_10">مقياس تقييمي (1 - 10)</option>
                    <option value="date">تاريخ (Date)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">إلزامية الحقل</label>
                  <select
                    value={newIsRequired ? 'true' : 'false'}
                    onChange={e => setNewIsRequired(e.target.value === 'true')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="true">إلزامي *</option>
                    <option value="false">اختياري</option>
                  </select>
                </div>
              </div>

              {(newType === 'select' || newType === 'radio') && (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">الخيارات (مفصولة بفواصل)</label>
                  <input
                    type="text"
                    value={newOptionsText}
                    onChange={e => setNewOptionsText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
                >
                  حفظ الحقل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
