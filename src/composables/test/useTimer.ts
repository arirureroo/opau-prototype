import { ref, computed, onUnmounted } from 'vue'

const MS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600
const TIMER_UPDATE_INTERVAL_MS = 100
const TIME_PADDING_LENGTH = 2
const PADDING_CHAR = '0'

export function useTimer() {
  const startTime = ref<number | null>(null)
  const remainingTimeMs = ref<number>(0)
  const allocatedTimeMs = ref<number>(0)
  const isActive = ref(false)
  let intervalId: number | null = null

  const elapsedTimeMs = computed(() => {
    if (!startTime.value) return 0
    return allocatedTimeMs.value - remainingTimeMs.value
  })

  const formattedTime = computed(() => {
    const totalSeconds = Math.floor(remainingTimeMs.value / MS_PER_SECOND)
    const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR)
    const minutes = Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
    const seconds = totalSeconds % SECONDS_PER_MINUTE

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(TIME_PADDING_LENGTH, PADDING_CHAR)}:${String(seconds).padStart(TIME_PADDING_LENGTH, PADDING_CHAR)}`
    }
    return `${minutes}:${String(seconds).padStart(TIME_PADDING_LENGTH, PADDING_CHAR)}`
  })

  const progressPercent = computed(() => {
    if (allocatedTimeMs.value === 0) return 0
    return ((allocatedTimeMs.value - remainingTimeMs.value) / allocatedTimeMs.value) * 100
  })

  const start = (durationMs: number, onComplete?: () => void) => {
    if (isActive.value) return

    allocatedTimeMs.value = durationMs
    remainingTimeMs.value = durationMs
    startTime.value = Date.now()
    isActive.value = true

    intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startTime.value!
      remainingTimeMs.value = Math.max(0, allocatedTimeMs.value - elapsed)

      if (remainingTimeMs.value <= 0) {
        stop()
        if (onComplete) {
          onComplete()
        }
      }
    }, TIMER_UPDATE_INTERVAL_MS)
  }

  const stop = () => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    isActive.value = false
  }

  const reset = () => {
    stop()
    startTime.value = null
    remainingTimeMs.value = 0
    allocatedTimeMs.value = 0
  }

  onUnmounted(() => {
    stop()
  })

  return {
    startTime,
    remainingTimeMs,
    elapsedTimeMs,
    allocatedTimeMs,
    formattedTime,
    progressPercent,
    isActive,
    start,
    stop,
    reset
  }
}
