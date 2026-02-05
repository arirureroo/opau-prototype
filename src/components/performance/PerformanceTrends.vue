<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PerformanceTrendPoint } from '@/composables/performance'
import { chartStyles } from '@/constants/chart.constants'
import { chartHeights } from '@/presentation/styles/sizeConstants'
import { useChartTheming } from '@/composables/chart'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mode } from '@/types/test.types'

interface Props {
  trends: PerformanceTrendPoint[]
}

const props = defineProps<Props>()

const selectedMetric = ref<'accuracy' | 'apm'>('accuracy')
const selectedMode = ref<'all' | Mode>('all')
const hoveredIndex = ref<number | null>(null)

const { areaGradientId, strokeColor, strokeOpacity, lightGradient, darkGradient } =
  useChartTheming()

const chartData = computed(() => {
  if (props.trends.length === 0) return []
  if (selectedMode.value === 'all') return props.trends
  return props.trends.filter((t) => t.mode === selectedMode.value)
})

const maxValue = computed(() => {
  if (chartData.value.length === 0) return 100
  const values = chartData.value.map((d) =>
    selectedMetric.value === 'accuracy' ? d.accuracy : d.apm,
  )
  const max = Math.max(...values)
  return selectedMetric.value === 'accuracy' ? 100 : Math.ceil(max * 1.1)
})

const minValue = computed(() => {
  if (chartData.value.length === 0) return 0
  if (selectedMetric.value === 'accuracy') {
    const values = chartData.value.map((d) => d.accuracy)
    const min = Math.min(...values)
    return Math.max(0, Math.floor(min - 10))
  }
  return 0
})

const valueRange = computed(() => maxValue.value - minValue.value)

const getPointX = (index: number) => {
  if (chartData.value.length <= 1) return 50
  return (index / (chartData.value.length - 1)) * 100
}

const getPointY = (point: PerformanceTrendPoint) => {
  const value = selectedMetric.value === 'accuracy' ? point.accuracy : point.apm
  const normalized = (value - minValue.value) / valueRange.value
  return 100 - normalized * 100
}

const getOverlayPosition = (index: number) => {
  const point = chartData.value[index]
  if (!point) return { left: '0%', top: '0%' }
  return {
    left: `${getPointX(index)}%`,
    top: `${getPointY(point)}%`,
  }
}

const polylinePoints = computed(() => {
  return chartData.value.map((point, index) => `${getPointX(index)},${getPointY(point)}`).join(' ')
})

