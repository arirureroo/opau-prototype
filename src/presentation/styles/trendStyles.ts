import { TrendDirection } from '@/types/trend.types'

export const getTrendDataAttribute = (direction: TrendDirection) => ({
  'data-trend': direction.toLowerCase(),
})
