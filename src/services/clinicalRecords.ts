import { SavedClinicalRecord, MedicalReport, PeerConsultation, DoctorReferral } from '../types';

const CLINICAL_RECORDS_KEY = 'coolmind_clinical_records';
const MEDICAL_REPORTS_KEY = 'coolmind_medical_reports';
const PEER_CONSULTATIONS_KEY = 'coolmind_peer_consultations';
const DOCTOR_REFERRALS_KEY = 'coolmind_doctor_referrals';

export const INITIAL_SAVED_RECORDS: SavedClinicalRecord[] = [
  {
    id: 'rec-mse-001',
    recordNumber: 'EHR-MSE-2026-081',
    patientId: 'pat-101',
    patientName: 'سارة خالد المنصور',
    patientFileNumber: 'CM-2026-081',
    doctorId: 'doc-hakim',
    doctorName: 'د. طارق الحكيم',
    doctorLicenseNumber: 'MD-PSY-98442',
    formType: 'mse',
    titleAr: 'فحص الحالة العقلية الشامل (MSE)',
    date: '2026-09-28',
    status: 'معتمد وموقع سريرياً',
    summaryText: 'المظهر مرتب، التواصل البصري متقطع مع بطء نفسي حركي، المزاج مكتئب والوجدان متطابق ومقيد، لا توجد ضلالات أو هلاوس نشطة، البصيرة جيدة.',
    formData: {
      appearance_behavior: 'مظهر مهندم ومرتب، نظافة شخصية ممتازة، التواصل البصري متقطع، وضعية الجسد منكمشة تدل على ثقل وتعب.',
      speech_psychomotor: 'كلام بطيء بنبرة منخفضة وخافتة، كمية الكلام قليلة، بطء نفسي حركي واضح دون تململ حركي.',
      mood_affect: 'المزاج الموصوف: حزين ومستنزف ("أشعر كأنني داخل نفق مظلم"). الوجدان: مقيد ومتطابق مع المزاج الاكتئابي.',
      thought_process: 'مجرى التفكير خطي ومنطقي لكن بطيء، محتوى التفكير يتركز على مشاعر الذنب والعجز والتشاؤم من المستقبل دون أفكار هوسية.',
      perception_cognition: 'لا توجد هلاوس سمعية أو بصرية أو حسية. الوعي تام، موجهة للزمان والمكان والأشخاص.',
      insight_judgment: 'البصيرة بالمرض كاملة (Grade 6) ومتقبلة لخطة العلاج المعرفي السلوكي والدوائي، الحكم الاجتماعي سليم.'
    },
    signatureText: 'د. طارق الحكيم - استشاري الطب النفسي والتشخيص الإكلينيكي',
    verifiedStamp: true
  },
  {
    id: 'rec-soap-001',
    recordNumber: 'EHR-SOAP-2026-081-01',
    patientId: 'pat-101',
    patientName: 'سارة خالد المنصور',
    patientFileNumber: 'CM-2026-081',
    doctorId: 'doc-moayad',
    doctorName: 'أ. محمد المؤيد',
    doctorLicenseNumber: 'YM-PSY-1042',
    formType: 'soap_note',
    titleAr: 'ملاحظة تقدم الجلسة العلاجية (SOAP Note - الجلسة 3)',
    date: '2026-09-29',
    status: 'معتمد وموقع سريرياً',
    summaryText: 'تطبيق تقنية تفكيك الأفكار التلقائية المشوهة (التجريد الانتقائي والتهويل)، تحسن ملحوظ في الالتزام بجدول الأنشطة السلوكية اليومية.',
    formData: {
      subjective: 'المريضة تشير إلى انخفاض نوبات البكاء المسائية، لكنها لا تزال تواجه صعوبة في الاستيقاظ المبكر. عبرت عن ارتياحها من تمارين التنفس.',
      objective: 'الحضور في الموعد المحدد، تفاعل ممتاز، أكملت سجل الأفكار اليومي بنسبة 70%. مقياس PHQ-9 انخفض من 16 إلى 13.',
      assessment: 'استجابة إيجابية لمسار العلاج المعرفي السلوكي (CBT). انحسار بطء التفكير مع بقاء التردد في اتخاذ القرارات اليومية.',
      plan: '1) الاستمرار على تدوين 3 أفكار بديلة يومياً. 2) إسناد تمرين تفعيل السلوك (المشي 15 دقيقة صباحاً). 3) الجلسة القادمة بعد أسبوع لمناقشة المعتقدات الجوهرية.'
    },
    signatureText: 'أ. محمد المؤيد - أخصائي العلاج المعرفي السلوكي',
    verifiedStamp: true
  },
  {
    id: 'rec-cssrs-001',
    recordNumber: 'EHR-CSSRS-2026-081',
    patientId: 'pat-101',
    patientName: 'سارة خالد المنصور',
    patientFileNumber: 'CM-2026-081',
    doctorId: 'doc-hakim',
    doctorName: 'د. طارق الحكيم',
    doctorLicenseNumber: 'MD-PSY-98442',
    formType: 'suicide_risk',
    titleAr: 'بروتوكول كولومبيا لتقييم خطورة الانتحار وإيذاء النفس (C-SSRS)',
    date: '2026-09-28',
    status: 'معتمد وموقع سريرياً',
    summaryText: 'أفكار سلبية عابرة بدون نية أو خطة أو وسائل. روادع دينية وأسرية قوية جداً. مستوى الخطورة: منخفض مع خطة أمان مفعلة.',
    formData: {
      ideation_severity: 'أفكار سلبية تمنّي الموت بدون رغبة في إيذاء النفس (Passive death wish)، لا توجد نية إيجابية أو خطة محددة.',
      protective_factors: 'روادع دينية راسخة، ارتباط عاطفي وثيق بالأطفال والأسرة، حب الحياة والرغبة في استعادة النشاط الوظيفي.',
      risk_factors: 'تشخيص اكتئاب حالي، توتر مهني حديث، قلة النوم.',
      safety_plan: 'تم توثيق خطة الأمان المكتوبة مع تزويد المريضة بأرقام الخط الساخن لكول مايند ورقم الطوارئ الأسري.'
    },
    emergencyEscalated: false,
    signatureText: 'د. طارق الحكيم - استشاري الطب النفسي',
    verifiedStamp: true
  },
  {
    id: 'rec-nutr-001',
    recordNumber: 'EHR-NUT-2026-081',
    patientId: 'pat-101',
    patientName: 'سارة خالد المنصور',
    patientFileNumber: 'CM-2026-081',
    doctorId: 'doc-wejdan',
    doctorName: 'أ. وجدان فتح الله',
    doctorLicenseNumber: 'YM-NUT-3310',
    formType: 'nutrition_plan',
    titleAr: 'الخطة الغذائية الداعمة لمحور الأمعاء-الدماغ (Microbiome & Mood)',
    date: '2026-09-29',
    status: 'معتمد وموقع سريرياً',
    summaryText: 'برنامج غذائي غني بالتربتوفان، المغنيسيوم، والألياف البريبايوتيك لتعزيز الاصطناع الحيوي للسيروتونين وتحسين جودة النوم.',
    formData: {
      target_calories: '1850 سعرة حرارية/يوم',
      macronutrients: 'كربوهيدرات معقدة 50% | بروتين نقي 25% | دهون صحية 25%',
      key_nutrients: 'أوميغا-3 (DHA/EPA)، مغنيسيوم غلايسينات 400 مجم، أطعمة مخمرة (لبن الكفير، مخللات منزلية)، بذور الشيا، الشوكولاتة الداكنة 85%.',
      meal_schedule: 'إفطار دقيق الشوفان بالمكسرات والموز · غداء سمك السلمون مع الخضار الورقية والأرز البني · عشاء خفيف زبادي يوناني مع التوت.',
      gut_brain_notes: 'تجنب المحليات الصناعية والمشروبات الغازية لتقليل الالتهاب العصبي المنخفض الدرجة (Neuroinflammation).'
    },
    signatureText: 'أ. وجدان فتح الله - أخصائية التغذية العلاجية النفسية',
    verifiedStamp: true
  }
];

