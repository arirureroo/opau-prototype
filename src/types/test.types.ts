import type {
  PerformancePeriod,
  HankerMetrics,
  JankerMetrics,
} from '@/domain/pauli/models/PauliMetrics'

export interface AnswerWithTimestamp {
  value: number
  timestamp: number
  isChanged: boolean
}

export interface GridData {
  questions: number[]
  answers: Map<number, AnswerWithTimestamp>
  rows: number
  columns: number
}

export interface AnswerDetail {
  cellIndex: number
  num1: number
  num2: number
  expectedAnswer: number
  userAnswer: number
  isCorrect: boolean
  isChanged: boolean
  timestamp: number
}

export interface GridResult {
  gridIndex: number
  questions: number[]
  answers: AnswerDetail[]
  correctCount: number
  wrongCount: number
  changedCount: number
  totalAnswered: number
  rows: number
  columns: number
  accuracy?: number
  apm?: number
  startTime?: number
  endTime?: number
  durationMs?: number
}

export interface TimeSeriesDataPoint {
  timestamp: number
  elapsedSeconds: number
  cumulativeCorrect: number
  cumulativeWrong: number
  cumulativeTotal: number
  currentAccuracy: number
  isCorrect: boolean
}

export type EnduranceMetrics = HankerMetrics
export type ConsistencyMetrics = JankerMetrics
export type { PerformancePeriod }

export interface TestResult {
  grids: GridResult[]
  totalCorrect: number
  totalWrong: number
  totalChanged: number
  totalAnswered: number
  totalQuestions: number
  accuracy: number
  startTime?: number
  endTime?: number
  durationMs?: number
  apm?: number
  mode?: Mode
  allocatedTimeMs?: number
  timeseries?: TimeSeriesDataPoint[]
  consistency?: ConsistencyMetrics
  endurance?: EnduranceMetrics
}

export interface TestStatistics {
  correct: number
  changed: number
  wrong: number
}

export enum Mode {
  RANKED = 'ranked',
  PRACTICE = 'practice',
}
