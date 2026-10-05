import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Stethoscope, 
  ChevronLeft,
  Clock,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';
import { Doctor } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
}

export const SelectDoctorChatModal: React.FC<Props> = ({
  isOpen,
  onClose,
  doctors,
  onSelectDoctor
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const specialties = useMemo(() => {
    const list = Array.from(new Set(doctors.map(d => d.specialty || d.title))).filter(Boolean);
    return ['all', ...list];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.title && doc.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.bio && doc.bio.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSpecialty = 
        selectedSpecialty === 'all' || 
        doc.specialty === selectedSpecialty || 
        doc.title === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchQuery, selectedSpecialty]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md transition-opacity animate-fadeIn text-right"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-xl bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-[32px] border-t sm:border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="pt-3 pb-1 flex justify-center shrink-0 sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-teal-200 flex items-center justify-center border border-white/15 shadow-inner">
              <MessageSquare className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg">اختر الطبيب لبدء المحادثة</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                  دخول فوري
                </span>
              </div>
              <p className="text-xs text-teal-100/80 mt-0.5">
                انقر على أي طبيب للبدء في الدردشة المشفرة فوراً
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            className="p-2 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 space-y-3 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الطبيب، التخصص (CBT، استشاري، قلق، نوم...)"
              className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Specialties Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setSelectedSpecialty('all')}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedSpecialty === 'all'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              جميع التخصصات ({doctors.length})
            </button>
            {specialties.filter(s => s !== 'all').map((spec, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition cursor-pointer truncate max-w-[180px] ${
                  selectedSpecialty === spec
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-slate-400">
              <Stethoscope className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 opacity-60" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">لم يتم العثور على أطباء مطابقين للبحث</p>
              <p className="text-xs">جرب البحث بكلمات أخرى أو اختر "جميع التخصصات".</p>
            </div>
          ) : (
            filteredDoctors.map(doctor => (
              <div
                key={doctor.id}
                onClick={() => onSelectDoctor(doctor)}
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-teal-50/70 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 hover:border-teal-500/60 dark:hover:border-teal-500/60 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-2xs hover:shadow-md"
              >
                {/* Doctor Avatar and Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img 
                      src={doctor.avatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80'} 
                      alt={doctor.name}
                      className="w-13 h-13 rounded-2xl object-cover border-2 border-teal-500/30 group-hover:border-teal-600 transition shadow-xs"
                    />
                    {/* Live Online Dot */}
                    <span 
                      className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center shadow-xs"
                      title="متصل ومتاح الآن"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition truncate">
                        {doctor.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                        {doctor.specialty}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {doctor.title || 'استشاري الطب النفسي والرعاية المتكاملة'}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{doctor.rating || 4.9}</span>
                        <span className="text-slate-400 font-normal">({doctor.reviewsCount || 45})</span>
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Zap className="w-3 h-3" />
                        <span>رد فوري ~10 دقائق</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="shrink-0 flex items-center gap-2">
                  <div className="hidden sm:flex flex-col items-end text-left">
                    <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 group-hover:underline flex items-center gap-1">
                      <span>بدء الدردشة</span>
                      <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">مشفر طبياً</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-teal-600 group-hover:bg-teal-700 text-white flex items-center justify-center transition shadow-xs group-hover:scale-105">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 text-center shrink-0">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>جميع المحادثات مشفرة تماماً بتشفير 256-Bit SSL وتخضع لسرية HIPAA.</span>
          </p>
        </div>

      </div>
    </div>
  );
};
