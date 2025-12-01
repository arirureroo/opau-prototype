import { computed, type ComputedRef, type Ref } from 'vue'
import type { TimeSeriesDataPoint } from '@/types/test.types'

export function useChartCalculations(timeseriesData: Ref<TimeSeriesDataPoint[]>) {
  const maxTime: ComputedRef<number> = computed(() => {
    const lastPoint = timeseriesData.value[timeseriesData.value.length - 1]
    return lastPoint?.elapsedSeconds || 1
  })

  const timeToX = (seconds: number): number => {
    return (seconds / maxTime.value) * 100
  }

  const accuracyToY = (accuracy: number): number => {
    return 100 - accuracy
  }

  const getPointX = (point: TimeSeriesDataPoint): string => {
    return timeToX(point.elapsedSeconds).toFixed(2)
  }

  const getPointY = (point: TimeSeriesDataPoint): string => {
    return accuracyToY(point.currentAccuracy).toFixed(2)
  }

  const polylinePoints: ComputedRef<string> = computed(() => {
    if (timeseriesData.value.length === 0) return ''

    return timeseriesData.value
      .map((point) => {
        const x = timeToX(point.elapsedSeconds)
        const y = accuracyToY(point.currentAccuracy)
        return `${x},${y}`
      })
      .join(' ')
  })

  const areaPath: ComputedRef<string> = computed(() => {
    if (timeseriesData.value.length === 0) return ''

    const points = timeseriesData.value.map((point) => {
      const x = timeToX(point.elapsedSeconds)
      const y = accuracyToY(point.currentAccuracy)
      return `${x},${y}`
    })

    const firstX = timeToX(timeseriesData.value[0].elapsedSeconds)
    const lastX = timeToX(timeseriesData.value[timeseriesData.value.length - 1].elapsedSeconds)

    return `M ${firstX},100 L ${points.join(' L ')} L ${lastX},100 Z`
  })

  const getOverlayPosition = (point: TimeSeriesDataPoint): { left: string; top: string } => {
    return {
      left: `${timeToX(point.elapsedSeconds)}%`,
      top: `${accuracyToY(point.currentAccuracy)}%`,
    }
  }

  return {
    maxTime,
    polylinePoints,
    areaPath,
    getPointX,
    getPointY,
    getOverlayPosition,
  }
}
