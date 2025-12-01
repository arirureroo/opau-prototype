import { degradationThresholds } from '@/domain/pauli/constants'
import { PerformanceLevel, type PerformanceLevelType } from '@/types/pauli.types'

export interface DegradationThresholdDisplay {
  label: PerformanceLevelType | 'Significant'
  description: string
  color: string
}

export const degradationThresholdDisplays: DegradationThresholdDisplay[] = [
  {
    label: PerformanceLevel.EXCELLENT,
    description: `< ${degradationThresholds.EXCELLENT_MAX}%`,
    color: 'bg-emerald-500',
  },
  {
    label: PerformanceLevel.GOOD,
    description: `${degradationThresholds.EXCELLENT_MAX}-${degradationThresholds.GOOD_MAX}%`,
    color: 'bg-blue-500',
  },
  {
    label: PerformanceLevel.MODERATE,
    description: `${degradationThresholds.GOOD_MAX + 1}-${degradationThresholds.MODERATE_MAX}%`,
    color: 'bg-amber-500',
  },
  {
    label: 'Significant',
    description: `≥ ${degradationThresholds.SIGNIFICANT_MIN}%`,
    color: 'bg-rose-500',
  },
]