export const INITIAL_MEDICAL_REPORTS: MedicalReport[] = [
  {
    id: 'rep-01',
    reportNumber: 'REP-PSY-2026-081',
    patientId: 'pat-101',
    patientName: 'سارة خالد المنصور',
    patientFileNumber: 'CM-2026-081',
    doctorId: 'doc-hakim',
    doctorName: 'د. طارق الحكيم',
    type: 'تقرير طبي نفسي',
    date: '2026-09-28',
    diagnosis: 'اضطراب الاكتئاب الجسيم (F32.1 - MDD Moderate to Severe)',
    clinicalSummary: 'المريضة تخضع لبروتوكول علاجي متكامل يجمع بين الدواء النفسي المضاد للاكتئاب وجلسات العلاج المعرفي السلوكي، وتستجيب للخطة العلاجية بصورة مشجعة.',
    recommendations: 'الاستمرار على العلاج الدوائي الموصوف لمدة 6 أشهر على الأقل مع حضور الجلسات الأسبوعية وتجنب الإجهاد النفسي الشديد.',
    isOfficialStamped: true
  },
  {
    id: 'rep-02',
    reportNumber: 'SICK-2026-081-3D',
    patientId: 'pat-101',
    patientName: 'سارة خالد المنصور',
    patientFileNumber: 'CM-2026-081',
    doctorId: 'doc-hakim',
    doctorName: 'د. طارق الحكيم',
    type: 'إجازة مرضية معتمدة',
    date: '2026-09-28',
    validUntil: '2026-10-01',
    daysGranted: 3,
    diagnosis: 'اضطراب المزاج الحاد المصحوب بأرق وتدني التركيز',
    clinicalSummary: 'نظراً للحالة الصحية الراهنة والحاجة للراحة التامة ومتابعة التأثير الدوائي الأولي، تمنح المريضة إجازة مرضية لمدة 3 أيام عمل.',
    recommendations: 'راحة تامة وتجنب القيادة أو تشغيل الآلات في الأيام الثلاثة الأولى من بدء الدواء.',
    isOfficialStamped: true
  }
];

