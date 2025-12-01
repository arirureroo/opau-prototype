<script setup lang="ts">
interface Props {
  strokeColor: string
  strokeOpacity: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="hidden lg:flex mt-4 pt-3 flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs border-t"
  >
    <div class="flex items-center gap-2">
      <div
        class="w-8 h-0.5 rounded-full"
        :style="{ backgroundColor: strokeColor, opacity: strokeOpacity }"
      ></div>
      <span class="text-muted-foreground font-medium">Accuracy Trend</span>
    </div>
    <div class="flex items-center gap-2">
      <div
        class="w-3 h-3 rounded-full"
        :style="{ backgroundColor: strokeColor, opacity: strokeOpacity }"
      ></div>
      <span class="text-sm text-muted-foreground">Hover for details</span>
    </div>
  </div>
</template>
