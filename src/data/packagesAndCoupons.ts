import { TherapyPackage, Coupon, Doctor, InvoiceRecord, DoctorReview } from '../types';

// 1. باقات الطب النفسي والعلاج المعرفي السلوكي (Psychiatry & Psychotherapy)
export const PSYCHIATRY_THERAPY_PACKAGES: TherapyPackage[] = [
  {
    id: 'pkg-psy-single',
    nameAr: 'جلسة منفردة (طبيب / معالج نفسي)',
    nameEn: 'Single Session (Psychiatrist / CBT Therapist)',
    badge: 'السعر الأساسي',
    sessionsCount: 1,
    validityMonths: 1,
    priceUSD: 39.97,
    priceYER: 5700,
    priceSAR: 150,
    originalPriceUSD: 39.97,
    saveAmountUSD: 0,
    saveTextAr: 'السعر المعتمد للجلسة',
    isPopular: false,
    descriptionAr: 'جلسة تشخيصية واستشارية كاملة (45 دقيقة للسلوكي / 30 دقيقة للدوائي) مع نخبة الاستشاريين.',
    sessionDurationText: '45 دقيقة للجلسة السلوكية / 30 دقيقة للاستشارة الطبية النفسية',
    featuresAr: [
      'جلسة فردية كاملة مع مختصك المعتمد (فيديو / صوت / كتابي)',
      'تقييم إكلينيكي وتشخيص شامل بالمقاييس الرقمية المعتمدة',
      'خطة علاجية أولية ومتابعة بعد الجلسة',
      'إمكانية تغيير المعالج مجاناً وبكل مرونة'
    ],
    cancelAnytimeNoticeAr: 'استرداد كامل 100% قبل 24 ساعة من الموعد'
  },
  {
    id: 'pkg-psy-month',
    nameAr: 'باقة الشهر (4 جلسات - خصم 5%)',
    nameEn: 'Monthly Plan (4 Sessions - 5% OFF)',
    badge: 'الأكثر طلباً ⭐',
    sessionsCount: 4,
    validityMonths: 1,
    priceUSD: 151.88,
    priceYER: 21700,
    priceSAR: 569,
    originalPriceUSD: 159.88,
    saveAmountUSD: 8,
    saveTextAr: 'وفّر 5% (فقط $37.97 للجلسة)',
    isPopular: true,
    descriptionAr: 'البرنامج الأكثر فاعلية لعلاج القلق، نوبات الهلع، والاكتئاب وبناء عادات السلوك الإيجابي.',
    sessionDurationText: '4 جلسات مجدولة (45 دقيقة لكل جلسة سلوكية / 30 دقيقة دوائية)',
    featuresAr: [
      '4 جلسات أسبوعية منتظمة لبناء مهارات التفكير والسلوك الإيجابي',
      'مراسلة نصية وتواصل آمن مع مختصك بين الجلسات',
      'واجبات وتمارين تفاعلية (CBT) مخصصة لحالتك مع متابعة التقدم',
      'رسم بياني لتحسن المقاييس النفسية في ملفك الصحي الموحد',
      'أولوية في حجز وتعديل المواعيد'
    ],
    cancelAnytimeNoticeAr: 'يمكنك إلغاء اشتراكك في أي وقت تريده وبدون إبداء أي سبب'
  },
  {
    id: 'pkg-psy-2months',
    nameAr: 'باقة الشهرين (8 جلسات - خصم 10%)',
    nameEn: '2-Month Plan (8 Sessions - 10% OFF)',
    badge: 'وفّر 10%',
    sessionsCount: 8,
    validityMonths: 2,
    priceUSD: 287.76,
    priceYER: 41100,
    priceSAR: 1079,
    originalPriceUSD: 319.76,
    saveAmountUSD: 32,
    saveTextAr: 'وفّر 10% (فقط $35.97 للجلسة)',
    isPopular: false,
    descriptionAr: 'برنامج مكثف للتعافي من الصدمات النفسية ونوبات الهلع والوسواس القهري.',
    sessionDurationText: '8 جلسات موزعة على 8 أسابيع بمتابعة مستمرة',
    featuresAr: [
      '8 جلسات علاج نفسي مكثف مع استشاري مرخص',
      'متابعة ومراسلة مستمرة بين الجلسات لضبط الانتكاسات',
      'تطبيق المقاييس السريرية الدورية ومراقبة مؤشر التعافي',
      'مرونة كاملة في إعادة الجدولة وإلغاء الاشتراك'
    ],
    cancelAnytimeNoticeAr: 'إلغاء واسترداد الرصيد المتبقي في أي وقت'
  },
  {
    id: 'pkg-psy-3months',
    nameAr: 'باقة 3 أشهر (12 جلسة - خصم 16% أقصى توفير)',
    nameEn: '3-Month Plan (12 Sessions - 16% OFF)',
    badge: 'التعافي الشامل والعميق ⭐',
    sessionsCount: 12,
    validityMonths: 3,
    priceUSD: 402.84,
    priceYER: 57600,
    priceSAR: 1510,
    originalPriceUSD: 479.64,
    saveAmountUSD: 76.8,
    saveTextAr: 'وفّر 16% أقصى خصم (فقط $33.57 للجلسة)',
    isPopular: false,
    descriptionAr: 'برنامج التعافي المتكامل للحالات المزمنة واضطرابات الشخصية مع استدامة الوقاية ومنع الانتكاس.',
    sessionDurationText: '12 جلسة موزعة على 12 أسبوعاً بمتابعة إكلينيكية حثيثة',
    featuresAr: [
      '12 جلسة علاج نفسي مكثف مع أفضل الاستشاريين المرخصين',
      'متابعة وتنسيق مشترك بين الطبيب النفسي وأخصائي السلوك',
      'جلسة وقائية بعد انتهاء البرنامج لضمان عدم الانتكاس',
      'تقرير طبي معتمد وخاتم رقمي رسمي عند الطلب'
    ],
    cancelAnytimeNoticeAr: 'إلغاء واسترداد الرصيد المتبقي في أي وقت'
  }
];

