<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { computed } from 'vue'
import { Mode } from '@/types/test.types'
import { getModeLabel } from '@/presentation/styles/modeStyles'
import { BadgeSize } from '@/types/ui.types'

interface Props {
  mode: Mode
  thickBorder?: boolean
  size?: BadgeSize
}

const props = withDefaults(defineProps<Props>(), {
  thickBorder: false,
  size: BadgeSize.SM
})

const sizeClasses = computed(() => {
  return props.size === BadgeSize.SM ? 'text-2xs h-5' : 'text-xs h-6'
})

const label = computed(() => getModeLabel(props.mode))
</script>

<template>
  <Badge
    variant="outline"
    :class="sizeClasses"
    :data-mode="mode"
    :data-thick-border="thickBorder"
  >
    {{ label }}
  </Badge>
</template>
