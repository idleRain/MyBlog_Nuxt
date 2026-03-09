import { shallowRef, computed, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export interface UseThemeOptions {
  /**
   * Default theme
   */
  defaultTheme?: Theme
  /**
   * Storage key for persisting theme preference
   */
  storageKey?: string
}

export function useTheme(options: UseThemeOptions = {}) {
  const { defaultTheme = 'system', storageKey = 'theme' } = options

  // Get initial theme from localStorage or default
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return defaultTheme
    const stored = localStorage.getItem(storageKey) as Theme | null
    return stored || defaultTheme
  }

  const preference = shallowRef<Theme>(getInitialTheme())

  // Get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Computed actual theme
  const theme = computed(() => {
    if (preference.value === 'system') {
      return getSystemTheme()
    }
    return preference.value
  })

  const isDark = computed(() => theme.value === 'dark')
  const isLight = computed(() => theme.value === 'light')
  const isSystem = computed(() => preference.value === 'system')

  // Apply theme to document
  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (typeof document === 'undefined') return

    const html = document.documentElement
    html.classList.remove('light', 'dark')
    html.classList.add(newTheme)

    // Update color-scheme
    html.style.colorScheme = newTheme
  }

  // Set theme preference
  const setTheme = (newTheme: Theme) => {
    preference.value = newTheme
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, newTheme)
    }
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  // Watch for preference changes
  watch(preference, (newPreference) => {
    applyTheme(newPreference === 'system' ? getSystemTheme() : newPreference)
  }, { immediate: true })

  // Listen for system theme changes
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (preference.value === 'system') {
        applyTheme(getSystemTheme())
      }
    }

    mediaQuery.addEventListener('change', handleChange)
  }

  return {
    preference,
    theme,
    isDark,
    isLight,
    isSystem,
    setTheme,
    toggleTheme,
  }
}
