import { ClinicalFormTemplate } from '../types';

export const CLINICAL_FORMS_TEMPLATES: ClinicalFormTemplate[] = [
  {
    id: 'mse',
    code: 'MSE-STD',
    titleAr: 'فحص الحالة العقلية الشامل (Mental Status Examination - MSE)',
    descriptionAr: 'الأداة الأساسية للأطباء والأخصائيين النفسيين لتوثيق ووصف الحالة النفسية والعقلية الراهنة للمريض أثناء المقابلة السريرية.',
    category: 'فحص الحالة العقلية (MSE)',
    sections: [
      {
        title: '1. المظهر العام والسلوك (Appearance & Behavior)',
        fields: [
          {
            id: 'appearance',
            label: 'المظهر والنظافة الشخصية والملبس',
            type: 'select',
            options: ['مهندم وملائم لعمره وللموقف', 'إهمال ملحوظ في النظافة والملبس', 'ملبس غريب أو غير مألوف', 'يبدو أكبر بكثير من عمره الفعلي']
          },
          {
            id: 'behavior',
            label: 'السلوك الحركي والتعاون',
            type: 'select',
            options: ['متعاون وهادئ', 'هياج نفسي حركي وتململ', 'بطء وتثبيط حركي شديد (Retardation)', 'عدائي أو دفاعي ومتحفز', 'حركات لا إرادية أو تكرارية (Tics/Tremors)']
          },
          {
            id: 'eye_contact',
            label: 'التواصل البصري (Eye Contact)',
            type: 'select',
            options: ['تواصل بصري طبيعي وملائم', 'تجنب التواصل البصري (خجل/اكتئاب/شك)', 'تحديق حاد ومستمر غير طبيعي', 'شارد وغير منتبه']
          }
        ]
      },
      {
        title: '2. المزاج والوجدان (Mood & Affect)',
        fields: [
          {
            id: 'mood_subjective',
            label: 'المزاج الذاتي بكلمات المريض (Subjective Mood)',
            type: 'text',
            placeholder: 'مثال: "أشعر بحزن خانق وثقل في صدري" أو "أشعر بعصبية وتوتر دائم"'
          },
          {
            id: 'affect_objective',
            label: 'الوجدان كما لاحظه الفاحص (Objective Affect)',
            type: 'select',
            options: ['مستقر وملائم للموقف (Euthymic)', 'مكتئب وحزين ومجهد (Depressed)', 'قلق ومتوتر ومترقب (Anxious)', 'مبتهج أو هوسي (Euphoric)', 'مسطح وغير متفاعل (Blunted / Flat)', 'متقلب وسريع التغير (Labile)']
          },
          {
            id: 'affect_congruency',
            label: 'تطابق الوجدان مع محتوى الحديث (Congruence)',
            type: 'select',
            options: ['متطابق تماماً مع محتوى أفكاره', 'غير متطابق (يبتسم عند الحديث عن الصدمات والحزن)']
          }
        ]
      },
      {
        title: '3. الكلام واللغة (Speech)',
        fields: [
          {
            id: 'speech_rate_volume',
            label: 'معدل ونبرة وحجم الكلام',
            type: 'select',
            options: ['طبيعي من حيث السرعة والنبرة', 'بطيء ومنخفض الصوت بصعوبة (اكتئابي)', 'سريع ومتسارع لا ينقطع (Pressured Speech)', 'متلعثم أو متردد']
          }
        ]
      },
      {
        title: '4. مجرى ومحتوى التفكير (Thought Process & Content)',
        fields: [
          {
            id: 'thought_process',
            label: 'مجرى وشكل التفكير (Thought Process)',
            type: 'select',
            options: ['منطقي ومترابط وموجه نحو الهدف (Linear & Goal-directed)', 'تطاير وتدافع الأفكار (Flight of Ideas)', 'استطرادي يعود للهدف ببطء (Circumstantial)', 'تفكك الروابط وتناثر غير مفهوم (Loose Associations)', 'انسداد وانقطاع مفاجئ في الأفكار (Thought Blocking)']
          },
          {
            id: 'delusions',
            label: 'الضلالات والأفكار الزورانية (Delusions)',
            type: 'select',
            options: ['لا توجد أي ضلالات', 'أفكار ارتياب واضطهاد وملاحقة', 'ضلالات عظمة وقوة خارقة', 'ضلالات ذنب وعقاب جسيم أو عدمية', 'أفكار مرجعية (Ideas of Reference)']
          },
          {
            id: 'obsessions',
            label: 'الوساوس والمخاوف (Obsessions / Phobias)',
            type: 'textarea',
            placeholder: 'سجل وساوس النظافة، الشك، الترتيب، أو المخاوف المرضية إن وجدت...'
          }
        ]
      },
      {
        title: '5. الإدراك الحسي (Perception)',
        fields: [
          {
            id: 'hallucinations',
            label: 'الهلاوس الحسية (Hallucinations)',
            type: 'select',
            options: ['لا توجد هلاوس إطلاقاً', 'هلاوس سمعية (أصوات تعلق أو تأمر)', 'هلاوس بصرية', 'هلاوس حسية أو جسدية', 'تبدد واقع أو تبدد شخصية (Derealization)']
          }
        ]
      },
      {
        title: '6. البصيرة والحكم على الأمور (Insight & Judgment)',
        fields: [
          {
            id: 'insight',
            label: 'البصيرة بالمرض النفسي والحاجة للعلاج',
            type: 'select',
            options: ['بصيرة كاملة (يدرك وجود المرض وأسبابه ويطلب العلاج)', 'بصيرة جزئية (يعترف بالأعراض وينسبها لأسباب عضوية أو حسد فقط)', 'انعدام البصيرة تماماً (ينكر المرض النفسي ويرفض العلاج)']
          },
          {
            id: 'judgment',
            label: 'الحكم على الأمور (Judgment)',
            type: 'select',
            options: ['سليم وقادر على اتخاذ القرارات وحماية نفسه', 'ضعيف ومتأثر بالمشاعر أو الاندفاعية', 'مختل بشكل يعرض سلامته أو سلامة الآخرين للخطر']
          }
        ]
      }
    ]
  },
  {
    id: 'suicide_risk',
    code: 'SR-ASSESS',
    titleAr: 'بروتوكول تقييم خطورة الانتحار وإيذاء النفس (C-SSRS Aligned)',
    descriptionAr: 'بروتوكول أمني وسريري إلزامي لحالات الاكتئاب واليأس لتقييم الأفكار والنوايا والخطط الانتحارية وتحديد مستوى الحماية الفوري.',
    category: 'تقييم خطورة الانتحار',
    sections: [
      {
        title: 'أ. تقييم الأفكار الانتحارية (Suicidal Ideation)',
        fields: [
          {
            id: 'passive_wish',
            label: '1. هل تراودك أمنية سلبية بالنوم وعدم الاستيقاظ أو الموت الطبيعي؟',
            type: 'select',
            options: ['لا أبداً (0)', 'نعم، أحياناً (1)', 'نعم، باستمرار (2)']
          },
          {
            id: 'active_thoughts',
            label: '2. هل فكرت فعلياً في إنهاء حياتك بأي شكل؟',
            type: 'select',
            options: ['لا (0)', 'نعم، دون طريقة محددة (1)', 'نعم، مع التفكير في وسائل معينة (2)']
          },
          {
            id: 'suicide_intent',
            label: '3. هل توجد نية وعزم داخلي على تنفيذ ذلك؟',
            type: 'select',
            options: ['لا نية على الإطلاق ووجود روادع دينية وأسرية قوية (0)', 'نية غامضة أو مترددة (1)', 'نية صريحة وعزم على إنهاء الحياة (2)']
          },
          {
            id: 'suicide_plan',
            label: '4. هل وضعت خطة محددة أو أعددت وسيلة أو كتبت رسالة وداعية؟',
            type: 'select',
            options: ['لا توجد خطة أو تحضيرات (0)', 'تفكير في الخطة دون تجهيز (1)', 'خطة محددة والوسائل متاحة بين يديه (خطر حرج) (2)']
          }
        ]
      },
      {
        title: 'ب. عوامل الخطر والحماية (Risk & Protective Factors)',
        fields: [
          {
            id: 'past_attempts',
            label: 'التاريخ السابق لمحاولات الانتحار أو إيذاء النفس',
            type: 'select',
            options: ['لا توجد محاولات سابقة قط', 'محاولة سابقة واحدة قبل أكثر من عام', 'محاولات متعددة حديثة وشديدة الخطورة']
          },
          {
            id: 'protective_factors',
            label: 'عوامل الحماية المتاحة',
            type: 'select',
            options: ['روادع دينية وأخلاقية قوية، دعم أسري متماسك، رعاية أطفال', 'دعم أسري محدود ومشاعر ذنب تجاه الأسرة', 'انعدام الدعم الاجتماعي، عزلة تامة، شعور بأنه عبء على العالم']
          }
        ]
      },
      {
        title: 'ج. التصنيف السريري والخطة الإلزامية',
        fields: [
          {
            id: 'final_risk_level',
            label: 'مستوى الخطورة الإجمالي المقدر',
            type: 'select',
            options: ['منخفض (Low Risk) - أفكار سلبية عابرة بدون نية مع وجود روادع', 'متوسط (Moderate Risk) - أفكار نشطة مع تردد وروادع جزئية', 'مرتفع / حرج (High / Imminent Risk) - نية أو خطة أو وسيلة متاحة']
          },
          {
            id: 'safety_plan_notes',
            label: 'إجراءات الأمان وخطة الطوارئ',
            type: 'textarea',
            placeholder: 'تدوين الاتفاق على خطة السلامة (Safety Contract)، إشراك المرافق، إبعاد أي أدوية أو أدوات حادة، ورقم طوارئ الصحة النفسية...'
          }
        ]
      }
    ]
  },
  {
    id: 'soap_note',
    code: 'SOAP-NOTE',
    titleAr: 'ملاحظة تقدم الجلسة العلاجية بنموذج (SOAP Note)',
    descriptionAr: 'النموذج الطبي القياسي لتوثيق الجلسات العلاجية النفسية وتتبع الخطة بين الجلسات.',
    category: 'تقرير جلسة علاجية (SOAP)',
    sections: [
      {
        title: 'تقرير الجلسة (SOAP Framework)',
        fields: [
          {
            id: 'soap_s',
            label: 'S - الشكوى الذاتية للمريض (Subjective)',
            type: 'textarea',
            placeholder: 'ماذا ذكر المريض عن حالته ومشاعره وأعراضه منذ الجلسة السابقة، ومدى التزامه بالواجب المنزلي أو العلاج الدوائي...'
          },
          {
            id: 'soap_o',
            label: 'O - الملاحظات الموضوعية للمعالج (Objective)',
            type: 'textarea',
            placeholder: 'الملاحظات السلوكية، نتائج المقاييس في الجلسة، لغة الجسد، التواصل، والوجدان...'
          },
          {
            id: 'soap_a',
            label: 'A - التقييم السريري والتحليلي (Assessment)',
            type: 'textarea',
            placeholder: 'تحليل استجابة المريض للتقنيات، الأفكار التلقائية المشوهة التي نوقشت، ومدى التقدم نحو الأهداف...'
          },
          {
            id: 'soap_p',
            label: 'P - الخطة العلاجية والواجب (Plan)',
            type: 'textarea',
            placeholder: 'التقنيات المطبقة للجلسة القادمة، الواجب السلوكي/المعرفي المتفق عليه، والموعد القادم...'
          }
        ]
      }
    ]
  }
];
