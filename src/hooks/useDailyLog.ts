 import { useState, useCallback } from 'react'
 import { db } from '@/db/schema'
 import type { DailyLog, Bleeding, Mood, Intercourse, PregnancyTest } from '@/types'
 import { calculatePregnancyProb } from '@/utils/pregnancy'
 import type { CyclePhase } from '@/types'
 
 const emptyLog: DailyLog = {
   date: '',
   bleeding: 'none',
   mood: '',
   symptoms: [],
   intercourse: 'none',
   pregnancyProbability: 'none',
   pregnancyTest: null,
   weight: null,
   waterCups: null,
   reminder: '',
   note: '',
 }
 
 export function useDailyLog() {
   const [currentLog, setCurrentLog] = useState<DailyLog>({ ...emptyLog })
   const [logLoaded, setLogLoaded] = useState(false)
 
   const loadLog = useCallback(async (date: string) => {
     const log = await db.getLogByDate(date)
     if (log) {
       setCurrentLog(log)
     } else {
       setCurrentLog({ ...emptyLog, date, pregnancyProbability: 'none' })
     }
     setLogLoaded(true)
   }, [])
 
   const updateBleeding = useCallback((bleeding: Bleeding) => {
     setCurrentLog(prev => ({ ...prev, bleeding }))
   }, [])
 
   const updateMood = useCallback((mood: Mood | '') => {
     setCurrentLog(prev => ({ ...prev, mood }))
   }, [])
 
   const toggleSymptom = useCallback((symptom: string) => {
     setCurrentLog(prev => {
       const has = prev.symptoms.includes(symptom)
       return {
         ...prev,
         symptoms: has ? prev.symptoms.filter(s => s !== symptom) : [...prev.symptoms, symptom],
       }
     })
   }, [])
 
   const updateIntercourse = useCallback((intercourse: Intercourse, phase: CyclePhase) => {
     const prob = calculatePregnancyProb(intercourse, phase)
     setCurrentLog(prev => ({ ...prev, intercourse, pregnancyProbability: prob }))
   }, [])
 
   const updatePregnancyTest = useCallback((test: PregnancyTest | null) => {
     setCurrentLog(prev => ({ ...prev, pregnancyTest: test }))
   }, [])
 
   const updateWeight = useCallback((weight: number | null) => {
     setCurrentLog(prev => ({ ...prev, weight }))
   }, [])
 
   const updateWaterCups = useCallback((cups: number | null) => {
     setCurrentLog(prev => ({ ...prev, waterCups: cups }))
   }, [])
 
   const updateReminder = useCallback((reminder: string) => {
     setCurrentLog(prev => ({ ...prev, reminder }))
   }, [])
 
   const updateNote = useCallback((note: string) => {
     setCurrentLog(prev => ({ ...prev, note }))
   }, [])
 
   const saveLog = useCallback(async () => {
     await db.saveLog(currentLog)
   }, [currentLog])
 
   const resetLog = useCallback(() => {
     setCurrentLog({ ...emptyLog })
     setLogLoaded(false)
   }, [])
 
   return {
     currentLog,
     logLoaded,
     loadLog,
     updateBleeding,
     updateMood,
     toggleSymptom,
     updateIntercourse,
     updatePregnancyTest,
     updateWeight,
     updateWaterCups,
     updateReminder,
     updateNote,
     saveLog,
     resetLog,
   }
 }
