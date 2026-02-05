<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ColorMode from './ColorMode.vue'
import { useColorMode } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger } from './ui/drawer'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { ColorModeVariant } from '@/types/ui.types'
import { useMobileRestriction } from '@/composables/useMobileRestriction'
import { ref, onMounted, onUnmounted } from 'vue'

const mode = useColorMode()
const isDrawerOpen = ref(false)

const { onNavigationBlocked } = useMobileRestriction()

let cleanup: (() => void) | undefined

onMounted(() => {
  cleanup = onNavigationBlocked(() => {
    isDrawerOpen.value = false
  })
})

onUnmounted(() => {
  cleanup?.()
})
</script>
<template>
  <header
    class="absolute top-0 flex h-14 w-full shrink-0 items-center justify-between gap-2 border-b px-8 py-2"
  >
    <RouterLink
      to="/"
      class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
    >
      <img v-if="mode === 'light'" src="../assets/opau-96.png" class="size-6" />
      <img v-else src="../assets/opau-white-96.png" class="size-6" />
      <h2 class="text-xl font-bold leading-tight">oPau</h2>
    </RouterLink>

    <NavigationMenu class="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <RouterLink to="/" :class="navigationMenuTriggerStyle()">Home</RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <RouterLink to="/pretest" :class="navigationMenuTriggerStyle()">Take a Test</RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <RouterLink to="/history" :class="navigationMenuTriggerStyle()">History</RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <RouterLink to="/performance" :class="navigationMenuTriggerStyle()">Performance</RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ColorMode />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <Drawer v-model:open="isDrawerOpen">
      <DrawerTrigger class="flex md:hidden">
        <Icon icon="tabler:menu" class="size-icon-sm" />
      </DrawerTrigger>
      <DrawerContent class="h-fit p-6">
        <NavigationMenu>
          <NavigationMenuList class="flex flex-col items-start">
            <NavigationMenuItem>
              <RouterLink to="/" :class="navigationMenuTriggerStyle()"> Home </RouterLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <RouterLink to="/pretest" :class="navigationMenuTriggerStyle()">
                Take a Test
              </RouterLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <RouterLink to="/history" :class="navigationMenuTriggerStyle()"> History </RouterLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <RouterLink to="/performance" :class="navigationMenuTriggerStyle()"> Performance </RouterLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <DrawerFooter class="px-0">
          <ColorMode :variant="ColorModeVariant.TEXT" />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </header>
</template>
