 import { useTranslation } from 'react-i18next'
 import type { CycleInfo } from '@/utils/cycle'
 
 const COLORS: Record<string, string> = {
   menstrual: '#FF6B9D',
   follicular: '#2ECC71',
   ovulation: '#3498DB',
   luteal: '#F1C40F',
 }
 
 const LABEL_KEYS: Record<string, string> = {
   menstrual: 'cycle.menstrual',
   follicular: 'cycle.follicular',
   ovulation: 'cycle.ovulation',
   luteal: 'cycle.luteal',
 }
 
 interface Props {
   cycleInfo: CycleInfo
 }
 
 export default function CycleRing({ cycleInfo }: Props) {
   const { t } = useTranslation()
   const { phase, dayInPhase, phaseLengths } = cycleInfo
   const totalDays = Object.values(phaseLengths).reduce((a, b) => a + b, 0)
 
   if (totalDays === 0) {
     return (
       <div className="flex items-center justify-center p-4">
         <div className="text-center text-gray-400 text-sm">
           <div className="w-32 h-32 rounded-full border-4 border-gray-200 mx-auto mb-2 flex items-center justify-center">
             <span className="text-gray-300 text-xs">--</span>
           </div>
           <p>{t('cycle.unknown')}</p>
         </div>
       </div>
     )
   }
 
   // Calculate SVG arc parameters
   const cx = 70, cy = 70, r = 52, strokeW = 18
   const circumference = 2 * Math.PI * r
 
   const phases = ['menstrual', 'follicular', 'ovulation', 'luteal'] as const
   let offset = 0
   const arcs = phases.map(p => {
     const len = phaseLengths[p] || 0
     const ratio = len / totalDays
     const length = ratio * circumference
     const start = offset
     offset += length
     return { phase: p, length, start, ratio }
   })
 
   return (
     <div className="flex flex-col items-center py-4 ring-animate">
       <svg width="140" height="140" viewBox="0 0 140 140" className="mb-2">
         {/* Background circle */}
         <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f0f0" strokeWidth={strokeW} />
         
         {/* Phase arcs */}
         {arcs.map((arc) => {
           if (arc.ratio === 0) return null
           const dashArray = `${arc.length} ${circumference - arc.length}`
           const dashOffset = -arc.start
           const isActive = arc.phase === phase
           return (
             <circle
               key={arc.phase}
               cx={cx}
               cy={cy}
               r={r}
               fill="none"
               stroke={COLORS[arc.phase]}
               strokeWidth={isActive ? strokeW + 4 : strokeW}
               strokeDasharray={dashArray}
               strokeDashoffset={dashOffset}
               strokeLinecap="round"
               opacity={isActive ? 1 : 0.35}
               transform={`rotate(-90 ${cx} ${cy})`}
               className="transition-all duration-500"
             />
          )
         })}
 
         {/* Center text */}
         <text x={cx} y={cy - 6} textAnchor="middle" className="fill-gray-800 text-xs font-semibold" fontSize="13">
           {t(LABEL_KEYS[phase] || 'cycle.unknown')}
         </text>
         <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gray-500" fontSize="11">
           {t('cycle.day', { n: dayInPhase })}
         </text>
       </svg>
     </div>
   )
 }
