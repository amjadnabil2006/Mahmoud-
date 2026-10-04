import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  RefreshCw, 
  Cookie, 
  SlidersHorizontal,
  ChevronDown,
  Users2,
  Zap
} from 'lucide-react';

export type LegalModalType = 'privacy' | 'terms' | 'emergency' | 'refund' | 'group_therapy' | 'instant_consultation' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-3xl max-h-[88vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              {type === 'privacy' && <ShieldCheck className="w-5 h-5" />}
              {type === 'terms' && <FileText className="w-5 h-5" />}
              {type === 'emergency' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {type === 'refund' && <RefreshCw className="w-5 h-5" />}
              {type === 'group_therapy' && <Users2 className="w-5 h-5 text-purple-600" />}
              {type === 'instant_consultation' && <Zap className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                {type === 'privacy' && 'سياسة الخصوصية وحماية البيانات — Coolmind Center'}
                {type === 'terms' && 'الشروط والأحكام العامة للمنصة — Coolmind Center'}
                {type === 'emergency' && 'سياسة الطوارئ والتدخل في الأزمات النفسية'}
                {type === 'refund' && 'سياسة استرجاع الأموال وإلغاء الاشتراكات'}
                {type === 'group_therapy' && 'الشروط والأحكام الخاصة بجلسات العلاج الجماعي'}
                {type === 'instant_consultation' && 'سياسة وضوابط الجلسات الاستشارية الفورية'}
              </h3>
              <p className="text-xs text-slate-500">مستند تنظيمي لخدمات الرعاية النفسية والدعم السلوكي والاستشارات عن بُعد</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          
          {/* ======================================================== */}
          {/* 1. PRIVACY POLICY                                        */}
          {/* ======================================================== */}
          {type === 'privacy' && (
            <>
              <div className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl space-y-2">
                <h4 className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  خصوصيتك مهمة للغاية بالنسبة إلى Coolmind Center
                </h4>
                <p className="text-xs text-teal-800 dark:text-teal-300">
                  نولي اهتمامًا كبيرًا بحماية معلوماتك الشخصية والبيانات المتعلقة باستخدامك لمنصتنا وخدماتنا، ونعمل على تطبيق الإجراءات التنظيمية والتقنية المناسبة للمساعدة في حماية هذه المعلومات وفق أعلى معايير التشفير (HIPAA / End-to-End).
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">1. جمع المعلومات واستخدامها والإفصاح عنها</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  لتشغيل المنصة بصورة فعالة وتمكينك من استخدام خدمات الاستشارات والدعم النفسي، نقوم بجمع واستخدام وتخزين أنواع محددة من المعلومات:
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <li><strong>بيانات الزائر:</strong> الصفحات التي يزورها، مدة الاستخدام، الأخطاء التقنية، ومعلومات الجهاز وعنوان IP لتشغيل الخدمة وحمايتها.</li>
                  <li><strong>بيانات المعاملات:</strong> تفاصيل الدفع والاشتراك والتجديد دون تخزين أرقام البطاقات البنكية الكاملة.</li>
                  <li><strong>بيانات تسجيل الحساب:</strong> الاسم أو الاسم المستعار، البريد الإلكتروني، ورقم الهاتف.</li>
                  <li><strong>بيانات جلسات العلاج والاستشارات:</strong> بيانات إدارية كحجز الموعد ووقت الجلسة وحالة الحضور، مع تشفير وحماية السجلات الصحية الحساسة وفق أعلى المعايير المهنية.</li>
                  <li><strong>بيانات الأخصائيين والمعالجين:</strong> المؤهلات المهنية، التراخيص، وبيانات الاعتماد.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">2. حدود الاستثناء القانونية والمهنية لكسر السرية</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  لن نستخدم أو نكشف معلوماتك الشخصية إلا بموافقتك، باستثناء الحالات القانونية والمهنية الحصرية التالية لحماية الأرواح:
                </p>
                <ol className="text-xs text-slate-600 dark:text-slate-400 list-decimal list-inside space-y-1.5 bg-rose-50/60 dark:bg-rose-950/30 p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900">
                  <li>وجود خطر انتحار وشيك أو خطير يستدعي تدخلاً إسعافياً لحماية الحياة.</li>
                  <li>وجود تهديد جدي وصريح بإيذاء شخص آخر أو إساءة معاملة طفل أو شخص بالغ معرض للخطر.</li>
                  <li>وجود أمر قضائي أو التزام قانوني رسمي بالإفصاح.</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">3. ملفات تعريف الارتباط (Cookies) والأمان</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  تُستخدم ملفات تعريف الارتباط لحفظ تفضيلاتك وتسهيل تسجيل الدخول وحماية الحسابات. يمكنك إدارة ملفات تعريف الارتباط عبر إعدادات المتصفح في أي وقت.
                </p>
              </div>

              <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs space-y-1">
                <strong className="text-slate-900 dark:text-white block">قنوات التواصل بخصوص الخصوصية:</strong>
                <p className="text-slate-500">البريد الإلكتروني: support@coolmind.center · واتساب: +967 770 000 000</p>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* 2. TERMS & CONDITIONS                                    */}
          {/* ======================================================== */}
          {type === 'terms' && (
            <>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">1. الأخصائيون والمعالجون وخدماتهم</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  يقتصر دور المنصة على تنظيم وتمكين الوصول إلى الخدمات، بينما تقع المسؤولية المهنية عن الخدمة المقدمة على الأخصائي أو المعالج المختص ضمن حدود اختصاصه وتراخيصه. وتتيح المنصة تغيير الأخصائي متى ما رغب العميل في ذلك.
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-1 text-xs text-amber-900 dark:text-amber-200">
                <strong className="block font-bold">الحالات الطارئة والخطرة:</strong>
                <span>
                  المنصة ليست بديلاً عن غرف الطوارئ الإسعافية في المستشفيات. إذا كنت تفكر في الانتحار أو إيذاء النفس أو توجد حالة طبية طارئة، يجب التوجه فوراً لأقرب منشأة صحية أو الاتصال بخطوط الطوارئ المحلية.
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">2. إقرارات والتزامات المستخدم</h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>أن تكون قادراً قانونياً على الموافقة على تلقي الخدمات (أو بموافقة ولي الأمر لمن هم دون 18 عاماً).</li>
                  <li>تقديم بيانات صحيحة ومحدثة والحفاظ على سرية بيانات الدخول.</li>
                  <li>استخدام المنصة للأغراض المشروعة وعدم انتهاك القواعد الأخلاقية أو محاولة اختراق الأنظمة.</li>
                  <li>استخدام وسائل دفع يملك المستخدم صلاحية استخدامها.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">3. رسوم الجلسات والتعديلات والإنهاء</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  تخضع رسوم الجلسات للأسعار المعلنة وقت الحجز. ويحق للعميل إلغاء حسابه أو اشتراكه في أي وقت وفق سياسة الإلغاء المعلنة.
                </p>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* 3. GROUP THERAPY TERMS (10 RULES)                        */}
          {/* ======================================================== */}
          {type === 'group_therapy' && (
            <>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl space-y-2">
                <h4 className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-purple-600" />
                  ميثاق وقواعد المشاركة في جلسات العلاج النفسي والدعم الجماعي
                </h4>
                <p className="text-xs text-purple-800 dark:text-purple-300">
                  المشاركة في المجموعات تعني الالتزام الصارم بالقواعد العشر التالية لضمان بيئة آمنة وداعمة ومحترمة لجميع الأعضاء:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-purple-700 dark:text-purple-300 block mb-0.5">1. السرية والخصوصية التامة:</strong>
                  <span>السرية ركن أساسي. يُحظر تماماً مشاركة ما يدور داخل الجلسة مع أي طرف خارجي، وحماية هويات المشاركين.</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-purple-700 dark:text-purple-300 block mb-0.5">2. حظر التسجيل والتصوير الصارم:</strong>
                  <span>يُمنع منعاً باتاً تسجيل الصوت أو الفيديو أو أخذ لقطات شاشة، ويُعرّض المخالف للمساءلة القانونية والإلغاء الفوري.</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-purple-700 dark:text-purple-300 block mb-0.5">3. الاحترام المتبادل والسلوك اللائق:</strong>
                  <span>الامتناع عن أي سلوك عدواني أو تهكمي أو تحيز، واحترام كافة وجهات النظر والمشاعر.</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-purple-700 dark:text-purple-300 block mb-0.5">4. الغرض من الجلسات الجماعية:</strong>
                  <span>مساحة داعمة لمشاركة الخبرات، وليست بديلاً عن العلاج الفردي المكثف أو التدخلات الطبية الدوائية الطارئة.</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-purple-700 dark:text-purple-300 block mb-0.5">5. الالتزام بالوقت والانضمام المنتظم:</strong>
                  <span>الحضور في الوقت المحدد للحفاظ على استقرار وتماسك المجموعة وعدم تشتيت بقية الأعضاء.</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-purple-700 dark:text-purple-300 block mb-0.5">6. حرية مغادرة الجلسة أو الانسحاب:</strong>
                  <span>يحق للمشارك الانسحاب متى شعر بعدم الارتياح، وتخضع إعادة الانضمام لتقييم الأخصائي المشرف.</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-purple-700 dark:text-purple-300 block mb-0.5">7. إدارة وضبط الجلسة من الأخصائي:</strong>
                  <span>يتولى المعالج المشرف تنظيم الحوار وحماية البيئة العلاجية وله صلاحية إيقاف أي مشارك مخل بالقواعد.</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-purple-700 dark:text-purple-300 block mb-0.5">8. عدم تبادل معلومات الاتصال الشخصية:</strong>
                  <span>يُفضل عدم تبادل أرقام الهواتف أو الحسابات الشخصية بين المشاركين للحفاظ على حيادية وأمان المجموعة.</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-purple-700 dark:text-purple-300 block mb-0.5">9. الالتزام ببيئة آمنة وإيجابية:</strong>
                  <span>الامتناع عن التحريض أو إعطاء نصائح طبية غير متخصصة للأعضاء، والحفاظ على مساحة التعاطف الإنساني.</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-purple-700 dark:text-purple-300 block mb-0.5">10. الموافقة الكاملة على الشروط:</strong>
                  <span>الانضمام للمجموعة يُعد توقيعاً رقمياً ملزماً بقبول ومراعاة كافة البنود أعلاه.</span>
                </div>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* 4. INSTANT CONSULTATION POLICY                           */}
          {/* ======================================================== */}
          {type === 'instant_consultation' && (
            <>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-2">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  سياسة الجلسات الفورية والدعم اللحظي
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  الجلسة الفورية هي جلسة دعم نفسي قصيرة (~15 دقيقة) مع أخصائي مناوب، وليست بديلاً عن خطط العلاج الطويلة أو حالات الطوارئ الطبية الحرجة.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">1. مدة الانتظار التقديرية</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    الوقت المعروض لبدء الجلسة (مثال: ~15 دقيقة) هو وقت تقديري يعتمد على عدد الأخصائيين المناوبين وقائمة الانتظار اللحظية، وليس التزاماً زمنياً ثابتاً.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">2. سياسة الدفع والاسترداد الفوري</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    يتم دفع قيمة الجلسة قبل الدخول لقائمة الانتظار. ويستحق العميل استرداداً كاملاً إذا حدث خلل تقني منع بدء الجلسة أو تعذر توفر أخصائي مناوب خلال فترة انتظار غير منطقية.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">3. الإلغاء وعدم الحضور</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    مغادرة صفحة الانتظار بعد قبول الجلسة أو عدم الاستجابة لاتصال الأخصائي خلال فترة السماح يُعد عدم حضور ولا يتيح استرداد الرسوم.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* 5. REFUND POLICY                                         */}
          {/* ======================================================== */}
          {type === 'refund' && (
            <>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl space-y-1">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  سياسة واضحة وعادلة تحمي حقوقك كاملة
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  تخضع طلبات الاسترداد لضوابط واضحة تضمن حق العميل وحق الطبيب في حجز الوقت المخصص.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">حالات استحقاق الاسترداد المالي:</h4>
                <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
                  <li><strong>إلغاء الموعد قبل 24 ساعة:</strong> استرداد كامل للمبلغ بنسبة 100% إلى البطاقة أو تحويله كرصيد بالمحفظة.</li>
                  <li><strong>إلغاء الموعد قبل 12 ساعة:</strong> استرداد بنسبة 50% أو إعادة جدولة مجانية لمرة واحدة.</li>
                  <li><strong>إلغاء من جانب الأخصائي:</strong> استرداد كامل فوري أو إعادة حجز مع أخصائي بديل فوراً مع أولوية الموعد.</li>
                  <li><strong>خلل تقني من المنصة:</strong> تعويض فوري بجلسة بديلة أو استرداد كامل المبلغ.</li>
                  <li><strong>باقات الشهور المتعددة:</strong> استرداد نسبي للجلسات المتبقية غير المستخدمة وفق سياسة إلغاء الاشتراك.</li>
                </ul>

                <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  * تستغرق معالجة المبالغ المستردة من 3 إلى 7 أيام عمل بحسب مزود الدفع والبنك المصدر للبطاقة.
                </p>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* 6. EMERGENCY POLICY                                      */}
          {/* ======================================================== */}
          {type === 'emergency' && (
            <>
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl space-y-2">
                <h4 className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  تنبيه وإقرار طوارئ هام
                </h4>
                <p className="text-xs text-rose-800 dark:text-rose-300">
                  منصة كول مايند تقدم استشارات مجدولة وعلاجاً متواصلاً، وليست وحدة عناية إسعافية فورية للحالات الحرجة التي تهدد الحياة لحظياً.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">أرقام وخطوط الدعم والطوارئ المباشرة</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-200">🇾🇪 طوارئ اليمن والمهجر</p>
                    <p className="text-teal-600 font-mono font-bold mt-1 text-sm">+967-770112233 / 01-234567</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">خط المساعدة النفسية والتدخل السريع</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-200">🇸🇦 المملكة العربية السعودية</p>
                    <p className="text-teal-600 font-mono font-bold mt-1 text-sm">937 / 920033360</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">المركز الوطني لتعزيز الصحة النفسية</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-200">🌍 خط الطوارئ الدولي</p>
                    <p className="text-teal-600 font-mono font-bold mt-1 text-sm">Befrienders Worldwide / 988</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">دعم الأزمات المجاني في أكثر من 30 دولة</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-200">💬 واتساب الدعم الفوري</p>
                    <p className="text-emerald-600 font-mono font-bold mt-1 text-sm">+967 770 000 000</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">توجيه مباشر للحالات غير الإسعافية</p>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="text-[11px] text-slate-400">
            وثيقة تنظيمية معتمدة لـ Coolmind Center · 2026
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            فهمت وموافق
          </button>
        </div>

      </div>
    </div>
  );
};

export const CookieConsentBanner: React.FC = () => {
  const [accepted, setAccepted] = useState<boolean>(() => {
    return localStorage.getItem('cm_cookie_consent') === 'true';
  });

  if (accepted) return null;

  const handleAccept = () => {
    localStorage.setItem('cm_cookie_consent', 'true');
    setAccepted(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xl animate-fadeIn text-right" dir="rtl">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            ملفات تعريف الارتباط والخصوصية (Cookies)
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            نستخدم ملفات تعريف الارتباط الأساسية لضمان تسجيل الدخول الآمن وتشفير البيانات الطبية وفق سياسة الخصوصية المعتمدة لـ Coolmind.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
        >
          موافق وتفعيل
        </button>
      </div>
    </div>
  );
};

