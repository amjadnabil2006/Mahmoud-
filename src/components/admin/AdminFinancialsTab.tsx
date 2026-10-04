import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  Download, 
  Printer, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  FileText, 
  ArrowUpRight, 
  Percent, 
  Sparkles,
  Search
} from 'lucide-react';
import { Appointment, Doctor } from '../../types';

interface Props {
  appointments: Appointment[];
  doctors: Doctor[];
  onLogAudit?: (action: string, target: string) => void;
}

type DatePeriod = 'today' | 'this_week' | 'this_month' | 'this_quarter' | 'this_year' | 'custom';

export const AdminFinancialsTab: React.FC<Props> = ({ appointments, doctors, onLogAudit }) => {
  const [period, setPeriod] = useState<DatePeriod>('this_month');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-09-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-10-31');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Doctor payout records in-memory state
  const [paidDoctors, setPaidDoctors] = useState<Record<string, boolean>>({
    'doc-moayad': false,
    'doc-seham': true
  });

  // Calculate financials based on filter
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Doctor filter
      if (selectedDoctorId !== 'all' && apt.doctorId !== selectedDoctorId) return false;
      
      // Payment status filter
      if (selectedPaymentStatus === 'paid' && apt.paymentStatus !== 'مدفوع بالكامل') return false;
      if (selectedPaymentStatus === 'refunded' && apt.paymentStatus !== 'مسترد') return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDoc = apt.doctorName.toLowerCase().includes(q);
        const matchesPat = apt.patientName.toLowerCase().includes(q);
        const matchesId = apt.id.toLowerCase().includes(q);
        if (!matchesDoc && !matchesPat && !matchesId) return false;
      }

      return true;
    });
  }, [appointments, selectedDoctorId, selectedPaymentStatus, searchQuery]);

  // Overall sums
  const totalGrossRevenueSAR = useMemo(() => {
    return filteredAppointments
      .filter(a => a.paymentStatus === 'مدفوع بالكامل')
      .reduce((sum, a) => sum + (a.amountSAR || 146), 0);
  }, [filteredAppointments]);

  const totalRefundedSAR = useMemo(() => {
    return filteredAppointments
      .filter(a => a.paymentStatus === 'مسترد')
      .reduce((sum, a) => sum + (a.amountSAR || 146), 0);
  }, [filteredAppointments]);

  const totalDoctorsPayoutSAR = Math.round(totalGrossRevenueSAR * 0.75);
  const totalPlatformNetSAR = totalGrossRevenueSAR - totalDoctorsPayoutSAR;

  // Breakdown per doctor
  const doctorStats = useMemo(() => {
    return doctors.map(doc => {
      const docApts = appointments.filter(a => a.doctorId === doc.id || a.doctorName.includes(doc.name.replace('د. ', '').replace('أ. ', '')));
      const completedCount = docApts.filter(a => a.status === 'مكتمل').length;
      const upcomingCount = docApts.filter(a => a.status === 'قادم' || a.status === 'مؤكد').length;
      const canceledCount = docApts.filter(a => a.status === 'ملغي').length;
      
      const paidApts = docApts.filter(a => a.paymentStatus === 'مدفوع بالكامل');
      const grossSAR = paidApts.reduce((sum, a) => sum + (a.amountSAR || 146), 0);
      const doctorShareSAR = Math.round(grossSAR * 0.75);
      const platformShareSAR = grossSAR - doctorShareSAR;
      
      return {
        doctor: doc,
        totalApts: docApts.length,
        completedCount,
        upcomingCount,
        canceledCount,
        grossSAR,
        doctorShareSAR,
        platformShareSAR,
        isPaid: paidDoctors[doc.id] || false,
        appointmentsList: docApts
      };
    });
  }, [doctors, appointments, paidDoctors]);

  const handleTogglePayout = (docId: string, docName: string, amount: number) => {
    const isNowPaid = !paidDoctors[docId];
    setPaidDoctors(prev => ({ ...prev, [docId]: isNowPaid }));
    if (onLogAudit) {
      onLogAudit(
        isNowPaid ? `تسجيل تحويل مستحقات مالية للمعالج بمبلغ ${amount} ر.س` : `إلغاء وسم تحويل المستحقات`,
        `المعالج: ${docName}`
      );
    }
  };

  const handleExportCSV = () => {
    const headers = 'رقم الجلسة,المريض,المعالج,التاريخ,الوقت,المبلغ (ر.س),حالة الدفع,وسيلة الدفع,حصة المعالج (75%),حصة المنصة (25%)\n';
    const rows = filteredAppointments.map(a => {
      const amt = a.amountSAR || 146;
      const docShare = Math.round(amt * 0.75);
      const platShare = amt - docShare;
      return `"${a.id}","${a.patientName}","${a.doctorName}","${a.date}","${a.time}",${amt},"${a.paymentStatus}","${a.paymentMethod || 'بطاقة'}",${docShare},${platShare}`;
    }).join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `coolmind_financial_report_${period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              إدارة العائدات والمالية الشاملة (Financial & Revenue Center)
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            حساب العائدات الحية لكل معالج وللإجمالي، نسب المشاركة (75% / 25%)، وإصدار كشوفات التحويل.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            تصدير كشف CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-teal-500/20"
          >
            <Printer className="w-4 h-4" />
            طباعة الكشف الرسمي
          </button>
        </div>
      </div>

      {/* Period Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">الفترة الزمنية:</span>
          {(['today', 'this_week', 'this_month', 'this_quarter', 'this_year', 'custom'] as DatePeriod[]).map(p => {
            const labels: Record<DatePeriod, string> = {
              today: 'اليوم',
              this_week: 'هذا الأسبوع',
              this_month: 'هذا الشهر',
              this_quarter: 'هذا الربع',
              this_year: 'هذه السنة',
              custom: 'فترة مخصصة'
            };
            const isActive = period === p;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>

        {period === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">من:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={e => setCustomStartDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300"
            />
            <span className="text-slate-500">إلى:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={e => setCustomEndDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300"
            />
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-5 rounded-2xl shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between opacity-90 mb-2">
              <span className="text-xs font-semibold">إجمالي إيراد الفترة (Gross)</span>
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black tracking-tight mb-1">
              {totalGrossRevenueSAR.toLocaleString()} <span className="text-sm font-normal">ر.س</span>
            </div>
            <div className="text-xs opacity-80 flex items-center justify-between">
              <span>≈ ${(totalGrossRevenueSAR / 3.75).toFixed(0)} USD</span>
              <span>{(totalGrossRevenueSAR * 80).toLocaleString()} ر.ي</span>
            </div>
          </div>
        </div>

        {/* Doctor Share */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold">مستحقات المعالجين (75%)</span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
            {totalDoctorsPayoutSAR.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ر.س</span>
          </div>
          <p className="text-xs text-slate-500">حصة الأطباء والاستشاريين المعتمدة</p>
        </div>

        {/* Platform Net */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold">صافي دخل المنصة (25%)</span>
            <Percent className="w-5 h-5 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mb-1">
            {totalPlatformNetSAR.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ر.س</span>
          </div>
          <p className="text-xs text-slate-500">العائد التشغيلي للمنصة والتطوير</p>
        </div>

        {/* Refunds / Cancellations */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold">المبالغ المستردة (Refunds)</span>
            <AlertCircle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mb-1">
            {totalRefundedSAR.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ر.س</span>
          </div>
          <p className="text-xs text-slate-500">ضمان الرضا والإلغاء قبل 24 ساعة</p>
        </div>
      </div>

      {/* Breakdown per Doctor Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              كشف مستحقات وعائدات الكادر الطبي والمختصين (Therapists Ledger)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تفصيل عدد الجلسات، إجمالي الإيراد، حصة المعالج (75%)، وحالة صرف المستحقات.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالمعالج أو الجلسة..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 font-bold">
              <tr>
                <th className="p-3.5">المعالج / الطبيب</th>
                <th className="p-3.5 text-center">الجلسات (منفذة / قادمة)</th>
                <th className="p-3.5 text-center">إجمالي الإيراد</th>
                <th className="p-3.5 text-center">حصة المعالج (75%)</th>
                <th className="p-3.5 text-center">حصة المنصة (25%)</th>
                <th className="p-3.5 text-center">التقييم العام</th>
                <th className="p-3.5 text-center">حالة الصرف</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {doctorStats.map(stat => {
                const isExpanded = expandedDoctorId === stat.doctor.id;
                return (
                  <React.Fragment key={stat.doctor.id}>
                    <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={stat.doctor.avatar}
                            alt={stat.doctor.name}
                            className="w-9 h-9 rounded-full object-cover border border-teal-500/30"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                              {stat.doctor.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {stat.doctor.specialty} ({stat.doctor.licenseNumber || 'مرخص'})
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-center">
                        <span className="font-bold text-emerald-600">{stat.completedCount} مكتملة</span>
                        {stat.upcomingCount > 0 && (
                          <span className="text-slate-400 text-[10px] block">({stat.upcomingCount} قادمة)</span>
                        )}
                      </td>

                      <td className="p-3.5 text-center font-bold">
                        {stat.grossSAR.toLocaleString()} ر.س
                      </td>

                      <td className="p-3.5 text-center font-bold text-indigo-600 dark:text-indigo-400">
                        {stat.doctorShareSAR.toLocaleString()} ر.س
                      </td>

                      <td className="p-3.5 text-center font-semibold text-teal-600 dark:text-teal-400">
                        {stat.platformShareSAR.toLocaleString()} ر.س
                      </td>

                      <td className="p-3.5 text-center">
                        <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md font-bold text-[11px]">
                          ⭐ {stat.doctor.rating || 4.9}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        {stat.isPaid ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            تم التحويل
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full font-bold text-[11px]">
                            <Clock className="w-3.5 h-3.5" />
                            بانتظار الصرف
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleTogglePayout(stat.doctor.id, stat.doctor.name, stat.doctorShareSAR)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              stat.isPaid
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            }`}
                          >
                            {stat.isPaid ? 'إلغاء الصرف' : 'تسجيل تحويل ✓'}
                          </button>
                          <button
                            onClick={() => setExpandedDoctorId(isExpanded ? null : stat.doctor.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="عرض الجلسات"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Drill-down sessions details */}
                    {isExpanded && (
                      <tr className="bg-slate-50/50 dark:bg-slate-900/40">
                        <td colSpan={8} className="p-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                              <span>قائمة الجلسات والفواتير لـ {stat.doctor.name} ({stat.appointmentsList.length} جلسة)</span>
                              <span className="text-teal-600">نسبة الطبيب المعتمدة: 75%</span>
                            </div>

                            {stat.appointmentsList.length === 0 ? (
                              <p className="text-xs text-slate-400 text-center py-2">لا توجد جلسات مسجلة لهذا المعالج في الفترة المحددة.</p>
                            ) : (
                              <div className="space-y-1.5">
                                {stat.appointmentsList.map(apt => (
                                  <div key={apt.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                      <span className="font-mono text-slate-400 text-[11px]">{apt.id}</span>
                                      <span className="font-semibold text-slate-800 dark:text-slate-100">{apt.patientName}</span>
                                      <span className="text-slate-400 text-[11px]">{apt.date} - {apt.time}</span>
                                      <span className="text-slate-500 text-[11px]">({apt.type})</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-bold text-slate-800 dark:text-slate-200">{apt.amountSAR || 146} ر.س</span>
                                      <span className="text-indigo-600 font-semibold">حصة الطبيب: {Math.round((apt.amountSAR || 146) * 0.75)} ر.س</span>
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        apt.status === 'مكتمل' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                      }`}>
                                        {apt.status}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
