import { ref, readonly } from 'vue'

// Singleton state
const isMobile = ref(false)
const showRestrictionDialog = ref(false)
const onNavigationBlockedCallbacks: Set<() => void> = new Set()

export const useMobileRestriction = () => {
  const initMobileDetection = () => {
    // Check if window is defined (SSR safety, though likely SPA)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(max-width: 767.9px)') // < 768px
      isMobile.value = mediaQuery.matches

      mediaQuery.addEventListener('change', (e) => {
        isMobile.value = e.matches
      })
    }
  }

  const openDialog = () => {
    showRestrictionDialog.value = true
    // Notify all listeners that navigation was blocked
    onNavigationBlockedCallbacks.forEach((callback) => callback())
  }

  const closeDialog = () => {
    showRestrictionDialog.value = false
  }

  const onNavigationBlocked = (callback: () => void) => {
    onNavigationBlockedCallbacks.add(callback)
    // Return cleanup function
    return () => {
      onNavigationBlockedCallbacks.delete(callback)
    }
  }

  return {
    isMobile: readonly(isMobile),
    showRestrictionDialog,
    initMobileDetection,
    openDialog,
    closeDialog,
    onNavigationBlocked,
  }
}
