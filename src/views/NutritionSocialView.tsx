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
  Plus,
  Flame,
  Droplets,
  Scale,
  Brain,
  FileCheck2,
  Dna
} from 'lucide-react';
import { NUTRITION_MENTAL_HEALTH_DATA, SOCIAL_WORK_ASSESSMENT_DATA, NUTRITION_CLINICAL_TOOLS } from '../data/nutritionAndSocial';
import { Patient, SavedClinicalRecord, StaffUser } from '../types';
import { clinicalStorage } from '../services/clinicalRecords';

interface Props {
  activePatient: Patient;
  currentStaff?: StaffUser | null;
}

export const NutritionSocialView: React.FC<Props> = ({ activePatient, currentStaff }) => {
  const [subTab, setSubTab] = useState<'nutrition' | 'nutrition_tools' | 'social' | 'mind_score'>('nutrition');
  const [isSaved, setIsSaved] = useState(false);

  // Measurements
  const [weightKg, setWeightKg] = useState<number>(68);
  const [heightCm, setHeightCm] = useState<number>(170);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [activityLevel, setActivityLevel] = useState<number>(1.375); // Light activity

  // Nutrition Plan form state
  const [targetCalories, setTargetCalories] = useState('1900 سعرة حرارية/يوم');
  const [macroSplit, setMacroSplit] = useState('كربوهيدرات معقدة 50% | بروتين 25% | دهون صحية 25%');
  const [keySupplements, setKeySupplements] = useState('مغنيسيوم غلايسينات 400 مجم + أوميغا-3 (DHA/EPA 1000mg)');
  const [gutBrainNotes, setGutBrainNotes] = useState('التركيز على الأطعمة المخمرة والبريبايوتيك لدعم السيروتونين المعوي وتخفيف أعراض القولون العصبي.');

  // Social Work form state
  const [socialSupportLevel, setSocialSupportLevel] = useState('دعم أسري ممتاز وداعم');
  const [familyConflictDegree, setFamilyConflictDegree] = useState('خلافات عادية معتادة');
  const [financialStress, setFinancialStress] = useState('مستقر حالياً');
  const [rehabPlan, setRehabPlan] = useState('التنسيق مع بيئة العمل لتخفيف نوبات الإجهاد وتفعيل جدول ساعات مرن وإشراك الأسرة في خطة الدعم.');

  // MIND Diet Questions Score State
  const [mindAnswers, setMindAnswers] = useState<Record<number, number>>({
    0: 2, // Green leafy vegetables
    1: 1, // Other veggies
    2: 1, // Berries
    3: 1, // Nuts
    4: 1, // Olive oil
    5: 1, // Whole grains
    6: 1, // Fish
    7: 1, // Beans/Legumes
    8: 0, // Poultry
    9: 1  // Low ultraprocessed/sweets
  });

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

  // BMR Calculation (Mifflin-St Jeor)
  // Men: (10 × weight) + (6.25 × height) - (5 × age) + 5
  // Women: (10 × weight) + (6.25 × height) - (5 × age) - 161
  const bmr = gender === 'male'
    ? Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5)
    : Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);

  const tdee = Math.round(bmr * activityLevel);

  // Macros in grams based on TDEE
  const carbGrams = Math.round((tdee * 0.50) / 4);
  const proteinGrams = Math.round((tdee * 0.25) / 4);
  const fatGrams = Math.round((tdee * 0.25) / 9);

  // Hydration calculation: ~35ml per kg
  const hydrationLiters = ((weightKg * 35) / 1000).toFixed(1);

  // Total MIND diet score (0 - 15 points)
  const totalMindScore = Object.values(mindAnswers).reduce((a, b) => a + b, 0);

  const handleSavePlan = () => {
    const isNutr = subTab === 'nutrition' || subTab === 'nutrition_tools' || subTab === 'mind_score';
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
      titleAr: isNutr ? 'الخطة الغذائية والحسابات الأيضية لمحور الأمعاء-الدماغ' : 'دراسة الحالة الاجتماعية وديناميات الأسرة والتأهيل',
      date: new Date().toISOString().split('T')[0],
      status: 'معتمد وموقع سريرياً',
      summaryText: isNutr 
        ? `خطة التغذية: مؤشر BMI (${bmi}) · طاقة BMR (${bmr} kcal) · TDEE (${tdee} kcal) · ${keySupplements}`
        : `الدراسة الاجتماعية: ${socialSupportLevel} · الصراعات: ${familyConflictDegree} · خطة التأهيل: ${rehabPlan}`,
      formData: isNutr ? {
        weightKg,
        heightCm,
        age,
        gender,
        bmi,
        bmiCategory,
        bmr,
        tdee,
        carbGrams,
        proteinGrams,
        fatGrams,
        hydrationLiters,
        totalMindScore,
        targetCalories,
        macroSplit,
        keySupplements,
        gutBrainNotes
      } : {
        socialSupportLevel,
        familyConflictDegree,
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                التكامل البيولوجي والنفسي والاجتماعي
              </span>
              <span className="text-xs text-slate-400">Nutritional Psychiatry & Social Work</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              التغذية العلاجية النفسية والخدمة الاجتماعية
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              علوم محور الأمعاء-الدماغ، الحسابات الأيضية، مقياس حمية مايند (MIND Score)، والدراسة الاجتماعية وديناميات الأسرة.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSubTab('nutrition')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'nutrition'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              الخطة والبروتوكولات
            </button>
            <button
              onClick={() => setSubTab('nutrition_tools')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                subTab === 'nutrition_tools'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>حاسبة BMR والمغذيات</span>
            </button>
            <button
              onClick={() => setSubTab('mind_score')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                subTab === 'mind_score'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>مقياس MIND للصحة النفسية</span>
            </button>
            <button
              onClick={() => setSubTab('social')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'social'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              الخدمة الاجتماعية والأسرة
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: NUTRITION PLAN & PROTOCOLS                        */}
      {/* ======================================================== */}
      {subTab === 'nutrition' && (
        <div className="space-y-6">
          
          {/* Clinical Protocols Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {NUTRITION_MENTAL_HEALTH_DATA.map(item => (
              <div
                key={item.id}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.summaryAr}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    المغذيات المستهدفة:
                  </span>
                  <div className="space-y-1.5">
                    {item.targetNutrients.map((nut, nIdx) => (
                      <div key={nIdx} className="text-[11px] bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                        <strong className="text-amber-700 dark:text-amber-400 block">{nut.name}</strong>
                        <span className="text-slate-500">{nut.benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form: Active Nutrition Plan */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Apple className="w-4 h-4 text-amber-600" />
                  <span>الخطة الغذائية العصبية للمريض: {activePatient.name}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  حفظ وتوثيق التوصيات الغذائية والمكملات في الملف الطبي الموحد للمريض
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  السعرات الحرارية المستهدفة
                </label>
                <input
                  type="text"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  توزيع المغذيات الكبرى (Macros)
                </label>
                <input
                  type="text"
                  value={macroSplit}
                  onChange={(e) => setMacroSplit(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  المكملات الغذائية العصبية الموصى بها
                </label>
                <input
                  type="text"
                  value={keySupplements}
                  onChange={(e) => setKeySupplements(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  ملاحظات وتوجيهات محور الأمعاء-الدماغ
                </label>
                <textarea
                  rows={3}
                  value={gutBrainNotes}
                  onChange={(e) => setGutBrainNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs resize-y"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الخطة الغذائية</span>
              </button>

              <button
                type="button"
                onClick={handleSavePlan}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم حفظ الخطة في السجل الطبي ✓</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>اعتماد وحفظ الخطة الغذائية</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: NUTRITION CALCULATORS & TOOLS (BMR / MACROS)      */}
      {/* ======================================================== */}
      {subTab === 'nutrition_tools' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Input Parameters */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>البيانات البيولوجية والقياسات</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">الوزن الحالي (كجم)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">الطول (سم)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">العمر</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">الجنس</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                    >
                      <option value="female">أنثى</option>
                      <option value="male">ذكر</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">مستوى النشاط البدني اليومي</label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option value={1.2}>خامل / قليل الحركة جداً (Sedentary)</option>
                    <option value={1.375}>نشاط خفيف (مشي 1-3 أيام/أسبوع)</option>
                    <option value={1.55}>نشاط متوسط (تمارين 3-5 أيام/أسبوع)</option>
                    <option value={1.725}>نشاط عالي (تمارين شاقة يومية)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column: Calculated Results */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* BMI Card */}
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs space-y-1">
                  <span className="text-[11px] text-slate-400 block font-medium">كتلة الجسم (BMI)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{bmi}</span>
                    <span className="text-xs text-slate-400">kg/m²</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${bmiColor}`}>
                    {bmiCategory}
                  </span>
                </div>

                {/* BMR Card */}
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs space-y-1">
                  <span className="text-[11px] text-slate-400 block font-medium">معدل الأيض الأساسي (BMR)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-600 font-mono">{bmr}</span>
                    <span className="text-xs text-slate-400">kcal/يوم</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">طاقة الراحة الإلزامية للأعضاء</span>
                </div>

                {/* TDEE Card */}
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs space-y-1">
                  <span className="text-[11px] text-slate-400 block font-medium">الاحتياج اليومي الكلي (TDEE)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-teal-600 font-mono">{tdee}</span>
                    <span className="text-xs text-slate-400">kcal/يوم</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">للحفاظ على الوزن الحالي</span>
                </div>

              </div>

              {/* Macronutrient Distribution Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>توزيع المغذيات الكبرى الموصى بها للدماغ (Macros Split)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">كربوهيدرات معقدة (50%)</span>
                    <span className="text-xl font-black text-amber-900 dark:text-amber-200 font-mono mt-1 block">{carbGrams} جم</span>
                    <span className="text-[10px] text-slate-500 mt-1 block">توفير الجلوكوز المستقر والتريبتوفان</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900">
                    <span className="text-xs font-bold text-teal-800 dark:text-teal-300 block">بروتين عالي الجودة (25%)</span>
                    <span className="text-xl font-black text-teal-900 dark:text-teal-200 font-mono mt-1 block">{proteinGrams} جم</span>
                    <span className="text-[10px] text-slate-500 mt-1 block">أحماض أمينية لبناء النواقل العصبية</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                    <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 block">دهون صحية وأوميغا-3 (25%)</span>
                    <span className="text-xl font-black text-indigo-900 dark:text-indigo-200 font-mono mt-1 block">{fatGrams} جم</span>
                    <span className="text-[10px] text-slate-500 mt-1 block">سيولة الأغشية العصبية ومضاد التهاب</span>
                  </div>
                </div>

                <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-sky-900 dark:text-sky-200">
                    <Droplets className="w-4 h-4 text-sky-600" />
                    <span>الاحتياج اليومي الأدنى من السوائل والماء:</span>
                  </div>
                  <strong className="text-sky-900 dark:text-sky-200 font-mono font-black text-sm">
                    {hydrationLiters} لتر / يوم
                  </strong>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: MIND DIET SCORE EVALUATION                        */}
      {/* ======================================================== */}
      {subTab === 'mind_score' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>مقياس حمية العقل ومايند للصحة النفسية (MIND Diet Score)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                فحص جودة النمط الغذائي ومدى حمايته من الالتهاب العصبي وتدهور المزاج والذاكرة
              </p>
            </div>

            <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-950 px-4 py-2 rounded-2xl border border-purple-200 dark:border-purple-800">
              <span className="text-xs text-purple-900 dark:text-purple-300 font-bold">النتيجة الإجمالية:</span>
              <strong className="text-xl font-black text-purple-900 dark:text-purple-200 font-mono">
                {totalMindScore} / 15
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { id: 0, title: 'الخضروات الورقية الداكنة (جرجير، سبانخ، خس)', desc: '≥ 6 حصص أسبوعياً' },
              { id: 1, title: 'خضروات متنوعة أخرى', desc: '≥ 1 حصة يومياً' },
              { id: 2, title: 'التوتيات والتوت البري والفراولة', desc: '≥ حصتان أسبوعياً' },
              { id: 3, title: 'المكسرات النيئة غير المحمصة (جوز، لوز)', desc: '≥ 5 حصص أسبوعياً' },
              { id: 4, title: 'زيت الزيتون البكر الممتاز كمصدر رئيسي', desc: 'استخدام يومي منتظم' },
              { id: 5, title: 'الحبوب الكاملة (شوفان، كينوا، أرز بني)', desc: '≥ 3 حصص يومياً' },
              { id: 6, title: 'الأسماك الدهنية (سلمون، سردين، تونة)', desc: '≥ 1-2 حصة أسبوعياً' },
              { id: 7, title: 'البقوليات (عدس، حمص، فاصوليا)', desc: '≥ 3-4 حصص أسبوعياً' },
              { id: 8, title: 'الدواجن والبيض العضوي', desc: '≥ حصتان أسبوعياً' },
              { id: 9, title: 'تجنب المقليات والسكريات والوجبات السريعة', desc: '< 1 حصة أسبوعياً' },
            ].map(q => {
              const val = mindAnswers[q.id] || 0;
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{q.title}</h4>
                    <span className="text-[11px] text-slate-400">{q.desc}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setMindAnswers(prev => ({ ...prev, [q.id]: 0 }))}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${val === 0 ? 'bg-slate-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'}`}
                    >
                      شحيح (0)
                    </button>
                    <button
                      onClick={() => setMindAnswers(prev => ({ ...prev, [q.id]: 1 }))}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${val === 1 ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'}`}
                    >
                      ممتاز (+1)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SOCIAL WORK & FAMILY DYNAMICS                     */}
      {/* ======================================================== */}
      {subTab === 'social' && (
        <div className="space-y-6">
          
          {/* Social Assessment Domains */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SOCIAL_WORK_ASSESSMENT_DATA.map((sec, idx) => (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xs space-y-3"
              >
                <h3 className="font-bold text-sm text-indigo-800 dark:text-indigo-400">
                  {sec.domain}
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {sec.items.map((it, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Intake Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>دراسة الحالة الاجتماعية والتأهيل الأسري: {activePatient.name}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  توثيق شبكة الدعم والمساندة الأسرية والتمكين المهني والاجتماعي
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  مستوى الدعم والتماسك الأسري
                </label>
                <select
                  value={socialSupportLevel}
                  onChange={(e) => setSocialSupportLevel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                >
                  <option value="دعم أسري ممتاز وداعم">دعم أسري ممتاز وداعم</option>
                  <option value="دعم متوسط مع وجود مخاوف من الوصمة">دعم متوسط مع وجود مخاوف من الوصمة</option>
                  <option value="عزلة وجفاء أسري حاد">عزلة وجفاء أسري حاد</option>
                  <option value="صراعات أسرية حادة ومعنفة">صراعات أسرية حادة ومعنفة</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  الاستقرار المهني والمالي
                </label>
                <select
                  value={financialStress}
                  onChange={(e) => setFinancialStress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                >
                  <option value="مستقر حالياً">مستقر حالياً</option>
                  <option value="ضغوط عمل واحتراق وظيفي">ضغوط عمل واحتراق وظيفي</option>
                  <option value="تحديات مالية حادة ومؤثرة على العلاج">تحديات مالية حادة ومؤثرة على العلاج</option>
                  <option value="عاطل وباحث عن عمل">عاطل وباحث عن عمل</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  خطة التأهيل والتمكين الاجتماعي
                </label>
                <textarea
                  rows={3}
                  value={rehabPlan}
                  onChange={(e) => setRehabPlan(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs resize-y"
                  placeholder="سجل خطوات التمكين الأسري، جلسات التوجيه الزواجي، والتنسيق الوظيفي..."
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة التقرير الاجتماعي</span>
              </button>

              <button
                type="button"
                onClick={handleSavePlan}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم حفظ الدراسة الاجتماعية ✓</span>
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
