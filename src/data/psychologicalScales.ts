import { PsychologicalScale } from '../types';

export const PSYCHOLOGICAL_SCALES_DATA: PsychologicalScale[] = [
  {
    id: 'phq-9',
    code: 'PHQ-9',
    nameAr: 'مقياس استبيان صحة المريض للاكتئاب (PHQ-9)',
    nameEn: 'Patient Health Questionnaire-9',
    category: 'الاكتئاب',
    estimatedMinutes: 4,
    targetPopulation: 'البالغون والمراهقون من عمر 12 فما فوق',
    descriptionAr: 'المقياس الدولي الأكثر اعتماداً لتقييم وجود وشدة أعراض الاكتئاب السريري وفق معايير DSM خلال الأسبوعين الماضيين، ويشمل بنداً حاسماً لتقييم أفكار إيذاء النفس (البند 9).',
    referenceCitation: 'Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med. 2001.',
    defaultOptions: [
      { value: 0, labelAr: 'أبداً (0)' },
      { value: 1, labelAr: 'عدة أيام (1)' },
      { value: 2, labelAr: 'أكثر من نصف الأيام (2)' },
      { value: 3, labelAr: 'شبه يومي (3)' }
    ],
    questions: [
      { id: 1, textAr: 'قلة الاهتمام أو انعدام المتعة في ممارسة الأنشطة اليومية؟' },
      { id: 2, textAr: 'الشعور بالإحباط أو الكآبة أو اليأس؟' },
      { id: 3, textAr: 'صعوبة في النوم أو الاستيقاظ المتكرر، أو الإفراط في النوم؟' },
      { id: 4, textAr: 'الشعور بالتعب الدائم أو انعدام الطاقة والنشاط؟' },
      { id: 5, textAr: 'ضعف الشهية لتناول الطعام أو الإفراط في تناوله؟' },
      { id: 6, textAr: 'الشعور بالسوء تجاه نفسك أو أنك شخص فاشل أو خذلت نفسك أو عائلتك؟' },
      { id: 7, textAr: 'صعوبة في التركيز على الأشياء، مثل قراءة الأخبار أو مشاهدة التلفاز أو العمل؟' },
      { id: 8, textAr: 'التحرك أو التحدث ببطء لدرجة لاحظها الآخرون، أو العكس (التململ والحركة المفرطة غير الطبيعية)؟' },
      { id: 9, textAr: 'أفكار حول أنك تفضل أن تكون ميتاً أو الرغبة في إيذاء نفسك بأي طريقة؟' }
    ],
    scoringCriteria: [
      {
        min: 0,
        max: 4,
        labelAr: 'اكتئاب ضئيل أو منعدم (Minimal / Normal)',
        badgeColor: 'emerald',
        interpretation: 'النتيجة تقع ضمن النطاق الطبيعي ولا تشير لمعاناة اكتئابية تتطلب تدخلاً سريرياً.',
        clinicalAction: 'لا يحتاج لعلاج دوائي؛ تقديم تعزيز تثقيفي داعم للحفاظ على الصحة النفسية.'
      },
      {
        min: 5,
        max: 9,
        labelAr: 'اكتئاب خفيف (Mild Depression)',
        badgeColor: 'teal',
        interpretation: 'توجد أعراض اكتئابية خفيفة تؤثر بشكل محدود على الأداء الوظيفي اليومي.',
        clinicalAction: 'المراقبة اليقظة (Watchful Waiting)، الدعم النفسي السلوكي، وتحسين نمط الحياة والنوم.'
      },
      {
        min: 10,
        max: 14,
        labelAr: 'اكتئاب متوسط (Moderate Depression)',
        badgeColor: 'amber',
        interpretation: 'أعراض اكتئابية سريرية واضحة ومسببة لتعطيل الأنشطة الحياتية والعلاقات.',
        clinicalAction: 'يوصى ببدء علاج نفسي معرفي سلوكي (CBT) متخصص، مع النظر في العلاج الدوائي إذا استمرت الأعراض.'
      },
      {
        min: 15,
        max: 19,
        labelAr: 'اكتئاب متوسط إلى شديد (Moderately Severe)',
        badgeColor: 'orange',
        interpretation: 'معاناة سريرية واضحة تستدعي تدخلاً علاجياً متكاملاً دون تأخير.',
        clinicalAction: 'يوصى بالعلاج الدوائي المباشر (مضادات الاكتئاب SSRIs/SNRIs) متزامناً مع جلسات العلاج النفسي المكثف.'
      },
      {
        min: 20,
        max: 27,
        labelAr: 'اكتئاب شديد (Severe Depression)',
        badgeColor: 'rose',
        interpretation: 'حالة سريرية حرجة تتطلب تدخلاً عاجلاً وتقييم دقيق لسلامة المريض وخطورة إيذاء النفس.',
        clinicalAction: 'تدخل طب نفسي فوري، تقييم خطر الانتحار ووضع خطة سلامة ملزمة، وربما التنويم أو الإحالة الطارئة إذا دعت الحاجة.'
      }
    ]
  },
  {
    id: 'gad-7',
    code: 'GAD-7',
    nameAr: 'مقياس اضطراب القلق العام (GAD-7)',
    nameEn: 'Generalized Anxiety Disorder-7',
    category: 'القلق والهلع',
    estimatedMinutes: 3,
    targetPopulation: 'البالغون واليافعون',
    descriptionAr: 'المقياس السريري الموجز المعتمد عالمياً لفرز وقياس شدة أعراض القلق والتوتر النفسي خلال الأسبوعين الماضيين.',
    referenceCitation: 'Spitzer RL, Kroenke K, Williams JB, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006.',
    defaultOptions: [
      { value: 0, labelAr: 'أبداً (0)' },
      { value: 1, labelAr: 'عدة أيام (1)' },
      { value: 2, labelAr: 'أكثر من نصف الأيام (2)' },
      { value: 3, labelAr: 'شبه يومي (3)' }
    ],
    questions: [
      { id: 1, textAr: 'الشعور بالعصبية أو التوتر أو الوجود على حافة الهاوية؟' },
      { id: 2, textAr: 'عدم القدرة على إيقاف القلق أو السيطرة عليه؟' },
      { id: 3, textAr: 'القلق المفرط بشأن أمور ومواضيع مختلفة ومتباينة؟' },
      { id: 4, textAr: 'مواجهة صعوبة في الاسترخاء والهدوء؟' },
      { id: 5, textAr: 'التململ لدرجة صعوبة الجلوس في مكان واحد بثبات؟' },
      { id: 6, textAr: 'سرعة الانزعاج وسرعة الغضب والاستثارة؟' },
      { id: 7, textAr: 'الشعور بالخوف كأن شيئاً مروعاً وكارثياً على وشك الحدوث؟' }
    ],
    scoringCriteria: [
      {
        min: 0,
        max: 4,
        labelAr: 'قلق طبيعي / طفيف جداً (Minimal Anxiety)',
        badgeColor: 'emerald',
        interpretation: 'ضمن المعدل الطبيعي ولا يشير لخلل وظيفي أو اضطراب قلق مرضي.',
        clinicalAction: 'طمأنة المريض ومراجعة مهارات التعامل مع ضغوط الحياة العامة.'
      },
      {
        min: 5,
        max: 9,
        labelAr: 'قلق خفيف (Mild Anxiety)',
        badgeColor: 'teal',
        interpretation: 'أعراض قلق خفيفة قد ترتبط بضغوطات محددة أو نمط حياة مشحون.',
        clinicalAction: 'تدريب على التنفس الاسترخائي والنشاط البدني وتمارين اليقظة الذهنية (Mindfulness).'
      },
      {
        min: 10,
        max: 14,
        labelAr: 'قلق متوسط (Moderate Anxiety)',
        badgeColor: 'amber',
        interpretation: 'مستوى قلق يستوجب التقييم السريري؛ المريض يعاني من إجهاد معطل ومستمر.',
        clinicalAction: 'إجراء مقابلة تشخيصية شاملة؛ جلسات علاج سلوكي معرفي (CBT) موجهة للقلق والتفكير الكارثي.'
      },
      {
        min: 15,
        max: 21,
        labelAr: 'قلق شديد (Severe Anxiety)',
        badgeColor: 'rose',
        interpretation: 'قلق حاد ومزمن يؤثر جذرياً على النوم والعلاقات والقدرة على العمل أو الدراسة.',
        clinicalAction: 'علاج دوائي نفسي (مضادات السيروتونين كخيار أول) مقترناً ببروتوكول CBT مكثف لإدارة القلق.'
      }
    ]
  },
  {
    id: 'isi-insomnia',
    code: 'ISI',
    nameAr: 'مؤشر شدة الأرق السريري (Insomnia Severity Index)',
    nameEn: 'Insomnia Severity Index',
    category: 'النوم والأرق',
    estimatedMinutes: 3,
    targetPopulation: 'البالغون',
    descriptionAr: 'أداة قياس دقيقة تقيّم صعوبة بدء النوم، واستمراره، والاستيقاظ المبكر، والرضا عن النوم، وتأثيره على جودة الحياة النهارية.',
    referenceCitation: 'Morin CM, Belleville G, Bélanger L, Ivers H. The Insomnia Severity Index: psychometric indicators to detect insomnia cases. Sleep. 2011.',
    defaultOptions: [
      { value: 0, labelAr: 'لا يوجد أبداً (0)' },
      { value: 1, labelAr: 'خفيف (1)' },
      { value: 2, labelAr: 'متوسط (2)' },
      { value: 3, labelAr: 'شديد (3)' },
      { value: 4, labelAr: 'شديد جداً (4)' }
    ],
    questions: [
      { id: 1, textAr: 'صعوبة البدء في النوم والاستغراق فيه؟' },
      { id: 2, textAr: 'صعوبة البقاء نائماً (الاستيقاظ في منتصف الليل)؟' },
      { id: 3, textAr: 'الاستيقاظ المبكر جداً في الصباح دون القدرة على النوم مجدداً؟' },
      { id: 4, textAr: 'ما مدى رضاك أو عدم رضاك عن نمط نومك الحالي؟' },
      { id: 5, textAr: 'إلى أي مدى تعتقد أن مشكلة نومك تلاحظ من قبل الآخرين من حيث الإضرار بجودة حياتك؟' },
      { id: 6, textAr: 'ما مدى قلقك أو ضيقك بشأن مشكلة نومك الحالية؟' },
      { id: 7, textAr: 'إلى أي مدى تؤثر مشكلة النوم على أدائك اليومي (مثل الإرهاق، والتركيز، والمزاج)؟' }
    ],
    scoringCriteria: [
      {
        min: 0,
        max: 7,
        labelAr: 'لا يوجد أرق ذو دلالة إكلينيكية (No Clinically Significant Insomnia)',
        badgeColor: 'emerald',
        interpretation: 'نمط النوم طبيعي ومستقر.',
        clinicalAction: 'الحفاظ على عادات النوم الصحية المنتظمة.'
      },
      {
        min: 8,
        max: 14,
        labelAr: 'أرق تحت العتبة السريرية (Subthreshold Insomnia)',
        badgeColor: 'teal',
        interpretation: 'أعراض أرق خفيفة أو متقطعة ترتبط بالضغوط الحالية أو عادات غير منتظمة.',
        clinicalAction: 'تطبيق قواعد النظافة الصحية للنوم (Sleep Hygiene) وتجنب الشاشات والمثبطات قبل النوم.'
      },
      {
        min: 15,
        max: 21,
        labelAr: 'أرق سريري متوسط الشدة (Clinical Insomnia - Moderate)',
        badgeColor: 'amber',
        interpretation: 'أرق سريري صريح يستلزم خطة علاجية مخصصة ومتابعة مستمرة.',
        clinicalAction: 'بدء العلاج المعرفي السلوكي المخصص للأرق (CBT-I) والتحكم بالمثيرات وتقييد النوم المؤقت.'
      },
      {
        min: 22,
        max: 28,
        labelAr: 'أرق سريري شديد (Severe Clinical Insomnia)',
        badgeColor: 'rose',
        interpretation: 'معاناة نوم حادة مزمنة تؤثر سلباً على الجهاز العصبي ووظائف المناعة والمزاج.',
        clinicalAction: 'تقييم شامل لاستبعاد انقطاع النفس النومي، مع برنامج CBT-I وتدخل دوائي داعم قصير المدى.'
      }
    ]
  },
  {
    id: 'asrs-adhd',
    code: 'ASRS-v1.1',
    nameAr: 'مقياس فرط الحركة وتشتت الانتباه للبالغين (ASRS-v1.1)',
    nameEn: 'Adult ADHD Self-Report Scale',
    category: 'ADHD والنمائي',
    estimatedMinutes: 4,
    targetPopulation: 'البالغون من عمر 18 سنة فما فوق',
    descriptionAr: 'المقياس المعتمد من منظمة الصحة العالمية (WHO) لاستكشاف أعراض تشتت الانتباه وفرط الحركة والاندفاعية لدى الكبار والبالغين.',
    referenceCitation: 'Kessler RC, Adler L, Ames M, et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS). Psychol Med. 2005.',
    defaultOptions: [
      { value: 0, labelAr: 'أبداً (0)' },
      { value: 1, labelAr: 'نادراً (1)' },
      { value: 2, labelAr: 'أحياناً (2)' },
      { value: 3, labelAr: 'غالباً (3)' },
      { value: 4, labelAr: 'غالباً جداً (4)' }
    ],
    questions: [
      { id: 1, textAr: 'كم مرة تواجه صعوبة في إنهاء التفاصيل الأخيرة لمشروع بعد إنجاز الأجزاء الصعبة منه؟' },
      { id: 2, textAr: 'كم مرة تواجه صعوبة في تنظيم أمورك ومهامك عندما تتطلب عملاً منظماً؟' },
      { id: 3, textAr: 'كم مرة تواجه صعوبة في تذكر المواعيد أو الالتزامات اليومية؟' },
      { id: 4, textAr: 'عندما تكون لديك مهمة تتطلب الكثير من التفكير، كم مرة تتجنبها أو تؤجل البدء فيها؟' },
      { id: 5, textAr: 'كم مرة تتململ أو تحرك يديك أو قدميك عندما تضطر للجلوس لفترات طويلة؟' },
      { id: 6, textAr: 'كم مرة تشعر بنشاط مفرط وكأنك مدفوع بمحرك داخلي لا يتوقف؟' }
    ],
    scoringCriteria: [
      {
        min: 0,
        max: 9,
        labelAr: 'أعراض غير دالة على ADHD (Unlikely ADHD)',
        badgeColor: 'emerald',
        interpretation: 'الأعراض نادرة ولا ترجح وجود اضطراب نقص الانتباه وفرط الحركة.',
        clinicalAction: 'البحث عن أسباب أخرى للتشتت مثل الإرهاق أو نقص الحديد أو القلق.'
      },
      {
        min: 10,
        max: 13,
        labelAr: 'أعراض محتملة / متوسطة (Borderline Symptoms)',
        badgeColor: 'amber',
        interpretation: 'توجد صعوبات تنفيذية ملحوظة في التركيز والتنظيم قد ترتبط بـ ADHD أو ضغوط وظيفية.',
        clinicalAction: 'فحص تاريخ الطفولة الدراسي والسلوكي واستبعاد الاكتئاب والقلق المتراكب.'
      },
      {
        min: 14,
        max: 24,
        labelAr: 'احتمالية إكلينيكية عالية لـ ADHD (Highly Consistent with Adult ADHD)',
        badgeColor: 'rose',
        interpretation: 'تطابق إكلينيكي مرتفع مع معايير اضطراب فرط الحركة وتشتت الانتباه للبالغين.',
        clinicalAction: 'إجراء تقييم تشخيصي عصبي نفسي متكامل، ووضع خطة دعم معرفي تنفيذي مع النظر في العلاج الدوائي المنبه.'
      }
    ]
  },
  {
    id: 'ybocs-ocd',
    code: 'Y-BOCS',
    nameAr: 'مقياس ييل-براون للوسواس القهري (Y-BOCS Brief)',
    nameEn: 'Yale-Brown Obsessive Compulsive Scale',
    category: 'الوسواس القهري',
    estimatedMinutes: 6,
    targetPopulation: 'المرضى المصابون بأعراض وسواسية وقهرية',
    descriptionAr: 'المعيار الذهبي السريري العالمي لتقييم شدة الوساوس والأفعال القهرية بغض النظر عن محتواها (الوقت، الإعاقة، الضيق، المقاومة، والسيطرة).',
    referenceCitation: 'Goodman WK, Price LH, Rasmussen SA, et al. The Yale-Brown Obsessive Compulsive Scale. Arch Gen Psychiatry. 1989.',
    defaultOptions: [
      { value: 0, labelAr: 'لا يوجد أبداً (0)' },
      { value: 1, labelAr: 'خفيف (أقل من ساعة يومياً) (1)' },
      { value: 2, labelAr: 'متوسط (1 إلى 3 ساعات يومياً) (2)' },
      { value: 3, labelAr: 'شديد (3 إلى 8 ساعات يومياً) (3)' },
      { value: 4, labelAr: 'شديد للغاية (أكثر من 8 ساعات ومستمر) (4)' }
    ],
    questions: [
      { id: 1, textAr: 'كم من الوقت تشغله الأفكار الوسواسية في يومك؟' },
      { id: 2, textAr: 'إلى أي مدى تعطل الأفكار الوسواسية أداءك الاجتماعي أو المهني أو اليومي؟' },
      { id: 3, textAr: 'ما مقدار الضيق والقلق الذي تسببه لك هذه الأفكار الوسواسية؟' },
      { id: 4, textAr: 'ما مدى مجهودك ومحاولتك لمقاومة هذه الأفكار الوسواسية وصرفها عن ذهنك؟' },
      { id: 5, textAr: 'ما مقدار السيطرة والتحكم لديك فوق تلك الأفكار عندما تطرأ على ذهنك؟' },
      { id: 6, textAr: 'كم من الوقت تقضيه في أداء السلوكيات القهرية والطقوس التكرارية (غسيل، تأكد، عد)؟' },
      { id: 7, textAr: 'إلى أي مدى تعطل السلوكيات القهرية حياتك الاجتماعية ووظيفتك؟' },
      { id: 8, textAr: 'ما مقدار الضيق الذي تشعر به إذا تم منعك قسرياً من أداء هذه الأفعال القهرية؟' },
      { id: 9, textAr: 'ما مدى محاولاتك لمقاومة دافع تنفيذ السلوكيات القهرية؟' },
      { id: 10, textAr: 'ما مقدار سيطرتك وقدرتك على إيقاف السلوك القهري بمجرد بدئه؟' }
    ],
    scoringCriteria: [
      {
        min: 0,
        max: 7,
        labelAr: 'أعراض غير ملحوظة إكلينيكياً (Subclinical)',
        badgeColor: 'emerald',
        interpretation: 'الوساوس نادرة ولا تؤثر على المسار الوظيفي للشخص.',
        clinicalAction: 'طمأنة ومتابعة وقائية.'
      },
      {
        min: 8,
        max: 15,
        labelAr: 'وسواس قهري خفيف (Mild OCD)',
        badgeColor: 'teal',
        interpretation: 'أعراض وسواسية وقهرية خفيفة تستغرق بعض الوقت دون تعطيل جسيم.',
        clinicalAction: 'بدء تدريب سلوكي مبسط للتعرض ومنع الاستجابة (ERP).'
      },
      {
        min: 16,
        max: 23,
        labelAr: 'وسواس قهري متوسط (Moderate OCD)',
        badgeColor: 'amber',
        interpretation: 'أعراض وسواسية مجهدة تستهلك ساعات من اليوم وتعيق الإنتاجية.',
        clinicalAction: 'بروتوكول كامل للعلاج بالتعرض ومنع الاستجابة (ERP) جنباً إلى جنب مع العلاج الدوائي بجرعات مناسبة.'
      },
      {
        min: 24,
        max: 31,
        labelAr: 'وسواس قهري شديد (Severe OCD)',
        badgeColor: 'orange',
        interpretation: 'استنزاف يومي هائل وطقوس تكرارية خانقة تقيد حرية المريض بالكامل.',
        clinicalAction: 'علاج دوائي مكثف (جرعات قصوى من الـ SSRIs) مع جلسات ERP مكثفة مرتين أسبوعياً.'
      },
      {
        min: 32,
        max: 40,
        labelAr: 'وسواس قهري شديد للغاية ومستعصٍ (Extreme OCD)',
        badgeColor: 'rose',
        interpretation: 'عجز شبه كامل عن الأداء اليومي وتطويق تام لحياة المريض ومحيطه الأسري.',
        clinicalAction: 'تدخل عاجل متعدد التخصصات، تدعيم دوائي بمضادات الذهان بجرعات مدروسة، وتقييم إمكانية الرعاية المكثفة.'
      }
    ]
  },
  {
    id: 'pcl-5-ptsd',
    code: 'PCL-5',
    nameAr: 'مقياس أعراض اضطراب ما بعد الصدمة (PCL-5 المختصر)',
    nameEn: 'PTSD Checklist for DSM-5',
    category: 'الصدمة والضغوط',
    estimatedMinutes: 5,
    targetPopulation: 'الأشخاص الذين تعرضوا لأحداث صادمة أو مهددة للحياة',
    descriptionAr: 'يقيس الأعراض الأربعة الرئيسية لاضطراب ما بعد الصدمة (الاقتحام، التجنب، التغيرات السلبية في المزاج، والاستثارة المفرطة).',
    referenceCitation: 'Blevins CA, Weathers FW, Davis MT, et al. The Posttraumatic Stress Disorder Checklist for DSM-5 (PCL-5). J Trauma Stress. 2015.',
    defaultOptions: [
      { value: 0, labelAr: 'على الإطلاق (0)' },
      { value: 1, labelAr: 'قليلاً (1)' },
      { value: 2, labelAr: 'بشكل متوسط (2)' },
      { value: 3, labelAr: 'بشكل كبير (3)' },
      { value: 4, labelAr: 'بشكل متطرف للغاية (4)' }
    ],
    questions: [
      { id: 1, textAr: 'ذكريات متكررة وغير مرغوبة ومؤلمة عن التجربة المؤلمة الصادمة؟' },
      { id: 2, textAr: 'أحلام مزعجة وكوابيس متكررة مرتبطة بالحدث الصادم؟' },
      { id: 3, textAr: 'الشعور أو التصرف فجأة وكأن التجربة المؤلمة تحدث من جديد (فلاش باك)؟' },
      { id: 4, textAr: 'تجنب تذكر أو التفكير أو الحديث عن التجربة المؤلمة أو المشاعر المرتبطة بها؟' },
      { id: 5, textAr: 'تجنب الأشياء الخارجية (أشخاص، أماكن، محادثات، أنشطة) التي تذكرك بالحدث؟' },
      { id: 6, textAr: 'معتقدات سلبية قوية ومبالغ فيها عن نفسك أو الآخرين أو العالم؟' },
      { id: 7, textAr: 'فقدان الاهتمام بالأنشطة التي كنت تستمتع بها في السابق؟' },
      { id: 8, textAr: 'الشعور بالانفصال أو التباعد عن الآخرين وعن مشاعرك؟' },
      { id: 9, textAr: 'البقاء في حالة حذر ويقظة مفرطة وترقب دائم للخطر؟' },
      { id: 10, textAr: 'ردود فعل جفول مبالغ فيها والقفز عند سماع أصوات مفاجئة؟' }
    ],
    scoringCriteria: [
      {
        min: 0,
        max: 10,
        labelAr: 'أعراض صدمة طفيفة / طبيعية (Minimal Symptoms)',
        badgeColor: 'emerald',
        interpretation: 'لا توجد مؤشرات لاضطراب ما بعد الصدمة السريري.',
        clinicalAction: 'دعم نفسي عام وتعزيز التكيف والصلابة النفسية.'
      },
      {
        min: 11,
        max: 20,
        labelAr: 'أعراض صدمة متوسطة (Moderate Post-Traumatic Symptoms)',
        badgeColor: 'amber',
        interpretation: 'توجد علامات ضغط صدمي ملحوظة قد تتطلب تدخلاً موجهاً لمنع التثبيت المزمن.',
        clinicalAction: 'بدء علاج نفسي مركز على معالجة الصدمة (TF-CBT أو EMDR).'
      },
      {
        min: 21,
        max: 40,
        labelAr: 'مؤشر قوي على اضطراب ما بعد الصدمة (High Likelihood of PTSD)',
        badgeColor: 'rose',
        interpretation: 'المريض يعاني من متلازمة ما بعد الصدمة السريرية المكتملة الأركان.',
        clinicalAction: 'خطة علاجية شمولية تشمل تقنيات إزالة الحساسية (EMDR) أو التعرض المطول، مع استشارة طبية نفسية للتدخل الدوائي.'
      }
    ]
  }
];
