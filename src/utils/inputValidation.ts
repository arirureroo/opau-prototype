export function validateSingleDigit(value: string): string {
  let sanitized = value

  if (sanitized.length > 1) {
    sanitized = sanitized.slice(-1)
  }

  const numValue = Number(sanitized)
  if (sanitized && (isNaN(numValue) || numValue < 0 || numValue > 9)) {
    return ''
  }

  return sanitized
}

export function inputValueToNumber(value: string): number {
  return value === '' ? 0 : Number(value)
}

export function numberToInputValue(value: number | undefined): string {
  return value !== undefined ? String(value) : ''
}
