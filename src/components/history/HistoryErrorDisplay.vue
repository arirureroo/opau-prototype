<script setup lang="ts">
import { AlertTriangle, XCircle } from 'lucide-vue-next'

defineProps<{
  loadError?: string | null
  deleteError?: string | null
  resetError?: string | null
}>()
</script>

<template>
  <div class="space-y-2">
    <div
      v-if="loadError"
      class="flex items-start gap-3 p-4 bg-destructive/5 rounded-lg"
    >
      <AlertTriangle :size="18" class="text-destructive shrink-0 mt-0.5" />
      <p class="text-sm text-destructive">{{ loadError }}</p>
    </div>

    <div
      v-if="deleteError"
      class="flex items-start gap-3 p-4 bg-destructive/5 rounded-lg"
    >
      <XCircle :size="18" class="text-destructive shrink-0 mt-0.5" />
      <p class="text-sm text-destructive">{{ deleteError }}</p>
    </div>

    <div
      v-if="resetError"
      class="flex items-start gap-3 p-4 bg-destructive/5 rounded-lg"
    >
      <XCircle :size="18" class="text-destructive shrink-0 mt-0.5" />
      <p class="text-sm text-destructive">{{ resetError }}</p>
    </div>
  </div>
</template>