// 2. باقات التغذية العلاجية والخدمة الاجتماعية (Nutrition & Social Work - الخيار أ السعر الموحد $29.97)
export const NUTRITION_SOCIAL_PACKAGES: TherapyPackage[] = [
  {
    id: 'pkg-nut-single',
    nameAr: 'جلسة منفردة (تغذية علاجية / خدمة اجتماعية)',
    nameEn: 'Single Session (Clinical Nutrition / Social Worker)',
    badge: 'السعر الأساسي الموحد',
    sessionsCount: 1,
    validityMonths: 1,
    priceUSD: 29.97,
    priceYER: 4300,
    priceSAR: 112,
    originalPriceUSD: 29.97,
    saveAmountUSD: 0,
    saveTextAr: 'السعر المعتمد للجلسة',
    isPopular: false,
    descriptionAr: 'تقييم شامل لمحور الأمعاء-الدماغ، العادات الغذائية، أو الاستشارات الأسرية والزوجية.',
    sessionDurationText: '45 دقيقة للجلسة الاستشارية المتخصصة',
    featuresAr: [
      'تقييم شامل للحالة الغذائية أو دراسة الحالة الاجتماعية',
      'خطة غذائية عصبية مخصصة أو خطة تعديل البيئة الأسرية',
      'متابعة قياسات الوزن والمؤشرات الأيضية'
    ],
    cancelAnytimeNoticeAr: 'استرداد كامل 100% قبل 24 ساعة من الموعد'
  },
  {
    id: 'pkg-nut-month',
    nameAr: 'باقة الشهر (4 جلسات - خصم 5%)',
    nameEn: 'Monthly Nutrition Plan (4 Sessions - 5% OFF)',
    badge: 'الأكثر طلباً للتغذية ⭐',
    sessionsCount: 4,
    validityMonths: 1,
    priceUSD: 113.89,
    priceYER: 16300,
    priceSAR: 427,
    originalPriceUSD: 119.88,
    saveAmountUSD: 6,
    saveTextAr: 'وفّر 5% (فقط $28.47 للجلسة)',
    isPopular: true,
    descriptionAr: 'برنامج شهري متكامل لتعديل السلوك الغذائي، علاج اضطرابات الأكل، أو الاستشارات الأسرية.',
    sessionDurationText: '4 جلسات أسبوعية مجدولة',
    featuresAr: [
      '4 جلسات متابعة أسبوعية وتعديل الجداول الغذائية',
      'تواصل ومتابعة يوميات الوجبات والامتثال',
      'خطة دعم استقرار البيئة الأسرية والاجتماعية'
    ],
    cancelAnytimeNoticeAr: 'إلغاء الاشتراك واسترداد الرصيد المتبقي في أي وقت'
  },
  {
    id: 'pkg-nut-2months',
    nameAr: 'باقة الشهرين (8 جلسات - خصم 10%)',
    nameEn: '2-Month Nutrition Plan (8 Sessions - 10% OFF)',
    badge: 'وفّر 10%',
    sessionsCount: 8,
    validityMonths: 2,
    priceUSD: 215.78,
    priceYER: 30900,
    priceSAR: 809,
    originalPriceUSD: 239.76,
    saveAmountUSD: 24,
    saveTextAr: 'وفّر 10% (فقط $26.97 للجلسة)',
    isPopular: false,
    descriptionAr: 'برنامج تثبيت الوزن الصحي وعلاج اضطرابات القولون العصبي المرتبط بالقلق والإرشاد الأسري.',
    sessionDurationText: '8 جلسات موزعة على 8 أسابيع',
    featuresAr: [
      '8 جلسات متابعة مستمرة وتعديل الخطط',
      'تحليل تفاعلي للوزن ومؤشرات النوم والنشاط',
      'إرشاد أسري متخصص'
    ],
    cancelAnytimeNoticeAr: 'إلغاء واسترداد الرصيد المتبقي في أي وقت'
  },
  {
    id: 'pkg-nut-3months',
    nameAr: 'باقة 3 أشهر (12 جلسة - خصم 16% أقصى توفير)',
    nameEn: '3-Month Nutrition Plan (12 Sessions - 16% OFF)',
    badge: 'التحول الشامل ⭐',
    sessionsCount: 12,
    validityMonths: 3,
    priceUSD: 302.04,
    priceYER: 43200,
    priceSAR: 1132,
    originalPriceUSD: 359.64,
    saveAmountUSD: 57.6,
    saveTextAr: 'وفّر 16% أقصى خصم (فقط $25.17 للجلسة)',
    isPopular: false,
    descriptionAr: 'برنامج التحول ونمط الحياة المستدام لعلاج السمنة العاطفية، استقرار الأيض، والعلاقات الأسرية المستقرة.',
    sessionDurationText: '12 جلسة موزعة على 12 أسبوعاً',
    featuresAr: [
      '12 جلسة متكاملة للرعاية التغذوية والاجتماعية',
      'تنسيق مشترك مع الطبيب النفسي والمعالج السلوكي',
      'متابعة وقائية مستمرة'
    ],
    cancelAnytimeNoticeAr: 'إلغاء واسترداد الرصيد المتبقي في أي وقت'
  }
];

