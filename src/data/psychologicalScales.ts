import { PsychologicalScale } from '../types';

export const PSYCHOLOGICAL_SCALES_DATA: PsychologicalScale[] = [
  // 1. الاكتئاب والمزاج (Depression & Mood)
  {
    id: 'phq-9',
    code: 'PHQ-9',
    nameAr: 'مقياس استبيان صحة المريض للاكتئاب (PHQ-9)',
    nameEn: 'Patient Health Questionnaire-9',
    category: 'الاكتئاب',
    estimatedMinutes: 4,
    targetPopulation: 'البالغون والمراهقون من عمر 12 فما فوق',
    descriptionAr: 'المقياس الدولي المعتمد لتقييم وجود وشدة أعراض الاكتئاب السريري وفق معايير DSM خلال الأسبوعين الماضيين، ويشمل بنداً حاسماً لتقييم أفكار إيذاء النفس (البند 9).',
    referenceCitation: 'Kroenke K, Spitzer RL, Williams JB. The PHQ-9. J Gen Intern Med. 2001.',
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
      { id: 7, textAr: 'صعوبة في التركيز على الأشياء، مثل قراءة الأخبار أو العمل؟' },
      { id: 8, textAr: 'التحرك أو التحدث ببطء لدرجة لاحظها الآخرون، أو العكس (التململ الحركي)؟' },
      { id: 9, textAr: 'أفكار حول أنك تفضل أن تكون ميتاً أو الرغبة في إيذاء نفسك بأي طريقة؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 4, labelAr: 'اكتئاب ضئيل أو منعدم', badgeColor: 'emerald', interpretation: 'النتيجة ضمن النطاق الطبيعي.', clinicalAction: 'تعزيز تثقيفي داعم.' },
      { min: 5, max: 9, labelAr: 'اكتئاب خفيف (Mild)', badgeColor: 'teal', interpretation: 'أعراض خفيفة تؤثر بشكل محدود.', clinicalAction: 'الدعم النفسي السلوكي وتحسين نمط الحياة.' },
      { min: 10, max: 14, labelAr: 'اكتئاب متوسط (Moderate)', badgeColor: 'amber', interpretation: 'أعراض اكتئابية سريرية واضحة تستدعي تدخلاً.', clinicalAction: 'جلسات علاج نفسي معرفي سلوكي (CBT).' },
      { min: 15, max: 19, labelAr: 'اكتئاب متوسط إلى شديد', badgeColor: 'orange', interpretation: 'معاناة سريرية واضحة وتعطيل وظيفي.', clinicalAction: 'علاج دوائي مع جلسات CBT منتظمة.' },
      { min: 20, max: 27, labelAr: 'اكتئاب شديد (Severe Depression)', badgeColor: 'rose', interpretation: 'حالة سريرية حرجة تتطلب تدخلاً فورياً.', clinicalAction: 'استشارة طبية نفسية عاجلة وتقييم الأمان.' }
    ]
  },
  {
    id: 'dass-21',
    code: 'DASS-21',
    nameAr: 'مقياس الاكتئاب والقلق والضغوط النفسية (DASS-21)',
    nameEn: 'Depression Anxiety Stress Scales-21',
    category: 'الاكتئاب',
    estimatedMinutes: 6,
    targetPopulation: 'البالغون واليافعون من 14 عاماً فأكثر',
    descriptionAr: 'يقيس الأبعاد الثلاثة للاعتلال النفسي: الاكتئاب، القلق الفسيولوجي، والتوتر العصبي خلال الأسبوع الماضي.',
    referenceCitation: 'Lovibond SH, Lovibond PF. Manual for the Depression Anxiety Stress Scales. 1995.',
    defaultOptions: [
      { value: 0, labelAr: 'لا ينطبق عليّ إطلاقاً' },
      { value: 1, labelAr: 'ينطبق بدرجة قليلة / أحياناً' },
      { value: 2, labelAr: 'ينطبق بدرجة ملحوظة / كثيراً' },
      { value: 3, labelAr: 'ينطبق تماماً / معظم الوقت' }
    ],
    questions: [
      { id: 1, textAr: 'وجدت صعوبة في تهدئة نفسي والاسترخاء.' },
      { id: 2, textAr: 'شعرت بجفاف ملحوظ في الفم.' },
      { id: 3, textAr: 'لم أستطع تجربة أي شعور إيجابي أو بهجة على الإطلاق.' },
      { id: 4, textAr: 'واجهت صعوبة في التنفس (مثل سرعة التنفس بدون جهد بدني).' },
      { id: 5, textAr: 'وجدت صعوبة في المبادرة للقيام بأي عمل.' },
      { id: 6, textAr: 'كنت أميل إلى المبالغة في ردود الفعل تجاه المواقف.' },
      { id: 7, textAr: 'شعرت برعشة أو اهتزاز في يدي أو جسدي.' },
      { id: 8, textAr: 'شعرت أنني أستهلك طاقة عصبية كبيرة.' },
      { id: 9, textAr: 'كنت قلقاً من مواقف قد تجعلني أصاب بالذعر أو أبدو سخيفاً.' },
      { id: 10, textAr: 'شعرت أنه ليس لدي ما أتطلع إليه في المستقبل.' },
      { id: 11, textAr: 'وجدت نفسي سريع الانفعال والغضب.' },
      { id: 12, textAr: 'وجدت صعوبة في الاسترخاء والهدوء.' },
      { id: 13, textAr: 'شعرت بالحزن والكآبة واليأس.' },
      { id: 14, textAr: 'لم أتحمل أي شيء يعطلني عما كنت أفعله.' },
      { id: 15, textAr: 'شعرت أنني على وشك الإصابة بالهلع.' },
      { id: 16, textAr: 'لم أتمكن من التحمس لأي شيء.' },
      { id: 17, textAr: 'شعرت أنني لست ذا قيمة كإنسان.' },
      { id: 18, textAr: 'شعرت أنني سريع التأثر والانزعاج.' },
      { id: 19, textAr: 'كنت مدركاً لضربات قلبي السريعة دون مجهود عضلي.' },
      { id: 20, textAr: 'شعرت بالخوف بدون سبب واضح.' },
      { id: 21, textAr: 'شعرت أن الحياة لا معنى لها.' }
    ],
    scoringCriteria: [
      { min: 0, max: 14, labelAr: 'طبيعي / مستقر', badgeColor: 'emerald', interpretation: 'المستويات النفسية تقع في الحدود الطبيعية المتوازنة.', clinicalAction: 'متابعة وقائية ودعم المرونة النفسية.' },
      { min: 15, max: 28, labelAr: 'اعتلال خفيف إلى متوسط', badgeColor: 'amber', interpretation: 'أعراض توتر وقلق تستوجب الانتباه.', clinicalAction: 'تمارين الاسترخاء وجلسات إرشادية CBT.' },
      { min: 29, max: 63, labelAr: 'اعتلال شديد إلى شديد جداً', badgeColor: 'rose', interpretation: 'ارتفاع حاد في مستويات الضغط والاكتئاب.', clinicalAction: 'خطة علاجية مشتركة بين الطبيب والمعالج النفسي.' }
    ]
  },
  {
    id: 'k10',
    code: 'K10',
    nameAr: 'مقياس كيسلر للضائقة النفسية (K10)',
    nameEn: 'Kessler Psychological Distress Scale',
    category: 'الاكتئاب',
    estimatedMinutes: 3,
    targetPopulation: 'البالغون 18+',
    descriptionAr: 'مقياس مسحي عالمي للضائقة النفسية غير المحددة خلال الأيام الثلاثين الماضية.',
    referenceCitation: 'Kessler RC, et al. Short screening scales to monitor population prevalences. 2002.',
    defaultOptions: [
      { value: 1, labelAr: 'أبداً (1)' },
      { value: 2, labelAr: 'نادراً (2)' },
      { value: 3, labelAr: 'أحياناً (3)' },
      { value: 4, labelAr: 'معظم الوقت (4)' },
      { value: 5, labelAr: 'طوال الوقت (5)' }
    ],
    questions: [
      { id: 1, textAr: 'كم مرة شعرت بالتعب الشديد بدون سبب واضح؟' },
      { id: 2, textAr: 'كم مرة شعرت بالتوتر العصبي؟' },
      { id: 3, textAr: 'كم مرة شعرت بالتوتر الشديد لدرجة أنك لم تستطع الهدوء؟' },
      { id: 4, textAr: 'كم مرة شعرت باليأس التام؟' },
      { id: 5, textAr: 'كم مرة شعرت بعدم الاستقرار والتململ؟' },
      { id: 6, textAr: 'كم مرة شعرت بالتململ لدرجة أنك لم تستطع الجلوس ساكناً؟' },
      { id: 7, textAr: 'كم مرة شعرت بالاكتئاب؟' },
      { id: 8, textAr: 'كم مرة شعرت أن كل شيء يتطلب جهداً شاقاً؟' },
      { id: 9, textAr: 'كم مرة شعرت بالحزن الشديد لدرجة أنه لا شيء يبهجك؟' },
      { id: 10, textAr: 'كم مرة شعرت أنك بلا قيمة؟' }
    ],
    scoringCriteria: [
      { min: 10, max: 19, labelAr: 'صحة نفسية جيدة', badgeColor: 'emerald', interpretation: 'ضائقة نفسية منخفضة أو منعدمة.', clinicalAction: 'تعزيز العادات النفسية الإيجابية.' },
      { min: 20, max: 24, labelAr: 'ضائقة نفسية خفيفة', badgeColor: 'teal', interpretation: 'مستوى ضائقة خفيف قد يستفيد من الدعم الذاتي.', clinicalAction: 'تمارين إدارة التوتر.' },
      { min: 25, max: 29, labelAr: 'ضائقة نفسية متوسطة', badgeColor: 'amber', interpretation: 'مؤشر على احتمالية وجود اضطراب قلق أو اكتئاب.', clinicalAction: 'استشارة أخصائي نفسي.' },
      { min: 30, max: 50, labelAr: 'ضائقة نفسية شديدة', badgeColor: 'rose', interpretation: 'مستوى مرتفع من المعاناة النفسية.', clinicalAction: 'تقييم نفسي تخصصي شامل.' }
    ]
  },
  {
    id: 'who-5',
    code: 'WHO-5',
    nameAr: 'مؤشر منظمة الصحة العالمية لجودة الحياة والرفاه النفسي (WHO-5)',
    nameEn: 'WHO-Five Well-Being Index',
    category: 'الاكتئاب',
    estimatedMinutes: 2,
    targetPopulation: 'جميع الفئات من عمر 9 سنوات فما فوق',
    descriptionAr: 'مقياس إيجابي وجيز يقيس الحالة المزاجية وجودة الحياة العامة خلال الأسبوعين الماضيين.',
    referenceCitation: 'World Health Organization. Info Package: Mastering Depression in Primary Care. 1998.',
    defaultOptions: [
      { value: 5, labelAr: 'طوال الوقت (5)' },
      { value: 4, labelAr: 'معظم الوقت (4)' },
      { value: 3, labelAr: 'أكثر من نصف الوقت (3)' },
      { value: 2, labelAr: 'أقل من نصف الوقت (2)' },
      { value: 1, labelAr: 'أحياناً (1)' },
      { value: 0, labelAr: 'أبداً (0)' }
    ],
    questions: [
      { id: 1, textAr: 'شعرت بالبهجة والمزاج الجيد.' },
      { id: 2, textAr: 'شعرت بالهدوء والاسترخاء.' },
      { id: 3, textAr: 'شعرت بالنشاط والحيوية.' },
      { id: 4, textAr: 'استيقظت وأنا أشعر بالانتعاش والراحة.' },
      { id: 5, textAr: 'كانت حياتي اليومية ممتلئة بأشياء تهمني وتثير اهتمامي.' }
    ],
    scoringCriteria: [
      { min: 13, max: 25, labelAr: 'رفاه نفسي ممتاز وجودة حياة عالية', badgeColor: 'emerald', interpretation: 'المؤشر يعكس مستوى ممتازاً من التوازن والسعادة.', clinicalAction: 'الاستمرار في نمط الحياة الصحي الداعم.' },
      { min: 0, max: 12, labelAr: 'تدني الرفاه النفسي / مؤشر خطر اكتئاب', badgeColor: 'rose', interpretation: 'نتيجة أقل من 13 تشير إلى تدني جودة الحياة وخطر الاكتئاب.', clinicalAction: 'إجراء تقييم PHQ-9 واستشارة معالج نفسي.' }
    ]
  },

  // 2. القلق والهلع والرهاب (Anxiety, Panic & Phobia)
  {
    id: 'gad-7',
    code: 'GAD-7',
    nameAr: 'مقياس اضطراب القلق العام (GAD-7)',
    nameEn: 'Generalized Anxiety Disorder-7',
    category: 'القلق والهلع',
    estimatedMinutes: 3,
    targetPopulation: 'البالغون والمراهقون',
    descriptionAr: 'المعيار الذهبي السريري لفرز وقياس حدة أعراض القلق المعمم والتوتر العصبي خلال الأسبوعين الماضيين.',
    referenceCitation: 'Spitzer RL, Kroenke K, Williams JB, Löwe B. A brief measure for assessing generalized anxiety disorder. 2006.',
    defaultOptions: [
      { value: 0, labelAr: 'أبداً (0)' },
      { value: 1, labelAr: 'عدة أيام (1)' },
      { value: 2, labelAr: 'أكثر من نصف الأيام (2)' },
      { value: 3, labelAr: 'شبه يومي (3)' }
    ],
    questions: [
      { id: 1, textAr: 'الشعور بالعصبية أو القلق أو التوتر الشديد؟' },
      { id: 2, textAr: 'عدم القدرة على إيقاف القلق أو السيطرة عليه؟' },
      { id: 3, textAr: 'القلق الزائد حول أمور ومشاكل متعددة؟' },
      { id: 4, textAr: 'صعوبة في الاسترخاء والهدوء؟' },
      { id: 5, textAr: 'التململ الشديد لدرجة تجعل من الصعب البقاء ساكناً؟' },
      { id: 6, textAr: 'سرعة الانزعاج وسهولة الاستثارة والغضب؟' },
      { id: 7, textAr: 'الشعور بالخوف كأن شيئاً فظيعاً ومرعباً على وشك الحدوث؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 4, labelAr: 'قلق ضئيل / طبيعي', badgeColor: 'emerald', interpretation: 'قلق طبيعي ضمن تحديات الحياة العادية.', clinicalAction: 'تثقيف نفسي حول الوقاية وإدارة الضغوط.' },
      { min: 5, max: 9, labelAr: 'قلق خفيف (Mild Anxiety)', badgeColor: 'teal', interpretation: 'أعراض قلق خفيفة.', clinicalAction: 'تمارين التنفس واليقظة الذهنية.' },
      { min: 10, max: 14, labelAr: 'قلق متوسط (Moderate Anxiety)', badgeColor: 'amber', interpretation: 'قلق معمم يستدعي خطة علاجية معرفية سلوكية.', clinicalAction: 'بدء جلسات CBT لإعادة هيكلة الأفكار المقلقة.' },
      { min: 15, max: 21, labelAr: 'قلق شديد (Severe Anxiety)', badgeColor: 'rose', interpretation: 'قلق حاد ومستمر يؤثر سلباً على النوم والأداء اليومي.', clinicalAction: 'تقييم دوائي مع تدخل سلوكي معرفي مكثف.' }
    ]
  },
  {
    id: 'spin-social-anxiety',
    code: 'SPIN',
    nameAr: 'مقياس الرهاب الاجتماعي (Social Phobia Inventory - SPIN)',
    nameEn: 'Social Phobia Inventory',
    category: 'القلق والهلع',
    estimatedMinutes: 5,
    targetPopulation: 'البالغون والمراهقون من عمر 14 فما فوق',
    descriptionAr: 'يقيس الخوف من المواقف الاجتماعية، التجنب، والأعراض الفسيولوجية المصاحبة للرهاب.',
    referenceCitation: 'Connor KM, et al. Psychometric properties of the Social Phobia Inventory (SPIN). 2000.',
    defaultOptions: [
      { value: 0, labelAr: 'إطلاقاً (0)' },
      { value: 1, labelAr: 'قليلاً (1)' },
      { value: 2, labelAr: 'بدرجة متوسطة (2)' },
      { value: 3, labelAr: 'بدرجة كبيرة (3)' },
      { value: 4, labelAr: 'بشدة بالغة (4)' }
    ],
    questions: [
      { id: 1, textAr: 'أشعر بالخوف من الأشخاص الذين يمتلكون سلطة أو مكانة.' },
      { id: 2, textAr: 'أنزعج بشدة عندما أحمر خجلاً أمام الآخرين.' },
      { id: 3, textAr: 'الحفلات والتجمعات الاجتماعية تثير رعبي.' },
      { id: 4, textAr: 'أتجنب التحدث إلى أشخاص لا أعرفهم جيداً.' },
      { id: 5, textAr: 'أخاف بشدة من التعرض للانتقاد أو السخرية.' },
      { id: 6, textAr: 'أتجنب القيام بأي عمل عندما يكون هناك من يراقبني.' },
      { id: 7, textAr: 'التعرق أمام الآخرين يسبب لي ضيقاً وحرجاً شديداً.' },
      { id: 8, textAr: 'أتجنب الذهاب إلى المناسبات الاجتماعية خوفاً من الإحراج.' },
      { id: 9, textAr: 'أخاف من التحدث أمام جمع من الناس أو إلقاء كلمة.' },
      { id: 10, textAr: 'أشعر بخفقان القلب وتسارعه عندما أكون محاطاً بالناس.' }
    ],
    scoringCriteria: [
      { min: 0, max: 10, labelAr: 'لا يوجد رهاب اجتماعي', badgeColor: 'emerald', interpretation: 'تفاعل اجتماعي طبيعي ومرن.', clinicalAction: 'لا يتطلب تدخلاً.' },
      { min: 11, max: 20, labelAr: 'رهاب اجتماعي خفيف', badgeColor: 'teal', interpretation: 'حياء زائد وخجل في بعض المواقف.', clinicalAction: 'مهارات توكيد الذات والتواصل.' },
      { min: 21, max: 30, labelAr: 'رهاب اجتماعي متوسط', badgeColor: 'amber', interpretation: 'تجنب واضح يعيق التطور المهني أو الأكاديمي.', clinicalAction: 'جلسات علاج بالتعرض التدريجي وCBT.' },
      { min: 31, max: 40, labelAr: 'رهاب اجتماعي شديد جداً', badgeColor: 'rose', interpretation: 'عزلة اجتماعية حادة وتجنب شديد للمواقف.', clinicalAction: 'برنامج علاجي متكامل (دوائي ونفسي).' }
    ]
  },
  {
    id: 'pdss-panic',
    code: 'PDSS',
    nameAr: 'مقياس شدة اضطراب الهلع (PDSS)',
    nameEn: 'Panic Disorder Severity Scale',
    category: 'القلق والهلع',
    estimatedMinutes: 4,
    targetPopulation: 'الأشخاص الذين يعانون من نوبات هلع مفاجئة',
    descriptionAr: 'يقيم تكرار نوبات الهلع، شدة الضيق، القلق التوقعي، وتجنب الأماكن (رهاب الساح).',
    referenceCitation: 'Shear MK, et al. Multicenter collaborative Panic Disorder Severity Scale. 1997.',
    defaultOptions: [
      { value: 0, labelAr: 'لا شيء / أبداً (0)' },
      { value: 1, labelAr: 'خفيف / نادراً (1)' },
      { value: 2, labelAr: 'متوسط / أسبوعياً (2)' },
      { value: 3, labelAr: 'شديد / متكرر (3)' },
      { value: 4, labelAr: 'شديد جداً / معطل تماماً (4)' }
    ],
    questions: [
      { id: 1, textAr: 'كم نوبة هلع كاملة أو محدودة داهمتك خلال الأسبوع الماضي؟' },
      { id: 2, textAr: 'ما مدى شدة الضيق والرعب الذي شعرت به أثناء النوبات؟' },
      { id: 3, textAr: 'كم من الوقت استغرق قلقك وتوجسك من حدوث نوبة هلع قادمة؟' },
      { id: 4, textAr: 'ما مدى تجنبك للأماكن أو المواقف خوفاً من حدوث نوبة؟' },
      { id: 5, textAr: 'ما مدى تجنبك للمجهود البدني أو الأحاسيس الجسدية المشابهة للهلع؟' },
      { id: 6, textAr: 'ما مدى تأثير نوبات الهلع على أدائك في العمل أو الدراسة؟' },
      { id: 7, textAr: 'ما مدى تأثير الهلع على علاقاتك الاجتماعية وأنشطتك الترفيهية؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 5, labelAr: 'أعراض هلع طفيفة أو مستقرة', badgeColor: 'emerald', interpretation: 'استقرار في نوبات الهلع والسيطرة عليها.', clinicalAction: 'متابعة الدعم السلوكي.' },
      { min: 6, max: 10, labelAr: 'اضطراب هلع خفيف إلى متوسط', badgeColor: 'amber', interpretation: 'نوبات متكررة مع قلق استباقي ملحوظ.', clinicalAction: 'تدريب على التنفس البطيء وتفكيك التفسير الكارثي للأعراض الجسدية.' },
      { min: 11, max: 28, labelAr: 'اضطراب هلع شديد ومعطل', badgeColor: 'rose', interpretation: 'نوبات هلع حادة مع رهاب ساح وتجنب شللي للحياة اليومية.', clinicalAction: 'استشارة طبية نفسية عاجلة وجلسات علاج هلع متخصصة.' }
    ]
  },

  // 3. الوسواس القهري (OCD & Related)
  {
    id: 'ybocs-ocd',
    code: 'Y-BOCS',
    nameAr: 'مقياس ييل-براون للوسواس القهري (Y-BOCS)',
    nameEn: 'Yale-Brown Obsessive Compulsive Scale',
    category: 'الوسواس القهري',
    estimatedMinutes: 6,
    targetPopulation: 'المشتبه بإصابتهم باضطراب الوسواس القهري',
    descriptionAr: 'المعيار الإكلينيكي العالمي الأول لقياس شدة الأفكار الوسواسية والطقوس القهرية والوقت المستغرق فيها ومقاومتها.',
    referenceCitation: 'Goodman WK, et al. The Yale-Brown Obsessive Compulsive Scale. Arch Gen Psychiatry. 1989.',
    defaultOptions: [
      { value: 0, labelAr: 'منعدم (0)' },
      { value: 1, labelAr: 'خفيف (أقل من ساعة يومياً) (1)' },
      { value: 2, labelAr: 'متوسط (1 إلى 3 ساعات يومياً) (2)' },
      { value: 3, labelAr: 'شديد (3 إلى 8 ساعات يومياً) (3)' },
      { value: 4, labelAr: 'شديد جداً (أكثر من 8 ساعات يومياً) (4)' }
    ],
    questions: [
      { id: 1, textAr: 'ما مقدار الوقت الذي تستغرقه الأفكار الوسواسية الدخيلة يومياً؟' },
      { id: 2, textAr: 'ما مدى التعطيل الذي تسببه الأفكار الوسواسية لعملك وحياتك اليومية؟' },
      { id: 3, textAr: 'ما مقدار الضيق والقلق الذي تولده لديك هذه الأفكار الوسواسية؟' },
      { id: 4, textAr: 'ما مقدار الجهد الذي تبذله لمقاومة ودفع الأفكار الوسواسية؟' },
      { id: 5, textAr: 'ما مدى قدرتك على التحكم والسيطرة على الأفكار الوسواسية إذا داهمتك؟' },
      { id: 6, textAr: 'ما مقدار الوقت الذي تقضيه في أداء السلوكيات والطقوس القهرية (تكرار، غسيل، فحص، ترتيب)؟' },
      { id: 7, textAr: 'ما مدى تعطيل الأفعال والطقوس القهرية لأدائك الاجتماعي والوظيفي؟' },
      { id: 8, textAr: 'ما مقدار القلق الذي تشعر به إذا تم منعك من أداء طقوسك القهرية؟' },
      { id: 9, textAr: 'ما مقدار الجهد الذي تبذله لمقاومة أداء الطقوس القهرية؟' },
      { id: 10, textAr: 'ما مدى قدرتك على إيقاف أو الامتناع عن أداء السلوك القهري؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 7, labelAr: 'وسواس تحت السريري (Subclinical)', badgeColor: 'emerald', interpretation: 'أفكار طبيعية عابرة لا ترقى لاضطراب وسواسي.', clinicalAction: 'تثقيف وقائي ودعم معرفي.' },
      { min: 8, max: 15, labelAr: 'وسواس قهري خفيف (Mild OCD)', badgeColor: 'teal', interpretation: 'أعراض وسواسية خفيفة تستهلك وقتاً محدوداً.', clinicalAction: 'جلسات التعرض ومنع الاستجابة (ERP).' },
      { min: 16, max: 23, labelAr: 'وسواس قهري متوسط (Moderate OCD)', badgeColor: 'amber', interpretation: 'معاناة سريرية واضحة وتعطيل ملموس للأنشطة اليومية.', clinicalAction: 'برنامج ERP مكثف مع استشارة دوائية.' },
      { min: 24, max: 31, labelAr: 'وسواس قهري شديد (Severe OCD)', badgeColor: 'orange', interpretation: 'طقوس قهرية خانقة تستنزف ساعات طويلة من اليوم.', clinicalAction: 'علاج دوائي بجرعات تخصصية مع ERP أسبوعي.' },
      { min: 32, max: 40, labelAr: 'وسواس قهري شديد للغاية (Extreme)', badgeColor: 'rose', interpretation: 'شلل شبه كامل للأنشطة اليومية بسبب الطقوس المستمرة.', clinicalAction: 'تدخل إكلينيكي متكامل ومكثف.' }
    ]
  },

  // 4. النوم والأرق (Sleep & Circadian)
  {
    id: 'isi-sleep',
    code: 'ISI',
    nameAr: 'مؤشر شدة الأرق (Insomnia Severity Index - ISI)',
    nameEn: 'Insomnia Severity Index',
    category: 'النوم والأرق',
    estimatedMinutes: 3,
    targetPopulation: 'الذين يعانون من صعوبات في النوم',
    descriptionAr: 'يقيم شدة صعوبة الدخول في النوم، الاستيقاظ المتكرر، والاستيقاظ المبكر والرضا العام عن النوم.',
    referenceCitation: 'Morin CM, et al. The Insomnia Severity Index: psychometric indicators. 2011.',
    defaultOptions: [
      { value: 0, labelAr: 'لا توجد صعوبة (0)' },
      { value: 1, labelAr: 'صعوبة خفيفة (1)' },
      { value: 2, labelAr: 'صعوبة متوسطة (2)' },
      { value: 3, labelAr: 'صعوبة شديدة (3)' },
      { value: 4, labelAr: 'صعوبة شديدة جداً (4)' }
    ],
    questions: [
      { id: 1, textAr: 'صعوبة الدخول في النوم وبدء النوم عند الاستلقاء؟' },
      { id: 2, textAr: 'صعوبة البقاء نائماً (الاستيقاظ المتكرر خلال الليل)؟' },
      { id: 3, textAr: 'الاستيقاظ المبكر جداً مع عدم القدرة على العودة للنوم؟' },
      { id: 4, textAr: 'ما مدى رضاك/عدم رضاك عن نمط نومك الحالي؟' },
      { id: 5, textAr: 'ما مدى وضوح تأثير مشاكل نومك على جودة حياتك وأدائك اليومي؟' },
      { id: 6, textAr: 'ما مدى قلقك وانزعاجك حيال مشاكل النوم الحالية؟' },
      { id: 7, textAr: 'ما مدى تأثير قلة النوم على تركيزك ومزاجك وطاقتك أثناء النهار؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 7, labelAr: 'لا يوجد أرق ملحوظ سريرياً', badgeColor: 'emerald', interpretation: 'النوم طبيعي وفعال.', clinicalAction: 'الحفاظ على عادات النوم الصحية (Sleep Hygiene).' },
      { min: 8, max: 14, labelAr: 'أرق تحت العتبة السريرية (Subthreshold)', badgeColor: 'teal', interpretation: 'صعوبات نوم خفيفة مرتبطة بضغوط عابرة.', clinicalAction: 'تطبيق إرشادات نظافة النوم وجلسات CBT-I.' },
      { min: 15, max: 21, labelAr: 'أرق سريري متوسط الشدة', badgeColor: 'amber', interpretation: 'أرق سريري مزمن يؤثر بوضوح على الطاقة والتركيز.', clinicalAction: 'برنامج العلاج المعرفي السلوكي للأرق (CBT-I).' },
      { min: 22, max: 28, labelAr: 'أرق سريري شديد (Severe Insomnia)', badgeColor: 'rose', interpretation: 'حرمان حاد من النوم واستنزاف جسدي ونفسي كامل.', clinicalAction: 'تقييم طبي نفسي شامل مع CBT-I واستشارة دوائية.' }
    ]
  },
  {
    id: 'ess-sleepiness',
    code: 'ESS',
    nameAr: 'مقياس إبوورث للنعاس أثناء النهار (Epworth Sleepiness Scale)',
    nameEn: 'Epworth Sleepiness Scale',
    category: 'النوم والأرق',
    estimatedMinutes: 3,
    targetPopulation: 'البالغون',
    descriptionAr: 'يقيس احتمالية الغفوة أو النوم في 8 مواقف يومية روتينية لفرز انقطاع النفس النومي واضطرابات النعاس النهاري.',
    referenceCitation: 'Johns MW. A new method for measuring daytime sleepiness: the Epworth sleepiness scale. 1991.',
    defaultOptions: [
      { value: 0, labelAr: 'لا أغفو إطلاقاً (0)' },
      { value: 1, labelAr: 'فرصة ضئيلة للغفوة (1)' },
      { value: 2, labelAr: 'فرصة متوسطة للغفوة (2)' },
      { value: 3, labelAr: 'فرصة عالية جداً للغفوة (3)' }
    ],
    questions: [
      { id: 1, textAr: 'الجلوس والقراءة.' },
      { id: 2, textAr: 'مشاهدة التلفاز.' },
      { id: 3, textAr: 'الجلوس ساكناً في مكان عام (مثل مسرح أو اجتماع).' },
      { id: 4, textAr: 'ركوب السيارة كراكب لمدة ساعة متواصلة بدون توقف.' },
      { id: 5, textAr: 'الاستلقاء للراحة في فترة بعد الظهر عندما تسمح الظروف.' },
      { id: 6, textAr: 'الجلوس والتحدث مع شخص آخر.' },
      { id: 7, textAr: 'الجلوس بهدوء بعد تناول طعام الغداء (بدون كحول).' },
      { id: 8, textAr: 'أثناء قيادة السيارة والتوقف لدقائق عند إشارة المرور أو الازدحام.' }
    ],
    scoringCriteria: [
      { min: 0, max: 10, labelAr: 'نعاس نهاري طبيعي', badgeColor: 'emerald', interpretation: 'اليقظة النهارية طبيعية ومستقرة.', clinicalAction: 'الحفاظ على ساعات النوم الكافية.' },
      { min: 11, max: 14, labelAr: 'نعاس نهاري خفيف إلى متوسط', badgeColor: 'amber', interpretation: 'ميل ملحوظ للنعاس يستدعي تحسين جودة النوم.', clinicalAction: 'تقييم جدول النوم وتجنب المنبهات.' },
      { min: 15, max: 24, labelAr: 'نعاس نهاري مفرط وشديد (Excessive Sleepiness)', badgeColor: 'rose', interpretation: 'نعاس نهاري حاد يشير لاحتمال انقطاع النفس النومي أو اضطراب نوم عضوي.', clinicalAction: 'تحويل لعيادة طب النوم وفحص تخطيط النوم (Polysomnography).' }
    ]
  },

  // 5. الصدمة والضغوط النفسية (PTSD & Stress)
  {
    id: 'pcl-5-ptsd',
    code: 'PCL-5',
    nameAr: 'قائمة أعراض اضطراب كرب ما بعد الصدمة (PCL-5)',
    nameEn: 'PTSD Checklist for DSM-5',
    category: 'الصدمة والضغوط',
    estimatedMinutes: 6,
    targetPopulation: 'الأشخاص الذين تعرضوا لحادث صادم أو عنف أو تهديد شديد',
    descriptionAr: 'يقيس الأبعاد الأربعة للصدمة: الذكريات الاقتحامية، التجنب، التغيرات السلبية في المزاج والأفكار، والاستثارة الفسيولوجية المفرطة.',
    referenceCitation: 'Weathers FW, et al. The PTSD Checklist for DSM-5 (PCL-5). 2013.',
    defaultOptions: [
      { value: 0, labelAr: 'إطلاقاً (0)' },
      { value: 1, labelAr: 'قليلاً (1)' },
      { value: 2, labelAr: 'بدرجة متوسطة (2)' },
      { value: 3, labelAr: 'بدرجة كبيرة (3)' },
      { value: 4, labelAr: 'بشدة بالغة (4)' }
    ],
    questions: [
      { id: 1, textAr: 'ذكريات مؤلمة ومتكررة وغير مرغوب فيها عن التجربة الصادمة؟' },
      { id: 2, textAr: 'أحلام مزعجة وكوابيس متكررة مرتبطة بالحدث الصادم؟' },
      { id: 3, textAr: 'الشعور أو التصرف فجأة وكأن التجربة الصادمة تحدث من جديد (فلاش باك)؟' },
      { id: 4, textAr: 'الشعور بانزعاج وضيق شديد عندما يذكرك شيء ما بالحدث الصادم؟' },
      { id: 5, textAr: 'تفاعلات جسدية قوية (خفقان، تعرق) عند التعرض لما يذكرك بالحدث؟' },
      { id: 6, textAr: 'تجنب الذكريات أو الأفكار أو المشاعر المرتبطة بالتجربة الصادمة؟' },
      { id: 7, textAr: 'تجنب المؤثرات الخارجية (أشخاص، أماكن، محادثات، أنشطة) المرتبطة بالصدمة؟' },
      { id: 8, textAr: 'عدم القدرة على تذكر أجزاء هامة من التجربة الصادمة؟' },
      { id: 9, textAr: 'معتقدات سلبية قوية ومستمرة عن نفسك أو الآخرين أو العالم؟' },
      { id: 10, textAr: 'إلقاء اللوم على نفسك أو الآخرين فيما حدث بشكل مبالغ فيه؟' },
      { id: 11, textAr: 'مشاعر سلبية مستمرة ومكثفة (خوف، رعب، غضب، ذنب، خجل)؟' },
      { id: 12, textAr: 'فقدان ملحوظ للاهتمام بالأنشطة التي اعتدت الاستمتاع بها؟' },
      { id: 13, textAr: 'الشعور بالانفصال أو الغربة عن الآخرين؟' },
      { id: 14, textAr: 'صعوبة مستمرة في الشعور بالمشاعر الإيجابية (الحب، السعادة)؟' },
      { id: 15, textAr: 'سلوك عصبي وسرعة انفعال أو نوبات غضب عدوانية؟' },
      { id: 16, textAr: 'المخاطرة المفرطة أو القيام بأفعال تؤذي نفسك؟' },
      { id: 17, textAr: 'حالة ترقب مفرطة وحذر مبالغ فيه ومراقبة مستمرة للمحيط؟' },
      { id: 18, textAr: 'سهولة الفزع والانتفاض لأي صوت أو حركة مفاجئة؟' },
      { id: 19, textAr: 'صعوبات ملحوظة في التركيز والانتباه؟' },
      { id: 20, textAr: 'صعوبة في الدخول في النوم أو البقاء نائماً؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 20, labelAr: 'أعراض صدمة طفيفة / غير دالة سريرياً', badgeColor: 'emerald', interpretation: 'لا توجد مؤشرات تدل على اضطراب ما بعد الصدمة.', clinicalAction: 'الدعم النفسي العام.' },
      { min: 21, max: 32, labelAr: 'أعراض ما بعد صدمة تحت السريرية', badgeColor: 'amber', interpretation: 'أعراض ما بعد صدمة تحتاج للمتابعة والدعم الإرشادي.', clinicalAction: 'جلسات إرشاد وتفريغ انفعالي وتقنيات تثبيت.' },
      { min: 33, max: 80, labelAr: 'مؤشر إيجابي محتمل لاضطراب كرب ما بعد الصدمة (PTSD)', badgeColor: 'rose', interpretation: 'الدرجة تتجاوز العتبة التشخيصية السريرية (33+) وتدل على معاناة صدمية حادة.', clinicalAction: 'بدء بروتوكول علاج الصدمات (EMDR أو CBT مخصص للصدمات) مع استشارة طبية.' }
    ]
  },
  {
    id: 'pss-10-stress',
    code: 'PSS-10',
    nameAr: 'مقياس إدراك الضغوط النفسية (Perceived Stress Scale - PSS-10)',
    nameEn: 'Perceived Stress Scale',
    category: 'الصدمة والضغوط',
    estimatedMinutes: 4,
    targetPopulation: 'البالغون 18+',
    descriptionAr: 'يقيس درجة تقييم الشخص لمواقف حياته اليومية خلال الشهر الماضي بأنها تفوق قدرته على السيطرة والتكيف.',
    referenceCitation: 'Cohen S, et al. A global measure of perceived stress. J Health Soc Behav. 1983.',
    defaultOptions: [
      { value: 0, labelAr: 'أبداً (0)' },
      { value: 1, labelAr: 'نادراً جداً (1)' },
      { value: 2, labelAr: 'أحياناً (2)' },
      { value: 3, labelAr: 'في كثير من الأحيان (3)' },
      { value: 4, labelAr: 'بصورة متكررة جداً (4)' }
    ],
    questions: [
      { id: 1, textAr: 'كم مرة شعرت بالانزعاج بسبب حدوث شيء غير متوقع؟' },
      { id: 2, textAr: 'كم مرة شعرت أنك غير قادر على التحكم بالأمور الهامة في حياتك؟' },
      { id: 3, textAr: 'كم مرة شعرت بالعصبية والتوتر والضغط النفسي؟' },
      { id: 4, textAr: 'كم مرة شعرت بالثقة في قدرتك على التعامل مع مشاكلك الشخصية؟ (معكوس)' },
      { id: 5, textAr: 'كم مرة شعرت أن الأمور تسير وفق ما تريد؟ (معكوس)' },
      { id: 6, textAr: 'كم مرة وجدت أنك لا تستطيع التكيف مع جميع الأمور التي عليك إنجازها؟' },
      { id: 7, textAr: 'كم مرة كنت قادراً على السيطرة على مسببات الانزعاج في حياتك؟ (معكوس)' },
      { id: 8, textAr: 'كم مرة شعرت أنك مسيطر تماماً على زمام الأمور؟ (معكوس)' },
      { id: 9, textAr: 'كم مرة غضبت بسبب أمور كانت خارجة عن نطاق إرادتك وسيطرتك؟' },
      { id: 10, textAr: 'كم مرة شعرت أن الصعوبات تتراكم لدرجة أنك عاجز عن التغلب عليها؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 13, labelAr: 'مستوى ضغوط منخفض', badgeColor: 'emerald', interpretation: 'قدرة جيدة على التكيف والمرونة وإدارة متطلبات الحياة.', clinicalAction: 'الحفاظ على التوازن النفسي والجسدي.' },
      { min: 14, max: 26, labelAr: 'مستوى ضغوط متوسط', badgeColor: 'amber', interpretation: 'ضغوط ملحوظة قد تؤثر على الطاقة والصحة إذا استمرت.', clinicalAction: 'تعلم استراتيجيات حل المشكلات وتفريغ الضغوط.' },
      { min: 27, max: 40, labelAr: 'مستوى ضغوط مرتفع جداً (High Stress)', badgeColor: 'rose', interpretation: 'استنزاف عصبي وإنهاك نفسي (Burnout) يتطلب تدخلاً داعماً عاجلاً.', clinicalAction: 'جلسات إدارة الضغوط واستشارة نفسية.' }
    ]
  },

  // 6. تشتت الانتباه وفرط الحركة والنمائي (ADHD & Neurodevelopmental)
  {
    id: 'asrs-adhd',
    code: 'ASRS v1.1',
    nameAr: 'مقياس التقييم الذاتي لاضطراب فرط الحركة وتشتت الانتباه للبالغين (ASRS v1.1)',
    nameEn: 'Adult ADHD Self-Report Scale v1.1',
    category: 'ADHD والنمائي',
    estimatedMinutes: 3,
    targetPopulation: 'البالغون من عمر 18 سنة فأكثر',
    descriptionAr: 'المقياس المعتمد من منظمة الصحة العالمية لفرز أعراض ضعف التركيز، الاندفاعية، وصعوبات التنظيم والتسويف.',
    referenceCitation: 'Kessler RC, et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS). 2005.',
    defaultOptions: [
      { value: 0, labelAr: 'أبداً (0)' },
      { value: 1, labelAr: 'نادراً (1)' },
      { value: 2, labelAr: 'أحياناً (2)' },
      { value: 3, labelAr: 'غالباً (3)' },
      { value: 4, labelAr: 'دائماً تقريباً (4)' }
    ],
    questions: [
      { id: 1, textAr: 'كم مرة تجد صعوبة في إنهاء التفاصيل الأخيرة لمشروع بعد إنجاز الأجزاء الصعبة؟' },
      { id: 2, textAr: 'كم مرة تجد صعوبة في ترتيب الأمور وتنظيم المهام التي تتطلب خطوات متسلسلة؟' },
      { id: 3, textAr: 'كم مرة تواجه مشكلة في تذكر المواعيد أو الالتزامات اليومية؟' },
      { id: 4, textAr: 'عندما تضطر لمهمة تتطلب تركيزاً وتفكيراً عميقاً، كم مرة تتجنبها أو تؤجل البدء فيها؟' },
      { id: 5, textAr: 'كم مرة تتململ أو تحرك يديك وقدميك أثناء الجلوس لفترات طويلة؟' },
      { id: 6, textAr: 'كم مرة تشعر بنشاط مفرط وكأنك مدفوع بمحرك لا يهدأ؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 9, labelAr: 'مؤشر سلبي / غير دال على ADHD', badgeColor: 'emerald', interpretation: 'التركيز والتنظيم يقعان ضمن النطاق المعتاد.', clinicalAction: 'نصائح لزيادة الإنتاجية وإدارة الوقت.' },
      { min: 10, max: 13, labelAr: 'أعراض تشتت انتباه طفيفة', badgeColor: 'teal', interpretation: 'صعوبات تنظيمية خفيفة ترتبط أحياناً بقلة النوم أو كثرة المشتتات.', clinicalAction: 'تنظيم بيئة العمل وتقنيات البومودورو.' },
      { min: 14, max: 24, labelAr: 'مؤشر إيجابي قوي لاحتمال Adult ADHD', badgeColor: 'rose', interpretation: 'النتيجة تظهر نمطاً دالاً على سمات تشتت الانتباه وفرط الحركة للبالغين.', clinicalAction: 'يوصى بتقييم إكلينيكي شامل وتطبيق اختبارات الوظائف التنفيذية.' }
    ]
  },
  {
    id: 'vanderbilt-adhd-child',
    code: 'VADPRS',
    nameAr: 'مقياس فاندربيلت لتقييم فرط الحركة وتشتت الانتباه للأطفال (تقرير الوالدين)',
    nameEn: 'Vanderbilt ADHD Diagnostic Parent Rating Scale',
    category: 'ADHD والنمائي',
    estimatedMinutes: 8,
    targetPopulation: 'الأطفال والمراهقون من عمر 6 إلى 12 سنة (يقيمه ولي الأمر)',
    descriptionAr: 'يقيم أعراض تشتت الانتباه، فرط النشاط والاندفاعية، والأداء الأكاديمي والاجتماعي للطفل.',
    referenceCitation: 'Wolraich ML, et al. Vanderbilt ADHD Diagnostic Rating Scale. 2003.',
    defaultOptions: [
      { value: 0, labelAr: 'أبداً (0)' },
      { value: 1, labelAr: 'أحياناً (1)' },
      { value: 2, labelAr: 'غالباً (2)' },
      { value: 3, labelAr: 'بصورة متكررة جداً (3)' }
    ],
    questions: [
      { id: 1, textAr: 'يفشل في الانتباه للتفاصيل الدقيقة أو يرتكب أخطاء ناشئة عن الإهمال في الواجبات المدرسية.' },
      { id: 2, textAr: 'يواجه صعوبة في الاستمرار في الانتباه للمهام أو الألعاب.' },
      { id: 3, textAr: 'يبدو كأنه لا يستمع عند التحدث إليه مباشرة.' },
      { id: 4, textAr: 'لا يتبع التعليمات حتى النهاية ويفشل في إتمام المهام أو الواجبات المدرسية.' },
      { id: 5, textAr: 'يجد صعوبة في تنظيم المهام والأنشطة.' },
      { id: 6, textAr: 'يتجنب أو يكره المهام التي تتطلب جهداً ذهنياً مستمراً (كالواجبات المدرسية).' },
      { id: 7, textAr: 'يضيع أدواته وأغراضه الضرورية للواجبات والأنشطة (أقلام، كتب، ألعاب).' },
      { id: 8, textAr: 'يتشتت بسهولة بالمؤثرات الخارجية المحيطة.' },
      { id: 9, textAr: 'كثير النسيان في الأنشطة اليومية.' },
      { id: 10, textAr: 'يتململ بيديه أو قدميه أو يتلوى في مقعده.' },
      { id: 11, textAr: 'يترك مقعده في الفصل أو في مواقف يُتوقع منه البقاء فيها جالساً.' },
      { id: 12, textAr: 'يركض أو يتسلق في مواقف غير مناسبة.' },
      { id: 13, textAr: 'يجد صعوبة في اللعب أو الاستمتاع بالأنشطة الترفيهية بهدوء.' },
      { id: 14, textAr: 'يتحدث بشكل مفرط ودون توقف.' }
    ],
    scoringCriteria: [
      { min: 0, max: 14, labelAr: 'سلوك طبيعي للطفل', badgeColor: 'emerald', interpretation: 'النشاط والانتباه يقعان ضمن المعدل الطبيعي لعمر الطفل.', clinicalAction: 'تعزيز الأنشطة الإبداعية والحركية.' },
      { min: 15, max: 25, labelAr: 'مؤشرات نشاط وتشتت متوسطة', badgeColor: 'amber', interpretation: 'تحديات سلوكية تتطلب تعديل بيئة التعلم وجداول التحفيز السلوكي.', clinicalAction: 'استشارة أخصائي تعديل سلوك للأطفال.' },
      { min: 26, max: 42, labelAr: 'مؤشر إيجابي لـ ADHD لدى الطفل', badgeColor: 'rose', interpretation: 'أعراض فرط حركة وتشتت واضحة تؤثر على التحصيل الدراسي والتفاعل الاجتماعي.', clinicalAction: 'تقييم شامل مع طبيب نفسي للأطفال والمراهقين واختبارات نمائية.' }
    ]
  },
  {
    id: 'scared-child-anxiety',
    code: 'SCARED',
    nameAr: 'مقياس القلق المرتبط بالطفولة واضطراباته (SCARED)',
    nameEn: 'Screen for Child Anxiety Related Disorders',
    category: 'ADHD والنمائي',
    estimatedMinutes: 7,
    targetPopulation: 'الأطفال واليافعون من 8 إلى 18 عاماً',
    descriptionAr: 'يقيم اضطراب قلق الانفصال، القلق المعمم، قلق الهلع، الرهاب الاجتماعي، ورفض المدرسة لدى الأطفال.',
    referenceCitation: 'Birmaher B, et al. Screen for Child Anxiety Related Emotional Disorders (SCARED). 1997.',
    defaultOptions: [
      { value: 0, labelAr: 'غير صحيح أو نادراً (0)' },
      { value: 1, labelAr: 'صحيح أحياناً (1)' },
      { value: 2, labelAr: 'صحيح جداً أو غالباً (2)' }
    ],
    questions: [
      { id: 1, textAr: 'عندما أشعر بالخوف، أجد صعوبة في التنفس.' },
      { id: 2, textAr: 'أصاب بصداع عندما أكون في المدرسة أو قبل الذهاب إليها.' },
      { id: 3, textAr: 'لا أحب أن أكون بعيداً عن أفراد عائلتي.' },
      { id: 4, textAr: 'أشعر بالقلق حيال كوني وحيداً في المنزل.' },
      { id: 5, textAr: 'أقلق كثيراً من أن يصاب والداي بمكروه أو مرض.' },
      { id: 6, textAr: 'أشعر بالخوف عندما أضطر للنوم بمفردي.' },
      { id: 7, textAr: 'أشعر بالخجل الشديد عندما أكون مع أناس لا أعرفهم جيداً.' },
      { id: 8, textAr: 'أقلق بشأن المستقبل والأمور القادمة.' },
      { id: 9, textAr: 'أشعر بالخوف من الذهاب إلى المدرسة.' },
      { id: 10, textAr: 'أقلق بشأن ما يفكر به الآخرون عني.' }
    ],
    scoringCriteria: [
      { min: 0, max: 7, labelAr: 'قلق طبيعي ضمن المرحلة العمرية', badgeColor: 'emerald', interpretation: 'مستوى الأمان النفسي متوازن.', clinicalAction: 'الدعم الأسري والتعزيز الإيجابي.' },
      { min: 8, max: 14, labelAr: 'مستوى قلق طفولي مرتفع', badgeColor: 'amber', interpretation: 'مخاوف واضحة تؤثر على استقلالية الطفل ونومه.', clinicalAction: 'جلسات إرشاد أسري وعلاج سلوكي للطفل.' },
      { min: 15, max: 20, labelAr: 'مؤشر اضطراب قلق لدى الطفل', badgeColor: 'rose', interpretation: 'مؤشر قوي على وجود اضطراب قلق انفصال أو رهاب مدرسي.', clinicalAction: 'استشارة أخصائي نفسي للأطفال مع خطة تكيف مدرسي.' }
    ]
  },

  // 7. اضطرابات الأكل والتغذية (Eating Disorders & Body Image)
  {
    id: 'eat-26',
    code: 'EAT-26',
    nameAr: 'مقياس اتجاهات وسلوكيات الأكل (Eating Attitudes Test - EAT-26)',
    nameEn: 'Eating Attitudes Test-26',
    category: 'الشخصية والمزاج',
    estimatedMinutes: 6,
    targetPopulation: 'المراهقون والبالغون المشتبه باضطرابات الأكل',
    descriptionAr: 'المقياس المرجعي لفرز اضطرابات الأكل (فقدان الشهية العصبي Anorexia، الشره العصبي Bulimia، ونوبات الشره Binge Eating).',
    referenceCitation: 'Garner DM, et al. The Eating Attitudes Test: psychometric features and clinical correlates. 1982.',
    defaultOptions: [
      { value: 3, labelAr: 'دائماً (3)' },
      { value: 2, labelAr: 'عادةً (2)' },
      { value: 1, labelAr: 'غالباً (1)' },
      { value: 0, labelAr: 'أحياناً / نادراً / أبداً (0)' }
    ],
    questions: [
      { id: 1, textAr: 'أخاف بشدة من زيادة وزني أو أن أصبح سميناً.' },
      { id: 2, textAr: 'أتجنب تناول الطعام عندما أكون جائعاً.' },
      { id: 3, textAr: 'أجد نفسي منشغلاً بالتفكير في الطعام باستمرار.' },
      { id: 4, textAr: 'تنتابني نوبات تناول طعام بشراهة أشعر فيها أنني لا أستطيع التوقف.' },
      { id: 5, textAr: 'أقطع طعامي إلى قطع صغيرة جداً قبل تناوله.' },
      { id: 6, textAr: 'أعرف مقدار السعرات الحرارية بدقة في الأطعمة التي أتناولها.' },
      { id: 7, textAr: 'أتجنب بشكل صارم الأطعمة التي تحتوي على الكربوهيدرات أو الدهون.' },
      { id: 8, textAr: 'أشعر أن الآخرين يفضلون لو كنت أتناول طعاماً أكثر.' },
      { id: 9, textAr: 'أتقيأ عمداً بعد تناول وجبة الطعام للتخلص منها.' },
      { id: 10, textAr: 'أشعر بالذنب والندم الشديد بعد تناول الطعام.' },
      { id: 11, textAr: 'يشغلني هاجس الرغبة في أن أكون أنحف.' },
      { id: 12, textAr: 'أمارس الرياضة الشاقة بهدف حرق السعرات الحرارية فقط.' }
    ],
    scoringCriteria: [
      { min: 0, max: 9, labelAr: 'سلوك غذائي طبيعي', badgeColor: 'emerald', interpretation: 'علاقة متوازنة مع الطعام وصورة الجسد.', clinicalAction: 'التغذية المتوازنة والصحية.' },
      { min: 10, max: 19, labelAr: 'انشغال غير صحي بالحميات والوزن', badgeColor: 'amber', interpretation: 'بدايات سلوكيات تقييد غذائي قد تتطور لاضطراب.', clinicalAction: 'استشارة أخصائية تغذية علاجية نفسية.' },
      { min: 20, max: 36, labelAr: 'مؤشر خطر سريري لاضطراب أكل (Eating Disorder Risk)', badgeColor: 'rose', interpretation: 'النتيجة تقع في النطاق الخطر سريرياً (تتطلب تدخلاً عاجلاً).', clinicalAction: '⚠️ إلزامي: استشارة فورية مع فريق متكامل (طبيب نفسي + أخصائية تغذية علاجية).' }
    ]
  },
  {
    id: 'scoff-screening',
    code: 'SCOFF',
    nameAr: 'استبيان سكوف السريع لفرز اضطرابات الأكل (SCOFF)',
    nameEn: 'SCOFF Questionnaire for Eating Disorders',
    category: 'الشخصية والمزاج',
    estimatedMinutes: 2,
    targetPopulation: 'البالغون والشباب',
    descriptionAr: 'استبيان وجيز من 5 أسئلة معتمد دولياً كخط أول لفرز اضطراب الشره والقهم العصبي.',
    referenceCitation: 'Morgan JF, Reid F, Lacey JH. The SCOFF questionnaire: assessment of a new screening tool. 1999.',
    defaultOptions: [
      { value: 1, labelAr: 'نعم (1)' },
      { value: 0, labelAr: 'لا (0)' }
    ],
    questions: [
      { id: 1, textAr: 'هل تجعل نفسك تتقيأ عمداً لأنك تشعر بالامتلاء غير المريح بعد الأكل؟ (Sick)' },
      { id: 2, textAr: 'هل تقلق من فقدان السيطرة على مقدار ما تتناوله من طعام؟ (Control)' },
      { id: 3, textAr: 'هل فقدت مؤخراً أكثر من 6 كجم في فترة زمنية مدتها 3 أشهر؟ (One stone)' },
      { id: 4, textAr: 'هل تعتقد أنك سمين بينما يخبرك الآخرون أنك شديد النحافة؟ (Fat)' },
      { id: 5, textAr: 'هل تقول إن الطعام يسيطر ويهيمن على مجريات حياتك؟ (Food)' }
    ],
    scoringCriteria: [
      { min: 0, max: 1, labelAr: 'مؤشر طبيعي / منخفض الخطر', badgeColor: 'emerald', interpretation: 'لا توجد علامات واضحة لاضطراب الأكل.', clinicalAction: 'تعزيز نمط الحياة الصحي.' },
      { min: 2, max: 5, labelAr: 'مؤشر إيجابي لاضطراب الأكل (إجابتان نعم أو أكثر)', badgeColor: 'rose', interpretation: 'تسجيل نقطتين فأكثر يشير باحتمالية عالية لوجود قهم أو شره عصبي.', clinicalAction: '⚠️ تحويل إلزامي لأخصائي التغذية العلاجية والطب النفسي لإجراء تقييم دقيق.' }
    ]
  },

  // 8. الإدمان والتعاطي والسلوكيات القهرية (Addiction & Substance Screening)
  {
    id: 'audit-alcohol',
    code: 'AUDIT',
    nameAr: 'اختبار تحديد اضطرابات تعاطي الكحول (AUDIT)',
    nameEn: 'Alcohol Use Disorders Identification Test',
    category: 'الشخصية والمزاج',
    estimatedMinutes: 4,
    targetPopulation: 'البالغون',
    descriptionAr: 'المقياس المعتمد من منظمة الصحة العالمية لفرز أنماط التعاطي الخطر والاعتماد على الكحول.',
    referenceCitation: 'Saunders JB, et al. Development of the Alcohol Use Disorders Identification Test (AUDIT). 1993.',
    defaultOptions: [
      { value: 0, labelAr: 'أبداً (0)' },
      { value: 1, labelAr: 'شهرياً أو أقل (1)' },
      { value: 2, labelAr: '2 إلى 4 مرات شهرياً (2)' },
      { value: 3, labelAr: '2 إلى 3 مرات أسبوعياً (3)' },
      { value: 4, labelAr: '4 مرات أو أكثر أسبوعياً (4)' }
    ],
    questions: [
      { id: 1, textAr: 'كم مرة تتناول مشروبات كحولية؟' },
      { id: 2, textAr: 'كم عدد المشروبات التي تتناولها في اليوم النموذجي للشرب؟' },
      { id: 3, textAr: 'كم مرة تتناول 6 مشروبات أو أكثر في مناسبة واحدة؟' },
      { id: 4, textAr: 'كم مرة وجدت أنك غير قادر على التوقف عن الشرب بمجرد أن بدأت؟' },
      { id: 5, textAr: 'كم مرة فشلت في القيام بما كان متوقعاً منك بسبب الشرب؟' },
      { id: 6, textAr: 'كم مرة احتجت للشرب في الصباح لتبدأ يومك بعد ليلة شرب سابقة؟' },
      { id: 7, textAr: 'كم مرة شعرت بالذنب أو تأنيب الضمير بعد الشرب؟' },
      { id: 8, textAr: 'كم مرة عجزت عن تذكر ما حدث في الليلة السابقة بسبب الشرب؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 7, labelAr: 'مستوى منخفض الخطر / منعدم', badgeColor: 'emerald', interpretation: 'نمط تعاطي غير ضار أو امتناع تام.', clinicalAction: 'تثقيف صحي وقائي.' },
      { min: 8, max: 15, labelAr: 'استخدام ضار أو خطر (Hazardous Use)', badgeColor: 'amber', interpretation: 'نمط شرب ينطوي على مخاطر صحية واجتماعية متزايدة.', clinicalAction: 'إرشاد علاجي وجيز وتقليل الضرر.' },
      { min: 16, max: 32, labelAr: 'احتمال اعتماد وإدمان كحولي (Dependence)', badgeColor: 'rose', interpretation: 'مستوى عالي الخطورة يتطلب برنامج علاج إدمان طبي.', clinicalAction: '⚠️ استشارة استشاري علاج الإدمان ووضع خطة سحب سموم آمنة.' }
    ]
  },
  {
    id: 'dast-10',
    code: 'DAST-10',
    nameAr: 'مقياس فرز تعاطي المواد والعقاقير الإدمانية (DAST-10)',
    nameEn: 'Drug Abuse Screening Test-10',
    category: 'الشخصية والمزاج',
    estimatedMinutes: 3,
    targetPopulation: 'البالغون واليافعون',
    descriptionAr: 'يقيم عواقب استخدام الأدوية المهدئة غير الموصوفة، المسكنات الأفيونية، والمواد المحظورة.',
    referenceCitation: 'Skinner HA. The Drug Abuse Screening Test. Addictive Behaviors. 1982.',
    defaultOptions: [
      { value: 1, labelAr: 'نعم (1)' },
      { value: 0, labelAr: 'لا (0)' }
    ],
    questions: [
      { id: 1, textAr: 'هل استخدمت أدوية أو عقاقير لغير الأغراض الطبية الموصوفة؟' },
      { id: 2, textAr: 'هل تسيء استخدام أكثر من نوع واحد من العقاقير أو المواد في نفس الوقت؟' },
      { id: 3, textAr: 'هل تشعر دائماً بالقدرة على التوقف عن استخدام العقاقير متى أردت؟ (معكوس)' },
      { id: 4, textAr: 'هل عانيت من نوبات فقدان ذاكرة أو تغييب ذهني نتيجة استخدام العقاقير؟' },
      { id: 5, textAr: 'هل شعرت بالذنب أو الندم حيال استخدامك للعقاقير؟' },
      { id: 6, textAr: 'هل اشتكى أفراد أسرتك أو شريك حياتك من استخدامك للعقاقير؟' },
      { id: 7, textAr: 'هل أهملت أسرتك أو مسؤولياتك بسبب تعاطي العقاقير؟' },
      { id: 8, textAr: 'هل انخرطت في أفعال غير قانونية للحصول على العقاقير؟' },
      { id: 9, textAr: 'هل شعرت بأعراض انسحابية جسدية (رعشة، ألم، غثيان) عند التوقف عن العقار؟' },
      { id: 10, textAr: 'هل تعرضت لمشاكل صحية (فقدان ذاكرة، نوبات هوس، التهابات) بسبب العقاقير؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 0, labelAr: 'لا توجد مشاكل تعاطي مسجلة', badgeColor: 'emerald', interpretation: 'عدم وجود مؤشرات إدمانية.', clinicalAction: 'لا يتطلب تدخلاً.' },
      { min: 1, max: 2, labelAr: 'مستوى منخفض الخطر', badgeColor: 'teal', interpretation: 'استخدام تجريبي أو محدود.', clinicalAction: 'توعية وقائية ودعم سلوكي.' },
      { min: 3, max: 5, labelAr: 'مستوى متوسط / استخدام ضار', badgeColor: 'amber', interpretation: 'مؤشر على وجود نمط تعاطي مؤثر.', clinicalAction: 'جلسات علاج إدمان ومقابلات دافعية (Motivational Interviewing).' },
      { min: 6, max: 10, labelAr: 'مستوى شديد / اعتماد إدماني حاد', badgeColor: 'rose', interpretation: 'حالة إدمان تستوجب خطة علاج طبي نفسي وتأهيلي متكاملة.', clinicalAction: '⚠️ استشارة عاجلة لبرنامج علاج الإدمان والتأهيل الشامل.' }
    ]
  },
  {
    id: 'fagerstrom-nicotine',
    code: 'FTND',
    nameAr: 'اختبار فاجرستروم لقياس درجة الاعتماد على النيكوتين والتدخين (FTND)',
    nameEn: 'Fagerström Test for Nicotine Dependence',
    category: 'الشخصية والمزاج',
    estimatedMinutes: 2,
    targetPopulation: 'المدخنون والمدخنون الإلكترونيون',
    descriptionAr: 'يقيس درجة الاعتماد الفسيولوجي والسلوكي على النيكوتين لتحديد الحاجة للعلاج الدوائي التعويضي للإقلاع.',
    referenceCitation: 'Heatherton TF, et al. The Fagerström Test for Nicotine Dependence. 1991.',
    defaultOptions: [
      { value: 0, labelAr: 'بعد 60 دقيقة / نادراً (0)' },
      { value: 1, labelAr: 'بعد 31-60 دقيقة (1)' },
      { value: 2, labelAr: 'بعد 6-30 دقيقة (2)' },
      { value: 3, labelAr: 'خلال 5 دقائق من الاستيقاظ (3)' }
    ],
    questions: [
      { id: 1, textAr: 'كم من الوقت يمر بعد استيقاظك في الصباح حتى تدخن سيجارتك الأولى؟' },
      { id: 2, textAr: 'هل تجد صعوبة في الامتناع عن التدخين في الأماكن المحظورة (مثل الطائرة، المستشفى، المساجد)؟' },
      { id: 3, textAr: 'أي سيجارة خلال اليوم يصعب عليك التخلي عنها أكثر من غيرها؟' },
      { id: 4, textAr: 'كم سيجارة تدخن في اليوم الواحد؟' },
      { id: 5, textAr: 'هل تدخن بتكرار أكبر في الساعات الأولى بعد الاستيقاظ مقارنة بباقي اليوم؟' },
      { id: 6, textAr: 'هل تدخن حتى عندما تكون مريضاً وطريح الفراش معظم اليوم؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 2, labelAr: 'اعتماد نيكوتيني منخفض جداً', badgeColor: 'emerald', interpretation: 'اعتماد سلوكي خفيف، يسهل الإقلاع مع الإرشاد البسيط.', clinicalAction: 'خطة إقلاع ذاتية.' },
      { min: 3, max: 4, labelAr: 'اعتماد نيكوتيني منخفض', badgeColor: 'teal', interpretation: 'اعتماد متوسط.', clinicalAction: 'جلسات تعديل سلوك وبدائل النيكوتين.' },
      { min: 5, max: 7, labelAr: 'اعتماد نيكوتيني متوسط إلى مرتفع', badgeColor: 'amber', interpretation: 'أعراض انسحابية ملحوظة عند التوقف.', clinicalAction: 'علاج دوائي مساعد (Varenicline / Bupropion) مع بدائل النيكوتين.' },
      { min: 8, max: 10, labelAr: 'اعتماد نيكوتيني شديد جداً', badgeColor: 'rose', interpretation: 'إدمان فسيولوجي حاد على النيكوتين.', clinicalAction: 'برنامج طبي متكامل للإقلاع عن التدخين.' }
    ]
  },

  // 9. الذات والشخصية والرفاه (Personality, Self-Esteem & Life Satisfaction)
  {
    id: 'rosenberg-self-esteem',
    code: 'RSES',
    nameAr: 'مقياس روزنبرغ لتقدير الذات (Rosenberg Self-Esteem Scale)',
    nameEn: 'Rosenberg Self-Esteem Scale',
    category: 'الشخصية والمزاج',
    estimatedMinutes: 3,
    targetPopulation: 'البالغون والمراهقون',
    descriptionAr: 'المقياس السيكومتري الأكثر استخداماً عالمياً لقياس المشاعر الإيجابية والسلبية العامة تجاه الذات.',
    referenceCitation: 'Rosenberg M. Society and the adolescent self-image. Princeton University Press. 1965.',
    defaultOptions: [
      { value: 3, labelAr: 'أوافق بشدة (3)' },
      { value: 2, labelAr: 'أوافق (2)' },
      { value: 1, labelAr: 'لا أوافق (1)' },
      { value: 0, labelAr: 'أعارض بشدة (0)' }
    ],
    questions: [
      { id: 1, textAr: 'أشعر أنني إنسان ذو قيمة ومساوٍ للآخرين على الأقل.' },
      { id: 2, textAr: 'أشعر أن لدي عدداً من الصفات والقدرات الجيدة.' },
      { id: 3, textAr: 'بشكل عام، أميل إلى الشعور بأنني شخص فاشل. (معكوس)' },
      { id: 4, textAr: 'أنا قادر على القيام بالأشياء بكفاءة تماثل كفاءة معظم الناس.' },
      { id: 5, textAr: 'أشعر أنه ليس لدي الكثير لأفخر به في نفسي. (معكوس)' },
      { id: 6, textAr: 'أتخذ موقفاً إيجابياً ومتفائلاً تجاه نفسي.' },
      { id: 7, textAr: 'بصورة عامة، أنا راضٍ عن نفسي.' },
      { id: 8, textAr: 'أتمنى لو كان بإمكاني احترام نفسي بدرجة أكبر. (معكوس)' },
      { id: 9, textAr: 'أشعر أحياناً بأنني عديم الفائدة تماماً. (معكوس)' },
      { id: 10, textAr: 'أشعر في بعض الأوقات أنني لست صالحاً لأي شيء على الإطلاق. (معكوس)' }
    ],
    scoringCriteria: [
      { min: 25, max: 30, labelAr: 'تقدير ذات مرتفع وصحي', badgeColor: 'emerald', interpretation: 'ثقة متوازنة بالنفس ونظرة ذاتية إيجابية ومرنة.', clinicalAction: 'الاستمرار في تنمية المهارات الشخصية.' },
      { min: 15, max: 24, labelAr: 'تقدير ذات متوسط وطبيعي', badgeColor: 'teal', interpretation: 'تقدير الذات يقع في الحدود الطبيعية لمعظم الناس.', clinicalAction: 'تعزيز مهارات توكيد الذات.' },
      { min: 0, max: 14, labelAr: 'تدني حاد في تقدير الذات (Low Self-Esteem)', badgeColor: 'rose', interpretation: 'نقد ذاتي قاسي ومشاعر عدم كفاءة ودونية تغذي القلق والاكتئاب.', clinicalAction: 'جلسات علاج نفسي معرفي لإعادة بناء المفهوم الذاتي وتقبل النفس.' }
    ]
  },
  {
    id: 'swls-satisfaction',
    code: 'SWLS',
    nameAr: 'مقياس الرضا عن الحياة (Satisfaction with Life Scale)',
    nameEn: 'Satisfaction with Life Scale',
    category: 'الشخصية والمزاج',
    estimatedMinutes: 2,
    targetPopulation: 'جميع الفئات من عمر 16 فما فوق',
    descriptionAr: 'يقيس التقييم الإدراكي الشامل للحياة الذاتية ورضا الفرد عن مسيرته وإنجازاته.',
    referenceCitation: 'Diener E, et al. The Satisfaction with Life Scale. J Pers Assess. 1985.',
    defaultOptions: [
      { value: 7, labelAr: 'أوافق بشدة (7)' },
      { value: 6, labelAr: 'أوافق (6)' },
      { value: 5, labelAr: 'أوافق قليلاً (5)' },
      { value: 4, labelAr: 'محايد (4)' },
      { value: 3, labelAr: 'لا أوافق قليلاً (3)' },
      { value: 2, labelAr: 'لا أوافق (2)' },
      { value: 1, labelAr: 'أعارض بشدة (1)' }
    ],
    questions: [
      { id: 1, textAr: 'في معظم الجوانب، حياتي قريبة من النموذج المثالي الذي أتمناه.' },
      { id: 2, textAr: 'ظروف حياتي الحالية ممتازة ورائعة.' },
      { id: 3, textAr: 'أنا راضٍ تماماً عن مجريات حياتي.' },
      { id: 4, textAr: 'حتى الآن، حصلت على الأشياء الهامة التي أردتها في حياتي.' },
      { id: 5, textAr: 'لو عشت حياتي من جديد، فلن أغير منها شيئاً تقريباً.' }
    ],
    scoringCriteria: [
      { min: 30, max: 35, labelAr: 'رضا فائق واستثنائي عن الحياة', badgeColor: 'emerald', interpretation: 'سعادة عالية وامتنان عميق لظروف الحياة.', clinicalAction: 'الحفاظ على نمط الحياة المتوازن.' },
      { min: 20, max: 29, labelAr: 'رضا عام ومتوسط عن الحياة', badgeColor: 'teal', interpretation: 'رضا طبيعي عن مجمل جوانب الحياة.', clinicalAction: 'تعزيز الأهداف الشخصية والمهنية.' },
      { min: 5, max: 14, labelAr: 'عدم رضا شديد عن مجريات الحياة', badgeColor: 'rose', interpretation: 'شعور بالتعثر والإحباط وخيبة الأمل في مسار الحياة.', clinicalAction: 'جلسات استكشاف القيم الشخصية والأهداف وإعادة توجيه المسار.' }
    ]
  },
  {
    id: 'mdq-bipolar',
    code: 'MDQ',
    nameAr: 'استبيان اضطرابات المزاج ثنائي القطب (Mood Disorder Questionnaire)',
    nameEn: 'Mood Disorder Questionnaire',
    category: 'الشخصية والمزاج',
    estimatedMinutes: 4,
    targetPopulation: 'البالغون الذين يعانون من تقلبات مزاجية',
    descriptionAr: 'أداة الفرز الرائدة عالمياً للكشف عن نوبات الهوس الخفيف (Hypomania) والهوس لاضطراب ثنائي القطب.',
    referenceCitation: 'Hirschfeld RM, et al. Development and validation of a screening instrument for bipolar spectrum disorder. 2000.',
    defaultOptions: [
      { value: 1, labelAr: 'نعم (1)' },
      { value: 0, labelAr: 'لا (0)' }
    ],
    questions: [
      { id: 1, textAr: 'هل مررت بفترة شعرت فيها بنشاط وطاقة عالية لدرجة غير طبيعية لاحظها الآخرون؟' },
      { id: 2, textAr: 'هل كنت سريع الغضب والانفعال لدرجة افتعال مشاجرات حادة؟' },
      { id: 3, textAr: 'هل شعرت بثقة خارقة في النفس أعلى بكثير من المعتاد؟' },
      { id: 4, textAr: 'هل قلّت حاجتك للنوم لدرجة الاكتفاء بساعات قليلة جداً دون الشعور بالتعب؟' },
      { id: 5, textAr: 'هل كنت تتحدث بسرعة وبكثرة تفوق المعتاد وبصعوبة في مقاطعتك؟' },
      { id: 6, textAr: 'هل كانت الأفكار تتسابق في رأسك بسرعة فائقة؟' },
      { id: 7, textAr: 'هل كنت تتشتت بسهولة وتنتقل بين مشاريع متعددة دون إنهائها؟' },
      { id: 8, textAr: 'هل قمت بأفعال متهورة (إنفاق أموال طائلة، قيادة جنونية، مخاطرات غير محسوبة)؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 3, labelAr: 'مؤشر سلبي / تقلبات مزاجية اعتيادية', badgeColor: 'emerald', interpretation: 'لا توجد علامات مميزة لنوبات هوسية.', clinicalAction: 'الدعم النفسي العام.' },
      { min: 4, max: 6, labelAr: 'سمات مزاجية تحت التدقيق', badgeColor: 'amber', interpretation: 'تذبذب مزاجي يستدعي توثيق اليوميات المزاجية.', clinicalAction: 'مراقبة منحنى المزاج ومراجعة أخصائي.' },
      { min: 7, max: 8, labelAr: 'مؤشر إيجابي محتمل لطيف ثنائي القطب (Bipolar Spectrum)', badgeColor: 'rose', interpretation: 'تسجيل 7 بنود فأكثر مع حدوثها في نفس الفترة يشير باحتمالية لاضطراب ثنائي القطب.', clinicalAction: '⚠️ استشارة استشاري الطب النفسي لتقييم دقيق قبل وصف أي مضادات اكتئاب منعاً لحدوث نوبة هوس.' }
    ]
  },

  // 10. الدعم الاجتماعي ومخاطر الأمان والتقييم الإكلينيكي المتقدم (Social Support & Clinical Risk)
  {
    id: 'mspss-social-support',
    code: 'MSPSS',
    nameAr: 'مقياس إدراك الدعم الاجتماعي متعدد الأبعاد (MSPSS)',
    nameEn: 'Multidimensional Scale of Perceived Social Support',
    category: 'الشخصية والمزاج',
    estimatedMinutes: 3,
    targetPopulation: 'جميع الفئات',
    descriptionAr: 'يقيم كفاية الدعم العاطفي والمساندة المستمدة من الأسرة، الأصدقاء، والشخص المقرب/الشريك.',
    referenceCitation: 'Zimet GD, et al. The Multidimensional Scale of Perceived Social Support. 1988.',
    defaultOptions: [
      { value: 7, labelAr: 'أوافق بشدة (7)' },
      { value: 6, labelAr: 'أوافق (6)' },
      { value: 5, labelAr: 'أوافق قليلاً (5)' },
      { value: 4, labelAr: 'محايد (4)' },
      { value: 3, labelAr: 'لا أوافق قليلاً (3)' },
      { value: 2, labelAr: 'لا أوافق (2)' },
      { value: 1, labelAr: 'أعارض بشدة (1)' }
    ],
    questions: [
      { id: 1, textAr: 'هناك شخص مميز قريب مني عندما أكون بحاجة للمساعدة.' },
      { id: 2, textAr: 'هناك شخص مميز يمكنني مشاركة أفراحي وأحزاني معه.' },
      { id: 3, textAr: 'عائلتي تحاول حقاً مساعدتي وتقديم العون لي.' },
      { id: 4, textAr: 'أحصل على الدعم العاطفي والمساعدة التي أحتاجها من عائلتي.' },
      { id: 5, textAr: 'لدي شخص مميز يشكل مصدراً حقيقياً للراحة في حياتي.' },
      { id: 6, textAr: 'أصدقائي يحاولون حقاً مساعدتي في الأوقات الصعبة.' },
      { id: 7, textAr: 'يمكنني الاعتماد على أصدقائي عندما تسوء الأمور.' },
      { id: 8, textAr: 'يمكنني التحدث عن مشاكلي بصراحة مع عائلتي.' },
      { id: 9, textAr: 'لدي أصدقاء يشاركونني أفراحي وأحزاني.' },
      { id: 10, textAr: 'عائلتي على استعداد لمساعدتي في اتخاذ القرارات الهامة.' }
    ],
    scoringCriteria: [
      { min: 50, max: 70, labelAr: 'دعم اجتماعي قوي ومرتفع', badgeColor: 'emerald', interpretation: 'شبكة أمان اجتماعي وعائلي متينة تساند التعافي النفسي.', clinicalAction: 'تعزيز العلاقات الداعمة.' },
      { min: 30, max: 49, labelAr: 'دعم اجتماعي متوسط', badgeColor: 'teal', interpretation: 'وجود مساندة مقبولة مع بعض الفجوات التواصلية.', clinicalAction: 'تطوير مهارات التواصل الأسري.' },
      { min: 10, max: 29, labelAr: 'عزلة اجتماعية وفقر شديد في الدعم (Low Support)', badgeColor: 'rose', interpretation: 'شعور بالوحدة وغياب السند الاجتماعي مما يرفع هشاشة المريض للانتكاس.', clinicalAction: 'إشراك الأخصائي الاجتماعي وبناء شبكات الدعم ومجموعات المساندة.' }
    ]
  },
  {
    id: 'cssrs-suicide-risk',
    code: 'C-SSRS',
    nameAr: 'مقياس كولومبيا لتقييم خطورة إيذاء النفس والتفكير الانتحاري (C-SSRS Screener)',
    nameEn: 'Columbia-Suicide Severity Rating Scale Screener',
    category: 'الشخصية والمزاج',
    estimatedMinutes: 3,
    targetPopulation: 'تقييم سريري عاجل للأمان النفسي',
    descriptionAr: 'الأداة المعيارية الدولية لفرز الأفكار السلبية، التخطيط، والنية لضمان سلامة المريض والتدخل الطارئ الفوري.',
    referenceCitation: 'Posner K, et al. The Columbia-Suicide Severity Rating Scale. Am J Psychiatry. 2011.',
    defaultOptions: [
      { value: 1, labelAr: 'نعم (1)' },
      { value: 0, labelAr: 'لا (0)' }
    ],
    questions: [
      { id: 1, textAr: 'هل تمنيت في الآونة الأخيرة أن تذهب في النوم ولا تستيقظ أبداً؟' },
      { id: 2, textAr: 'هل راودتك أفكار فعلية حول إيذاء نفسك أو إنهاء حياتك؟' },
      { id: 3, textAr: 'هل فكرت في طريقة أو وسيلة محددة لفعل ذلك؟' },
      { id: 4, textAr: 'هل راودتك أي نية أو رغبة لتنفيذ هذه الأفكار؟' },
      { id: 5, textAr: 'هل بدأت بوضع خطة تفصيلية محددة أو اتخاذ خطوات تحضيرية لذلك؟' }
    ],
    scoringCriteria: [
      { min: 0, max: 0, labelAr: 'مستوى أمان مستقر (Low Risk)', badgeColor: 'emerald', interpretation: 'لا توجد أفكار إيذاء نفس نشطة مسجلة.', clinicalAction: 'المتابعة الروتينية.' },
      { min: 1, max: 2, labelAr: 'أفكار سلبية سلبية بدون نية (Moderate Alert)', badgeColor: 'amber', interpretation: 'أفكار هروبية وسلبية تتطلب الاستماع والدعم وتفعيل شبكة الأمان.', clinicalAction: 'وضع خطة أمان نفسي (Safety Plan) وتأكيد الدعم.' },
      { min: 3, max: 5, labelAr: '⚠️ خطر سريري حرج (High / Imminent Risk)', badgeColor: 'rose', interpretation: 'وجود تفكير نشط مع وسيلة أو نية يمثل حالة طوارئ طبية قصوى.', clinicalAction: '🚨 تفعيل بروتوكول الطوارئ فوراً: التواصل مع خط الدعم الساخن 24/7 ومرافقة المريض لجهة رعاية إسعافية عاجلة.' }
    ]
  },
  {
    id: 'mmpi-screening-profile',
    code: 'MMPI-Alt',
    nameAr: 'مقياس الفحص الإكلينيكي الشامل متعدد الأبعاد (بديل MMPI الإكلينيكي المعتمد)',
    nameEn: 'Comprehensive Clinical Profile Screening (MMPI-Alternative)',
    category: 'الشخصية والمزاج',
    estimatedMinutes: 8,
    targetPopulation: 'التقييم الإكلينيكي الموسع للبالغين',
    descriptionAr: 'فحص إكلينيكي موسع لـ 30 بعداً نفسياً يغطي سمات المزاج، التوجس، الأعراض الجسدية النفسية، والانفصال عن الواقع.',
    referenceCitation: 'Hathaway SR, McKinley JC / Adapted Clinical Personality Battery. 2020.',
    defaultOptions: [
      { value: 1, labelAr: 'ينطبق عليّ (صحيح) (1)' },
      { value: 0, labelAr: 'لا ينطبق عليّ (غير صحيح) (0)' }
    ],
    questions: [
      { id: 1, textAr: 'أشعر في كثير من الأحيان بآلام وضيق في جسدي دون سبب طبي واضح.' },
      { id: 2, textAr: 'تنتابني فترات أشعر فيها أنني لا أهتم بما يحدث حولي إطلاقاً.' },
      { id: 3, textAr: 'أعتقد أحياناً أن هناك من يراقبني أو يتحدث عني من وراء ظهري.' },
      { id: 4, textAr: 'ذاكرتي وتركيزي يبدوان مشوشين ومجهدين في معظم الأوقات.' },
      { id: 5, textAr: 'أجد صعوبة في التكيف مع القواعد والأنظمة الروتينية.' },
      { id: 6, textAr: 'أشعر بفترات من الحماس الهائل يتبعها هبوط مفاجئ في العزيمة.' },
      { id: 7, textAr: 'أشعر أحياناً بالغربة عن جسدي أو أن العالم المحيط بي غير حقيقي.' },
      { id: 8, textAr: 'أتحسس بشدة من نظرات وتعليقات الآخرين.' },
      { id: 9, textAr: 'تأتيني أفكار غريبة لا أستطيع إبعادها عن ذهني.' },
      { id: 10, textAr: 'أفضل العزلة والابتعاد التام عن المناسبات الاجتماعية.' },
      { id: 11, textAr: 'أشعر بالندم الشديد بعد اتخاذ قرارات متسرعة.' },
      { id: 12, textAr: 'أشعر أحياناً أن طاقتي تفوق طاقة أي شخص آخر.' },
      { id: 13, textAr: 'تنتابني نوبات غضب سريعة لا أستطيع السيطرة عليها بسهولة.' },
      { id: 14, textAr: 'أشك في نوايا الناس حتى وإن أظهروا الود.' },
      { id: 15, textAr: 'أشعر بالخوف الشديد في الأماكن المغلقة أو المزدحمة.' }
    ],
    scoringCriteria: [
      { min: 0, max: 4, labelAr: 'ملف شخصي متزن ومستقر', badgeColor: 'emerald', interpretation: 'الاستجابات تعكس استقراراً في المحاور السلوكية والانفعالية.', clinicalAction: 'تعزيز المرونة النفسية.' },
      { min: 5, max: 9, labelAr: 'سمات انفعالية تستدعي الاستكشاف الإكلينيكي', badgeColor: 'amber', interpretation: 'توجد سمات قلق ومشاعر توجس تحتاج لتحليل في الجلسات.', clinicalAction: 'إجراء مقابلة تشخيصية متعمقة مع الطبيب النفسي.' },
      { min: 10, max: 15, labelAr: 'مؤشرات اضطراب نفسي معقد ومتعدد الأبعاد', badgeColor: 'rose', interpretation: 'تداخل أعراض جسدية ومزاجية وتوجسية تستلزم خطة تقييم شاملة.', clinicalAction: 'استشارة إكلينيكية متخصصة ووضع خطة علاج متعددة المحاور.' }
    ]
  }
];
