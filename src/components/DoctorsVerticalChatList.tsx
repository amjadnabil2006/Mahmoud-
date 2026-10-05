import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Star, 
  Zap, 
  ChevronLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Stethoscope,
  Lock,
  UserCheck
} from 'lucide-react';
import { Doctor, ChatMessage, Patient } from '../types';

interface Props {
  doctors: Doctor[];
  messages: ChatMessage[];
  patient: Patient;
  onOpenDoctorChat: (doctor: Doctor) => void;
  onOpenEmergencyModal?: () => void;
}

export const DoctorsVerticalChatList: React.FC<Props> = ({
  doctors,
  messages,
  patient,
  onOpenDoctorChat,
  onOpenEmergencyModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = doctors.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      (d.title && d.title.toLowerCase().includes(q)) ||
      (d.bio && d.bio.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5 text-right">
      {/* Header with Search */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                الأطباء والاستشاريون المتاحون للمحادثة
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              انقر على أي طبيب لفتح نافذة المحادثة الفورية والآمنة مباشرة معه
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{doctors.length} استشاريين متصلين الآن</span>
            </span>
          </div>
        </div>

        {/* Quick Search */}
        <div className="mt-3.5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم الطبيب، التخصص (CBT، طب نفسي، صدمات، استشارات أسرية...)"
            className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 1. VERTICAL DOCTORS LIST (ترتيب الدكاترة طول مش عرض) */}
      <div className="space-y-3.5">
        {filteredDoctors.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            لا يوجد أطباء مطابقين لنتيجة البحث "{searchQuery}".
          </div>
        ) : (
          filteredDoctors.map(doc => {
            const docMessages = messages.filter(m => {
              const isPat = m.senderRole === 'patient' || m.senderId === patient.id;
              if (isPat) return m.doctorId === doc.id;
              return m.doctorId === doc.id || m.senderId === doc.id;
            });
            const hasChat = docMessages.length > 0;

            return (
              <div
                key={doc.id}
                onClick={() => onOpenDoctorChat(doc)}
                className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/70 dark:hover:border-teal-500/70 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group text-right"
              >
                {/* Doctor Avatar and Details */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-teal-500/25 group-hover:border-teal-600 transition shadow-xs"
                    />
                    <span 
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center shadow-xs"
                      title="متصل الآن ومتاح للاستشارة"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition truncate">
                        {doc.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                        {doc.specialty}
                      </span>
                      {hasChat ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                          {docMessages.length} رسائل سابقة
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                          محادثة جديدة ✨
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {doc.title || 'استشاري الطب النفسي والرعاية الإكلينيكية المتكاملة'}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap pt-0.5">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{doc.rating || 4.9}</span>
                        <span className="text-slate-400 font-normal">({doc.reviewsCount || 40}+ تقييم)</span>
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Zap className="w-3.5 h-3.5" />
                        <span>رد فوري ~10 دقائق</span>
                      </div>
                      <span>·</span>
                      <div className="text-slate-400">
                        خبرة {doc.experienceYears || 10}+ سنوات
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                        <Lock className="w-3 h-3" />
                        <span>مشفر HIPAA</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button: Clicking opens the chat window for that doctor */}
                <div className="shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="sm:hidden flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <Zap className="w-3 h-3" />
                    <span>متاح للمحادثة الآن</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDoctorChat(doc);
                    }}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 cursor-pointer shadow-xs group-hover:scale-102"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>بدء المحادثة</span>
                    <ChevronLeft className="w-4 h-4 rtl:rotate-0" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. SITE TEXT & INFORMATIONAL SECTION (كلام حق الموقع تحته) */}
      <div className="mt-8 space-y-4 text-right">
        {/* Security and Confidentiality Card */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl border border-teal-800/60 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">ضمانات الأمان والسرية الطبية التامة</h4>
              <p className="text-xs text-teal-200/80">حماية فائقة وخصوصية مشفرة 100% وفق أعلى المعايير الصحية العالمية</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            جميع المحادثات، الاستشارات الصوتية، ونتائج المقاييس السريرية مشفرة بتقنية 256-Bit SSL وتخضع لمعايير السرية الطبية HIPAA و GDPR. لا يمكن لأي طرف ثالث الاطلاع على سجل محادثاتك؛ الرسائل موجهة حصراً بينك وبين طبيبك المعالج المرخص.
          </p>
        </div>

        {/* How It Works & Clinic Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">اختر الطبيب المتخصص</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              تصفح قائمة الأطباء والاستشاريين بالأعلى، واختر المختص في مجالك (طب نفسي، علاج سلوكي معرفي CBT، صدمات، تغذية عصبية).
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">نافذة محادثة مستقلة</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              عند النقر على أي طبيب، تفتح لك نافذة محادثة مخصصة وجديدة تتيح لك كتابة الاستفسارات، إرسال تسجيلات صوتية، أو مشاركة مقاييسك.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">توجيه ومتابعة مستمرة</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              يقوم طبيبك بمراجعة ملاحظاتك وتقديم التوجيهات الطبية الإكلينيكية، ومتابعة الواجبات وتعديل الخطة العلاجية دورياً.
            </p>
          </div>
        </div>

        {/* Response Time & Official Licensing */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>جميع الأطباء في كول مايند مرخصون من الهيئات الصحية الرسمية ويخضعون لإشراف طبي دائم.</span>
          </div>
          <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-bold shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>خدمة المحادثات متاحة على مدار الساعة 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};
