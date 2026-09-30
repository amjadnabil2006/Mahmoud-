import { DisorderInfo } from '../types';

export const DISORDERS_DATA: DisorderInfo[] = [
  {
    id: 'mdd',
    codeDSM5: '296.32 / F32.1',
    codeICD11: '6A70',
    nameAr: 'اضطراب الاكتئاب الجسيم (Major Depressive Disorder)',
    nameEn: 'Major Depressive Disorder',
    category: 'اضطرابات المزاج',
    diagnosticDuration: 'أسبوعان على الأقل بمعظم الأيام',
    coreCriteriaAr: [
      'مزاج مكتئب معظم اليوم ويومياً تقريباً.',
      'فقدان ملحوظ للمتعة والاهتمام بالأنشطة (Anhedonia).',
      'تغير ملحوظ في الوزن أو الشهية (نقص أو زيادة).',
      'أرق أو فرط في النوم شبه يومي.',
      'هياج نفسي حركي أو بطء ملحوظ.',
      'إجهاد وفقدان الطاقة، والشعور المفرط بانعدام القيمة أو الذنب غير المبرر.',
      'صعوبة في التركيز واتخاذ القرارات.',
      'أفكار متكررة عن الموت أو التفكير في الانتحار.'
    ],
    differentialDiagnoses: [
      'اضطراب ثنائي القطب (طور الاكتئاب)',
      'قصور الغدة الدرقية (Hypothyroidism)',
      'اكتئاب ناتج عن مواد أو أدوية',
      'اضطراب التكيف المصحوب بمزاج مكتئب'
    ],
    recommendedScales: ['PHQ-9', 'BDI-II (بيك للاكتئاب)', 'DASS-21'],
    firstLineTherapy: 'العلاج المعرفي السلوكي (CBT)، العلاج بالقبول والالتزام (ACT)، العلاج بين الشخصي (IPT)',
    firstLinePharmacotherapy: 'مضادات استرداد السيروتونين الانتقائية (SSRIs مثل Escitalopram, Sertraline) أو (SNRIs مثل Venlafaxine, Duloxetine)'
  },
  {
    id: 'gad',
    codeDSM5: '300.02 / F41.1',
    codeICD11: '6B00',
    nameAr: 'اضطراب القلق العام (Generalized Anxiety Disorder)',
    nameEn: 'Generalized Anxiety Disorder',
    category: 'اضطرابات القلق',
    diagnosticDuration: '6 أشهر على الأقل حول موضوعات ومواقف متعددة',
    coreCriteriaAr: [
      'قلق وهمّ مفرط يصعب السيطرة عليهما.',
      'التململ أو الشعور بالحافة والعصبية المفرطة.',
      'سرعة الإجهاد والتعب العضلي.',
      'صعوبة التركيز أو فراغ الذهن فجأة.',
      'شد وتوتر عضلي ملحوظ.',
      'اضطرابات في النوم (صعوبة البدء أو الاستمرار فيه).'
    ],
    differentialDiagnoses: [
      'فرط نشاط الغدة الدرقية',
      'اضطراب الهلع (Panic Disorder)',
      'اضطراب القلق الاجتماعي (Social Anxiety)',
      'استهلاك مفرط للمنبهات أو الكافيين'
    ],
    recommendedScales: ['GAD-7', 'BAI (بيك للقلق)', 'DASS-21-Anxiety'],
    firstLineTherapy: 'العلاج المعرفي السلوكي للقلق (CBT) مع تقنيات الاسترخاء العضلي والتنفس البطني',
    firstLinePharmacotherapy: 'SSRIs (Escitalopram, Sertraline, Paroxetine) أو SNRIs (Duloxetine, Venlafaxine)'
  },
  {
    id: 'ocd',
    codeDSM5: '300.3 / F42',
    codeICD11: '6B20',
    nameAr: 'اضطراب الوسواس القهري (Obsessive-Compulsive Disorder)',
    nameEn: 'Obsessive-Compulsive Disorder',
    category: 'طيف الوسواس القهري',
    diagnosticDuration: 'وجود وساوس أو أفعال قهرية تستغرق أكثر من ساعة يومياً وتسبب خللاً وظيفياً',
    coreCriteriaAr: [
      'وساوس (Obsessions): أفكار أو صور أو دوافع متكررة ومستمرة يُعاش أنها غير مرغوبة ومقتحمة وتسبب ضيقاً شديداً.',
      'أفعال قهرية (Compulsions): سلوكيات متكررة (غسيل، ترتيب، فحص) أو أفعال عقلية (دعاء، عدّ، تكرار كلمات) يلتزم المريض بها استجابة لوسواس لخفض القلق.',
      'إدراك أن المعتقدات الوسواسية قد لا تكون واقعية (البصيرة تتراوح بين جيدة ومعدومة).'
    ],
    differentialDiagnoses: [
      'اضطراب الشخصية الوسواسية (OCPD - إيجو سينتونيك)',
      'اضطراب تشوه الجسد (BDD)',
      'اضطراب القلق العام (هموم واقعية مقابل وساوس غريبة)',
      'الاضطرابات الذهانية (في حال انعدام البصيرة)'
    ],
    recommendedScales: ['Y-BOCS (مقياس ييل-براون)', 'OCI-R'],
    firstLineTherapy: 'التعرض ومنع الاستجابة (ERP - Exposure and Response Prevention) وهو المعيار الذهبي',
    firstLinePharmacotherapy: 'SSRIs بجرعات إكلينيكية مرتفعة (Fluvoxamine, Sertraline, Fluoxetine) أو Clomipramine'
  },
  {
    id: 'panic_disorder',
    codeDSM5: '300.01 / F41.0',
    codeICD11: '6B01',
    nameAr: 'اضطراب الهلع (Panic Disorder)',
    nameEn: 'Panic Disorder',
    category: 'اضطرابات القلق',
    diagnosticDuration: 'نوبات هلع غير متوقعة متكررة مع قلق استباقي لشهر على الأقل',
    coreCriteriaAr: [
      'نوبات هلع مفاجئة تبلغ ذروتها خلال دقائق معدودة.',
      'خفقان وتسارع ضربات القلب، تعرق، وارتجاف.',
      'ضيق في التنفس أو شعور بالاختناق، وألم بالصدر.',
      'دوخة، خفة رأس، وشعور بالغثيان.',
      'تبدد الشخصية (Depersonalization) أو تبدد الواقع (Derealization).',
      'خوف مرعب من فقدان السيطرة أو "الجنون" أو الموت الوشيك.',
      'قلق مستمر من تكرار النوبات وسلوكيات تجنبية واضحة.'
    ],
    differentialDiagnoses: [
      'أمراض القلب ونقص التروية القلبية',
      'ورم القواتم (Pheochromocytoma)',
      'اضطرابات الجهاز الهضمي والارتجاع المريئي',
      'انسحاب المهدئات أو الإفراط في الكافيين'
    ],
    recommendedScales: ['PDSS (Panic Disorder Severity Scale)', 'GAD-7'],
    firstLineTherapy: 'CBT المتخصص للهلع (إعادة التقييم المعرفي للعلامات الجسدية + التعرض الداخلي Interoceptive Exposure)',
    firstLinePharmacotherapy: 'SSRIs كعلاج صيانة أول، مع مهدئات قصيرة الأمد جداً (Benzodiazepines) عند الحاجة القصوى فقط'
  },
  {
    id: 'ptsd',
    codeDSM5: '309.81 / F43.10',
    codeICD11: '6B40',
    nameAr: 'اضطراب ما بعد الصدمة (Post-Traumatic Stress Disorder)',
    nameEn: 'Post-Traumatic Stress Disorder',
    category: 'اضطرابات الصدمة',
    diagnosticDuration: 'أكثر من شهر واحد بعد التعرض لحدث صدمي يهدد الحياة أو السلامة',
    coreCriteriaAr: [
      'أعراض اقتحامية: ذكريات أو كوابيس متكررة، أو فلاش باك حسي (Flashbacks).',
      'تجنب مستمر للمثيرات المرتبطة بالصدمة (الأماكن، الأشخاص، الأفكار).',
      'تغيرات سلبية في المزاج والمعرفة: فقدان تذكر أجزاء الصدمة، معتقدات سلبية مشوهة عن الذات والعالم، وتسطح عاطفي.',
      'تغيرات ملحوظة في الاستثارة واليقظة: رد فعل جفول مبالغ فيه (Hypervigilance)، نوبات غضب، وأرق شديد.'
    ],
    differentialDiagnoses: [
      'اضطراب الضغط الحاد (Acute Stress Disorder - أقل من شهر)',
      'اضطراب التكيف (Adjustment Disorder)',
      'اضطراب الاكتئاب الجسيم',
      'إصابات الدماغ الرضية (TBI)'
    ],
    recommendedScales: ['PCL-5', 'IES-R'],
    firstLineTherapy: 'العلاج المعرفي المركز على الصدمة (TF-CBT)، تقنية إزالة الحساسية وحركة العين (EMDR)، والعلاج بالتعرض المطول (PE)',
    firstLinePharmacotherapy: 'Sertraline أو Paroxetine مع Prazosin للكوابيس الصدمية'
  },
  {
    id: 'adhd_adult',
    codeDSM5: '314.01 / F90.2',
    codeICD11: '6A05',
    nameAr: 'اضطراب فرط الحركة وتشتت الانتباه لدى البالغين (Adult ADHD)',
    nameEn: 'Attention-Deficit/Hyperactivity Disorder',
    category: 'الاضطرابات النمائية العصبية',
    diagnosticDuration: 'أعراض مستمرة لأكثر من 6 أشهر بدأت قبل سن 12 عاماً وتظهر في بيئتين على الأقل',
    coreCriteriaAr: [
      'تشتت الانتباه: صعوبة استدامة التركيز، إهمال التفاصيل، صعوبة التنظيم وإدارة الوقت، تسويف مزمن، وإضاعة المقتنيات.',
      'فرط النشاط والاندفاعية: تململ داخلي مزمن، مقاطعة الآخرين أثناء الحديث، صعوبة الانتظار، اتخاذ قرارات متسرعة ذات مخاطر مالية أو مهنية.',
      'تأثير حاد على الإنتاجية الأكاديمية أو المهنية والعلاقات الأسرية.'
    ],
    differentialDiagnoses: [
      'اضطرابات القلق المزمنة',
      'اضطراب ثنائي القطب (نوبات الهوس الخفيف)',
      'اضطرابات الشخصية الحدية (Borderline)',
      'اضطرابات النوم المزمنة وانقطاع التنفس أثناء النوم'
    ],
    recommendedScales: ['ASRS-v1.1 (مقياس البالغين)', 'Wender Utah Scale'],
    firstLineTherapy: 'التدريب السلوكي المعرفي على المهارات التنفيذية والتنظيم وتعديل بيئة العمل',
    firstLinePharmacotherapy: 'المنبهات العصبية (Methylphenidate, Lisdexamfetamine) أو غير المنبهات (Atomoxetine)'
  },
  {
    id: 'insomnia',
    codeDSM5: '780.52 / F51.01',
    codeICD11: '7A00',
    nameAr: 'اضطراب الأرق المزمن (Chronic Insomnia Disorder)',
    nameEn: 'Insomnia Disorder',
    category: 'اضطرابات الأكل والنوم',
    diagnosticDuration: '3 ليالٍ على الأقل في الأسبوع لمدة لا تقل عن 3 أشهر',
    coreCriteriaAr: [
      'صعوبة البدء في النوم على الرغم من توفر الفرصة الملائمة للنوم.',
      'صعوبة استمرار النوم (الاستيقاظ المتكرر ليلاً أو صعوبة العودة للنوم).',
      'الاستيقاظ المبكر صباحاً قبل الموعد بكثير مع العجز عن النوم مجدداً.',
      'معاناة وظيفية نهارية واضحة: إرهاق، تقلب المزاج، تشتت الانتباه، وصداع توتري.'
    ],
    differentialDiagnoses: [
      'انقطاع النفس الانسدادي النومي (Sleep Apnea)',
      'متلازمة تململ الساقين (Restless Legs)',
      'أرق مصاحب لاضطراب الاكتئاب أو القلق',
      'سوء النظافة الصحية للنوم والشاشات الزرقاء'
    ],
    recommendedScales: ['ISI (مؤشر شدة الأرق)', 'PSQI (مقياس بيتسبرغ لجودة النوم)'],
    firstLineTherapy: 'العلاج المعرفي السلوكي للأرق (CBT-I) - تقييد النوم، التحكم في المثيرات، ونظافة النوم',
    firstLinePharmacotherapy: 'الميلاتونين / Melatonin Receptor Agonists أو Trazodone بجرعة منخفضة ليلاً'
  }
];
