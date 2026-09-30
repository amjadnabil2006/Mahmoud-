import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Check, 
  ShieldAlert, 
  Save, 
  Printer, 
  ClipboardCheck,
  Stethoscope
} from 'lucide-react';
import { Patient, ClinicalFormTemplate } from '../types';
import { CLINICAL_FORMS_TEMPLATES } from '../data/clinicalForms';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activePatient: Patient;
  formType: 'mse' | 'suicide_risk' | 'soap_note';
}

export const ClinicalFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activePatient,
  formType
}) => {
  const currentTemplate: ClinicalFormTemplate = 
    CLINICAL_FORMS_TEMPLATES.find(f => f.id === formType) || CLINICAL_FORMS_TEMPLATES[0];

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-right my-8 max-h-[90vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-teal-300 font-semibold">{currentTemplate.code}</span>
                <span className="text-xs text-slate-400">· المريض: <strong>{activePatient.name}</strong> ({activePatient.fileNumber})</span>
              </div>
              <h2 className="text-lg font-bold">{currentTemplate.titleAr}</h2>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Description */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
          <p>{currentTemplate.descriptionAr}</p>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right text-slate-900 dark:text-slate-100">
          
          {currentTemplate.sections.map((section, sIdx) => (
            <div key={sIdx} className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-700 pb-2">
                {section.title}
              </h3>

              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {field.label}
                    </label>

                    {field.type === 'select' && (
                      <select
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="">-- اختر التقييم السريري --</option>
                        {field.options?.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {field.type === 'text' && (
                      <input
                        type="text"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    )}

                    {field.type === 'textarea' && (
                      <textarea
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white leading-relaxed"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            يتم تشفير وتوثيق هذا النموذج رسمياً في السجل الطبي الإلكتروني للمريض
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              إلغاء
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم التوثيق والاعتماد!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>اعتماد وحفظ النموذج</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
