import React, { useState } from 'react';
import { 
  Pill, 
  Plus, 
  Printer, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  User, 
  Calendar,
  Lock,
  Eye,
  AlertTriangle,
  Stethoscope
} from 'lucide-react';
import { Patient, Prescription, UserRole, StaffUser } from '../types';

interface Props {
  prescriptions: Prescription[];
  activePatient: Patient;
  onOpenNewPrescription: () => void;
  currentRole: UserRole;
  currentStaff?: StaffUser | null;
}

export const PrescriptionsView: React.FC<Props> = ({
  prescriptions,
  activePatient,
  onOpenNewPrescription,
  currentRole,
  currentStaff
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRxForPrint, setSelectedRxForPrint] = useState<Prescription | null>(null);

  const isPsychiatrist = currentRole === 'psychiatrist' || currentStaff?.role === 'psychiatrist' || currentRole === 'admin';

  const filteredRx = prescriptions.filter(rx => 
    rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rx.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rx.items.some(i => i.tradeName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                منظومة الوصفات الرقمية الرسمية
              </span>
              <span className="text-xs text-slate-400">Electronic Prescribing & Pharmacy Link</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              الوصفات الطبية النفسية المعتمدة
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              إصدار الوصفات الدوائية المشفرة برقم تسلسلي معتمد، توقيع وختم إلكتروني، وفحص التداخلات والحساسية
            </p>
          </div>

          {isPsychiatrist ? (
            <button
              onClick={onOpenNewPrescription}
              className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>إصدار وصفة جديدة للمريض</span>
            </button>
          ) : (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-amber-600" />
              <span>إصدار الوصفات مقصور على الطبيب النفسي المرخص</span>
            </div>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالدواء، التشخيص، أو اسم المريض..."
            className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
        </div>

        <span className="text-xs text-slate-400">
          إجمالي الوصفات الصادرة: <strong>{filteredRx.length}</strong>
        </span>
      </div>

      {/* Prescriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRx.map(rx => (
          <div
            key={rx.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-300 rounded-2xl p-5 shadow-2xs space-y-4 transition-all text-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-[11px] font-bold text-teal-700 dark:text-teal-400 block">
                    {rx.prescriptionNumber || rx.id}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {rx.patientName} ({rx.fileNumber})
                  </h3>
                </div>

                <div className="text-left">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                    {rx.status || 'نشطة'}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{rx.date}</div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-slate-300">
                <strong>التشخيص الإكلينيكي:</strong> {rx.diagnosis}
              </div>

              {/* Med items */}
              <div className="space-y-2">
                {rx.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="p-3 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{item.tradeName}</span>
                      <span className="text-teal-600 font-mono text-[11px]">{item.dosage}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      {item.frequency} · {item.duration}
                    </p>
                    {item.instructions && (
                      <p className="text-[10px] text-slate-400">{item.instructions}</p>
                    )}
                  </div>
                ))}
              </div>

              {rx.specialInstructions && (
                <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg">
                  <strong>تعليمات:</strong> {rx.specialInstructions}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {rx.doctorName}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {rx.licenseNumber}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRxForPrint(rx)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>معاينة وطباعة الروشتة</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Official Prescription Print Modal (OBS-D-006) */}
      {selectedRxForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-right space-y-6 shadow-2xl border border-slate-200 text-slate-900">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-teal-700 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">منصة CoolMind للاستشارات والطب النفسي</h2>
                <p className="text-xs text-slate-500">الوصفة الطبية الإلكترونية الرسمية (E-Prescription)</p>
                <p className="text-[10px] text-slate-400">اعتماد رقمي لوزارة الصحة ومطابقة المعايير السريرية</p>
              </div>

              <div className="text-left text-xs space-y-1">
                <div className="font-mono font-bold text-teal-700 text-sm">{selectedRxForPrint.prescriptionNumber || selectedRxForPrint.id}</div>
                <div>التاريخ: <strong>{selectedRxForPrint.date}</strong></div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>اسم المريض: <strong>{selectedRxForPrint.patientName}</strong></div>
              <div>العمر: <strong>{selectedRxForPrint.patientAge} سنة</strong></div>
              <div>رقم الملف الطبي: <strong className="font-mono">{selectedRxForPrint.fileNumber}</strong></div>
              <div>التشخيص الإكلينيكي: <strong>{selectedRxForPrint.diagnosis}</strong></div>
            </div>

            {/* Rx Items Table */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1">
                الأدوية الموصوفة (Rx):
              </h4>

              <div className="space-y-3">
                {selectedRxForPrint.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                      <span>{idx + 1}. {item.tradeName} ({item.genericName})</span>
                      <span className="text-teal-700 font-mono">{item.dosage}</span>
                    </div>
                    <div className="text-slate-600 mt-1">
                      الجرعة والتكرار: <strong>{item.frequency}</strong> · المدة: <strong>{item.duration}</strong>
                    </div>
                    {item.instructions && (
                      <div className="text-slate-500 text-[11px] mt-0.5">تعليمات: {item.instructions}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            {selectedRxForPrint.specialInstructions && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>تعليمات خاصة:</strong> {selectedRxForPrint.specialInstructions}
              </div>
            )}

            {/* Signatures & Stamp */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">الطبيب المصدر:</div>
                <div className="text-xs text-teal-800 font-bold mt-0.5">{selectedRxForPrint.doctorName}</div>
                <div className="text-[10px] text-slate-500 font-mono">{selectedRxForPrint.licenseNumber}</div>
              </div>

              {/* Official Stamp */}
              <div className="border-2 border-dashed border-teal-600 rounded-xl p-3 text-center w-36 text-teal-800">
                <div className="text-[10px] font-bold">ختم الصرف الرسمي</div>
                <div className="text-xs font-black tracking-widest my-0.5">COOLMIND</div>
                <div className="text-[9px] text-slate-500">VERIFIED RX</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRxForPrint(null)}
                className="px-4 py-2 text-xs text-slate-600 font-bold cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الروشتة</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
