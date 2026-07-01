import { useCallback, useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { ViewMode } from '@/types'
import { useCycle } from '@/hooks/useCycle'
import { useDailyLog } from '@/hooks/useDailyLog'

import ViewToggle from '@/components/ViewToggle'
import Calendar from '@/components/Calendar'
import CycleRing from '@/components/CycleRing'
import Tips from '@/components/Tips'
import DailyLog from '@/components/DailyLog'
import LanguageSwitch from '@/components/Language'
import Layout from '@/components/Layout'
import { db } from '@/db/schema'

export default function App() {
  const { t } = useTranslation()
  const { periods, cycleInfo, addPeriod, deletePeriod } = useCycle()
  const {
    currentLog, loadLog,
    updateBleeding, updateMood, updateIntercourse, toggleSymptom,
    updatePregnancyTest, updateWeight, updateWaterCups, updateReminder, updateNote,
    saveLog,
  } = useDailyLog()

  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [activeTab, setActiveTab] = useState('home')
  const [selectedDate, setSelectedDate] = useState('')
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-save when log changes (debounced)
  useEffect(() => {
    if (currentLog.date && currentLog.date === selectedDate) {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        saveLog()
      }, 1000)
    }
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current) }
  }, [currentLog, saveLog, selectedDate])

  const handleDateClick = useCallback(async (date: string) => {
    setSelectedDate(date)
    await loadLog(date)
    setActiveTab('home')
  }, [loadLog])


  const handleStartPeriod = useCallback(async (date: string) => {
    await addPeriod(date, date)
  }, [addPeriod])

  const handleEndPeriod = useCallback(async (date: string) => {
    const sorted = [...periods].sort((a, b) => b.startDate.localeCompare(a.startDate))
    const ongoing = sorted.find(p => p.startDate === p.endDate)
    if (ongoing && ongoing.id != null) {
      await deletePeriod(ongoing.id)
      await addPeriod(ongoing.startDate, date)
    }
  }, [periods, deletePeriod, addPeriod])

  const currentPhase = cycleInfo?.phase || 'unknown'

  // Main home page content (calendar + daily log)
  const homeContent = (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-gray-800">{t('app.name')}</h1>
        <LanguageSwitch />
      </div>

      {/* View toggle */}
      <ViewToggle mode={viewMode} onChange={setViewMode} />

      {/* Main display: ring or calendar */}
      {viewMode === 'ring' ? (
        cycleInfo ? <CycleRing cycleInfo={cycleInfo} /> : (
          <div className="text-center py-8 text-gray-400 text-sm">{t('stats.noData')}</div>
        )
      ) : (
        <Calendar periods={periods} onDateClick={handleDateClick} />
      )}

      {/* Cold knowledge + Phase tips */}
      <Tips phase={currentPhase} />

      {/* Daily Log section */}
      {currentLog.date && (
        <DailyLog
          log={currentLog}
          phase={currentPhase}
          periods={periods}
          onStartPeriod={handleStartPeriod}
          onEndPeriod={handleEndPeriod}
          onBleeding={updateBleeding}
          onMood={updateMood}
          onToggleSymptom={toggleSymptom}
          onIntercourse={updateIntercourse}
          onPregnancyTest={updatePregnancyTest}
          onWeight={updateWeight}
          onWaterCups={updateWaterCups}
          onReminder={updateReminder}
          onNote={updateNote}
        />
      )}
    </div>
  )

  // Calendar page (browse all recorded periods in calendar view)
  const calendarPageContent = (
    <div className="pb-20 px-4 py-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{t('nav.calendar')}</h2>
      <Calendar periods={periods} onDateClick={handleDateClick} />
      {currentLog.date && (
        <DailyLog
          log={currentLog}
          phase={currentPhase}
          periods={periods}
          onStartPeriod={handleStartPeriod}
          onEndPeriod={handleEndPeriod}
          onBleeding={updateBleeding}
          onMood={updateMood}
          onToggleSymptom={toggleSymptom}
          onIntercourse={updateIntercourse}
          onPregnancyTest={updatePregnancyTest}
          onWeight={updateWeight}
          onWaterCups={updateWaterCups}
          onReminder={updateReminder}
          onNote={updateNote}
        />
      )}
    </div>
  )

  // Stats page
  const statsContent = (
    <div className="pb-20 px-4 py-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{t('stats.title')}</h2>
      {periods.length < 2 ? (
        <p className="text-sm text-gray-400">{t('stats.noData')}</p>
      ) : (
        <div className="space-y-3">
          <div className="bg-luna-bg rounded-xl p-4">
            <p className="text-xs text-gray-500">{t('stats.avgCycleLength')}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {cycleInfo ? getAvgCycle(periods) : '--'} {t('stats.days')}
            </p>
          </div>
          <div className="bg-luna-bg rounded-xl p-4">
            <p className="text-xs text-gray-500">{t('stats.avgPeriodLength')}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {periods.length > 0 ? getAvgPeriod(periods) : '--'} {t('stats.days')}
            </p>
          </div>
        </div>
      )}
    </div>
  )

  // Settings page
  const settingsContent = (
    <div className="pb-20 px-4 py-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{t('settings.title')}</h2>
      <div className="space-y-3">
        {/* Language */}
        <div className="bg-luna-bg rounded-xl p-4 flex justify-between items-center">
          <span className="text-sm text-gray-700">{t('settings.language')}</span>
          <LanguageSwitch />
        </div>

        {/* View mode preference */}
        <div className="bg-luna-bg rounded-xl p-4">
          <p className="text-sm text-gray-700 mb-2">{t('settings.defaultView')}</p>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>

        {/* Export */}
        <button onClick={handleExport} className="w-full bg-luna-bg rounded-xl p-4 text-left hover:bg-gray-100">
          <p className="text-sm text-gray-700 font-medium">{t('settings.exportData')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('settings.exportDesc')}</p>
        </button>

        {/* Import */}
        <label className="block bg-luna-bg rounded-xl p-4 text-left cursor-pointer hover:bg-gray-100">
          <p className="text-sm text-gray-700 font-medium">{t('settings.importData')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('settings.importDesc')}</p>
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>

        {/* About */}
        <div className="bg-luna-bg rounded-xl p-4">
          <p className="text-sm text-gray-700">{t('settings.about')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('app.name')} v1.0.0</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {activeTab === 'home' && homeContent}
      {activeTab === 'calendar' && calendarPageContent}
      {activeTab === 'stats' && statsContent}
      {activeTab === 'settings' && settingsContent}
      <Layout activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

// Helper functions
function getAvgCycle(periods: any[]): number {
  if (periods.length < 2) return 28
  const sorted = [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate))
  let total = 0, count = 0
  for (let i = 1; i < sorted.length; i++) {
    const d1 = new Date(sorted[i-1].startDate)
    const d2 = new Date(sorted[i].startDate)
    const diff = Math.round((d2.getTime() - d1.getTime()) / 86400000)
    if (diff >= 21 && diff <= 45) { total += diff; count++ }
  }
  return count > 0 ? Math.round(total / count) : 28
}

function getAvgPeriod(periods: any[]): number {
  const total = periods.reduce((sum: number, p: any) => {
    const d1 = new Date(p.startDate), d2 = new Date(p.endDate)
    return sum + Math.round((d2.getTime() - d1.getTime()) / 86400000) + 1
  }, 0)
  return Math.round(total / periods.length)
}

async function handleExport() {
  const data = await db.exportData()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `luna-data-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const text = await file.text()
    await db.importData(text)
    alert('Data imported successfully!')
    window.location.reload()
  } catch {
    alert('Import failed. Invalid file format.')
  }
}
