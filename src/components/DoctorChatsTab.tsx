import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Mic, 
  Video, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  ClipboardCheck, 
  Activity, 
  Clock, 
  User, 
  Search, 
  PhoneCall,
  ExternalLink,
  Lock,
  Smile,
  AlertTriangle,
  Play,
  Pause,
  MoreHorizontal,
  Pin,
  Star,
  Quote,
  Copy,
  BookOpen
} from 'lucide-react';
import { Patient, ChatMessage, StaffUser } from '../types';
import { MessageActionModal } from './MessageActionModal';

interface Props {
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, patientId: string, extra?: Partial<ChatMessage>) => void;
  currentStaff: StaffUser | null;
  onOpenSendScaleModal?: (patient: Patient) => void;
  onOpenSendExerciseModal?: (patient: Patient) => void;
  onDeleteMessage?: (messageId: string) => void;
  onTogglePinMessage?: (messageId: string) => void;
  onToggleFavoriteMessage?: (messageId: string) => void;
  onReactToMessage?: (messageId: string, emoji: string) => void;
  onSaveToJournal?: (messageId: string) => void;
}

export const DoctorChatsTab: React.FC<Props> = ({
  patients,
  activePatient,
  onSelectPatient,
  messages,
  onSendMessage,
  currentStaff,
  onOpenSendScaleModal,
  onOpenSendExerciseModal,
  onDeleteMessage,
  onTogglePinMessage,
  onToggleFavoriteMessage,
  onReactToMessage,
  onSaveToJournal
}) => {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [audioRecordingSeconds, setAudioRecordingSeconds] = useState(0);
  const [quickTemplate, setQuickTemplate] = useState('');
  const [emergencyAlertText, setEmergencyAlertText] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<Record<string, number>>({});
  const [selectedActionMessage, setSelectedActionMessage] = useState<ChatMessage | null>(null);
  const [quotedMessage, setQuotedMessage] = useState<ChatMessage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };
  const docFileInputRef = React.useRef<HTMLInputElement>(null);
  const docRecordingTimerRef = React.useRef<any>(null);
  const docPlaybackIntervalRef = React.useRef<any>(null);
  const docMediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const docAudioChunksRef = React.useRef<Blob[]>([]);
  const docMediaStreamRef = React.useRef<MediaStream | null>(null);
  const docAudioElementRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (isAudioRecording) {
      setAudioRecordingSeconds(0);
      docRecordingTimerRef.current = setInterval(() => {
        setAudioRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (docRecordingTimerRef.current) clearInterval(docRecordingTimerRef.current);
    }
    return () => {
      if (docRecordingTimerRef.current) clearInterval(docRecordingTimerRef.current);
      if (docMediaStreamRef.current) {
        docMediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (docAudioElementRef.current) {
        docAudioElementRef.current.pause();
      }
    };
  }, [isAudioRecording]);

  const handleStartDoctorRecording = async () => {
    docAudioChunksRef.current = [];
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        docMediaStreamRef.current = stream;

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
        docMediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            docAudioChunksRef.current.push(event.data);
          }
        };

        recorder.start(200);
        setIsAudioRecording(true);
      } else {
        setIsAudioRecording(true);
      }
    } catch (e) {
      console.warn('Doc mic error:', e);
      setIsAudioRecording(true);
    }
  };

  const handleCancelDoctorRecording = () => {
    if (docMediaRecorderRef.current && docMediaRecorderRef.current.state !== 'inactive') {
      try {
        docMediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (docMediaStreamRef.current) {
      docMediaStreamRef.current.getTracks().forEach(t => t.stop());
      docMediaStreamRef.current = null;
    }
    docAudioChunksRef.current = [];
    setIsAudioRecording(false);
    setAudioRecordingSeconds(0);
  };

  const playDoctorAudio = (msgId: string, durationSeconds: number = 6, audioUrl?: string) => {
    if (playingAudioId === msgId) {
      if (docAudioElementRef.current) {
        docAudioElementRef.current.pause();
      }
      setPlayingAudioId(null);
      if (docPlaybackIntervalRef.current) clearInterval(docPlaybackIntervalRef.current);
      return;
    }

    if (docAudioElementRef.current) {
      docAudioElementRef.current.pause();
    }
    if (docPlaybackIntervalRef.current) clearInterval(docPlaybackIntervalRef.current);

    setPlayingAudioId(msgId);
    setPlaybackProgress(prev => ({ ...prev, [msgId]: 0 }));

    if (audioUrl && audioUrl.startsWith('blob:')) {
      const audio = new Audio(audioUrl);
      docAudioElementRef.current = audio;

      audio.play().catch(e => console.warn(e));

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
      const totalMs = durationSeconds * 1000;
      let elapsedMs = 0;

      docPlaybackIntervalRef.current = setInterval(() => {
        elapsedMs += stepMs;
        const progress = Math.min(100, Math.round((elapsedMs / totalMs) * 100));
        setPlaybackProgress(prev => ({ ...prev, [msgId]: progress }));

        if (elapsedMs >= totalMs) {
          clearInterval(docPlaybackIntervalRef.current);
          setPlayingAudioId(null);
          setPlaybackProgress(prev => ({ ...prev, [msgId]: 100 }));
        }
      }, stepMs);
    }
  };

  const handleSendDoctorVoiceNote = () => {
    const finalDuration = Math.max(1, audioRecordingSeconds);
    const durationFormatted = `${Math.floor(finalDuration / 60)}:${(finalDuration % 60).toString().padStart(2, '0')}`;
    const recorder = docMediaRecorderRef.current;

    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = () => {
        let audioBlobUrl = '';
        if (docAudioChunksRef.current.length > 0) {
          const mimeType = recorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(docAudioChunksRef.current, { type: mimeType });
          audioBlobUrl = URL.createObjectURL(audioBlob);
        }

        if (docMediaStreamRef.current) {
          docMediaStreamRef.current.getTracks().forEach(t => t.stop());
          docMediaStreamRef.current = null;
        }

        onSendMessage(
          `🎙️ تسجيل صوتي من المعالج (${durationFormatted})`, 
          activePatient.id,
          {
            audioUrl: audioBlobUrl,
            audioDurationSeconds: finalDuration
          }
        );
      };

      try {
        recorder.requestData();
        recorder.stop();
      } catch (e) {
        if (docMediaStreamRef.current) {
          docMediaStreamRef.current.getTracks().forEach(t => t.stop());
          docMediaStreamRef.current = null;
        }
        onSendMessage(`🎙️ تسجيل صوتي من المعالج (${durationFormatted})`, activePatient.id, {
          audioDurationSeconds: finalDuration
        });
      }
    } else {
      if (docMediaStreamRef.current) {
        docMediaStreamRef.current.getTracks().forEach(t => t.stop());
        docMediaStreamRef.current = null;
      }
      onSendMessage(`🎙️ تسجيل صوتي من المعالج (${durationFormatted})`, activePatient.id, {
        audioDurationSeconds: finalDuration
      });
    }

    setIsAudioRecording(false);
    setAudioRecordingSeconds(0);
  };

  // Quick templates for fast, empathetic replies
  const QUICK_TEMPLATES = [
    { label: 'سجل المشاعر 🧠', text: 'أهلاً بك. اطلعت على سجل مشاعرك الأخير وسنناقشه في جلستنا القادمة بإذن الله.' },
    { label: 'استبيان PHQ-9 📊', text: 'يرجى تعبئة مقياس استبيان الاكتئاب (PHQ-9) المرفق لمتابعة تطور الخطة العلاجية.' },
    { label: 'تمرين التنفس 🫁', text: 'ممتاز جداً! استمر على تمرين التنفس البطني ثلاث مرات يومياً كما اتفقنا.' },
    { label: 'تجديد الوصفة 💊', text: 'تم تجديد وصفتك الدوائية المعتمدة وستجدها في تبويب الوصفات بملفك الشخصي.' },
    { label: 'تأكيد الموعد 📅', text: 'موعد جلستنا القادمة قائم في وقته المحدد، وأتطلع لرؤية تقدمك الإيجابي.' }
  ];

  // Emergency keywords
  const EMERGENCY_KEYWORDS = ['انتحار', 'أموت', 'أنهي حياتي', 'إيذاء', 'أقتل نفسي', 'سكين', 'سلاح'];

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.fileNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const patientMessages = messages.filter(m => 
    m.patientId === activePatient.id || (!m.patientId && m.doctorId === currentStaff?.doctorId)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim() || quickTemplate;
    if (!text) return;

    // Check emergency keywords in patient or doctor chat
    const hasEmergency = EMERGENCY_KEYWORDS.some(k => text.includes(k));
    if (hasEmergency) {
      setEmergencyAlertText('تنبيه أمان سريري: تم رصد مفردات خطورة عالية في نص المحادثة. يرجى تفعيل بروتوكول الأمان وفتح تقييم C-SSRS.');
    } else {
      setEmergencyAlertText('');
    }

    onSendMessage(
      text, 
      activePatient.id, 
      quotedMessage ? {
        replyTo: {
          id: quotedMessage.id,
          text: quotedMessage.text,
          senderName: quotedMessage.senderName
        }
      } : undefined
    );
    setInputText('');
    setQuickTemplate('');
    setQuotedMessage(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden text-right flex flex-col md:flex-row h-[750px] transition-colors">
      
      {/* Sidebar: Patient Conversations List */}
      <div className="w-full md:w-80 border-l border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-slate-900/60">
        
        {/* Search header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>محادثات مرضاي المباشرة</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
              {filteredPatients.length} محادثة
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم أو رقم الملف..."
              className="w-full pl-3 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
          </div>
        </div>

        {/* SLA Notice (ADD-D-002) */}
        <div className="px-3.5 py-2 bg-teal-50 dark:bg-teal-950/40 border-b border-teal-100 dark:border-teal-900 text-[10px] text-teal-800 dark:text-teal-300 flex items-center justify-between">
          <span>⏱️ زمن الرد المستهدف للمستشار (SLA):</span>
          <span className="font-bold">أقل من ساعتين</span>
        </div>

        {/* Patients list */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredPatients.map(patient => {
            const isSelected = patient.id === activePatient.id;
            return (
              <button
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className={`w-full p-3 text-right flex items-center gap-3 transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-teal-50 dark:bg-teal-950/50 border-r-4 border-teal-600' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center text-xs">
                    {patient.name[0]}
                  </div>
                  {patient.riskLevel === 'مرتفع' || patient.riskLevel === 'حرج' ? (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" title="مستوى خطورة مرتفع"></span>
                  ) : (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white dark:border-slate-900"></span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <strong className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {patient.name}
                    </strong>
                    <span className="text-[10px] text-slate-400 shrink-0">اليوم</span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {patient.primaryDiagnosis}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1 text-[9px] text-teal-700 dark:text-teal-400">
                    <span className="font-mono">{patient.fileNumber}</span>
                    <span>·</span>
                    <span>{patient.status}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        
        {/* Chat Top Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center text-sm shrink-0">
              {activePatient.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{activePatient.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {activePatient.fileNumber}
                </span>
                {activePatient.riskLevel === 'متوسط' || activePatient.riskLevel === 'مرتفع' ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>خطر {activePatient.riskLevel}</span>
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {activePatient.primaryDiagnosis} · متصل الآن
              </p>
            </div>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {onOpenSendScaleModal && (
              <button
                type="button"
                onClick={() => onOpenSendScaleModal(activePatient)}
                className="px-2.5 py-1.5 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                title="إرسال مقياس نفسي للمريض لتعبئته"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">إرسال مقياس</span>
              </button>
            )}

            {onOpenSendExerciseModal && (
              <button
                type="button"
                onClick={() => onOpenSendExerciseModal(activePatient)}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                title="إرسال تمرين معرفي سلوكي للمريض"
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">إسناد واجب CBT</span>
              </button>
            )}

            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              title="بدء جلسة فيديو فورية"
            >
              <Video className="w-3.5 h-3.5" />
              <span>بدء الجلسة (Meet)</span>
            </a>
          </div>
        </div>

        {/* Emergency keyword warning banner if detected */}
        {emergencyAlertText && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border-b border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{emergencyAlertText}</span>
            </div>
            <button
              onClick={() => setEmergencyAlertText('')}
              className="text-[10px] underline font-bold"
            >
              إخفاء
            </button>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40 dark:bg-slate-900/40">
          
          <div className="text-center my-2">
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">
              بداية المحادثة الآمنة والمشفرة مع {activePatient.name} · انقر على أي رسالة للخيارات (حذف، نسخ، تثبيت، تحويل لتوصية)
            </span>
          </div>

          {/* Pinned message in thread */}
          {patientMessages.some(m => m.isPinned) && (
            <div className="p-2.5 mb-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 rounded-2xl flex items-center justify-between text-xs animate-fadeIn">
              <div className="flex items-center gap-2 min-w-0 truncate">
                <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-bold text-amber-900 dark:text-amber-200 shrink-0">رسالة مثبتة سريرياً:</span>
                <span className="text-slate-700 dark:text-slate-300 truncate text-[11px]">
                  {patientMessages.find(m => m.isPinned)?.text}
                </span>
              </div>
            </div>
          )}

          {patientMessages.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>لا توجد رسائل سابقة. يمكنك إرسال ترحيب أو توصية للمريض الآن.</p>
            </div>
          ) : (
            patientMessages.map((msg, idx) => {
              const isDoctor = msg.senderRole === 'doctor' || msg.senderName.includes('د.') || msg.senderName.includes('أ.');
              const isVoice = msg.audioUrl || msg.text.includes('🎙️') || msg.text.includes('تسجيل صوتي');
              const isPlaying = playingAudioId === (msg.id || String(idx));
              const progress = playbackProgress[msg.id || String(idx)] || 0;

              return (
                <div
                  key={msg.id || idx}
                  className={`flex flex-col group ${isDoctor ? 'items-end' : 'items-start'} animate-fadeIn`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                    <span>{msg.senderName}</span>
                    <span>·</span>
                    <span>{msg.timestamp || 'الآن'}</span>
                    {msg.isPinned && <span title="رسالة مثبتة"><Pin className="w-3 h-3 text-amber-500 fill-amber-400" /></span>}
                    {msg.isFavorite && <span title="مفضلة سريرية"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /></span>}
                    {msg.savedToJournal && <span title="محفوظة في مفكرة CBT"><BookOpen className="w-3 h-3 text-purple-400" /></span>}
                  </div>

                  <div className="relative max-w-[85%] sm:max-w-md">
                    {/* Hover action toolbar */}
                    <div className={`absolute -top-7 ${isDoctor ? 'left-0' : 'right-0'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 dark:bg-slate-800/95 shadow-md border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-full text-slate-600 dark:text-slate-300 z-10`}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedActionMessage(msg);
                        }}
                        className="p-1 hover:text-teal-600 rounded-full transition cursor-pointer"
                        title="خيارات الرسالة (حذف، نسخ، تحويل لتوصية...)"
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
                        className="p-1 hover:text-blue-600 rounded-full transition cursor-pointer"
                        title="اقتباس ورد"
                      >
                        <Quote className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(msg.text);
                          showToast('تم نسخ نص الرسالة');
                        }}
                        className="p-1 hover:text-teal-600 rounded-full transition cursor-pointer"
                        title="نسخ سريع"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>

                    <div
                      onClick={() => setSelectedActionMessage(msg)}
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs cursor-pointer transition hover:border-teal-400 ${
                        isDoctor
                          ? 'bg-teal-700 text-white rounded-br-xs shadow-xs hover:bg-teal-800'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs shadow-xs'
                      }`}
                      title="انقر لإظهار خيارات الرسالة (حذف، نسخ، تثبيت، تحويل لملاحظة)"
                    >
                      {/* Quoted Message preview */}
                      {msg.replyTo && (
                        <div className={`mb-2 p-2 rounded-xl text-[11px] border-r-4 ${
                          isDoctor 
                            ? 'bg-teal-800/70 border-teal-300 text-teal-100' 
                            : 'bg-slate-100 dark:bg-slate-700/60 border-teal-500 text-slate-600 dark:text-slate-300'
                        }`}>
                          <span className="font-bold block text-[10px] opacity-90">{msg.replyTo.senderName}</span>
                          <span className="line-clamp-2">{msg.replyTo.text}</span>
                        </div>
                      )}

                      {isVoice ? (
                        <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => playDoctorAudio(msg.id || String(idx), msg.audioDurationSeconds || 5)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition shrink-0 cursor-pointer shadow-sm ${
                              isDoctor ? 'bg-white text-teal-800' : 'bg-teal-600 text-white'
                            }`}
                          >
                            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5 rtl:rotate-180" />}
                          </button>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-1 h-5">
                              {[40, 75, 50, 90, 60, 100, 45, 80, 55, 30].map((h, i) => (
                                <span
                                  key={i}
                                  className={`w-1 rounded-full transition-all ${isDoctor ? 'bg-teal-200' : 'bg-teal-500'}`}
                                  style={{ height: `${h}%`, opacity: (i / 10) * 100 <= progress ? 1 : 0.4 }}
                                />
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-[9px] opacity-80 font-mono">
                              <span>{isPlaying ? 'تشغيل...' : 'رسالة صوتية'}</span>
                              <span>0:05</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {/* Reactions badges */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {Object.entries(msg.reactions).map(([emoji, count], rIdx) => (
                            <span 
                              key={rIdx} 
                              className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                isDoctor ? 'bg-teal-800/80 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span className="font-bold text-[10px] font-mono">{count}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quoted Message bar if replying */}
        {quotedMessage && (
          <div className="px-3.5 py-2 bg-teal-50 dark:bg-teal-950/60 border-t border-teal-200 dark:border-teal-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0 truncate text-teal-900 dark:text-teal-200">
              <Quote className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold">رد على {quotedMessage.senderName}: </span>
                <span className="text-slate-600 dark:text-slate-400">{quotedMessage.text}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setQuotedMessage(null)}
              className="text-[11px] text-slate-400 hover:text-slate-600 font-bold shrink-0 cursor-pointer"
            >
              ✕ إلغاء
            </button>
          </div>
        )}

        {/* Quick Templates Selector (Dark Teal non-white compact bar) */}
        <div className="px-3 py-1.5 bg-slate-900 dark:bg-slate-950 border-t border-teal-900/60 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          <span className="text-[10px] font-bold text-teal-300 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>قوالب سريعة:</span>
          </span>
          {QUICK_TEMPLATES.map((tpl, tIdx) => (
            <button
              key={tIdx}
              type="button"
              onClick={() => setInputText(tpl.text)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-teal-800/80 hover:bg-teal-700 text-teal-100 hover:text-white border border-teal-600/40 shrink-0 cursor-pointer shadow-xs transition flex items-center gap-1 font-medium"
              title={tpl.text}
            >
              <span>{tpl.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar / Audio Recording */}
        {isAudioRecording ? (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-rose-50 dark:bg-rose-950/40">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping shrink-0" />
              <span className="font-bold text-xs text-rose-700 dark:text-rose-300">
                تسجيل رسالة صوتية للمريض (00:0{audioRecordingSeconds})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelDoctorRecording}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSendDoctorVoiceNote}
                className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 rtl:-scale-x-100" />
                <span>إرسال</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
            <input
              type="file"
              ref={docFileInputRef}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onSendMessage(`📎 تم إرفاق تقرير طبي/ملف: ${f.name}`, activePatient.id);
              }}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => docFileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="إرفاق ملف أو تقرير طبي"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleStartDoctorRecording}
              className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="تسجيل صوتك الحقيقي للمريض"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`اكتب رسالة علاجية للمريض ${activePatient.name}...`}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4 rtl:-scale-x-100" />
            </button>
          </form>
        )}

        {/* Toast notification */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-slate-900/90 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce border border-slate-700">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Message Action Modal */}
        <MessageActionModal
          isOpen={!!selectedActionMessage}
          onClose={() => setSelectedActionMessage(null)}
          message={selectedActionMessage}
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
            showToast('تم الحفظ في سجل العلاج بنجاح!');
          }}
          onQuoteReply={(msg) => {
            setQuotedMessage(msg);
            showToast('تم تحديد الرسالة للاقتباس والرد');
          }}
        />

      </div>
    </div>
  );
};
