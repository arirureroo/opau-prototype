<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatAPM, formatDurationMinutes } from '@/utils/formatters'
import { useDateFormat } from '@vueuse/core'
import { Trash2, Clock, ArrowRight } from 'lucide-vue-next'
import type { StoredTestResult } from '@/infrastructure/database/TestResultRepository'
import { Mode } from '@/types/test.types'
import ModeBadge from '@/components/ModeBadge.vue'

interface Props {
  testResult: StoredTestResult
}

interface Emits {
  (e: 'view', id: string): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const mode = computed(() => props.testResult.mode ?? Mode.PRACTICE)

const formattedDate = computed(() => {
  const date = props.testResult.endTime || props.testResult.savedAt
  return useDateFormat(date, 'DD MMM YYYY', { locales: 'en-US' }).value
})

const formattedTime = computed(() => {
  const date = props.testResult.endTime || props.testResult.savedAt
  return useDateFormat(date, 'HH:mm', { locales: 'en-US' }).value
})

const handleCardClick = () => {
  emit('view', props.testResult.id)
}

const handleDelete = (e: Event) => {
  e.stopPropagation()
  emit('delete', props.testResult.id)
}
</script>

<template>
  <div
    @click="handleCardClick"
    class="group relative flex flex-col bg-card rounded-xl border border-border/50 hover:border-border hover:shadow-md cursor-pointer transition-all duration-200 overflow-hidden"
  >
    <div class="flex items-center justify-between p-4 pb-3">
      <div class="flex items-center gap-3">
        <div class="flex flex-col">
          <span class="text-base font-semibold">{{ formattedDate }}</span>
          <span class="text-xs text-muted-foreground">{{ formattedTime }}</span>
        </div>
      </div>
      <ModeBadge :mode="mode" />
    </div>

    <div class="px-4 pb-4">
      <div class="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
        <div>
          <p class="text-3xs text-muted-foreground mb-1">Accuracy</p>
          <p class="text-2xl font-bold tabular-nums">
            {{ testResult.accuracy.toFixed(1) }}<span class="text-sm font-normal text-muted-foreground ml-0.5">%</span>
          </p>
        </div>
        <div>
          <p class="text-3xs text-muted-foreground mb-1">Speed</p>
          <TooltipProvider>
            <div class="flex items-baseline">
              <p class="text-2xl font-bold tabular-nums">
                {{ formatAPM(testResult.apm) }}
              </p>
              <Tooltip>
                <TooltipTrigger as-child>
                  <span class="text-sm font-normal text-muted-foreground ml-1 cursor-help border-b border-dotted border-muted-foreground/50">APM</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Additions Per Minute</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>

    <Separator />

    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-4 text-xs text-muted-foreground">
        <span class="flex items-center gap-1.5">
          <Clock :size="12" />
          {{ formatDurationMinutes(testResult.durationMs) }}
        </span>
        <span class="tabular-nums">
          <span class="text-emerald-600 dark:text-emerald-400 font-semibold">{{ testResult.totalCorrect }}</span>
          <span class="mx-1">/</span>
          <span class="text-rose-600 dark:text-rose-400 font-semibold">{{ testResult.totalWrong }}</span>
        </span>
      </div>

      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          @click="handleDelete"
          class="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-opacity"
        >
          <Trash2 :size="14" />
        </Button>
        <ArrowRight :size="16" class="text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  </div>
</template>
