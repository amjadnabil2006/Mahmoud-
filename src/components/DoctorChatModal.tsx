import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Paperclip, 
  Mic, 
  MicOff,
  Video, 
  ShieldCheck, 
  Clock, 
  Check, 
  CheckCheck, 
  Smile, 
  Sparkles, 
  Calendar, 
  AlertCircle,
  Maximize2,
  Minimize2,
  Lock,
  Play,
  Pause,
  FileText,
  Activity,
  Pill,
  Trash2,
  Volume2,
  ChevronRight,
  Info,
  MoreHorizontal,
  Pin,
  PinOff,
  Star,
  Quote,
  Copy,
  BookOpen,
  Brain,
  PhoneCall
} from 'lucide-react';
import { Doctor, Patient, ChatMessage } from '../types';
import { MessageActionModal } from './MessageActionModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  patient: Patient;
  messages: ChatMessage[];
  onSendMessage: (text: string, doctorId: string, extra?: Partial<ChatMessage>) => void;
  onDeleteMessage?: (id: string) => void;
  onTogglePinMessage?: (id: string) => void;
  onToggleFavoriteMessage?: (id: string) => void;
  onReactToMessage?: (id: string, emoji: string) => void;
  onSaveToJournal?: (id: string) => void;
  onBookAppointment?: (doctorId: string) => void;
  onOpenEmergencyModal?: () => void;
}

