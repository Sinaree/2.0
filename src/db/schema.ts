 import Dexie, { type Table } from 'dexie'
 import type { PeriodRecord, DailyLog, UserSettings } from '@/types'
 
 export class LunaDB extends Dexie {
   periods!: Table<PeriodRecord>
   logs!: Table<DailyLog>
   settings!: Table<UserSettings>
 
   constructor() {
     super('LunaDB')
     this.version(1).stores({
       periods: '++id, startDate',
       logs: '++id, date',
       settings: 'key',
     })
   }
 
   async getLogByDate(date: string): Promise<DailyLog | undefined> {
     return this.logs.where('date').equals(date).first()
   }
 
   async saveLog(log: DailyLog): Promise<void> {
     const existing = await this.getLogByDate(log.date)
     if (existing) {
       await this.logs.put({ ...log, id: existing.id! })
     } else {
       await this.logs.add(log)
     }
   }
 
   async getSetting(key: string): Promise<string | number | boolean | undefined> {
     const s = await this.settings.get(key)
     return s?.value
   }
 
   async setSetting(key: string, value: string | number | boolean): Promise<void> {
     await this.settings.put({ key, value })
   }
 
   async getAllPeriods(): Promise<PeriodRecord[]> {
     return this.periods.orderBy('startDate').toArray()
   }
 
   async addPeriod(period: PeriodRecord): Promise<void> {
     await this.periods.add(period)
   }
 
   async updatePeriod(id: number, period: Partial<PeriodRecord>): Promise<void> {
     await this.periods.update(id, period)
   }
 
   async deletePeriod(id: number): Promise<void> {
     await this.periods.delete(id)
   }
 
   async exportData(): Promise<string> {
     const periods = await this.periods.toArray()
     const logs = await this.logs.toArray()
     const settings = await this.settings.toArray()
     return JSON.stringify({ periods, logs, settings, version: 1 })
   }
 
   async importData(json: string): Promise<void> {
     const data = JSON.parse(json)
     if (data.version !== 1) throw new Error('Invalid format')
     await this.periods.clear()
     await this.logs.clear()
     await this.settings.clear()
     if (data.periods?.length) await this.periods.bulkAdd(data.periods)
     if (data.logs?.length) await this.logs.bulkAdd(data.logs)
     if (data.settings?.length) await this.settings.bulkAdd(data.settings)
   }
 }
 
 export const db = new LunaDB()
