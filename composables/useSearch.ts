import { shallowRef, computed, watch } from 'vue'

export interface UseSearchOptions<T> {
  /**
   * Items to search through
   */
  items: () => T[]
  /**
   * Keys to search in each item
   */
  searchKeys?: (keyof T)[]
  /**
   * Debounce time in milliseconds
   */
  debounce?: number
  /**
   * Minimum characters to trigger search
   */
  minChars?: number
  /**
   * Custom search function
   */
  searchFn?: (item: T, query: string) => boolean
}

export function useSearch<T>(options: UseSearchOptions<T>) {
  const {
    items,
    searchKeys,
    debounce = 300,
    minChars = 2,
    searchFn,
  } = options

  const query = shallowRef('')
  const isSearching = shallowRef(false)
  const results = shallowRef<T[]>([])

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null

  // Default search function
  const defaultSearchFn = (item: T, searchQuery: string): boolean => {
    if (!searchKeys || searchKeys.length === 0) {
      return String(item).toLowerCase().includes(searchQuery)
    }

    return searchKeys.some((key) => {
      const value = item[key]
      if (value == null) return false
      return String(value).toLowerCase().includes(searchQuery)
    })
  }

  // Perform search
  const performSearch = () => {
    const searchQuery = query.value.toLowerCase().trim()
    const currentItems = items()

    if (searchQuery.length < minChars) {
      results.value = currentItems
      isSearching.value = false
      return
    }

    const fn = searchFn || defaultSearchFn
    results.value = currentItems.filter((item) => fn(item, searchQuery))
    isSearching.value = false
  }

  // Watch query with debounce
  watch(query, () => {
    isSearching.value = true

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    debounceTimeout = setTimeout(performSearch, debounce)
  })

  // Clear search
  const clearSearch = () => {
    query.value = ''
    results.value = items()
  }

  // Computed
  const hasQuery = computed(() => query.value.trim().length > 0)
  const hasResults = computed(() => results.value.length > 0)
  const resultCount = computed(() => results.value.length)

  return {
    query,
    results,
    isSearching,
    hasQuery,
    hasResults,
    resultCount,
    clearSearch,
    performSearch,
  }
}
