import React, { useState } from 'react';
import { 
  Apple, 
  Users, 
  Calculator, 
  Activity, 
  ShieldCheck, 
  HeartHandshake, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { NUTRITION_MENTAL_HEALTH_DATA, SOCIAL_WORK_ASSESSMENT_DATA } from '../data/nutritionAndSocial';
import { Patient } from '../types';

interface Props {
  activePatient: Patient;
}

export const NutritionSocialView: React.FC<Props> = ({ activePatient }) => {
  const [weightKg, setWeightKg] = useState<number>(72);
  const [heightCm, setHeightCm] = useState<number>(170);
  const [subTab, setSubTab] = useState<'nutrition' | 'social'>('nutrition');

  // BMI calculation
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '0';
  const bmiNum = parseFloat(bmi);

  let bmiCategory = 'طبيعي';
  let bmiColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
  if (bmiNum < 18.5) {
    bmiCategory = 'نقص في الوزن (انتبه لاضطرابات الأكل/القهم)';
    bmiColor = 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  } else if (bmiNum >= 25 && bmiNum < 30) {
    bmiCategory = 'زيادة في الوزن (مراقبة التمثيل الغذائي)';
    bmiColor = 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  } else if (bmiNum >= 30) {
    bmiCategory = 'سمنة (خطر متلازمة الأيض ومقاومة الأنسولين)';
    bmiColor = 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
  }

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                التكامل البيولوجي والنفسي والاجتماعي
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Nutritional Psychiatry & Social Work</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              التغذية النفسية والخدمة الاجتماعية
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              علوم محور الأمعاء-الدماغ، الحماية الأيضية لمضادات الذهان، وتقييم شبكة الدعم الأسري والاجتماعي.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubTab('nutrition')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                subTab === 'nutrition'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              التغذية العلاجية النفسية
            </button>
            <button
              onClick={() => setSubTab('social')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                subTab === 'social'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              الخدمة والدراسة الاجتماعية
            </button>
          </div>
        </div>
      </div>

      {subTab === 'nutrition' ? (
        <div className="space-y-6">
          
          {/* Quick BMI & Metabolic Monitor */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>حاسبة مؤشر كتلة الجسم (BMI) والرصد الأيضي لمريض العيادة النفسية</span>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">المريض: {activePatient.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الوزن الحالي (كجم):</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الطول (سم):</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-bold"
                  />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center space-y-1">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">مؤشر كتلة الجسم (BMI)</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white block font-mono">{bmi}</span>
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md border mt-1 ${bmiColor}`}>
                  {bmiCategory}
                </span>
              </div>

              <div className="bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-950 dark:text-amber-200 space-y-2">
                <span className="font-bold block text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>توصية الرصد الأيضي السريري:</span>
                </span>
                <p className="leading-relaxed text-[11px] text-amber-900 dark:text-amber-300">
                  إذا كان المريض يتناول مضادات الذهان مثل أولانزابين أو كويتيابين، يجب إجراء فحص سكر صائم، دهون ثلاثية، ومحيط الخصر شهرياً لتفادي متلازمة الأيض.
                </p>
              </div>
            </div>
          </div>

          {/* Gut-Brain Axis & Targeted Nutrients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {NUTRITION_MENTAL_HEALTH_DATA.map((protocol) => (
              <div 
                key={protocol.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {protocol.category}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2 mb-1">
                    {protocol.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {protocol.summaryAr}
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">المغذيات الدماغية الموصى بها:</span>
                  {protocol.targetNutrients.map((nut, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>{nut.name}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">{nut.benefit}</p>
                      <div className="text-[10px] text-teal-800 dark:text-teal-400 font-semibold pt-1">
                        <strong>المصادر:</strong> {nut.foodSources}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block mb-1">قائمة التدقيق السريرية:</span>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc mr-4">
                    {protocol.clinicalChecklist.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* Social Work Assessment */
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-6 transition-colors">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                دراسة الحالة الاجتماعية والبيئة الأسرية للمريض
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                توثيق الأبعاد البيئية المؤثرة في حدوث الانتكاسات أو الاستقرار السريري.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SOCIAL_WORK_ASSESSMENT_DATA.map((domain, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                    <HeartHandshake className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>{domain.domain}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {domain.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Clinician Recommendation for Social Work */}
            <div className="bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-xs text-purple-950 dark:text-purple-200 space-y-1">
              <strong className="block text-purple-900 dark:text-purple-300">توصية أخصائي الخدمة الاجتماعية:</strong>
              <p className="text-purple-900 dark:text-purple-300 leading-relaxed">
                يجب عقد جلسة إرشاد أسري (Family Psychoeducation) لإزالة اللوم والوصمة عن المريض، والتأكيد على دوره في الالتزام بالعلاج وتجنب الانتكاس.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
