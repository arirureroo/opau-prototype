import {
  PerformanceLevel,
  EnduranceLevel,
  PerformanceChange,
  type AccuracyLevel,
  type SpeedLevel,
  type ConsistencyLevel,
} from '@/types/pauli.types'

export function interpretAccuracy(accuracy: number): AccuracyLevel {
  if (accuracy >= 90) return PerformanceLevel.EXCELLENT
  if (accuracy >= 80) return PerformanceLevel.GOOD
  if (accuracy >= 70) return PerformanceLevel.MODERATE
  return PerformanceLevel.POOR
}

export function getAccuracyExplanation(level: AccuracyLevel): string {
  switch (level) {
    case PerformanceLevel.EXCELLENT:
      return 'Outstanding accuracy. Very few errors made.'
    case PerformanceLevel.GOOD:
      return 'Good accuracy with minor mistakes.'
    case PerformanceLevel.MODERATE:
      return 'Moderate accuracy. Some improvement needed.'
    case PerformanceLevel.POOR:
      return 'Low accuracy. Significant improvement required.'
    default:
      return 'Unknown accuracy level.'
  }
}

export function interpretSpeed(apm: number): SpeedLevel {
  if (apm >= 35) return PerformanceLevel.EXCELLENT
  if (apm >= 25) return PerformanceLevel.GOOD
  if (apm >= 15) return PerformanceLevel.MODERATE
  return PerformanceLevel.POOR
}

export function getSpeedExplanation(level: SpeedLevel): string {
  switch (level) {
    case PerformanceLevel.EXCELLENT:
      return 'Very fast work rate. Excellent processing speed.'
    case PerformanceLevel.GOOD:
      return 'Good work tempo. Above average speed.'
    case PerformanceLevel.MODERATE:
      return 'Moderate work rate. Room for improvement.'
    case PerformanceLevel.POOR:
      return 'Slow work rate. Speed improvement needed.'
    default:
      return 'Unknown speed level.'
  }
}

export function interpretConsistencyCV(cv: number): ConsistencyLevel {
  if (cv < 5) return PerformanceLevel.EXCELLENT
  if (cv < 10) return PerformanceLevel.GOOD
  if (cv < 15) return PerformanceLevel.MODERATE
  return PerformanceLevel.POOR
}

export function getConsistencyExplanation(level: ConsistencyLevel): string {
  switch (level) {
    case PerformanceLevel.EXCELLENT:
      return 'Very stable performance across all grids. Minimal variability.'
    case PerformanceLevel.GOOD:
      return 'Consistent performance with minor fluctuations.'
    case PerformanceLevel.MODERATE:
      return 'Noticeable variability in performance across grids.'
    case PerformanceLevel.POOR:
      return 'High variability suggests inconsistent performance.'
    default:
      return 'Unknown consistency level.'
  }
}

export function interpretDegradation(degradation: number): EnduranceLevel {
  if (degradation < 5) return EnduranceLevel.EXCELLENT
  if (degradation < 10) return EnduranceLevel.GOOD
  if (degradation < 20) return EnduranceLevel.MODERATE
  return EnduranceLevel.SIGNIFICANT_FATIGUE
}

export function getEnduranceExplanation(level: EnduranceLevel): string {
  switch (level) {
    case EnduranceLevel.EXCELLENT:
      return 'Sustained performance throughout the test. No signs of fatigue.'
    case EnduranceLevel.GOOD:
      return 'Minor performance decline. Good endurance overall.'
    case EnduranceLevel.MODERATE:
      return 'Noticeable fatigue effects. Performance declined moderately.'
    case EnduranceLevel.SIGNIFICANT_FATIGUE:
      return 'Significant performance decline. Strong fatigue effects detected.'
  }
}

export function interpretPerformanceChange(degradation: number): PerformanceChange {
  if (degradation < -5) return PerformanceChange.IMPROVEMENT
  if (degradation < 5) return PerformanceChange.STABLE
  if (degradation < 10) return PerformanceChange.MINOR_DEGRADATION
  if (degradation < 20) return PerformanceChange.MODERATE_DEGRADATION
  return PerformanceChange.SIGNIFICANT_DEGRADATION
}
