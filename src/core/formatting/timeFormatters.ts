import { MS_PER_MINUTE } from '@/domain/pauli/constants'

const MS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600

function padZero(num: number): string {
  return String(num).padStart(2, '0')
}

function formatMinutesSeconds(minutes: number, seconds: number): string {
  return `${minutes}:${padZero(seconds)}`
}

export function formatDuration(ms: number | undefined, hideSeconds = false): string {
  if (!ms) return 'N/A'

  const totalSeconds = Math.floor(ms / MS_PER_SECOND)
  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR)
  const minutes = Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
  const seconds = totalSeconds % SECONDS_PER_MINUTE

  if (hours > 0) {
    return hideSeconds ? `${hours}h ${minutes}m` : `${hours}h ${minutes}m ${seconds}s`
  }

  if (minutes > 0) {
    return hideSeconds ? `${minutes}m` : `${minutes}m ${seconds}s`
  }

  return hideSeconds ? '0m' : `${seconds}s`
}

export function formatDurationMinutes(ms: number | undefined): string {
  if (!ms) return 'N/A'

  const totalMinutes = Math.round(ms / MS_PER_MINUTE)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0) {
    return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`
  }

  return `${minutes} min`
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / SECONDS_PER_MINUTE)
  const secs = Math.floor(seconds % SECONDS_PER_MINUTE)
  return formatMinutesSeconds(mins, secs)
}

export function formatSeconds(seconds: number, decimals: number = 1): string {
  return `${seconds.toFixed(decimals)}s`
}

export function formatXAxisTick(maxTime: number, tickIndex: number, divisions: number = 4): string {
  const time = (maxTime / divisions) * (tickIndex - 1)
  const mins = Math.floor(time / SECONDS_PER_MINUTE)
  const secs = Math.floor(time % SECONDS_PER_MINUTE)
  return formatMinutesSeconds(mins, secs)
}
