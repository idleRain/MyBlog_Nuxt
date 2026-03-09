import { shallowRef, computed, onMounted, onUnmounted } from 'vue'

export interface UseReadingProgressOptions {
  /**
   * Offset from top in pixels
   */
  offset?: number
}

export function useReadingProgress(options: UseReadingProgressOptions = {}) {
  const { offset = 0 } = options

  const progress = shallowRef(0)
  const docHeight = shallowRef(0)
  const winHeight = shallowRef(0)

  const updateProgress = () => {
    const scrollTop = window.scrollY
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    const currentProgress = totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0

    progress.value = Math.min(100, Math.max(0, currentProgress))
    docHeight.value = document.documentElement.scrollHeight
    winHeight.value = window.innerHeight
  }

  const remainingProgress = computed(() => 100 - progress.value)
  const isComplete = computed(() => progress.value >= 100)

  onMounted(() => {
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateProgress)
    window.removeEventListener('resize', updateProgress)
  })

  return {
    progress,
    remainingProgress,
    isComplete,
    docHeight,
    winHeight,
  }
}
