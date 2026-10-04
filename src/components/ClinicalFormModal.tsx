import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Check, 
  ShieldAlert, 
  Save, 
  Printer, 
  ClipboardCheck,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Sparkles,
  PhoneCall,
  Apple,
  Users
} from 'lucide-react';
import { Patient, ClinicalFormTemplate, SavedClinicalRecord, StaffUser } from '../types';
import { CLINICAL_FORMS_TEMPLATES } from '../data/clinicalForms';
import { clinicalStorage } from '../services/clinicalRecords';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activePatient: Patient;
  formType: string;
  currentStaff: StaffUser | null;
  onRecordSaved?: (record: SavedClinicalRecord) => void;
}

export const ClinicalFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activePatient,
  formType,
  currentStaff,
  onRecordSaved
}) => {
  const currentTemplate: ClinicalFormTemplate = 
    CLINICAL_FORMS_TEMPLATES.find(f => f.id === formType) || CLINICAL_FORMS_TEMPLATES[0];

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [emergencyEscalated, setEmergencyEscalated] = useState<boolean>(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxToggle = (fieldId: string, option: string) => {
    const currentList: string[] = Array.isArray(formData[fieldId]) ? formData[fieldId] : [];
    if (currentList.includes(option)) {
      setFormData(prev => ({ ...prev, [fieldId]: currentList.filter(item => item !== option) }));
    } else {
      setFormData(prev => ({ ...prev, [fieldId]: [...currentList, option] }));
    }
  };

  const handleSave = () => {
    const recordNumber = `EHR-${currentTemplate.code}-${Date.now().toString().slice(-6)}`;
    
    // Summary text builder
    let summaryText = `${currentTemplate.titleAr} مكتمل ومعتمد في ملف المريض.`;
    if (formType === 'suicide_risk') {
      summaryText = emergencyEscalated 
        ? 'تم تصعيد بروتوكول الطوارئ وتفعيل خطة الأمان الفورية.' 
        : 'تقييم خطورة مكتمل، خطة الأمان مفعلة.';
    } else if (formType === 'soap_note') {
      summaryText = `جلسة متابعة علاجية (SOAP) - تم توثيق الملاحظات والواجبات السلوكية.`;
    } else if (formType === 'social_intake' || formType === 'family_dynamics') {
      summaryText = `دراسة وتقييم اجتماعي وأسري شامل للحالة.`;
    } else if (formType === 'nutr_gut_brain' || formType === 'nutr_metabolic_monitoring') {
      summaryText = `تقييم تغذوي لمحور الأمعاء-الدماغ وضبط الخطة الأيضية.`;
    }

    const newRecord: SavedClinicalRecord = {
      id: 'rec-' + Date.now(),
      recordNumber,
      patientId: activePatient.id,
      patientName: activePatient.name,
      patientFileNumber: activePatient.fileNumber,
      doctorId: currentStaff?.doctorId || 'doc-hakim',
      doctorName: currentStaff?.name || 'د. طارق الحكيم',
      doctorLicenseNumber: currentStaff?.licenseNumber || 'MD-PSY-98442',
      formType: formType as any,
      titleAr: currentTemplate.titleAr,
      date: new Date().toISOString().split('T')[0],
      status: 'معتمد وموقع سريرياً',
      formData: formData,
      summaryText,
      emergencyEscalated,
      signatureText: `${currentStaff?.name || 'د. طارق الحكيم'} (${currentStaff?.licenseNumber || 'MD-PSY-98442'})`,
      verifiedStamp: true
    };

    clinicalStorage.saveRecord(newRecord);
    if (onRecordSaved) onRecordSaved(newRecord);

    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 text-right bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-mono text-[10px] font-bold border border-teal-200 dark:border-teal-800">
                  {currentTemplate.code}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  {currentTemplate.category}
                </span>
              </div>
              <h2 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                {currentTemplate.titleAr}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {formType === 'suicide_risk' && (
              <button
                type="button"
                onClick={() => setShowEmergencyConfirm(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  emergencyEscalated 
                    ? 'bg-rose-600 text-white shadow-xs' 
                    : 'bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{emergencyEscalated ? 'تم تصعيد حالة طوارئ ✓' : 'تصعيد حالة طوارئ (Escalate)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Emergency Confirm Modal */}
        {showEmergencyConfirm && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border-b border-rose-200 dark:border-rose-900 text-right space-y-2">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>تأكيد تصعيد بروتوكول الطوارئ السريري</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">
              سيتم تسجيل إنذار خطورة فوري للمريض <strong>{activePatient.name}</strong> وتوثيق التدخل في سجل التدقيق وإرسال تنبيه لفريق الأزمات 24/7.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setEmergencyEscalated(true);
                  setShowEmergencyConfirm(false);
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
              >
                تأكيد التصعيد وتوثيق الخطر
              </button>
              <button
                type="button"
                onClick={() => setShowEmergencyConfirm(false)}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right text-slate-900 dark:text-slate-100">
          
          {/* Active Patient & Doctor Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
            <div>
              المريض: <strong className="text-slate-900 dark:text-white">{activePatient.name}</strong> ({activePatient.fileNumber})
            </div>
            <div>
              المختص الموثق: <strong className="text-teal-700 dark:text-teal-400">{currentStaff?.name || 'د. طارق الحكيم'}</strong>
            </div>
          </div>

          {currentTemplate.sections.map((section, sIdx) => (
            <div key={sIdx} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-teal-800 dark:text-teal-400 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  {section.title}
                </h3>
                {section.description && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {section.description}
                  </p>
                )}
              </div>
              
              <div className="space-y-4">
                {section.fields.map(field => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {field.label}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder || 'اكتب الملاحظات والتقييم بالتفصيل...'}
                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden leading-relaxed resize-y"
                      ></textarea>
                    ) : field.type === 'select' ? (
                      <select
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                      >
                        <option value="">-- اختر التقييم السريري --</option>
                        {field.options?.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'checkbox_group' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {field.options?.map((opt, oIdx) => {
                          const isChecked = Array.isArray(formData[field.id]) && formData[field.id].includes(opt);
                          return (
                            <label
                              key={oIdx}
                              onClick={() => handleCheckboxToggle(field.id, opt)}
                              className={`flex items-center gap-2 p-2.5 border rounded-xl text-xs cursor-pointer transition ${
                                isChecked
                                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-400 text-teal-900 dark:text-teal-200 font-bold'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="rounded text-teal-600 focus:ring-teal-500"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : field.type === 'radio' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {field.options?.map((opt, oIdx) => (
                          <label key={oIdx} className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs cursor-pointer hover:border-teal-400">
                            <input
                              type="radio"
                              name={field.id}
                              value={opt}
                              checked={formData[field.id] === opt}
                              onChange={() => handleFieldChange(field.id, opt)}
                              className="text-teal-600 focus:ring-teal-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder || ''}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Electronic Stamp Preview */}
          <div className="p-4 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                ختم
              </div>
              <div className="text-xs">
                <div className="font-bold text-teal-950 dark:text-teal-200">اعتماد التوثيق السريري الرسمي الموحد</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">منصة كول مايند للاستشارات النفسية والتغذية والخدمة الاجتماعية</div>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
              EHR CERTIFIED
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة النموذج الرسمي</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم الاعتماد والحفظ في الملف ✓</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>اعتماد وحفظ السجل السريري</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
