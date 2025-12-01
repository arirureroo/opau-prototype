<script setup lang="ts">
import type { TimeSeriesDataPoint } from '@/types/test.types'
import { formatTime, formatSeconds } from '@/utils/formatters'
import { Badge } from '@/components/ui/badge'

interface Props {
  point: TimeSeriesDataPoint
  index: number
  maxTime: number
  strokeColor: string
  strokeOpacity: string
  data: TimeSeriesDataPoint[]
}

const { point, index, maxTime, data } = defineProps<Props>()

const getTimeSincePrevious = (point: TimeSeriesDataPoint, index: number, data: TimeSeriesDataPoint[]) => {
  if (index === 0) return formatSeconds(data[0].elapsedSeconds)
  return formatSeconds(data[index].elapsedSeconds - data[index - 1].elapsedSeconds)
}

const getTooltipPosition = (point: TimeSeriesDataPoint, maxTime: number) => {
  const x = (point.elapsedSeconds / maxTime) * 100
  const y = 100 - point.currentAccuracy

  const isTopHalf = y < 50
  const tooltipOffset = isTopHalf ? 'top-full mt-8' : 'bottom-full mb-8'

  const isLeftHalf = x < 50
  const horizontalAlign = isLeftHalf ? 'left-0' : 'right-0'

  return `${tooltipOffset} ${horizontalAlign}`
}
</script>

<template>
  <div
    class="absolute animate-in fade-in-0 zoom-in-95 duration-150"
    :class="getTooltipPosition(point, maxTime)"
  >
    <div
      class="bg-popover/98 backdrop-blur-sm border rounded-md shadow-lg px-3 py-2 min-w-tooltip"
    >
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-3xs font-semibold text-muted-foreground uppercase tracking-wide">
          #{{ index + 1 }}
        </span>
        <Badge
          :variant="point.isCorrect ? 'default' : 'destructive'"
          class="text-2xs px-1.5 py-0 h-4"
        >
          {{ point.isCorrect ? '✓' : '✗' }}
        </Badge>
      </div>

      <div class="space-y-1 text-sm">
        <div class="flex justify-between gap-3 items-baseline">
          <span class="text-muted-foreground whitespace-nowrap">Accuracy</span>
          <span class="font-bold">{{ point.currentAccuracy.toFixed(1) }}%</span>
        </div>
        <div class="flex justify-between gap-3 items-baseline">
          <span class="text-muted-foreground whitespace-nowrap">Time</span>
          <span class="font-semibold">{{ formatTime(point.elapsedSeconds) }}</span>
        </div>
        <div class="flex justify-between gap-3 items-baseline">
          <span class="text-muted-foreground whitespace-nowrap">Time Taken</span>
          <span class="font-semibold">{{ getTimeSincePrevious(point, index, data) }}</span>
        </div>
        <div class="flex justify-between gap-3 items-baseline">
          <span class="text-muted-foreground whitespace-nowrap">Correct Answers</span>
          <span class="font-bold"
            >{{ point.cumulativeCorrect }}/{{ point.cumulativeTotal }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
