import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Check, 
  X, 
  Clock, 
  Video, 
  Trash2, 
  ExternalLink, 
  UserCheck, 
  Edit3,
  AlertTriangle 
} from 'lucide-react';
import { Appointment, Doctor, Patient } from '../../types';

interface Props {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  onUpdateAppointment: (id: string, updated: Partial<Appointment>) => Promise<void>;
  onDeleteAppointment: (id: string) => Promise<void>;
}

export const AdminAppointmentsTab: React.FC<Props> = ({
  appointments,
  doctors,
  patients,
  onUpdateAppointment,
  onDeleteAppointment
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  const filtered = appointments.filter(a => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.patientName.toLowerCase().includes(q) ||
      a.doctorName.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      a.date.toLowerCase().includes(q)
    );
  });

  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    await onUpdateAppointment(id, { status: newStatus });
  };

  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return;
    await onDeleteAppointment(appointmentToDelete.id);
    setAppointmentToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>إدارة المواعيد والجلسات العلاجية</span>
          </h2>
          <p className="text-xs text-slate-400">متابعة كافة الحجوزات، تأكيد أو إلغاء الجلسات، وإدارة روابط Google Meet</p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'مؤكد', label: 'مؤكدة' },
            { id: 'قيد الانتظار', label: 'قيد الانتظار' },
            { id: 'مكتمل', label: 'مكتملة' },
            { id: 'ملغى', label: 'ملغية' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                filterStatus === f.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث باسم المريض أو الطبيب أو التاريخ..."
          className="w-full pr-9 pl-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
        />
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map(apt => (
          <div
            key={apt.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                apt.status === 'مؤكد'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : apt.status === 'ملغي'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
              }`}>
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{apt.patientName}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">مع: {apt.doctorName}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{apt.date} · {apt.time}</span>
                  </span>
                  <span>{apt.type}</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">{apt.amountSAR || 350} ر.س</span>
                  {apt.meetUrl && (
                    <a
                      href={apt.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>رابط الجلسة</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Status Control */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <select
                value={apt.status}
                onChange={(e) => handleStatusChange(apt.id, e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="مؤكد">مؤكد</option>
                <option value="قيد الانتظار">قيد الانتظار</option>
                <option value="مكتمل">مكتمل</option>
                <option value="ملغى">ملغى</option>
              </select>

              <button
                onClick={() => setAppointmentToDelete(apt)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                title="حذف هذا الموعد"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            لا توجد مواعيد مطابقة لخيارات التصفية الحالية.
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {appointmentToDelete && (
        <div className="fixed inset-0 z-60 bg-slate-900/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 text-right space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              تأكيد حذف حجز الموعد
            </h3>
            <p className="text-xs text-slate-500">
              هل أنت متأكد من حذف موعد المريض {appointmentToDelete.patientName}؟ لن يتمكن المريض أو الطبيب من رؤية هذا الموعد.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAppointmentToDelete(null)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
