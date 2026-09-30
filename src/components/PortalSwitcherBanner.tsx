import React from 'react';
import { 
  Heart, 
  Stethoscope, 
  ShieldCheck, 
  ArrowLeft,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { PortalType } from '../types';

interface Props {
  activePortal: PortalType;
  setActivePortal: (p: PortalType) => void;
}

export const PortalSwitcherBanner: React.FC<Props> = ({ activePortal, setActivePortal }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-right">
        
        {/* Title */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            المنصات الثلاث المستقلة المتكاملة:
          </span>
        </div>

        {/* 3 Portals Quick Switch Cards */}
        <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
          
          {/* Patient Portal */}
          <button
            onClick={() => setActivePortal('patient')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activePortal === 'patient'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${activePortal === 'patient' ? 'fill-current text-rose-300' : 'text-slate-400'}`} />
            <span>لوحة المريض / العميل</span>
          </button>

          {/* Doctor Portal */}
          <button
            onClick={() => setActivePortal('doctor')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activePortal === 'doctor'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>لوحة الطبيب / المعالج</span>
          </button>

          {/* Admin Portal */}
          <button
            onClick={() => setActivePortal('admin')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activePortal === 'admin'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لوحة الأدمن والـ API</span>
          </button>

        </div>

      </div>
    </div>
  );
};
