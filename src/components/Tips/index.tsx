 import { useState, useEffect } from 'react'
 import { useTranslation } from 'react-i18next'
 import type { CyclePhase } from '@/types'
 
 interface Props {
   phase: CyclePhase
 }
 
 export default function Tips({ phase }: Props) {
   const { t, i18n } = useTranslation()
   const [trivia, setTrivia] = useState('')
 
   useEffect(() => {
     const items = t('trivia.items', { returnObjects: true }) as string[]
     if (Array.isArray(items) && items.length > 0) {
       setTrivia(items[Math.floor(Math.random() * items.length)])
     }
   }, [i18n.language, t])
 
   if (phase === 'unknown') {
     return (
       <div className="px-4 py-3">
         <div className="bg-luna-bg rounded-xl p-3 text-sm text-gray-500 text-center">
           {t('stats.noData')}
         </div>
       </div>
     )
   }
 
   return (
     <div className="px-4 py-2 space-y-2">
       <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-3 fade-in">
         <div className="flex items-center gap-2 mb-1.5">
           <span className="text-sm">📋</span>
           <span className="text-xs font-semibold text-gray-600">{t('cycle.currentPhase')}</span>
           <span className="text-xs font-bold" style={{
             color: phase === 'menstrual' ? '#E74C3C' :
                    phase === 'follicular' ? '#2ECC71' :
                    phase === 'ovulation' ? '#3498DB' : '#F39C12'
           }}>
             {t(`cycle.${phase}`)}
           </span>
         </div>
         <div className="space-y-1 text-xs text-gray-600">
           <p>🥗 {t(`tips.${phase}.diet`)}</p>
           <p>🏃 {t(`tips.${phase}.exercise`)}</p>
           <p>💪 {t(`tips.${phase}.life`)}</p>
         </div>
       </div>
 
       {trivia && (
         <div className="bg-blue-50 rounded-xl p-3 fade-in">
           <div className="flex items-start gap-2">
             <span className="text-sm">💡</span>
             <div>
               <p className="text-xs font-semibold text-gray-600 mb-0.5">{t('trivia.title')}</p>
               <p className="text-xs text-gray-500">{trivia}</p>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }
