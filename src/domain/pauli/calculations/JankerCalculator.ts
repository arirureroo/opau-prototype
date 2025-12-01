import type { JankerMetrics } from '../models/PauliMetrics'
import { calculateMean, calculateStandardDeviation, calculateCoefficientOfVariation } from '@/core/math/statistics'

export function calculateJankerMetrics(
  accuracies: number[],
  apms: number[]
): JankerMetrics | undefined {
  if (accuracies.length < 2) return undefined

  const meanAccuracy = calculateMean(accuracies)
  const accuracyStdDev = calculateStandardDeviation(accuracies)
  const accuracyCV = calculateCoefficientOfVariation(accuracies)

  const meanAPM = apms.length >= 2 ? calculateMean(apms) : 0
  const apmStdDev = apms.length >= 2 ? calculateStandardDeviation(apms) : 0
  const apmCV = apms.length >= 2 ? calculateCoefficientOfVariation(apms) : 0

  return {
    meanAccuracy,
    accuracyStdDev,
    accuracyCV,
    meanAPM,
    apmStdDev,
    apmCV,
    gridCount: accuracies.length
  }
}

export function extractAccuracies<T extends { accuracy?: number }>(
  gridResults: T[]
): number[] {
  return gridResults
    .map(grid => grid.accuracy)
    .filter((acc): acc is number => acc !== undefined)
}

export function extractAPMs<T extends { apm?: number }>(
  gridResults: T[]
): number[] {
  return gridResults
    .map(grid => grid.apm)
    .filter((apm): apm is number => apm !== undefined)
}
