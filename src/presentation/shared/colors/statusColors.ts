import type { PerformanceChange } from '@/types/pauli.types'

export function getChangeColorClass(change: PerformanceChange): string {
  const colorMap: Record<PerformanceChange, string> = {
    Improvement: 'text-emerald-600 dark:text-emerald-400',
    Stable: 'text-muted-foreground',
    'Minor Degradation': 'text-rose-600 dark:text-rose-400',
    'Moderate Degradation': 'text-rose-600 dark:text-rose-400',
    'Significant Degradation': 'text-rose-600 dark:text-rose-400',
  }
  return colorMap[change]
}

export function getThresholdColorClass(
  value: number,
  threshold: number,
  dangerous: boolean = true,
): string {
  if (dangerous) {
    return value > threshold ? 'text-rose-600 dark:text-rose-400' : 'text-muted-foreground'
  } else {
    return value > threshold ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
  }
}

export function formatDegradation(value: number): string {
  if (value > 0) return `+${value.toFixed(1)}%`
  if (value < 0) return `${value.toFixed(1)}%`
  return '0%'
}
