 import { useTranslation } from 'react-i18next'
 import type { ViewMode } from '@/types'
 
 interface Props {
   mode: ViewMode
   onChange: (mode: ViewMode) => void
 }
 
 export default function ViewToggle({ mode, onChange }: Props) {
   const { t } = useTranslation()
   return (
     <div className="flex bg-gray-100 rounded-full p-0.5 mx-4 mb-2">
       <button
         onClick={() => onChange('ring')}
         className={`flex-1 py-1.5 text-xs rounded-full transition-all ${
           mode === 'ring' ? 'bg-white shadow-sm font-medium text-luna-pink' : 'text-gray-500'
         }`}
       >
         🔵 {t('calendar.ringView')}
       </button>
       <button
         onClick={() => onChange('calendar')}
         className={`flex-1 py-1.5 text-xs rounded-full transition-all ${
           mode === 'calendar' ? 'bg-white shadow-sm font-medium text-luna-pink' : 'text-gray-500'
         }`}
       >
         📅 {t('calendar.calendarView')}
       </button>
     </div>
   )
 }
