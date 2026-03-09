import { shallowRef, onUnmounted } from 'vue'

export interface UseIntersectionObserverOptions {
  /**
   * Root element for intersection
   */
  root?: Element | null
  /**
   * Root margin
   */
  rootMargin?: string
  /**
   * Threshold(s) for intersection
   */
  threshold?: number | number[]
  /**
   * Whether to disconnect after first intersection
   */
  once?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const { root = null, rootMargin = '0px', threshold = 0, once = false } = options

  const target = shallowRef<Element | null>(null)
  const isIntersecting = shallowRef(false)
  const entry = shallowRef<IntersectionObserverEntry | null>(null)

  let observer: IntersectionObserver | null = null

  const observe = (element: Element) => {
    target.value = element

    if (observer) {
      observer.disconnect()
    }

    observer = new IntersectionObserver(
      (entries) => {
        const [currentEntry] = entries
        entry.value = currentEntry
        isIntersecting.value = currentEntry.isIntersecting

        if (once && currentEntry.isIntersecting) {
          disconnect()
        }
      },
      { root, rootMargin, threshold }
    )

    observer.observe(element)
  }

  const unobserve = () => {
    if (observer && target.value) {
      observer.unobserve(target.value)
    }
  }

  const disconnect = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    target,
    isIntersecting,
    entry,
    observe,
    unobserve,
    disconnect,
  }
}
