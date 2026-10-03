import React from 'react';
import { 
  Zap, 
  User, 
  Users, 
  Baby, 
  Clock, 
  DollarSign, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { TherapyPathwayType } from '../types';

interface Props {
  onSelectPathway: (pathway: TherapyPathwayType) => void;
  onOpenInstantConsultation: () => void;
  currency?: 'USD' | 'YER' | 'SAR';
}

export const TherapyPathwaysSection: React.FC<Props> = ({
  onSelectPathway,
  onOpenInstantConsultation,
  currency = 'USD'
}) => {
  const pathways = [
    {
      id: 'instant' as TherapyPathwayType,
      titleAr: 'استشارة فورية (Instant Consultation)',
      badge: 'ربط مباشر خلال ~15 دقيقة ⚡',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      icon: Zap,
      iconBg: 'bg-amber-500 text-white',
      descAr: 'تحدث الآن مع أول معالج أو طبيب نفسي متاح على مدار الساعة للحالات العاجلة ونوبات القلق.',
      duration: '30 دقيقة',
      priceUSD: 39,
      priceYER: 11700,
      priceSAR: 146,
      actionText: 'احجز استشارة فورية الآن',
      isSpecial: true,
      onClick: onOpenInstantConsultation
    },
    {
      id: 'individual' as TherapyPathwayType,
      titleAr: 'علاج فردي للبالغين (18+)',
      badge: 'العلاج الأكثر شمولاً',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
      icon: User,
      iconBg: 'bg-teal-600 text-white',
      descAr: 'جلسات علاج نفسي معرفي سلوكي (CBT) واستشارات دوائية للتعامل مع الاكتئاب، القلق، الصدمات، والضغوط.',
      duration: '45 دقيقة (سلوكي) / 30 د (دوائي)',
      priceUSD: 39,
      priceYER: 11700,
      priceSAR: 146,
      actionText: 'ابدأ العلاج الفردي',
      isSpecial: false,
      onClick: () => onSelectPathway('individual')
    },
    {
      id: 'couples' as TherapyPathwayType,
      titleAr: 'علاج زوجي وأسري',
      badge: 'استقرار العلاقات والأسرة',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
      icon: Users,
      iconBg: 'bg-indigo-600 text-white',
      descAr: 'جلسات مشتركة لحل النزاعات الزوجية، تحسين التواصل، تجاوز الأزمات الأسرية وإعادة بناء الثقة والمودة.',
      duration: '60 دقيقة للجلسة المشتركة',
      priceUSD: 49,
      priceYER: 14700,
      priceSAR: 184,
      actionText: 'ابدأ الاستشارة الزوجية',
      isSpecial: false,
      onClick: () => onSelectPathway('couples')
    },
    {
      id: 'child' as TherapyPathwayType,
      titleAr: 'علاج أطفال ومراهقين',
      badge: 'بموافقة وإشراف ولي الأمر',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
      icon: Baby,
      iconBg: 'bg-rose-500 text-white',
      descAr: 'تعديل السلوك، علاج قلق الانفصال، فرط الحركة وتشتت الانتباه (ADHD)، وصعوبات التكيف المدرسي.',
      duration: '45 دقيقة مع توجيه الوالدين',
      priceUSD: 39,
      priceYER: 11700,
      priceSAR: 146,
      actionText: 'ابدأ مسار الأطفال',
      isSpecial: false,
      onClick: () => onSelectPathway('child')
    }
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-teal-600 rounded-full"></span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              مسارات وأنواع العلاج النفسي
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            اختر المسار الأنسب لاحتياجك — جلسات مرئية، صوتية، أو كتابية مع نخبة المختصين المعتمدين
          </p>
        </div>

        <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/40 px-3.5 py-1.5 rounded-full border border-teal-200/60 dark:border-teal-800/40">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold text-teal-800 dark:text-teal-200">
            ضمان التعيين الدقيق خلال 24 ساعة
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pathways.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`relative flex flex-col justify-between p-5 rounded-3xl transition duration-300 ${
                item.isSpecial
                  ? 'bg-gradient-to-b from-amber-500/10 via-white to-amber-500/5 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-400/70 dark:border-amber-600/50 shadow-lg shadow-amber-500/10 hover:shadow-xl'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1.5">
                  {item.titleAr}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[50px]">
                  {item.descAr}
                </p>

                <div className="my-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>المدة: <strong>{item.duration}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>سرية تامة ومشفرة بالكامل</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                  <span className="text-xs text-slate-500">التسعيرة المعتمدة:</span>
                  <div className="text-left">
                    <span className="text-base font-black text-slate-900 dark:text-slate-100">
                      {currency === 'YER' ? `${item.priceYER.toLocaleString()} ريال` : `$${item.priceUSD}`}
                    </span>
                    {currency !== 'YER' && (
                      <span className="text-[10px] text-slate-400 block font-mono">
                        (≈ {item.priceYER.toLocaleString()} YER)
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={item.onClick}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm ${
                    item.isSpecial
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  <span>{item.actionText}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
