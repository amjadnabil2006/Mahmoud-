import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabId } from './components/Sidebar';
import { PortalSwitcherBanner } from './components/PortalSwitcherBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CoolMindOverviewBanner } from './components/CoolMindOverviewBanner';
import { ScaleRunnerModal } from './components/ScaleRunnerModal';
import { PrescriptionGeneratorModal } from './components/PrescriptionGeneratorModal';
import { ClinicalFormModal } from './components/ClinicalFormModal';
import { ClientBookingFlowModal } from './components/ClientBookingFlowModal';
import { SelfDiagnosticTriageModal } from './components/SelfDiagnosticTriageModal';

import { PatientPortalView } from './views/PatientPortalView';
import { AdminPortalView } from './views/AdminPortalView';
import { DashboardView } from './views/DashboardView';
import { PsychiatryView } from './views/PsychiatryView';
import { ScalesView } from './views/ScalesView';
import { PrescriptionsView } from './views/PrescriptionsView';
import { ClinicalFormsView } from './views/ClinicalFormsView';
import { NutritionSocialView } from './views/NutritionSocialView';
import { HandbookView } from './views/HandbookView';
import { AccessControlView } from './views/AccessControlView';

import { 
  Patient, 
  Doctor, 
  UserRole, 
  PortalType, 
  ThemeMode, 
  ScaleAssessmentResult, 
  Prescription, 
  Appointment, 
  ChatMessage, 
  TherapyExercise, 
  AuditLog, 
  ClinicAnalytics,
  AppNotification,
  ClinicSettings
} from './types';

import { 
  api, 
  INITIAL_DOCTORS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_EXERCISES, 
  INITIAL_MESSAGES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_ANALYTICS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS
} from './services/api';
import { INITIAL_PATIENTS, INITIAL_ASSESSMENT_RESULTS, INITIAL_PRESCRIPTIONS } from './data/mockPatients';
import { Department, CLINICAL_DEPARTMENTS } from './data/departments';
import { DepartmentManagementModal } from './components/DepartmentManagementModal';
import { Megaphone } from 'lucide-react';

