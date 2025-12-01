import { computed, type ComputedRef } from 'vue'
import { useDarkMode } from '../ui/useDarkMode'

export function useChartTheming() {
  const { isDark } = useDarkMode()

  const areaGradientId: ComputedRef<string> = computed(() => {
    return isDark.value ? 'areaGradientDark' : 'areaGradientLight'
  })

  const strokeColor: ComputedRef<string> = computed(() => {
    return 'var(--primary)'
  })

  const strokeOpacity: ComputedRef<string> = computed(() => {
    return '0.9'
  })

  const lightGradient = {
    startColor: 'hsl(var(--primary))',
    startOpacity: '0.2',
    endColor: 'hsl(var(--primary))',
    endOpacity: '0.02',
  }

  const darkGradient = {
    startColor: 'hsl(0, 0%, 70%)',
    startOpacity: '0.2',
    endColor: 'hsl(0, 0%, 70%)',
    endOpacity: '0.02',
  }

  return {
    isDark,
    areaGradientId,
    strokeColor,
    strokeOpacity,
    lightGradient,
    darkGradient,
  }
}
