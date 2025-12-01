<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import ColorMode from './ColorMode.vue'
import { useColorMode } from '@vueuse/core'
import { Mode } from '@/types/test.types'
import { getModeLabel } from '@/presentation/styles/modeStyles'

interface Props {
  remainingTime?: string
  mode?: Mode
}

const props = withDefaults(defineProps<Props>(), {
  remainingTime: '0:00'
})

const colorMode = useColorMode()

const logoSrc = computed(() =>
  colorMode.value === 'light'
    ? new URL('../assets/opau-96.png', import.meta.url).href
    : new URL('../assets/opau-white-96.png', import.meta.url).href
)

const modeLabel = computed(() => (props.mode ? getModeLabel(props.mode) : ''))

const showTimer = computed(() => props.mode === Mode.PRACTICE)
</script>
<template>
  <header
    class="absolute top-0 flex h-14 w-full shrink-0 items-center justify-between gap-4 border-b px-8 py-2"
  >
    <RouterLink
      to="/"
      class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
    >
      <img :src="logoSrc" alt="oPau logo" class="size-6" />
      <h2 class="text-xl font-bold leading-tight">oPau</h2>
    </RouterLink>

    <div class="flex items-center gap-4 flex-1 justify-center">
      <span class="px-3 py-1 rounded-full text-sm font-semibold" :data-mode="props.mode">
        {{ modeLabel }}
      </span>
      <span v-if="showTimer" class="text-2xl font-bold tabular-nums">
        {{ remainingTime }}
      </span>
    </div>

    <div class="flex">
      <ColorMode />
    </div>
  </header>
</template>
