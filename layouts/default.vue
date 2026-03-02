<template>
  <div class="min-h-screen bg-background">
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-16 items-center justify-between">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-xl font-bold">My Blog</span>
        </NuxtLink>
        <nav class="flex items-center space-x-6">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            active-class="text-foreground"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="flex items-center space-x-4">
          <button
            class="rounded-md p-2 hover:bg-accent"
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
          &copy; {{ new Date().getFullYear() }} My Blog. All rights reserved.
        </p>
        <div class="flex items-center space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground">
            <Icon name="lucide:github" class="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const navItems = [
  { path: '/', label: '首页' },
  { path: '/articles', label: '文章' },
  { path: '/about', label: '关于' },
]

const isDark = computed(() => colorMode.value === 'dark')

const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>