export const INITIAL_PEER_CONSULTATIONS: PeerConsultation[] = [
  {
    id: 'peer-01',
    title: 'استشارة حول حالة اكتئاب مقاوم مع قلق حاد وأرق لا يستجيب لـ SSRI',
    anonymousPatientAge: 32,
    anonymousPatientGender: 'أنثى',
    category: 'الطب النفسي والدوائي',
    description: 'المريضة استخدمت Escitalopram بجرعة 20 مجم لمدة 8 أسابيع مع تحسن جزئي لا يتجاوز 25%. هل يوصى بالتحويل إلى SNRI (مثل Venlafaxine) أو إضافة مكمل مثل Aripiprazole بجرعة منخفضة (2.5 مجم)؟',
    authorDoctorId: 'doc-seham',
    authorDoctorName: 'د. سهام (استشارية الطب النفسي)',
    createdAt: '2026-09-27 11:30 ص',
    replies: [
      {
        id: 'rep-p1',
        doctorName: 'بروفيسور سيف الدين الميري',
        doctorSpecialty: 'بروفيسور الطب النفسي وعلاج الإدمان',
        text: 'أنصح بفحص وظائف الغدة الدرقية وفيتامين د أولاً، ثم التفكير في إضافة بوبروبيون (Bupropion XL 150mg) إذا كان هناك ثقل حركي وتدني دافعية، أو التحويل إلى Duloxetine إذا كانت هناك آلام جسدية مرافقة.',
        timestamp: '2026-09-27 01:15 م'
      },
      {
        id: 'rep-p2',
        doctorName: 'أ. محمد المؤيد',
        doctorSpecialty: 'أخصائي العلاج النفسي والسلوكي',
        text: 'بالتوازي مع التعديل الدوائي، يمكن إدراج بروتوكول اليقظة الذهنية القائمة على المعرفة (MBCT) للتعامل مع الاجترار الفكري والأرق الليلي.',
        timestamp: '2026-09-27 02:40 م'
      }
    ]
  }
];

export const INITIAL_DOCTOR_REFERRALS: DoctorReferral[] = [
  {
    id: 'ref-01',
    patientId: 'pat-101',
    patientName: 'سارة خالد المنصور',
    fromDoctorId: 'doc-hakim',
    fromDoctorName: 'د. طارق الحكيم',
    toDoctorId: 'doc-wejdan',
    toDoctorName: 'أ. وجدان فتح الله',
    toSpecialty: 'التغذية العلاجية ومحور الأمعاء-الدماغ',
    reason: 'تقييم العادات الغذائية ودعم المحور العصبي المعوي بالتوازي مع كورس الدواء النفسي.',
    urgency: 'روتيني',
    date: '2026-09-28',
    status: 'مقبول'
  }
];

