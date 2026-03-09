import { shallowRef, computed, onMounted, onUnmounted } from 'vue'

export interface UseScrollOptions {
  threshold?: number
  immediate?: boolean
}

export function useScroll(options: UseScrollOptions = {}) {
  const { threshold = 0, immediate = true } = options

  const scrollY = shallowRef(0)
  const scrollX = shallowRef(0)
  const isScrolling = shallowRef(false)
  const direction = shallowRef<'up' | 'down' | null>(null)

  let lastScrollY = 0
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null

  const updateScroll = () => {
    scrollY.value = window.scrollY
    scrollX.value = window.scrollX

    // Determine scroll direction
    if (scrollY.value > lastScrollY) {
      direction.value = 'down'
    } else if (scrollY.value < lastScrollY) {
      direction.value = 'up'
    }
    lastScrollY = scrollY.value

    // Set scrolling state
    isScrolling.value = true
    if (scrollTimeout) clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      isScrolling.value = false
    }, 150)
  }

  const scrollTo = (options: ScrollToOptions) => {
    window.scrollTo(options)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToElement = (element: HTMLElement | string, offset = 0) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const isPastThreshold = computed(() => scrollY.value > threshold)

  onMounted(() => {
    if (immediate) {
      updateScroll()
    }
    window.addEventListener('scroll', updateScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateScroll)
    if (scrollTimeout) clearTimeout(scrollTimeout)
  })

  return {
    scrollY,
    scrollX,
    isScrolling,
    direction,
    isPastThreshold,
    scrollTo,
    scrollToTop,
    scrollToElement,
  }
}
