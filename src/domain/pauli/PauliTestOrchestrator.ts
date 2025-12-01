import type { GridData, TestResult, GridResult, AnswerDetail, Mode } from '@/types/test.types'
import { calculateExpectedAnswer, calculateTiankerMetrics } from './calculations/TiankerCalculator'
import { calculatePankerMetrics } from './calculations/PankerCalculator'
import {
  calculateJankerMetrics,
  extractAccuracies,
  extractAPMs,
} from './calculations/JankerCalculator'
import { calculateHankerMetrics } from './calculations/HankerCalculator'
import { MS_PER_MINUTE, PERCENTAGE_MULTIPLIER } from './constants'
import { isLastOrFirstRow } from '@/utils/gridHelpers'

const MS_PER_SECOND = 1000

interface ProcessedAnswerDetail extends AnswerDetail {
  num1: number
  num2: number
  expectedAnswer: number
  userAnswer: number
  isCorrect: boolean
  isChanged: boolean
  timestamp: number
}

function processAnswerDetail(
  answerData: { value: number; timestamp: number; isChanged: boolean },
  cellIndex: number,
  grid: GridData,
): ProcessedAnswerDetail {
  const num1 = grid.questions[cellIndex]
  const num2 = grid.questions[cellIndex + 1]
  const expected = calculateExpectedAnswer(num1, num2)
  const isCorrect = answerData.value === expected

  return {
    cellIndex,
    num1,
    num2,
    expectedAnswer: expected,
    userAnswer: answerData.value,
    isCorrect,
    isChanged: answerData.isChanged,
    timestamp: answerData.timestamp,
  }
}

function calculateGridResult(grid: GridData, gridIndex: number): GridResult | undefined {
  if (!grid) return undefined

  const answers: AnswerDetail[] = []
  let correctCount = 0
  let wrongCount = 0
  let changedCount = 0
  let totalAnswered = 0
  let minTimestamp = Number.MAX_VALUE
  let maxTimestamp = Number.MIN_VALUE

  grid.answers.forEach((answerData, cellIndex) => {
    if (isLastOrFirstRow(cellIndex, grid.rows)) return

    totalAnswered++
    const answerDetail = processAnswerDetail(answerData, cellIndex, grid)

    if (answerDetail.isCorrect) {
      correctCount++
    } else {
      wrongCount++
    }

    if (answerData.isChanged) {
      changedCount++
    }

    minTimestamp = Math.min(minTimestamp, answerData.timestamp)
    maxTimestamp = Math.max(maxTimestamp, answerData.timestamp)

    answers.push(answerDetail)
  })

  const accuracy = totalAnswered > 0 ? (correctCount / totalAnswered) * PERCENTAGE_MULTIPLIER : 0
  const startTime = minTimestamp !== Number.MAX_VALUE ? minTimestamp : undefined
  const endTime = maxTimestamp !== Number.MIN_VALUE ? maxTimestamp : undefined
  const durationMs = startTime && endTime ? endTime - startTime : undefined
  const apm =
    durationMs && totalAnswered > 0 ? totalAnswered / (durationMs / MS_PER_MINUTE) : undefined

  return {
    gridIndex,
    questions: grid.questions,
    answers,
    correctCount,
    wrongCount,
    changedCount,
    totalAnswered,
    rows: grid.rows,
    columns: grid.columns,
    accuracy,
    apm,
    startTime,
    endTime,
    durationMs,
  }
}

function calculateTimeSeries(allAnswers: AnswerDetail[], startTime: number) {
  const sortedAnswers = [...allAnswers].sort((a, b) => a.timestamp - b.timestamp)

  let cumulativeCorrect = 0
  let cumulativeWrong = 0
  let cumulativeTotal = 0

  return sortedAnswers.map((answer) => {
    if (answer.isCorrect) {
      cumulativeCorrect++
    } else {
      cumulativeWrong++
    }
    cumulativeTotal++

    const currentAccuracy = (cumulativeCorrect / cumulativeTotal) * PERCENTAGE_MULTIPLIER
    const elapsedSeconds = (answer.timestamp - startTime) / MS_PER_SECOND

    return {
      timestamp: answer.timestamp,
      elapsedSeconds,
      cumulativeCorrect,
      cumulativeWrong,
      cumulativeTotal,
      currentAccuracy,
      isCorrect: answer.isCorrect,
    }
  })
}

export function orchestrateTestCalculation(
  grids: GridData[],
  startTime: number | null,
  endTime: number | null,
  allocatedTimeMs: number,
  testMode: Mode | undefined,
): TestResult {
  const gridResults: GridResult[] = []
  let totalCorrect = 0
  let totalWrong = 0
  let totalChanged = 0
  let totalAnswered = 0
  let totalQuestions = 0

  grids.forEach((grid, index) => {
    const gridResult = calculateGridResult(grid, index)
    if (gridResult && gridResult.totalAnswered > 0) {
      gridResults.push(gridResult)
      totalCorrect += gridResult.correctCount
      totalWrong += gridResult.wrongCount
      totalChanged += gridResult.changedCount
      totalAnswered += gridResult.totalAnswered

      const answerableCells = grid.questions.filter(
        (_, idx) => !isLastOrFirstRow(idx, grid.rows),
      ).length
      totalQuestions += answerableCells
    }
  })

  const tiankerMetrics = calculateTiankerMetrics(totalCorrect, totalWrong, totalChanged)
  const durationMs = endTime && startTime ? endTime - startTime : undefined
  const pankerMetrics = durationMs ? calculatePankerMetrics(totalAnswered, durationMs) : undefined

  const allAnswers: AnswerDetail[] = gridResults.flatMap((grid) => grid.answers)
  const timeseries =
    startTime && allAnswers.length > 0 ? calculateTimeSeries(allAnswers, startTime) : undefined

  const accuracies = extractAccuracies(gridResults)
  const apms = extractAPMs(gridResults)
  const jankerMetrics =
    accuracies.length >= 2 ? calculateJankerMetrics(accuracies, apms) : undefined

  const hankerMetrics = allAnswers.length > 0 ? calculateHankerMetrics(allAnswers) : undefined

  return {
    grids: gridResults,
    totalCorrect,
    totalWrong,
    totalChanged,
    totalAnswered,
    totalQuestions,
    accuracy: tiankerMetrics.accuracy,
    startTime: startTime ?? undefined,
    endTime: endTime ?? undefined,
    durationMs,
    apm: pankerMetrics?.apm,
    mode: testMode,
    allocatedTimeMs: allocatedTimeMs || undefined,
    timeseries,
    consistency: jankerMetrics,
    endurance: hankerMetrics,
  }
}
