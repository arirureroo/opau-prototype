<script setup lang="ts">
import type { EnduranceMetrics } from '@/types/test.types'
import { interpretDegradation, interpretPerformanceChange, getEnduranceExplanation } from '@/domain/pauli/interpretations/PauliInterpreter'
import { degradationThresholdDisplays } from '@/presentation/pauli/thresholds/enduranceThresholds'
import { getBadgeVariant } from '@/presentation/shared/badge/badgeVariants'
import { getThresholdColorClass, formatDegradation } from '@/presentation/shared/colors/statusColors'
import { Info } from 'lucide-vue-next'
import MetricCard from '@/components/MetricCard.vue'
import PeriodComparison from '@/components/PeriodComparison.vue'
import DegradationIndicator from '@/components/DegradationIndicator.vue'
import ThresholdLegend from '@/components/ThresholdLegend.vue'

interface Props {
  endurance: EnduranceMetrics
}

const props = defineProps<Props>()

const accuracyLevel = interpretDegradation(props.endurance.accuracyDegradation)
const accuracyChange = interpretPerformanceChange(props.endurance.accuracyDegradation)

const speedLevel = interpretDegradation(props.endurance.speedDegradation)
const speedChange = interpretPerformanceChange(props.endurance.speedDegradation)

const periods = [
  { label: 'Early', data: props.endurance.earlyPeriod },
  { label: 'Middle', data: props.endurance.middlePeriod },
  { label: 'Late', data: props.endurance.latePeriod },
]
</script>

<template>
  <MetricCard
    title="Endurance Analysis"
    subtitle="Hanker • Fatigue detection and performance sustainability"
  >
    <PeriodComparison :periods="periods" />

    <div class="grid md:grid-cols-2 gap-4">
      <DegradationIndicator
        label="Accuracy Degradation"
        :degradation-percent="endurance.accuracyDegradation"
        :level="accuracyLevel"
        :change="accuracyChange"
        :badge-variant="getBadgeVariant(accuracyLevel)"
      />

      <DegradationIndicator
        label="Speed Degradation"
        :degradation-percent="endurance.speedDegradation"
        :level="speedLevel"
        :change="speedChange"
        :badge-variant="getBadgeVariant(speedLevel)"
      />
    </div>

    <div class="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
      <span class="text-sm text-muted-foreground">Error Rate Change</span>
      <span
        :class="['text-sm font-semibold tabular-nums', getThresholdColorClass(endurance.errorRateIncrease, 20, true)]"
      >
        {{ formatDegradation(endurance.errorRateIncrease) }}
      </span>
    </div>

    <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
      <Info :size="16" class="text-muted-foreground shrink-0 mt-0.5" />
      <p class="text-sm text-muted-foreground">
        {{ getEnduranceExplanation(accuracyLevel) }} Negative values indicate improvement (learning effect).
      </p>
    </div>

    <ThresholdLegend
      :thresholds="degradationThresholdDisplays"
      label="Degradation thresholds:"
    />
  </MetricCard>
</template>
