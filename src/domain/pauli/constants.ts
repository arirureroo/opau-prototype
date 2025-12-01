export const MS_PER_MINUTE = 60_000

export const PERCENTAGE_MULTIPLIER = 100
export const MODULO_BASE = 10

// Panker (Speed) thresholds - Additions Per Minute (APM)
export const speedThresholds = {
  EXCELLENT_MIN: 35,
  GOOD_MIN: 25,
  MODERATE_MIN: 15,
  POOR_MAX: 15,
} as const

// Tianker (Accuracy) thresholds - Percentage
export const accuracyThresholds = {
  EXCELLENT_MIN: 90,
  GOOD_MIN: 80,
  MODERATE_MIN: 70,
  POOR_MAX: 70,
} as const

// Hanker (Endurance) degradation thresholds - Percentage change
export const degradationThresholds = {
  EXCELLENT_MAX: 5,
  GOOD_MAX: 9,
  MODERATE_MAX: 19,
  SIGNIFICANT_MIN: 20,
} as const

// Janker (Consistency) threshold - Standard deviation percentage
export const consistencyThreshold = {
  SIGNIFICANT_ERROR_RATE: 20,
} as const
