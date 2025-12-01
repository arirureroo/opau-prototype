import { ref, computed } from 'vue'
import { testHistoryApi } from '@/services/testHistoryApi'
import type { StoredTestResult } from '@/infrastructure/database/TestResultRepository'
import type { Mode } from '@/types/test.types'
import { SortOrder, FilterType, SortBy } from '@/types/ui.types'

export function useHistoryManagement() {
  const testResults = ref<StoredTestResult[]>([])
  const isLoading = ref(true)
  const modeFilter = ref<Mode | FilterType.ALL>(FilterType.ALL)
  const sortBy = ref<SortBy>(SortBy.DATE)
  const sortOrder = ref<SortOrder>(SortOrder.DESC)

  const stats = ref({
    totalTests: 0,
    averageAccuracy: 0,
    averageAPM: 0,
    rankedCount: 0,
    practiceCount: 0,
  })

  const loadError = ref<string | undefined>(undefined)
  const deleteError = ref<string | undefined>(undefined)
  const resetError = ref<string | undefined>(undefined)

  const filteredResults = computed(() => {
    let results = [...testResults.value]

    if (modeFilter.value !== FilterType.ALL) {
      results = results.filter((r) => r.mode === modeFilter.value)
    }

    results.sort((a, b) => {
      let comparison = 0

      switch (sortBy.value) {
        case SortBy.ACCURACY:
          comparison = b.accuracy - a.accuracy
          break
        case SortBy.APM:
          comparison = (b.apm || 0) - (a.apm || 0)
          break
        case SortBy.DATE:
        default:
          comparison = b.savedAt - a.savedAt
          break
      }

      return sortOrder.value === SortOrder.ASC ? -comparison : comparison
    })

    return results
  })

  const loadTestHistory = async (): Promise<void> => {
    try {
      isLoading.value = true
      loadError.value = undefined
      testResults.value = await testHistoryApi.getAll()
      stats.value = await testHistoryApi.getStats()
    } catch {
      loadError.value = 'Failed to load test history. Please refresh the page to try again.'
    } finally {
      isLoading.value = false
    }
  }

  const deleteTest = async (id: string): Promise<void> => {
    try {
      deleteError.value = undefined
      await testHistoryApi.delete(id)
      await loadTestHistory()
    } catch {
      deleteError.value = 'Failed to delete test result. Please try again.'
      throw new Error('Delete failed')
    }
  }

  const resetAllHistory = async (): Promise<void> => {
    try {
      resetError.value = undefined
      await testHistoryApi.deleteAll()
      await loadTestHistory()
    } catch {
      resetError.value = 'Failed to reset test history. Please try again.'
      throw new Error('Reset failed')
    }
  }

  const setModeFilter = (mode: Mode | FilterType.ALL): void => {
    modeFilter.value = mode
  }

  const setSortBy = (criteria: SortBy): void => {
    sortBy.value = criteria
  }

  const setSortOrder = (order: SortOrder): void => {
    sortOrder.value = order
  }

  return {
    testResults,
    isLoading,
    stats,
    modeFilter,
    sortBy,
    sortOrder,
    loadError,
    deleteError,
    resetError,
    filteredResults,
    loadTestHistory,
    deleteTest,
    resetAllHistory,
    setModeFilter,
    setSortBy,
    setSortOrder,
  }
}
