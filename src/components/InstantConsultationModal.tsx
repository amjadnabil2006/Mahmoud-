import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  X, 
  Clock, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Video, 
  ExternalLink,
  PhoneCall,
  AlertTriangle
} from 'lucide-react';
import { Doctor, Appointment, Patient } from '../types';
import { OFFICIAL_DOCTORS_TEAM } from '../data/packagesAndCoupons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activePatient: Patient;
  onCompleteBooking: (appointment: Omit<Appointment, 'id'>) => void;
  onOpenInstantPolicy?: () => void;
}

export const InstantConsultationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activePatient,
  onCompleteBooking,
  onOpenInstantPolicy
}) => {
  const [stage, setStage] = useState<'details' | 'matching' | 'ready'>('details');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(OFFICIAL_DOCTORS_TEAM[0]);
  const [matchCountdown, setMatchCountdown] = useState(15);
  const [meetUrl, setMeetUrl] = useState('');
  const [agreeInstantTerms, setAgreeInstantTerms] = useState<boolean>(true);

  useEffect(() => {
    let timer: any = null;
    if (stage === 'matching') {
      timer = setInterval(() => {
        setMatchCountdown(prev => {
          if (prev <= 1) {
            // Match found!
            const assigned = OFFICIAL_DOCTORS_TEAM[Math.floor(Math.random() * OFFICIAL_DOCTORS_TEAM.length)];
            setSelectedDoctor(assigned);
            const url = `https://meet.google.com/cm-instant-${Math.floor(100 + Math.random() * 900)}`;
            setMeetUrl(url);

            const newApt: Omit<Appointment, 'id'> = {
              patientId: activePatient.id,
              patientName: activePatient.name || 'عميل كول مايند',
              doctorId: assigned.id,
              doctorName: assigned.name,
              departmentName: 'قسم الاستشارات الفورية والتدخل العاجل',
              date: new Date().toISOString().split('T')[0],
              time: 'الآن (فوري)',
              type: 'جلسة عن بُعد (فيديو)',
              status: 'مؤكد',
              sessionGoal: 'استشارة فورية عاجلة ودعم نفسي مباشر',
              meetUrl: url,
              paymentStatus: 'مدفوع بالكامل',
              paymentMethod: 'PayPal',
              amountSAR: 146,
              transactionId: `TXN-INSTANT-${Date.now().toString().slice(-6)}`,
              notes: 'جلسة استشارة فورية 30 دقيقة.'
            };
            onCompleteBooking(newApt);
            setStage('ready');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stage, activePatient, onCompleteBooking]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base">الاستشارة الفورية (Instant Consultation)</h3>
              <p className="text-[11px] text-slate-900/80 font-bold">تحدث مع أول طبيب أو معالج متاح خلال ~15 دقيقة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-950 hover:bg-slate-950/10 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {stage === 'details' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 dark:text-amber-200">المدة والتسعيرة المعتمدة:</span>
                  <span className="text-base font-black text-slate-900 dark:text-slate-100 font-mono">$39.97 (11,700 YER)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  جلسة استشارية عاجلة ومباشرة مدتها <strong>30 دقيقة</strong> للتعامل مع نوبات القلق والضغوط الحادة وإرشادك للخطوات الطبية التالية.
                </p>
              </div>

              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>ربط وتعيين فوري بأول مختص مناوب في المنصة.</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-teal-600 shrink-0" />
                  <span><strong>استرداد كامل 100%:</strong> في حال تعذر توفر مختص مناوب أو حدوث خلل تقني يتم إلغاء الدفع واسترجاع المبلغ فوراً.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>جلسة مرئية أو صوتية مشفرة بالكامل بدون تسجيل لحفظ الخصوصية.</span>
                </div>
              </div>

              <label className="flex items-start gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeInstantTerms}
                  onChange={(e) => setAgreeInstantTerms(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 mt-0.5"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  أقر بأن وقت الانتظار تقديري، وأن الجلسة الفورية مخصصة للدعم اللحظي وليست بديلاً عن الطوارئ الطبية الإسعافية في المستشفيات.
                </span>
              </label>

              <button
                disabled={!agreeInstantTerms}
                onClick={() => setStage('matching')}
                className={`w-full py-3.5 font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                  agreeInstantTerms
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>دفع $39.97 والبحث عن معالج متاح الآن</span>
              </button>
            </div>
          )}

          {stage === 'matching' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900 dark:text-slate-100">
                  جاري فحص جدول الأطباء المناوبين وتعيين جلستك...
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  نبحث عن أفضل مختص متاح للتحدث معك فوراً
                </p>
              </div>
              <div className="text-2xl font-mono font-black text-amber-600">
                00:{matchCountdown < 10 ? `0${matchCountdown}` : matchCountdown}
              </div>
            </div>
          )}

          {stage === 'ready' && (
            <div className="text-center py-4 space-y-5 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="w-7 h-7 font-black" />
              </div>
              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  تم تعيين طبيبك المتاح بنجاح!
                </span>
                <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-2">
                  المختص المتاح الآن: {selectedDoctor.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedDoctor.title} · لهجة: {selectedDoctor.dialect}
                </p>
              </div>

              <div className="p-4 bg-teal-50 dark:bg-teal-950/50 rounded-2xl border border-teal-200 dark:border-teal-800 space-y-2">
                <p className="text-xs font-bold text-teal-900 dark:text-teal-200">غرفة الاستشارة جاهزة للدخول فوراً:</p>
                <a
                  href={meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  <Video className="w-4 h-4" />
                  <span>انضم إلى الجلسة المباشرة الآن</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
