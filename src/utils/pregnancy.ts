 import type { Intercourse, PregnancyProbability, CyclePhase } from '@/types'
 
 export function calculatePregnancyProb(
   intercourse: Intercourse,
   phase: CyclePhase
 ): PregnancyProbability {
   if (intercourse === 'none') return 'none'
   if (intercourse === 'protected') return 'low'
   if (intercourse === 'unprotected') {
     switch (phase) {
       case 'ovulation':
         return 'high'
       case 'menstrual':
         return 'low'
       default:
         return 'medium'
     }
   }
   return 'none'
 }
