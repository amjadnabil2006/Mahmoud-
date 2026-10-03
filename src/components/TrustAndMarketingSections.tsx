import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Clock, 
  HeartHandshake, 
  Sparkles, 
  Check, 
  X as XIcon, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Users, 
  ArrowLeft, 
  BookOpen, 
  Video, 
  Building2, 
  Calendar, 
  Send,
  MessageSquare,
  HelpCircle,
  Stethoscope,
  Smile
} from 'lucide-react';

export const AboutUsSection: React.FC = () => {
  return (
    <section id="about-us" className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 text-white shadow-2xl relative overflow-hidden">
      <div className="relative z-10 max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-teal-200 text-xs font-black border border-white/15 backdrop-blur-md">
          <HeartHandshake className="w-4 h-4 text-teal-300" />
          قصتنا ورؤيتنا — من نحن
        </div>

        <h2 className="text-2xl sm:text-4xl font-black leading-tight">
          المنظومة النفسية الإكلينيكية الرقمية الأولى المصممة للمجتمع اليمني والمهجر
        </h2>

        <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed font-normal">
          تأسست منصة <strong>كول مايند (CoolMind)</strong> لسد الفجوة الكبيرة في خدمات الصحة النفسية والعلاج المعرفي السلوكي في اليمن والشرق الأوسط والمهجر، بهدف كسر وصمة العار وتوفير رعاية تخصصية قائمة على الدليل الطبي، بأعلى معايير السرية والأمان وأنسب الأسعار التنافسية.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h4 className="font-bold text-teal-300 text-sm mb-1">الرؤية</h4>
            <p className="text-teal-100/80">مجتمع واعٍ ومتمكن نفسياً يتمتع برعاية نفسية راقية متاحة للجميع في أي وقت ومن أي مكان.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h4 className="font-bold text-teal-300 text-sm mb-1">الرسالة</h4>
            <p className="text-teal-100/80">تقديم استشارات متكاملة (طب نفسي، علاج CBT، تغذية نفسية، وخدمة اجتماعية) في بيئة مشفرة تحفظ الكرامة.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h4 className="font-bold text-teal-300 text-sm mb-1">وعدنا الصارم</h4>
            <p className="text-teal-100/80">سرية مطلقة، لا تسجيل للجلسات، ونظام ترشيح دقيق يضمن تعيين معالجك الأنسب خلال 24 ساعة.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const WhyUsSection: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: 'سرية وتشفير كامل (E2E)',
      desc: 'بياناتك وهويتك مشفرة وفق أعلى معايير الأمان الطبي HIPAA. خيار الاسم المستعار والدخول المجهول متاح دائماً.'
    },
    {
      icon: Award,
      title: 'نخبة من الاستشاريين المرخصين',
      desc: 'فريقنا الطبي مؤهل بدرجات البورد والدكتوراه وتراخيص رسمية سارية، بنسبة التزام بالمواعيد تفوق 98%.'
    },
    {
      icon: Clock,
      title: 'مرونة المواعيد وسرعة التعيين',
      desc: 'جلسات صباحية ومسائية تناسب جميع المناطق الزمنية للمغتربين، مع وعد التعيين خلال 24 ساعة كحد أقصى.'
    },
    {
      icon: HeartHandshake,
      title: 'تسعيرة عادلة وباقات توفير',
      desc: 'تسعيرة موحدة ومنافسة مع دعم كامل لوسائل الدفع اليمنية المحلية والدولية بدون أي تكاليف مخفية.'
    }
  ];

  return (
    <section className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          لماذا يختار الآلاف منصة كول مايند؟
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          نجمع بين أعلى المعايير الطبية السريرية وأحدث حلول التكنولوجيا الرقمية
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">{b.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{b.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onOpenAuth}
          className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition"
        >
          أنشئ حسابك وابدأ رحلة التعافي
        </button>
      </div>
    </section>
  );
};

