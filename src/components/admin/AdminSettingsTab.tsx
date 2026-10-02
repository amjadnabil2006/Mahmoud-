import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Check, 
  Globe, 
  Phone, 
  MessageCircle, 
  Clock, 
  DollarSign, 
  Bell, 
  Megaphone,
  AlertTriangle,
  Layout,
  Sliders,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  FileText,
  Share2,
  Mail,
  MapPin,
  CheckCircle2,
  Percent
} from 'lucide-react';
import { ClinicSettings } from '../../types';

interface Props {
  settings: ClinicSettings;
  onUpdateSettings: (newSettings: Partial<ClinicSettings>) => Promise<void>;
  onResetSettings: () => Promise<void>;
}

export const AdminSettingsTab: React.FC<Props> = ({
  settings,
  onUpdateSettings,
  onResetSettings
}) => {
  const [formData, setFormData] = useState<ClinicSettings>(settings);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'hero' | 'banners' | 'sections' | 'pricing' | 'social'>('general');

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      alert('خطأ في حفظ الإعدادات: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm('هل ترغب حقاً في استعادة إعدادات المنصة الافتراضية بالكامل؟')) {
      await onResetSettings();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>تم حفظ وتطبيق كافة إعدادات المنصة بنجاح وتحديث واجهة المريض والصفحة الرئيسية مباشرة!</span>
          </div>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full font-mono">LIVE SYNCED</span>
        </div>
      )}

      {/* Sub-navigation categories */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'general', label: 'الهوية والتواصل', icon: Globe },
          { id: 'hero', label: 'واجهة الهيرو والشارات', icon: Sparkles },
          { id: 'banners', label: 'شرائط التنبيه والطوارئ', icon: Megaphone },
          { id: 'sections', label: 'التحكم في ظهور الأقسام', icon: Layout },
          { id: 'pricing', label: 'الأسعار والسياسات', icon: Percent },
          { id: 'social', label: 'روابط التواصل والتذييل', icon: Share2 },
        ].map(sub => {
          const Icon = sub.icon;
          const isSelected = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. GENERAL IDENTITY & CONTACT */}
      {activeSubTab === 'general' && (
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <Globe className="w-4 h-4 text-teal-600" />
            <span>الهوية الرسمية وأرقام التواصل والعناوين</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">اسم العيادة بالعربية:</label>
              <input
                type="text"
                required
                value={formData.clinicNameAr || ''}
                onChange={(e) => setFormData({ ...formData, clinicNameAr: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">اسم العيادة بالإنجليزية:</label>
              <input
                type="text"
                required
                value={formData.clinicNameEn || ''}
                onChange={(e) => setFormData({ ...formData, clinicNameEn: e.target.value })}
                dir="ltr"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-left font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>العنوان الجغرافي والفرع:</span>
              </label>
              <input
                type="text"
                value={formData.clinicAddress || ''}
                onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                placeholder="المدينة، الحي، اسم المبنى أو البرج"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span>البريد الإلكتروني الرسمي للاستفسارات:</span>
              </label>
              <input
                type="email"
                value={formData.clinicEmail || ''}
                onChange={(e) => setFormData({ ...formData, clinicEmail: e.target.value })}
                dir="ltr"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-left font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-rose-600" />
                <span>رقم الهاتف الموحد / الخط الساخن:</span>
              </label>
              <input
                type="text"
                value={formData.emergencyPhone || ''}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>رقم الواتساب الرسمي (خدمة العملاء):</span>
              </label>
              <input
                type="text"
                value={formData.whatsappPhone || ''}
                onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>مواعيد وساعات العمل المعتمدة:</span>
              </label>
              <input
                type="text"
                value={formData.workingHoursAr || ''}
                onChange={(e) => setFormData({ ...formData, workingHoursAr: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION & BADGES */}
      {activeSubTab === 'hero' && (
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>نصوص واجهة الهيرو الترحيبية والشارات المميزة</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">العنوان الرئيسي الكبير (Headline):</label>
              <input
                type="text"
                required
                value={formData.heroHeadline || ''}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">الوصف الترحيبي الفرعي (Subtitle):</label>
              <textarea
                rows={2}
                required
                value={formData.heroSubtitle || ''}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-2">شارات المزايا التنافسية الـ 4 في قسم الهيرو:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="الشارة 1"
                  value={formData.heroBadge1 || ''}
                  onChange={(e) => setFormData({ ...formData, heroBadge1: e.target.value })}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="الشارة 2"
                  value={formData.heroBadge2 || ''}
                  onChange={(e) => setFormData({ ...formData, heroBadge2: e.target.value })}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="الشارة 3"
                  value={formData.heroBadge3 || ''}
                  onChange={(e) => setFormData({ ...formData, heroBadge3: e.target.value })}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="الشارة 4"
                  value={formData.heroBadge4 || ''}
                  onChange={(e) => setFormData({ ...formData, heroBadge4: e.target.value })}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">إحصائيات الهيرو السريعة:</span>
                <span className="text-slate-500 text-[11px]">عرض أرقام نسب التعافي وسنوات الخبرة وعدد المرضى</span>
              </div>
              <input
                type="checkbox"
                checked={formData.showHeroStats ?? true}
                onChange={(e) => setFormData({ ...formData, showHeroStats: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. BANNERS & CRISIS HOTLINE */}
      {activeSubTab === 'banners' && (
        <div className="space-y-4">
          {/* Top Announcement Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <span>شريط الإعلانات العلوية أعلى الموقع</span>
              </h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.showAnnouncementBanner ?? true}
                  onChange={(e) => setFormData({ ...formData, showAnnouncementBanner: e.target.checked })}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <span>تفعيل ظهور الشريط</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-3 space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">نص الإعلان أو التنبيه:</label>
                <input
                  type="text"
                  value={formData.announcementText || ''}
                  onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">طابع اللون:</label>
                <select
                  value={formData.announcementType || 'info'}
                  onChange={(e) => setFormData({ ...formData, announcementType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="info">إرشادي (أزرق/تركواز)</option>
                  <option value="warning">تنبيهي عاجل (عنبري/برتقالي)</option>
                  <option value="success">إيجابي وترحيبي (أخضر)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Crisis & Hotline Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>شريط الطوارئ والتدخل النفسي السريع (Crisis Hotline)</span>
              </h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.showEmergencyBanner ?? true}
                  onChange={(e) => setFormData({ ...formData, showEmergencyBanner: e.target.checked })}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <span>تفعيل ظهور شريط الطوارئ</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">عنوان شريط الطوارئ:</label>
                <input
                  type="text"
                  value={formData.emergencyBannerTitle || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyBannerTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">رقم خط الطوارئ المباشر:</label>
                <input
                  type="text"
                  value={formData.emergencyHotline || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyHotline: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">نص التوضيح والتطمين للحالات الحرجة:</label>
                <input
                  type="text"
                  value={formData.emergencyBannerSubtitle || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyBannerSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Self Diagnostic Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>شريط بطاقة التقييم الذاتي المعتمد (Self-Diagnostic Scales)</span>
              </h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.showSelfDiagnosticBanner ?? true}
                  onChange={(e) => setFormData({ ...formData, showSelfDiagnosticBanner: e.target.checked })}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <span>تفعيل ظهور شريط التقييم</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">عنوان بطاقة التقييم:</label>
                <input
                  type="text"
                  value={formData.selfDiagnosticTitle || ''}
                  onChange={(e) => setFormData({ ...formData, selfDiagnosticTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">الوصف المختصر للمريض:</label>
                <input
                  type="text"
                  value={formData.selfDiagnosticSubtitle || ''}
                  onChange={(e) => setFormData({ ...formData, selfDiagnosticSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SECTIONS VISIBILITY CONTROL */}
      {activeSubTab === 'sections' && (
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <Layout className="w-4 h-4 text-teal-600" />
            <span>التحكم في إظهار أو إخفاء أقسام الصفحة الرئيسية</span>
          </h3>
          <p className="text-xs text-slate-500">
            يمكنك تفعيل أو إخفاء أي قسم في الصفحة الرئيسية للمرضى والزوار بنقرة زر واحدة دون الحاجة لتعديل الكود:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              {
                key: 'showDepartmentsSection',
                title: 'قسم الأقسام الطبية والعيادات التخصصية',
                desc: 'شبكة بطاقات الأقسام الأربعة والتخصصات والاضطرابات المعالجة',
                value: formData.showDepartmentsSection ?? true
              },
              {
                key: 'showDoctorsSection',
                title: 'قسم استكشاف الأطباء والكادر المعالج',
                desc: 'قائمة الأطباء والأسعار والمواعيد المتاحة لكل طبيب',
                value: formData.showDoctorsSection ?? true
              },
              {
                key: 'showFaqSection',
                title: 'قسم الأسئلة الشائعة والأجوبة الطبية',
                desc: 'الأسئلة المتكررة حول الجلسات، الأدوية، والسرية الطبية',
                value: formData.showFaqSection ?? true
              },
              {
                key: 'showTestimonialsSection',
                title: 'قسم آراء وقصص نجاح المتعافين',
                desc: 'تجارب المرضى وتقييمات الاستشاريين المعتمدة',
                value: formData.showTestimonialsSection ?? true
              },
              {
                key: 'showFooterSocials',
                title: 'أيقونات التواصل الاجتماعي في تذييل الموقع',
                desc: 'روابط حسابات العيادة على تويتر وإنستغرام ولينكدإن',
                value: formData.showFooterSocials ?? true
              }
            ].map((sec) => (
              <div
                key={sec.key}
                onClick={() => setFormData({ ...formData, [sec.key]: !sec.value })}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  sec.value
                    ? 'bg-white dark:bg-slate-900 border-teal-500/40 shadow-2xs'
                    : 'bg-slate-100/70 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {sec.value ? (
                      <Eye className="w-3.5 h-3.5 text-teal-600" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{sec.title}</span>
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sec.desc}</p>
                </div>
                <div className={`w-9 h-5 rounded-full transition-colors relative ${sec.value ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${sec.value ? 'right-4' : 'right-0.5'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PRICING & POLICIES */}
      {activeSubTab === 'pricing' && (
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <Percent className="w-4 h-4 text-teal-600" />
            <span>سياسات الحجز، بوابات الدفع، والخصومات الترويجية</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">نسبة خصم الحجز الأول للمرضى الجدد (%):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.consultationDiscountPercent ?? 10}
                  onChange={(e) => setFormData({ ...formData, consultationDiscountPercent: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
                <span className="font-bold text-slate-500">%</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">العملة الافتراضية للمعاملات:</label>
              <select
                value={formData.defaultCurrency || 'SAR'}
                onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">سياسة الإلغاء والاسترجاع المعتمدة:</label>
              <textarea
                rows={2}
                value={formData.cancellationPolicyAr || ''}
                onChange={(e) => setFormData({ ...formData, cancellationPolicyAr: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">بوابات الدفع الإلكتروني (مدى، فيزا، Apple Pay، PayPal):</span>
                <span className="text-slate-500 text-[11px]">تفعيل استلام المدفوعات آلياً أثناء تدفق حجز المواعيد</span>
              </div>
              <input
                type="checkbox"
                checked={formData.enableOnlinePayment ?? true}
                onChange={(e) => setFormData({ ...formData, enableOnlinePayment: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. SOCIAL LINKS & FOOTER */}
      {activeSubTab === 'social' && (
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <Share2 className="w-4 h-4 text-teal-600" />
            <span>روابط التواصل الاجتماعي وتذييل الموقع الرسمي</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">رابط منصة إكس / تويتر (Twitter / X):</label>
              <input
                type="text"
                value={formData.twitterUrl || ''}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                dir="ltr"
                placeholder="https://x.com/..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-left font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">رابط إنستغرام (Instagram):</label>
              <input
                type="text"
                value={formData.instagramUrl || ''}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                dir="ltr"
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-left font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">رابط لينكد إن (LinkedIn):</label>
              <input
                type="text"
                value={formData.linkedinUrl || ''}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                dir="ltr"
                placeholder="https://linkedin.com/..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-left font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">رابط قناة يوتيوب (YouTube):</label>
              <input
                type="text"
                value={formData.youtubeUrl || ''}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                dir="ltr"
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-left font-mono"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">نبذة تذييل الموقع (Footer Bio):</label>
              <textarea
                rows={2}
                value={formData.footerTextAr || ''}
                onChange={(e) => setFormData({ ...formData, footerTextAr: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">نص حقوق الملكية (Copyright):</label>
              <input
                type="text"
                value={formData.copyrightTextAr || ''}
                onChange={(e) => setFormData({ ...formData, copyrightTextAr: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة الإعدادات الافتراضية بالكامل</span>
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'جاري حفظ التعديلات...' : 'حفظ وتطبيق التغييرات على الموقع فوراً'}</span>
        </button>
      </div>
    </form>
  );
};
