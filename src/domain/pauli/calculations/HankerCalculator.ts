import type { HankerMetrics, PerformancePeriod } from '../models/PauliMetrics'
import { PERCENTAGE_MULTIPLIER, MS_PER_MINUTE } from '../constants'

export interface AnswerData {
  isCorrect: boolean
  timestamp: number
}

export function calculateHankerMetrics(allAnswers: AnswerData[]): HankerMetrics | undefined {
  if (allAnswers.length < 9) return undefined

  const { early, middle, late } = segmentAnswersByQuantile(allAnswers)

  const earlyPerformance = calculatePerformancePeriod(early)
  const middlePerformance = calculatePerformancePeriod(middle)
  const latePerformance = calculatePerformancePeriod(late)

  if (!earlyPerformance || !middlePerformance || !latePerformance) {
    return undefined
  }

  const accuracyDegradation = calculateDegradation(
    earlyPerformance.accuracy,
    latePerformance.accuracy,
  )

  const speedDegradation = calculateDegradation(earlyPerformance.apm, latePerformance.apm)

  const earlyErrorRate =
    earlyPerformance.totalAnswered > 0
      ? earlyPerformance.wrongCount / earlyPerformance.totalAnswered
      : 0
  const lateErrorRate =
    latePerformance.totalAnswered > 0
      ? latePerformance.wrongCount / latePerformance.totalAnswered
      : 0

  const errorRateIncrease =
    earlyErrorRate > 0
      ? ((lateErrorRate - earlyErrorRate) / earlyErrorRate) * PERCENTAGE_MULTIPLIER
      : 0

  return {
    earlyPeriod: earlyPerformance,
    middlePeriod: middlePerformance,
    latePeriod: latePerformance,
    accuracyDegradation,
    speedDegradation,
    errorRateIncrease,
  }
}

function segmentAnswersByQuantile(answers: AnswerData[]): {
  early: AnswerData[]
  middle: AnswerData[]
  late: AnswerData[]
} {
  const sorted = [...answers].sort((a, b) => a.timestamp - b.timestamp)
  const third = Math.floor(sorted.length / 3)

  return {
    early: sorted.slice(0, third),
    middle: sorted.slice(third, third * 2),
    late: sorted.slice(third * 2),
  }
}

function calculatePerformancePeriod(answers: AnswerData[]): PerformancePeriod | undefined {
  if (answers.length === 0) return undefined

  const correctCount = answers.filter((a) => a.isCorrect).length
  const wrongCount = answers.filter((a) => !a.isCorrect).length
  const totalAnswered = answers.length
  const accuracy = (correctCount / totalAnswered) * PERCENTAGE_MULTIPLIER

  const startTime = answers[0].timestamp
  const endTime = answers[answers.length - 1].timestamp
  const durationMs = endTime - startTime

  const apm = durationMs > 0 ? totalAnswered / (durationMs / MS_PER_MINUTE) : 0

  return {
    correctCount,
    wrongCount,
    totalAnswered,
    accuracy,
    apm,
    startTime,
    endTime,
    durationMs,
  }
}

function calculateDegradation(earlyValue: number, lateValue: number): number {
  if (earlyValue === 0) return 0
  return ((earlyValue - lateValue) / earlyValue) * PERCENTAGE_MULTIPLIER
}
