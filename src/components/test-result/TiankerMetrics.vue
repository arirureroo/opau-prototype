<script setup lang="ts">
import type { TestResult } from '@/types/test.types'
import { interpretAccuracy, getAccuracyExplanation } from '@/domain/pauli/interpretations/PauliInterpreter'
import { accuracyThresholdDisplays } from '@/presentation/pauli/thresholds/accuracyThresholds'
import { getBadgeVariant } from '@/presentation/shared/badge/badgeVariants'
import { Progress } from '@/components/ui/progress'
import MetricCard from '@/components/MetricCard.vue'
import ThresholdLegend from '@/components/ThresholdLegend.vue'
import { CheckCircle2, XCircle, RefreshCw, Info } from 'lucide-vue-next'

interface Props {
  results: TestResult
}

const props = defineProps<Props>()

const accuracyLevel = interpretAccuracy(props.results.accuracy)

const errorRate = props.results.totalAnswered > 0
  ? ((props.results.totalWrong / props.results.totalAnswered) * 100)
  : 0
</script>

<template>
  <MetricCard
    title="Accuracy Analysis"
    subtitle="Tianker • Correctness and precision"
    :badge-label="accuracyLevel"
    :badge-variant="getBadgeVariant(accuracyLevel)"
  >
    <div class="flex flex-col items-center py-4">
      <div class="text-6xl font-bold tabular-nums tracking-tight">
        {{ results.accuracy.toFixed(1) }}<span :class="['text-3xl text-muted-foreground']">%</span>
      </div>
      <p :class="['text-sm mt-2 text-muted-foreground']">Overall Accuracy</p>
      <Progress :model-value="results.accuracy" class="h-2 w-full max-w-xs mt-4" />
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div :class="['rounded-lg bg-emerald-500/5 border-emerald-500/20 p-4 border']">
        <div :class="['flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400']">
          <CheckCircle2 :size="16" />
          <span class="text-xs font-medium uppercase tracking-wide">Correct</span>
        </div>
        <p class="text-2xl font-bold tabular-nums">{{ results.totalCorrect }}</p>
        <p :class="['text-xs mt-1 text-muted-foreground']">
          {{ ((results.totalCorrect / results.totalAnswered) * 100).toFixed(1) }}%
        </p>
      </div>

      <div :class="['rounded-lg bg-amber-500/5 border-amber-500/20 p-4 border']">
        <div :class="['flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400']">
          <RefreshCw :size="16" />
          <span class="text-xs font-medium uppercase tracking-wide">Changed</span>
        </div>
        <p class="text-2xl font-bold tabular-nums">{{ results.totalChanged }}</p>
        <p :class="['text-xs mt-1 text-muted-foreground']">
          {{ ((results.totalChanged / results.totalAnswered) * 100).toFixed(1) }}%
        </p>
      </div>

      <div :class="['rounded-lg bg-rose-500/5 border-rose-500/20 p-4 border']">
        <div :class="['flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-400']">
          <XCircle :size="16" />
          <span class="text-xs font-medium uppercase tracking-wide">Wrong</span>
        </div>
        <p class="text-2xl font-bold tabular-nums">{{ results.totalWrong }}</p>
        <p :class="['text-xs mt-1 text-muted-foreground']">
          {{ errorRate.toFixed(1) }}% error rate
        </p>
      </div>
    </div>

    <div :class="['rounded-lg bg-muted/30 flex items-start gap-3 p-4']">
      <Info :size="16" :class="['text-muted-foreground shrink-0 mt-0.5']" />
      <p :class="['text-sm text-muted-foreground']">
        {{ getAccuracyExplanation(accuracyLevel) }}
      </p>
    </div>

    <ThresholdLegend :thresholds="accuracyThresholdDisplays" />
  </MetricCard>
</template>
