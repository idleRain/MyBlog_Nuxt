<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">文章</h1>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章..."
            class="h-10 w-[250px] rounded-md border border-input bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          v-model="selectedCategory"
          class="h-10 rounded-md border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">全部分类</option>
          <option v-for="category in categories" :key="category.id" :value="category.slug">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ArticleCard
        v-for="article in filteredArticles"
        :key="article.id"
        :article="article"
      />
    </div>

    <div v-if="filteredArticles.length === 0" class="flex flex-col items-center justify-center py-12">
      <Icon name="lucide:file-x" class="h-12 w-12 text-muted-foreground" />
      <p class="mt-4 text-lg text-muted-foreground">没有找到相关文章</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          :disabled="currentPage === 1"
          class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          @click="currentPage--"
        >
          上一页
        </button>
        <span class="text-sm text-muted-foreground">
          第 {{ currentPage }} / {{ totalPages }} 页
        </span>
        <button
          :disabled="currentPage === totalPages"
          class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          @click="currentPage++"
        >
          下一页
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '文章 - My Blog',
})

const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const totalPages = ref(3)

const categories = ref([
  { id: 1, name: 'Vue.js', slug: 'vuejs' },
  { id: 2, name: 'Nuxt', slug: 'nuxt' },
  { id: 3, name: 'TypeScript', slug: 'typescript' },
  { id: 4, name: 'Node.js', slug: 'nodejs' },
  { id: 5, name: '数据库', slug: 'database' },
])

const articles = ref([
  {
    id: 1,
    title: 'Vue 3 组合式 API 最佳实践',
    summary: '深入探讨 Vue 3 组合式 API 的设计理念和使用技巧，帮助你写出更优雅的代码。',
    cover: 'https://picsum.photos/seed/vue3/400/200',
    createdAt: '2024-01-15',
    category: 'Vue.js',
    tags: ['Vue3', 'TypeScript'],
  },
  {
    id: 2,
    title: 'Nuxt 3 全栈开发指南',
    summary: '从零开始学习 Nuxt 3，构建现代化的全栈 Web 应用。',
    cover: 'https://picsum.photos/seed/nuxt3/400/200',
    createdAt: '2024-01-10',
    category: 'Nuxt',
    tags: ['Nuxt3', 'SSR'],
  },
  {
    id: 3,
    title: 'TypeScript 高级类型技巧',
    summary: '掌握 TypeScript 的高级类型系统，提升代码的类型安全性。',
    cover: 'https://picsum.photos/seed/typescript/400/200',
    createdAt: '2024-01-05',
    category: 'TypeScript',
    tags: ['TypeScript', '类型系统'],
  },
  {
    id: 4,
    title: '使用 Pinia 进行状态管理',
    summary: 'Pinia 是 Vue 3 的官方推荐状态管理库，本文介绍其核心概念和最佳实践。',
    cover: 'https://picsum.photos/seed/pinia/400/200',
    createdAt: '2024-01-20',
    category: 'Vue.js',
    tags: ['Pinia', '状态管理'],
  },
  {
    id: 5,
    title: 'MySQL 性能优化实战',
    summary: '从索引设计到查询优化，全面提升 MySQL 数据库性能。',
    cover: 'https://picsum.photos/seed/mysql/400/200',
    createdAt: '2024-01-18',
    category: '数据库',
    tags: ['MySQL', '性能优化'],
  },
  {
    id: 6,
    title: 'Node.js 微服务架构设计',
    summary: '使用 Node.js 构建可扩展的微服务架构，涵盖服务拆分、通信机制等核心概念。',
    cover: 'https://picsum.photos/seed/nodejs/400/200',
    createdAt: '2024-01-12',
    category: 'Node.js',
    tags: ['Node.js', '微服务'],
  },
])

const filteredArticles = computed(() => {
  let result = articles.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    const category = categories.value.find((c) => c.slug === selectedCategory.value)
    if (category) {
      result = result.filter((article) => article.category === category.name)
    }
  }

  return result
})
</script>