export const DoctorChatModal: React.FC<Props> = ({
  isOpen,
  onClose,
  doctor,
  patient,
  messages,
  onSendMessage,
  onDeleteMessage,
  onTogglePinMessage,
  onToggleFavoriteMessage,
  onReactToMessage,
  onSaveToJournal,
  onBookAppointment,
  onOpenEmergencyModal
}) => {
  const [inputText, setInputText] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showQuickTips, setShowQuickTips] = useState(true);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [activeActionMessage, setActiveActionMessage] = useState<ChatMessage | null>(null);
  const [quotedMessage, setQuotedMessage] = useState<ChatMessage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Real Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<Record<string, number>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<any>(null);
  const audioPlaybackIntervalRef = useRef<any>(null);
  
  // Real MediaRecorder references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);

  // Quick suggestions with clinical categories and compact labels
  const QUICK_PROMPTS = [
    { cat: 'واجب', label: 'الواجب السلوكي 📝', icon: '📝', text: 'مرحباً دكتور، أود الاستفسار عن الواجب السلوكي للأسبوع الحالي.' },
    { cat: 'تحسن', label: 'جودة النوم ✨', icon: '✨', text: 'أشعر بتحسن ملحوظ في جودة النوم وأود إعلامك بذلك.' },
    { cat: 'توتر', label: 'نوبة التوتر 🧘', icon: '🧘', text: 'هل هناك توصيات إضافية للتعامل مع نوبات التوتر المفاجئة؟' },
    { cat: 'مقياس', label: 'فحص مقياسي 📊', icon: '📊', text: 'أود مراجعة ومناقشة نتائج اختباري النفسي الأخير معك.' },
    { cat: 'دواء', label: 'موعد الجرعة 💊', icon: '💊', text: 'هل يمكن تقديم موعد الجرعة لتفادي الشعور بالخمول؟' }
  ];

  // Clinical Scales Options for attachment
  const SCALES_OPTIONS = [
    { id: 'phq-9', name: 'مقياس الاكتئاب (PHQ-9)', score: '6 / 27 (اكتئاب خفيف - تحسن ملحوظ)' },
    { id: 'gad-7', name: 'مقياس القلق العام (GAD-7)', score: '8 / 21 (قلق خفيف إلى متوسط)' },
    { id: 'isi-sleep', name: 'مؤشر شدة الأرق (ISI)', score: '4 / 28 (نوم مستقر وطبيعي)' }
  ];

  // Filter messages strictly between this patient and this doctor
  const conversationMessages = messages.filter(m => {
    if (!doctor) return false;
    const isPat = m.senderRole === 'patient' || m.senderId === patient.id;
    if (isPat) {
      return m.doctorId === doctor.id;
    }
    return m.doctorId === doctor.id || m.senderId === doctor.id;
  });

  const pinnedMessage = conversationMessages.find(m => m.isPinned);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationMessages.length, isOpen, isRecording]);

  // Toast notification helper
  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Audio Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Clean up playback and streams on unmount
  useEffect(() => {
    return () => {
      if (audioPlaybackIntervalRef.current) clearInterval(audioPlaybackIntervalRef.current);
      if (currentAudioElementRef.current) {
        currentAudioElementRef.current.pause();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  if (!isOpen || !doctor) return null;

  // Real Microphone start with wide codec fallback
  const handleStartRecording = async () => {
    setAudioError(null);
    setIsAttachmentMenuOpen(false);
    audioChunksRef.current = [];

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        mediaStreamRef.current = stream;

        // Choose best supported audio MIME type
        let selectedMimeType = '';
        if (typeof MediaRecorder !== 'undefined') {
          const supportedTypes = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4',
            'audio/aac',
            'audio/ogg;codecs=opus',
            'audio/ogg'
          ];
          for (const type of supportedTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
              selectedMimeType = type;
              break;
            }
          }
        }

        const options = selectedMimeType ? { mimeType: selectedMimeType } : undefined;
        const recorder = options ? new MediaRecorder(stream, options) : new MediaRecorder(stream);
        
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.start(200);
        setIsRecording(true);
      } else {
        setAudioError('متصفحك لا يدعم تسجيل الصوت المباشر.');
        setIsRecording(true);
      }
    } catch (err: any) {
      console.warn('Microphone error / permission denied:', err);
      setAudioError('يرجى السماح بصلاحية الميكروفون في المتصفح لتسجيل صوتك.');
      setIsRecording(true);
    }
  };

  const handleCancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingSeconds(0);
    setAudioError(null);
  };

  const handleSendVoiceNote = () => {
    const finalDuration = Math.max(1, recordingSeconds);
    const durationFormatted = `${Math.floor(finalDuration / 60)}:${(finalDuration % 60).toString().padStart(2, '0')}`;
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = () => {
        let audioBlobUrl = '';
        if (audioChunksRef.current.length > 0) {
          const mimeType = recorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          audioBlobUrl = URL.createObjectURL(audioBlob);
        }

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(t => t.stop());
          mediaStreamRef.current = null;
        }

        onSendMessage(
          `🎙️ تسجيل صوتي (${durationFormatted})`,
          doctor.id,
          {
            audioUrl: audioBlobUrl || 'voice-note',
            audioDurationSeconds: finalDuration,
            replyTo: quotedMessage ? { id: quotedMessage.id, text: quotedMessage.text, senderName: quotedMessage.senderName } : undefined
          }
        );
        setQuotedMessage(null);
      };

      try {
        recorder.requestData();
        recorder.stop();
      } catch (e) {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(t => t.stop());
          mediaStreamRef.current = null;
        }
        onSendMessage(`🎙️ تسجيل صوتي (${durationFormatted})`, doctor.id, {
          audioUrl: 'voice-note',
          audioDurationSeconds: finalDuration,
          replyTo: quotedMessage ? { id: quotedMessage.id, text: quotedMessage.text, senderName: quotedMessage.senderName } : undefined
        });
        setQuotedMessage(null);
      }
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      onSendMessage(
        `🎙️ تسجيل صوتي (${durationFormatted})`,
        doctor.id,
        {
          audioUrl: 'voice-note',
          audioDurationSeconds: finalDuration,
          replyTo: quotedMessage ? { id: quotedMessage.id, text: quotedMessage.text, senderName: quotedMessage.senderName } : undefined
        }
      );
      setQuotedMessage(null);
    }

    setIsRecording(false);
    setRecordingSeconds(0);
    setAudioError(null);
  };

  // Play audio (actual recorded blob or synthesized wave)
  const handleTogglePlayAudio = (msgId: string, audioUrl?: string, totalDuration: number = 6) => {
    if (playingAudioId === msgId) {
      if (currentAudioElementRef.current) {
        currentAudioElementRef.current.pause();
      }
      if (audioPlaybackIntervalRef.current) clearInterval(audioPlaybackIntervalRef.current);
      setPlayingAudioId(null);
      return;
    }

    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
    }
    if (audioPlaybackIntervalRef.current) clearInterval(audioPlaybackIntervalRef.current);

    setPlayingAudioId(msgId);
    setPlaybackProgress(prev => ({ ...prev, [msgId]: 0 }));

    if (audioUrl && audioUrl.startsWith('blob:')) {
      const audio = new Audio(audioUrl);
      currentAudioElementRef.current = audio;

      audio.play().catch(e => {
        console.warn('Direct audio play notice:', e);
      });

      audio.ontimeupdate = () => {
        if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
          const prog = Math.min(100, Math.round((audio.currentTime / audio.duration) * 100));
          setPlaybackProgress(prev => ({ ...prev, [msgId]: prog }));
        }
      };

      audio.onended = () => {
        setPlayingAudioId(null);
        setPlaybackProgress(prev => ({ ...prev, [msgId]: 100 }));
      };

      audio.onerror = () => {
        setPlayingAudioId(null);
      };
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        }
      } catch (e) {}

      const stepMs = 200;
      const totalMs = totalDuration * 1000;
      let elapsedMs = 0;

      audioPlaybackIntervalRef.current = setInterval(() => {
        elapsedMs += stepMs;
        const progress = Math.min(100, Math.round((elapsedMs / totalMs) * 100));
        setPlaybackProgress(prev => ({ ...prev, [msgId]: progress }));

        if (elapsedMs >= totalMs) {
          clearInterval(audioPlaybackIntervalRef.current);
          setPlayingAudioId(null);
          setPlaybackProgress(prev => ({ ...prev, [msgId]: 100 }));
        }
      }, stepMs);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    onSendMessage(inputText.trim(), doctor.id, {
      replyTo: quotedMessage ? { id: quotedMessage.id, text: quotedMessage.text, senderName: quotedMessage.senderName } : undefined
    });

    setInputText('');
    setQuotedMessage(null);
    setIsAttachmentMenuOpen(false);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputText(promptText);
  };

  // Handle File Attachment from disk
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const fileSizeKb = Math.round(file.size / 1024);

    onSendMessage(
      isImage ? `📷 تم إرفاق صورة: ${file.name}` : `📎 تم إرفاق ملف طبي: ${file.name} (${fileSizeKb} KB)`,
      doctor.id,
      {
        attachmentType: isImage ? 'image' : 'file',
        attachmentName: file.name,
        replyTo: quotedMessage ? { id: quotedMessage.id, text: quotedMessage.text, senderName: quotedMessage.senderName } : undefined
      }
    );

    setQuotedMessage(null);
    setIsAttachmentMenuOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle clinical scale share
  const handleShareScale = (scale: typeof SCALES_OPTIONS[0]) => {
    onSendMessage(
      `📊 مشاركة نتيجة تقييم نفسي: ${scale.name} - النتيجة: ${scale.score}`,
      doctor.id,
      {
        attachmentType: 'scale_result',
        attachmentName: scale.name,
        attachmentData: { score: scale.score }
      }
    );
    setIsAttachmentMenuOpen(false);
  };

  // Handle CBT record share
  const handleShareCBT = () => {
    onSendMessage(
      `📝 مشاركة سجل أفكار معرفي (CBT): الموقف: ضغط بالعمل | الفكرة التلقائية: لن أتمكن من الإنجاز | الدليل المعاكس: أنجزت مهام مماثلة سابقاً بنجاح.`,
      doctor.id,
      {
        attachmentType: 'cbt_homework',
        attachmentName: 'سجل تفنيد الأفكار CBT'
      }
    );
    setIsAttachmentMenuOpen(false);
  };

  // Handle Med Query share
  const handleShareMedQuery = () => {
    onSendMessage(
      `💊 استفسار عن الخطة الدوائية: هل يمكن تناول الدواء بعد وجبة الغداء بدلاً من الصباح لتجنب النعاس الخفيف؟`,
      doctor.id,
      {
        attachmentType: 'medication_query',
        attachmentName: 'استفسار دوائي'
      }
    );
    setIsAttachmentMenuOpen(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*,.pdf,.doc,.docx,.png,.jpg,.jpeg" 
        className="hidden" 
      />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-slate-900/90 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Advanced Message Action Modal */}
      <MessageActionModal
        isOpen={!!activeActionMessage}
        onClose={() => setActiveActionMessage(null)}
        message={activeActionMessage}
        onDelete={(id) => {
          if (onDeleteMessage) onDeleteMessage(id);
          showToast('تم حذف الرسالة بنجاح');
        }}
        onTogglePin={(id) => {
          if (onTogglePinMessage) onTogglePinMessage(id);
          showToast('تم تحديث تثبيت الرسالة');
        }}
        onToggleFavorite={(id) => {
          if (onToggleFavoriteMessage) onToggleFavoriteMessage(id);
          showToast('تم تحديث المفضلة السريرية');
        }}
        onReact={(id, emoji) => {
          if (onReactToMessage) onReactToMessage(id, emoji);
          showToast(`تم التفاعل: ${emoji}`);
        }}
        onSaveToJournal={(id) => {
          if (onSaveToJournal) onSaveToJournal(id);
          showToast('تم الحفظ في مفكرة وسجل العلاج CBT!');
        }}
        onQuoteReply={(msg) => {
          setQuotedMessage(msg);
          showToast('تم إدراج الاقتباس في الرد');
        }}
      />

      <div 
        className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-right transition-all duration-200 ${
          isFullScreen 
            ? 'w-full h-full rounded-none sm:rounded-3xl max-w-none' 
            : 'w-full max-w-3xl h-[85vh] max-h-[750px]'
        }`}
      >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white flex items-center justify-between gap-3 shadow-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img 
                src={doctor.avatar} 
                alt={doctor.name} 
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover border-2 border-teal-400/50 shadow-sm"
              />
              <span 
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" 
                title="متصل الآن"
              />
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-white truncate">{doctor.name}</h3>
                <span className="px-2 py-0.5 bg-teal-500/20 text-teal-200 text-[10px] font-bold rounded-full border border-teal-400/30">
                  {doctor.specialty || 'مستشار نفسي معتمد'}
                </span>
              </div>
              <p className="text-[11px] text-teal-200/80 truncate mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>متاح للمحادثة والرد الإكلينيكي</span>
                <span>·</span>
                <span className="text-teal-300 font-bold">🔒 تشفير طبي 256-bit</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onBookAppointment && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookAppointment(doctor.id);
                }}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                title="حجز موعد جلسة مرئية كاملة"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>حجز جلسة</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              title={isFullScreen ? 'تصغير' : 'ملء الشاشة'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pinned Message Sticky Banner if exists */}
        {pinnedMessage && (
          <div className="px-4 py-2 bg-amber-50/90 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-800/80 flex items-center justify-between gap-3 text-xs shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2 min-w-0">
              <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <div className="min-w-0 truncate">
                <span className="font-bold text-amber-900 dark:text-amber-200 ml-1">رسالة مثبتة:</span>
                <span className="text-slate-700 dark:text-slate-300 text-[11px] truncate">{pinnedMessage.text}</span>
              </div>
            </div>
            {onTogglePinMessage && (
              <button
                type="button"
                onClick={() => onTogglePinMessage(pinnedMessage.id)}
                className="text-[10px] text-amber-800 dark:text-amber-300 hover:underline shrink-0 cursor-pointer font-bold"
              >
                إلغاء التثبيت
              </button>
            )}
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-slate-50/60 dark:bg-slate-900/60">
          {/* Welcome Message & Doctor Intro */}
          <div className="mx-auto max-w-md p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-xs space-y-1.5">
            <div className="w-9 h-9 mx-auto rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
            </div>
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
              محادثة مباشرة مع {doctor.name}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              هذه المحادثة مشفرة طبياً بينك وبين المختص فقط. انقر على أي رسالة للخيارات المتقدمة.
            </p>
          </div>

          {conversationMessages.length === 0 ? (
            <div className="text-center py-8 px-4 text-slate-400 text-xs space-y-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto shadow-2xs animate-fadeIn">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  محادثة جديدة مع {doctor.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  أهلاً بك! لم تبدأ محادثة سابقة مع هذا الطبيب بعد. يمكنك كتابة استفسارك أو إرسال تسجيل صوتي للبدء فوراً.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setInputText(`مرحباً دكتور ${doctor.name.split(' ')[1] || doctor.name}، أود استشارتك.`)}
                  className="text-[11px] px-3 py-1 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 rounded-xl hover:bg-teal-100 border border-teal-200 dark:border-teal-800 cursor-pointer font-medium"
                >
                  👋 مرحباً دكتور، أود استشارتك
                </button>
              </div>
            </div>
          ) : (
            conversationMessages.map((msg, idx) => {
              const isPatient = msg.senderRole === 'patient' || msg.senderId === patient.id;
              const isVoice = msg.audioUrl || msg.text.includes('🎙️') || msg.text.includes('تسجيل صوتي');
              const isAttachment = msg.attachmentType || msg.text.includes('📎') || msg.text.includes('📊') || msg.text.includes('📷');
              const isPlaying = playingAudioId === (msg.id || String(idx));
              const progress = playbackProgress[msg.id || String(idx)] || 0;

              return (
                <div
                  key={msg.id || idx}
                  className={`flex flex-col group ${isPatient ? 'items-end' : 'items-start'} animate-fadeIn`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                    <span className="font-bold">{isPatient ? 'أنت' : msg.senderName || doctor.name}</span>
                    <span>·</span>
                    <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : 'الآن'}</span>
                    {msg.isPinned && <span title="رسالة مثبتة"><Pin className="w-3 h-3 text-amber-500 fill-amber-400" /></span>}
                    {msg.isFavorite && <span title="مفضلة سريرية"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /></span>}
                    {msg.savedToJournal && <span title="محفوظة في مفكرة CBT"><BookOpen className="w-3 h-3 text-purple-400" /></span>}
                  </div>

                  <div className="relative max-w-[90%] sm:max-w-md">
                    {/* Hover Quick Action Buttons */}
                    <div className={`absolute -top-7 ${isPatient ? 'left-0' : 'right-0'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 dark:bg-slate-800/95 shadow-md border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-full text-slate-600 dark:text-slate-300 z-10 backdrop-blur-xs`}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionMessage(msg);
                        }}
                        className="p-1 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition cursor-pointer"
                        title="خيارات الرسالة (حذف، نسخ، شرح، مفكرة...)"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuotedMessage(msg);
                          showToast('تم تحديد الرسالة للاقتباس والرد');
                        }}
                        className="p-1 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition cursor-pointer"
                        title="اقتباس ورد"
                      >
                        <Quote className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(msg.text);
                          showToast('تم نسخ النص');
                        }}
                        className="p-1 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition cursor-pointer"
                        title="نسخ سريع"
                      >
                        <Copy className="w-3 h-3" />
                      </button>

                      {onReactToMessage && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReactToMessage(msg.id, '❤️');
                            showToast('❤️ تم التفاعل');
                          }}
                          className="p-1 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition cursor-pointer text-xs"
                          title="تفاعل سريع"
                        >
                          ❤️
                        </button>
                      )}
                    </div>

                    {/* Message Card Bubble */}
                    <div
                      onClick={() => setActiveActionMessage(msg)}
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs cursor-pointer transition transform active:scale-98 select-text ${
                        isPatient
                          ? 'bg-teal-600 text-white rounded-br-xs hover:bg-teal-700'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs hover:border-teal-400'
                      }`}
                      title="انقر لإظهار خيارات الرسالة السريرية"
                    >
                      {/* Quoted Message Reference if replied */}
                      {msg.replyTo && (
                        <div className={`mb-2 p-2 rounded-xl text-[11px] border-r-4 ${
                          isPatient 
                            ? 'bg-teal-700/70 border-teal-300 text-teal-100' 
                            : 'bg-slate-100 dark:bg-slate-700/60 border-teal-500 text-slate-600 dark:text-slate-300'
                        }`}>
                          <span className="font-bold block text-[10px] opacity-90">{msg.replyTo.senderName}</span>
                          <span className="line-clamp-2">{msg.replyTo.text}</span>
                        </div>
                      )}

                      {/* Voice Note Custom Player */}
                      {isVoice ? (
                        <div className="space-y-2 min-w-[220px]" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleTogglePlayAudio(msg.id || String(idx), msg.audioUrl, msg.audioDurationSeconds || 6)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition shrink-0 cursor-pointer shadow-sm ${
                                isPatient 
                                  ? 'bg-white text-teal-700 hover:bg-teal-50' 
                                  : 'bg-teal-600 text-white hover:bg-teal-700'
                              }`}
                            >
                              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5 rtl:rotate-180" />}
                            </button>

                            <div className="flex-1 space-y-1">
                              {/* Animated Audio Wave Bars */}
                              <div className="flex items-center gap-1 h-5">
                                {[35, 75, 45, 90, 60, 100, 50, 80, 40, 95, 65, 30, 85, 55].map((h, i) => (
                                  <span
                                    key={i}
                                    className={`w-1 rounded-full transition-all duration-150 ${
                                      isPatient ? 'bg-teal-200' : 'bg-teal-500'
                                    } ${isPlaying ? 'animate-pulse' : ''}`}
                                    style={{ 
                                      height: isPlaying ? `${Math.max(25, Math.min(100, h * (1 + (i % 3) * 0.2)))}%` : `${h}%`,
                                      opacity: (i / 14) * 100 <= progress ? 1 : 0.45
                                    }}
                                  />
                                ))}
                              </div>

                              <div className="flex items-center justify-between text-[10px] opacity-80 font-mono">
                                <span>{isPlaying ? 'جاري الاستماع...' : 'رسالة صوتية'}</span>
                                <span>{msg.audioDurationSeconds ? `${msg.audioDurationSeconds} ثانية` : '0:06'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : isAttachment ? (
                        /* Rich Attachment Card */
                        <div className="space-y-2">
                          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                            isPatient ? 'bg-teal-700/60 border-teal-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                          }`}>
                            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                              {msg.attachmentType === 'scale_result' ? (
                                <Activity className="w-4 h-4" />
                              ) : msg.attachmentType === 'cbt_homework' ? (
                                <FileText className="w-4 h-4" />
                              ) : msg.attachmentType === 'medication_query' ? (
                                <Pill className="w-4 h-4" />
                              ) : (
                                <Paperclip className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs truncate">{msg.attachmentName || 'مرفق سريري'}</p>
                              <span className="text-[10px] opacity-80 block truncate">ملف مشفر وموثق</span>
                            </div>
                          </div>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {/* Reactions Badges if present */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {Object.entries(msg.reactions).map(([emoji, count], rIdx) => (
                            <span 
                              key={rIdx} 
                              className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                isPatient ? 'bg-teal-700/80 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span className="font-bold text-[10px] font-mono">{count}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className={`flex items-center justify-between gap-1 mt-1.5 text-[9px] ${isPatient ? 'text-teal-200' : 'text-slate-400'}`}>
                        <span className="opacity-70">خيارات ⋯</span>
                        {isPatient && <CheckCheck className="w-3 h-3 text-teal-200" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts - Colored Non-white Bar & Compact Chips */}
        {showQuickTips && !isRecording && (
          <div className="px-3 sm:px-4 py-1.5 bg-slate-900 dark:bg-slate-950 border-t border-teal-900/60 shrink-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold text-teal-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400 shrink-0" />
                <span>عبارات مقترحة للبدء السريع:</span>
              </span>
              <button 
                type="button" 
                onClick={() => setShowQuickTips(false)}
                className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
              >
                إخفاء ✕
              </button>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
              {QUICK_PROMPTS.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="shrink-0 flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-teal-800/80 hover:bg-teal-700 text-teal-100 hover:text-white border border-teal-600/40 transition shadow-xs cursor-pointer font-medium"
                  title={prompt.text}
                >
                  <span>{prompt.label || `${prompt.icon} ${prompt.cat}`}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quoted Message Input Banner if replying */}
        {quotedMessage && (
          <div className="px-4 py-2 bg-teal-50 dark:bg-teal-950/60 border-t border-teal-200 dark:border-teal-800 flex items-center justify-between gap-2 text-xs shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2 min-w-0">
              <Quote className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <div className="min-w-0 truncate">
                <span className="font-bold text-teal-900 dark:text-teal-200 ml-1">رد على {quotedMessage.senderName}:</span>
                <span className="text-slate-600 dark:text-slate-400 text-[11px] truncate">{quotedMessage.text}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setQuotedMessage(null)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Options & Attachments Popover Menu */}
        {isAttachmentMenuOpen && (
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg animate-fadeIn shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">خيارات الإرفاق والمشاركة السريرية:</span>
              <button
                type="button"
                onClick={() => setIsAttachmentMenuOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900 border border-slate-200 dark:border-slate-600 text-right flex items-center gap-2 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div className="text-[11px] min-w-0">
                  <p className="font-bold text-slate-800 dark:text-slate-200">إرفاق ملف / فحص</p>
                  <p className="text-[9px] text-slate-400">PDF, صور، تحاليل</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleShareScale(SCALES_OPTIONS[0])}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900 border border-slate-200 dark:border-slate-600 text-right flex items-center gap-2 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-[11px] min-w-0">
                  <p className="font-bold text-slate-800 dark:text-slate-200">نتيجة مقياس نفسي</p>
                  <p className="text-[9px] text-slate-400">PHQ-9 / GAD-7</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleShareCBT}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900 border border-slate-200 dark:border-slate-600 text-right flex items-center gap-2 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-[11px] min-w-0">
                  <p className="font-bold text-slate-800 dark:text-slate-200">واجب معرفي CBT</p>
                  <p className="text-[9px] text-slate-400">سجل الأفكار التلقائية</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleShareMedQuery}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900 border border-slate-200 dark:border-slate-600 text-right flex items-center gap-2 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div className="text-[11px] min-w-0">
                  <p className="font-bold text-slate-800 dark:text-slate-200">استفسار دوائي</p>
                  <p className="text-[9px] text-slate-400">الجرعات والتأثيرات</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Input Bar Form / Real Audio Recording Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          {isRecording ? (
            /* Live Real Audio Recording Mode */
            <div className="flex items-center justify-between gap-3 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl border border-rose-200 dark:border-rose-900 animate-fadeIn">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-600 animate-ping shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
                      جاري تسجيل صوتك الآن...
                    </span>
                    <span className="font-mono font-bold text-xs text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                      ⏱ {formatTime(recordingSeconds)}
                    </span>
                  </div>
                  {audioError && (
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">{audioError}</p>
                  )}
                </div>
              </div>

              {/* Animated Wave Bars while recording */}
              <div className="hidden sm:flex items-center gap-1 h-5">
                {[40, 80, 50, 95, 70, 100, 60, 85].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-rose-500 rounded-full animate-bounce"
                    style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>إلغاء</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendVoiceNote}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 rtl:-scale-x-100" />
                  <span>إرسال الصوتية</span>
                </button>
              </div>
            </div>
          ) : (
            /* Standard Text Input Bar */
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                className={`p-2.5 rounded-xl transition shrink-0 cursor-pointer ${
                  isAttachmentMenuOpen 
                    ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' 
                    : 'text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="خيارات الإرفاق والمقاييس السريرية"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleStartRecording}
                className="p-2.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 cursor-pointer"
                title="بدء تسجيل صوتك الحقيقي"
              >
                <Mic className="w-4 h-4" />
              </button>

              {!showQuickTips && (
                <button
                  type="button"
                  onClick={() => setShowQuickTips(true)}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-slate-500 hover:text-teal-600 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 rounded-xl text-xs transition cursor-pointer"
                  title="عرض العبارات المقترحة"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                  <span className="text-[11px] font-bold">عبارات مقترحة</span>
                </button>
              )}

              <div className="flex-1 relative min-w-0">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={`اكتب رسالتك إلى ${doctor.name}...`}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-2xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                <span>إرسال</span>
                <Send className="w-3.5 h-3.5 rtl:-scale-x-100" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
