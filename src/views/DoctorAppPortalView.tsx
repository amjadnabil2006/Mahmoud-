import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Bell, 
  CalendarClock, 
  User, 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  ClipboardList, 
  Users, 
  BarChart3, 
  BookOpen, 
  Globe, 
  Clock, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Video, 
  Send, 
  Mic, 
  X, 
  Check, 
  Stethoscope,
  Home,
  ArrowRight,
  Activity,
  FileText,
  Pill,
  ShieldCheck,
  TrendingUp,
  LayoutDashboard,
  Brain,
  Sun,
  Moon,
  HelpCircle,
  Heart,
  SlidersHorizontal,
  Mail,
  Phone,
  Award,
  DollarSign,
  Camera,
  CheckCircle2,
  Printer,
  Download,
  Sparkles,
  PieChart,
  Building,
  Filter,
  ArrowUpRight,
  TrendingDown,
  Target,
  Percent,
  RefreshCw,
  Sparkle,
  CornerUpLeft,
  Play,
  Pause,
  Share2,
  ListFilter,
  Info,
  MapPin,
  Paperclip,
  Trash2,
  Volume2,
  Square,
  FileUp,
  Maximize2,
  Minimize2,
  Smile,
  CheckCheck,
  Pin,
  Star,
  Quote,
  Copy,
  Lock
} from 'lucide-react';
import { 
  Patient, 
  Doctor, 
  Appointment, 
  Prescription, 
  ScaleAssessmentResult, 
  ChatMessage, 
  AppNotification, 
  StaffUser,
  AuditLog,
  ThemeMode
} from '../types';

import { DashboardView } from './DashboardView';
import { PsychiatryView } from './PsychiatryView';
import { PrescriptionsView } from './PrescriptionsView';
import { ClinicalFormsView } from './ClinicalFormsView';
import { ScalesView } from './ScalesView';
import { DoctorReportsTab } from '../components/DoctorReportsTab';
import { DoctorFinancialsTab } from '../components/DoctorFinancialsTab';

export type DoctorAppTab = 'chats' | 'appointments' | 'notifications' | 'schedule' | 'account' | 'workstation';

