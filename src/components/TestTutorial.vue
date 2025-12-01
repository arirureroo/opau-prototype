<script setup lang="ts">
import { getGridInputClasses } from '@/lib/inputStyles'

const INPUT_CLASSES = getGridInputClasses('ml-4')
</script>

<template>
  <div class="space-y-3 border rounded-lg p-4 bg-muted/30">
    <h3 class="font-semibold text-sm">How to Perform This Test</h3>
    <p class="text-sm text-muted-foreground">
      Add two numbers and write <strong>only the unit digit</strong>.
    </p>

    <div class="flex justify-center py-2">
      <div class="flex flex-col justify-between">
        <p class="w-3 text-sm font-medium">9</p>
        <input
          type="number"
          :class="INPUT_CLASSES"
          value="0"
          disabled
          style="-moz-appearance: textfield !important"
        />
        <p class="w-3 text-sm font-medium">1</p>
      </div>
    </div>

    <div class="text-xs text-muted-foreground space-y-1 pt-2 border-t">
      <p>• Start top-left, move down. Fill columns left to right.</p>
      <p>• Use arrow keys (↑ ↓ ← →) to navigate faster.</p>
    </div>
  </div>
</template>
