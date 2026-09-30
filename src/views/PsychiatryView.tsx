import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  BookOpen, 
  Pill, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  ShieldAlert, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DISORDERS_DATA } from '../data/disorders';
import { PSYCHIATRIC_MEDS_DATA } from '../data/psychiatricMeds';
import { DisorderInfo, PsychiatricMed } from '../types';

interface Props {
  onOpenQuickScale: (scaleId?: string) => void;
  onOpenNewPrescription: () => void;
}

export const PsychiatryView: React.FC<Props> = ({ onOpenQuickScale, onOpenNewPrescription }) => {
  const [subTab, setSubTab] = useState<'disorders' | 'meds'>('disorders');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDisorderId, setExpandedDisorderId] = useState<string | null>('mdd');

  // Filter disorders
  const filteredDisorders = DISORDERS_DATA.filter(d => {
    const matchesSearch = d.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.codeDSM5.includes(searchQuery);
    const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Filter medications
  const filteredMeds = PSYCHIATRIC_MEDS_DATA.filter(m => {
    return m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           m.tradeNames.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
           m.classAr.includes(searchQuery);
  });

  const categories = ['all', 'اضطرابات المزاج', 'اضطرابات القلق', 'طيف الوسواس القهري', 'اضطرابات الصدمة', 'الاضطرابات النمائية العصبية', 'اضطرابات الأكل والنوم'];

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Header & Workspace Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                الدليل التشخيصي والدوائي
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">DSM-5-TR & ICD-11</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              مساحة الطب النفسي (Psychiatry Clinical Workspace)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              مرجع سريري فوري لمعايير التشخيص الإكلينيكي، الدليل الدوائي النفسي، والتدخلات الموصى بها كخط أول.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSubTab('disorders'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                subTab === 'disorders'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              دليل الاضطرابات التشخيصي
            </button>
            <button
              onClick={() => { setSubTab('meds'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                subTab === 'meds'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              أطلس الأدوية النفسية
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={subTab === 'disorders' ? "ابحث عن اضطراب (مثال: اكتئاب، هلع، وسواس، ADHD)..." : "ابحث عن دواء باسمه العلمي أو التجاري (مثال: Cipralex, Zoloft)..."}
              className="w-full pl-4 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>

          {subTab === 'disorders' && (
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white dark:bg-teal-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'جميع التصنيفات' : cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Disorders Sub-Tab */}
      {subTab === 'disorders' && (
        <div className="space-y-4">
          {filteredDisorders.map((disorder) => {
            const isExpanded = expandedDisorderId === disorder.id;

            return (
              <div 
                key={disorder.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs transition-all"
              >
                {/* Header Row */}
                <div 
                  onClick={() => setExpandedDisorderId(isExpanded ? null : disorder.id)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-850 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-900 dark:text-white text-base">{disorder.nameAr}</h2>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-semibold">
                          {disorder.codeDSM5}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-3 mt-0.5">
                        <span>{disorder.nameEn}</span>
                        <span>· التصنيف: {disorder.category}</span>
                        <span>· المدة التشخيصية المطلوبة: {disorder.diagnosticDuration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onOpenQuickScale(); }}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>المقاييس الموصى بها</span>
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-5 text-xs">
                    
                    {/* Core Criteria */}
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span>المعايير التشخيصية الأساسية (Core Diagnostic Criteria):</span>
                      </h3>
                      <ul className="space-y-1.5 mr-6 list-disc text-slate-700 dark:text-slate-300 leading-relaxed">
                        {disorder.coreCriteriaAr.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Differential Diagnoses */}
                    <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>التشخيص الفارقي (Differential Diagnoses الواجب استبعادها):</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {disorder.differentialDiagnoses.map((dd, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
                            {dd}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* First Line Treatments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-white block mb-1">
                          العلاج النفسي كخط أول (First-line Psychotherapy):
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{disorder.firstLineTherapy}</p>
                      </div>

                      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-white block mb-1">
                          العلاج الدوائي كخط أول (First-line Pharmacotherapy):
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{disorder.firstLinePharmacotherapy}</p>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Medications Sub-Tab */}
      {subTab === 'meds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMeds.map((med) => (
            <div 
              key={med.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white text-base">{med.tradeNames.join(' / ')}</h2>
                    <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 block">{med.genericName}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                    {med.classAr}
                  </span>
                </div>

                {/* Dosages Specs */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">جرعة البداية:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{med.startingDose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">الجرعة المستهدفة:</span>
                    <span className="font-bold text-teal-800 dark:text-teal-300">{med.targetDose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">الجرعة القصوى:</span>
                    <span className="font-bold text-rose-700 dark:text-rose-400">{med.maxDose}</span>
                  </div>
                </div>

                {/* Indications & Side Effects */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-semibold block mb-0.5">الاستطبابات الأساسية:</span>
                    <p className="text-slate-700 dark:text-slate-300">{med.primaryIndications.join('، ')}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-semibold block mb-0.5">الآثار الجانبية الشائعة:</span>
                    <p className="text-slate-600 dark:text-slate-400">{med.majorSideEffects.join('، ')}</p>
                  </div>
                </div>

                {/* Black Box Warning if exists */}
                {med.blackBoxWarning && (
                  <div className="mt-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">{med.blackBoxWarning}</p>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">عمر النصف: {med.halfLife}</span>
                <button
                  onClick={onOpenNewPrescription}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold transition-colors cursor-pointer"
                >
                  وصف هذا الدواء للمريض
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