export const clinicalStorage = {
  getRecords: (): SavedClinicalRecord[] => {
    const saved = localStorage.getItem(CLINICAL_RECORDS_KEY);
    if (!saved) {
      localStorage.setItem(CLINICAL_RECORDS_KEY, JSON.stringify(INITIAL_SAVED_RECORDS));
      return INITIAL_SAVED_RECORDS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_SAVED_RECORDS;
    }
  },

  saveRecord: (record: SavedClinicalRecord): SavedClinicalRecord[] => {
    const current = clinicalStorage.getRecords();
    const existingIndex = current.findIndex(r => r.id === record.id);
    let updated: SavedClinicalRecord[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = record;
    } else {
      updated = [record, ...current];
    }
    localStorage.setItem(CLINICAL_RECORDS_KEY, JSON.stringify(updated));
    return updated;
  },

  getPatientRecords: (patientId: string): SavedClinicalRecord[] => {
    return clinicalStorage.getRecords().filter(r => r.patientId === patientId);
  },

  getMedicalReports: (): MedicalReport[] => {
    const saved = localStorage.getItem(MEDICAL_REPORTS_KEY);
    if (!saved) {
      localStorage.setItem(MEDICAL_REPORTS_KEY, JSON.stringify(INITIAL_MEDICAL_REPORTS));
      return INITIAL_MEDICAL_REPORTS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_MEDICAL_REPORTS;
    }
  },

  saveMedicalReport: (report: MedicalReport): MedicalReport[] => {
    const current = clinicalStorage.getMedicalReports();
    const updated = [report, ...current.filter(r => r.id !== report.id)];
    localStorage.setItem(MEDICAL_REPORTS_KEY, JSON.stringify(updated));
    return updated;
  },

  getPeerConsultations: (): PeerConsultation[] => {
    const saved = localStorage.getItem(PEER_CONSULTATIONS_KEY);
    if (!saved) {
      localStorage.setItem(PEER_CONSULTATIONS_KEY, JSON.stringify(INITIAL_PEER_CONSULTATIONS));
      return INITIAL_PEER_CONSULTATIONS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_PEER_CONSULTATIONS;
    }
  },

  savePeerConsultation: (item: PeerConsultation): PeerConsultation[] => {
    const current = clinicalStorage.getPeerConsultations();
    const updated = [item, ...current.filter(i => i.id !== item.id)];
    localStorage.setItem(PEER_CONSULTATIONS_KEY, JSON.stringify(updated));
    return updated;
  },

  addPeerReply: (consultationId: string, reply: { doctorName: string; doctorSpecialty: string; text: string }): PeerConsultation[] => {
    const current = clinicalStorage.getPeerConsultations();
    const updated = current.map(item => {
      if (item.id === consultationId) {
        return {
          ...item,
          replies: [
            ...item.replies,
            {
              id: 'rep-' + Date.now(),
              doctorName: reply.doctorName,
              doctorSpecialty: reply.doctorSpecialty,
              text: reply.text,
              timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return item;
    });
    localStorage.setItem(PEER_CONSULTATIONS_KEY, JSON.stringify(updated));
    return updated;
  },

  getReferrals: (): DoctorReferral[] => {
    const saved = localStorage.getItem(DOCTOR_REFERRALS_KEY);
    if (!saved) {
      localStorage.setItem(DOCTOR_REFERRALS_KEY, JSON.stringify(INITIAL_DOCTOR_REFERRALS));
      return INITIAL_DOCTOR_REFERRALS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_DOCTOR_REFERRALS;
    }
  },

  saveReferral: (referral: DoctorReferral): DoctorReferral[] => {
    const current = clinicalStorage.getReferrals();
    const updated = [referral, ...current.filter(r => r.id !== referral.id)];
    localStorage.setItem(DOCTOR_REFERRALS_KEY, JSON.stringify(updated));
    return updated;
  }
};