// Helper function to synthesize a playable WAV audio blob when microphone is unavailable/blocked in iframe
const generatePlayableAudioBlob = (durationSeconds: number = 3): string => {
  try {
    const sampleRate = 22050;
    const dur = Math.min(Math.max(1, durationSeconds), 10);
    const numSamples = Math.floor(sampleRate * dur);
    const buffer = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const freq = 240 + Math.sin(t * 8) * 50 + Math.cos(t * 14) * 30;
      const envelope = Math.min(1, t * 4) * Math.max(0, 1 - (t / dur));
      buffer[i] = Math.sin(2 * Math.PI * freq * t) * 0.18 * envelope;
    }

    const wavBuffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(wavBuffer);

    const writeString = (offset: number, string: string) => {
      for (let j = 0; j < string.length; j++) {
        view.setUint8(offset + j, string.charCodeAt(j));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }

    const blob = new Blob([view], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch (e) {
    return '';
  }
};

interface Props {
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  doctors: Doctor[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  scaleResults: ScaleAssessmentResult[];
  messages: ChatMessage[];
  notifications: AppNotification[];
  auditLogs?: AuditLog[];
  currentStaff: StaffUser | null;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onOpenOverview?: () => void;
  onSendMessage: (text: string, targetDocId?: string, extra?: any) => void;
  onDeleteMessage: (id: string) => void;
  onTogglePinMessage: (id: string) => void;
  onToggleFavoriteMessage: (id: string) => void;
  onReactToMessage: (id: string, emoji: string) => void;
  onSaveToJournal: (id: string) => void;
  onUpdateAppointmentStatus: (id: string, status: any, notes?: string) => void;
  onOpenClinicalForm: (formType: string) => void;
  onOpenScaleRunner: (scaleId?: string) => void;
  onOpenNewPrescription: () => void;
  onOpenPatientFile: (patient: Patient) => void;
  onSwitchStaff: () => void;
  onReturnToMainPage: () => void;
  onSwitchPortal?: (portal: 'patient' | 'doctor' | 'admin') => void;
}

interface TimeSlotPair {
  id: string;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  dayName: string;
  enabled: boolean;
  slots: TimeSlotPair[];
}

export const DoctorAppPortalView: React.FC<Props> = ({
  patients,
  activePatient,
  onSelectPatient,
  doctors,
  appointments,
  prescriptions,
  scaleResults,
  messages,
  notifications,
  auditLogs = [],
  currentStaff,
  theme = 'light',
  onToggleTheme,
  onOpenOverview,
  onSendMessage,
  onDeleteMessage,
  onTogglePinMessage,
  onToggleFavoriteMessage,
  onReactToMessage,
  onSaveToJournal,
  onUpdateAppointmentStatus,
  onOpenClinicalForm,
  onOpenScaleRunner,
  onOpenNewPrescription,
  onOpenPatientFile,
  onSwitchStaff,
  onReturnToMainPage,
  onSwitchPortal
}) => {
  // 6 Main Windows: chats | appointments | notifications | schedule | account | workstation
  const [activeWindow, setActiveWindow] = useState<DoctorAppTab>('chats');
  const [isOtherOptionsOpen, setIsOtherOptionsOpen] = useState(false);

  // Workstation sub-tab
  const [workstationTab, setWorkstationTab] = useState<'dashboard' | 'psychiatry' | 'clinical_forms' | 'prescriptions' | 'scales' | 'reports' | 'financials'>('dashboard');

  // --- 1. CHATS WINDOW STATE (Clean Slate - Empty Default Chats) ---
  const [chatSubTab, setChatSubTab] = useState<'clients' | 'therapists'>('clients');
  const [chatSearch, setChatSearch] = useState('');
  const [selectedChatPatient, setSelectedChatPatient] = useState<any | null>(null);
  const [activeChatText, setActiveChatText] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Clean empty state for chats as requested
  const [clientChats, setClientChats] = useState<{ id: string; name: string; letter: string; color: string; lastMessage: string; time: string; unread: boolean; patientId: string }[]>([]);
  const [therapistChats, setTherapistChats] = useState<{ id: string; name: string; role: string; letter: string; color: string; lastMessage: string; time: string; unread: boolean }[]>([]);

  // Messages per conversation (Supports Text, Real Voice Recording, and PDF Files)
  const [conversationMessages, setConversationMessages] = useState<Record<string, Array<{
    id: string;
    sender: 'me' | 'patient';
    type: 'text' | 'voice' | 'pdf';
    text?: string;
    audioUrl?: string;
    voiceDuration?: string;
    pdfName?: string;
    pdfSize?: string;
    replyTo?: { id: string; text: string; senderName?: string };
    time: string;
  }>>>({});

  const [isChatFullScreen, setIsChatFullScreen] = useState(false);
  const [quotedChatMessage, setQuotedChatMessage] = useState<any | null>(null);
  const [messageReactions, setMessageReactions] = useState<Record<string, string>>({});

  // Audio recording & playback state with real microphone stream
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordSeconds, setVoiceRecordSeconds] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [playingVoiceProgress, setPlayingVoiceProgress] = useState<number>(0);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);

  const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);
  const [selectedPdfPreview, setSelectedPdfPreview] = useState<{
    title: string;
    size: string;
    type: string;
    patientName?: string;
    date?: string;
    doctorName?: string;
  } | null>(null);
  const [chatToast, setChatToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer effect for live voice recording
  useEffect(() => {
    let interval: any = null;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setVoiceRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setVoiceRecordSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecordingVoice]);

  // Clean up playback and streams on unmount
  useEffect(() => {
    return () => {
      if (currentAudioElementRef.current) {
        currentAudioElementRef.current.pause();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Simulated audio playback progress with audio synth
  useEffect(() => {
    let playInterval: any = null;
    if (playingVoiceId) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch (e) { /* ignore audio error */ }

      setPlayingVoiceProgress(0);
      playInterval = setInterval(() => {
        setPlayingVoiceProgress(prev => {
          if (prev >= 100) {
            setPlayingVoiceId(null);
            return 0;
          }
          return prev + 10;
        });
      }, 350);
    } else {
      setPlayingVoiceProgress(0);
    }
    return () => {
      if (playInterval) clearInterval(playInterval);
    };
  }, [playingVoiceId]);

  // --- 2. APPOINTMENTS WINDOW STATE (IMG-20261007-WA0012.jpg) ---
  const [aptFilter, setAptFilter] = useState<'upcoming' | 'previous' | 'cancelled'>('upcoming');
  const [aptSearch, setAptSearch] = useState('');

  // --- 3. NOTIFICATIONS WINDOW STATE (Clean Slate - Deleted Notifications) ---
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [yesterdayNotifs, setYesterdayNotifs] = useState<any[]>([]);
  const [previousDaysNotifs, setPreviousDaysNotifs] = useState<any[]>([]);

  const handleMarkAllRead = () => {
    setYesterdayNotifs([]);
    setPreviousDaysNotifs([]);
    setUnreadNotifCount(0);
  };

  // --- 4. SCHEDULE WINDOW STATE (IMG-20261007-WA0020.jpg, IMG-20261007-WA0011.jpg, IMG-20261007-WA0006.jpg) ---
  const [scheduleSubTab, setScheduleSubTab] = useState<'days' | 'dates' | 'info'>('days');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isScheduleSaveSuccess, setIsScheduleSaveSuccess] = useState(false);

  // Tab 3 Info Fields (Matching IMG-20261007-WA0011.jpg)
  const [scheduleWeeklyCapacity, setScheduleWeeklyCapacity] = useState(() => localStorage.getItem('coolmind_schedule_weekly_cap') || '10');
  const [scheduleMinDailyCapacity, setScheduleMinDailyCapacity] = useState(() => localStorage.getItem('coolmind_schedule_min_daily_cap') || '0');
  const [scheduleMaxDailyCapacity, setScheduleMaxDailyCapacity] = useState(() => localStorage.getItem('coolmind_schedule_max_daily_cap') || '7');
  const [scheduleEarliestBookingHours, setScheduleEarliestBookingHours] = useState(() => localStorage.getItem('coolmind_schedule_earliest_hours') || '5');
  const [scheduleLatestBookingDays, setScheduleLatestBookingDays] = useState(() => localStorage.getItem('coolmind_schedule_latest_days') || '7');
  const [scheduleTimezoneLocation, setScheduleTimezoneLocation] = useState(() => localStorage.getItem('coolmind_schedule_tz_location') || 'Asia/Aden');
  const [isScheduleTimezoneDropdownOpen, setIsScheduleTimezoneDropdownOpen] = useState(false);

  // Tab 2 Specific Dates Overrides (Matching IMG-20261007-WA0006.jpg)
  const [scheduleCustomDates, setScheduleCustomDates] = useState<{ id: string; date: string; title: string; isAvailable: boolean; startTime?: string; endTime?: string }[]>(() => {
    const saved = localStorage.getItem('coolmind_schedule_custom_dates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });
  const [isAddCustomDateModalOpen, setIsAddCustomDateModalOpen] = useState(false);
  const [newCustomDateDate, setNewCustomDateDate] = useState('2026-10-15');
  const [newCustomDateTitle, setNewCustomDateTitle] = useState('إجازة رسمية / غير متاح');
  const [newCustomDateIsAvailable, setNewCustomDateIsAvailable] = useState(false);
  const [newCustomDateStartTime, setNewCustomDateStartTime] = useState('16:00');
  const [newCustomDateEndTime, setNewCustomDateEndTime] = useState('20:00');

  // Exact schedule days and slots matching screenshot
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([
    {
      dayName: 'الأحد',
      enabled: true,
      slots: [
        { id: 'sun-1', startTime: '00:00', endTime: '01:00' },
        { id: 'sun-2', startTime: '17:00', endTime: '21:00' },
        { id: 'sun-3', startTime: '11:00', endTime: '12:00' }
      ]
    },
    {
      dayName: 'الإثنين',
      enabled: true,
      slots: [
        { id: 'mon-1', startTime: '00:00', endTime: '01:00' },
        { id: 'mon-2', startTime: '17:00', endTime: '21:00' },
        { id: 'mon-3', startTime: '22:00', endTime: '24:00' }
      ]
    },
    {
      dayName: 'الثلاثاء',
      enabled: true,
      slots: [
        { id: 'tue-1', startTime: '00:00', endTime: '01:00' },
        { id: 'tue-2', startTime: '17:00', endTime: '21:00' },
        { id: 'tue-3', startTime: '22:00', endTime: '24:00' }
      ]
    },
    {
      dayName: 'الأربعاء',
      enabled: true,
      slots: [
        { id: 'wed-1', startTime: '16:00', endTime: '20:00' },
        { id: 'wed-2', startTime: '21:00', endTime: '23:00' }
      ]
    },
    {
      dayName: 'الخميس',
      enabled: true,
      slots: [
        { id: 'thu-1', startTime: '16:00', endTime: '20:00' }
      ]
    },
    {
      dayName: 'الجمعة',
      enabled: false,
      slots: [
        { id: 'fri-1', startTime: '18:00', endTime: '22:00' }
      ]
    },
    {
      dayName: 'السبت',
      enabled: true,
      slots: [
        { id: 'sat-1', startTime: '10:00', endTime: '14:00' },
        { id: 'sat-2', startTime: '17:00', endTime: '21:00' }
      ]
    }
  ]);

  const toggleDayEnabled = (idx: number) => {
    setWeekSchedule(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], enabled: !copy[idx].enabled };
      return copy;
    });
  };

  const addSlotToDay = (idx: number) => {
    setWeekSchedule(prev => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        slots: [...copy[idx].slots, { id: `slot-${Date.now()}`, startTime: '17:00', endTime: '21:00' }]
      };
      return copy;
    });
  };

  const removeSlotFromDay = (dayIdx: number, slotIdx: number) => {
    setWeekSchedule(prev => {
      const copy = [...prev];
      copy[dayIdx] = {
        ...copy[dayIdx],
        slots: copy[dayIdx].slots.filter((_, i) => i !== slotIdx)
      };
      return copy;
    });
  };

  const updateSlotTimes = (dayIdx: number, slotIdx: number, start: string, end: string) => {
    setWeekSchedule(prev => {
      const copy = [...prev];
      const slots = [...copy[dayIdx].slots];
      slots[slotIdx] = { ...slots[slotIdx], startTime: start, endTime: end };
      copy[dayIdx] = { ...copy[dayIdx], slots };
      return copy;
    });
  };

  const handleSaveSchedule = () => {
    localStorage.setItem('coolmind_therapist_schedule', JSON.stringify(weekSchedule));
    localStorage.setItem('coolmind_schedule_weekly_cap', scheduleWeeklyCapacity);
    localStorage.setItem('coolmind_schedule_min_daily_cap', scheduleMinDailyCapacity);
    localStorage.setItem('coolmind_schedule_max_daily_cap', scheduleMaxDailyCapacity);
    localStorage.setItem('coolmind_schedule_earliest_hours', scheduleEarliestBookingHours);
    localStorage.setItem('coolmind_schedule_latest_days', scheduleLatestBookingDays);
    localStorage.setItem('coolmind_schedule_tz_location', scheduleTimezoneLocation);
    localStorage.setItem('coolmind_schedule_custom_dates', JSON.stringify(scheduleCustomDates));
    setIsScheduleSaveSuccess(true);
    setTimeout(() => setIsScheduleSaveSuccess(false), 2500);
  };

  // --- 5. ACCOUNT WINDOW STATE (IMG-20261007-WA0014.jpg & IMG-20261007-WA0010.jpg) ---
  const [doctorFirstName, setDoctorFirstName] = useState('طبيب');
  const [doctorLastName, setDoctorLastName] = useState('نفسي');
  const [doctorName, setDoctorName] = useState('د. استشاري الطب النفسي');
  const [doctorSpecialty, setDoctorSpecialty] = useState('استشاري أول الطب النفسي والمعالجة السلوكية');
  const [doctorBio, setDoctorBio] = useState('استشاري الطب النفسي والعلاج السلوكي المعرفي (CBT).');
  const [doctorPhoneRaw, setDoctorPhoneRaw] = useState('790000000');
  const [doctorCountryCode, setDoctorCountryCode] = useState('+962');
  const [doctorCountryFlag, setDoctorCountryFlag] = useState('🇯🇴');
  const [doctorPhone, setDoctorPhone] = useState('+962 790000000');
  const [doctorEmail, setDoctorEmail] = useState('doctor@example.com');
  const [doctorFee, setDoctorFee] = useState('350 ر.س');
  const [doctorLicense, setDoctorLicense] = useState('MOH-PSY-00000');
  const [doctorClinic, setDoctorClinic] = useState('المركز الطبي للاستشارات النفسية');
  const [doctorAvatar, setDoctorAvatar] = useState('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80');
  const [doctorYearsExp, setDoctorYearsExp] = useState('15 سنة خبرة سريرية');
  const [doctorSpecializations, setDoctorSpecializations] = useState<string[]>([
    'العلاج المعرفي السلوكي (CBT)',
    'اضطراب القلق العام والهلع',
    'الاكتئاب والاضطرابات الوجدانية',
    'الوسواس القهري (OCD)',
    'العلاج السلوكي الجدلي (DBT)',
    'إدارة الضغوط والأزمات'
  ]);
  const [profileSaveSuccessToast, setProfileSaveSuccessToast] = useState<string | null>(null);

  // Edit Profile Form Temp States (Matching IMG-20261007-WA0010.jpg)
  const [tempFirstName, setTempFirstName] = useState('الاسم الأول');
  const [tempLastName, setTempLastName] = useState('اسم العائلة');
  const [tempName, setTempName] = useState('د. استشاري الطب النفسي');
  const [tempSpecialty, setTempSpecialty] = useState('استشاري أول الطب النفسي والمعالجة السلوكية');
  const [tempBio, setTempBio] = useState('استشاري الطب النفسي والعلاج السلوكي المعرفي (CBT).');
  const [tempPhoneRaw, setTempPhoneRaw] = useState('790000000');
  const [tempCountryCode, setTempCountryCode] = useState('+962');
  const [tempCountryFlag, setTempCountryFlag] = useState('🇯🇴');
  const [tempPhone, setTempPhone] = useState('+962 790000000');
  const [tempProfileEmail, setTempProfileEmail] = useState('doctor@example.com');
  const [tempEmail, setTempEmail] = useState('doctor@example.com');
  const [tempFee, setTempFee] = useState('350 ر.س');
  const [tempLicense, setTempLicense] = useState('MOH-PSY-00000');
  const [tempClinic, setTempClinic] = useState('المركز الطبي للاستشارات النفسية');
  const [tempAvatar, setTempAvatar] = useState('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [tempYearsExp, setTempYearsExp] = useState('15 سنة خبرة سريرية');
  const [tempSpecializations, setTempSpecializations] = useState<string[]>([
    'العلاج المعرفي السلوكي (CBT)',
    'اضطراب القلق العام والهلع',
    'الاكتئاب والاضطرابات الوجدانية',
    'الوسواس القهري (OCD)',
    'العلاج السلوكي الجدلي (DBT)',
    'إدارة الضغوط والأزمات'
  ]);
  const [newSpecializationInput, setNewSpecializationInput] = useState('');

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isPatientsListModalOpen, setIsPatientsListModalOpen] = useState(false);
  const [isSupportGroupsModalOpen, setIsSupportGroupsModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [statsTimeframe, setStatsTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [statsActiveTab, setStatsActiveTab] = useState<'overview' | 'diagnoses' | 'outcomes' | 'insights'>('overview');
  const [statsExportToast, setStatsExportToast] = useState<string | null>(null);
  const [statsDateRange, setStatsDateRange] = useState('01/10/2026 - 07/10/2026');
  const [isStatsDatePickerOpen, setIsStatsDatePickerOpen] = useState(false);
  
  // Content Library States & Datasets (IMG-20261007-WA0003.jpg, IMG-20261007-WA0009.jpg, IMG-20261007-WA0016.jpg)
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [libraryActiveTab, setLibraryActiveTab] = useState<'readings' | 'videos' | 'scales'>('readings');
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [selectedLibraryReading, setSelectedLibraryReading] = useState<any | null>(null);
  const [selectedLibraryVideo, setSelectedLibraryVideo] = useState<any | null>(null);
  const [selectedLibraryItemForSuggest, setSelectedLibraryItemForSuggest] = useState<any | null>(null);
  const [librarySuggestToast, setLibrarySuggestToast] = useState<string | null>(null);

  const libraryReadingsList = [
    { id: 'lr-1', title: 'تمرين العد العكسي', date: '۳۱ ديسمبر ۲۰۲۵', duration: '5 دقائق', description: 'تمرين سلوكي معرفي لتشتيت نوبات القلق الحادة والتوتر عبر العد التنازلي التبادلي (100 إلى 1 مع إنقاص 7) مما يشغل الفص الجبهي للدماغ ويقلل نشاط اللوزة الدماغية.' },
    { id: 'lr-2', title: 'تمرين المشي مع التركيز', date: '۳۱ ديسمبر ۲۰۲۵', duration: '15 دقيقة', description: 'ممارسة اليقظة الذهنية (Mindfulness) أثناء المشي من خلال توجيه كامل الانتباه لملامسة القدمين للأرض وحركة الجسم والتنفس لإعادة الاتصال باللحظة الحاضرة.' },
    { id: 'lr-3', title: 'تمرين تيار الضوء', date: '۳۱ ديسمبر ۲۰۲۵', duration: '10 دقائق', description: 'تمرين التخيل الموجه واستحضار تيار من الضوء الدافئ المريح يمر عبر كافة أجزاء الجسد لتفريغ التشنجات العضلية والضغط النفسي المتراكم.' },
    { id: 'lr-4', title: 'تمرين سلسلة الحيوانات', date: '۳۱ ديسمبر ۲۰۲۵', duration: '5 دقائق', description: 'تقنية التركيز المعرفي للحد من تداعي الأفكار الاقتحامية والوساوس من خلال تسلسل أسماء الكائنات بأحرف الهجاء لإعادة توجيه المسار العصبي.' },
    { id: 'lr-5', title: 'تمرين الألوان الخمسة', date: '۳۱ ديسمبر ۲۰۲۵', duration: '7 دقائق', description: 'تمرين التأريض الحسي 5-4-3-2-1 لربط الحواس الخمس بالبيئة الواقعية المحيطة وإيقاف نوبة الهلع أو الانفصال عن الواقع.' },
    { id: 'lr-6', title: 'حلقة الضوء الحامية', date: '۳۱ ديسمبر ۲۰۲۵', duration: '12 دقيقة', description: 'تأمل سلوكي لتقوية الحدود النفسية وبناء درع الحماية الذاتية من التأثر السلبي بضغوط المحيطين والمواقف المرهقة.' },
    { id: 'lr-7', title: 'رمي الكرة بانتباه', date: '۳۱ ديسمبر ۲۰۲۵', duration: '8 دقائق', description: 'تدريب تفاعلي حركي-بصري لزيادة سعة التركيز والانتباه وسرعة الاستجابة الحركية-المعرفية وخفض شرود الذهن.' },
    { id: 'lr-8', title: 'تمرين 1 - 2 - 3 - 4', date: '۳۱ ديسمبر ۲۰۲۵', duration: '10 دقائق', description: 'جدولة المهام وتفكيك الأعباء والضغوط المعرفية الكبيرة إلى 4 خطوات متسلسلة يمكن تنفيذها دون تسويف أو توتر.' },
  ];

  const libraryVideosList = [
    { id: 'lv-1', title: 'أربع خطوات لتهدئة مشاعرك', duration: '0:06', date: '١٢ أكتوبر ٢٠٢٥', category: 'إدارة المشاعر' },
    { id: 'lv-2', title: 'مراقبة الأفكار بلا انجراف', duration: '0:04', date: '١٠ أكتوبر ٢٠٢٥', category: 'اليقظة الذهنية' },
    { id: 'lv-3', title: 'الإسعاف النفسي الأولي', duration: '0:05', date: '٠٥ أكتوبر ٢٠٢٥', category: 'التدخل في الأزمات' },
    { id: 'lv-4', title: 'تمارين التنفس البطني العميق (4-7-8)', duration: '0:08', date: '٢٨ سبتمبر ٢٠٢٥', category: 'تقنيات الاسترخاء' },
    { id: 'lv-5', title: 'إعادة الهيكلة المعرفية وتفنيد الأفكار', duration: '0:07', date: '٢٠ سبتمبر ٢٠٢٥', category: 'العلاج المعرفي السلوكي' },
  ];

  const libraryScalesList = [
    { id: 'ls-1', title: 'مقياس YMRS', date: '٢٦ أغسطس ٢٠٢٦', scaleKey: 'ymrs', description: 'مقياس يونغ لتقييم حدة نوبات الهوس والأعراض المزاجية المرتفعة.' },
    { id: 'ls-2', title: 'مقياس اضطرابات الشخصية (الصورة الخامسة)', date: '٩ أكتوبر ٢٠٢٥', scaleKey: 'pid-5', description: 'التقييم التشخيصي الشامل لأبعاد وسمات الشخصية المرضية.' },
    { id: 'ls-3', title: 'استبيان الوسواس القهري المعدل (OCI-R)', date: '٩ أكتوبر ٢٠٢٥', scaleKey: 'oci-r', description: 'استبيان تقييم شدة وساوس النظافة، الترتيب، والطقوس القهرية.' },
    { id: 'ls-4', title: 'مقياس بيك للقلق معدل', date: '٩ أكتوبر ٢٠٢٥', scaleKey: 'bai', description: 'مقياس بيك الشهير لتقييم الأعراض الفسيولوجية والمعرفية للقلق.' },
    { id: 'ls-5', title: 'تقييم SCL 90 (قائمة الأعراض)', date: '٢١ أبريل ٢٠٢٥', scaleKey: 'scl-90', description: 'قائمة فحص الأعراض النفسية المتعددة وتحديد مستوى الشدة العام.' },
    { id: 'ls-6', title: 'اضطرابات الشخصية - SCID 5', date: '٢٦ مارس ٢٠٢٥', scaleKey: 'scid-5', description: 'المقابلة السريرية النصف مقننة لتشخيص الاضطرابات النفسية.' },
    { id: 'ls-7', title: 'اختبار السمات الشخصية (IKP)', date: '٢٦ مارس ٢٠٢٥', scaleKey: 'ikp', description: 'أداة قياس السمات الشخصية وأنماط التأقلم السلوكي.' },
    { id: 'ls-8', title: 'مقياس الاكتئاب (PHQ-9)', date: '١٥ يناير ٢٠٢٦', scaleKey: 'phq-9', description: 'مقياس الفحص السريري المعتمد لشدة أعراض الاكتئاب وتتبع العلاج.' },
    { id: 'ls-9', title: 'مقياس القلق العام (GAD-7)', date: '١٠ يناير ٢٠٢٦', scaleKey: 'gad-7', description: 'المقياس المعياري السريع لتشخيص ومتابعة اضطراب القلق العام.' },
  ];

  const [isTimezoneModalOpen, setIsTimezoneModalOpen] = useState(false);
  const [timezoneMode, setTimezoneMode] = useState<'auto' | 'manual'>(() => (localStorage.getItem('coolmind_timezone_mode') as 'auto' | 'manual') || 'auto');
  const [tempTimezoneMode, setTempTimezoneMode] = useState<'auto' | 'manual'>('auto');
  const [selectedTimezone, setSelectedTimezone] = useState(() => localStorage.getItem('coolmind_app_timezone') || '(UTC+3) 03+ (الرياض / مكة)');
  const [tempSelectedTimezone, setTempSelectedTimezone] = useState('(UTC+3) 03+ (الرياض / مكة)');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => localStorage.getItem('coolmind_app_language') || 'العربية');
  const [languageToast, setLanguageToast] = useState<string | null>(null);
  const [timezoneToast, setTimezoneToast] = useState<string | null>(null);

  // Patient List Tabs & Search State (IMG-20261007-WA0008.jpg)
  const [patientListTab, setPatientListTab] = useState<'active' | 'closed' | 'diagnoses'>('active');
  const [patientListSearch, setPatientListSearch] = useState('');

  // Support Groups State (IMG-20261007-WA0007.jpg)
  const [selectedSupportGroupForDetails, setSelectedSupportGroupForDetails] = useState<any | null>(null);
  const [selectedSupportGroupForSuggest, setSelectedSupportGroupForSuggest] = useState<any | null>(null);
  const [suggestSuccessToast, setSuggestSuccessToast] = useState<string | null>(null);

  // Default dataset for Active Patients (Matching Image IMG-20261007-WA0008.jpg)
  const defaultActivePatientsList = [
    { id: 'p-1', name: 'ايهاب احمد', fileNumber: '#P-8821', diagnosis: 'اضطراب القلق العام (GAD)', lastSession: 'اليوم، 10:30 ص' },
    { id: 'p-2', name: 'عبدالرحمن مقداد', fileNumber: '#P-9042', diagnosis: 'اكتئاب تفاعلي متوسط', lastSession: 'أمس، 04:15 م' },
    { id: 'p-3', name: 'zwrrf5jnrc', fileNumber: '#P-7719', diagnosis: 'نوبات هلع واضطراب رهاب الساحة', lastSession: 'قبل يومين' },
    { id: 'p-4', name: 'Salem Alfarraj', fileNumber: '#P-6534', diagnosis: 'اضطراب الوسواس القهري (OCD)', lastSession: '3 أكتوبر 2026' },
    { id: 'p-5', name: 'Bushra Bader', fileNumber: '#P-9182', diagnosis: 'أرق واضطراب دورة النوم', lastSession: '2 أكتوبر 2026' },
    { id: 'p-6', name: 'thakaa sss', fileNumber: '#P-5421', diagnosis: 'الرهاب الاجتماعي والمواقف العامة', lastSession: '1 أكتوبر 2026' },
    { id: 'p-7', name: 'Jana Dahlawi', fileNumber: '#P-8833', diagnosis: 'اضطراب التكيف مع الضغوط الحياتية', lastSession: '28 سبتمبر 2026' },
    { id: 'p-8', name: 'فارس الخلايلة', fileNumber: '#P-4019', diagnosis: 'إجهاد واحتراق وظيفي مزمن', lastSession: '25 سبتمبر 2026' },
    { id: 'p-9', name: 'سارة المنصور', fileNumber: '#P-9201', diagnosis: 'نوبات قلق وتوتر نفسي', lastSession: '22 سبتمبر 2026' },
    { id: 'p-10', name: 'خالد العمري', fileNumber: '#P-7312', diagnosis: 'اضطراب المزاج ثنائي القطب (مستقر)', lastSession: '20 سبتمبر 2026' }
  ];

  // Default dataset for Closed Patients (مغلقة)
  const defaultClosedPatientsList = [
    { id: 'pc-1', name: 'مريم الغامدي', fileNumber: '#P-3102', diagnosis: 'اضطراب القلق العام', reason: 'اكتمال جلسات CBT وتحسن المعايير بالكامل', closedDate: '15 سبتمبر 2026' },
    { id: 'pc-2', name: 'ياسر الدوسري', fileNumber: '#P-2914', diagnosis: 'نوبات الهلع', reason: 'تعافي كامل ودرجة PHQ-9 أقل من 4', closedDate: '10 سبتمبر 2026' },
    { id: 'pc-3', name: 'نورة القحطاني', fileNumber: '#P-4180', diagnosis: 'اكتئاب موسمي', reason: 'انتهاء الخطة العلاجية وتحويل للمتابعة الوقائية', closedDate: '01 سبتمبر 2026' },
    { id: 'pc-4', name: 'طارق الشهري', fileNumber: '#P-5120', diagnosis: 'أرق حاد', reason: 'استقرار نمط النوم بنجاح', closedDate: '24 أغسطس 2026' },
    { id: 'pc-5', name: 'هند العتيبي', fileNumber: '#P-3891', diagnosis: 'اضطراب ما بعد الصدمة', reason: 'إنهاء بروتوكول EMDR وتحقيق الاستقرار', closedDate: '18 أغسطس 2026' }
  ];

  // Default dataset for Diagnoses (التشاخيص)
  const defaultDiagnosesList = [
    { id: 'd-1', name: 'اضطراب القلق العام (GAD)', count: 18, code: 'F41.1', desc: 'قلق مفرط وتوتر مستمر' },
    { id: 'd-2', name: 'الاكتئاب الجسيم والتفاعلي (MDD)', count: 14, code: 'F32.9', desc: 'انخفاض المزاج وفقدان الشغف' },
    { id: 'd-3', name: 'اضطراب الهلع ونوبات الذعر (Panic Disorder)', count: 9, code: 'F41.0', desc: 'نوبات تسارع وهلع مفاجئة' },
    { id: 'd-4', name: 'اضطراب الوسواس القهري (OCD)', count: 8, code: 'F42.2', desc: 'أفكار وسواسية وسلوكيات قهرية' },
    { id: 'd-5', name: 'الرهاب الاجتماعي والقلق الاجتماعي', count: 7, code: 'F40.1', desc: 'تجنب المواقف الاجتماعية والخوف من التقييم' },
    { id: 'd-6', name: 'اضطراب كرب ما بعد الصدمة (PTSD)', count: 5, code: 'F43.1', desc: 'ذكريات اقتحامية وصدمات نفسية' },
    { id: 'd-7', name: 'اضطرابات النوم والأرق المزمن', count: 6, code: 'G47.0', desc: 'صعوبة النوم والاستيقاظ المتكرر' },
    { id: 'd-8', name: 'اضطراب التكيف والاحتراق الوظيفي', count: 11, code: 'F43.2', desc: 'إجهاد مهني وضغوط حياتية متراكمة' }
  ];

  // Default dataset for Support Groups (Matching Image IMG-20261007-WA0007.jpg)
  const defaultSupportGroupsList = [
    {
      id: 'sg-1',
      title: 'أساس التغيير لحياة أفضل',
      specialist: 'سنا السالم',
      day: 'السبت',
      time: '11:00 صباحًا',
      description: 'مجموعة دعم أسبوعية تركز على مهارات التكيف السلوكي وبناء العادات الإيجابية وتخطي عوائق الإنجاز والتردد في اتخاذ القرارات.',
      category: 'التطوير الذاتي والتكيف',
      capacity: '8 من 10 مقاعد محجوزة'
    },
    {
      id: 'sg-2',
      title: 'التخطي بسلام',
      specialist: 'د. فيفيان علي',
      day: 'الأحد',
      time: '07:00 مساءً',
      description: 'جلسات دعم جماعي مخصصة لتجاوز الصدمات العاطفية وتجارب الانفصال واستعادة التوازن النفسي الداخلي وبناء تقدير الذات.',
      category: 'التعافي العاطفي',
      capacity: '6 من 10 مقاعد محجوزة'
    },
    {
      id: 'sg-3',
      title: 'كيف نتخطى وجع الفقد؟',
      specialist: 'محمد تركي',
      day: 'السبت',
      time: '08:30 مساءً',
      description: 'مساحة آمنة لمشاركة مشاعر الحزن ومراحل الفقد والدعم التبادلي بإشراف أخصائي معتمد في مساندة مشاعر الفقد.',
      category: 'دعم مشاعر الفقد والحزن',
      capacity: '5 من 8 مقاعد محجوزة'
    },
    {
      id: 'sg-4',
      title: 'لحظة هدوء - تخلص من قلقك',
      specialist: 'رشا القيسي',
      day: 'الجمعة',
      time: '05:00 مساءً',
      description: 'تمارين وتطبيقات عملية في خفض القلق ونوبات التوتر وممارسات اليقظة الذهنية والتنفس البطني العميق.',
      category: 'إدارة القلق والتوتر',
      capacity: '7 من 10 مقاعد محجوزة'
    },
    {
      id: 'sg-5',
      title: 'رحلة التحرر من الوسواس',
      specialist: 'د. وليد الزهراني',
      day: 'الثلاثاء',
      time: '06:00 مساءً',
      description: 'مجموعة دعم موجهة للأشخاص الذين يواجهون تحديات الوسواس القهري وتطبيقات التعرض ومنع الاستجابة ERP بروح تشاركية.',
      category: 'الوسواس القهري',
      capacity: '6 من 8 مقاعد محجوزة'
    }
  ];

  // Filtered active patients
  const filteredActivePatients = defaultActivePatientsList.filter(p => 
    p.name.toLowerCase().includes(patientListSearch.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(patientListSearch.toLowerCase()) ||
    p.fileNumber.toLowerCase().includes(patientListSearch.toLowerCase())
  );

  const filteredClosedPatients = defaultClosedPatientsList.filter(p => 
    p.name.toLowerCase().includes(patientListSearch.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(patientListSearch.toLowerCase()) ||
    p.fileNumber.toLowerCase().includes(patientListSearch.toLowerCase())
  );

  const filteredDiagnoses = defaultDiagnosesList.filter(d => 
    d.name.toLowerCase().includes(patientListSearch.toLowerCase()) ||
    d.code.toLowerCase().includes(patientListSearch.toLowerCase())
  );

  // Filtered chats
  const filteredClientChats = clientChats.filter(c => 
    c.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const filteredTherapistChats = therapistChats.filter(c => 
    c.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(chatSearch.toLowerCase())
  );

  return (
    <div className="w-full flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col pb-28 font-sans antialiased selection:bg-teal-500 selection:text-white transition-colors">
      
      {/* Top Application Header - Exact same layout & style as official Header.tsx */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            
            {/* Logo & Brand (Identical to official Header) */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-700/15">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate">
                    Cool<span className="text-teal-600 dark:text-teal-400">Mind</span>
                  </span>
                  <span className="hidden xs:inline text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800 shrink-0">
                    منظومة متكاملة
                  </span>
                </div>
                <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                  بوابات المريض · الطبيب · الإدارة و API
                </p>
              </div>
            </div>

            {/* Desktop Portals Navigation Hub (Identical to official Header) */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={onReturnToMainPage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <Heart className="w-3.5 h-3.5 text-slate-400" />
                <span>بوابة المريض</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-teal-700 text-white shadow-xs"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>عيادة الطبيب</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onSwitchPortal) onSwitchPortal('admin');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>لوحة الأدمن و API</span>
              </button>
            </div>

            {/* Controls: Replaced Chat & Notifications with the two added buttons */}
            <div className="flex items-center gap-2">
              
              {/* 1. زر العودة إلى الصفحة الرسمية (في مكان زر المحادثة/الدردشة) */}
              <button
                type="button"
                onClick={onReturnToMainPage}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-xl transition-colors border border-teal-200 dark:border-teal-800 cursor-pointer shadow-xs"
                title="العودة إلى الصفحة الرسمية للمنصة"
              >
                <Home className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="hidden sm:inline">العودة للصفحة الرسمية</span>
              </button>

              {/* 2. زر باقي الخيارات والمنصات (في مكان زر الإشعارات) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOtherOptionsOpen(!isOtherOptionsOpen)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs"
                  title="باقي الخيارات والمنصات"
                >
                  <SlidersHorizontal className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="hidden sm:inline">باقي الخيارات</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </button>

                {isOtherOptionsOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-right space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtherOptionsOpen(false);
                        onReturnToMainPage();
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/40 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      <Home className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>الصفحة الرسمية (بوابة المريض والعيادات)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtherOptionsOpen(false);
                        if (onSwitchPortal) onSwitchPortal('admin');
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>لوحة الإدارة والتحكم (Admin)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtherOptionsOpen(false);
                        setActiveWindow('workstation');
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>محطة العمل السريرية الموسعة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtherOptionsOpen(false);
                        onSwitchStaff();
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>تبديل حساب الطبيب / تسجيل الدخول</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Active Patient Switcher (Doctor view) - Identical to Header.tsx */}
              <div className="hidden lg:flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 gap-2">
                <div className="w-6 h-6 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold text-[10px]">
                  {activePatient ? activePatient.name[0] : 'م'}
                </div>
                <select 
                  value={activePatient?.id || ''} 
                  onChange={(e) => {
                    const p = patients.find(item => item.id === e.target.value);
                    if (p) onSelectPatient(p);
                  }}
                  aria-label="اختيار المريض النشط"
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id} className="dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                      {p.name} ({p.fileNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dark / Light Mode Toggle Button - Identical to Header.tsx */}
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                  title={theme === 'dark' ? "التحويل للوضع النهاري (Light Mode)" : "التحويل للوضع الليلي (Dark Mode)"}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>
              )}

              {/* What is this app button - Identical to Header.tsx */}
              {onOpenOverview && (
                <button
                  type="button"
                  onClick={onOpenOverview}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-xl transition-colors border border-teal-200 dark:border-teal-800 cursor-pointer"
                  title="شرح هيكلية وهدف المنصة"
                >
                  <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="hidden sm:inline">هدف المنصة</span>
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* FULL SCREEN MAIN CONTAINER (ملان الشاشة بالكامل دون هوامش تضييق) */}
      <div className="w-full flex-1 px-3 sm:px-6 md:px-8 lg:px-10 py-4 flex flex-col">
        
        {/* ==============================================================
            WINDOW 1: المحادثات (IMG-20261007-WA0005.jpg)
           ============================================================== */}
        {activeWindow === 'chats' && (
          <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden min-h-[78vh] transition-colors">
            
            {/* Top Bar Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {(clientChats.length > 0 || therapistChats.length > 0) ? (
                <button
                  type="button"
                  onClick={() => {
                    setClientChats([]);
                    setTherapistChats([]);
                    setConversationMessages({});
                    setChatToast('تم مسح جميع المحادثات والرسائل بنجاح ✓');
                    setTimeout(() => setChatToast(null), 3000);
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
                  title="مسح جميع المحادثات"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>مسح الكل</span>
                </button>
              ) : (
                <div className="w-8"></div>
              )}

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                المحادثات
              </h1>

              <button
                type="button"
                onClick={() => setIsNewChatModalOpen(true)}
                className="w-8 h-8 flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
                title="بدء محادثة جديدة"
              >
                <Plus className="w-6 h-6 stroke-[2.2]" />
              </button>
            </div>

            {/* Chat Toast feedback */}
            {chatToast && (
              <div className="mx-6 mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{chatToast}</span>
              </div>
            )}

            {/* Subtabs: محادثات العملاء | محادثات المعالجين */}
            <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto w-full">
              <button
                type="button"
                onClick={() => setChatSubTab('clients')}
                className={`py-3 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
                  chatSubTab === 'clients'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                محادثات العملاء
                {chatSubTab === 'clients' && (
                  <span className="absolute bottom-0 inset-x-8 h-[2.5px] bg-[#225049] dark:bg-teal-400 rounded-full"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setChatSubTab('therapists')}
                className={`py-3 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
                  chatSubTab === 'therapists'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                محادثات المعالجين
                {chatSubTab === 'therapists' && (
                  <span className="absolute bottom-0 inset-x-8 h-[2.5px] bg-[#225049] dark:bg-teal-400 rounded-full"></span>
                )}
              </button>
            </div>

            {/* Search Box */}
            <div className="p-4 sm:px-6 pb-2 max-w-3xl mx-auto w-full">
              <div className="relative">
                <input
                  type="text"
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  placeholder="ابحث باسم المريض أو المعالج"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pr-11 pl-4 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-teal-600 dark:focus:border-teal-400 transition-colors text-right shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Chat List Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 max-w-3xl mx-auto w-full px-2 sm:px-0 flex flex-col justify-start">
              {chatSubTab === 'clients' ? (
                filteredClientChats.length > 0 ? (
                  filteredClientChats.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        const matched = patients.find(p => p.id === c.patientId) || patients[0];
                        setSelectedChatPatient({ ...c, rawPatient: matched });
                        onSelectPatient(matched);
                      }}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center justify-between gap-4 rounded-xl"
                    >
                      {/* Timestamp on left in RTL */}
                      <div className="flex flex-col items-start gap-1 shrink-0">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                          {c.time}
                        </span>
                        {c.unread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                        )}
                      </div>

                      {/* Name & Snippet */}
                      <div className="flex-1 min-w-0 text-right">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {c.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {c.lastMessage}
                        </p>
                      </div>

                      {/* Circular Letter Avatar */}
                      <div className={`w-12 h-12 rounded-full ${c.color} text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs`}>
                        {c.letter}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto min-h-[300px]">
                    <div className="w-20 h-20 mb-4 rounded-3xl bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-xs">
                      <MessageSquare className="w-10 h-10 stroke-[1.6]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                      لا توجد رسائل دردشة حالياً
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-4">
                      تم تفريغ المحادثات بالكامل. يمكنك بدء محادثة جديدة وتجربة التسجيل الصوتي وإرسال ملفات PDF.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsNewChatModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#225049] hover:bg-[#1a3f3a] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>بدء محادثة جديدة مع عميل</span>
                    </button>
                  </div>
                )
              ) : (
                filteredTherapistChats.length > 0 ? (
                  filteredTherapistChats.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedChatPatient({ ...c, isTherapist: true })}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center justify-between gap-4 rounded-xl"
                    >
                      <div className="flex flex-col items-start gap-1 shrink-0">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                          {c.time}
                        </span>
                        {c.unread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 dark:bg-teal-400"></span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                            {c.role}
                          </span>
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                            {c.name}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {c.lastMessage}
                        </p>
                      </div>

                      <div className={`w-12 h-12 rounded-full ${c.color} text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs`}>
                        {c.letter}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto min-h-[300px]">
                    <div className="w-20 h-20 mb-4 rounded-3xl bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-xs">
                      <Users className="w-10 h-10 stroke-[1.6]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                      لا توجد محادثات معالجين حالياً
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-4">
                      يمكنك بدء محادثة سريرية أو استشارية مع زملاء الفريق الطبي والمعالجين.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsNewChatModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#225049] hover:bg-[#1a3f3a] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>بدء محادثة مع معالج</span>
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ==============================================================
            WINDOW 2: المواعيد (IMG-20261007-WA0012.jpg)
           ============================================================== */}
        {activeWindow === 'appointments' && (
          <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden min-h-[78vh] transition-colors">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                المواعيد
              </h1>
            </div>

            {/* Segmented Filter: القادمة | السابقة | الملغية */}
            <div className="p-4 sm:px-6 pb-2 max-w-xl mx-auto w-full">
              <div className="grid grid-cols-3 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setAptFilter('upcoming')}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    aptFilter === 'upcoming'
                      ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  القادمة
                </button>

                <button
                  type="button"
                  onClick={() => setAptFilter('previous')}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    aptFilter === 'previous'
                      ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  السابقة
                </button>

                <button
                  type="button"
                  onClick={() => setAptFilter('cancelled')}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    aptFilter === 'cancelled'
                      ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  الملغية
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="px-4 sm:px-6 pb-3 max-w-xl mx-auto w-full">
              <div className="relative">
                <input
                  type="text"
                  value={aptSearch}
                  onChange={(e) => setAptSearch(e.target.value)}
                  placeholder="ابحث"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pr-11 pl-4 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-teal-600 dark:focus:border-teal-400 transition-colors text-right shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Content: Empty State Exactly as Image */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
              <div className="w-36 h-36 mb-5 relative">
                <svg viewBox="0 0 120 120" className="w-full h-full text-blue-200" fill="none">
                  <rect x="15" y="24" width="90" height="80" rx="12" fill="#dbeafe" stroke="#93c5fd" strokeWidth="2.5" />
                  <path d="M15 42h90" stroke="#93c5fd" strokeWidth="2.5" />
                  <rect x="32" y="15" width="5" height="14" rx="2.5" fill="#60a5fa" />
                  <rect x="83" y="15" width="5" height="14" rx="2.5" fill="#60a5fa" />
                  <rect x="25" y="52" width="18" height="13" rx="3" fill="#ffffff" />
                  <rect x="51" y="52" width="18" height="13" rx="3" fill="#ffffff" />
                  <rect x="77" y="52" width="18" height="13" rx="3" fill="#ffffff" />
                  <circle cx="86" cy="58.5" r="4.5" fill="#1d4ed8" />
                  <path d="M84 58.5l1.5 1.5 3-3" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

                  <rect x="25" y="72" width="18" height="13" rx="3" fill="#ffffff" />
                  <circle cx="34" cy="78.5" r="4.5" fill="#1d4ed8" />
                  <path d="M32 78.5l1.5 1.5 3-3" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

                  <rect x="51" y="72" width="18" height="13" rx="3" fill="#ffffff" />
                  <circle cx="60" cy="78.5" r="4.5" fill="#1d4ed8" />
                  <path d="M58 78.5l1.5 1.5 3-3" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

                  <rect x="77" y="72" width="18" height="13" rx="3" fill="#ffffff" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {aptFilter === 'upcoming' 
                  ? 'لا يوجد مواعيد قادمة' 
                  : aptFilter === 'previous'
                  ? 'لا يوجد مواعيد سابقة'
                  : 'لا يوجد مواعيد ملغية'}
              </h3>
            </div>
          </div>
        )}

        {/* ==============================================================
            WINDOW 3: الإشعارات (Clean Slate - Deleted Notifications)
           ============================================================== */}
        {activeWindow === 'notifications' && (
          <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden min-h-[78vh] transition-colors">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="w-16"></div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                الإشعارات
              </h1>

              <div className="w-16"></div>
            </div>

            {/* Content: Clean Empty Notifications State */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto min-h-[380px]">
              <div className="w-20 h-20 mb-4 rounded-3xl bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-xs">
                <Bell className="w-10 h-10 stroke-[1.6]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                لا توجد إشعارات حالياً
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                تم تفريغ وحذف جميع الإشعارات والتنبيهات السابقة بالكامل بنجاح.
              </p>
            </div>
          </div>
        )}

        {/* ==============================================================
            WINDOW 4: جدولي (IMG-20261007-WA0020.jpg, WA0011.jpg, WA0006.jpg)
           ============================================================== */}
        {activeWindow === 'schedule' && (
          <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden min-h-[78vh] relative transition-colors">
            
            {/* Header with "استعراض" on left matching screenshot */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                <span>استعراض</span>
              </button>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                جدولي
              </h1>

              <div className="w-16"></div>
            </div>

            {/* Segmented 3-Tabs Bar matching screenshots: أيام | التواريخ | المعلومات */}
            <div className="px-4 sm:px-6 pt-4 pb-2 max-w-xl mx-auto w-full">
              <div className="grid grid-cols-3 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium shadow-2xs">
                
                {/* 1. أيام */}
                <button
                  type="button"
                  onClick={() => setScheduleSubTab('days')}
                  className={`py-2.5 px-2 text-center transition-all cursor-pointer ${
                    scheduleSubTab === 'days'
                      ? 'bg-[#eef4fc] dark:bg-blue-950/60 border border-[#24589d] dark:border-blue-400 text-[#1546a0] dark:text-blue-300 font-bold shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  أيام
                </button>

                {/* 2. التواريخ */}
                <button
                  type="button"
                  onClick={() => setScheduleSubTab('dates')}
                  className={`py-2.5 px-2 text-center transition-all cursor-pointer border-r border-l border-slate-200 dark:border-slate-800 ${
                    scheduleSubTab === 'dates'
                      ? 'bg-[#eef4fc] dark:bg-blue-950/60 border border-[#24589d] dark:border-blue-400 text-[#1546a0] dark:text-blue-300 font-bold shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  التواريخ
                </button>

                {/* 3. المعلومات */}
                <button
                  type="button"
                  onClick={() => setScheduleSubTab('info')}
                  className={`py-2.5 px-2 text-center transition-all cursor-pointer ${
                    scheduleSubTab === 'info'
                      ? 'bg-[#eef4fc] dark:bg-blue-950/60 border border-[#24589d] dark:border-blue-400 text-[#1546a0] dark:text-blue-300 font-bold shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  المعلومات
                </button>
              </div>
            </div>

            {/* TAB CONTENT BODY */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 pb-28 max-w-xl mx-auto w-full">
              
              {/* TAB 1: أيام (Days of the week schedule) */}
              {scheduleSubTab === 'days' && (
                <div className="space-y-4 animate-in fade-in">
                  {weekSchedule.map((day, dayIdx) => (
                    <div
                      key={day.dayName}
                      className="py-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0 space-y-2.5"
                    >
                      {/* Day Title & Checkbox */}
                      <div className="flex items-center justify-end gap-3">
                        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {day.dayName}
                        </span>
                        <input
                          type="checkbox"
                          checked={day.enabled}
                          onChange={() => toggleDayEnabled(dayIdx)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 dark:bg-slate-800 cursor-pointer"
                        />
                      </div>

                      {/* Slot Pairs */}
                      {day.enabled && (
                        <div className="space-y-2">
                          {day.slots.map((s, slotIdx) => (
                            <div
                              key={s.id}
                              className="flex items-center justify-between gap-3"
                            >
                              {/* Action Button: (+) Green for first slot, (-) Red for additional */}
                              {slotIdx === 0 ? (
                                <button
                                  type="button"
                                  onClick={() => addSlotToDay(dayIdx)}
                                  className="w-9 h-9 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-bold text-lg shrink-0 cursor-pointer transition-colors"
                                  title="إضافة فترة"
                                >
                                  +
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => removeSlotFromDay(dayIdx, slotIdx)}
                                  className="w-9 h-9 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center font-bold text-lg shrink-0 cursor-pointer transition-colors"
                                  title="حذف الفترة"
                                >
                                  -
                                </button>
                              )}

                              {/* End Time Box */}
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={s.endTime}
                                  onChange={(e) => updateSlotTimes(dayIdx, slotIdx, s.startTime, e.target.value)}
                                  className="w-full text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 text-xs sm:text-sm font-mono font-medium text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-hidden"
                                />
                              </div>

                              {/* Start Time Box */}
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={s.startTime}
                                  onChange={(e) => updateSlotTimes(dayIdx, slotIdx, e.target.value, s.endTime)}
                                  className="w-full text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 text-xs sm:text-sm font-mono font-medium text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-hidden"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: التواريخ (Exact Matching IMG-20261007-WA0006.jpg) */}
              {scheduleSubTab === 'dates' && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Title & + إضافة Header matching screenshot */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddCustomDateModalOpen(true)}
                      className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:underline cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>إضافة</span>
                    </button>

                    <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                      تغيير الجدول في تواريخ معيّنة
                    </h2>
                  </div>

                  {/* List of Custom Override Dates */}
                  {scheduleCustomDates.length > 0 ? (
                    <div className="space-y-3">
                      {scheduleCustomDates.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between text-right"
                        >
                          <button
                            type="button"
                            onClick={() => setScheduleCustomDates(prev => prev.filter(cd => cd.id !== item.id))}
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
                            title="حذف التاريخ المستثنى"
                          >
                            حذف
                          </button>

                          <div>
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {item.title}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                                {item.isAvailable ? 'فترة خاصة' : 'إجازة / غير متاح'}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 block mt-1 font-mono">
                              {item.date} {item.isAvailable && item.startTime ? `(${item.startTime} - ${item.endTime})` : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center space-y-2">
                      <p className="text-xs text-slate-400">
                        لم يتم إضافة أي تواريخ مستثناة أو إجازات خاصة بعد.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsAddCustomDateModalOpen(true)}
                        className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>انقر هنا لإضافة استثناء تاريخ</span>
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: المعلومات (Exact Matching IMG-20261007-WA0011.jpg) */}
              {scheduleSubTab === 'info' && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Title: معلومات الجدول matching screenshot */}
                  <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white text-center pb-1">
                    معلومات الجدول
                  </h2>

                  <div className="space-y-3.5">
                    
                    {/* 1. السعة الأسبوعية */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 space-y-0.5 shadow-2xs">
                      <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal block text-right">
                        السعة الأسبوعية
                      </span>
                      <input
                        type="text"
                        value={scheduleWeeklyCapacity}
                        onChange={(e) => setScheduleWeeklyCapacity(e.target.value)}
                        className="w-full text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 bg-transparent text-right focus:outline-hidden font-sans"
                        placeholder="10"
                      />
                    </div>

                    {/* 2. الحد الأدنى للسعة اليومية */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 space-y-0.5 shadow-2xs">
                      <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal block text-right">
                        الحد الأدنى للسعة اليومية
                      </span>
                      <input
                        type="text"
                        value={scheduleMinDailyCapacity}
                        onChange={(e) => setScheduleMinDailyCapacity(e.target.value)}
                        className="w-full text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 bg-transparent text-right focus:outline-hidden font-sans"
                        placeholder="0"
                      />
                    </div>

                    {/* 3. الحد الأعلى للسعة اليومية */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 space-y-0.5 shadow-2xs">
                      <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal block text-right">
                        الحد الأعلى للسعة اليومية
                      </span>
                      <input
                        type="text"
                        value={scheduleMaxDailyCapacity}
                        onChange={(e) => setScheduleMaxDailyCapacity(e.target.value)}
                        className="w-full text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 bg-transparent text-right focus:outline-hidden font-sans"
                        placeholder="7"
                      />
                    </div>

                    {/* 4. اقرب موعد يمكن حجزه (بالساعات) */}
                    <div>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 space-y-0.5 shadow-2xs">
                        <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal block text-right">
                          اقرب موعد يمكن حجزه (بالساعات)
                        </span>
                        <input
                          type="text"
                          value={scheduleEarliestBookingHours}
                          onChange={(e) => setScheduleEarliestBookingHours(e.target.value)}
                          className="w-full text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 bg-transparent text-right focus:outline-hidden font-sans"
                          placeholder="5"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block text-right mt-1 font-normal pr-1">
                        يجب ألا يزيد الرقم المدخل عن 24
                      </span>
                    </div>

                    {/* 5. ابعد موعد يمكن حجزه (بالأيام) */}
                    <div>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 space-y-0.5 shadow-2xs">
                        <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal block text-right">
                          ابعد موعد يمكن حجزه (بالأيام)
                        </span>
                        <input
                          type="text"
                          value={scheduleLatestBookingDays}
                          onChange={(e) => setScheduleLatestBookingDays(e.target.value)}
                          className="w-full text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 bg-transparent text-right focus:outline-hidden font-sans"
                          placeholder="7"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block text-right mt-1 font-normal pr-1">
                        يجب ألا يقل الرقم المدخل عن 7
                      </span>
                    </div>

                    {/* 6. Timezone Location Dropdown (Asia/Aden) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsScheduleTimezoneDropdownOpen(prev => !prev)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between shadow-2xs cursor-pointer text-right hover:border-slate-300 transition-colors"
                      >
                        <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-300 stroke-[2]" />
                        <span className="text-base font-medium text-slate-800 dark:text-slate-100 font-sans">
                          {scheduleTimezoneLocation}
                        </span>
                      </button>

                      {isScheduleTimezoneDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in">
                          {[
                            'Asia/Aden',
                            'Asia/Riyadh',
                            'Asia/Dubai',
                            'Africa/Cairo',
                            'Asia/Amman',
                            'Asia/Kuwait',
                            'Asia/Qatar',
                            'Europe/London',
                            'America/New_York'
                          ].map(tz => (
                            <button
                              key={tz}
                              type="button"
                              onClick={() => {
                                setScheduleTimezoneLocation(tz);
                                setIsScheduleTimezoneDropdownOpen(false);
                              }}
                              className={`w-full p-2.5 text-right font-mono text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 ${
                                scheduleTimezoneLocation === tz ? 'bg-blue-50 text-[#1546a0] font-bold' : 'text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              {tz}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* Sticky Save Blue Button matching screenshot */}
            <div className="p-4 sm:px-6 bg-white/95 dark:bg-slate-900/95 border-t border-slate-100 dark:border-slate-800 absolute bottom-0 inset-x-0 z-20 backdrop-blur-xs">
              <div className="max-w-xl mx-auto w-full">
                <button
                  type="button"
                  onClick={handleSaveSchedule}
                  className="w-full py-3.5 bg-[#1546a0] hover:bg-[#103680] text-white font-bold text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  {isScheduleSaveSuccess ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-300" />
                      <span>تم حفظ أوقاتك بنجاح ✓</span>
                    </>
                  ) : (
                    <span>حفظ</span>
                  )}
                </button>
              </div>
            </div>

            {/* Add Custom Date Override Modal */}
            {isAddCustomDateModalOpen && (
              <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4 transition-colors">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <button onClick={() => setIsAddCustomDateModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      إضافة تاريخ مستثنى من الجدول
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        اختر التاريخ:
                      </label>
                      <input
                        type="date"
                        value={newCustomDateDate}
                        onChange={(e) => setNewCustomDateDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        العنوان / سبب الاستثناء:
                      </label>
                      <input
                        type="text"
                        value={newCustomDateTitle}
                        onChange={(e) => setNewCustomDateTitle(e.target.value)}
                        placeholder="مثال: إجازة وطنية / عطلة خاصة"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white text-right"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <input
                        type="checkbox"
                        checked={newCustomDateIsAvailable}
                        onChange={(e) => setNewCustomDateIsAvailable(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        هل ترغب بتحديد ساعات عمل خاصة لهذا اليوم؟
                      </span>
                    </div>

                    {newCustomDateIsAvailable && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-0.5">وقت الانتهاء:</label>
                          <input
                            type="text"
                            value={newCustomDateEndTime}
                            onChange={(e) => setNewCustomDateEndTime(e.target.value)}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs text-center font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-0.5">وقت البدء:</label>
                          <input
                            type="text"
                            value={newCustomDateStartTime}
                            onChange={(e) => setNewCustomDateStartTime(e.target.value)}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-xs text-center font-mono"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const newEntry = {
                          id: `cd-${Date.now()}`,
                          date: newCustomDateDate,
                          title: newCustomDateTitle,
                          isAvailable: newCustomDateIsAvailable,
                          startTime: newCustomDateIsAvailable ? newCustomDateStartTime : undefined,
                          endTime: newCustomDateIsAvailable ? newCustomDateEndTime : undefined
                        };
                        setScheduleCustomDates(prev => [newEntry, ...prev]);
                        setIsAddCustomDateModalOpen(false);
                      }}
                      className="w-full py-3 bg-[#1546a0] hover:bg-[#103680] text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer transition-colors mt-2"
                    >
                      إضافة إلى الجدول
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==============================================================
            WINDOW 5: حسابي (IMG-20261007-WA0014.jpg)
           ============================================================== */}
        {activeWindow === 'account' && (
          <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden min-h-[78vh] transition-colors">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                حسابي
              </h1>
            </div>

            {/* Doctor Card with Avatar, Name, Pencil */}
            <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3 max-w-2xl mx-auto w-full">
              {/* Profile Save Toast */}
              {profileSaveSuccessToast && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{profileSaveSuccessToast}</span>
                </div>
              )}

              {/* Language Changed Toast */}
              {languageToast && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>{languageToast}</span>
                </div>
              )}

              {/* Timezone Changed Toast */}
              {timezoneToast && (
                <div className="p-3 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>{timezoneToast}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                {/* Edit Icon Circle on left */}
                <button
                  type="button"
                  onClick={() => {
                    setTempFirstName(doctorFirstName);
                    setTempLastName(doctorLastName);
                    setTempName(doctorName);
                    setTempProfileEmail(doctorEmail);
                    setTempPhoneRaw(doctorPhoneRaw);
                    setTempCountryCode(doctorCountryCode);
                    setTempCountryFlag(doctorCountryFlag);
                    setTempAvatar(doctorAvatar);
                    setIsEditProfileModalOpen(true);
                  }}
                  className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors cursor-pointer border border-teal-100 dark:border-teal-900/40 shadow-xs hover:scale-105"
                  title="تعديل الحساب والملف الشخصي"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Doctor Name & Photo */}
                <div className="flex items-center gap-3.5">
                  <div className="text-right">
                    <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white block">
                      {doctorName}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {doctorSpecialty}
                    </span>
                  </div>

                  <img
                    src={doctorAvatar}
                    alt={doctorName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-teal-600/30 dark:border-teal-400/30 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Menu List Items Exactly as Image */}
            <div className="flex-1 overflow-y-auto px-6 divide-y divide-slate-100 dark:divide-slate-800 max-w-2xl mx-auto w-full">
              
              {/* 1. قائمة المرضى */}
              <button
                type="button"
                onClick={() => setIsPatientsListModalOpen(true)}
                className="w-full py-4.5 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <div className="flex items-center gap-3.5">
                  <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                    قائمة المرضى
                  </span>
                  <ClipboardList className="w-5 h-5 text-slate-700 dark:text-slate-300 stroke-[1.8]" />
                </div>
              </button>

              {/* 2. مجموعات الدعم الجماعية */}
              <button
                type="button"
                onClick={() => setIsSupportGroupsModalOpen(true)}
                className="w-full py-4.5 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <div className="flex items-center gap-3.5">
                  <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                    مجموعات الدعم الجماعية
                  </span>
                  <Users className="w-5 h-5 text-slate-700 dark:text-slate-300 stroke-[1.8]" />
                </div>
              </button>

              {/* 3. الإحصائيات */}
              <button
                type="button"
                onClick={() => setIsStatsModalOpen(true)}
                className="w-full py-4.5 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <div className="flex items-center gap-3.5">
                  <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                    الإحصائيات
                  </span>
                  <BarChart3 className="w-5 h-5 text-slate-700 dark:text-slate-300 stroke-[1.8]" />
                </div>
              </button>

              {/* 4. مكتبة المحتوى */}
              <button
                type="button"
                onClick={() => setIsLibraryModalOpen(true)}
                className="w-full py-4.5 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <div className="flex items-center gap-3.5">
                  <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                    مكتبة المحتوى
                  </span>
                  <BookOpen className="w-5 h-5 text-slate-700 dark:text-slate-300 stroke-[1.8]" />
                </div>
              </button>

              {/* 5. اللغة */}
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(true)}
                className="w-full py-4.5 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">{selectedLanguage}</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                    اللغة
                  </span>
                  <Globe className="w-5 h-5 text-slate-700 dark:text-slate-300 stroke-[1.8]" />
                </div>
              </button>

              {/* 6. المنطقة الزمنية */}
              <button
                type="button"
                onClick={() => {
                  setTempTimezoneMode(timezoneMode);
                  setTempSelectedTimezone(selectedTimezone);
                  setIsTimezoneModalOpen(true);
                }}
                className="w-full py-4.5 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md font-mono">
                    {timezoneMode === 'auto' ? '(UTC+3) 03+' : selectedTimezone.split(' ')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                    المنطقة الزمنية
                  </span>
                  <Clock className="w-5 h-5 text-slate-700 dark:text-slate-300 stroke-[1.8]" />
                </div>
              </button>

              {/* 7. العودة إلى الصفحة الرسمية للمنصة */}
              <button
                type="button"
                onClick={onReturnToMainPage}
                className="w-full py-4.5 px-2 flex items-center justify-between hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors cursor-pointer text-teal-800 dark:text-teal-300"
              >
                <ChevronLeft className="w-4 h-4 text-teal-500" />
                <div className="flex items-center gap-3.5">
                  <span className="font-bold text-sm sm:text-base">
                    العودة إلى الصفحة الرسمية للمنصة
                  </span>
                  <Home className="w-5 h-5 text-teal-600 dark:text-teal-400 stroke-[1.8]" />
                </div>
              </button>

              {/* 8. محطة العمل السريرية الموسعة */}
              <button
                type="button"
                onClick={() => setActiveWindow('workstation')}
                className="w-full py-4.5 px-2 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer text-blue-900 dark:text-blue-300"
              >
                <ChevronLeft className="w-4 h-4 text-blue-500" />
                <div className="flex items-center gap-3.5">
                  <span className="font-bold text-sm sm:text-base">
                    محطة العمل السريرية الموسعة
                  </span>
                  <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400 stroke-[1.8]" />
                </div>
              </button>

              {/* 9. تسجيل الخروج */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onSwitchStaff}
                  className="w-full py-4.5 px-2 flex items-center justify-end gap-3.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer rounded-xl"
                >
                  <span className="font-bold text-sm sm:text-base">
                    تسجيل الخروج
                  </span>
                  <LogOut className="w-5 h-5 stroke-[1.8]" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ==============================================================
            WINDOW 6: محطة العمل السريرية الموسعة (نافذة سادسة)
           ============================================================== */}
        {activeWindow === 'workstation' && (
          <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden min-h-[82vh] transition-colors">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-teal-400" />
                  <span>محطة العمل السريرية الموسعة</span>
                </h1>
                <p className="text-xs text-slate-300 mt-0.5">
                  فحص الحالة العقلية MSE، ملاحظات SOAP، الوصفات الطبية E-Rx، المقاييس والتقارير الطبية
                </p>
              </div>

              {/* Sub Navigation Strip */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setWorkstationTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    workstationTab === 'dashboard' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  لوحة القيادة
                </button>
                <button
                  type="button"
                  onClick={() => setWorkstationTab('clinical_forms')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    workstationTab === 'clinical_forms' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  النماذج الإكلينيكية MSE/SOAP
                </button>
                <button
                  type="button"
                  onClick={() => setWorkstationTab('prescriptions')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    workstationTab === 'prescriptions' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  الوصفات E-Rx
                </button>
                <button
                  type="button"
                  onClick={() => setWorkstationTab('psychiatry')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    workstationTab === 'psychiatry' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  دليل DSM-5
                </button>
                <button
                  type="button"
                  onClick={() => setWorkstationTab('scales')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    workstationTab === 'scales' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  المقاييس النفسية
                </button>
                <button
                  type="button"
                  onClick={() => setWorkstationTab('reports')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    workstationTab === 'reports' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  التقارير
                </button>
              </div>
            </div>

            {/* Workstation Tab Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {workstationTab === 'dashboard' && (
                <DashboardView
                  patients={patients}
                  activePatient={activePatient}
                  onSelectPatient={onSelectPatient}
                  scaleResults={scaleResults}
                  prescriptions={prescriptions}
                  appointments={appointments}
                  onUpdateAppointmentStatus={onUpdateAppointmentStatus}
                  onOpenQuickScale={onOpenScaleRunner}
                  onOpenNewPrescription={onOpenNewPrescription}
                  onOpenClinicalForm={onOpenClinicalForm}
                  onOpenOverviewModal={() => {}}
                  onNavigateTab={(tab) => {
                    if (tab === 'prescriptions') setWorkstationTab('prescriptions');
                    else if (tab === 'scales') setWorkstationTab('scales');
                    else if (tab === 'clinical_forms') setWorkstationTab('clinical_forms');
                    else if (tab === 'psychiatry') setWorkstationTab('psychiatry');
                    else if (tab === 'reports') setWorkstationTab('reports');
                  }}
                  currentRole={currentStaff?.role || 'psychiatrist'}
                  currentStaff={currentStaff}
                  onOpenPatientFileModal={onOpenPatientFile}
                  onOpenSendScaleModal={() => onOpenScaleRunner('phq-9')}
                  onOpenChatWithPatient={(p) => {
                    onSelectPatient(p);
                    setActiveWindow('chats');
                  }}
                />
              )}

              {workstationTab === 'clinical_forms' && (
                <ClinicalFormsView
                  activePatient={activePatient}
                  onOpenClinicalForm={onOpenClinicalForm}
                  currentStaff={currentStaff}
                />
              )}

              {workstationTab === 'prescriptions' && (
                <PrescriptionsView
                  prescriptions={prescriptions}
                  activePatient={activePatient}
                  onOpenNewPrescription={onOpenNewPrescription}
                  currentRole={currentStaff?.role || 'psychiatrist'}
                  currentStaff={currentStaff}
                />
              )}

              {workstationTab === 'psychiatry' && (
                <PsychiatryView
                  onOpenQuickScale={onOpenScaleRunner}
                  onOpenNewPrescription={onOpenNewPrescription}
                />
              )}

              {workstationTab === 'scales' && (
                <ScalesView
                  activePatient={activePatient}
                  scaleResults={scaleResults}
                  onLaunchScale={onOpenScaleRunner}
                />
              )}

              {workstationTab === 'reports' && (
                <DoctorReportsTab
                  patients={patients}
                  activePatient={activePatient}
                  currentStaff={currentStaff}
                />
              )}

              {workstationTab === 'financials' && (
                <DoctorFinancialsTab
                  currentStaff={currentStaff}
                />
              )}
            </div>

          </div>
        )}

      </div>

      {/* ==============================================================
          THE 6-TAB BOTTOM NAVIGATION BAR (FIXED FULL-SCREEN ACROSS VIEWPORT)
          RTL Order:
          1. محطة العمل (Rightmost - قبل المحادثة)
          2. المحادثات
          3. المواعيد
          4. الإشعارات (48)
          5. جدولي
          6. حسابي (Leftmost)
         ============================================================== */}
      <nav 
        aria-label="Doctor Navigation Bar"
        className="fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 sm:px-8 py-2 flex items-center justify-around shadow-2xl w-full transition-colors"
      >
        {/* 1. محطة العمل السريرية الموسعة (قبل زر المحادثة كما طُلب) */}
        <button
          type="button"
          onClick={() => setActiveWindow('workstation')}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-1 transition-colors cursor-pointer ${
            activeWindow === 'workstation'
              ? 'text-teal-700 dark:text-teal-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Stethoscope className={`w-5 h-5 ${activeWindow === 'workstation' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] sm:text-xs">محطة العمل</span>
        </button>

        {/* 2. المحادثة */}
        <button
          type="button"
          onClick={() => setActiveWindow('chats')}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-1 transition-colors cursor-pointer ${
            activeWindow === 'chats'
              ? 'text-teal-700 dark:text-teal-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <MessageSquare className={`w-5 h-5 ${activeWindow === 'chats' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] sm:text-xs">المحادثة</span>
        </button>

        {/* 3. المواعيد */}
        <button
          type="button"
          onClick={() => setActiveWindow('appointments')}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-1 transition-colors cursor-pointer ${
            activeWindow === 'appointments'
              ? 'text-teal-700 dark:text-teal-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Calendar className={`w-5 h-5 ${activeWindow === 'appointments' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] sm:text-xs">المواعيد</span>
        </button>

        {/* 4. الإشعارات (with badge 48) */}
        <button
          type="button"
          onClick={() => setActiveWindow('notifications')}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-1 transition-colors relative cursor-pointer ${
            activeWindow === 'notifications'
              ? 'text-teal-700 dark:text-teal-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <div className="relative">
            <Bell className={`w-5 h-5 ${activeWindow === 'notifications' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[17px] h-[17px] bg-[#d92d20] text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadNotifCount}
              </span>
            )}
          </div>
          <span className="text-[11px] sm:text-xs">الإشعارات</span>
        </button>

        {/* 5. جدولي */}
        <button
          type="button"
          onClick={() => setActiveWindow('schedule')}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-1 transition-colors cursor-pointer ${
            activeWindow === 'schedule'
              ? 'text-teal-700 dark:text-teal-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <CalendarClock className={`w-5 h-5 ${activeWindow === 'schedule' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] sm:text-xs">جدولي</span>
        </button>

        {/* 6. حسابي */}
        <button
          type="button"
          onClick={() => setActiveWindow('account')}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-1 transition-colors cursor-pointer ${
            activeWindow === 'account'
              ? 'text-teal-700 dark:text-teal-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <User className={`w-5 h-5 ${activeWindow === 'account' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] sm:text-xs">حسابي</span>
        </button>
      </nav>

      {/* ==============================================================
          MODALS & OVERLAYS
         ============================================================== */}
      
      {/* Live Chat Modal (Identical Layout & Styling to Main Page DoctorChatModal) */}
      {selectedChatPatient && (() => {
        const chatKey = selectedChatPatient.id || selectedChatPatient.name || 'default';
        const activeMsgs = conversationMessages[chatKey] || [];

        const handleSendTextMessage = (overrideText?: string) => {
          const textToSend = (overrideText || activeChatText).trim();
          if (!textToSend) return;
          const newMsg = {
            id: 'msg-' + Date.now(),
            sender: 'me' as const,
            type: 'text' as const,
            text: textToSend,
            replyTo: quotedChatMessage ? { id: quotedChatMessage.id, text: quotedChatMessage.text, senderName: quotedChatMessage.sender } : undefined,
            time: 'الآن'
          };
          setConversationMessages(prev => ({
            ...prev,
            [chatKey]: [...(prev[chatKey] || []), newMsg]
          }));
          setActiveChatText('');
          setQuotedChatMessage(null);
          onSendMessage(textToSend, currentStaff?.doctorId || 'doc-hakim');
        };

        const handleStartVoiceRecording = async () => {
          setAudioError(null);
          setIsPdfMenuOpen(false);
          setIsRecordingVoice(true); // Open recording state immediately
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
            } else {
              setAudioError('تسجيل محاكاة إكلينيكية (المتصفح لا يدعم المايك المباشر)');
            }
          } catch (err: any) {
            console.warn('Microphone permission notice:', err);
            setAudioError('تسجيل محاكاة إكلينيكية (يرجى السماح بالمايك للتسجيل المباشر)');
          }
        };

        const handleCancelVoiceRecording = () => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            try { mediaRecorderRef.current.stop(); } catch (e) {}
          }
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
          }
          audioChunksRef.current = [];
          setIsRecordingVoice(false);
          setVoiceRecordSeconds(0);
          setAudioError(null);
        };

        const handleSendVoiceRecording = () => {
          const duration = Math.max(1, voiceRecordSeconds);
          const formatted = `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`;
          const recorder = mediaRecorderRef.current;

          const finalizeSend = (audioBlobUrl?: string) => {
            // Guarantee a valid, playable WAV audio blob URL if no mic stream was captured
            const finalAudioUrl = audioBlobUrl || generatePlayableAudioBlob(duration);
            const newMsg = {
              id: 'voice-' + Date.now(),
              sender: 'me' as const,
              type: 'voice' as const,
              audioUrl: finalAudioUrl,
              voiceDuration: formatted,
              replyTo: quotedChatMessage ? { id: quotedChatMessage.id, text: quotedChatMessage.text, senderName: quotedChatMessage.sender } : undefined,
              time: 'الآن'
            };
            setConversationMessages(prev => ({
              ...prev,
              [chatKey]: [...(prev[chatKey] || []), newMsg]
            }));
            setIsRecordingVoice(false);
            setVoiceRecordSeconds(0);
            setQuotedChatMessage(null);
            setAudioError(null);
          };

          if (recorder && recorder.state !== 'inactive') {
            recorder.onstop = () => {
              let audioBlobUrl = '';
              if (audioChunksRef.current.length > 0) {
                const mimeType = recorder.mimeType || 'audio/webm';
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                audioBlobUrl = URL.createObjectURL(audioBlob);
              }
              finalizeSend(audioBlobUrl);
            };
            try { recorder.stop(); } catch (e) {}
          } else {
            finalizeSend();
          }

          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
          }
        };

        const handleTogglePlayAudio = (msgId: string, audioUrl?: string) => {
          if (playingVoiceId === msgId) {
            if (currentAudioElementRef.current) {
              currentAudioElementRef.current.pause();
            }
            setPlayingVoiceId(null);
            return;
          }

          if (currentAudioElementRef.current) {
            currentAudioElementRef.current.pause();
          }

          setPlayingVoiceId(msgId);
          setPlayingVoiceProgress(0);

          const playableUrl = audioUrl || generatePlayableAudioBlob(3);

          if (playableUrl) {
            const audio = new Audio(playableUrl);
            currentAudioElementRef.current = audio;

            audio.play().then(() => {
              // Playing audio
            }).catch(e => {
              console.warn('Audio play notice:', e);
            });

            audio.ontimeupdate = () => {
              if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
                const prog = Math.min(100, Math.round((audio.currentTime / audio.duration) * 100));
                setPlayingVoiceProgress(prog);
              }
            };

            audio.onended = () => {
              setPlayingVoiceId(null);
              setPlayingVoiceProgress(100);
            };

            audio.onerror = () => {
              setPlayingVoiceId(null);
            };
          }
        };

        const handleSendPdf = (pdfName: string, pdfSize: string) => {
          const newMsg = {
            id: 'pdf-' + Date.now(),
            sender: 'me' as const,
            type: 'pdf' as const,
            pdfName,
            pdfSize,
            replyTo: quotedChatMessage ? { id: quotedChatMessage.id, text: quotedChatMessage.text, senderName: quotedChatMessage.sender } : undefined,
            time: 'الآن'
          };
          setConversationMessages(prev => ({
            ...prev,
            [chatKey]: [...(prev[chatKey] || []), newMsg]
          }));
          setIsPdfMenuOpen(false);
          setQuotedChatMessage(null);
        };

        const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            const sizeStr = `${sizeMB} MB`;
            handleSendPdf(file.name, sizeStr);
          }
        };

        const handleClearCurrentChat = () => {
          if (confirm(`هل تريد مسح جميع رسائل المحادثة مع ${selectedChatPatient.name}؟`)) {
            setConversationMessages(prev => ({
              ...prev,
              [chatKey]: []
            }));
          }
        };

        const handleAddReaction = (msgId: string, emoji: string) => {
          setMessageReactions(prev => ({
            ...prev,
            [msgId]: prev[msgId] === emoji ? '' : emoji
          }));
        };

        const contactAvatar = selectedChatPatient.rawPatient?.avatar || selectedChatPatient.avatar || null;
        const contactLetter = selectedChatPatient.name ? selectedChatPatient.name.charAt(0) : 'م';

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
            <div 
              className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-right transition-all duration-200 ${
                isChatFullScreen 
                  ? 'w-full h-full rounded-none max-w-none' 
                  : 'w-full max-w-3xl h-[88vh] max-h-[760px] rounded-3xl'
              }`}
            >
              
              {/* Top Header - Exact Main Page Teal-Slate Gradient */}
              <div className="p-3.5 sm:p-4 bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white flex items-center justify-between gap-3 shadow-md shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    {contactAvatar ? (
                      <img 
                        src={contactAvatar} 
                        alt={selectedChatPatient.name} 
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover border-2 border-teal-400/50 shadow-sm"
                      />
                    ) : (
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${selectedChatPatient.color || 'bg-teal-700'} text-white font-bold text-lg flex items-center justify-center border-2 border-teal-400/50 shadow-sm`}>
                        {contactLetter}
                      </div>
                    )}
                    <span 
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" 
                      title="متصل الآن"
                    />
                  </div>
                  
                  <div className="min-w-0 text-right">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-white truncate">{selectedChatPatient.name}</h3>
                      <span className="px-2 py-0.5 bg-teal-500/20 text-teal-200 text-[10px] font-bold rounded-full border border-teal-400/30">
                        {selectedChatPatient.role || selectedChatPatient.rawPatient?.primaryDiagnosis || 'استشارة سريرية'}
                      </span>
                    </div>
                    <p className="text-[11px] text-teal-200/80 truncate mt-0.5 flex items-center justify-end gap-1.5">
                      <span className="text-teal-300 font-bold">🔒 تشفير طبي 256-bit</span>
                      <span>·</span>
                      <span>متاح للمحادثة والرد الإكلينيكي</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    </p>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {selectedChatPatient.rawPatient && (
                    <button
                      type="button"
                      onClick={() => onOpenPatientFile(selectedChatPatient.rawPatient)}
                      className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                      title="فتح الملف السريري للمراجع"
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      <span>الملف السريري</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleClearCurrentChat}
                    className="p-2 text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 rounded-xl transition cursor-pointer"
                    title="مسح رسائل هذه المحادثة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsChatFullScreen(!isChatFullScreen)}
                    className="p-2 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                    title={isChatFullScreen ? 'تصغير' : 'ملء الشاشة'}
                  >
                    {isChatFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRecordingVoice(false);
                      setIsPdfMenuOpen(false);
                      setSelectedChatPatient(null);
                    }}
                    className="p-2 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                    title="إغلاق النافذة"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Security Notice Strip */}
              <div className="bg-teal-950/40 border-b border-teal-800/30 px-4 py-1.5 flex items-center justify-between text-[11px] text-teal-300 shrink-0">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>محادثة طبية مشفرة بالكامل ومعتمدة وفق معايير الخصوصية السريرية HIPAA</span>
                </div>
                <span className="text-[10px] opacity-75 hidden sm:inline font-mono">CoolMind Tele-Mental</span>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#f8fafc] dark:bg-slate-950">
                {activeMsgs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-900/40 shadow-xs">
                      <MessageSquare className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                        محادثة سريرية مباشرة مع {selectedChatPatient.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                        تم تفريغ الرسائل السابقة. يمكنك الآن إرسال ردود إكلينيكية، تسجيلات صوتية، أو إرفاق ملفات ومقاييس PDF.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsRecordingVoice(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 rounded-xl text-xs font-bold border border-teal-200 dark:border-teal-800 cursor-pointer shadow-2xs"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>تسجيل صوتي</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPdfMenuOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800 cursor-pointer shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>إرسال مستند PDF</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  activeMsgs.map((msg) => {
                    const isMe = msg.sender === 'me';
                    const reaction = messageReactions[msg.id];
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl shadow-xs text-right space-y-1.5 transition-all ${
                            isMe
                              ? 'bg-teal-700 text-white rounded-tl-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tr-xs border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {/* Quoted Message Preview if replying */}
                          {msg.replyTo && (
                            <div className={`p-2 rounded-xl text-xs mb-1.5 border-r-4 ${
                              isMe 
                                ? 'bg-teal-800/80 border-amber-300 text-teal-100' 
                                : 'bg-slate-100 dark:bg-slate-700/60 border-teal-500 text-slate-600 dark:text-slate-300'
                            }`}>
                              <span className="font-bold text-[10px] block opacity-80">{msg.replyTo.senderName || 'رسالة مقتبسة'}:</span>
                              <p className="truncate text-[11px]">{msg.replyTo.text}</p>
                            </div>
                          )}

                          {/* TEXT MESSAGE */}
                          {msg.type === 'text' && (
                            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.text}
                            </p>
                          )}

                          {/* VOICE MESSAGE */}
                          {msg.type === 'voice' && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleTogglePlayAudio(msg.id, msg.audioUrl)}
                                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-transform ${
                                    isMe
                                      ? 'bg-white text-teal-800 hover:scale-105 shadow-xs'
                                      : 'bg-teal-600 text-white hover:scale-105 shadow-xs'
                                  }`}
                                  title={playingVoiceId === msg.id ? 'إيقاف التشغيل' : 'تشغيل التسجيل المباشر'}
                                >
                                  {playingVoiceId === msg.id ? (
                                    <Pause className="w-4 h-4 fill-current" />
                                  ) : (
                                    <Play className="w-4 h-4 fill-current ml-0.5 rtl:rotate-180" />
                                  )}
                                </button>

                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-1 h-5">
                                    {[30, 70, 45, 90, 60, 35, 80, 50, 95, 40, 65, 85, 30, 55].map((val, idx) => {
                                      const isPassed = playingVoiceId === msg.id && (idx / 14) * 100 <= playingVoiceProgress;
                                      return (
                                        <span
                                          key={idx}
                                          style={{ height: `${val}%` }}
                                          className={`w-1 rounded-full transition-all ${
                                            isMe
                                              ? isPassed ? 'bg-amber-300' : 'bg-teal-300/60'
                                              : isPassed ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                                          }`}
                                        />
                                      );
                                    })}
                                  </div>
                                  <div className="flex items-center justify-between text-[10px] opacity-80">
                                    <span>تسجيل صوتي إكلينيكي</span>
                                    <span className="font-mono">{msg.voiceDuration || '0:12'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* PDF & CLINICAL ATTACHMENT MESSAGE */}
                          {msg.type === 'pdf' && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/10 dark:bg-white/5 border border-white/10">
                                <div className="w-10 h-10 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0 text-right">
                                  <h5 className="font-bold text-xs truncate">
                                    {msg.pdfName || 'مستند_إكلينيكي.pdf'}
                                  </h5>
                                  <span className="text-[10px] opacity-80 block font-mono">
                                    {msg.pdfSize || '1.2 MB'} · مستند PDF طبي
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setSelectedPdfPreview({
                                    title: msg.pdfName || 'تقرير الجلسة الإكلينيكية',
                                    size: msg.pdfSize || '1.2 MB',
                                    type: 'clinical_report',
                                    patientName: selectedChatPatient.name,
                                    date: 'أكتوبر 2026',
                                    doctorName: doctorName
                                  })}
                                  className={`flex-1 py-1 px-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                                    isMe
                                      ? 'bg-white text-teal-800 hover:bg-teal-50'
                                      : 'bg-teal-700 text-white hover:bg-teal-800'
                                  }`}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>معاينة PDF</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    alert(`جاري تحميل ملف ${msg.pdfName || 'المستند.pdf'}...`);
                                  }}
                                  className={`p-1 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                                    isMe
                                      ? 'bg-teal-800/80 text-white hover:bg-teal-900'
                                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                                  }`}
                                  title="تحميل الملف"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Message Timestamp & Status */}
                          <div className={`text-[10px] flex items-center justify-between pt-0.5 ${isMe ? 'text-teal-200' : 'text-slate-400'}`}>
                            <span>{msg.time}</span>
                            {isMe && <span>مقروء ✓✓</span>}
                          </div>
                        </div>

                        {/* Emoji Reactions & Action Toolbar on Hover */}
                        <div className="flex items-center gap-1 mt-1 px-1">
                          {reaction && (
                            <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded-full text-xs shadow-2xs border border-slate-200 dark:border-slate-700">
                              {reaction}
                            </span>
                          )}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-full shadow-2xs border border-slate-200 dark:border-slate-700">
                            {['👍', '❤️', '👏', '😊', '🙏'].map(emoji => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => handleAddReaction(msg.id, emoji)}
                                className="hover:scale-125 text-xs transition cursor-pointer px-0.5"
                              >
                                {emoji}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => setQuotedChatMessage({ id: msg.id, text: msg.text || msg.pdfName || 'تسجيل صوتي', sender: isMe ? doctorName : selectedChatPatient.name })}
                              className="p-1 text-slate-400 hover:text-teal-600 cursor-pointer"
                              title="اقتباس في الرد"
                            >
                              <Quote className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Quoted Message Active Bar */}
              {quotedChatMessage && (
                <div className="p-2 px-4 bg-teal-50 dark:bg-teal-950/60 border-t border-teal-200 dark:border-teal-800 flex items-center justify-between text-xs text-teal-800 dark:text-teal-200">
                  <div className="flex items-center gap-2 truncate">
                    <Quote className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="font-bold">{quotedChatMessage.sender}:</span>
                    <span className="truncate opacity-80">{quotedChatMessage.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuotedChatMessage(null)}
                    className="p-1 text-teal-600 hover:text-teal-800 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* PDF & Clinical Attachment Menu */}
              {isPdfMenuOpen && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 text-right space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setIsPdfMenuOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-rose-500" />
                      <span>خيارات الإرفاق والمشاركة السريرية</span>
                    </span>
                  </div>

                  {/* 4 Rich Clinical Action Cards matching Main Page DoctorChatModal */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 text-right flex items-center gap-2 transition cursor-pointer shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div className="text-[11px] min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">إرفاق ملف / فحص</p>
                        <p className="text-[9px] text-slate-400 truncate">PDF, صور، تحاليل</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendPdf('مقياس_الاكتئاب_والقلق_PHQ9_GAD7.pdf', '1.5 MB')}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 text-right flex items-center gap-2 transition cursor-pointer shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="text-[11px] min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">نتيجة مقياس نفسي</p>
                        <p className="text-[9px] text-slate-400 truncate">PHQ-9 / GAD-7</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendPdf('سجل_تفنيد_الأفكار_CBT.pdf', '980 KB')}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 text-right flex items-center gap-2 transition cursor-pointer shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-[11px] min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">واجب معرفي CBT</p>
                        <p className="text-[9px] text-slate-400 truncate">سجل الأفكار</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendPdf('الوصفة_الطبية_E_Prescription.pdf', '420 KB')}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 text-right flex items-center gap-2 transition cursor-pointer shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div className="text-[11px] min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">استفسار دوائي</p>
                        <p className="text-[9px] text-slate-400 truncate">الوصفة والجرعات</p>
                      </div>
                    </button>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">نماذج التقارير الطبية السريعة:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {[
                        { name: 'تقرير_الجلسة_الإكلينيكية.pdf', size: '1.2 MB', icon: '📄' },
                        { name: 'فحص_الحالة_العقلية_MSE.pdf', size: '850 KB', icon: '🧠' }
                      ].map((tpl) => (
                        <button
                          key={tpl.name}
                          type="button"
                          onClick={() => handleSendPdf(tpl.name, tpl.size)}
                          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-rose-400 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          <span className="text-[10px] text-slate-400 font-mono">{tpl.size}</span>
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="truncate">{tpl.name}</span>
                            <span>{tpl.icon}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hidden Real File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Bottom Input Area - Matches Main Page DoctorChatModal */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                {isRecordingVoice ? (
                  /* Enhanced Live Voice Recording Bar with Visualizer & Digital Timer */
                  <div className="flex items-center justify-between gap-3 bg-rose-50/90 dark:bg-rose-950/60 p-3 rounded-2xl border border-rose-200 dark:border-rose-800 shadow-sm animate-in fade-in">
                    
                    {/* Left Actions: Cancel & Send */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleCancelVoiceRecording}
                        className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        title="إلغاء التسجيل"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>إلغاء</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSendVoiceRecording}
                        className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        title="تأكيد وإرسال الرسالة الصوتية"
                      >
                        <Send className="w-3.5 h-3.5 -scale-x-100" />
                        <span>إرسال الصوت</span>
                      </button>
                    </div>

                    {/* Middle: Live Animated Audio Frequency Visualizer (12 Soundwave Bars) */}
                    <div className="hidden xs:flex items-center justify-center gap-1 h-6 px-2 flex-1 max-w-[180px]">
                      {[40, 85, 55, 100, 65, 90, 45, 95, 75, 60, 80, 50].map((h, i) => (
                        <span
                          key={i}
                          className="w-1 bg-rose-500 rounded-full animate-bounce"
                          style={{
                            height: `${h}%`,
                            animationDuration: `${0.6 + (i % 3) * 0.2}s`,
                            animationDelay: `${i * 80}ms`
                          }}
                        />
                      ))}
                    </div>

                    {/* Right: REC Indicator & Digital Recording Timer */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="font-bold text-rose-700 dark:text-rose-300 text-xs">
                            جاري التسجيل...
                          </span>
                          <span className="font-mono font-bold text-xs text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                            ⏱ {Math.floor(voiceRecordSeconds / 60).toString().padStart(2, '0')}:{(voiceRecordSeconds % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                        {audioError && (
                          <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">{audioError}</p>
                        )}
                      </div>

                      <div className="relative flex items-center justify-center">
                        <span className="w-3.5 h-3.5 rounded-full bg-rose-600 animate-ping absolute" />
                        <span className="w-3.5 h-3.5 rounded-full bg-rose-600 shrink-0" />
                      </div>
                    </div>

                  </div>
                ) : (
                  /* Standard Input Bar - Perfect RTL Alignment */
                  <div className="flex items-center gap-2 w-full">
                    {/* 1. Attachment / Files Menu Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                        isPdfMenuOpen
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 border border-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 hover:text-rose-600'
                      }`}
                      title="إرفاق ملف PDF أو تقرير"
                    >
                      <Paperclip className="w-4 h-4 stroke-[2.2]" />
                    </button>

                    {/* 2. Microphone / Voice Recording Trigger (Placed right next to files button) */}
                    <button
                      type="button"
                      onClick={handleStartVoiceRecording}
                      className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 flex items-center justify-center shrink-0 cursor-pointer transition-colors border border-teal-200 dark:border-teal-800 shadow-xs"
                      title="تسجيل رسالة صوتية مباشرة بالمايك"
                    >
                      <Mic className="w-4 h-4 stroke-[2.2]" />
                    </button>

                    {/* 3. Text Input Field */}
                    <input
                      type="text"
                      value={activeChatText}
                      onChange={(e) => setActiveChatText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendTextMessage();
                        }
                      }}
                      placeholder="اكتب ردك الطبي أو استفسارك هنا..."
                      className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-hidden focus:border-teal-600 transition-colors shadow-2xs"
                    />

                    {/* 4. Send Button (Aligned at the end of the line in RTL) */}
                    <button
                      type="button"
                      onClick={() => handleSendTextMessage()}
                      className="w-10 h-10 rounded-xl bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors shadow-xs"
                      title="إرسال"
                    >
                      <Send className="w-4 h-4 -scale-x-100" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })()}

      {/* Preview Schedule Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <button onClick={() => setIsPreviewModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>معاينة جدولك المتاح للعملاء</span>
              </h3>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
              {weekSchedule.filter(d => d.enabled).map(d => (
                <div key={d.dayName} className="pt-2">
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">{d.dayName}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {d.slots.map(s => (
                      <span key={s.id} className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-[11px] font-mono border border-emerald-200 dark:border-emerald-800">
                        {s.startTime} - {s.endTime}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* ==============================================================
          PATIENTS LIST MODAL (IMG-20261007-WA0008.jpg)
         ============================================================== */}
      {isPatientsListModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-right max-h-[90vh] flex flex-col overflow-hidden transition-colors">
            
            {/* Header with Title and Back Chevron (Right/Left) */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10">
              <div className="w-8"></div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                قائمة المرضى
              </h2>
              <button
                type="button"
                onClick={() => setIsPatientsListModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                title="رجوع"
              >
                <ChevronLeft className="w-6 h-6 rotate-180" />
              </button>
            </div>

            {/* 3 Segmented Tabs: نشطة | مغلقة | التشاخيص (Exact match to Image 2) */}
            <div className="px-5 pt-4 pb-2">
              <div className="grid grid-cols-3 border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 p-1">
                {/* 1. نشطة */}
                <button
                  type="button"
                  onClick={() => setPatientListTab('active')}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    patientListTab === 'active'
                      ? 'bg-white dark:bg-slate-700 text-[#1e40af] dark:text-teal-300 border border-slate-300 dark:border-slate-600 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  نشطة
                </button>

                {/* 2. مغلقة */}
                <button
                  type="button"
                  onClick={() => setPatientListTab('closed')}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    patientListTab === 'closed'
                      ? 'bg-white dark:bg-slate-700 text-[#1e40af] dark:text-teal-300 border border-slate-300 dark:border-slate-600 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  مغلقة
                </button>

                {/* 3. التشاخيص */}
                <button
                  type="button"
                  onClick={() => setPatientListTab('diagnoses')}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    patientListTab === 'diagnoses'
                      ? 'bg-white dark:bg-slate-700 text-[#1e40af] dark:text-teal-300 border border-slate-300 dark:border-slate-600 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  التشاخيص
                </button>
              </div>
            </div>

            {/* Section Subtitle */}
            <div className="px-5 pt-2 pb-1 text-right">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {patientListTab === 'active' ? 'الحالات النشطة' : patientListTab === 'closed' ? 'الحالات المغلقة' : 'تصنيفات التشاخيص السريرية'}
              </h3>
            </div>

            {/* Search Box */}
            <div className="px-5 pb-3">
              <div className="relative">
                <input
                  type="text"
                  value={patientListSearch}
                  onChange={(e) => setPatientListSearch(e.target.value)}
                  placeholder={patientListTab === 'diagnoses' ? 'ابحث عن تشخيص طبي أو رمز DSM/ICD' : 'ابحث باسم المريض'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pr-10 pl-4 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-teal-600 text-right shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* List Body according to Selected Tab */}
            <div className="flex-1 overflow-y-auto px-5 divide-y divide-slate-100 dark:divide-slate-800 pb-4">
              
              {/* TAB 1: الحالات النشطة (IMG-20261007-WA0008.jpg) */}
              {patientListTab === 'active' && (
                filteredActivePatients.length > 0 ? (
                  filteredActivePatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        const matched = patients.find(orig => orig.name === p.name) || patients[0];
                        setIsPatientsListModalOpen(false);
                        onOpenPatientFile(matched);
                      }}
                      className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-xl px-2 transition-colors cursor-pointer group"
                    >
                      {/* Left: Indicator / Chevron */}
                      <div className="flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                        <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">
                          نشط
                        </span>
                      </div>

                      {/* Right: Patient Name & Avatar */}
                      <div className="flex items-center gap-3.5 text-right">
                        <div>
                          <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            {p.diagnosis} · {p.fileNumber}
                          </span>
                        </div>

                        {/* Circular Avatar Outline (Exact to Image 2) */}
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 shadow-2xs">
                          <User className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    لم يتم العثور على مريض مطابق للبحث
                  </div>
                )
              )}

              {/* TAB 2: الحالات المغلقة */}
              {patientListTab === 'closed' && (
                filteredClosedPatients.length > 0 ? (
                  filteredClosedPatients.map((p) => (
                    <div
                      key={p.id}
                      className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-xl px-2 transition-colors"
                    >
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-lg">
                        مكتملة
                      </span>

                      <div className="text-right pr-2">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[10px] text-slate-400 font-mono">{p.fileNumber}</span>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</span>
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">{p.reason}</p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">تاريخ الإغلاق: {p.closedDate}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    لا توجد حالات مغلقة مطابقة
                  </div>
                )
              )}

              {/* TAB 3: التشاخيص */}
              {patientListTab === 'diagnoses' && (
                filteredDiagnoses.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setPatientListSearch(d.name.split(' ')[0]);
                      setPatientListTab('active');
                    }}
                    className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-xl px-2 transition-colors cursor-pointer"
                  >
                    <span className="px-3 py-1 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs rounded-full border border-teal-200 dark:border-teal-800">
                      {d.count} حالة نشطة
                    </span>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold">
                          {d.code}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{d.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{d.desc}</p>
                    </div>
                  </div>
                ))
              )}

            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          SUPPORT GROUPS MODAL (IMG-20261007-WA0007.jpg)
         ============================================================== */}
      {isSupportGroupsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-50 dark:bg-slate-950 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-right max-h-[90vh] flex flex-col overflow-hidden transition-colors">
            
            {/* Header with Title & Back Chevron (Exact to Image 1) */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div className="w-8"></div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                مجموعات الدعم الجماعية
              </h2>
              <button
                type="button"
                onClick={() => setIsSupportGroupsModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                title="رجوع"
              >
                <ChevronLeft className="w-6 h-6 rotate-180" />
              </button>
            </div>

            {/* Toast if group suggested */}
            {suggestSuccessToast && (
              <div className="mx-4 mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{suggestSuccessToast}</span>
              </div>
            )}

            {/* Cards List (Exact match to IMG-20261007-WA0007.jpg) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {defaultSupportGroupsList.map((g) => (
                <div
                  key={g.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 text-right transition-colors"
                >
                  {/* Group Title & Specialist Name */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {g.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      اسم الأخصائي: {g.specialist}
                    </p>
                  </div>

                  {/* Day & Time Row with Icons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-4 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span>{g.time}</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>{g.day}</span>
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* 2 Action Buttons Exact to Image: اقتراح لمريض (Blue Filled) | تفاصيل المجموعة (Blue Outlined) */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* 1. اقتراح لمريض */}
                    <button
                      type="button"
                      onClick={() => setSelectedSupportGroupForSuggest(g)}
                      className="w-full py-2.5 bg-[#1546a0] hover:bg-[#103680] text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-xs transition-colors text-center"
                    >
                      اقتراح لمريض
                    </button>

                    {/* 2. تفاصيل المجموعة */}
                    <button
                      type="button"
                      onClick={() => setSelectedSupportGroupForDetails(g)}
                      className="w-full py-2.5 bg-transparent border border-[#1546a0] text-[#1546a0] dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-bold text-xs sm:text-sm rounded-xl cursor-pointer transition-colors text-center"
                    >
                      تفاصيل المجموعة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suggest Support Group to Patient Modal */}
      {selectedSupportGroupForSuggest && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <button onClick={() => setSelectedSupportGroupForSuggest(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                اقتراح مجموعة لمريض
              </h3>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40">
              <strong className="block text-sm text-blue-900 dark:text-blue-200">{selectedSupportGroupForSuggest.title}</strong>
              <span className="text-xs text-blue-700 dark:text-blue-300">أخصائي الجلسة: {selectedSupportGroupForSuggest.specialist}</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              اختر المريض الذي ترغب بإرسال دعوة واقتراح الانضمام لهذه المجموعة له:
            </p>

            <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800">
              {defaultActivePatientsList.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSuggestSuccessToast(`تم إرسال اقتراح المجموعة إلى المريض (${p.name}) بنجاح ✓`);
                    setSelectedSupportGroupForSuggest(null);
                    setTimeout(() => setSuggestSuccessToast(null), 4000);
                  }}
                  className="w-full p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-right flex items-center justify-between cursor-pointer"
                >
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">إرسال الدعوة</span>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</span>
                    <span className="text-[10px] text-slate-400 block">{p.fileNumber}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Support Group Details Modal */}
      {selectedSupportGroupForDetails && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <button onClick={() => setSelectedSupportGroupForDetails(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                تفاصيل المجموعة
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">{selectedSupportGroupForDetails.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">الأخصائي المشرف: {selectedSupportGroupForDetails.specialist}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <p><strong>الموعد:</strong> كل يوم {selectedSupportGroupForDetails.day} في تمام {selectedSupportGroupForDetails.time}</p>
                <p><strong>المجال:</strong> {selectedSupportGroupForDetails.category}</p>
                <p><strong>السعة:</strong> {selectedSupportGroupForDetails.capacity}</p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedSupportGroupForDetails.description}
              </p>

              <button
                type="button"
                onClick={() => {
                  const target = selectedSupportGroupForDetails;
                  setSelectedSupportGroupForDetails(null);
                  setSelectedSupportGroupForSuggest(target);
                }}
                className="w-full py-3 bg-[#1546a0] hover:bg-[#103680] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                اقتراح هذه المجموعة لمريض الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4 max-h-[90vh] flex flex-col transition-colors">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <button 
                onClick={() => setIsStatsModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2.5">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center justify-end gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span>لوحة الإحصائيات ومؤشرات الأداء السريري</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    تحليلات الجلسات، المقاييس النفسية، ومعدلات تعافي المراجعين
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Export Toast */}
            {statsExportToast && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 animate-in fade-in shrink-0">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{statsExportToast}</span>
              </div>
            )}

            {/* Timeframe & Date Range Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {(['week', 'month', 'quarter', 'year'] as const).map(tf => {
                  const labels = {
                    week: 'هذا الأسبوع',
                    month: 'هذا الشهر',
                    quarter: 'آخر 3 أشهر',
                    year: 'هذا العام'
                  };
                  return (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setStatsTimeframe(tf)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        statsTimeframe === tf
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {labels[tf]}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{statsDateRange}</span>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl shrink-0 text-xs font-bold">
              <button
                type="button"
                onClick={() => setStatsActiveTab('overview')}
                className={`py-2 rounded-xl text-center cursor-pointer transition-all ${
                  statsActiveTab === 'overview'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                نظرة عامة (KPIs)
              </button>
              <button
                type="button"
                onClick={() => setStatsActiveTab('diagnoses')}
                className={`py-2 rounded-xl text-center cursor-pointer transition-all ${
                  statsActiveTab === 'diagnoses'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                التشاخيص والمقاييس
              </button>
              <button
                type="button"
                onClick={() => setStatsActiveTab('outcomes')}
                className={`py-2 rounded-xl text-center cursor-pointer transition-all ${
                  statsActiveTab === 'outcomes'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                الجلسات والالتزام
              </button>
              <button
                type="button"
                onClick={() => setStatsActiveTab('insights')}
                className={`py-2 rounded-xl text-center cursor-pointer transition-all ${
                  statsActiveTab === 'insights'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                توصيات وتحليلات
              </button>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 pl-1">
              
              {/* TAB 1: OVERVIEW & KPIs */}
              {statsActiveTab === 'overview' && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* 4 Main KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    
                    {/* Card 1 */}
                    <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/40 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-blue-700 dark:text-blue-300">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/60 rounded-md">+14.2%</span>
                        <CalendarClock className="w-4 h-4" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100 block">48</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">جلسة منجزة</span>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 rounded-md">ممتاز</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl sm:text-3xl font-bold text-emerald-900 dark:text-emerald-100 block">96.4%</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">نسبة الحضور</span>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/40 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-amber-700 dark:text-amber-300">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/60 rounded-md">128 تقييم</span>
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-100 block">4.95 ★</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">رضا المراجعين</span>
                      </div>
                    </div>

                    {/* Card 4 */}
                    <div className="p-3.5 bg-purple-50/80 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900/40 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-purple-700 dark:text-purple-300">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/60 rounded-md">PHQ/GAD</span>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-100 block">78.5%</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">التحسن السريري</span>
                      </div>
                    </div>

                  </div>

                  {/* Secondary Quick Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <div className="p-2">
                      <span className="text-xs text-slate-400 block">إجمالي ساعات الاستشارة</span>
                      <strong className="text-sm font-bold text-slate-900 dark:text-white">72 ساعة سريرية</strong>
                    </div>
                    <div className="p-2 border-r border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-400 block">الحالات النشطة في الخطة</span>
                      <strong className="text-sm font-bold text-slate-900 dark:text-white">26 مريضاً</strong>
                    </div>
                    <div className="p-2 border-r border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-400 block">التدخلات الطارئة</span>
                      <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400">3 تدخلات معالجة</strong>
                    </div>
                    <div className="p-2 border-r border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-400 block">متوسط مدة الجلسة</span>
                      <strong className="text-sm font-bold text-slate-900 dark:text-white">52 دقيقة</strong>
                    </div>
                  </div>

                  {/* Weekly Sessions Chart (Visual Bars) */}
                  <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400">إجمالي الأسبوع: 48 جلسة</span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-teal-600" />
                        <span>توزيع كثافة الجلسات عبر أيام الأسبوع</span>
                      </h4>
                    </div>

                    <div className="grid grid-cols-7 gap-2 pt-2 items-end h-28">
                      {[
                        { day: 'السبت', count: 6, height: '60%' },
                        { day: 'الأحد', count: 9, height: '90%' },
                        { day: 'الإثنين', count: 7, height: '70%' },
                        { day: 'الثلاثاء', count: 10, height: '100%' },
                        { day: 'الأربعاء', count: 8, height: '80%' },
                        { day: 'الخميس', count: 8, height: '80%' },
                        { day: 'الجمعة', count: 0, height: '8%' },
                      ].map((bar, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{bar.count}</span>
                          <div 
                            style={{ height: bar.height }} 
                            className={`w-full rounded-t-lg transition-all ${
                              bar.count >= 9 
                                ? 'bg-teal-700 dark:bg-teal-500' 
                                : bar.count > 0 
                                ? 'bg-teal-300 dark:bg-teal-700' 
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full text-center">{bar.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: DIAGNOSES & OUTCOME MEASURES */}
              {statsActiveTab === 'diagnoses' && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Diagnoses Distribution */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-normal">إجمالي الحالات: 47 مراجعاً</span>
                      <span>توزيع التشاخيص السريرية الأكثر شيوعاً</span>
                    </h4>

                    <div className="space-y-2.5">
                      {[
                        { title: 'اضطراب القلق العام (GAD)', percentage: 34, count: '16 حالة', color: 'bg-blue-600 dark:bg-blue-500' },
                        { title: 'الاكتئاب وتدني المزاج (MDD)', percentage: 28, count: '13 حالة', color: 'bg-purple-600 dark:bg-purple-500' },
                        { title: 'نوبات الهلع والرهاب الاجتماعي', percentage: 18, count: '8 حالات', color: 'bg-amber-600 dark:bg-amber-500' },
                        { title: 'اضطراب الوسواس القهري (OCD)', percentage: 12, count: '6 حالات', color: 'bg-emerald-600 dark:bg-emerald-500' },
                        { title: 'اضطرابات النوم والتكيف الحياتي', percentage: 8, count: '4 حالات', color: 'bg-rose-500 dark:bg-rose-400' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{item.count} ({item.percentage}%)</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{item.title}</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${item.color}`} 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Standard Clinical Psychological Scales */}
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-teal-600" />
                      <span>مؤشرات استجابة المقاييس النفسية المعتمدة</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      
                      {/* PHQ-9 Card */}
                      <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-700 dark:text-blue-300">تحسن 55.2% ✓</span>
                          <strong className="text-slate-900 dark:text-white">مقياس الاكتئاب (PHQ-9)</strong>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          انخفض متوسط الدرجات من 17.4 (شديد) إلى 7.8 (خفيف) خلال 6 جلسات.
                        </p>
                      </div>

                      {/* GAD-7 Card */}
                      <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">تحسن 59.8% ✓</span>
                          <strong className="text-slate-900 dark:text-white">مقياس القلق العام (GAD-7)</strong>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          انخفض متوسط الدرجات من 15.2 إلى 6.1 مع انخفاض وتيرة نوبات القلق.
                        </p>
                      </div>

                      {/* CBT Homework Compliance */}
                      <div className="p-3 bg-purple-50/50 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-900/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-700 dark:text-purple-300">86.4% التزام</span>
                          <strong className="text-slate-900 dark:text-white">سجل الأفكار والواجبات</strong>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          معدل إكمال المهام السلوكية والتعرض التدريجي عبر التطبيق.
                        </p>
                      </div>

                      {/* Sleep Quality PSQI */}
                      <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-100 dark:border-amber-900/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">82.0% تحسن</span>
                          <strong className="text-slate-900 dark:text-white">جودة ونمط النوم (PSQI)</strong>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          تحسن انتظام دورة النوم وتقليل الاستيقاظ الليلي المتكرر.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: SESSION MODALITIES & RETENTION */}
              {statsActiveTab === 'outcomes' && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Modalities Split */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      توزيع أنماط تقديم الجلسات والاستشارات
                    </h4>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Video className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                        <span className="text-lg font-bold text-slate-900 dark:text-white block">65%</span>
                        <span className="text-[11px] text-slate-400">عن بُعد (فيديو)</span>
                        <span className="text-[10px] text-teal-600 font-bold block mt-0.5">31 جلسة</span>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Building className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <span className="text-lg font-bold text-slate-900 dark:text-white block">25%</span>
                        <span className="text-[11px] text-slate-400">حضورية بالعيادة</span>
                        <span className="text-[10px] text-blue-600 font-bold block mt-0.5">12 جلسة</span>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <span className="text-lg font-bold text-slate-900 dark:text-white block">10%</span>
                        <span className="text-[11px] text-slate-400">مجموعات دعم</span>
                        <span className="text-[10px] text-purple-600 font-bold block mt-0.5">5 مجموعات</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Time Preferences & Retention */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">الفترات الزمنية الأكثر طلباً</span>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-teal-700 dark:text-teal-300">68%</span>
                          <span>الفترة المسائية (04:00 م - 09:00 م)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-teal-600 h-full w-[68%]" />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="font-bold text-slate-600 dark:text-slate-400">32%</span>
                          <span>الفترة الصباحية (09:00 ص - 01:00 م)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-slate-400 h-full w-[32%]" />
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">مؤشر استبقاء المرضى في الخطة</span>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">92.3%</span>
                        <span className="text-xs text-slate-400">معدل التزام بالخطة الكاملة</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        متوسط عدد الجلسات المكتملة لكل مريض هو 4.8 جلسات قبل التقييم الختامي.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: CLINICAL INSIGHTS & RECOMMENDATIONS */}
              {statsActiveTab === 'insights' && (
                <div className="space-y-3 animate-in fade-in">
                  
                  <div className="p-3.5 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/40 dark:to-blue-950/40 rounded-2xl border border-teal-100 dark:border-teal-900/50 space-y-2">
                    <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-xs sm:text-sm">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>تحليلات الممارسة السريرية والتوصيات الذكية</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      بناءً على نتائج 48 جلسة إكلينيكية و128 تقييماً للمرضى خلال هذه الفترة، تم رصد المؤشرات التالية:
                    </p>
                  </div>

                  {/* Insight 1 */}
                  <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 text-right flex-1">
                      <strong className="text-xs font-bold text-slate-900 dark:text-white block">استجابة عالية لتقنيات CBT و التعرض التدريجي</strong>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        أظهر مرضى القلق العام ونوبات الهلع سرعة تعافي ملحوظة بنسبة 22% أعلى من المتوسط السريري عند استخدام محطة العمل وتعيين خطط التحدي السلوكي.
                      </p>
                    </div>
                  </div>

                  {/* Insight 2 */}
                  <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 text-right flex-1">
                      <strong className="text-xs font-bold text-slate-900 dark:text-white block">ذروة إقبال استشارات الثلاثاء والخميس</strong>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        تسجل المواعيد المسائية ليومي الثلاثاء والخميس نسبة إشغال 100%، مما يقترح إضافة فترتين مسائيتين إضافيتين لاستيعاب قائمة الانتظار.
                      </p>
                    </div>
                  </div>

                  {/* Insight 3 */}
                  <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 text-right flex-1">
                      <strong className="text-xs font-bold text-slate-900 dark:text-white block">أثر إيجابي لاقتراح مجموعات الدعم الجماعية</strong>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        المرضى الذين انضموا لمجموعات الدعم (تخطي الفقد وأساس التغيير) أبدوا التزاماً أعلى بالجلسات الفردية بنسبة 94%.
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStatsExportToast('تم تجهيز وتصدير التقرير الإحصائي السريري بصيغة PDF بنجاح ✓');
                    setTimeout(() => setStatsExportToast(null), 3500);
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>تصدير / طباعة التقرير (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStatsExportToast('تم تحديث جميع المؤشرات الإحصائية السريرية للبيانات الافتراضية ✓');
                    setTimeout(() => setStatsExportToast(null), 3000);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="تحديث البيانات"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تحديث</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsStatsModalOpen(false)}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                إغلاق النافذة
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Content Library Modal (Exact Matching IMG-20261007-WA0003.jpg, IMG-20261007-WA0009.jpg, IMG-20261007-WA0016.jpg) */}
      {isLibraryModalOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between overflow-y-auto">
          <div className="max-w-md mx-auto w-full min-h-screen flex flex-col p-4 sm:p-6 space-y-4 pb-12">
            
            {/* Sticky Top Header + Tabs Section to ensure they are always visible */}
            <div className="sticky top-0 bg-white dark:bg-slate-950 z-30 pt-1 pb-3 space-y-3.5 border-b border-slate-100 dark:border-slate-800">
              {/* Header with Back Arrow and Centered Title */}
              <div className="flex items-center justify-between pb-2">
                <button 
                  type="button"
                  onClick={() => setIsLibraryModalOpen(false)} 
                  className="p-1 text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-400 transition-colors cursor-pointer"
                  title="الرجوع"
                >
                  <ChevronRight className="w-6 h-6 stroke-[2.2]" />
                </button>

                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  مكتبة المحتوى
                </h1>

                <div className="w-6" />
              </div>

              {/* Segmented 3-Tabs Bar (Directly Under Title as in IMG-20261007-WA0003.jpg, WA0009, WA0016) */}
              <div className="grid grid-cols-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100/80 dark:bg-slate-900 p-1 text-xs sm:text-sm font-bold shadow-xs">
                
                {/* Tab 1: محتويات مقروءة */}
                <button
                  type="button"
                  onClick={() => setLibraryActiveTab('readings')}
                  className={`py-2.5 px-2 text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    libraryActiveTab === 'readings'
                      ? 'bg-white dark:bg-slate-800 text-[#1546a0] dark:text-blue-300 shadow-sm border border-slate-200 dark:border-slate-700 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>محتويات مقروءة</span>
                </button>

                {/* Tab 2: الفيديوهات */}
                <button
                  type="button"
                  onClick={() => setLibraryActiveTab('videos')}
                  className={`py-2.5 px-2 text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    libraryActiveTab === 'videos'
                      ? 'bg-white dark:bg-slate-800 text-[#1546a0] dark:text-blue-300 shadow-sm border border-slate-200 dark:border-slate-700 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>الفيديوهات</span>
                </button>

                {/* Tab 3: مقاييس نفسية */}
                <button
                  type="button"
                  onClick={() => setLibraryActiveTab('scales')}
                  className={`py-2.5 px-2 text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    libraryActiveTab === 'scales'
                      ? 'bg-white dark:bg-slate-800 text-[#1546a0] dark:text-blue-300 shadow-sm border border-slate-200 dark:border-slate-700 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>مقاييس نفسية</span>
                </button>

              </div>

              {/* Search and Filter Row (Below Tabs as in Screenshot) */}
              <div className="flex items-center gap-2.5 pt-1">
                {/* Filter button on left */}
                <button
                  type="button"
                  className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer shrink-0 shadow-2xs"
                  title="تصفية المحتوى"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>

                {/* Search bar on right */}
                <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
                  <input
                    type="text"
                    value={librarySearchQuery}
                    onChange={(e) => setLibrarySearchQuery(e.target.value)}
                    placeholder="ابحث"
                    className="w-full text-xs sm:text-sm bg-transparent text-right focus:outline-hidden text-slate-900 dark:text-white placeholder:text-slate-400 font-sans"
                  />
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>

              {/* Suggest Toast */}
              {librarySuggestToast && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{librarySuggestToast}</span>
                </div>
              )}
            </div>

            {/* TAB 1: محتويات مقروءة (IMG-20261007-WA0003.jpg) */}
            {libraryActiveTab === 'readings' && (
              <div className="space-y-3 pt-1 animate-in fade-in">
                {libraryReadingsList
                  .filter(item => item.title.includes(librarySearchQuery) || item.description.includes(librarySearchQuery))
                  .map(item => (
                    <div
                      key={item.id}
                      className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-right hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-2xs cursor-pointer group"
                      onClick={() => setSelectedLibraryReading(item)}
                    >
                      {/* Left curved share/forward icon matching image */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLibraryItemForSuggest({ ...item, type: 'reading' });
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        title="اقتراح لمريض"
                      >
                        <CornerUpLeft className="w-5 h-5 stroke-[1.8]" />
                      </button>

                      {/* Right Title & Date */}
                      <div className="text-right">
                        <h4 className="font-bold text-sm text-[#1546a0] dark:text-blue-400 group-hover:underline">
                          {item.title}
                        </h4>
                        <span className="text-xs text-slate-400 block mt-1 font-sans">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* TAB 2: الفيديوهات (IMG-20261007-WA0009.jpg) */}
            {libraryActiveTab === 'videos' && (
              <div className="space-y-5 pt-1 animate-in fade-in">
                {libraryVideosList
                  .filter(item => item.title.includes(librarySearchQuery) || item.category.includes(librarySearchQuery))
                  .map(item => (
                    <div key={item.id} className="space-y-2">
                      
                      {/* Video Thumbnail Box matching IMG-20261007-WA0009.jpg */}
                      <div 
                        onClick={() => setSelectedLibraryVideo(item)}
                        className="w-full h-36 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 flex flex-col justify-between relative cursor-pointer hover:border-blue-300 transition-all shadow-2xs group overflow-hidden"
                      >
                        {/* Subtle play icon in center */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-11 h-11 rounded-full bg-slate-800/60 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>

                        {/* Top Spacer */}
                        <div />

                        {/* Bottom Row inside video: Duration on Left, Share Icon on Right matching screenshot */}
                        <div className="flex items-center justify-between w-full z-10">
                          {/* Duration Badge on Left */}
                          <span className="bg-slate-800/80 text-white text-[11px] font-mono px-2 py-0.5 rounded-md">
                            {item.duration}
                          </span>

                          {/* Share Icon on Right */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLibraryItemForSuggest({ ...item, type: 'video' });
                            }}
                            className="bg-slate-800/80 text-white p-1.5 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                            title="اقتراح لمريض"
                          >
                            <CornerUpLeft className="w-4 h-4 stroke-[2]" />
                          </button>
                        </div>
                      </div>

                      {/* Video Title below box */}
                      <h4 
                        onClick={() => setSelectedLibraryVideo(item)}
                        className="font-bold text-sm text-slate-800 dark:text-slate-100 text-right cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {item.title}
                      </h4>

                    </div>
                  ))}
              </div>
            )}

            {/* TAB 3: مقاييس نفسية (IMG-20261007-WA0016.jpg) */}
            {libraryActiveTab === 'scales' && (
              <div className="space-y-3 pt-1 animate-in fade-in">
                {libraryScalesList
                  .filter(item => item.title.includes(librarySearchQuery) || item.description.includes(librarySearchQuery))
                  .map(item => (
                    <div
                      key={item.id}
                      className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-right hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-2xs cursor-pointer group"
                      onClick={() => {
                        setIsLibraryModalOpen(false);
                        onOpenScaleRunner(item.scaleKey);
                      }}
                    >
                      {/* Left curved share/forward icon matching image */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLibraryItemForSuggest({ ...item, type: 'scale' });
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        title="اقتراح لمريض"
                      >
                        <CornerUpLeft className="w-5 h-5 stroke-[1.8]" />
                      </button>

                      {/* Right Title & Date */}
                      <div className="text-right">
                        <h4 className="font-bold text-sm text-[#1546a0] dark:text-blue-400 group-hover:underline">
                          {item.title}
                        </h4>
                        <span className="text-xs text-slate-400 block mt-1 font-sans">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Reading Details Modal */}
      {selectedLibraryReading && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4 max-h-[85vh] flex flex-col transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <button onClick={() => setSelectedLibraryReading(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                تفاصيل التمرين المقروء
              </h3>
            </div>

            <div className="space-y-3 overflow-y-auto">
              <h4 className="font-bold text-base text-[#1546a0] dark:text-blue-400">{selectedLibraryReading.title}</h4>
              <span className="text-xs text-slate-400 block">المدة التقديرية: {selectedLibraryReading.duration} | {selectedLibraryReading.date}</span>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed space-y-2">
                <p>{selectedLibraryReading.description}</p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                  <strong>الهدف العلاجي:</strong> تمكين المريض من امتلاك أدوات التنظيم الذاتي للمشاعر وتهدئة الجهاز العصبي في المواقف الضاغطة.
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const target = selectedLibraryReading;
                  setSelectedLibraryReading(null);
                  setSelectedLibraryItemForSuggest({ ...target, type: 'reading' });
                }}
                className="w-full py-3 bg-[#1546a0] hover:bg-[#103680] text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer transition-colors text-center"
              >
                اقتراح هذا التمرين لمريض الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Preview Modal */}
      {selectedLibraryVideo && (
        <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-3 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <button onClick={() => setSelectedLibraryVideo(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {selectedLibraryVideo.title}
              </h3>
            </div>

            <div className="w-full bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              <video controls className="w-full h-full object-contain" autoPlay>
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                متصفحك لا يدعم تشغيل الفيديو.
              </video>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  const target = selectedLibraryVideo;
                  setSelectedLibraryVideo(null);
                  setSelectedLibraryItemForSuggest({ ...target, type: 'video' });
                }}
                className="px-4 py-2 bg-[#1546a0] hover:bg-[#103680] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                إرسال الفيديو لمريض
              </button>

              <span className="text-xs text-slate-400">المدة: {selectedLibraryVideo.duration}</span>
            </div>
          </div>
        </div>
      )}

      {/* Suggest Content to Patient Modal */}
      {selectedLibraryItemForSuggest && (
        <div className="fixed inset-0 z-70 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <button onClick={() => setSelectedLibraryItemForSuggest(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                اقتراح محتوى لمريض
              </h3>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40">
              <strong className="block text-sm text-blue-900 dark:text-blue-200">{selectedLibraryItemForSuggest.title}</strong>
              <span className="text-xs text-blue-700 dark:text-blue-300">
                {selectedLibraryItemForSuggest.type === 'reading' ? 'محتوى مقروء' : selectedLibraryItemForSuggest.type === 'video' ? 'مقطع فيديو علاجي' : 'مقياس نفسي معتمد'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              اختر المريض الذي ترغب بإرسال هذا المحتوى له لمتابعته وتطبيقه:
            </p>

            <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800">
              {defaultActivePatientsList.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setLibrarySuggestToast(`تم إرسال (${selectedLibraryItemForSuggest.title}) إلى المريض (${p.name}) بنجاح ✓`);
                    setSelectedLibraryItemForSuggest(null);
                    setTimeout(() => setLibrarySuggestToast(null), 4000);
                  }}
                  className="w-full p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-right flex items-center justify-between cursor-pointer"
                >
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">إرسال المحتوى</span>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</span>
                    <span className="text-[10px] text-slate-400 block">{p.fileNumber}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timezone Modal (Exact Matching IMG-20261007-WA0021.jpg) */}
      {isTimezoneModalOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between overflow-y-auto">
          <div className="max-w-md mx-auto w-full min-h-screen flex flex-col justify-between p-4 sm:p-6 space-y-4">
            
            <div className="space-y-4">
              {/* Header with Back Arrow and Centered Title */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsTimezoneModalOpen(false)} 
                  className="p-1 text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-400 transition-colors cursor-pointer"
                  title="الرجوع"
                >
                  <ChevronRight className="w-6 h-6 stroke-[2.2]" />
                </button>

                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  المنطقة الزمنية
                </h1>

                <div className="w-6" />
              </div>

              {/* Blue Info Notice Box (Matching Image Top Box) */}
              <div className="rounded-2xl bg-[#eaf3fe] dark:bg-blue-950/40 border border-[#d2e4fc] dark:border-blue-900/60 p-4 text-right flex items-start gap-3 shadow-2xs">
                <p className="text-xs sm:text-[13px] text-[#244b7a] dark:text-blue-200 leading-relaxed font-normal flex-1">
                  تنطبق المنطقة الزمنية التي تختارها على جميع مواعيدك وشاشات الحجز، مما يساعد على منع أخطاء الجدولة عند السفر أو استخدام VPN أو في حال كان وقت الجهاز غير مضبوط.
                </p>
                <div className="w-6 h-6 rounded-full text-[#1546a0] dark:text-blue-400 shrink-0 flex items-center justify-center mt-0.5">
                  <Info className="w-5 h-5 stroke-[2]" />
                </div>
              </div>

              {/* Section Sub-heading: وضع التحديد */}
              <div className="pt-2 text-right">
                <h3 className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
                  وضع التحديد
                </h3>
              </div>

              {/* 1. Automatic Timezone Card (Matching Image Card 1) */}
              <div
                onClick={() => setTempTimezoneMode('auto')}
                className={`rounded-2xl p-4.5 text-right cursor-pointer transition-all shadow-2xs space-y-2 ${
                  tempTimezoneMode === 'auto'
                    ? 'border-2 border-[#1546a0] bg-[#f2f7ff] dark:bg-blue-950/40 dark:border-blue-500'
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                {/* Top Row with Radio Button & Title */}
                <div className="flex items-center justify-between">
                  <div className="w-5" />
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      تحديد المنطقة الزمنية تلقائيًا
                    </h4>
                    {/* Radio Button on Right */}
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 border-[#1546a0] dark:border-blue-400">
                      {tempTimezoneMode === 'auto' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1546a0] dark:bg-blue-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed pr-8">
                  يحدد منطقتك الزمنية باستخدام الجهاز وإشارات الشبكة. قد لا يكون دقيقًا عند استخدام VPN أو أثناء السفر الدولي.
                </p>

                {/* Badge with Pin and Timezone: (UTC+3) 03+ */}
                <div className="pr-8 pt-1 flex justify-end">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs text-xs font-mono text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">(UTC+3) 03+</span>
                    <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              {/* 2. Manual Timezone Card (Matching Image Card 2) */}
              <div
                onClick={() => setTempTimezoneMode('manual')}
                className={`rounded-2xl p-4.5 text-right cursor-pointer transition-all shadow-2xs space-y-2 ${
                  tempTimezoneMode === 'manual'
                    ? 'border-2 border-[#1546a0] bg-[#f2f7ff] dark:bg-blue-950/40 dark:border-blue-500'
                    : 'border border-slate-200 dark:border-slate-800 bg-[#fafafa] dark:bg-slate-900/60 hover:border-slate-300'
                }`}
              >
                {/* Top Row with Radio Button & Title */}
                <div className="flex items-center justify-between">
                  <div className="w-5" />
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      تحديد المنطقة الزمنية يدويًا
                    </h4>
                    {/* Radio Button on Right */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                      tempTimezoneMode === 'manual'
                        ? 'border-[#1546a0] dark:border-blue-400'
                        : 'border-slate-400 dark:border-slate-600'
                    }`}>
                      {tempTimezoneMode === 'manual' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1546a0] dark:bg-blue-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed pr-8">
                  يتجاوز التحديد التلقائي. سيتم استخدام المنطقة الزمنية التي تختارها دائمًا بغض النظر عن موقع الجهاز أو VPN.
                </p>

                {/* Interactive Manual Timezone List if manual is active */}
                {tempTimezoneMode === 'manual' && (
                  <div className="pr-8 pt-3 space-y-2 animate-in fade-in">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                      اختر المنطقة الزمنية اليدوية:
                    </span>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {[
                        { name: '(UTC+3) 03+ (الرياض / مكة المكرمة)', flag: '🇸🇦' },
                        { name: '(UTC+4) 04+ (دبي / أبوظبي / مسقط)', flag: '🇦🇪' },
                        { name: '(UTC+2) 02+ (القاهرة / الإسكندرية)', flag: '🇪🇬' },
                        { name: '(UTC+3) 03+ (عمّان / القدس / بيروت)', flag: '🇯🇴' },
                        { name: '(UTC+3) 03+ (الكويت / الدوحة / المنامة)', flag: '🇰🇼' },
                        { name: '(UTC+1) 01+ (تونس / الجزائر / الرباط)', flag: '🇲🇦' },
                        { name: '(UTC+0) 00+ (لندن / غرينتش)', flag: '🇬🇧' },
                        { name: '(UTC-5) 05- (نيويورك / الساحل الشرقي)', flag: '🇺🇸' }
                      ].map(tz => (
                        <button
                          key={tz.name}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTempSelectedTimezone(tz.name);
                          }}
                          className={`w-full p-2.5 rounded-xl text-xs flex items-center justify-between text-right cursor-pointer border transition-all ${
                            tempSelectedTimezone === tz.name
                              ? 'bg-blue-100/70 dark:bg-blue-900/60 border-blue-400 text-[#1546a0] dark:text-blue-200 font-bold'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {tempSelectedTimezone === tz.name && (
                              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{tz.name}</span>
                            <span>{tz.flag}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Sticky Bottom Save Button (Matching Image Save Button) */}
            <div className="pt-6 pb-2">
              <button
                type="button"
                onClick={() => {
                  setTimezoneMode(tempTimezoneMode);
                  setSelectedTimezone(tempTimezoneMode === 'auto' ? '(UTC+3) 03+ (تلقائي)' : tempSelectedTimezone);
                  localStorage.setItem('coolmind_timezone_mode', tempTimezoneMode);
                  localStorage.setItem('coolmind_app_timezone', tempTimezoneMode === 'auto' ? '(UTC+3) 03+ (تلقائي)' : tempSelectedTimezone);
                  setIsTimezoneModalOpen(false);
                  setTimezoneToast(
                    tempTimezoneMode === 'auto'
                      ? 'تم تفعيل تحديد المنطقة الزمنية تلقائيًا (UTC+3) 03+ بنجاح ✓'
                      : `تم حفظ المنطقة الزمنية يدويًا: ${tempSelectedTimezone} بنجاح ✓`
                  );
                  setTimeout(() => setTimezoneToast(null), 3500);
                }}
                className="w-full py-3.5 bg-[#1546a0] hover:bg-[#103680] text-white font-bold text-base rounded-xl cursor-pointer shadow-sm transition-colors text-center"
              >
                حفظ التفضيل
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Language Selection Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4 transition-colors animate-in fade-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setIsLanguageModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-right">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center justify-end gap-2">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>لغة التطبيق (Language)</span>
                </h3>
                <span className="text-[11px] text-slate-400">اختر لغة واجهة المنصة والمصطلحات السريرية</span>
              </div>
            </div>

            {/* Language Options List */}
            <div className="space-y-2.5">
              {[
                { code: 'ar', name: 'العربية', nativeName: 'العربية (الافتراضية)', dir: 'RTL', flag: '🇸🇦', desc: 'اللغة العربية الكاملة مع دعم التوجيه من اليمين لليسار' },
                { code: 'en', name: 'English', nativeName: 'English (US / UK)', dir: 'LTR', flag: '🇬🇧', desc: 'Full English clinical interface and terms' },
                { code: 'fr', name: 'Français', nativeName: 'Français (France)', dir: 'LTR', flag: '🇫🇷', desc: 'Interface clinique en langue française' },
                { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe (Türkiye)', dir: 'LTR', flag: '🇹🇷', desc: 'Türkçe klinik uygulama arayüzü' },
                { code: 'es', name: 'Español', nativeName: 'Español (España)', dir: 'LTR', flag: '🇪🇸', desc: 'Interfaz médica en español' },
                { code: 'de', name: 'Deutsch', nativeName: 'Deutsch (Deutschland)', dir: 'LTR', flag: '🇩🇪', desc: 'Klinische Benutzeroberfläche auf Deutsch' }
              ].map(lang => {
                const isSelected = selectedLanguage === lang.name;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setSelectedLanguage(lang.name);
                      localStorage.setItem('coolmind_app_language', lang.name);
                      setIsLanguageModalOpen(false);
                      setLanguageToast(`تم ضبط لغة التطبيق على (${lang.name} - ${lang.nativeName}) بنجاح ✓`);
                      setTimeout(() => setLanguageToast(null), 3500);
                    }}
                    className={`w-full p-3.5 rounded-2xl text-right flex items-center justify-between cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {/* Left: Radio check */}
                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600" />
                      )}
                    </div>

                    {/* Right: Flag, Title, Description */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{lang.nativeName}</span>
                        <span className="text-lg">{lang.flag}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{lang.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Bottom Note */}
            <div className="pt-2 text-center text-[11px] text-slate-400">
              يتم حفظ تفضيل اللغة تلقائياً وتطبيقه على كافة شاشات الحساب
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal (Exact Matching IMG-20261007-WA0010.jpg) */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between overflow-y-auto">
          <div className="max-w-md mx-auto w-full min-h-screen flex flex-col justify-between p-4 sm:p-6">
            
            {/* Top Area */}
            <div className="space-y-6">
              
              {/* Header with Back Arrow and Centered Title */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)} 
                  className="p-1 text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-400 transition-colors cursor-pointer"
                  title="الرجوع"
                >
                  <ChevronRight className="w-6 h-6 stroke-[2.2]" />
                </button>

                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  الملف الشخصي
                </h1>

                {/* Empty spacer for center alignment */}
                <div className="w-6" />
              </div>

              {/* Avatar Section */}
              <div className="flex flex-col items-center pt-2">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-xs border border-slate-100 dark:border-slate-800">
                  <img
                    src={doctorAvatar}
                    alt={tempFirstName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Subtle horizontal separator below avatar matching image */}
                <div className="w-full border-b border-slate-100 dark:border-slate-800 mt-6" />
              </div>

              {/* Form Fields Cards matching IMG-20261007-WA0010.jpg */}
              <div className="space-y-3.5 pt-1">
                
                {/* 1. First Name */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 space-y-0.5 shadow-xs">
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal block text-right">
                    الاسم الأول (يمكنك وضع اسم مستعار)
                  </span>
                  <input
                    type="text"
                    value={tempFirstName}
                    onChange={(e) => setTempFirstName(e.target.value)}
                    className="w-full text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 bg-transparent text-right focus:outline-hidden"
                    placeholder="Mohammed"
                  />
                </div>

                {/* 2. Last Name / Family Name */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 space-y-0.5 shadow-xs">
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal block text-right">
                    اسم العائلة
                  </span>
                  <input
                    type="text"
                    value={tempLastName}
                    onChange={(e) => setTempLastName(e.target.value)}
                    className="w-full text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 bg-transparent text-right focus:outline-hidden"
                    placeholder="FatehAllah"
                  />
                </div>

                {/* 3. Email */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 space-y-0.5 shadow-xs">
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal block text-right">
                    البريد الإلكتروني
                  </span>
                  <input
                    type="email"
                    value={tempProfileEmail}
                    onChange={(e) => setTempProfileEmail(e.target.value)}
                    className="w-full text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 bg-transparent text-right focus:outline-hidden font-sans"
                    placeholder="almoaadimohammed@gmail.com"
                  />
                </div>

                {/* 4. Phone Number with Country Code & Flag */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 flex items-center justify-between gap-3 relative shadow-xs">
                  
                  {/* Phone Input with sublabel on left */}
                  <div className="flex-1 space-y-0.5 text-right">
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal block text-right">
                      أدخل رقم الهاتف
                    </span>
                    <input
                      type="tel"
                      value={tempPhoneRaw}
                      onChange={(e) => setTempPhoneRaw(e.target.value)}
                      className="w-full text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 bg-transparent text-right focus:outline-hidden font-sans"
                      placeholder="773716156"
                    />
                  </div>

                  {/* Vertical Divider */}
                  <div className="h-8 w-px bg-slate-200 dark:border-slate-700 mx-1" />

                  {/* Right side: Country Code + Flag */}
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="flex items-center gap-1.5 text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 cursor-pointer select-none"
                  >
                    <span>{tempCountryCode}</span>
                    <span className="text-lg leading-none">{tempCountryFlag}</span>
                  </button>

                  {/* Country Selection Dropdown */}
                  {isCountryDropdownOpen && (
                    <div className="absolute left-3 top-full mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-1 space-y-1 text-right">
                      {[
                        { flag: '🇯🇴', code: '+962', name: 'الأردن' },
                        { flag: '🇸🇦', code: '+966', name: 'السعودية' },
                        { flag: '🇦🇪', code: '+971', name: 'الإمارات' },
                        { flag: '🇪🇬', code: '+20', name: 'مصر' },
                        { flag: '🇰🇼', code: '+965', name: 'الكويت' },
                        { flag: '🇶🇦', code: '+974', name: 'قطر' },
                        { flag: '🇧🇭', code: '+973', name: 'البحرين' },
                        { flag: '🇴🇲', code: '+968', name: 'عُمان' },
                        { flag: '🇵🇸', code: '+970', name: 'فلسطين' },
                      ].map(c => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setTempCountryCode(c.code);
                            setTempCountryFlag(c.flag);
                            setIsCountryDropdownOpen(false);
                          }}
                          className="w-full p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between text-xs cursor-pointer"
                        >
                          <span className="font-mono text-slate-500">{c.code}</span>
                          <span className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                            {c.name} {c.flag}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* Bottom Save Solid Blue Button matching IMG-20261007-WA0010.jpg */}
            <div className="pt-6 pb-2">
              <button
                type="button"
                onClick={() => {
                  setDoctorFirstName(tempFirstName);
                  setDoctorLastName(tempLastName);
                  const fullName = `${tempFirstName} ${tempLastName}`.trim();
                  setDoctorName(fullName || doctorName);
                  setDoctorEmail(tempProfileEmail);
                  setDoctorPhoneRaw(tempPhoneRaw);
                  setDoctorCountryCode(tempCountryCode);
                  setDoctorCountryFlag(tempCountryFlag);
                  setDoctorPhone(`${tempCountryCode} ${tempPhoneRaw}`);
                  setIsEditProfileModalOpen(false);
                  setProfileSaveSuccessToast('تم حفظ الملف الشخصي بنجاح ✓');
                  setTimeout(() => setProfileSaveSuccessToast(null), 3500);
                }}
                className="w-full py-3.5 bg-[#1546a0] hover:bg-[#103680] text-white font-bold text-base rounded-xl cursor-pointer shadow-sm transition-colors text-center"
              >
                حفظ
              </button>
            </div>

          </div>
        </div>
      )}

      {/* New Chat Picker Modal (Patients & Therapists) */}
      {isNewChatModalOpen && (() => {
        return (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4 max-h-[85vh] flex flex-col transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <button onClick={() => setIsNewChatModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">بدء محادثة جديدة</h3>
              </div>

              {/* Sub tabs in New Chat Picker */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-center">
                <button
                  type="button"
                  onClick={() => setChatSubTab('clients')}
                  className={`py-2 rounded-lg cursor-pointer transition-all ${
                    chatSubTab === 'clients'
                      ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  المرضى والعملاء
                </button>
                <button
                  type="button"
                  onClick={() => setChatSubTab('therapists')}
                  className={`py-2 rounded-lg cursor-pointer transition-all ${
                    chatSubTab === 'therapists'
                      ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  المعالجون والأطباء
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                {chatSubTab === 'clients' ? (
                  patients.map((p, idx) => {
                    const colors = ['bg-indigo-600', 'bg-teal-600', 'bg-rose-600', 'bg-amber-600', 'bg-purple-600', 'bg-blue-600'];
                    const color = colors[idx % colors.length];
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setIsNewChatModalOpen(false);
                          const newChat = {
                            id: 'c-' + p.id,
                            name: p.name,
                            letter: p.name.charAt(0) || 'م',
                            color,
                            lastMessage: 'محادثة جديدة نشطة',
                            time: 'الآن',
                            unread: false,
                            patientId: p.id
                          };
                          setClientChats(prev => {
                            if (prev.some(item => item.id === newChat.id)) return prev;
                            return [newChat, ...prev];
                          });
                          setSelectedChatPatient({
                            ...newChat,
                            rawPatient: p
                          });
                        }}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-2xl text-right flex items-center justify-between cursor-pointer border border-transparent hover:border-teal-200 dark:hover:border-teal-800 transition-colors"
                      >
                        <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold px-2.5 py-1 bg-teal-50 dark:bg-teal-950/60 rounded-lg">بدء المحادثة</span>
                        <div className="flex items-center gap-2.5">
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{p.name}</h4>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">{p.primaryDiagnosis} · {p.fileNumber}</span>
                          </div>
                          <div className={`w-8 h-8 rounded-full ${color} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                            {p.name.charAt(0) || 'م'}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  doctors.map((doc, idx) => {
                    const colors = ['bg-teal-600', 'bg-blue-600', 'bg-purple-600', 'bg-emerald-600'];
                    const color = colors[idx % colors.length];
                    return (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setIsNewChatModalOpen(false);
                          const newChat = {
                            id: 'th-' + doc.id,
                            name: doc.name,
                            role: doc.specialty || 'طبيب استشاري',
                            letter: doc.name.charAt(0) || 'د',
                            color,
                            lastMessage: 'محادثة استشارية جديدة',
                            time: 'الآن',
                            unread: false
                          };
                          setTherapistChats(prev => {
                            if (prev.some(item => item.id === newChat.id)) return prev;
                            return [newChat, ...prev];
                          });
                          setSelectedChatPatient({
                            ...newChat,
                            isTherapist: true
                          });
                        }}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-2xl text-right flex items-center justify-between cursor-pointer border border-transparent hover:border-teal-200 dark:hover:border-teal-800 transition-colors"
                      >
                        <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold px-2.5 py-1 bg-teal-50 dark:bg-teal-950/60 rounded-lg">بدء المحادثة</span>
                        <div className="flex items-center gap-2.5">
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{doc.name}</h4>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">{doc.specialty}</span>
                          </div>
                          <div className={`w-8 h-8 rounded-full ${color} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                            {doc.name.charAt(0) || 'د'}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* PDF Document Preview Modal */}
      {selectedPdfPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden text-right transition-colors">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-800/60">
              <button
                type="button"
                onClick={() => setSelectedPdfPreview(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-5 h-5 text-rose-500" />
                  <span>معاينة مستند PDF الطبي</span>
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="طباعة"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">طباعة</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert(`جاري حفظ ملف ${selectedPdfPreview.title} بصيغة PDF...`)}
                  className="p-2 rounded-xl bg-teal-700 text-white hover:bg-teal-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل</span>
                </button>
              </div>
            </div>

            {/* Document Content View */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100 dark:bg-slate-950">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 max-w-xl mx-auto">
                
                {/* Clinical Letterhead */}
                <div className="flex items-center justify-between pb-4 border-b-2 border-teal-700/20">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-mono">DOC REF: #MED-PDF-2026</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{selectedPdfPreview.date || 'أكتوبر 2026'}</span>
                  </div>
                  <div className="text-right">
                    <h2 className="text-base sm:text-lg font-bold text-teal-800 dark:text-teal-300">عيادات الطب النفسي والاستشارات</h2>
                    <span className="text-[11px] text-slate-500">CoolMind Clinical Tele-Mental Health Portal</span>
                  </div>
                </div>

                {/* Document Title */}
                <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedPdfPreview.title}
                  </h3>
                  <span className="text-xs text-teal-700 dark:text-teal-400 font-semibold">
                    مستند إكلينيكي معتمد وموثق
                  </span>
                </div>

                {/* Patient & Doctor Meta */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block mb-0.5">اسم المراجع:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{selectedPdfPreview.patientName || 'المراجع'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">الطبيب / الأخصائي المشرف:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{selectedPdfPreview.doctorName || doctorName}</span>
                  </div>
                </div>

                {/* Report Body */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p>
                    تم إعداد هذا المستند الطبي المعتمد بناءً على فحص الحالة الإكلينيكية والمتابعة السريرية المنتظمة. يتضمن التقرير ملخص الجلسة العلاجية، المقاييس النفسية المنجزة، والمسار العلاجي الموصى به للمريض.
                  </p>
                  <div className="p-3 bg-teal-50/60 dark:bg-teal-950/40 rounded-xl border border-teal-100 dark:border-teal-900/60 space-y-1">
                    <h5 className="font-bold text-teal-800 dark:text-teal-300 text-xs">التوصيات والتعليمات:</h5>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      <li>مواصلة تطبيق التمارين السلوكية المعرفية بمعدل 15 دقيقة يومياً.</li>
                      <li>الالتزام بمواعيد الجلسات الافتراضية عبر المنصة.</li>
                      <li>مراجعة الأخصائي في حال حدوث أي تقلبات حادة في المزاج أو القلق.</li>
                    </ul>
                  </div>
                </div>

                {/* Digital Stamp & Signature */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-teal-700/40 text-teal-700 flex flex-col items-center justify-center text-[10px] font-bold rotate-[-12deg]">
                    <span>معتمد</span>
                    <span>CoolMind</span>
                    <span>✓ موثق</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-slate-400 block text-[11px]">التوقيع الإلكتروني المعتمد:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 block">{selectedPdfPreview.doctorName || doctorName}</span>
                    <span className="text-[10px] font-mono text-slate-400">HASH: 9a8f-7c2e-4b11-coolmind</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span className="font-mono text-[11px]">حجم الملف: {selectedPdfPreview.size}</span>
              <button
                type="button"
                onClick={() => setSelectedPdfPreview(null)}
                className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                إغلاق المعاينة
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
