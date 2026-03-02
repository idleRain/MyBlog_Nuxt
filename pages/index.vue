<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="flex flex-col items-center justify-center space-y-4 py-12 text-center">
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        欢迎来到我的博客
      </h1>
      <p class="max-w-[700px] text-lg text-muted-foreground">
        记录技术成长，分享编程心得，探索前沿技术。在这里，我将分享我的技术旅程和学习笔记。
      </p>
      <div class="flex items-center space-x-4">
        <NuxtLink
          to="/articles"
          class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          浏览文章
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          关于我
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Articles -->
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">精选文章</h2>
        <NuxtLink to="/articles" class="text-sm text-muted-foreground hover:text-foreground">
          查看全部 →
        </NuxtLink>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard
          v-for="article in featuredArticles"
          :key="article.id"
          :article="article"
        />
      </div>
    </section>

    <!-- Categories -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold">分类</h2>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="inline-flex items-center rounded-full border px-4 py-2 text-sm transition-colors hover:bg-accent"
        >
          {{ category.name }}
          <span class="ml-2 text-muted-foreground">{{ category.count }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Recent Posts -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold">最新文章</h2>
      <div class="space-y-4">
        <ArticleListItem
          v-for="article in recentArticles"
          :key="article.id"
          :article="article"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '首页 - My Blog',
})

// Mock data for demonstration
const featuredArticles = ref([
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
])

const categories = ref([
  { id: 1, name: 'Vue.js', slug: 'vuejs', count: 12 },
  { id: 2, name: 'Nuxt', slug: 'nuxt', count: 8 },
  { id: 3, name: 'TypeScript', slug: 'typescript', count: 15 },
  { id: 4, name: 'Node.js', slug: 'nodejs', count: 10 },
  { id: 5, name: '数据库', slug: 'database', count: 6 },
  { id: 6, name: 'DevOps', slug: 'devops', count: 4 },
])

const recentArticles = ref([
  {
    id: 4,
    title: '使用 Pinia 进行状态管理',
    summary: 'Pinia 是 Vue 3 的官方推荐状态管理库，本文介绍其核心概念和最佳实践。',
    createdAt: '2024-01-20',
    category: 'Vue.js',
    readingTime: 8,
  },
  {
    id: 5,
    title: 'MySQL 性能优化实战',
    summary: '从索引设计到查询优化，全面提升 MySQL 数据库性能。',
    createdAt: '2024-01-18',
    category: '数据库',
    readingTime: 12,
  },
])
</script>
