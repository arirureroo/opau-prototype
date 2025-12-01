<script setup lang="ts">
import type { TestResult } from '@/types/test.types'
import { formatAPM, formatDurationMinutes } from '@/utils/formatters'
import { interpretAccuracy, interpretSpeed } from '@/domain/pauli/interpretations/PauliInterpreter'
import { Clock, Zap, Target, CheckCircle } from 'lucide-vue-next'
import LevelBadge from '@/components/LevelBadge.vue'

interface Props {
  results: TestResult
}

const props = defineProps<Props>()

const accuracyLevel = interpretAccuracy(props.results.accuracy)
const speedLevel = props.results.apm ? interpretSpeed(props.results.apm) : 'Poor'
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="group relative p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200">
      <div class="flex items-center gap-2 mb-3">
        <div class="p-2 rounded-lg bg-muted/50">
          <Clock :size="18" class="text-muted-foreground" />
        </div>
        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Duration</span>
      </div>
      <p class="text-3xl sm:text-4xl font-bold tracking-tight tabular-nums">
        {{ formatDurationMinutes(results.durationMs) }}
      </p>
    </div>

    <div class="group relative p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="p-2 rounded-lg bg-muted/50">
            <Zap :size="18" class="text-muted-foreground" />
          </div>
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Panker</span>
        </div>
        <LevelBadge :level="speedLevel" />
      </div>
      <div class="flex items-baseline gap-1">
        <p class="text-3xl sm:text-4xl font-bold tracking-tight tabular-nums">
          {{ formatAPM(results.apm) }}
        </p>
        <span class="text-xs text-muted-foreground">APM</span>
      </div>
      <p class="text-xs text-muted-foreground mt-1">
        Addition per Minute
      </p>
    </div>

    <div class="group relative p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200">
      <div class="flex items-center gap-2 mb-3">
        <div class="p-2 rounded-lg bg-muted/50">
          <CheckCircle :size="18" class="text-muted-foreground" />
        </div>
        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Answers</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-3xl sm:text-4xl font-bold tracking-tight tabular-nums text-emerald-600 dark:text-emerald-400">{{ results.totalCorrect }}</span>
        <span class="text-lg text-muted-foreground/40">/</span>
        <span class="text-xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">{{ results.totalChanged }}</span>
        <span class="text-lg text-muted-foreground/40">/</span>
        <span class="text-xl font-semibold tabular-nums text-rose-600 dark:text-rose-400">{{ results.totalWrong }}</span>
      </div>
      <p class="text-xs text-muted-foreground mt-1">
        Correct / Wrong / Changed
      </p>
    </div>

    <div class="group relative p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="p-2 rounded-lg bg-muted/50">
            <Target :size="18" class="text-muted-foreground" />
          </div>
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tianker</span>
        </div>
        <LevelBadge :level="accuracyLevel" />
      </div>
      <div class="flex items-baseline gap-1">
        <p class="text-3xl sm:text-4xl font-bold tracking-tight tabular-nums">
          {{ results.accuracy.toFixed(1) }}
        </p>
        <span class="text-xs text-muted-foreground">%</span>
      </div>
      <p class="text-xs text-muted-foreground mt-1">
        {{ results.totalAnswered }} of {{ results.totalQuestions }} answered
      </p>
    </div>
  </div>
</template>
