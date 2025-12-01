import { ref, computed } from 'vue'
import { Mode } from '@/types/test.types'
import { testConfig } from '@/utils/testConfig'
import { MS_PER_MINUTE } from '@/domain/pauli/constants'

const { DEFAULT_DURATION_MINUTES, RANKED_MIN_MINUTES, RANKED_MAX_MINUTES } = testConfig

const DEFAULT_MODE = Mode.RANKED

const selectedMode = ref<Mode>(DEFAULT_MODE)
const selectedDuration = ref<number>(DEFAULT_DURATION_MINUTES)

const generateRankedDuration = (): number => {
  const range = RANKED_MAX_MINUTES - RANKED_MIN_MINUTES + 1
  return Math.floor(Math.random() * range + RANKED_MIN_MINUTES)
}

const minutesToMs = (minutes: number) => minutes * MS_PER_MINUTE

export const useTestConfig = () => {
  const setMode = (mode: Mode) => {
    selectedMode.value = mode
  }

  const setDuration = (duration: number) => {
    selectedDuration.value = duration
  }

  const reset = () => {
    selectedMode.value = DEFAULT_MODE
    selectedDuration.value = DEFAULT_DURATION_MINUTES
  }

  const getTestDurationMs = (): number => {
    const minutes =
      selectedMode.value === Mode.RANKED ? generateRankedDuration() : selectedDuration.value

    return minutesToMs(minutes)
  }

  const getTestDurationMinutes = computed(() => {
    return selectedMode.value === Mode.RANKED
      ? `Random (${RANKED_MIN_MINUTES}-${RANKED_MAX_MINUTES} min)`
      : `${selectedDuration.value} min`
  })

  return {
    selectedMode,
    selectedDuration,
    setMode,
    setDuration,
    reset,
    getTestDurationMs,
    getTestDurationMinutes,
  }
}
