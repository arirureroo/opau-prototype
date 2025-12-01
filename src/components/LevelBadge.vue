<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { computed } from 'vue'
import { BadgeSize } from '@/types/ui.types'
import { PerformanceLevel, EnduranceLevel } from '@/types/pauli.types'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive'
type Level = `${PerformanceLevel}` | `${EnduranceLevel}`

interface Props {
  level: Level
  size?: BadgeSize
}

const props = withDefaults(defineProps<Props>(), {
  size: BadgeSize.SM
})

const badgeVariant = computed<BadgeVariant>(() => {
  switch (props.level) {
    case PerformanceLevel.EXCELLENT:
      return 'default'
    case PerformanceLevel.GOOD:
      return 'secondary'
    case PerformanceLevel.MODERATE:
      return 'outline'
    default:
      return 'destructive'
  }
})

const sizeClasses = computed(() => {
  return props.size === BadgeSize.SM ? 'text-2xs h-5' : 'text-xs h-6'
})
</script>

<template>
  <Badge :variant="badgeVariant" :class="sizeClasses">
    {{ level }}
  </Badge>
</template>
