export {
  formatDuration,
  formatDurationMinutes,
  formatTime,
  formatSeconds,
  formatXAxisTick,
} from '@/core/formatting/timeFormatters'
export {
  formatNumber,
  formatPercentage,
  formatDegradation,
} from '@/core/formatting/numberFormatters'

export function formatAPM(apm: number | undefined): string {
  if (!apm) return 'N/A'
  return apm.toFixed(1)
}