// القائمة الافتراضية الشاملة
export const OFFICIAL_THERAPY_PACKAGES: TherapyPackage[] = PSYCHIATRY_THERAPY_PACKAGES;

export const VALID_COUPONS: Coupon[] = [
  {
    code: 'COOL50',
    discountPercent: 50,
    descriptionAr: 'خصم 50% ترحيبي على الجلسة الأولى',
    isValid: true
  },
  {
    code: 'FIRST10',
    discountPercent: 10,
    descriptionAr: 'خصم 10% لجميع الجلسات والباقات',
    isValid: true
  },
  {
    code: 'Y10',
    discountPercent: 10,
    descriptionAr: 'خصم 10% إضافي عبر كود عرب ثيرابي Y10',
    isValid: true
  },
  {
    code: 'HOPE20',
    discountPercent: 20,
    descriptionAr: 'خصم 20% على باقة الشهر وباقة 3 أشهر',
    isValid: true
  }
];

export const OFFICIAL_DOCTORS_TEAM: Doctor[] = [
  {
    id: 'doc-moayad',
    name: 'أ. محمد المؤيد',
    title: 'أخصائي أول في العلاج النفسي والسلوكي المعرفي (CBT)',
    departmentId: 'psychotherapy',
    specialty: 'أخصائي علاج نفسي وسلوكي',
    licenseNumber: 'YM-PSY-1042',
    phone: '+967-770112233',
    email: 'm.almoayad@coolmind.clinic',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    bio: 'معالج نفسي معتمد متخصص في بروتوكولات العلاج المعرفي السلوكي (CBT) لعلاج اضطرابات القلق، نوبات الهلع، الاكتئاب، والرهاب، وإعادة تنظيم أنماط التفكير المشوهة.',
    rating: 4.95,
    reviewsCount: 420,
    experienceYears: 12,
    priceUSD: 39.97,
    priceYER: 5700,
    priceSAR: 150,
    activePatientsCount: 38,
    availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
    nextAvailableSlot: 'اليوم · 05:00 م',
    languages: ['العربية', 'الإنجليزية'],
    dialect: 'يمنية / بيضاء ميسرة',
    isLicensed: true,
    punctualityRate: 99,
    isAvailable: true
  },
  {
    id: 'doc-amer',
    name: 'د. محمد عامر',
    title: 'استشاري العلاج النفسي الإكلينيكي وعلاج الصدمات (EMDR)',
    departmentId: 'psychotherapy',
    specialty: 'استشاري علاج نفسي إكلينيكي',
    licenseNumber: 'YM-PSY-2105',
    phone: '+967-771223344',
    email: 'dr.amer@coolmind.clinic',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    bio: 'استشاري معتمد بخبرة تتجاوز 15 عاماً في تفكيك صدمات الطفولة واضطراب كرب ما بعد الصدمة وتعديل السلوك وتنمية المرونة النفسية والذكاء العاطفي.',
    rating: 4.98,
    reviewsCount: 512,
    experienceYears: 15,
    priceUSD: 39.97,
    priceYER: 5700,
    priceSAR: 150,
    activePatientsCount: 45,
    availableDays: ['الأحد', 'الاثنين', 'الأربعاء', 'الخميس'],
    nextAvailableSlot: 'غداً · 04:00 م',
    languages: ['العربية', 'الإنجليزية'],
    dialect: 'يمنية / مصرية / فصحى',
    isLicensed: true,
    punctualityRate: 98,
    isAvailable: true
  },
  {
    id: 'doc-wejdan',
    name: 'أ. وجدان فتح الله',
    title: 'أخصائية أولى في التغذية العلاجية النفسية ومحور الأمعاء-الدماغ',
    departmentId: 'nutrition',
    specialty: 'أخصائية تغذية علاجية نفسية',
    licenseNumber: 'YM-NUT-3310',
    phone: '+967-772334455',
    email: 'w.fathallah@coolmind.clinic',
    avatar: 'https://images.unsplash.com/photo-1594824813589-32289658b1a8?w=400&auto=format&fit=crop&q=80',
    bio: 'متخصصة في علاج اضطرابات الأكل (القهم، الشره، نوبات الأكل العاطفي)، ودعم الميكروبيوم المعوي لتحسين إفراز السيروتونين والدوبامين وتخفيف القلق والاكتئاب.',
    rating: 4.92,
    reviewsCount: 280,
    experienceYears: 9,
    priceUSD: 29.97,
    priceYER: 4300,
    priceSAR: 112,
    activePatientsCount: 29,
    availableDays: ['السبت', 'الاثنين', 'الثلاثاء', 'الخميس'],
    nextAvailableSlot: 'اليوم · 06:30 م',
    languages: ['العربية', 'الإنجليزية'],
    dialect: 'يمنية / شامية',
    isLicensed: true,
    punctualityRate: 100,
    isAvailable: true
  },
  {
    id: 'doc-yosra',
    name: 'أ. يسرا علي',
    title: 'أخصائية الخدمة الاجتماعية النفسية والإرشاد الأسري والزوجي',
    departmentId: 'social_work',
    specialty: 'أخصائية خدمة اجتماعية وأسرية',
    licenseNumber: 'YM-SOC-4412',
    phone: '+967-773445566',
    email: 'y.ali@coolmind.clinic',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'خبيرة العلاقات الزوجية والأسرية، وإعادة تأهيل البيئة الاجتماعية لمرضى الاضطرابات النفسية، ودعم المتعافين في بيئات العمل والدراسة بدون وصمة.',
    rating: 4.88,
    reviewsCount: 215,
    experienceYears: 11,
    priceUSD: 29.97,
    priceYER: 4300,
    priceSAR: 112,
    activePatientsCount: 24,
    availableDays: ['الأحد', 'الثلاثاء', 'الأربعاء'],
    nextAvailableSlot: 'غداً · 07:00 م',
    languages: ['العربية'],
    dialect: 'يمنية / خليجية',
    isLicensed: true,
    punctualityRate: 97,
    isAvailable: true
  },
  {
    id: 'doc-seham',
    name: 'د. سهام',
    title: 'استشارية الطب النفسي والتشخيص الإكلينيكي والعلاج الدوائي',
    departmentId: 'psychiatry',
    specialty: 'استشارية الطب النفسي',
    licenseNumber: 'YM-MED-5501',
    phone: '+967-774556677',
    email: 'dr.seham@coolmind.clinic',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    bio: 'طبيبة واستشارية نفسية مرخصة بخبرة واسعة في تشخيص وعلاج اضطرابات المزاج، الاكتئاب المقاوم، ثنائي القطب، والوسواس القهري وضبط الجرعات الدوائية بدقة وأمان.',
    rating: 4.97,
    reviewsCount: 460,
    experienceYears: 14,
    priceUSD: 39.97,
    priceYER: 5700,
    priceSAR: 150,
    activePatientsCount: 41,
    availableDays: ['السبت', 'الأحد', 'الاثنين', 'الأربعاء'],
    nextAvailableSlot: 'اليوم · 04:00 م',
    languages: ['العربية', 'الإنجليزية'],
    dialect: 'يمنية / بيضاء',
    isLicensed: true,
    punctualityRate: 99,
    isAvailable: true
  },
  {
    id: 'doc-saif',
    name: 'بروفيسور سيف الدين الميري',
    title: 'بروفيسور واستشاري أول الطب النفسي وعلاج الإدمان والصحة النفسية',
    departmentId: 'psychiatry',
    specialty: 'بروفيسور الطب النفسي وعلاج الإدمان',
    licenseNumber: 'YM-MED-0012',
    phone: '+967-775667788',
    email: 'prof.saif@coolmind.clinic',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80',
    bio: 'أستاذ الطب النفسي وعضو الجمعية العالمية للطب النفسي، رائد علاج الإدمان والاضطرابات الذهانية والعصابية المعقدة وبروتوكولات الرعاية النفسية الدقيقة.',
    rating: 5.0,
    reviewsCount: 680,
    experienceYears: 24,
    priceUSD: 39.97,
    priceYER: 5700,
    priceSAR: 150,
    activePatientsCount: 52,
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس'],
    nextAvailableSlot: 'الأحد · 05:30 م',
    languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
    dialect: 'يمنية / عربية فصحى',
    isLicensed: true,
    punctualityRate: 100,
    isAvailable: true
  }
];

