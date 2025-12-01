import type { TiankerMetrics } from '../models/PauliMetrics'
import { PERCENTAGE_MULTIPLIER, MODULO_BASE } from '../constants'

export function calculateTiankerMetrics(
  totalCorrect: number,
  totalWrong: number,
  totalChanged: number,
): TiankerMetrics {
  const totalAnswered = totalCorrect + totalWrong
  const accuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * PERCENTAGE_MULTIPLIER : 0
  const errorRate = totalAnswered > 0 ? (totalWrong / totalAnswered) * PERCENTAGE_MULTIPLIER : 0

  return {
    accuracy,
    totalCorrect,
    totalWrong,
    totalChanged,
    totalAnswered,
    errorRate,
  }
}

export function calculateExpectedAnswer(num1: number, num2: number): number {
  return (num1 + num2) % MODULO_BASE
}

export function isAnswerCorrect(num1: number, num2: number, userAnswer: number): boolean {
  return userAnswer === calculateExpectedAnswer(num1, num2)
}
