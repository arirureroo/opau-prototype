export enum PerformanceLevel {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  MODERATE = 'Moderate',
  POOR = 'Poor',
}

export enum EnduranceLevel {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  MODERATE = 'Moderate',
  SIGNIFICANT_FATIGUE = 'Significant Fatigue',
}

export enum PerformanceChange {
  IMPROVEMENT = 'Improvement',
  STABLE = 'Stable',
  MINOR_DEGRADATION = 'Minor Degradation',
  MODERATE_DEGRADATION = 'Moderate Degradation',
  SIGNIFICANT_DEGRADATION = 'Significant Degradation',
}

export enum PauliMetricType {
  SPEED = 'speed',
  ACCURACY = 'accuracy',
  CONSISTENCY = 'consistency',
  ENDURANCE = 'endurance',
}

export type PerformanceLevelType = `${PerformanceLevel}`
export type EnduranceLevelType = `${EnduranceLevel}`
export type PerformanceChangeType = `${PerformanceChange}`
export type PauliMetricTypeType = `${PauliMetricType}`

export type AccuracyLevel = PerformanceLevelType
export type SpeedLevel = PerformanceLevelType
export type ConsistencyLevel = PerformanceLevelType