export const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'INV-2026-0901',
    date: '2026-10-01',
    clientCode: 'CM-984420',
    clientName: 'عميل المنصة (سري)',
    description: 'حجز جلسة علاج سلوكي معرفي (CBT) - أ. محمد المؤيد',
    doctorName: 'أ. محمد المؤيد',
    amountUSD: 39.97,
    amountYER: 5700,
    amountSAR: 150,
    currency: 'USD',
    paymentMethod: 'بطاقة ائتمان (Visa)',
    transactionRef: 'TXN-VISA-994102',
    status: 'مدفوع ومكتمل'
  },
  {
    id: 'inv-1002',
    invoiceNumber: 'INV-2026-0902',
    date: '2026-09-20',
    clientCode: 'CM-984420',
    clientName: 'عميل المنصة (سري)',
    description: 'اشتراك باقة الشهر (4 جلسات) - كود COOL50',
    amountUSD: 75.94,
    amountYER: 10850,
    amountSAR: 285,
    currency: 'USD',
    paymentMethod: 'كريمي جوالي (Kuraimi)',
    transactionRef: 'TXN-KUR-884102',
    status: 'مدفوع ومكتمل'
  }
];

export const INITIAL_REVIEWS: DoctorReview[] = [
  {
    id: 'rev-1',
    doctorId: 'doc-moayad',
    doctorName: 'أ. محمد المؤيد',
    clientFirstName: 'سارة',
    rating: 5,
    comment: 'تجربة فارقة جداً في حياتي، ساعدني أستاذ محمد في التخلص من نوبات الهلع في 4 جلسات فقط.',
    date: '2026-09-28'
  },
  {
    id: 'rev-2',
    doctorId: 'doc-seham',
    doctorName: 'د. سهام',
    clientFirstName: 'عبدالله',
    rating: 5,
    comment: 'دكتورة متمكنة جداً ودقيقة في ضبط الجرعات، شعرت بتحسن كبير من الأسبوع الثاني.',
    date: '2026-09-29'
  }
];
