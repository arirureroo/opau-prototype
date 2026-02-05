import { ref, computed } from 'vue'
import { testHistoryApi } from '@/services/testHistoryApi'
import type { StoredTestResult } from '@/infrastructure/database/TestResultRepository'
import { Mode } from '@/types/test.types'
import { interpretAccuracy, interpretSpeed } from '@/domain/pauli/interpretations/PauliInterpreter'
import { PerformanceLevel, EnduranceLevel } from '@/types/pauli.types'

export interface PerformanceTrendPoint {
  date: number
  accuracy: number
  apm: number
  testId: string
  mode: Mode
}

export interface BestRecord {
  value: number
  testId: string
  date: number
  mode: Mode
}

export interface PerformanceDistribution {
  excellent: number
  good: number
  moderate: number
  poor: number
}

export interface ModeStats {
  totalTests: number
  avgAccuracy: number
  avgAPM: number
  bestAccuracy: number
  bestAPM: number
}

export interface PerformanceStats {
  totalTests: number
  totalAnswered: number
  totalCorrect: number
  totalWrong: number
  avgAccuracy: number
  avgAPM: number
  avgConsistency: number
  avgEndurance: number
  bestAccuracy: BestRecord | null
  bestAPM: BestRecord | null
  worstAccuracy: BestRecord | null
  worstAPM: BestRecord | null
  accuracyDistribution: PerformanceDistribution
  speedDistribution: PerformanceDistribution
  rankedStats: ModeStats
  practiceStats: ModeStats
  trends: PerformanceTrendPoint[]
  recentImprovement: {
    accuracy: number
    apm: number
  }
}

function calculateModeStats(results: StoredTestResult[]): ModeStats {
  if (results.length === 0) {
    return {
      totalTests: 0,
      avgAccuracy: 0,
      avgAPM: 0,
      bestAccuracy: 0,
      bestAPM: 0,
    }
  }

  const totalAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0)
  const totalAPM = results.reduce((sum, r) => sum + (r.apm || 0), 0)
  const bestAccuracy = Math.max(...results.map((r) => r.accuracy))
  const bestAPM = Math.max(...results.map((r) => r.apm || 0))

  return {
    totalTests: results.length,
    avgAccuracy: totalAccuracy / results.length,
    avgAPM: totalAPM / results.length,
    bestAccuracy,
    bestAPM,
  }
}

function calculateDistribution(
  results: StoredTestResult[],
  interpreter: (value: number) => string,
  getValue: (r: StoredTestResult) => number | undefined,
): PerformanceDistribution {
  const distribution: PerformanceDistribution = {
    excellent: 0,
    good: 0,
    moderate: 0,
    poor: 0,
  }

  for (const result of results) {
    const value = getValue(result)
    if (value === undefined) continue

    const level = interpreter(value)
    switch (level) {
      case PerformanceLevel.EXCELLENT:
        distribution.excellent++
        break
      case PerformanceLevel.GOOD:
        distribution.good++
        break
      case PerformanceLevel.MODERATE:
        distribution.moderate++
        break
      case PerformanceLevel.POOR:
      case EnduranceLevel.SIGNIFICANT_FATIGUE:
        distribution.poor++
        break
    }
  }

  return distribution
}

function calculateRecentImprovement(results: StoredTestResult[]): {
  accuracy: number
  apm: number
} {
  if (results.length < 6) {
    return { accuracy: 0, apm: 0 }
  }

  // Sort by date descending
  const sorted = [...results].sort((a, b) => b.savedAt - a.savedAt)

  // Compare last 3 tests vs previous 3 tests
  const recent3 = sorted.slice(0, 3)
  const previous3 = sorted.slice(3, 6)

  const recentAvgAccuracy = recent3.reduce((sum, r) => sum + r.accuracy, 0) / 3
  const previousAvgAccuracy = previous3.reduce((sum, r) => sum + r.accuracy, 0) / 3

  const recentAvgAPM = recent3.reduce((sum, r) => sum + (r.apm || 0), 0) / 3
  const previousAvgAPM = previous3.reduce((sum, r) => sum + (r.apm || 0), 0) / 3

  return {
    accuracy: recentAvgAccuracy - previousAvgAccuracy,
    apm: recentAvgAPM - previousAvgAPM,
  }
}

