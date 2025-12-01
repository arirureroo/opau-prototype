<script setup lang="ts">
import type { GridResult } from '@/types/test.types'
import { cn } from '@/lib/utils'
import { isLastOrFirstRow } from '@/utils/gridHelpers'
import { CheckCircle2, XCircle, RefreshCw, Minus } from 'lucide-vue-next'

interface Props {
  gridResult: GridResult
}

const props = defineProps<Props>()

const getCellAnswer = (cellIndex: number) => {
  return props.gridResult.answers.find(answer => answer.cellIndex === cellIndex)
}
</script>

<template>
  <div class="rounded-xl border border-border/40 bg-card overflow-hidden">
    <div class="flex items-center justify-between p-4 border-b border-border/40 bg-muted/20">
      <h3 class="text-base font-semibold">Grid {{ gridResult.gridIndex + 1 }}</h3>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5 text-sm">
          <CheckCircle2 :size="14" class="text-emerald-500" />
          <span class="font-medium tabular-nums">{{ gridResult.correctCount }}</span>
        </div>
        <div class="flex items-center gap-1.5 text-sm">
          <RefreshCw :size="14" class="text-amber-500" />
          <span class="font-medium tabular-nums">{{ gridResult.changedCount }}</span>
        </div>
        <div class="flex items-center gap-1.5 text-sm">
          <XCircle :size="14" class="text-rose-500" />
          <span class="font-medium tabular-nums">{{ gridResult.wrongCount }}</span>
        </div>
      </div>
    </div>

    <div class="p-4">
      <div class="hidden md:flex overflow-x-auto py-2 px-2">
        <div
          class="w-fit h-fit grid grid-flow-col gap-x-4 mx-auto"
          :style="{ gridTemplateRows: `repeat(${gridResult.rows}, minmax(0, 1fr))` }"
        >
          <div
            v-for="(n, i) in gridResult.questions"
            :key="i"
            class="flex flex-col"
            :class="isLastOrFirstRow(i, gridResult.rows) ? 'h-fit' : 'h-full justify-between'"
          >
            <div class="flex items-start">
              <p class="text-xs font-medium w-3 text-muted-foreground">{{ n }}</p>
            </div>

            <div
              v-if="!isLastOrFirstRow(i, gridResult.rows)"
              class="flex items-end ml-4"
            >
              <div
                class="relative w-9 h-8 rounded-md border flex items-center justify-center text-xs font-semibold transition-all"
                :class="
                  cn(
                    getCellAnswer(i)
                      ? getCellAnswer(i)?.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300'
                      : 'bg-muted/30 border-border/40 text-muted-foreground/50'
                  )
                "
              >
                <span v-if="getCellAnswer(i)">
                  {{ getCellAnswer(i)?.userAnswer }}
                </span>
                <Minus v-else :size="12" class="opacity-30" />

                <div
                  v-if="getCellAnswer(i)?.isChanged"
                  class="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full flex items-center justify-center bg-amber-500 shadow-sm"
                >
                  <RefreshCw :size="8" class="text-white" />
                </div>

                <div
                  v-if="getCellAnswer(i) && !getCellAnswer(i)?.isCorrect"
                  :class="['absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center font-bold bg-card border-2 border-rose-500/60 text-rose-600 dark:text-rose-400 shadow-sm text-2xs']"
                >
                  {{ getCellAnswer(i)?.expectedAnswer }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="md:hidden flex items-center justify-center py-8 text-muted-foreground">
        <p class="text-sm text-center">Grid visualization is available on larger screens.</p>
      </div>

      <div v-if="gridResult.answers.length === 0" class="flex items-center justify-center py-8">
        <p class="text-sm text-muted-foreground">No answers submitted for this grid</p>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-4 px-4 py-3 border-t border-border/40 bg-muted/10 text-xs text-muted-foreground">
      <div class="flex items-center gap-2">
        <div :class="['w-7 h-6 rounded border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-semibold text-2xs']">7</div>
        <span>Correct</span>
      </div>
      <div class="flex items-center gap-2">
        <div :class="['relative w-7 h-6 rounded border border-rose-500/40 bg-rose-500/10 flex items-center justify-center text-rose-700 dark:text-rose-300 font-semibold text-2xs']">
          3
          <div :class="['absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center font-bold bg-card border-2 border-rose-500/60 text-rose-600 dark:text-rose-400 text-3xs']">5</div>
        </div>
        <span>Wrong</span>
      </div>
      <div class="flex items-center gap-2">
        <div :class="['relative w-7 h-6 rounded border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-semibold text-2xs']">
          8
          <div class="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full flex items-center justify-center bg-amber-500 shadow-sm">
            <RefreshCw :size="8" class="text-white" />
          </div>
        </div>
        <span>Changed</span>
      </div>
    </div>
  </div>
</template>
