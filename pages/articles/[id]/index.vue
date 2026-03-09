<template>
  <div class="min-h-screen bg-background">
    <ReadingProgress />
    
    <!-- Article Header -->
    <article class="container py-8">
      <!-- Breadcrumb -->
      <nav class="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
        <NuxtLink :to="localePath('/')" class="hover:text-foreground">
          {{ $t('nav.home') }}
        </NuxtLink>
        <Icon name="lucide:chevron-right" class="h-4 w-4" />
        <NuxtLink :to="localePath('/articles')" class="hover:text-foreground">
          {{ $t('nav.articles') }}
        </NuxtLink>
        <Icon name="lucide:chevron-right" class="h-4 w-4" />
        <span class="text-foreground">{{ article?.title }}</span>
      </nav>

      <div class="grid gap-8 lg:grid-cols-[1fr_280px]">
        <!-- Main Content -->
        <div class="space-y-8">
          <!-- Article Header -->
          <header class="space-y-4">
            <h1 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {{ article?.title }}
            </h1>
            
            <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div class="flex items-center space-x-2">
                <img
                  :src="article?.author?.avatar || 'https://picsum.photos/seed/avatar/40/40'"
                  :alt="article?.author?.name"
                  class="h-8 w-8 rounded-full"
                />
                <span>{{ article?.author?.name }}</span>
              </div>
              <span>·</span>
              <time :datetime="article?.publishedAt">
                {{ formatDate(article?.publishedAt) }}
              </time>
              <span>·</span>
              <span>{{ $t('article.readingTime', { time: article?.readingTime || 5 }) }}</span>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="tag in article?.tags"
                :key="tag"
                :to="localePath(`/tags/${tag}`)"
                class="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium transition-colors hover:bg-secondary/80"
              >
                {{ tag }}
              </NuxtLink>
            </div>
          </header>

          <!-- Cover Image -->
          <LazyImage
            v-if="article?.cover"
            :src="article.cover"
            :alt="article.title"
            class="aspect-video w-full overflow-hidden rounded-lg"
          />

          <!-- Article Content -->
          <div
            class="prose prose-neutral dark:prose-invert max-w-none"
            v-html="article?.content"
          />

          <!-- Article Footer -->
          <footer class="border-t pt-8">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center space-x-4">
                <button
                  class="inline-flex items-center space-x-2 text-muted-foreground transition-colors hover:text-foreground"
                  @click="handleLike"
                >
                  <Icon name="lucide:heart" class="h-5 w-5" />
                  <span>{{ article?.likeCount || 0 }}</span>
                </button>
                <button
                  class="inline-flex items-center space-x-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon name="lucide:message-square" class="h-5 w-5" />
                  <span>{{ article?.commentCount || 0 }}</span>
                </button>
              </div>
              
              <!-- Share -->
              <div class="flex items-center space-x-2">
                <span class="text-sm text-muted-foreground">{{ $t('article.share') }}:</span>
                <button
                  class="rounded p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  @click="shareToTwitter"
                >
                  <Icon name="lucide:twitter" class="h-5 w-5" />
                </button>
                <button
                  class="rounded p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  @click="copyLink"
                >
                  <Icon name="lucide:link" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </footer>

          <!-- Comments Section -->
          <section class="space-y-6">
            <h2 class="text-2xl font-bold">{{ $t('comment.title') }}</h2>
            <CommentSection :article-id="articleId" />
          </section>

          <!-- Related Articles -->
          <section v-if="relatedArticles.length > 0" class="space-y-6">
            <h2 class="text-2xl font-bold">{{ $t('article.related') }}</h2>
            <div class="grid gap-6 sm:grid-cols-2">
              <ArticleCard
                v-for="related in relatedArticles"
                :key="related.id"
                :article="related"
              />
            </div>
          </section>
        </div>

        <!-- Sidebar -->
        <aside class="hidden lg:block">
          <div class="sticky top-24 space-y-6">
            <!-- Table of Contents -->
            <div class="rounded-lg border p-4">
              <TableOfContents :content="article?.content || ''" />
            </div>

            <!-- Author Info -->
            <div class="rounded-lg border p-4">
              <h3 class="mb-3 font-semibold">{{ $t('article.author') }}</h3>
              <div class="flex items-center space-x-3">
                <img
                  :src="article?.author?.avatar || 'https://picsum.photos/seed/avatar/48/48'"
                  :alt="article?.author?.name"
                  class="h-12 w-12 rounded-full"
                />
                <div>
                  <p class="font-medium">{{ article?.author?.name }}</p>
                  <p class="text-sm text-muted-foreground">{{ article?.author?.bio }}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </article>

    <BackToTop />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const config = useRuntimeConfig()