const areaPath = computed(() => {
  if (chartData.value.length === 0) return ''

  const points = chartData.value.map((point, index) => ({
    x: getPointX(index),
    y: getPointY(point),
  }))

  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`
  }

  path += ` L ${points[points.length - 1].x} 100`
  path += ` L ${points[0].x} 100`
  path += ' Z'

  return path
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

const formatValue = (point: PerformanceTrendPoint) => {
  if (selectedMetric.value === 'accuracy') {
    return `${point.accuracy.toFixed(1)}%`
  }
  return `${point.apm.toFixed(1)} APM`
}

const yAxisLabels = computed(() => {
  const labels = []
  const step = valueRange.value / 4
  for (let i = 0; i <= 4; i++) {
    const value = maxValue.value - step * i
    labels.push(selectedMetric.value === 'accuracy' ? `${value.toFixed(0)}%` : value.toFixed(0))
  }
  return labels
})

const yAxisLabel = computed(() => {
  return selectedMetric.value === 'accuracy' ? 'ACCURACY %' : 'SPEED (APM)'
})
</script>

<template>
  <Card class="w-full">
    <CardHeader class="pb-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 class="text-base sm:text-lg font-semibold">Performance Over Time</h4>
          <p class="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track your progress across all tests
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Tabs v-model="selectedMode" class="w-auto">
            <TabsList class="h-8">
              <TabsTrigger value="all" class="text-xs px-2.5">All</TabsTrigger>
              <TabsTrigger value="ranked" class="text-xs px-2.5">Ranked</TabsTrigger>
              <TabsTrigger value="practice" class="text-xs px-2.5">Practice</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs v-model="selectedMetric" class="w-auto">
            <TabsList class="h-8">
              <TabsTrigger value="accuracy" class="text-xs px-2.5">Accuracy</TabsTrigger>
              <TabsTrigger value="apm" class="text-xs px-2.5">Speed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <div v-if="chartData.length < 2" class="flex items-center justify-center h-48">
        <p class="text-muted-foreground text-sm">
          Need at least 2 tests to show trends
        </p>
      </div>

      <div v-else class="flex gap-2 sm:gap-4">
        <!-- Y-axis label -->
        <div class="hidden sm:flex items-center justify-center w-5">
          <div
            class="transform -rotate-90 text-2xs font-semibold text-muted-foreground whitespace-nowrap tracking-wider"
          >
            {{ yAxisLabel }}
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex gap-2 sm:gap-3">
            <div :class="['flex flex-col justify-between', chartHeights.md]">
              <div
                v-for="(label, index) in yAxisLabels"
                :key="index"
                class="flex items-center gap-1 sm:gap-1.5"
              >
                <span
                  class="text-2xs sm:text-xs w-8 sm:w-10 font-medium text-muted-foreground text-right"
                >
                  {{ label }}
                </span>
                <div class="w-1 sm:w-1.5 h-px bg-border"></div>
              </div>
            </div>

            <div class="flex-1 relative">
              <div
                :class="[
                  'absolute inset-0 flex flex-col justify-between pointer-events-none',
                  chartHeights.md,
                ]"
              >
                <div
                  v-for="i in 5"
                  :key="i"
                  class="border-t"
                  :class="i === 1 || i === 5 ? 'border-border' : 'border-border/40'"
                ></div>
              </div>

              <div :class="['relative overflow-hidden', chartHeights.md]">
                <svg
                  class="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="trendGradientLight" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop
                        offset="0%"
                        :stop-color="lightGradient.startColor"
                        :stop-opacity="lightGradient.startOpacity"
                      />
                      <stop
                        offset="100%"
                        :stop-color="lightGradient.endColor"
                        :stop-opacity="lightGradient.endOpacity"
                      />
                    </linearGradient>

                    <linearGradient id="trendGradientDark" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop
                        offset="0%"
                        :stop-color="darkGradient.startColor"
                        :stop-opacity="darkGradient.startOpacity"
                      />
                      <stop
                        offset="100%"
                        :stop-color="darkGradient.endColor"
                        :stop-opacity="darkGradient.endOpacity"
                      />
                    </linearGradient>

                    <clipPath id="trendChartClip">
                      <rect x="0" y="0" width="100" height="100" />
                    </clipPath>
                  </defs>

                  <path
                    :d="areaPath"
                    :fill="`url(#${areaGradientId.replace('area', 'trend')})`"
                    class="transition-opacity duration-200"
                    :class="hoveredIndex !== null ? 'opacity-100' : 'opacity-70'"
                    clip-path="url(#trendChartClip)"
                  />

                  <polyline
                    :points="polylinePoints"
                    fill="none"
                    :stroke="strokeColor"
                    :stroke-opacity="strokeOpacity"
                    :stroke-width="
                      hoveredIndex !== null
                        ? chartStyles.STROKE_WIDTH_HOVERED
                        : chartStyles.STROKE_WIDTH_DEFAULT
                    "
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    vector-effect="non-scaling-stroke"
                    class="transition-all duration-200 drop-shadow-sm"
                    clip-path="url(#trendChartClip)"
                  />

                  <g
                    v-for="(point, index) in chartData"
                    :key="index"
                    clip-path="url(#trendChartClip)"
                  >
                    <circle
                      :cx="getPointX(index)"
                      :cy="getPointY(point)"
                      :r="chartStyles.HIT_AREA_RADIUS"
                      fill="transparent"
                      class="cursor-pointer"
                      vector-effect="non-scaling-stroke"
                      @mouseenter="hoveredIndex = index"
                      @mouseleave="hoveredIndex = null"
                    />
                  </g>
                </svg>
              </div>

              <!-- Hover dot overlay -->
              <div
                :class="['absolute inset-0 pointer-events-none', chartHeights.md]"
              >
                <div
                  v-for="(point, index) in chartData"
                  v-show="hoveredIndex === index"
                  :key="`dot-${index}`"
                  class="absolute transition-all duration-150"
                  :style="{
                    ...getOverlayPosition(index),
                    transform: 'translate(-50%, -50%)'
                  }"
                >
                  <div
                    :class="`w-${chartStyles.DOT_RADIUS} h-${chartStyles.DOT_RADIUS}`"
                    class="rounded-full ring-2 ring-background shadow-md"
                    :style="{ backgroundColor: strokeColor, opacity: strokeOpacity }"
                  ></div>
                </div>

                <!-- Tooltip -->
                <div
                  v-for="(point, index) in chartData"
                  v-show="hoveredIndex === index"
                  :key="`tooltip-${index}`"
                  class="absolute z-30"
                  :style="getOverlayPosition(index)"
                >
                  <div
                    class="px-3 py-2 bg-popover border border-border rounded-lg shadow-lg text-xs pointer-events-none"
                    :style="{ transform: 'translate(-50%, -120%)' }"
                  >
                    <p class="font-semibold">{{ formatValue(point) }}</p>
                    <p class="text-muted-foreground">{{ formatDate(point.date) }}</p>
                    <p class="text-muted-foreground capitalize">{{ point.mode }}</p>
                  </div>
                </div>
              </div>

              <!-- X-axis ticks and labels -->
              <div class="mt-2 sm:mt-2.5">
                <div class="flex justify-between">
                  <div class="flex flex-col items-center">
                    <div class="w-px h-1.5 sm:h-2 bg-border"></div>
                    <span class="text-3xs sm:text-2xs font-medium text-muted-foreground mt-0.5 sm:mt-1">
                      {{ formatDate(chartData[0]?.date || 0) }}
                    </span>
                  </div>
                  <div class="flex flex-col items-center">
                    <div class="w-px h-1.5 sm:h-2 bg-border"></div>
                    <span class="text-3xs sm:text-2xs font-medium text-muted-foreground mt-0.5 sm:mt-1">
                      {{ formatDate(chartData[chartData.length - 1]?.date || 0) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- X-axis label -->
          <div class="text-2xs sm:text-xs text-center font-semibold text-muted-foreground mt-2 sm:mt-3 tracking-wider">
            TEST DATE
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
