import React from 'react';
import { 
  Heart, 
  Stethoscope, 
  ShieldCheck, 
  Calendar, 
  MessageSquare,
  Sun, 
  Moon
} from 'lucide-react';
import { PortalType, ThemeMode } from '../types';

interface Props {
  activePortal: PortalType;
  setActivePortal: (portal: PortalType) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenChat?: () => void;
  onOpenBooking?: () => void;
  unreadChatCount?: number;
}

export const MobileBottomNav: React.FC<Props> = ({
  activePortal,
  setActivePortal,
  theme,
  onToggleTheme,
  onOpenChat,
  onOpenBooking,
  unreadChatCount = 0
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-lg">
      
      {/* Patient Portal Link */}
      <button
        onClick={() => setActivePortal('patient')}
        className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all ${
          activePortal === 'patient'
            ? 'text-teal-600 dark:text-teal-400 font-bold'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Heart className={`w-5 h-5 ${activePortal === 'patient' ? 'fill-current' : ''}`} />
        <span className="text-[10px]">بوابة المريض</span>
      </button>

      {/* Quick Booking Page Link */}
      {onOpenBooking && (
        <button
          onClick={onOpenBooking}
          className="flex flex-col items-center gap-1 p-1 rounded-xl transition-all text-teal-700 dark:text-teal-300 font-bold"
        >
          <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span className="text-[10px]">حجز موعد</span>
        </button>
      )}

      {/* Direct Live Chat Link */}
      {onOpenChat && (
        <button
          onClick={onOpenChat}
          className="relative flex flex-col items-center gap-1 p-1 rounded-xl transition-all text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-300"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                {unreadChatCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">الدردشة</span>
        </button>
      )}

      {/* Doctor Portal Link */}
      <button
        onClick={() => setActivePortal('doctor')}
        className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all ${
          activePortal === 'doctor'
            ? 'text-teal-600 dark:text-teal-400 font-bold'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Stethoscope className="w-5 h-5" />
        <span className="text-[10px]">عيادة الطبيب</span>
      </button>

      {/* Admin Portal Link */}
      <button
        onClick={() => setActivePortal('admin')}
        className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all ${
          activePortal === 'admin'
            ? 'text-teal-600 dark:text-teal-400 font-bold'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        <span className="text-[10px]">الإدارة</span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={onToggleTheme}
        className="flex flex-col items-center gap-1 p-1 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
        title="تبديل الثيم الليلي/النهاري"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        <span className="text-[10px]">{theme === 'dark' ? 'نهاري' : 'ليلي'}</span>
      </button>

    </div>
  );
};
