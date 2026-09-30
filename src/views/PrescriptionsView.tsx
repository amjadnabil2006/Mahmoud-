import React, { useState } from 'react';
import { 
  Pill, 
  Plus, 
  Printer, 
  Calendar, 
  FileText, 
  AlertCircle, 
  Check, 
  Stethoscope, 
  User,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { Patient, Prescription } from '../types';

interface Props {
  prescriptions: Prescription[];
  activePatient: Patient;
  onOpenNewPrescription: () => void;
}

export const PrescriptionsView: React.FC<Props> = ({
  prescriptions,
  activePatient,
  onOpenNewPrescription,
}) => {
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(prescriptions[0] || null);

  const patientPrescriptions = prescriptions.filter(rx => rx.patientId === activePatient.id);

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                إدارة الصيدلية والوصفات النفسية
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Psychiatric E-Prescription Portal</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              الوصفات الطبية النفسية المقننة
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              توثيق رسمي وإلكتروني للأدوية النفسية مع الجرعات، التكرار، موانع الاستعمال، والطباعة الرسمية.
            </p>
          </div>

          <button
            onClick={onOpenNewPrescription}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>تحرير وصفة طبية جديدة</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Prescriptions List for Active Patient & Clinic */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 transition-colors">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">الوصفات المسجلة</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">{prescriptions.length} وصفة</span>
          </div>

          <div className="space-y-2.5">
            {prescriptions.map((rx) => {
              const isSelected = selectedRx?.id === rx.id;
              const isCurrentPatient = rx.patientId === activePatient.id;

              return (
                <div
                  key={rx.id}
                  onClick={() => setSelectedRx(rx)}
                  className={`p-3.5 rounded-xl border text-right cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-400 dark:border-teal-700 shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{rx.patientName}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{rx.date}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                    التشخيص: {rx.diagnosis}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                    <span className="text-teal-800 dark:text-teal-300 font-bold">
                      {rx.items.length} أدوية مصاحبة
                    </span>
                    {isCurrentPatient && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-200 dark:bg-teal-900 text-teal-900 dark:text-teal-200 font-semibold">
                        المريض الحالي
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prescription Details & Printable Sheet Preview */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs lg:col-span-2 space-y-6 transition-colors">
          {selectedRx ? (
            <div>
              {/* Top Controls */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    معاينة الوصفة الطبية الرسمية: {selectedRx.id}
                  </span>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الوصفة (Print)</span>
                </button>
              </div>

              {/* Printable Style Sheet */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-slate-50/50 dark:bg-slate-800/40 space-y-6 text-slate-900 dark:text-slate-100">
                
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div>
                    <h2 className="font-black text-slate-900 dark:text-white text-base">عيادة CoolMind للطب النفسي المتكامل</h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400">وصفة علاجية نفسية معتمدة إلكترونياً</span>
                  </div>
                  <div className="text-left text-xs font-mono text-slate-500 dark:text-slate-400">
                    <div>التاريخ: {selectedRx.date}</div>
                    <div>الملف: {selectedRx.fileNumber}</div>
                  </div>
                </div>

                {/* Patient Summary */}
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
                  <div><strong>المريض:</strong> {selectedRx.patientName} ({selectedRx.patientAge} سنة)</div>
                  <div><strong>التشخيص:</strong> {selectedRx.diagnosis}</div>
                </div>

                {/* Rx Symbol & Medication Items */}
                <div>
                  <span className="text-2xl font-black text-teal-800 dark:text-teal-400 font-serif block mb-2">℞</span>
                  
                  <div className="space-y-3">
                    {selectedRx.items.map((item, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {idx + 1}. {item.tradeName} ({item.genericName}) - {item.dosage}
                          </span>
                          <span className="text-xs font-bold text-teal-800 dark:text-teal-400">{item.duration}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          طريقة التناول: {item.frequency}
                        </p>
                        {item.instructions && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">
                            ملاحظة: {item.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedRx.specialInstructions && (
                  <div className="bg-teal-50 dark:bg-teal-950/50 border-r-2 border-teal-600 p-3 text-xs text-teal-900 dark:text-teal-200">
                    <strong>توجيهات الاستشاري:</strong> {selectedRx.specialInstructions}
                  </div>
                )}

                {/* Doctor Stamp & Signature */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div className="text-slate-400 dark:text-slate-500 text-[11px]">
                    تم الإصدار والتوثيق عبر منصة CoolMind الآمنة
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900 dark:text-white">{selectedRx.doctorName}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">ترخيص: {selectedRx.licenseNumber}</div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              اختر وصفة من القائمة لعرض التفاصيل.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
