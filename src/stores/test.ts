import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { isLastOrFirstRow } from '@/utils/gridHelpers'
import { calculateTestResult as calculateResult } from '@/services/resultCalculator'
import type { GridData, Mode } from '@/types/test.types'

export const useTestStore = defineStore('test', () => {
  const grids = ref<GridData[]>([])
  const currentGridIndex = ref(0)
  const isCompleted = ref(false)

  const startTime = ref<number | null>(null)
  const endTime = ref<number | null>(null)
  const allocatedTimeMs = ref<number>(0)
  const testMode = ref<Mode | null>(null)

  const initializeGrid = (
    gridIndex: number,
    questions: number[],
    rows: number,
    columns: number,
  ) => {
    if (gridIndex < 0) {
      throw new Error(`Invalid grid index: ${gridIndex}`)
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Questions must be a non-empty array')
    }
    if (!Number.isInteger(rows) || rows <= 0) {
      throw new Error(`Invalid rows: ${rows}`)
    }
    if (!Number.isInteger(columns) || columns <= 0) {
      throw new Error(`Invalid columns: ${columns}`)
    }

    if (!grids.value[gridIndex]) {
      grids.value[gridIndex] = {
        questions,
        answers: new Map(),
        rows,
        columns,
      }
    }
  }

  const setAnswer = (gridIndex: number, cellIndex: number, value: number) => {
    const grid = grids.value[gridIndex]
    if (grid && !isLastOrFirstRow(cellIndex, grid.rows)) {
      const existingAnswer = grid.answers.get(cellIndex)

      const isChanged = existingAnswer
        ? existingAnswer.value !== value || existingAnswer.isChanged
        : false

      grid.answers.set(cellIndex, {
        value,
        timestamp: Date.now(),
        isChanged,
      })
    }
  }

  const getAnswer = (gridIndex: number, cellIndex: number): number => {
    return grids.value[gridIndex]?.answers.get(cellIndex)?.value || 0
  }

  const navigateToGrid = (gridIndex: number) => {
    currentGridIndex.value = gridIndex
  }

  const getGridAnswers = (gridIndex: number) => {
    const answers = grids.value[gridIndex]?.answers || new Map()
    const numberMap = new Map<number, number>()
    answers.forEach((answerData, key) => {
      numberMap.set(key, answerData.value)
    })
    return numberMap
  }

  const getAllGridsData = () => {
    return grids.value.map((grid, index) => ({
      gridIndex: index,
      questions: grid.questions,
      answers: Object.fromEntries(grid.answers),
    }))
  }

  const calculateTestResult = computed(() =>
    calculateResult(
      grids.value,
      startTime.value,
      endTime.value,
      allocatedTimeMs.value,
      testMode.value ?? undefined,
    ),
  )

  const startTest = (durationMs: number, mode: Mode) => {
    startTime.value = Date.now()
    allocatedTimeMs.value = durationMs
    testMode.value = mode
    endTime.value = null
    isCompleted.value = false
  }

  const completeTest = () => {
    endTime.value = Date.now()
    isCompleted.value = true
  }

  const reset = () => {
    grids.value = []
    currentGridIndex.value = 0
    isCompleted.value = false
    startTime.value = null
    endTime.value = null
    allocatedTimeMs.value = 0
    testMode.value = null
  }

  return {
    grids,
    currentGridIndex,
    isCompleted,
    startTime,
    endTime,
    allocatedTimeMs,
    testMode,
    initializeGrid,
    setAnswer,
    getAnswer,
    navigateToGrid,
    getGridAnswers,
    getAllGridsData,
    calculateTestResult,
    startTest,
    completeTest,
    reset,
  }
})
