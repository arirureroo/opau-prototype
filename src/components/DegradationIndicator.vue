<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { getChangeColorClass, formatDegradation } from '@/presentation/shared/colors/statusColors'
import type { BadgeVariant } from '@/presentation/shared/badge/badgeVariants'
import type { PerformanceChange, EnduranceLevel } from '@/types/pauli.types'

interface Props {
  label: string
  degradationPercent: number
  level: EnduranceLevel
  change: PerformanceChange
  badgeVariant: BadgeVariant
}

const props = defineProps<Props>()
</script>

<template>
  <div class="rounded-lg bg-muted/30 border-border/30 p-4 border">
    <div class="flex items-center justify-between mb-4">
      <span class="text-sm font-medium">{{ label }}</span>
      <Badge :variant="badgeVariant">
        {{ level }}
      </Badge>
    </div>
    <div class="flex items-center justify-center py-2">
      <span :class="['text-3xl font-bold tabular-nums', getChangeColorClass(change)]">
        {{ formatDegradation(degradationPercent) }}
      </span>
    </div>
    <p :class="['text-xs text-center', getChangeColorClass(change)]">
      {{ change }}
    </p>
  </div>
</template>
