<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  unit?: string
  assessmentColor?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <div class="flex items-center gap-2">
      <span class="text-xs font-medium text-muted-foreground">
        {{ label }}
      </span>
      <div
        v-if="assessmentColor"
        class="w-1.5 h-1.5 rounded-full"
        :class="assessmentColor?.replace('text-', 'bg-')"
      />
    </div>

    <div class="flex items-baseline gap-1">
      <span class="text-2xl font-semibold tabular-nums tracking-tight">
        {{ value }}
      </span>
      <span v-if="unit" class="text-xs text-muted-foreground">{{ unit }}</span>
    </div>
  </div>
</template>
