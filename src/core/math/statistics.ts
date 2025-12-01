const NO_VALUE = 0

export function calculateMean(values: number[]): number {
  if (values.length === 0) return NO_VALUE
  const sum = values.reduce((acc, val) => acc + val, 0)
  return sum / values.length
}

export function calculateStandardDeviation(values: number[]): number {
  if (values.length < 2) return NO_VALUE
  const mean = calculateMean(values)
  const squaredDifferences = values.map((val) => Math.pow(val - mean, 2))
  const variance = calculateMean(squaredDifferences)
  return Math.sqrt(variance)
}

export function calculateCoefficientOfVariation(values: number[]): number {
  if (values.length < 2) return NO_VALUE
  const mean = calculateMean(values)
  if (mean === 0) return NO_VALUE
  const stdDev = calculateStandardDeviation(values)
  return (stdDev / mean) * 100
}
