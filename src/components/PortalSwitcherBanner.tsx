import React, { useState } from 'react';
import { 
  Heart, 
  Stethoscope, 
  ShieldCheck, 
  Link as LinkIcon,
  Check,
  ExternalLink,
  Lock
} from 'lucide-react';
import { PortalType } from '../types';

interface Props {
  activePortal: PortalType;
  setActivePortal: (p: PortalType) => void;
  isAdminAuthenticated?: boolean;
}

export const PortalSwitcherBanner: React.FC<Props> = ({ activePortal, setActivePortal, isAdminAuthenticated }) => {
  const [copied, setCopied] = useState(false);

  const portalConfig = {
    patient: {
      name: 'بوابة المريض والعيادات',
      hash: '#patient',
      icon: Heart,
      iconActiveColor: 'fill-current text-rose-300'
    },
    doctor: {
      name: 'عيادة الطبيب والمعالج',
      hash: '#doctor',
      icon: Stethoscope,
      iconActiveColor: 'text-white'
    },
    admin: {
      name: 'لوحة الإدارة والتحكم',
      hash: '#admin',
      icon: ShieldCheck,
      iconActiveColor: 'text-white'
    }
  };

  const handleCopyLink = () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#${activePortal}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2 sm:py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-right">
        
        {/* Title and Direct Link Indicator */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            التبديل بين منصات النظام:
          </span>
          <span className="text-[11px] font-mono text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200/50 dark:border-teal-800/50 flex items-center gap-1">
            <span className="text-slate-400">الرابط الحالي:</span>
            <span>#{activePortal}</span>
          </span>
        </div>

        {/* 3 Portals Quick Switch Cards + Copy Direct Link */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 flex-1 md:flex-none">
            
            {/* Patient Portal */}
            <button
              onClick={() => setActivePortal('patient')}
              title="رابط مباشر: /#patient"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
                activePortal === 'patient'
                  ? 'bg-teal-700 text-white shadow-xs ring-2 ring-teal-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 shrink-0 ${activePortal === 'patient' ? 'fill-current text-rose-300' : 'text-slate-400'}`} />
              <span className="truncate">بوابة المريض</span>
              <span className="hidden lg:inline-block text-[10px] opacity-75 font-mono">/#patient</span>
            </button>

            {/* Doctor Portal */}
            <button
              onClick={() => setActivePortal('doctor')}
              title="رابط مباشر: /#doctor"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
                activePortal === 'doctor'
                  ? 'bg-teal-700 text-white shadow-xs ring-2 ring-teal-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">عيادة الطبيب</span>
              <span className="hidden lg:inline-block text-[10px] opacity-75 font-mono">/#doctor</span>
            </button>

            {/* Admin Portal */}
            <button
              onClick={() => setActivePortal('admin')}
              title={isAdminAuthenticated ? "لوحة الإدارة الموثقة (مفتوحة)" : "منطقة وصول إداري محمي (OBS-A-001)"}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
                activePortal === 'admin'
                  ? 'bg-teal-700 text-white shadow-xs ring-2 ring-teal-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">لوحة الإدارة</span>
              {!isAdminAuthenticated && (
                <span title="محمية بكلمة مرور ورمز 2FA (OBS-A-001)" className="inline-flex items-center">
                  <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                </span>
              )}
              <span className="hidden lg:inline-block text-[10px] opacity-75 font-mono">/#admin</span>
            </button>

          </div>

          {/* Copy Direct Link Button */}
          <button
            onClick={handleCopyLink}
            type="button"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors shrink-0"
            title="نسخ الرابط المباشر للوحة الحالية لمشاركتها أو حفظها"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">تم نسخ الرابط!</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">نسخ رابط اللوحة</span>
                <span className="sm:hidden">نسخ</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
