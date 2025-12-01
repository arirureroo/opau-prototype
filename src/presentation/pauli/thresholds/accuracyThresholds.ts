import { accuracyThresholds } from '@/domain/pauli/constants'
import { PerformanceLevel, type PerformanceLevelType } from '@/types/pauli.types'

export interface AccuracyThresholdDisplay {
  label: PerformanceLevelType
  min: number
  description: string
  color: string
}

export const accuracyThresholdDisplays: AccuracyThresholdDisplay[] = [
  {
    label: PerformanceLevel.EXCELLENT,
    min: accuracyThresholds.EXCELLENT_MIN,
    description: `≥ ${accuracyThresholds.EXCELLENT_MIN}%`,
    color: 'bg-emerald-500',
  },
  {
    label: PerformanceLevel.GOOD,
    min: accuracyThresholds.GOOD_MIN,
    description: `${accuracyThresholds.GOOD_MIN}-${accuracyThresholds.EXCELLENT_MIN - 1}%`,
    color: 'bg-blue-500',
  },
  {
    label: PerformanceLevel.MODERATE,
    min: accuracyThresholds.MODERATE_MIN,
    description: `${accuracyThresholds.MODERATE_MIN}-${accuracyThresholds.GOOD_MIN - 1}%`,
    color: 'bg-amber-500',
  },
  {
    label: PerformanceLevel.POOR,
    min: 0,
    description: `< ${accuracyThresholds.POOR_MAX}%`,
    color: 'bg-rose-500',
  },
]
