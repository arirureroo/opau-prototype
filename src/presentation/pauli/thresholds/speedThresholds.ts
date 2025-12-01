import { speedThresholds } from '@/domain/pauli/constants'
import { PerformanceLevel, type PerformanceLevelType } from '@/types/pauli.types'

export interface SpeedThresholdDisplay {
  label: PerformanceLevelType
  min: number
  description: string
  color: string
}

export const speedThressholdDisplays: SpeedThresholdDisplay[] = [
  {
    label: PerformanceLevel.EXCELLENT,
    min: speedThresholds.EXCELLENT_MIN,
    description: `≥ ${speedThresholds.EXCELLENT_MIN} APM`,
    color: 'bg-emerald-500',
  },
  {
    label: PerformanceLevel.GOOD,
    min: speedThresholds.GOOD_MIN,
    description: `${speedThresholds.GOOD_MIN}-${speedThresholds.EXCELLENT_MIN - 1} APM`,
    color: 'bg-blue-500',
  },
  {
    label: PerformanceLevel.MODERATE,
    min: speedThresholds.MODERATE_MIN,
    description: `${speedThresholds.MODERATE_MIN}-${speedThresholds.GOOD_MIN - 1} APM`,
    color: 'bg-amber-500',
  },
  {
    label: PerformanceLevel.POOR,
    min: 0,
    description: `< ${speedThresholds.POOR_MAX} APM`,
    color: 'bg-rose-500',
  },
]
