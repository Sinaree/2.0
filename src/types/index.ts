 export type Bleeding = 'none' | 'light' | 'medium' | 'heavy'
 
 export type Mood = 'happy' | 'calm' | 'irritable' | 'sad' | 'anxious' | 'tired' | 'energetic'
 
 export type Intercourse = 'protected' | 'unprotected' | 'none'
 
 export type PregnancyProbability = 'none' | 'low' | 'medium' | 'high'
 
 export type PregnancyTest = 'pregnant' | 'not_pregnant' | 'unsure'
 
 export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'unknown'
 
 export interface PeriodRecord {
   id?: number
   startDate: string  // YYYY-MM-DD
   endDate: string    // YYYY-MM-DD
 }
 
 export interface DailyLog {
   id?: number
   date: string  // YYYY-MM-DD
   bleeding: Bleeding
   mood: Mood | ''
   symptoms: string[]
   intercourse: Intercourse
   pregnancyProbability: PregnancyProbability
   pregnancyTest: PregnancyTest | null
   weight: number | null
   waterCups: number | null
   reminder: string
   note: string
 }
 
 export interface UserSettings {
   key: string
   value: string | number | boolean
 }
 
 export type ViewMode = 'calendar' | 'ring'
