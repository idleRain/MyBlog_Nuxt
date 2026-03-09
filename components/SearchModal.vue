<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const isOpen = ref(false)
const searchQuery = ref('')
const searchResults = ref<{
  articles: Array<{ id: number; title: string; summary: string }>
  tags: Array<{ name: string; slug: string }>
  categories: Array<{ name: string; slug: string }>
}>({
  articles: [],
  tags: [],
  categories: [],
})

const isLoading = ref(false)

// Debounced search
let searchTimeout: NodeJS.Timeout | null = null

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = { articles: [], tags: [], categories: [] }
    return
  }

  isLoading.value = true

  try {
    // TODO: Replace with actual API call
    // Simulating search results
    await new Promise(resolve => setTimeout(resolve, 300))
    
    searchResults.value = {
      articles: [
        { id: 1, title: 'Vue 3 组合式 API 最佳实践', summary: '深入探讨 Vue 3 组合式 API...' },
        { id: 2, title: 'Nuxt 3 全栈开发指南', summary: '从零开始学习 Nuxt 3...' },
      ],
      tags: [
        { name: 'Vue3', slug: 'vue3' },
        { name: 'TypeScript', slug: 'typescript' },
      ],
      categories: [
        { name: 'Vue.js', slug: 'vuejs' },
        { name: 'Nuxt', slug: 'nuxt' },
      ],
    }
  } finally {
    isLoading.value = false
  }
}

watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(handleSearch, 300)
})

const openSearch = () => {
  isOpen.value = true
  nextTick(() => {
    const input = document.querySelector('#search-input') as HTMLInputElement
    input?.focus()
  })
}

const closeSearch = () => {
  isOpen.value = false
  searchQuery.value = ''
  searchResults.value = { articles: [], tags: [], categories: [] }
}

// Keyboard shortcut
onMounted(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      openSearch()
    }
    if (e.key === 'Escape' && isOpen.value) {
      closeSearch()
    }
  }

  window.addEventListener('keydown', handleKeyDown)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
})

defineExpose({ openSearch })
</script>

<template>
  <!-- Search Button -->
  <button
    class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent md:w-64"
    @click="openSearch"
  >
    <span class="flex items-center space-x-2">
      <Icon name="lucide:search" class="h-4 w-4" />
      <span>{{ $t('search.placeholder') }}</span>
    </span>
    <kbd class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
      <span class="text-xs">⌘</span>K
    </kbd>
  </button>

  <!-- Search Modal -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[300] bg-black/50"
        @click="closeSearch"
      />
    </Transition>

    <Transition
      enter-active-class="transition-all duration-200"
      leave-active-class="transition-all duration-200"
      enter-from-class="opacity-0 scale-95"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed left-1/2 top-[20%] z-[301] w-full max-w-2xl -translate-x-1/2 rounded-lg border bg-background p-4 shadow-xl"
        @click.stop
      >
        <!-- Search Input -->
        <div class="relative">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            id="search-input"
            v-model="searchQuery"
            type="text"
            :placeholder="$t('search.placeholder')"
            class="h-12 w-full rounded-md border border-input bg-background pl-10 pr-4 text-base outline-none focus:ring-2 focus:ring-ring"
          />
          <Icon
            v-if="isLoading"
            name="lucide:loader-2"
            class="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground"
          />
        </div>

        <!-- Search Results -->
        <div v-if="searchQuery.trim()" class="mt-4 max-h-[60vh] overflow-y-auto">
          <!-- Articles -->
          <div v-if="searchResults.articles.length > 0" class="mb-4">
            <h3 class="mb-2 text-sm font-semibold text-muted-foreground">
              {{ $t('search.articles') }}
            </h3>
            <div class="space-y-2">
              <NuxtLink
                v-for="article in searchResults.articles"
                :key="article.id"
                :to="localePath(`/articles/${article.id}`)"
                class="block rounded-lg p-3 transition-colors hover:bg-accent"
                @click="closeSearch"
              >
                <p class="font-medium">{{ article.title }}</p>
                <p class="mt-1 text-sm text-muted-foreground line-clamp-1">{{ article.summary }}</p>
              </NuxtLink>
            </div>
          </div>

          <!-- Categories -->
          <div v-if="searchResults.categories.length > 0" class="mb-4">
            <h3 class="mb-2 text-sm font-semibold text-muted-foreground">
              {{ $t('search.categories') }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="category in searchResults.categories"
                :key="category.slug"
                :to="localePath(`/categories/${category.slug}`)"
                class="rounded-full bg-secondary px-3 py-1 text-sm transition-colors hover:bg-secondary/80"
                @click="closeSearch"
              >
                {{ category.name }}
              </NuxtLink>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="searchResults.tags.length > 0">
            <h3 class="mb-2 text-sm font-semibold text-muted-foreground">
              {{ $t('search.tags') }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="tag in searchResults.tags"
                :key="tag.slug"
                :to="localePath(`/tags/${tag.slug}`)"
                class="rounded-full bg-secondary px-3 py-1 text-sm transition-colors hover:bg-secondary/80"
                @click="closeSearch"
              >
                {{ tag.name }}
              </NuxtLink>
            </div>
          </div>

          <!-- No Results -->
          <div
            v-if="!isLoading && searchResults.articles.length === 0 && searchResults.tags.length === 0 && searchResults.categories.length === 0"
            class="py-8 text-center text-muted-foreground"
          >
            {{ $t('search.noResults', { keyword: searchQuery }) }}
          </div>
        </div>

        <!-- Hint -->
        <div v-else class="mt-4 py-8 text-center text-sm text-muted-foreground">
          {{ $t('search.hint') }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
