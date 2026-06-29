 import { useTranslation } from 'react-i18next'
 import type { Bleeding } from '@/types'
 
 const OPTIONS: Bleeding[] = ['none', 'light', 'medium', 'heavy']
 
 interface Props {
   value: Bleeding
   onSelect: (v: Bleeding) => void
   onClose: () => void
 }
 
 export default function BleedingModal({ value, onSelect, onClose }: Props) {
   const { t } = useTranslation()
   return (
     <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center">
       <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 fade-in">
         <h3 className="text-sm font-semibold text-gray-800 mb-4">{t('dailyLog.bleeding')}</h3>
         <div className="grid grid-cols-2 gap-3">
           {OPTIONS.map(opt => (
             <button
               key={opt}
               onClick={() => { onSelect(opt); onClose() }}
               className={`py-3 px-4 rounded-xl text-sm transition-all ${
                 value === opt ? 'bg-luna-pink text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
               }`}
             >
               {t(`bleeding.${opt}`)}
             </button>
           ))}
         </div>
         <button onClick={onClose} className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600">{t('dailyLog.cancel')}</button>
       </div>
     </div>
   )
 }
