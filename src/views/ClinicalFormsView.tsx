import React from 'react';
import { 
  FileText, 
  ShieldAlert, 
  ClipboardCheck, 
  Play, 
  CheckCircle2, 
  User, 
  AlertTriangle,
  Stethoscope
} from 'lucide-react';
import { Patient } from '../types';
import { CLINICAL_FORMS_TEMPLATES } from '../data/clinicalForms';

interface Props {
  activePatient: Patient;
  onOpenClinicalForm: (formType: 'mse' | 'suicide_risk' | 'soap_note') => void;
}

export const ClinicalFormsView: React.FC<Props> = ({
  activePatient,
  onOpenClinicalForm
}) => {
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
              <span className="text-xs text-slate-400 dark:text-slate-500">Clinical EHR & Mental Status</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              النماذج الإكلينيكية وفحص الحالة العقلية
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              نماذج المقابلة التشخيصية، تقييم خطورة الانتحار وإيذاء النفس، وملاحظات تقدم الجلسات العلاجية.
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
              <div>⚠️ تقييم النية والخطة والوسيلة المتاحة</div>
              <div>⚠️ فحص المحاولات السابقة والروادع</div>
              <div>⚠️ صياغة خطة الطوارئ والاتصال الأسري</div>
            </div>
          </div>

          <button
            onClick={() => onOpenClinicalForm('suicide_risk')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>فتح بروتوكول تقييم الخطورة</span>
          </button>
        </div>

        {/* SOAP Note Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-2xl p-6 shadow-2xs flex flex-col justify-between transition-all group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>

            <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 block mb-1">SOAP-NOTE</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              تقرير الجلسة العلاجية بنموذج (SOAP)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              النموذج الطبي القياسي لتوثيق الجلسات النفسية: الشكوى الذاتية (S)، الملاحظات الموضوعية (O)، التقييم التحليلي (A)، والخطة والواجب (P).
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-4">
              <div>✓ توثيق الواجبات المنزلية المعرفية</div>
              <div>✓ تتبع مدى التقدم بين الجلسات</div>
              <div>✓ متوافق مع معايير جودة الرعاية الصحية</div>
            </div>
          </div>

          <button
            onClick={() => onOpenClinicalForm('soap_note')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>توثيق تقرير الجلسة (SOAP)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
