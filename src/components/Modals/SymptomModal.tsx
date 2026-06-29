 import { useState } from 'react'
 import { useTranslation } from 'react-i18next'
 
 const PRESETS = [
   'cramps', 'headache', 'fatigue', 'bloating',
   'breastTenderness', 'backache', 'nausea', 'insomnia',
   'increasedAppetite', 'moodSwings', 'acne', 'edema',
 ]
 
 interface Props {
   selected: string[]
   onToggle: (s: string) => void
   onClose: () => void
 }
 
 export default function SymptomModal({ selected, onToggle, onClose }: Props) {
   const { t } = useTranslation()
   const [custom, setCustom] = useState('')
   const [customSymptoms, setCustomSymptoms] = useState<string[]>([])
 
   function addCustom() {
     if (custom.trim()) {
       onToggle(custom.trim())
       setCustomSymptoms(prev => [...prev, custom.trim()])
       setCustom('')
     }
   }
 
 
   return (
     <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center">
       <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 fade-in max-h-[70vh] overflow-y-auto">
         <h3 className="text-sm font-semibold text-gray-800 mb-3">{t('symptoms.title')}</h3>
         
         {/* None button */}
         <button
           onClick={() => { onToggle(''); onClose() }}
           className={`w-full py-2 px-3 rounded-xl text-xs mb-3 ${
             selected.length === 0 ? 'bg-luna-pink text-white' : 'bg-gray-50 text-gray-500'
           }`}
         >
           {t('symptoms.none')}
         </button>
 
         {/* Preset symptoms */}
         <div className="grid grid-cols-2 gap-2 mb-3">
           {PRESETS.map(s => (
             <button
               key={s}
               onClick={() => onToggle(s)}
               className={`py-2 px-3 rounded-xl text-xs transition-all ${
                 selected.includes(s) ? 'bg-luna-pink text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
               }`}
             >
               {t(`symptoms.${s}`)}
             </button>
           ))}
         </div>
 
         {/* Custom symptom input */}
         <div className="flex gap-2 mb-3">
           <input
             value={custom}
             onChange={e => setCustom(e.target.value)}
             placeholder={t('symptoms.addCustom')}
             className="flex-1 px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-luna-pink"
           />
           <button onClick={addCustom} className="px-4 py-2 text-xs bg-luna-pink text-white rounded-xl">+</button>
         </div>
 
         {/* Custom symptoms list */}
         {customSymptoms.length > 0 && (
           <div className="flex flex-wrap gap-2 mb-2">
             {customSymptoms.map(s => (
               <span key={s} className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-lg flex items-center gap-1">
                 {s}
                 <button onClick={() => onToggle(s)} className="text-purple-400 hover:text-purple-600">×</button>
               </span>
             ))}
           </div>
         )}
 
         <button onClick={onClose} className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600">{t('dailyLog.save')}</button>
       </div>
     </div>
   )
 }
