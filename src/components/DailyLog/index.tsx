 import { useState } from 'react'
 import { useTranslation } from 'react-i18next'
 import type { DailyLog as DailyLogType, CyclePhase, Bleeding, Mood, Intercourse, PeriodRecord } from '@/types'
 import BleedingModal from '@/components/Modals/BleedingModal'
 import MoodModal from '@/components/Modals/MoodModal'
 import SymptomModal from '@/components/Modals/SymptomModal'
 import IntercourseModal from '@/components/Modals/IntercourseModal'
 import OtherModal from '@/components/Modals/OtherModal'
 
 const PROB_COLORS: Record<string, string> = {
   none: 'text-green-500', low: 'text-yellow-500', medium: 'text-orange-500', high: 'text-red-500',
 }
 const PROB_EMOJIS: Record<string, string> = { none: '🟢', low: '🟡', medium: '🟠', high: '🔴' }
 
 interface Props {
   log: DailyLogType
   phase: CyclePhase
   periods: PeriodRecord[]
   onStartPeriod: (date: string) => void
   onEndPeriod: (date: string) => void
   onBleeding: (v: Bleeding) => void
   onMood: (v: Mood | '') => void
   onToggleSymptom: (s: string) => void
   onIntercourse: (v: Intercourse, p: CyclePhase) => void
   onPregnancyTest: (v: any) => void
   onWeight: (v: number | null) => void
   onWaterCups: (v: number | null) => void
   onReminder: (v: string) => void
   onNote: (v: string) => void
 }
 
 export default function DailyLog({
   log, phase,
   periods, onStartPeriod, onEndPeriod,
   onBleeding, onMood, onToggleSymptom, onIntercourse,
   onPregnancyTest, onWeight, onWaterCups, onReminder, onNote,
 }: Props) {
   const { t } = useTranslation()
   const [activeModal, setActiveModal] = useState<string | null>(null)
 
   const symptomText = log.symptoms.length > 0
     ? log.symptoms.map(s => s === '' ? t('symptoms.none') : s).join(', ')
     : t('symptoms.none')
 
   const currentPeriod = log.date
     ? periods.find(p => log.date >= p.startDate && log.date <= p.endDate)
     : undefined
   const periodStatus = currentPeriod
     ? (() => {
         const sd = new Date(currentPeriod.startDate)
         const cd = new Date(log.date)
         const day = Math.round((cd.getTime() - sd.getTime()) / 86400000) + 1
         return t('dailyLog.periodDay', { n: day })
       })()
     : t('dailyLog.periodNone')
 
   const logDate = log.date || '--'
 
   return (
     <div className="px-4 py-2">
       <div className="bg-white border border-gray-100 rounded-xl p-3 space-y-2">
         {/* Header */}
         <div className="flex justify-between items-center mb-1">
           <span className="text-xs font-semibold text-gray-600">{t('dailyLog.title')}</span>
           <span className="text-xs text-gray-400">{logDate}</span>
         </div>
 
         {/* Period section */}
         <div className="flex items-center justify-between py-2 px-3 bg-pink-50 rounded-lg mb-1">
           <div className="flex items-center gap-2">
             <span className="text-xs">🩸</span>
             <span className="text-xs text-gray-500">{t('dailyLog.period')}</span>
             <span className={`text-xs font-medium ${currentPeriod ? 'text-luna-pink' : 'text-gray-400'}`}>
               {periodStatus}
             </span>
           </div>
           <div className="flex gap-1.5">
             <button
               onClick={() => onStartPeriod(log.date)}
               className="text-xs px-2.5 py-1 rounded-lg bg-white text-luna-pink border border-luna-pink font-medium"
             >
               {t('dailyLog.startPeriod')}
             </button>
             <button
               onClick={() => onEndPeriod(log.date)}
               className="text-xs px-2.5 py-1 rounded-lg bg-white text-gray-500 border border-gray-300"
             >
               {t('dailyLog.endPeriod')}
             </button>
           </div>
         </div>
 
         {/* Bleeding */}
         <button onClick={() => setActiveModal('bleeding')} className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
           <span className="text-xs text-gray-500">{t('dailyLog.bleeding')}</span>
           <span className="text-xs text-gray-800">{t(`bleeding.${log.bleeding}`)}</span>
         </button>
 
         {/* Mood */}
         <button onClick={() => setActiveModal('mood')} className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
           <span className="text-xs text-gray-500">{t('dailyLog.mood')}</span>
           <span className="text-xs text-gray-800">{log.mood ? t(`mood.${log.mood}`) : '--'}</span>
         </button>
 
         {/* Symptoms */}
         <button onClick={() => setActiveModal('symptoms')} className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
           <span className="text-xs text-gray-500">{t('dailyLog.symptoms')}</span>
           <span className="text-xs text-gray-800 truncate max-w-[200px]">{symptomText}</span>
         </button>
 
         {/* Intercourse */}
         <button onClick={() => setActiveModal('intercourse')} className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
           <span className="text-xs text-gray-500">{t('dailyLog.intercourse')}</span>
           <span className="text-xs text-gray-800">{t(`intercourse.${log.intercourse}`)}</span>
         </button>
 
         {/* Pregnancy Probability */}
         <div className="flex justify-between items-center py-2 px-3">
           <span className="text-xs text-gray-500">{t('dailyLog.pregnancyProbability')}</span>
           <span className={`text-xs font-medium ${PROB_COLORS[log.pregnancyProbability]}`}>
             {PROB_EMOJIS[log.pregnancyProbability]} {t(`pregnancy.${log.pregnancyProbability}`)}
           </span>
         </div>
 
         {/* More button */}
         <button onClick={() => setActiveModal('other')} className="w-full py-2 text-xs text-luna-pink font-medium rounded-lg hover:bg-pink-50">
           📌 {t('dailyLog.more')}
         </button>
       </div>
 
       {/* Modals */}
       {activeModal === 'bleeding' && (
         <BleedingModal value={log.bleeding} onSelect={onBleeding} onClose={() => setActiveModal(null)} />
       )}
       {activeModal === 'mood' && (
         <MoodModal value={log.mood as Mood} onSelect={onMood} onClose={() => setActiveModal(null)} />
       )}
       {activeModal === 'symptoms' && (
         <SymptomModal selected={log.symptoms} onToggle={onToggleSymptom} onClose={() => setActiveModal(null)} />
       )}
       {activeModal === 'intercourse' && (
         <IntercourseModal
           value={log.intercourse}
           probability={log.pregnancyProbability}
           onSelect={(v) => { onIntercourse(v, phase); setActiveModal(null) }}
           onClose={() => setActiveModal(null)}
         />
       )}
       {activeModal === 'other' && (
         <OtherModal
           pregnancyTest={log.pregnancyTest}
           weight={log.weight}
           waterCups={log.waterCups}
           reminder={log.reminder}
           note={log.note}
           onPregnancyTest={onPregnancyTest}
           onWeight={onWeight}
           onWaterCups={onWaterCups}
           onReminder={onReminder}
           onNote={onNote}
           onClose={() => setActiveModal(null)}
         />
       )}
     </div>
   )
 }
