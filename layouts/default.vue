<template>
  <div class="min-h-screen bg-background">
    <ReadingProgress />
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-16 items-center justify-between">
        <NuxtLink :to="localePath('/')" class="flex items-center space-x-2">
          <span class="text-xl font-bold">{{ $t('site.title') }}</span>
        </NuxtLink>
        <nav class="flex items-center space-x-6">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="localePath(item.path)"
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            active-class="text-foreground"
          >
            {{ $t(item.label) }}
          </NuxtLink>
        </nav>
        <div class="flex items-center space-x-2">
          <LanguageSwitcher />
          <button
            class="rounded-md p-2 hover:bg-accent"
            :title="isDark ? $t('theme.light') : $t('theme.dark')"
            @click="toggleTheme"
          >
            <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
    <main class="container py-6">
      <slot />
    </main>
    <footer class="border-t py-6">
      <div class="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p class="text-sm text-muted-foreground">
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
        <div class="flex items-center space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground">
            <Icon name="lucide:github" class="h-5 w-5" />
          </a>
          <a :href="localePath('/rss.xml')" target="_blank" class="text-muted-foreground hover:text-foreground" title="RSS">
            <Icon name="lucide:rss" class="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const colorMode = useColorMode()

const navItems = [
  { path: '/', label: 'nav.home' },
  { path: '/articles', label: 'nav.articles' },
  { path: '/archives', label: 'nav.articles' },
  { path: '/about', label: 'nav.about' },
]

const isDark = computed(() => colorMode.value === 'dark')

const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

useHead({
  title: t('site.title'),
  meta: [
    { name: 'description', content: t('site.description') },
  ],
})
</script>
