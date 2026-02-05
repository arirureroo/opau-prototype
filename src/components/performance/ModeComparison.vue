<script setup lang="ts">
import { Target, Zap, Hash } from 'lucide-vue-next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ModeStats } from '@/composables/performance'

interface Props {
  rankedStats: ModeStats
  practiceStats: ModeStats
}

const props = defineProps<Props>()

const maxAPM = Math.max(props.rankedStats.bestAPM, props.practiceStats.bestAPM, 35)
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <div>
        <h4 class="text-base sm:text-lg font-semibold">Mode Comparison</h4>
        <p class="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Compare your performance between ranked and practice modes
        </p>
      </div>
    </CardHeader>

    <CardContent>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Ranked Stats -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-purple-600 dark:text-purple-400">Ranked Mode</h4>
            <div class="flex items-center gap-1 text-xs text-muted-foreground">
              <Hash :size="12" />
              <span>{{ rankedStats.totalTests }} tests</span>
            </div>
          </div>

          <div v-if="rankedStats.totalTests > 0" class="space-y-4">
            <!-- Accuracy -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <Target :size="14" class="text-muted-foreground" />
                  <span>Avg Accuracy</span>
                </div>
                <span class="font-semibold tabular-nums">{{ rankedStats.avgAccuracy.toFixed(1) }}%</span>
              </div>
              <Progress :model-value="rankedStats.avgAccuracy" class="h-2" />
            </div>

            <!-- Speed -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <Zap :size="14" class="text-muted-foreground" />
                  <span>Avg Speed</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span class="font-semibold tabular-nums cursor-help">{{ rankedStats.avgAPM.toFixed(1) }} <span class="border-b border-dotted border-muted-foreground/50">APM</span></span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Additions Per Minute</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress :model-value="(rankedStats.avgAPM / maxAPM) * 100" class="h-2" />
            </div>

            <!-- Best Records -->
            <div class="pt-2 border-t border-border/40">
              <p class="text-xs text-muted-foreground mb-2">Personal Bests</p>
              <div class="flex gap-4 text-sm">
                <div>
                  <span class="text-muted-foreground">Accuracy: </span>
                  <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ rankedStats.bestAccuracy.toFixed(1) }}%</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Speed: </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <span class="font-semibold text-blue-600 dark:text-blue-400 cursor-help">{{ rankedStats.bestAPM.toFixed(1) }} <span class="border-b border-dotted border-muted-foreground/50">APM</span></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Additions Per Minute</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-muted-foreground">
            <p class="text-sm">No ranked tests yet</p>
            <p class="text-xs mt-1">Take a ranked test to see your stats</p>
          </div>
        </div>

        <!-- Practice Stats -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-amber-600 dark:text-amber-400">Practice Mode</h4>
            <div class="flex items-center gap-1 text-xs text-muted-foreground">
              <Hash :size="12" />
              <span>{{ practiceStats.totalTests }} tests</span>
            </div>
          </div>

          <div v-if="practiceStats.totalTests > 0" class="space-y-4">
            <!-- Accuracy -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <Target :size="14" class="text-muted-foreground" />
                  <span>Avg Accuracy</span>
                </div>
                <span class="font-semibold tabular-nums">{{ practiceStats.avgAccuracy.toFixed(1) }}%</span>
              </div>
              <Progress :model-value="practiceStats.avgAccuracy" class="h-2" />
            </div>

            <!-- Speed -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <Zap :size="14" class="text-muted-foreground" />
                  <span>Avg Speed</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span class="font-semibold tabular-nums cursor-help">{{ practiceStats.avgAPM.toFixed(1) }} <span class="border-b border-dotted border-muted-foreground/50">APM</span></span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Additions Per Minute</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress :model-value="(practiceStats.avgAPM / maxAPM) * 100" class="h-2" />
            </div>

            <!-- Best Records -->
            <div class="pt-2 border-t border-border/40">
              <p class="text-xs text-muted-foreground mb-2">Personal Bests</p>
              <div class="flex gap-4 text-sm">
                <div>
                  <span class="text-muted-foreground">Accuracy: </span>
                  <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ practiceStats.bestAccuracy.toFixed(1) }}%</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Speed: </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <span class="font-semibold text-blue-600 dark:text-blue-400 cursor-help">{{ practiceStats.bestAPM.toFixed(1) }} <span class="border-b border-dotted border-muted-foreground/50">APM</span></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Additions Per Minute</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-muted-foreground">
            <p class="text-sm">No practice tests yet</p>
            <p class="text-xs mt-1">Take a practice test to see your stats</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
