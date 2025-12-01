<script setup lang="ts">
import { CheckCircle, Check, X, File } from 'lucide-vue-next'
import { computed } from 'vue'
import { StatusVariant } from '@/types/ui.types'

interface Props {
  label: string
  value: string | number
  variant?: StatusVariant
  icon?: 'check-circle' | 'check' | 'x' | 'file'
}

const props = withDefaults(defineProps<Props>(), {
  variant: StatusVariant.SUCCESS
})

const iconComponent = computed(() => {
  const iconMap = {
    'check-circle': CheckCircle,
    check: Check,
    x: X,
    file: File
  }
  return props.icon ? iconMap[props.icon] : null
})
</script>

<template>
  <div
    class="border-2 rounded-lg p-5 transition-colors"
    :data-variant="variant"
  >
    <div class="flex items-center justify-between mb-3">
      <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {{ label }}
      </p>
      <div
        class="w-9 h-9 rounded-lg flex items-center justify-center"
        :data-variant="variant"
      >
        <slot name="icon">
          <component
            :is="iconComponent"
            v-if="iconComponent"
            :size="16"
            :data-variant="variant"
          />
        </slot>
      </div>
    </div>
    <p class="text-3xl font-bold tracking-tight" :data-variant="variant">
      {{ value }}
    </p>
  </div>
</template>
