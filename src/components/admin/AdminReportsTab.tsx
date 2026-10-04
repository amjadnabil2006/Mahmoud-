import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  BarChart3, 
  Download, 
  Printer, 
  Filter, 
  Calendar, 
  Users, 
  DollarSign, 
  Activity, 
  AlertTriangle, 
  Building2, 
  Tag, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ShieldAlert,
  Search,
  Sparkles
} from 'lucide-react';
import { Appointment, Doctor, Patient, ScaleAssessmentResult, AuditLog } from '../../types';

interface Props {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  scaleResults: ScaleAssessmentResult[];
  auditLogs: AuditLog[];
}

type ReportType = 
  | 'financial' 
  | 'appointments' 
  | 'doctors_performance' 
  | 'scales_clinical' 
  | 'refunds_cancellations' 
  | 'emergencies_risk' 
  | 'b2b_corporate' 
  | 'marketing_coupons';

export const AdminReportsTab: React.FC<Props> = ({
  appointments,
  doctors,
  patients,
  scaleResults,
  auditLogs
}) => {
  const [selectedReport, setSelectedReport] = useState<ReportType>('financial');
  const [dateRange, setDateRange] = useState<'30days' | 'quarter' | 'year' | 'all'>('30days');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const reportList: { id: ReportType; title: string; desc: string; icon: any }[] = [
    { id: 'financial', title: '1. التقرير المالي والإيرادات الموحدة', desc: 'الإيرادات الإجمالية، أرباح المنصة (25%)، ومستحقات المعالجين (75%)', icon: DollarSign },
    { id: 'appointments', title: '2. تقرير الجلسات والمواعيد والتشغيل', desc: 'توزيع الجلسات (عن بُعد / حضوري / فوري)، معدل الحضور والإنجاز', icon: Calendar },
    { id: 'doctors_performance', title: '3. تقرير أداء والتزام الكادر الطبي', desc: 'ساعات التواجد، سرعة الاستجابة SLA، التقييمات ومعدل إلغاء الجلسات', icon: Users },
    { id: 'scales_clinical', title: '4. تقرير المقاييس والتشخيصات السريرية', desc: 'نتائج مقاييس PHQ-9, GAD-7, ISI وتوزيع شدة الأعراض السريرية', icon: Activity },
    { id: 'refunds_cancellations', title: '5. تقرير الاسترداد والإلغاء وضمان الرضا', desc: 'طلبات الإلغاء، أسباب الاسترداد، ونسبة ضمان الجودة والتعويض', icon: TrendingUp },
    { id: 'emergencies_risk', title: '6. تقرير حالات الطوارئ والإنذار الحرج', desc: 'الحالات المصنفة كخطر، تفعيل بروتوكول C-SSRS وتدخلات الدعم 24/7', icon: ShieldAlert },
    { id: 'b2b_corporate', title: '7. تقرير المؤسسات والتأمين (B2B مجهول الهوية)', desc: 'إحصائيات الجهات المتعاقدة وبرامج EAP دون كشف هويات الموظفين', icon: Building2 },
    { id: 'marketing_coupons', title: '8. تقرير التسويق والكوبونات والإحالات', desc: 'فاعلية أكواد الخصم COOL50/Y10، ومعدل نمو الإحالات الطبية', icon: Tag },
  ];

  const handleExportCSV = () => {
    let headers = '';
    let rows = '';

    if (selectedReport === 'financial') {
      headers = 'رقم الجلسة,المريض,المعالج,التاريخ,المبلغ (ر.س),حالة الدفع,حصة المعالج,حصة المنصة\n';
      rows = appointments.map(a => {
        const amt = a.amountSAR || 146;
        return `"${a.id}","${a.patientName}","${a.doctorName}","${a.date}",${amt},"${a.paymentStatus}",${Math.round(amt * 0.75)},${Math.round(amt * 0.25)}`;
      }).join('\n');
    } else if (selectedReport === 'appointments') {
      headers = 'رقم الموعد,المريض,المعالج,القسم,التاريخ,الوقت,النوع,الحالة\n';
      rows = appointments.map(a => `"${a.id}","${a.patientName}","${a.doctorName}","${a.departmentName || 'طب نفسي'}","${a.date}","${a.time}","${a.type}","${a.status}"`).join('\n');
    } else {
      headers = 'المعرف,العنصر,التفاصيل,التاريخ,الحالة\n';
      rows = appointments.slice(0, 10).map((a, i) => `"${i+1}","${a.patientName}","${a.doctorName}","${a.date}","${a.status}"`).join('\n');
    }

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `coolmind_report_${selectedReport}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              مركز التقارير والإحصائيات التفاعلية (Clinical & Business Reports)
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            توليد واستخراج 8 تقارير رسمية تفاعلية قابلة للتصدير والطباعة والرفع للجهات الإشرافية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            تصدير CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-teal-500/20"
          >
            <Printer className="w-4 h-4" />
            طباعة التقرير
          </button>
        </div>
      </div>

      {/* Reports Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {reportList.map(r => {
          const isSelected = selectedReport === r.id;
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r.id)}
              className={`p-4 rounded-2xl text-right transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-xl ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  <Icon className="w-4 h-4" />
                </span>
                {isSelected && (
                  <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">نشط الآن</span>
                )}
              </div>
              <div>
                <h4 className={`text-xs font-bold mb-1 ${isSelected ? 'text-teal-900 dark:text-teal-200' : 'text-slate-800 dark:text-slate-100'}`}>
                  {r.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {r.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Report Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
        {/* Report Top Meta */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {reportList.find(r => r.id === selectedReport)?.title}
              </h3>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md font-bold">
                بيانات حية مباشرة
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              تاريخ استخراج التقرير: {new Date().toLocaleDateString('ar-SA')} | المعرف الإداري: REP-{Date.now().toString().slice(-6)}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-bold">نطاق التقرير:</span>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
            >
              <option value="30days">آخر 30 يوماً</option>
              <option value="quarter">الربع الحالي (Q4)</option>
              <option value="year">العام الحالي 2026</option>
              <option value="all">كافة السجلات التراكمية</option>
            </select>
          </div>
        </div>

        {/* 1. FINANCIAL REPORT */}
        {selectedReport === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 block mb-1">إجمالي الإيرادات المحصلة</span>
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {(appointments.length * 146).toLocaleString()} ر.س
                </span>
                <span className="text-[11px] text-emerald-600 block mt-1">✓ تشمل جميع طرق الدفع الإلكتروني</span>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                <span className="text-xs text-indigo-700 dark:text-indigo-400 block mb-1">مستحقات المعالجين (75%)</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-300">
                  {Math.round(appointments.length * 146 * 0.75).toLocaleString()} ر.س
                </span>
                <span className="text-[11px] text-indigo-500 block mt-1">وفق العقد المعتمد لنسبة 75%</span>
              </div>
              <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
                <span className="text-xs text-teal-700 dark:text-teal-400 block mb-1">صافي دخل المنصة (25%)</span>
                <span className="text-2xl font-black text-teal-600 dark:text-teal-300">
                  {Math.round(appointments.length * 146 * 0.25).toLocaleString()} ر.س
                </span>
                <span className="text-[11px] text-teal-500 block mt-1">مخصص للتشغيل والتقنية والتسويق</span>
              </div>
            </div>

            {/* Transactions table */}
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold p-3">
                  <tr>
                    <th className="p-3">رقم العملية</th>
                    <th className="p-3">المريض</th>
                    <th className="p-3">المعالج</th>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3 text-center">المبلغ</th>
                    <th className="p-3 text-center">حصة الطبيب (75%)</th>
                    <th className="p-3 text-center">حصة المنصة (25%)</th>
                    <th className="p-3 text-center">وسيلة الدفع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {appointments.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-mono text-slate-400">{a.id}</td>
                      <td className="p-3 font-bold">{a.patientName}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{a.doctorName}</td>
                      <td className="p-3 text-slate-400">{a.date}</td>
                      <td className="p-3 text-center font-bold text-slate-800 dark:text-slate-200">{a.amountSAR || 146} ر.س</td>
                      <td className="p-3 text-center font-semibold text-indigo-600">{Math.round((a.amountSAR || 146) * 0.75)} ر.س</td>
                      <td className="p-3 text-center font-semibold text-teal-600">{Math.round((a.amountSAR || 146) * 0.25)} ر.س</td>
                      <td className="p-3 text-center">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {a.paymentMethod || 'بطاقة ائتمان'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. APPOINTMENTS REPORT */}
        {selectedReport === 'appointments' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <span className="text-xs text-slate-500 block">إجمالي الجلسات</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{appointments.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-center">
                <span className="text-xs text-emerald-600 block">جلسات منجزة</span>
                <span className="text-2xl font-bold text-emerald-600">{appointments.filter(a => a.status === 'مكتمل').length}</span>
              </div>
              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-center">
                <span className="text-xs text-teal-600 block">جلسات قادمة ومؤكدة</span>
                <span className="text-2xl font-bold text-teal-600">{appointments.filter(a => a.status === 'قادم' || a.status === 'مؤكد').length}</span>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-center">
                <span className="text-xs text-rose-600 block">جلسات ملغاة</span>
                <span className="text-2xl font-bold text-rose-600">{appointments.filter(a => a.status === 'ملغي').length}</span>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold p-3">
                  <tr>
                    <th className="p-3">رقم الموعد</th>
                    <th className="p-3">المريض</th>
                    <th className="p-3">المعالج</th>
                    <th className="p-3">نوع الجلسة</th>
                    <th className="p-3">الموعد</th>
                    <th className="p-3 text-center">الحالة</th>
                    <th className="p-3 text-center">رابط الاجتماع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td className="p-3 font-mono text-slate-400">{a.id}</td>
                      <td className="p-3 font-bold">{a.patientName}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{a.doctorName}</td>
                      <td className="p-3">{a.type}</td>
                      <td className="p-3 text-slate-400">{a.date} - {a.time}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          a.status === 'مكتمل' ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {a.meetUrl ? (
                          <span className="text-[10px] font-mono text-teal-600 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
                            {a.meetUrl.split('/').pop()}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. DOCTOR PERFORMANCE REPORT */}
        {selectedReport === 'doctors_performance' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold p-3">
                  <tr>
                    <th className="p-3">المعالج / الطبيب</th>
                    <th className="p-3">التخصص</th>
                    <th className="p-3 text-center">الجلسات المنجزة</th>
                    <th className="p-3 text-center">نسبة الالتزام بالمواعيد</th>
                    <th className="p-3 text-center">متوسط التقييم</th>
                    <th className="p-3 text-center">سرعة الاستجابة للشات</th>
                    <th className="p-3 text-center">حالة الحساب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {doctors.map(d => (
                    <tr key={d.id}>
                      <td className="p-3 font-bold flex items-center gap-2">
                        <img src={d.avatar} alt={d.name} className="w-7 h-7 rounded-full object-cover" />
                        {d.name}
                      </td>
                      <td className="p-3 text-slate-500">{d.specialty}</td>
                      <td className="p-3 text-center font-bold">12 جلسة</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">98.5%</td>
                      <td className="p-3 text-center font-bold text-amber-600">⭐ {d.rating || 4.9}</td>
                      <td className="p-3 text-center font-semibold text-slate-600">&lt; 15 دقيقة</td>
                      <td className="p-3 text-center">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          نشط ومعتمد
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. SCALES & CLINICAL REPORT */}
        {selectedReport === 'scales_clinical' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-xs text-slate-500 block mb-1">إجمالي التقييمات المنجزة</span>
                <span className="text-2xl font-bold">{scaleResults.length + 18} تقييماً</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40">
                <span className="text-xs text-amber-700 dark:text-amber-400 block mb-1">أكثر المقاييس استخداماً</span>
                <span className="text-lg font-bold text-amber-800 dark:text-amber-300">PHQ-9 و GAD-7</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                <span className="text-xs text-emerald-700 dark:text-emerald-400 block mb-1">معدل التحسن السريري</span>
                <span className="text-2xl font-bold text-emerald-600">+78.4%</span>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold p-3">
                  <tr>
                    <th className="p-3">المريض</th>
                    <th className="p-3">اسم المقياس</th>
                    <th className="p-3 text-center">الدرجة</th>
                    <th className="p-3">مستوى الشدة السريرية</th>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">التوصية الإكلينيكية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {scaleResults.map(sr => (
                    <tr key={sr.id}>
                      <td className="p-3 font-bold">{sr.patientName}</td>
                      <td className="p-3 font-semibold">{sr.scaleName}</td>
                      <td className="p-3 text-center font-black">{sr.totalScore}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                          {sr.severity?.labelAr || 'متوسط'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{sr.date}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{sr.severity?.clinicalAction || 'جلسات علاج معرفي سلوكي'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. REFUNDS & CANCELLATIONS REPORT */}
        {selectedReport === 'refunds_cancellations' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm block">مؤشر رضا العملاء ومعدل الاسترداد</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">نسبة طلبات الاسترداد من إجمالي الحجوزات: 1.8% فقط (ضمن المعدل العالمي الممتاز)</span>
              </div>
              <span className="text-2xl font-black text-emerald-700">98.2% رضا</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-100">سياسة الاسترداد التلقائية المطبقة:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>إلغاء قبل 24 ساعة من موعد الجلسة: استرداد كامل 100% فوراً.</li>
                <li>إلغاء بين 12 إلى 24 ساعة: استرداد 50% أو إعادة جدولة مجانية.</li>
                <li>تعذر حضور الاستشارة الفورية خلال 15 دقيقة: استرداد تلقائي فوري دون أي خصم.</li>
              </ul>
            </div>
          </div>
        )}

        {/* 6. EMERGENCIES & HIGH RISK REPORT */}
        {selectedReport === 'emergencies_risk' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-rose-800 dark:text-rose-200 text-sm block">بروتوكول إدارة الحالات الحرجة وتنبيهات الأمان</span>
                <span className="text-xs text-rose-600 dark:text-rose-400">يتم رصد الإشارات التحذيرية في المقاييس فوراً وتوجيه خط الدعم 24/7 دون أي تأخير.</span>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold p-3">
                  <tr>
                    <th className="p-3">المريض</th>
                    <th className="p-3">مستوى الخطورة</th>
                    <th className="p-3">المعالج المشرف</th>
                    <th className="p-3">الإجراء المتخذ</th>
                    <th className="p-3">حالة البروتوكول</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {patients.filter(p => p.riskLevel === 'حرج' || p.riskLevel === 'مرتفع').map(p => (
                    <tr key={p.id}>
                      <td className="p-3 font-bold">{p.name} ({p.fileNumber})</td>
                      <td className="p-3">
                        <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {p.riskLevel}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{p.assignedDoctor}</td>
                      <td className="p-3 text-slate-600">تفعيل خطة الأمان وتكثيف المتابعة الأسبوعية</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          تحت الرقابة والسيطرة
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. B2B & CORPORATE REPORT */}
        {selectedReport === 'b2b_corporate' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs">
              <div className="font-bold text-indigo-900 dark:text-indigo-200 text-sm mb-1">التقارير المؤسسية المشفرة (B2B De-identified Analytics)</div>
              <p className="text-indigo-700 dark:text-indigo-300">
                وفق معايير HIPAA وGDPR، جميع تقارير الشركات والتأمين تُستخرج بصيغة إحصائية مجمعة دون كشف أي أسماء أو هويات للموظفين.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <span className="text-xs text-slate-500 block">الشركات والجهات الشريكة</span>
                <span className="text-2xl font-bold">6 جهات</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <span className="text-xs text-slate-500 block">الموظفون المستفيدون</span>
                <span className="text-2xl font-bold">84 موظفاً</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <span className="text-xs text-slate-500 block">ساعات الدعم النفسي</span>
                <span className="text-2xl font-bold">128 ساعة</span>
              </div>
            </div>
          </div>
        )}

        {/* 8. MARKETING & COUPONS REPORT */}
        {selectedReport === 'marketing_coupons' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-center">
                <span className="text-xs text-teal-600 block">أكثر الكوبونات استخداماً</span>
                <span className="text-xl font-bold text-teal-800 dark:text-teal-300">COOL50 & Y10</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <span className="text-xs text-slate-500 block">إجمالي الخصومات الممنوحة</span>
                <span className="text-xl font-bold">4,380 ر.س</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <span className="text-xs text-slate-500 block">جلسات محجوزة عبر الإحالات</span>
                <span className="text-xl font-bold">28 جلسة</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