export default function App() {
  // Theme state: dark / light
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('coolmind_theme') as ThemeMode) || 'light';
  });

  // Active Portal: 'patient' | 'doctor' | 'admin'
  const [activePortal, setActivePortal] = useState<PortalType>('patient');

  // Doctor tab state
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('psychiatrist');

  // Data Collections
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>(INITIAL_SETTINGS);
  const [departments, setDepartments] = useState<Department[]>(CLINICAL_DEPARTMENTS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [activePatientId, setActivePatientId] = useState<string>(INITIAL_PATIENTS[0].id);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [scaleResults, setScaleResults] = useState<ScaleAssessmentResult[]>(INITIAL_ASSESSMENT_RESULTS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [exercises, setExercises] = useState<TherapyExercise[]>(INITIAL_EXERCISES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [analytics, setAnalytics] = useState<ClinicAnalytics>(INITIAL_ANALYTICS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals state
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState<boolean>(false);
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState<boolean>(false);
  const [isScaleRunnerModalOpen, setIsScaleRunnerModalOpen] = useState<boolean>(false);
  const [runnerScaleId, setRunnerScaleId] = useState<string>('phq-9');
  
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState<boolean>(false);
  const [selectedPrescriptionForView, setSelectedPrescriptionForView] = useState<Prescription | null>(null);

  const [isClinicalFormModalOpen, setIsClinicalFormModalOpen] = useState<boolean>(false);
  const [clinicalFormType, setClinicalFormType] = useState<'mse' | 'suicide_risk' | 'soap_note'>('mse');

  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingInitialDeptId, setBookingInitialDeptId] = useState<string>('psychiatry');
  const [bookingInitialDoctorId, setBookingInitialDoctorId] = useState<string>('');
  const [bookingInitialPathway, setBookingInitialPathway] = useState<any>('individual');
  const [bookingInitialFormat, setBookingInitialFormat] = useState<any>('video');
  const [bookingInitialStep, setBookingInitialStep] = useState<1 | 2>(1);
  const [isSelfDiagnosticModalOpen, setIsSelfDiagnosticModalOpen] = useState<boolean>(false);
  const [patientTab, setPatientTab] = useState<any>('departments');

  // Sync theme with document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('coolmind_theme', theme);
  }, [theme]);

  // Load from local storage on mount
  useEffect(() => {
    const loadData = async () => {
      const sets = await api.settings.get();
      const depts = await api.departments.getAll();
      const p = await api.patients.getAll();
      const d = await api.doctors.getAll();
      const a = await api.appointments.getAll();
      const rx = await api.prescriptions.getAll();
      const sr = await api.scales.getResults();
      const m = await api.messages.getAll();
      const ex = await api.exercises.getAll();
      const logs = await api.auditLogs.getAll();
      const kpis = await api.analytics.getKPIs();
      const notifs = await api.notifications.getAll();

      if (sets) setClinicSettings(sets);
      if (depts.length) setDepartments(depts);
      if (p.length) setPatients(p);
      if (d.length) setDoctors(d);
      if (a.length) setAppointments(a);
      if (rx.length) setPrescriptions(rx);
      if (sr.length) setScaleResults(sr);
      if (m.length) setMessages(m);
      if (ex.length) setExercises(ex);
      if (logs.length) setAuditLogs(logs);
      if (notifs.length) {
        const seen = new Set<string>();
        const deduped: AppNotification[] = [];
        for (const n of notifs) {
          if (!seen.has(n.id)) {
            seen.add(n.id);
            deduped.push(n);
          }
        }
        setNotifications(deduped);
      }
      setAnalytics(kpis);
    };
    loadData();
  }, []);

  const handleMarkAllNotificationsRead = async () => {
    const updated = await api.notifications.markAllAsRead();
    setNotifications(updated);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  const handleSelectPatient = (patient: Patient) => {
    setActivePatientId(patient.id);
  };

  // Department Management Handlers
  const handleOpenDepartmentManager = (dept?: Department) => {
    setDepartmentToEdit(dept || null);
    setIsDepartmentModalOpen(true);
  };

  const handleCreateDepartment = async (deptData: Omit<Department, 'id'> & { id?: string }) => {
    const created = await api.departments.create(deptData);
    const updated = [...departments, created];
    setDepartments(updated);

    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: `إضافة قسم طبي جديد: ${created.nameAr}`,
      target: `أقسام العيادة / ${created.id}`,
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleUpdateDepartment = async (id: string, updatedFields: Partial<Department>) => {
    const updated = await api.departments.update(id, updatedFields);
    const newDepts = departments.map(d => d.id === id ? updated : d);
    setDepartments(newDepts);

    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: `تعديل بيانات قسم طبي: ${updated.nameAr}`,
      target: `أقسام العيادة / ${id}`,
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleDeleteDepartment = async (id: string) => {
    const targetDept = departments.find(d => d.id === id);
    await api.departments.delete(id);
    const newDepts = departments.filter(d => d.id !== id);
    setDepartments(newDepts);

    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: `حذف قسم طبي: ${targetDept?.nameAr || id}`,
      target: `أقسام العيادة / ${id}`,
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleResetDepartments = async () => {
    const reset = await api.departments.resetToDefault();
    setDepartments(reset);

    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: 'استعادة الأقسام الطبية الافتراضية الأربعة',
      target: 'أقسام العيادة',
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  // Full Admin Platform Handlers
  const handleUpdateSettings = async (newSettings: Partial<ClinicSettings>) => {
    const updated = await api.settings.update(newSettings);
    setClinicSettings(updated);
    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: 'تحديث وتطبيق إعدادات المنصة والموقع',
      target: 'إعدادات الموقع',
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleResetSettings = async () => {
    const reset = await api.settings.reset();
    setClinicSettings(reset);
    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: 'استعادة إعدادات المنصة الافتراضية بالكامل',
      target: 'إعدادات الموقع',
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleUpdateDoctor = async (id: string, updated: Partial<Doctor>) => {
    const doc = await api.doctors.update(id, updated);
    setDoctors(prev => prev.map(d => d.id === id ? doc : d));
    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: `تعديل بيانات الطبيب: ${doc.name}`,
      target: `طبيب / ${id}`,
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleDeleteDoctor = async (id: string) => {
    const target = doctors.find(d => d.id === id);
    await api.doctors.delete(id);
    setDoctors(prev => prev.filter(d => d.id !== id));
    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: `حذف حساب طبيب: ${target?.name || id}`,
      target: `طبيب / ${id}`,
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleUpdatePatient = async (id: string, updated: Partial<Patient>) => {
    const pat = await api.patients.update(id, updated);
    setPatients(prev => prev.map(p => p.id === id ? pat : p));
    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: `تحديث ملف المريض: ${pat.name}`,
      target: `مريض / ${pat.fileNumber}`,
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleDeletePatient = async (id: string) => {
    const target = patients.find(p => p.id === id);
    await api.patients.delete(id);
    setPatients(prev => prev.filter(p => p.id !== id));
    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: `أرشفة وحذف ملف مريض: ${target?.name || id}`,
      target: `مريض / ${id}`,
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleUpdateAppointment = async (id: string, updated: Partial<Appointment>) => {
    const appt = await api.appointments.update(id, updated);
    setAppointments(prev => prev.map(a => a.id === id ? appt : a));
    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: `تعديل حجز الجلسة للمريض: ${appt.patientName}`,
      target: `حجز / ${id}`,
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleDeleteAppointment = async (id: string) => {
    await api.appointments.delete(id);
    setAppointments(prev => prev.filter(a => a.id !== id));
    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: `إلغاء وحذف موعد حجز: ${id}`,
      target: `حجز / ${id}`,
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleAddExercise = async (ex: Omit<TherapyExercise, 'id'>) => {
    const created = await api.exercises.create(ex);
    setExercises(prev => [created, ...prev]);
    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'admin',
      action: `إضافة تمرين سلوكي جديد: ${created.titleAr}`,
      target: `تمرين / ${created.id}`,
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleUpdateExercise = async (id: string, updated: Partial<TherapyExercise>) => {
    const ex = await api.exercises.update(id, updated);
    setExercises(prev => prev.map(e => e.id === id ? ex : e));
  };

  const handleDeleteExercise = async (id: string) => {
    await api.exercises.delete(id);
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const handleOpenScaleRunner = (scaleId?: string) => {
    if (scaleId) setRunnerScaleId(scaleId);
    setIsScaleRunnerModalOpen(true);
  };

  const handleOpenClinicalForm = (formType: 'mse' | 'suicide_risk' | 'soap_note') => {
    setClinicalFormType(formType);
    setIsClinicalFormModalOpen(true);
  };

  const handleSaveScaleResult = async (result: ScaleAssessmentResult) => {
    const saved = await api.scales.saveResult(result);
    setScaleResults([saved, ...scaleResults]);
    
    // update patient completed scales count
    const updatedPatients = patients.map(p => {
      if (p.id === result.patientId) {
        return {
          ...p,
          completedScalesCount: p.completedScalesCount + 1,
          lastVisit: result.date
        };
      }
      return p;
    });
    setPatients(updatedPatients);
    await api.patients.saveAll(updatedPatients);

    await api.auditLogs.log({
      actorName: activePortal === 'patient' ? activePatient.name : 'د. طارق الحكيم',
      actorRole: activePortal === 'patient' ? 'مريض' : 'طبيب نفسي',
      action: `إتمام مقياس ${result.scaleName} بدرجة ${result.totalScore}`,
      target: `ملف ${activePatient.fileNumber}`,
      ipAddress: '192.168.1.1',
      status: 'نجاح'
    });
  };

  const handleSavePrescription = async (prescription: Prescription) => {
    const saved = await api.prescriptions.create(prescription);
    setPrescriptions([saved, ...prescriptions]);
    
    const updatedPatients = patients.map(p => {
      if (p.id === prescription.patientId) {
        return {
          ...p,
          activeMedsCount: prescription.items.length,
          lastVisit: prescription.date
        };
      }
      return p;
    });
    setPatients(updatedPatients);
    await api.patients.saveAll(updatedPatients);

    await api.auditLogs.log({
      actorName: prescription.doctorName,
      actorRole: 'طبيب نفسي',
      action: `إصدار وصفة دوائية (${prescription.items.length} أدوية)`,
      target: `ملف ${prescription.patientName}`,
      ipAddress: '192.168.1.45',
      status: 'نجاح'
    });
  };

  const handleBookAppointment = async (aptData: Omit<Appointment, 'id'>) => {
    const saved = await api.appointments.create(aptData);
    setAppointments([saved, ...appointments]);

    // Send instant welcome & appointment confirmation message in doctor chat
    const doctorChatMsg = {
      senderId: saved.doctorId,
      senderName: saved.doctorName,
      senderRole: 'doctor' as const,
      text: `أهلاً بك ${activePatient.name}، تم تأكيد موعد جلستنا يوم ${saved.date} في تمام الساعة ${saved.time} ${saved.type === 'جلسة عن بُعد (فيديو)' && saved.meetUrl ? `عبر Google Meet (${saved.meetUrl})` : 'في مقر العيادة'}. تم تسجيل حجزك وسأكون بانتظارك. يمكنك كتابة أي استفسارات أو تفاصيل تود مشاركتها مسبقاً هنا.`,
      isRead: false
    };
    const savedMsg = await api.messages.send(doctorChatMsg);
    setMessages(prev => prev.some(m => m.id === savedMsg.id) ? prev : [...prev, savedMsg]);

    // Create real notifications for appointment & payment
    const aptNotif = await api.notifications.add({
      title: 'موعد استشارة مؤكد عبر Google Meet',
      description: `تم تأكيد موعد جلستك مع ${saved.doctorName} يوم ${saved.date} الساعة ${saved.time} بنجاح.`,
      type: 'appointment',
      isRead: false,
      meetUrl: saved.meetUrl
    });

    const payNotif = await api.notifications.add({
      title: `إيصال سداد إلكتروني (${saved.paymentMethod || 'PayPal'})`,
      description: `تم سداد رسوم الاستشارة (${saved.amountSAR || 350} ر.س) بنجاح برقم المعاملة ${saved.transactionId || 'TXN-CONFIRMED'}.`,
      type: 'payment',
      isRead: false
    });

    setNotifications(prev => {
      const existing = new Set(prev.map(n => n.id));
      const toAdd = [aptNotif, payNotif].filter(n => !existing.has(n.id));
      return [...toAdd, ...prev];
    });

    await api.auditLogs.log({
      actorName: 'نظام الدفع والمواعيد (' + (saved.paymentMethod || 'PayPal') + ')',
      actorRole: 'نظام إلكتروني',
      action: `سداد حجز استشارة إلكترونية (${saved.amountSAR || 350} ر.س) وتوليد رابط Google Meet وإشعار الطبيب ${saved.doctorName} بالساعات المتاحة`,
      target: `${saved.date} الساعة ${saved.time}`,
      ipAddress: '176.44.201.88',
      status: 'نجاح'
    });
  };

  const handleSendMessage = async (text: string, targetDoctorId?: string) => {
    const docId = targetDoctorId || 'doc-1';
    const targetDoc = doctors.find(d => d.id === docId) || doctors[0];

    const saved = await api.messages.send({
      senderId: activePortal === 'patient' ? activePatient.id : targetDoc.id,
      senderName: activePortal === 'patient' ? activePatient.name : targetDoc.name,
      senderRole: activePortal === 'patient' ? 'patient' : 'doctor',
      doctorId: targetDoc.id,
      doctorName: targetDoc.name,
      patientId: activePatient.id,
      text,
      isRead: true
    });
    setMessages(prev => prev.some(m => m.id === saved.id) ? prev : [...prev, saved]);

    // If patient sent message, simulate doctor reply after 1.2 seconds for interactive realistic chat
    if (activePortal === 'patient') {
      setTimeout(async () => {
        let doctorReplyText = `أهلاً بك يا ${activePatient.name}، قرأت استفسارك بعناية وسأتابعه معك في جلستنا المجدولة.`;
        if (targetDoc.id === 'doc-1') {
          doctorReplyText = `أهلاً بك يا ${activePatient.name}، تابعت ملاحظتك حول الأدوية والأعراض الإكلينيكية. استمري على الخطة الدوائية المعتمدة وسنراجع مقاييس التحسن في موعدنا القادم عبر Google Meet.`;
        } else if (targetDoc.id === 'doc-2') {
          doctorReplyText = `مرحباً ${activePatient.name}، أحسنتِ بملاحظة الفكرة المشوهة وتدوينها. تذكري تطبيق أسلوب إعادة الصياغة المعرفية وكتابة الفكرة البديلة المنطقية وسنناقشها في الجلسة.`;
        } else if (targetDoc.id === 'doc-3') {
          doctorReplyText = `أهلاً ${activePatient.name}، تعديل النظام الغذائي لدعم محور الأمعاء-الدماغ يحتاج لبعض التدرج لبناء مستويات السيروتونين الطبيعي وتخفيف الإجهاد العصبي. سنراجع النتائج سوياً.`;
        } else if (targetDoc.id === 'doc-4') {
          doctorReplyText = `مرحباً ${activePatient.name}، دعم المحيط الأسري والتوازن البيئي خطوة جوهرية في استدامة رحلة تعافيك. فريقنا الاستشاري متواجد لمساندتك دائماً.`;
        }

        const docReply = await api.messages.send({
          senderId: targetDoc.id,
          senderName: targetDoc.name,
          senderRole: 'doctor',
          doctorId: targetDoc.id,
          doctorName: targetDoc.name,
          patientId: activePatient.id,
          text: doctorReplyText,
          isRead: false
        });
        setMessages(prev => prev.some(m => m.id === docReply.id) ? prev : [...prev, docReply]);

        const chatNotif = await api.notifications.add({
          title: `رسالة جديدة من ${targetDoc.name}`,
          description: doctorReplyText.substring(0, 80) + '...',
          type: 'chat',
          isRead: false
        });
        setNotifications(prev => {
          if (prev.some(n => n.id === chatNotif.id)) return prev;
          return [chatNotif, ...prev];
        });
      }, 1200);
    }
  };

  const handleToggleExercise = async (id: string) => {
    const updated = await api.exercises.toggleComplete(id);
    setExercises(updated);
  };

  const handleAddNewDoctor = async (doc: Omit<Doctor, 'id'>) => {
    const newDoc = await api.doctors.create(doc);
    setDoctors([newDoc, ...doctors]);
    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'إدارة',
      action: `إضافة حساب ممارس جديد: ${newDoc.name}`,
      target: newDoc.licenseNumber,
      ipAddress: '192.168.1.10',
      status: 'نجاح'
    });
  };

  const handleAddNewPatient = async (patientData: Omit<Patient, 'id'>) => {
    const newPat = await api.patients.create(patientData);
    setPatients([newPat, ...patients]);
    await api.auditLogs.log({
      actorName: 'مدير المنصة',
      actorRole: 'إدارة',
      action: `فتح ملف مريض جديد: ${newPat.name}`,
      target: newPat.fileNumber,
      ipAddress: '192.168.1.10',
      status: 'نجاح'
    });
  };

  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    await api.appointments.updateStatus(id, status);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    await api.auditLogs.log({
      actorName: 'الطبيب المعالج',
      actorRole: 'طبيب',
      action: `تحديث حالة موعد الجلسة الإكلينيكية إلى: ${status}`,
      target: `جلسة ${id}`,
      ipAddress: '192.168.1.15',
      status: 'نجاح'
    });
  };

  const pendingRiskCount = patients.filter(p => p.riskLevel === 'حرج' || p.riskLevel === 'مرتفع').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-100 selection:bg-teal-500 selection:text-white transition-colors pb-16 md:pb-0 overflow-x-hidden w-full max-w-full" dir="rtl">
      
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        theme={theme}
        onToggleTheme={toggleTheme}
        activePatient={activePatient}
        patients={patients}
        notifications={notifications}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onOpenChat={() => {
          setActivePortal('patient');
          setPatientTab('messages');
        }}
        onOpenAppointments={() => {
          setActivePortal('patient');
          setPatientTab('appointments');
        }}
        onSelectPatient={handleSelectPatient}
        onOpenOverview={() => setIsOverviewModalOpen(true)}
        onOpenQuickScale={() => handleOpenScaleRunner('phq-9')}
        onOpenNewPrescription={() => setIsPrescriptionModalOpen(true)}
      />

      {/* Dynamic Announcement Banner from Clinic Settings */}
      {clinicSettings.showAnnouncementBanner && clinicSettings.announcementText && (
        <div className={`w-full py-2 px-4 text-xs font-bold text-center border-b transition-colors flex items-center justify-center gap-2 ${
          clinicSettings.announcementType === 'warning'
            ? 'bg-amber-500 text-slate-950 border-amber-600'
            : clinicSettings.announcementType === 'success'
            ? 'bg-emerald-600 text-white border-emerald-700'
            : 'bg-teal-700 text-white border-teal-800'
        }`}>
          <Megaphone className="w-3.5 h-3.5 shrink-0" />
          <span>{clinicSettings.announcementText}</span>
        </div>
      )}

      {/* Portal Switcher Banner for Quick Access */}
      <PortalSwitcherBanner
        activePortal={activePortal}
        setActivePortal={setActivePortal}
      />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto overflow-hidden">
        
        {/* If Active Portal is DOCTOR: Show Clinical Workspace Sidebar */}
        {activePortal === 'doctor' && (
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            currentRole={currentRole}
            pendingRiskCount={pendingRiskCount}
          />
        )}

        {/* Dynamic Portal View Container */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto max-w-full overflow-x-hidden">
          
          {/* 1. PATIENT / CLIENT PORTAL */}
          {activePortal === 'patient' && (
            <PatientPortalView
              patient={activePatient}
              patients={patients}
              onSelectPatient={handleSelectPatient}
              doctors={doctors}
              departments={departments}
              settings={clinicSettings}
              appointments={appointments}
              prescriptions={prescriptions}
              scaleResults={scaleResults}
              messages={messages}
              exercises={exercises}
              notifications={notifications}
              activeTab={patientTab}
              onTabChange={setPatientTab}
              onBookAppointmentClick={(docId, deptId, pathway, format) => {
                if (docId) setBookingInitialDoctorId(docId);
                if (deptId) setBookingInitialDeptId(deptId);
                if (pathway) setBookingInitialPathway(pathway);
                if (format) setBookingInitialFormat(format);
                setBookingInitialStep(docId ? 2 : 1);
                setIsBookingModalOpen(true);
              }}
              onBookDepartmentClick={(deptId) => {
                setBookingInitialDeptId(deptId);
                setBookingInitialStep(2);
                setIsBookingModalOpen(true);
              }}
              onOpenSelfDiagnostic={() => setIsSelfDiagnosticModalOpen(true)}
              onTakeScaleClick={(scaleId) => handleOpenScaleRunner(scaleId)}
              onSendMessage={handleSendMessage}
              onToggleExercise={handleToggleExercise}
              onViewPrescription={(rx) => {
                setSelectedPrescriptionForView(rx);
                setIsPrescriptionModalOpen(true);
              }}
              onCancelAppointment={async (aptId) => {
                await api.appointments.updateStatus(aptId, 'ملغي');
                setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: 'ملغي' } : a));
                alert('تم إلغاء الموعد وتطبيق سياسة الاسترداد.');
              }}
              onDoctorRated={(doctorId, rating, comment) => {
                setDoctors(prev => prev.map(d => {
                  if (d.id === doctorId) {
                    const newCount = d.reviewsCount + 1;
                    const newRating = Number(((d.rating * d.reviewsCount + rating) / newCount).toFixed(2));
                    return { ...d, rating: newRating, reviewsCount: newCount };
                  }
                  return d;
                }));
              }}
            />
          )}

          {/* 2. DOCTOR / CLINICIAN PORTAL */}
          {activePortal === 'doctor' && (
            <div>
              {currentTab === 'dashboard' && (
                <DashboardView
                  patients={patients}
                  activePatient={activePatient}
                  onSelectPatient={handleSelectPatient}
                  scaleResults={scaleResults}
                  prescriptions={prescriptions}
                  appointments={appointments}
                  onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                  onOpenQuickScale={handleOpenScaleRunner}
                  onOpenNewPrescription={() => setIsPrescriptionModalOpen(true)}
                  onOpenClinicalForm={handleOpenClinicalForm}
                  onOpenOverviewModal={() => setIsOverviewModalOpen(true)}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  currentRole={currentRole}
                />
              )}

              {currentTab === 'psychiatry' && (
                <PsychiatryView
                  onOpenQuickScale={handleOpenScaleRunner}
                  onOpenNewPrescription={() => setIsPrescriptionModalOpen(true)}
                />
              )}

              {currentTab === 'scales' && (
                <ScalesView
                  activePatient={activePatient}
                  scaleResults={scaleResults}
                  onLaunchScale={handleOpenScaleRunner}
                />
              )}

              {currentTab === 'prescriptions' && (
                <PrescriptionsView
                  prescriptions={prescriptions}
                  activePatient={activePatient}
                  onOpenNewPrescription={() => setIsPrescriptionModalOpen(true)}
                />
              )}

              {currentTab === 'clinical_forms' && (
                <ClinicalFormsView
                  activePatient={activePatient}
                  onOpenClinicalForm={handleOpenClinicalForm}
                />
              )}

              {currentTab === 'nutrition_social' && (
                <NutritionSocialView
                  activePatient={activePatient}
                />
              )}

              {currentTab === 'handbook' && (
                <HandbookView />
              )}

              {currentTab === 'access_control' && (
                <AccessControlView
                  currentRole={currentRole}
                  setCurrentRole={setCurrentRole}
                />
              )}
            </div>
          )}

          {/* 3. ADMIN & CLINIC MANAGEMENT PORTAL */}
          {activePortal === 'admin' && (
            <AdminPortalView
              analytics={analytics}
              doctors={doctors}
              patients={patients}
              departments={departments}
              appointments={appointments}
              exercises={exercises}
              settings={clinicSettings}
              auditLogs={auditLogs}
              onAddNewDoctor={handleAddNewDoctor}
              onUpdateDoctor={handleUpdateDoctor}
              onDeleteDoctor={handleDeleteDoctor}
              onAddNewPatient={handleAddNewPatient}
              onUpdatePatient={handleUpdatePatient}
              onDeletePatient={handleDeletePatient}
              onUpdateAppointment={handleUpdateAppointment}
              onDeleteAppointment={handleDeleteAppointment}
              onAddExercise={handleAddExercise}
              onUpdateExercise={handleUpdateExercise}
              onDeleteExercise={handleDeleteExercise}
              onUpdateSettings={handleUpdateSettings}
              onResetSettings={handleResetSettings}
              onCreateDepartment={handleCreateDepartment}
              onUpdateDepartment={handleUpdateDepartment}
              onDeleteDepartment={handleDeleteDepartment}
              onResetDepartments={handleResetDepartments}
              onOpenDepartmentManagerModal={handleOpenDepartmentManager}
            />
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        patientTab={patientTab}
        onSelectPatientTab={(tab) => {
          setActivePortal('patient');
          setPatientTab(tab);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenBooking={() => {
          setBookingInitialDeptId(departments[0]?.id || 'psychiatry');
          setBookingInitialStep(1);
          setIsBookingModalOpen(true);
        }}
        unreadChatCount={messages.filter(m => !m.isRead && m.senderRole === 'doctor').length}
      />

      {/* Modals & Dialogs */}
      <DepartmentManagementModal
        isOpen={isDepartmentModalOpen}
        onClose={() => {
          setIsDepartmentModalOpen(false);
          setDepartmentToEdit(null);
        }}
        departments={departments}
        doctors={doctors}
        onCreateDepartment={handleCreateDepartment}
        onUpdateDepartment={handleUpdateDepartment}
        onDeleteDepartment={handleDeleteDepartment}
        onResetDepartments={handleResetDepartments}
        initialEditDepartment={departmentToEdit}
      />

      <CoolMindOverviewBanner
        isOpen={isOverviewModalOpen}
        onClose={() => setIsOverviewModalOpen(false)}
        onNavigateToTab={(tab) => {
          setActivePortal('doctor');
          setCurrentTab(tab as TabId);
          setIsOverviewModalOpen(false);
        }}
      />

      <ScaleRunnerModal
        isOpen={isScaleRunnerModalOpen}
        onClose={() => setIsScaleRunnerModalOpen(false)}
        activePatient={activePatient}
        preselectedScaleId={runnerScaleId}
        onSaveResult={handleSaveScaleResult}
      />

      <PrescriptionGeneratorModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => {
          setIsPrescriptionModalOpen(false);
          setSelectedPrescriptionForView(null);
        }}
        activePatient={activePatient}
        onSavePrescription={handleSavePrescription}
      />

      <ClinicalFormModal
        isOpen={isClinicalFormModalOpen}
        onClose={() => setIsClinicalFormModalOpen(false)}
        activePatient={activePatient}
        formType={clinicalFormType}
      />

      <ClientBookingFlowModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        activePatient={activePatient}
        doctors={doctors}
        departments={departments}
        initialDeptId={bookingInitialDeptId}
        initialDoctorId={bookingInitialDoctorId}
        initialPathway={bookingInitialPathway}
        initialFormat={bookingInitialFormat}
        initialStep={bookingInitialStep}
        onCompleteBooking={handleBookAppointment}
        onOpenSelfDiagnostic={() => setIsSelfDiagnosticModalOpen(true)}
        onOpenChatWithDoctor={() => {
          setActivePortal('patient');
          setPatientTab('messages');
        }}
        onOpenDiagnosticScale={(scaleId) => handleOpenScaleRunner(scaleId)}
      />

      <SelfDiagnosticTriageModal
        isOpen={isSelfDiagnosticModalOpen}
        onClose={() => setIsSelfDiagnosticModalOpen(false)}
        onSelectRecommendedDoctor={(deptId) => {
          setBookingInitialDeptId(deptId);
          setBookingInitialStep(2);
          setIsBookingModalOpen(true);
        }}
        onLaunchRecommendedScale={(scaleId) => {
          handleOpenScaleRunner(scaleId);
        }}
      />

    </div>
  );
}
