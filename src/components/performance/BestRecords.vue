<script setup lang="ts">
import { ref, computed } from 'vue'
import { Target, Zap, Calendar } from 'lucide-vue-next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { BestRecord, PerformanceTrendPoint } from '@/composables/performance'
import { Mode } from '@/types/test.types'

interface Props {
  bestAccuracy: BestRecord | null
  bestAPM: BestRecord | null
  worstAccuracy: BestRecord | null
  worstAPM: BestRecord | null
  trends: PerformanceTrendPoint[]
}

const props = defineProps<Props>()

const selectedMode = ref<'all' | Mode>('all')

const filteredRecords = computed(() => {
  const trends = selectedMode.value === 'all'
    ? props.trends
    : props.trends.filter((t) => t.mode === selectedMode.value)

  if (trends.length === 0) {
    return {
      bestAccuracy: null,
      bestAPM: null,
      worstAccuracy: null,
      worstAPM: null,
    }
  }

  const sortedByAccuracy = [...trends].sort((a, b) => b.accuracy - a.accuracy)
  const sortedByAPM = [...trends].sort((a, b) => b.apm - a.apm)

  const best = sortedByAccuracy[0]
  const worst = sortedByAccuracy[sortedByAccuracy.length - 1]
  const bestSpeed = sortedByAPM[0]
  const worstSpeed = sortedByAPM[sortedByAPM.length - 1]

  return {
    bestAccuracy: {
      value: best.accuracy,
      testId: best.testId,
      date: best.date,
      mode: best.mode,
    },
    bestAPM: {
      value: bestSpeed.apm,
      testId: bestSpeed.testId,
      date: bestSpeed.date,
      mode: bestSpeed.mode,
    },
    worstAccuracy: {
      value: worst.accuracy,
      testId: worst.testId,
      date: worst.date,
      mode: worst.mode,
    },
    worstAPM: {
      value: worstSpeed.apm,
      testId: worstSpeed.testId,
      date: worstSpeed.date,
      mode: worstSpeed.mode,
    },
  }
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 class="text-base sm:text-lg font-semibold">Personal Records</h4>
          <p class="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your best and lowest scores across all tests
          </p>
        </div>
        <Tabs v-model="selectedMode" class="w-auto">
          <TabsList class="h-8">
            <TabsTrigger value="all" class="text-xs px-2.5">All</TabsTrigger>
            <TabsTrigger value="ranked" class="text-xs px-2.5">Ranked</TabsTrigger>
            <TabsTrigger value="practice" class="text-xs px-2.5">Practice</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </CardHeader>

    <CardContent class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Best Accuracy -->
        <div
          class="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-3"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Target :size="16" class="text-emerald-600 dark:text-emerald-400" />
              <span class="text-sm font-medium">Best Accuracy</span>
            </div>
            <Badge
              v-if="filteredRecords.bestAccuracy && selectedMode === 'all'"
              variant="outline"
              class="text-2xs capitalize"
            >
              {{ filteredRecords.bestAccuracy.mode }}
            </Badge>
          </div>
          <div v-if="filteredRecords.bestAccuracy">
            <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {{ filteredRecords.bestAccuracy.value.toFixed(1) }}%
            </p>
            <div class="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Calendar :size="12" />
              <span>{{ formatDate(filteredRecords.bestAccuracy.date) }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">No {{ selectedMode === 'all' ? '' : selectedMode }} tests yet</p>
        </div>

        <!-- Best Speed -->
        <div
          class="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 space-y-3"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Zap :size="16" class="text-blue-600 dark:text-blue-400" />
              <span class="text-sm font-medium">Best Speed</span>
            </div>
            <Badge
              v-if="filteredRecords.bestAPM && selectedMode === 'all'"
              variant="outline"
              class="text-2xs capitalize"
            >
              {{ filteredRecords.bestAPM.mode }}
            </Badge>
          </div>
          <div v-if="filteredRecords.bestAPM">
            <div class="flex items-baseline gap-1">
              <p class="text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {{ filteredRecords.bestAPM.value.toFixed(1) }}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span class="text-sm text-muted-foreground cursor-help border-b border-dotted border-muted-foreground/50">APM</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Additions Per Minute</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div class="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Calendar :size="12" />
              <span>{{ formatDate(filteredRecords.bestAPM.date) }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">No {{ selectedMode === 'all' ? '' : selectedMode }} tests yet</p>
        </div>

        <!-- Lowest Accuracy -->
        <div
          class="p-4 rounded-lg bg-rose-500/5 border border-rose-500/20 space-y-3"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Target :size="16" class="text-rose-600 dark:text-rose-400" />
              <span class="text-sm font-medium">Lowest Accuracy</span>
            </div>
            <Badge
              v-if="filteredRecords.worstAccuracy && selectedMode === 'all'"
              variant="outline"
              class="text-2xs capitalize"
            >
              {{ filteredRecords.worstAccuracy.mode }}
            </Badge>
          </div>
          <div v-if="filteredRecords.worstAccuracy">
            <p class="text-3xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
              {{ filteredRecords.worstAccuracy.value.toFixed(1) }}%
            </p>
            <div class="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Calendar :size="12" />
              <span>{{ formatDate(filteredRecords.worstAccuracy.date) }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">No {{ selectedMode === 'all' ? '' : selectedMode }} tests yet</p>
        </div>

        <!-- Lowest Speed -->
        <div
          class="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-3"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Zap :size="16" class="text-amber-600 dark:text-amber-400" />
              <span class="text-sm font-medium">Lowest Speed</span>
            </div>
            <Badge
              v-if="filteredRecords.worstAPM && selectedMode === 'all'"
              variant="outline"
              class="text-2xs capitalize"
            >
              {{ filteredRecords.worstAPM.mode }}
            </Badge>
          </div>
          <div v-if="filteredRecords.worstAPM">
            <div class="flex items-baseline gap-1">
              <p class="text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {{ filteredRecords.worstAPM.value.toFixed(1) }}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span class="text-sm text-muted-foreground cursor-help border-b border-dotted border-muted-foreground/50">APM</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Additions Per Minute</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div class="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Calendar :size="12" />
              <span>{{ formatDate(filteredRecords.worstAPM.date) }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">No {{ selectedMode === 'all' ? '' : selectedMode }} tests yet</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
