export interface PankerMetrics {
  apm: number
  durationMs: number
  totalAnswered: number
  avgTimePerAnswer: number
}

export interface TiankerMetrics {
  accuracy: number
  totalCorrect: number
  totalWrong: number
  totalChanged: number
  totalAnswered: number
  errorRate: number
}

export interface JankerMetrics {
  meanAccuracy: number
  accuracyStdDev: number
  accuracyCV: number
  meanAPM: number
  apmStdDev: number
  apmCV: number
  gridCount: number
}

export interface HankerMetrics {
  earlyPeriod: PerformancePeriod
  middlePeriod: PerformancePeriod
  latePeriod: PerformancePeriod
  accuracyDegradation: number
  speedDegradation: number
  errorRateIncrease: number
}

export interface PerformancePeriod {
  correctCount: number
  wrongCount: number
  totalAnswered: number
  accuracy: number
  apm: number
  startTime: number
  endTime: number
  durationMs: number
}
