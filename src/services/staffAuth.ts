import { StaffUser, DoctorSchedule, UserRole } from '../types';
import { OFFICIAL_DOCTORS_TEAM } from '../data/packagesAndCoupons';

const STAFF_AUTH_KEY = 'coolmind_staff_session';
const DOCTOR_SCHEDULES_KEY = 'coolmind_doctor_schedules';
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export const DEFAULT_STAFF_USERS: StaffUser[] = [
  {
    id: 'staff-moayad',
    name: 'أ. محمد المؤيد',
    email: 'm.almoayad@coolmind.clinic',
    role: 'psychologist',
    doctorId: 'doc-moayad',
    licenseNumber: 'YM-PSY-1042',
    specialty: 'أخصائي علاج نفسي وسلوكي معرفي (CBT)',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    departmentId: 'psychotherapy',
    isLicensed: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'staff-hakim',
    name: 'د. طارق الحكيم',
    email: 'dr.hakim@coolmind.clinic',
    role: 'psychiatrist',
    doctorId: 'doc-hakim',
    licenseNumber: 'MD-PSY-98442',
    specialty: 'استشاري أول الطب النفسي والتشخيص الإكلينيكي',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
    departmentId: 'psychiatry',
    isLicensed: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'staff-amer',
    name: 'د. محمد عامر',
    email: 'dr.amer@coolmind.clinic',
    role: 'psychologist',
    doctorId: 'doc-amer',
    licenseNumber: 'YM-PSY-2105',
    specialty: 'استشاري علاج نفسي إكلينيكي وعلاج الصدمات (EMDR)',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    departmentId: 'psychotherapy',
    isLicensed: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'staff-wejdan',
    name: 'أ. وجدان فتح الله',
    email: 'w.fathallah@coolmind.clinic',
    role: 'nutritionist',
    doctorId: 'doc-wejdan',
    licenseNumber: 'YM-NUT-3310',
    specialty: 'أخصائية التغذية العلاجية النفسية ومحور الأمعاء-الدماغ',
    avatar: 'https://images.unsplash.com/photo-1594824813589-32289658b1a8?w=400&auto=format&fit=crop&q=80',
    departmentId: 'nutrition',
    isLicensed: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'staff-yosra',
    name: 'أ. يسرا علي',
    email: 'y.ali@coolmind.clinic',
    role: 'social_worker',
    doctorId: 'doc-yosra',
    licenseNumber: 'YM-SOC-4412',
    specialty: 'أخصائية الخدمة الاجتماعية النفسية والإرشاد الأسري',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    departmentId: 'social_work',
    isLicensed: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'staff-seham',
    name: 'د. سهام',
    email: 'dr.seham@coolmind.clinic',
    role: 'psychiatrist',
    doctorId: 'doc-seham',
    licenseNumber: 'YM-MED-5501',
    specialty: 'استشارية الطب النفسي والتشخيص الإكلينيكي والعلاج الدوائي',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    departmentId: 'psychiatry',
    isLicensed: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'staff-saif',
    name: 'بروفيسور سيف الدين الميري',
    email: 'prof.saif@coolmind.clinic',
    role: 'psychiatrist',
    doctorId: 'doc-saif',
    licenseNumber: 'YM-MED-0012',
    specialty: 'بروفيسور واستشاري أول الطب النفسي وعلاج الإدمان',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80',
    departmentId: 'psychiatry',
    isLicensed: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'staff-supervisor',
    name: 'د. عادل القحطاني',
    email: 'supervisor@coolmind.clinic',
    role: 'supervisor',
    doctorId: 'doc-supervisor',
    licenseNumber: 'MD-SUP-007',
    specialty: 'المشرف الإكلينيكي العام ورئيس لجنة الجودة والاعتماد',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    departmentId: 'psychiatry',
    isLicensed: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'staff-reception',
    name: 'أحمد السلامي',
    email: 'reception@coolmind.clinic',
    role: 'reception',
    doctorId: 'staff-rec-1',
    licenseNumber: 'REC-091',
    specialty: 'منسق الاستقبال وتنسيق المواعيد',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    departmentId: 'administration',
    isLicensed: true,
    lastActive: new Date().toISOString()
  }
];

