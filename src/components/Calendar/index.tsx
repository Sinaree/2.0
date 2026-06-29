 import { useState, useMemo } from 'react'
 import { useTranslation } from 'react-i18next'
 import type { PeriodRecord, CyclePhase } from '@/types'
 import { getPhaseForDateWithInfo } from '@/utils/cycle'
 
 const PHASE_COLORS: Record<CyclePhase, string> = {
   menstrual: '#E74C3C',
   follicular: '#2ECC71',
   ovulation: '#3498DB',
   luteal: '#F39C12',
   unknown: 'transparent',
 }
 
 const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
 
 interface Props {
   periods: PeriodRecord[]
   onDateClick: (date: string) => void
 }
 
 export default function Calendar({ periods, onDateClick }: Props) {
   const { t } = useTranslation()
   const today = new Date()
   const [viewYear, setViewYear] = useState(today.getFullYear())
   const [viewMonth, setViewMonth] = useState(today.getMonth())
 
   const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
   const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
 
   const days = useMemo(() => {
     const result: { date: Date; phase: CyclePhase; isPredicted: boolean }[] = []
     for (let d = 1; d <= daysInMonth; d++) {
       const date = new Date(viewYear, viewMonth, d)
       const { phase, isPredicted } = getPhaseForDateWithInfo(date, periods)
       result.push({ date, phase, isPredicted })
     }
     return result
   }, [viewYear, viewMonth, periods, daysInMonth])
 
   function prevMonth() {
     if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11) }
     else { setViewMonth(viewMonth - 1) }
   }
 
   function nextMonth() {
     if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0) }
     else { setViewMonth(viewMonth + 1) }
   }
 
   function isToday(date: Date): boolean {
     return date.getFullYear() === today.getFullYear() &&
       date.getMonth() === today.getMonth() &&
       date.getDate() === today.getDate()
   }
 
   function formatDateStr(date: Date): string {
     const y = date.getFullYear()
     const m = String(date.getMonth() + 1).padStart(2, '0')
     const d = String(date.getDate()).padStart(2, '0')
     return `${y}-${m}-${d}`
   }
 
   return (
     <div className="px-4 py-2">
       <div className="flex items-center justify-between mb-3">
         <button onClick={prevMonth} className="p-2 text-gray-500 hover:text-gray-800 transition-colors text-lg">←</button>
         <span className="font-semibold text-gray-800">{viewYear}年{viewMonth + 1}月</span>
         <button onClick={nextMonth} className="p-2 text-gray-500 hover:text-gray-800 transition-colors text-lg">→</button>
       </div>
 
       <div className="grid grid-cols-7 mb-1">
         {WEEKDAYS.map(wd => (
           <div key={wd} className="text-center text-xs text-gray-400 py-1 font-medium">{t(`calendar.${wd}`)}</div>
         ))}
       </div>
 
       <div className="grid grid-cols-7">
         {Array.from({ length: firstDayOfWeek }).map((_, i) => (
           <div key={`empty-${i}`} className="aspect-square" />
         ))}
 
         {days.map(({ date, phase, isPredicted }) => {
           const isT = isToday(date)
           const dateStr = formatDateStr(date)
           const color = isPredicted ? '#FF6B9D' : PHASE_COLORS[phase]
           const hasData = phase !== 'unknown' || isPredicted
           return (
             <button
               key={dateStr}
               onClick={() => onDateClick(dateStr)}
               className={`aspect-square flex flex-col items-center justify-center relative rounded-lg transition-colors ${isT ? 'bg-pink-50' : 'hover:bg-gray-50'}`}
             >
               <span className={`text-sm ${isT ? 'font-bold text-luna-pink' : 'text-gray-700'}`}>{date.getDate()}</span>
               {hasData && (isPredicted ? (
                 <div className="absolute inset-1 border-2 border-dashed rounded-full" style={{ borderColor: '#FF6B9D' }} />
               ) : (
                 <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: color }} />
               ))}
               {isT && !hasData && <div className="w-1.5 h-1.5 rounded-full mt-0.5 bg-gray-300" />}
             </button>
           )
         })}
       </div>
     </div>
   )
 }
