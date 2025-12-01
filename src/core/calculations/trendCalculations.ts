import { TrendDirection } from '@/types/trend.types'
import type { TrendData } from '@/types/trend.types'
import { trendThresholds, trendSymbols } from '@/constants/trend.constants'

export function calculateTrend(current: number, previous: number): TrendData {
  const delta = current - previous

  let direction: TrendDirection
  if (Math.abs(delta) < trendThresholds.STABILITY) {
    direction = TrendDirection.STABLE
  } else {
    direction = delta > 0 ? TrendDirection.UP : TrendDirection.DOWN
  }

  return { direction, delta }
}

export function getTrendSymbol(direction: TrendDirection): string {
  return trendSymbols[direction]
}

export function formatDelta(delta: number, isPercentage: boolean = false): string {
  const sign = delta > 0 ? '+' : ''
  const value = delta.toFixed(1)
  const suffix = isPercentage ? '%' : ''
  return `${sign}${value}${suffix}`
}
