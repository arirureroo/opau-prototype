import {
  PerformanceLevel,
  EnduranceLevel,
  PerformanceChange,
  type AccuracyLevel,
  type SpeedLevel,
  type ConsistencyLevel,
} from '@/types/pauli.types'

export function getAccuracyColor(level: AccuracyLevel): string {
  switch (level) {
    case PerformanceLevel.EXCELLENT:
      return 'text-green-600'
    case PerformanceLevel.GOOD:
      return 'text-blue-600'
    case PerformanceLevel.MODERATE:
      return 'text-yellow-600'
    case PerformanceLevel.POOR:
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export function getAccuracyBgColor(level: AccuracyLevel): string {
  switch (level) {
    case PerformanceLevel.EXCELLENT:
      return 'bg-green-100'
    case PerformanceLevel.GOOD:
      return 'bg-blue-100'
    case PerformanceLevel.MODERATE:
      return 'bg-yellow-100'
    case PerformanceLevel.POOR:
      return 'bg-red-100'
    default:
      return 'bg-gray-100'
  }
}

export function getSpeedColor(level: SpeedLevel): string {
  switch (level) {
    case PerformanceLevel.EXCELLENT:
      return 'text-green-600'
    case PerformanceLevel.GOOD:
      return 'text-blue-600'
    case PerformanceLevel.MODERATE:
      return 'text-yellow-600'
    case PerformanceLevel.POOR:
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export function getSpeedBgColor(level: SpeedLevel): string {
  switch (level) {
    case PerformanceLevel.EXCELLENT:
      return 'bg-green-100'
    case PerformanceLevel.GOOD:
      return 'bg-blue-100'
    case PerformanceLevel.MODERATE:
      return 'bg-yellow-100'
    case PerformanceLevel.POOR:
      return 'bg-red-100'
    default:
      return 'bg-gray-100'
  }
}

export function getConsistencyColor(level: ConsistencyLevel): string {
  switch (level) {
    case PerformanceLevel.EXCELLENT:
      return 'text-green-600'
    case PerformanceLevel.GOOD:
      return 'text-blue-600'
    case PerformanceLevel.MODERATE:
      return 'text-yellow-600'
    case PerformanceLevel.POOR:
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export function getConsistencyBgColor(level: ConsistencyLevel): string {
  switch (level) {
    case PerformanceLevel.EXCELLENT:
      return 'bg-green-100'
    case PerformanceLevel.GOOD:
      return 'bg-blue-100'
    case PerformanceLevel.MODERATE:
      return 'bg-yellow-100'
    case PerformanceLevel.POOR:
      return 'bg-red-100'
    default:
      return 'bg-gray-100'
  }
}

export function getEnduranceColor(level: EnduranceLevel): string {
  switch (level) {
    case EnduranceLevel.EXCELLENT:
      return 'text-green-600'
    case EnduranceLevel.GOOD:
      return 'text-blue-600'
    case EnduranceLevel.MODERATE:
      return 'text-yellow-600'
    case EnduranceLevel.SIGNIFICANT_FATIGUE:
      return 'text-red-600'
  }
}

export function getEnduranceBgColor(level: EnduranceLevel): string {
  switch (level) {
    case EnduranceLevel.EXCELLENT:
      return 'bg-green-100'
    case EnduranceLevel.GOOD:
      return 'bg-blue-100'
    case EnduranceLevel.MODERATE:
      return 'bg-yellow-100'
    case EnduranceLevel.SIGNIFICANT_FATIGUE:
      return 'bg-red-100'
  }
}

export function getPerformanceChangeColor(change: PerformanceChange): string {
  switch (change) {
    case PerformanceChange.IMPROVEMENT:
      return 'text-green-600'
    case PerformanceChange.STABLE:
      return 'text-blue-600'
    case PerformanceChange.MINOR_DEGRADATION:
      return 'text-yellow-500'
    case PerformanceChange.MODERATE_DEGRADATION:
      return 'text-orange-600'
    case PerformanceChange.SIGNIFICANT_DEGRADATION:
      return 'text-red-600'
  }
}
