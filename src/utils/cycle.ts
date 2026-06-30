import type { PeriodRecord, CyclePhase } from '@/types'

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Calculate average cycle length from period records */
export function averageCycleLength(periods: PeriodRecord[]): number {
  if (periods.length < 2) return 28
  const sorted = [...periods].sort((a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime())
  let total = 0
  let count = 0
  for (let i = 1; i < sorted.length; i++) {
    const diff = daysBetween(parseDate(sorted[i - 1].startDate), parseDate(sorted[i].startDate))
    if (diff >= 21 && diff <= 45) {
      total += diff
      count++
    }
  }
  return count > 0 ? Math.round(total / count) : 28
}

/** Calculate average period length */
export function averagePeriodLength(periods: PeriodRecord[]): number {
  if (periods.length === 0) return 5
  const total = periods.reduce((sum, p) => sum + daysBetween(parseDate(p.startDate), parseDate(p.endDate)) + 1, 0)
  return Math.round(total / periods.length)
}

export interface CycleInfo {
  phase: CyclePhase
  dayInPhase: number
  ovulationDate: string | null
  predictedNextPeriod: string | null
  phaseDays: {
    menstrual: [string, string] | null
    follicular: [string, string] | null
    ovulation: [string, string] | null
    luteal: [string, string] | null
  }
  // For the ring: each phase's start/end and length
  phaseLengths: Record<CyclePhase, number>
}

export function getCycleInfo(date: Date, periods: PeriodRecord[]): CycleInfo {
  const dateStr = formatDate(date)
  const sorted = [...periods].sort((a, b) => parseDate(b.startDate).getTime() - parseDate(a.startDate).getTime())
  const avgCycle = averageCycleLength(sorted)

  const defaultInfo: CycleInfo = {
    phase: 'unknown',
    dayInPhase: 0,
    ovulationDate: null,
    predictedNextPeriod: null,
    phaseDays: {
      menstrual: null,
      follicular: null,
      ovulation: null,
      luteal: null,
    },
    phaseLengths: {
      menstrual: 0,
      follicular: 0,
      ovulation: 0,
      luteal: 0,
      unknown: 0,
    },
  }

  if (sorted.length === 0) return defaultInfo

  // Find current or most recent period
  const currentPeriod = sorted.find(p => dateStr >= p.startDate && dateStr <= p.endDate)
  const recentPeriod = sorted[0]
  if (!currentPeriod && !recentPeriod) return defaultInfo
  const period = currentPeriod || recentPeriod
  const periodStart = parseDate(period.startDate)
  const periodEnd = parseDate(period.endDate)
  const periodLen = daysBetween(periodStart, periodEnd) + 1

  // Calculate phase boundaries
  const menstrualEnd = periodEnd
  const ovulationDay = addDays(periodStart, avgCycle - 14)
  const ovulationStart = addDays(ovulationDay, -5)
  const ovulationEnd = addDays(ovulationDay, 1)
  const nextPeriodStart = addDays(periodStart, avgCycle)

  // Follicular: from day after menstrual end to day before ovulation start
  const follicularStart = addDays(menstrualEnd, 1)
  const follicularEnd = addDays(ovulationStart, -1)

  // Luteal: from day after ovulation end to day before next period
  const lutealStart = addDays(ovulationEnd, 1)
  const lutealEnd = addDays(nextPeriodStart, -1)

  const dateDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  function inRange(start: Date, end: Date): boolean {
    return dateDate >= start && dateDate <= end
  }

  function daysSince(start: Date): number {
    return daysBetween(start, dateDate) + 1
  }

  let phase: CyclePhase = 'unknown'
  let dayInPhase = 0

  if (currentPeriod || inRange(periodStart, menstrualEnd)) {
    phase = 'menstrual'
    dayInPhase = daysSince(periodStart)
  } else if (inRange(follicularStart, follicularEnd)) {
    phase = 'follicular'
    dayInPhase = daysSince(follicularStart)
  } else if (inRange(ovulationStart, ovulationEnd)) {
    phase = 'ovulation'
    dayInPhase = daysSince(ovulationStart)
  } else if (inRange(lutealStart, lutealEnd)) {
    phase = 'luteal'
    dayInPhase = daysSince(lutealStart)
  }

  // Phase lengths for the ring
  const phaseLengths: Record<CyclePhase, number> = {
    menstrual: periodLen,
    follicular: daysBetween(follicularStart, follicularEnd) + 1,
    ovulation: 7,
    luteal: daysBetween(lutealStart, lutealEnd) + 1,
    unknown: 0,
  }

  return {
    phase,
    dayInPhase,
    ovulationDate: formatDate(ovulationDay),
    predictedNextPeriod: sorted.length >= 1 ? formatDate(nextPeriodStart) : null,
    phaseDays: {
      menstrual: [period.startDate, period.endDate],
      follicular: [formatDate(follicularStart), formatDate(follicularEnd)],
      ovulation: [formatDate(ovulationStart), formatDate(ovulationEnd)],
      luteal: [formatDate(lutealStart), formatDate(lutealEnd)],
    },
    phaseLengths,
  }
}

/** Get the phase for a specific date */
export function getPhaseForDate(date: Date, periods: PeriodRecord[]): CyclePhase {
  return getCycleInfo(date, periods).phase
}

/** Check if a date is in the predicted period range */
export function isPredictedPeriod(date: Date, cycleInfo: CycleInfo): boolean {
  if (!cycleInfo.predictedNextPeriod) return false
  const predicted = parseDate(cycleInfo.predictedNextPeriod)
  const avgPeriod = 5 // assume 5 days
  const predictedEnd = addDays(predicted, avgPeriod - 1)
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  if (d >= predicted && d <= predictedEnd) return true
  // Also check next predicted if we have enough data
  return false
}

export function getPhaseForDateWithInfo(date: Date, periods: PeriodRecord[]): { phase: CyclePhase; isPredicted: boolean; cycleInfo: CycleInfo } {
  const cycleInfo = getCycleInfo(date, periods)
  const isPredicted = isPredictedPeriod(date, cycleInfo)
  return { phase: cycleInfo.phase, isPredicted, cycleInfo }
}
