import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Trash2, 
  Pin, 
  PinOff, 
  Star, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Quote, 
  Sparkles, 
  Check, 
  Brain, 
  Clock,
  User
} from 'lucide-react';
import { ChatMessage } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
  onDelete: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onReact?: (id: string, emoji: string) => void;
  onSaveToJournal?: (id: string) => void;
  onQuoteReply?: (message: ChatMessage) => void;
  currentUserRole?: 'patient' | 'doctor' | 'admin';
  isOwnMessage?: boolean;
}

export const MessageActionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  message,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onReact,
  onSaveToJournal,
  onQuoteReply,
  currentUserRole = 'patient',
  isOwnMessage
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [savedJournal, setSavedJournal] = useState(false);
  const [showTermExplainer, setShowTermExplainer] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !message) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('ميزة القراءة الصوتية غير مدعومة في هذا المتصفح');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleJournal = () => {
    if (onSaveToJournal) {
      onSaveToJournal(message.id);
    }
    setSavedJournal(true);
    setTimeout(() => setSavedJournal(false), 2500);
  };

  const QUICK_REACTIONS = [
    { emoji: '❤️', label: 'دعم ومحبة' },
    { emoji: '👍', label: 'موافق / تم' },
    { emoji: '🙏', label: 'شكراً جزيلاً' },
    { emoji: '🧠', label: 'فهمت التوجيه' },
    { emoji: '💡', label: 'فكرة ملهمة' },
    { emoji: '🎯', label: 'سأطبق الخطة' },
    { emoji: '👏', label: 'إنجاز ممتاز' }
  ];

  // Clinical terms dictionary
  const MEDICAL_TERMS_GLOSSARY: Record<string, string> = {
    'cbt': 'العلاج المعرفي السلوكي (CBT): أسلوب علاجي يركز على تعديل أنماط التفكير السلبية والسلوكيات لتعزيز الصحة النفسية.',
    'معرفي': 'العلاج المعرفي: منهجية لتحديد الأفكار التلقائية وتفنيد التشوهات المعرفية.',
    'سلوكي': 'العلاج السلوكي: تدريبات عملية (مثل التعرض التدريجي والتنشيط السلوكي) لتجاوز المخاوف والانسحاب.',
    'نوم': 'نظافة النوم (Sleep Hygiene): ممارسات علمية لضبط الساعة البيولوجية وجودة النوم العميق.',
    'قلق': 'اضطراب القلق: استجابة مفرطة للتوتر، يتم علاجها بتمارين التنفس والتقبل وتفنيد الأفكار.',
    'اكتئاب': 'الاكتئاب: اضطراب مزاجي قابل للشفاء بالدمج بين العلاج النفسي الكلامي والدعم الدوائي إذا لزم.',
    'جرعة': 'الجرعة العلاجية: يتم تحديدها بدقة وفق البروتوكول الطبي للوصول لأفضل مفعول بأقل آثار جانبية.',
    'دواء': 'الخطة الدوائية: أدوية منظمة كيميائياً لإعادة توازن النواقل العصبية كالسيروتونين والدوبامين.',
    'مقياس': 'المقياس السيكومتري: أداة قياس دقيقة لتقييم حدة الأعراض وتتبع التحسن السريري أسبوعياً.',
    'phq': 'استبيان PHQ-9: المقياس الذهبي العالمي لفرز ومتابعة درجات الاكتئاب وتطور الاستجابة العلاجية.',
    'gad': 'مقياس GAD-7: استبيان عالمي معتمد لتقييم مستويات القلق العام ونوبات الهلع.'
  };

  const detectedTerms = Object.keys(MEDICAL_TERMS_GLOSSARY).filter(term => 
    message.text.toLowerCase().includes(term)
  );

  const isActuallyOwnMessage = isOwnMessage !== undefined 
    ? isOwnMessage 
    : (message.senderRole === 'patient' || (!message.senderName.includes('د.') && !message.senderName.includes('أ.')));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/65 backdrop-blur-md transition-opacity animate-fadeIn text-right"
      onClick={() => {
        if (isSpeaking) window.speechSynthesis.cancel();
        onClose();
      }}
    >
      {/* Bottom Sheet Modal Container */}
      <div 
        className="w-full sm:max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] border-t sm:border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden animate-slideUp max-h-[88vh] flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Grabber Handle for Modern Bottom Sheet */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-200/50 dark:border-teal-800/60">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">خيارات الرسالة</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">إجراءات سريرية ومشاركة متقدمة</p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => {
              if (isSpeaking) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Sheet Body */}
        <div className="overflow-y-auto px-5 py-3 space-y-3.5 scrollbar-thin">
          
          {/* Message Preview Bubble Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 relative">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{message.senderName}</span>
                {isActuallyOwnMessage ? (
                  <span className="text-[9px] px-1.5 py-0.2 bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 rounded font-medium">رسالتك</span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded font-medium">المعالج</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <Clock className="w-3 h-3" />
                <span>{message.timestamp ? new Date(message.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : 'الآن'}</span>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed max-h-28 overflow-y-auto font-normal">
              {message.text}
            </div>

            {/* Quick Emoji Reaction Pill Strip */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
              {QUICK_REACTIONS.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (onReact) onReact(message.id, r.emoji);
                    onClose();
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/80 border border-slate-200 dark:border-slate-700 text-base transition transform hover:scale-125 active:scale-95 shadow-2xs shrink-0 cursor-pointer"
                  title={r.label}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Action Options List */}
          <div className="space-y-1.5">
            
            {/* Copy Action */}
            <button
              type="button"
              onClick={handleCopy}
              className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-200/50 dark:border-teal-800/50 group-hover:scale-105 transition">
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{copied ? 'تم النسخ للحافظة!' : 'نسخ نص الرسالة'}</p>
                  <p className="text-[10px] text-slate-400 font-normal">حفظ النص في الحافظة للمشاركة</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 font-mono">Copy</span>
            </button>

            {/* Reply & Quote */}
            {onQuoteReply && (
              <button
                type="button"
                onClick={() => {
                  onQuoteReply(message);
                  onClose();
                }}
                className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50 group-hover:scale-105 transition">
                    <Quote className="w-4 h-4" />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-slate-100">اقتباس والرد في المحادثة</p>
                    <p className="text-[10px] text-slate-400 font-normal">الرد المباشر على هذه الرسالة بالتحديد</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 font-mono">Reply</span>
              </button>
            )}

            {/* Text-To-Speech Listen */}
            <button
              type="button"
              onClick={handleSpeak}
              className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/50 group-hover:scale-105 transition">
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{isSpeaking ? 'إيقاف القراءة الصوتية' : 'استماع للرسالة بصوت واضح (TTS)'}</p>
                  <p className="text-[10px] text-slate-400 font-normal">قراءة آلية دقيقة بالنطق العربي السليم</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-mono">Voice</span>
            </button>

            {/* Save to CBT Recovery Journal */}
            <button
              type="button"
              onClick={handleJournal}
              className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center border border-purple-200/50 dark:border-purple-800/50 group-hover:scale-105 transition">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{savedJournal ? 'تم الحفظ في مفكرة CBT!' : 'حفظ في مفكرة وسجل العلاج الذاتي CBT'}</p>
                  <p className="text-[10px] text-slate-400 font-normal">أرشفة الرسالة كفائدة علاجية في ملفك</p>
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">ميزة حصرية</span>
            </button>

            {/* Pin Message */}
            {onTogglePin && (
              <button
                type="button"
                onClick={() => {
                  onTogglePin(message.id);
                  onClose();
                }}
                className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 flex items-center justify-center border border-amber-200/50 dark:border-amber-800/50 group-hover:scale-105 transition">
                    {message.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{message.isPinned ? 'إلغاء تثبيت الرسالة' : 'تثبيت الرسالة في أعلى المحادثة'}</p>
                    <p className="text-[10px] text-slate-400 font-normal">إبقاء الرسالة مرئية في رأس شاشة المحادثة</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-600 font-mono">Pin</span>
              </button>
            )}

            {/* Star / Favorite */}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => {
                  onToggleFavorite(message.id);
                  onClose();
                }}
                className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 flex items-center justify-center border border-amber-200/50 dark:border-amber-800/50 group-hover:scale-105 transition">
                    <Star className={`w-4 h-4 ${message.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{message.isFavorite ? 'إزالة من التوجيهات المفضلة' : 'تمييز كتوجيه إكلينيكي هام ⭐'}</p>
                    <p className="text-[10px] text-slate-400 font-normal">إضافة إلى قائمة التوجيهات المفضلة</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-600 font-mono">Star</span>
              </button>
            )}

            {/* Clinical Term Explainer (if terms found) */}
            {detectedTerms.length > 0 && (
              <div className="p-3 bg-teal-50/80 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-teal-600" />
                    <span>توضيح المصطلحات النفسية بالرسالة:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTermExplainer(!showTermExplainer)}
                    className="text-[10px] text-teal-700 dark:text-teal-300 font-bold underline cursor-pointer"
                  >
                    {showTermExplainer ? 'إخفاء' : 'عرض الشرح'}
                  </button>
                </div>

                {showTermExplainer && (
                  <div className="space-y-1.5 pt-1 text-[11px] text-teal-950 dark:text-teal-100">
                    {detectedTerms.map((t, idx) => (
                      <div key={idx} className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-teal-100 dark:border-teal-900/60 leading-relaxed shadow-2xs">
                        {MEDICAL_TERMS_GLOSSARY[t]}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Delete Message Option (Strictly restricted to own messages only) */}
            {isActuallyOwnMessage && (
              <div className="pt-1">
                {confirmDelete ? (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center justify-between gap-2 shadow-xs">
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-200">تأكيد حذف الرسالة نهائياً؟</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-300 transition"
                      >
                        تراجع
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(message.id);
                          onClose();
                        }}
                        className="px-3.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer transition shadow-xs"
                      >
                        نعم، حذف
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="w-full p-2.5 rounded-2xl bg-rose-50/50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-300 transition cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center border border-rose-200/50 dark:border-rose-800/50 group-hover:scale-105 transition">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-rose-700 dark:text-rose-300">حذف هذه الرسالة</p>
                        <p className="text-[10px] text-rose-500/80 font-normal">إزالة الرسالة من سجل المحادثة نهائياً</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-mono">Delete</span>
                  </button>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
