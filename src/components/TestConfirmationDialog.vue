<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import TestTutorial from '@/components/TestTutorial.vue'
import { Mode } from '@/types/test.types'
import { getModeLabel } from '@/presentation/styles/modeStyles'
import { dialogSizes } from '@/presentation/styles/sizeConstants'
import { computed } from 'vue'

interface Props {
  mode: Mode
  duration: string
}

interface Emits {
  (e: 'confirm'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

const modeLabel = computed(() => getModeLabel(props.mode))
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot name="trigger">
        <Button class="rounded-full w-fit">Take the test</Button>
      </slot>
    </DialogTrigger>
    <DialogContent :class="[dialogSizes.md, 'gap-4 max-h-vh-90 overflow-y-auto']">
      <DialogHeader class="space-y-2">
        <DialogTitle class="text-lg">Confirm Test Start</DialogTitle>
      </DialogHeader>

      <TestTutorial />

      <div class="space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Mode:</span>
          <span
            class="px-3 py-0.5 rounded-full text-sm font-semibold"
            :data-mode="mode"
          >
            {{ modeLabel }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Duration:</span>
          <span class="text-sm text-muted-foreground">
            {{ duration }}
          </span>
        </div>
      </div>
      <DialogFooter class="gap-2">
        <DialogClose as-child>
          <Button type="button" variant="outline" size="sm" class="rounded-full flex-1">
            Cancel
          </Button>
        </DialogClose>
        <DialogClose as-child>
          <Button type="button" size="sm" class="rounded-full flex-1" @click="emit('confirm')">
            Start Test
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
