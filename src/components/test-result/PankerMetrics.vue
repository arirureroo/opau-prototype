<script setup lang="ts">
import type { TestResult } from '@/types/test.types'
import { interpretSpeed, getSpeedExplanation } from '@/domain/pauli/interpretations/PauliInterpreter'
import { speedThressholdDisplays } from '@/presentation/pauli/thresholds/speedThresholds'
import { getBadgeVariant } from '@/presentation/shared/badge/badgeVariants'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import MetricCard from '@/components/MetricCard.vue'
import ThresholdLegend from '@/components/ThresholdLegend.vue'
import { formatAPM, formatDurationMinutes } from '@/utils/formatters'
import { Clock, Hash, Timer, Info, TrendingUp } from 'lucide-vue-next'
import { PerformanceLevel } from '@/types/pauli.types'

interface Props {
  results: TestResult
}

const props = defineProps<Props>()

const speedLevel = props.results.apm ? interpretSpeed(props.results.apm) : PerformanceLevel.POOR

const avgTimePerAnswer = props.results.durationMs && props.results.totalAnswered > 0
  ? (props.results.durationMs / props.results.totalAnswered) / 1000
  : 0
</script>

<template>
  <MetricCard
    title="Speed Analysis"
    subtitle="Panker • Work rate and tempo"
    :badge-label="speedLevel"
    :badge-variant="getBadgeVariant(speedLevel)"
  >

    <div class="flex flex-col items-center py-4">
      <div class="text-6xl font-bold tabular-nums tracking-tight">
        {{ formatAPM(results.apm) }}
      </div>
      <p :class="['text-sm mt-2 text-muted-foreground']">Additions Per Minute</p>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div :class="['rounded-lg bg-muted/30 border-border/30 p-4 border']">
        <div :class="['flex items-center gap-2 mb-2 text-muted-foreground']">
          <Clock :size="16" />
          <span class="text-xs font-medium uppercase tracking-wide">Duration</span>
        </div>
        <p class="text-2xl font-bold tabular-nums">{{ formatDurationMinutes(results.durationMs) }}</p>
      </div>

      <div :class="['rounded-lg bg-muted/30 border-border/30 p-4 border']">
        <div :class="['flex items-center gap-2 mb-2 text-muted-foreground']">
          <Hash :size="16" />
          <span class="text-xs font-medium uppercase tracking-wide">Answers</span>
        </div>
        <p class="text-2xl font-bold tabular-nums">{{ results.totalAnswered }}</p>
        <p :class="['text-xs mt-1 text-muted-foreground']">
          of {{ results.totalQuestions }}
        </p>
      </div>

      <div :class="['rounded-lg bg-muted/30 border-border/30 p-4 border']">
        <div :class="['flex items-center gap-2 mb-2 text-muted-foreground']">
          <Timer :size="16" />
          <span class="text-xs font-medium uppercase tracking-wide">Avg Time</span>
        </div>
        <p class="text-2xl font-bold tabular-nums">{{ avgTimePerAnswer.toFixed(1) }}s</p>
        <p :class="['text-xs mt-1 text-muted-foreground']">per answer</p>
      </div>
    </div>

    <div v-if="results.grids.length > 1" class="space-y-3">
      <div class="flex items-center gap-2">
        <TrendingUp :size="16" :class="'text-muted-foreground'" />
        <h4 class="text-sm font-medium">Speed Per Grid</h4>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        <div
          v-for="grid in results.grids"
          :key="grid.gridIndex"
          :class="['rounded-lg bg-muted/20 border-border/30 p-3 border']"
        >
          <div class="flex justify-between items-center mb-1">
            <span :class="['text-xs text-muted-foreground']">Grid {{ grid.gridIndex + 1 }}</span>
            <Badge variant="outline" class="text-2xs h-4 px-1.5">
              {{ grid.totalAnswered }}
            </Badge>
          </div>
          <p class="text-lg font-semibold tabular-nums">
            {{ formatAPM(grid.apm) }}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <span :class="['text-xs font-normal text-muted-foreground cursor-help border-b border-dotted border-muted-foreground/50']">APM</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Additions Per Minute</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
        </div>
      </div>
    </div>

    <div :class="['rounded-lg bg-muted/30 flex items-start gap-3 p-4']">
      <Info :size="16" :class="['text-muted-foreground shrink-0 mt-0.5']" />
      <p :class="['text-sm text-muted-foreground']">
        {{ getSpeedExplanation(speedLevel) }}
      </p>
    </div>

    <ThresholdLegend :thresholds="speedThressholdDisplays" />
  </MetricCard>
</template>
