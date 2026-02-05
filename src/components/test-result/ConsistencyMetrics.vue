<script setup lang="ts">
import type { ConsistencyMetrics } from '@/types/test.types'
import { interpretConsistencyCV, getConsistencyExplanation } from '@/domain/pauli/interpretations/PauliInterpreter'
import { Badge } from '@/components/ui/badge'
import { formatAPM } from '@/utils/formatters'
import { Info, Target, Zap } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Props {
  consistency: ConsistencyMetrics
}

const props = defineProps<Props>()

const accuracyLabel = interpretConsistencyCV(props.consistency.accuracyCV)
const speedLabel = interpretConsistencyCV(props.consistency.apmCV)

const getBadgeVariant = (level: string) => {
  switch (level) {
    case 'Excellent':
      return 'default'
    case 'Good':
      return 'secondary'
    case 'Moderate':
      return 'outline'
    default:
      return 'destructive'
  }
}

const thresholds = [
  { label: 'Excellent', max: 5, color: 'bg-emerald-500' },
  { label: 'Good', max: 10, color: 'bg-blue-500' },
  { label: 'Moderate', max: 15, color: 'bg-amber-500' },
  { label: 'Poor', max: 100, color: 'bg-rose-500' },
]
</script>

<template>
  <div class="rounded-xl border border-border/40 bg-card">
    <div class="p-5 border-b border-border/40">
      <div>
        <h3 class="text-lg font-semibold">Consistency Analysis</h3>
        <p class="text-sm text-muted-foreground mt-0.5">Janker • Performance stability across {{ consistency.gridCount }} grids</p>
      </div>
    </div>

    <div class="p-5 space-y-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Target :size="16" class="text-muted-foreground" />
              <span class="text-sm font-medium">Accuracy Consistency</span>
            </div>
            <Badge :variant="getBadgeVariant(accuracyLabel)">
              {{ accuracyLabel }}
            </Badge>
          </div>

          <div class="p-4 rounded-lg bg-muted/30 border border-border/40 space-y-3">
            <div class="flex justify-between items-baseline">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span class="text-xs text-muted-foreground uppercase tracking-wide cursor-help border-b border-dotted border-muted-foreground/50">CV</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coefficient of Variation (lower is better)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span class="text-3xl font-bold tabular-nums">
                {{ consistency.accuracyCV.toFixed(1) }}<span class="text-lg text-muted-foreground">%</span>
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Mean Accuracy</span>
              <span class="font-medium">{{ consistency.meanAccuracy.toFixed(1) }}%</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Std Deviation</span>
              <span class="font-medium">{{ consistency.accuracyStdDev.toFixed(1) }}%</span>
            </div>
          </div>

          <p class="text-xs text-muted-foreground">
            {{ getConsistencyExplanation(accuracyLabel) }}
          </p>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Zap :size="16" class="text-muted-foreground" />
              <span class="text-sm font-medium">Speed Consistency</span>
            </div>
            <Badge :variant="getBadgeVariant(speedLabel)">
              {{ speedLabel }}
            </Badge>
          </div>

          <div class="p-4 rounded-lg bg-muted/30 border border-border/40 space-y-3">
            <div class="flex justify-between items-baseline">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span class="text-xs text-muted-foreground uppercase tracking-wide cursor-help border-b border-dotted border-muted-foreground/50">CV</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coefficient of Variation (lower is better)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span class="text-3xl font-bold tabular-nums">
                {{ consistency.apmCV.toFixed(1) }}<span class="text-lg text-muted-foreground">%</span>
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span class="text-muted-foreground cursor-help border-b border-dotted border-muted-foreground/50">Mean APM</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Additions Per Minute</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span class="font-medium">{{ formatAPM(consistency.meanAPM) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Std Deviation</span>
              <span class="font-medium">{{ consistency.apmStdDev.toFixed(1) }}</span>
            </div>
          </div>

          <p class="text-xs text-muted-foreground">
            {{ getConsistencyExplanation(speedLabel) }}
          </p>
        </div>
      </div>

      <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
        <Info :size="16" class="text-muted-foreground shrink-0 mt-0.5" />
        <p class="text-sm text-muted-foreground">
          Lower CV (Coefficient of Variation) indicates more consistent performance across grids.
          High variability may suggest concentration fluctuations or fatigue patterns.
        </p>
      </div>
      <TooltipProvider>
        <div class="flex items-center gap-4 pt-2">
          <span class="text-xs text-muted-foreground">Thresholds:</span>
          <div class="flex items-center gap-3">
            <Tooltip v-for="threshold in thresholds" :key="threshold.label">
              <TooltipTrigger as-child>
                <div class="flex items-center gap-1.5 cursor-default">
                  <div :class="['w-2 h-2 rounded-full', threshold.color]" />
                  <span class="text-xs text-muted-foreground">{{ threshold.label }}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p v-if="threshold.label === 'Excellent'">&lt; 5% CV</p>
                <p v-else-if="threshold.label === 'Good'">5-9% CV</p>
                <p v-else-if="threshold.label === 'Moderate'">10-14% CV</p>
                <p v-else>≥ 15% CV</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </div>
  </div>
</template>
