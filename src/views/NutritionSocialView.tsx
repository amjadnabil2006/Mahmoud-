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
  Sparkles,
  Save,
  Printer,
  TrendingDown,
  Plus
} from 'lucide-react';
import { NUTRITION_MENTAL_HEALTH_DATA, SOCIAL_WORK_ASSESSMENT_DATA } from '../data/nutritionAndSocial';
import { Patient, SavedClinicalRecord, StaffUser } from '../types';
import { clinicalStorage } from '../services/clinicalRecords';

interface Props {
  activePatient: Patient;
  currentStaff?: StaffUser | null;
}

export const NutritionSocialView: React.FC<Props> = ({ activePatient, currentStaff }) => {
  const [weightKg, setWeightKg] = useState<number>(62.5);
  const [heightCm, setHeightCm] = useState<number>(165);
  const [subTab, setSubTab] = useState<'nutrition' | 'social'>('nutrition');
  const [isSaved, setIsSaved] = useState(false);

  // Nutrition Plan form state
  const [targetCalories, setTargetCalories] = useState('1850 سعرة حرارية/يوم');
  const [macroSplit, setMacroSplit] = useState('كربوهيدرات معقدة 50% | بروتين 25% | دهون صحية 25%');
  const [keySupplements, setKeySupplements] = useState('مغنيسيوم غلايسينات 400 مجم + أوميغا-3 (DHA/EPA 1000mg)');
  const [gutBrainNotes, setGutBrainNotes] = useState('التركيز على الأطعمة المخمرة والبريبايوتيك لدعم السيروتونين المعوي.');

  // Social Work form state
  const [socialSupportLevel, setSocialSupportLevel] = useState('دعم أسري ممتاز وداعم');
  const [financialStress, setFinancialStress] = useState('مستقر حالياً');
  const [rehabPlan, setRehabPlan] = useState('التنسيق مع بيئة العمل لتخفيف نوبات الإجهاد وتفعيل جدول ساعات مرن.');

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

  const handleSavePlan = () => {
    const isNutr = subTab === 'nutrition';
    const newRecord: SavedClinicalRecord = {
      id: 'rec-' + Date.now(),
      recordNumber: isNutr ? `EHR-NUT-${Date.now().toString().slice(-6)}` : `EHR-SOC-${Date.now().toString().slice(-6)}`,
      patientId: activePatient.id,
      patientName: activePatient.name,
      patientFileNumber: activePatient.fileNumber,
      doctorId: currentStaff?.doctorId || (isNutr ? 'doc-wejdan' : 'doc-yosra'),
      doctorName: currentStaff?.name || (isNutr ? 'أ. وجدان فتح الله' : 'أ. يسرا علي'),
      doctorLicenseNumber: currentStaff?.licenseNumber || (isNutr ? 'YM-NUT-3310' : 'YM-SOC-4412'),
      formType: isNutr ? 'nutrition_plan' : 'social_assessment',
      titleAr: isNutr ? 'الخطة الغذائية الداعمة لمحور الأمعاء-الدماغ' : 'دراسة الحالة الاجتماعية والتأهيل الأسري',
      date: new Date().toISOString().split('T')[0],
      status: 'معتمد وموقع سريرياً',
      summaryText: isNutr 
        ? `خطة التغذية: مؤشر BMI (${bmi}) · ${targetCalories} · ${keySupplements}`
        : `الدراسة الاجتماعية: ${socialSupportLevel} · خطة التأهيل: ${rehabPlan}`,
      formData: isNutr ? {
        weightKg,
        heightCm,
        bmi,
        bmiCategory,
        targetCalories,
        macroSplit,
        keySupplements,
        gutBrainNotes
      } : {
        socialSupportLevel,
        financialStress,
        rehabPlan
      },
      signatureText: `${currentStaff?.name || (isNutr ? 'أ. وجدان فتح الله' : 'أ. يسرا علي')} - معتمد`,
      verifiedStamp: true
    };

    clinicalStorage.saveRecord(newRecord);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

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
              علوم محور الأمعاء-الدماغ، الحماية الأيضية لمضادات الذهان، وتقييم شبكة الدعم الأسري والاجتماعي مع الحفظ في ملف المريض
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
              <span className="text-xs text-slate-400 dark:text-slate-500">المريض: <strong>{activePatient.name}</strong></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  الوزن الحالي (كجم):
                </label>
                <input 
                  type="number" 
                  value={weightKg} 
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  الطول (سم):
                </label>
                <input 
                  type="number" 
                  value={heightCm} 
                  onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className={`p-2.5 rounded-xl border text-center font-bold text-xs ${bmiColor}`}>
                  <span>مؤشر BMI: <strong>{bmi}</strong> ({bmiCategory})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form to Save Custom Plan */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Apple className="w-4 h-4 text-amber-600" />
                <span>الخطة الغذائية الداعمة لمحور الدماغ للمريض {activePatient.name}</span>
              </h3>
              <span className="text-xs text-slate-400">تُحفظ في السجل الطبي الموحد</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  السعرات الحرارية المستهدفة
                </label>
                <input
                  type="text"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  توزيع المغذيات الكبرى (Macros)
                </label>
                <input
                  type="text"
                  value={macroSplit}
                  onChange={(e) => setMacroSplit(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  المكملات والأغذية العصبية المستهدفة (Neuro-nutrients)
                </label>
                <input
                  type="text"
                  value={keySupplements}
                  onChange={(e) => setKeySupplements(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  توجيهات محور الأمعاء-الدماغ (Gut-Brain Protocol)
                </label>
                <textarea
                  rows={2}
                  value={gutBrainNotes}
                  onChange={(e) => setGutBrainNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                ></textarea>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة الخطة الغذائية</span>
              </button>

              <button
                type="button"
                onClick={handleSavePlan}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>تم الحفظ في ملف المريض ✓</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>اعتماد وحفظ الخطة الغذائية في السجل</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Clinical Reference Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {NUTRITION_MENTAL_HEALTH_DATA.map(mod => (
              <div key={mod.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {mod.category}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{mod.title}</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{mod.summaryAr}</p>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Social Assessment Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>دراسة الحالة الاجتماعية والتأهيل الأسري للمريض {activePatient.name}</span>
              </h3>
              <span className="text-xs text-slate-400">ملف الخدمة الاجتماعية المعتمد</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  مستوى الدعم الأسري والاجتماعي
                </label>
                <input
                  type="text"
                  value={socialSupportLevel}
                  onChange={(e) => setSocialSupportLevel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الضغوط المهنية والمالية المحيطة
                </label>
                <input
                  type="text"
                  value={financialStress}
                  onChange={(e) => setFinancialStress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  خطة التأهيل الاجتماعي والدمج
                </label>
                <textarea
                  rows={3}
                  value={rehabPlan}
                  onChange={(e) => setRehabPlan(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                ></textarea>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة دراسة الحالة</span>
              </button>

              <button
                type="button"
                onClick={handleSavePlan}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>تم الحفظ في ملف المريض ✓</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>اعتماد وحفظ الدراسة الاجتماعية</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
