<script setup lang="ts">
import { computed } from 'vue'
import { formatAPM } from '@/utils/formatters'
import { calculateTrend, getTrendSymbol, formatDelta } from '@/core/calculations/trendCalculations'
import { getTrendDataAttribute } from '@/presentation/styles/trendStyles'

interface PeriodData {
  accuracy: number
  apm: number
  totalAnswered: number
}

interface Period {
  label: string
  data: PeriodData
}

interface Props {
  periods: Period[]
}

const props = defineProps<Props>()

const periodsWithTrends = computed(() => {
  return props.periods.map((period, index) => {
    if (index === 0) {
      return { ...period, index, trends: null }
    }

    const prev = props.periods[index - 1].data
    return {
      ...period,
      index,
      trends: {
        accuracy: calculateTrend(period.data.accuracy, prev.accuracy),
        apm: calculateTrend(period.data.apm, prev.apm),
      }
    }
  })
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div
      v-for="periodData in periodsWithTrends"
      :key="periodData.label"
      class="bg-muted/10 p-5 rounded-2xl transition-all duration-300 hover:bg-muted/30"
    >
      <div class="flex items-baseline gap-2 pb-5">
        <span class="text-sm font-bold uppercase tracking-wider">
          {{ periodData.label }}
        </span>
      </div>

      <div class="space-y-3">
        <div class="bg-muted/30 p-3 rounded-lg">
          <div class="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
            Accuracy
          </div>
          <div class="flex items-baseline gap-2 flex-wrap">
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-extrabold tabular-nums leading-none">
                {{ periodData.data.accuracy.toFixed(1) }}
              </span>
              <span class="text-lg text-muted-foreground font-bold">%</span>
            </div>
            <span
              v-if="periodData.trends"
              v-bind="getTrendDataAttribute(periodData.trends.accuracy.direction)"
              class="text-sm px-2.5 py-1 rounded-md font-bold inline-flex items-center gap-1"
            >
              {{ getTrendSymbol(periodData.trends.accuracy.direction) }}
              {{ formatDelta(periodData.trends.accuracy.delta, true) }}
            </span>
          </div>
        </div>

        <div class="bg-muted/30 p-3 rounded-lg">
          <div class="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
            APM
          </div>
          <div class="flex items-baseline gap-2 flex-wrap">
            <span class="text-4xl font-extrabold tabular-nums leading-none">
              {{ formatAPM(periodData.data.apm) }}
            </span>
            <span
              v-if="periodData.trends"
              v-bind="getTrendDataAttribute(periodData.trends.apm.direction)"
              class="text-sm px-2.5 py-1 rounded-md font-bold inline-flex items-center gap-1"
            >
              {{ getTrendSymbol(periodData.trends.apm.direction) }}
              {{ formatDelta(periodData.trends.apm.delta, false) }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-5 pt-4">
        <div class="text-2xs text-muted-foreground/60 uppercase tracking-wider">
          {{ periodData.data.totalAnswered }} Answers
        </div>
      </div>
    </div>
  </div>
</template>
