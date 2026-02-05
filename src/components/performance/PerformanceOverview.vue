<script setup lang="ts">
import { Hash, Target, Zap, CheckCircle, TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
import type { PerformanceStats } from '@/composables/performance'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Props {
  stats: PerformanceStats
}

defineProps<Props>()

const getImprovementIcon = (value: number) => {
  if (value > 0.5) return TrendingUp
  if (value < -0.5) return TrendingDown
  return Minus
}

const getImprovementClass = (value: number) => {
  if (value > 0.5) return 'text-emerald-600 dark:text-emerald-400'
  if (value < -0.5) return 'text-rose-600 dark:text-rose-400'
  return 'text-muted-foreground'
}

const formatImprovement = (value: number) => {
  if (Math.abs(value) < 0.1) return '0'
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(1)}`
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Tests -->
      <div
        class="group p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200"
      >
        <div class="flex items-center gap-2 mb-3">
          <div class="p-2 rounded-lg bg-muted/50">
            <Hash :size="18" class="text-muted-foreground" />
          </div>
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >Total Tests</span
          >
        </div>
        <p class="text-3xl font-bold tabular-nums tracking-tight">{{ stats.totalTests }}</p>
        <p class="text-xs text-muted-foreground mt-1">
          {{ stats.totalAnswered.toLocaleString() }} questions answered
        </p>
      </div>

      <!-- Average Accuracy -->
      <div
        class="group p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200"
      >
        <div class="flex items-center gap-2 mb-3">
          <div class="p-2 rounded-lg bg-muted/50">
            <Target :size="18" class="text-muted-foreground" />
          </div>
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >Avg Accuracy</span
          >
        </div>
        <div class="flex items-baseline gap-1">
          <p class="text-3xl font-bold tabular-nums tracking-tight">
            {{ stats.totalTests > 0 ? stats.avgAccuracy.toFixed(1) : '0' }}
          </p>
          <span class="text-sm text-muted-foreground">%</span>
        </div>
        <div
          v-if="stats.totalTests >= 6"
          class="flex items-center gap-1 mt-1"
          :class="getImprovementClass(stats.recentImprovement.accuracy)"
        >
          <component :is="getImprovementIcon(stats.recentImprovement.accuracy)" :size="14" />
          <span class="text-xs">{{ formatImprovement(stats.recentImprovement.accuracy) }}%</span>
          <span class="text-xs text-muted-foreground">recent</span>
        </div>
      </div>

      <!-- Average APM -->
      <TooltipProvider>
        <div
          class="group p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200"
        >
          <div class="flex items-center gap-2 mb-3">
            <div class="p-2 rounded-lg bg-muted/50">
              <Zap :size="18" class="text-muted-foreground" />
            </div>
            <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >Avg Speed</span
            >
          </div>
          <div class="flex items-baseline gap-1">
            <p class="text-3xl font-bold tabular-nums tracking-tight">
              {{ stats.totalTests > 0 ? stats.avgAPM.toFixed(1) : '0' }}
            </p>
            <Tooltip>
              <TooltipTrigger as-child>
                <span class="text-sm text-muted-foreground cursor-help border-b border-dotted border-muted-foreground/50">APM</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Additions Per Minute</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div
            v-if="stats.totalTests >= 6"
            class="flex items-center gap-1 mt-1"
            :class="getImprovementClass(stats.recentImprovement.apm)"
          >
            <component :is="getImprovementIcon(stats.recentImprovement.apm)" :size="14" />
            <span class="text-xs">{{ formatImprovement(stats.recentImprovement.apm) }}</span>
            <span class="text-xs text-muted-foreground">recent</span>
          </div>
        </div>
      </TooltipProvider>

      <!-- Total Correct -->
      <div
        class="group p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200"
      >
        <div class="flex items-center gap-2 mb-3">
          <div class="p-2 rounded-lg bg-muted/50">
            <CheckCircle :size="18" class="text-muted-foreground" />
          </div>
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >All-time Score</span
          >
        </div>
        <div class="flex items-center gap-2">
          <span
            class="text-3xl font-bold tracking-tight tabular-nums text-emerald-600 dark:text-emerald-400"
            >{{ stats.totalCorrect.toLocaleString() }}</span
          >
          <span class="text-lg text-muted-foreground/40">/</span>
          <span
            class="text-xl font-semibold tabular-nums text-rose-600 dark:text-rose-400"
            >{{ stats.totalWrong.toLocaleString() }}</span
          >
        </div>
        <p class="text-xs text-muted-foreground mt-1">Correct / Wrong</p>
      </div>
    </div>
  </div>
</template>
