import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DailyLog as DailyLogType, CyclePhase, Bleeding, Mood, Intercourse, PeriodRecord } from '@/types'
import BleedingModal from '@/components/Modals/BleedingModal'
import MoodModal from '@/components/Modals/MoodModal'
import SymptomModal from '@/components/Modals/SymptomModal'
import IntercourseModal from '@/components/Modals/IntercourseModal'
import OtherModal from '@/components/Modals/OtherModal'

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
  const isInPeriod = currentPeriod !== undefined
  const periodStatus = isInPeriod
    ? (() => {
        const sd = new Date(currentPeriod.startDate)
        const cd = new Date(log.date)
        const day = Math.round((cd.getTime() - sd.getTime()) / 86400000) + 1
        return t('dailyLog.periodDay', { n: day })
      })()
    : t('dailyLog.periodNone')

  const logDate = log.date || '--'

  const handlePeriodToggle = (checked: boolean) => {
    if (checked) {
      onStartPeriod(log.date)
    } else {
      onEndPeriod(log.date)
    }
  }

  return (
    <div className="px-4 py-2">
      <div className="bg-white border border-gray-100 rounded-xl p-3 space-y-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-gray-600">{t('dailyLog.title')}</span>
          <span className="text-xs text-gray-400">{logDate}</span>
        </div>

        {/* Period section - toggle switch */}
        <div className="flex items-center justify-between py-2 px-3 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{t('dailyLog.period')}</span>
            <span className={`text-xs ${isInPeriod ? 'text-luna-pink font-medium' : 'text-gray-400'}`}>
              {periodStatus}
            </span>
          </div>
          <button
            role="switch"
            aria-checked={isInPeriod}
            onClick={() => handlePeriodToggle(!isInPeriod)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              isInPeriod ? 'bg-luna-pink' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              isInPeriod ? 'translate-x-[18px]' : 'translate-x-[3px]'
            }`} />
          </button>
        </div>

        {/* Bleeding - only show during menstrual phase */}
        {phase === 'menstrual' && (
          <button onClick={() => setActiveModal('bleeding')} className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
            <span className="text-xs text-gray-500">{t('dailyLog.bleeding')}</span>
            <span className="text-xs text-gray-800">{t(`bleeding.${log.bleeding}`)}</span>
          </button>
        )}

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

        {/* More button */}
        <button onClick={() => setActiveModal('other')} className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50">
          <span className="text-xs text-gray-500">{t('dailyLog.more')}</span>
          <span className="text-xs text-gray-800">▸</span>
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
