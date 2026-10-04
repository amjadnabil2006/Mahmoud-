import React, { useState } from 'react';
import { 
  Users2, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  Video, 
  FileText, 
  Lock, 
  ArrowLeft,
  ChevronRight,
  Heart,
  HelpCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { GroupTherapyProgram } from '../types';
import { INITIAL_GROUP_PROGRAMS } from '../data/groupTherapyData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onJoinSuccess?: (programTitle: string, aliasName: string) => void;
}

export const GroupTherapyModal: React.FC<Props> = ({ isOpen, onClose, onJoinSuccess }) => {
  const [programs, setPrograms] = useState<GroupTherapyProgram[]>(INITIAL_GROUP_PROGRAMS);
  const [selectedProgram, setSelectedProgram] = useState<GroupTherapyProgram | null>(null);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);

  // Join form state
  const [aliasName, setAliasName] = useState<string>('');
  const [agreeRules, setAgreeRules] = useState<boolean>(false);
  const [agreeNoRecord, setAgreeNoRecord] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStartJoin = (prog: GroupTherapyProgram) => {
    setSelectedProgram(prog);
    setBookingStep(2);
    setAliasName('');
    setAgreeRules(false);
    setAgreeNoRecord(false);
    setIsSuccess(false);
  };

  const handleConfirmJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aliasName.trim() || !agreeRules || !agreeNoRecord || !selectedProgram) return;

    // Add participant with alias
    setPrograms(prev => prev.map(p => {
      if (p.id !== selectedProgram.id) return p;
      return {
        ...p,
        enrolledCount: p.enrolledCount + 1,
        participants: [
          ...p.participants,
          {
            id: 'gp-' + Date.now().toString(36),
            aliasName,
            joinedDate: new Date().toISOString().split('T')[0],
            attendanceCount: 0,
            paymentStatus: 'مدفوع',
            confidentialitySigned: true
          }
        ]
      };
    }));

    setBookingStep(3);
    setIsSuccess(true);
    if (onJoinSuccess) {
      onJoinSuccess(selectedProgram.titleAr, aliasName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/20 rounded-2xl">
              <Users2 className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">
                  جلسات العلاج النفسي الجماعي (Group Therapy Programs)
                </h3>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  سرية مشفرة بأسماء مستعارة
                </span>
              </div>
              <p className="text-xs text-purple-100 mt-0.5">
                تعلّم مهارات التعافي، وتشارك التجارب في بيئة آمنة وداعمة مع نخبة من الاستشاريين.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* STEP 1: BROWSE PROGRAMS */}
          {bookingStep === 1 && (
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-2xl border border-purple-200 dark:border-purple-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-purple-900 dark:text-purple-200 text-xs block">
                    ميثاق الأمان والسرية الجماعية المطلقة (Group Confidentiality)
                  </span>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300">
                    يحضر جميع المشاركين بأسماء مستعارة يختارونها بأنفسهم. يمنع منعاً باتاً تسجيل الصوت أو الفيديو أو كشف أي هوية خارج المجموعة وفق ميثاق أخلاقي ملزم.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {programs.map(prog => (
                  <div
                    key={prog.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full mb-1.5 inline-block">
                          {prog.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {prog.titleAr}
                        </h4>
                      </div>

                      <div className="text-left flex-shrink-0">
                        <span className="text-base font-black text-purple-600 dark:text-purple-400 block">
                          ${prog.priceUSD}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          ({prog.priceSAR} ر.س / {prog.priceYER.toLocaleString()} ر.ي)
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                      {prog.descriptionAr}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">المعالج الميسر:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{prog.leadDoctorName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">الموعد الأسبوعي:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{prog.scheduleText}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">المقاعد المتبقية:</span>
                        <span className="font-bold text-emerald-600">{prog.maxCapacity - prog.participants.length} من {prog.maxCapacity}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400 text-[10px]">
                        تبدأ المجموعة بتاريخ: {prog.startDate} ({prog.sessionsCount} جلسات)
                      </span>

                      <button
                        onClick={() => handleStartJoin(prog)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm text-xs transition-all flex items-center gap-1.5"
                      >
                        طلب الانضمام للمجموعة
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: ALIAS & CONFIDENTIALITY AGREEMENT */}
          {bookingStep === 2 && selectedProgram && (
            <form onSubmit={handleConfirmJoin} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-purple-600 font-bold block">خطوة التسجيل وتوقيع ميثاق السرية</span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {selectedProgram.titleAr}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingStep(1)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ← الرجوع للمجموعات
                </button>
              </div>

              {/* Alias input */}
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 space-y-2">
                <label className="font-bold text-purple-900 dark:text-purple-200 block">
                  اختر اسمك المستعار (Alias Name) داخل الجلسات:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أمل جديد، الصابر، نور الهدى، طائر الفينيق..."
                  value={aliasName}
                  onChange={e => setAliasName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-800 rounded-xl font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-[10px] text-purple-700 dark:text-purple-300">
                  هذا الاسم هو الوحيد الذي سيراه زملاؤك في المجموعة والمعالج خلال الجلسة لحماية هويتك.
                </p>
              </div>

              {/* Rules Agreement Checkboxes */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-100 block mb-1">
                  إقرار وميثاق السرية الجماعية (إلزامي):
                </span>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeRules}
                    onChange={e => setAgreeRules(e.target.checked)}
                    className="mt-1 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    أتعهد بالالتزام التام بالسرية المطلقة وعدم مشاركة أو إفشاء أي معلومات أو تجارب تُطرح داخل الجلسة خارج إطار المجموعة.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeNoRecord}
                    onChange={e => setAgreeNoRecord(e.target.checked)}
                    className="mt-1 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    أقر بعدم تسجيل الصوت أو التقاط الصور أو مقاطع الفيديو أثناء انعقاد الجلسة الجماعية تحت طائلة الحظر القانوني والإلغاء الفوري.
                  </span>
                </label>
              </div>

              {/* Payment Summary */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">رسوم البرنامج الكامل ({selectedProgram.sessionsCount} جلسات):</span>
                  <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                    {selectedProgram.priceSAR} ر.س / ${selectedProgram.priceUSD}
                  </span>
                </div>
                <div className="text-left text-[11px] text-emerald-600 font-bold">
                  ✓ ضمان استرداد كامل قبل بدء الجلسة الأولى
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingStep(1)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!aliasName.trim() || !agreeRules || !agreeNoRecord}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  تأكيد الانضمام والدفع الآمن
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS & MEET LINK */}
          {bookingStep === 3 && selectedProgram && (
            <div className="p-6 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                  تم تأكيد انضمامك للمجموعة بنجاح!
                </h4>
                <p className="text-slate-500 text-[11px]">
                  اسمك المستعار في الجلسات: <span className="font-bold text-purple-600">{aliasName}</span>
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-right space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">البرنامج:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{selectedProgram.titleAr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">المعالج:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedProgram.leadDoctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">الموعد:</span>
                  <span className="font-semibold text-purple-600">{selectedProgram.scheduleText}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm text-xs"
                >
                  العودة للرئيسية
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
