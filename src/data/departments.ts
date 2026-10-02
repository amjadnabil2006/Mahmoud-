export interface Department {
  id: string;
  nameAr: string;
  nameEn: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  badge: string;
  accentColor: string; // teal, indigo, amber, purple
  targetDisorders: string[];
  recommendedTreatments: string[];
  doctorCount: number;
}

export const CLINICAL_DEPARTMENTS: Department[] = [
  {
    id: 'psychiatry',
    nameAr: 'قسم الطب النفسي والاستشارات الإكلينيكية',
    nameEn: 'Psychiatry & Medical Disorders',
    shortDesc: 'التشخيص الطبي الدقيق، الوصفات الدوائية، والتعامل مع الحالات المتوسطة والشديدة.',
    fullDesc: 'يختص بتشخيص وعلاج الاضطرابات النفسية الكبرى وتحديد البروتوكولات الدوائية المعتمدة والوصفات الطبية تحت إشراف استشاريي الطب النفسي المرخصين.',
    iconName: 'Stethoscope',
    badge: 'استشارات دوائية وتشخيص',
    accentColor: 'teal',
    targetDisorders: [
      'اضطراب الاكتئاب الجسيم (MDD)',
      'اضطرابات القلق ونوبات الهلع',
      'اضطراب ثنائي القطب (Bipolar)',
      'الوسواس القهري الشديد (OCD)',
      'الفصام والاضطرابات الذهانية',
      'اضطراب فرط الحركة وتشتت الانتباه (ADHD)'
    ],
    recommendedTreatments: [
      'التقييم التشخيصي الشامل (DSM-5 / ICD-11)',
      'الوصفات الطبية ومتابعة الجرعات والآثار الجانبية',
      'فحص الحالة العقلية المستمر (MSE)'
    ],
    doctorCount: 4
  },
  {
    id: 'psychotherapy',
    nameAr: 'قسم العلاج النفسي وتعديل السلوك (CBT)',
    nameEn: 'Psychotherapy & Behavioral Counseling',
    shortDesc: 'جلسات كلامية، علاج معرفي سلوكي، صدمات EMDR، واستشارات العلاقات والأسرة.',
    fullDesc: 'يركز على العلاجات النفسية غير الدوائية لحل المشكلات السلوكية وتعديل أنماط التفكير المشوهة ومعالجة صدمات الماضي وبناء المرونة النفسية.',
    iconName: 'Brain',
    badge: 'جلسات كلامية وسلوكية',
    accentColor: 'indigo',
    targetDisorders: [
      'اضطراب ما بعد الصدمة (PTSD) والذكريات المؤلمة',
      'القلق العام والتوتر والاحتراق النفسي الوظيفي',
      'الرهاب الاجتماعي والمخاوف المرضية المحددة',
      'مشاكل الثقة بالنفس واضطراب تقدير الذات',
      'الصراعات الأسرية والزوجية والتكيف'
    ],
    recommendedTreatments: [
      'العلاج المعرفي السلوكي (CBT)',
      'علاج معالجة الصدمات بحركة العين (EMDR)',
      'العلاج بالقبول والالتزام (ACT)',
      'العلاج السلوكي الجدلي (DBT)'
    ],
    doctorCount: 5
  },
  {
    id: 'nutrition',
    nameAr: 'قسم التغذية العلاجية النفسية والأيض',
    nameEn: 'Nutritional Psychiatry & Gut-Brain',
    shortDesc: 'محور الأمعاء-الدماغ، ميكروبيوم السيروتونين، ومكافحة الأيض للأدوية النفسية.',
    fullDesc: 'يدمج أحدث الأبحاث العلمية في علم الأعصاب الغذائي لتحسين كيمياء الدماغ، وتعديل حميات اضطرابات الأكل، وضبط دهون وسكر الدم لمرضى مضادات الذهان.',
    iconName: 'Apple',
    badge: 'محور الأمعاء-الدماغ',
    accentColor: 'amber',
    targetDisorders: [
      'اضطرابات الأكل (القهم العصبي، الشره العصبي، نهم الطعام)',
      'الاكتئاب المرتبط بالالتهاب العصبي ونقص المغذيات',
      'المتلازمة الأيضية ومقاومة الأنسولين لمرضى مضادات الذهان',
      'القولون العصبي والضباب الدماغي المرتبط بالقلق'
    ],
    recommendedTreatments: [
      'بروتوكولات الأحماض الدهنية وفيتامينات الأعصاب (Omega-3 & B-Complex)',
      'حميات إعادة تأهيل الميكروبيوم المعوي (Gut Microbiome)',
      'المراقبة الأيضية المستمرة لوزن وضغط وسكر المريض'
    ],
    doctorCount: 3
  },
  {
    id: 'social_work',
    nameAr: 'قسم الخدمة الاجتماعية والتأهيل الأسري',
    nameEn: 'Psychiatric Social Work & Family Care',
    shortDesc: 'دراسة البيئة الأسرية، تمكين المريض اجتماعياً، ومكافحة الوصمة والعزلة.',
    fullDesc: 'يعمل كجسر بين العيادة والمجتمع، لتقييم مصادر الدعم الاجتماعي، توعية الأهل بمفهوم المرض النفسي، وحماية المريض من الأزمات الأسرية والمادية.',
    iconName: 'Users',
    badge: 'دعم أسري ومجتمعي',
    accentColor: 'purple',
    targetDisorders: [
      'التفكك والصراعات الأسرية المصاحبة للمرض النفسي',
      'العزلة الاجتماعية والانسحاب والانقطاع عن العمل/الدراسة',
      'ضحايا العنف المنزلي والإيذاء والإهمال',
      'الوصمة المجتمعية وضعف التكيف البيئي'
    ],
    recommendedTreatments: [
      'الإرشاد الأسري النفسي (Family Psychoeducation)',
      'بناء شبكات الدعم ومجموعات المساندة الاجتماعية',
      'خطط التأهيل وإعادة الاندماج الأكاديمي والمهني'
    ],
    doctorCount: 3
  }
];

