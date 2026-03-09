<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const colorMode = useColorMode()
const isOpen = ref(false)

const navItems = [
  { path: '/', label: 'nav.home', icon: 'lucide:home' },
  { path: '/articles', label: 'nav.articles', icon: 'lucide:file-text' },
  { path: '/archives', label: 'nav.articles', icon: 'lucide:archive' },
  { path: '/about', label: 'nav.about', icon: 'lucide:user' },
]

const isDark = computed(() => colorMode.value === 'dark')

const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const closeMenu = () => {
  isOpen.value = false
}

// Lock body scroll when menu is open
watch(isOpen, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <!-- Mobile Menu Button -->
  <button
    class="flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent md:hidden"
    aria-label="Toggle menu"
    @click="isOpen = !isOpen"
  >
    <Icon :name="isOpen ? 'lucide:x' : 'lucide:menu'" class="h-5 w-5" />
  </button>

  <!-- Mobile Menu Overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[200] bg-black/50 md:hidden"
        @click="closeMenu"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300"
      leave-active-class="transition-transform duration-300"
      enter-from-class="translate-x-full"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isOpen"
        class="fixed right-0 top-0 z-[201] h-full w-72 bg-background shadow-xl md:hidden"
      >
        <div class="flex h-full flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between border-b p-4">
            <span class="text-lg font-bold">{{ $t('site.title') }}</span>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
              @click="closeMenu"
            >
              <Icon name="lucide:x" class="h-5 w-5" />
            </button>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 overflow-y-auto p-4">
            <ul class="space-y-1">
              <li v-for="item in navItems" :key="item.path">
                <NuxtLink
                  :to="localePath(item.path)"
                  class="flex items-center space-x-3 rounded-lg px-3 py-3 text-base transition-colors hover:bg-accent"
                  active-class="bg-accent text-primary"
                  @click="closeMenu"
                >
                  <Icon :name="item.icon" class="h-5 w-5" />
                  <span>{{ $t(item.label) }}</span>
                </NuxtLink>
              </li>
            </ul>
          </nav>

          <!-- Footer -->
          <div class="border-t p-4">
            <div class="flex items-center justify-between">
              <LanguageSwitcher />
              <button
                class="flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
                :title="isDark ? $t('theme.light') : $t('theme.dark')"
                @click="toggleTheme"
              >
                <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
