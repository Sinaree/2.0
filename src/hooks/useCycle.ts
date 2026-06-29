 import { useState, useEffect, useCallback } from 'react'
 import { db } from '@/db/schema'
 import { getCycleInfo, type CycleInfo } from '@/utils/cycle'
 import type { PeriodRecord } from '@/types'
 
 export function useCycle() {
   const [periods, setPeriods] = useState<PeriodRecord[]>([])
   const [cycleInfo, setCycleInfo] = useState<CycleInfo | null>(null)
   const [loading, setLoading] = useState(true)
 
   const loadData = useCallback(async () => {
     const all = await db.getAllPeriods()
     setPeriods(all)
     if (all.length > 0) {
       setCycleInfo(getCycleInfo(new Date(), all))
     } else {
       setCycleInfo(null)
     }
     setLoading(false)
   }, [])
 
   useEffect(() => {
     loadData()
   }, [loadData])
 
   const refreshCycleInfo = useCallback(async () => {
     const all = await db.getAllPeriods()
     setPeriods(all)
     if (all.length > 0) {
       setCycleInfo(getCycleInfo(new Date(), all))
     } else {
       setCycleInfo(null)
     }
   }, [])
 
   const addPeriod = useCallback(async (startDate: string, endDate: string) => {
     await db.addPeriod({ startDate, endDate })
     await refreshCycleInfo()
   }, [refreshCycleInfo])
 
   const deletePeriod = useCallback(async (id: number) => {
     await db.deletePeriod(id)
     await refreshCycleInfo()
   }, [refreshCycleInfo])
 
   return { periods, cycleInfo, loading, addPeriod, deletePeriod, refreshCycleInfo }
 }
