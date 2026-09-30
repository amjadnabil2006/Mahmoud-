import React, { useState } from 'react';
import { 
  BookOpen, 
  Bookmark, 
  CheckCircle, 
  Lightbulb, 
  ShieldCheck, 
  FileCheck2,
  ChevronLeft
} from 'lucide-react';
import { COOLMIND_BOOK_CHAPTERS } from '../data/nutritionAndSocial';

export const HandbookView: React.FC = () => {
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);

  const activeChapter = COOLMIND_BOOK_CHAPTERS[selectedChapterIdx];

  const chapterDetails: Record<number, { content: string[]; clinicalTips: string[] }> = {
    1: {
      content: [
        'يمثل كتاب كول مايند المرجع الإكلينيكي لتوحيد المعايير بين أعضاء الفريق الطبي والنفسي في العيادة.',
        'الاضطراب النفسي ليس مجرد "خلل كيميائي مجرد" في الدماغ، بل هو تفاعل معقد بين الاستعداد الوراثي، الصدمات المبكرة، الضغوط البيئية، ونمط التغذية والالتهاب العصبي.',
        'الجمع بين العلاج الدوائي الموجه والعلاج النفسي السلوكي (CBT) يرفع معدل التعافي التام (Remission) إلى أكثر من 70% مقارنة بـ 45% لكل منهما منفرداً.'
      ],
      clinicalTips: [
        'لا تبدأ الدواء أبداً دون بناء تحالف علاجي متين وتثقيف المريض (Psychoeducation).',
        'اشرح للمريض دائماً أن التحسن الدوائي يتطلب من أسبوعين إلى 4 أسابيع لمنع التوقف المبكر الناتج عن الإحباط.'
      ]
    },
    2: {
      content: [
        'المقاييس النفسية المقننة (مثل PHQ-9 و GAD-7 و Y-BOCS) هي "مقياس ضغط الدم وميزان الحرارة" للطبيب والمعالج النفسي.',
        'توفر المقاييس خط أساس موضوعي (Baseline) في الجلسة الأولى، وتسمح برصد التراجع أو التقدم بدقة رقمية في الجلسات اللاحقة.',
        'المقاييس تسهم في فك غموض المعاناة لدى المريض حين يرى درجاته تتناقص تدريجياً مع الجلسات، مما يعزز دافعية الالتزام.'
      ],
      clinicalTips: [
        'طبّق مقياس PHQ-9 شهرياً لمريض الاكتئاب لتوثيق الاستجابة (انخفاض 50% بالدرجة) أو التعافي التام (درجة أقل من 5).',
        'انتبه دائماً للبند رقم 9 الخاص بالتفكير في الموت أو إيذاء النفس.'
      ]
    },
    3: {
      content: [
        'القاعدة الذهبية في بدء الأدوية النفسية: "Start Low, Go Slow, but Aim for Full Dose".',
        'تثقيف المريض المسبق حول الآثار الجانبية العابرة (مثل الغثيان أو الصداع في أول أسبوع) يمنع 80% من حالات الانقطاع عن العلاج.',
        'مراعاة التداخلات الدوائية مع أدوية الأمراض المزمنة (الضغط، السكري، القلب) واختيار الدواء الأقل تأثيراً على إنزيمات الكبد (CYP450).'
      ],
      clinicalTips: [
        'دواء Sertraline و Escitalopram هما الأكثر أماناً لمرضى القلب والشرايين.',
        'لا توقف مضادات الاكتئاب بشكل مفاجئ أبداً، بل بتدرج على مدار 4 إلى 8 أسابيع لتجنب متلازمة الانقطاع.'
      ]
    },
    4: {
      content: [
        'تقييم خطورة الانتحار يجب أن يتم بأسلوب مهني مباشر دون تردد، فالسؤال الصريح لا يزرع الفكرة في عقل المريض كما يشاع.',
        'التفريق الحاسم بين التمني السلبي للموت (Passive Death Wish) وبين النية المبيتة مع وجود خطة ووسيلة (Active Intent & Plan).',
        'صياغة عقد الأمان وإشراك الأهل فوراً في حال تجاوزت الخطورة المستوى المتوسط.'
      ],
      clinicalTips: [
        'احتفظ بأرقام طوارئ الصحة النفسية المحلية في متناول يدك دوماً.',
        'أي مريض يعلن عن خطة محددة مع توفر وسيلة يعتبر حالة طوارئ طبية لا يسمح له بمغادرة العيادة دون إشراف أسري مباشر أو إحالة طارئة.'
      ]
    },
    5: {
      content: [
        'الدماغ يستهلك 20% من طاقة الجسم، وكل ناقل عصبي يحتاج لمغذيات أساسية لتخليقه (التربتوفان للسيروتونين، التيروزين للدوبامين).',
        'الميكروبيوم المعوي يتواصل لحظياً مع الدماغ عبر العصب الحائر (Vagus Nerve) والوسائط الالتهابية (Cytokines).',
        'تعديل النظام الغذائي بخفض السكريات المكررة وإضافة أوميغا-3 والمغنيسيوم يسهم في خفض التوتر والقلق وتحسين عمق النوم.'
      ],
      clinicalTips: [
        'اطلب دائماً فحص فيتامين د ومخزون الحديد وفيتامين ب12 لكل مريض اكتئاب أو وهن مزمن.',
        'احرص على مراقبة دهون وسكر الدم لمرضى مضادات الذهان تجنباً لمتلازمة الأيض.'
      ]
    }
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                المرجع السريري الإكلينيكي
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">CoolMind Clinical Practice Handbook</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              كتاب ودليل كول مايند للممارسة السريرية
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              دليل شامل وموجز لأفضل الممارسات الإكلينيكية، المبادئ العلاجية، وإرشادات الأمان في الطب النفسي المتكامل.
            </p>
          </div>
        </div>
      </div>

      {/* Chapters Navigation & Content Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chapters Table of Contents */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3 transition-colors">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2.5">
            فصول الدليل الإكلينيكي ({COOLMIND_BOOK_CHAPTERS.length})
          </h2>

          <div className="space-y-2">
            {COOLMIND_BOOK_CHAPTERS.map((ch, idx) => {
              const isSelected = selectedChapterIdx === idx;

              return (
                <button
                  key={ch.chapterNumber}
                  onClick={() => setSelectedChapterIdx(idx)}
                  className={`w-full text-right p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 text-purple-950 dark:text-purple-200 shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 text-[11px] font-bold flex items-center justify-center">
                      {ch.chapterNumber}
                    </span>
                    <span className="text-xs font-bold line-clamp-1">{ch.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mr-7">
                    {ch.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Chapter Reader */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs lg:col-span-2 space-y-6 transition-colors">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800 inline-block mb-2">
              الفصل {activeChapter.chapterNumber}
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
              {activeChapter.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {activeChapter.summary}
            </p>
          </div>

          {/* Chapter Content Paragraphs */}
          <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {chapterDetails[activeChapter.chapterNumber]?.content.map((p, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed">{p}</p>
              </div>
            ))}
          </div>

          {/* Clinical Pearls Box */}
          <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-amber-900 dark:text-amber-300 text-xs flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>لآلئ سريرية وتوصيات إجرائية (Clinical Pearls):</span>
            </h3>
            <ul className="text-xs text-amber-950 dark:text-amber-200 space-y-1.5 list-disc mr-6 leading-relaxed">
              {chapterDetails[activeChapter.chapterNumber]?.clinicalTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>مرجع CoolMind الطبي السريري 2026</span>
            <span>جميع الحقوق محفوظة للمنصة</span>
          </div>

        </div>

      </div>

    </div>
  );
};
