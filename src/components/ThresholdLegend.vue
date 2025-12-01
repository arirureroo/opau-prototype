<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ThresholdItem {
  label: string
  description: string
  color: string
}

interface Props {
  thresholds: ThresholdItem[]
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Thresholds:',
})
</script>

<template>
  <TooltipProvider>
    <div class="flex items-center gap-4 pt-2">
      <span :class="['text-muted-foreground text-xs']">{{ label }}</span>
      <div class="flex items-center gap-3">
        <Tooltip v-for="threshold in thresholds" :key="threshold.label">
          <TooltipTrigger as-child>
            <div class="flex items-center gap-1.5 cursor-default">
              <div :class="['w-2 h-2 rounded-full', threshold.color]" />
              <span :class="['text-muted-foreground text-xs']">{{ threshold.label }}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ threshold.description }}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  </TooltipProvider>
</template>
