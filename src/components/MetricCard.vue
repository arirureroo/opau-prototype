<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import type { BadgeVariant } from '@/presentation/shared/badge/badgeVariants'

interface Props {
  title: string
  subtitle?: string
  badgeLabel?: string
  badgeVariant?: BadgeVariant
}

const props = defineProps<Props>()
</script>

<template>
  <div :class="['rounded-xl border-border/40 bg-card border']">
    <div :class="['border-border/40 p-5 border-b']">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <p v-if="subtitle" :class="['text-muted-foreground text-sm mt-0.5']">{{ subtitle }}</p>
        </div>
        <Badge v-if="badgeLabel" :variant="badgeVariant" class="shrink-0">
          {{ badgeLabel }}
        </Badge>
      </div>
    </div>

    <div class="p-5 space-y-6">
      <slot />
    </div>
  </div>
</template>
