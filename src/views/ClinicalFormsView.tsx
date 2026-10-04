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
  Plus,
  Apple,
  Users,
  Filter,
  Search,
  BookOpen
} from 'lucide-react';
import { Patient, SavedClinicalRecord, StaffUser } from '../types';
import { CLINICAL_FORMS_TEMPLATES } from '../data/clinicalForms';
import { clinicalStorage } from '../services/clinicalRecords';

interface Props {
  activePatient: Patient;
  onOpenClinicalForm: (formType: string) => void;
  currentStaff?: StaffUser | null;
}

export const ClinicalFormsView: React.FC<Props> = ({
  activePatient,
  onOpenClinicalForm,
  currentStaff
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecordForView, setSelectedRecordForView] = useState<SavedClinicalRecord | null>(null);

  const patientRecords = clinicalStorage.getPatientRecords(activePatient.id);

  const filteredTemplates = CLINICAL_FORMS_TEMPLATES.filter(tmpl => {
    const matchesSpecialty = selectedSpecialty === 'all' || 
      (selectedSpecialty === 'psychiatry_psychology' && tmpl.specialty === 'psychiatry_psychology') ||
      (selectedSpecialty === 'social_work' && tmpl.specialty === 'social_work') ||
      (selectedSpecialty === 'clinical_nutrition' && tmpl.specialty === 'clinical_nutrition');

    const matchesSearch = tmpl.titleAr.includes(searchQuery) ||
      tmpl.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.descriptionAr.includes(searchQuery);

    return matchesSpecialty && matchesSearch;
  });

  const handlePrintRecord = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                السجلات والبروتوكولات السريرية للتخصصات الثلاثة
              </span>
              <span className="text-xs text-slate-400">Integrated Clinical Forms</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              نماذج الجلسات والتقييم الإكلينيكي المعتمد
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              منظومة التوثيق السريري الشامل: الطب والعلاج النفسي (MSE / SOAP / C-SSRS / CBT)، الخدمة الاجتماعية والإرشاد الأسري، والتغذية العلاجية ومحور الأمعاء-الدماغ.
            </p>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-2xl shrink-0">
            المريض النشط: <strong className="text-slate-900 dark:text-white">{activePatient.name}</strong> ({activePatient.fileNumber})
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'جميع النماذج (8)', icon: FileText },
              { id: 'psychiatry_psychology', label: 'الطب والعلاج النفسي', icon: Stethoscope },
              { id: 'social_work', label: 'الخدمة الاجتماعية والإرشاد الأسري', icon: Users },
              { id: 'clinical_nutrition', label: 'التغذية العلاجية والصحة العصبية', icon: Apple },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = selectedSpecialty === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSpecialty(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في النماذج والرموز..."
              className="w-full pl-3 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map(tmpl => {
          const isPsych = tmpl.specialty === 'psychiatry_psychology';
          const isSocial = tmpl.specialty === 'social_work';
          const isNutr = tmpl.specialty === 'clinical_nutrition';

          let iconBg = 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400';
          let borderAccent = 'hover:border-teal-400';
          let btnColor = 'bg-teal-700 hover:bg-teal-800';

          if (tmpl.id === 'suicide_risk') {
            iconBg = 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400';
            borderAccent = 'hover:border-rose-400';
            btnColor = 'bg-rose-600 hover:bg-rose-700';
          } else if (isSocial) {
            iconBg = 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400';
            borderAccent = 'hover:border-indigo-400';
            btnColor = 'bg-indigo-600 hover:bg-indigo-700';
          } else if (isNutr) {
            iconBg = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400';
            borderAccent = 'hover:border-emerald-400';
            btnColor = 'bg-emerald-600 hover:bg-emerald-700';
          }

          return (
            <div
              key={tmpl.id}
              className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${borderAccent} rounded-3xl p-5 shadow-2xs flex flex-col justify-between transition-all group`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center font-bold group-hover:scale-105 transition-transform`}>
                    {tmpl.id === 'suicide_risk' ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : isSocial ? (
                      <Users className="w-5 h-5" />
                    ) : isNutr ? (
                      <Apple className="w-5 h-5" />
                    ) : (
                      <ClipboardCheck className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {tmpl.code}
                    </span>
                    {tmpl.estimatedMinutes && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        ~{tmpl.estimatedMinutes} دقيقة
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 block mb-1">
                  {tmpl.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {tmpl.titleAr}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {tmpl.descriptionAr}
                </p>
              </div>

              <button
                onClick={() => onOpenClinicalForm(tmpl.id)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 ${btnColor} text-white rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>تعبئة وتوثيق النموذج الآن</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Saved Records History for Active Patient */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              السجلات المعتمدة المحفوظة للمريض: {activePatient.name}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              جميع السجلات مشفرة وموثقة بختم رسمي ورقم تسلسلي غير قابل للتعديل بعد الاعتماد
            </p>
          </div>
          <span className="text-xs text-teal-700 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-xl">
            {patientRecords.length} سجلات موثقة
          </span>
        </div>

        {patientRecords.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            لا توجد سجلات ونماذج سابقة محفوظة لهذا المريض بعد. اختر أحد النماذج أعلاه لبدء التوثيق.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {patientRecords.map(rec => (
              <div
                key={rec.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-teal-700 dark:text-teal-400 font-bold text-[11px]">
                      {rec.recordNumber}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                      ✓ {rec.status}
                    </span>
                  </div>
                  <strong className="text-slate-900 dark:text-white block text-sm">
                    {rec.titleAr}
                  </strong>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2">
                    {rec.summaryText}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-500">
                  <span>المختص: <strong>{rec.doctorName}</strong></span>
                  <span>التاريخ: {rec.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
