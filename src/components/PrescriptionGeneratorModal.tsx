import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Plus, 
  Trash2, 
  AlertOctagon, 
  ShieldAlert, 
  Check, 
  FileCheck2,
  Stethoscope
} from 'lucide-react';
import { Patient, Prescription, PrescriptionItem } from '../types';
import { PSYCHIATRIC_MEDS_DATA } from '../data/psychiatricMeds';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activePatient: Patient;
  onSavePrescription: (prescription: Prescription) => void;
}

export const PrescriptionGeneratorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activePatient,
  onSavePrescription,
}) => {
  const [selectedMedId, setSelectedMedId] = useState<string>(PSYCHIATRIC_MEDS_DATA[0].id);
  const [dosage, setDosage] = useState<string>('10 مجم (قرص واحد)');
  const [frequency, setFrequency] = useState<string>('مرة واحدة يومياً صباحاً بعد الطعام');
  const [duration, setDuration] = useState<string>('لمدة 30 يوماً');
  const [instructions, setInstructions] = useState<string>('الالتزام التام بالمواعيد دون انقطاع مفاجئ.');
  const [specialInstructions, setSpecialInstructions] = useState<string>('مراجعة العيادة بعد 4 أسابيع لإعادة تقييم الأعراض والتجاوب الإكلينيكي.');
  
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([
    {
      medId: PSYCHIATRIC_MEDS_DATA[0].id,
      genericName: PSYCHIATRIC_MEDS_DATA[0].genericName,
      tradeName: PSYCHIATRIC_MEDS_DATA[0].tradeNames[0],
      dosage: '10 مجم (قرص واحد)',
      frequency: 'مرة واحدة يومياً صباحاً بعد الطعام',
      duration: 'لمدة شهر (30 يوماً)',
      instructions: 'يؤخذ بانتظام، مع مراقبة التحسن بعد أسبوعين.'
    }
  ]);

  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentMed = PSYCHIATRIC_MEDS_DATA.find(m => m.id === selectedMedId) || PSYCHIATRIC_MEDS_DATA[0];

  const handleAddMed = () => {
    const newItem: PrescriptionItem = {
      medId: currentMed.id,
      genericName: currentMed.genericName,
      tradeName: currentMed.tradeNames[0],
      dosage,
      frequency,
      duration,
      instructions
    };

    setPrescriptionItems([...prescriptionItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setPrescriptionItems(prescriptionItems.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const rx: Prescription = {
      id: 'rx-' + Date.now(),
      patientId: activePatient.id,
      patientName: activePatient.name,
      patientAge: activePatient.age,
      fileNumber: activePatient.fileNumber,
      date: new Date().toISOString().split('T')[0],
      diagnosis: activePatient.primaryDiagnosis || 'اضطراب نفسي قيد المتابعة',
      items: prescriptionItems,
      specialInstructions,
      doctorName: 'د. طارق الحكيم',
      licenseNumber: 'MD-PSY-98442'
    };

    onSavePrescription(rx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-right my-8 max-h-[90vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-teal-300 font-semibold">وصفة طبية نفسية إلكترونية (E-Prescription)</span>
                <span className="text-xs text-slate-400">· المريض: <strong>{activePatient.name}</strong></span>
              </div>
              <h2 className="text-lg font-bold">تحرير وتوثيق الوصفة الدوائية النفسية</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 transition-colors cursor-pointer"
            >
              {isPreviewMode ? 'العودة للتحرير' : 'معاينة الوصفة الرسمية'}
            </button>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isPreviewMode ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-slate-100">
            
            {/* Top Patient Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block font-medium">اسم المريض</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{activePatient.name}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block font-medium">رقم الملف</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{activePatient.fileNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block font-medium">العمر / الجنس</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{activePatient.age} سنة / {activePatient.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block font-medium">التشخيص الحالي</span>
                <span className="font-bold text-teal-800 dark:text-teal-400">{activePatient.primaryDiagnosis || 'غير محدد'}</span>
              </div>
            </div>

            {/* Medication Selector & Form */}
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <span>إضافة دواء من الدليل النفسي:</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اختر الدواء النفسي:
                  </label>
                  <select
                    value={selectedMedId}
                    onChange={(e) => {
                      const m = PSYCHIATRIC_MEDS_DATA.find(item => item.id === e.target.value);
                      setSelectedMedId(e.target.value);
                      if (m) {
                        setDosage(m.startingDose);
                      }
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    {PSYCHIATRIC_MEDS_DATA.map(med => (
                      <option key={med.id} value={med.id}>
                        {med.tradeNames.join(' / ')} ({med.genericName}) - {med.classAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الجرعة والتركيز:
                  </label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="مثال: 10 مجم قرص واحد"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    التكرار وموعد التناول:
                  </label>
                  <input
                    type="text"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="مثال: مرة واحدة يومياً صباحاً بعد الإفطار"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    مدة الصرف:
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="مثال: لمدة 30 يوماً"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تعليمات وتحذيرات خاصة للمريض:
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="مثال: تجنب القيادة إذا شعرت بنعاس، وعدم التوقف المفاجئ..."
                  />
                </div>
              </div>

              {/* Drug Safety Box */}
              {currentMed.blackBoxWarning && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">تنبيه أمان سريري (FDA Black Box / Safety Warning):</span>
                    <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">{currentMed.blackBoxWarning}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleAddMed}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-2xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة الدواء إلى الوصفة</span>
                </button>
              </div>
            </div>

            {/* Current Prescription Items Table */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-2">
                الأدوية المدرجة في الوصفة الحالية ({prescriptionItems.length}):
              </h4>

              {prescriptionItems.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-400">
                  لم يتم إضافة أدوية بعد. اختر دواءً من الأعلى واضغط إضافة.
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">الدواء</th>
                        <th className="p-3">الجرعة</th>
                        <th className="p-3">التكرار والمدة</th>
                        <th className="p-3">التعليمات</th>
                        <th className="p-3 text-center">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {prescriptionItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 dark:text-white block">{item.tradeName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{item.genericName}</span>
                          </td>
                          <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{item.dosage}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">
                            <div>{item.frequency}</div>
                            <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">{item.duration}</span>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">{item.instructions}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleRemoveItem(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                              title="حذف الدواء"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* General Clinician Advice for the Prescription */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                توجيهات المتابعة الطبية والتحاليل المطلوبة:
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="توجيهات موعد الزيارة القادمة، التحاليل المخبرية (وظائف كبد/كلى/غدة)..."
              />
            </div>

          </div>
        ) : (
          /* Official Printable Prescription Sheet Preview */
          <div className="p-8 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
            <div className="bg-white max-w-2xl w-full p-8 rounded-xl shadow-lg border border-slate-300 text-slate-900 font-sans text-right relative">
              
              {/* Clinic Header */}
              <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-slate-900">عيادة CoolMind للطب النفسي والعلاج التكاملي</h1>
                  <p className="text-xs text-slate-500 mt-0.5">قسم الاستشارات النفسية والعلاج الدوائي</p>
                  <p className="text-[11px] text-slate-400">الترخيص الطبي: MOH-PSY-2026-994</p>
                </div>
                <div className="text-left font-mono text-xs text-slate-500">
                  <div className="font-bold text-teal-800 text-base">CoolMind Clinic</div>
                  <div>Tel: 920000000</div>
                  <div>Riyadh, KSA</div>
                </div>
              </div>

              {/* Patient Meta Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs mb-6">
                <div><strong>اسم المريض:</strong> {activePatient.name}</div>
                <div><strong>التاريخ:</strong> {new Date().toLocaleDateString('ar-EG')}</div>
                <div><strong>رقم الملف:</strong> {activePatient.fileNumber}</div>
                <div><strong>العمر / الجنس:</strong> {activePatient.age} سنة / {activePatient.gender}</div>
                <div className="col-span-2"><strong>التشخيص الطبي:</strong> {activePatient.primaryDiagnosis}</div>
              </div>

              {/* Rx Symbol & Medication List */}
              <div className="mb-8">
                <div className="text-3xl font-black text-teal-800 font-serif mb-4">℞</div>
                
                <div className="space-y-4">
                  {prescriptionItems.map((item, idx) => (
                    <div key={idx} className="border-b border-dashed border-slate-200 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          {idx + 1}. {item.tradeName} ({item.genericName}) - {item.dosage}
                        </span>
                        <span className="text-xs font-semibold text-teal-800">{item.duration}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 mr-4">
                        الجرعة: {item.frequency}
                      </p>
                      {item.instructions && (
                        <p className="text-[11px] text-slate-500 mt-0.5 mr-4 italic">
                          ملاحظة: {item.instructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Notes */}
              {specialInstructions && (
                <div className="bg-teal-50/50 border-r-2 border-teal-600 p-2.5 text-xs text-teal-950 mb-8">
                  <strong>تعليمات الاستشاري:</strong> {specialInstructions}
                </div>
              )}

              {/* Doctor Signature & Stamp */}
              <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
                <div>
                  <div className="w-24 h-24 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                    ختم العيادة الرسمي
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900">د. طارق الحكيم</div>
                  <div className="text-slate-500 text-[11px]">استشاري الطب النفسي والعلاج المعرفي</div>
                  <div className="text-slate-400 font-mono text-[10px]">Lic: MD-PSY-98442</div>
                  <div className="mt-2 font-cursive text-teal-800 text-lg">T. Al-Hakim, MD</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {prescriptionItems.length} أدوية مسجلة في الوصفة
          </div>

          <div className="flex items-center gap-2">
            {isPreviewMode && (
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 rounded-xl transition-colors shadow-2xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الوصفة (Print)</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={prescriptionItems.length === 0}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>اعتماد الوصفة وحفظها في السجل</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