export const getDepartmentColorStyles = (color: string) => {
  switch (color?.toLowerCase()) {
    case 'indigo':
      return {
        badgeBg: 'bg-indigo-50 dark:bg-indigo-950',
        badgeText: 'text-indigo-800 dark:text-indigo-300',
        badgeBorder: 'border-indigo-200 dark:border-indigo-800',
        iconBg: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300',
        accentBorder: 'border-indigo-500',
        buttonBg: 'bg-indigo-700 hover:bg-indigo-800 text-white'
      };
    case 'amber':
      return {
        badgeBg: 'bg-amber-50 dark:bg-amber-950',
        badgeText: 'text-amber-800 dark:text-amber-300',
        badgeBorder: 'border-amber-200 dark:border-amber-800',
        iconBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
        accentBorder: 'border-amber-500',
        buttonBg: 'bg-amber-700 hover:bg-amber-800 text-white'
      };
    case 'purple':
    case 'violet':
      return {
        badgeBg: 'bg-purple-50 dark:bg-purple-950',
        badgeText: 'text-purple-800 dark:text-purple-300',
        badgeBorder: 'border-purple-200 dark:border-purple-800',
        iconBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
        accentBorder: 'border-purple-500',
        buttonBg: 'bg-purple-700 hover:bg-purple-800 text-white'
      };
    case 'rose':
    case 'red':
      return {
        badgeBg: 'bg-rose-50 dark:bg-rose-950',
        badgeText: 'text-rose-800 dark:text-rose-300',
        badgeBorder: 'border-rose-200 dark:border-rose-800',
        iconBg: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300',
        accentBorder: 'border-rose-500',
        buttonBg: 'bg-rose-700 hover:bg-rose-800 text-white'
      };
    case 'cyan':
    case 'sky':
      return {
        badgeBg: 'bg-cyan-50 dark:bg-cyan-950',
        badgeText: 'text-cyan-800 dark:text-cyan-300',
        badgeBorder: 'border-cyan-200 dark:border-cyan-800',
        iconBg: 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300',
        accentBorder: 'border-cyan-500',
        buttonBg: 'bg-cyan-700 hover:bg-cyan-800 text-white'
      };
    case 'emerald':
    case 'green':
      return {
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950',
        badgeText: 'text-emerald-800 dark:text-emerald-300',
        badgeBorder: 'border-emerald-200 dark:border-emerald-800',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
        accentBorder: 'border-emerald-500',
        buttonBg: 'bg-emerald-700 hover:bg-emerald-800 text-white'
      };
    case 'blue':
      return {
        badgeBg: 'bg-blue-50 dark:bg-blue-950',
        badgeText: 'text-blue-800 dark:text-blue-300',
        badgeBorder: 'border-blue-200 dark:border-blue-800',
        iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
        accentBorder: 'border-blue-500',
        buttonBg: 'bg-blue-700 hover:bg-blue-800 text-white'
      };
    case 'teal':
    default:
      return {
        badgeBg: 'bg-teal-50 dark:bg-teal-950',
        badgeText: 'text-teal-800 dark:text-teal-300',
        badgeBorder: 'border-teal-200 dark:border-teal-800',
        iconBg: 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300',
        accentBorder: 'border-teal-500',
        buttonBg: 'bg-teal-700 hover:bg-teal-800 text-white'
      };
  }
};
