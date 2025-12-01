<script setup lang="ts">
interface Props {
  label: string
  color: string
  bgColor: string
}

defineProps<Props>()
</script>

<template>
  <div class="px-3 py-1 rounded-full text-xs font-semibold" :class="[color, bgColor]">
    {{ label }}
  </div>
</template>