const articleId = computed(() => route.params.id as string)

// Mock article data
const article = ref({
  id: articleId.value,
  title: 'Vue 3 组合式 API 最佳实践',
  summary: '深入探讨 Vue 3 组合式 API 的设计理念和使用技巧，帮助你写出更优雅的代码。',
  content: `
    <h2 id="introduction">引言</h2>
    <p>Vue 3 的组合式 API 是一种全新的组件逻辑组织方式。它允许我们将相关的代码逻辑组织在一起，而不是分散在各个选项中。</p>
    
    <h2 id="setup-function">setup 函数</h2>
    <p>setup 函数是组合式 API 的入口点。它在组件创建之前执行，接收 props 和 context 作为参数。</p>
    
    <h3 id="setup-props">Props</h3>
    <p>Props 是响应式的，当传入的 props 发生变化时，组件会自动更新。</p>
    
    <h3 id="setup-context">Context</h3>
    <p>Context 对象包含 attrs、slots、emit 和 expose 等属性。</p>
    
    <h2 id="reactivity">响应式系统</h2>
    <p>Vue 3 提供了 ref 和 reactive 两种响应式 API。</p>
    
    <h3 id="ref">ref</h3>
    <p>ref 用于创建基本类型的响应式数据，也可以用于对象类型。</p>
    
    <h3 id="reactive">reactive</h3>
    <p>reactive 用于创建对象类型的响应式数据。</p>
    
    <h2 id="computed">计算属性</h2>
    <p>computed 函数用于创建计算属性，它会自动追踪依赖并缓存结果。</p>
    
    <h2 id="watch">侦听器</h2>
    <p>watch 和 watchEffect 用于侦听响应式数据的变化。</p>
    
    <h2 id="lifecycle">生命周期钩子</h2>
    <p>组合式 API 提供了 onMounted、onUpdated、onUnmounted 等生命周期钩子函数。</p>
    
    <h2 id="conclusion">总结</h2>
    <p>组合式 API 提供了更灵活的代码组织方式，特别适合大型项目和逻辑复用场景。</p>
  `,
  cover: 'https://picsum.photos/seed/vue3/800/400',
  publishedAt: '2024-01-15',
  readingTime: 10,
  likeCount: 128,
  commentCount: 32,
  viewCount: 1234,
  tags: ['Vue3', 'TypeScript', 'Composition API'],
  category: 'Vue.js',
  author: {
    name: '张三',
    avatar: 'https://picsum.photos/seed/author/100/100',
    bio: '前端开发工程师',
  },
})

const relatedArticles = ref([
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

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleLike = async () => {
  // TODO: Implement like functionality
  article.value.likeCount++
}

const shareToTwitter = () => {
  const url = `${config.public.siteUrl}${route.path}`
  const text = article.value.title
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    '_blank'
  )
}

const copyLink = async () => {
  const url = `${config.public.siteUrl}${route.path}`
  await navigator.clipboard.writeText(url)
  // TODO: Show toast notification
}

useHead({
  title: `${article.value.title} - ${t('site.title')}`,
  meta: [
    { name: 'description', content: article.value.summary },
    { property: 'og:title', content: article.value.title },
    { property: 'og:description', content: article.value.summary },
    { property: 'og:image', content: article.value.cover },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})
</script>
