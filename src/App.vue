<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import MobileRestrictionDialog from '@/components/MobileRestrictionDialog.vue'
import { useMobileRestriction } from '@/composables/useMobileRestriction'
import { onMounted, watch } from 'vue'

const { initMobileDetection, isMobile, openDialog } = useMobileRestriction()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  initMobileDetection()
})

watch(isMobile, (mobile) => {
  if (mobile && route.name && route.name !== 'home') {
    openDialog()
    router.push('/')
  }
})
</script>

<template>
  <main vaul-drawer-wrapper>
    <MobileRestrictionDialog />
    <RouterView class="relative min-h-svh flex flex-col bg-background" />
  </main>
</template>