export const StepsJourneySection: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const steps = [
    { num: '01', title: 'اختر نوع الرعاية', desc: 'استشارة فورية، علاج فردي، زوجي، أو أطفال.' },
    { num: '02', title: 'استبيان المطابقة', desc: 'أجب عن 4 أسئلة سريعة لتحديد التخصص واللهجة.' },
    { num: '03', title: 'ادفع بأمان وسهولة', desc: 'اختر الدفع اليمني (كريمي/جوالي) أو البطاقات الدولية.' },
    { num: '04', title: 'نتواصل معك (24 س)', desc: 'تثبيت الموعد وترشيح المعالج الأنسب لحالتك.' },
    { num: '05', title: 'ابدأ جلستك العلاجية', desc: 'انضم للجلسة المشفرة (فيديو/صوت/شات) من هاتفك.' }
  ];

  return (
    <section className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          ابدأ في 5 خطوات بسيطة
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          رحلة علاجية سلسة وميسرة من اللحظة الأولى وحتى استدامة التعافي
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map((s, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center relative">
            <span className="text-2xl font-black text-teal-600/40 block mb-2 font-mono">{s.num}</span>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1.5">{s.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export const ComparisonTableSection: React.FC = () => {
  const rows = [
    { criterion: 'مرونة الوقت والمواعيد', coolmind: 'مواعيد 24/7 حتى المساء والعطلات', traditional: 'أوقات دوام عيادات مقيدة ومحدودة' },
    { criterion: 'الخصوصية وعدم كشف الهوية', coolmind: 'اسم مستعار ودخول مجهول بدون لقاء أحد', traditional: 'غرف انتظار عامة وإمكانية مصادفة معارف' },
    { criterion: 'الوصمة الاجتماعية', coolmind: 'من منزلك وبأمان نفسي تام', traditional: 'حرج الذهاب الفعلي للعيادة النفسية' },
    { criterion: 'حرية تغيير المعالج', coolmind: 'تغيير فوري وسلس بنقرة زر وبدون حرج', traditional: 'إحراج وصعوبة البحث عن عيادة أخرى' },
    { criterion: 'التكلفة والتنقل', coolmind: 'أسعار تنافسية وباقات توفير وبلا مواصلات', traditional: 'تكاليف مرتفعة مع أعباء التنقل والازدحام' },
    { criterion: 'المتابعة بين الجلسات', coolmind: 'مراسلة نصية وتمارين CBT وملف موحد', traditional: 'انقطاع تام حتى الموعد التالي' }
  ];

  return (
    <section className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          كول مايند مقابل العيادات التقليدية
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          مقارنة موضوعية توضح الفارق في الراحة والسرية وجودة الرعاية
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 text-right font-black text-slate-800 dark:text-slate-200">المعيار</th>
              <th className="p-4 text-right font-black text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20">منصة كول مايند (CoolMind)</th>
              <th className="p-4 text-right font-black text-slate-500">العيادة النفسية التقليدية</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{r.criterion}</td>
                <td className="p-4 bg-teal-50/30 dark:bg-teal-950/10 text-teal-900 dark:text-teal-200 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 font-black" />
                    <span>{r.coolmind}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-500">
                  <div className="flex items-center gap-2">
                    <XIcon className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{r.traditional}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export const LeadershipSection: React.FC = () => {
  const leaders = [
    {
      name: 'بروفيسور سيف الدين الميري',
      role: 'المشرف الإكلينيكي العام واستشاري أول الطب النفسي',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80',
      bio: 'أستاذ الطب النفسي وعضو الجمعية العالمية للطب النفسي، يقود لجنة المراجعة السريرية وضبط جودة البروتوكولات العلاجية.'
    },
    {
      name: 'د. محمد عامر',
      role: 'مدير فريق المعالجين النفسيين ومشرف برامج CBT & EMDR',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
      bio: 'استشاري العلاج النفسي الإكلينيكي بخبرة 15 عاماً في الإشراف المهني وتأهيل الكوادر وتطوير مسارات التدخل في الصدمات.'
    },
    {
      name: 'أ. وجدان فتح الله',
      role: 'رئيسة قسم التغذية العلاجية ومحور الأمعاء-الدماغ',
      avatar: 'https://images.unsplash.com/photo-1594824813589-32289658b1a8?w=400&auto=format&fit=crop&q=80',
      bio: 'متخصصة في برامج التكامل العصبي الغذائي لعلاج اضطرابات الأكل وتحسين النواقل العصبية المعوية لدعم الصحة النفسية.'
    }
  ];

  return (
    <section className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          فريق الإشراف الإكلينيكي والقيادة الطبية
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          نخبة من كبار الأساتذة والاستشاريين المشرفين على جودة وأمان كل جلسة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaders.map((l, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <img src={l.avatar} alt={l.name} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-teal-500/20 shadow-md" />
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-slate-100">{l.name}</h3>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-bold mt-0.5">{l.role}</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{l.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'سارة م. (مغتربة)',
      doctor: 'معالجتها: أ. محمد المؤيد',
      text: 'كنت أعاني من نوبات هلع مفاجئة تمنعني من الخروج. من الجلسة الثانية بدأت تطبيق تقنيات التنفس وتفكيك الأفكار، واليوم استعدت حياتي الطبيعية بالكامل.',
      rating: 5
    },
    {
      name: 'م. أحمد (صنعاء)',
      doctor: 'معالجه: د. محمد عامر',
      text: 'السرية والراحة التي وجدتها في كول مايند لا تُقارن. لم أكن أتصور أن جلسات EMDR عن بعد ستكون بهذه الفعالية في معالجة صدمة حادث قديم.',
      rating: 5
    },
    {
      name: 'فاطمة ع. (عدن)',
      doctor: 'طبيبتها: د. سهام',
      text: 'د. سهام راقية جداً في التعامل وتفهّمت معاناتي مع اضطراب المزاج. تم ضبط الدواء بجرعات دقيقة وبدون أي كسل أو تعب.',
      rating: 5
    }
  ];

  return (
    <section className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          قصص نجاح وتجارب ملهمة من عملائنا
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          نحافظ على سرية الأسماء الكاملة ونعرض تجارب حقيقية بموافقة أصحابها
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((r, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(r.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{r.text}"
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <p className="font-black text-slate-900 dark:text-slate-100">{r.name}</p>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">{r.doctor}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'كيف أختار بين الطبيب النفسي والأخصائي النفسي؟',
      a: 'الأخصائي النفسي (Psychologist) يقدم جلسات العلاج المعرفي السلوكي (CBT) وتعديل السلوك وتفكيك الأفكار بدون أدوية. أما الطبيب النفسي (Psychiatrist) فهو طبيب بشري مرخص يقوم بالتشخيص الإكلينيكي وتقييم الحاجة للعلاج الدوائي وضبط الجرعات. يمكنك البدء بأي منهما وسيقوم النظام بتوجيهك.'
    },
    {
      q: 'ما هي مدة الجلسات العلاجية؟',
      a: 'جلسة العلاج النفسي والسلوكي الفردية مدتها 45 دقيقة كاملة. الجلسة الاستشارية الطبية النفسية مدتها 30 دقيقة. جلسة العلاج الزوجي 60 دقيقة. والاستشارة الفورية 30 دقيقة.'
    },
    {
      q: 'هل الجلسات مسجلة أو يمكن لأي طرف الاطلاع عليها؟',
      a: 'لا إطلاقاً. يمنع بروتوكول الأمان الطبي لكول مايند تسجيل أي جلسة صوتية أو مرئية، وتخضع جميع الاتصالات لتشفير تام (End-to-End Encryption) بينك وبين معالجك فقط.'
    },
    {
      q: 'هل يمكنني إلغاء اشتراكي أو استرداد المبلغ؟',
      a: 'نعم بكل تأكيد وبدون الحاجة لإبداء أي سبب. يمكنك استرداد 100% من المبلغ قبل 24 ساعة من موعد الجلسة، أو 50% قبل 12 ساعة، أو استرداد الرصيد المتبقي من الباقات المتعددة.'
    },
    {
      q: 'هل يمكنني تغيير معالجي إذا لم أشعر بالارتياح؟',
      a: 'نعم وبنقرة زر واحدة من لوحتك الشخصية وبدون أي إحراج، مع إمكانية نقل سجل تقدمك ومقاييسك بسلاسة للمختص الجديد.'
    },
    {
      q: 'ما هي طرق الدفع المتاحة داخل وخارج اليمن؟',
      a: 'داخل اليمن: ندعم الكريمي جوالي، ون كاش، محفظة الجيب، بنك التضامن، وحوالات النجم وإرسال. خارج اليمن والمهجر: ندعم البطاقات الائتمانية (Visa/MasterCard)، مدى، Apple Pay، وPayPal.'
    },
    {
      q: 'ماذا لو تأخرت عن موعد جلستي؟',
      a: 'ينتظرك المختص في غرفة الجلسة لمدة 15 دقيقة. إذا حضرت يتم استكمال ما تبقى من الوقت. في حال تأخر المختص يتم تعويض الوقت كاملاً أو توفير جلسة مجانية.'
    },
    {
      q: 'كيف تعمل خدمة الاستشارة الفورية (Instant Consultation)؟',
      a: 'عند اختيار الاستشارة الفورية، يبحث النظام عن أقرب طبيب أو معالج متاح على مدار الساعة ويتم ربطك بالجلسة خلال 15 دقيقة تقريباً. وفي حال تعذر ذلك يتم استرداد المبلغ تلقائياً فوراً.'
    },
    {
      q: 'هل تشترطون موافقة ولي الأمر لمسار الأطفال والمراهقين؟',
      a: 'نعم، التزاماً بالمعايير الأخلاقية والطبية، يُشترط إقرار ولي الأمر وموافقته لمسار الأطفال لمن هم دون 18 عاماً.'
    },
    {
      q: 'ما هي حدود كسر السرية الطبية؟',
      a: 'تقتصر حصرياً على حالتين نادرتين جداً: وجود خطة انتحار نشطة ووشيكة لحماية حياتك، أو وجود تهديد مباشر لحياة شخص آخر خصوصاً الأطفال. ما عدا ذلك، جميع ما يدور بالجلسات سر مقدس.'
    }
  ];

  return (
    <section id="faq-section" className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          الأسئلة الشائعة والأكثر تكراراً
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          كل ما تحتاج معرفته حول الجلسات، الخصوصية، الباقات، وضمانات الجودة
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-4.5 text-right font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-teal-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4.5 pb-4.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const PartnersSection: React.FC = () => {
  const partners = ['WHO Mental Health Network', 'UNICEF Support', 'Yemen Telemedicine Org', 'Arab Psychotherapy Alliance', 'Global Health Council'];
  return (
    <div className="py-6 border-y border-slate-200/80 dark:border-slate-800 text-center space-y-3">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        شراكات ومؤسسات موثوقة في رعاية الصحة النفسية
      </p>
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70">
        {partners.map((p, i) => (
          <span key={i} className="text-xs sm:text-sm font-black text-slate-500 dark:text-slate-400">
            {p}
          </span>
        ))}
      </div>
    </div>
  );
};

export const BlogSection: React.FC = () => {
  const articles = [
    {
      title: 'كيف تتعامل مع نوبة الهلع في 4 خطوات عملية؟',
      category: 'القلق والهلع',
      date: '28 سبتمبر 2026',
      readTime: '3 دقائق',
      snippet: 'دليلك الإكلينيكي المبسط للسيطرة على تسارع ضربات القلب والتفكير الكارثي أثناء نوبات الذعر المفاجئة.'
    },
    {
      title: 'محور الأمعاء-الدماغ: كيف يؤثر طعامك على مزاجك وسعادتك؟',
      category: 'تغذية نفسية',
      date: '24 سبتمبر 2026',
      readTime: '5 دقائق',
      snippet: 'اكتشف كيف يتحكم ميكروبيوم الأمعاء في 90% من إفراز هرمون السيروتونين المسؤول عن التوازن الانفعالي.'
    },
    {
      title: 'العلاج المعرفي السلوكي (CBT): لماذا يُعد المعيار الذهبي لعلاج الاكتئاب؟',
      category: 'العلاج النفسي',
      date: '20 سبتمبر 2026',
      readTime: '4 دقائق',
      snippet: 'فهم أسلوب إعادة هيكلة الأفكار التلقائية السلبية وبناء المرونة النفسية المستدامة.'
    }
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            المدونة والتثقيف النفسي المعتمد
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            مقالات إكلينيكية مبسطة يقدمها استشاريو وأخصائيو منصة كول مايند
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-teal-600 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                  {art.category}
                </span>
                <span className="text-slate-400">{art.readTime}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
                {art.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {art.snippet}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mt-4">
              <span>{art.date}</span>
              <span className="font-bold text-teal-600 hover:underline cursor-pointer">اقرأ المقال ←</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const WorkshopsSection: React.FC = () => {
  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-900 dark:to-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-teal-600 text-white text-[11px] font-black">
            ورش عمل تفاعلية 🎓
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-2">
            ورشة الدعم الجماعي: إدارة ضغوط العمل والتكيف في بلاد المهجر
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            جلسة تفاعلية مباشرة مع بروفيسور سيف الدين الميري ود. محمد عامر عبر Google Meet لتقديم استراتيجيات التكيف النفسي.
          </p>
        </div>

        <button
          onClick={() => alert('تم حجز مقعدك في ورشة العمل المجانية القادمة بنجاح!')}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shrink-0 shadow-md"
        >
          حجز مقعد مجاني الآن
        </button>
      </div>
    </section>
  );
};

export const B2BSection: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [employeesCount, setEmployeesCount] = useState('10-50');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-teal-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-teal-300" />
            <div>
              <h3 className="font-black text-base">برامج الرعاية المؤسسية والشركات (B2B)</h3>
              <p className="text-xs text-teal-100">برامج دعم الموظفين (EAP) والتغطية التأمينية النفسية</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-black text-base text-slate-900 dark:text-slate-100">تم استلام طلب التعاقد بنجاح</h4>
              <p className="text-xs text-slate-500">
                سيتواصل معك مستشار حلول الشركات لدى كول مايند لتفعيل باقات الرعاية لموظفيكم.
              </p>
              <button onClick={onClose} className="px-6 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl mt-2">
                إغلاق
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                وفر لموظفيك وأسرهم جلسات رعاية نفسية واستشارات متخصصة بسرية مطلقة مع تقارير أداء مؤسسية مجهولة الهوية.
              </p>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المؤسسة أو الشركة</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="مثال: شركة الاتصالات / المنظمة الدولية"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني المهني</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="hr@company.com"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">عدد الموظفين المستهدفين</label>
                <select
                  value={employeesCount}
                  onChange={e => setEmployeesCount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="1-20">1 - 20 موظف</option>
                  <option value="20-100">20 - 100 موظف</option>
                  <option value="100-500">100 - 500 موظف</option>
                  <option value="500+">أكثر من 500 موظف</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-md"
              >
                إرسال طلب العرض الترويجي والتعاقد
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const FooterSection: React.FC<{
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenEmergency: () => void;
  onOpenRefund: () => void;
  onOpenB2B: () => void;
}> = ({ onOpenPrivacy, onOpenTerms, onOpenEmergency, onOpenRefund, onOpenB2B }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity & About */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
                CM
              </div>
              <span className="text-lg font-black text-white">CoolMind كول مايند</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              المنظومة الرقمية الإكلينيكية الأولى للرعاية النفسية المتكاملة، استشارات الطب النفسي والعلاج السلوكي وتغذية الدماغ باليمن والمهجر.
            </p>
            <div className="text-xs text-teal-400 font-bold">
              📞 طوارئ: +967 770 112 233
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white">روابط سريعة</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#about-us" className="hover:text-teal-400 transition">من نحن ورؤيتنا</a></li>
              <li><a href="#packages-section" className="hover:text-teal-400 transition">الباقات والأسعار المعتمدة</a></li>
              <li><a href="#faq-section" className="hover:text-teal-400 transition">الأسئلة الشائعة</a></li>
              <li><button onClick={onOpenB2B} className="hover:text-teal-400 transition text-right">برامج الشركات والمؤسسات B2B</button></li>
            </ul>
          </div>

          {/* Col 3: Legal & Confidentiality */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white">السياسات والقانونية</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={onOpenPrivacy} className="hover:text-teal-400 transition text-right">سياسة الخصوصية وحماية البيانات</button></li>
              <li><button onClick={onOpenTerms} className="hover:text-teal-400 transition text-right">الشروط والأحكام العامة</button></li>
              <li><button onClick={onOpenRefund} className="hover:text-teal-400 transition text-right">سياسة الإلغاء والاسترداد المالي</button></li>
              <li><button onClick={onOpenEmergency} className="hover:text-teal-400 transition text-right text-amber-400">سياسة الطوارئ والخط الساخن</button></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white">النشرة النفسية الأسبوعية</h4>
            <p className="text-xs text-slate-400">انضم لأكثر من 15,000 قارئ لتصلك نصائح التعافي وإرشادات الصحة النفسية مجاناً.</p>
            {subscribed ? (
              <p className="text-xs text-emerald-400 font-bold">✨ شكراً لاشتراكك في نشرة كول مايند!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition"
                >
                  اشتراك الآن
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 CoolMind Clinic. جميع الحقوق محفوظة لمنصة كول مايند للطب النفسي والرعاية المتكاملة.</p>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>تشفير 256-Bit SSL</span>
            <span>متوافق مع معايير HIPAA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
