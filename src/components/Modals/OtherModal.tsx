 import { useTranslation } from 'react-i18next'
 import type { PregnancyTest } from '@/types'
 
 const TEST_OPTIONS: PregnancyTest[] = ['pregnant', 'not_pregnant', 'unsure']
 
 interface Props {
   pregnancyTest: PregnancyTest | null
   weight: number | null
   waterCups: number | null
   reminder: string
   note: string
   onPregnancyTest: (v: PregnancyTest | null) => void
   onWeight: (v: number | null) => void
   onWaterCups: (v: number | null) => void
   onReminder: (v: string) => void
   onNote: (v: string) => void
   onClose: () => void
 }
 
 export default function OtherModal({
   pregnancyTest, weight, waterCups, reminder, note,
   onPregnancyTest, onWeight, onWaterCups, onReminder, onNote,
   onClose,
 }: Props) {
   const { t } = useTranslation()
 
   return (
     <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center">
       <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 fade-in max-h-[80vh] overflow-y-auto">
         <h3 className="text-sm font-semibold text-gray-800 mb-4">{t('dailyLog.more')}</h3>
 
         {/* Pregnancy Test */}
         <div className="mb-4">
           <p className="text-xs text-gray-500 mb-2">{t('pregnancy.test')}</p>
           <div className="flex gap-2">
             {TEST_OPTIONS.map(opt => (
               <button
                 key={opt}
                 onClick={() => onPregnancyTest(pregnancyTest === opt ? null : opt)}
                 className={`flex-1 py-2 rounded-xl text-xs transition-all ${
                   pregnancyTest === opt ? 'bg-luna-pink text-white shadow-sm' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                 }`}
               >
                 {t(`pregnancy.${opt}`)}
               </button>
             ))}
           </div>
         </div>
 
         {/* Weight */}
         <div className="mb-4">
           <p className="text-xs text-gray-500 mb-2">{t('dailyLog.weight')}</p>
           <input
             type="number"
             step="0.1"
             value={weight ?? ''}
             onChange={e => onWeight(e.target.value ? parseFloat(e.target.value) : null)}
             placeholder="--"
             className="w-full px-3 py-2 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-luna-pink"
           />
           <span className="text-xs text-gray-400 ml-1">{t('dailyLog.kg')}</span>
         </div>
 
         {/* Water intake */}
         <div className="mb-4">
           <p className="text-xs text-gray-500 mb-2">{t('dailyLog.water')}</p>
           <div className="flex items-center gap-2">
             <button
               onClick={() => onWaterCups(Math.max(0, (waterCups ?? 0) - 1))}
               className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-lg flex items-center justify-center"
             >−</button>
             <div className="flex-1 flex items-center gap-1 flex-wrap">
               {Array.from({ length: waterCups ?? 0 }).map((_, i) => (
                 <span key={i} className="text-lg">☕</span>
               ))}
               {!waterCups || waterCups === 0 ? <span className="text-xs text-gray-400">0 {t('dailyLog.cups')}</span> : null}
             </div>
             <button
               onClick={() => onWaterCups((waterCups ?? 0) + 1)}
               className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-lg flex items-center justify-center"
             >+</button>
           </div>
           {waterCups != null && waterCups > 0 && (
             <p className="text-xs text-gray-400 mt-1 text-center">
               {waterCups} {t('dailyLog.cups')} = {(waterCups * 0.25).toFixed(2)} {t('dailyLog.liters')}
             </p>
           )}
         </div>
 
         {/* Reminder */}
         <div className="mb-4">
           <p className="text-xs text-gray-500 mb-2">{t('dailyLog.reminder')}</p>
           <input
             value={reminder}
             onChange={e => onReminder(e.target.value)}
             placeholder={t('dailyLog.reminder')}
             className="w-full px-3 py-2 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-luna-pink"
           />
         </div>
 
         {/* Note */}
         <div className="mb-4">
           <p className="text-xs text-gray-500 mb-2">{t('dailyLog.note')}</p>
           <textarea
             value={note}
             onChange={e => onNote(e.target.value)}
             placeholder={t('dailyLog.note')}
             rows={2}
             className="w-full px-3 py-2 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-luna-pink resize-none"
           />
         </div>
 
         <button onClick={onClose} className="w-full py-2 text-sm bg-luna-pink text-white rounded-xl">{t('dailyLog.save')}</button>
       </div>
     </div>
   )
 }
