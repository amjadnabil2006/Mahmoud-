import React, { useState } from 'react';
import { 
  FileText, 
  ShieldAlert, 
  ClipboardCheck, 
  Play, 
  CheckCircle2, 
  User, 
  AlertTriangle,
  Stethoscope,
  Printer,
  Eye,
  Lock,
  Calendar,
  Sparkles,
  Plus
} from 'lucide-react';
import { Patient, SavedClinicalRecord, StaffUser } from '../types';
import { CLINICAL_FORMS_TEMPLATES } from '../data/clinicalForms';
import { clinicalStorage } from '../services/clinicalRecords';

interface Props {
  activePatient: Patient;
  onOpenClinicalForm: (formType: 'mse' | 'suicide_risk' | 'soap_note') => void;
  currentStaff?: StaffUser | null;
}

export const ClinicalFormsView: React.FC<Props> = ({
  activePatient,
  onOpenClinicalForm,
  currentStaff
}) => {
  const [selectedRecordForView, setSelectedRecordForView] = useState<SavedClinicalRecord | null>(null);

  const patientRecords = clinicalStorage.getPatientRecords(activePatient.id);

  const handlePrintRecord = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                السجلات والبروتوكولات الإكلينيكية
              </span>
              <span className="text-xs text-slate-400">Clinical EHR & Mental Status</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              النماذج الإكلينيكية وفحص الحالة العقلية
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              نماذج المقابلة التشخيصية، تقييم خطورة الانتحار وإيذاء النفس، وملاحظات تقدم الجلسات العلاجية مع الحفظ الفوري في السجل
            </p>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl">
            المريض المحدد: <strong className="text-slate-900 dark:text-white">{activePatient.name}</strong> ({activePatient.fileNumber})
          </div>
        </div>
      </div>

      {/* Main Forms Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MSE Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 rounded-2xl p-6 shadow-2xs flex flex-col justify-between transition-all group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ClipboardCheck className="w-6 h-6" />
            </div>

            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 block mb-1">MSE-STD</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              فحص الحالة العقلية الشامل (MSE)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              التقييم السريري الراهن للمظهر العام، السلوك الحركي، المزاج، الوجدان، مجرى ومحتوى التفكير، الإدراك الحسي، والبصيرة والحكم.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-4">
              <div>✓ 6 أبعاد سريرية معتمدة</div>
              <div>✓ توثيق الضلالات والهلاوس والبصيرة</div>
              <div>✓ تصدير وحفظ فوري في ملف المريض</div>
            </div>
          </div>

          <button
            onClick={() => onOpenClinicalForm('mse')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>تعبئة فحص الحالة العقلية الآن</span>
          </button>
        </div>

        {/* Suicide Risk Protocol Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 rounded-2xl p-6 shadow-2xs flex flex-col justify-between transition-all group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 block mb-1">C-SSRS PROTOCOL</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              بروتوكول تقييم خطورة الانتحار وإيذاء النفس
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              تقييم الأفكار والنوايا والخطط الانتحارية، استكشاف الروادع وعوامل الحماية، وصياغة خطة الأمان الإلزامية (Safety Plan).
            </p>

            <div className="bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 rounded-xl p-3 text-xs text-rose-900 dark:text-rose-300 space-y-1 mb-4">
              <div>⚠️ معتمد لبروتوكول كولومبيا (C-SSRS)</div>
              <div>✓ خطة أمان مكتوبة وروادع أسرية</div>
              <div>✓ توثيق كسر السرية والتدخل الطارئ</div>
            </div>
          </div>

          <button
            onClick={() => onOpenClinicalForm('suicide_risk')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>تشغيل بروتوكول تقييم الخطورة</span>
          </button>
        </div>

        {/* SOAP Note Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 rounded-2xl p-6 shadow-2xs flex flex-col justify-between transition-all group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>

            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 block mb-1">SOAP-NOTE</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              تقرير تقدم الجلسة العلاجية (SOAP)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              توثيق منظم لمعطيات المريض الذاتية (S)، الملاحظات الموضوعية (O)، التقييم الإكلينيكي للتقدم (A)، وخطة التدخل والواجبات (P).
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-4">
              <div>✓ النموذج القياسي للتوثيق الطبي</div>
              <div>✓ ربط بالأهداف العلاجية والواجبات</div>
              <div>✓ حفظ وتوقيع إلكتروني للمختص</div>
            </div>
          </div>

          <button
            onClick={() => onOpenClinicalForm('soap_note')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>توثيق جلسة علاجية (SOAP)</span>
          </button>
        </div>

      </div>

      {/* Saved Records History for Active Patient */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              سجل النماذج المعتمدة للمريض {activePatient.name}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              جميع النماذج محفوظة ومشفرة ومرتبطة بملف المريض برقم تسلسلي معتمد
            </p>
          </div>
          <span className="text-xs text-teal-700 dark:text-teal-400 font-bold">
            {patientRecords.length} سجلات موثقة
          </span>
        </div>

        {patientRecords.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            لا توجد نماذج سابقة محفوظة لهذا المريض. استخدم الأزرار أعلاه لتعبئة أول نموذج.
          </p>
        ) : (
          <div className="space-y-3">
            {patientRecords.map(rec => (
              <div
                key={rec.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">{rec.recordNumber}</span>
                    <strong className="text-slate-900 dark:text-white">{rec.titleAr}</strong>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">{rec.summaryText}</p>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>التاريخ: {rec.date}</span>
                    <span>·</span>
                    <span>المختص: {rec.doctorName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedRecordForView(rec)}
                    className="px-3 py-1.5 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>عرض وطباعة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record View Modal */}
      {selectedRecordForView && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-right space-y-6 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b-2 border-teal-700 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">منصة CoolMind للاستشارات النفسية</h2>
                <p className="text-xs text-slate-500">توثيق إكلينيكي رسمي وفحص الحالة العقلية</p>
              </div>
              <div className="text-left text-xs">
                <div className="font-mono font-bold text-teal-700">{selectedRecordForView.recordNumber}</div>
                <div className="text-slate-500">{selectedRecordForView.date}</div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-base font-black underline text-teal-950">{selectedRecordForView.titleAr}</h3>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div>المريض: <strong>{selectedRecordForView.patientName}</strong></div>
              <div>رقم الملف: <strong className="font-mono">{selectedRecordForView.patientFileNumber}</strong></div>
              <div>المختص: <strong>{selectedRecordForView.doctorName}</strong></div>
              <div>الترخيص: <strong className="font-mono">{selectedRecordForView.doctorLicenseNumber}</strong></div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="font-bold text-slate-800">بيانات التقييم السريري:</div>
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {Object.entries(selectedRecordForView.formData || {}).map(([key, val]) => (
                  <div key={key} className="border-b border-slate-200 pb-1.5 last:border-none">
                    <span className="font-bold text-teal-900 block">{key}:</span>
                    <span className="text-slate-700">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">التوقيع الإلكتروني:</div>
                <div className="text-xs text-teal-800 mt-1 font-bold">{selectedRecordForView.signatureText}</div>
              </div>

              <div className="border border-teal-600 rounded-lg p-2 text-center text-teal-800 text-[10px] font-bold">
                ✓ موثق ومعتمد رسمياً
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRecordForView(null)}
                className="px-4 py-2 text-xs text-slate-600 font-bold cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={handlePrintRecord}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