export const DEFAULT_SCHEDULES: Record<string, DoctorSchedule> = {
  'doc-moayad': {
    doctorId: 'doc-moayad',
    availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
    timeSlots: ['04:00 م', '05:00 م', '06:00 م', '07:30 م', '08:30 م'],
    dailyCapacity: 6,
    weeklyCapacity: 30,
    sessionDurationMinutes: 45,
    bufferMinutes: 15,
    advanceNoticeHours: 2,
    maxBookingDaysInAdvance: 14,
    vacationDates: [],
    timezone: 'Asia/Riyadh (GMT+3)',
    onDutyNow: true,
    onDutyStartedAt: '2026-10-03 09:00 ص'
  },
  'doc-hakim': {
    doctorId: 'doc-hakim',
    availableDays: ['السبت', 'الأحد', 'الاثنين', 'الأربعاء'],
    timeSlots: ['03:00 م', '04:00 م', '05:30 م', '06:30 م', '08:00 م'],
    dailyCapacity: 5,
    weeklyCapacity: 20,
    sessionDurationMinutes: 30,
    bufferMinutes: 10,
    advanceNoticeHours: 3,
    maxBookingDaysInAdvance: 21,
    vacationDates: [],
    timezone: 'Asia/Riyadh (GMT+3)',
    onDutyNow: true,
    onDutyStartedAt: '2026-10-03 10:00 ص'
  }
};

export const staffAuthService = {
  getCurrentStaff: (): StaffUser | null => {
    const saved = localStorage.getItem(STAFF_AUTH_KEY);
    if (!saved) {
      // Default to Dr. Tareq Al-Hakim (Chief Psychiatrist) for instant active doctor experience
      const defaultUser = DEFAULT_STAFF_USERS[1]; // doc-hakim
      localStorage.setItem(STAFF_AUTH_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_STAFF_USERS[1];
    }
  },

  loginStaff: (email: string, _password?: string): StaffUser => {
    const found = DEFAULT_STAFF_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    const user = found || {
      id: 'staff-' + Date.now(),
      name: email.split('@')[0],
      email: email,
      role: 'psychiatrist' as UserRole,
      doctorId: 'doc-custom',
      licenseNumber: 'MD-PSY-PENDING',
      specialty: 'استشاري نفسي',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
      departmentId: 'psychiatry',
      isLicensed: true,
      lastActive: new Date().toISOString()
    };

    localStorage.setItem(STAFF_AUTH_KEY, JSON.stringify(user));
    return user;
  },

  switchStaffUser: (userId: string): StaffUser => {
    const user = DEFAULT_STAFF_USERS.find(u => u.id === userId) || DEFAULT_STAFF_USERS[0];
    localStorage.setItem(STAFF_AUTH_KEY, JSON.stringify(user));
    return user;
  },

  logoutStaff: () => {
    localStorage.removeItem(STAFF_AUTH_KEY);
  },

  getDoctorSchedule: (doctorId: string): DoctorSchedule => {
    const saved = localStorage.getItem(DOCTOR_SCHEDULES_KEY);
    let schedules: Record<string, DoctorSchedule> = DEFAULT_SCHEDULES;
    if (saved) {
      try {
        schedules = { ...DEFAULT_SCHEDULES, ...JSON.parse(saved) };
      } catch {
        schedules = DEFAULT_SCHEDULES;
      }
    }
    return schedules[doctorId] || {
      doctorId,
      availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
      timeSlots: ['04:00 م', '05:00 م', '06:00 م', '07:00 م', '08:00 م'],
      dailyCapacity: 5,
      weeklyCapacity: 25,
      sessionDurationMinutes: 45,
      bufferMinutes: 15,
      advanceNoticeHours: 2,
      maxBookingDaysInAdvance: 14,
      vacationDates: [],
      timezone: 'Asia/Riyadh (GMT+3)',
      onDutyNow: false
    };
  },

  saveDoctorSchedule: (schedule: DoctorSchedule): DoctorSchedule => {
    const saved = localStorage.getItem(DOCTOR_SCHEDULES_KEY);
    let schedules: Record<string, DoctorSchedule> = DEFAULT_SCHEDULES;
    if (saved) {
      try {
        schedules = { ...DEFAULT_SCHEDULES, ...JSON.parse(saved) };
      } catch {
        schedules = DEFAULT_SCHEDULES;
      }
    }
    schedules[schedule.doctorId] = schedule;
    localStorage.setItem(DOCTOR_SCHEDULES_KEY, JSON.stringify(schedules));
    return schedule;
  },

  toggleOnDuty: (doctorId: string): boolean => {
    const sched = staffAuthService.getDoctorSchedule(doctorId);
    const newStatus = !sched.onDutyNow;
    sched.onDutyNow = newStatus;
    if (newStatus) {
      sched.onDutyStartedAt = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    }
    staffAuthService.saveDoctorSchedule(sched);
    return newStatus;
  }
};
