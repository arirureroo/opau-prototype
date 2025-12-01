export function formatNumber(
  value: number | undefined,
  decimals: number = 1,
  fallback: string = 'N/A'
): string {
  if (value === undefined) return fallback
  return value.toFixed(decimals)
}

export function formatPercentage(
  value: number | undefined,
  decimals: number = 1,
  fallback: string = 'N/A'
): string {
  if (value === undefined) return fallback
  return `${value.toFixed(decimals)}%`
}

export function formatDegradation(value: number, decimals: number = 1): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}
