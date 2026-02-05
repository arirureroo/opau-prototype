<script setup lang="ts">
import { Hash, Target, Zap, Trophy } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Props {
  totalTests: number
  averageAccuracy: number
  averageAPM: number
  rankedCount: number
  practiceCount: number
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="group p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200">
      <div class="flex items-center gap-2 mb-3">
        <div class="p-2 rounded-lg bg-muted/50">
          <Hash :size="18" class="text-muted-foreground" />
        </div>
        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Tests</span>
      </div>
      <p class="text-3xl font-bold tabular-nums tracking-tight">{{ totalTests }}</p>
    </div>

    <div class="group p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200">
      <div class="flex items-center gap-2 mb-3">
        <div class="p-2 rounded-lg bg-muted/50">
          <Target :size="18" class="text-muted-foreground" />
        </div>
        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg Accuracy</span>
      </div>
      <div class="flex items-baseline gap-1">
        <p class="text-3xl font-bold tabular-nums tracking-tight">
          {{ totalTests > 0 ? averageAccuracy.toFixed(1) : '0' }}
        </p>
        <span class="text-sm text-muted-foreground">%</span>
      </div>
    </div>

    <TooltipProvider>
      <div class="group p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200">
        <div class="flex items-center gap-2 mb-3">
          <div class="p-2 rounded-lg bg-muted/50">
            <Zap :size="18" class="text-muted-foreground" />
          </div>
          <Tooltip>
            <TooltipTrigger as-child>
              <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-help border-b border-dotted border-muted-foreground/50">Avg APM</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Additions Per Minute</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p class="text-3xl font-bold tabular-nums tracking-tight">
          {{ totalTests > 0 ? averageAPM.toFixed(1) : '0' }}
        </p>
      </div>
    </TooltipProvider>

    <div class="group p-5 rounded-xl bg-card border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200">
      <div class="flex items-center gap-2 mb-3">
        <div class="p-2 rounded-lg bg-muted/50">
          <Trophy :size="18" class="text-muted-foreground" />
        </div>
        <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">By Mode</span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold tabular-nums tracking-tight text-purple-600 dark:text-purple-400">{{ rankedCount }}</span>
        <span class="text-muted-foreground/40 text-xl">/</span>
        <span class="text-3xl font-bold tabular-nums tracking-tight text-amber-600 dark:text-amber-400">{{ practiceCount }}</span>
      </div>
      <p class="text-xs text-muted-foreground mt-1">Ranked / Practice</p>
    </div>
  </div>
</template>
