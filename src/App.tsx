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
  AppNotification
} from './types';

import { 
  api, 
  INITIAL_DOCTORS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_EXERCISES, 
  INITIAL_MESSAGES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_ANALYTICS,
  INITIAL_NOTIFICATIONS
} from './services/api';
import { INITIAL_PATIENTS, INITIAL_ASSESSMENT_RESULTS, INITIAL_PRESCRIPTIONS } from './data/mockPatients';

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
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState<boolean>(false);
  const [isScaleRunnerModalOpen, setIsScaleRunnerModalOpen] = useState<boolean>(false);
  const [runnerScaleId, setRunnerScaleId] = useState<string>('phq-9');
  
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState<boolean>(false);
  const [selectedPrescriptionForView, setSelectedPrescriptionForView] = useState<Prescription | null>(null);

  const [isClinicalFormModalOpen, setIsClinicalFormModalOpen] = useState<boolean>(false);
  const [clinicalFormType, setClinicalFormType] = useState<'mse' | 'suicide_risk' | 'soap_note'>('mse');

  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingInitialDeptId, setBookingInitialDeptId] = useState<string>('psychiatry');
  const [bookingInitialStep, setBookingInitialStep] = useState<1 | 2>(1);
  const [isSelfDiagnosticModalOpen, setIsSelfDiagnosticModalOpen] = useState<boolean>(false);
  const [patientInitialTab, setPatientInitialTab] = useState<'overview' | 'departments' | 'appointments' | 'meds' | 'scales' | 'exercises' | 'messages'>('overview');

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

      if (p.length) setPatients(p);
      if (d.length) setDoctors(d);
      if (a.length) setAppointments(a);
      if (rx.length) setPrescriptions(rx);
      if (sr.length) setScaleResults(sr);
      if (m.length) setMessages(m);
      if (ex.length) setExercises(ex);
      if (logs.length) setAuditLogs(logs);
      if (notifs.length) setNotifications(notifs);
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

    setNotifications(prev => [aptNotif, payNotif, ...prev]);

    await api.auditLogs.log({
      actorName: 'نظام الدفع والمواعيد (' + (saved.paymentMethod || 'PayPal') + ')',
      actorRole: 'نظام إلكتروني',
      action: `سداد حجز استشارة إلكترونية (${saved.amountSAR || 350} ر.س) وتوليد رابط Google Meet وإشعار الطبيب ${saved.doctorName} بالساعات المتاحة`,
      target: `${saved.date} الساعة ${saved.time}`,
      ipAddress: '176.44.201.88',
      status: 'نجاح'
    });
  };

  const handleSendMessage = async (text: string) => {
    const saved = await api.messages.send({
      senderId: activePortal === 'patient' ? activePatient.id : 'doc-1',
      senderName: activePortal === 'patient' ? activePatient.name : 'د. طارق الحكيم',
      senderRole: activePortal === 'patient' ? 'patient' : 'doctor',
      text,
      isRead: true
    });
    setMessages(prev => prev.some(m => m.id === saved.id) ? prev : [...prev, saved]);

    // If patient sent message, simulate doctor reply after 1.5 seconds for interactive realistic chat
    if (activePortal === 'patient') {
      setTimeout(async () => {
        const replies = [
          `أهلاً بك يا ${activePatient.name}، قرأت استفسارك بعناية. سأناقش معك هذه النقطة بالتفصيل في موعد جلستنا المجدول عبر Google Meet. استمر على تعليمات الخطة العلاجية الحالية.`,
          `وعليكم السلام، شكراً لمشاركتك هذه الملاحظة. هذه الأعراض متوقعة في هذه المرحلة من الخطة، وسأقوم بمتابعتها معك بدقة أثناء استشارتنا القادمة.`,
          `تم استلام رسالتك وتدوينها في ملفك الطبي. أنصحك بإتمام فحص المقياس النفسي المقنن لمعرفة التطور في حالتك قبل موعدنا.`
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const docReply = await api.messages.send({
          senderId: 'doc-1',
          senderName: activePatient.assignedDoctor || 'د. طارق الحكيم',
          senderRole: 'doctor',
          text: randomReply,
          isRead: false
        });
        setMessages(prev => prev.some(m => m.id === docReply.id) ? prev : [...prev, docReply]);

        const chatNotif = await api.notifications.add({
          title: `رسالة جديدة من ${docReply.senderName}`,
          description: randomReply.substring(0, 80) + '...',
          type: 'chat',
          isRead: false
        });
        setNotifications(prev => [chatNotif, ...prev]);
      }, 1500);
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

  const pendingRiskCount = patients.filter(p => p.riskLevel === 'حرج' || p.riskLevel === 'مرتفع').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-100 selection:bg-teal-500 selection:text-white transition-colors pb-16 md:pb-0" dir="rtl">
      
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
          setPatientInitialTab('messages');
        }}
        onOpenAppointments={() => {
          setActivePortal('patient');
          setPatientInitialTab('appointments');
        }}
        onSelectPatient={handleSelectPatient}
        onOpenOverview={() => setIsOverviewModalOpen(true)}
        onOpenQuickScale={() => handleOpenScaleRunner('phq-9')}
        onOpenNewPrescription={() => setIsPrescriptionModalOpen(true)}
      />

      {/* Portal Switcher Banner for Quick Access */}
      <PortalSwitcherBanner
        activePortal={activePortal}
        setActivePortal={setActivePortal}
      />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* 1. PATIENT / CLIENT PORTAL */}
          {activePortal === 'patient' && (
            <PatientPortalView
              patient={activePatient}
              appointments={appointments}
              prescriptions={prescriptions}
              scaleResults={scaleResults}
              messages={messages}
              exercises={exercises}
              notifications={notifications}
              initialTab={patientInitialTab}
              onBookAppointmentClick={() => {
                setBookingInitialDeptId('psychiatry');
                setBookingInitialStep(1);
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
              auditLogs={auditLogs}
              onAddNewDoctor={handleAddNewDoctor}
              onAddNewPatient={handleAddNewPatient}
            />
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenChat={() => {
          setActivePortal('patient');
          setPatientInitialTab('messages');
        }}
        onOpenBooking={() => {
          setBookingInitialDeptId('psychiatry');
          setBookingInitialStep(1);
          setIsBookingModalOpen(true);
        }}
        unreadChatCount={messages.filter(m => !m.isRead && m.senderRole === 'doctor').length}
      />

      {/* Modals & Dialogs */}
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
        initialDeptId={bookingInitialDeptId}
        initialStep={bookingInitialStep}
        onCompleteBooking={handleBookAppointment}
        onOpenSelfDiagnostic={() => setIsSelfDiagnosticModalOpen(true)}
        onOpenChatWithDoctor={() => {
          setActivePortal('patient');
          setPatientInitialTab('messages');
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
