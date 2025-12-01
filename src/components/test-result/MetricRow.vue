<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  valueClass?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex justify-between items-baseline">
    <span class="text-sm text-muted-foreground">{{ label }}</span>
    <span class="text-lg font-semibold" :class="valueClass">{{ value }}</span>
  </div>
</template>
