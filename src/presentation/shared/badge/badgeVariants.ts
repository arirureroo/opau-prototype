import { PerformanceLevel, EnduranceLevel } from '@/types/pauli.types'
import type { PerformanceLevelType, EnduranceLevelType } from '@/types/pauli.types'

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive'

export function getBadgeVariant(level: PerformanceLevelType | EnduranceLevelType): BadgeVariant {
  const variantMap: Record<PerformanceLevelType | EnduranceLevelType, BadgeVariant> = {
    [PerformanceLevel.EXCELLENT]: 'default',
    [PerformanceLevel.GOOD]: 'secondary',
    [PerformanceLevel.MODERATE]: 'outline',
    [PerformanceLevel.POOR]: 'destructive',
    [EnduranceLevel.SIGNIFICANT_FATIGUE]: 'destructive',
  }
  return variantMap[level]
}

export function getBadgeColorName(level: PerformanceLevelType): string {
  const colorMap: Record<PerformanceLevelType, string> = {
    [PerformanceLevel.EXCELLENT]: 'emerald',
    [PerformanceLevel.GOOD]: 'blue',
    [PerformanceLevel.MODERATE]: 'amber',
    [PerformanceLevel.POOR]: 'rose',
  }
  return colorMap[level]
}