export function usePerformanceStats() {
  const testResults = ref<StoredTestResult[]>([])
  const isLoading = ref(true)
  const loadError = ref<string | undefined>(undefined)

  const stats = computed<PerformanceStats>(() => {
    const results = testResults.value

    if (results.length === 0) {
      return {
        totalTests: 0,
        totalAnswered: 0,
        totalCorrect: 0,
        totalWrong: 0,
        avgAccuracy: 0,
        avgAPM: 0,
        avgConsistency: 0,
        avgEndurance: 0,
        bestAccuracy: null,
        bestAPM: null,
        worstAccuracy: null,
        worstAPM: null,
        accuracyDistribution: { excellent: 0, good: 0, moderate: 0, poor: 0 },
        speedDistribution: { excellent: 0, good: 0, moderate: 0, poor: 0 },
        rankedStats: { totalTests: 0, avgAccuracy: 0, avgAPM: 0, bestAccuracy: 0, bestAPM: 0 },
        practiceStats: { totalTests: 0, avgAccuracy: 0, avgAPM: 0, bestAccuracy: 0, bestAPM: 0 },
        trends: [],
        recentImprovement: { accuracy: 0, apm: 0 },
      }
    }

    // Calculate totals
    const totalAnswered = results.reduce((sum, r) => sum + r.totalAnswered, 0)
    const totalCorrect = results.reduce((sum, r) => sum + r.totalCorrect, 0)
    const totalWrong = results.reduce((sum, r) => sum + r.totalWrong, 0)
    const totalAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0)
    const totalAPM = results.reduce((sum, r) => sum + (r.apm || 0), 0)

    // Calculate consistency and endurance averages (only for tests that have them)
    const consistencyResults = results.filter((r) => r.consistency)
    const avgConsistency =
      consistencyResults.length > 0
        ? consistencyResults.reduce((sum, r) => sum + (r.consistency?.accuracyCV || 0), 0) /
          consistencyResults.length
        : 0

    const enduranceResults = results.filter((r) => r.endurance)
    const avgEndurance =
      enduranceResults.length > 0
        ? enduranceResults.reduce((sum, r) => sum + (r.endurance?.accuracyDegradation || 0), 0) /
          enduranceResults.length
        : 0

    // Find best and worst records
    const sortedByAccuracy = [...results].sort((a, b) => b.accuracy - a.accuracy)
    const sortedByAPM = [...results].sort((a, b) => (b.apm || 0) - (a.apm || 0))

    const bestAccuracyResult = sortedByAccuracy[0]
    const worstAccuracyResult = sortedByAccuracy[sortedByAccuracy.length - 1]
    const bestAPMResult = sortedByAPM[0]
    const worstAPMResult = sortedByAPM[sortedByAPM.length - 1]

    const bestAccuracy: BestRecord = {
      value: bestAccuracyResult.accuracy,
      testId: bestAccuracyResult.id,
      date: bestAccuracyResult.savedAt,
      mode: bestAccuracyResult.mode || Mode.PRACTICE,
    }

    const worstAccuracy: BestRecord = {
      value: worstAccuracyResult.accuracy,
      testId: worstAccuracyResult.id,
      date: worstAccuracyResult.savedAt,
      mode: worstAccuracyResult.mode || Mode.PRACTICE,
    }

    const bestAPM: BestRecord = {
      value: bestAPMResult.apm || 0,
      testId: bestAPMResult.id,
      date: bestAPMResult.savedAt,
      mode: bestAPMResult.mode || Mode.PRACTICE,
    }

    const worstAPM: BestRecord = {
      value: worstAPMResult.apm || 0,
      testId: worstAPMResult.id,
      date: worstAPMResult.savedAt,
      mode: worstAPMResult.mode || Mode.PRACTICE,
    }

    // Calculate distributions
    const accuracyDistribution = calculateDistribution(
      results,
      interpretAccuracy,
      (r) => r.accuracy,
    )

    const speedDistribution = calculateDistribution(results, interpretSpeed, (r) => r.apm)

    // Calculate mode stats
    const rankedResults = results.filter((r) => r.mode === Mode.RANKED)
    const practiceResults = results.filter((r) => r.mode === Mode.PRACTICE)

    const rankedStats = calculateModeStats(rankedResults)
    const practiceStats = calculateModeStats(practiceResults)

    // Calculate trends (sorted by date ascending for chart)
    const trends: PerformanceTrendPoint[] = [...results]
      .sort((a, b) => a.savedAt - b.savedAt)
      .map((r) => ({
        date: r.savedAt,
        accuracy: r.accuracy,
        apm: r.apm || 0,
        testId: r.id,
        mode: r.mode || Mode.PRACTICE,
      }))

    // Calculate recent improvement
    const recentImprovement = calculateRecentImprovement(results)

    return {
      totalTests: results.length,
      totalAnswered,
      totalCorrect,
      totalWrong,
      avgAccuracy: totalAccuracy / results.length,
      avgAPM: totalAPM / results.length,
      avgConsistency,
      avgEndurance,
      bestAccuracy,
      bestAPM,
      worstAccuracy,
      worstAPM,
      accuracyDistribution,
      speedDistribution,
      rankedStats,
      practiceStats,
      trends,
      recentImprovement,
    }
  })

  const loadPerformanceData = async (): Promise<void> => {
    try {
      isLoading.value = true
      loadError.value = undefined
      testResults.value = await testHistoryApi.getAll()
    } catch {
      loadError.value = 'Failed to load performance data. Please refresh the page to try again.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    stats,
    isLoading,
    loadError,
    loadPerformanceData,
    testResults,
  }
}
