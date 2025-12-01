<script setup lang="ts">
import { ref } from 'vue'
import type { TimeSeriesDataPoint } from '@/types/test.types'
import { formatXAxisTick } from '@/utils/formatters'
import { chartDimensions, chartStyles, Y_AXIS_LABELS } from '@/constants/chart.constants'
import { chartHeights } from '@/presentation/styles/sizeConstants'
import { useChartCalculations, useChartTheming } from '@/composables/chart'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import ChartTooltip from './chart/ChartTooltip.vue'
import ChartLegend from './chart/ChartLegend.vue'

interface Props {
  data: TimeSeriesDataPoint[]
}

const props = defineProps<Props>()
const dataRef = ref(props.data)

const hoveredIndex = ref<number | null>(null)

const { maxTime, polylinePoints, areaPath, getPointX, getPointY, getOverlayPosition } =
  useChartCalculations(dataRef)

const { areaGradientId, strokeColor, strokeOpacity, lightGradient, darkGradient } =
  useChartTheming()
</script>

<template>
  <Card class="w-full">
    <CardHeader class="pb-3">
      <div>
        <h4 class="text-base sm:text-lg font-semibold">Accuracy Over Time</h4>
        <p class="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Hover over points to see details
        </p>
      </div>
    </CardHeader>

    <CardContent>
      <div class="flex gap-2 sm:gap-4">
        <div class="hidden sm:flex items-center justify-center w-5">
          <div
            class="transform -rotate-90 text-2xs font-semibold text-muted-foreground whitespace-nowrap tracking-wider"
          >
            ACCURACY %
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex gap-2 sm:gap-3">
            <div :class="['flex flex-col justify-between', chartHeights.md]">
              <div
                v-for="label in Y_AXIS_LABELS"
                :key="label"
                class="flex items-center gap-1 sm:gap-1.5"
              >
                <span class="text-2xs sm:text-xs w-grid-cell sm:w-8 font-medium text-muted-foreground text-right">
                  {{ label }}
                </span>
                <div class="w-1 sm:w-1.5 h-px bg-border"></div>
              </div>
            </div>

            <div class="flex-1 relative">
              <div
                :class="['absolute inset-0 flex flex-col justify-between pointer-events-none', chartHeights.md]"
              >
                <div
                  v-for="i in chartDimensions.Y_AXIS_DIVISIONS"
                  :key="i"
                  class="border-t"
                  :class="i === 1 || i === chartDimensions.Y_AXIS_DIVISIONS ? 'border-border' : 'border-border/40'"
                ></div>
              </div>

              <div :class="['relative overflow-hidden', chartHeights.md]">
                <svg
                  class="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="areaGradientLight" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" :stop-color="lightGradient.startColor" :stop-opacity="lightGradient.startOpacity" />
                      <stop offset="100%" :stop-color="lightGradient.endColor" :stop-opacity="lightGradient.endOpacity" />
                    </linearGradient>

                    <linearGradient id="areaGradientDark" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" :stop-color="darkGradient.startColor" :stop-opacity="darkGradient.startOpacity" />
                      <stop offset="100%" :stop-color="darkGradient.endColor" :stop-opacity="darkGradient.endOpacity" />
                    </linearGradient>

                    <clipPath id="chartClip">
                      <rect x="0" y="0" width="100" height="100" />
                    </clipPath>
                  </defs>

                  <path
                    :d="areaPath"
                    :fill="`url(#${areaGradientId})`"
                    class="transition-opacity duration-200"
                    :class="hoveredIndex !== null ? 'opacity-100' : 'opacity-70'"
                    clip-path="url(#chartClip)"
                  />

                  <polyline
                    :points="polylinePoints"
                    fill="none"
                    :stroke="strokeColor"
                    :stroke-opacity="strokeOpacity"
                    :stroke-width="hoveredIndex !== null ? chartStyles.STROKE_WIDTH_HOVERED : chartStyles.STROKE_WIDTH_DEFAULT"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    vector-effect="non-scaling-stroke"
                    class="transition-all duration-200 drop-shadow-sm"
                    clip-path="url(#chartClip)"
                  />

                  <g v-for="(point, index) in data" :key="index" clip-path="url(#chartClip)">
                    <circle
                      :cx="getPointX(point)"
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

              <div
                :class="['absolute inset-0 pointer-events-none', chartHeights.md]"
              >
                <div
                  v-for="(point, index) in data"
                  v-show="hoveredIndex === index"
                  :key="`dot-${index}`"
                  class="absolute transition-all duration-150"
                  :style="{
                    ...getOverlayPosition(point),
                    transform: 'translate(-50%, -50%)'
                  }"
                >
                  <div
                    :class="`w-${chartStyles.DOT_RADIUS} h-${chartStyles.DOT_RADIUS}`"
                    class="rounded-full ring-2 ring-background shadow-md"
                    :style="{ backgroundColor: strokeColor, opacity: strokeOpacity }"
                  ></div>
                </div>

                <div
                  v-for="(point, index) in data"
                  v-show="hoveredIndex === index"
                  :key="`tooltip-${index}`"
                  class="absolute z-30"
                  :style="getOverlayPosition(point)"
                >
                  <ChartTooltip
                    :point="point"
                    :index="index"
                    :max-time="maxTime"
                    :stroke-color="strokeColor"
                    :stroke-opacity="strokeOpacity"
                    :data="data"
                  />
                </div>
              </div>

              <div class="mt-2 sm:mt-2.5">
                <div class="flex justify-between">
                  <div v-for="i in chartDimensions.X_AXIS_DIVISIONS" :key="i" class="flex flex-col items-center">
                    <div class="w-px h-1.5 sm:h-2 bg-border"></div>
                    <span class="text-3xs sm:text-2xs font-medium text-muted-foreground mt-0.5 sm:mt-1">
                      {{ formatXAxisTick(maxTime, i) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-2xs sm:text-xs text-center font-semibold text-muted-foreground mt-2 sm:mt-3 tracking-wider">
            TIME ELAPSED ({{ maxTime >= 60 ? 'MM:SS' : 'SECONDS' }})
          </div>
        </div>
      </div>

      <ChartLegend :stroke-color="strokeColor" :stroke-opacity="strokeOpacity" />
    </CardContent>
  </Card>
</template>
