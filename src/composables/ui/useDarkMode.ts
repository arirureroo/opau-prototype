import { ref, onMounted, onUnmounted } from 'vue'

export const useDarkMode = () => {
  const isDark = ref(false)

  const updateDarkMode = () => {
    if (typeof document !== 'undefined') {
      isDark.value = document.documentElement.classList.contains('dark')
    }
  }

  onMounted(() => {
    updateDarkMode()

    const observer = new MutationObserver(updateDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    onUnmounted(() => {
      observer.disconnect()
    })
  })

  return { isDark }
}
