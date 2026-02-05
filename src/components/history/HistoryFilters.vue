<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { SlidersHorizontal, X, ArrowDownAZ, ArrowUpAZ } from 'lucide-vue-next'
import { Mode } from '@/types/test.types'
import { SortOrder, FilterType, SortBy } from '@/types/ui.types'

interface Emits {
  (e: 'update:modeFilter', value: Mode | FilterType.ALL): void
  (e: 'update:sortBy', value: SortBy): void
  (e: 'update:sortOrder', value: SortOrder): void
  (e: 'clear'): void
}

const emit = defineEmits<Emits>()

const modeFilter = ref<Mode | FilterType.ALL>(FilterType.ALL)
const sortBy = ref<SortBy>(SortBy.DATE)
const sortOrder = ref<SortOrder>(SortOrder.DESC)

const updateModeFilter = (mode: Mode | FilterType.ALL) => {
  modeFilter.value = mode
  emit('update:modeFilter', mode)
}

const updateSortBy = (sort: SortBy) => {
  sortBy.value = sort
  emit('update:sortBy', sort)
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC
  emit('update:sortOrder', sortOrder.value)
}

const hasActiveFilters = computed(() => {
  return modeFilter.value !== FilterType.ALL || sortBy.value !== SortBy.DATE || sortOrder.value !== SortOrder.DESC
})

const clearFilters = () => {
  modeFilter.value = FilterType.ALL
  sortBy.value = SortBy.DATE
  sortOrder.value = SortOrder.DESC
  emit('update:modeFilter', FilterType.ALL)
  emit('update:sortBy', SortBy.DATE)
  emit('update:sortOrder', SortOrder.DESC)
  emit('clear')
}

const modeOptions: Array<{ value: Mode | FilterType.ALL; label: string; color?: string }> = [
  { value: FilterType.ALL, label: 'All' },
  { value: Mode.RANKED, label: 'Ranked', color: 'bg-purple-500' },
  { value: Mode.PRACTICE, label: 'Practice', color: 'bg-amber-500' },
]

const sortOptions = [
  { value: SortBy.DATE, label: 'Date', tooltip: null },
  { value: SortBy.ACCURACY, label: 'Accuracy', tooltip: null },
  { value: SortBy.APM, label: 'APM', tooltip: 'Additions Per Minute' },
]
</script>

<template>
  <div class="rounded-xl border border-border/40 bg-card p-4">
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <SlidersHorizontal :size="16" class="text-muted-foreground" />
          <span class="text-sm font-medium">Filters</span>
          <Badge v-if="hasActiveFilters" variant="secondary" class="text-2xs h-5">
            Active
          </Badge>
        </div>
        <Button
          v-if="hasActiveFilters"
          variant="ghost"
          size="sm"
          @click="clearFilters"
          class="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X :size="14" />
          <span class="text-xs">Reset</span>
        </Button>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-xs text-muted-foreground shrink-0">Mode:</span>
          <div class="flex gap-1">
            <Button
              v-for="option in modeOptions"
              :key="option.value"
              variant="ghost"
              size="sm"
              :class="[
                'h-7 px-2.5 text-xs',
                modeFilter === option.value
                  ? 'bg-primary/10 text-primary hover:bg-primary/15'
                  : 'text-muted-foreground hover:text-foreground'
              ]"
              @click="updateModeFilter(option.value)"
            >
              <div v-if="option.color" :class="['w-1.5 h-1.5 rounded-full mr-1.5', option.color]" />
              {{ option.label }}
            </Button>
          </div>
        </div>

        <Separator orientation="vertical" class="h-5 hidden sm:block" />

        <div class="flex items-center gap-2">
          <span class="text-xs text-muted-foreground shrink-0">Sort:</span>
          <div class="flex gap-1">
            <TooltipProvider v-for="option in sortOptions" :key="option.value">
              <Tooltip :disabled="!option.tooltip">
                <TooltipTrigger as-child>
                  <Button
                    variant="ghost"
                    size="sm"
                    :class="[
                      'h-7 px-2.5 text-xs',
                      sortBy === option.value
                        ? 'bg-primary/10 text-primary hover:bg-primary/15'
                        : 'text-muted-foreground hover:text-foreground'
                    ]"
                    @click="updateSortBy(option.value)"
                  >
                    {{ option.label }}
                  </Button>
                </TooltipTrigger>
                <TooltipContent v-if="option.tooltip">
                  <p>{{ option.tooltip }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Separator orientation="vertical" class="h-5 hidden sm:block" />

        <Button
          variant="ghost"
          size="sm"
          class="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          @click="toggleSortOrder"
        >
          <ArrowDownAZ v-if="sortOrder === SortOrder.DESC" :size="14" />
          <ArrowUpAZ v-else :size="14" />
          <span>{{ sortOrder === SortOrder.DESC ? 'Desc' : 'Asc' }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>
