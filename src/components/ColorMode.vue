<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { ColorModeVariant } from '@/types/ui.types'

interface Props {
  variant?: ColorModeVariant
}

const { variant = ColorModeVariant.ICON } = defineProps<Props>()

const mode = useColorMode()
</script>

<template>
  <Button
    variant="ghost"
    :size="variant === ColorModeVariant.ICON ? 'icon' : undefined"
    @click="mode = mode === 'light' ? 'dark' : 'light'"
    :class="variant === ColorModeVariant.ICON ? 'cursor-pointer' : 'cursor-pointer flex px-4! justify-start w-fit text-muted-foreground'"
  >
    <p v-if="variant === ColorModeVariant.TEXT">Switch Color to</p>
    <Icon
      v-if="mode === 'light'"
      icon="radix-icons:moon"
      class="size-icon-sm rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Icon
      v-if="mode === 'dark'"
      icon="radix-icons:sun"
      class="size-icon-sm rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">{{ variant === ColorModeVariant.ICON ? 'Color mode' : 'Toggle theme' }}</span>
  </Button>
</template>
