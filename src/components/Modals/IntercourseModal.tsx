 import { useTranslation } from 'react-i18next'
 import type { Intercourse, PregnancyProbability } from '@/types'
 
 const OPTIONS: Intercourse[] = ['none', 'protected', 'unprotected']
 
 const PROB_COLORS: Record<PregnancyProbability, string> = {
   none: 'bg-green-100 text-green-700',
   low: 'bg-yellow-100 text-yellow-700',
   medium: 'bg-orange-100 text-orange-700',
   high: 'bg-red-100 text-red-700',
 }
 
 const PROB_EMOJIS: Record<PregnancyProbability, string> = {
   none: '🟢', low: '🟡', medium: '🟠', high: '🔴',
 }
 
 interface Props {
   value: Intercourse
   probability: PregnancyProbability
   onSelect: (v: Intercourse) => void
   onClose: () => void
 }
 
 export default function IntercourseModal({ value, probability, onSelect, onClose }: Props) {
   const { t } = useTranslation()
   return (
     <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center">
       <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 fade-in">
         <h3 className="text-sm font-semibold text-gray-800 mb-4">{t('dailyLog.intercourse')}</h3>
         <div className="space-y-2 mb-4">
           {OPTIONS.map(opt => (
             <button
               key={opt}
               onClick={() => onSelect(opt)}
               className={`w-full py-3 px-4 rounded-xl text-sm transition-all ${
                 value === opt ? 'bg-luna-pink text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
               }`}
             >
               {t(`intercourse.${opt}`)}
             </button>
           ))}
         </div>
 
         {/* Pregnancy probability display */}
         <div className={`rounded-xl p-3 text-xs text-center font-medium ${PROB_COLORS[probability]}`}>
           {PROB_EMOJIS[probability]} {t('dailyLog.pregnancyProbability')}: {t(`pregnancy.${probability}`)}
         </div>
 
         <button onClick={onClose} className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600">{t('dailyLog.save')}</button>
       </div>
     </div>
   )
 }
