import type { PankerMetrics } from '../models/PauliMetrics'
import { MS_PER_MINUTE } from '../constants'

export function calculatePankerMetrics(totalAnswered: number, durationMs: number): PankerMetrics {
  const apm = durationMs > 0 ? totalAnswered / (durationMs / MS_PER_MINUTE) : 0

  const avgTimePerAnswer = totalAnswered > 0 ? durationMs / totalAnswered / 1000 : 0

  return { apm, durationMs, totalAnswered, avgTimePerAnswer }
}

export function calculateSegmentAPM(answeredCount: number, durationMs: number): number {
  if (durationMs <= 0 || answeredCount <= 0) return 0
  return answeredCount / (durationMs / MS_PER_MINUTE)
}
