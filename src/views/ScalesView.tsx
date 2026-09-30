import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Play, 
  Clock, 
  Award, 
  Info, 
  CheckCircle2, 
  Calendar, 
  FileText,
  TrendingUp,
  User
} from 'lucide-react';
import { PsychologicalScale, ScaleAssessmentResult, Patient } from '../types';
import { PSYCHOLOGICAL_SCALES_DATA } from '../data/psychologicalScales';

interface Props {
  activePatient: Patient;
  scaleResults: ScaleAssessmentResult[];
  onLaunchScale: (scaleId: string) => void;
}

export const ScalesView: React.FC<Props> = ({
  activePatient,
  scaleResults,
  onLaunchScale,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filteredScales = PSYCHOLOGICAL_SCALES_DATA.filter(s => {
    const matchesSearch = s.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || s.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', 'الاكتئاب', 'القلق والهلع', 'الوسواس القهري', 'النوم والأرق', 'ADHD والنمائي', 'الصدمة والضغوط'];

  const patientResults = scaleResults.filter(r => r.patientId === activePatient.id);

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                محرك القياس والتقييم السيكومتري
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Psychological Assessment Suite</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              مكتبة المقاييس والاختبارات النفسية المقننة
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              تطبيق المقاييس السريرية المعتمدة رقمياً مع التصحيح الحسابي الفوري وحساب مستويات الشدة والتوصيات الإكلينيكية.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl">
              المريض المطبق عليه: <strong className="text-slate-900 dark:text-white">{activePatient.name}</strong>
            </span>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مقياس (مثال: PHQ-9, قلق, أرق, وسواس)..."
              className="w-full pl-4 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-indigo-900 text-white dark:bg-indigo-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? 'جميع المقاييس' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scales Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredScales.map((scale) => (
          <div 
            key={scale.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all hover:shadow-xs group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {scale.code}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{scale.estimatedMinutes} دقائق</span>
                </span>
              </div>

              <h2 className="font-bold text-slate-900 dark:text-white text-base mb-1 group-hover:text-indigo-900 dark:group-hover:text-indigo-300 transition-colors">
                {scale.nameAr}
              </h2>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono block mb-2">{scale.nameEn}</span>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-3">
                {scale.descriptionAr}
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-100 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                <div><strong>عدد البنود:</strong> {scale.questions.length} أسئلة مقننة</div>
                <div><strong>الفئات:</strong> {scale.scoringCriteria.map(s => s.labelAr.split('(')[0].trim()).join(' · ')}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>تصحيح فوري</span>
              </span>

              <button
                onClick={() => onLaunchScale(scale.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>بدء الاختبار الآن</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Assessment Results History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              سجل المقاييس المنجزة للمريض: {activePatient.name}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              جميع نتائج التقييمات السيكومترية الموثقة في السجل الطبي الإلكتروني
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {patientResults.length} تقييمات محفوظة
          </span>
        </div>

        {patientResults.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <Activity className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              لم يجرِ المريض الحالي أي مقياس نفسي مسجل حتى الآن.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              اختر أحد المقاييس من الأعلى واضغط "بدء الاختبار الآن" لتسجيل أول تقييم.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {patientResults.map((res) => (
              <div 
                key={res.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{res.scaleName}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{res.date}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {res.severity.interpretation}
                  </p>

                  {res.clinicianNotes && (
                    <p className="text-xs text-teal-900 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/60 p-2 rounded-lg border border-teal-200/60 dark:border-teal-800 mt-1">
                      <strong>ملاحظة الفاحص:</strong> {res.clinicianNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-end">
                  <div className="text-center px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">الدرجة الكلية</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{res.totalScore}</span>
                  </div>

                  <div className="text-left">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-bold block ${
                      res.severity.badgeColor === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                      res.severity.badgeColor === 'teal' ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300' :
                      res.severity.badgeColor === 'amber' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                      res.severity.badgeColor === 'orange' ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300' :
                      'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    }`}>
                      {res.severity.labelAr}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                      إجراء: {res.severity.clinicalAction.slice(0, 35)}...
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
